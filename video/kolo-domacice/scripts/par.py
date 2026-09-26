import sys
from PIL import Image
fr=sys.argv[1:]; w,h=540,960
c=Image.new("RGB",(w*len(fr),h))
for i,x in enumerate(fr): c.paste(Image.open(f"out/kadrovi/f{x}.jpg").resize((w,h)),(i*w,0))
c.save("/tmp/claude-0/w/par.jpg",quality=90)
