# Common UI Patterns Reference

A comprehensive reference of proven UI patterns organized by category. Each pattern includes when to use it, when to avoid it, and key accessibility considerations.

---

## Navigation Patterns

### Sidebar Navigation

A persistent vertical navigation panel, typically on the left side, showing primary navigation items. Can collapse to icon-only mode on smaller viewports.

**When to Use:**
- Applications with 5–15 top-level sections
- Admin dashboards and management consoles
- Desktop-first tools where users switch sections frequently
- Apps where navigation context must remain visible

**When NOT to Use:**
- Content-focused websites (blogs, marketing sites) — use top nav instead
- Mobile-first apps — convert to bottom tabs or hamburger menu
- Apps with fewer than 3 sections — overhead is unnecessary
- Public-facing consumer sites — sidebar feels like an "app" pattern

**Accessibility:**
- Wrap in `<nav>` with `aria-label="Main navigation"`
- Mark current page with `aria-current="page"`
- Collapsible sidebar: toggle `aria-expanded` on the trigger button
- On mobile overlay: trap focus inside, add backdrop, close on Escape
- Ensure visible focus indicators on all navigation items

---

### Top Navigation Bar

Horizontal bar at the top of the page containing the logo, primary navigation links, and utility items (search, profile, notifications).

**When to Use:**
- Marketing and content websites
- Sites with 3–7 primary navigation items
- Responsive sites where nav items fit horizontally on most screens
- When brand presence needs to be prominent

**When NOT to Use:**
- More than 7–8 primary items — will overflow
- Deep nested navigation — consider sidebar instead
- Mobile when items won't fit — switch to hamburger

**Accessibility:**
- Use `<nav>` element with `aria-label="Primary"`
- Dropdown sub-menus: `aria-expanded` on trigger, `aria-haspopup="true"`
- Keyboard: arrow keys navigate within menu, Escape closes dropdown
- Mobile hamburger variant must manage focus properly

---

### Tab Bar / Bottom Navigation

Fixed bar at the bottom of the viewport (mobile) or tabs at the top of a content area (web) for switching between peer-level views.

**When to Use:**
- Mobile apps with 3–5 top-level destinations
- Web content with 2–7 related views at the same level
- Settings pages with categorized sections
- When switching should not feel like "navigating away"

**When NOT to Use:**
- More than 5 items on mobile (too crowded)
- Hierarchical content (use breadcrumbs or sidebar)
- Tabs with unrelated content — tabs imply peer relationship
- When tab content requires deep scrolling (footer is hidden behind bottom bar)

**Accessibility:**
- Web tabs: `role="tablist"`, `role="tab"`, `role="tabpanel"` ARIA pattern
- Active tab: `aria-selected="true"`
- Arrow keys navigate between tabs; Tab key moves to panel content
- Bottom nav on mobile: use `<nav>` with clear labeling
- Each tab panel: `aria-labelledby` pointing to its tab

---

### Breadcrumbs

Horizontal trail of links showing the user's position in a hierarchy. Each segment links back to that level.

**When to Use:**
- Sites with 3+ levels of content hierarchy
- E-commerce category → subcategory → product flows
- File or document management systems
- Whenever users need to backtrack through a hierarchy

**When NOT to Use:**
- Flat sites with no meaningful hierarchy
- Linear flows (use a stepper instead)
- As a replacement for "Back" — breadcrumbs show hierarchy, not history

**Accessibility:**
- Wrap in `<nav aria-label="Breadcrumb">`
- Use `<ol>` for ordered list semantics
- Separators (/, ›) should be `aria-hidden="true"`
- Last item (current page): not a link, or marked `aria-current="page"`

---

### Command Palette

A keyboard-activated overlay (Cmd+K / Ctrl+K) that provides quick search and navigation across the entire application.

**When to Use:**
- Power-user and developer tools
- Applications with many pages, settings, or actions
- As a complement to traditional navigation (not a replacement)
- For reducing clicks on frequently performed actions

**When NOT to Use:**
- Consumer apps where most users are non-technical
- As the only navigation method — must have traditional nav too
- Simple apps with fewer than 10 destinations

