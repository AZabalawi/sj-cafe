# SJ Cafe

Digital storefront and ordering experience for SJ Cafe, Al Shahama, Abu Dhabi.

A bilingual (English/Arabic, full RTL) mobile-first storefront: browse the
menu, add items to a cart, and check out for pickup or car pickup with cash
payment at the restaurant. A single universal QR code opens the storefront
directly.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. No database — menu and
business data live in plain TypeScript files that are edited directly and
redeployed.

## Run it locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

## Editing the menu

Open [`data/menu.ts`](data/menu.ts):

- Change a `price` and redeploy — that's the whole workflow.
- Set `available: false` on an item to grey it out on the live menu with an
  "Unavailable" label.
- Add or remove items and categories by editing the array directly.
- Mark an item `featured: true` to include it in the "Popular at SJ" section.
- Business details (name, address, phone, hours) live in
  [`data/business.ts`](data/business.ts).

This file is intentionally kept in the same shape a future database/admin
panel would use, so upgrading later won't require redesigning any pages —
only swapping where the data comes from.

## Product photos & logo

Real product photos live in `public/images/products/`, named after each
item's `slug` from `data/menu.ts`. The real logo lives in
`public/images/logo/`. To replace either, drop a file at the same path — see
the README in each folder for details. No code changes needed.

## Cart & checkout

The cart persists in the browser (`localStorage`) and checkout collects
name, UAE mobile number, and pickup details (car make/model and plate for
car pickup). Payment is cash at the restaurant only — no online payments are
processed by this site.

## QR code

There is exactly **one** QR code for the whole cafe (table, counter,
entrance, cups, flyers, social — all the same code). It points at the
storefront.

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

## Deployment

Configured for Netlify via `netlify.toml` and `@netlify/plugin-nextjs`.

## Further reading

See `OWNER_CONFIRMATIONS.md` for details that still need sign-off before
this goes live (pricing, business details, product photography), and
`docs/` for the original project research and planning notes.
