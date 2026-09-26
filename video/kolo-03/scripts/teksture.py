"""Teksture papira (generisane, bez tuđih slika).

public/papir.jpg  — pozadina 1080x1920: topla krem hartija, zrno + vlakna + blage mrlje
public/zrno.png   — 512x512 siva tekstura (sa alfom) za isečke, stavlja se preko boje (multiply)
"""
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter
rng = np.random.default_rng(3)

def sum_sloj(h, w, sigma):
    return gaussian_filter(rng.normal(0, 1, (h, w)), sigma)

H, W = 1920, 1080
baza = np.array([243, 234, 216], float)  # krem, blizu #FAFAF8 sa sajta ali toplije
n = (0.55 * sum_sloj(H, W, 0.7) / 0.35 + 0.8 * sum_sloj(H, W, 3) / 0.09 + 1.2 * sum_sloj(H, W, 60) / 0.004)
n = n / np.std(n)
img = baza[None, None, :] + n[..., None] * np.array([3.2, 3.4, 4.0])
# vlakna
fib = np.zeros((H, W))
for _ in range(2200):
    y, x = rng.integers(0, H), rng.integers(0, W)
    L = rng.integers(8, 40); a = rng.uniform(0, np.pi)
    for t in range(L):
        yy, xx = int(y + t * np.sin(a)), int(x + t * np.cos(a))
        if 0 <= yy < H and 0 <= xx < W:
            fib[yy, xx] += 1
fib = gaussian_filter(fib, 0.6)
img -= fib[..., None] * np.array([10, 10, 12])
# vinjeta
yy, xx = np.mgrid[0:H, 0:W]
d = np.sqrt(((yy - H / 2) / (H / 2)) ** 2 + ((xx - W / 2) / (W / 2)) ** 2)
img *= (1 - 0.07 * np.clip(d - 0.5, 0, 1))[..., None]
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save("public/papir.jpg", quality=92)

S = 512
def tile(sigma):  # periodična tekstura (preko FFT-a) da se ne vide šavovi
    f = np.fft.fft2(rng.normal(0, 1, (S, S)))
    ky = np.fft.fftfreq(S)[:, None]; kx = np.fft.fftfreq(S)[None, :]
    g = np.exp(-(kx ** 2 + ky ** 2) * (2 * np.pi * sigma) ** 2 / 2)
    r = np.real(np.fft.ifft2(f * g)); return r / np.std(r)
t = 0.6 * tile(0.8) + 0.5 * tile(3) + 0.4 * tile(20)
t = t / np.std(t)
g = np.clip(128 + t * 34, 0, 255).astype(np.uint8)
a = np.full_like(g, 255)
Image.fromarray(np.stack([g, g, g, a], -1), "RGBA").save("public/zrno.png")
print("ok")
