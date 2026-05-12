(function () {
  const writeups = Array.isArray(window.WRITEUPS) ? window.WRITEUPS.slice() : [];
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

  const categories = ["all", ...new Set(writeups.map((item) => item.category))];
  const difficulties = ["all", "Easy", "Medium", "Hard"];

  function escapeHtml(value) {
    return String(value)
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
    const tagsMarkup = item.tags
      .slice(0, 4)
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join("");

    return `
      <article class="card">
        <a href="${escapeHtml(item.url)}" aria-label="Leer ${escapeHtml(item.title)}">
          <div class="card-preview">
            <img src="${escapeHtml(item.cover)}" alt="Preview de ${escapeHtml(item.title)}">
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
              <span>${escapeHtml(item.stack.slice(0, 2).join(" · "))}</span>
              <strong>Open</strong>
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
        return `<button class="chip ${activeClass}" data-value="${escapeHtml(value)}">${escapeHtml(label)}</button>`;
      })
      .join("");

    container.querySelectorAll("[data-value]").forEach((button) => {
      button.addEventListener("click", () => onClick(button.dataset.value));
    });
  }

  function filteredItems() {
    return writeups.filter((item) => {
      const haystack = [
        item.title,
        item.summary,
        item.category,
        item.difficulty,
        item.tags.join(" "),
        item.stack.join(" ")
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
      els.resultCount.textContent = `${items.length} writeups`;
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
