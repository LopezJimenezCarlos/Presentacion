document.addEventListener("DOMContentLoaded", () => {
  const heroActions = document.querySelector(".hero-actions");
  if (!heroActions || document.querySelector(".htb-profile-link")) return;

  const style = document.createElement("style");
  style.textContent = `
    .htb-profile-link {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 12px;
      min-height: 46px;
      padding: 0 18px 0 14px;
      border: 1.5px solid rgba(159, 239, 0, 0.72);
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(159, 239, 0, 0.16), rgba(15, 23, 42, 0.08));
      color: #0f172a;
      font-weight: 800;
      text-transform: uppercase;
      font-size: .78rem;
      letter-spacing: .04em;
      transition: transform .25s var(--ease), border-color .25s var(--ease), background .25s var(--ease), box-shadow .25s var(--ease);
      white-space: nowrap;
      overflow: hidden;
    }

    .htb-profile-link::after {
      content: "↗";
      font-family: var(--font-mono);
      font-size: .76rem;
      opacity: .72;
      transition: transform .25s var(--ease), opacity .25s var(--ease);
    }

    .htb-profile-link:hover {
      transform: translateY(-2px);
      border-color: #9fef00;
      background: linear-gradient(135deg, rgba(159, 239, 0, 0.3), rgba(15, 23, 42, 0.04));
      box-shadow: 0 12px 34px rgba(159, 239, 0, 0.18);
    }

    .htb-profile-link:hover::after {
      transform: translate(2px, -2px);
      opacity: 1;
    }

    .htb-profile-logo {
      display: grid;
      place-items: center;
      width: 24px;
      height: 24px;
      border-radius: 7px;
      background: #111927;
      box-shadow: inset 0 0 0 1px rgba(159, 239, 0, 0.28);
      flex: 0 0 auto;
    }

    .htb-profile-logo img {
      width: 17px;
      height: 17px;
      object-fit: contain;
    }

    .htb-profile-copy {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.05;
    }

    .htb-profile-copy strong {
      font-size: .78rem;
      color: #0f172a;
    }

    .htb-profile-copy span {
      margin-top: 3px;
      color: rgba(15, 23, 42, 0.56);
      font-family: var(--font-mono);
      font-size: .58rem;
      letter-spacing: .11em;
    }

    @media (min-width: 981px) {
      .hero-copy .htb-profile-link {
        flex-basis: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 980px) {
      .htb-profile-link {
        color: var(--ink);
        background: rgba(159, 239, 0, 0.14);
      }
    }

    @media (max-width: 640px) {
      .htb-profile-link {
        justify-content: center;
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);

  const link = document.createElement("a");
  link.className = "htb-profile-link";
  link.href = "https://profile.hackthebox.com/profile/019e3a24-c73d-734e-ad48-8e086f6d8b0e";
  link.target = "_blank";
  link.rel = "noreferrer";
  link.setAttribute("aria-label", "Abrir perfil de Carlos López en Hack The Box");
  link.innerHTML = `
    <span class="htb-profile-logo" aria-hidden="true">
      <img src="https://www.hackthebox.com/images/logo-htb.svg" alt="" loading="lazy" decoding="async" />
    </span>
    <span class="htb-profile-copy">
      <strong>Hack The Box</strong>
      <span>Carlos López</span>
    </span>
  `;

  heroActions.appendChild(link);
});
