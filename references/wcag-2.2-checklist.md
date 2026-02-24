# WCAG 2.2 AA Compliance Checklist

A comprehensive checklist covering all WCAG 2.2 Level A and AA success criteria. Use this as a reference during accessibility audits and design reviews.

---

## 1. Perceivable

Information and user interface components must be presentable to users in ways they can perceive.

### 1.1 Text Alternatives

- [ ] **1.1.1 Non-text Content (A)** — All `<img>` elements have meaningful `alt` text (or `alt=""` for decorative images). Icon buttons have accessible labels. Complex images (charts, diagrams) have long descriptions.
  - *Test:* Disable images and confirm all information is still conveyed.

### 1.2 Time-based Media

- [ ] **1.2.1 Audio-only / Video-only (A)** — Prerecorded audio has a transcript. Prerecorded video-only has a text or audio alternative.
  - *Test:* Check that transcripts exist and are accurate.
- [ ] **1.2.2 Captions — Prerecorded (A)** — All prerecorded video has synchronized captions including speaker identification and relevant non-speech sounds.
  - *Test:* Watch videos with captions; verify accuracy and completeness.
- [ ] **1.2.3 Audio Description or Media Alternative (A)** — Video content has audio description or a complete text transcript.
  - *Test:* Verify critical visual information is available in audio or text form.
- [ ] **1.2.5 Audio Description — Prerecorded (AA)** — Audio description track is provided for all prerecorded video.
  - *Test:* Enable audio description track and confirm visual content is described.

### 1.3 Adaptable

- [ ] **1.3.1 Info and Relationships (A)** — Semantic HTML is used: headings (`h1`–`h6`), lists (`ul`/`ol`), tables (`th`/`td` with scope), landmarks (`nav`, `main`, `aside`), form labels.
  - *Test:* Navigate with a screen reader; confirm structure is announced correctly.
- [ ] **1.3.2 Meaningful Sequence (A)** — DOM order matches visual reading order. CSS reordering does not break logical sequence.
  - *Test:* Linearize the page (disable CSS) and confirm content order makes sense.
- [ ] **1.3.3 Sensory Characteristics (A)** — Instructions do not rely solely on shape, color, size, or position.
  - *Test:* Read all instructions; confirm they make sense without visual cues.
- [ ] **1.3.4 Orientation (AA)** — Content works in both portrait and landscape. No forced orientation unless essential.
  - *Test:* Rotate device and verify all content is accessible.
- [ ] **1.3.5 Identify Input Purpose (AA)** — Personal data fields use appropriate `autocomplete` attributes.
  - *Test:* Inspect form fields for `autocomplete` values (name, email, tel, etc.).

### 1.4 Distinguishable

- [ ] **1.4.1 Use of Color (A)** — Color is not the only indicator of information, actions, or errors. Links in body text are underlined or have additional visual indicators.
  - *Test:* View the page in grayscale; confirm all information is still clear.
- [ ] **1.4.2 Audio Control (A)** — No auto-playing audio, or mechanisms to pause/stop/mute within 3 seconds.
  - *Test:* Load the page and check for unexpected audio.
- [ ] **1.4.3 Contrast — Minimum (AA)** — Normal text has ≥ 4.5:1 contrast ratio. Large text (≥ 18pt or ≥ 14pt bold) has ≥ 3:1.
  - *Test:* Use a contrast checker tool on all text/background combinations.
- [ ] **1.4.4 Resize Text (AA)** — Text can be zoomed to 200% without content clipping, overlapping, or horizontal scrolling.
  - *Test:* Zoom browser to 200% and verify all text is readable and functional.
- [ ] **1.4.5 Images of Text (AA)** — Real text is used instead of images of text (except logos).
  - *Test:* Check that headings, buttons, and body text are HTML text, not images.
- [ ] **1.4.10 Reflow (AA)** — Content reflows at 320px width without horizontal scrolling (except data tables, maps, diagrams).
  - *Test:* Set viewport to 320px wide and verify single-column layout with no horizontal scroll.
- [ ] **1.4.11 Non-text Contrast (AA)** — UI components (borders, icons, focus rings) have ≥ 3:1 contrast against adjacent colors.
  - *Test:* Check form borders, icons, and graphical indicators with a contrast tool.
