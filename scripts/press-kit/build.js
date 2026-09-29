// Press kit generator — builds assets/press-kit/PPR058x_The_Compass_EPK_Press_Kit.pdf
// from the EPK's own content. Every line of copy comes from data/*.js or
// epk.html; derived values (featured release, album order, "Released"
// wording, catalog stats) use the same rules as epk.js.
//
// Usage (from this folder):  npm install   then   npm run build
// Options:  --out <file.pdf>  write somewhere else (e.g. to test a build)
//           --previews        also write one PNG per page to ./previews/
// Env:      CHROME_PATH       Chrome/Chromium executable if not auto-found
//           PRESSKIT_DATE     YYYY-MM-DD used for "Released"/"Releases" wording
//                             (defaults to today, like the live site)
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('puppeteer-core');
const { PDFDocument, PDFName } = require('pdf-lib');

const WORK = __dirname;
const REPO = path.resolve(WORK, '../..');
const argv = process.argv.slice(2);
const argValue = name => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : null; };
const OUT_PDF = path.resolve(argValue('--out') || path.join(REPO, 'assets/press-kit/PPR058x_The_Compass_EPK_Press_Kit.pdf'));
const OUT_DIR = path.dirname(OUT_PDF);
const PREVIEWS = argv.includes('--previews');
const EPK_URL = 'https://ppr058x.github.io/the-compass/epk.html';
const GUIDE_URL = 'https://ppr058x.github.io/the-compass/index.html';
const TODAY = process.env.PRESSKIT_DATE || new Date().toISOString().slice(0, 10);
const EXPECTED_FONTS = 8; // Cinzel 400/500/600, EB Garamond 400/400i/500, JetBrains Mono 400/500

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'
  ].filter(Boolean);
  const found = candidates.find(p => fs.existsSync(p));
  if (!found) throw new Error('Chrome not found — set CHROME_PATH to a Chrome/Chromium executable.');
  return found;
}

// ---- Load the site's data exactly as the browser does -------------------
global.window = global;
for (const f of ['data/artist.js', 'data/releases.js', 'data/press.js']) {
  eval(fs.readFileSync(path.join(REPO, f), 'utf8'));
}
const { artist, releases, press } = global.COMPASS;
const epkHtml = fs.readFileSync(path.join(REPO, 'epk.html'), 'utf8');
const metatron = epkHtml.match(/<symbol id="motif-metatron"[\s\S]*?<\/symbol>/)[0];
const pick = re => { const m = epkHtml.match(re); if (!m) throw new Error('epk.html: not found ' + re); return m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); };
const compassLede = pick(/<p class="epk-compass-lede">([\s\S]*?)<\/p>/);
const bookingLede = pick(/<p class="epk-booking-lede">([\s\S]*?)<\/p>/);
const riderText = pick(/<div id="tech-rider-content">\s*<p class="muted">([\s\S]*?)<\/p>/);
const heroStatement = pick(/<p class="epk-hero-statement">([\s\S]*?)<\/p>/);

