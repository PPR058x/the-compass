# assets/images/releases/singles/

Artwork for singles, one subfolder per release: `assets/images/releases/singles/<release-id>/cover.webp`.

136 subfolders already exist (one per confirmed single in the release catalog — see `data/releases.js`), each with a `.gitkeep` placeholder and no artwork yet. Drop `cover.webp` into the matching folder, then set that release's `images.cover` in `data/releases.js`:

```js
images: {
  cover: { src: "assets/images/releases/singles/<release-id>/cover.webp", alt: "<Title> — cover art", width: 1200, height: 1200 },
  ...
}
```

No HTML changes needed — the Release Archive on the EPK renders every entry in `COMPASS.releases` automatically.

To add a **new** single later: create `assets/images/releases/singles/<release-id>/`, then append a matching entry to `data/releases.js` with `type: "single"`.
