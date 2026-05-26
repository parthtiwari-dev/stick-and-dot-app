import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ articleId: string }>;
};

type ReviewDecision = "approved" | "revision_requested";

export async function POST(request: Request, context: RouteContext) {
  const { articleId } = await context.params;
  const payload = await request.json().catch(() => null) as {
    ratings?: Record<string, number>;
    decision?: ReviewDecision;
    summary?: string;
    feedback?: string[];
  } | null;

  const ratings = payload?.ratings ?? {};
  const values = Object.values(ratings);
  if (values.length === 0 || values.some(value => !Number.isFinite(value) || value < 1 || value > 5)) {
    return NextResponse.json({ error: "Rate every review dimension before submitting." }, { status: 400 });
  }

  const decision = payload?.decision === "revision_requested" ? "revision_requested" : "approved";
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "You must be signed in to submit a review." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle<{ role: string }>();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  if (profile?.role !== "Subject Expert") {
    return NextResponse.json({ error: "Only subject experts can review articles." }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("article_reviews")
    .upsert(
      {
        article_id: articleId,
        sme_id: userData.user.id,
        decision,
        dimension_ratings: ratings,
        summary: payload?.summary?.trim() || null,
        feedback: payload?.feedback?.map(item => item.trim()).filter(Boolean) ?? [],
      },
      { onConflict: "article_id,sme_id" }
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ review: data });
}
