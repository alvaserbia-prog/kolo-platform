# Kontakt list probnih kadrova: python3 scripts/list_kadrova.py izlaz.jpg kadar1.jpg kadar2.jpg ...
import sys
from PIL import Image
fs = sys.argv[2:]
w, h = 360, 640
kol = min(5, len(fs))
red = (len(fs) + kol - 1) // kol
out = Image.new("RGB", (kol * w, red * h), "white")
for i, f in enumerate(fs):
    out.paste(Image.open(f).resize((w, h)), ((i % kol) * w, (i // kol) * h))
out.save(sys.argv[1], quality=85)
