# SJ Cafe — Master Build Prompt

Paste everything below the line into your AI coding assistant of choice (one that supports file
creation). Build it in the order given. Do **not** ask it to do all three phases in one go — it
will produce a big blurry mess. Do Phase 1, run it, look at it, then move on.

Before you paste: replace every `<<<...>>>` placeholder. The prices in the seed data are
**invented placeholders** so the demo renders. Get the real price list from the owner and
swap them in before you show him anything.

---

## PROMPT — PHASE 1: Menu site + QR + admin

You are building a production website for **SJ Cafe**, an independent specialty coffee shop
and drive-thru in Al Shahama, Abu Dhabi, UAE.

### Business facts

- Name: SJ Cafe (اس جيه كافيه)
- Address: 61 Al Souq St, Al Shahama, New Shahamah, Abu Dhabi, UAE
- Phone / WhatsApp: +971 54 300 0909
- Hours: daily 15:00 – 01:00 (opens 3 PM, closes 1 AM — note this crosses midnight)
- Currency: AED. UAE VAT is 5% and must be **included in displayed prices**, with a line
  showing the VAT portion at checkout.
- Timezone: Asia/Dubai (UTC+4). No DST.
- Languages: English and Arabic. Arabic must render right-to-left properly, not as a
  bolted-on afterthought.

### Stack — use exactly this, do not substitute

- **Backend:** Go 1.23+, standard library `net/http` only (Go 1.22+ pattern-based routing is
  enough — no Gin, no Echo, no Fiber).
- **Database:** SQLite via `modernc.org/sqlite` (pure Go, no CGO, so it cross-compiles to a
  single static binary). Schema in a `schema.sql` file applied on boot if tables are missing.
- **Templates:** Go `html/template`, server-rendered. No SPA.
- **Interactivity:** HTMX 2.x and Alpine.js 3.x, both from CDN. No npm, no bundler, no build
  step.
- **CSS:** Tailwind via the standalone CLI binary (committed to the repo), output to
  `static/css/app.css`. Do not use the Tailwind CDN script in production.
- **Config:** environment variables only, loaded at startup, with sane defaults for local dev.
  Never commit secrets.

Rationale you should follow throughout: the deliverable is **one binary plus one folder of
static files plus one SQLite file**. It must run with `./sjcafe` and nothing else installed.

### Project layout

```
sjcafe/
  cmd/server/main.go
  internal/
    handlers/      HTTP handlers
    models/        DB structs + queries
    db/            connection, migrations, seed
    i18n/           translation maps
  templates/
    layouts/
    pages/
    partials/
  static/
    css/  js/  img/  qr/
  schema.sql
  seed.json
  Makefile
  README.md
  .env.example
```

### Data model

```
categories  (id, slug, name_en, name_ar, sort_order, is_active)
items       (id, category_id, slug, name_en, name_ar, desc_en, desc_ar,
             price_fils, image_path, is_available, is_featured, sort_order,
             calories NULL, allergens NULL)
options     (id, item_id, group_name_en, group_name_ar, is_required,
             min_select, max_select)
option_vals (id, option_id, name_en, name_ar, price_delta_fils, is_available)
settings    (key, value)          -- hours, phone, social links, banner text
admin_users (id, email, pw_hash, created_at)
sessions    (token, admin_user_id, expires_at)
audit_log   (id, admin_user_id, action, detail, created_at)
```

Store all money as **integer fils** (1 AED = 100 fils). Never use floats for money anywhere
in this codebase. Format to AED only at the render layer.

### Public pages

1. **`/`** — Landing. Hero with cafe photo, one-line positioning, prominent
   "View Menu" and "Order for Pickup" buttons, live open/closed badge computed from the
   15:00–01:00 window in Asia/Dubai, address with a Google Maps link, tap-to-call, tap-to-
   WhatsApp, hours table, Instagram link.
2. **`/menu`** — The full menu. Sticky category nav that scroll-spies. Search box that filters
   client-side with Alpine. Items unavailable today render greyed out with an "unavailable"
   label, not hidden. Images lazy-loaded.
