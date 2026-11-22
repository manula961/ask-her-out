# Ask Her Out — One Little Question

A responsive mini-site that unfolds through a series of screens, from a greeting to a letter reveal and a final question. The front end uses plain HTML, CSS, and JavaScript. A Vercel API handler can send an email notification when the visitor selects **Yes**.

## What the site does

- Guides visitors through an animated sequence of screens.
- Moves the **No** button and shows a different prompt as visitors interact with it.
- Plays a confetti animation on acceptance, with optional synthesized sound controlled by a page toggle.

## Run locally

Open [index.html](index.html) in a browser to try the visual flow, or serve the repository root locally.

```sh
python -m http.server 8000
```

Open <http://localhost:8000>. A static server runs the front end. Email delivery requires the serverless handler and Resend configuration. The fonts are loaded from Google Fonts when available.

## Deploy

For the visual experience, publish the repository as a static site. To enable email notifications on Vercel, configure `RESEND_API_KEY` and `NOTIFY_EMAIL` in the deployment environment and use a sender permitted by your Resend account. The browser sends a `POST` request to `/api/yes` on acceptance. Test delivery with an inbox you control.

| File | Role |
| --- | --- |
| [index.html](index.html) | Presentation, screens, and controls |
| [style.css](style.css) | Layout, transitions, and animation |
| [script.js](script.js) | Screen changes, button movement, celebration, and sound |
| [api/yes.js](api/yes.js) | Vercel handler that sends the acceptance notification through Resend |
