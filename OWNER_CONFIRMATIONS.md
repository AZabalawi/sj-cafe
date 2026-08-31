# Owner confirmations needed before this goes live

Everything below uses **temporary demo values** sourced from public listings
(Talabat, Google, Drivu) and the research docs in `/docs`. None of it should
be treated as final. Nothing here was guessed — where something was
uncertain, it was left out of the public site rather than invented.

## Pricing — highest priority

- **Do Talabat prices match SJ Cafe's actual in-store / drive-thru counter
  prices?** Aggregators commonly mark up prices to absorb commission. If
  they don't match, the whole demo price list needs to be replaced with the
  real counter prices before this goes live — otherwise the site would
  overcharge someone standing at the drive-thru window.
- **Are the listed prices VAT-inclusive?** Almost certainly yes, but needs
  a direct confirmation.
- **"Cafe Latte" is intentionally missing from the public menu.** Talabat
  lists it at two different prices — AED 22 (under "Hot Drinks") and AED 24
  (under "Exclusive Coffee"). We didn't guess; it's omitted from
  `data/menu.ts` until the owner confirms the real price, at which point add
  one entry back into the `hot-coffee` category.

## Missing items — no confirmed price, so left out of the public menu

These are real products SJ Cafe sells (per the drive-thru menu) that never
appeared on Talabat, so there's no price source for them at all:

- **Pastries**: Plain Croissant, Almond Croissant, Chocolate Croissant, Cheese Croissant, Zaatar Croissant
- **Coffee beans (retail)**: Brazil Cerrado Mineiro, Ethiopia Hambela Bati — also need grind options (whole bean / espresso / V60 / Chemex / French press) and size options (250g / 1kg), each likely with its own price
- **Cold coffee**: Iced Americano, Iced Cafe Latte, Iced Pistachio Latte, Iced White Mocha, Iced Red Velvet Latte
- **Frappes**: Pistachio Frappe, Saffron Frappe, Kinder Frappe, Mango Frappe
- **Desserts**: Baby Shark, Saffron Milk Cake, Pistachio Milk Cake, Ferrero Choco, Germany Molten, Chocolate Molten, Kinder Cookie, Brownie
- **Ice cream**: Vanilla, Strawberry, Watermelon, Coconut
- **Drinks**: Sky Blue Mojito, Watermelon Juice, Watermelon Strawberry Juice
- **Other**: Acai Bowl, Dolomia Water, Mastiqua Greek Sparkling Water 330ml

## Possible duplicate items — resolve rather than guess

- Blueberry Acai vs. Acai Bowl — same product listed under two names?
- Brownies Cake vs. Brownie — same product?
- Sparkling Water vs. Mastiqua — same product, or two different waters?
- Mega Hot Chocolate vs. Hot Chocolate — same product?

## Business details shown on the site (demo values)

- **Name**: SJ Cafe / اس جيه كافيه
- **Address**: 61 Al Souq St, Al Shahama, New Shahamah, Abu Dhabi, UAE
  — kept in Latin script only for now; if the owner wants an official
  Arabic-script address shown, we need the correct wording rather than a
  guessed transliteration.
- **Phone / WhatsApp**: +971 54 300 0909
- **Hours**: Daily, 15:00–01:00 (3 PM – 1 AM), Asia/Dubai
- All of the above should be confirmed directly with the owner — they're
  sourced from public listings, not from him directly.

## Missing entirely (not shown yet)

- **Instagram handle** — no handle was available in the research docs, so no
  Instagram link is shown on the site yet. Add one once we have it.
- **Production domain** — the QR code currently points at whatever
  `NEXT_PUBLIC_SITE_URL` is set to (`http://localhost:3000` for now). Once
  the real domain is live, update `.env.local` and run `npm run generate:qr`
  again before printing anything.

## Logo and product photos — sourced from Talabat, worth confirming

The site now uses the **real SJ Cafe logo and real product photos**, but
they were extracted from SJ Cafe's own public Talabat listing (its embedded
page data), not supplied directly by the owner. Two things worth a direct
confirmation before this goes fully live:

- **Quality**: the logo is only 200×180px natively (fine for the small
  header/footer badge size used, not for anything larger). Several product
  photos are as small as 400×300px — fine for grid cards, soft if ever
  shown larger. If the owner has higher-resolution originals (or a vector
  logo file), swapping them in is a drop-in replacement — see
  `public/images/logo/README.md` and `public/images/products/README.md`.
- **Consistency**: these photos were shot at different times for a Talabat
  listing, not as a single cohesive shoot — lighting/background/styling
  varies item to item. Worth flagging to the owner rather than presenting
  it as final photography.

## Copy / wording

- The homepage tagline ("Specialty coffee & drive-thru in Al Shahama") and
  Arabic translations of UI text (buttons, labels) were written for this
  demo and have not been reviewed by the owner. Worth a quick read-through
  before this is shown to him as anything more than a demo.

## Cosmetic decision (not a data risk, just worth a nod)

- Menu categories follow the cleaned-up structure from `docs/sj-cafe-menu-audit.md`
  (e.g. one unified coffee list instead of Talabat's overlapping "Exclusive
  Coffee" / "Speciality Coffee" categories). This is a presentation choice,
  not a pricing change — flag it to the owner so he's not surprised his
  Talabat categories don't match 1:1.
