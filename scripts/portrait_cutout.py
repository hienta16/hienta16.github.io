#!/usr/bin/env python3
"""Cut Hien's portrait renders out of their green backdrop and ship them as small transparent WebP files.

    python scripts/portrait_cutout.py --src D:/hienta16-review/portrait-sources
    python scripts/portrait_cutout.py --src <folder> --check     # also save checker previews next to the sources

The portrait is a 3D art-toy render made with an image model from the owner's own photos (front, looking left,
looking right), each on a flat green backdrop. The source images and photos never enter this repository; only the
cut-outs below do:

    public/art/hien-front.webp   default: facing the visitor, glancing toward the cat
    public/art/hien-left.webp    when the pointer is on the left
    public/art/hien-right.webp   when the pointer is on the right

What the script does, per image:
1. measures the backdrop from the border (median colour), so a slightly different green per render is fine;
2. keys by "green excess" (G above max(R, B)), which the brown hair, warm skin, black tweed and gold never have,
   with a soft ramp so hair tips get partial alpha;
3. un-mixes the backdrop from edge pixels and removes green spill (G is capped at max(R, B));
4. crops all views to one shared square, so they line up when the website switches between them.
Requires numpy and Pillow (a dev tool; it never runs in CI or in the browser).
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image

SITE = Path(__file__).resolve().parent.parent
OUT = SITE / "public" / "art"
VIEWS = {"front": "front.png", "left": "view-a.png", "right": "view-b.png"}
SIZE = 720  # px, square; shown at up to ~460 css px, so this covers 1.5x screens
EXCESS_BG, EXCESS_FG = 70.0, 22.0  # green excess: at or above BG is backdrop, at or below FG is subject


def cut(path: Path) -> np.ndarray:
    """RGBA float array (0..1) with the backdrop keyed out."""
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float64)
    border = np.concatenate([rgb[:10].reshape(-1, 3), rgb[-10:].reshape(-1, 3), rgb[:, :10].reshape(-1, 3), rgb[:, -10:].reshape(-1, 3)])
    bg = np.median(border, axis=0)
    excess = rgb[..., 1] - np.maximum(rgb[..., 0], rgb[..., 2])
    alpha = np.clip((EXCESS_BG - excess) / (EXCESS_BG - EXCESS_FG), 0.0, 1.0)
    alpha = np.clip((alpha - 0.04) / 0.96, 0.0, 1.0)  # a hair tighter, so no green halo survives
    # un-mix the backdrop from partly covered pixels: c = a*fg + (1-a)*bg
    a = np.maximum(alpha, 1e-3)[..., None]
    fg = np.where(alpha[..., None] > 0.02, (rgb - (1 - a) * bg) / a, rgb)
    fg = np.clip(fg, 0, 255)
    fg[..., 1] = np.minimum(fg[..., 1], np.maximum(fg[..., 0], fg[..., 2]))  # no green spill
    return np.concatenate([fg / 255.0, alpha[..., None]], axis=2)


def shared_box(layers: list[np.ndarray], pad: float = 0.03) -> tuple[int, int, int, int]:
    """One square crop that holds every view, so switching views never shifts the figure."""
    ys, xs = [], []
    for layer in layers:
        y, x = np.nonzero(layer[..., 3] > 0.05)
        ys += [y.min(), y.max()]
        xs += [x.min(), x.max()]
    top, bottom, left, right = min(ys), max(ys), min(xs), max(xs)
    side = int(max(bottom - top, right - left) * (1 + 2 * pad))
    cx, cy = (left + right) / 2, (top + bottom) / 2
    x0, y0 = int(cx - side / 2), int(cy - side / 2)
    return x0, y0, x0 + side, y0 + side


def to_image(layer: np.ndarray, box: tuple[int, int, int, int]) -> Image.Image:
    rgba = (np.clip(layer, 0, 1) * 255).round().astype(np.uint8)
    img = Image.fromarray(rgba, "RGBA")
    return img.crop(box).resize((SIZE, SIZE), Image.LANCZOS)


def checker(img: Image.Image) -> Image.Image:
    """The cut-out over the site's blue and over a dark floor, to spot halos."""
    w, h = img.size
    out = Image.new("RGBA", (w * 2, h))
    for i, colour in enumerate(((36, 99, 246, 255), (18, 20, 42, 255))):
        bg = Image.new("RGBA", (w, h), colour)
        bg.alpha_composite(img)
        out.paste(bg, (i * w, 0))
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--src", type=Path, required=True, help="folder with front.png, view-a.png (left), view-b.png (right)")
    ap.add_argument("--out", type=Path, default=OUT)
    ap.add_argument("--check", action="store_true", help="save checker previews into the source folder")
    args = ap.parse_args(argv)
    layers = {name: cut(args.src / file) for name, file in VIEWS.items()}
    box = shared_box(list(layers.values()))
    args.out.mkdir(parents=True, exist_ok=True)
    for name, layer in layers.items():
        img = to_image(layer, box)
        dest = args.out / f"hien-{name}.webp"
        img.save(dest, quality=90, method=6)
        print(f"wrote {dest} ({dest.stat().st_size // 1024} kB)")
        if args.check:
            checker(img).convert("RGB").save(args.src / f"check-{name}.png")


if __name__ == "__main__":
    main()
