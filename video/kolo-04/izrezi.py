"""Izrezuje ilustraciju sa ravne krem pozadine u PNG sa providnom pozadinom.
Pozadina = pikseli bliski boji uglova, POVEZANI sa ivicom slike (flood fill),
pa svetli delovi unutar zgrade (bele fasade) ostaju."""
import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

def izrezi(ulaz, izlaz, prag=22):
    im = np.asarray(Image.open(ulaz).convert("RGB")).astype(float)
    h, w, _ = im.shape
    uglovi = np.concatenate([im[:8, :8].reshape(-1, 3), im[:8, -8:].reshape(-1, 3),
                             im[-8:, :8].reshape(-1, 3), im[-8:, -8:].reshape(-1, 3)])
    bg = np.median(uglovi, axis=0)
    blizu = np.linalg.norm(im - bg, axis=2) < prag
    lab, _ = ndimage.label(blizu)
    ivica = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    pozadina = np.isin(lab, list(ivica))
    alfa = (~pozadina).astype(np.uint8) * 255
    alfa = ndimage.binary_opening(alfa > 0, iterations=1).astype(np.uint8) * 255
    a = Image.fromarray(alfa).filter(ImageFilter.GaussianBlur(0.8))
    rgba = Image.open(ulaz).convert("RGBA"); rgba.putalpha(a)
    rgba = rgba.crop(rgba.getbbox())
    rgba.save(izlaz)
    print(izlaz, rgba.size)

if __name__ == "__main__":
    for p in sys.argv[1:]:
        izrezi(p, "izrezano/" + p.rsplit("/", 1)[-1])
