# Raw texture scans (not in git)

The scans are about 12 MB each, so git ignores everything in this folder except this note.
Copy them here from the shared OneDrive folder `cta/animation/textures/` when you need to re-make the textures.

| File | What it is | Becomes (`public/collage/textures/`) |
|---|---|---|
| `Texturelabs_Paper_345XL.jpg` | wrinkled grey paper | `ground-wrinkle.jpg` |
| `Texturelabs_Paper_377XL.jpg` | newspaper with ghosted print | `ground-newsprint.jpg` |
| `Texturelabs_Paper_347XL.jpg` | dirty paper, specks and stains | `ground-flecks.jpg` |
| `Texturelabs_Grunge_354XL.jpg` | newsprint halftone | `halftone-fine.jpg` |
| `Texturelabs_Grunge_356XL.jpg` | newsprint halftone with a crease | `halftone-grunge.jpg` |
| `sj-objio-XFWiZTa2Ub0-unsplash.jpg` | crumpled cream paper (Unsplash, S. J. Objio) | `paper-crumple.jpg` |

You do **not** need these to render the video: the processed maps are committed. Re-make them with:

```bash
cd motion
pip install pillow numpy scipy
python tools/collage/prep_textures.py --src assets/textures --out public/collage/textures
```

Adding a texture: drop the scan here, add a recipe to `RECIPES` in `tools/collage/prep_textures.py`, register it in `src/collage/textures.tsx`.
Check each source's licence (Texture Labs, Unsplash) before sharing the raw files outside the team.
