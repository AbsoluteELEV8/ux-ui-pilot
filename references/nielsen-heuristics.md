# Nielsen's 10 Usability Heuristics — Reference Guide

Jakob Nielsen's heuristics are broad rules of thumb for interaction design. They are not specific usability guidelines but general principles. Use this reference when conducting heuristic evaluations.

---

## How to Conduct a Heuristic Evaluation

1. **Walk through the interface** with specific user tasks in mind
2. **Evaluate each screen** against all 10 heuristics
3. **Rate severity** of each issue found:
   - **0** — Not a usability problem
   - **1** — Cosmetic only — fix if time allows
   - **2** — Minor usability problem — low priority
   - **3** — Major usability problem — important to fix, high priority
   - **4** — Usability catastrophe — must fix before release
4. **Document** each finding with: heuristic, severity, evidence, recommendation
5. **Prioritize** by severity × frequency × impact

---

## Heuristic 1: Visibility of System Status

> The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time.

### Why It Matters

When users know the current system status, they can determine the outcome of prior interactions, decide next steps, and build trust in the system. Silence breeds anxiety.

### Timing Guidelines

| Response Time | User Perception | Required Feedback |
|---------------|-----------------|-------------------|
| < 100ms | Instantaneous | Visual state change (button press) |
| 100ms – 1s | Noticeable delay | Loading indicator optional |
| 1s – 10s | Flow is interrupted | Progress indicator required |
| > 10s | Attention lost | Progress bar with percentage/time estimate |

### Good Examples

- **Progress bars** — File upload showing percentage, speed, and estimated time remaining
- **State indicators** — "Saving...", "Saved ✓", "Offline" badges that reflect real-time status
- **Loading skeletons** — Ghost UI shapes that preview layout while content loads
- **Breadcrumbs** — Show the user's position within the site hierarchy
- **Active nav states** — Highlighted menu item matching the current page
- **Badge counts** — Cart item count, notification count that updates immediately

### Violation Examples

- Button click with no visual response for 2+ seconds
- Background save with no confirmation that it completed
- File upload with a spinner but no progress indication
- SPA route change with no loading indicator
- Silent failures where an action appears to succeed but actually didn't

### Evaluation Questions

- After every user action, is there immediate visual feedback?
- Can the user always determine where they are in the application?
- Are loading states communicated with appropriate indicators?
- Do long operations show progress (not just a spinner)?
- Is the system status visible at a glance (online, saving, errors)?

---

## Heuristic 2: Match Between System and Real World

> The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon. Follow real-world conventions, making information appear in a natural and logical order.

### Why It Matters

When interfaces match users' existing mental models and use familiar language, learning curves flatten and errors decrease. Users should never need to consult documentation for basic terminology.

### Good Examples

- **Shopping cart** metaphor in e-commerce — universally understood
- **Folder and file** metaphors in document management
- **Plain-language error messages** — "We couldn't find that page" vs "404 Not Found"
- **Locale-appropriate formats** — Date (MM/DD vs DD/MM), currency, number separators
- **Natural ordering** — Months displayed January→December, not alphabetically
- **Domain-appropriate icons** — Stethoscope for health, briefcase for business

### Violation Examples

- Database field names in the UI: "usr_created_at" instead of "Account Created"
- HTTP status codes shown to end users: "Error 403"
- Developer jargon: "null reference", "unhandled exception", "payload"
- Non-localized date formats confusing international users
- Alphabetically sorted options when chronological order is expected

### Evaluation Questions

- Would a first-time user understand every label without explanation?
- Are dates, numbers, and currencies formatted for the target audience?
- Do icons and metaphors match real-world objects users recognize?
- Are error messages written for humans, not developers?
- Is content ordered in a way that matches the user's mental model?

---

## Heuristic 3: User Control and Freedom

> Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave the unwanted action without having to go through an extended process. Support undo and redo.

### Why It Matters

Mistakes are inevitable. When users feel safe to explore — knowing they can always undo or escape — they engage more confidently and explore more features.

### Good Examples

