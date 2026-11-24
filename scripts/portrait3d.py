#!/usr/bin/env python3
"""Render Hien's portrait as a stylised 3D bust: a soft art-toy sculpt, ray-marched in pure Python + numpy.

    python scripts/portrait3d.py                 # final renders into public/art/ (open + blink frames, WebP)
    python scripts/portrait3d.py --preview       # quick low-resolution render into the current folder
    python scripts/portrait3d.py --size 600      # output width in px (height is 6/5 of it)

Nothing here is a photograph or a mesh. The head is sculpted from signed-distance shapes (ellipsoids, capsules,
smooth unions), so every form is rounded and clean like a clay or vinyl toy:
- a round face with full cheeks and a soft chin, a small rounded nose, a small closed smile with glossy rose lips;
- smiling dark-brown eyes with a short, natural lash line (no long liner), soft brows half under the bangs;
- dark hair with volume at the crown, curtain bangs parted at the centre, face-framing locks that flick out at the
  jaw, and a longer layer behind the shoulders;
- the black tweed jacket with gold buttons from her photos.

Lighting is a soft studio setup: a warm key from the upper left, a cool fill, a rim light from behind, ambient
occlusion and soft shadows; skin gets a little light scattering (warm terminator) and blush; eyes and lips get gloss.
The output is a transparent PNG the website places in its frame. Requires numpy and Pillow (dev tool only; it never
runs in CI or in the browser).
"""

from __future__ import annotations

import argparse
import math
import os
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image

SITE = Path(__file__).resolve().parent.parent

# ── colours (linear-ish sRGB 0..1; converted at the end) ──
def hexc(h: str) -> np.ndarray:
    return np.array([int(h[i : i + 2], 16) / 255 for i in (1, 3, 5)]) ** 2.2


SKIN = hexc("#F8D3BF")
BLUSH = hexc("#EE9A9C")
LIP = hexc("#D9707A")
HAIR = hexc("#2A2022")
HAIR_SHEEN = hexc("#7A6058")
BROW = hexc("#3A2A26")
EYE_WHITE = hexc("#FFFBF7")
IRIS = hexc("#3B241D")
IRIS_LIT = hexc("#7A4E3C")
PUPIL = hexc("#120A09")
LASH = hexc("#221616")
JACKET = hexc("#1F1D25")
GOLD = hexc("#E2A548")

# material ids
M_SKIN, M_HAIR, M_EYE, M_LIP, M_BROW, M_JACKET, M_GOLD = range(7)


# ── signed-distance helpers (vectorised over N points, p: (N, 3)) ──
def length(v):
    return np.sqrt(np.einsum("ij,ij->i", v, v))


def sphere(p, c, r):
    return length(p - c) - r


def ellipsoid(p, c, r):
    q = (p - c) / r
    k0 = length(q)
    k1 = length(q / r)
    return k0 * (k0 - 1.0) / np.maximum(k1, 1e-6)


def capsule(p, a, b, r):
    pa = p - a
    ba = np.asarray(b) - np.asarray(a)
    h = np.clip(pa @ ba / (ba @ ba), 0.0, 1.0)
    return length(pa - h[:, None] * ba) - r


def round_cone(p, a, b, ra, rb):
    """A capsule whose radius goes from ra (at a) to rb (at b): good for locks of hair that taper."""
    pa = p - a
    ba = np.asarray(b) - np.asarray(a)
    h = np.clip(pa @ ba / (ba @ ba), 0.0, 1.0)
    return length(pa - h[:, None] * ba) - (ra + (rb - ra) * h)


def smin(a, b, k):
    h = np.maximum(k - np.abs(a - b), 0.0) / k
    return np.minimum(a, b) - h * h * k * 0.25


def smax(a, b, k):
    return -smin(-a, -b, k)


def rot_y(p, deg):
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    x, y, z = p[:, 0], p[:, 1], p[:, 2]
    return np.stack([c * x + s * z, y, -s * x + c * z], axis=1)


def rot_z(p, deg, centre=(0.0, 0.0, 0.0)):
    a = math.radians(deg)
    c, s = math.cos(a), math.sin(a)
    q = p - np.asarray(centre)
    x, y, z = q[:, 0], q[:, 1], q[:, 2]
    return np.stack([c * x - s * y, s * x + c * y, z], axis=1) + np.asarray(centre)


def mirror_x(p):
    q = p.copy()
    q[:, 0] = np.abs(q[:, 0])
    return q


