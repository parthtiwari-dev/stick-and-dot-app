# Full Refactor Plan — Stick & Dot App

---

## THEME SYSTEM (Global)

**Current state:** Dark pages (`bg-[#0d0d0d]`) used on explore, portfolio pages. Light pages (`bg-[#F4F4F4]`) used on dashboards.

**New rule:** Everything moves to a clean **light theme** — white / off-white backgrounds, black text, black accents. The dark mesh-card carousel style is replaced with a light equivalent on all explore and portfolio pages. Only the article page stays as-is (already white).

**Design tokens to use consistently:**
- Page bg: `bg-white` or `bg-[#F4F4F4]`
- Cards: `bg-white border border-gray-100 rounded-2xl`
- Accent / active: `bg-[#111] text-white`
- Muted text: `text-gray-400`
- Tags / pills: `bg-gray-100 text-gray-600 rounded-full`

---

## 1. WRITER DASHBOARD — `app/dashboard/writer/page.tsx`

### Remove
- Entire top-right header control block:
  ```
  Today | Select Date ▼ Filter | Search
  ```
  Keep only the `Welcome, {userName}` heading and subtitle.

### Rename
- `📊 Trends` panel → rename label to **"Traffic"** (both the panel heading and the `<p>` text)
- Remove the `-5.23%` badge that sits next to "Trends" in the header of that panel (or keep it if it makes sense contextually as a traffic metric — your call)

### "Your Top Articles" → Article-specific Traffic
- Each article row in "Your Top Articles" becomes **clickable**
- Clicking an article highlights it and updates the Traffic chart on the right to show that specific article's traffic data (simulated with different SVG path data per article)
- Add a small selected-article label above the Traffic chart: e.g. *"Traffic for: Article Name"*
- Add `useState` for `selectedArticle`, default to first article
- Traffic chart data: define a `TRAFFIC_DATA` map with one SVG path per article

### No other changes to this page.

---

## 2. WRITER CREATE PAGE — `app/dashboard/writer/create/page.tsx`

### Goal
Make the create page look and feel like reading the article at `/articles/[slug]` — clean, editorial, distraction-free. No engagement while writing. Engagement only shows post-publish when the writer visits their own article.

### Remove
- Hero image section (the placeholder gradient box)
- Engagement block from the black panel (the right-side `2.4K` views, sparkline, "contributions" text)

### Restructure layout to match article page

**Top section (editorial header):**
```
[Title — large editable contentEditable]
[Author · Date · X min read]
[#tag1 #tag2 #tag3 — rendered from tags state]
```

**Black panel below header** (keep dark box, restructure contents):
```
Left column:
  Suggested Keywords
  #technology #tech #Career   ← clickable to add to tags
  
  Writing Tools
  Readability · Grammar · AI · Plagiarism · WPS · SPP · RW ·

Right column: (empty / removed — no engagement here)
```

**Body area:**
- Same `contentEditable` rich text area as now
- Floating selection toolbar stays

**Sticky bottom bar (keep as-is):**
- Word count, tags, commission selector, Publish button

### Writing Tools in panel
The Writing Tools row already exists in `ArticlePage` for writer role. Copy that pattern here — use the same `WRITER_TOOLS` array and `activeTool` state so clicking a tool shows its description below.

### Post-publish Engagement
- The `isWriter` check in `app/articles/[slug]/page.tsx` already gates the Writing Tools vs Quality tools. The engagement block on the right side of the black panel should remain on the article view page for writers.
- No change needed to `articles/[slug]/page.tsx` — the engagement block is already there, already writer-gated.

---

## 3. WRITER PROFILE — `app/dashboard/writer/profile/page.tsx`

### Remove
- From the stats row inside the profile card:
  ```
  Articles | Followers | Avg Rating
  ```
  Change to:
  ```
  Articles | Avg Rating | Words Written
  ```
  (remove "Followers" stat entirely)
- No "Follow" or "Followers" buttons anywhere on this page (none exist currently, just the stat — remove the stat)

---

## 4. WRITER PORTFOLIO — `app/dashboard/writer/portfolio/page.tsx`

### Theme change: Dark → Light

**Current:** `bg-[#0d0d0d]`, white text, mesh cards with dark backgrounds, white search bar.

**New:** Full light theme using the same carousel structure but restyled:

- Page bg: `bg-white`
- Header text: `text-gray-900` / `text-gray-500`
- Search bar: white bg, gray border (same as dashboard search)
- Tag pills: `bg-gray-100 text-gray-600` (active: `bg-[#111] text-white`)
- Carousel arrows: `bg-gray-100 hover:bg-gray-200 border border-gray-200`, icon `text-gray-600`
- MeshCards: Replace dark mesh cards with **light article cards** — white bg, subtle shadow, border, black tag pill, article title in dark text, author in gray
  - Card size lg: `h-[280px]` white card with a subtle `bg-gradient-to-br from-gray-50 to-gray-100` background instead of colored mesh blobs
  - Keep the same carousel UX (prev/next arrows, dots pagination, side ghost cards)
