"use strict";

/** Mobile navigation */
const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");
const navOpenButton = document.querySelector(".nav-open-btn");

const setNavbarOpen = (isOpen) => {
  navbar?.classList.toggle("active", isOpen);
  overlay?.classList.toggle("active", isOpen);
  document.body.classList.toggle("nav-active", isOpen);
  navOpenButton?.setAttribute("aria-expanded", String(isOpen));
};

navTogglers.forEach((toggler) => {
  toggler.addEventListener("click", () => {
    setNavbarOpen(!navbar?.classList.contains("active"));
  });
});

navbar?.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (navbar.classList.contains("active")) setNavbarOpen(false);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navbar?.classList.contains("active")) {
    setNavbarOpen(false);
    navOpenButton?.focus();
  }
});

/** Header and back-to-top button */
const header = document.querySelector("[data-header]");
const backTopButton = document.querySelector("[data-back-top-btn]");
let lastScrollPosition = 0;

window.addEventListener(
  "scroll",
  () => {
    const hasScrolled = window.scrollY >= 50;
    header?.classList.toggle("active", hasScrolled);
    backTopButton?.classList.toggle("active", hasScrolled);

    if (hasScrolled && header) {
      header.classList.toggle("hide", lastScrollPosition < window.scrollY);
    } else {
      header?.classList.remove("hide");
    }

    lastScrollPosition = window.scrollY;
  },
  { passive: true },
);

/** Hero slider (homepage only) */
const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = [
  ...document.querySelectorAll("[data-hero-slider-item]"),
];
const previousButton = document.querySelector("[data-prev-btn]");
const nextButton = document.querySelector("[data-next-btn]");
const pauseButton = document.querySelector("[data-slider-pause]");
const pauseIcon = document.querySelector("[data-slider-pause-icon]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (heroSlider && heroSliderItems.length && previousButton && nextButton) {
  let currentSlide = 0;
  let autoSlideInterval;
  let userPaused = false;

  const showSlide = (position) => {
    currentSlide = (position + heroSliderItems.length) % heroSliderItems.length;

    heroSliderItems.forEach((item, index) => {
      const isActive = index === currentSlide;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-hidden", String(!isActive));
    });
  };

  const stopAutoSlide = () => {
    window.clearInterval(autoSlideInterval);
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    if (!userPaused) {
      autoSlideInterval = window.setInterval(
        () => showSlide(currentSlide + 1),
        7000,
      );
    }
  };

  const updatePauseControl = () => {
    pauseButton?.setAttribute("aria-pressed", String(userPaused));
    pauseButton?.setAttribute(
      "aria-label",
      userPaused ? "Resume slideshow" : "Pause slideshow",
    );
    pauseIcon?.setAttribute(
      "name",
      userPaused ? "play-outline" : "pause-outline",
    );
  };

  const setPaused = (isPaused) => {
    userPaused = isPaused;
    updatePauseControl();
    isPaused ? stopAutoSlide() : startAutoSlide();
  };

  nextButton.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    startAutoSlide();
  });

  previousButton.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    startAutoSlide();
  });

  pauseButton?.addEventListener("click", () => {
    const shouldPause = !userPaused;

    if (!shouldPause) {
      showSlide(currentSlide + 1);
    }

    setPaused(shouldPause);
  });
  updatePauseControl();
  showSlide(0);
  startAutoSlide();
}

/** Subtle pointer parallax (homepage only) */
const parallaxItems = document.querySelectorAll("[data-parallax-item]");

if (parallaxItems.length && !reduceMotion.matches) {
  window.addEventListener(
    "mousemove",
    (event) => {
      const pointerX = -((event.clientX / window.innerWidth) * 10 - 5);
      const pointerY = -((event.clientY / window.innerHeight) * 10 - 5);

      parallaxItems.forEach((item) => {
        const speed = Number(item.dataset.parallaxSpeed) || 1;
        item.style.transform = `translate3d(${pointerX * speed}px, ${pointerY * speed}px, 0)`;
      });
    },
    { passive: true },
  );
}

/** Reveal menu categories as they enter the viewport */
const menuSections = document.querySelectorAll(
  'main article[class*="menu-stuff-"]',
);

if (
  menuSections.length &&
  "IntersectionObserver" in window &&
  !reduceMotion.matches
) {
  document.documentElement.classList.add("reveal-ready");

  const sectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );

  menuSections.forEach((section) => sectionObserver.observe(section));
}
