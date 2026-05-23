import { getArticle, listPublishedArticles, type ArticleWithAuthor } from "./articles";
import { createClient } from "./client";
import { getCurrentProfile } from "./profile";

interface ReadingListRecord {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  genre: string | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

interface ReadingListItemRecord {
  id: string;
  reading_list_id: string;
  article_id: string;
  note: string | null;
  position: number;
  created_at: string;
}

interface ReadingProgressRecord {
  reader_id: string;
  article_id: string;
  progress: number;
  total_minutes: number;
  completed_at: string | null;
  updated_at: string;
}

export interface SavedArticleRow {
  itemId: string;
  articleId: string;
  slug: string;
  title: string;
  author: string;
  tag: string;
  progress: number;
  totalMins: number;
  savedDate: string;
}

function formatSavedDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(date));
}

async function getMyLists() {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) return [];

  const { data, error } = await supabase
    .from("reading_lists")
    .select("*")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ReadingListRecord[];
}

export async function listSavedArticles() {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) return [];

  const lists = await getMyLists();
  if (lists.length === 0) return [];

  const { data: items, error: itemError } = await supabase
    .from("reading_list_items")
    .select("*")
    .in("reading_list_id", lists.map(list => list.id))
    .order("created_at", { ascending: false });

  if (itemError) throw new Error(itemError.message);

  const rows = (items ?? []) as ReadingListItemRecord[];
  if (rows.length === 0) return [];

  const articleIds = [...new Set(rows.map(row => row.article_id))];
  const { data: articles, error: articleError } = await supabase
    .from("articles")
    .select("*")
    .in("id", articleIds);

  if (articleError) throw new Error(articleError.message);

  const { data: progressRows, error: progressError } = await supabase
    .from("reading_progress")
    .select("*")
    .eq("reader_id", user.id)
    .in("article_id", articleIds);

  if (progressError) throw new Error(progressError.message);

  const enriched = await Promise.all(
    ((articles ?? []) as ArticleWithAuthor[]).map(article => getArticle(article.slug))
  );
  const presentArticles = enriched.filter((article): article is ArticleWithAuthor => article !== null);
  const articlesById = new Map(presentArticles.map(article => [article.id, article]));
  const progressById = new Map(
    ((progressRows ?? []) as ReadingProgressRecord[]).map(progress => [progress.article_id, progress])
  );

  return rows
    .map(row => {
      const article = articlesById.get(row.article_id);
      if (!article) return null;
      const progress = progressById.get(row.article_id);
      return {
        itemId: row.id,
        articleId: article.id,
        slug: article.slug,
        title: article.title,
        author: article.author_name,
        tag: article.domain_name,
        progress: progress?.progress ?? 0,
        totalMins: progress?.total_minutes || article.read_time_minutes,
        savedDate: formatSavedDate(row.created_at),
      };
    })
    .filter((row): row is SavedArticleRow => row !== null);
}

export async function createReadingList(input: {
  name: string;
  description: string;
  genre: string;
  isPrivate: boolean;
  articleTitles: Array<{ title: string; note: string }>;
}) {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) throw new Error("You must be signed in to create a reading list.");

  const published = await listPublishedArticles();
  const articles = input.articleTitles
    .map(item => {
      const title = item.title.trim().toLowerCase();
      if (!title) return null;
      const article = published.find(candidate =>
        candidate.title.toLowerCase() === title || candidate.title.toLowerCase().includes(title)
      );
      return article ? { article, note: item.note } : null;
    })
    .filter((item): item is { article: ArticleWithAuthor; note: string } => item !== null);

  if (articles.length === 0) {
    throw new Error("Add at least one published article title from Explore.");
  }

  const { data: list, error: listError } = await supabase
    .from("reading_lists")
    .insert({
      owner_id: user.id,
      name: input.name.trim(),
      description: input.description.trim() || null,
      genre: input.genre || null,
      is_private: input.isPrivate,
    })
    .select("*")
    .single();

  if (listError) throw new Error(listError.message);

  const readingList = list as ReadingListRecord;
  const { error: itemError } = await supabase.from("reading_list_items").insert(
    articles.map((item, index) => ({
      reading_list_id: readingList.id,
      article_id: item.article.id,
      note: item.note.trim() || null,
      position: index + 1,
    }))
  );

  if (itemError) throw new Error(itemError.message);
  return readingList;
}

export async function removeReadingListItem(itemId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("reading_list_items").delete().eq("id", itemId);
  if (error) throw new Error(error.message);
}

export async function upsertReadingProgress(articleId: string, progress: number, totalMinutes: number) {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) throw new Error("You must be signed in to update reading progress.");

  const { data, error } = await supabase
    .from("reading_progress")
    .upsert(
      {
        reader_id: user.id,
        article_id: articleId,
        progress: Math.max(0, Math.min(100, progress)),
        total_minutes: totalMinutes,
        completed_at: progress >= 100 ? new Date().toISOString() : null,
      },
      { onConflict: "reader_id,article_id" }
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as ReadingProgressRecord;
}
