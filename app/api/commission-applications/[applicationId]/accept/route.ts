import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ applicationId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { applicationId } = await context.params;
  const payload = await request.json().catch(() => null) as {
    commissionId?: string;
    writerId?: string;
  } | null;

  if (!payload?.commissionId || !payload.writerId) {
    return NextResponse.json({ error: "Commission id and writer id are required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "You must be signed in to accept applications." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle<{ role: string }>();

  if (profile?.role !== "Client") {
    return NextResponse.json({ error: "Only business accounts can accept applications." }, { status: 403 });
  }

  const { error: applicationError } = await supabase
    .from("commission_applications")
    .update({ status: "accepted" })
    .eq("id", applicationId);

  if (applicationError) {
    return NextResponse.json({ error: applicationError.message }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("commissions")
    .update({
      assigned_writer_id: payload.writerId,
      status: "assigned",
      assignment_type: "application",
      assigned_at: new Date().toISOString(),
    })
    .eq("id", payload.commissionId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ commission: data });
}
