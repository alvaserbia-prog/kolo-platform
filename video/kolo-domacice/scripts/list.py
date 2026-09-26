"""Kontakt-list probnih kadrova: python3 scripts/list.py f1 f2 ... -> /tmp/claude-0/w/list.jpg"""
import sys
from PIL import Image, ImageDraw
fr = sys.argv[1:]
w, h = 360, 640
c = Image.new("RGB", (w * len(fr), h + 30), "white")
d = ImageDraw.Draw(c)
for i, x in enumerate(fr):
    c.paste(Image.open(f"out/kadrovi/f{x}.jpg").resize((w, h)), (i * w, 30))
    d.text((i * w + 10, 8), f"frejm {x}", fill="black")
c.save("/tmp/claude-0/w/list.jpg", quality=88)
