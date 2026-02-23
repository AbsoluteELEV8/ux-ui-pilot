---
name: design-critique
description: Evaluate designs using Nielsen's usability heuristics with structured feedback. Use when reviewing UI mockups, design specs, screenshots, component implementations, or when the user asks for design feedback or critique.
---

# Design Critique

Perform structured design critiques using Nielsen's 10 usability heuristics as the evaluation framework. Outputs evidence-based findings with severity rankings, organized in a constructive format that leads with strengths before addressing issues.

---

## Evaluation Framework: Nielsen's 10 Heuristics

| # | Heuristic | What to Evaluate |
|---|---|---|
| H1 | **Visibility of System Status** | Loading indicators, progress bars, active states, confirmation feedback, real-time updates |
| H2 | **Match Between System and Real World** | Language clarity, metaphor accuracy, natural information ordering, culturally appropriate icons |
| H3 | **User Control and Freedom** | Undo/redo, cancel actions, back navigation, escape hatches, non-destructive defaults |
| H4 | **Consistency and Standards** | Platform conventions, internal consistency, established patterns (e.g., trash icon = delete) |
| H5 | **Error Prevention** | Confirmation dialogs for destructive actions, input constraints, smart defaults, inline validation |
| H6 | **Recognition Rather Than Recall** | Visible options, contextual help, recently used items, search with suggestions |
| H7 | **Flexibility and Efficiency of Use** | Keyboard shortcuts, customization, bulk actions, expert shortcuts, progressive disclosure |
| H8 | **Aesthetic and Minimalist Design** | Information density, visual hierarchy, whitespace, removal of unnecessary elements |
| H9 | **Help Users Recognize and Recover from Errors** | Error message clarity, suggested fixes, non-blaming language, path to resolution |
| H10 | **Help and Documentation** | Tooltips, onboarding, contextual help, documentation links, empty state guidance |

---

## Critique Process

### Step 1: Understand Context

Before critiquing, establish:
- **What is this?** — Component, page, feature, flow?
- **Who is it for?** — User persona, expertise level, context of use
- **What's the goal?** — Primary task the user is trying to accomplish
- **What platform?** — Web, mobile, desktop, responsive?
- **What stage?** — Wireframe, mockup, prototype, production code?

### Step 2: Identify Strengths (Praise Pattern)

**Always start with what works well.** Effective critique builds trust by demonstrating that you see the whole picture, not just problems.

Identify 3–5 specific strengths:

```markdown
## What Works Well

### ✅ Clear Visual Hierarchy
The heading sizes and weight progression effectively guide the eye from the page title
through section headers to body content. The primary CTA stands out through both color
and size contrast.

### ✅ Consistent Interaction Patterns
All form inputs follow the same pattern: label above, helper text below, error state
inline. This consistency reduces cognitive load as users move through the form.
```

Rules for praise:
- Be **specific** — cite the exact element or pattern
- Explain **why** it works — connect to a heuristic or UX principle
- Be **genuine** — don't manufacture praise for weak areas

### Step 3: Evaluate Against Heuristics

Walk through each of the 10 heuristics systematically. For each:
1. Look for violations
2. Assess severity
3. Document evidence
4. Formulate recommendation

