# Kontakt-list probnih kadrova: python3 scripts/list.py izlaz.jpg f1 f2 ...
import sys
from PIL import Image, ImageDraw
out, fr = sys.argv[1], sys.argv[2:]
ims = [Image.open(f"out/kadrovi/f{int(x):04d}.jpeg") for x in fr]
w, h = ims[0].size
k = 5
W = Image.new("RGB", (w * k, h * ((len(ims) + k - 1) // k)), "white")
for i, (im, x) in enumerate(zip(ims, fr)):
    W.paste(im, ((i % k) * w, (i // k) * h))
    ImageDraw.Draw(W).text(((i % k) * w + 8, (i // k) * h + 8), x, fill="red")
W.save(out)
