---
name: design-system-generation
description: Generate complete design token systems from brand inputs. Use when a project needs a design system, color palette, typography scale, spacing scale, or component token inventory.
---

# Design System Generation

Generate a production-ready design token set from brand inputs. Outputs structured JSON tokens and a human-readable Markdown summary with contrast validation.

---

## Input Requirements

| Parameter | Type | Required | Description |
|---|---|---|---|
| `brandColors` | `string[]` | Yes | 1–5 hex colors representing the brand |
| `typography` | `object` | No | Font family preferences (`sans`, `mono`, `display`) |
| `platform` | `string` | No | Target: `web` (default), `ios`, `android`, `cross-platform` |
| `mode` | `string` | No | `light` (default), `dark`, or `both` |
| `existingTokens` | `object` | No | Existing token set to extend rather than replace |

### Example Input

```json
{
  "brandColors": ["#1a1a2e", "#16213e", "#0f3460", "#e94560"],
  "typography": {
    "sans": "Inter",
    "mono": "JetBrains Mono"
  },
  "platform": "web",
  "mode": "both"
}
```

---

## Process

### Step 1: Analyze Brand Inputs

1. Parse provided brand colors into HSL for manipulation
2. Determine color roles: which input is primary, secondary, accent, neutral base
3. If fewer than 3 colors provided, derive complementary/analogous colors
4. Identify the brand's visual temperature (warm, cool, neutral)

### Step 2: Generate Color Palettes

For each brand color, generate a 10-stop palette (50–900):

```
50  → very light tint (background use)
100 → light tint
200 → lighter shade
300 → light mid-tone
400 → mid-tone
500 → base color (closest to input)
600 → slightly darker
700 → dark shade
800 → darker shade
900 → very dark shade (text use)
```

Additionally generate:
- **Neutral palette**: Derived from the primary hue with very low saturation (10 stops)
- **Semantic colors**: Success (green), Warning (amber), Error (red), Info (blue) — chosen to harmonize with the brand palette
- **Surface tokens**: Background, foreground, muted, card, popover — referencing palette values

### Step 3: Generate Typography Scale

Based on platform and typography input:

```json
{
  "fontFamily": {
    "sans": "{input.sans}, system-ui, -apple-system, sans-serif",
    "mono": "{input.mono}, Fira Code, ui-monospace, monospace"
  },
  "fontSize": {
    "xs":   { "size": "0.75rem",  "lineHeight": "1rem" },
    "sm":   { "size": "0.875rem", "lineHeight": "1.25rem" },
    "base": { "size": "1rem",     "lineHeight": "1.5rem" },
    "lg":   { "size": "1.125rem", "lineHeight": "1.75rem" },
    "xl":   { "size": "1.25rem",  "lineHeight": "1.75rem" },
    "2xl":  { "size": "1.5rem",   "lineHeight": "2rem" },
    "3xl":  { "size": "1.875rem", "lineHeight": "2.25rem" },
    "4xl":  { "size": "2.25rem",  "lineHeight": "2.5rem" },
    "5xl":  { "size": "3rem",     "lineHeight": "1" }
  },
  "fontWeight": {
    "normal": 400,
    "medium": 500,
    "semibold": 600,
    "bold": 700
  }
}
```

### Step 4: Generate Spacing, Shadows, Borders, Breakpoints

Use the canonical structures defined in `.cursor/rules/design-standards.mdc`.

### Step 5: Validate Contrast Ratios

For every foreground/background pairing in the token set:

1. Compute WCAG relative luminance for both colors
2. Compute contrast ratio: `(L1 + 0.05) / (L2 + 0.05)`
3. Check against thresholds:
   - Normal text: ≥ 4.5:1 (AA)
   - Large text (≥ 18pt or 14pt bold): ≥ 3:1 (AA)
   - UI components & graphical objects: ≥ 3:1 (AA)
4. Flag failures with suggested alternatives

### Step 6: Produce Component Inventory

List recommended components and which tokens they reference:

```markdown
## Component Inventory

| Component | Primary Tokens | Notes |
|---|---|---|
| Button | color.primary, typography.base, spacing.3, borderRadius.md | Primary, secondary, ghost variants |
| Input | color.neutral, typography.base, spacing.2, borderRadius.md | Include focus ring using color.primary.500 |
| Card | color.surface.card, shadow.md, borderRadius.lg, spacing.6 | Elevation via shadow tokens |
| Badge | color.semantic.*, typography.xs, spacing.1, borderRadius.full | Status indicators |
| ... | ... | ... |
```

---

## Output Format

### JSON Output

```json
{
  "meta": {
    "generatedBy": "ux-pilot/design-system",
    "version": "1.0.0",
    "platform": "web",
    "mode": "light",
    "brandInputs": ["#1a1a2e", "#16213e", "#0f3460", "#e94560"]
  },
  "tokens": {
    "color": { "...full palette..." },
    "typography": { "...full type scale..." },
    "spacing": { "...spacing scale..." },
    "breakpoints": { "...breakpoint values..." },
    "shadow": { "...shadow values..." },
    "borderRadius": { "...radius values..." }
  },
  "contrastReport": [
    { "foreground": "#1a1a2e", "background": "#ffffff", "ratio": 16.75, "passes": "AA,AAA" },
    { "foreground": "#e94560", "background": "#ffffff", "ratio": 4.63, "passes": "AA" }
  ],
  "componentInventory": [ "..." ]
}
```

### Markdown Output

Human-readable summary including:
- Color swatches with hex values and contrast ratios
- Typography specimens
- Spacing scale visualization
- Component inventory table
- Any contrast violations with recommended fixes

---

## Quality Checks

Before returning output, verify:

- [ ] Every foreground/background pair meets WCAG 2.2 AA contrast
- [ ] Palette has consistent perceptual lightness steps
- [ ] Semantic colors are distinguishable from each other (not just by hue — consider colorblind users)
- [ ] Typography scale has consistent ratio between steps
- [ ] Spacing scale follows a coherent progression (typically 4px base unit)
- [ ] All tokens use platform-appropriate units (rem for web, pt for iOS, dp for Android)
- [ ] Dark mode tokens (if requested) maintain the same contrast ratios as light mode

---

Author: Charley Scholz, ELEV8
Co-authored: Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-23