- [ ] **1.4.12 Text Spacing (AA)** — No content loss when: line height → 1.5×, paragraph spacing → 2×, letter spacing → 0.12×, word spacing → 0.16×.
  - *Test:* Apply the text spacing bookmarklet and verify no clipping or overlap.
- [ ] **1.4.13 Content on Hover or Focus (AA)** — Tooltips/popovers are dismissible (Escape), hoverable, and persistent until user dismisses.
  - *Test:* Hover over tooltip triggers; move mouse into the tooltip; press Escape to dismiss.

---

## 2. Operable

User interface components and navigation must be operable.

### 2.1 Keyboard Accessible

- [ ] **2.1.1 Keyboard (A)** — All functionality is operable via keyboard (Tab, Enter, Space, Arrow keys, Escape).
  - *Test:* Unplug mouse; navigate the entire application using keyboard only.
- [ ] **2.1.2 No Keyboard Trap (A)** — Focus can always be moved away from any component using standard keyboard navigation.
  - *Test:* Tab through all interactive elements; confirm you can always Tab out.
- [ ] **2.1.4 Character Key Shortcuts (A)** — Single-character shortcuts use modifier keys, or can be turned off/remapped.
  - *Test:* Check for single-letter shortcuts that might conflict with screen readers.

### 2.2 Enough Time

- [ ] **2.2.1 Timing Adjustable (A)** — Time limits can be turned off, adjusted, or extended (with at least 20 seconds warning).
  - *Test:* Check for session timeouts; verify a warning appears with extension option.
- [ ] **2.2.2 Pause, Stop, Hide (A)** — Auto-playing content (carousels, animations) can be paused, stopped, or hidden. Respects `prefers-reduced-motion`.
  - *Test:* Identify all moving content; verify pause/stop controls exist.

### 2.3 Seizures and Physical Reactions

- [ ] **2.3.1 Three Flashes or Below Threshold (A)** — No content flashes more than 3 times per second.
  - *Test:* Review animations and videos for rapid flashing.

### 2.4 Navigable

- [ ] **2.4.1 Bypass Blocks (A)** — "Skip to main content" link is the first focusable element. Landmark roles are used.
  - *Test:* Tab from the start of the page; confirm skip link appears and works.
- [ ] **2.4.2 Page Titled (A)** — Every page has a descriptive `<title>`. SPAs update title on route change.
  - *Test:* Check browser tab title on every page/route.
- [ ] **2.4.3 Focus Order (A)** — Tab order follows a logical, meaningful sequence matching the visual layout.
  - *Test:* Tab through all interactive elements and verify the order makes sense.
- [ ] **2.4.4 Link Purpose in Context (A)** — Link text (with context) describes the destination. No "Click here" links.
  - *Test:* Review all links; confirm each makes sense out of context or with surrounding text.
- [ ] **2.4.5 Multiple Ways (AA)** — At least two ways to find any page: navigation, search, sitemap, or related links.
  - *Test:* Confirm search functionality and navigation both lead to key pages.
- [ ] **2.4.6 Headings and Labels (AA)** — Headings and form labels are descriptive of their content/purpose.
  - *Test:* Review heading outline; confirm headings describe following content.
- [ ] **2.4.7 Focus Visible (AA)** — Keyboard focus indicator is visible with ≥ 3:1 contrast on all interactive elements.
  - *Test:* Tab through the page; verify every focused element has a visible outline.
- [ ] **2.4.11 Focus Not Obscured — Minimum (AA)** — Focused element is not entirely hidden by sticky headers, banners, or overlays.
  - *Test:* Tab through the page; verify no focused element is completely obscured.

### 2.5 Input Modalities

- [ ] **2.5.1 Pointer Gestures (A)** — Multipoint/path-based gestures have single-pointer alternatives.
  - *Test:* Verify swipe, pinch, and multi-touch actions have button alternatives.
- [ ] **2.5.2 Pointer Cancellation (A)** — Actions trigger on pointer up-event (not down), or can be cancelled.
  - *Test:* Press and hold an interactive element, then move away — action should not trigger.
- [ ] **2.5.3 Label in Name (A)** — Accessible name includes the visible text label.
  - *Test:* Compare visible button/link text with `aria-label`; they should match.
- [ ] **2.5.4 Motion Actuation (A)** — Motion-triggered features have UI alternatives and can be disabled.
  - *Test:* Check for shake/tilt features; verify button alternatives exist.
