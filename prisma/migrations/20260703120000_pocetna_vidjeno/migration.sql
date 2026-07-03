-- "Viđeno" vreme za sidebar badge na Početnoj: badge broji nove poruke u
-- Pričaonici i nove objave Fondacije (Blog) novije od ovog trenutka.
ALTER TABLE "User" ADD COLUMN "vidjenoPocetnaAt" TIMESTAMP(3);
