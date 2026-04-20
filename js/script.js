"use strict";

/* ======================================================
   script.js — Production Version
   Clean • Modular • Optimized • Root-Safe
====================================================== */

/* ======================================================
   UTIL
====================================================== */

const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

/* ======================================================
   THEME SYSTEM
====================================================== */

function applyTheme(theme) {
  document.body.classList.toggle("theme-dark", theme === "dark");
  document.body.classList.toggle("theme-light", theme === "light");

  const btn = $("themeToggle");
  if (btn) btn.textContent = theme === "dark" ? "🌙" : "☀️";

  updateLogo();
}

function initTheme() {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));
}

function setupThemeToggle() {
  const btn = $("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const next = document.body.classList.contains("theme-dark")
      ? "light"
      : "dark";

    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}

/* ======================================================
   LOGO SYSTEM (ROOT SAFE)
====================================================== */

function updateLogo() {
  const theme = document.body.classList.contains("theme-light")
    ? "day"
    : "night";

  ["siteLogo", "personalLogo"].forEach(id => {
    const logo = document.getElementById(id);
    if (logo) {
      logo.src = `/logo/${theme}-logo.png`;
    }
  });
}

/* ======================================================
   ACTIVE NAV (SMART MATCH)
====================================================== */

function initActiveNav() {

  const current = window.location.pathname.replace(/\/$/, "");

  $$(".nav-list a").forEach(link => {

    const target = link.pathname.replace(/\/$/, "");

    /* Home page exact match */
    if (target === "" || target === "/") {
      if (current === "" || current === "/") {
        link.classList.add("active");
      }
      return;
    }

    /* Other pages */
    if (current === target || current.startsWith(target + "/")) {
      link.classList.add("active");
    }

  });

}

/* ======================================================
   FOOTER SYSTEM
====================================================== */

function updateClock() {
  const el = $("footerClock");
  if (!el) return;

  el.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function updateStatus() {
  const el = $("status");
  if (!el) return;

  const hour = parseInt(
    new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false
    }),
    10
  );
  el.textContent =
    hour >= 10 && hour < 22 ? "STATUS: ACTIVE" : "STATUS: OFFLINE";
}

function startFooterUpdates() {
  updateClock();
  updateStatus();
  setInterval(() => {
    updateClock();
    updateStatus();
  }, 60000);
}

/* ======================================================
   SOCIAL LINKS (inline SVG — no external CDN dependency)
====================================================== */

function loadSocials() {
  const box = $("socialLinks");
  if (!box) return;

  const links = [
    { name: "Facebook",  url: "https://www.facebook.com/kingofyadav.in" },
    { name: "Instagram", url: "https://www.instagram.com/kingofyadav.in" },
    { name: "YouTube",   url: "https://www.youtube.com/@kingofyadav-in" },
    { name: "GitHub",    url: "https://github.com/kingofyadav" }
  ];

  box.innerHTML = links
    .map(({ name, url }) => `
      <a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${name}">
        ${getSVGIcon(name)}
      </a>`)
    .join("");
}

function getSVGIcon(name) {
  const icons = {
    Facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
    Instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
    YouTube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    GitHub: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`
  };
  return icons[name] || "";
}

/* ======================================================
   HAMBURGER MENU
====================================================== */

function initHamburger() {
  const btn = $("hamburger");
  if (!btn) return;

  const nav = btn.nextElementSibling?.tagName === "NAV"
    ? btn.nextElementSibling
    : document.querySelector(".site-header nav, .personal-header nav");

  if (!nav) return;

  function close() {
    btn.classList.remove("open");
    nav.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", e => {
    e.stopPropagation();
    const opening = !btn.classList.contains("open");
    btn.classList.toggle("open", opening);
    nav.classList.toggle("open", opening);
    btn.setAttribute("aria-expanded", String(opening));
  });

  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", close));

  document.addEventListener("click", e => {
    if (!btn.contains(e.target) && !nav.contains(e.target)) close();
  });
}

/* ======================================================
   MOBILE HEADER AUTO HIDE
====================================================== */

function initMobileHeader() {
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    if (window.innerWidth > 768) return;

    const header = document.querySelector(".site-header");
    if (!header) return;

    const current = window.scrollY;
    header.classList.toggle("hide", current > lastScroll && current > 100);
    lastScroll = current;
  }, { passive: true });
}

/* ======================================================
   SCROLL REVEAL (INTERSECTION OBSERVER)
====================================================== */

function initScrollReveal() {
  const elements = document.querySelectorAll(
    ".life-card, .service-card, .blog-card, .connect-card, " +
    ".contact-library-item, .pro-value-card, .pro-card, " +
    ".hosting-card, .city-card, .timeline li, .page-intro, " +
    ".personal-section, .city-section, .capability-statement, " +
    ".pro-stats, .services-library-item, .partner-card"
  );
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -40px 0px" }
  );

  /* Group siblings inside same parent for stagger */
  const seen = new Map();
  elements.forEach(el => {
    const parent = el.parentElement;
    const count = seen.get(parent) ?? 0;
    el.classList.add("reveal", `delay-${count % 4}`);
    seen.set(parent, count + 1);
    observer.observe(el);
  });
}

/* ======================================================
   ANIMATED COUNTERS (pro stats)
====================================================== */

function initCounters() {
  const stats = document.querySelectorAll(".pro-stat-num");
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const textNode = [...el.childNodes].find(n => n.nodeType === 3);
      if (!textNode) return;
      const target = parseInt(textNode.textContent, 10);
      if (isNaN(target)) return;

      let start = null;
      const duration = 1400;
      const tick = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        textNode.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.7 });

  stats.forEach(el => observer.observe(el));
}

/* ======================================================
   HERO PARALLAX (THROTTLED)
====================================================== */

function initParallax() {
  const hero = document.querySelector(".hero-pro");
  if (!hero) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        hero.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ======================================================
   GLOBAL CLICK DELEGATION
====================================================== */

function initGlobalClickHandler() {
  document.addEventListener("click", e => {
    const card = e.target.closest(
      ".post-card, .youtube-card, .instagram-card, .facebook-post, .youtube-post"
    );
    if (!card) return;

    const link = card.dataset.link;
    const video = card.dataset.video;

    if (link) {
      window.open(link, "_blank");
    } else if (video) {
      window.open(`https://www.youtube.com/watch?v=${video}`, "_blank");
    }
  });
}

