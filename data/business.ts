// Business facts for SJ Cafe.
// Sourced from the project research docs in /docs (Talabat, Google, Drivu listings).
// These are DEMO values for Phase 1 — see OWNER_CONFIRMATIONS.md before going live.

export const business = {
  name: {
    en: "SJ Cafe",
    ar: "اس جيه كافيه",
  },
  tagline: {
    en: "Crafted drinks and desserts in Al Shahama",
    ar: "مشروبات وحلويات حرفية في الشهامة",
  },
  // Kept as a single value (not translated) so we don't risk mistranslating
  // the street/area name. See OWNER_CONFIRMATIONS.md.
  address: "61 Al Souq St, Al Shahama, New Shahamah, Abu Dhabi, UAE",
  // Area + city only — standard, unambiguous place names, safe to translate
  // (unlike the full street address above). Used in compact header contexts.
  shortLocation: {
    en: "Al Shahama, Abu Dhabi",
    ar: "الشهامة، أبوظبي",
  },
  mapsQuery: "SJ Cafe, 61 Al Souq St, Al Shahama, Abu Dhabi, UAE",

  // tel:/wa.me links need digits only (no spaces, "+" optional per spec).
  phone: {
    href: "+971543000909",
    display: "+971 54 300 0909",
  },
  whatsapp: {
    href: "971543000909",
  },

  hours: {
    // 15:00 -> 01:00 next day, Asia/Dubai, every day. Window crosses midnight.
    openHour: 15,
    openMinute: 0,
    closeHour: 1,
    closeMinute: 0,
    timezone: "Asia/Dubai",
    display: {
      en: "Daily · 3:00 PM – 1:00 AM",
      ar: "يوميًا · 3:00 مساءً – 1:00 صباحًا",
    },
  },

  currency: {
    code: "AED",
    label: { en: "AED", ar: "درهم" },
  },
} as const;