// ---- Same rules as epk.js -------------------------------------------------
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const isCatalogAlbum = r => r.type === 'album' && !!(r.tracks && r.tracks.length);
function pickFeatured(list) {
  const flagged = list.filter(r => r.featured);
  if (flagged.length === 1) return flagged[0];
  const pool = flagged.length ? flagged : list;
  return pool.slice().sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''))[0];
}
function albumCatalog(list) {
  return list.map((r, i) => ({ r, i })).filter(x => isCatalogAlbum(x.r))
    .sort((a, b) => (b.r.releaseDate || '').localeCompare(a.r.releaseDate || '') || (b.r.year || 0) - (a.r.year || 0) || a.i - b.i)
    .map(x => x.r);
}
const typeLabel = t => !t ? '' : t === 'ep' ? 'EP' : t[0].toUpperCase() + t.slice(1);
function releaseDateText(r) {
  if (r.releaseDateDisplay) {
    let verb = '';
    if (r.releaseDate) verb = r.releaseDate <= TODAY ? 'Released ' : 'Releases ';
    else if (r.status === 'upcoming') verb = 'Releases ';
    else if (r.status === 'released') verb = 'Released ';
    return verb + r.releaseDateDisplay;
  }
  return r.year ? String(r.year) : '';
}
function releaseMeta(r) {
  return [typeLabel(r.type), r.genre, r.trackCount ? r.trackCount + ' tracks' : '', releaseDateText(r)].filter(Boolean).join(' · ');
}
function catalogStats(list) {
  const counted = list.filter(r => r.type === 'album' ? isCatalogAlbum(r) : true);
  const stats = [{ value: counted.length, label: 'Releases' }];
  for (const [t, label] of [['album', 'Albums'], ['ep', 'EPs'], ['single', 'Singles']]) {
    const n = counted.filter(r => r.type === t).length;
    if (n) stats.push({ value: n, label });
  }
  const years = counted.map(r => r.year).filter(Boolean);
  if (years.length) {
    const min = Math.min(...years), max = Math.max(...years);
    stats.push({ value: min === max ? String(min) : min + '–' + max, label: 'Catalog years' });
  }
  return stats;
}

const lead = pickFeatured(releases);
const albums = albumCatalog(releases);
const gridAlbums = albums.filter(r => r !== lead);
const stats = catalogStats(releases);
const smart = artist.smartLink.url;
const contacts = press.contacts;
const bio = artist.bioHtml;
const bioPlain = i => bio[i].replace(/<[^>]+>/g, '');
const genres = artist.genre.split('·').map(g => g.replace(/\u00A0/g, ' ').trim());
const fact = label => (artist.quickFacts.find(f => f.label === label) || {}).value;
const img = (src, cls, alt) => `<img class="${cls}" src="${src}" alt="${esc(alt || '')}">`;
const motif = cls => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><use href="#motif-metatron"/></svg>`;
const short = u => u.replace(/^https?:\/\//, '');

// ---- Pages -----------------------------------------------------------------
const TOTAL = 8;
const pageNo = n => String(n).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');
function frame(n, section, body, cls = '') {
  return `<section class="page ${cls}">
  ${motif('page-mark')}
  <header class="run-head"><span>${esc(artist.aka)} · ${esc(artist.brand)}</span><span>${esc(section)}</span></header>
  <div class="page-body">${body}</div>
  <footer class="run-foot"><span>${esc(artist.name)} · ${esc(artist.brand)} · Electronic Press Kit</span><span>${pageNo(n)}</span></footer>
</section>`;
}
const head = (kicker, title, extra = '') => `<header class="sec-head">
  <p class="kicker">${esc(kicker)}</p><h2>${title}</h2>${extra}<span class="gold-rule"></span></header>`;

const cover = `<section class="page cover">
  <div class="cover-photo">${img(artist.images.main.src, 'cover-img', artist.images.main.alt)}</div>
  <div class="cover-shade"></div>
  <div class="cover-content">
    ${img(artist.images.logo.src, 'cover-logo', artist.images.logo.alt)}
    <p class="kicker">Electronic Press Kit</p>
    <h1 class="cover-aka">${esc(artist.aka)}</h1>
    <p class="cover-brand">${esc(artist.brand)}</p>
    <span class="gold-rule"></span>
    <p class="cover-name">${esc(artist.name)}</p>
    <p class="cover-statement">${esc(heroStatement)}</p>
    <p class="cover-genres">${esc(genres.join(' · '))}</p>
  </div>
  <footer class="cover-foot">
    <ul class="cover-slogans">${artist.slogans.map(s => `<li>“${esc(s)}”</li>`).join('')}</ul>
    <a class="cover-url" href="${EPK_URL}">${esc(short(EPK_URL))}</a>
  </footer>
