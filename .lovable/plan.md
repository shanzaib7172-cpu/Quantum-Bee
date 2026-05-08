## Goal
Keep all TopBar buttons (Home, About, Blogs, Bee AI, Planet Bee Community, BeeCoin badge, Login/Sign up or Profile) on a single horizontal line — no wrapping to a second row, even on narrow viewports like the current 673px preview.

## Changes (single file: `src/components/TopBar.tsx`)

1. **Remove `flex-wrap` from the desktop nav** so chips stay on one row.
   - Replace `hidden sm:flex items-center gap-1 flex-wrap justify-end` with `hidden sm:flex items-center gap-1 flex-nowrap justify-end overflow-x-auto`.

2. **Prevent each chip from shrinking or breaking** so labels stay intact and the row scrolls horizontally if it ever overflows.
   - Add `shrink-0` to the `Icon3D` wrapper span (and to the `BeeCoinBadge` container) so they keep their natural width.
   - Labels already have `whitespace-nowrap` — keep that.

3. **Tighten spacing on small desktop widths** so everything fits without scroll at ~640–800px.
   - Reduce nav `gap-1` → `gap-0.5` and chip padding from `px-3 py-1.5` → `px-2 py-1` at the `sm` breakpoint, restoring the larger spacing at `md+` (e.g. `sm:px-2 md:px-3`).
   - Shorten the long label "Planet Bee Community" displayed in the chip to "Community" (or hide the label below `md` and show icon-only) so the row fits the 673px viewport without horizontal scroll.

4. **Hide the brand wordmark below `md`** (already `hidden sm:inline`) — change to `hidden md:inline` to free up space for the nav row at sm widths.

5. **Allow horizontal scroll as a graceful fallback** with `overflow-x-auto` and `scrollbar-none` (custom utility or inline style `scrollbarWidth: 'none'`) so if the user shrinks further, buttons slide instead of wrapping.

## Out of scope
- Mobile menu (`sm:hidden`) is unchanged.
- No changes to routing, page contents, or other components.

## Open question
At 673px wide with 5 nav chips + coin badge + profile chip, the row is tight. Pick one:
- **A.** Shorten "Planet Bee Community" → "Community" in the chip label (recommended).
- **B.** Keep full labels and allow horizontal scroll inside the nav.
- **C.** Show icon-only chips between `sm` and `md`, full labels at `md+`.

Default if unspecified: **A**.
