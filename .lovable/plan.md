## Bee AI / Community / Profile Polish + Chat History + Login Gate

### 1. Header parity on Bee AI page
- In `src/pages/Index.tsx` (Bee AI), replace the custom header with the same `TopBar` used on Home, so the Profile button + Bee Coins badge match exactly. Keep the drawer menu trigger and back arrow as a small left cluster above the chat.

### 2. Navigation rename + logo swap (Community)
- In `src/components/TopBar.tsx`, rename the `/study-bee` nav entry from "Community" → "Planet Bee Community" (label only; route unchanged to avoid breakage).
- In `src/pages/StudyBee.tsx`, replace any generic/emoji bee with `@/assets/bee-logo.png` in the header/branding.
- In `src/components/BeeCoinBadge.tsx`, swap the coin icon for the same `bee-logo.png` (small, with a soft glow), so the wallet uses our bee.

### 3. Drawer Marketplace cleanup
- In `src/components/DrawerMenu.tsx`:
  - Remove the `price` prop / `$` price chip on every agent card (both unlocked and "Soon" variants keep only the lock chip).
  - Remove the descriptive "from $50 / $20/mo / $25/mo" suffixes in `agentCards` (keep clean role descriptions like "Leads Generator", "Product Model Shoot AI", "WhatsApp Automation").
  - Add a small press/scale animation on each card (`active:scale-95 transition-transform`) and a subtle hover glow ring.

### 4. Login gate for Bee AI
- Wrap `src/pages/Index.tsx` so unauthenticated users are redirected to `/login?redirect=/bee-ai` (using `useAuth`). Show a brief loading state while session resolves.

### 5. Chat history (titles + storage)
- New table `chat_sessions` (user_id, title, created_at, updated_at) and `chat_messages` (session_id, role, content, created_at) with RLS = own rows.
- In `ChatCanvas`, on first user message create a session, derive title from first 6 words, persist every message. Add a "My Visions" / "Chats" list in the drawer that reads recent sessions and lets the user reopen one (loads messages into the canvas).
- Replace the static `visionHistory` array in `DrawerMenu` with live data from `chat_sessions`.

### 6. Visual upgrade: Bee AI, Community, Profile pages
Match the Home page aesthetic: deep space gradient background, glassmorphism panels, gold/cyan glow accents, `font-heading` gradient titles, framer-style fade-in.
- Add a shared `<SpaceBackground />` (already exists) + ambient radial gradients to:
  - `src/pages/Index.tsx` (Bee AI shell)
  - `src/pages/StudyBee.tsx` (Planet Bee Community)
  - `src/pages/Profile.tsx`
- Convert plain cards/sections to `glass-strong glass-highlight rounded-2xl` with bee-gold accent borders and `shadow-[0_0_40px_-10px_hsl(45_100%_55%/0.4)]`.
- Add `animate-fade-in` on sections; gradient text on H1s.

### Technical notes
- DB migration runs first (separate approval), then code edits.
- No payment/business logic changes — Bee Coins logic stays as-is.
- Routes unchanged; only labels, visuals, auth gate, and chat persistence added.
- Files touched: `TopBar.tsx`, `BeeCoinBadge.tsx`, `DrawerMenu.tsx`, `ChatCanvas.tsx`, `pages/Index.tsx`, `pages/StudyBee.tsx`, `pages/Profile.tsx`. New migration for `chat_sessions` + `chat_messages`.