</section>`;

const profile = frame(2, '01 — Artist Profile', `
  ${head('01 — Artist Profile', 'Biography')}
  <div class="profile">
    <div class="bio">${bio.map((p, i) => `<p${i === 0 ? ' class="bio-name"' : i === bio.length - 1 ? ' class="bio-motto"' : ''}>${p}</p>`).join('')}</div>
    <aside class="facts">
      <h3 class="card-title">At a glance</h3>
      <dl>${artist.quickFacts.map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value.replace(/\u00A0/g, ' '))}</dd></div>`).join('')}</dl>
      <div class="facts-sig"><span>Artistically known as</span><strong>${esc(artist.aka)}</strong></div>
    </aside>
  </div>`);

const identity = frame(3, '02 — Musical Identity', `
  ${head('02 — Musical Identity', 'Sound &amp; Genres')}
  <ul class="genre-grid">${genres.map(g => `<li>${esc(g)}</li>`).join('')}</ul>
  <div class="identity-quotes">
    <div><p class="label">Sound</p><p>${esc(bioPlain(2).split('. ')[0])}.</p></div>
    <div><p class="label">Themes</p><p>${esc(bioPlain(2).split('. ').slice(1).join('. '))}</p></div>
    <div><p class="label">Experience</p><p>${esc(bioPlain(4))}</p></div>
  </div>
  <div class="stats-block">
    <p class="label">Catalog</p>
    <dl class="stats">${stats.map(s => `<div><dd>${esc(s.value)}</dd><dt>${esc(s.label)}</dt></div>`).join('')}</dl>
  </div>`);

const compass = frame(4, '03 — The Compass', `
  <div class="compass">
    <div class="compass-emblem">${img(artist.images.logo.src, 'compass-logo', artist.images.logo.alt)}</div>
    <div class="compass-text">
      ${head('03 — The Brand', esc(artist.brand))}
      <p class="lede">${esc(compassLede)}</p>
      <p class="compass-copy">${bio[3]}</p>
      <dl class="signature">
        <dt>Artist</dt><dd>${esc(artist.name)}</dd>
        <dt>Signature</dt><dd>${esc(artist.aka)}</dd>
        <dt>Universe</dt><dd>${esc(artist.brand)}</dd>
      </dl>
    </div>
  </div>
  <div class="compass-close">
    <ul class="slogans">${artist.slogans.map(s => `<li>“${esc(s)}”</li>`).join('')}</ul>
    <p class="motto">${bio[bio.length - 1]}</p>
  </div>`, 'page-compass');

const creditGroups = lead.credits || [];
const awakening = frame(5, '04 — The Awakening Code', `
  ${head('04 — Featured Release', esc(lead.title))}
  <div class="tac">
    ${img(lead.images.cover.src, 'tac-cover', lead.images.cover.alt)}
    <div class="tac-info">
      <p class="tac-meta">${esc(releaseMeta(lead))}</p>
      ${lead.description ? `<p class="tac-copy">${esc(lead.description)}</p>` : ''}
      ${lead.releaseStrategy ? `<p class="tac-copy">${esc(lead.releaseStrategy)}</p>` : ''}
      ${creditGroups[0] ? `<dl class="credits credits--album">${creditGroups[0].items.map(it => `<dt>${esc(it.label)}</dt><dd>${esc(it.value)}</dd>`).join('')}</dl>` : ''}
    </div>
  </div>
  <h3 class="subhead">Track list <span>${lead.tracks.length} tracks</span></h3>
  <ol class="tracks">${lead.tracks.map(t => `<li><span class="tn">${String(t.number).padStart(2, '0')}</span>${esc(t.title)}</li>`).join('')}</ol>
  <h3 class="subhead">Credits</h3>
  <div class="credit-groups">${creditGroups.slice(1).filter(g => g.group !== 'Official Resources').map(g => `<div><h4>${esc(g.group)}</h4><dl class="credits">${g.items.map(it => `<dt>${esc(it.label)}</dt><dd>${esc(it.value)}</dd>`).join('')}</dl></div>`).join('')}</div>`);

