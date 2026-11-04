#!/usr/bin/env python3
"""
WCAG contrast check using the AISSS grading from the visual identity guide (page 9).

  python contrast.py "#111111" "#F4EFE6"      # foreground, background (hex, or a palette name)
  python contrast.py Strand Paper
  python contrast.py --approved                # the 12 pairs the guide approves for type

Grades: AAA >= 7 · AA >= 4.5 · Large only >= 3 (18pt, or 14pt bold, short line) · Do not set type < 3.
No dependencies.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

TOKENS = json.loads((Path(__file__).resolve().parents[1] / "tokens.json").read_text(encoding="utf-8"))
PALETTE = {c["name"].lower(): c["hex"] for c in TOKENS["colors"]}


def rgb(value: str) -> tuple[int, int, int]:
    value = PALETTE.get(value.lower(), value).lstrip("#")
    return int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16)


def luminance(value: str) -> float:
    def ch(c: int) -> float:
        v = c / 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4

    r, g, b = rgb(value)
    return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b)


def ratio(fg: str, bg: str) -> float:
    hi, lo = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def grade(r: float) -> str:
    if r >= 7:
        return "AAA"
    if r >= 4.5:
        return "AA"
    if r >= 3:
        return "Large only"
    return "Do not set type"


def main() -> None:
    args = sys.argv[1:]
    if args == ["--approved"]:
        for p in TOKENS["approvedTypePairs"]:
            print(f'{p["fg"]:>6} on {p["bg"]:<10} {p["ratio"]:>5}:1  {p["grade"]:<4}  {p["role"]}')
        return
    if len(args) != 2:
        print(__doc__)
        sys.exit(2)
    r = ratio(args[0], args[1])
    print(f"{args[0]} on {args[1]}: {r:.1f}:1  {grade(r)}")


if __name__ == "__main__":
    main()
