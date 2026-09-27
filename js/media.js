/* ==========================================================================
   THE COMPASS — image/media rendering helpers.
   One place that decides how every image on the site behaves: responsive
   attributes, lazy loading, explicit dimensions to avoid layout shift, and
   what to show when an image isn't available yet. Used by
   js/content-loader.js; safe to include on any page.
   ========================================================================== */

window.COMPASS = window.COMPASS || {};

COMPASS.media = (function () {
  "use strict";

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /**
   * Build an <img> (or <picture> when multiple srcset sources are given) as
   * an HTML string, or return the supplied fallback markup untouched when
   * no image data is available yet. Never leaves a broken-image icon: when
   * data.src is missing we render the fallback outright (no request at
   * all); when data.src is present but 404s at runtime, onerror swaps to
   * the same fallback.
   *
   * data: { src, srcset?: [{src,width}], sizes?, alt, width, height, critical?, className? }
   * fallbackHtml: markup shown when data is null/undefined or has no src.
   */
  function imgHTML(data, fallbackHtml) {
    fallbackHtml = fallbackHtml || "";
    if (!data || !data.src) return fallbackHtml;

    var alt = esc(data.alt || "");
    var cls = data.className ? ' class="' + esc(data.className) + '"' : "";
    var dims = "";
    if (data.width) dims += ' width="' + parseInt(data.width, 10) + '"';
    if (data.height) dims += ' height="' + parseInt(data.height, 10) + '"';
    var loading = data.critical ? "eager" : "lazy";
    var fallbackAttr = ' data-fallback="1"';

    // Wrap the fallback markup in a hidden holder we can reveal via onerror
    // without needing a separate stylesheet rule per call site.
    var fallbackWrap = '<span class="media-fallback" style="display:none;"' + fallbackAttr + '>' + fallbackHtml + '</span>';
    var onerror = "this.style.display='none'; var fb=this.nextElementSibling; if(fb){fb.style.display='';}";

    var imgTag = '<img' + cls + ' src="' + esc(data.src) + '" alt="' + alt + '"' + dims +
      ' loading="' + loading + '" decoding="async" onerror="' + onerror + '">';

    if (data.srcset && data.srcset.length) {
      var srcset = data.srcset.map(function (s) { return esc(s.src) + " " + s.width + "w"; }).join(", ");
      imgTag = '<img' + cls + ' src="' + esc(data.src) + '" srcset="' + srcset + '"' +
        (data.sizes ? ' sizes="' + esc(data.sizes) + '"' : "") +
        ' alt="' + alt + '"' + dims + ' loading="' + loading + '" decoding="async" onerror="' + onerror + '">';
    }

    return imgTag + fallbackWrap;
  }

  /**
   * Set (or clear) a background-image slot that follows the same pattern
   * script.js already uses for [data-bg] elements: only probe for an image
   * when we actually have a path, so a missing image never causes a
   * console error or a failed request. Call this BEFORE script.js's own
   * [data-bg] probe runs (content-loader.js is loaded first).
   */
  function applyBg(el, data) {
    if (!el) return;
    if (data && data.src) {
      el.setAttribute("data-bg", data.src);
    } else {
      el.removeAttribute("data-bg");
    }
  }

  /**
   * Apply image data directly onto an existing <img> element that already
   * has a sibling fallback element in the markup (the pattern used by
   * index.html's cover-art and wordmark slots). Leaves everything at its
   * markup default (img inert, fallback visible) when data is null.
   */
  function applyImg(imgEl, data) {
    if (!imgEl) return;
    if (!data || !data.src) return;
    var fallback = imgEl.nextElementSibling;
    if (fallback) fallback.style.display = "none";
    imgEl.style.display = "";
    imgEl.src = data.src;
    if (data.alt) imgEl.alt = data.alt;
    if (data.width) imgEl.width = data.width;
    if (data.height) imgEl.height = data.height;
    imgEl.loading = data.critical ? "eager" : "lazy";
    imgEl.decoding = "async";
  }

  return { imgHTML: imgHTML, applyBg: applyBg, applyImg: applyImg };
})();
