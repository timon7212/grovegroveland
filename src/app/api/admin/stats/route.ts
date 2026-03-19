import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorized, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  const { total } = db.prepare("SELECT COUNT(*) as total FROM applicants").get() as { total: number };
  const { newCount } = db.prepare("SELECT COUNT(*) as newCount FROM applicants WHERE status = 'new'").get() as { newCount: number };
  const { confirmed } = db.prepare("SELECT COUNT(*) as confirmed FROM applicants WHERE status = 'confirmed'").get() as { confirmed: number };
  const { rejected } = db.prepare("SELECT COUNT(*) as rejected FROM applicants WHERE status = 'rejected'").get() as { rejected: number };
  const { today } = db.prepare("SELECT COUNT(*) as today FROM applicants WHERE date(created_at) = date('now')").get() as { today: number };

  const sources = db.prepare("SELECT source, COUNT(*) as count FROM applicants GROUP BY source").all() as { source: string; count: number }[];
  const referral_sources: Record<string, number> = {};
  for (const s of sources) referral_sources[s.source || "other"] = s.count;

  return NextResponse.json({ total, new: newCount, confirmed, rejected, today_applied: today, referral_sources });
}
