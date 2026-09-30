import sys
from PIL import Image
ims=[Image.open(f"out/kadrovi/f{int(a):04d}.jpeg") for a in sys.argv[1:]]
w=sum(i.width for i in ims); c=Image.new('RGB',(w,ims[0].height)); x=0
for i in ims: c.paste(i,(x,0)); x+=i.width
c.save('/tmp/claude-0/pregled.jpg')
