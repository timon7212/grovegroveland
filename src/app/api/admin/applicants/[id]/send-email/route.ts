import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { sendConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  const applicant = db.prepare("SELECT * FROM applicants WHERE id = ? AND status = 'confirmed'").get(id) as Record<string, unknown> | undefined;
  if (!applicant) return NextResponse.json({ error: "not_found_or_not_confirmed" }, { status: 404 });

  if (!applicant.referral_code) return NextResponse.json({ error: "no_referral_code" }, { status: 400 });

  const position = applicant.id as number;

  try {
    await sendConfirmationEmail({
      to: applicant.email as string,
      referralCode: applicant.referral_code as string,
      position,
    });

    db.prepare("UPDATE applicants SET email_sent_at = ? WHERE id = ?").run(new Date().toISOString(), id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend email failed:", err);
    return NextResponse.json({ error: "email_failed" }, { status: 500 });
  }
}