# ── the sculpture ──
EYE_C = np.array([0.31, -0.07, 0.6])  # right eye centre (the left mirrors it)
EYE_R = 0.2
GAZE = np.array([0.06, -0.02, 1.0]) / np.linalg.norm([0.06, -0.02, 1.0])
HEAD_TURN = 5.0  # degrees around y: a slight three-quarter view
HEAD_TILT = -3.0  # degrees around z: toward the cat


def head_space(p):
    """World → head coordinates (the head is turned and tilted a little; the body is not)."""
    q = rot_z(p, -HEAD_TILT, centre=(0, -1.2, 0))
    return rot_y(q, -HEAD_TURN)


def lid_cut(q, blink):
    """Upper-lid plane offset along its normal: higher = more eye shows."""
    return -0.125 if blink else 0.02  # closed: the upper lid comes down to meet the lower one


def scene(p, blink=False, want_mat=False):
    q = head_space(p)
    qm = mirror_x(q)

    # skin: cranium, face, full cheeks, soft chin
    d = ellipsoid(q, np.array([0.0, 0.18, -0.06]), np.array([0.9, 0.98, 0.93]))
    d = smin(d, ellipsoid(q, np.array([0.0, -0.3, 0.16]), np.array([0.8, 0.76, 0.76])), 0.35)
    d = smin(d, sphere(qm, np.array([0.38, -0.36, 0.46]), 0.34), 0.28)
    d = smin(d, ellipsoid(q, np.array([0.0, -0.84, 0.36]), np.array([0.36, 0.26, 0.34])), 0.32)
    # soft eye sockets
    d = smax(d, -sphere(qm, EYE_C + np.array([0.0, 0.0, 0.1]), 0.2), 0.1)
    # nose: a short bridge and a small round tip
    nose = capsule(q, np.array([0.0, -0.08, 0.84]), np.array([0.0, -0.3, 0.93]), 0.042)
    nose = smin(nose, sphere(q, np.array([0.0, -0.33, 0.935]), 0.08), 0.08)
    nose = smin(nose, sphere(qm, np.array([0.075, -0.37, 0.89]), 0.05), 0.06)
    d = smin(d, nose, 0.1)
    # ears (mostly under the hair)
    d = smin(d, ellipsoid(qm, np.array([0.86, -0.12, -0.02]), np.array([0.1, 0.2, 0.12])), 0.08)
    # neck
    d = smin(d, capsule(p, np.array([0.0, -0.7, -0.08]), np.array([0.0, -2.2, -0.08]), 0.3), 0.12)
    # the smile line, carved: corners a little higher than the middle
    smile = np.minimum(
        capsule(qm, np.array([0.0, -0.625, 0.92]), np.array([0.1, -0.61, 0.9]), 0.009),
        capsule(qm, np.array([0.1, -0.61, 0.9]), np.array([0.17, -0.575, 0.84]), 0.009),
    )
    d_skin = smax(d, -smile, 0.015)

    # lips (glossy rose), kept small
    lq = q.copy()
    lq[:, 1] -= 1.6 * lq[:, 0] ** 2  # bend the mouth into a smile: corners up
    lips = smin(
        ellipsoid(lq, np.array([0.0, -0.605, 0.872]), np.array([0.15, 0.026, 0.04])),
        ellipsoid(lq, np.array([0.0, -0.645, 0.862]), np.array([0.12, 0.034, 0.042])),
        0.02,
    )
    lips = smax(lips, -smile, 0.01)

    # eyes, and the lids around them
    eye = sphere(qm, EYE_C, EYE_R)
    shell = np.abs(sphere(qm, EYE_C, EYE_R + 0.012)) - 0.012
    up = np.array([0.0, 0.94, -0.33])
    rel = qm - EYE_C
    upper = smax(shell, -(rel @ up - lid_cut(q, blink)), 0.01)
    low = np.array([0.0, -0.9, -0.42])
    lower = smax(shell, -(rel @ low - 0.075), 0.01)
    d_skin = smin(d_skin, np.minimum(upper, lower), 0.02)

    # brows, soft, half under the bangs
    brow = capsule(qm, np.array([0.12, 0.22, 0.84]), np.array([0.3, 0.26, 0.81]), 0.024)
    brow = smin(brow, capsule(qm, np.array([0.3, 0.26, 0.81]), np.array([0.46, 0.22, 0.71]), 0.02), 0.03)

    # hair: crown and back, carved open where the face is, then bangs and locks
    h = ellipsoid(q, np.array([0.0, 0.26, -0.1]), np.array([1.05, 1.1, 1.04]))
    back = ellipsoid(p, np.array([0.0, -0.95, -0.45]), np.array([1.05, 1.35, 0.42]))
    h = smin(h, back, 0.35)
    side = round_cone(qm, np.array([0.8, 0.3, 0.3]), np.array([0.74, -0.86, 0.36]), 0.25, 0.17)
    h = smin(h, side, 0.25)
    flick = ellipsoid(qm, np.array([0.94, -0.94, 0.28]), np.array([0.24, 0.15, 0.19]))
    h = smin(h, flick, 0.18)
    low_flick = ellipsoid(mirror_x(p), np.array([1.02, -1.62, -0.25]), np.array([0.3, 0.16, 0.26]))
    h = smin(h, low_flick, 0.25)
    window = ellipsoid(q, np.array([0.0, -0.48, 1.02]), np.array([0.72, 1.02, 0.92]))
    h = smax(h, -window, 0.07)
    # curtain bangs: one sweep each way from a centre parting, ending by the cheekbones
    bq = rot_z(qm, 30.0, centre=(0.0, 0.62, 0.9))
    bang = ellipsoid(bq, np.array([0.3, 0.47, 0.84]), np.array([0.42, 0.13, 0.15]))
    bang = smin(bang, round_cone(qm, np.array([0.48, 0.3, 0.78]), np.array([0.66, -0.12, 0.62]), 0.1, 0.035), 0.1)
    h = smin(h, bang, 0.12)
    # a soft parting line

    # jacket: shoulders with a round neckline, two gold buttons
    jacket = ellipsoid(p, np.array([0.0, -2.26, -0.15]), np.array([1.5, 0.62, 0.62]))
    jacket = smax(jacket, -capsule(p, np.array([0.0, -1.2, -0.08]), np.array([0.0, -3.0, -0.08]), 0.36), 0.05)
    jacket = smin(jacket, ellipsoid(p, np.array([0.0, -1.68, -0.1]), np.array([0.5, 0.25, 0.48])), 0.25)
    jacket = smax(jacket, -capsule(p, np.array([0.0, -1.0, -0.08]), np.array([0.0, -3.0, -0.08]), 0.31), 0.03)
    gold = np.minimum(sphere(p, np.array([0.12, -1.86, 0.5]), 0.045), sphere(p, np.array([0.14, -2.26, 0.6]), 0.045))

    parts = [d_skin, h, eye, lips, brow, jacket, gold]
    dist = parts[0]
    for x in parts[1:]:
        dist = np.minimum(dist, x)
    if not want_mat:
        return dist
    mat = np.argmin(np.stack(parts, axis=1), axis=1)
    return dist, mat