const music = frame(6, '05 — Selected Releases', `
  ${head('05 — Music', 'Selected Releases', `<p class="head-note">Album catalog · ${albums.length} albums · ${esc(lead.title)} featured on page 05</p>`)}
  <div class="album-grid">
    ${gridAlbums.map(r => `<article class="album">
      ${img(r.images.cover.src, 'album-cover', r.images.cover.alt)}
      <p class="album-info">${esc(releaseDateText(r))}</p>
      <h3 class="album-title">${esc(r.title)}</h3>
      <p class="album-count">${r.tracks.length} tracks</p>
    </article>`).join('')}
    <aside class="discography">
      <p class="label">Full discography</p>
      <p class="disco-count">${releases.length} releases</p>
      <p class="disco-copy">Albums and singles, ${esc(stats.find(s => s.label === 'Catalog years').value)}. Listen via the official smart link.</p>
      <a class="disco-link" href="${smart}">${esc(short(smart))}</a>
    </aside>
  </div>`);

const visual = frame(7, '06 — Visual Identity', `
  ${head('06 — Visual Identity', 'Visual Identity')}
  <div class="visual">
    <figure class="visual-photo">${img(artist.images.main.src, 'vis-photo', artist.images.main.alt)}<figcaption>Artist image — ${esc(artist.name)}</figcaption></figure>
    <div class="visual-side">
      <figure class="visual-logo">${img(artist.images.logo.src, 'vis-logo', artist.images.logo.alt)}<figcaption>${esc(artist.brand)} emblem</figcaption></figure>
      <div>
        <p class="label">Brand palette</p>
        <div class="swatches">${artist.palette.map(p => `<div class="swatch"><span class="chip" style="background:${p.hex}"></span><span class="sw-name">${esc(p.name)}</span><code>${esc(p.hex)}</code></div>`).join('')}</div>
      </div>
      <div class="visual-motif">
        ${motif('motif-large')}
        <div><p class="label">Sacred geometry</p><p class="motif-copy">Metatron’s Cube — thin gold strokes on black, the recurring mark across the EPK.</p></div>
      </div>
    </div>
  </div>
  <div class="artwork-row">
    <p class="label">Release artwork</p>
    <div class="artwork-strip">${albums.slice(0, 6).map(r => img(r.images.cover.src, 'strip-cover', r.images.cover.alt)).join('')}</div>
  </div>`);

