# scripts/press-kit/

Generates the downloadable press kit linked from the EPK's **Press Kit** buttons:
`assets/press-kit/PPR058x_The_Compass_EPK_Press_Kit.pdf`.

All copy is read from the site itself — `data/artist.js`, `data/releases.js`, `data/press.js` and `epk.html` — so after any content change, rebuild and the PDF matches the website. Nothing is typed into the generator by hand.

## Rebuild

Requires Node.js 18+ and Google Chrome (or Chromium).

```sh
cd scripts/press-kit
npm install        # first time only
npm run build      # overwrites assets/press-kit/PPR058x_The_Compass_EPK_Press_Kit.pdf
```

Then commit the updated PDF.

The build checks the layout before writing the PDF: all 8 font styles loaded, every image found, and no text cut off or overflowing a page. If a check fails (for example, a much longer bio), it prints what overflowed and leaves the existing PDF untouched.

## Options

| | |
|---|---|
| `npm run preview` | Also writes one PNG per page to `previews/` for a quick visual check |
| `node build.js --out <file.pdf>` | Writes the PDF somewhere else, e.g. to test without replacing the live file |
| `CHROME_PATH=<path>` | Chrome/Chromium executable, if it isn't found automatically |
| `PRESSKIT_DATE=YYYY-MM-DD` | Date used for "Released"/"Releases" wording (defaults to today, as on the live site) |

## Files

- `build.js` — generator: reads the data, lays out the 8 pages, renders with Chrome, sets PDF metadata
- `presskit.css` — press kit styles; colour tokens mirror `epk.css`
- `fonts/` — static Cinzel, EB Garamond and JetBrains Mono files (the EPK's typefaces, from [Fontsource](https://fontsource.org), SIL Open Font License), so fonts embed in the PDF as real fonts and builds don't depend on network access
