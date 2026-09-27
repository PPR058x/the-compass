/* ==========================================================================
   THE COMPASS — EPK page: rendering + behavior.
   All EPK-specific rendering lives here, reading window.COMPASS (populated
   by data/artist.js, data/releases.js, data/press.js) and using the shared
   COMPASS.media helpers from js/media.js for every image.

   The shared js/content-loader.js is intentionally left untouched: its own
   EPK renderer only runs when the page has an #intro element, which this
   page no longer has, so it stays inert here while the Album Guide keeps
   using it unchanged.

   Rules: every value comes from the data files. Missing values keep the
   static markup already in epk.html or render a branded black/gold
   fallback — never a broken image, never "undefined", never an invented
   fact. No framework, no build step.
   ========================================================================== */

(function () {
  "use strict";

  var C = window.COMPASS || {};

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function byId(id) { return document.getElementById(id); }

  // COMPASS.media.imgHTML with optional per-call overrides (className,
  // critical, alt). Returns the fallback when there's no image or no media.js.
  function img(data, fallbackHtml, extra) {
    var m = window.COMPASS && COMPASS.media;
    if (!m || !data || !data.src) return fallbackHtml || "";
    var d = {}, k;
    for (k in data) if (Object.prototype.hasOwnProperty.call(data, k)) d[k] = data[k];
    for (k in extra || {}) if (Object.prototype.hasOwnProperty.call(extra, k)) d[k] = extra[k];
    return m.imgHTML(d, fallbackHtml || "");
  }

  function motifSvg(cls) {
    return '<svg class="' + cls + '" aria-hidden="true"><use href="#motif-metatron"></use></svg>';
  }

  function linkAttrs(url) {
    return /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : "";
  }

  // ======================================================================
  // Rendering
  // ======================================================================

  function renderEpkPage() {
    if (!byId("hero")) return;

    var artist = C.artist || {};
    var press = C.press || {};
    var releases = C.releases || [];

    applyFavicon(artist.images);
    fillArtistText(artist);
    renderHero(artist);
    renderBio(artist);
    renderCompass(artist, releases);
    renderMusic(releases);
    renderListen(artist, releases);
    renderPhotos(press.photos);
    renderLogos(press.logos);
    renderQuotes(press.quotes);
    renderBooking(press);
    renderFooterSocial(artist.social);
  }

  function applyFavicon(images) {
    if (!images || !images.favicon || !images.favicon.src) return; // keep inline SVG favicon
    var link = document.querySelector('link[rel="icon"]');
    if (link) link.href = images.favicon.src;
  }

  // [data-artist="name|aka|brand"] → matching artist field (text only).
  function fillArtistText(artist) {
    document.querySelectorAll("[data-artist]").forEach(function (el) {
      var value = artist[el.getAttribute("data-artist")];
      if (value) el.textContent = value;
    });
  }

  // Remove an image's [data-remove-on-error] ancestor when it fails to load —
  // for items where a fallback tile would mean nothing (press photos, logo
  // downloads). `onEmpty` runs if the container is left empty.
  function removeOnImageError(container, onEmpty) {
    container.querySelectorAll("img").forEach(function (el) {
      el.addEventListener("error", function () {
        var item = el.closest("[data-remove-on-error]");
        if (item && item.parentNode) item.parentNode.removeChild(item);
        if (!container.children.length && onEmpty) onEmpty();
      });
    });
  }

  // ---- Hero ------------------------------------------------------------

  function renderHero(artist) {
    var images = artist.images || {};

    var heroMedia = byId("hero-media");
    if (heroMedia && images.main && images.main.src) {
      var fallback = '<div class="fallback-art fallback-art--hero" aria-hidden="true">' + motifSvg("fallback-art-mark") + "</div>";
      heroMedia.innerHTML = img(images.main, fallback, { className: "epk-hero-img", critical: true });
    }

    // Small logo marks: rendered only if the logo exists — the text
    // wordmark beside each one already carries the brand without it.
    ["hero-logo-slot", "nav-logo-slot", "footer-logo-slot"].forEach(function (id) {
      var slot = byId(id);
      if (!slot) return;
      slot.innerHTML = img(images.logo, "", { critical: id !== "footer-logo-slot" });
      slot.hidden = !slot.innerHTML;
      var logoImg = slot.querySelector("img");
      if (logoImg) logoImg.addEventListener("error", function () { slot.hidden = true; });
    });

    var genre = byId("hero-genre");
    if (genre && artist.genre) genre.textContent = artist.genre;
  }

  // ---- Bio: the single official biography, rendered verbatim ------------

  function renderBio(artist) {
    var bio = byId("bio-text");
    var paras = artist.bioHtml || [];
    if (bio && paras.length) {
      // Presentation only — the opening name block and the closing
      // statement get editorial styling; the text itself is untouched.
      bio.innerHTML = paras.map(function (p, i) {
        var cls = "";
        if (paras.length > 2 && i === 0) cls = ' class="bio-signature"';
        else if (paras.length > 2 && i === paras.length - 1) cls = ' class="bio-mantra"';
        else if (i === 1) cls = ' class="bio-lead"';
        return "<p" + cls + ">" + p + "</p>";
      }).join("");
    }

    var facts = byId("quick-facts-list");
    if (facts && artist.quickFacts && artist.quickFacts.length) {
      facts.innerHTML = artist.quickFacts.map(function (f) {
        var value = f.pending ? '<span class="pending">' + esc(f.value) + "</span>" : esc(f.value);
        return "<div><dt>" + esc(f.label) + "</dt><dd>" + value + "</dd></div>";
      }).join("");
    }
  }

  // ---- The Compass -----------------------------------------------------

  function renderCompass(artist, releases) {
    var images = artist.images || {};
    var emblem = byId("compass-emblem");
    if (emblem && images.logo && images.logo.src) {
      var fallback = '<div class="fallback-art fallback-art--emblem" aria-hidden="true">' + motifSvg("fallback-art-mark") + "</div>";
      emblem.innerHTML = img(images.logo, fallback, { className: "epk-compass-logo" });
    }

    var slogans = byId("compass-slogans");
    if (slogans && artist.slogans && artist.slogans.length) {
      slogans.innerHTML = artist.slogans.map(function (s) { return "<li>“" + esc(s) + "”</li>"; }).join("");
    }

    renderCatalogStats(releases);

    var strip = byId("palette-strip");
    if (strip && artist.palette && artist.palette.length) {
      strip.innerHTML = artist.palette.map(function (sw) {
        return '<div class="swatch"><span class="swatch-color" style="background:' + esc(sw.hex) + ';"></span>' +
          "<span>" + esc(sw.name) + "</span><code>" + esc(sw.hex) + "</code></div>";
      }).join("");
    }
  }

  // Straight counts over data/releases.js — no number is typed by hand.
  function renderCatalogStats(releases) {
    var el = byId("catalog-stats");
    if (!el || !releases.length) return;
    var stats = [{ value: releases.length, label: "Releases" }];
    [["album", "Albums"], ["ep", "EPs"], ["single", "Singles"]].forEach(function (t) {
      var n = releases.filter(function (r) { return r.type === t[0]; }).length;
      if (n) stats.push({ value: n, label: t[1] });
    });
    var years = releases.map(function (r) { return r.year; }).filter(Boolean);
    if (years.length) {
      var min = Math.min.apply(null, years), max = Math.max.apply(null, years);
      stats.push({ value: min === max ? String(min) : min + "–" + max, label: "Catalog years" });
    }
    el.innerHTML = stats.map(function (s) {
      return "<div><dt>" + esc(s.label) + "</dt><dd>" + esc(s.value) + "</dd></div>";
    }).join("");
    el.hidden = false;
  }

  // ---- Music -----------------------------------------------------------

  // Same rule as the shared loader: the single flagged release, else the
  // latest releaseDate among flagged (or all) releases.
  function pickFeatured(releases) {
    if (!releases || !releases.length) return null;
    var flagged = releases.filter(function (r) { return r.featured; });
    if (flagged.length === 1) return flagged[0];
    var pool = flagged.length ? flagged : releases;
    return pool.slice().sort(function (a, b) {
      return (b.releaseDate || "").localeCompare(a.releaseDate || "");
    })[0];
  }

  // Album catalog: every album that has a stored tracklist, newest first as
  // far as the data can tell (exact releaseDate, then year, then catalog
  // order). Albums without tracks stay listed in Full discography only.
  function albumCatalog(releases) {
    return releases
      .map(function (r, i) { return { r: r, i: i }; })
      .filter(function (x) { return isCatalogAlbum(x.r); })
      .sort(function (a, b) {
        return (b.r.releaseDate || "").localeCompare(a.r.releaseDate || "") ||
          (b.r.year || 0) - (a.r.year || 0) ||
          a.i - b.i;
      })
      .map(function (x) { return x.r; });
  }

  function isCatalogAlbum(r) {
    return r.type === "album" && !!(r.tracks && r.tracks.length);
  }

  function typeLabel(type) {
    if (!type) return "";
    return type === "ep" ? "EP" : type.charAt(0).toUpperCase() + type.slice(1);
  }

  function todayIso() {
    var d = new Date();
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  // "Released" / "Releases" follows the actual date when one exists, so an
  // entry whose `status` wasn't updated never reads as upcoming after its
  // release day.
  function releaseDateText(release) {
    if (release.releaseDateDisplay) {
      var verb = "";
      if (release.releaseDate) verb = release.releaseDate <= todayIso() ? "Released " : "Releases ";
      else if (release.status === "upcoming") verb = "Releases ";
      else if (release.status === "released") verb = "Released ";
      return verb + release.releaseDateDisplay;
    }
    return release.year ? String(release.year) : "";
  }

  function releaseMeta(release, detailed) {
    var parts = [typeLabel(release.type)];
    if (detailed && release.genre) parts.push(release.genre);
    if (detailed && release.trackCount) parts.push(release.trackCount + " tracks");
    parts.push(detailed ? releaseDateText(release) : (release.year ? String(release.year) : ""));
    return parts.filter(Boolean).join(" · ");
  }

  // Branded typographic cover — used whenever a release has no cover (or
  // its cover file fails to load). Built only from the release's own data.
  function coverFallbackHtml(release) {
    var meta = [typeLabel(release.type), release.year].filter(Boolean).join(" · ");
    var aka = (C.artist && C.artist.aka) || "";
    return '<div class="cover-fallback" aria-hidden="true">' +
      motifSvg("cover-fallback-mark") +
      (meta ? '<span class="cover-fallback-meta">' + esc(meta) + "</span>" : "") +
      '<span class="cover-fallback-title">' + esc(release.title) + "</span>" +
      (aka ? '<span class="cover-fallback-artist">' + esc(aka) + "</span>" : "") +
      "</div>";
  }

  function coverHtml(release, critical) {
    var cover = release.images && release.images.cover;
    var extra = { className: "release-cover-img", critical: !!critical };
    if (cover && !cover.alt) extra.alt = release.title + " — cover art";
    return '<div class="release-cover">' + img(cover, coverFallbackHtml(release), extra) + "</div>";
  }

  function streamingItems(streaming) {
    if (!streaming) return [];
    var items = [];
    if (streaming.spotify) items.push({ label: "Spotify", url: streaming.spotify });
    if (streaming.appleMusic) items.push({ label: "Apple Music", url: streaming.appleMusic });
    if (streaming.youtube) items.push({ label: "YouTube", url: streaming.youtube });
    (streaming.other || []).forEach(function (o) { if (o && o.url) items.push(o); });
    return items;
  }

  function platformLinksHtml(items, cls) {
    if (!items.length) return "";
    var icon = '<svg aria-hidden="true"><use href="#icon-note"></use></svg>';
    return '<ul class="platform-list ' + (cls || "") + '">' + items.map(function (i) {
      return '<li><a href="' + esc(i.url) + '"' + linkAttrs(i.url) + ">" + icon + esc(i.label) + "</a></li>";
    }).join("") + "</ul>";
  }

  function trackListHtml(tracks) {
    if (!tracks || !tracks.length) return "";
    var items = tracks.map(function (t) { return "<li>" + esc(t.title) + "</li>"; }).join("");
    return '<details class="epk-details"><summary>Track List (' + tracks.length + ')</summary><ol class="track-list">' + items + "</ol></details>";
  }

  function creditsHtml(credits) {
    if (!credits || !credits.length) return "";
    var body = credits.map(function (group) {
      var rows = (group.items || []).map(function (it) {
        return "<dt>" + esc(it.label) + "</dt><dd>" + esc(it.value) + "</dd>";
      }).join("");
      return "<h4>" + esc(group.group) + '</h4><dl class="credits-dl">' + rows + "</dl>";
    }).join("");
    return '<details class="epk-details"><summary>Credits</summary>' + body + "</details>";
  }

  function lyricsHtml(lyrics) {
    if (!lyrics) return "";
    if (lyrics.html) return '<details class="epk-details"><summary>Lyrics</summary><div>' + lyrics.html + "</div></details>";
    if (lyrics.url) return '<p><a href="' + esc(lyrics.url) + '"' + linkAttrs(lyrics.url) + ">View Lyrics →</a></p>";
    return "";
  }

  function releaseActionsHtml(release) {
    var actions = [];
    if (release.guideUrl) {
      actions.push('<a class="epk-cta" href="' + esc(release.guideUrl) + '"><svg aria-hidden="true"><use href="#icon-arrow"></use></svg><span>Open the Album Guide</span></a>');
    }
    if (release.musicVideo && release.musicVideo.url) {
      actions.push('<a class="epk-cta" href="' + esc(release.musicVideo.url) + '"' + linkAttrs(release.musicVideo.url) + "><span>" + esc(release.musicVideo.label || "Watch Music Video") + "</span></a>");
    }
    (release.pressAssets || []).forEach(function (a) {
      if (a && a.href) actions.push('<a class="epk-cta" href="' + esc(a.href) + '"><span>' + esc(a.label || "Press asset") + "</span></a>");
    });
    return actions.length ? '<div class="release-actions">' + actions.join("") + "</div>" : "";
  }

  // Lead release: large cover + full detail (tracklist, credits, …).
  function leadReleaseHtml(release) {
    var meta = releaseMeta(release, true);
    return '<article class="release-lead" id="release-' + esc(release.id) + '">' +
      coverHtml(release, false) +
      '<div class="release-lead-body">' +
        '<p class="release-kicker">Featured Release</p>' +
        '<h3 class="release-lead-title">' + esc(release.title) + "</h3>" +
        (meta ? '<p class="release-meta">' + esc(meta) + "</p>" : "") +
        (release.description ? '<p class="release-copy">' + esc(release.description) + "</p>" : "") +
        (release.releaseStrategy ? '<p class="release-copy">' + esc(release.releaseStrategy) + "</p>" : "") +
        platformLinksHtml(streamingItems(release.streaming), "platform-list--compact") +
        releaseActionsHtml(release) +
        trackListHtml(release.tracks) +
        creditsHtml(release.credits) +
        lyricsHtml(release.lyrics) +
      "</div></article>";
  }

  // One album in the catalog grid: cover (or branded fallback), release
  // info, title, track count and the shared Track List disclosure.
  function albumCardHtml(release) {
    // "Album" is implied by the section, so the info line is just the
    // release date or year — short enough to stay on one line.
    var info = releaseDateText(release);
    var count = release.tracks.length;
    return '<article class="album-card" id="album-' + esc(release.id) + '">' +
      coverHtml(release, false) +
      '<div class="album-card-body">' +
        (info ? '<p class="album-card-info">' + esc(info) + "</p>" : "") +
        '<h3 class="album-card-title">' + esc(release.title) + "</h3>" +
        '<p class="album-card-count">' + count + (count === 1 ? " track" : " tracks") + "</p>" +
        platformLinksHtml(streamingItems(release.streaming), "platform-list--compact") +
        trackListHtml(release.tracks) +
      "</div></article>";
  }

  function catalogRowHtml(release) {
    var search = esc([release.title, release.year, typeLabel(release.type)].join(" ").toLowerCase());
    return '<li class="catalog-row" data-type="' + esc(release.type) + '" data-year="' + esc(release.year) +
      '" data-search="' + search + '">' +
      '<span class="catalog-row-title">' + esc(release.title) + "</span>" +
      '<span class="catalog-row-type">' + esc(typeLabel(release.type)) + "</span>" +
      '<span class="catalog-row-year">' + esc(release.year || "") + "</span></li>";
  }

  function renderMusic(releases) {
    if (!releases.length) return;

    var lead = pickFeatured(releases);
    var leadSlot = byId("release-featured");
    if (leadSlot && lead) leadSlot.innerHTML = leadReleaseHtml(lead);

    // The lead album is already shown in full above, so the grid skips it;
    // the heading still counts the whole collection.
    var catalog = byId("album-catalog-grid");
    var albums = albumCatalog(releases);
    var gridAlbums = albums.filter(function (r) { return r !== lead; });
    if (catalog) catalog.innerHTML = gridAlbums.map(albumCardHtml).join("");
    var albumCount = byId("album-catalog-count");
    if (albumCount) {
      var total = albums.length + " album" + (albums.length === 1 ? "" : "s");
      albumCount.textContent = gridAlbums.length < albums.length && lead
        ? total + " · " + lead.title + " featured above"
        : total;
    }

    // Full discography: newest year first, then catalog order.
    var list = byId("release-archive");
    if (list) {
      list.innerHTML = releases
        .map(function (r, i) { return { r: r, i: i }; })
        .sort(function (a, b) { return (b.r.year || 0) - (a.r.year || 0) || a.i - b.i; })
        .map(function (x) { return catalogRowHtml(x.r); })
        .join("");
    }
    var count = byId("catalog-count");
    if (count) count.textContent = releases.length + (releases.length === 1 ? " release" : " releases");

    initCatalogFilters(releases);
  }

  function initCatalogFilters(releases) {
    var controls = byId("release-controls");
    var list = byId("release-archive");
    var emptyEl = byId("release-empty");
    var search = byId("release-search");
    var yearGroup = byId("release-year-group");
    if (!controls || !list) return;

    // Year buttons come from the data; type buttons with no releases hide.
    var years = Array.from(
      releases.reduce(function (set, r) { if (r.year) set.add(r.year); return set; }, new Set())
    ).sort(function (a, b) { return b - a; });
    if (yearGroup) {
      yearGroup.innerHTML = ['<button type="button" class="release-filter is-active" data-filter-year="all" aria-pressed="true">All Years</button>']
        .concat(years.map(function (y) {
          return '<button type="button" class="release-filter" data-filter-year="' + esc(y) + '" aria-pressed="false">' + esc(y) + "</button>";
        })).join("");
    }
    controls.querySelectorAll("[data-filter-type]").forEach(function (btn) {
      var t = btn.getAttribute("data-filter-type");
      if (t !== "all" && !releases.some(function (r) { return r.type === t; })) btn.hidden = true;
    });

    var state = { type: "all", year: "all", query: "" };

    function apply() {
      var visible = 0;
      list.querySelectorAll(".catalog-row").forEach(function (row) {
        var match =
          (state.type === "all" || row.getAttribute("data-type") === state.type) &&
          (state.year === "all" || row.getAttribute("data-year") === state.year) &&
          (!state.query || (row.getAttribute("data-search") || "").indexOf(state.query) !== -1);
        row.hidden = !match;
        if (match) visible++;
      });
      if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    controls.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter-type], [data-filter-year]");
      if (!btn) return;
      btn.parentElement.querySelectorAll(".release-filter").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      if (btn.hasAttribute("data-filter-type")) state.type = btn.getAttribute("data-filter-type");
      if (btn.hasAttribute("data-filter-year")) state.year = btn.getAttribute("data-filter-year");
      apply();
    });

    if (search) {
      search.addEventListener("input", function () {
        state.query = search.value.trim().toLowerCase();
        apply();
      });
    }

    apply();
  }

  // ---- Listen: featured-release streaming + artist socials --------------

  function socialItems(social) {
    social = social || {};
    return [
      { label: "Instagram", url: social.instagram },
      { label: "Facebook", url: social.facebook },
      { label: "TikTok", url: social.tiktok },
      { label: "YouTube", url: social.youtube }
    ].filter(function (s) { return s.url; });
  }

  // Primary destination: COMPASS.artist.smartLink (Amuse). Every
  // [data-listen-link] element (nav, hero, Listen section, footer) and the
  // [data-all-links] "All links" CTA point there. The static href in
  // epk.html is the no-JS fallback; with no smart link in the data it stays
  // untouched. A rel already set in the markup is kept.
  function applySmartLink(smartLink) {
    if (!smartLink || !smartLink.url) return false;
    document.querySelectorAll("[data-listen-link], [data-all-links]").forEach(function (a) {
      a.href = smartLink.url;
      if (/^https?:/i.test(smartLink.url)) { a.target = "_blank"; if (!a.rel) a.rel = "noopener"; }
    });
    return true;
  }

  function renderListen(artist, releases) {
    var hasSmartLink = applySmartLink(artist.smartLink);
    var list = byId("platform-list");
    var note = byId("platform-note");
    if (!list) return;
    // Secondary: only verified direct URLs already in the data.
    var lead = pickFeatured(releases);
    var items = streamingItems(lead && lead.streaming).concat(socialItems(artist.social));
    var icon = '<svg aria-hidden="true"><use href="#icon-note"></use></svg>';
    list.innerHTML = items.map(function (i) {
      return '<li><a href="' + esc(i.url) + '"' + linkAttrs(i.url) + ">" + icon + esc(i.label) +
        (/^https?:/i.test(i.url) ? '<span class="visually-hidden"> (opens in a new tab)</span>' : "") + "</a></li>";
    }).join("");
    list.hidden = !items.length;
    if (note) note.hidden = hasSmartLink || !!items.length;
  }

  // ---- Press / media ---------------------------------------------------

  function setEmpty(contentId, emptyId, isEmpty) {
    var content = byId(contentId), empty = byId(emptyId);
    if (content) content.hidden = isEmpty;
    if (empty) empty.hidden = !isEmpty;
  }

  function downloadLink(src, label) {
    return '<a class="epk-cta epk-cta--icon" href="' + esc(src) + '" download aria-label="Download ' + esc(label) + '">' +
      '<svg aria-hidden="true"><use href="#icon-download"></use></svg></a>';
  }

  // COMPASS.press.photos: [{ src, alt, width, height, caption, credit? }]
  function renderPhotos(photos) {
    var grid = byId("photos-grid");
    var valid = (photos || []).filter(function (p) { return p && p.src; });
    setEmpty("photos-grid", "photos-empty", !valid.length);
    if (!grid || !valid.length) return;
    grid.innerHTML = valid.map(function (p) {
      var caption = [p.caption, p.credit ? "Photo: " + p.credit : ""].filter(Boolean).join(" · ");
      return '<figure class="press-photo" data-remove-on-error>' +
        '<div class="press-photo-frame">' + img(p, "", { className: "press-photo-img" }) + "</div>" +
        "<figcaption><span>" + esc(caption) + "</span>" + downloadLink(p.src, p.caption || p.alt || "press photo") + "</figcaption></figure>";
    }).join("");
    removeOnImageError(grid, function () { setEmpty("photos-grid", "photos-empty", true); });
  }

  // COMPASS.press.logos: [{ src, alt, label }]
  function renderLogos(logos) {
    var grid = byId("logos-grid");
    var valid = (logos || []).filter(function (l) { return l && l.src; });
    setEmpty("logos-grid", "logos-empty", !valid.length);
    if (!grid || !valid.length) return;
    grid.innerHTML = valid.map(function (l) {
      return '<figure class="press-logo" data-remove-on-error>' +
        '<div class="press-logo-frame">' + img(l, "", { className: "press-logo-img" }) + "</div>" +
        "<figcaption><span>" + esc(l.label || l.alt || "Logo") + "</span>" + downloadLink(l.src, l.label || "logo") + "</figcaption></figure>";
    }).join("");
    removeOnImageError(grid, function () { setEmpty("logos-grid", "logos-empty", true); });
  }

  // COMPASS.press.quotes: [{ quote, source, url }] — real quotes only.
  function renderQuotes(quotes) {
    var el = byId("press-quotes-content");
    var valid = (quotes || []).filter(function (q) { return q && q.quote; });
    setEmpty("press-quotes-content", "quotes-empty", !valid.length);
    if (!el || !valid.length) return;
    el.innerHTML = valid.map(function (q) {
      var src = q.url ? '<a href="' + esc(q.url) + '"' + linkAttrs(q.url) + ">" + esc(q.source) + "</a>" : esc(q.source);
      return '<blockquote class="press-quote"><p>“' + esc(q.quote) + "”</p>" + (q.source ? "<footer>" + src + "</footer>" : "") + "</blockquote>";
    }).join("");
  }

  // ---- Booking ---------------------------------------------------------

  function contactField(value, placeholder) {
    return value ? esc(value) : '<span class="pending">' + esc(placeholder) + "</span>";
  }

  function emailField(value, placeholder) {
    return value ? '<a href="mailto:' + esc(value) + '">' + esc(value) + "</a>" : contactField(value, placeholder);
  }

  function renderBooking(press) {
    var contacts = press.contacts || {};
    var bk = contacts.booking || {};
    var pm = contacts.pressMedia || {};

    var bookingDl = byId("contact-booking-dl");
    if (bookingDl) {
      bookingDl.innerHTML =
        "<dt>Contact name</dt><dd>" + contactField(bk.name, "name") + "</dd>" +
        "<dt>Email</dt><dd>" + emailField(bk.email, "email") + "</dd>";
    }
    var pressDl = byId("contact-press-dl");
    if (pressDl) {
      pressDl.innerHTML =
        "<dt>Contact name</dt><dd>" + contactField(pm.name, "name") + "</dd>" +
        "<dt>Role</dt><dd>" + contactField(pm.role, "role") + "</dd>" +
        "<dt>Email</dt><dd>" + emailField(pm.email, "email") + "</dd>" +
        "<dt>Phone</dt><dd>" + contactField(pm.phone, "phone (optional)") + "</dd>";
    }

    // The primary "Email Booking" CTA exists only once a real address is in
    // data/press.js — no address is ever guessed.
    var ctas = byId("booking-ctas");
    var email = bk.email || pm.email;
    if (ctas && email) {
      ctas.insertAdjacentHTML("afterbegin",
        '<a class="epk-cta epk-cta--solid epk-cta--lg" href="mailto:' + esc(email) + '">' +
        '<svg aria-hidden="true"><use href="#icon-mail"></use></svg><span>Email Booking</span></a>');
    }

    var live = byId("live-dates");
    var dates = (press.liveDates || []).filter(function (d) { return d && d.date; });
    if (live && dates.length) {
      live.innerHTML = '<div class="table-scroll"><table class="epk-table"><thead><tr><th>Date</th><th>City</th><th>Venue</th><th><span class="visually-hidden">Link</span></th></tr></thead><tbody>' +
        dates.map(function (d) {
          var link = d.url ? '<a href="' + esc(d.url) + '"' + linkAttrs(d.url) + ">Tickets</a>" : "";
          return "<tr><td>" + esc(d.date) + "</td><td>" + esc(d.city || "") + "</td><td>" + esc(d.venue || "") + "</td><td>" + link + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }

    var rider = byId("tech-rider-content");
    if (rider && press.rider) {
      rider.innerHTML = typeof press.rider === "string" ? "<p>" + esc(press.rider) + "</p>" : (press.rider.html || rider.innerHTML);
    }
  }

  // ---- Footer ----------------------------------------------------------

  function renderFooterSocial(social) {
    var el = byId("footer-social");
    if (!el) return;
    var items = socialItems(social);
    el.innerHTML = items.map(function (s) {
      return '<li><a href="' + esc(s.url) + '"' + linkAttrs(s.url) + ">" + esc(s.label) + "</a></li>";
    }).join("");
    el.hidden = !items.length;
  }

  // ======================================================================
  // Behavior
  // ======================================================================

  // Reveal on scroll — same IntersectionObserver pattern as script.js.
  function initReveal() {
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  // "Download Press Kit" — print-to-PDF of this page, as before. Forces all
  // reveal-on-scroll sections visible so nothing prints blank.
  function initPrint() {
    document.querySelectorAll('[data-action="download-kit"]').forEach(function (btn) {
      btn.addEventListener("click", function () { window.print(); });
    });
    window.addEventListener("beforeprint", function () {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
    });
  }

  // Mobile menu toggle + scrolled state for the sticky nav.
  function initNav() {
    var nav = byId("epk-nav");
    var toggle = byId("epk-nav-toggle");
    var links = byId("epk-nav-links");
    if (!nav) return;

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    }

    if (toggle && links) {
      toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("is-open")); });
      links.addEventListener("click", function (e) { if (e.target.closest("a, button")) setOpen(false); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
      });
      document.addEventListener("click", function (e) {
        if (nav.classList.contains("is-open") && !nav.contains(e.target)) setOpen(false);
      });
    }

    function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 24); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  renderEpkPage();
  initReveal();
  initPrint();
  initNav();
})();
