import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();

for (const file of [".env.local", ".env"]) {
  const path = resolve(root, file);
  if (!existsSync(path)) continue;

  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!(key in process.env)) process.env[key] = value;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
const sharedPassword = process.env.DEV_TEST_PASSWORD ?? "StickDotDev123!";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running npm run seed:dev.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const accounts = [
  {
    key: "dev-writer",
    env: "DEV_TEST_DEV_WRITER_EMAIL",
    email: "dev-writer@stickanddot.test",
    passwordEnv: "DEV_TEST_DEV_WRITER_PASSWORD",
    role: "Writer",
    name: "Dev Writer",
    mobile: "+91 90000 00001",
    domain: "Technology",
    domains: ["Technology", "Business", "AI"],
  },
  {
    key: "writer",
    env: "DEV_TEST_WRITER_EMAIL",
    email: "writer@stickanddot.test",
    passwordEnv: "DEV_TEST_WRITER_PASSWORD",
    role: "Writer",
    name: "Shaivya Writer",
    mobile: "+91 90000 00002",
    domain: "Technology",
    domains: ["Technology", "Finance", "Career"],
  },
  {
    key: "sme",
    env: "DEV_TEST_SME_EMAIL",
    email: "sme@stickanddot.test",
    passwordEnv: "DEV_TEST_SME_PASSWORD",
    role: "Subject Expert",
    name: "Aarav SME",
    mobile: "+91 90000 00003",
    domain: "Technology",
    domains: ["Technology", "Medical / Health", "Science"],
  },
  {
    key: "reader",
    env: "DEV_TEST_READER_EMAIL",
    email: "reader@stickanddot.test",
    passwordEnv: "DEV_TEST_READER_PASSWORD",
    role: "Reader",
    name: "Riya Reader",
    mobile: "+91 90000 00004",
    domain: "Technology",
    domains: ["Technology", "Culture"],
  },
  {
    key: "business",
    env: "DEV_TEST_BUSINESS_EMAIL",
    email: "business@stickanddot.test",
    passwordEnv: "DEV_TEST_BUSINESS_PASSWORD",
    role: "Client",
    name: "Acme Business",
    mobile: "+91 90000 00005",
    domain: "Business",
    domains: ["Business", "Technology"],
  },
].map(account => ({
  ...account,
  email: process.env[account.env] ?? account.email,
  password: process.env[account.passwordEnv] ?? sharedPassword,
}));

const domainNames = [
  "Technology",
  "Finance",
  "Medical",
  "Medical / Health",
  "Health",
  "Law",
  "Science",
  "Engineering",
  "Education",
  "Business",
  "Culture",
  "Design",
  "Career",
  "AI",
  "Politics",
  "Sports",
  "Other",
];

async function must(label, request) {
  const { data, error } = await request;
  if (error) {
    if (
      error.message?.includes("schema cache") ||
      error.message?.includes("Could not find the table") ||
      error.code === "PGRST205"
    ) {
      throw new Error(
        `${label}: Supabase cannot see the backend tables yet. Run supabase/schema.sql in the Supabase SQL Editor, wait a few seconds for the API schema cache to refresh, then run npm run seed:dev again. Original error: ${error.message}`
      );
    }
    throw new Error(`${label}: ${error.message}`);
  }
  return data;
}

async function listAllUsers() {
  const users = [];
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) break;
    page += 1;
  }

  return users;
}

async function upsertAuthUser(account, existingUsers) {
  const existing = existingUsers.find(user => user.email?.toLowerCase() === account.email.toLowerCase());

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: account.password,
      user_metadata: {
        role: account.role,
        name: account.name,
        full_name: account.name,
      },
    });
    if (error) throw error;
    return data.user;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: {
      role: account.role,
      name: account.name,
      full_name: account.name,
    },
  });
  if (error) throw error;
  return data.user;
}

function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

async function upsertArticle(input) {
  const count = wordCount(input.body);
  return must(
    `upsert article ${input.slug}`,
    supabase
      .from("articles")
      .upsert(
        {
          ...input,
          word_count: count,
          read_time_minutes: Math.max(1, Math.ceil(count / 200)),
        },
        { onConflict: "slug" }
      )
      .select("*")
      .single()
  );
}

