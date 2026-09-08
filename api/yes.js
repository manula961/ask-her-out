export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const token = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL || "manula961@gmail.com";

  if (!token) {
    return res.status(500).json({ ok: false, error: "Email service is not configured" });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Proposal <onboarding@resend.dev>",
        to: [to],
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

    const data = await response.json();
    if (!response.ok) {
      console.error("Resend error", data);
      return res.status(502).json({ ok: false, error: "Email provider rejected the message" });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Notification error", error);
    return res.status(500).json({ ok: false, error: "Could not send notification" });
  }
}
