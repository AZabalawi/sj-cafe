# SJ Cafe logo

`sj-cafe-logo.webp` is the real SJ Cafe logo, sourced from the public
Talabat listing's own vendor logo asset. Native resolution is only
**200×180px** — fine for the small badge sizes used in the header/footer
(all well under 60px displayed), but don't scale it up any larger than that
or it'll look soft.

`sj-cafe-logo-cropped.webp` (**130×180px**) is what's actually displayed —
the original has ~40px of flat blue margin on each side (the artwork itself
isn't full-bleed), which read as an awkward gap once the logo sits directly
in the header row with no card around it. This is a straight crop (via
`sharp().extract()`), not a resize — no upscaling, no distortion, same pixel
density as the source. Only the sides were trimmed; the top/bottom margins
were left alone since the source has almost no bottom margin to begin with
(~6px) and trimming further there cuts into the "SJ CAFE" wordmark.

**To upgrade:** drop a higher-quality file at `logo.svg` (preferred) or
`logo.png` — see `LOGO_SOURCES` in `components/Logo.tsx`, which tries the
cropped asset first, then the uncropped original, then these two. No code
changes needed either way; if all four are ever missing, the component
falls back to a styled "SJ" monogram badge instead of a broken image.