def normal(p, blink):
    e = 1.5e-3
    out = np.zeros_like(p)
    for i in range(3):
        o = np.zeros(3)
        o[i] = e
        out[:, i] = scene(p + o, blink) - scene(p - o, blink)
    return out / np.maximum(length(out)[:, None], 1e-9)


def march(ro, rd, blink, t0=4.0, t1=11.0, steps=110):
    t = np.full(len(rd), t0)
    hit = np.zeros(len(rd), dtype=bool)
    alive = np.ones(len(rd), dtype=bool)
    for _ in range(steps):
        idx = np.nonzero(alive)[0]
        if len(idx) == 0:
            break
        d = scene(ro + rd[idx] * t[idx, None], blink)
        t[idx] += d * 0.9
        done = d < 4e-4
        hit[idx[done]] = True
        alive[idx[done | (t[idx] > t1)]] = False
    return t, hit


def soft_shadow(p, l, blink, k=5.0):
    res = np.ones(len(p))
    t = np.full(len(p), 0.03)
    for _ in range(36):
        d = scene(p + l * t[:, None], blink)
        res = np.minimum(res, np.clip(k * d / t, 0, 1))
        t += np.clip(d, 0.02, 0.2)
    return np.clip(res, 0, 1) ** 1.5


def occlusion(p, n, blink):
    occ = np.zeros(len(p))
    for i in range(1, 6):
        h = 0.04 * i
        occ += (h - scene(p + n * h, blink)) / (2.0**i)
    return np.clip(1.0 - 3.0 * occ, 0, 1)


def norm(v):
    v = np.asarray(v, dtype=float)
    return v / np.linalg.norm(v)


KEY = norm([-0.55, 0.65, 0.6])
FILL = norm([0.7, 0.05, 0.7])
RIM = norm([0.35, 0.45, -0.8])


