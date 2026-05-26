import { createClient } from "./client";
import { getCurrentProfile } from "./profile";
import { normalizeSmeReviewMode, type SmeReviewMode } from "@/lib/env";

export type ArticleStatus = "draft" | "submitted" | "in_review" | "revision_requested" | "published" | "archived";
export type ReviewDecision = "approved" | "revision_requested";

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

export interface ArticleCommentWithArticle extends ArticleComment {
  article_title: string;
}

export interface ReviewHistoryRow {
  id: string;
  article_id: string;
  article_slug: string;
  article_title: string;
  article_domain: string;
  decision: ReviewDecision;
  average_score: number;
  created_at: string;
}

export const STATUS_LABELS: Record<ArticleStatus, string> = {
  draft: "Draft",
  submitted: "Pending",
  in_review: "Pending",
  revision_requested: "Revision",
  published: "Published",
  archived: "Archived",
};

export function getSmeReviewMode(): SmeReviewMode {
  return normalizeSmeReviewMode(process.env.NEXT_PUBLIC_SME_REVIEW_MODE);
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
  const response = await fetch("/api/articles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => ({})) as { article?: ArticleRecord; error?: string };
  if (!response.ok || !payload.article) {
    throw new Error(payload.error ?? "Unable to save article.");
  }

  return payload.article;
}

export async function submitReview(input: {
  articleId: string;
  ratings: Record<string, number>;
  decision?: ReviewDecision;
  summary?: string;
  feedback?: string[];
}) {
  const response = await fetch(`/api/articles/${input.articleId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => ({})) as { review?: unknown; error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to submit review.");
  }

  return payload.review;
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

export async function listCommentsForMyArticles(limit = 20) {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) return [];

  const { data: articleRows, error: articleError } = await supabase
    .from("articles")
    .select("id,title")
    .eq("author_id", user.id);

  if (articleError) throw new Error(articleError.message);

  const articles = (articleRows ?? []) as Array<{ id: string; title: string }>;
  if (articles.length === 0) return [];

  const articleById = new Map(articles.map(article => [article.id, article.title]));
  const { data, error } = await supabase
    .from("article_comments")
    .select("*")
    .in("article_id", articles.map(article => article.id))
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Omit<ArticleComment, "author_name">[];
  const profiles = await getPublicProfiles(rows.map(row => row.user_id));

  return rows.map(row => ({
    ...row,
    author_name: profiles.get(row.user_id)?.name ?? "Reader",
    article_title: articleById.get(row.article_id) ?? "Article",
  })) satisfies ArticleCommentWithArticle[];
}

export async function listMyReviews(limit = 30) {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) return [];

  const { data, error } = await supabase
    .from("article_reviews")
    .select("*")
    .eq("sme_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  const reviews = (data ?? []) as Array<{
    id: string;
    article_id: string;
    decision: ReviewDecision;
    dimension_ratings: Record<string, number>;
    created_at: string;
  }>;
  if (reviews.length === 0) return [];

  const { data: articles, error: articleError } = await supabase
    .from("articles")
    .select("id,slug,title,domain_name")
    .in("id", reviews.map(review => review.article_id));

  if (articleError) throw new Error(articleError.message);

  const articleById = new Map(
    ((articles ?? []) as Array<{ id: string; slug: string; title: string; domain_name: string }>)
      .map(article => [article.id, article])
  );

  return reviews.map(review => {
    const ratings = Object.values(review.dimension_ratings ?? {});
    const average = ratings.length
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
    const article = articleById.get(review.article_id);
    return {
      id: review.id,
      article_id: review.article_id,
      article_slug: article?.slug ?? review.article_id,
      article_title: article?.title ?? "Article",
      article_domain: article?.domain_name ?? "Other",
      decision: review.decision,
      average_score: average,
      created_at: review.created_at,
    };
  }) satisfies ReviewHistoryRow[];
}

export async function addArticleComment(input: {
  articleId: string;
  body: string;
  qualityRating?: number | null;
  attachmentPath?: string | null;
}) {
  const response = await fetch(`/api/articles/${input.articleId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => ({})) as { comment?: unknown; error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to add comment.");
  }

  return payload.comment;
}
