# Images

Every image that appears in the video lives here, in one of two folders:

| Folder | What goes in it | Shown with |
|---|---|---|
| `stock/` | Licensed stock photos: places, objects, scenes. Not real people from the story. | `<PhotoCutout>` |
| `real/` | Real-story material: screenshots of articles, posts, documents and web pages, and photos of the real people and events in the story. | `<ArticleCutout>` for screenshots, `<PhotoCutout>` for photos |

**Every image needs a row in that folder's `credits.csv`.** `npm run check` fails if one is missing, if a file is over 5 MB, or if it isn't a JPG, PNG or WebP.

Keep originals (huge files, raw downloads) out of here; only the version the video uses goes in. Long edge 2400 px is plenty.

See `stock/README.md` and `real/README.md` for naming and what's allowed, and `docs/STYLE-GUIDE.md` §8.2.
