(function () {
  const writeups = Array.isArray(window.WRITEUPS) ? window.WRITEUPS.slice() : [];

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
    nav.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 721px)").matches) closeMenu();
    });
  }

  setupMobileNav();

  if (!writeups.length) return;

  const state = {
    query: "",
    category: "all",
    difficulty: "all"
  };

  const els = {
    grid: document.querySelector("#writeupsGrid"),
    filters: document.querySelector("#filterChips"),
    difficulty: document.querySelector("#difficultyChips"),
    input: document.querySelector("#searchInput"),
    empty: document.querySelector("#emptyState"),
    resultCount: document.querySelector("#resultsCount"),
    metricWriteups: document.querySelector("#metricWriteups"),
    metricDomains: document.querySelector("#metricDomains"),
    metricTime: document.querySelector("#metricTime")
  };

  const categories = ["all", ...new Set(writeups.map((item) => item.category).filter(Boolean))];
  const difficulties = ["all", ...new Set(writeups.map((item) => item.difficulty).filter(Boolean))];

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function averageReadTime(items) {
    const values = items
      .map((item) => parseInt(item.readTime, 10))
      .filter((value) => !Number.isNaN(value));
    if (!values.length) return "n/a";
    return `${Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)} min`;
  }

  function buildCard(item) {
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const stack = Array.isArray(item.stack) ? item.stack : [];
    const tagsMarkup = tags
      .slice(0, 4)
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join("");

    return `
      <article class="card">
        <a href="${escapeHtml(item.url)}" aria-label="Leer ${escapeHtml(item.title)}">
          <div class="card-preview">
            <img src="${escapeHtml(item.cover)}" alt="Miniatura técnica de ${escapeHtml(item.title)}" loading="lazy">
            <div class="card-overlay-meta">
              <span class="card-difficulty">${escapeHtml(item.difficulty)}</span>
              <span class="card-date">${escapeHtml(item.date)}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-top">
              <span class="badge">${escapeHtml(item.category)}</span>
            </div>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(item.summary)}</p>
            <div class="meta">
              <span>${escapeHtml(item.readTime)}</span>
              <span>${escapeHtml(item.visibility)}</span>
            </div>
            <div class="tag-strip">${tagsMarkup}</div>
            <div class="card-foot">
              <span>${escapeHtml(stack.slice(0, 2).join(" · "))}</span>
              <strong>Leer</strong>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  function renderButtons(container, values, activeValue, onClick) {
    if (!container) return;
    container.innerHTML = values
      .map((value) => {
        const label = value === "all" ? "Todos" : value;
        const activeClass = value === activeValue ? "active" : "";
        return `<button class="chip ${activeClass}" type="button" data-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`;
      })
      .join("");

    container.querySelectorAll("[data-value]").forEach((button) => {
      button.addEventListener("click", () => onClick(button.dataset.value));
    });
  }

  function filteredItems() {
    return writeups.filter((item) => {
      const tags = Array.isArray(item.tags) ? item.tags : [];
      const stack = Array.isArray(item.stack) ? item.stack : [];
      const haystack = [
        item.title,
        item.summary,
        item.category,
        item.difficulty,
        tags.join(" "),
        stack.join(" ")
      ]
        .join(" ")
        .toLowerCase();

      const queryOk = !state.query || haystack.includes(state.query);
      const categoryOk = state.category === "all" || item.category === state.category;
      const difficultyOk = state.difficulty === "all" || item.difficulty === state.difficulty;

      return queryOk && categoryOk && difficultyOk;
    });
  }

  function renderCards() {
    if (!els.grid) return;
    const items = filteredItems();
    els.grid.innerHTML = items.map(buildCard).join("");
    if (els.empty) els.empty.style.display = items.length ? "none" : "block";
    if (els.resultCount) {
      els.resultCount.textContent = `${items.length} ${items.length === 1 ? "writeup" : "writeups"}`;
    }
  }

  function applyUrlState() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const category = params.get("category");
    const difficulty = params.get("difficulty");

    if (q) state.query = q.toLowerCase();
    if (category && categories.includes(category)) state.category = category;
    if (difficulty && difficulties.includes(difficulty)) state.difficulty = difficulty;
  }

  function render() {
    renderButtons(els.filters, categories, state.category, (value) => {
      state.category = value;
      render();
    });
    renderButtons(els.difficulty, difficulties, state.difficulty, (value) => {
      state.difficulty = value;
      render();
    });
    renderCards();
  }

  applyUrlState();

  if (els.input) {
    els.input.value = state.query;
    els.input.addEventListener("input", () => {
      state.query = els.input.value.trim().toLowerCase();
      renderCards();
    });
  }

  if (els.metricWriteups) els.metricWriteups.textContent = String(writeups.length);
  if (els.metricDomains) {
    els.metricDomains.textContent = String(new Set(writeups.map((item) => item.category)).size);
  }
  if (els.metricTime) els.metricTime.textContent = averageReadTime(writeups);

  render();
})();
