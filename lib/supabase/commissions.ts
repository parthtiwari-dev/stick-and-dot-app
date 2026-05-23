import { createClient } from "./client";
import { normalizeDomain } from "./domains";
import { getCurrentProfile, type ProfileRecord } from "./profile";

export type CommissionStatus =
  | "open"
  | "applied"
  | "assigned"
  | "in_progress"
  | "submitted"
  | "under_sme_review"
  | "revision_requested"
  | "delivered"
  | "completed"
  | "cancelled";

export interface CommissionRecord {
  id: string;
  business_id: string;
  assigned_writer_id: string | null;
  topic: string;
  domain_name: string;
  due_date: string | null;
  word_count: number | null;
  payment_amount: number | null;
  payment_currency: string;
  payment_status: string;
  instructions: string[];
  status: CommissionStatus;
  assignment_type: "application" | "direct" | null;
  assigned_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommissionWithNames extends CommissionRecord {
  writer_name: string;
  business_name: string;
  application_status?: string;
}

export interface WriterDirectoryRow {
  id: string;
  name: string;
  domain: string;
  email: string;
  phone: string;
  articles: number;
  rating: number;
}

export const COMMISSION_STATUS_LABELS: Record<CommissionStatus, string> = {
  open: "Open",
  applied: "Open",
  assigned: "Assigned",
  in_progress: "In Progress",
  submitted: "Pending Review",
  under_sme_review: "Under SME Review",
  revision_requested: "Revision Requested",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

function parsePayment(value: string) {
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  const currency = value.includes("$") ? "USD" : "INR";
  return {
    amount: Number.isFinite(amount) && amount > 0 ? amount : null,
    currency,
  };
}

export function formatMoney(amount: number | null, currency = "INR") {
  if (!amount) return "TBD";
  const prefix = currency === "USD" ? "$" : "INR ";
  return `${prefix}${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function formatDueDate(value: string | null) {
  if (!value) return "No date";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(value));
}

async function getProfiles(ids: string[]) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);
  if (uniqueIds.length === 0) return new Map<string, ProfileRecord>();

  const supabase = createClient();
  const { data, error } = await supabase.from("profiles").select("*").in("id", uniqueIds);
  if (error) throw new Error(error.message);
  return new Map((data as ProfileRecord[] | null ?? []).map(profile => [profile.id, profile]));
}

async function withNames(commissions: CommissionRecord[]) {
  const profiles = await getProfiles(
    commissions.flatMap(item => [item.business_id, item.assigned_writer_id].filter(Boolean) as string[])
  );

  return commissions.map(item => ({
    ...item,
    business_name: profiles.get(item.business_id)?.name ?? "Business",
    writer_name: item.assigned_writer_id ? profiles.get(item.assigned_writer_id)?.name ?? "Assigned" : "-",
  }));
}

export async function createCommission(input: {
  topic: string;
  domain: string;
  dueDate: string;
  wordCount: string;
  payment: string;
  instructions: string[];
}) {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) throw new Error("You must be signed in to post a commission.");

  const payment = parsePayment(input.payment);
  const wordCount = Number(input.wordCount);

  const { data, error } = await supabase
    .from("commissions")
    .insert({
      business_id: user.id,
      topic: input.topic.trim(),
      domain_name: normalizeDomain(input.domain),
      due_date: input.dueDate || null,
      word_count: Number.isFinite(wordCount) && wordCount > 0 ? wordCount : null,
      payment_amount: payment.amount,
      payment_currency: payment.currency,
      instructions: input.instructions.map(item => item.trim()).filter(Boolean),
      status: "open",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as CommissionRecord;
}

export async function listMyCommissions() {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) return [];

  const { data, error } = await supabase
    .from("commissions")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(80);

  if (error) throw new Error(error.message);
  return withNames((data ?? []) as CommissionRecord[]);
}

export async function listOpenCommissions() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("commissions")
    .select("*")
    .in("status", ["open", "applied"])
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) throw new Error(error.message);
  return withNames((data ?? []) as CommissionRecord[]);
}

export async function applyToCommission(commissionId: string) {
  const supabase = createClient();
  const { user } = await getCurrentProfile();
  if (!user) throw new Error("You must be signed in to apply.");

  const { data, error } = await supabase
    .from("commission_applications")
    .upsert(
      {
        commission_id: commissionId,
        writer_id: user.id,
        status: "applied",
      },
      { onConflict: "commission_id,writer_id" }
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function assignCommissionToWriter(commissionId: string, writerId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("commissions")
    .update({
      assigned_writer_id: writerId,
      status: "assigned",
      assignment_type: "direct",
      assigned_at: new Date().toISOString(),
    })
    .eq("id", commissionId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as CommissionRecord;
}

export async function acceptCommissionApplication(applicationId: string, commissionId: string, writerId: string) {
  const supabase = createClient();

  const { error: applicationError } = await supabase
    .from("commission_applications")
    .update({ status: "accepted" })
    .eq("id", applicationId);

  if (applicationError) throw new Error(applicationError.message);

  const { data, error } = await supabase
    .from("commissions")
    .update({
      assigned_writer_id: writerId,
      status: "assigned",
      assignment_type: "application",
      assigned_at: new Date().toISOString(),
    })
    .eq("id", commissionId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as CommissionRecord;
}

export async function listWriterDirectory() {
  const supabase = createClient();
  const { data: profiles, error } = await supabase.from("profiles").select("*").eq("role", "Writer");
  if (error) throw new Error(error.message);

  const writers = (profiles ?? []) as ProfileRecord[];
  if (writers.length === 0) return [];

  const { data: articles } = await supabase
    .from("articles")
    .select("author_id")
    .eq("status", "published")
    .in("author_id", writers.map(writer => writer.id));

  const counts = new Map<string, number>();
  for (const article of (articles ?? []) as Array<{ author_id: string }>) {
    counts.set(article.author_id, (counts.get(article.author_id) ?? 0) + 1);
  }

  return writers.map(writer => ({
    id: writer.id,
    name: writer.name ?? "Unnamed Writer",
    domain: writer.domain ?? writer.expertise_domains?.[0] ?? "Technology",
    email: writer.email ?? "Not provided",
    phone: writer.mobile ?? "Not provided",
    articles: counts.get(writer.id) ?? 0,
    rating: counts.has(writer.id) ? 4.8 : 0,
  })) satisfies WriterDirectoryRow[];
}