/* ======================================================
   PWA (ROOT SAFE + UPDATE HANDLING)
====================================================== */

function initServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register(
        "/service-worker.js",
        { scope: "/" }
      );

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            showSWUpdateBanner(reg);
          }
        });
      });
    } catch {}
  });

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

function showSWUpdateBanner(reg) {
  if ($("swUpdateBanner")) return;

  const banner = document.createElement("div");
  banner.id = "swUpdateBanner";
  banner.className = "sw-update-banner";
  banner.innerHTML = `
    <span>New version available.</span>
    <div>
      <button id="swLater">Later</button>
      <button id="swRefresh">Refresh</button>
    </div>
  `;

  document.body.appendChild(banner);

  $("swLater").onclick = () => banner.remove();
  $("swRefresh").onclick = () => {
    if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
  };
}
/* ======================================================
   CONTACT FORM (Formspree)
====================================================== */

function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = document.getElementById("cf-submit");
  const status    = document.getElementById("cf-status");
  const formId    = form.dataset.formspreeId;

  if (!formId || formId === "YOUR_FORM_ID") {
    console.warn("Contact form: replace YOUR_FORM_ID with your Formspree ID.");
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    status.textContent = "";
    status.className = "form-status";

    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });

      if (res.ok) {
        status.textContent = "Message sent! I'll reply within 24–48 hours.";
        status.className = "form-status success";
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        status.textContent = data.error || "Something went wrong. Please email directly.";
        status.className = "form-status error";
      }
    } catch {
      status.textContent = "Network error. Please email kingofyadav.in@gmail.com";
      status.className = "form-status error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

/* =====================================================
   GLOBAL ENQUIRY SYSTEM
===================================================== */

function openEnquiry() {
  document.body.classList.add("enquiry-active");
}

function closeEnquiry() {
  document.body.classList.remove("enquiry-active");
}

function initEnquiryForm() {
  const form = document.getElementById("enquiryForm");
  if (!form) return;

  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const formData = {
      name: this.name.value,
      email: this.email.value,
      subject: this.subject.value,
      message: this.message.value
    };

    try {
      const response = await fetch("https://formspree.io/f/xwvaodjy", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Enquiry submitted. I'll reply within 24–48 hours.");
        this.reset();
        closeEnquiry();
      } else {
        alert("Submission failed. Please email kingofyadav.in@gmail.com directly.");
      }
    } catch {
      alert("Network error. Please email kingofyadav.in@gmail.com directly.");
    }
  });
}
/* ======================================================
   SCROLL PROGRESS BAR
====================================================== */

function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + "%" : "0%";
  }, { passive: true });
}

/* ======================================================
   BACK TO TOP
====================================================== */

function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ======================================================
   BLOG RENDERER (from blog-data.json)
====================================================== */

function formatDate(dateStr) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [year, month, day] = dateStr.split("-");
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

async function initBlogRenderer() {
  const grid = document.getElementById("blog-dynamic-grid");
  if (!grid) return;

  /* Try relative path first (works with file:// and subdirectory servers),
     fall back to absolute path for root-served setups */
  const jsonPaths = ["../blog-data.json", "/blog-data.json", "blog-data.json"];
  let posts = null;

  for (const path of jsonPaths) {
    try {
      const res = await fetch(path);
      if (res.ok) { posts = await res.json(); break; }
    } catch { /* try next path */ }
  }

  if (!posts || !posts.length) {
    grid.innerHTML = `<p style="opacity:0.5;text-align:center;grid-column:1/-1;padding:2rem;">No articles found.</p>`;
    return;
  }

  grid.innerHTML = posts.map(post => `
    <article class="blog-card blog-card--in">
      <img src="${post.image}" alt="${post.title}" loading="lazy" width="640" height="360">
      <div class="blog-card-content">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <span class="blog-category">${post.category}</span>
          <time style="font-size:0.72rem;opacity:0.45;font-weight:500;letter-spacing:0.3px;">${formatDate(post.date)}</time>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a href="${post.url}" class="blog-read">Read Article →</a>
      </div>
    </article>
  `).join("");

  /* Staggered fade-in that does NOT depend on IntersectionObserver */
  grid.querySelectorAll(".blog-card--in").forEach((el, i) => {
    el.style.animationDelay = `${i * 60}ms`;
  });
}

/* ======================================================
   INIT
====================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  setupThemeToggle();
  initActiveNav();
  startFooterUpdates();
  loadSocials();
  initHamburger();
  initContactForm();
  initEnquiryForm();
  initMobileHeader();
  initScrollReveal();
  initCounters();
  initParallax();
  initGlobalClickHandler();
  initServiceWorker();
  initScrollProgress();
  initBackToTop();
  initBlogRenderer();

  const year = $("year");
  if (year) year.textContent = new Date().getFullYear();
});
