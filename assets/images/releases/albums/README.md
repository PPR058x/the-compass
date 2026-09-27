# assets/images/releases/albums/

Artwork for albums, one subfolder per release: `assets/images/releases/albums/<release-id>/cover.webp`.

14 subfolders exist — `the-awakening-code/` (see its own README; artwork/content plan already defined) plus 13 more for the rest of the confirmed catalog, each with a `.gitkeep` placeholder and no artwork yet. Drop `cover.webp` into the matching folder, then set that release's `images.cover` in `data/releases.js`:

```js
images: {
  cover: { src: "assets/images/releases/albums/<release-id>/cover.webp", alt: "<Title> — album cover", width: 1200, height: 1200 },
  ...
}
```

No HTML changes needed — the Release Archive on the EPK renders every entry in `COMPASS.releases` automatically.
