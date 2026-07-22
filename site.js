/* ==========================================================================
   THE COMPASS — Brand Site
   Shared behavior: sticky header state, mobile nav toggle, scroll reveals,
   symbolic release countdown. No frameworks.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------- Header scroll state ---------------- */
  var header = document.querySelector(".site-header");

  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    siteNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        siteNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Scroll reveals ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
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

  /* ---------------- Symbolic release countdown ----------------
     Framed as "the pattern completing," never as urgency/pressure —
     see BRAND_BIBLE.md and RELEASE_PLAN.md, Phase 5.
  ------------------------------------------------------------- */
  var countdownEls = document.querySelectorAll("[data-countdown-to]");
  countdownEls.forEach(function (el) {
    var target = new Date(el.getAttribute("data-countdown-to") + "T00:00:00Z");
    var now = new Date();
    var diffMs = target - now;
    var days = Math.ceil(diffMs / 86400000);
    var label = el.querySelector("[data-countdown-value]") || el;
    if (days > 1) {
      label.textContent = days + " days";
    } else if (days === 1) {
      label.textContent = "1 day";
    } else if (days === 0) {
      label.textContent = "today";
    } else {
      label.textContent = "released";
    }
  });
})();
