# Cap Lab — Rebuild Prompt

Paste everything below into a new session to rebuild this app from scratch.
It consolidates every requirement given across the original build, including
the corrections and refinements made along the way.

---

## THE PROMPT

Build **Cap Lab**, an interactive 3D custom hat designer web app that helps a
customer design a ball cap. Make it **fun, bold and playful** in design.

### Tech constraints

- Static site, **no build step**: `index.html`, `styles.css`, `app.js`, `README.md`.
- **Three.js r160** via CDN import map (`https://unpkg.com/three@0.160.0/build/three.module.js`),
  plus `OrbitControls` and `RoomEnvironment` from `three/addons`.
- All hat geometry and all artwork generated **procedurally** — no model files,
  no image assets, no npm dependencies.
- Must run correctly from both `file://` and plain HTTP.

### 1. Hat styles and fits

Four selectable styles, each with its own price, fabric, spec sheet and blurb:

| Style | Name | Price | Fit / Crown / Bill / Closure |
|---|---|---|---|
| `clubhouse` | '47 Classic Clean Up | $31.99 | Unstructured · Low crown · Curved bill · Buckle |
| `flatbill` | Custom 9FIFTY Snapback | $34.99 | Structured · High crown · Flat bill · Snapback |
| `trucker` | 112 Trucker | $24.99 | Structured · Mid crown · Normal bill · Snapback (mesh back) |
| `fitted` | Full Court Fitted | $34.99 | Structured · Mid crown · Curved bill · Fitted |

Each style carries tuning params that actually change the 3D mesh:
`crownHeight`, `crown {k, frontRise, frontBulge, seam, slouch, panel}`,
`structured`, `bill {length, droop, curl, tilt, width, thickness}`,
`meshBack`, `strap`.

### 2. Sizes

Adjustable: **S/M, M/L, L/XL**. Fitted: **7, 7¼, 7⅜, 7⅝**.
Each has a scale factor that visibly resizes the hat. Only show the size set
that matches the selected style's closure (fitted styles hide adjustable sizes).

### 3. Colors

Separate swatch rows for **crown**, **bill**, **mesh** (trucker only) and
**accent/button**. Each style exposes its own 8-color subset of the core palette:

Midnight Navy `#13224a` · Jet Black `#15151a` · Bone White `#f3ead9` ·
Heather Gray `#9aa0ab` · Fire Red `#d7263d` · Court Orange `#f3712b` ·
Pop Pink `#ff4f9a` · Turf Green `#1e7f4f` · Ice Blue `#8ed8f8` ·
Royal Purple `#6a3df0` · Sunbeam `#ffcf33` · Cocoa Tan `#c9a279`

**Critical color requirements (these were bugs that had to be fixed):**

- Every color must render **solid and uniform across the entire crown** — no
  banding, no dark half, no smeared seam.
  - Set `THREE.RepeatWrapping` on the crown and bill `CanvasTexture`s. The
    trucker front panel is built from a phi range centered on zero, so its UVs
    run roughly `[-0.169, +0.169]` — exactly 50% outside `[0,1]`. With the
    default `ClampToEdgeWrapping`, column 0 (a dark panel seam) smears across
    half the panel.
  - Keep the **color map nearly flat** (contrast ≈ 0.3) and put all weave/seam
    detail in the **bump map** at full strength. A color map multiplies the
    chosen hue, so contrast there becomes unwanted color variation. Target an
    albedo spread under ~12%.
  - Do not bake a bottom-darkening gradient into the crown color map.
- The **bill must be one solid color across its whole surface**, top and
  underside — not half one shade. Three.js material groups must be
  **contiguous index-buffer slices**, or the bill splits visually.

### 4. Realistic 3D hat

The model must genuinely read as a hat from every angle:

- Six-panel crown with visible panel seams and a top button.
- A real curved/flat bill with thickness, droop, curl and tilt per style.
- Sweatband, stitched eyelets, and the correct closure: buckle strap, snapback
  with snap teeth, or a clean fitted band.
- Trucker renders actual mesh-look back panels.
- Procedural twill weave bump mapping so fabric looks like fabric.
- `RoomEnvironment` IBL for realistic lighting. Note: `scene.environmentIntensity`
  does **not** exist in r160 — use per-material `envMapIntensity`.

**Interaction:** `OrbitControls` so the user can spin the hat freely — front,
back, left, right. Provide quick-view buttons (Front / Left / Right / Back /
Top) that animate the camera, plus an auto-spin toggle.

### 5. Patch gallery

