import sgMail from "@sendgrid/mail";

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY not set");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface SendInviteEmailOptions {
  to: string;
  inviteLink: string;
  teamName: string;
}

export async function sendInviteEmail({
  to,
  inviteLink,
  teamName,
}: SendInviteEmailOptions) {
  const fromEmail = process.env.EMAIL_FROM || "anirva@buyexchange.in";

  const msg = {
    to,
    from: fromEmail,
    subject: `You're invited to join ${teamName}`,
    html: `
      <p>You've been invited to join <strong>${teamName}</strong>.</p>
      <p>Click the button below to accept the invitation:</p>
      <p>
        <a href="${inviteLink}"
           style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;
                  text-decoration:none;border-radius:4px;">
          Accept Invite
        </a>
      </p>
      <p>If the button doesn’t work, open this link:</p>
      <p><a href="${inviteLink}">${inviteLink}</a></p>
    `,
  };

  await sgMail.send(msg);
}
