import { NextResponse } from "next/server";
import { normalizeDomain } from "@/lib/supabase/domains";
import { createClient } from "@/lib/supabase/server";

function parsePayment(value: string) {
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  const currency = value.includes("$") ? "USD" : "INR";
  return {
    amount: Number.isFinite(amount) && amount > 0 ? amount : null,
    currency,
  };
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null) as {
    topic?: string;
    domain?: string;
    dueDate?: string;
    wordCount?: string;
    payment?: string;
    instructions?: string[];
  } | null;

  const topic = payload?.topic?.trim() ?? "";
  const domain = payload?.domain?.trim() ?? "";

  if (!topic || !domain) {
    return NextResponse.json({ error: "Topic and domain are required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "You must be signed in to post a commission." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle<{ role: string }>();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  if (profile?.role !== "Client") {
    return NextResponse.json({ error: "Only business accounts can post commissions." }, { status: 403 });
  }

  const payment = parsePayment(payload?.payment ?? "");
  const wordCount = Number(payload?.wordCount);

  const { data, error } = await supabase
    .from("commissions")
    .insert({
      business_id: userData.user.id,
      topic,
      domain_name: normalizeDomain(domain),
      due_date: payload?.dueDate || null,
      word_count: Number.isFinite(wordCount) && wordCount > 0 ? wordCount : null,
      payment_amount: payment.amount,
      payment_currency: payment.currency,
      instructions: payload?.instructions?.map(item => item.trim()).filter(Boolean) ?? [],
      status: "open",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ commission: data });
}
