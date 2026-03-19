import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

const TOTAL_SPOTS = 500;
const APPLIED_OFFSET = 1790;

let cache: { data: object; ts: number } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.ts < 30_000) {
    return NextResponse.json(cache.data);
  }

  const { applied } = db.prepare("SELECT COUNT(*) as applied FROM applicants").get() as { applied: number };
  const { confirmed } = db.prepare("SELECT COUNT(*) as confirmed FROM applicants WHERE status = 'confirmed'").get() as { confirmed: number };

  const data = {
    total_spots: TOTAL_SPOTS,
    applied: APPLIED_OFFSET + applied,
    confirmed,
    remaining: Math.max(0, TOTAL_SPOTS - confirmed),
  };

  cache = { data, ts: Date.now() };
  return NextResponse.json(data);
}
