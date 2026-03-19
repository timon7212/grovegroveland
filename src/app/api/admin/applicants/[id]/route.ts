import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { isAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { sendConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) return unauthorizedResponse();

  const id = parseInt(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "invalid_id" }, { status: 400 });

  const applicant = db.prepare("SELECT * FROM applicants WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  if (!applicant) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json();
  const newStatus = body.status as string | undefined;
  const adminNotes = body.admin_notes as string | undefined;

  if (newStatus && !["new", "confirmed", "rejected"].includes(newStatus)) {
    return NextResponse.json({ error: "invalid_status" }, { status: 400 });
  }

  if (newStatus === "confirmed" && applicant.status !== "confirmed") {
    const now = new Date().toISOString();
    const position = (db.prepare("SELECT COUNT(*) as c FROM applicants WHERE status = 'confirmed'").get() as { c: number }).c + 1;

    db.prepare(`
      UPDATE applicants SET status = 'confirmed', confirmed_at = ?, admin_notes = COALESCE(?, admin_notes)
      WHERE id = ?
    `).run(now, adminNotes ?? null, id);

    if (applicant.referral_code) {
      sendConfirmationEmail({
        to: applicant.email as string,
        referralCode: applicant.referral_code as string,
        position,
      }).catch((err) => {
        console.error("Failed to send confirmation email for applicant", id, err);
      });
    }
  } else if (newStatus === "rejected") {
    db.prepare("UPDATE applicants SET status = 'rejected', admin_notes = COALESCE(?, admin_notes) WHERE id = ?").run(adminNotes ?? null, id);
  } else if (adminNotes !== undefined) {
    db.prepare("UPDATE applicants SET admin_notes = ? WHERE id = ?").run(adminNotes, id);
  }

  const updated = db.prepare("SELECT * FROM applicants WHERE id = ?").get(id);
  return NextResponse.json(updated);
}
