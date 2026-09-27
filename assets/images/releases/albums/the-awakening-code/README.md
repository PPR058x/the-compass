# assets/images/releases/albums/the-awakening-code/

Artwork for *The Awakening Code* (`data/releases.js`, id `the-awakening-code`).

| File | Used for | Data field |
|---|---|---|
| `cover.webp` | Album cover art (EPK release card + Album Guide cover) | `images.cover` |
| `background.webp` | Album Guide cinematic cover background | `images.coverBackground` |
| `sacred-pattern.webp` | Album Guide act-divider background (reused across all 4 acts) | `images.actBackground` |

After adding a file, fill in the matching field on the `the-awakening-code` entry in `data/releases.js`, e.g.:

```js
images: {
  cover: { src: "assets/images/releases/albums/the-awakening-code/cover.webp", alt: "The Awakening Code — album cover", width: 1200, height: 1200, critical: true },
  ...
}
```

No HTML edit needed — `js/content-loader.js` picks it up automatically on next page load.