- Dot pagination: active `bg-[#111]`, inactive `bg-gray-200`
- "Read Article" button: `bg-[#111] text-white`

---

## 5. WRITER EXPLORE — `app/dashboard/writer/explore/page.tsx`

### Theme change: Dark → Light (same pattern as portfolio)

- Page bg: `bg-white`
- Header "Explore" / "Open Commissions" text: `text-gray-900`
- Subtext: `text-gray-500`
- Tab toggle: white bg, gray border, active tab `bg-[#111] text-white`
- Search bar: light, gray border
- Tag pills: light, active = `bg-[#111] text-white`
- Carousel arrows: light
- MeshCards: Replace with light article cards (same approach as Portfolio above)
- Dots: active `bg-[#111]`, inactive `bg-gray-200`
- Commission cards: same light treatment — white card, black text, border

---

## 6. READER DASHBOARD — `app/dashboard/reader/page.tsx`

### Remove
- Entire top-right header control block:
  ```
  Today | Select Date ▼ Filter | Search
  ```
  Keep only `Welcome, {userName}` heading and subtitle.

### No other changes.

---

## 7. READER PROFILE — `app/dashboard/reader/profile/page.tsx`

### Remove
- From stats row in profile card:
  ```
  Articles Read | Lists | Following
  ```
  Change to:
  ```
  Articles Read | Lists | Streak
  ```
  (remove "Following" stat)
- **"Following Authors"** section at bottom of right panel: Remove entirely (the whole `<div>` with `FAVOURITE_AUTHORS` map)

---

## 8. SUBJECT EXPERT DASHBOARD — `app/dashboard/subject-expert/page.tsx`

### Remove
- Same top-right header control block as writer/reader:
  ```
  Today | Select Date ▼ Filter | Search
  ```

---

## 9. SUBJECT EXPERT EXPLORE — `app/dashboard/subject-expert/explore/page.tsx`

### Remove domain filter tabs
- Remove the `DOMAINS` array row:
  ```
  All Technology Finance Medical Science Law Business Education
  ```
  These are redundant — SME should only see articles in their certified domain. The tab filter makes no sense if they can't see other domains anyway.
- Keep the **search bar** (useful within their domain)
- Keep the Published / Pending Review stats bar
- Keep the article feed cards — but **filter feed at data level** to only show articles matching the SME's domain (hardcode for now, wire to real domain cert later)

### Theme change: Dark → Light
- Page bg: `bg-white` (currently `bg-[#0d0d0d]`)
- All text: dark on light
- Search bar: light style
- Article cards: white bg, black/gray text, subtle border
- "Start Review" / "Published" badges stay functionally the same, just adapt colors to light theme
- Stats bar dots: green/orange stays, text `text-gray-500`

---

## 10. SUBJECT EXPERT PROFILE — `app/dashboard/subject-expert/profile/page.tsx`

### Remove
- **"Domain of Expertise"** section:
  ```
  AllTechnologyFinanceMedicalScienceLawBusinessEducation
  ```
  Remove this entire filter/display block from the profile page.

---

## 11. SUBJECT EXPERT PORTFOLIO — `app/dashboard/subject-expert/portfolio/page.tsx`

### Theme change: Dark → Light
- Same treatment as Writer Portfolio (light cards, white bg, black accents)

---

## 12. BUSINESS DASHBOARD — `app/dashboard/business/page.tsx`

### Remove
- Same top-right header control block:
  ```
  Today | Select Date ▼ Filter | Search
  ```

---

## 13. EXPLORE PAGE (PUBLIC) — `app/explore/page.tsx`

### Theme change: Dark → Light
- Apply the same light theme as writer explore above
- Keep the same layout/UX

---

## 14. ARTICLE PAGE — `app/articles/[slug]/page.tsx`

### The core problem with the current page
The black panel (keywords + tools + engagement) currently renders for **every role**. That's wrong. It was designed for writers but has leaked to everyone. There is also no distinction between a writer reading their own article vs someone else's — both currently get `isWriter = true` and see the full panel.

---

### Routing decision: Keep one URL, use `?own=1` query param

**No new routes are needed.** `/articles/[slug]` stays as the single canonical article URL.

The distinction of "writer viewing own article" is signalled by a query param: `?own=1`

- Writer's portfolio links → `/articles/a1?own=1`
- Writer's dashboard Top Articles links → `/articles/a1?own=1`
- SME explore "Start Review" links → `/articles/ART-001` (no param — role detected from stored role)
- Reader explore, everywhere else → `/articles/a1` (no param — clean reading)

This is the minimal change that solves the ownership problem without creating new routes.

---

### Role × Context matrix — what each user sees

