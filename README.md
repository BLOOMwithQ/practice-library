# The Practice Library

A small website of personal-development practices. Hosted free on Netlify, stored on GitHub.

## What's in here

All files sit side by side (no folders). This keeps uploading simple.

```
index.html          ← home page (the "shelf" of practices)
money-safety.html   ← Practice No. 01
_template.html      ← copy this to start a new practice
style.css           ← all design: colors, fonts, spacing
practice.js         ← animations, copy buttons, 40-day tracker
README.md           ← this guide

favicon.png, apple-touch-icon.png,
icon-192.png, icon-512.png, site.webmanifest  ← your eggplant "P" icon (tab + phone)
og-home.png, og-money-safety.png              ← link-preview cards (1200 × 630)
```

Live site: https://bloom-money-magnet.netlify.app

## Link previews

When you share a link, apps show the `og:image` named at the top of that page.
New practices use `og-home.png` until you add their own card (1200 × 630 PNG; Canva works well).
Apps keep a saved copy of a preview, so a change can take a while to appear. To refresh Facebook's copy, use
https://developers.facebook.com/tools/debug/

## How it goes live

The GitHub repository `practice-library` is connected to Netlify.
Every time you change a file on GitHub, Netlify updates the live site in about 30 seconds.

## Adding a new practice

1. In GitHub, open `_template.html` → copy all the text.
2. On the repository page choose **Add file → Create new file**, name it (e.g. `worthiness.html`),
   paste, and replace the `[BRACKETED]` text.
3. Give the tracker a unique name: `data-tracker="worthiness"`.
4. Open `index.html` → pencil icon → copy one `<a class="book">` block and point its `href` to your new file.
5. **Commit changes.** Done.

## Updating an existing practice (new versions)

- Edit the file in GitHub (pencil icon), then change `Version 1.0` → `1.1` in the header and footer.
- In the commit message, say what changed, e.g. "v1.1: added Loop section example".
  GitHub keeps every version forever (see the **History** button), so you can always go back.
- Keep the same filename so shared links keep working.

## Changing the look

- Colors are at the top of `style.css`. The eggplant accent is `--accent: #5b2a4e;`.
- Encouragement messages are in `practice.js` under `DAY_MESSAGES` and `MILESTONES`.

## Animations and encouragement

These are automatic on every page. Anything built from the template gets them too.

- Content eases in as readers scroll. An eggplant bar along the header shows reading progress.
- In the tracker, completing a day (morning + evening) brings confetti and a message. Days 7, 14, 21, 30 and 40 get special milestone messages.
- Readers whose device is set to "reduce motion" see no animation. This is intentional.

## Version log

| Version | Date       | Change |
|---------|------------|--------|
| 1.0     | 2026-10-06 | Library launched with *Money Safety* |
| 1.1     | 2026-10-06 | Quince-style redesign (eggplant), larger type, animations and tracker celebrations |
| 1.2     | 2026-10-06 | Flattened to one folder so uploads work cleanly on GitHub |
| 1.3     | 2026-10-06 | Own icon and link-preview cards (replaces Netlify defaults) |
