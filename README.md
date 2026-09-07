# The Tree Planner — Calm Minimalist Daily Planner

A tranquil, cross-platform mobile planner for **iOS** and **Android**, crafted with a core philosophy of **calm minimalism**. The interface is designed to feel like **exhaling**, not like a productivity dashboard.

Built as a **one-time purchase** with a sustainable, offline-first local architecture, zero recurring subscriptions, zero ads, and zero server surveillance.

---

## Differentiator: Anti-Dopamine Botanical Mechanics

Unlike gamified apps like *Forest* or *Finch*:
1. **The Tree Updates Once Per Day at Day's End**: Completing a task does **not** trigger instant dopamine loops, leaf sprouting, or confetti. The plant drinks in the day’s care quietly while you rest. The app never feels like a slot machine you compulsively check.
2. **Plant, Not a Pet**: No characters, no facial expressions, no dialogue, and no cuteness manipulation. It is purely an organic botanical organism responding to your natural rhythm.
3. **Weekly Mirror**: The tree reflects the week’s balance, not a game you are pressured to actively feed.
4. **Gentle Recovery**: If a day is missed, the tree enters a **Gentle Wilt / Seasonal Rest** (~14° soft leaf droop in warm golden ochre and soft olive—never dead bare branches or alarming red error badges). It recovers completely upon the next active day.

---

## Visual & UX Direction

- **Soft Muted Palette**: Morning Parchment (`#F7F5F0`), Botanical Sage (`#5A735E`), Warm Clay (`#A87C64`), Resting Ochre (`#B89C68`), and Night Forest (`#151A16`).
- **Warm Editorial Typography**: Humanist serif (*Newsreader* / *Fraunces*) paired with clean sans (*Plus Jakarta Sans* / *Inter*).
- **Platform-Respectful UX**:
  - **iOS 18**: Dynamic Island safe spacing, liquid bottom sheets, spring physics (`cubic-bezier(0.32, 0.72, 0, 1)`), and frosted glass blur navigation.
  - **Android M3**: Material 3 floating pill navigation bar, tonal surface container shifts, and center punch-hole alignment.
- **One-Gesture Add**: Downward pull-gesture on the home screen or a single tap on the whisper bar to add a task with minimal taps.

---

## The 5 Botanical Tree States

1. **Quiet Sprout (Seedling)**: Tender dual-leaf shoot grounded in warm earth mound. Represents fresh beginnings.
2. **Young Sapling**: Slender curved trunk with 4 tender sage leaves reaching upward.
3. **Balanced Canopy (Foliage)**: Harmonious branching tree with 10–12 leaves swaying gently in the slow breeze.
4. **Flourishing Tree**: Full, layered canopy with deep foliage, grounded roots, and subtle jasmine florets.
5. **Seasonal Rest (Gentle Wilt)**: Soft, relaxed ~14° droop with warm autumnal amber-olive tones. Completely guilt-free and recovers on the next active day.

---

## Core Features

### 1. Tasks & Daily Habit Tracking
- Simple, unpressured checkmark completion.
- Recurring daily habits tracked with 7 soft stone pebbles.
- **Zero streak-shaming copy**: Taking time away is respected.
- **No-Pressure Mode**: One-tap toggle that conceals all percentages, numbers, and streaks app-wide.

### 2. Home Screen Botanical Tree
- Glanceable weekly fullness—no numbers cluttering the screen.
- Tapping the tree opens the **Organic Wisdom Sheet** for reflective details.
- Daily twilight reflection engine to witness tomorrow’s morning posture.

### 3. Encrypted Daily Journal
- Daily free-write sanctuary with calm typography and debounced auto-save.
- Calendar browser to revisit past thoughts.
- **Local Passcode Lock**: 4-digit PIN verified via SHA-256 Web Crypto hashing on-device.

---

## Data & Sustainability
- **100% Local-First**: IndexedDB & SQLite on device. $0 monthly cloud hosting cost.
- **Manual Backup**: One-click JSON backup export and restore.
- **No Subscriptions, No Ads, No IAPs**: True one-time purchase.

---

## Quick Start & Build

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle (PWA + Mobile)
npm run build

# 4. Sync native Android project (Capacitor)
npx cap sync android
```

---

## License
MIT License. Created for mindful living.
