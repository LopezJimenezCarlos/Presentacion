(function () {
  const writeups = Array.isArray(window.WRITEUPS) ? window.WRITEUPS.slice() : [];
  if (!writeups.length) return;

  const state = {
    query: "",
    category: "all",
    difficulty: "all",
    tag: ""
  };

  const els = {
    grid: document.querySelector("#writeupsGrid"),
    filters: document.querySelector("#filterChips"),
    difficulty: document.querySelector("#difficultyChips"),
    input: document.querySelector("#searchInput"),
    empty: document.querySelector("#emptyState"),
    resultCount: document.querySelector("#resultsCount"),
    spotlight: document.querySelector("#spotlightCard"),
    metricWriteups: document.querySelector("#metricWriteups"),
    metricDomains: document.querySelector("#metricDomains"),
    metricTags: document.querySelector("#metricTags"),
    metricTime: document.querySelector("#metricTime"),
    tagCloud: document.querySelector("#tagCloud")
  };

  const categories = ["all", ...new Set(writeups.map((item) => item.category))];
  const difficulties = ["all", "Easy", "Medium", "Hard"];
  const tags = [...new Set(writeups.flatMap((item) => item.tags))];

  function averageReadTime(items) {
    const minutes = items
      .map((item) => parseInt(item.readTime, 10))
      .filter((value) => !Number.isNaN(value));
    if (!minutes.length) return "n/a";
    return `${Math.round(minutes.reduce((sum, value) => sum + value, 0) / minutes.length)} min`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function buildCard(item) {
    const searchable = [
      item.title,
      item.summary,
      item.category,
      item.difficulty,
      item.tags.join(" "),
      item.stack.join(" ")
    ]
      .join(" ")
      .toLowerCase();

    const tagsMarkup = item.tags
      .slice(0, 5)
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join("");

    const stackLabel = item.stack.slice(0, 3).join(" · ");

    return `
      <article class="card card-rich" data-card data-category="${escapeHtml(item.category)}" data-difficulty="${escapeHtml(item.difficulty)}" data-search="${escapeHtml(searchable)}">
        <a href="${escapeHtml(item.url)}" aria-label="Leer ${escapeHtml(item.title)}">
          <div class="card-preview">
            <img src="${escapeHtml(item.cover)}" alt="Preview del writeup ${escapeHtml(item.title)}">
            <div class="card-overlay-meta">
              <span class="card-difficulty">${escapeHtml(item.difficulty)}</span>
              <span class="card-date">${escapeHtml(item.date)}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-top">
              <div class="icon">${item.icon}</div>
              <span class="badge">${escapeHtml(item.category)}</span>
            </div>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(item.summary)}</p>
            <div class="meta">
              <span>${escapeHtml(item.readTime)}</span>
              <span>${escapeHtml(item.visibility)}</span>
              <span>${escapeHtml(stackLabel)}</span>
            </div>
            <div class="tag-strip">${tagsMarkup}</div>
            <div class="card-foot">
              <span>${escapeHtml(item.highlight)}</span>
              <strong>Open Writeup →</strong>
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
      const tagOk = !state.tag || item.tags.includes(state.tag);
      return queryOk && categoryOk && difficultyOk && tagOk;
    });
  }

  function renderSpotlight() {
    if (!els.spotlight) return;
    const featured = writeups.find((item) => item.featured) || writeups[0];
    els.spotlight.innerHTML = `
      <div class="spotlight-copy">
        <div class="eyebrow">Featured Writeup</div>
        <h2>${escapeHtml(featured.title)}</h2>
        <p>${escapeHtml(featured.summary)}</p>
        <div class="spotlight-pills">
          <span>${escapeHtml(featured.category)}</span>
          <span>${escapeHtml(featured.difficulty)}</span>
          <span>${escapeHtml(featured.readTime)}</span>
        </div>
        <div class="spotlight-tags">
          ${featured.tags.slice(0, 6).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="actions">
          <a class="btn btn-primary" href="${escapeHtml(featured.url)}">Leer writeup completo</a>
          <a class="btn btn-secondary" href="#writeupsGrid">Explorar biblioteca</a>
        </div>
      </div>
      <a class="spotlight-visual" href="${escapeHtml(featured.url)}" aria-label="Abrir writeup destacado ${escapeHtml(featured.title)}">
        <img src="${escapeHtml(featured.cover)}" alt="Captura destacada de ${escapeHtml(featured.title)}">
      </a>
    `;
  }

  function renderMetrics() {
    if (els.metricWriteups) els.metricWriteups.textContent = String(writeups.length);
    if (els.metricDomains) els.metricDomains.textContent = String(new Set(writeups.map((item) => item.category)).size);
    if (els.metricTags) els.metricTags.textContent = String(tags.length);
    if (els.metricTime) els.metricTime.textContent = averageReadTime(writeups);

    if (els.tagCloud) {
      const topTags = tags
        .map((tag) => ({
          tag,
          count: writeups.filter((item) => item.tags.includes(tag)).length
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 14);

      els.tagCloud.innerHTML = topTags
        .map(
          ({ tag, count }) =>
            `<button class="tag-cloud-item" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)} <span>${count}</span></button>`
        )
        .join("");

      els.tagCloud.querySelectorAll("[data-tag]").forEach((button) => {
        button.addEventListener("click", () => {
          state.tag = button.dataset.tag === state.tag ? "" : button.dataset.tag;
          render();
        });
      });
    }
  }

  function renderCards() {
    if (!els.grid) return;
    const items = filteredItems();
    els.grid.innerHTML = items.map(buildCard).join("");
    if (els.empty) els.empty.style.display = items.length ? "none" : "block";
    if (els.resultCount) els.resultCount.textContent = `${items.length} writeups visibles`;
  }

  function applyUrlState() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const category = params.get("category");
    const difficulty = params.get("difficulty");
    const tag = params.get("tag");

    if (q) state.query = q.toLowerCase();
    if (category && categories.includes(category)) state.category = category;
    if (difficulty && difficulties.includes(difficulty)) state.difficulty = difficulty;
    if (tag && tags.includes(tag)) state.tag = tag;
  }

  function syncInput() {
    if (els.input) els.input.value = state.query;
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

    if (els.tagCloud) {
      els.tagCloud.querySelectorAll("[data-tag]").forEach((button) => {
        button.classList.toggle("active", button.dataset.tag === state.tag);
      });
    }
  }

  applyUrlState();
  syncInput();
  renderSpotlight();
  renderMetrics();
  render();

  if (els.input) {
    els.input.addEventListener("input", () => {
      state.query = els.input.value.trim().toLowerCase();
      renderCards();
    });
  }
})();