**Accessibility:**
- Use `role="combobox"` with `role="listbox"` for suggestions
- Announce result count via `aria-live` region
- Full keyboard navigation: arrows, enter, escape
- Trap focus within the palette when open
- Visible keyboard shortcut hint in the UI

---

## Form Patterns

### Single-Page Form

All fields displayed on a single page with a submit button at the bottom.

**When to Use:**
- Forms with fewer than 10 fields
- Simple data collection (contact form, feedback, login)
- When users benefit from seeing all fields at once
- Quick transactions that shouldn't feel like a "process"

**When NOT to Use:**
- More than 10–12 fields — becomes overwhelming
- Complex, conditional logic — use wizard instead
- Different audiences need different fields — use progressive disclosure

**Accessibility:**
- Every input has an associated `<label>` (visible, not just `aria-label`)
- Required fields: `aria-required="true"` + visible indicator
- Error messages associated with fields via `aria-describedby`
- Logical tab order matching visual layout
- Submit button clearly labeled with the action ("Send Message", not "Submit")

---

### Multi-Step Form (Wizard)

A form broken into sequential steps, each shown one at a time with a progress indicator.

**When to Use:**
- Long forms with 10+ fields
- Onboarding, registration, and checkout flows
- Complex data entry where context per step reduces errors
- When steps have clear, logical groupings

**When NOT to Use:**
- Short forms (< 8 fields) — unnecessary overhead
- When users need to see all fields simultaneously
- When steps are not logically sequential

**Accessibility:**
- Step indicator: `aria-current="step"` on the active step
- Announce step changes via `aria-live` region
- Always provide a "Back" button — never trap users
- Validate before advancing; clearly associate errors with fields
- Consider allowing non-linear navigation for edit/review flows

---

### Inline Validation

Fields are validated in real-time as the user fills them out, with immediate success or error feedback.

**When to Use:**
- Fields with specific format requirements (email, password, phone)
- Real-time availability checks (usernames, domains)
- When early feedback can prevent submission errors
- Complex forms where catching errors early saves time

**When NOT to Use:**
- Validating on every keystroke — too aggressive, use on-blur
- For fields where the user hasn't finished typing yet
- When validation is expensive and debouncing is insufficient

**Accessibility:**
- Errors: `aria-invalid="true"` on the field + `aria-describedby` pointing to error message
- Do not validate while user is actively typing — validate on blur
- Error text must be visible text, not just an icon or color change
- Announce errors via `aria-live="polite"` region
- Success state: use color + icon (not just color)

---

### Progressive Disclosure Form

Starts with minimal fields, revealing additional fields based on user selections or explicit "Show more" action.

**When to Use:**
- Forms with conditional fields (e.g., "Other" → text field)
- Advanced search with basic/advanced modes
- Configuration UIs where most users need only basic options
- Reducing initial visual complexity

**When NOT to Use:**
- When all fields are always required
- When hidden fields might cause users to miss important options
- On forms where users routinely need the advanced options

**Accessibility:**
- Newly revealed fields must be announced to screen readers
- `aria-expanded` on the toggle control
- Hidden fields must be removed from tab order (not just visually hidden)
- Focus should move logically when fields appear/disappear
- Preserve field values if hidden and re-shown

---

## Data Display Patterns

### Data Table

Rows and columns displaying structured, homogeneous records with optional sorting, filtering, and pagination.

**When to Use:**
- Structured records that benefit from column comparison (users, orders, metrics)
- Data requiring sorting and filtering
- Admin panels and reporting dashboards
- When users need to scan many items quickly

**When NOT to Use:**
- Fewer than 3 records — use a simple list
- Highly visual content (products, portfolios) — use card grid
- Mobile-first contexts where tables cause horizontal scroll — use list/cards

**Accessibility:**
- Use semantic `<table>`, `<thead>`, `<tbody>`, `<th scope="col|row">`
- Sortable columns: `aria-sort="ascending|descending|none"`
- Row selection: checkboxes with labels
- Pagination controls: descriptive labels ("Page 2 of 10")
- Responsive: pinned first column with horizontal scroll, or stacked cards on mobile

---

### Card Grid

Visual cards arranged in a responsive grid, each containing a preview of an entity.

