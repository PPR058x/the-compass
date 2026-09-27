/* ==========================================================================
   THE COMPASS — content loader.
   Reads window.COMPASS (populated by data/artist.js, data/releases.js,
   data/press.js) and renders it into whichever page is currently loaded.
   Both renderAlbumGuide() and renderEpk() are no-ops on a page that doesn't
   contain their anchor element, so this one file is safe to include on
   every page. Must run BEFORE script.js / epk.js (both are loaded after
   this file), and before script.js's own [data-bg] probe in particular.

   If data ever fails to load for any reason, every element this file
   touches simply keeps its existing static markup — nothing goes blank.
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

  // ------------------------------------------------------------------
  // index.html — Album Guide: image slots only (narrative text untouched)
  // ------------------------------------------------------------------
  function renderAlbumGuide() {
    var coverSection = byId("cover");
    if (!coverSection || !window.COMPASS || !COMPASS.media) return; // not this page, or media.js missing

    var artist = C.artist || {};
    var release = (C.releases || []).filter(function (r) { return r.id === "the-awakening-code"; })[0];

    // Favicon
    if (artist.images && artist.images.favicon && artist.images.favicon.src) {
      var favicon = document.querySelector('link[rel="icon"]');
      if (favicon) favicon.href = artist.images.favicon.src;
    }

    if (release) {
      // Cover artwork
      var coverImg = document.querySelector(".cover-art img");
      COMPASS.media.applyImg(coverImg, release.images && release.images.cover);

      // Cover + act-divider backgrounds
      COMPASS.media.applyBg(coverSection, release.images && release.images.coverBackground);
      ["act-i", "act-ii", "act-iii", "act-iv"].forEach(function (id) {
        COMPASS.media.applyBg(byId(id), release.images && release.images.actBackground);
      });
    }

    // Wordmark / logo
    var wordmarkImg = document.querySelector(".wordmark img");
    COMPASS.media.applyImg(wordmarkImg, artist.images && artist.images.logo);
  }

  // ------------------------------------------------------------------
  // epk.html
  // ------------------------------------------------------------------
  function renderEpk() {
    var intro = byId("intro");
    if (!intro) return; // not this page

    var artist = C.artist || {};
    var press = C.press || {};
    var releases = C.releases || [];

    renderMasthead(artist);
    renderBio(artist);
    renderStreamingSection(artist, releases);
    renderReleaseArchive(releases);
    renderPhotos(press.photos);
    renderPalette(artist.palette);
    renderLogos(press.logos);
    renderQuotes(press.quotes);
    renderLiveDates(press.liveDates);
    renderRider(press.rider);
    renderContacts(press.contacts);
  }

  function mastheadPhotoHtml(images) {
    var img = images && images.main;
    var fallback = '<span class="frame-caption">Artist photo — pending</span>';
    var inner = COMPASS.media ? COMPASS.media.imgHTML(img, fallback) : fallback;
    return '<div class="epk-frame epk-masthead-frame">' + inner + "</div>";
  }

  function renderMasthead(artist) {
    var photoSlot = byId("masthead-photo");
    if (photoSlot) photoSlot.innerHTML = mastheadPhotoHtml(artist.images);

    var navLogo = document.querySelector(".epk-nav-logo");
    if (navLogo && COMPASS.media) COMPASS.media.applyImg(navLogo, artist.images && artist.images.logo);

    var name = byId("masthead-name");
    if (name && artist.name) name.textContent = artist.name;

    var factLine = byId("masthead-factline");
    if (factLine && (artist.genre || artist.brand)) {
      factLine.textContent = [artist.genre, artist.brand].filter(Boolean).join(" · ");
    }

    var slogans = byId("masthead-slogans");
    if (slogans && artist.slogans && artist.slogans.length) {
      slogans.innerHTML = artist.slogans.map(function (s) {
        return "<span>\"" + esc(s) + "\"</span>";
      }).join("");
    }
  }

  // Single official bio — no separate short-bio rendering path exists.
  function renderBio(artist) {
    var quickFacts = byId("quick-facts-list");
    if (quickFacts && artist.quickFacts && artist.quickFacts.length) {
      quickFacts.innerHTML = artist.quickFacts.map(function (f) {
        var value = f.pending ? '<span class="pending">' + esc(f.value) + "</span>" : esc(f.value);
        return "<li><strong>" + esc(f.label) + ":</strong> " + value + "</li>";
      }).join("");
    }

    var bio = byId("bio-text");
    if (bio && artist.bioHtml && artist.bioHtml.length) {
      bio.innerHTML = artist.bioHtml.map(function (p) { return "<p>" + p + "</p>"; }).join("");
    }
  }

  function platformItem(label, url) {
    var icon = '<svg aria-hidden="true"><use href="#icon-note"></use></svg>';
    if (url) return "<li><a href=\"" + esc(url) + "\">" + icon + esc(label) + "</a></li>";
    return '<li class="pending">' + icon + esc(label) + "</li>";
  }

  function renderStreamingSection(artist, releases) {
    var list = byId("platform-list");
    if (!list) return;
    var featured = pickFeatured(releases);
    var streaming = (featured && featured.streaming) || {};
    var social = artist.social || {};

    var items = [
      platformItem("Spotify", streaming.spotify),
      platformItem("Apple Music", streaming.appleMusic),
      platformItem("YouTube", streaming.youtube)
    ];
    (streaming.other || []).forEach(function (o) { items.push(platformItem(o.label, o.url)); });
    items.push(platformItem("Instagram", social.instagram));
    items.push(platformItem("Facebook", social.facebook));
    items.push(platformItem("TikTok", social.tiktok));

    list.innerHTML = items.join("");
  }

  function pickFeatured(releases) {
    if (!releases || !releases.length) return null;
    var flagged = releases.filter(function (r) { return r.featured; });
    if (flagged.length === 1) return flagged[0];
    var pool = flagged.length ? flagged : releases;
    return pool.slice().sort(function (a, b) {
      return (b.releaseDate || "").localeCompare(a.releaseDate || "");
    })[0];
  }

  // ---- Release Archive ------------------------------------------------

  function coverFrameHtml(images) {
    var img = images && images.cover;
    var fallback = '<span class="frame-caption">Cover art — pending</span>';
    var inner = COMPASS.media ? COMPASS.media.imgHTML(img, fallback) : fallback;
    return '<div class="epk-frame" style="width:96px;height:96px;margin-bottom:0.5em;">' + inner + "</div>";
  }

  function releaseStreamingHtml(streaming) {
    if (!streaming) return "";
    var items = [];
    if (streaming.spotify) items.push({ label: "Spotify", url: streaming.spotify });
    if (streaming.appleMusic) items.push({ label: "Apple Music", url: streaming.appleMusic });
    if (streaming.youtube) items.push({ label: "YouTube", url: streaming.youtube });
    (streaming.other || []).forEach(function (o) { items.push(o); });
    if (!items.length) return "";
    var icon = '<svg aria-hidden="true"><use href="#icon-note"></use></svg>';
    return '<ul class="platform-list">' + items.map(function (i) {
      return "<li><a href=\"" + esc(i.url) + "\">" + icon + esc(i.label) + "</a></li>";
    }).join("") + "</ul>";
  }

  function trackListDetailsHtml(tracks) {
    if (!tracks || !tracks.length) return "";
    var items = tracks.map(function (t) { return "<li>" + esc(t.title) + "</li>"; }).join("");
    return "<details class=\"epk-details\"><summary>Track List (" + tracks.length + ")</summary><ol class=\"track-list\">" + items + "</ol></details>";
  }

  function creditsDetailsHtml(credits) {
    if (!credits || !credits.length) return "";
    var body = credits.map(function (group) {
      var rows = (group.items || []).map(function (it) {
        return "<dt>" + esc(it.label) + "</dt><dd>" + esc(it.value) + "</dd>";
      }).join("");
      return "<h4>" + esc(group.group) + "</h4><dl class=\"credits-dl\">" + rows + "</dl>";
    }).join("");
    return "<details class=\"epk-details\"><summary>Credits</summary>" + body + "</details>";
  }

  function lyricsHtml(lyrics) {
    if (!lyrics) return "";
    if (lyrics.html) return "<details class=\"epk-details\"><summary>Lyrics</summary><div>" + lyrics.html + "</div></details>";
    if (lyrics.url) return "<p><a href=\"" + esc(lyrics.url) + "\">View Lyrics →</a></p>";
    return "";
  }

  function pressAssetsHtml(assets) {
    if (!assets || !assets.length) return "";
    return "<p>" + assets.map(function (a) {
      return "<a class=\"epk-cta\" href=\"" + esc(a.href) + "\"><span>" + esc(a.label) + "</span></a>";
    }).join(" ") + "</p>";
  }

  function typeLabel(type) {
    return type === "ep" ? "EP" : type.charAt(0).toUpperCase() + type.slice(1);
  }

  // Only title/type/year are guaranteed for most of the catalog. Per spec,
  // unavailable fields are simply omitted from the card — no "(pending)"
  // placeholder text shown to visitors (the data layer still holds null
  // internally; that's the source of truth for what's missing).
  function renderReleaseCard(release, isFeatured) {
    var metaParts = [typeLabel(release.type)];
    if (release.genre) metaParts.push(release.genre);
    if (release.trackCount) metaParts.push(release.trackCount + " tracks");
    if (release.releaseDateDisplay) {
      var verb = release.status === "upcoming" ? "Releases " : release.status === "released" ? "Released " : "";
      metaParts.push(verb + release.releaseDateDisplay);
    } else if (release.year) {
      metaParts.push(String(release.year));
    }

    var searchText = esc([release.title, release.year, typeLabel(release.type)].join(" ").toLowerCase());

    var html = '<div class="epk-card' + (isFeatured ? " epk-card--featured" : "") +
      '" data-type="' + esc(release.type) + '" data-year="' + esc(release.year) +
      '" data-search="' + searchText + '">';
    if (isFeatured) {
      html += '<p class="epk-card-meta" style="color:var(--color-gold);letter-spacing:0.08em;text-transform:uppercase;">Featured Release</p>';
    }
    html += coverFrameHtml(release.images);
    html += "<h3>" + esc(release.title) + "</h3>";
    if (metaParts.length) html += '<p class="epk-card-meta">' + esc(metaParts.join(" · ")) + "</p>";
    if (release.description) html += "<p>" + esc(release.description) + "</p>";
    if (release.releaseStrategy) html += "<p>" + esc(release.releaseStrategy) + "</p>";
    html += releaseStreamingHtml(release.streaming);
    if (release.guideUrl) html += '<p><a href="' + esc(release.guideUrl) + '">Open the official Album Guide →</a></p>';
    html += trackListDetailsHtml(release.tracks);
    html += creditsDetailsHtml(release.credits);
    if (release.musicVideo) {
      html += '<p><a class="epk-cta" href="' + esc(release.musicVideo.url) + '"><span>' + esc(release.musicVideo.label || "Watch Music Video") + "</span></a></p>";
    }
    html += lyricsHtml(release.lyrics);
    html += pressAssetsHtml(release.pressAssets);
    html += "</div>";
    return html;
  }

  function initReleaseFilters(releases) {
    var controls = byId("release-controls");
    var grid = byId("release-archive");
    var emptyEl = byId("release-empty");
    var searchInput = byId("release-search");
    var yearGroup = byId("release-year-group");
    if (!controls || !grid) return;

    // Year filter buttons are fully data-driven — a new year in the data
    // makes a new button appear automatically, no HTML/JS change needed.
    var years = Array.from(
      releases.reduce(function (set, r) { if (r.year) set.add(r.year); return set; }, new Set())
    ).sort(function (a, b) { return a - b; });
    if (yearGroup) {
      var yearButtons = ['<button type="button" class="release-filter is-active" data-filter-year="all" aria-pressed="true">All Years</button>'];
      years.forEach(function (y) {
        yearButtons.push('<button type="button" class="release-filter" data-filter-year="' + y + '" aria-pressed="false">' + y + "</button>");
      });
      yearGroup.innerHTML = yearButtons.join("");
    }

    var state = { type: "all", year: "all", query: "" };

    function apply() {
      var cards = grid.querySelectorAll(".epk-card");
      var visible = 0;
      cards.forEach(function (card) {
        var matches =
          (state.type === "all" || card.getAttribute("data-type") === state.type) &&
          (state.year === "all" || card.getAttribute("data-year") === state.year) &&
          (!state.query || (card.getAttribute("data-search") || "").indexOf(state.query) !== -1);
        card.style.display = matches ? "" : "none";
        if (matches) visible++;
      });
      if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    controls.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-filter-type], [data-filter-year]");
      if (!btn) return;
      var group = btn.parentElement;
      group.querySelectorAll(".release-filter").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      if (btn.hasAttribute("data-filter-type")) state.type = btn.getAttribute("data-filter-type");
      if (btn.hasAttribute("data-filter-year")) state.year = btn.getAttribute("data-filter-year");
      apply();
    });

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.query = searchInput.value.trim().toLowerCase();
        apply();
      });
    }

    apply();
  }

  function renderReleaseArchive(releases) {
    var featuredSlot = byId("release-featured");
    var grid = byId("release-archive");
    if (!grid || !releases || !releases.length) return;

    var featured = pickFeatured(releases);
    if (featuredSlot && featured) {
      featuredSlot.innerHTML = '<div class="epk-grid">' + renderReleaseCard(featured, true) + "</div>";
    }

    // One unified, filterable grid — every release, including the featured
    // one again (so it's still reachable from its own type/year filter).
    grid.innerHTML = releases.map(function (r) { return renderReleaseCard(r, false); }).join("");

    initReleaseFilters(releases);
  }

  // ---- Photos / palette / quotes / live / rider / contacts ------------

  function renderPhotos(photos) {
    var grid = byId("photos-grid");
    if (!grid || !photos || !photos.length) return; // keep existing pending tiles
    grid.innerHTML = photos.map(function (p) {
      var img = COMPASS.media ? COMPASS.media.imgHTML(p, '<span class="frame-caption">Press photo — pending</span>') : "";
      var dl = p.src ? '<a class="epk-cta" href="' + esc(p.src) + '" download aria-label="Download photo"><svg aria-hidden="true"><use href="#icon-download"></use></svg></a>' : "";
      return '<div class="epk-frame">' + img + dl + "</div>";
    }).join("");
  }

  function renderPalette(palette) {
    var strip = byId("palette-strip");
    if (!strip || !palette || !palette.length) return;
    strip.innerHTML = palette.map(function (sw) {
      return '<div class="swatch"><div class="swatch-color" style="background:' + esc(sw.hex) + ';"></div>' + esc(sw.name) + "<br>" + esc(sw.hex) + "</div>";
    }).join("");
  }

  function renderLogos(logos) {
    var slot = byId("brand-logo-slot");
    if (!slot || !logos || !logos.length) return; // keep existing pending block
    slot.className = "epk-grid";
    slot.removeAttribute("style");
    slot.innerHTML = logos.map(function (l) {
      var img = COMPASS.media ? COMPASS.media.imgHTML(l, '<span class="frame-caption">Logo</span>') : "";
      return '<div class="epk-frame" style="width:120px;height:120px;">' + img +
        '<a class="epk-cta" href="' + esc(l.src) + '" download aria-label="Download ' + esc(l.label || "logo") + '"><svg aria-hidden="true"><use href="#icon-download"></use></svg></a></div>';
    }).join("");
  }

  function renderQuotes(quotes) {
    var el = byId("press-quotes-content");
    if (!el || !quotes || !quotes.length) return;
    el.className = "";
    el.innerHTML = quotes.map(function (q) {
      var src = q.url ? '<a href="' + esc(q.url) + '">' + esc(q.source) + "</a>" : esc(q.source);
      return "<blockquote>“" + esc(q.quote) + "”<footer>" + src + "</footer></blockquote>";
    }).join("");
  }

  function renderLiveDates(dates) {
    var body = byId("live-dates-body");
    if (!body || !dates || !dates.length) return;
    body.innerHTML = dates.map(function (d) {
      var link = d.url ? '<a href="' + esc(d.url) + '">Tickets</a>' : '<span class="pending">link</span>';
      return "<tr><td>" + esc(d.date) + "</td><td>" + esc(d.city) + "</td><td>" + esc(d.venue) + "</td><td>" + link + "</td></tr>";
    }).join("");
  }

  function renderRider(rider) {
    var el = byId("tech-rider-content");
    if (!el || !rider) return;
    el.innerHTML = typeof rider === "string" ? "<p>" + esc(rider) + "</p>" : rider.html || "";
  }

  function contactField(value, placeholder) {
    return value ? esc(value) : '<span class="pending">' + esc(placeholder) + "</span>";
  }

  function renderContacts(contacts) {
    if (!contacts) return;
    var pressDl = byId("contact-press-dl");
    if (pressDl && contacts.pressMedia) {
      var pm = contacts.pressMedia;
      pressDl.innerHTML =
        "<dt>Contact name</dt><dd>" + contactField(pm.name, "name") + "</dd>" +
        "<dt>Role</dt><dd>" + contactField(pm.role, "role") + "</dd>" +
        "<dt>Email</dt><dd>" + contactField(pm.email, "email") + "</dd>" +
        "<dt>Phone</dt><dd>" + contactField(pm.phone, "phone (optional)") + "</dd>";
    }
    var bookingDl = byId("contact-booking-dl");
    if (bookingDl && contacts.booking) {
      var bk = contacts.booking;
      bookingDl.innerHTML =
        "<dt>Contact name</dt><dd>" + contactField(bk.name, "name") + "</dd>" +
        "<dt>Email</dt><dd>" + contactField(bk.email, "email") + "</dd>";
    }
  }

  renderAlbumGuide();
  renderEpk();
})();
