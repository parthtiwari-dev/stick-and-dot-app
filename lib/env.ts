export function isEnvEnabled(value: string | undefined | null) {
  const normalized = value?.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
}

export type SmeReviewMode = "before_publish" | "commissions_only" | "optional";

const REVIEW_MODES: SmeReviewMode[] = ["before_publish", "commissions_only", "optional"];

export function normalizeSmeReviewMode(value: string | undefined | null): SmeReviewMode {
  return REVIEW_MODES.includes(value as SmeReviewMode) ? (value as SmeReviewMode) : "before_publish";
}
