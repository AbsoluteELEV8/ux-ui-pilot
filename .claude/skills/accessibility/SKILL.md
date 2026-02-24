---
name: accessibility-auditing
description: Audit components and pages for WCAG 2.2 AA compliance. Use when reviewing component code, page markup, design specs, or when the user asks about accessibility, a11y, or WCAG compliance.
---

# Accessibility Auditing

Perform structured WCAG 2.2 AA compliance audits on components, pages, or design specifications. Produces a severity-ranked report with specific fix guidance.

---

## WCAG 2.2 AA Checklist

### Perceivable

| ID | Criterion | What to Check |
|---|---|---|
| 1.1.1 | Non-text Content | Images have `alt`, decorative images have `alt=""`, complex images have long descriptions |
| 1.2.1 | Audio-only / Video-only | Transcripts or audio descriptions provided |
| 1.3.1 | Info and Relationships | Semantic HTML used (headings, lists, tables, landmarks) |
| 1.3.2 | Meaningful Sequence | DOM order matches visual order |
| 1.3.3 | Sensory Characteristics | Instructions don't rely solely on shape, color, size, or position |
| 1.4.1 | Use of Color | Color is not the only way to convey information |
| 1.4.3 | Contrast (Minimum) | Text: ≥ 4.5:1 normal, ≥ 3:1 large |
| 1.4.4 | Resize Text | Text scales to 200% without loss of content |
| 1.4.5 | Images of Text | Real text used instead of images of text |
| 1.4.10 | Reflow | No horizontal scroll at 320px viewport width |
| 1.4.11 | Non-text Contrast | UI components and graphics: ≥ 3:1 contrast |
| 1.4.12 | Text Spacing | Content works with user-adjusted line-height, letter-spacing |
| 1.4.13 | Content on Hover or Focus | Dismissible, hoverable, persistent |

### Operable

| ID | Criterion | What to Check |
|---|---|---|
| 2.1.1 | Keyboard | All functionality available via keyboard |
| 2.1.2 | No Keyboard Trap | Focus can always be moved away |
| 2.4.1 | Bypass Blocks | Skip navigation links or landmarks |
| 2.4.2 | Page Titled | Descriptive `<title>` |
| 2.4.3 | Focus Order | Logical tab sequence |
| 2.4.4 | Link Purpose | Link text is descriptive (no "click here") |
| 2.4.7 | Focus Visible | Focus indicator always visible |
| 2.4.11 | Focus Not Obscured (Minimum) | Focus indicator not hidden by other content |
| 2.5.3 | Label in Name | Visible label matches accessible name |
| 2.5.8 | Target Size (Minimum) | ≥ 24×24 CSS pixels |

### Understandable

| ID | Criterion | What to Check |
|---|---|---|
| 3.1.1 | Language of Page | `lang` attribute on `<html>` |
| 3.2.1 | On Focus | No unexpected context changes on focus |
| 3.2.2 | On Input | No unexpected context changes on input |
| 3.3.1 | Error Identification | Errors are identified and described in text |
| 3.3.2 | Labels or Instructions | Form inputs have visible labels |
| 3.3.3 | Error Suggestion | Suggestions provided when errors detected |
| 3.3.7 | Redundant Entry | Don't ask for same info twice in a session |
| 3.3.8 | Accessible Authentication | No cognitive function tests (CAPTCHAs have alternatives) |

### Robust

| ID | Criterion | What to Check |
|---|---|---|
| 4.1.2 | Name, Role, Value | Custom controls have proper ARIA |
| 4.1.3 | Status Messages | Dynamic content uses `role="status"` or live regions |

---

## Severity Levels

| Level | Label | Definition | Action |
|---|---|---|---|
| **Critical** | 🔴 CRITICAL | Blocks entire user groups from completing tasks (keyboard traps, missing alt text on functional images, zero-contrast text) | Must fix immediately |
| **Major** | 🟡 MAJOR | Causes significant difficulty for some users (poor contrast, missing labels, no focus indicators) | Fix before release |
| **Minor** | 🟢 MINOR | Causes inconvenience but workarounds exist (redundant ARIA, suboptimal heading order, touch target slightly small) | Fix when possible |

### Severity Assignment Rules

- **Missing keyboard access** to any interactive element → Critical
- **Contrast ratio failure** on body text → Major; on decorative text → Minor
- **Missing `alt` text** on functional image → Critical; on decorative → Minor
- **Missing form labels** → Major (Critical if no programmatic association at all)
- **Focus indicator missing** → Major
- **Wrong heading hierarchy** → Minor (unless it breaks screen reader navigation → Major)

---

## Audit Process

### Step 1: Identify Scope

Determine what is being audited:
- Single component (e.g., a form input)
- Component composition (e.g., a login form)
- Full page
- Design specification (pre-implementation)

### Step 2: Analyze Markup/Code

For each element, check:

1. **Semantic HTML** — Is the correct element used? (`<button>` not `<div onClick>`, `<nav>` not `<div class="nav">`)
2. **ARIA usage** — Is ARIA needed? (First rule of ARIA: don't use ARIA if native HTML works.) If used, is it correct?
3. **Keyboard interaction** — Can it be reached, operated, and exited via keyboard?
4. **Visual presentation** — Contrast, text sizing, spacing, focus indicators
5. **Dynamic behavior** — State changes announced? Loading states communicated?

### Step 3: Check Common Anti-Patterns

| Anti-Pattern | Issue | Fix |
|---|---|---|
| `<div onClick={...}>` | Not keyboard accessible, no role | Use `<button>` |
| `<a>` without `href` | Not focusable, wrong semantics | Add `href` or use `<button>` |
| `placeholder` as label | Disappears on input, low contrast | Add visible `<label>` |
| `outline: none` on `:focus` | No focus indicator | Use `:focus-visible` with a custom ring |
| `tabindex="5"` | Breaks natural tab order | Use `tabindex="0"` or DOM order |
| Color-only error state | Invisible to colorblind users | Add icon + text + `aria-invalid` |
| `aria-label` on non-interactive `<div>` | ARIA on wrong element | Move to an interactive element or use `role` |
| Image with no `alt` | Screen readers say "image" or filename | Add descriptive `alt` or `alt=""` for decorative |
| Auto-playing media | Disruptive, no user control | Pause by default, provide controls |

### Step 4: Compile Report

Use the report format defined in `.cursor/rules/design-standards.mdc`:

```markdown
# Accessibility Audit: <Component/Page Name>

**Standard**: WCAG 2.2 Level AA
**Date**: YYYY-MM-DD
**Scope**: <what was evaluated>

## Summary
- **Critical**: X issues
- **Major**: X issues
- **Minor**: X issues

## Findings

### 🔴 [CRITICAL] <Issue Title>
- **WCAG Criterion**: X.X.X <Name>
- **Element**: `<selector or description>`
- **Issue**: What is wrong
- **Impact**: Who is affected and how
- **Fix**: Specific code change required

```<language>
// Before (inaccessible)
<div onClick={handleClick}>Submit</div>

// After (accessible)
<button type="submit" onClick={handleClick}>Submit</button>
```

### 🟡 [MAJOR] <Issue Title>
...

### 🟢 [MINOR] <Issue Title>
...

## Passed Checks
- ✅ <Criterion>: <What was verified>

## Recommendations
Prioritized improvements beyond minimum compliance.
```

---

## Accessible Implementation Patterns

### Buttons

```html
<!-- Primary action -->
<button type="submit">Save changes</button>

<!-- Icon-only button — needs accessible name -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Toggle button -->
<button type="button" aria-pressed="false">Dark mode</button>
```

### Form Inputs

```html
<div>
  <label for="email">Email address</label>
  <input
    id="email"
    type="email"
    required
    aria-describedby="email-hint email-error"
    aria-invalid="true"
  />
  <p id="email-hint">We'll never share your email.</p>
  <p id="email-error" role="alert">Please enter a valid email address.</p>
</div>
```

### Modals / Dialogs

```html
<dialog aria-labelledby="dialog-title" aria-describedby="dialog-desc">
  <h2 id="dialog-title">Confirm deletion</h2>
  <p id="dialog-desc">This action cannot be undone.</p>
  <button type="button" autofocus>Cancel</button>
  <button type="button">Delete</button>
</dialog>
```

Focus management: trap focus inside dialog, return focus to trigger on close.

### Live Regions

```html
<!-- Polite: announced at next pause (status messages, saved confirmations) -->
<div role="status" aria-live="polite">Changes saved.</div>

<!-- Assertive: announced immediately (errors, urgent alerts) -->
<div role="alert" aria-live="assertive">Session expired. Please log in again.</div>
```

### Navigation

```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/products">Products</a></li>
  </ul>
</nav>
```

---

## Output Formats

### JSON (for programmatic consumption)

```json
{
  "audit": {
    "target": "LoginForm",
    "standard": "WCAG 2.2 AA",
    "date": "2026-02-23",
    "summary": { "critical": 1, "major": 2, "minor": 1 },
    "findings": [
      {
        "severity": "critical",
        "title": "Submit button not keyboard accessible",
        "criterion": "2.1.1",
        "criterionName": "Keyboard",
        "element": "div.submit-btn",
        "issue": "div with onClick handler cannot be reached via keyboard",
        "impact": "Keyboard and screen reader users cannot submit the form",
        "fix": "Replace <div> with <button type=\"submit\">"
      }
    ],
    "passed": ["1.4.3", "2.4.7", "3.3.2"]
  }
}
```

### Markdown (for human consumption)

Use the report template from Step 4 above.

---

Author: Charley Scholz, ELEV8
Co-authored: Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-23
