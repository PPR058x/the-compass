/* ==========================================================================
   THE AWAKENING CODE — Premium Digital Book
   Phase 2: reading progress, back-to-top, two-speed scroll reveals,
   accessible TOC panel with focus management, graceful optional-asset
   loading. No frameworks, no scroll-hijacking — position:sticky handles
   the Four Acts sequence entirely in CSS.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Reading progress bar ---------------- */
  var progressBar = document.querySelector(".progress-bar");

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }

  /* ---------------- Back to top ---------------- */
  var backToTop = document.querySelector(".back-to-top");

  function updateBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > window.innerHeight * 0.6) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var onScroll = function () {
    updateProgress();
    updateBackToTop();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------------- Two-speed scroll reveals ----------------
     .reveal    — quiet, quick (reading-mode prose)
     .reveal-slow — held, slow (statement-mode pull-quotes, act stages)
  ------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-slow");

  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------- Sticky Table of Contents panel ---------------- */
  var tocToggle = document.querySelector(".toc-toggle");
  var tocPanel = document.querySelector(".toc-panel");
  var tocClose = document.querySelector(".toc-close");
  var lastFocused = null;

  function openToc() {
    if (!tocPanel) return;
    lastFocused = document.activeElement;
    tocPanel.classList.add("is-open");
    tocPanel.setAttribute("aria-hidden", "false");
    if (tocClose) tocClose.focus();
  }

  function closeToc() {
    if (!tocPanel) return;
    tocPanel.classList.remove("is-open");
    tocPanel.setAttribute("aria-hidden", "true");
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  if (tocToggle) tocToggle.addEventListener("click", openToc);
  if (tocClose) tocClose.addEventListener("click", closeToc);

  if (tocPanel) {
    tocPanel.addEventListener("click", function (e) {
      if (e.target === tocPanel) closeToc();
    });
    tocPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeToc);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && tocPanel.classList.contains("is-open")) closeToc();
    });
  }

  /* ---------------- Graceful optional background images ---------------- */
  function tryOptionalBackground(el) {
    var src = el.getAttribute("data-bg");
    if (!src) return;
    var probe = new Image();
    probe.onload = function () { el.style.setProperty("--bg-image", "url('" + src + "')"); };
    probe.onerror = function () {};
    probe.src = src;
  }
  document.querySelectorAll("[data-bg]").forEach(tryOptionalBackground);
})();
