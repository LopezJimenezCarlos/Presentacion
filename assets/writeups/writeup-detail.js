(function () {
  const writeups = Array.isArray(window.WRITEUPS) ? window.WRITEUPS : [];
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id") || "";
  const item = writeups.find((entry) => entry.id === requestedId) || writeups[0];
  const fallback = "No documentado en la evidencia disponible.";

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function sanitizeCommand(value) {
    return String(value ?? "")
      .replace(/HTB\{[^}]+\}/gi, "HTB{REDACTED}")
      .replace(/flag\{[^}]+\}/gi, "flag{REDACTED}")
      .replace(/password\s*[:=]\s*\S+/gi, "password: ********")
      .replace(/passwd\s*[:=]\s*\S+/gi, "passwd: ********")
      .replace(/token\s*[:=]\s*([A-Za-z0-9._-]{8,})/gi, "token: $1...REDACTED")
      .replace(/eyJ[A-Za-z0-9._-]+/g, "eyJ...REDACTED")
      .replace(/([A-Fa-f0-9]{32,})/g, "[HASH_REDACTED]");
  }

  function setText(selector, value, fallbackText = fallback) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value || fallbackText;
  }

  function setHtml(selector, html) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  }

  if (!item) {
    document.body.innerHTML = '<main class="container section"><h1>Writeup no encontrado</h1><p>No documentado en la evidencia disponible.</p><p><a class="btn btn-primary" href="writeups.html">Volver a writeups</a></p></main>';
    return;
  }

  document.title = `${item.title} | Carlos López Jiménez`;
  setText("#breadcrumbCategory", item.category);
  setText("#detailEyebrow", `${item.category} · ${item.difficulty} · ${item.readTime}`);
  setText("#detailTitle", item.title);
  setText("#detailSummary", item.summary);
  setText("#metricTarget", item.target);
  setText("#metricImpact", item.impact);
  setText("#metricDifficulty", item.difficulty);
  setText("#metricVisibility", item.visibility);

  const cover = document.querySelector("#detailCover");
  if (cover) {
    cover.src = item.cover || "assets/imgs/cover-linux.svg";
    cover.alt = `Visual técnico del writeup ${item.labName || item.title}`;
  }

  setHtml("#detailTags", (item.tags || []).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join(""));

  const sections = item.sections || {};
  setText("#executiveSummary", sections.executiveSummary);
  setText("#scopeContext", sections.scopeContext);
  setText("#attackSurfaceAnalysis", sections.attackSurfaceAnalysis);
  setText("#initialAccess", sections.initialAccess);
  setText("#privilegeEscalation", sections.privilegeEscalation);
  setText("#conclusion", sections.conclusion);

  setHtml(
    "#killChain",
    (item.killChain || [])
      .map((step, index) => `<span><strong>${String(index + 1).padStart(2, "0")}</strong>${escapeHtml(step)}</span>`)
      .join("")
  );

  setHtml(
    "#reconnaissanceEnumeration",
    (sections.reconnaissanceEnumeration || [fallback]).map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")
  );

  setHtml(
    "#securityRecommendations",
    (sections.recommendations || [fallback]).map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")
  );

  const commandChain = document.querySelector("#commandChain");
  if (commandChain) {
    commandChain.textContent = (item.commands || [fallback]).map(sanitizeCommand).join("\n");
  }

  setHtml(
    "#evidenceSteps",
    (item.evidence || [])
      .map((evidence, index) => {
        const imageMarkup = evidence.image
          ? `<figure class="step-evidence"><img src="${escapeHtml(evidence.image)}" alt="${escapeHtml(evidence.title)}" loading="lazy"><figcaption>${escapeHtml(evidence.description)}</figcaption></figure>`
          : "";
        const commandMarkup = evidence.command
          ? `<div class="code compact"><pre>${escapeHtml(sanitizeCommand(evidence.command))}</pre></div>`
          : "";
        return `
          <section class="evidence-step">
            <div class="evidence-step-num">${String(index + 1).padStart(2, "0")}</div>
            <div class="evidence-step-body">
              <div class="evidence-step-top">
                <span class="phase-badge">${escapeHtml(evidence.phase || "Evidencia técnica")}</span>
                ${evidence.redacted ? '<span class="redacted-badge">Saneado</span>' : ""}
              </div>
              <h3>${escapeHtml(evidence.title || "Evidencia")}</h3>
              <p>${escapeHtml(evidence.description || fallback)}</p>
              ${commandMarkup}
              ${imageMarkup}
            </div>
          </section>
        `;
      })
      .join("") || '<div class="empty evidence-empty">No documentado en la evidencia disponible.</div>'
  );
})();