const card = (title, rows) => `<div class="contact-card"><h3 class="card-title">${esc(title)}</h3><dl>${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>`;
const bk = contacts.booking, pm = contacts.pressMedia;
const contact = frame(8, '07 — Booking & Contact', `
  ${head('07 — Booking', 'Booking &amp; Inquiries')}
  <p class="lede">${esc(bookingLede)}</p>
  <div class="contact-grid">
    ${card('Management / Booking', [['Name', bk.name], ['Contact', bk.email || bk.contact]])}
    ${card('Press / Media', [['Name', pm.name], ['Role', pm.role], ['Contact', pm.email || pm.contact], ['Phone', pm.phone]])}
  </div>
  <div class="contact-card rider"><h3 class="card-title">Technical rider</h3><p>${esc(riderText)}</p></div>
  <h3 class="subhead">Links</h3>
  <ul class="links">
    <li><span class="link-label">Listen to my music · Linktree</span><a href="${smart}">${esc(short(smart))}</a></li>
    <li><span class="link-label">Online Electronic Press Kit</span><a href="${EPK_URL}">${esc(short(EPK_URL))}</a></li>
    <li><span class="link-label">${esc(lead.title)} — Album Guide</span><a href="${GUIDE_URL}">${esc(short(GUIDE_URL))}</a></li>
  </ul>
  <div class="closing">
    ${img(artist.images.logo.src, 'closing-logo', artist.images.logo.alt)}
    <p class="motto">${bio[bio.length - 1]}</p>
  </div>`);

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(artist.aka)} — ${esc(artist.brand)} — Electronic Press Kit</title>
<base href="${pathToFileURL(REPO).href}/">
<link rel="stylesheet" href="${pathToFileURL(path.join(WORK, 'presskit.css')).href}">
</head><body>
<svg width="0" height="0" style="position:absolute">${metatron}</svg>
${cover}${profile}${identity}${compass}${awakening}${music}${visual}${contact}
</body></html>`;

(async () => {
  const htmlPath = path.join(os.tmpdir(), 'ppr058x-presskit.html');
  fs.writeFileSync(htmlPath, html);
  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true, args: ['--allow-file-access-from-files'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    // Layout checks: fonts loaded, images decoded, nothing past the page's safe area.
    const report = await page.evaluate(() => {
      const out = { fonts: [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family + ' ' + f.weight + ' ' + f.style), brokenImages: [], overflow: [] };
      document.querySelectorAll('img').forEach(i => { if (!i.complete || !i.naturalWidth) out.brokenImages.push(i.getAttribute('src')); });
      document.querySelectorAll('.page').forEach((p, n) => {
        const pr = p.getBoundingClientRect();
        const body = p.querySelector('.page-body, .cover-content');
        if (body && body.scrollHeight > body.clientHeight + 1) out.overflow.push(`page ${n + 1}: body scrollHeight ${body.scrollHeight} > ${body.clientHeight}`);
        p.querySelectorAll('.page-body *, .cover-content *, .cover-foot *').forEach(el => {
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          if (r.right > pr.right - 40 + 1 || r.left < pr.left + 40 - 1 || r.bottom > pr.bottom - 38) out.overflow.push(`page ${n + 1}: <${el.tagName.toLowerCase()} class="${el.className.baseVal ?? el.className}"> ${Math.round(r.left - pr.left)},${Math.round(r.bottom - pr.top)} "${(el.textContent || '').trim().slice(0, 40)}"`);
          if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') out.overflow.push(`page ${n + 1}: clipped text in <${el.tagName.toLowerCase()}> "${el.textContent.trim().slice(0, 40)}"`);
        });
      });
      return out;
    });
    const problems = [];
    if (report.fonts.length < EXPECTED_FONTS) problems.push(`only ${report.fonts.length}/${EXPECTED_FONTS} fonts loaded: ${report.fonts.join(', ')}`);
    problems.push(...report.brokenImages.map(s => 'image failed to load: ' + s), ...report.overflow);
    if (problems.length) {
      console.error('Layout check failed — PDF not written:\n  ' + problems.join('\n  '));
      process.exitCode = 1;
      return;
    }
    console.log(`Layout check passed: ${report.fonts.length} fonts, all images loaded, no overflow.`);

    if (PREVIEWS) {
      const dir = path.join(WORK, 'previews');
      fs.mkdirSync(dir, { recursive: true });
      const pages = await page.$$('.page');
      for (let i = 0; i < pages.length; i++) await pages[i].screenshot({ path: path.join(dir, `page-${i + 1}.png`) });
      console.log('Previews written to', dir);
    }

    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    const doc = await PDFDocument.load(pdf);
    doc.setTitle(`${artist.aka} — ${artist.brand} — Electronic Press Kit`);
    doc.setAuthor(artist.name);
    doc.setSubject(`Electronic Press Kit — ${artist.name} (${artist.aka}), ${artist.brand}`);
    doc.setKeywords([artist.aka, artist.brand, 'Electronic Press Kit', lead.title]);
    doc.setCreator(`${artist.brand} EPK`);
    doc.setProducer(`${artist.brand} EPK`);
    doc.catalog.set(PDFName.of('PageMode'), PDFName.of('UseNone'));
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_PDF, await doc.save());
    console.log('Wrote', OUT_PDF, (fs.statSync(OUT_PDF).size / 1024 / 1024).toFixed(2) + ' MB,', doc.getPageCount(), 'pages');
  } finally {
    await browser.close();
    fs.rmSync(htmlPath, { force: true });
  }
})().catch(e => { console.error(e); process.exit(1); });
