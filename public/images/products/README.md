# Product photos

All 68 items currently in [`data/menu.ts`](../../../data/menu.ts) have a real
SJ Cafe photo here (`<slug>.webp`), sourced from the public SJ Cafe Talabat
listing's own embedded menu data — the highest-resolution version Talabat
serves for each item, not a resized thumbnail. Resolutions range from
1200×901 down to 400×300 depending on what Talabat has for that item; none
were upscaled.

Example: the menu entry with `slug: "cappuccino"` is shown automatically
because `cappuccino.webp` exists in this folder.

**No code changes needed to add/replace one.** Each menu card looks for
`<slug>.webp` first, then `<slug>.jpg`, and falls back to a branded
placeholder tile if neither exists. See `EXTENSIONS` in
`components/ProductImage.tsx` to add another format.

**Before this goes live**, ideally swap these for the owner's own
photography — a few of the Talabat originals are only 400×300, which is
fine for a grid card but soft if ever shown larger (e.g. a product-detail
view). Consistent lighting/background across items would also make the
grid feel more cohesive than a listing assembled over time on Talabat.
