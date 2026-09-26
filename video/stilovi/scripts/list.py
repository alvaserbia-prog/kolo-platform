# Spaja probne kadrove u jednu traku: python3 scripts/list.py <id> <frejm>… -> out/kadrovi/<id>.jpg
import sys
from PIL import Image
id, fr = sys.argv[1], sys.argv[2:]
ims = [Image.open(f"out/kadrovi/{id}-{f}.jpg") for f in fr]
w, h = ims[0].size
s = Image.new("RGB", (w * len(ims) + 8 * (len(ims) - 1), h), "white")
for i, im in enumerate(ims):
    s.paste(im, (i * (w + 8), 0))
s.save(f"out/kadrovi/{id}.jpg", quality=85)
