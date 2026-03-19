import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = () => process.env.NEXT_PUBLIC_SITE_URL || "https://grovegrove.com";

const LOGO_BLOCK = `
  <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:24px;">
    <div style="width:28px;height:28px;border-radius:50%;background:#16A34A;display:inline-block;"></div>
    <span style="font-size:16px;font-weight:600;color:#2C2D30;">grovegrove</span>
  </div>`;

const FOOTER_BLOCK = `
  <tr><td style="padding:0 32px 32px;text-align:center;">
    <a href="https://x.com/grovegrove" style="font-size:13px;color:#88898B;text-decoration:none;margin-right:16px;">X / Twitter</a>
    <a href="https://t.me/grovegrove" style="font-size:13px;color:#88898B;text-decoration:none;">Telegram</a>
  </td></tr>
  <tr><td style="padding:16px 32px;border-top:1px solid #E5E7EB;text-align:center;">
    <p style="margin:0;font-size:12px;color:#B0B1B3;">&copy; 2026 grovegrove</p>
  </td></tr>`;

function wrap(inner: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'DM Sans',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;">
        ${inner}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendApplicationReceivedEmail(params: {
  to: string;
  referralCode: string;
  position: number;
}) {
  const { to, referralCode, position } = params;
  const referralLink = `${SITE_URL()}/?ref=${referralCode}`;

  const html = wrap(`
    <tr><td style="padding:40px 32px 24px;text-align:center;">
      ${LOGO_BLOCK}
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#2C2D30;">We got your application.</h1>
      <p style="margin:0;font-size:15px;color:#88898B;line-height:1.6;">
        You're <strong style="color:#2C2D30;">#${position}</strong> in the queue. We're reviewing applications and rolling out access in small batches to keep the network high-quality.
      </p>
    </td></tr>

    <tr><td style="padding:0 32px;">
      <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px;text-align:center;margin-bottom:20px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#92400E;">Want to skip the line?</p>
        <p style="margin:0;font-size:13px;color:#A16207;line-height:1.5;">
          Referrals are the fastest way to get confirmed. The more people join through your link, the higher your priority.
        </p>
      </div>
    </td></tr>

    <tr><td style="padding:0 32px 24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#88898B;">Your personal referral link:</p>
      <div style="background:#F0FDF4;border:1px solid #DCFCE7;border-radius:12px;padding:16px;text-align:center;">
        <a href="${referralLink}" style="font-size:14px;font-weight:600;color:#16A34A;text-decoration:none;word-break:break-all;">
          ${referralLink}
        </a>
      </div>
      <p style="margin:12px 0 0;font-size:13px;color:#88898B;line-height:1.5;">
        Share it on X, Telegram, or with friends who'd be interested. Every signup through your link counts.
      </p>
    </td></tr>

    <tr><td style="padding:0 32px 32px;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#2C2D30;">What happens next:</p>
      <table cellpadding="0" cellspacing="0" style="width:100%;">
        <tr><td style="padding:6px 0;font-size:14px;color:#88898B;line-height:1.5;">
          <span style="color:#16A34A;font-weight:600;">1.</span> We review your application (typically within days)
        </td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#88898B;line-height:1.5;">
          <span style="color:#16A34A;font-weight:600;">2.</span> If confirmed, you'll receive access instructions via email
        </td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#88898B;line-height:1.5;">
          <span style="color:#16A34A;font-weight:600;">3.</span> In the meantime — share your link and move up the queue
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:0 32px 24px;">
      <div style="background:#F9FAFB;border-radius:12px;padding:16px;">
        <p style="margin:0;font-size:13px;color:#88898B;line-height:1.6;">
          <strong style="color:#2C2D30;">Why grovegrove?</strong> We're building a user-owned network that turns idle internet bandwidth into passive rewards. A lightweight browser extension — no hardware, no noise, no impact on your connection. Early participants get the strongest positions as the network grows.
        </p>
      </div>
    </td></tr>

    ${FOOTER_BLOCK}
  `);

  const { error } = await resend.emails.send({
    from: "grovegrove <onboarding@resend.dev>",
    to,
    subject: "Application received — you're #" + position + " in line",
    html,
  });

  if (error) {
    console.error("Application received email failed:", error);
    throw error;
  }
}

export async function sendConfirmationEmail(params: {
  to: string;
  referralCode: string;
  position: number;
}) {
  const { to, referralCode, position } = params;
  const referralLink = `${SITE_URL()}/?ref=${referralCode}`;

  const html = wrap(`
    <tr><td style="padding:40px 32px 24px;text-align:center;">
      ${LOGO_BLOCK}
      <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#2C2D30;">You're in. Welcome to the grove.</h1>
      <p style="margin:0;font-size:15px;color:#88898B;line-height:1.6;">
        Your early access has been confirmed. You're one of the first <strong style="color:#2C2D30;">${position}</strong> people in the network.
      </p>
    </td></tr>

    <tr><td style="padding:0 32px 24px;">
      <p style="margin:0 0 8px;font-size:13px;color:#88898B;">Your referral link still works — keep sharing:</p>
      <div style="background:#F0FDF4;border:1px solid #DCFCE7;border-radius:12px;padding:16px;text-align:center;">
        <a href="${referralLink}" style="font-size:14px;font-weight:600;color:#16A34A;text-decoration:none;word-break:break-all;">
          ${referralLink}
        </a>
      </div>
    </td></tr>

    <tr><td style="padding:0 32px 32px;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#2C2D30;">What happens next:</p>
      <table cellpadding="0" cellspacing="0" style="width:100%;">
        <tr><td style="padding:6px 0;font-size:14px;color:#88898B;line-height:1.5;">
          <span style="color:#16A34A;font-weight:600;">1.</span> We'll send the extension download link when it's ready
        </td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#88898B;line-height:1.5;">
          <span style="color:#16A34A;font-weight:600;">2.</span> Keep sharing your referral link to strengthen your position
        </td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#88898B;line-height:1.5;">
          <span style="color:#16A34A;font-weight:600;">3.</span> The first confirmed participants get the best rank and rewards
        </td></tr>
      </table>
    </td></tr>

    ${FOOTER_BLOCK}
  `);

  const { error } = await resend.emails.send({
    from: "grovegrove <onboarding@resend.dev>",
    to,
    subject: "You're confirmed — welcome to grovegrove",
    html,
  });

  if (error) {
    console.error("Confirmation email failed:", error);
    throw error;
  }
}
