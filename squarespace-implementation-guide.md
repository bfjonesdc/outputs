# Char's Cookie Jar — Squarespace Implementation Guide

A practical guide for porting either of the two design previews into Squarespace. This is meant for whoever ends up doing the build (Char herself, or whoever helps her).

---

## What this guide is — and isn't

Squarespace doesn't accept a "design file" upload the way WordPress does with themes. There's no single button that turns one of these mockups into a live site.

What we *can* do is reproduce the design inside Squarespace using:

1. **Site Styles** — Squarespace's built-in settings panel (fonts, colors, button shapes, spacing).
2. **Custom CSS** — paste-in stylesheet that overrides defaults and adds the unique design touches.
3. **Sections** (Squarespace 7.1) — build each page out of stock sections, then style them with the CSS above.
4. **Code blocks** — for the few unique elements (animated marquee, retro sign hero, polaroid stack) we drop in custom HTML.

Time estimate: a half-day to a full day per version, depending on how much content already exists.

---

## Before you start

Confirm the site is on **Squarespace 7.1** (not 7.0). Both versions assume 7.1, which is what new Squarespace sites have used since 2020. If the current Char's Cookie Jar site is on 7.0, the Site Styles panel will look different and some of the CSS targeting will need to change. To check: log in → Design → if the panel says "Site Styles" with sections for Colors, Fonts, Buttons, etc., it's 7.1.

You'll also need the existing **commerce setup** preserved — products, prices, and Stripe/Square connection should already be in place. The redesign is purely visual; we're not touching the store backend.

### Asset checklist before building

- Logo (transparent PNG, ~600px tall — the existing CCJ logo is fine)
- Hero photo (the one of Char already on Meet Char works)
- 3 lifestyle photos for the polaroid section (Version 2 only) — also already on the existing site
- Photos for each cookie product (the current site appears to be missing many — these should be re-photographed if possible, but the design works without them)

---

## Version 1 — Modern & Playful

### Site Styles settings

| Setting | Value |
|---|---|
| **Primary font (Headings)** | Fraunces (Google Font) |
| **Body font** | Inter (Google Font) |
| **H1 weight** | 900 |
| **H1 letter spacing** | -0.02em |
| **Background color** | `#fff8f0` (warm cream) |
| **Text color** | `#3d2817` (deep chocolate brown) |
| **Accent / button color** | `#ff5a7d` (coral pink) |
| **Secondary accent** | `#ffd166` (buttery yellow) |
| **Tertiary accent** | `#b3e066` (lime — for badges/eyebrows) |
| **Button shape** | Pill (fully rounded) |
| **Button style** | Solid, no border |
| **Button text** | Uppercase OFF, weight 600 |

In Site Styles → Fonts, add **Fraunces** and **Inter** from the Google Fonts library. Set headings to Fraunces (use the variable axis to push weight to 800–900), body to Inter at 400.

### Custom CSS to paste

Paste this in `Design → Custom CSS`:

```css
/* === Char's Cookie Jar — Modern & Playful === */

:root {
  --ccj-pink: #ff5a7d;
  --ccj-yellow: #ffd166;
  --ccj-cream: #fff8f0;
  --ccj-brown: #3d2817;
  --ccj-lime: #b3e066;
}

/* Smoother headings */
h1, h2 { letter-spacing: -0.02em; line-height: 1.05; }
h1 em, h2 em {
  font-style: italic; color: var(--ccj-pink); position: relative;
}
h1 em::after, h2 em::after {
  content: ""; position: absolute; left: 0; bottom: 6px;
  width: 100%; height: 14px; background: var(--ccj-yellow);
  z-index: -1; border-radius: 4px; transform: rotate(-1deg);
}

/* Pill buttons get a hover lift */
.sqs-block-button-element,
.header-actions a {
  border-radius: 999px !important;
  transition: transform 0.2s ease, background 0.2s ease;
  font-weight: 600;
}
.sqs-block-button-element:hover {
  transform: translateY(-2px);
}

/* Header */
.header { backdrop-filter: blur(12px); }

/* Eyebrow tag style — apply by giving any text block the class "eyebrow" via a code block */
.eyebrow {
  display: inline-block; background: var(--ccj-lime); color: var(--ccj-brown);
  padding: 6px 14px; border-radius: 999px; font-size: 13px; font-weight: 600;
  transform: rotate(-2deg);
}

/* Product grid card hover */
.products-list .grid-item .grid-content {
  transition: transform 0.2s; border-radius: 16px;
}
.products-list .grid-item:hover .grid-content {
  transform: translateY(-4px);
}
.products-list .product-title {
  font-family: 'Fraunces', Georgia, serif;
}

/* Pink section background utility — apply to a section in section settings,
   or add a Code Block with class wrapper */
.section-pink { background: var(--ccj-pink) !important; color: white; }
.section-cream { background: var(--ccj-cream) !important; }
.section-brown { background: var(--ccj-brown) !important; color: var(--ccj-cream); }
```

### Page-by-page build (Version 1)

**Homepage (5 sections)**

1. **Hero section** — Two-column layout. Left column: a small "★ Not your average cookie" eyebrow text (use a Text block, give it the `eyebrow` class via Custom CSS), then H1 "Love at *first bite*." (italicize "first bite" so the CSS underline kicks in), then a sub-paragraph, then two buttons. Right column: a Code Block with the spinning cookie SVG (extractable from the mockup file) OR a high-quality cookie photo cropped to a circle.

2. **Marquee strip** — Single Code Block, full-width, dark brown background. Paste this:
   ```html
   <div style="background:#3d2817;color:#fff8f0;padding:18px 0;overflow:hidden;white-space:nowrap;border-top:4px solid #ff5a7d;border-bottom:4px solid #ff5a7d;">
     <div style="display:inline-block;animation:scroll 30s linear infinite;font-family:'Fraunces',serif;font-size:26px;font-weight:800;font-style:italic;">
       <span style="margin:0 32px;">✦ Fresh Baked</span>
       <span style="margin:0 32px;">✦ Shipped With Love</span>
       <span style="margin:0 32px;">✦ Ingredients Matter</span>
       <!-- repeat 8x for smooth loop -->
     </div>
   </div>
   <style>@keyframes scroll { to { transform: translateX(-50%); } }</style>
   ```

3. **Featured cookies (3-card)** — Use a Summary Block pointed at the Shop, set to 3 items, manual selection. Pick The Monster, Chocolate Chip & Oreo, and Real Reese's PB Cup. Or build it as 3 stock columns, each with image + tag + title + price + button.

4. **Values section** — Dark brown background section. Two columns: left is a big "Ingredients matter." H2; right is a 2x2 grid of value items (small heading + paragraph). Use a Layout block.

5. **Final CTA banner** — Pink full-width section, H2 + button.

**Shop page** — Use Squarespace's built-in Products page. Style is mostly handled by the CSS above. The categories filter (Classics / Signature / Vegan / Seasonal / Specialty) requires tagging products in the Commerce backend with those categories.

**Meet Char** — Two-column section: left is a square image of Char with a pink "★ EST. 2017" badge floating bottom-left (use a stacked Image + Text block, position with CSS); right is the H2 "Meet *Char*", two paragraphs, then a quote card (Quote block styled with pink left border), then a CTA button.

**FAQ** — Use Squarespace's stock Accordion block. Five items.

**Contact** — Pink-background section, two columns: left is contact info (Text block with phone, email, location, social); right is a Form block (white card styling via CSS).

---

## Version 2 — Retro & Nostalgic

### Site Styles settings