def shade(p, rd, blink):
    n = normal(p, blink)
    _, mat = scene(p, blink, want_mat=True)
    q = head_space(p)
    qm = mirror_x(q)
    v = -rd
    ndl = n @ KEY
    shadow = soft_shadow(p + n * 2e-3, KEY, blink)
    ao = occlusion(p, n, blink)
    col = np.zeros((len(p), 3))

    base = np.zeros((len(p), 3))
    base[mat == M_SKIN] = SKIN
    base[mat == M_HAIR] = HAIR
    base[mat == M_LIP] = LIP
    base[mat == M_BROW] = BROW
    base[mat == M_JACKET] = JACKET
    base[mat == M_GOLD] = GOLD

    # blush on the cheeks, and a touch on the nose tip
    cheek = np.exp(-(length(qm - np.array([0.42, -0.36, 0.72])) ** 2) / 0.03)
    nose_tip = np.exp(-(length(q - np.array([0.0, -0.33, 1.0])) ** 2) / 0.006)
    m = mat == M_SKIN
    base[m] = base[m] * (1 - 0.7 * cheek[m, None]) + BLUSH * 0.7 * cheek[m, None]
    base[m] = base[m] * (1 - 0.25 * nose_tip[m, None]) + BLUSH * 0.25 * nose_tip[m, None]

    # the lash line: a short dark edge along the upper lid, a tiny lift at the outer corner (no long liner)
    rel = qm - EYE_C
    up = np.array([0.0, 0.94, -0.33])
    edge = np.abs(rel @ up - lid_cut(q, blink))
    near_eye = length(rel) < EYE_R + 0.05
    lash = m & near_eye & (edge < 0.022) & (rel[:, 2] > 0.02)
    base[lash] = LASH
    lower_edge = np.abs(rel @ np.array([0.0, -0.9, -0.42]) - 0.075)
    base[m & near_eye & (lower_edge < 0.008) & (rel[:, 2] > 0.06)] = base[m & near_eye & (lower_edge < 0.008) & (rel[:, 2] > 0.06)] * 0.8

    # eyes: white, a dark-brown iris lit from below, a pupil
    e = mat == M_EYE
    if e.any():
        dirv = rel[e] / np.maximum(length(rel[e])[:, None], 1e-9)
        cosang = dirv @ GAZE
        col_e = np.tile(EYE_WHITE, (e.sum(), 1))
        iris = cosang > math.cos(0.8)
        lit = np.clip((dirv[:, 1] * -1 + 0.2) * 1.6, 0, 1)[:, None]
        col_e[iris] = (IRIS * (1 - lit) + IRIS_LIT * lit)[iris]
        col_e[cosang > math.cos(0.36)] = PUPIL
        base[e] = col_e

    # lighting
    wrap = np.where(m | (mat == M_LIP), 0.45, 0.2)
    diff = np.clip((ndl + wrap) / (1 + wrap), 0, 1) * (0.55 + 0.45 * shadow)
    fill = np.clip(n @ FILL, 0, 1) * 0.28
    sky = (0.5 + 0.5 * n[:, 1]) * 0.22
    fres = (1 - np.clip(np.einsum('ij,ij->i', n, v), 0, 1)) ** 3
    rim = fres * np.clip(n @ RIM + 0.4, 0, 1) * 0.9
    light = diff[:, None] * np.array([1.0, 0.96, 0.9]) + fill[:, None] * np.array([0.85, 0.9, 1.0]) + sky[:, None] * ao[:, None]
    col = base * light * (0.55 + 0.45 * ao[:, None])
    col[mat == M_EYE] = base[mat == M_EYE] * (0.35 + 0.75 * np.clip(diff[mat == M_EYE], 0, 1))[:, None]
    # skin scattering: a warm glow where light turns away
    sss = np.exp(-((ndl - 0.05) ** 2) / 0.05) * 0.12
    col[m] += (np.array([0.9, 0.35, 0.25]) * sss[m, None])
    # rim light, warm on hair, soft on skin
    col += rim[:, None] * np.where((mat == M_HAIR)[:, None], np.array([0.55, 0.38, 0.3]), np.array([0.35, 0.3, 0.3])) * ao[:, None]

    # speculars
    hvec = KEY + v
    hvec /= np.maximum(length(hvec)[:, None], 1e-9)
    ndh = np.clip(np.einsum('ij,ij->i', n, hvec), 0, 1)
    spec = np.zeros(len(p))
    spec[m] = ndh[m] ** 40 * 0.08
    lp = mat == M_LIP
    spec[lp] = ndh[lp] ** 70 * 0.45
    spec[e] = ndh[e] ** 300 * 3.0
    hr = mat == M_HAIR
    # a soft sheen band on the hair, the way a sculpted toy catches the light
    spec[hr] = ndh[hr] ** 18 * 0.35
    g = mat == M_GOLD
    spec[g] = ndh[g] ** 60 * 1.5
    col += (spec * shadow)[:, None]
    col[hr] += (HAIR_SHEEN * (ndh[hr] ** 6 * 0.25 * shadow[hr])[:, None])
    # a catchlight in each eye
    if e.any():
        dirs = rel[e] / np.maximum(length(rel[e])[:, None], 1e-9)
        ids = np.nonzero(e)[0]
        col[ids[dirs @ norm([-0.32, 0.3, 0.9]) > 0.985]] = np.array([1.0, 1.0, 1.0]) * 1.3
        col[ids[dirs @ norm([0.2, -0.2, 0.96]) > 0.996]] = np.array([1.0, 1.0, 1.0]) * 0.9

    # tweed: a fine weave on the jacket
    j = mat == M_JACKET
    if j.any():
        weave = 0.75 + 0.25 * (np.sin(p[j, 0] * 260) * np.sin(p[j, 1] * 260) > 0.2)
        col[j] *= weave[:, None]
    return col


