# Cap Lab — Interactive Custom Hat Designer

A 3D custom hat builder. Pick a style and fit, choose colors, drag patches from the
design gallery onto the cap, stitch your own embroidered lettering, spin it around,
and share the result with a link.

## Adding patches

Two ways, both doing the same thing:

- **Drag** a design from the gallery onto the hat. A ring snaps to the nearest
  spot as you move, and a tag tells you where it will land. Only spots currently
  facing you are targetable, so a patch never lands on the hidden side.
- **Tap** a design to drop it on whichever placement is selected.

The hat stops auto-spinning while you drag, then turns to show off the side you
dropped on.

Built as a plain static site — **no build step, no dependencies to install, no
server-side code.** Three.js loads from a CDN via an import map.

```
index.html    markup, import map, fonts
styles.css    all styling
app.js        catalog, 3D geometry, rendering, pricing, sharing
```

## Running it locally

Open `index.html` in a browser. That's it.

Two things only work over `http(s)`, not `file://`:

- **Copy to clipboard** — falls back to a prompt you can copy from.
- **The native share sheet** (`navigator.share`) — falls back to clipboard.

To get those locally, serve the folder over HTTP:

```bash
npx serve .
# or
python -m http.server 8000
```

## Sharing a design

Every design encodes into the URL fragment, so a link is fully self-contained —
there's no database and no stored state:

```
https://your-site/#d=eyJ2IjoxLCJzIjoidHJ1Y2tlciI...
```

A typical link is about 330 characters, short enough for any messaging app.

- **🔗 Copy share link** copies the link (or opens the native share sheet on mobile).
- **📲 Text me this design** shows the message preview with the link included.
- Opening a link loads that hat and clears the fragment, so your own later edits
  aren't undone by a refresh.

Share links carry **only the hat** — style, size, colors, patches, lettering and
quantity. Name, phone number and Access Pass points are never included.

Incoming links are untrusted input and are fully re-validated: unknown styles,
sizes, colors, patch IDs, placements and fonts are replaced with defaults, and
text is clamped to the 3-row / 22-character limit.

## Publishing it

Any static host works. The site uses only relative paths, so it's fine in a
subdirectory (e.g. a GitHub Pages project site at `/cap-lab/`).

### Netlify Drop — fastest, no account needed to try

Go to <https://app.netlify.com/drop> and drag this folder onto the page. You get
a live HTTPS URL in a few seconds.

### GitHub Pages

```bash
git init
git add .
git commit -m "Cap Lab"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then **Settings → Pages → Source: Deploy from a branch → `main` / `root`**.
Live at `https://<you>.github.io/<repo>/` in a minute or two.

### Cloudflare Pages / Vercel

Connect the repo and deploy. When asked for settings:

- Build command: *(leave empty)*
- Output directory: `/` (the repo root)

## Optional polish before you publish

- **Link preview image.** `index.html` has Open Graph tags but no `og:image`, so
  shared links show title and description without a picture. Add a 1200×630 PNG
  and point to it with an absolute URL:
  ```html
  <meta property="og:image" content="https://your-site/preview.png" />
  <meta property="og:url" content="https://your-site/" />
  ```
- **Pin Three.js.** The import map uses `unpkg.com`. It's already pinned to
  `0.160.0`, but for full independence download `three.module.js` plus the
  `examples/jsm` addons used (`OrbitControls`, `RoomEnvironment`) and point the
  import map at local copies.
- **Self-host the fonts** if you'd rather not depend on Google Fonts.

## Notes

- Patch artwork is original Cap Lab art inspired by each sport — not official
  team logos.
- Pricing, Access Pass tiers and the SMS flow are a front-end simulation; no
  messages are actually sent and nothing is charged.
