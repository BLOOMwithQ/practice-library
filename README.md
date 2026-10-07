# The Practice Library

A small website of personal-development practices. Hosted free on Netlify, stored on GitHub.

## What's in here

```
index.html                 ← home page (the "shelf" of practices)
assets/style.css           ← all design: colors, fonts, spacing
assets/practice.js         ← copy buttons + 40-day tracker
practices/money-safety.html
practices/_template.html   ← copy this to start a new practice
README.md                  ← this guide
```

## One-time setup (GitHub + Netlify)

1. **GitHub:** sign in → **New repository** → name it `practice-library` → Create.
2. On the new repo page, click **uploading an existing file**. Drag in *everything inside* this folder
   (index.html, README.md, and the `assets` and `practices` folders) → **Commit changes**.
3. **Netlify:** sign in → **Add new site → Import an existing project → GitHub** → pick `practice-library`.
   Leave Build command empty and Publish directory empty → **Deploy**.
4. Netlify gives you a link like `random-name.netlify.app`. Rename it under **Site configuration → Change site name**.

From then on, every time you change a file on GitHub, Netlify updates the live site in about 30 seconds.

## Adding a new practice

1. In GitHub, open `practices/_template.html` → copy all the text.
2. In `practices/`, choose **Add file → Create new file**, name it (e.g. `worthiness.html`), paste, and replace the `[BRACKETED]` text.
3. Give the tracker a unique name: `data-tracker="worthiness"`.
4. Open `index.html` → pencil icon → copy one `<a class="book">` block and point it to your new file.
5. **Commit changes.** Done.

## Updating an existing practice (new versions)

- Edit the file in GitHub (pencil icon), then change `Version 1.0` → `1.1` in the header and footer.
- In the commit message, say what changed, e.g. "v1.1: added Loop section example".
  GitHub keeps every version forever (see the **History** button), so you can always go back.
- Keep the same filename so shared links keep working.

## Animations and encouragement

These are automatic on every page. Anything built from the template gets them too.

- Content eases in as readers scroll. An eggplant bar along the header shows reading progress.
- In the tracker, completing a day (morning + evening) brings confetti and a message. Days 7, 14, 21, 30 and 40 get special milestone messages.
- To change the wording, open `assets/practice.js` and edit `DAY_MESSAGES` or `MILESTONES` near the middle of the file.
- Readers whose device is set to "reduce motion" see no animation. This is intentional.

## Version log

| Version | Date       | Change |
|---------|------------|--------|
| 1.0     | 2026-10-06 | Library launched with *Money Safety* |
| 1.1     | 2026-10-06 | Quince-style redesign (eggplant), larger type, animations and tracker celebrations |
