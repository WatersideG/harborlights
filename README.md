# Harbor Lights — website prototype v2

Reference build for the Harbor Lights (Warwick, RI) website rebuild. This is a
working prototype for the development team to build against, not production
code. It demonstrates the revised page architecture, content placement and
conversion paths agreed in the August 2026 review.

Open `index.html` in a browser. No build step, no dependencies.

## What this is for

The v1 prototype was reviewed for information architecture, content inventory
and messaging placement across the four business verticals: Weddings & Events,
Golf, Marina, and the Par & Tackle restaurant. This build carries every
direction from that review plus the client notes of August 15.

**Toggle "Show change notes"** in the lower corner to annotate the page with
what changed and why. Each note is keyed to a numbered item in the action lists
(`docs/action-lists-rev2.pdf`).

## Structure

```
index.html              all 23 routes, hash-based
css/site.css            design tokens and layout
js/site.js              router, calendar, review mode
assets/                 photography, generated (see below)
docs/                   review documents
scripts/                asset and build helpers
```

## Assets

`assets/` is generated, not hand-maintained. Source photography lives in
Dropbox at `Brands/Harbor Lights/Harbor-Lights-Website`. To regenerate:

```
python3 scripts/build-assets.py
```

That script handles EXIF orientation, sizing and WebP conversion. Replace a
source image and re-run rather than editing files in `assets/` directly.

Stock photography of the property (aerials, docks, course, pool) still loads
from the v1 deployment at `harbor-lights.vercel.app`. Those references need
replacing with local or CMS-hosted files before this goes anywhere permanent.

## What is deliberately unfinished

Content the client has not yet supplied is marked in amber on the page as
`confirm` or `awaiting content` rather than filled with plausible filler:

- Event capacity by space and layout (three conflicting figures exist today)
- 2026 golf and marina rate cards (current figures carried from production)
- Seasonal hours for every outlet
- Ralph's Golf Special details
- Department heads for the team page
- Catering offerings (page ships unpublished by design)
- Jingle Mingle date — December 13, 2026 is a Sunday, not a Friday
- Travel lift capacity — 50-ton and 70-ton both appear in current materials

## Notes for the development team

The production build is Payload CMS on Next.js. Several things in this
prototype exist to demonstrate CMS structure rather than markup:

- Rate cards, hours and menus should be structured collections, not rich text
- Calendar filter state persists in the URL so Back works and a filtered view
  can be shared
- Calendar thumbnails preserve the uploaded image's aspect ratio, no fixed crop
- The catering page must be genuinely unpublished: out of nav, sitemap and
  search, publishable without a redeploy
- Footer action links should be driven by the nav collection, not hardcoded

Full detail in `docs/action-lists-rev2.pdf`.
