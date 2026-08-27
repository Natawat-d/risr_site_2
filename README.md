# risr_site2

A second presentation of the RISR website, in the design the school asked for
after looking at [wbais.net](https://www.wbais.net/) — sticky nav with
mega-menus, a hero with three calls to action, figure cards, pillars, card
grids.

It runs **beside** the original at `/risr`, which is untouched. Both read the
same Postgres database, so:

- content is edited in one place, the existing admin at `/risr/admin`;
- the two sites can be compared with identical content;
- nothing here can damage the live site — this app owns no schema and runs no
  migrations.

## Why a second app rather than a redesign in place

26 of the original site's 33 pages are template strings of the legacy PHP's
HTML, carrying ~719 inline `style=""` attributes that outrank any stylesheet.
Restyling them is possible — `theme.css` does it today — but the new design
needs different *layout*, not different colours. Rebuilding in a clean app is
less work than unpicking that, and it leaves the demo-ready site alone.

## Design notes

- **No Bootstrap, no utility framework.** One token set in `globals.css`; the
  palette is RISR's own navy/blue/sand plus a single new accent (`--accent`).
- **Headings always state their colour.** On the original, three page titles
  were navy on a navy hero — present, correct, invisible — because they
  inherited white and `theme.css` overrode it.
- **Footer links are anchors.** The original navigates with
  `onclick="window.location.href='/history/ '"`, which the base-path rewrite
  never saw inside a JavaScript string; 22 dead buttons per page.
- **Placeholder text is skipped, not printed.** Five legacy pages hold
  `[value-2]`-style strings written by an automated attack in 2024; `real()`
  filters them so a parent never sees them.

## Running it

```bash
npm install
cp .env.example .env      # point DATABASE_URL at the risr_site database
npm run dev
```
