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
/* =========================================================
   TEAM CAROUSEL
========================================================= */

const teamSection = document.querySelector(".team");

if (teamSection) {
  const viewport = teamSection.querySelector(".team-slider__viewport");

  const track = teamSection.querySelector(".team-slider__track");

  const cards = [...teamSection.querySelectorAll(".team-card")];

  const desktopPrev = teamSection.querySelector(".team-prev");

  const desktopNext = teamSection.querySelector(".team-next");

  const mobilePrev = teamSection.querySelector(".team-mobile-prev");

  const mobileNext = teamSection.querySelector(".team-mobile-next");

  const desktopCurrent = teamSection.querySelector(".team-nav__count strong");

  const mobileCurrent = teamSection.querySelector(".team-mobile-count strong");

  const progressItems = [
    ...teamSection.querySelectorAll(".team-progress span"),
  ];

  let index = 0;

  let touchStartX = 0;
  let touchStartY = 0;

  let touchCurrentX = 0;
  let touchCurrentY = 0;

  let isDragging = false;

  /* =======================================================
     HELPERS
  ======================================================= */

  const visibleCards = () => {
    if (window.innerWidth <= 820) {
      return 1;
    }

    if (window.innerWidth <= 1100) {
      return 2;
    }

    return 3;
  };

  const getGap = () => {
    return window.innerWidth <= 820 ? 12 : 16;
  };

  const getMaxIndex = () => {
    return Math.max(0, cards.length - visibleCards());
  };

  const getCardWidth = () => {
    return cards[0]?.getBoundingClientRect().width || 0;
  };

  const getBaseDistance = () => {
    return index * (getCardWidth() + getGap());
  };

  /* =======================================================
     UI
  ======================================================= */

  const updateState = () => {
    const current = String(index + 1).padStart(2, "0");

    if (desktopCurrent) {
      desktopCurrent.textContent = current;
    }

    if (mobileCurrent) {
      mobileCurrent.textContent = current;
    }

    progressItems.forEach((item, itemIndex) => {
      item.classList.toggle("is-active", itemIndex === index);
    });

    const atStart = index === 0;
    const atEnd = index === getMaxIndex();

    if (desktopPrev) {
      desktopPrev.disabled = atStart;
    }

    if (desktopNext) {
      desktopNext.disabled = atEnd;
    }

    if (mobilePrev) {
      mobilePrev.disabled = atStart;
    }

    if (mobileNext) {
      mobileNext.disabled = atEnd;
    }
  };

  /* =======================================================
     POSITION
  ======================================================= */

  const updateCarousel = (animate = true) => {
    index = Math.max(0, Math.min(index, getMaxIndex()));

    track.style.transition = animate
      ? "transform 0.56s cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";

    track.style.transform = `translate3d(-${getBaseDistance()}px, 0, 0)`;

    updateState();
  };

  /* =======================================================
     PREV / NEXT
  ======================================================= */

  const goPrev = () => {
    if (index <= 0) {
      return;
    }

    index -= 1;

    updateCarousel();
  };

  const goNext = () => {
    if (index >= getMaxIndex()) {
      return;
    }

    index += 1;

    updateCarousel();
  };

  desktopPrev?.addEventListener("click", goPrev);

  desktopNext?.addEventListener("click", goNext);

  mobilePrev?.addEventListener("click", goPrev);

  mobileNext?.addEventListener("click", goNext);

  /* =======================================================
     TOUCH
  ======================================================= */

  viewport?.addEventListener(
    "touchstart",
    (event) => {
      if (window.innerWidth > 820) {
        return;
      }

      const touch = event.touches[0];

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;

      touchCurrentX = touchStartX;
      touchCurrentY = touchStartY;

      isDragging = true;

      track.style.transition = "none";
    },
    {
      passive: true,
    },
  );

  viewport?.addEventListener(
    "touchmove",
    (event) => {
      if (window.innerWidth > 820 || !isDragging) {
        return;
      }

      const touch = event.touches[0];

      touchCurrentX = touch.clientX;
      touchCurrentY = touch.clientY;

      const deltaX = touchCurrentX - touchStartX;

      const deltaY = touchCurrentY - touchStartY;

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }

      let dragDistance = deltaX;

      if (
        (index === 0 && deltaX > 0) ||
        (index === getMaxIndex() && deltaX < 0)
      ) {
        dragDistance *= 0.24;
      }

      track.style.transform = `translate3d(${
        -getBaseDistance() + dragDistance
      }px, 0, 0)`;
    },
    {
      passive: true,
    },
  );

  viewport?.addEventListener("touchend", () => {
    if (window.innerWidth > 820 || !isDragging) {
      return;
    }

    isDragging = false;

    const deltaX = touchCurrentX - touchStartX;

    const deltaY = touchCurrentY - touchStartY;

    const threshold = Math.min(70, getCardWidth() * 0.16);

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      updateCarousel();

      return;
    }

    if (deltaX <= -threshold) {
      goNext();

      return;
    }

    if (deltaX >= threshold) {
      goPrev();

      return;
    }

    updateCarousel();
  });

  viewport?.addEventListener("touchcancel", () => {
    isDragging = false;

    updateCarousel();
  });

  /* =======================================================
     RESIZE
  ======================================================= */

  let resizeTimer;

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      updateCarousel(false);
    }, 100);
  });

  updateCarousel(false);
}

