(function () {
  const writeups = Array.isArray(window.WRITEUPS) ? window.WRITEUPS : [];
  const byId = Object.fromEntries(writeups.map((item) => [item.id, item]));

  function setEvidenceImage(writeupId, evidenceIndex, imagePath) {
    const writeup = byId[writeupId];
    if (!writeup || !Array.isArray(writeup.evidence) || !writeup.evidence[evidenceIndex]) return;
    writeup.evidence[evidenceIndex].image = imagePath;
  }

  setEvidenceImage("sqlmap-sqli", 1, "assets/writeups/evidence/sqli-sqlmap.svg");
  setEvidenceImage("webshell-upload", 1, "assets/writeups/evidence/webshell-upload.svg");
})();