- [ ] **2.5.7 Dragging Movements (AA)** — Drag-and-drop has a non-dragging alternative (buttons, keyboard).
  - *Test:* Attempt all drag operations using keyboard or click alternatives.
- [ ] **2.5.8 Target Size — Minimum (AA)** — Interactive targets are at least 24×24 CSS pixels (with exceptions).
  - *Test:* Measure small interactive elements; verify ≥ 24×24px or adequate spacing.

---

## 3. Understandable

Information and the operation of the user interface must be understandable.

### 3.1 Readable

- [ ] **3.1.1 Language of Page (A)** — `<html>` element has a valid `lang` attribute.
  - *Test:* Inspect `<html lang="...">` — must be present and correct.
- [ ] **3.1.2 Language of Parts (AA)** — Text in a different language has the appropriate `lang` attribute.
  - *Test:* Check foreign-language passages for `lang` attributes.

### 3.2 Predictable

- [ ] **3.2.1 On Focus (A)** — Focusing an element does not trigger a context change (navigation, form submit).
  - *Test:* Tab through all elements; confirm no unexpected page changes.
- [ ] **3.2.2 On Input (A)** — Changing a form control does not automatically trigger a context change without prior notice.
  - *Test:* Change dropdown selections and checkbox values; confirm no unexpected navigation.
- [ ] **3.2.3 Consistent Navigation (AA)** — Navigation menus appear in the same order on every page.
  - *Test:* Visit multiple pages; compare navigation order.
- [ ] **3.2.4 Consistent Identification (AA)** — Same functionality uses the same label everywhere (e.g., always "Search", not sometimes "Find").
  - *Test:* Audit repeated functions across pages for label consistency.
- [ ] **3.2.6 Consistent Help (A)** — Help mechanisms (contact, chat) are in the same location on every page.
  - *Test:* Check help link/widget placement across multiple pages.

### 3.3 Input Assistance

- [ ] **3.3.1 Error Identification (A)** — Errors are identified in text and associated with the field in error.
  - *Test:* Submit forms with invalid data; verify specific error messages appear next to fields.
- [ ] **3.3.2 Labels or Instructions (A)** — All form fields have visible labels. Required fields and format requirements are indicated.
  - *Test:* Review all forms; confirm labels, required indicators, and format hints.
- [ ] **3.3.3 Error Suggestion (AA)** — Error messages suggest how to fix the problem when possible.
  - *Test:* Trigger form errors; verify suggestions are specific and actionable.
- [ ] **3.3.4 Error Prevention — Legal/Financial (AA)** — Submissions with legal/financial implications are reversible, verified, or confirmed before processing.
  - *Test:* Check checkout, deletion, and account change flows for confirmation steps.
- [ ] **3.3.7 Redundant Entry (A)** — Previously entered information is auto-populated or selectable, not required to be re-entered.
  - *Test:* In multi-step forms, check if repeated data (name, address) is pre-filled.
- [ ] **3.3.8 Accessible Authentication — Minimum (AA)** — Authentication does not require cognitive tests. Password paste is allowed. Alternatives to CAPTCHA exist.
  - *Test:* Verify paste works in password fields; check for CAPTCHA alternatives.

---

## 4. Robust

Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.

- [ ] **4.1.2 Name, Role, Value (A)** — Custom UI components have correct ARIA roles, states, and properties. Native HTML elements are used where possible.
  - *Test:* Inspect custom widgets (tabs, modals, dropdowns) with accessibility inspector; verify roles and states.
- [ ] **4.1.3 Status Messages (AA)** — Status messages (success, error, progress) are announced to screen readers via `aria-live` regions or appropriate roles.
  - *Test:* Trigger status messages (save, delete, search) and verify screen reader announces them.

---

## Testing Approach Summary

| Method | Tools | What It Catches |
|--------|-------|-----------------|
| Automated scan | axe, Lighthouse, WAVE | ~30-40% of issues — contrast, missing alt, ARIA errors |
| Keyboard testing | No mouse, Tab through everything | Focus order, keyboard traps, missing interactions |
| Screen reader | NVDA (Win), VoiceOver (Mac), JAWS | Content readability, ARIA correctness, announcements |
| Zoom testing | Browser zoom 200-400% | Reflow, text clipping, layout breakage |
| Manual review | Human evaluation | Content quality, label clarity, logical flow |

---

Author: Charley Scholz, ELEV8
Co-authored: Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-23
