(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navbar = document.querySelector(".navbar");
  const hero = document.querySelector("#hero");
  const storyTrack = document.querySelector(".story-track");
  const slides = Array.from(document.querySelectorAll(".story-slide"));
  const storySteps = Array.from(document.querySelectorAll(".story-steps li"));
  const storyVideo = document.querySelector("#storyVideo");
  const phoneTilt = document.querySelector("#phoneTilt");
  const deviceGlow = document.querySelector(".device-glow");
  const revealNodes = document.querySelectorAll(".reveal");
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const navToggle = document.querySelector("#navToggle");
  const navLinks = document.querySelector("#navLinks");
  const themeToggle = document.querySelector("#themeToggle");

  const tiltTarget = { x: 0, y: 0 };
  const tiltCurrent = { x: 0, y: 0 };
  let activeSlide = -1;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (start, end, alpha) => start + (end - start) * alpha;
  const formatTime = (seconds) => {
    const s = Math.max(0, Math.floor(seconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  // Plays a muted clip, ignoring the rejection browsers raise when autoplay is blocked.
  const safePlay = (video) => {
    const result = video.play();
    if (result && typeof result.catch === "function") result.catch(() => {});
  };

  // Keeps a video looping inside [data-start, data-end] instead of the whole file.
  function bindSegment(video) {
    const segment = () => ({
      start: parseFloat(video.dataset.start) || 0,
      end: parseFloat(video.dataset.end) || video.duration || Infinity,
    });

    const toStart = () => {
      video.currentTime = segment().start;
    };

    if (video.readyState >= 1) toStart();
    else video.addEventListener("loadedmetadata", toStart, { once: true });

    video.addEventListener("timeupdate", () => {
      const { start, end } = segment();
      if (video.currentTime >= end || video.currentTime < start - 0.5) video.currentTime = start;
    });

    video.addEventListener("ended", () => {
      toStart();
      safePlay(video);
    });
  }

  // Videos only play while visible, which saves battery and bandwidth.
  function setupVideoVisibility(videos) {
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          video.dataset.inView = entry.isIntersecting ? "1" : "";
          if (!entry.isIntersecting) {
            video.pause();
          } else if (!prefersReducedMotion && video.dataset.userPaused !== "1") {
            safePlay(video);
          }
        });
      },
      { threshold: 0.25 }
    );

    videos.forEach((video) => observer.observe(video));
  }

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

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuState(false);
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
    // The inline <head> script has usually set this already, which avoids a flash of the wrong theme.
    const preset = document.documentElement.getAttribute("data-theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    const initial = preset || (prefersLight ? "light" : "dark");

    const applyTheme = (theme, persist) => {
      document.documentElement.setAttribute("data-theme", theme);
      themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
      if (!persist) return;
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) {
        /* ignore storage errors */
      }
    };

    applyTheme(initial, false);

    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next, true);
    });
  }

  function setupPhoneTilt() {
    if (!phoneTilt || prefersReducedMotion) return;

    phoneTilt.addEventListener("pointermove", (event) => {
      const rect = phoneTilt.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      tiltTarget.y = (x - 0.5) * 14;
      tiltTarget.x = (0.5 - y) * 14;
    });

    phoneTilt.addEventListener("pointerleave", () => {
      tiltTarget.x = 0;
      tiltTarget.y = 0;
    });
  }

  function setStoryClip(slide) {
    if (!storyVideo) return;
    storyVideo.dataset.start = slide.dataset.start;
    storyVideo.dataset.end = slide.dataset.end;
    if (storyVideo.readyState >= 1) {
      storyVideo.currentTime = parseFloat(slide.dataset.start) || 0;
    } else if (prefersReducedMotion && activeSlide > 0) {
      // Without autoplay, load anyway so each step still shows its own still frame.
      storyVideo.preload = "auto";
    }
  }

  function updateStorySlides(progress) {
    if (!slides.length) return;

    const scaled = progress * slides.length;
    const index = clamp(Math.floor(scaled), 0, slides.length - 1);

    storySteps.forEach((step, i) => {
      step.style.setProperty("--fill", clamp(scaled - i, 0, 1).toFixed(3));
    });

    if (index === activeSlide) return;
    activeSlide = index;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    setStoryClip(slides[index]);
  }

  function setupDemoPlayer() {
    const stage = document.querySelector("#demoStage");
    const video = document.querySelector("#demoVideo");
    if (!stage || !video) return;

    const playButton = document.querySelector("#demoPlay");
    const progress = document.querySelector("#demoProgress");
    const timeLabel = document.querySelector("#demoTime");
    const chapters = Array.from(document.querySelectorAll(".demo-chapter"));
    const chapterTimes = chapters.map((chapter) => parseFloat(chapter.dataset.time) || 0);
    const firstChapter = chapterTimes[0] || 0;
    let started = false;

    const seek = (time) => {
      started = true;
      video.currentTime = time;
    };

    const play = () => {
      video.dataset.userPaused = "";
      if (!started && video.readyState >= 1) seek(firstChapter);
      safePlay(video);
    };

    const togglePlay = () => {
      if (video.paused) {
        play();
      } else {
        video.dataset.userPaused = "1";
        video.pause();
      }
    };

    video.addEventListener("loadedmetadata", () => {
      if (!started) seek(firstChapter);
    });

    video.addEventListener("play", () => {
      stage.classList.add("is-playing");
      playButton.setAttribute("aria-label", "Pause demo");
    });

    video.addEventListener("pause", () => {
      stage.classList.remove("is-playing");
      playButton.setAttribute("aria-label", "Play demo");
    });

    video.addEventListener("ended", () => {
      seek(firstChapter);
      safePlay(video);
    });

    video.addEventListener("timeupdate", () => {
      const duration = video.duration || 1;
      const ratio = video.currentTime / duration;
      progress.style.setProperty("--p", ratio.toFixed(4));
      progress.setAttribute("aria-valuenow", Math.round(ratio * 100));
      timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 0)}`;

      let current = 0;
      chapterTimes.forEach((time, i) => {
        if (video.currentTime >= time - 0.25) current = i;
      });
      chapters.forEach((chapter, i) => {
        const isCurrent = i === current;
        chapter.classList.toggle("is-active", isCurrent);
        if (isCurrent) chapter.setAttribute("aria-current", "true");
        else chapter.removeAttribute("aria-current");
      });
    });

    playButton.addEventListener("click", togglePlay);
    video.addEventListener("click", togglePlay);

    chapters.forEach((chapter, i) => {
      chapter.addEventListener("click", () => {
        if (video.readyState < 1) video.load();
        const go = () => {
          seek(chapterTimes[i]);
          play();
        };
        if (video.readyState >= 1) go();
        else video.addEventListener("loadedmetadata", go, { once: true });
      });
    });

    const seekFromPointer = (event) => {
      if (!video.duration) return;
      const rect = progress.getBoundingClientRect();
      seek(clamp((event.clientX - rect.left) / rect.width, 0, 1) * video.duration);
    };

    progress.addEventListener("click", seekFromPointer);
    progress.addEventListener("keydown", (event) => {
      if (!video.duration) return;
      if (event.key === "ArrowRight") seek(Math.min(video.duration, video.currentTime + 5));
      if (event.key === "ArrowLeft") seek(Math.max(0, video.currentTime - 5));
    });
  }

  function animate() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (navbar) {
      navbar.classList.toggle("scrolled", scrollY > 20);
    }

    if (hero && phoneTilt) {
      const heroRect = hero.getBoundingClientRect();
      const heroHeight = hero.offsetHeight || 1;
      const depth = clamp((-heroRect.top / heroHeight) * 32, 0, 32);

      tiltCurrent.x = prefersReducedMotion ? 0 : lerp(tiltCurrent.x, tiltTarget.x, 0.12);
      tiltCurrent.y = prefersReducedMotion ? 0 : lerp(tiltCurrent.y, tiltTarget.y, 0.12);

      phoneTilt.style.transform =
        `translate3d(0, ${(-depth).toFixed(2)}px, 0) rotateX(${tiltCurrent.x.toFixed(2)}deg) rotateY(${tiltCurrent.y.toFixed(2)}deg)`;

      if (deviceGlow) {
        deviceGlow.style.transform = `translate3d(0, ${(-depth * 0.7).toFixed(2)}px, -40px) scale(${(1 + depth * 0.003).toFixed(3)})`;
      }
    }

    if (storyTrack) {
      const rect = storyTrack.getBoundingClientRect();
      const available = Math.max(rect.height - window.innerHeight, 1);
      const consumed = clamp(-rect.top, 0, available);
      updateStorySlides(consumed / available);
    }

    requestAnimationFrame(animate);
  }

  setupAnchorScroll();
  setupRevealObserver();
  setupPhoneTilt();
  setupMobileNav();
  setupQaAccordion();
  setupThemeToggle();
  setupDemoPlayer();

  const loopingVideos = Array.from(document.querySelectorAll("video[data-autoplay], #storyVideo"));
  loopingVideos.forEach(bindSegment);
  setupVideoVisibility(loopingVideos);

  animate();
})();
