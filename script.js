// Set current year in footer + wire up interactions
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  animateStats();
  setupFAQ();
  setupResourceFilters();
  setupContactForm();
});

// Animate hero stats numbers
function animateStats() {
  const statEls = document.querySelectorAll(".stat-number");
  if (!statEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          let current = 0;
          const duration = 1000;
          const startTime = performance.now();

          function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            current = Math.floor(progress * target);
            el.textContent = current;
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              el.textContent = target;
            }
          }

          requestAnimationFrame(tick);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  statEls.forEach((el) => observer.observe(el));
}

// FAQ accordion
function setupFAQ() {
  const faqButtons = document.querySelectorAll(".faq-item");
  faqButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.classList.contains("open");
      faqButtons.forEach((b) => b.classList.remove("open"));
      if (!isOpen) {
        btn.classList.add("open");
      }
    });
  });
}

// Resource filters & search
function setupResourceFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".resource-card");
  const searchInput = document.getElementById("resourceSearch");

  if (!buttons.length || !cards.length) return;

  function update() {
    const activeBtn = document.querySelector("[data-filter].active");
    const level = activeBtn ? activeBtn.dataset.filter : "all";
    const query = (searchInput?.value || "").toLowerCase();

    cards.forEach((card) => {
      const cardLevel = card.dataset.level;
      const text = card.textContent.toLowerCase();

      const levelMatch = level === "all" || level === cardLevel;
      const searchMatch = !query || text.includes(query);

      card.style.display = levelMatch && searchMatch ? "" : "none";
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      update();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", update);
  }
}

// Contact form front-end "submit"
function setupContactForm() {
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  if (!form || !statusEl) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");

    statusEl.textContent = `Thank you${name ? ", " + name : ""}! Your message has been recorded. We will reach out soon.`;
    statusEl.classList.remove("error");
    statusEl.classList.add("success");
    form.reset();
  });
}