Skip heuristics with no findings (don't pad the report with "no issues found" for each).

### Step 4: Assess Accessibility

Layer accessibility evaluation on top of heuristic analysis:
- Color contrast of all text and interactive elements
- Keyboard navigability of the entire interface
- Screen reader compatibility (semantic structure, ARIA)
- Touch target sizes (mobile)
- Motion/animation considerations (prefers-reduced-motion)

Reference the accessibility skill (`.claude/skills/accessibility/SKILL.md`) for the full WCAG checklist when a deep audit is requested.

### Step 5: Compile Findings

---

## Finding Format

Each finding follows this structure:

```markdown
### [SEVERITY] Finding Title

- **Heuristic**: H# — <Heuristic Name>
- **Element**: <What element or area is affected>
- **Evidence**: <What you observed — be specific>
- **Impact**: <How this affects users>
- **Recommendation**: <Specific, actionable fix>
- **Priority**: <Must fix / Should fix / Nice to have>
```

### Severity Scale

| Level | Label | Criteria |
|---|---|---|
| 🔴 **Critical** | Usability blocker | Prevents task completion; users will abandon |
| 🟡 **Major** | Significant friction | Users can complete task but with difficulty or frustration |
| 🟢 **Minor** | Polish issue | Users notice but are not significantly impacted |
| 💡 **Suggestion** | Enhancement | Not a problem, but an opportunity to delight |

---

## Analysis Approaches

### For Screenshots or Mockups

1. **Visual scan** — Squint test: does the hierarchy work at a glance?
2. **Information architecture** — Is content grouped logically? Can users find what they need?
3. **Interaction inference** — What would clicking/tapping elements do? Is it obvious?
4. **Responsive consideration** — How would this work on a smaller/larger screen?
5. **Accessibility surface** — Visible contrast issues, text sizes, touch target sizes

### For Component Code

1. **Semantic HTML** — Correct elements used? (`<button>` not `<div onClick>`)
2. **State management** — All states handled? (default, hover, focus, active, disabled, error, loading, empty)
3. **ARIA correctness** — Appropriate roles, labels, live regions
4. **Keyboard behavior** — Tab order, Enter/Space activation, Escape dismissal
5. **Responsive implementation** — Breakpoint behavior, flexible layouts, no fixed widths

### For User Flows

1. **Task efficiency** — Minimum steps to complete?
2. **Error recovery** — Can users fix mistakes without restarting?
3. **Progressive disclosure** — Is complexity revealed as needed?
4. **Feedback loops** — Does the user know what happened at each step?
5. **Exit strategies** — Can users leave and return without losing progress?

---

## Output Format

### Markdown Report

```markdown
# Design Critique: <Component/Page/Feature Name>

**Evaluator**: UX Pilot
**Date**: YYYY-MM-DD
**Context**: <Brief description of what was evaluated and for whom>

---

## What Works Well

### ✅ <Strength 1>
<Specific description of what works and why>

### ✅ <Strength 2>
<Specific description of what works and why>

### ✅ <Strength 3>
<Specific description of what works and why>

---

## Findings

### 🔴 [CRITICAL] <Finding Title>
- **Heuristic**: H# — <Name>
- **Element**: `<selector or description>`
- **Evidence**: <What you observed>
- **Impact**: <Effect on users>
- **Recommendation**: <Specific fix>

### 🟡 [MAJOR] <Finding Title>
...

### 🟢 [MINOR] <Finding Title>
...

### 💡 [SUGGESTION] <Finding Title>
...

---

## Summary

| Severity | Count |
|---|---|
| 🔴 Critical | X |
| 🟡 Major | X |
| 🟢 Minor | X |
| 💡 Suggestion | X |

## Priority Actions

1. <Most important fix — what to do first>
2. <Second priority>
3. <Third priority>
```

### JSON Report

```json
{
  "critique": {
    "target": "<name>",
    "date": "YYYY-MM-DD",
    "context": "<description>",
    "strengths": [
      {
        "title": "Clear Visual Hierarchy",
        "description": "...",
        "heuristic": "H8"
      }
    ],
    "findings": [
      {
        "severity": "critical",
        "title": "...",
        "heuristic": "H1",
        "heuristicName": "Visibility of System Status",
        "element": "...",
        "evidence": "...",
        "impact": "...",
        "recommendation": "...",
        "priority": "must_fix"
      }
    ],
    "summary": {
      "critical": 1,
      "major": 2,
      "minor": 1,
      "suggestion": 3
    },
    "priorityActions": ["...", "...", "..."]
  }
}
```

---

## Quality Checks

Before returning output, verify:

- [ ] Strengths section comes before findings (praise first)
- [ ] At least 2 genuine strengths identified (or explain why none apply)
- [ ] Every finding cites a specific heuristic
- [ ] Every finding includes evidence (not just opinion)
- [ ] Every finding has an actionable recommendation
- [ ] Findings are ordered by severity (critical → major → minor → suggestion)
- [ ] Accessibility is addressed (either inline or as a separate section)
- [ ] Summary table accurately counts findings
- [ ] Priority actions are specific and ordered by impact
- [ ] Tone is constructive — critique the design, not the designer

---

Author: Charley Scholz, JLAI
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-23
