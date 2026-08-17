#!/usr/bin/env python3
"""Split the single-file prototype into a repo-friendly structure.

Takes the self-contained build (photos embedded as base64 data URIs) and emits:
  index.html      markup only, pointing at assets/ and css/ and js/
  css/site.css    the stylesheet
  js/site.js      the router, calendar and review-mode script

Images are NOT re-extracted here. assets/ is generated from the original
photography by scripts/build-assets.py, which produces better files than the
embedded copies. This script only rewrites the references.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(
    "/Users/mini22/Downloads/harbor-lights-prototype-v2.html"
)

# embedded key -> assets/ filename produced by build-assets.py
ASSET_MAP = {
    "wed_wide_1": "wed-wide-1",
    "wed_wide_2": "wed-wide-2",
    "wed_tall": "wed-tall",
    "wed_detail": "food-charcuterie",
    "food_lobster": "food-lobster",
    "food_spread": "food-spread",
    "food_tacos": "food-tacos",
    "food_fish": "food-fish",
    "food_salad": "food-salad",
    "food_pretzel": "food-pretzel",
    "food_sliders": "food-sliders",
    "food_menu": "food-menu",
    "badge_ww_2026": "badge-ww-2026",
    "badge_ww_2025": "badge-ww-2025",
    "badge_knot_2026": "badge-knot-2026",
    "badge_knot_2025": "badge-knot-2025",
}

PIXEL = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="


def main() -> None:
    html = SRC.read_text(encoding="utf-8")

    # 1. pull out the stylesheet
    css = re.search(r"<style>(.*?)</style>", html, re.S).group(1).strip()
    html = re.sub(
        r"<style>.*?</style>",
        '<link rel="stylesheet" href="css/site.css">',
        html,
        flags=re.S,
    )

    # 2. pull out the script, dropping the inlined image map
    script = re.search(r"<script>(.*?)</script>\s*</body>", html, re.S).group(1)
    script = re.sub(r"^\s*window\.INLINE_IMAGES = \{.*?\};\n", "", script, flags=re.S)
    script = script.strip()
    html = re.sub(
        r"<script>.*?</script>(\s*</body>)",
        r'<script src="js/site.js"></script>\1',
        html,
        flags=re.S,
    )

    # 3. point <img> tags at real files instead of the data-uri placeholder
    def swap(m: re.Match) -> str:
        key = m.group(1)
        if key not in ASSET_MAP:
            raise SystemExit(f"no asset mapping for '{key}'")
        return f'src="assets/{ASSET_MAP[key]}.webp"'

    html, n = re.subn(rf'data-img="([a-z0-9_]+)" src="{re.escape(PIXEL)}"', swap, html)

    (ROOT / "css").mkdir(exist_ok=True)
    (ROOT / "js").mkdir(exist_ok=True)
    (ROOT / "index.html").write_text(html, encoding="utf-8")
    (ROOT / "css/site.css").write_text(css + "\n", encoding="utf-8")
    (ROOT / "js/site.js").write_text(script + "\n", encoding="utf-8")

    print(f"index.html    {len(html) // 1024:>4} KB   ({n} image references rewritten)")
    print(f"css/site.css  {len(css) // 1024:>4} KB")
    print(f"js/site.js    {len(script) // 1024:>4} KB")


if __name__ == "__main__":
    main()
