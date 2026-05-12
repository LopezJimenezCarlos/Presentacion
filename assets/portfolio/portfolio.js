(function () {
  const writeups = Array.isArray(window.WRITEUPS) ? window.WRITEUPS.slice() : [];
  if (!writeups.length) return;

  const featured = writeups.filter((item) => item.featured).slice(0, 3);
  const categories = new Set(writeups.map((item) => item.category));
  const tags = [...new Set(writeups.flatMap((item) => item.tags))];

  const els = {
    writeupGrid: document.querySelector("#featuredWriteupsGrid"),
    writeupSpotlight: document.querySelector("#writeupSpotlight"),
    metricCount: document.querySelector("#homeWriteupCount"),
    metricCategories: document.querySelector("#homeWriteupCategories"),
    metricTags: document.querySelector("#homeWriteupTags"),
    tagPulse: document.querySelector("#writeupTagPulse"),
    footerYear: document.querySelector("[data-current-year]")
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function buildCard(item) {
    const tagsMarkup = item.tags
      .slice(0, 4)
      .map((tag) => `<span>${escapeHtml(tag)}</span>`)
      .join("");

    return `
      <article class="home-writeup-card">
        <a href="${escapeHtml(item.url)}" aria-label="Leer ${escapeHtml(item.title)}">
          <div class="visual">
            <img src="${escapeHtml(item.cover)}" alt="Preview del writeup ${escapeHtml(item.title)}">
          </div>
          <div class="body">
            <div class="topline">
              <span class="category">${escapeHtml(item.category)}</span>
              <span class="difficulty">${escapeHtml(item.difficulty)}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
            <div class="meta">
              <span>${escapeHtml(item.readTime)}</span>
              <span>${escapeHtml(item.date)}</span>
              <span>${escapeHtml(item.visibility)}</span>
            </div>
            <div class="tags">${tagsMarkup}</div>
            <div class="footer">
              <span>${escapeHtml(item.stack.slice(0, 3).join(" · "))}</span>
              <strong>Ver writeup →</strong>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  function renderSpotlight() {
    if (!els.writeupSpotlight) return;
    const item = featured[0] || writeups[0];
    els.writeupSpotlight.innerHTML = `
      <div class="spotlight-card">
        <div class="eyebrow">Writeup principal</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <div class="spotlight-pills">
          <span>${escapeHtml(item.category)}</span>
          <span>${escapeHtml(item.difficulty)}</span>
          <span>${escapeHtml(item.readTime)}</span>
          <span>${escapeHtml(item.date)}</span>
        </div>
        <div class="tag-list">
          ${item.tags.slice(0, 6).map((tag) => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join("")}
        </div>
        <div class="spotlight-quote">${escapeHtml(item.highlight)}</div>
        <div class="button-row">
          <a class="btn btn-primary" href="${escapeHtml(item.url)}">Abrir writeup completo</a>
          <a class="btn btn-secondary" href="writeups.html?category=${encodeURIComponent(item.category)}">Ver más de ${escapeHtml(item.category)}</a>
        </div>
      </div>
      <aside class="library-link-card">
        <div class="eyebrow">Library mode</div>
        <h3>Biblioteca técnica orientada a contratación</h3>
        <p>Los writeups están pensados para lectura rápida en web, con evidencias visuales, fases claras, comandos resaltados y navegación interna por cada laboratorio.</p>
        <div class="mini-matrix">
          <div>Reconocimiento → Enumeración → Explotación → Privesc</div>
          <div>Filtros por categoría, dificultad y tecnología</div>
          <div>Versión pública saneada sin flags ni secretos</div>
        </div>
        <div class="button-row">
          <a class="btn btn-primary" href="writeups.html">Explorar biblioteca</a>
        </div>
      </aside>
    `;
  }

  function renderFeaturedGrid() {
    if (!els.writeupGrid) return;
    els.writeupGrid.innerHTML = featured.map(buildCard).join("");
  }

  function renderMetrics() {
    if (els.metricCount) els.metricCount.textContent = String(writeups.length);
    if (els.metricCategories) els.metricCategories.textContent = String(categories.size);
    if (els.metricTags) els.metricTags.textContent = String(tags.length);

    if (els.tagPulse) {
      const topTags = tags
        .map((tag) => ({
          tag,
          count: writeups.filter((item) => item.tags.includes(tag)).length
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

      els.tagPulse.innerHTML = topTags
        .map(
          ({ tag, count }) =>
            `<a class="tag-pill" href="writeups.html?tag=${encodeURIComponent(tag)}">#${escapeHtml(tag)} <span>(${count})</span></a>`
        )
        .join("");
    }

    if (els.footerYear) els.footerYear.textContent = String(new Date().getFullYear());
  }

  renderSpotlight();
  renderFeaturedGrid();
  renderMetrics();
})();
