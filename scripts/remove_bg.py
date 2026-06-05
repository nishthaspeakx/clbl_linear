#!/usr/bin/env python3
"""
remove_bg.py — turn a generated reward asset (object on a plain white studio
background) into a clean transparent PNG.

Strategy: flood-fill the background inward from the image borders. A pixel is
"background-like" if it is bright and low-saturation (white / very light grey
studio sweep + soft shadow). Only background-like pixels that are CONNECTED to
the border become transparent, so light-coloured parts of the object itself
(cream kurta, white sneakers, a white fountain) stay opaque because they are
walled off from the border by the object's darker outline.

Edges are feathered slightly for anti-aliasing, then the image is cropped to the
object's bounding box (with padding) and re-centered on a square canvas so every
reward renders at a consistent scale.

Usage: python3 remove_bg.py in.png out.png [--size 512]
"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage


def remove_bg(in_path: str, out_path: str, out_size: int = 512) -> None:
    img = Image.open(in_path).convert("RGB")
    arr = np.asarray(img).astype(np.int16)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)

    # background-like: bright AND low chroma (white sweep + grey shadow)
    bg_like = (mn > 195) & ((mx - mn) < 28)

    # connected-components; keep only components touching the border
    labels, n = ndimage.label(bg_like)
    border = np.concatenate([
        labels[0, :], labels[-1, :], labels[:, 0], labels[:, -1]
    ])
    border_ids = set(int(x) for x in np.unique(border) if x != 0)
    background = np.isin(labels, list(border_ids)) if border_ids else np.zeros_like(bg_like)

    alpha = np.where(background, 0, 255).astype(np.uint8)

    # feather the alpha edge for clean anti-aliasing
    a_img = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.8))
    rgba = np.dstack([np.asarray(img), np.asarray(a_img)])
    out = Image.fromarray(rgba, "RGBA")

    # crop to object bbox (+pad), recenter on a square transparent canvas
    a = np.asarray(out)[..., 3]
    ys, xs = np.where(a > 12)
    if len(xs) and len(ys):
        x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
        pad = int(0.06 * max(x1 - x0, y1 - y0))
        x0, y0 = max(0, x0 - pad), max(0, y0 - pad)
        x1, y1 = min(out.width, x1 + pad), min(out.height, y1 + pad)
        out = out.crop((x0, y0, x1, y1))

    side = max(out.width, out.height)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(out, ((side - out.width) // 2, (side - out.height) // 2), out)
    canvas = canvas.resize((out_size, out_size), Image.LANCZOS)
    canvas.save(out_path)
    print(f"{in_path} -> {out_path} ({out_size}x{out_size}, {n} comps, bg ids {len(border_ids)})")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    size = 512
    if "--size" in sys.argv:
        size = int(sys.argv[sys.argv.index("--size") + 1])
    remove_bg(args[0], args[1], size)
