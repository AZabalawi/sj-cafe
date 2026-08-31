// SJ Cafe menu data — Phase 1 demo/reference content.
//
// Structure is intentionally simple and flat (no DB) so the owner can edit
// prices/availability directly in this file and redeploy. It's also shaped
// so a future database/admin panel can read the exact same MenuCategory[]
// shape without any page/component changes.
//
// Source: SJ Cafe's live Talabat listing (Aug 2026 pull), cross-checked
// against docs/sj-cafe-menu-audit.md.
//
// Rules followed here:
//  - Only items with a single, unambiguous confirmed price are included.
//  - Corrected names from the audit are used (not Talabat's typos).
//  - No descriptions — Talabat's were unreliable, and Phase 1 doesn't need them.
//  - Anything uncertain or missing is left OUT and logged in OWNER_CONFIRMATIONS.md.

export type MenuItem = {
  /** Used to look up /public/images/products/<slug>.(jpg|jpeg|png|webp) */
  slug: string;
  name: { en: string; ar: string };
  /** Price in AED, whole units. Change this and redeploy to update the site. */
  price: number;
  /** Flip to false to grey the item out on the live menu (the "86" toggle, manually for now). */
  available: boolean;
  /**
   * Shows the item in the "Popular at SJ" carousel. Hand-picked for this demo
   * (not derived from real sales data — there isn't any yet). Update once the
   * owner has actual best-seller numbers.
   */
  featured?: boolean;
};

