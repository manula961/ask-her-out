export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const emailToken = process.env.RESEND_API_KEY;
  const emailTo = process.env.NOTIFY_EMAIL || "manula961@gmail.com";

  if (!emailToken) {
    return res.status(500).json({
      ok: false,
      error: "Email service is not configured"
    });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${emailToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Proposal <onboarding@resend.dev>",
        to: [emailTo],
        subject: "💕 SHE SAID YES! — Your Special Moment Just Happened",
        html: `
          <!DOCTYPE html>
          <html>
            <body style="margin:0;padding:0;background:#fff0f5;font-family:Arial,Helvetica,sans-serif;color:#4a2532">
              <div style="padding:40px 16px">
                <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 35px rgba(180,70,110,.15)">
                  <div style="padding:42px 28px 34px;text-align:center;background:linear-gradient(135deg,#ffe4ee,#fff7fa)">
                    <div style="font-size:46px;line-height:1">💗</div>
                    <h1 style="margin:18px 0 8px;font-size:38px;line-height:1.1;color:#d6336c">SHE SAID YES!</h1>
                    <p style="margin:0;font-size:18px;color:#875466">Your special moment just happened. 🥹</p>
                  </div>

                  <div style="padding:34px 30px;text-align:center">
                    <p style="font-size:20px;line-height:1.6;margin:0 0 20px">Someone just clicked</p>
                    <div style="display:inline-block;padding:15px 22px;border-radius:14px;background:#fff0f5;color:#d6336c;font-size:20px;font-weight:bold">
                      “YES! I WILL! 💕”
                    </div>
                    <p style="font-size:17px;line-height:1.7;margin:26px 0 8px;color:#684250">
                      Congratulations! ❤️<br>
                      This could be the beginning of something beautiful.
                    </p>
                    <div style="font-size:30px;letter-spacing:8px;margin-top:24px">💕 💕 💕</div>
                  </div>

                  <div style="padding:18px;text-align:center;background:#fff7fa;color:#9b7180;font-size:13px">
                    Sent by your proposal website 💌
                  </div>
                </div>
              </div>
            </body>
          </html>
        `
      })
    });

    if (!response.ok) {
      console.error("Resend error", await response.text());
      return res.status(502).json({
        ok: false,
        error: "Email provider rejected the message"
      });
    }

    return res.status(200).json({ ok: true, email: true });
  } catch (error) {
    console.error("Notification error", error);
    return res.status(500).json({
      ok: false,
      error: "Could not send notification"
    });
  }
}