3. **`/menu/<item-slug>`** — Item detail: large image, description, price, option groups,
   quantity, add to cart.
4. **`/cart`** and **`/checkout`** — See ordering rules below.
5. **`/order/<public_id>`** — Order status page the customer keeps open.
6. **`/qr`** — Nothing public; this is the target of the printed QR codes and simply
   redirects to `/menu?src=qr-<location>` so you can attribute scans.

### Language handling

- Locale from a `lang` cookie, falling back to `Accept-Language`, defaulting to English.
- `/ar/...` mirrors every route.
- When Arabic: `dir="rtl"` on `<html>`, mirrored layout via Tailwind's `rtl:` variants, and
  an Arabic-capable font (IBM Plex Sans Arabic or Noto Kufi Arabic).
- Prices and numerals stay in Western Arabic numerals (0–9) — that is what UAE customers
  expect on menus.
- Every user-facing string lives in the i18n map or the DB. No hardcoded English in templates.

### Ordering — Phase 1 is CASH ONLY

No card payment in this phase. This is deliberate: it means the site can go live in days
instead of waiting weeks for a payment gateway merchant account.

Checkout collects: name, mobile number (UAE format validation, `+971 5x xxx xxxx`),
fulfilment type (**Pickup at counter** / **Drive-thru**), and if drive-thru, **car
plate number and car colour**. Optional note field. Then:

- Generate a short human-readable order code, e.g. `SJ-4821`.
- Send the order to the kitchen screen immediately.
- Show the customer an order status page with a big **"I've arrived"** button. Pressing it
  flips the order to `arrived` and makes it flash on the kitchen screen. This is the single
  most important feature in the whole build — the cafe's main complaint in public reviews is
  wait time, and this is what fixes it.
- Order states: `new → accepted → preparing → ready → arrived → collected`, plus `cancelled`.
- Auto-refresh the status page with HTMX polling every 10 seconds.

### Admin (`/admin`)

Session-cookie auth, bcrypt password hashes, CSRF tokens on every mutating form, rate-limited
login. No third-party auth provider.

- **Kitchen screen** (`/admin/kitchen`) — full-screen, large type, designed for a tablet
  propped by the machine. New orders appear via HTMX polling with an audible chime. One tap
  to advance state. `arrived` orders jump to the top with a colour flag.
- **Menu editor** — CRUD on categories, items, options. Drag to reorder. Image upload with
  server-side resize to WebP at 800px and 1600px.
- **The 86 switch** — a single list of every item with an availability toggle. One tap marks
  something sold out and it greys out on the live site instantly. Staff will use this daily;
  make it fast and make it the easiest thing to find in the admin.
- **Hours and banner** — override today's hours, post a banner ("closed for maintenance",
  "new pistachio latte").
- **Dashboard** — orders today, revenue today, top 10 items this week, orders by hour.
  Simple server-rendered tables and a bar chart drawn as plain SVG. No charting library.
- **Export** — orders as CSV for a date range.

### Non-negotiable quality bar

- Mobile-first. Assume 90% of traffic is a phone held one-handed, often outdoors in
  bright sun — so high contrast, large tap targets (min 44px), no thin grey-on-grey text.
