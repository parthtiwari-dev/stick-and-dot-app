import "server-only";
import { dashRootPath, type RawRole } from "@/lib/roles";

export type DevAccountKey = "dev-writer" | "writer" | "sme" | "reader" | "business";

interface DevAccountConfig {
  key: DevAccountKey;
  label: string;
  role: RawRole;
  emailEnv: string;
  passwordEnv?: string;
  defaultEmail: string;
}

const DEV_ACCOUNTS: DevAccountConfig[] = [
  {
    key: "dev-writer",
    label: "Dev Writer",
    role: "Writer",
    emailEnv: "DEV_TEST_DEV_WRITER_EMAIL",
    passwordEnv: "DEV_TEST_DEV_WRITER_PASSWORD",
    defaultEmail: "dev-writer@stickanddot.test",
  },
  {
    key: "writer",
    label: "Writer",
    role: "Writer",
    emailEnv: "DEV_TEST_WRITER_EMAIL",
    passwordEnv: "DEV_TEST_WRITER_PASSWORD",
    defaultEmail: "writer@stickanddot.test",
  },
  {
    key: "sme",
    label: "Subject Expert",
    role: "Subject Expert",
    emailEnv: "DEV_TEST_SME_EMAIL",
    passwordEnv: "DEV_TEST_SME_PASSWORD",
    defaultEmail: "sme@stickanddot.test",
  },
  {
    key: "reader",
    label: "Reader",
    role: "Reader",
    emailEnv: "DEV_TEST_READER_EMAIL",
    passwordEnv: "DEV_TEST_READER_PASSWORD",
    defaultEmail: "reader@stickanddot.test",
  },
  {
    key: "business",
    label: "Business",
    role: "Client",
    emailEnv: "DEV_TEST_BUSINESS_EMAIL",
    passwordEnv: "DEV_TEST_BUSINESS_PASSWORD",
    defaultEmail: "business@stickanddot.test",
  },
];

function enabled(value: string | undefined) {
  return value === "true" || value === "1";
}

export function isDevAuthEnabled() {
  return enabled(process.env.DEV_AUTH_ENABLED) && process.env.VERCEL_ENV !== "production";
}

export function getDevAccount(key: string) {
  const account = DEV_ACCOUNTS.find(item => item.key === key);
  if (!account) return null;

  const password =
    (account.passwordEnv ? process.env[account.passwordEnv] : undefined) ??
    process.env.DEV_TEST_PASSWORD;

  return {
    key: account.key,
    label: account.label,
    role: account.role,
    email: process.env[account.emailEnv] ?? account.defaultEmail,
    password,
    next: dashRootPath(account.role),
  };
}

export function getPublicDevAccounts() {
  return DEV_ACCOUNTS.map(account => ({
    key: account.key,
    label: account.label,
    role: account.role,
    email: process.env[account.emailEnv] ?? account.defaultEmail,
    next: dashRootPath(account.role),
  }));
}
