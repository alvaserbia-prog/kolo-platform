"""Teksture za „staru slikovnicu“: požuteo papir stranice i mrlje gvaša za popunu oblika.

public/papir.jpg  1080×1920  topla krem stranica, vlakna, mrlje od vremena, tamnije ivice
public/gvas.png   512×512    siva „mrlja“ (bešavna) — preko svake površine, blend multiply/overlay
public/grain.png  512×512    sitno zrno štampe (bešavno)
"""
import numpy as np
from PIL import Image, ImageFilter

rng = np.random.default_rng(28)


def sum_bezsavno(n, oktave, uporno=0.55, start=4):
    """Fraktalni šum koji se ponavlja (bešavan): interpolacija periodične mreže."""
    out = np.zeros((n, n))
    amp, tot = 1.0, 0.0
    for o in range(oktave):
        k = start * 2 ** o
        g = rng.normal(0, 1, (k, k))
        img = Image.fromarray(((g - g.min()) / (np.ptp(g) + 1e-9) * 255).astype(np.uint8))
        # periodično: popločaj 3×3 pa iseci sredinu posle skaliranja
        vel = np.tile(np.array(img), (3, 3))
        big = Image.fromarray(vel).resize((n * 3, n * 3), Image.BICUBIC)
        out += amp * (np.array(big, dtype=float)[n:2 * n, n:2 * n] / 255 - 0.5)
        tot += amp
        amp *= uporno
    return out / tot


def sum_pravougaon(w, h, oktave, start=3, uporno=0.55):
    out = np.zeros((h, w))
    amp, tot = 1.0, 0.0
    for o in range(oktave):
        kx, ky = start * 2 ** o, int(start * 2 ** o * h / w) + 1
        g = rng.normal(0, 1, (ky, kx))
        img = Image.fromarray(((g - g.min()) / (np.ptp(g) + 1e-9) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        out += amp * (np.array(img, dtype=float) / 255 - 0.5)
        tot += amp
        amp *= uporno
    return out / tot


# ── stranica ────────────────────────────────────────────────────────────
W, H = 1080, 1920
baza = np.array([243, 232, 208], float)  # krem
mrlje = sum_pravougaon(W, H, 7)
fleke = sum_pravougaon(W, H, 3, start=2)
yy, xx = np.mgrid[0:H, 0:W]
d = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H / 2) / (H * 0.6)) ** 2)
ivica = np.clip(d - 0.55, 0, 1) ** 1.6
img = np.zeros((H, W, 3))
for c, (b, jac) in enumerate(zip(baza, (1.0, 1.15, 1.6))):
    v = b + mrlje * 26 + fleke * 18 * jac - ivica * 95 * jac
    img[..., c] = v
# vlakna papira
vl = np.zeros((H, W))
for _ in range(1800):
    x0, y0 = rng.uniform(0, W), rng.uniform(0, H)
    ug = rng.uniform(0, np.pi)
    ln = rng.uniform(8, 40)
    t = np.linspace(0, 1, int(ln))
    xs = np.clip((x0 + np.cos(ug) * ln * t).astype(int), 0, W - 1)
    ys = np.clip((y0 + np.sin(ug) * ln * t).astype(int), 0, H - 1)
    vl[ys, xs] += rng.uniform(-1, 1)
vl = np.array(Image.fromarray(((vl + 3) * 40).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)), float) / 40 - 3
img += vl[..., None] * 4
# sitno zrno
img += rng.normal(0, 3.2, (H, W, 1))
Image.fromarray(img.clip(0, 255).astype(np.uint8)).save("public/papir.jpg", quality=92)

# ── gvaš mrlja (bešavna) ────────────────────────────────────────────────
n = 512
g = sum_bezsavno(n, 6, 0.6, start=4)
g2 = sum_bezsavno(n, 3, 0.5, start=16)
v = 128 + g * 170 + g2 * 60
Image.fromarray(v.clip(0, 255).astype(np.uint8)).save("public/gvas.png")

# ── zrno štampe ─────────────────────────────────────────────────────────
z = rng.normal(128, 38, (n, n))
Image.fromarray(z.clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.5)).save("public/grain.png")
print("teksture gotove")

# ── mape pomeraja za neravnu ivicu gvaša (tri, smenjuju se na 4 frejma) ────
# Unapred izračunat šum umesto feTurbulence u svakom frejmu: render je ~3× brži.
for k in range(3):
    w, h = 1120, 1960
    kan = []
    for c in range(2):
        s = sum_pravougaon(w // 2, h // 2, 3, start=11, uporno=0.5)
        s = (s - s.mean()) / (s.std() + 1e-9)
        kan.append(np.array(Image.fromarray(((s * 0.22 + 0.5).clip(0, 1) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)))
    rgb = np.stack([kan[0], kan[1], np.full((h, w), 128, np.uint8)], -1)
    Image.fromarray(rgb).save(f"public/pomeraj{k}.png")
print("mape pomeraja gotove")