- Lighthouse performance ≥ 90 on mobile.
- Works with JavaScript disabled for browsing the menu (HTMX enhances, it doesn't gate).
- All images WebP with width/height attributes to prevent layout shift.
- Semantic HTML, real `<label>`s, visible focus rings, alt text on every image.
- SEO: per-page title and meta description in both languages, Open Graph tags,
  `Restaurant` + `Menu` JSON-LD structured data, `sitemap.xml`, `robots.txt`,
  hreflang tags linking the EN and AR versions.
- Security: parameterised SQL everywhere, `html/template` auto-escaping left intact,
  security headers (CSP, HSTS, X-Content-Type-Options, Referrer-Policy), file upload type
  and size validation, no stack traces leaked to users.

### Deliverables for Phase 1

- Working code, `go build ./...` clean, `go vet` clean.
- `schema.sql` and `seed.json` (seed data below) with a `make seed` target.
- Table-driven tests for: price arithmetic, the open/closed time window across midnight,
  order state transitions, and UAE phone validation.
- A `README.md` a non-developer could follow to run it locally.
- A `qr` generator: `make qr` writes PNG and SVG QR codes into `static/qr/` for
  `table`, `counter`, `drivethru`, and `window` sources.

---

## PROMPT — PHASE 2: Payments (run only after Phase 1 is live)

Add online card payment and Apple Pay to the existing Go codebase.

- Gateway: **Stripe**, using Payment Intents. Apple Pay and Google Pay come free via
  Stripe's Payment Request Button once the domain is verified — do not build a separate
  Apple Pay integration.
- The Go server creates the Payment Intent. The client-side key is publishable only.
  The secret key lives in an environment variable and never reaches the browser.
- Implement the webhook endpoint with **signature verification** and **idempotency** — an
  order must never be double-fulfilled if Stripe retries.
- Payment states must be separate from order states. `payment: pending | authorised | paid |
  failed | refunded`. An order is only sent to the kitchen once payment is `paid`.
- Keep cash-on-pickup as an option. Do not remove it.
- Refund action in the admin, with a reason field, written to the audit log.
- Show a VAT-inclusive total plus a "includes AED X.XX VAT (5%)" line.
- Store no card data. Ever. Not the last four digits, not the brand, nothing beyond the
  Stripe payment intent ID.
- Add tests using Stripe's test mode and a mocked webhook payload.

## PROMPT — PHASE 3: Growth features (pick, don't build all)

- **Loyalty stamps** — identified by mobile number, no signup, no app. 9 drinks earn the
  10th. Staff redeem from the kitchen screen by entering the number. Fraud guard: max one
  stamp per number per 30 minutes.
- **Bean subscription** — the cafe sells Brazil Cerrado Mineiro and Ethiopia Hambela Bati
  whole bean. Monthly recurring via Stripe Subscriptions, choice of grind, pause and cancel
  from a link.
- **Review funnel** — 45 minutes after an order is marked `collected`, send a WhatsApp
  template message thanking them with a direct Google review link. Ask the owner to confirm
  he wants this before you build it; it needs a WhatsApp Business API account.
- **Catering / bulk orders** — a form for office orders in Shahama, minimum 10 drinks,
  24-hour notice, routed to WhatsApp rather than the kitchen screen.
- **Ramadan mode** — a settings flag that switches the homepage to Iftar pre-order with
  scheduled collection slots. In the UAE this is worth building before Ramadan, not during.
- **PWA** — web app manifest, service worker, offline menu cache, add-to-home-screen prompt
  after the second visit. Gives him an "app" with no App Store fee and no review process.

---

## SEED DATA — real prices from Talabat (Aug 2026)

**69 unique items.** All prices in AED, taken from SJ Cafe's live Talabat listing.

Three things to know before you use these:

1. **Talabat prices usually carry a delivery markup.** Restaurants routinely list higher on
   aggregators to absorb the commission. Ask the owner whether these match his counter prices.
   If they don't, the site should use his **in-store** prices — otherwise he'd be charging
   delivery-inflated prices to someone standing at his own drive-thru window.
2. **These are almost certainly VAT-inclusive.** Confirm, then display accordingly.
3. **Categories below are reorganised.** Talabat's own grouping is broken — see the audit
   document. Show the owner the clean version; it demos well.

```json
{
  "currency": "AED",
  "price_source": "talabat_aug_2026",
  "categories": [
    { "slug": "hot-coffee", "name_en": "Hot Coffee", "name_ar": "قهوة ساخنة", "sort": 1,
      "items": [
        { "name_en": "Double Espresso",     "name_ar": "إسبريسو دوبل",       "price_aed": 18 },
        { "name_en": "Macchiato",           "name_ar": "ماكياتو",             "price_aed": 17 },
        { "name_en": "Piccolo",             "name_ar": "بيكولو",              "price_aed": 18 },
        { "name_en": "Cortado",             "name_ar": "كورتادو",             "price_aed": 22 },
        { "name_en": "Cappuccino",          "name_ar": "كابتشينو",            "price_aed": 20 },
        { "name_en": "Flat White",          "name_ar": "فلات وايت",           "price_aed": 24 },
        { "name_en": "Americano",           "name_ar": "أمريكانو",            "price_aed": 20 },
        { "name_en": "Cafe Latte",          "name_ar": "كافيه لاتيه",         "price_aed": 22, "PRICE_CONFLICT": "listed at both 22 and 24 on Talabat — confirm" },
        { "name_en": "Spanish Latte",       "name_ar": "لاتيه إسباني",        "price_aed": 27 },
        { "name_en": "Saffron Latte",       "name_ar": "لاتيه زعفران",        "price_aed": 27 },
        { "name_en": "Rose Latte",          "name_ar": "لاتيه ورد",           "price_aed": 27 },
        { "name_en": "Salted Caramel Latte","name_ar": "لاتيه كراميل مملح",   "price_aed": 27 },
        { "name_en": "Red Velvet Latte",    "name_ar": "لاتيه ريد فيلفيت",    "price_aed": 27 },
        { "name_en": "Signature",           "name_ar": "سيجنتشر",             "price_aed": 29 },
        { "name_en": "Turkish Coffee",      "name_ar": "قهوة تركية",          "price_aed": 12 },
        { "name_en": "Affogato",            "name_ar": "أفوجاتو",             "price_aed": 22 }
      ]},
    { "slug": "cold-coffee", "name_en": "Cold Coffee", "name_ar": "قهوة باردة", "sort": 2,
      "items": [
        { "name_en": "Cold Brew",                 "name_ar": "كولد برو",               "price_aed": 24 },
        { "name_en": "Iced Spanish Latte",        "name_ar": "لاتيه إسباني مثلج",      "price_aed": 27 },
        { "name_en": "Iced Saffron Latte",        "name_ar": "لاتيه زعفران مثلج",      "price_aed": 27 },
        { "name_en": "Iced Rose Latte",           "name_ar": "لاتيه ورد مثلج",         "price_aed": 27 },
        { "name_en": "Iced Caramel Latte",        "name_ar": "لاتيه كراميل مثلج",      "price_aed": 27 },
        { "name_en": "Iced Salted Caramel Latte", "name_ar": "لاتيه كراميل مملح مثلج", "price_aed": 27 },
        { "name_en": "Iced Signature",            "name_ar": "سيجنتشر مثلج",           "price_aed": 29 }
      ]},
    { "slug": "manual-brew", "name_en": "Manual Brew", "name_ar": "تحضير يدوي", "sort": 3,
      "items": [
        { "name_en": "V60",    "name_ar": "في ٦٠", "price_aed": 26 },
        { "name_en": "Chemex", "name_ar": "كيمكس", "price_aed": 27 }
      ]},
    { "slug": "hot-chocolate-tea", "name_en": "Hot Chocolate & Tea", "name_ar": "شوكولاتة ساخنة وشاي", "sort": 4,
      "items": [
        { "name_en": "Mega Hot Chocolate", "name_ar": "شوكولاتة ساخنة ميجا", "price_aed": 27 },
        { "name_en": "Shay Gnad",          "name_ar": "شاي قند",             "price_aed": 7 }
      ]},
    { "slug": "milkshakes", "name_en": "Milkshakes", "name_ar": "ميلك شيك", "sort": 5,
      "items": [
        { "name_en": "Oreo Milkshake",           "name_ar": "ميلك شيك أوريو",       "price_aed": 25 },
        { "name_en": "Lotus Milkshake",          "name_ar": "ميلك شيك لوتس",        "price_aed": 25 },
        { "name_en": "Strawberry Milkshake",     "name_ar": "ميلك شيك فراولة",      "price_aed": 25 },
        { "name_en": "Vanilla Milkshake",        "name_ar": "ميلك شيك فانيلا",      "price_aed": 25 },
        { "name_en": "Pistachio Milkshake",      "name_ar": "ميلك شيك فستق",        "price_aed": 27 },
        { "name_en": "Red Velvet Milkshake",     "name_ar": "ميلك شيك ريد فيلفيت",  "price_aed": 27 },
        { "name_en": "Chocolate Milkshake",      "name_ar": "ميلك شيك شوكولاتة",    "price_aed": 27 },
        { "name_en": "Salted Caramel Milkshake", "name_ar": "ميلك شيك كراميل مملح", "price_aed": 27 }
      ]},
    { "slug": "smoothies-acai", "name_en": "Smoothies & Acai", "name_ar": "سموذي وأساي", "sort": 6,
      "items": [
        { "name_en": "Acai Smoothie",  "name_ar": "سموذي أساي",    "price_aed": 32 },
        { "name_en": "Blueberry Acai", "name_ar": "أساي بالتوت",   "price_aed": 47 },
        { "name_en": "Hambana",        "name_ar": "همبانا",        "price_aed": 22,
          "desc_en": "Fresh mango smoothie blended with mango ice cream" }
      ]},
    { "slug": "mojitos-juices", "name_en": "Mojitos & Juices", "name_ar": "موهيتو وعصائر", "sort": 7,
      "items": [
        { "name_en": "Orange Juice",     "name_ar": "عصير برتقال",     "price_aed": 17 },
        { "name_en": "Strawberry Mojito","name_ar": "موهيتو فراولة",   "price_aed": 20 },
        { "name_en": "Hibiscus",         "name_ar": "كركديه",          "price_aed": 22 },
        { "name_en": "Passion Mojito",   "name_ar": "موهيتو باشن",     "price_aed": 24 },
        { "name_en": "Blueberry Mojito", "name_ar": "موهيتو توت أزرق", "price_aed": 25 },
        { "name_en": "Pineapple Mojito", "name_ar": "موهيتو أناناس",   "price_aed": 25 }
      ]},
    { "slug": "ice-cream", "name_en": "Ice Cream", "name_ar": "آيس كريم", "sort": 8,
      "items": [
        { "name_en": "Mango Ice Cream",            "name_ar": "آيس كريم مانجو",         "price_aed": 27 },
        { "name_en": "Mix Mango Vanilla Ice Cream","name_ar": "آيس كريم مانجو وفانيلا", "price_aed": 27 }
      ]},
    { "slug": "crepes-waffles-pancakes", "name_en": "Crepes, Waffles & Pancakes", "name_ar": "كريب ووافل وبان كيك", "sort": 9,
      "items": [
        { "name_en": "Lotus Crepe",         "name_ar": "كريب لوتس",          "price_aed": 27 },
        { "name_en": "Nutella Crepe",       "name_ar": "كريب نوتيلا",        "price_aed": 27 },
        { "name_en": "Kinder Crepe",        "name_ar": "كريب كيندر",         "price_aed": 31 },
        { "name_en": "Pistachio Crepe",     "name_ar": "كريب فستق",          "price_aed": 31 },
        { "name_en": "Mix Chocolate Crepe", "name_ar": "كريب شوكولاتة مشكل", "price_aed": 31 },
        { "name_en": "Lotus Pancakes",      "name_ar": "بان كيك لوتس",       "price_aed": 27 },
        { "name_en": "Nutella Pancakes",    "name_ar": "بان كيك نوتيلا",     "price_aed": 27 },
        { "name_en": "Kinder Pancakes",     "name_ar": "بان كيك كيندر",      "price_aed": 31 },
        { "name_en": "Pistachio Pancakes",  "name_ar": "بان كيك فستق",       "price_aed": 31 },
        { "name_en": "Lotus Waffle",        "name_ar": "وافل لوتس",          "price_aed": 31 },
        { "name_en": "Nutella Waffle",      "name_ar": "وافل نوتيلا",        "price_aed": 31 },
        { "name_en": "Kinder Waffle",       "name_ar": "وافل كيندر",         "price_aed": 34 },
        { "name_en": "Pistachio Waffle",    "name_ar": "وافل فستق",          "price_aed": 36 }
      ]},
    { "slug": "cakes-desserts", "name_en": "Cakes & Desserts", "name_ar": "كيك وحلويات", "sort": 10,
      "items": [
        { "name_en": "San Sebastian Cheesecake", "name_ar": "تشيز كيك سان سباستيان", "price_aed": 27,
          "NOTE": "listed on Talabat as 'Sebastian Cake' — fix the name" },
        { "name_en": "Pistachio Molten Cake",    "name_ar": "كيك مولتن فستق",        "price_aed": 27 },
        { "name_en": "Brownies Cake",            "name_ar": "كيك براوني",            "price_aed": 27 },
        { "name_en": "Kinder Rain",              "name_ar": "كيندر رين",             "price_aed": 37 },
        { "name_en": "Cookie Fingers",           "name_ar": "أصابع كوكيز",           "price_aed": 29,
          "NOTE": "listed on Talabat as 'Cookies Fngers' — typo" }
      ]},
    { "slug": "water", "name_en": "Water", "name_ar": "مياه", "sort": 11,
      "items": [
        { "name_en": "Al Ain Water",          "name_ar": "مياه العين",         "price_aed": 3 },
        { "name_en": "Sparkling Water",       "name_ar": "مياه فوارة",         "price_aed": 22 },
        { "name_en": "Lemon Sparkling Water", "name_ar": "مياه فوارة بالليمون","price_aed": 22 }
      ]},
    { "slug": "boxes-catering", "name_en": "Boxes & Catering", "name_ar": "بوكسات وضيافة", "sort": 12,
      "items": [
        { "name_en": "Hot Chocolate Box",  "name_ar": "بوكس شوكولاتة ساخنة", "price_aed": 180,
          "desc_en": "A box of hot chocolate mix with accompaniments" },
        { "name_en": "Coffee Mix Juice 24","name_ar": "بوكس قهوة وعصير ٢٤",   "price_aed": 260 }
      ]}
  ]
}
```

### Items on his Drive-Thru menu but NOT on Talabat — get prices for these

These are real products he sells that are missing from the price source. Ask the owner for each.
The croissants matter most: **five pastry items, none of them on Talabat at all.**

```
Pastries      Plain Croissant · Almond Croissant · Chocolate Croissant ·
              Cheese Croissant · Zaatar Croissant
Coffee beans  Brazil Cerrado Mineiro · Ethiopia Hambela Bati   (retail bags — needs
              grind + size options: whole bean / espresso / V60 / Chemex / French press,
              and 250 g / 1 kg)
Cold coffee   Iced Americano · Iced Cafe Latte · Iced Pistachio Latte ·
              Iced White Mocha · Iced Red Velvet Latte
Frappes       Pistachio Frappe · Saffron Frappe · Kinder Frappe · Mango Frappe
Desserts      Baby Shark · Saffron Milk Cake · Pistachio Milk Cake · Ferrero Choco ·
              Germany Molten · Chocolate Molten · Kinder Cookie · Brownie
Ice cream     Vanilla · Strawberry · Watermelon · Coconut
Drinks        Sky Blue Mojito · Watermelon Juice · Watermelon Strawberry Juice
Other         Acai Bowl · Dolomia Water · Mastiqua Greek Sparkling Water 330 ml
```

Possible duplicates to resolve with the owner rather than guess:
`Blueberry Acai` vs `Acai Bowl` · `Brownies Cake` vs `Brownie` · `Sparkling Water` vs
`Mastiqua` · `Mega Hot Chocolate` vs `Hot Chocolate` · `Pocolo` is `Piccolo` ·
`Afghato` is `Affogato`.

### Option groups

Attach to every coffee item rather than repeating them per item:

- **Size** — Small / Medium / Large
- **Milk** — Full fat / Skimmed / Oat / Almond / Coconut
- **Sugar** — None / Less / Normal / Extra
- **Extra shot**
- **Ice** (cold only) — No ice / Less / Normal

Talabat doesn't expose the surcharges, so ask him. Oat milk in particular varies a lot
between Abu Dhabi cafes.
