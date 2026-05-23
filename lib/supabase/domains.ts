export const DOMAINS = [
  "Technology",
  "Finance",
  "Medical / Health",
  "Law",
  "Science",
  "Engineering",
  "Education",
  "Business",
  "Culture",
  "Design",
  "Career",
  "AI",
  "Other",
];

const DOMAIN_ALIASES: Record<string, string> = {
  medical: "Medical / Health",
  health: "Medical / Health",
  "medical health": "Medical / Health",
  tech: "Technology",
};

export function normalizeDomain(input: string | null | undefined) {
  const value = input?.trim();
  if (!value) return "Technology";

  const exact = DOMAINS.find(domain => domain.toLowerCase() === value.toLowerCase());
  if (exact) return exact;

  const alias = DOMAIN_ALIASES[value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()];
  return alias ?? value;
}

export function tagToDomain(tag: string) {
  return normalizeDomain(tag.replace(/^#/, ""));
}

export function domainToTag(domain: string) {
  return `#${normalizeDomain(domain).replace(/\s*\/\s*/g, "").replace(/\s+/g, "")}`;
}
