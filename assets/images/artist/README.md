# assets/images/artist/

Artist/brand-identity images (as opposed to release-specific artwork in `assets/images/releases/`).

| File | Used for | Data field |
|---|---|---|
| `ppr058x-logo.webp` | Wordmark logo (Album Guide masthead) | `COMPASS.artist.images.logo` in `data/artist.js` |
| `artist-main.jpg` | Primary artist image | `COMPASS.artist.images.main` in `data/artist.js` |
| `artist-portrait.jpg` | Artist portrait | `COMPASS.artist.images.portrait` in `data/artist.js` |
| `artist-live.jpg` | Live performance image | `COMPASS.artist.images.live` in `data/artist.js` |

All four data fields are ready, but none of them has a layout slot in the current pages yet — placing one is a future design decision, not automatic.

After adding a file, set it in `data/artist.js`, e.g.:

```js
images: {
  logo: { src: "assets/images/artist/ppr058x-logo.webp", alt: "PPR058x logo", width: 240, height: 60 },
  main: { src: "assets/images/artist/artist-main.jpg", alt: "Patrick Pascal Reerink", width: 1600, height: 1600 },
  portrait: { src: "assets/images/artist/artist-portrait.jpg", alt: "Patrick Pascal Reerink portrait", width: 800, height: 800 },
  live: { src: "assets/images/artist/artist-live.jpg", alt: "Patrick Pascal Reerink performing live", width: 1600, height: 1067 }
}
```
