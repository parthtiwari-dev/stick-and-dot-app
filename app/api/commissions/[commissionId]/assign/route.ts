import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ commissionId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { commissionId } = await context.params;
  const payload = await request.json().catch(() => null) as { writerId?: string } | null;
  if (!payload?.writerId) {
    return NextResponse.json({ error: "Writer id is required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "You must be signed in to assign commissions." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle<{ role: string }>();

  if (profile?.role !== "Client") {
    return NextResponse.json({ error: "Only business accounts can assign commissions." }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("commissions")
    .update({
      assigned_writer_id: payload.writerId,
      status: "assigned",
      assignment_type: "direct",
      assigned_at: new Date().toISOString(),
    })
    .eq("id", commissionId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ commission: data });
}