async function main() {
  await must(
    "seed domains",
    supabase.from("domains").upsert(domainNames.map(name => ({ name })), { onConflict: "name" })
  );

  const existingUsers = await listAllUsers();
  const usersByKey = new Map();

  for (const account of accounts) {
    const user = await upsertAuthUser(account, existingUsers);
    usersByKey.set(account.key, user);

    await must(
      `upsert profile ${account.key}`,
      supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            role: account.role,
            name: account.name,
            email: account.email,
            mobile: account.mobile,
            domain: account.domain,
            expertise_domains: account.domains,
          },
          { onConflict: "id" }
        )
    );

    await must(
      `clear domains ${account.key}`,
      supabase.from("profile_domains").delete().eq("profile_id", user.id)
    );
    await must(
      `insert domains ${account.key}`,
      supabase.from("profile_domains").insert(
        account.domains.map(domain_name => ({
          profile_id: user.id,
          domain_name,
        }))
      )
    );
  }

  const writer = usersByKey.get("writer");
  const devWriter = usersByKey.get("dev-writer");
  const reader = usersByKey.get("reader");
  const business = usersByKey.get("business");

  const published = await upsertArticle({
    author_id: writer.id,
    domain_name: "Technology",
    title: "The Silent Revolution in Neural Computing",
    slug: "the-silent-revolution-in-neural-computing",
    excerpt: "A practical look at how neural computing is changing the products people use every day.",
    body: "Neural computing has moved from research labs into everyday product decisions. The important shift is not only speed or scale, but the way teams now design around adaptive systems. Writers, reviewers, and readers need clearer explanations so the technology feels understandable instead of distant.",
    tags: ["#technology", "#AI"],
    status: "published",
    submitted_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  });

  await upsertArticle({
    author_id: devWriter.id,
    domain_name: "Technology",
    title: "The Future of EVs in India",
    slug: "the-future-of-evs-in-india",
    excerpt: "Charging, policy, and consumer trust will decide how quickly EVs become mainstream.",
    body: "India's EV market is shifting from early enthusiasm into infrastructure reality. Charging density, battery confidence, and state-level incentives will decide whether adoption expands beyond early urban buyers. The strongest opportunities sit where policy, product design, and operating costs meet.",
    tags: ["#technology", "#EV"],
    status: "submitted",
    submitted_at: new Date().toISOString(),
  });

  await upsertArticle({
    author_id: writer.id,
    domain_name: "Finance",
    title: "The Hidden Economics of Attention",
    slug: "the-hidden-economics-of-attention",
    excerpt: "Attention behaves like a scarce market resource, even when platforms pretend it is infinite.",
    body: "Every product competes for attention, but not every product returns value for it. The economics of attention becomes clearer when we measure what a reader gives up to stay engaged and what they gain after the session ends.",
    tags: ["#finance", "#psychology"],
    status: "draft",
  });

  const existingCommission = await must(
    "lookup commission",
    supabase
      .from("commissions")
      .select("*")
      .eq("business_id", business.id)
      .eq("topic", "3000-word piece on EV Infrastructure in India")
      .maybeSingle()
  );

  const commissionPayload = {
    business_id: business.id,
    topic: "3000-word piece on EV Infrastructure in India",
    domain_name: "Technology",
    due_date: "2026-05-30",
    word_count: 3000,
    payment_amount: 8000,
    payment_currency: "INR",
    instructions: ["Explain charging infrastructure", "Use India-specific examples", "Keep the tone practical"],
    status: "open",
  };

  const commission = existingCommission
    ? await must(
        "update commission",
        supabase.from("commissions").update(commissionPayload).eq("id", existingCommission.id).select("*").single()
      )
    : await must("insert commission", supabase.from("commissions").insert(commissionPayload).select("*").single());

  await must(
    "seed application",
    supabase
      .from("commission_applications")
      .upsert(
        {
          commission_id: commission.id,
          writer_id: writer.id,
          pitch: "I can cover the topic with a practical product and policy angle.",
          status: "applied",
        },
        { onConflict: "commission_id,writer_id" }
      )
  );

  const existingList = await must(
    "lookup reading list",
    supabase
      .from("reading_lists")
      .select("*")
      .eq("owner_id", reader.id)
      .eq("name", "My AI Reads")
      .maybeSingle()
  );

  const readingList = existingList
    ? await must(
        "update reading list",
        supabase
          .from("reading_lists")
          .update({
            description: "A small list for testing reader saved articles.",
            genre: "Technology",
            is_private: false,
          })
          .eq("id", existingList.id)
          .select("*")
          .single()
      )
    : await must(
        "insert reading list",
        supabase
          .from("reading_lists")
          .insert({
            owner_id: reader.id,
            name: "My AI Reads",
            description: "A small list for testing reader saved articles.",
            genre: "Technology",
            is_private: false,
          })
          .select("*")
          .single()
      );

  await must(
    "seed reading item",
    supabase
      .from("reading_list_items")
      .upsert(
        {
          reading_list_id: readingList.id,
          article_id: published.id,
          note: "Start here when testing reader flows.",
          position: 1,
        },
        { onConflict: "reading_list_id,article_id" }
      )
  );

  await must(
    "seed progress",
    supabase.from("reading_progress").upsert(
      {
        reader_id: reader.id,
        article_id: published.id,
        progress: 45,
        total_minutes: published.read_time_minutes,
      },
      { onConflict: "reader_id,article_id" }
    )
  );

  const existingComment = await must(
    "lookup comment",
    supabase
      .from("article_comments")
      .select("*")
      .eq("article_id", published.id)
      .eq("user_id", reader.id)
      .eq("body", "This is a seeded reader opinion for testing comments.")
      .maybeSingle()
  );

  if (!existingComment) {
    await must(
      "seed comment",
      supabase.from("article_comments").insert({
        article_id: published.id,
        user_id: reader.id,
        body: "This is a seeded reader opinion for testing comments.",
        quality_rating: 5,
      })
    );
  }

  console.log("Seed complete. Dev accounts:");
  for (const account of accounts) {
    console.log(`- ${account.key}: ${account.email} / ${account.password}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