- **Undo** — Gmail's "Undo send" (time-limited), Ctrl+Z in editors
- **Cancel** — Every modal has a Cancel/Close button or responds to Escape
- **Back** — Browser back button works correctly in SPAs
- **Draft autosave** — Users never lose in-progress work
- **Soft delete** — "Moved to Trash" with recovery option, not permanent delete
- **Reset filters** — One-click "Clear all" for search/filter interfaces

### Violation Examples

- Permanent deletion with no confirmation or recovery
- Multi-step wizard with no Back button
- Modal that can only be dismissed by completing the task
- Browser back button that reloads the SPA from scratch
- Form data lost when accidentally navigating away
- "Are you sure?" confirmation with no way to recover if confirmed

### Evaluation Questions

- Can the user undo their last action?
- Is there always a Cancel/Close/Back escape route?
- Does the browser back button behave as expected?
- Are destructive actions reversible (trash → permanent delete later)?
- Does the system protect against accidental data loss (autosave, drafts)?
- Can users exit any modal/dialog/flow without commitment?

---

## Heuristic 4: Consistency and Standards

> Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions.

### Why It Matters

Consistency reduces cognitive load. When patterns are predictable, users can transfer knowledge from one part of the app to another, and from other familiar apps to yours.

### Types of Consistency

| Type | Scope | Example |
|------|-------|---------|
| **Internal** | Within your product | Same button style for all primary actions |
| **External** | Across the industry | Search icon = magnifying glass |
| **Platform** | OS/device conventions | Pull-to-refresh on mobile |
| **Visual** | Aesthetic system | Consistent spacing, color meanings, typography |

### Good Examples

- Primary buttons always blue/filled, secondary always gray/outlined
- "Save" always in the same position in forms (bottom-right)
- Link text always underlined or colored consistently
- Icons carry the same meaning everywhere in the app
- Same component patterns reused: cards, tables, forms look the same across pages

### Violation Examples

- "Delete" on one page, "Remove" on another, "Discard" on a third
- Save button on the left sometimes, right other times
- Different capitalization styles: "SAVE", "Save", "save" across the app
- Non-standard icons: using a trash can icon for "archive"
- Inconsistent form layouts between different settings pages

### Evaluation Questions

- Is the same action always labeled with the same word?
- Are visual patterns (buttons, cards, forms) consistent across the entire product?
- Does the design follow platform conventions (mobile tabs at bottom, web nav at top)?
- Do colors carry consistent semantic meaning (red = error, green = success)?
- Would a user who learned one section immediately understand another?

---

## Heuristic 5: Error Prevention

> Good error messages are important, but the best designs carefully prevent problems from occurring in the first place.

### Why It Matters

Preventing errors is always better than recovering from them. Good constraint design guides users toward success and makes mistakes structurally difficult.

### Prevention Strategies

| Strategy | Example |
|----------|---------|
| **Constraints** | Date picker instead of free-text date field |
| **Suggestions** | Autocomplete to prevent typos |
| **Defaults** | Smart defaults that are correct for most users |
| **Confirmation** | "Delete this project and all its data?" dialog |
| **Undo** | Allowing reversal as a safety net |
| **Validation** | Inline checks before final submission |

### Good Examples

- Disabled Submit button until all required fields are valid
- Character counter on text fields with limits
- Confirmation dialog before deleting data, canceling subscriptions, or sending payments
- Input masks for phone numbers, credit cards, dates
- Search with "Did you mean...?" suggestions
- Autosave preventing data loss from accidental page closes

### Violation Examples

- Free-text date entry with no format guidance
- Delete button immediately adjacent to Edit with no confirmation
- No character limit enforcement until server-side rejection
- Allowing double-submission of payment forms
- No validation until the user tries to submit
- Allowing impossible combinations in filter/config UIs

### Evaluation Questions

- Are error-prone actions guarded by constraints or confirmations?
- Does the system validate input as early as possible?
- Are destructive actions protected by confirmation with clear consequences stated?
- Are appropriate input types used (datepicker, dropdown, toggle) to prevent format errors?
- Are smart defaults provided where applicable?
- Is there a safety net (undo, autosave) for common mistakes?

