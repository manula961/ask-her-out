<h1 align="center">💌 Ask Her Out — One Little Question</h1>

<p align="center"><strong>An animated letter, a little question, and a confetti finale.</strong></p>

<p align="center">
  <img src="docs/readme-cover.svg" alt="Ask Her Out project illustration" width="1120">
</p>

<p align="center"><a href="#what-the-site-does">What the site does</a> · <a href="#run-locally">Run locally</a> · <a href="#deploy">Deploy</a></p>

## What the site does

**💌 Open the letter → 💬 Reveal the question → 🎉 Celebrate with confetti**

The responsive mini-site includes a moving **No** button and an optional sound toggle.

## Run locally

Open [index.html](index.html) in a browser, or serve the repository root with `python -m http.server 8000`.

## Deploy

| Static hosting | Vercel + Resend |
| --- | --- |
| Hosts the full visual experience. | Adds an optional acceptance email via [the API handler](api/yes.js). Set `RESEND_API_KEY` and `NOTIFY_EMAIL` on the server. |

[HTML](index.html) · [Styles](style.css) · [Interactions](script.js)
