"""Teksture za „školsku tablu“ (video Trampa).

public/tabla.jpg    1080×1920  tamnozelena tabla: neravna boja, tragovi brisanja sunđerom (lukovi), bledi
                               ostaci starog pisanja, prah krede, tamnije ivice, drveni ram
public/kreda0–2.png 1080×1920  zrno krede (sivo = pokrivenost): kreda ne pokriva tablu do kraja, ostaju sitne
                               rupice i uzdužne pruge. Tri varijante se smenjuju sa „ključanjem“ linija.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1080, 1920
rng = np.random.default_rng(15)


def sum2(w, h, start, oktave, uporno=0.55):
    out = np.zeros((h, w)); amp = tot = 0.0; amp = 1.0
    for o in range(oktave):
        kx = start * 2 ** o; ky = int(kx * h / w) + 1
        g = rng.normal(0, 1, (ky, kx))
        img = Image.fromarray(((g - g.min()) / (np.ptp(g) + 1e-9) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        out += amp * (np.array(img, float) / 255 - 0.5); tot += amp; amp *= uporno
    return out / tot


# ── tabla ──────────────────────────────────────────────────────────────
baza = np.array([38, 62, 50], float)
var = sum2(W, H, 3, 6)
t = baza[None, None, :] * (1 + 0.22 * var[..., None])
# tragovi brisanja: široki blagi lukovi svetlije boje (prah razmazan sunđerom)
sloj = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(sloj)
for _ in range(38):
    cx, cy = rng.uniform(-200, W + 200), rng.uniform(-200, H + 200)
    r = rng.uniform(250, 800)
    a0 = rng.uniform(0, 360); a1 = a0 + rng.uniform(40, 140)
    d.arc([cx - r, cy - r, cx + r, cy + r], a0, a1, fill=int(rng.uniform(25, 70)), width=int(rng.uniform(60, 170)))
sloj = np.array(sloj.filter(ImageFilter.GaussianBlur(28)), float) / 255
pruge = sum2(W, H, 40, 3)  # sitne pruge unutar traga
t += (sloj * (0.6 + pruge))[..., None] * np.array([120, 135, 125])[None, None, :] * 0.55
# bledi ostaci starog pisanja: kratki potezi
duh = Image.new("L", (W, H), 0)
d = ImageDraw.Draw(duh)
for _ in range(160):
    x, y = rng.uniform(60, W - 60), rng.uniform(60, H - 60)
    pts = [(x, y)]
    for _ in range(int(rng.integers(3, 8))):
        x += rng.uniform(-28, 34); y += rng.uniform(-22, 22); pts.append((x, y))
    d.line(pts, fill=int(rng.uniform(30, 80)), width=int(rng.uniform(3, 7)))
duh = np.array(duh.filter(ImageFilter.GaussianBlur(2.5)), float) / 255
t += duh[..., None] * 38
# prah pri dnu
yy = np.linspace(0, 1, H)[:, None]
t += (np.clip((yy - 0.86) / 0.14, 0, 1) ** 2 * (0.5 + sum2(W, H, 30, 2)))[..., None] * 40
# sitno zrno
t += rng.normal(0, 3.2, (H, W))[..., None]
# vinjeta
xx = np.linspace(-1, 1, W)[None, :]; yv = np.linspace(-1, 1, H)[:, None]
t *= (1 - 0.32 * np.clip(xx ** 2 * 0.8 + yv ** 2 * 0.55, 0, 1))[..., None]
img = np.clip(t, 0, 255)
# drveni ram (24 px), godovi uzduž
R = 24
drvo = np.array([112, 78, 48], float)
god = sum2(W, H, 6, 4)
for (sl, uzduz) in [((slice(0, R), slice(None)), 1), ((slice(H - R, H), slice(None)), 1), ((slice(None), slice(0, R)), 0), ((slice(None), slice(W - R, W)), 0)]:
    blok = img[sl]
    g = god[sl]
    pr = np.sin((np.arange(blok.shape[1 - uzduz])[:, None] if uzduz == 0 else np.arange(blok.shape[0])[:, None]) * 0.9)
    pr = pr.T if uzduz == 0 else pr
    img[sl] = drvo[None, None, :] * (1 + 0.25 * g[..., None] + 0.06 * pr[..., None])
# senka rama na tabli
sen = np.zeros((H, W))
sen[R:R + 14, R:W - R] += np.linspace(0.35, 0, 14)[:, None]
sen[R:H - R, R:R + 14] += np.linspace(0.3, 0, 14)[None, :]
sen[R:H - R, W - R - 14:W - R] += np.linspace(0, 0.2, 14)[None, :]
img *= (1 - np.clip(sen, 0, 0.5))[..., None]
Image.fromarray(img.astype(np.uint8)).save("public/tabla.jpg", quality=90)

# ── zrno krede ─────────────────────────────────────────────────────────
for k in range(3):
    fino = rng.normal(0, 1, (H, W))
    fino = np.array(Image.fromarray(((fino - fino.min()) / np.ptp(fino) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)), float) / 255 - 0.5
    srednje = sum2(W, H, 60, 2)
    # uzdužne pruge (kreda se vuče): šum razvučen po dijagonali
    pr = rng.normal(0, 1, (H // 6 + 1, W // 2 + 1))
    pr = np.array(Image.fromarray(((pr - pr.min()) / np.ptp(pr) * 255).astype(np.uint8)).resize((W * 2, H * 2), Image.BICUBIC).rotate(28).crop((W // 2, H // 2, W // 2 + W, H // 2 + H)), float) / 255 - 0.5
    z = lambda x: (x - x.mean()) / x.std()
    m = 0.86 + 0.22 * z(fino) + 0.10 * z(srednje) + 0.14 * z(pr)
    m = np.clip(m, 0, 1) ** 0.8
    Image.fromarray((m * 255).astype(np.uint8)).save(f"public/kreda{k}.png", optimize=True)
print("gotovo")
