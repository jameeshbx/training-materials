import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendInviteEmail(to: string, token: string) {
  const inviteURL = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/${token}`;

  const message = {
    to,
    from: process.env.SENDGRID_SENDER_EMAIL!,
    subject: "You're Invited 🎉",
    text: `Click to join: ${inviteURL}`,
    html: `
      <h2>🎉 You've been invited</h2>
      <p>Click below to accept invitation:</p>
      <a href="${inviteURL}" style="padding:10px 20px;background:#007bff;color:white;border-radius:6px;text-decoration:none;">
        Accept Invite
      </a>
     
     
    `
  };

  try {
    console.log("📨 Sending email to:", to);
    const result = await sgMail.send(message);
    console.log("✅ Email sent result:", result);
  } catch (err: any) {
    console.error("❌ SENDGRID ERROR:", err.response?.body || err.message);
  }
}
