// =============================================================
//  MAIN.JS — Site interactions
//  All sections are clearly labelled with explanations of
//  design/development decisions for each feature.
// =============================================================


// ── TIMELINE SCROLL PROGRESS (home page) ─────────────────────
// Tracks how far the user has scrolled down the page and updates
// the visual fill bar in the sidebar timeline accordingly.
// Using window.scrollY + scrollHeight for a reliable cross-browser
// scroll percentage calculation.

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;

  // Avoid division by zero on very short pages
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  const fill = document.getElementById("timelineFill");
  if (fill) fill.style.height = progress + "%";
});


// ── ACTIVE SIDEBAR ITEM FROM SCROLL (home page) ───────────────
// Highlights the correct sidebar nav item as the user scrolls
// past each section. Using IntersectionObserver instead of a
// scroll event listener for better performance — it only fires
// when a section enters/exits the viewport, not on every pixel.

(function () {
  const sections = document.querySelectorAll("section[id]");
  const tlItems  = document.querySelectorAll(".tl-item[href^='#']");

  // Exit early if neither sections nor nav items exist on this page
  if (!sections.length || !tlItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;

          // Toggle .active only on the matching nav item
          tlItems.forEach((item) => {
            const href = item.getAttribute("href").replace("#", "");
            item.classList.toggle("active", href === id);
          });
        }
      });
    },
    // 40% of the section must be visible before it's considered "active"
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
})();


// ── PAGE TRANSITION (smooth fade out before navigate) ─────────
// Fades the page out before navigating to internal .html links,
// giving a smoother feel than an abrupt page jump.
// Skips anchor (#) and external (http) links — those should
// behave normally without a fade.

document.querySelectorAll("a[href]").forEach((link) => {
  const href = link.getAttribute("href");

  // Skip anchor links and external URLs
  if (!href || href.startsWith("#") || href.startsWith("http")) return;

  link.addEventListener("click", (e) => {
    e.preventDefault();

    // Fade out, then navigate after the transition completes
    document.body.style.transition = "opacity 0.35s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
      window.location.href = href;
    }, 350);
  });
});


// ── RESTORE OPACITY ON LOAD ───────────────────────────────────
// After navigating to a new page, the body opacity is reset to 1.
// Using pageshow instead of DOMContentLoaded so it also fires
// correctly when the user navigates back via the browser's
// back button (which uses the bfcache and skips DOMContentLoaded).

window.addEventListener("pageshow", () => {
  document.body.style.transition = "opacity 0.35s ease";
  document.body.style.opacity = "1";
});


// ── MOBILE MENU TOGGLE ────────────────────────────────────────
// Shows/hides the sidebar on mobile using a hamburger button.
// The sidebar uses a CSS class (.open) to slide in, and an
// overlay behind it closes the menu when tapped — standard
// mobile nav pattern for usability.
//
// Null checks are required here because this JS file is shared
// across all pages. On pages without a menu toggle (e.g. detail
// pages), these elements won't exist and would throw errors
// that break everything below this point.

const menuToggle = document.querySelector(".menu-toggle");
const sidebar    = document.querySelector(".sidebar");
const overlay    = document.querySelector(".sidebar-overlay");

if (menuToggle && sidebar && overlay) {

  // Toggle sidebar open/closed when hamburger is clicked
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("active");
  });

  // Close sidebar when the dark overlay behind it is tapped
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  });
}


// ── FADE-IN ON SCROLL ─────────────────────────────────────────
// Any element with the class .fade-in will animate into view
// when it enters the viewport. Using IntersectionObserver for
// performance (same reasoning as the sidebar active state above).
// Named fadeObserver to avoid collision with the sidebar observer.

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // Stop observing once visible — no need to keep watching
      fadeObserver.unobserve(entry.target);
    }
  });
});

document.querySelectorAll(".fade-in").forEach((el) => {
  fadeObserver.observe(el);
});