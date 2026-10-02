document.documentElement.classList.add("js");

const burger = document.querySelector(".burger");
const menu = document.querySelector(".mobile-menu");
const closeMenu = () => {
  burger?.classList.remove("is-active");
  menu?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  burger?.setAttribute("aria-expanded", "false");
  menu?.setAttribute("aria-hidden", "true");
};
burger?.addEventListener("click", () => {
  const open = !menu.classList.contains("is-open");
  burger.classList.toggle("is-active", open);
  menu.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  burger.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-hidden", String(!open));
});
menu
  ?.querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
const items = [...document.querySelectorAll(".reveal")];
requestAnimationFrame(() =>
  items.forEach((el, i) =>
    setTimeout(() => el.classList.add("is-visible"), 90 + i * 90),
  ),
);

const routeSection = document.querySelector(".route");
const routeRevealItems = [...document.querySelectorAll(".route-reveal")];

if ("IntersectionObserver" in window) {
  const routeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target.classList.contains("route")) {
          entry.target.classList.add("is-visible");
        } else {
          const index = routeRevealItems.indexOf(entry.target);
          window.setTimeout(
            () => entry.target.classList.add("is-visible"),
            Math.max(index, 0) * 110,
          );
        }

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 },
  );

  if (routeSection) routeObserver.observe(routeSection);
  routeRevealItems.forEach((item) => routeObserver.observe(item));
} else {
  routeSection?.classList.add("is-visible");
  routeRevealItems.forEach((item) => item.classList.add("is-visible"));
}

const sectionRevealItems = document.querySelectorAll(".section-reveal");

const sectionObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.1,
  },
);

sectionRevealItems.forEach((item) => {
  sectionObserver.observe(item);
});
/* =========================================
   DOCTOR GUIDE CAROUSEL
========================================= */

const doctorGuide = document.querySelector(".doctor-guide");

if (doctorGuide) {
  const track = doctorGuide.querySelector(".doctor-guide__track");
  const cards = [...doctorGuide.querySelectorAll(".doctor-card")];

  const prev = doctorGuide.querySelector(".doctor-guide__prev");
  const next = doctorGuide.querySelector(".doctor-guide__next");

  const current = doctorGuide.querySelector(".carousel-nav__count strong");

  let index = 0;

  const visibleCards = () => {
    if (window.innerWidth <= 820) return 1;
    if (window.innerWidth <= 1100) return 2;

    return 3;
  };

  const updateCarousel = () => {
    if (!cards.length) return;

    const visible = visibleCards();
    const maxIndex = Math.max(0, cards.length - visible);

    index = Math.min(index, maxIndex);

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16;

    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;

    prev.disabled = index === 0;
    next.disabled = index >= maxIndex;

    current.textContent = String(index + 1).padStart(2, "0");
  };

  prev.addEventListener("click", () => {
    if (index <= 0) return;

    index -= 1;
    updateCarousel();
  });

  next.addEventListener("click", () => {
    const maxIndex = Math.max(0, cards.length - visibleCards());

    if (index >= maxIndex) return;

    index += 1;
    updateCarousel();
  });

  window.addEventListener("resize", updateCarousel);

  updateCarousel();
}