---

## Heuristic 6: Recognition Rather Than Recall

> Minimize the user's memory load by making elements, actions, and options visible. The user should not have to remember information from one part of the interface to another.

### Why It Matters

Human working memory is limited (~4 chunks). Interfaces that rely on recall instead of recognition force users to hold information in memory, increasing cognitive load and errors.

### Good Examples

- Dropdown menus showing all available options
- Recent items / history for quick re-access
- Visible navigation labels (not icon-only without tooltips)
- Form pre-filling with known user data
- Breadcrumbs as a visible trail of where the user has been
- Context menus showing available actions
- Search with recent/suggested queries

### Violation Examples

- Requiring users to type exact codes or identifiers from memory
- Icon-only toolbar with no labels or tooltips
- Multi-step form where earlier answers aren't visible in later steps
- Hidden functionality discoverable only by memorized gestures
- Error messages referencing field names not visible on screen
- Settings page that doesn't show current values

### Evaluation Questions

- Can users see all their options rather than having to remember them?
- Do icons have visible labels (or at minimum, tooltips)?
- Is information from earlier steps visible when needed in later steps?
- Are frequently used actions prominently placed, not buried?
- Does the system surface recent items and suggestions?
- Can tasks be completed without memorizing system-specific knowledge?

---

## Heuristic 7: Flexibility and Efficiency of Use

> Shortcuts — hidden from novice users — can speed up the interaction for the expert user so that the design can cater to both inexperienced and experienced users.

### Why It Matters

One-size-fits-all interfaces frustrate both novices (too complex) and experts (too slow). The best designs layer complexity, providing simple defaults with power-user accelerators.

### Accelerator Types

| Type | Novice Experience | Expert Experience |
|------|-------------------|-------------------|
| Keyboard shortcuts | Not visible, not needed | Cmd+K, Ctrl+S, custom shortcuts |
| Bulk actions | Single-item operations | Select all → batch operation |
| Customization | Default layout | Rearrange dashboard, save presets |
| Templates | Start from scratch | Saved templates for quick start |
| Command palette | Not aware of it | Cmd+K → type any action |

### Good Examples

- Keyboard shortcuts displayed next to menu items (discoverable)
- "Apply to all" option for repetitive settings
- Customizable dashboard widgets
- Saved search filters and presets
- Right-click context menus with common actions
- Double-click to edit inline
- Templates for common document/project types

### Violation Examples

- No keyboard shortcuts in a productivity app
- Requiring the same number of clicks for rare and frequent tasks
- No customization in a tool used daily
- Repetitive tasks with no bulk mode
- No way to save frequently used settings or searches
- Identical workflow for power users and first-time users

### Evaluation Questions

- Are there keyboard shortcuts for frequent actions?
- Can experienced users skip unnecessary steps?
- Is the interface customizable (layout, defaults, presets)?
- Are repetitive tasks optimized with bulk operations?
- Are there multiple paths to the same action (menu, shortcut, context menu)?
- Does the system learn from user behavior (recent items, favorites)?

---

## Heuristic 8: Aesthetic and Minimalist Design

> Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information competes with relevant information and diminishes its relative visibility.

### Why It Matters

Visual noise competes for attention. A cluttered interface makes it harder to find what matters. Minimalism isn't about removing features — it's about revealing them at the right time.

### Good Examples

- Clean forms showing only essential fields (advanced options behind "Show more")
- Dashboard with 3-5 key metrics (drill-down for details)
- Generous white space creating clear visual hierarchy
- Progressive disclosure: basics first, complexity on demand
- Single primary CTA per screen
- Error messages that are concise and immediately actionable

### Violation Examples

- Dashboard displaying 30+ metrics simultaneously
- Long forms with every possible field on one page
- Dense paragraphs of instructional text nobody reads
- Multiple competing CTAs of equal visual weight
- Excessive decorative elements (gradients, shadows, borders everywhere)
- Redundant navigation (same links in header, sidebar, and footer)

