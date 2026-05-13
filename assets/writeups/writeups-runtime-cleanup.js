(function () {
  const writeups = Array.isArray(window.WRITEUPS) ? window.WRITEUPS : [];
  writeups.forEach((item) => {
    delete item.readTime;
    delete item.estimatedTime;
    delete item.duration;
    if (typeof item.summary === "string") {
      item.summary = item.summary
        .replace(/\b\d+\s*(minutos|min|horas|h)\b/gi, "")
        .replace(/\btiempo\s+(estimado|de\s+lectura)\b/gi, "")
        .trim();
    }
  });
})();
