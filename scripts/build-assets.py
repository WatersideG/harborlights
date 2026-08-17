#!/usr/bin/env python3
"""Generate web-ready assets for the Harbor Lights prototype.

Reads the original photography from Dropbox and writes sized, EXIF-corrected
WebP files into assets/. Re-run after replacing any source image.
"""
from PIL import Image, ImageOps
from pathlib import Path

SRC = Path(
    "/Users/mini22/Library/CloudStorage/Dropbox-WatersideGroup"
    "/Brands/Harbor Lights/Harbor-Lights-Website"
)
OUT = Path(__file__).resolve().parent.parent / "assets"

# key: (source filename, longest edge in px, webp quality)
PHOTOS = {
    "wed-wide-1":       ("GiannaPalazzoMediaHarborLightsRI-036.jpg", 1400, 74),
    "wed-wide-2":       ("GiannaPalazzoMediaHarborLightsRI-037.jpg", 1400, 74),
    "wed-tall":         ("GiannaPalazzoMediaHarborLightsRI-033.jpg", 1100, 70),
    "food-charcuterie": ("Tezza-3085.JPG", 1000, 68),
    "food-lobster":     ("photo (18).JPG", 1000, 72),
    "food-spread":      ("photo (20).JPG", 1000, 66),
    "food-tacos":       ("photo (23).JPG", 900, 68),
    "food-fish":        ("photo (21).JPG", 900, 72),
    "food-salad":       ("photo (19).JPG", 900, 68),
    "food-pretzel":     ("photo (17).JPG", 900, 68),
    "food-sliders":     ("photo (22).JPG", 900, 66),
    "food-menu":        ("photo (16).JPG", 1000, 72),
}

BADGES = {
    "badge-knot-2026": "BOW-The-Knot-2026-Badge.png",
    "badge-knot-2025": "bow-2025-badge.png",
    "badge-ww-2026":   "badge-weddingawards_en_US (1).png",
    "badge-ww-2025":   "badge-weddingawards_en_US.png",
}


def main() -> None:
    OUT.mkdir(exist_ok=True)
    total = 0
    for key, (name, longest, quality) in PHOTOS.items():
        im = ImageOps.exif_transpose(Image.open(SRC / name)).convert("RGB")
        im.thumbnail((longest, longest), Image.LANCZOS)
        dest = OUT / f"{key}.webp"
        im.save(dest, "WEBP", quality=quality, method=6)
        size = dest.stat().st_size
        total += size
        print(f"{key:18} {im.size[0]:>5}x{im.size[1]:<5} {size // 1024:>4} KB")

    for key, name in BADGES.items():
        im = ImageOps.exif_transpose(Image.open(SRC / name)).convert("RGBA")
        im.thumbnail((320, 320), Image.LANCZOS)
        dest = OUT / f"{key}.webp"
        im.save(dest, "WEBP", quality=88, method=6)
        size = dest.stat().st_size
        total += size
        print(f"{key:18} {im.size[0]:>5}x{im.size[1]:<5} {size // 1024:>4} KB")

    print(f"\n{len(PHOTOS) + len(BADGES)} files, {total // 1024} KB total")


if __name__ == "__main__":
    main()
