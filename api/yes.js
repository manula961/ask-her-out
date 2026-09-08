export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const emailToken = process.env.RESEND_API_KEY;
  const emailTo = process.env.NOTIFY_EMAIL || "manula961@gmail.com";
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM_NUMBER;
  const smsTo = process.env.NOTIFY_PHONE || "+94777984699";

  const results = { email: false, sms: false };

  try {
    if (emailToken) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${emailToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Proposal <onboarding@resend.dev>",
          to: [emailTo],
          subject: "💕 SHE SAID YES!",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;text-align:center">
              <h1 style="font-size:36px">She said YES! 💕</h1>
              <p style="font-size:18px">Someone just clicked <strong>YES! I WILL! 💕</strong> on your proposal.</p>
              <p style="font-size:16px">Your special moment just happened. 🥹❤️</p>
            </div>
          `
        })
      });

      if (response.ok) results.email = true;
      else console.error("Resend error", await response.text());
    }

    if (twilioSid && twilioToken && twilioFrom) {
      const body = new URLSearchParams({
        To: smsTo,
        From: twilioFrom,
        Body: "💕 SHE SAID YES! She just clicked YES! I WILL! on your proposal. 🥹❤️"
      });

      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body
        }
      );

      if (response.ok) results.sms = true;
      else console.error("Twilio error", await response.text());
    }

    if (!results.email && !results.sms) {
      return res.status(500).json({ ok: false, error: "Notification services are not configured" });
    }

    return res.status(200).json({ ok: true, ...results });
  } catch (error) {
    console.error("Notification error", error);
    return res.status(500).json({ ok: false, error: "Could not send notification" });
  }
}
