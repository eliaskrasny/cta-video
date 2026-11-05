#!/usr/bin/env python3
"""
Bake a photo into a photocopy-style paper cut-out sticker (static PNG).

What it does
  1. Trims the photo to its alpha bounds and scales it to `world_width * scale` px.
  2. Greyscale + contrast, then reproduces tone as a real halftone: the dot structure comes from
     a scanned newsprint halftone (detail map from prep_textures.py), so dots cluster and grow
     the way printed ink does.
  3. Grows a hand-torn white border around the alpha: the border thickness is a smooth
     noise field (gentle bulges + a little paper-fibre detail; `tear` sets how much), with a soft fibre edge,
     faint scanned paper relief on the white, a darker rim at the outer edge and a contact shadow
     next to the photo.
  4. Adds a soft drop shadow and writes RGBA.

Because the result is baked, nothing about it moves between frames. Same seed = same tear.

Usage
  python tools/collage/bake_cutout.py --config tools/collage/cutouts.json --src assets/photos --textures public/collage/textures --out public/collage/cutouts   (run from motion/)
  python tools/collage/bake_cutout.py --image photo.png --name thing --world-width 160 --src assets/photos --textures public/collage/textures --out public/collage/cutouts

Dependencies: pillow, numpy, scipy
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, gaussian_filter

INK = np.array([27, 24, 20], dtype=np.float32) / 255
PHOTO_PAPER = np.array([239, 235, 226], dtype=np.float32) / 255
BORDER_PAPER = np.array([252, 250, 244], dtype=np.float32) / 255
SHADOW = np.array([58, 40, 22], dtype=np.float32) / 255


def fractal(shape: tuple[int, int], rng: np.random.Generator, octaves: list[tuple[float, float]]) -> np.ndarray:
    """Sum of blurred white noise. octaves = [(sigma_px, weight), ...]. Returns ~unit variance."""
    out = np.zeros(shape, dtype=np.float32)
    norm = 0.0
    for sigma, weight in octaves:
        n = gaussian_filter(rng.standard_normal(shape).astype(np.float32), sigma)
        n /= n.std() + 1e-6
        out += weight * n
        norm += weight * weight
    return out / np.sqrt(norm)


def load_detail(path: Path) -> np.ndarray:
    return np.asarray(Image.open(path).convert("L"), dtype=np.float32) / 255.0


def crop_wrap(tex: np.ndarray, h: int, w: int, rng: np.random.Generator) -> np.ndarray:
    th, tw = tex.shape
    oy, ox = int(rng.integers(0, th)), int(rng.integers(0, tw))
    rows = (np.arange(h) + oy) % th
    cols = (np.arange(w) + ox) % tw
    return tex[np.ix_(rows, cols)]


def equalise(a: np.ndarray) -> np.ndarray:
    """Rank-equalise to uniform 0..1 so tone reproduction is exact."""
    flat = a.ravel()
    order = np.argsort(flat, kind="stable")
    ranks = np.empty_like(order)
    ranks[order] = np.arange(flat.size)
    return (ranks / (flat.size - 1)).reshape(a.shape).astype(np.float32)


def bake(
    image_path: Path,
    out_path: Path,
    textures: Path,
    world_width: float,
    scale: float = 2.4,
    border: float = 7.0,
    seed: int = 1,
    contrast: float = 1.3,
    halftone: str = "halftone-fine",
    halftone_mix: float = 0.7,
    shadow_opacity: float = 0.34,
    tear: float = 0.5,
) -> dict:
    rng = np.random.default_rng(seed)

    # ---- load + trim + scale ----
    im = Image.open(image_path).convert("RGBA")
    bbox = im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    im = im.crop(bbox)
    sw = round(world_width * scale)
    sh = round(im.height * sw / im.width)
    im = im.resize((sw, sh), Image.LANCZOS)
    B = border * scale

    pad = int(B * 2.1 + 26)
    W, H = sw + 2 * pad, sh + 2 * pad
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    canvas.paste(im, (pad, pad))
    arr = np.asarray(canvas, dtype=np.float32) / 255.0
    rgb, alpha = arr[..., :3], arr[..., 3]
    subject = alpha > 0.5

    # ---- photo: greyscale -> contrast -> real halftone ----
    lum = rgb @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
    g = np.clip((lum - 0.5) * contrast + 0.5, 0, 1)
    g = g ** 1.08
    ink_amount = 1.0 - g
    ht = load_detail(textures / f"{halftone}.jpg")
    ht = crop_wrap(ht, H, W, rng)
    d = 1.0 - equalise(ht)  # dot centres high
    soft = 0.14
    ink_ht = np.clip((d - (1.0 - ink_amount)) / soft + 0.5, 0, 1)
    ink = halftone_mix * ink_ht + (1 - halftone_mix) * ink_amount
    photo = PHOTO_PAPER[None, None, :] * (1 - ink[..., None]) + INK[None, None, :] * ink[..., None]

    # ---- torn border ----
    dist_out = distance_transform_edt(~subject).astype(np.float32)  # px from subject, outside
    broad = fractal((H, W), rng, [(B * 3.0, 1.0), (B * 1.4, 0.35)])
    jag = fractal((H, W), rng, [(3.2, 1.0)])
    # `tear` 0 = a clean, even cut border; 0.5 = hand-torn but tidy (default); 1 = very ragged
    thickness = B * (1.0 + 0.5 * tear * broad) + 0.14 * tear * B * jag
    thickness = np.clip(thickness, B * 0.6, B * 1.5)
    f = dist_out - thickness  # <0 inside the border
    fibre = fractal((H, W), rng, [(1.0, 1.0)])
    edge_soft = 1.5 * scale / 2.4
    border_a = np.clip(-f / edge_soft + 0.5 + 0.25 * tear * fibre, 0, 1)
    border_a = np.maximum(border_a, subject.astype(np.float32))

    # border colour: paper white + scanned relief + darker rim + contact shadow
    relief = load_detail(textures / "paper-crumple.jpg")
    relief = crop_wrap(relief, H, W, rng)
    bcol = BORDER_PAPER[None, None, :] * (1.0 + (relief[..., None] - 0.5) * 0.12)
    depth = np.clip(-f, 0, None)
    rim = np.clip(1.0 - depth / (2.6 * scale / 2.4), 0, 1)
    bcol = bcol * (1.0 - 0.05 * rim[..., None])
    contact = np.clip(1.0 - dist_out / (3.0 * scale / 2.4), 0, 1)
    bcol = bcol * (1.0 - 0.10 * contact[..., None])

    # composite photo over border
    pm = np.clip(alpha, 0, 1)[..., None]
    col = bcol * (1 - pm) + photo * pm
    a_total = np.maximum(border_a, alpha)

    # ---- drop shadow ----
    sh_dy = int(round(3.0 * scale))
    sh_dx = int(round(0.6 * scale))
    shadow_a = np.roll(np.roll(a_total, sh_dy, axis=0), sh_dx, axis=1)
    shadow_a = gaussian_filter(shadow_a, 1.7 * scale) * shadow_opacity

    out_a = a_total + shadow_a * (1 - a_total)
    out_rgb = (col * a_total[..., None] + SHADOW[None, None, :] * (shadow_a * (1 - a_total))[..., None]) / np.maximum(out_a[..., None], 1e-5)
    out = np.dstack([np.clip(out_rgb, 0, 1), np.clip(out_a, 0, 1)])
    Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA").save(out_path, optimize=True)
    return {"width": W, "height": H, "pad": pad, "scale": scale, "subjectWidth": sw, "subjectHeight": sh}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--config", type=Path, help="JSON: {name: {file, worldWidth, seed, border?, contrast?, halftone?}}")
    ap.add_argument("--image", type=Path)
    ap.add_argument("--name")
    ap.add_argument("--world-width", type=float)
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--border", type=float, default=7.0)
    ap.add_argument("--scale", type=float, default=2.4)
    ap.add_argument("--tear", type=float, default=0.5, help="0 clean cut .. 1 very ragged")
    ap.add_argument("--src", type=Path, default=Path("."))
    ap.add_argument("--textures", type=Path, required=True)
    ap.add_argument("--out", type=Path, required=True)
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    jobs: dict[str, dict] = {}
    if args.config:
        jobs = json.loads(args.config.read_text())
    elif args.image and args.name and args.world_width:
        jobs[args.name] = {"file": str(args.image), "worldWidth": args.world_width, "seed": args.seed, "border": args.border, "tear": args.tear}
    else:
        ap.error("give --config, or --image + --name + --world-width")

    manifest_path = args.out / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    for name, job in jobs.items():
        info = bake(
            args.src / job["file"],
            args.out / f"{name}.png",
            args.textures,
            world_width=job["worldWidth"],
            scale=job.get("scale", args.scale),
            border=job.get("border", args.border),
            seed=job.get("seed", 1),
            contrast=job.get("contrast", 1.3),
            halftone=job.get("halftone", "halftone-fine"),
            tear=job.get("tear", args.tear),
        )
        manifest[name] = info
        print(name, info)
    manifest_path.write_text(json.dumps(manifest, indent=2))


if __name__ == "__main__":
    main()
