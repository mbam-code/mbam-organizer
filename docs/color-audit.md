# Color System Audit

**Date:** 2025-11-15
**Status:** Initial audit before Porsche Motorsport redesign

---

## Executive Summary

The app currently uses a **partial color system** with hardcoded values scattered across `globals.css` and component styles. There are **multiple potential sources of Chrome vs Comet discrepancy**, including:

1. **Hardcoded body colors** in `globals.css` that don't use CSS variables
2. **No Tailwind theme configuration** for semantic color tokens
3. **Blue icons in theme toggle** (line 33 of `theme-toggle.tsx`) that clash with Porsche red/black scheme
4. **`next-themes` configured with `class` attribute** but CSS may also respond to `prefers-color-scheme`, causing conflicts
5. **No explicit `color-scheme` CSS property** in root or dark mode selector

---

## Current Color Definitions

### 1. **globals.css** (app/globals.css)

**Light Mode (lines 11–19):**
```css
body {
  background-color: #f9fafb;  /* Very light grey */
  color: #1f2937;              /* Dark grey */
}
```

**Dark Mode (lines 21–24):**
```css
html.dark body {
  background-color: #111827;  /* Very dark grey/black */
  color: #f3f4f6;              /* Very light grey */
}
```

**Issues:**
- Colors are **hardcoded**, not using CSS variables
- No semantic tokens for `--primary`, `--accent`, `--border`, etc.
- `html.dark` selector assumes `next-themes` sets the `dark` class on `<html>`
- No override of Tailwind's default blue palette

### 2. **tailwind.config.ts**

**Current State (lines 8–10):**
```ts
theme: {
  extend: {},
}
```

**Issues:**
- **Empty theme extension** — relying entirely on Tailwind defaults
- Tailwind defaults include blue colors (`blue-600`, `blue-500`, etc.)
- No integration with any CSS variable system
- No definition of `primary`, `secondary`, `accent`, `destructive` tokens

### 3. **Theme Toggle** (components/theme-toggle.tsx)

**Problematic Lines:**
```tsx
// Line 31: Sun icon in dark mode
<Sun className="h-4 w-4 text-yellow-500 transition-transform hover:rotate-90" />

// Line 33: Moon icon in light mode — USES BLUE!
<Moon className="h-4 w-4 text-blue-600 transition-transform hover:rotate-90" />
```

**Issues:**
- Moon icon is **hardcoded to `text-blue-600`**, which stands out in a Porsche red/black scheme
- Should use a Porsche gold or grey instead

### 4. **Providers & Theme Context** (components/providers.tsx)

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
```

**Issues:**
- Sets the `dark` class on `<html>` when theme is dark
- Respects `prefers-color-scheme` via `enableSystem`
- **Potential conflict**: if both `next-themes` class AND `prefers-color-scheme` are evaluated, some browsers may prioritize one over the other
- Comet browser might interpret `prefers-color-scheme` differently

---

## Hardcoded Colors Found

### Hex Colors Not Using Variables:
| Location | Color | Hex | Context |
|----------|-------|-----|---------|
| `globals.css:12` | Light bg | `#f9fafb` | Body background (light) |
| `globals.css:13` | Dark text | `#1f2937` | Body text (light) |
| `globals.css:22` | Dark bg | `#111827` | Body background (dark) |
| `globals.css:23` | Light text | `#f3f4f6` | Body text (dark) |
| `theme-toggle.tsx:33` | Blue | `text-blue-600` | Moon icon (CONFLICT!) |

### Potentially Problematic Tailwind Defaults:
- `border-gray-200` (default Tailwind grey)
- `bg-gray-50`, `bg-gray-100` (various greys)
- `text-gray-500`, `text-gray-600` (various text greys)
- `hover:border-gray-300` (hover states)
- Any `blue-*` classes (Tailwind defaults, not in Porsche scheme)

---

## CSS Variables Currently Used

**Status:** ❌ None found in globals.css or tailwind.config.ts

The app does **not currently define CSS variables** for colors. This means:
- No `:root { --primary: ... }` block
- No dark mode overrides with CSS variables
- Tailwind is using its built-in defaults

---