| Who | Panel shown? | Panel contents |
|---|---|---|
| Writer — own article (`role=writer` + `?own=1`) | Yes | Engagement stats (right) + Writing Tools + Keywords (left) |
| Writer — someone else's article (`role=writer`, no `?own=1`) | No | Clean reading only |
| Reader | No | Clean reading only |
| SME | Yes (review panel) | Quality assessment tools only — no engagement stats |
| Client / Business | No | Clean reading only |

---

### Changes to make in `app/articles/[slug]/page.tsx`

**1. Detect ownership via query param**
```tsx
import { useSearchParams } from "next/navigation";
const searchParams = useSearchParams();
const isOwnArticle = searchParams.get("own") === "1";
const isSME = role === "subject-expert";
const showPanel = (role === "writer" && isOwnArticle) || isSME;
```

**2. Wrap the entire black panel in `{showPanel && (...)}` — not always rendered**

**3. Inside the panel, split writer-owner vs SME**
```tsx
{role === "writer" && isOwnArticle
  ? /* Full panel: Keywords + Writing Tools (left) + Engagement (right) */
  : isSME
  ? /* SME review panel: quality tools left only, no engagement right */
  : null}
```

**4. SME panel** — replace static quality keyword chips with interactive review tools. Left column only, no right-side engagement:
```
"Review Assessment"
[ Clarity ] [ Depth ] [ Accuracy ] [ Relevance ] [ Sources ] [ Balance ] [ Insight ]
  ← clickable/rateable pills, not just decorative labels
Submit Review → button
```

**5. Hero image stays** on the article view page (only removed from create page).

**6. Comments section** — visible to all roles, no changes.

---

### Linking pages that need `?own=1` added

| File | Change |
|---|---|
| `app/dashboard/writer/portfolio/page.tsx` | `/articles/${id}` → `/articles/${id}?own=1` |
| `app/dashboard/writer/page.tsx` (Top Articles rows) | Add `?own=1` to article hrefs |
| `app/dashboard/subject-expert/explore/page.tsx` | No change — stays `/articles/${id}` |
| All reader/public links | No change — stays `/articles/${id}` |

---

## IMPLEMENTATION ORDER (Recommended)

1. **Global theme tokens** — finalize color values (10 min)
2. **Dashboard header cleanup** — remove date/filter/search from all 4 role dashboards (30 min)
3. **Article page** — `?own=1` ownership detection, role×context panel logic, SME review panel (60 min)
4. **Writer portfolio + dashboard** — add `?own=1` to outgoing article links (10 min)
5. **Writer dashboard** — rename Trends→Traffic, article-click traffic interaction (45 min)
6. **Writer create** — restructure to match article layout, remove hero image, engagement only post-publish (60 min)
7. **Writer profile** — remove followers stat (10 min)
8. **Reader profile** — remove following stat + following authors section (15 min)
9. **SME profile** — remove domain of expertise section (10 min)
10. **SME explore** — remove domain tabs, light theme (45 min)
11. **Portfolio pages** (writer + SME) — light theme carousel (60 min)
12. **Explore pages** (writer + public) — light theme carousel (45 min)
13. **Business dashboard** — already covered in step 2

---

## FILES TO TOUCH (Complete List)

| File | Changes |
|---|---|
| `app/articles/[slug]/page.tsx` | `?own=1` ownership detection; role×context panel gating; SME review panel; remove `isWriter` simple gate |
| `app/dashboard/writer/page.tsx` | Remove date/filter/search; rename Trends→Traffic; article rows clickable with `?own=1` links |
| `app/dashboard/writer/create/page.tsx` | Editorial header layout; remove hero image; remove engagement from panel; writing tools in panel |
| `app/dashboard/writer/profile/page.tsx` | Remove Followers stat |
| `app/dashboard/writer/portfolio/page.tsx` | Full light theme; add `?own=1` to all article links |
| `app/dashboard/writer/explore/page.tsx` | Full light theme |
| `app/dashboard/reader/page.tsx` | Remove date/filter/search |
| `app/dashboard/reader/profile/page.tsx` | Remove Following stat; remove Following Authors section |
| `app/dashboard/subject-expert/page.tsx` | Remove date/filter/search |
| `app/dashboard/subject-expert/explore/page.tsx` | Remove domain tabs; light theme |
| `app/dashboard/subject-expert/profile/page.tsx` | Remove Domain of Expertise section |
| `app/dashboard/subject-expert/portfolio/page.tsx` | Full light theme |
| `app/dashboard/business/page.tsx` | Remove date/filter/search |
| `app/explore/page.tsx` | Full light theme |
| `components/ui/MeshCard.tsx` | Add light variant prop (or create `LightCard` component) |

---

## WHAT IS NOT CHANGING

- Sidebar nav (AppSidebar / AppLayout) — untouched
- Auth flow (login/signup/otp) — untouched
- Business commission, writers, settings pages — untouched
- Reader reading-list, settings — untouched
- URL structure — untouched (only query params added, no new routes)
- All backend/API wiring points — untouched (pre-backend refactor)