def render_band(args):
    y0, y1, W, H, blink, ss = args
    cam = np.array([0.0, -0.4, 7.6])
    target = np.array([0.0, -0.5, 0.0])
    fwd = norm(target - cam)
    right = norm(np.cross(fwd, [0, 1, 0]))
    upv = np.cross(right, fwd)
    fov = math.radians(31.0)
    ys, xs = np.mgrid[y0:y1, 0:W]
    u = ((xs + 0.5) / W - 0.5) * 2 * math.tan(fov / 2) * (W / H)
    vv = -((ys + 0.5) / H - 0.5) * 2 * math.tan(fov / 2)
    rd = fwd + u.reshape(-1, 1) * right + vv.reshape(-1, 1) * upv
    rd /= length(rd)[:, None]
    t, hit = march(cam, rd, blink)
    rgba = np.zeros((len(rd), 4))
    idx = np.nonzero(hit)[0]
    if len(idx):
        p = cam + rd[idx] * t[idx, None]
        rgba[idx, :3] = shade(p, rd[idx], blink)
        rgba[idx, 3] = 1.0
    return y0, rgba.reshape(y1 - y0, W, 4)


def render(width: int, blink: bool, ss: int = 2, workers: int | None = None) -> Image.Image:
    W, H = width * ss, int(width * 1.2) * ss
    bands = [(y, min(H, y + 16), W, H, blink, ss) for y in range(0, H, 16)]
    out = np.zeros((H, W, 4))
    with ProcessPoolExecutor(max_workers=workers or os.cpu_count()) as ex:
        for y0, part in ex.map(render_band, bands):
            out[y0 : y0 + part.shape[0]] = part
    # tone: gentle filmic shoulder, back to sRGB
    rgb = out[..., :3]
    rgb = rgb / (1 + 0.18 * rgb)
    rgb = np.clip(rgb, 0, 1) ** (1 / 2.2)
    a = out[..., 3:4]
    img = np.concatenate([rgb * 255, a * 255], axis=2).astype(np.uint8)
    im = Image.fromarray(img, "RGBA")
    if ss > 1:
        im = im.resize((width, int(width * 1.2)), Image.LANCZOS)
    return im


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--preview", action="store_true", help="a quick 240 px render into the current folder")
    ap.add_argument("--size", type=int, default=640, help="output width in px")
    ap.add_argument("--out", type=Path, default=SITE / "public" / "art")
    ap.add_argument("--png", action="store_true", help="also keep lossless PNG masters")
    args = ap.parse_args(argv)
    if args.preview:
        render(360, blink=False, ss=1).save("portrait3d-preview.png")
        print("wrote portrait3d-preview.png")
        return
    args.out.mkdir(parents=True, exist_ok=True)
    for blink, name in ((False, "hien-3d"), (True, "hien-3d-blink")):
        img = render(args.size, blink=blink, ss=2)
        webp = args.out / f"{name}.webp"
        img.save(webp, quality=88, method=6)
        print("wrote", webp, f"({webp.stat().st_size // 1024} kB)")
        if args.png:
            img.save(args.out / f"{name}.png", optimize=True)


if __name__ == "__main__":
    main()
