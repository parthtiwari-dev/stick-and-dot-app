import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ commissionId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { commissionId } = await context.params;
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "You must be signed in to apply." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle<{ role: string }>();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  if (profile?.role !== "Writer") {
    return NextResponse.json({ error: "Only writers can apply to commissions." }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("commission_applications")
    .upsert(
      {
        commission_id: commissionId,
        writer_id: userData.user.id,
        status: "applied",
      },
      { onConflict: "commission_id,writer_id" }
    )
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ application: data });
}
