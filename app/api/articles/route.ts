import { NextResponse } from "next/server";
import { normalizeSmeReviewMode } from "@/lib/env";
import { normalizeDomain } from "@/lib/supabase/domains";
import { createClient } from "@/lib/supabase/server";

type ArticleAction = "draft" | "submit";

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "article";
}

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function firstParagraph(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 180);
}

function submitStatus(commissionId: string | null) {
  const mode = normalizeSmeReviewMode(process.env.SME_REVIEW_MODE ?? process.env.NEXT_PUBLIC_SME_REVIEW_MODE);
  if (mode === "optional") return "published";
  if (mode === "commissions_only" && !commissionId) return "published";
  return "submitted";
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null) as {
    title?: string;
    body?: string;
    tags?: string[];
    domain?: string | null;
    commissionId?: string | null;
    action?: ArticleAction;
  } | null;

  if (!payload || (payload.action !== "draft" && payload.action !== "submit")) {
    return NextResponse.json({ error: "Invalid article request." }, { status: 400 });
  }

  const title = payload.title?.trim() || "Untitled Article";
  const body = payload.body?.trim() ?? "";
  const tags = Array.isArray(payload.tags)
    ? payload.tags.map(tag => tag.trim()).filter(Boolean).slice(0, 12)
    : [];

  if (payload.action === "submit" && body.length < 20) {
    return NextResponse.json({ error: "Add article body before publishing." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "You must be signed in to save an article." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, domain, expertise_domains")
    .eq("id", userData.user.id)
    .maybeSingle<{ role: string; domain: string | null; expertise_domains: string[] | null }>();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  if (profile?.role !== "Writer") {
    return NextResponse.json({ error: "Only writers can create articles." }, { status: 403 });
  }

  const commissionId = payload.commissionId ?? null;
  const wordCount = countWords(body);
  const status = payload.action === "draft" ? "draft" : submitStatus(commissionId);
  const now = new Date().toISOString();
  const domain = normalizeDomain(
    payload.domain ??
      profile.expertise_domains?.[0] ??
      profile.domain ??
      tags[0]?.replace(/^#/, "")
  );

  const { data, error } = await supabase
    .from("articles")
    .insert({
      author_id: userData.user.id,
      commission_id: commissionId,
      domain_name: domain,
      title,
      slug: `${slugify(title)}-${Date.now().toString(36)}`,
      excerpt: firstParagraph(body),
      body,
      tags: tags.length ? tags : [`#${domain}`],
      status,
      word_count: wordCount,
      read_time_minutes: Math.max(1, Math.ceil(wordCount / 200)),
      submitted_at: status === "draft" ? null : now,
      published_at: status === "published" ? now : null,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ article: data });
}
