#!/usr/bin/env python3
"""
Turn raw paper / newsprint scans into neutral "detail maps" for the paper-collage kit.

A detail map is a greyscale image centred on 50% grey. Only the *structure* of the scan
survives (creases, halftone dots, flecks, print ghosting). The scan's own colour and
brightness are removed, so you can lay the map over any base colour with
`mix-blend-mode: soft-light | overlay | multiply` and get that structure without a colour cast.

Usage
  python tools/collage/prep_textures.py --src assets/textures --out public/collage/textures   (run from motion/)

Dependencies: pillow, numpy, scipy
"""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

Image.MAX_IMAGE_PIXELS = None


# name -> (source file glob, output width px, high-pass sigma px (at output size), contrast strength)
RECIPES: dict[str, tuple[str, int, float, float]] = {
    # wrinkled grey paper: soft creases. Ground + notes.
    "ground-wrinkle": ("Texturelabs_Paper_345XL*", 2560, 45, 0.16),
    # newspaper with ghosted print: very subtle column/line structure for the ground.
    "ground-newsprint": ("Texturelabs_Paper_377XL*", 2560, 55, 0.13),
    # dirty paper: flecks, stains, ink specks. Use sparsely.
    "ground-flecks": ("Texturelabs_Paper_347XL*", 2560, 70, 0.14),
    # newsprint halftone, dot pitch scaled to about 3.3 px. Photo cut-outs, ink wear.
    "halftone-fine": ("Texturelabs_Grunge_354XL*", 1020, 14, 0.20),
    # same with a crease and cloudy ink density. More character.
    "halftone-grunge": ("Texturelabs_Grunge_356XL*", 1100, 14, 0.20),
    # crumpled cream paper: strong relief. Notes, tags, cut-out borders.
    "paper-crumple": ("sj-objio-*", 1600, 40, 0.20),
}


def load_gray(path: Path, width: int) -> np.ndarray:
    im = Image.open(path).convert("L")
    scale = width / im.width
    im = im.resize((width, round(im.height * scale)), Image.LANCZOS)
    return np.asarray(im, dtype=np.float32) / 255.0


def detail_map(gray: np.ndarray, sigma: float, strength: float) -> np.ndarray:
    hp = gray - gaussian_filter(gray, sigma)
    hp /= hp.std() + 1e-6
    return np.clip(0.5 + hp * strength, 0.0, 1.0)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True, type=Path)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    for name, (pattern, width, sigma, strength) in RECIPES.items():
        matches = sorted(args.src.glob(pattern))
        if not matches:
            print(f"skip {name}: nothing matches {pattern}")
            continue
        gray = load_gray(matches[0], width)
        out = detail_map(gray, sigma, strength)
        dest = args.out / f"{name}.jpg"
        Image.fromarray((out * 255).astype(np.uint8), "L").save(dest, quality=90, optimize=True)
        print(f"{name}: {out.shape[1]}x{out.shape[0]}  {dest.stat().st_size // 1024} KB  from {matches[0].name}")


if __name__ == "__main__":
    main()