| Setting | Value |
|---|---|
| **Primary font (Headings)** | Alfa Slab One (Google Font) |
| **Secondary display** | DM Serif Display Italic (for accents) |
| **Body font** | Karla (Google Font) |
| **H1 weight** | 400 (Alfa Slab is single-weight) |
| **Background color** | `#f5ead7` (aged cream) |
| **Text color** | `#2e1a0e` (deep brown) |
| **Accent / button color** | `#d94b2b` (vintage red) |
| **Secondary accent** | `#e8b43e` (mustard) |
| **Tertiary accent** | `#7a9159` (sage green — used sparingly) |
| **Button shape** | Square / sharp corners |
| **Button style** | Solid + chunky border |
| **Button text** | Uppercase ON, weight 700 |

Add **Alfa Slab One**, **DM Serif Display**, **Karla**, and **Caveat** (handwritten accent) from Google Fonts.

### Custom CSS to paste

```css
/* === Char's Cookie Jar — Retro & Nostalgic === */

:root {
  --ccj-red: #d94b2b;
  --ccj-red-deep: #a93217;
  --ccj-mustard: #e8b43e;
  --ccj-cream: #f5ead7;
  --ccj-brown: #2e1a0e;
  --ccj-sage: #7a9159;
}

/* Subtle dotted background pattern */
body {
  background-image:
    radial-gradient(circle at 25px 25px, rgba(46,26,14,0.06) 2px, transparent 2px),
    radial-gradient(circle at 75px 75px, rgba(46,26,14,0.04) 2px, transparent 2px);
  background-size: 100px 100px;
}

/* Headings get a chunky drop-shadow */
h1, h2 {
  text-shadow: 4px 4px 0 var(--ccj-mustard);
  letter-spacing: 0.5px;
}
h2 { text-shadow: 3px 3px 0 var(--ccj-mustard); }

/* "Chunky retro" buttons with hard shadow */
.sqs-block-button-element,
.header-actions a {
  background: var(--ccj-red) !important;
  color: var(--ccj-cream) !important;
  border: 3px solid var(--ccj-brown) !important;
  border-radius: 0 !important;
  padding: 12px 22px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  font-family: 'Alfa Slab One', serif !important;
  font-size: 13px !important;
  box-shadow: 6px 6px 0 var(--ccj-brown);
  transition: transform 0.15s, box-shadow 0.15s;
}
.sqs-block-button-element:hover {
  transform: translate(3px, 3px);
  box-shadow: 3px 3px 0 var(--ccj-brown);
}

/* Product cards as menu cards with hard shadow */
.products-list .grid-item .grid-content {
  background: var(--ccj-cream) !important;
  border: 3px solid var(--ccj-brown) !important;
  box-shadow: 6px 6px 0 var(--ccj-brown);
  transition: transform 0.15s, box-shadow 0.15s;
}
.products-list .grid-item:hover .grid-content {
  transform: translate(3px, 3px);
  box-shadow: 3px 3px 0 var(--ccj-brown);
}
.products-list .product-title {
  font-family: 'Alfa Slab One', serif !important;
  text-transform: uppercase;
  font-size: 16px !important;
}
.products-list .product-price {
  font-family: 'Alfa Slab One', serif !important;
  color: var(--ccj-red-deep) !important;
}

/* Diagonal stripe section dividers — paste as a Code Block above/below sections */
.stripes {
  height: 24px;
  background: repeating-linear-gradient(45deg, var(--ccj-red) 0 20px, var(--ccj-cream) 20px 40px);
  border-top: 3px solid var(--ccj-brown);
  border-bottom: 3px solid var(--ccj-brown);
}

/* Handwritten "kicker" text for above headings */
.kicker {
  font-family: 'Caveat', cursive; font-weight: 700;
  font-size: 28px; color: var(--ccj-red);
  display: inline-block; transform: rotate(-3deg);
}

/* Header */
.header {
  background: var(--ccj-brown) !important;
  border-bottom: 4px solid var(--ccj-mustard);
}
.header a { color: var(--ccj-cream) !important; }
.header a:hover { color: var(--ccj-mustard) !important; }
```

