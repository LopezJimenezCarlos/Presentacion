(function () {
  const writeups = Array.isArray(window.WRITEUPS) ? window.WRITEUPS.slice() : [];

  const els = {
    grid: document.querySelector("#featuredWriteupsGrid"),
    count: document.querySelector("#homeWriteupCount"),
    categories: document.querySelector("#homeWriteupCategories"),
    tags: document.querySelector("#homeWriteupTags"),
    year: document.querySelector("[data-current-year]"),
    preview: document.querySelector("#floatingPreview"),
    cursor: document.querySelector(".cursor")
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function buildWorkRow(item, index) {
    const tags = Array.isArray(item.tags) ? item.tags.slice(0, 3).join(" · ") : "";
    return `
      <a class="work-row" href="${escapeHtml(item.url)}" data-preview="${escapeHtml(item.cover)}" aria-label="Abrir ${escapeHtml(item.title)}">
        <h3>${String(index + 1).padStart(2, "0")} ${escapeHtml(item.labName || item.title)}</h3>
        <span class="work-meta">${escapeHtml(item.category)} · ${escapeHtml(item.difficulty)}</span>
        <span class="work-tags">${escapeHtml(tags)}</span>
      </a>
    `;
  }

  function renderWriteups() {
    if (!writeups.length || !els.grid) return;
    const featured = writeups.filter((item) => item.featured).concat(writeups.filter((item) => !item.featured)).slice(0, 6);
    els.grid.innerHTML = featured.map(buildWorkRow).join("");
  }

  function updateMetrics() {
    if (!writeups.length) return;
    const categories = new Set(writeups.map((item) => item.category));
    const tags = new Set(writeups.flatMap((item) => Array.isArray(item.tags) ? item.tags : []));
    if (els.count) els.count.textContent = String(writeups.length);
    if (els.categories) els.categories.textContent = String(categories.size);
    if (els.tags) els.tags.textContent = String(tags.size);
  }

  function setupMobileNav() {
    const nav = document.querySelector(".nav");
    const toggle = document.querySelector(".nav-toggle");
    if (!nav || !toggle) return;

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    }

    function toggleMenu() {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    }

    toggle.addEventListener("click", toggleMenu);
    nav.querySelectorAll(".nav-links a, .hire-btn").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 981px)").matches) closeMenu();
    });
  }

  function setupReveal() {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
  }

  function setupPreview() {
    if (!els.preview) return;
    document.querySelectorAll(".work-row[data-preview]").forEach((row) => {
      row.addEventListener("mouseenter", () => {
        els.preview.style.backgroundImage = `url('${row.dataset.preview}')`;
        els.preview.classList.add("is-visible");
      });
      row.addEventListener("mouseleave", () => els.preview.classList.remove("is-visible"));
      row.addEventListener("mousemove", (event) => {
        els.preview.style.left = `${event.clientX + 32}px`;
        els.preview.style.top = `${event.clientY}px`;
      });
    });
  }

  function setupCursor() {
    if (!els.cursor || window.matchMedia("(max-width: 980px)").matches) return;
    window.addEventListener("mousemove", (event) => {
      els.cursor.style.left = `${event.clientX}px`;
      els.cursor.style.top = `${event.clientY}px`;
    });
    document.querySelectorAll("a, button, .work-row").forEach((node) => {
      node.addEventListener("mouseenter", () => els.cursor.classList.add("is-active"));
      node.addEventListener("mouseleave", () => els.cursor.classList.remove("is-active"));
    });
  }

  function setupParallax() {
    const nodes = document.querySelectorAll("[data-parallax]");
    const processItems = document.querySelectorAll(".process-item");
    if (!nodes.length && !processItems.length) return;

    function update() {
      const isMobile = window.matchMedia("(max-width: 980px)").matches;
      const y = window.scrollY || 0;
      nodes.forEach((node) => {
        if (isMobile) {
          node.style.transform = "";
          return;
        }
        const speed = Number(node.dataset.parallax || 0.1);
        node.style.transform = `translateX(-50%) translateY(${y * speed}px)`;
      });

      const center = window.innerHeight * 0.55;
      processItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        item.classList.toggle("is-active", rect.top < center && rect.bottom > center * 0.45);
      });
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
  }

  renderWriteups();
  updateMetrics();
  setupMobileNav();
  setupReveal();
  setupPreview();
  setupCursor();
  setupParallax();

  if (els.year) els.year.textContent = String(new Date().getFullYear());
})();