**When to Use:**
- Visual content (images, videos, products)
- Entity browsing where visual identity matters
- Dashboard widget layouts
- When each item needs more than a single text line

**When NOT to Use:**
- Homogeneous text data better shown in a table
- When comparison across items is important (tables are better)
- Infinite items without clear visual differentiation

**Accessibility:**
- Each card: `<article>` or `<li>` within a `<ul>`
- If the card is clickable, the entire card is the link target
- Images need `alt` text
- Card actions (edit, delete) need accessible labels
- Ensure cards are reachable and operable via keyboard

---

### List View

Vertical list of items with key information per row, optimized for scanning.

**When to Use:**
- Sequential content (messages, notifications, activity feeds)
- Search results
- Mobile-first data displays
- Content where order matters (chronological, priority-sorted)

**When NOT to Use:**
- Highly visual content that needs image previews — use cards
- Data requiring multi-column comparison — use table
- When spatial relationships matter — use grid or map

**Accessibility:**
- Use `<ul>`/`<ol>` for semantic structure
- Clickable items need clear focus indicators
- Group by date/category with `<h2>`/`<h3>` headings
- "Load more" button as alternative to infinite scroll
- Empty state: helpful message with call to action

---

### Infinite Scroll

Automatically loads more content as the user scrolls near the bottom of the page.

**When to Use:**
- Social feeds and activity streams
- Image galleries and discovery interfaces
- Content where browsing is the primary interaction
- When pagination would break the browsing flow

**When NOT to Use:**
- When users need to reach the footer (it becomes unreachable)
- When users need to access specific pages (use pagination)
- For content that users need to reference by position
- For critical tasks where users need to feel "done"

**Accessibility:**
- **Must provide** a "Load more" button fallback for keyboard/screen reader users
- Announce new content via `aria-live` region
- Don't steal focus when new content loads
- Provide a way to skip past the loading content to reach the footer
- Limit auto-loads (e.g., 5 auto-loads, then require button click)

---

## Feedback Patterns

### Toast Notification

A temporary, non-blocking message that confirms an action or provides a status update.

**When to Use:**
- Success confirmations ("Item saved", "Message sent")
- Non-critical status updates ("New version available")
- Undo actions ("Deleted — Undo")
- Background task completion

**When NOT to Use:**
- Critical errors requiring user action — use inline error or modal
- Information the user needs to reference — use persistent banner
- While the user is in the middle of typing — disruptive
- When the action requires immediate attention — use alert

**Accessibility:**
- Non-critical: `role="status"` + `aria-live="polite"`
- Errors: `role="alert"` + `aria-live="assertive"`
- Minimum 5-second display time, or persist until dismissed
- Close button with accessible label
- Limit to 3 visible toasts maximum
- Respect `prefers-reduced-motion` for entrance/exit animations

---

### Modal Dialog

An overlay that requires user attention or action before returning to the main content.

**When to Use:**
- Confirmation of destructive or irreversible actions
- Critical decisions requiring focused attention
- Self-contained sub-tasks (compose message, edit profile)
- Warning or error that needs immediate acknowledgment

**When NOT to Use:**
- Non-critical notifications — use toast instead
- Simple information display — use inline message or popover
- Blocking the user from referencing content behind the modal
- Marketing/promotional interruptions (these annoy users)

**Accessibility:**
- Use `<dialog>` element or `role="dialog"` with `aria-modal="true"`
- Trap focus inside the modal (Tab cycles within modal content)
- Escape closes the modal
- Return focus to the trigger element on close
- Set background content as `inert`
- Associate title with `aria-labelledby`

---

### Inline Message / Banner

A contextual message displayed within the content flow, near the element it relates to.

**When to Use:**
- Form validation errors (below the problematic field)
- Contextual tips and help text
- Section-level status or warnings
- Empty states with guidance

**When NOT to Use:**
- Global notifications — use toast or page-level banner
- Transient confirmations — use toast
- Critical system alerts — use modal

**Accessibility:**
- Associate with field via `aria-describedby`
- Errors: `role="alert"` for immediate announcement
- Info/help: `aria-live="polite"` if dynamically inserted
- Never convey meaning through color alone — include icon + text
- Persistent until the error is resolved or the user dismisses

---

### Skeleton Loading

