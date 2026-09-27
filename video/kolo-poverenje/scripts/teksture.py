"""Teksture linoreza (trilogija „Poverenje“): papir za otisak, mrlje gde mastilo nije prihvatilo,
zrno štampe i mape pomeraja za urezanu, neravnu ivicu. Sve nastaje ovde, ništa se ne preuzima.
Izlaz: public/papir.jpg, public/trunje.png, public/zrno.png, public/pomeraj0–2.png
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

rng = np.random.default_rng(1956)


def sum_(w, h, okt, start=4, uporno=0.55):
    out = np.zeros((h, w))
    a = 1.0
    for o in range(okt):
        n = start * 2 ** o
        s = rng.normal(0, 1, (n + 1, max(2, int(n * w / h) + 1)))
        img = Image.fromarray(((s - s.min()) / (np.ptp(s) + 1e-9) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        out += a * (np.asarray(img) / 255 - 0.5)
        a *= uporno
    return out


# papir: topao, blago mrljast, sa vlaknima
W, H = 1080, 1920
baza = np.array([236, 227, 207], float)
m = sum_(W, H, 5, start=3)
img = np.clip(baza[None, None] + m[..., None] * 26, 0, 255)
im = Image.fromarray(img.astype(np.uint8))
d = ImageDraw.Draw(im)
for _ in range(2600):
    x, y = rng.uniform(0, W), rng.uniform(0, H)
    a = rng.uniform(0, np.pi)
    l = rng.uniform(4, 22)
    c = int(rng.uniform(150, 215))
    d.line([(x, y), (x + np.cos(a) * l, y + np.sin(a) * l)], fill=(c, c - 8, c - 22), width=1)
im = im.filter(ImageFilter.GaussianBlur(0.6))
im.save("public/papir.jpg", quality=92)

# trunje: mrlje boje papira preko mastila (mesta gde valjak nije naneo boju)
S = 512
t = sum_(S, S, 5, start=4, uporno=0.6)
t = (t - t.mean()) / t.std()
sitno = rng.random((S, S))
alfa = np.clip((t - 1.15) * 2.2, 0, 1) * 0.9 + (sitno > 0.985) * 0.8
alfa = np.clip(alfa, 0, 1)
rgba = np.zeros((S, S, 4), np.uint8)
rgba[..., :3] = [236, 227, 207]
rgba[..., 3] = (alfa * 255).astype(np.uint8)
Image.fromarray(rgba).filter(ImageFilter.GaussianBlur(0.5)).save("public/trunje.png")

# zrno štampe
z = rng.normal(0, 1, (S, S))
Image.fromarray(np.clip(128 + z * 38, 0, 255).astype(np.uint8)).save("public/zrno.png")

# mape pomeraja: srednji talas + sitan zub (ivica iz dleta)
for k in range(3):
    w, h = 1120, 1960
    kan = []
    for c in range(2):
        s = sum_(w // 2, h // 2, 4, start=24, uporno=0.6)
        s = (s - s.mean()) / (s.std() + 1e-9)
        kan.append(np.array(Image.fromarray(((s * 0.2 + 0.5).clip(0, 1) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)))
    Image.fromarray(np.stack([kan[0], kan[1], np.full((h, w), 128, np.uint8)], -1)).save(f"public/pomeraj{k}.png")
print("teksture gotove")

# ── naiva (video 2): platno za slikanje — tkanje i blagi potezi četke ─────
S2 = 512
x = np.arange(S2)
tk = (np.sin(x[None, :] * 2 * np.pi / 6) * 0.5 + np.sin(x[:, None] * 2 * np.pi / 6) * 0.5)
pl = 128 + tk * 14 + sum_(S2, S2, 4, start=8) * 50 + rng.normal(0, 5, (S2, S2))
Image.fromarray(np.clip(pl, 0, 255).astype(np.uint8)).save("public/platno.png")

# ── tuš (video 3): akvarel papir (hrapav, hladno beo) i mrlje za rastapanje ─
a = np.array([246, 244, 238], float)
m = sum_(W, H, 6, start=6, uporno=0.62)
zub = rng.normal(0, 1, (H, W))
zub = np.asarray(Image.fromarray(((zub - zub.min()) / np.ptp(zub) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))) / 255 - 0.5
img = np.clip(a[None, None] + m[..., None] * 14 + zub[..., None] * 16, 0, 255)
Image.fromarray(img.astype(np.uint8)).save("public/akvarel.jpg", quality=92)
# maska mrlje (za „bloom“ ivice): svetla sredina, neravan rub
S3 = 512
yy, xx = np.mgrid[0:S3, 0:S3] / S3 - 0.5
r = np.sqrt(xx ** 2 + yy ** 2)
n = sum_(S3, S3, 4, start=4, uporno=0.6)
mask = np.clip((0.42 + n * 0.25 - r) * 6, 0, 1)
ivica = np.exp(-((0.42 + n * 0.25 - r) * 22) ** 2) * 0.6
alfa = np.clip(mask * 0.55 + ivica, 0, 1)
rgba = np.zeros((S3, S3, 4), np.uint8)
rgba[..., :3] = 255
rgba[..., 3] = (alfa * 255).astype(np.uint8)
Image.fromarray(rgba).save("public/mrlja.png")
print("naiva i tuš gotovi")
