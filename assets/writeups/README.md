# Cybersecurity Writeups Architecture

This folder powers the portfolio writeups section.

## Files

- `writeups-data.js`: single source of truth for every public writeup.
- `writeups.js`: renders the writeup library, filters and cards.
- `writeup-detail.js`: renders the reusable dynamic detail page at `writeup.html?id=<writeup-id>`.
- `writeups.css`: base design system for library and article pages.
- `writeups-premium.css`: premium visual layer for detailed writeups.

## How to add a new writeup

1. Add a new object to `window.WRITEUPS` inside `writeups-data.js`.
2. Use a unique `id`, for example `silentium`.
3. Set `url` to `writeup.html?id=silentium`.
4. Fill the mandatory sections:
   - `sections.executiveSummary`
   - `sections.scopeContext`
   - `sections.reconnaissanceEnumeration`
   - `sections.attackSurfaceAnalysis`
   - `sections.initialAccess`
   - `sections.privilegeEscalation`
   - `sections.recommendations`
   - `sections.conclusion`
5. Add sanitized commands in `commands`.
6. Add only valid technical evidence in `evidence`.

## Evidence inclusion rules

Valid evidence:

- Linux terminal screenshots.
- Shells and command outputs.
- Burp Suite, Nmap, Gobuster, SQLMap, Metasploit, Hydra, Wireshark.
- Vulnerable panels, API responses, exploit execution, privilege escalation outputs.
- Technical dashboards directly relevant to the attack chain.

Invalid evidence:

- PDF screenshots.
- Word pages.
- Moodle, Blackboard, campus virtual, professor names, assignment statements.
- Plain text pages without technical execution value.
- University logos or academic instructions.
- Decorative images.

## Redaction rules

Never publish raw:

- Flags.
- Passwords.
- Hashes.
- Tokens.
- Cookies.
- JWTs.
- Private keys.
- Sensitive IPs.

Use these formats:

- `HTB{REDACTED}`
- `password: ********`
- `token: eyJ...REDACTED`
- `[HASH_REDACTED]`
- `<BSSID_REDACTED>`

If a step is not proven by the available evidence, use:

`Not documented in the available evidence.`