Placeholder shapes that mimic the layout of content while data loads.

**When to Use:**
- Initial page or component data loading
- Content-heavy pages (article, profile, product listing)
- When the layout is predictable before data arrives
- As a perceived-performance improvement over spinners

**When NOT to Use:**
- Quick loads (< 200ms) — adds unnecessary visual noise
- Unknown content structure — use a simple spinner
- Background updates to already-visible content — use subtle indicator

**Accessibility:**
- Mark loading container with `aria-busy="true"`
- Skeleton shapes: `aria-hidden="true"`
- When loading completes: `aria-busy="false"` on container
- Container should have `aria-live="polite"` to announce when content appears
- Respect `prefers-reduced-motion` — disable shimmer animation if set

---

### Progress Indicator

Visual representation of how far along an operation is — either determinate (percentage) or indeterminate (ongoing).

**When to Use:**
- File uploads/downloads
- Multi-step processes with known progress
- Background task tracking
- Long-running operations (> 2 seconds)

**When NOT to Use:**
- Instant actions (< 200ms) — no indicator needed
- When progress is truly unknown — use indeterminate spinner
- Micro-interactions — feels heavy for quick tasks

**Accessibility:**
- Use `role="progressbar"`
- Determinate: `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`
- Indeterminate: omit `aria-valuenow`
- `aria-label` or `aria-labelledby` describing what's loading
- Respect `prefers-reduced-motion` for animations

---

## Layout Patterns

### Split View / Master-Detail

Two-panel layout: one panel lists items, the other shows detail for the selected item.

**When to Use:**
- Email clients (inbox + message)
- File managers (folder tree + file listing)
- Settings with categories
- Any master list → detail selection pattern

**When NOT to Use:**
- Mobile-only apps (not enough horizontal space — stack vertically)
- When items don't have meaningful detail to show
- When the list and detail are unrelated

**Accessibility:**
- Both panels navigable by keyboard
- `aria-label` on each panel to differentiate
- Selection in the list panel announces and updates the detail panel
- Resizable divider: `role="separator"` with `aria-orientation`
- On mobile: list view → detail view with back navigation

---

### Sticky Header

A header that remains fixed at the top of the viewport as the user scrolls.

**When to Use:**
- Pages with frequent need to access navigation or actions
- Long-form content where users need persistent access to tools
- Dashboards with filter controls

**When NOT to Use:**
- When the header is very tall and eats into content space
- On mobile where vertical space is precious — consider auto-hide-on-scroll
- When the header content is not useful while scrolling

**Accessibility:**
- Sticky elements must not cover focused elements (use `scroll-padding-top`)
- Skip navigation link must account for sticky header offset
- Focus indicators must remain visible behind sticky elements

---

### Responsive Dashboard Grid

A grid of widget cards that reflows based on viewport size, with optional user customization.

**When to Use:**
- Analytics and monitoring dashboards
- Home screens with multiple summaries
- Customizable user interfaces
- Overview pages with diverse content types

**When NOT to Use:**
- Simple pages with single-focus content
- When all users need the same fixed layout
- Mobile where grid adds complexity — consider a stacked list

**Accessibility:**
- Each widget: `role="region"` + `aria-label`
- Drag-and-drop customization must have keyboard alternative
- Widget content scrollable independently if it overflows
- Layout changes announced to screen readers

---

## Pattern Selection Guide

| User Need | Recommended Pattern | Alternative |
|-----------|-------------------|-------------|
| Navigate between 3-7 sections | Top nav / Tab bar | Sidebar (desktop apps) |
| Navigate 8+ sections | Sidebar | Command palette as supplement |
| Show hierarchical location | Breadcrumbs | — |
| Collect < 10 fields | Single-page form | — |
| Collect 10+ fields | Multi-step wizard | Sectioned single-page form |
| Display tabular data | Data table | — |
| Display visual items | Card grid | — |
| Show sequential items | List view | — |
| Confirm an action | Toast (success) or Modal (destructive) | Inline message |
| Show loading state | Skeleton (predictable layout) | Spinner (unknown layout) |
| Provide help | Contextual tooltip + help center | Onboarding tour (first use) |

---

Author: Charley Scholz, JLAI
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-23
