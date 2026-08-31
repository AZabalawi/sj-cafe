# SJ Cafe — Menu Audit

Findings from reading his live Talabat listing against his live Drivu drive-thru menu.

**Do not hand this document to the owner.** It reads as a list of his failures. Pick three
findings, show them on your phone with both sites open, and let him react. That conversation
sells the project better than any pricing sheet.

---

## The headline

**Talabat: 69 items. Drive-thru menu: 79 items. They are not the same 69 and 79.**

Neither platform shows his full menu. A customer's idea of what SJ Cafe sells depends entirely
on which app they opened.

The clearest example: **he sells five croissants — plain, almond, chocolate, cheese and
zaatar — and not one of them appears on Talabat.** A morning delivery customer cannot buy a
pastry from him. Same for his retail coffee beans, his acai bowl, and eight desserts.

Going the other way, Talabat lists thirteen crepes, waffles and pancakes that his drive-thru
menu doesn't show at all — including Pistachio Waffle at AED 36, one of his most expensive
items.

Frame it to him like this:

> "You're paying commission on a menu that's missing your pastries, and running a drive-thru
> menu that's missing your waffles. Whichever one a customer sees, they're seeing about
> two-thirds of your business."

---

## Wrong descriptions on live items

These are on his Talabat page right now, attached to items customers are ordering. They look
like AI-generated filler that nobody checked.

| Item | What the description actually says |
|---|---|
| **Red Velvet Milkshake** | Describes an Indian vegetarian dish cooked in a kadai wok |
| **Red Velvet Latte** (hot) | Describes lime, mint and blue curaçao — that's a mojito |
| **Acai Smoothie** | One word: "Cheese" |
| **Salted Caramel Latte** (in Hot Drinks) | Describes a *cold* coffee beverage |
| **Hambana** | "Hambana, a dish with a name called 'Hambana.'" |
| **Signature** | "Distinctive representation." |
| **Coffee Mix Juice 24** | Guesses at its own size — "size 24 may refer to ounces" |

The last one is the one to show him. His own menu is speculating about what his own product is.

## Misspelled item names

| On Talabat | Should be |
|---|---|
| Cookies Fngers | Cookie Fingers |
| Pocolo | Piccolo |
| Afghato | Affogato |
| Coffe Mix Juice 24 | Coffee Mix Juice 24 |
| Sebastian Cake | San Sebastian Cheesecake |

## Broken structure

- A category called **"Coffee mix juice box 24"** contains a Hot Chocolate Box, cookies, and a
  Kinder Crepe. None of those are coffee, juice, or a box of 24.
- **Mango Ice Cream** and **Mix Mango Vanilla Ice Cream** are filed under *Cold Drinks*.
- **Orange Juice** is listed twice, at AED 17 each, in two different categories.
- **Cafe Latte** appears twice at two different prices — **AED 24** under *Exclusive Coffee*
  and **AED 22** under *Hot Drinks*. Same drink, same shop, two prices.
- Two categories, *Exclusive Coffee* and *Speciality Coffee*, hold overlapping items with no
  clear distinction between them.
- **Hot Chocolate Box (AED 180)** and **Coffee Mix Juice 24 (AED 260)** are his highest-value
  products — catering-sized orders — buried inside a nonsense category with no explanation of
  what they contain or who they serve.

That last point is a revenue argument, not a tidiness argument. Two products worth 6–10× his
average ticket are effectively hidden.

---

## Three things to say in the meeting

**1. Open with the Cafe Latte.**
Pull up both categories on your phone. "Same latte, two prices, same page. Which one is right?"
He won't know. That's the moment he understands the problem is real.

**2. Then the croissants.**
"You sell five croissants. Show me where a Talabat customer buys one." He can't.

**3. Then the fix, in one sentence.**
"One menu that you control. You change it once, it changes everywhere. And the items you
actually make money on go at the top instead of the bottom."

Don't pitch features after that. Let it sit.

---

## What this changes about the build

- The site becomes the **single source of truth**. Phase 2 should include a simple export so
  he can keep Talabat and Drivu in sync from one place, rather than maintaining three menus.
- **Boxes & Catering deserves its own category** on the homepage, not a buried listing. Two
  items at AED 180 and AED 260 justify a dedicated section with photos and a "what's included"
  description.
- **Pastries need to exist as a category** — they don't, on the platform that gets his
  delivery traffic.
- Reordering by margin rather than by whatever order they were entered is worth doing on day
  one and costs nothing.

---

## Before you quote these prices back to him

Ask directly: **"Are your Talabat prices the same as your counter prices?"**

Most restaurants list higher on aggregators to absorb the commission. If his do, then putting
Talabat prices on his own website means charging delivery-inflated prices to someone standing
at his drive-thru window — which defeats the entire point of the project. You need his
**in-store** price list, and the gap between the two is itself a useful number to show him.

Also confirm the prices include the 5% VAT. They almost certainly do, but the checkout has to
display it correctly either way.
