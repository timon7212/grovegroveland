import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { sendApplicationReceivedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const rateMap = new Map<string, number>();

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code: string;
  do {
    code = "GRV-";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  } while (db.prepare("SELECT id FROM applicants WHERE referral_code = ?").get(code));
  return code;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();
    const twitter = (body.twitter ?? "").trim() || null;
    const telegram = (body.telegram ?? "").trim() || null;
    const source = (body.source ?? "other").trim();
    const ref = (body.ref ?? "").trim() || null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "invalid_email" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
    const ua = req.headers.get("user-agent") || "";

    const lastApply = rateMap.get(ip);
    if (lastApply && Date.now() - lastApply < 30 * 60 * 1000) {
      return NextResponse.json({ success: false, error: "rate_limited" }, { status: 429 });
    }

    const existing = db.prepare("SELECT id FROM applicants WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ success: false, error: "already_applied" }, { status: 409 });
    }

    let referredBy: string | null = null;
    if (ref) {
      const referrer = db.prepare("SELECT id FROM applicants WHERE referral_code = ?").get(ref);
      if (referrer) referredBy = ref;
    }

    const referralCode = generateReferralCode();

    db.prepare(`
      INSERT INTO applicants (email, twitter_handle, telegram_handle, source, referred_by_code, referral_code, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(email, twitter, telegram, source, referredBy, referralCode, ip, ua);

    rateMap.set(ip, Date.now());

    const { total } = db.prepare("SELECT COUNT(*) as total FROM applicants").get() as { total: number };
    const displayPosition = 1790 + total;

    sendApplicationReceivedEmail({
      to: email,
      referralCode,
      position: displayPosition,
    }).then(() => {
      db.prepare("UPDATE applicants SET email_sent_at = ? WHERE email = ?").run(new Date().toISOString(), email);
    }).catch((err) => {
      console.error("Failed to send application received email:", err);
    });

    return NextResponse.json({ success: true, position: displayPosition, referralCode });
  } catch (err) {
    console.error("Apply error:", err);
    return NextResponse.json({ success: false, error: "server_error" }, { status: 500 });
  }
}
