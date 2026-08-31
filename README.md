# SJ Cafe — Phase 1

Bilingual (English/Arabic) menu website for SJ Cafe, Al Shahama, Abu Dhabi.
Phase 1 scope only: a premium, mobile-first menu site with one universal QR
code. No ordering, payments, or accounts — see `docs/` and
`OWNER_CONFIRMATIONS.md` for the full context and what's still pending.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. No database — the menu
lives in a plain TypeScript file (`data/menu.ts`) that you edit directly and
redeploy.

## Run it locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

## Editing the menu

Open [`data/menu.ts`](data/menu.ts):

- Change a `price` and redeploy — that's the whole workflow for Phase 1.
- Set `available: false` on an item to grey it out on the live menu with an
  "Unavailable" label (the "86" toggle, done manually for now).
- Add/remove items or whole categories by editing the array directly.
- Business details (name, address, phone, hours) live in
  [`data/business.ts`](data/business.ts).

This file is intentionally kept in the same shape a future database/admin
panel would use, so upgrading later won't require redesigning any pages —
only swapping where the data comes from.

## Product photos & logo

No real photography yet, so every item shows a branded placeholder tile
that still looks intentional. To add a real photo, drop a file named after
the item's `slug` into `public/images/products/` (see the README in that
folder). Same idea for the logo in `public/images/logo/`. No code changes
needed either way.

## QR code

There is exactly **one** QR code for the whole cafe (table, counter,
entrance, cups, flyers, social — all the same code). It points at `/menu`.

```bash
npm run generate:qr
```

This reads the target domain from `NEXT_PUBLIC_SITE_URL` (see
`.env.local`) and writes `public/qr/sj-cafe-menu-qr.png` and `.svg`. Update
`NEXT_PUBLIC_SITE_URL` to the real production domain once it exists, then
re-run this before printing anything for real.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## What's not built yet (by design)

Cart, checkout, online payments, kitchen screen, customer accounts, loyalty,
and QR analytics are all out of scope for Phase 1. See
`docs/sj-cafe-build-prompt.md` for the longer-term roadmap, and
`OWNER_CONFIRMATIONS.md` for what needs sign-off before this goes live.
