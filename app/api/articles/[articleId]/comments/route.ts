import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ articleId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { articleId } = await context.params;
  const payload = await request.json().catch(() => null) as {
    body?: string;
    qualityRating?: number | null;
    attachmentPath?: string | null;
  } | null;

  const body = payload?.body?.trim() ?? "";
  if (!body) {
    return NextResponse.json({ error: "Write a comment before posting." }, { status: 400 });
  }

  if (body.length > 2000) {
    return NextResponse.json({ error: "Comment is too long." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "You must be signed in to comment." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("article_comments")
    .insert({
      article_id: articleId,
      user_id: userData.user.id,
      body,
      quality_rating: payload?.qualityRating ?? null,
      attachment_path: payload?.attachmentPath ?? null,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ comment: data });
}