## Browser Differences Hypothesis

### Why Chrome works as expected (red/black):
- Chrome may prioritize `next-themes` class injection over `prefers-color-scheme`
- Or, Chrome defaults to `prefers-color-scheme: light` even when it shouldn't

### Why Comet shows blue:
- Comet browser might:
  - Prioritize `prefers-color-scheme: light` override (showing light theme colors)
  - Have different handling of Tailwind's default blue palette
  - Cache theme differently
  - Not respect the `dark` class as reliably as Chrome

### Root Causes:
1. **No explicit color-scheme CSS property** to disambiguate
2. **next-themes might not fully suppress prefers-color-scheme** in some browsers
3. **Tailwind defaults are blue** — if theme logic fails, users see blue
4. **No override of shadcn/ui's default theme colors**

---

## Semantic Color Tokens Needed

For a Porsche Motorsport design system, we need:

```
Light Mode:
  --background: #F5F5F5 (light card)
  --foreground: #000000 (black text)
  --card: #FFFFFF (white cards)
  --card-foreground: #1B1B1B (dark text on cards)
  --primary: #B12B28 (Porsche red)
  --primary-foreground: #FFFFFF (white text on red)
  --secondary: #464C47 (medium grey)
  --secondary-foreground: #FFFFFF (light text)
  --accent: #F7E731 (Porsche yellow)
  --accent-foreground: #000000 (black text on yellow)
  --border: #C8C8C8 (light grey)
  --input: #F5F5F5 (light grey for inputs)
  --muted: #464C47 (muted grey)
  --muted-foreground: #F5F5F5 (light text)
  --destructive: #D5001C (bright red for errors)
  --destructive-foreground: #FFFFFF (white text)

Dark Mode:
  --background: #121212 (near black)
  --foreground: #FFFFFF (white text)
  --card: #1B1B1B (dark card)
  --card-foreground: #F5F5F5 (light text)
  --primary: #B12B28 (same red)
  --primary-foreground: #FFFFFF (white text)
  --secondary: #232323 (dark grey)
  --secondary-foreground: #F5F5F5 (light text)
  --accent: #EBD698 (gold accent)
  --accent-foreground: #000000 (black text)
  --border: #464C47 (medium grey)
  --input: #232323 (dark input)
  --muted: #464C47 (muted grey)
  --muted-foreground: #C8C8C8 (light grey text)
  --destructive: #D5001C (bright red)
  --destructive-foreground: #FFFFFF (white text)
```

---

## Recommended Actions

### Immediate (Step 1):
- ✅ Document current state (this audit)
- Create `lib/porsche-colors.ts` with all color constants
- Create `lib/porsche-theme.css` or update `globals.css` with CSS variables

### Short-term (Step 2):
- Update `tailwind.config.ts` to use CSS variables
- Override theme toggle icon color (blue → gold/grey)
- Add `color-scheme` property to `:root` and `.dark`

### Medium-term (Step 3):
- Audit all components for hardcoded Tailwind colors
- Replace `text-blue-*`, `bg-gray-*` etc. with Porsche tokens
- Create debug component to inspect active colors in both browsers

---

## Files to Modify

1. `lib/porsche-colors.ts` — **New file** for color constants
2. `app/globals.css` — Add CSS variables, fix dark mode
3. `tailwind.config.ts` — Wire CSS variables into theme
4. `components/theme-toggle.tsx` — Fix blue moon icon
5. `components/providers.tsx` — Consider adding explicit theme behavior
6. `docs/color-audit.md` — This file; update as we progress

---

## Testing Plan

### In Chrome (baseline):
- [ ] Light mode: red/black/grey, no blues
- [ ] Dark mode: red/black/grey, no blues
- [ ] Theme toggle works
- [ ] Colors transition smoothly

### In Comet (verify fix):
- [ ] Light mode: red/black/grey (NOT blue)
- [ ] Dark mode: red/black/grey (NOT blue)
- [ ] Theme toggle works identically to Chrome
- [ ] Colors consistent

### Debug Tools:
- [ ] CSS Inspector component shows active CSS variables
- [ ] Browser DevTools can inspect `<html>` class and `:root` styles