### Evaluation Questions

- Does every visible element serve a purpose for the current task?
- Is the visual hierarchy clear — can users identify the primary action immediately?
- Is content density appropriate (not too sparse, not too cluttered)?
- Is complexity hidden behind progressive disclosure?
- Does white space effectively group and separate content?
- Could any element be removed without losing necessary information?

---

## Heuristic 9: Help Users Recognize, Diagnose, and Recover from Errors

> Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution.

### Why It Matters

Errors are inevitable. The quality of error handling directly impacts whether users can continue their task or abandon it in frustration.

### Error Message Formula

```
What happened + Why it happened + How to fix it
```

### Good Examples

| Bad | Good |
|-----|------|
| "Error 422" | "Email address is not valid. Please use format: name@example.com" |
| "Invalid input" | "Password must be at least 8 characters with one number" |
| "Something went wrong" | "Could not save — you appear to be offline. Changes will save when you reconnect." |
| "File upload failed" | "File too large (limit: 10MB). Try compressing the image or choosing a smaller file." |
| "Access denied" | "You need Editor permissions to edit this document. Contact the document owner to request access." |

### Violation Examples

- Raw HTTP status codes or database errors shown to users
- Generic "Something went wrong. Try again later." for every error
- Error text that disappears before the user can read it
- Error page with no way to navigate back
- Error messages conveyed only by color (red field, no text)
- Validation that shows all errors at once in a list at the top, far from the problematic fields

### Evaluation Questions

- Are error messages in plain language (no codes or jargon)?
- Do error messages identify specifically what went wrong?
- Do error messages explain how to fix the problem?
- Are error messages displayed near the relevant field/action?
- Are errors persistent enough for the user to read and act on?
- Can users recover from errors without losing their work?

---

## Heuristic 10: Help and Documentation

> It's best if the system doesn't need additional explanation. However, it may be necessary to provide documentation to help users understand how to complete their tasks.

### Why It Matters

Even well-designed systems sometimes need explanation. Good help content is contextual, concise, task-oriented, and findable exactly when users need it.

### Help Hierarchy

| Level | Type | Example |
|-------|------|---------|
| 1 | No help needed | Self-explanatory interface |
| 2 | Contextual hints | Tooltip, placeholder, helper text |
| 3 | Guided experience | Onboarding tour, wizard |
| 4 | Searchable docs | Help center, FAQ |
| 5 | Human support | Chat, email, phone |

### Good Examples

- Contextual tooltips next to complex form fields ("?" icon)
- Searchable help center organized by task, not product structure
- Interactive onboarding tour that highlights key features
- Keyboard shortcut cheatsheet (accessible via `?` key)
- Empty states with guidance ("No projects yet. Create your first project →")
- In-app help widget (search docs without leaving the app)

### Violation Examples

- No documentation at all for complex features
- Help docs that are outdated, inaccurate, or incomplete
- Lengthy user manual with no search or structure
- Help written for developers, not end users
- Documentation that requires leaving the app entirely
- Complex setup requiring extensive training with no getting-started guide

### Evaluation Questions

- Is help available in context, near where users encounter difficulty?
- Is help content searchable?
- Is help content task-oriented (how to accomplish X) vs feature-oriented (what X does)?
- Is there an onboarding experience for new users?
- Are keyboard shortcuts and hidden features documented?
- Can users get help without leaving their current workflow?

---

## Severity Rating Scale

Use this scale when documenting heuristic evaluation findings:

| Rating | Label | Description | Action |
|--------|-------|-------------|--------|
| 0 | Not a problem | Evaluator disagrees this is a usability problem | None |
| 1 | Cosmetic | Issue exists but is unlikely to cause user difficulty | Fix if time permits |
| 2 | Minor | Users can work around this with minor frustration | Schedule for fix |
| 3 | Major | Users encounter significant difficulty; some may fail | Fix before next release |
| 4 | Catastrophe | Users cannot complete the task; fundamental design flaw | Must fix immediately |

---

Author: Charley Scholz, ELEV8
Co-authored: Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-23
