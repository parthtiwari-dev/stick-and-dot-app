import { createClient } from "./client";
import { normalizeDomain } from "./domains";
import { getCurrentProfile } from "./profile";

export type ArticleStatus = "draft" | "submitted" | "in_review" | "revision_requested" | "published" | "archived";
export type ReviewDecision = "approved" | "revision_requested";
export type SmeReviewMode = "before_publish" | "commissions_only" | "optional";

export interface ArticleRecord {
  id: string;
  author_id: string;
  commission_id: string | null;
  domain_name: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  tags: string[];
  status: ArticleStatus;
  word_count: number;
  read_time_minutes: number;
  submitted_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicProfileRecord {
  id: string;
  role: string;
  name: string | null;
  domain: string | null;
  expertise_domains: string[] | null;
  avatar_url: string | null;
  bio: string | null;
}

export interface ArticleWithAuthor extends ArticleRecord {
  author_name: string;
  author_domain: string;
}

export interface ArticleComment {
  id: string;
  article_id: string;
  user_id: string;
  body: string;
  quality_rating: number | null;
  attachment_path: string | null;
  reward_amount: number | null;
  reward_currency: string | null;
  created_at: string;
  author_name: string;
}

export const STATUS_LABELS: Record<ArticleStatus, string> = {
  draft: "Draft",
  submitted: "Pending",
  in_review: "Pending",
  revision_requested: "Revision",
  published: "Published",
  archived: "Archived",
};

const VALID_REVIEW_MODES: SmeReviewMode[] = ["before_publish", "commissions_only", "optional"];

export function getSmeReviewMode(): SmeReviewMode {
  const value = process.env.NEXT_PUBLIC_SME_REVIEW_MODE ?? "before_publish";
  return VALID_REVIEW_MODES.includes(value as SmeReviewMode) ? (value as SmeReviewMode) : "before_publish";
}

export function getSubmitStatus(commissionId?: string | null): ArticleStatus {
  const mode = getSmeReviewMode();
  if (mode === "optional") return "published";
  if (mode === "commissions_only" && !commissionId) return "published";
  return "submitted";
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "article";
}

export function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function formatReadTime(minutes: number | null | undefined) {
  return `${Math.max(1, minutes ?? 1)} min`;
}

export function formatArticleDate(date: string | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(date));
}

function firstParagraph(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 180);
}

async function getPublicProfiles(ids: string[]) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);
  if (uniqueIds.length === 0) return new Map<string, PublicProfileRecord>();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("public_profiles")
    .select("*")
    .in("id", uniqueIds);

  if (error) throw new Error(error.message);

  return new Map((data as PublicProfileRecord[] | null ?? []).map(profile => [profile.id, profile]));
}

async function withAuthors(articles: ArticleRecord[]) {
  const profiles = await getPublicProfiles(articles.map(article => article.author_id));
  return articles.map(article => {
    const profile = profiles.get(article.author_id);
    return {
      ...article,
      author_name: profile?.name ?? "Unknown Writer",
      author_domain: profile?.domain ?? article.domain_name,
    };
  });
}

export async function listPublishedArticles() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(60);

  if (error) throw new Error(error.message);
  return withAuthors((data ?? []) as ArticleRecord[]);
}

export async function listMyArticles() {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("author_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return withAuthors((data ?? []) as ArticleRecord[]);
}

export async function listReviewQueueArticles() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .in("status", ["submitted", "in_review", "revision_requested", "published"])
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .limit(80);

  if (error) throw new Error(error.message);
  return withAuthors((data ?? []) as ArticleRecord[]);
}

async function getById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data as ArticleRecord | null;
}

async function getBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return data as ArticleRecord | null;
}

export async function getArticle(identifier: string) {
  const bySlug = await getBySlug(identifier);
  const article = bySlug ?? (/^[0-9a-f-]{36}$/i.test(identifier) ? await getById(identifier) : null);
  if (!article) return null;
  const [enriched] = await withAuthors([article]);
  return enriched;
}

export async function saveArticle(input: {
  title: string;
  body: string;
  tags: string[];
  domain?: string | null;
  commissionId?: string | null;
  action: "draft" | "submit";
}) {
  const supabase = createClient();
  const { user, profile } = await getCurrentProfile();
  if (!user) throw new Error("You must be signed in to save an article.");

  const wordCount = countWords(input.body);
  const status = input.action === "draft" ? "draft" : getSubmitStatus(input.commissionId);
  const title = input.title.trim() || "Untitled Article";
  const now = new Date().toISOString();
  const domain = normalizeDomain(
    input.domain ??
      profile?.expertise_domains?.[0] ??
      profile?.domain ??
      input.tags[0]?.replace(/^#/, "")
  );

  const { data, error } = await supabase
    .from("articles")
    .insert({
      author_id: user.id,
      commission_id: input.commissionId ?? null,
      domain_name: domain,
      title,
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      excerpt: firstParagraph(input.body),
      body: input.body,
      tags: input.tags.length ? input.tags : [`#${domain}`],
      status,
      word_count: wordCount,
      read_time_minutes: Math.max(1, Math.ceil(wordCount / 200)),
      submitted_at: status === "draft" ? null : now,
      published_at: status === "published" ? now : null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as ArticleRecord;
}

export async function submitReview(input: {
  articleId: string;
  ratings: Record<string, number>;
  decision?: ReviewDecision;
  summary?: string;
  feedback?: string[];
}) {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) throw new Error("You must be signed in to submit a review.");

  const { data, error } = await supabase
    .from("article_reviews")
    .upsert(
      {
        article_id: input.articleId,
        sme_id: user.id,
        decision: input.decision ?? "approved",
        dimension_ratings: input.ratings,
        summary: input.summary ?? null,
        feedback: input.feedback ?? [],
      },
      { onConflict: "article_id,sme_id" }
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function listArticleComments(articleId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("article_comments")
    .select("*")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Omit<ArticleComment, "author_name">[];
  const profiles = await getPublicProfiles(rows.map(row => row.user_id));

  return rows.map(row => ({
    ...row,
    author_name: profiles.get(row.user_id)?.name ?? "Reader",
  }));
}

export async function addArticleComment(input: {
  articleId: string;
  body: string;
  qualityRating?: number | null;
  attachmentPath?: string | null;
}) {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) throw new Error("You must be signed in to comment.");

  const { data, error } = await supabase
    .from("article_comments")
    .insert({
      article_id: input.articleId,
      user_id: user.id,
      body: input.body,
      quality_rating: input.qualityRating ?? null,
      attachment_path: input.attachmentPath ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}