/* =========================================================
   TEAM MODAL
========================================================= */

const teamModal = document.querySelector(".team-modal");

if (teamModal) {
  const modalTitle = teamModal.querySelector(".team-modal__title");
  const modalSpeciality = teamModal.querySelector(".team-modal__speciality");
  const modalBody = teamModal.querySelector(".team-modal__body");
  const modalClose = teamModal.querySelector(".team-modal__close");

  let lastTrigger = null;

  const openTeamModal = (card, trigger) => {
    if (!card) return;

    const name = card.querySelector("h3")?.textContent.trim() || "";
    const speciality =
      card.querySelector(".team-card__speciality")?.textContent.trim() || "";
    const content = card.querySelector(".team-card__modal-content");

    if (modalTitle) modalTitle.textContent = name;
    if (modalSpeciality) modalSpeciality.textContent = speciality;
    if (modalBody) {
      modalBody.innerHTML =
        content?.innerHTML || "<p>Інформація уточнюється.</p>";
    }

    lastTrigger = trigger;
    teamModal.classList.add("is-open");
    teamModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("team-modal-open");

    requestAnimationFrame(() => modalClose?.focus());
  };

  const closeTeamModal = () => {
    teamModal.classList.remove("is-open");
    teamModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("team-modal-open");
    lastTrigger?.focus();
  };

  document.querySelectorAll(".team-card__more").forEach((button) => {
    button.addEventListener("click", () => {
      openTeamModal(button.closest(".team-card"), button);
    });
  });

  teamModal.querySelectorAll("[data-team-close]").forEach((element) => {
    element.addEventListener("click", closeTeamModal);
  });

  teamModal
    .querySelector(".team-modal__action")
    ?.addEventListener("click", closeTeamModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && teamModal.classList.contains("is-open")) {
      closeTeamModal();
    }
  });
}

/* =========================================================
   FORMATS REVEAL
========================================================= */

const formatRows = document.querySelectorAll(".formats__row");

if (formatRows.length) {
  const formatsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const rows = [...formatRows];
        const index = rows.indexOf(entry.target);

        window.setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, index * 90);

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
    },
  );

  formatRows.forEach((row) => {
    formatsObserver.observe(row);
  });
}
/* =========================================================
   FAQ ACCORDION
========================================================= */

const faqItems = document.querySelectorAll(".faq__item");

if (faqItems.length) {
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq__question");

    button?.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((faqItem) => {
        faqItem.classList.remove("is-open");

        faqItem
          .querySelector(".faq__question")
          ?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });
}
