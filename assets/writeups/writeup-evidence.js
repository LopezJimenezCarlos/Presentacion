(() => {
  const evidenceMap = window.WRITEUP_EVIDENCE || {};
  const pageName = decodeURIComponent(
    window.location.pathname.split("/").pop() || ""
  );
  const config = evidenceMap[pageName];

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (char) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[char] || char;
    });

  const looksSensitive = (filename) =>
    /(flag|password|cookie|cred|root|user)/i.test(filename);

  const updateProfessionalValue = () => {
    const heading = document.getElementById("recruiter-signal");
    if (!heading) {
      return;
    }

    heading.textContent = "Valor profesional";

    const copy = heading.nextElementSibling;
    if (copy && copy.tagName === "P") {
      copy.textContent =
        (config && config.professionalValue) ||
        copy.textContent.replace(/Recruiter signal/gi, "Valor profesional");
    }

    document
      .querySelectorAll('.toc a[href="#recruiter-signal"]')
      .forEach((link) => {
        link.textContent = "Valor profesional";
      });
  };

  const renderEvidenceSequence = () => {
    if (!config || !Array.isArray(config.steps) || !config.steps.length) {
      return;
    }

    const timeline = document.querySelector(".evidence-steps");
    const gallery = document.querySelector(".evidence-grid");
    const timelineHeading = document.getElementById("attack-timeline");
    const galleryHeading = document.getElementById("evidence");

    if (!timeline || !gallery) {
      return;
    }

    if (timelineHeading) {
      timelineHeading.textContent = "Secuencia visual analizada";
    }

    if (galleryHeading) {
      galleryHeading.textContent = "Evidencias";
    }

    const intro = `
      <div class="evidence-sequence-head">
        <div class="evidence-sequence-copy">
          <span class="evidence-kicker">Secuencia visual</span>
          <p>Capturas reales del laboratorio ordenadas por fase y comentadas de forma breve.</p>
        </div>
        <div class="evidence-sequence-stats">
          <strong>${config.steps.length}</strong>
          <span>capturas</span>
        </div>
      </div>
    `;

    timeline.innerHTML =
      intro +
      config.steps
        .map(([image, title, phase, analysis, takeaway], index) => {
          const badge = looksSensitive(image)
            ? '<span class="redacted-badge">Sanitized evidence</span>'
            : "";

          return `
            <article class="evidence-step evidence-step-rich">
              <div class="evidence-step-num">${String(index + 1).padStart(
                2,
                "0"
              )}</div>
              <div class="evidence-step-body">
                <div class="evidence-step-top">
                  <span class="phase-badge">${escapeHtml(phase)}</span>
                  ${badge}
                </div>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(analysis)}</p>
                <div class="evidence-note">${escapeHtml(takeaway)}</div>
                <figure class="step-evidence">
                  <img
                    alt="${escapeHtml(title)}"
                    src="../assets/writeups/img/${escapeHtml(image)}"
                    loading="lazy"
                    data-glightbox
                  />
                  <figcaption>${escapeHtml(
                    phase
                  )}: ${escapeHtml(title)}</figcaption>
                </figure>
              </div>
            </article>
          `;
        })
        .join("");

    gallery.innerHTML = config.steps
      .map(([image, title, phase, analysis], index) => {
        const badge = looksSensitive(image)
          ? '<span class="redacted-badge">Sanitized evidence</span>'
          : "";

        return `
          <figure class="evidence evidence-gallery-card">
            <img
              alt="${escapeHtml(title)}"
              src="../assets/writeups/img/${escapeHtml(image)}"
              loading="lazy"
              data-glightbox
            />
            <figcaption>
              <div class="evidence-gallery-meta">
                <span class="phase-badge">${escapeHtml(phase)}</span>
                <span class="gallery-index">${String(index + 1).padStart(
                  2,
                  "0"
                )}</span>
              </div>
              <strong>${escapeHtml(title)}</strong>
              ${badge}
              <span>${escapeHtml(analysis)}</span>
            </figcaption>
          </figure>
        `;
      })
      .join("");
  };

  updateProfessionalValue();
  renderEvidenceSequence();
})();