### Page-by-page build (Version 2)

**Homepage (6 sections)**

1. **Diagonal stripe divider** — Code Block at the very top with `<div class="stripes"></div>`.

2. **Hero section** — Two-column. Left: small bordered eyebrow tag "★ Est. 2017 — Washington, D.C. ★" (Text block); H1 "Love at first *bite.*" (use the chunky drop-shadow from CSS); paragraph; two buttons (Shop + Meet Char). Right: a Code Block containing the "diner sign" SVG/HTML from the mockup, or a single high-quality photo styled with a thick brown border and the mustard "FRESH BAKED DAILY" starburst overlaid (Image block + Code Block positioned absolutely).

3. **Stripe divider** again.

4. **Today's Menu** (featured cookies) — Single Code Block with the chalkboard-style menu list. The "menu board" has a brown background, mustard border, dotted-line price connectors. This needs to be a Code Block — Squarespace's built-in product summary doesn't do this layout natively. Pull the markup directly from `v2-retro-nostalgic.html` (search for `class="menu-board"` and copy that section).

5. **Story strip** — Mustard background full-width section. 4-column grid of "story-item" cards (each is a cream card with brown border, slightly rotated). Numbers 01–04, headings, short copy. Build with a stock Layout section, then apply the rotation/shadow via Custom CSS.

6. **Final CTA** — Brown background, mustard heading text-shadow, single big button.

**Shop page** — Stock Squarespace Products page. The chunky-shadow card styling is handled by the CSS above. The filter chip styling comes free.

**Meet Char** — Red full-width background. Two columns: left is a "polaroid stack" — three Image blocks, each rotated, overlapping, with a Caveat-font caption. Right is the kicker text, H2, paragraphs, and the quote strip (cream background with mustard corner accent).

**FAQ** — Stock Accordion block, but the CSS above will give each item the chunky brown border and hard shadow.

**Contact** — Brown full-width section. Two columns: left is contact info with mustard-square icons; right is a Form block styled as a cream card with mustard border and red-deep hard shadow.

---

## Things you can't reproduce 1:1 in stock Squarespace

A few elements in the mockups would need a custom developer or a Code Block to fully replicate:

- **The animated spinning cookie disc** (V1 hero) — Code Block, copy-paste the SVG/CSS from the mockup file.
- **The marquee strip** (V1) — Code Block.
- **The diner sign hero element** (V2) — Code Block.
- **The polaroid stack with rotation** (V2) — possible with stock Image blocks + Custom CSS targeting their wrappers, but cleaner as a single Code Block.
- **The chalkboard "Today's Menu" card** (V2) — Code Block.
- **The exact starburst/badge shapes** — Code Block with the SVG/clip-path CSS from the mockup.

None of these are dealbreakers — Code Blocks are a first-class Squarespace feature, and the markup is sitting in the preview HTML files ready to copy.

---

## Recommended workflow

1. **Char picks a direction** between V1 and V2 (or asks for a remix of both).
2. **Duplicate the current site** in the Squarespace admin so the live site stays untouched while building.
3. In the duplicate: configure Site Styles per the table above, paste the Custom CSS, build the homepage section by section, then move on to Shop, Meet Char, FAQ, Contact.
4. **Migrate or re-photograph cookie images** — many of the existing product images don't appear to be loading on the current site, which would be the single biggest visual upgrade regardless of which design wins.
5. **QA on mobile** — both designs are responsive, but the way Squarespace stacks columns on mobile sometimes needs section-level tweaks.
6. **Switch the live domain** to the new design when ready.

---

## Files in this delivery

- `v1-modern-playful.html` — open in any browser to preview Version 1
- `v2-retro-nostalgic.html` — open in any browser to preview Version 2
- `squarespace-implementation-guide.md` — this document

Both HTML files are self-contained — no internet needed except for the Google Fonts and the existing Char's Cookie Jar photos hotlinked from her current Squarespace site.
