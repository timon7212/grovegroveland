import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorized, unauthorizedResponse } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50")));
  const search = (url.searchParams.get("search") || "").trim();
  const offset = (page - 1) * limit;

  let where = "1=1";
  const params: unknown[] = [];

  if (status && ["new", "confirmed", "rejected"].includes(status)) {
    where += " AND status = ?";
    params.push(status);
  }

  if (search) {
    where += " AND (email LIKE ? OR twitter_handle LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  const { total } = db.prepare(`SELECT COUNT(*) as total FROM applicants WHERE ${where}`).get(...params) as { total: number };

  const applicants = db.prepare(
    `SELECT * FROM applicants WHERE ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
  ).all(...params, limit, offset);

  return NextResponse.json({ applicants, total, page, limit, pages: Math.ceil(total / limit) });
}