export type MenuCategory = {
  slug: string;
  name: { en: string; ar: string };
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    slug: "hot-coffee",
    name: { en: "Hot Coffee", ar: "قهوة ساخنة" },
    items: [
      { slug: "double-espresso", name: { en: "Double Espresso", ar: "إسبريسو دوبل" }, price: 18, available: true },
      { slug: "macchiato", name: { en: "Macchiato", ar: "ماكياتو" }, price: 17, available: true },
      { slug: "piccolo", name: { en: "Piccolo", ar: "بيكولو" }, price: 18, available: true },
      { slug: "cortado", name: { en: "Cortado", ar: "كورتادو" }, price: 22, available: true },
      { slug: "cappuccino", name: { en: "Cappuccino", ar: "كابتشينو" }, price: 20, available: true },
      { slug: "flat-white", name: { en: "Flat White", ar: "فلات وايت" }, price: 24, available: true },
      { slug: "americano", name: { en: "Americano", ar: "أمريكانو" }, price: 20, available: true },

      // OWNER CONFIRMATION REQUIRED: "Cafe Latte" intentionally omitted.
      // Talabat lists it at two different prices (AED 22 under "Hot Drinks" and
      // AED 24 under "Exclusive Coffee"). Do not guess — see OWNER_CONFIRMATIONS.md.
      // Add it back here once the owner confirms the real price.

      { slug: "spanish-latte", name: { en: "Spanish Latte", ar: "لاتيه إسباني" }, price: 27, available: true },
      { slug: "saffron-latte", name: { en: "Saffron Latte", ar: "لاتيه زعفران" }, price: 27, available: true },
      { slug: "rose-latte", name: { en: "Rose Latte", ar: "لاتيه ورد" }, price: 27, available: true },
      { slug: "salted-caramel-latte", name: { en: "Salted Caramel Latte", ar: "لاتيه كراميل مملح" }, price: 27, available: true },
      { slug: "red-velvet-latte", name: { en: "Red Velvet Latte", ar: "لاتيه ريد فيلفيت" }, price: 27, available: true },
      { slug: "signature", name: { en: "Signature", ar: "سيجنتشر" }, price: 29, available: true },
      { slug: "turkish-coffee", name: { en: "Turkish Coffee", ar: "قهوة تركية" }, price: 12, available: true },
      { slug: "affogato", name: { en: "Affogato", ar: "أفوجاتو" }, price: 22, available: true },
    ],
  },
  {
    slug: "cold-coffee",
    name: { en: "Cold Coffee", ar: "قهوة باردة" },
    items: [
      { slug: "cold-brew", name: { en: "Cold Brew", ar: "كولد برو" }, price: 24, available: true },
      { slug: "iced-spanish-latte", name: { en: "Iced Spanish Latte", ar: "لاتيه إسباني مثلج" }, price: 27, available: true, featured: true },
      { slug: "iced-saffron-latte", name: { en: "Iced Saffron Latte", ar: "لاتيه زعفران مثلج" }, price: 27, available: true },
      { slug: "iced-rose-latte", name: { en: "Iced Rose Latte", ar: "لاتيه ورد مثلج" }, price: 27, available: true },
      { slug: "iced-caramel-latte", name: { en: "Iced Caramel Latte", ar: "لاتيه كراميل مثلج" }, price: 27, available: true },
      { slug: "iced-salted-caramel-latte", name: { en: "Iced Salted Caramel Latte", ar: "لاتيه كراميل مملح مثلج" }, price: 27, available: true },
      { slug: "iced-signature", name: { en: "Iced Signature", ar: "سيجنتشر مثلج" }, price: 29, available: true },
    ],
  },
  {
    slug: "manual-brew",
    name: { en: "Manual Brew", ar: "تحضير يدوي" },
    items: [
      { slug: "v60", name: { en: "V60", ar: "في ٦٠" }, price: 26, available: true },
      { slug: "chemex", name: { en: "Chemex", ar: "كيمكس" }, price: 27, available: true },
    ],
  },
  {
    slug: "hot-chocolate-tea",
    name: { en: "Hot Chocolate & Tea", ar: "شوكولاتة ساخنة وشاي" },
    items: [
      { slug: "mega-hot-chocolate", name: { en: "Mega Hot Chocolate", ar: "شوكولاتة ساخنة ميجا" }, price: 27, available: true },
      { slug: "shay-gnad", name: { en: "Shay Gnad", ar: "شاي قند" }, price: 7, available: true },
    ],
  },
  {
    slug: "milkshakes",
    name: { en: "Milkshakes", ar: "ميلك شيك" },
    items: [
      { slug: "oreo-milkshake", name: { en: "Oreo Milkshake", ar: "ميلك شيك أوريو" }, price: 25, available: true, featured: true },
      { slug: "lotus-milkshake", name: { en: "Lotus Milkshake", ar: "ميلك شيك لوتس" }, price: 25, available: true },
      { slug: "strawberry-milkshake", name: { en: "Strawberry Milkshake", ar: "ميلك شيك فراولة" }, price: 25, available: true },
      { slug: "vanilla-milkshake", name: { en: "Vanilla Milkshake", ar: "ميلك شيك فانيلا" }, price: 25, available: true },
      { slug: "pistachio-milkshake", name: { en: "Pistachio Milkshake", ar: "ميلك شيك فستق" }, price: 27, available: true },
      { slug: "red-velvet-milkshake", name: { en: "Red Velvet Milkshake", ar: "ميلك شيك ريد فيلفيت" }, price: 27, available: true },
      { slug: "chocolate-milkshake", name: { en: "Chocolate Milkshake", ar: "ميلك شيك شوكولاتة" }, price: 27, available: true },
      { slug: "salted-caramel-milkshake", name: { en: "Salted Caramel Milkshake", ar: "ميلك شيك كراميل مملح" }, price: 27, available: true },
    ],
  },
  {
    slug: "smoothies-acai",
    name: { en: "Smoothies & Acai", ar: "سموذي وأساي" },
    items: [
      { slug: "acai-smoothie", name: { en: "Acai Smoothie", ar: "سموذي أساي" }, price: 32, available: true },
      { slug: "blueberry-acai", name: { en: "Blueberry Acai", ar: "أساي بالتوت" }, price: 47, available: true },
      { slug: "hambana", name: { en: "Hambana", ar: "همبانا" }, price: 22, available: true },
    ],
  },
  {
    slug: "mojitos-juices",
    name: { en: "Mojitos & Juices", ar: "موهيتو وعصائر" },
    items: [
      { slug: "orange-juice", name: { en: "Orange Juice", ar: "عصير برتقال" }, price: 17, available: true },
      { slug: "strawberry-mojito", name: { en: "Strawberry Mojito", ar: "موهيتو فراولة" }, price: 20, available: true },
      { slug: "hibiscus", name: { en: "Hibiscus", ar: "كركديه" }, price: 22, available: true },
      { slug: "passion-mojito", name: { en: "Passion Mojito", ar: "موهيتو باشن" }, price: 24, available: true, featured: true },
      { slug: "blueberry-mojito", name: { en: "Blueberry Mojito", ar: "موهيتو توت أزرق" }, price: 25, available: true },
      { slug: "pineapple-mojito", name: { en: "Pineapple Mojito", ar: "موهيتو أناناس" }, price: 25, available: true },
    ],
  },
  {
    slug: "ice-cream",
    name: { en: "Ice Cream", ar: "آيس كريم" },
    items: [
      { slug: "mango-ice-cream", name: { en: "Mango Ice Cream", ar: "آيس كريم مانجو" }, price: 27, available: true },
      { slug: "mix-mango-vanilla-ice-cream", name: { en: "Mix Mango Vanilla Ice Cream", ar: "آيس كريم مانجو وفانيلا" }, price: 27, available: true },
    ],
  },
  {
    slug: "crepes-waffles-pancakes",
    name: { en: "Crepes, Waffles & Pancakes", ar: "كريب ووافل وبان كيك" },
    items: [
      { slug: "lotus-crepe", name: { en: "Lotus Crepe", ar: "كريب لوتس" }, price: 27, available: true, featured: true },
      { slug: "nutella-crepe", name: { en: "Nutella Crepe", ar: "كريب نوتيلا" }, price: 27, available: true },
      { slug: "kinder-crepe", name: { en: "Kinder Crepe", ar: "كريب كيندر" }, price: 31, available: true },
      { slug: "pistachio-crepe", name: { en: "Pistachio Crepe", ar: "كريب فستق" }, price: 31, available: true },
      { slug: "mix-chocolate-crepe", name: { en: "Mix Chocolate Crepe", ar: "كريب شوكولاتة مشكل" }, price: 31, available: true },
      { slug: "lotus-pancakes", name: { en: "Lotus Pancakes", ar: "بان كيك لوتس" }, price: 27, available: true },
      { slug: "nutella-pancakes", name: { en: "Nutella Pancakes", ar: "بان كيك نوتيلا" }, price: 27, available: true },
      { slug: "kinder-pancakes", name: { en: "Kinder Pancakes", ar: "بان كيك كيندر" }, price: 31, available: true, featured: true },
      { slug: "pistachio-pancakes", name: { en: "Pistachio Pancakes", ar: "بان كيك فستق" }, price: 31, available: true },
      { slug: "lotus-waffle", name: { en: "Lotus Waffle", ar: "وافل لوتس" }, price: 31, available: true },
      { slug: "nutella-waffle", name: { en: "Nutella Waffle", ar: "وافل نوتيلا" }, price: 31, available: true },
      { slug: "kinder-waffle", name: { en: "Kinder Waffle", ar: "وافل كيندر" }, price: 34, available: true },
      { slug: "pistachio-waffle", name: { en: "Pistachio Waffle", ar: "وافل فستق" }, price: 36, available: true, featured: true },
    ],
  },
  {
    slug: "cakes-desserts",
    name: { en: "Cakes & Desserts", ar: "كيك وحلويات" },
    items: [
      { slug: "san-sebastian-cheesecake", name: { en: "San Sebastian Cheesecake", ar: "تشيز كيك سان سباستيان" }, price: 27, available: true, featured: true },
      { slug: "pistachio-molten-cake", name: { en: "Pistachio Molten Cake", ar: "كيك مولتن فستق" }, price: 27, available: true },
      { slug: "brownies-cake", name: { en: "Brownies Cake", ar: "كيك براوني" }, price: 27, available: true },
      { slug: "kinder-rain", name: { en: "Kinder Rain", ar: "كيندر رين" }, price: 37, available: true, featured: true },
      { slug: "cookie-fingers", name: { en: "Cookie Fingers", ar: "أصابع كوكيز" }, price: 29, available: true },
    ],
  },
  {
    slug: "water",
    name: { en: "Water", ar: "مياه" },
    items: [
      { slug: "al-ain-water", name: { en: "Al Ain Water", ar: "مياه العين" }, price: 3, available: true },
      { slug: "sparkling-water", name: { en: "Sparkling Water", ar: "مياه فوارة" }, price: 22, available: true },
      { slug: "lemon-sparkling-water", name: { en: "Lemon Sparkling Water", ar: "مياه فوارة بالليمون" }, price: 22, available: true },
    ],
  },
  {
    slug: "boxes-catering",
    name: { en: "Boxes & Catering", ar: "بوكسات وضيافة" },
    items: [
      { slug: "hot-chocolate-box", name: { en: "Hot Chocolate Box", ar: "بوكس شوكولاتة ساخنة" }, price: 180, available: true },
      { slug: "coffee-mix-juice-24", name: { en: "Coffee Mix Juice 24", ar: "بوكس قهوة وعصير ٢٤" }, price: 260, available: true },
    ],
  },
];

/*
 * OWNER CONFIRMATION REQUIRED — items left out of this file entirely because
 * they have no single confirmed price (real drive-thru items missing from the
 * Talabat price source: 5 croissants, 2 whole-bean coffee retail products,
 * several cold coffee/frappe/dessert items, Acai Bowl, extra water brands).
 * Full list: see OWNER_CONFIRMATIONS.md — do not add these back with a guessed price.
 */