Patches the customer can add while designing, modeled on the **Custom Lids
design gallery** (<https://customlids.com/pages/design-gallery>) — organized by
theme, with original procedurally-drawn art:

**Mascots, Stars, Faith, Sports, Nature, Space, Fun, Heritage, Parks** —
roughly 60 patches total, including NBA/NFL/soccer/MLB-flavored sports motifs
(hoops crest, end-zone celebration, supporters scarf, bullpen glove, dino
basketball/football/soccer/hockey/baseball).

- Each patch draws as a canvas texture: shield / circle / rounded-rect body, an
  embroidered **merrow border**, emoji art and an optional block-letter label.
- Stars render as true two-tone multi-point stars (4, 5, 6 and 8 point).
- Category filter chips + a search box.
- **Placements:** Front, Left Side, Right Side, Back, Bill — one patch per spot.
- **Drag and drop patches directly onto the 3D hat**, in addition to tap-to-apply:
  - Use **pointer events**, not HTML5 drag-and-drop, so mouse, pen and touch all
    share one code path.
  - Track `pointermove`/`pointerup` on **`window`**, not on the card — a fast
    flick leaves the card before it ever fires a move event, and the drag would
    be swallowed.
  - Start the drag past an 8px threshold so a plain click still works as the
    tap-to-apply shortcut; suppress the click that follows a real drag.
  - On touch, treat a mostly-vertical swipe as the user scrolling the gallery
    and let it through (`touch-action: pan-y` on the card).
  - Resolve the drop target by projecting every placement anchor to screen space
    and taking the nearest one, **culling anchors whose surface normal faces away
    from the camera** so a patch can't land on the hidden side of the hat.
  - Show live feedback: a cursor-following ghost of the patch, a "Drop on
    {placement}" tag, and a pulsing ring in 3D snapped to the target anchor
    (scaled by `hatGroup.scale × anchor.scale`, oriented to the surface normal).
  - Pause auto-rotate during the drag so the target can't drift; on a successful
    drop fly the camera to that side and fire confetti. On a miss, restore the
    previous spin state and apply nothing.
  - Keep the drop ring in `scene`, not `hatGroup` — rebuilding the hat clears
    and disposes every `hatGroup` child.
- **Decoration methods** with upcharges: Embroidered $0, Print Stitch +$2,
  Woven +$3, Sublimated +$3, Metflex +$5, Leather +$5, PVC/Rubber +$5,
  Chenille +$6.

### 6. Custom embroidery — its own separate section

Break embroidery out from patches into a **dedicated section** where the user
picks, independently:

- **Thread color** — swatch row from the core palette (use a real color dot, not
  a 🧵 emoji, since emoji ignore CSS `color`).
- **Their own text** — a textarea they type into.
- **Font** — 8 choices, live-previewed in the actual face:
  Varsity Block (Archivo Black), Athletic (Graduate), Condensed (Bebas Neue),
  Script (Pacifico), Marker (Permanent Marker), Classic Serif (Playfair
  Display), Tech (Rajdhani), Rounded (Baloo 2).
- **Size** — Small (0.72×) / Medium (1.0×) / Large (1.28×).
- **Placement** — Front, Left Side, Right Side, or Back (not the bill).

**Stackable text:** lettering stacks into rows, e.g. `EST.` over `2026`.
Max **3 lines × 22 characters**. Include a "+ Stack a line" button and block
Enter at the limit. Texture height, mesh height and the patch-collision offset
must all scale with row count so **glyph size stays constant** — stacking makes
the block taller, not smaller. Show a row-aware character counter and an
adaptive live preview canvas.

Guard the first render behind `document.fonts.ready` so baked lettering never
renders in a fallback face. Never interpolate user text into `innerHTML` —
build DOM nodes.

### 7. Lids Access Pass — points and rewards

The customer enters their loyalty / Access Pass points and sees a real rewards
panel:

- **200 points = one $10 reward.**
- Tiers: **Basic**, upgrading to **Premium at 1,000 points**, with a progress
  bar and "X pts to Premium".
- Show points balance, rewards available, and "N pts to your next reward".
- +/- stepper to apply rewards to the order, clamped so you can't discount below
  $0 or spend rewards you don't have.
- Live price breakdown with rewards shown as a credit line.

### 8. Pricing

Base style price + decoration upcharge. **First decorated side $4, each
additional decorated side $10** — a patch and text on the *same* side counts
once (union of decorated sides, not a sum). Quantity support with a **10% bulk
discount at 5+**. Then subtract Access Pass rewards.

### 9. Save, text and share

- A "text me my design" flow: the user enters a name and phone, and gets a
  formatted SMS-style summary of the build (style, size, colors, patches,
  lettering, price breakdown, Access Pass status) so they can save it for later
  or share the idea with friends.
- **Real share links.** Encode the entire design into the URL fragment as
  `#d=<base64url>` — fully self-contained, no backend. Use `TextEncoder` /
  `TextDecoder` so unicode and emoji survive the round trip. On boot, read
  `#d=`, apply it, then `history.replaceState` to clean the URL, and fire
  confetti. Include a Share button and a copy-link box.
- **Security:** run every incoming share token through the same
  `normalizeDesign()` validator used for localStorage restore — validate colors,
  sizes, placements, clamp quantity, slice the name. Hostile or corrupt tokens
  must be rejected without throwing. The customer's **name and points must never
  be encoded into the share token.**
- Persist the in-progress design to `localStorage`.
- Clipboard API and `navigator.share` are blocked on `file://` — provide
  `execCommand('copy')` / prompt fallbacks.

### 10. UI / UX

- Bold, playful, neo-brutalist styling — thick borders, hard shadows, bright
  accent colors, chunky buttons.
- Live order summary, a "Surprise me" randomizer, and a reset.
- Confetti is for *moments*, not edits — fire it when a design is shared/texted and
  when someone arrives from a share link, never on every color or patch change.
- Include a global `[hidden] { display: none !important; }` rule — without it,
  modals and conditional blocks leak through and a pop-up can get stuck on
  screen with no way to dismiss it.
- Every modal needs a working close button, backdrop click and Escape key.
- Add description, theme-color, emoji favicon, and OG/Twitter meta tags.

### 11. Team colorways strip (under the hat)

- The center column is a flex column: the 3D stage **grows to fill** the leftover
  height and a colorway strip is pinned beneath it. Don't give the stage a fixed
  height with `align-items: start`, or tall screens get dead space under the hat.
  Give the column a `min-height` floor so short viewports scroll instead of
  overflowing.
- ~20 one-tap colorways grouped into Hoops / Football / Baseball / Soccer tabs, in
  a horizontally scrolling row. Each is a small cap glyph (crown color on top, bill
  below, accent dot on the squatchee) plus a name.
- One tap sets crown + bill + accent + mesh together. Show a pressed state when the
  current design matches a colorway exactly.
- Name them for the **city or the colorway, not the club** — same reasoning as
  shipping original patch motifs instead of real logos.
- A Hide/Show toggle that collapses the strip, persisted to `localStorage`. The 3D
  viewport should already be driven by a `ResizeObserver`, so collapsing it
  re-renders at the new height with no extra wiring.
- **Important interaction with the per-style palettes:** colorways deliberately use
  hexes outside a style's eight stock swatches. So the swatch grids must append
  whatever color is currently active if it isn't already in the list, otherwise
  nothing shows as selected. Once that's in place, stop resetting crown/bill when
  the user switches fits — colors should carry across.

### 12. Light and dark mode

- A **🌙 Dark / ☀️ Light** chip button in the top bar, next to auto-spin / reset /
  surprise-me. It toggles `document.documentElement.dataset.theme`.
- Default to the OS preference via `matchMedia('(prefers-color-scheme: dark)')`.
  Once the user presses the button, persist the choice to
  `localStorage['caplab.theme']` and stop following the OS from then on.
- **No-flash requirement:** resolve the theme in a small *inline, synchronous*
  `<script>` in `<head>` placed **before** the stylesheet link. The main script is
  a deferred ES module, so wiring the theme there alone makes dark users see a
  white flash on every load.
- Drive everything from CSS custom properties: a `:root` block of semantic tokens
  and a `[data-theme="dark"]` block that overrides them. Also set `color-scheme`
  on both so native form controls and scrollbars match. Do not hardcode surface
  colors in individual rules.
- Token groups that matter: `--ink` / `--on-ink`, `--paper`, `--surface` 1–4,
  `--hairline`, `--invert-bg` / `--invert-fg`, accent pops, the Access Pass navy
  set, `--stage-bg`, the background blobs, `--scrim`, and `--shadow-color`.
- Three traps worth calling out explicitly:
  - **`--on-bright` must NOT flip.** Yellow / cyan / lime fills stay bright in
    both themes, so text on them is always dark. Affects pressed pills, pressed
    style cards, pressed font buttons, chip hover, steppers, the modal close
    button and the alt CTA.
  - **`--invert-bg` / `--invert-fg` need to exist** for panels that are
    intentionally dark in light mode (order summary, grand total, phone header,
    drag ghost tag). If they just used `--ink` they'd invert to near-white in dark
    mode and their yellow accent text would be unreadable.
  - **Hard shadows need their own `--shadow-color`**, near-black in dark mode. If
    they reuse `--ink` the 6px offset shadows become near-white in dark mode and
    the whole neo-brutalist look falls apart.
- **Do not theme the 3D lighting.** This is a product designer — the hat's colors
  must read identically in both modes. Only the CSS stage backdrop changes (the
  renderer is created with `alpha: true`). The one exception: dial back the black
  ground-shadow planes in dark mode so they don't turn to mud.
- Also update the `theme-color` meta tag when the theme changes.

---

## Gotchas worth repeating to the rebuilder

1. `CanvasTexture` defaults to `ClampToEdgeWrapping` — any geometry with UVs
   outside `[0,1]` silently smears the edge column. Set `RepeatWrapping`.
2. Three.js material groups must be contiguous index-buffer slices.
3. `scene.environmentIntensity` doesn't exist in r160 — use `envMapIntensity`.
4. Color maps multiply the hue; keep them flat and push detail to the bump map.
5. Bake text only after `document.fonts.ready`.
6. Treat share-link input as fully untrusted.
