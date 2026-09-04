(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navbar = document.querySelector(".navbar");
  const hero = document.querySelector("#hero");
  const story = document.querySelector("#story");
  const storyTrack = document.querySelector(".story-track");
  const slides = Array.from(document.querySelectorAll(".story-slide"));
  const phoneTilt = document.querySelector("#phoneTilt");
  const deviceGlow = document.querySelector(".device-glow");
  const revealNodes = document.querySelectorAll(".reveal");
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const footer = document.querySelector(".rakshya-footer");
  const ctaWrap = document.querySelector(".footer-cta-wrap");
  const navToggle = document.querySelector("#navToggle");
  const navLinks = document.querySelector("#navLinks");
  const themeToggle = document.querySelector("#themeToggle");

  let targetScroll = window.scrollY;
  let smoothScroll = targetScroll;
  let rafId = null;

  const tiltTarget = { x: 0, y: 0 };
  const tiltCurrent = { x: 0, y: 0 };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, alpha) => start + (end - start) * alpha;

  function setupAnchorScroll() {
    anchorLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href) return;
        if (href === "#") {
          event.preventDefault();
          return;
        }
        const targetElement = document.querySelector(href);
        if (!targetElement) return;
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      });
    });
  }

  function setupRevealObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealNodes.forEach((node) => observer.observe(node));
  }

  function setupMobileNav() {
    if (!navToggle || !navLinks) return;

    const setMenuState = (open) => {
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navLinks.classList.toggle("is-open", open);
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    navLinks.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        setMenuState(false);
      }
    });

    document.addEventListener("click", (event) => {
      if (navToggle.getAttribute("aria-expanded") === "true" && !navToggle.contains(event.target) && !navLinks.contains(event.target)) {
        setMenuState(false);
      }
    });
  }

  function setupQaAccordion() {
    const details = document.querySelectorAll(".qa-item");
    const syncState = (item) => {
      const summary = item.querySelector("summary");
      if (summary) {
        summary.setAttribute("aria-expanded", item.open ? "true" : "false");
      }
    };

    details.forEach((item) => {
      syncState(item);
      item.addEventListener("toggle", () => syncState(item));
    });
  }

  function setupThemeToggle() {
    if (!themeToggle) return;

    const STORAGE_KEY = "rakshya-theme";
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const stored = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        return null;
      }
    })();
    const initial = stored === "light" || (stored === null && prefersLight) ? "light" : "dark";

    const applyTheme = (theme) => {
      document.documentElement.setAttribute("data-theme", theme);
      themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        /* ignore storage errors */
      }
    };

    applyTheme(initial);

    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
    });
  }

  function setupPhoneTilt() {
    if (!phoneTilt || prefersReducedMotion) return;

    phoneTilt.addEventListener("pointermove", (event) => {
      const rect = phoneTilt.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      tiltTarget.y = (x - 0.5) * 15;
      tiltTarget.x = (0.5 - y) * 15;
    });

    phoneTilt.addEventListener("pointerleave", () => {
      tiltTarget.x = 0;
      tiltTarget.y = 0;
    });
  }

  function updateStorySlides(progress) {
    if (!slides.length) return;

    const segment = 1 / slides.length;

    slides.forEach((slide, index) => {
      const center = segment * index + segment * 0.5;
      const distance = Math.abs(progress - center);
      const influence = clamp(1 - distance / (segment * 1.2), 0, 1);
      const opacity = 0.15 + influence * 0.85;
      const scale = 0.95 + influence * 0.05;
      const yShift = 24 - influence * 24;

      slide.style.opacity = opacity.toFixed(3);
      slide.style.transform = `translate3d(0, ${yShift.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      slide.classList.toggle("is-active", influence > 0.62);
    });
  }

  function animate() {
    targetScroll = window.scrollY || window.pageYOffset;
    smoothScroll = prefersReducedMotion ? targetScroll : lerp(smoothScroll, targetScroll, 0.1);

    if (navbar) {
      navbar.classList.toggle("scrolled", smoothScroll > 20);
    }

    if (hero) {
      const heroRect = hero.getBoundingClientRect();
      const heroHeight = hero.offsetHeight || 1;
      const depth = clamp((-heroRect.top / heroHeight) * 32, 0, 32);

      if (phoneTilt) {
        tiltCurrent.x = prefersReducedMotion ? 0 : lerp(tiltCurrent.x, tiltTarget.x, 0.12);
        tiltCurrent.y = prefersReducedMotion ? 0 : lerp(tiltCurrent.y, tiltTarget.y, 0.12);

        phoneTilt.style.transform =
          `translate3d(0, ${(-depth).toFixed(2)}px, 0) rotateX(${tiltCurrent.x.toFixed(2)}deg) rotateY(${tiltCurrent.y.toFixed(2)}deg)`;
      }

      if (deviceGlow) {
        deviceGlow.style.transform = `translate3d(0, ${(-depth * 0.7).toFixed(2)}px, -40px) scale(${(1 + depth * 0.003).toFixed(3)})`;
      }
    }

    if (story && storyTrack) {
      const rect = storyTrack.getBoundingClientRect();
      const available = Math.max(rect.height - window.innerHeight, 1);
      const consumed = clamp(-rect.top, 0, available);
      const progress = consumed / available;
      story.style.setProperty("--story-progress", progress.toFixed(3));
      updateStorySlides(progress);
    }

    rafId = requestAnimationFrame(animate);
  }

  function onScrollPassive() {
    targetScroll = window.scrollY || window.pageYOffset;
  }

  function onResize() {
    targetScroll = window.scrollY || window.pageYOffset;
  }

  setupAnchorScroll();
  setupRevealObserver();
  setupPhoneTilt();
  setupMobileNav();
  setupQaAccordion();
  setupThemeToggle();

  if (footer) {
    window.addEventListener(
      "load",
      () => {
        footer.classList.add("is-loaded");
      },
      { passive: true }
    );
  }

  if (ctaWrap && !prefersReducedMotion) {
    ctaWrap.addEventListener("pointermove", (event) => {
      const rect = ctaWrap.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      ctaWrap.style.setProperty("--cta-x", `${x.toFixed(2)}%`);
      ctaWrap.style.setProperty("--cta-y", `${y.toFixed(2)}%`);
    });

    ctaWrap.addEventListener("pointerleave", () => {
      ctaWrap.style.setProperty("--cta-x", "50%");
      ctaWrap.style.setProperty("--cta-y", "50%");
    });
  }

  window.addEventListener("scroll", onScrollPassive, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });

  if (rafId) cancelAnimationFrame(rafId);
  animate();
})();
