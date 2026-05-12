(function () {
  const writeups = Array.isArray(window.WRITEUPS) ? window.WRITEUPS.slice() : [];
  if (!writeups.length) return;

  const featured = writeups.filter((item) => item.featured).slice(0, 3);
  const categories = new Set(writeups.map((item) => item.category));
  const tags = new Set(writeups.flatMap((item) => item.tags));

  const els = {
    grid: document.querySelector("#featuredWriteupsGrid"),
    count: document.querySelector("#homeWriteupCount"),
    categories: document.querySelector("#homeWriteupCategories"),
    tags: document.querySelector("#homeWriteupTags"),
    year: document.querySelector("[data-current-year]")
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
        <a href="${escapeHtml(item.url)}" aria-label="Abrir ${escapeHtml(item.title)}">
          <div class="visual">
            <img src="${escapeHtml(item.cover)}" alt="Preview de ${escapeHtml(item.title)}">
          </div>
          <div class="body">
            <div class="topline">
              <span>${escapeHtml(item.category)}</span>
              <span>${escapeHtml(item.difficulty)}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary)}</p>
            <div class="meta">
              <span>${escapeHtml(item.readTime)}</span>
              <span>${escapeHtml(item.date)}</span>
            </div>
            <div class="tags">${tagsMarkup}</div>
            <div class="footer">
              <span>${escapeHtml(item.stack.slice(0, 2).join(" · "))}</span>
              <strong>Ver writeup</strong>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  if (els.grid) {
    els.grid.innerHTML = featured.map(buildCard).join("");
  }

  if (els.count) els.count.textContent = String(writeups.length);
  if (els.categories) els.categories.textContent = String(categories.size);
  if (els.tags) els.tags.textContent = String(tags.size);
  if (els.year) els.year.textContent = String(new Date().getFullYear());
})();
