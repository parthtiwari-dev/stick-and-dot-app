import { NextResponse } from "next/server";
import { getPublicDevAccounts, isDevAuthEnabled } from "@/lib/dev-accounts";

export async function GET() {
  if (!isDevAuthEnabled()) {
    return NextResponse.json({ enabled: false, accounts: [] });
  }

  return NextResponse.json({
    enabled: true,
    accounts: getPublicDevAccounts(),
  });
}
