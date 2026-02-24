# UX UI Pilot — Project Overview

> **Version:** 0.1.0 | **Author:** Charley Scholz, ELEV8 | **Co-authored:** Claude 4.6 Opus

---

## Why It Exists

UX/UI design requires deep expertise across multiple domains: accessibility standards (WCAG 2.2), usability heuristics (Nielsen), information architecture, responsive design, component patterns, and design systems. Most developers and even many designers don't carry all of this knowledge simultaneously.

**UX UI Pilot** is an AI-powered design agent that can be called on demand to perform expert-level UX/UI analysis. It's not an app — it's a **tool** that integrates into your development workflow via MCP (Model Context Protocol) or CLI, bringing senior UX expertise directly into your IDE or terminal.

It was built as a **capability-based agent**: six focused modules, each specialized in one UX discipline, backed by embedded knowledge bases of real standards and heuristics. The agent doesn't guess — it references WCAG criteria by number, scores against Nielsen's 10 heuristics, and generates outputs with evidence and citations.

---

## How It Works

### Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 22+ (ESM) |
| Language | TypeScript 5.7 (strict mode) |
| LLM | Claude Sonnet via `@anthropic-ai/sdk` |
| MCP | `@modelcontextprotocol/sdk` (stdio transport) |
| CLI | Commander 12 + Chalk 5 + Ora 8 |
| Build | TypeScript compiler → `dist/` |

### Architecture

```
┌───────────────────────────────────────────────────┐
│              INTERFACE LAYER                        │
│    MCP Server (stdio)  │  CLI (Commander)           │
└────────────┬───────────┴────────────┬──────────────┘
             │                        │
             ▼                        ▼
┌───────────────────────────────────────────────────┐
│              UXPilot ORCHESTRATOR                    │
│         Lazy-loads + routes to capabilities          │
└────────────────────────┬──────────────────────────┘
                         │
    ┌──────┬──────┬──────┼──────┬──────┬──────┐
    ▼      ▼      ▼      ▼      ▼      ▼      │
 Design  Comp.  A11y   User   Wire-  Design   │
 System  Arch.  Audit  Flow   frame  Critique  │
    │      │      │      │      │      │       │
    └──────┴──────┴──────┼──────┴──────┴───────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        LLM Client           Knowledge Base
      (Claude API)         (WCAG, Nielsen,
                           Tokens, Patterns)
```

### Key Modules

| Module | Location | Purpose |
|--------|----------|---------|
| **UXPilot** | `src/core/ux-ui-pilot.ts` | Orchestrator — lazy-loads capabilities, routes requests |
| **LLMClient** | `src/core/llm-client.ts` | Claude API wrapper with JSON parsing and error handling |
| **Types** | `src/core/types.ts` | All shared interfaces, input/output types, error class |
| **6 Capabilities** | `src/capabilities/` | Specialized analysis modules (one per UX discipline) |
| **4 Knowledge Bases** | `src/knowledge/` | Static reference data: WCAG rules, Nielsen heuristics, design tokens, UI patterns |
| **MCP Server** | `src/mcp/server.ts` | Exposes 6 tools via MCP stdio protocol |
| **CLI** | `src/cli/ux-ui-pilot.ts` | 6 subcommands via Commander |

---

## The 6 Capabilities

### 1. Design System Generator

**What it does:** Generates a complete design token set from brand requirements — colors (10-stop scales), typography (modular scale), spacing (8-point grid), breakpoints, shadows, and border radii. Includes a contrast report and component inventory prioritized by necessity.

**Input:** Brand name, optional colors, typography preferences, target platform (web/mobile/both)

**Output:**
- Complete token set (colors with 10 shades each, type scale, spacing scale, breakpoints, shadows, radii)
- Contrast ratio report (foreground/background pairs with pass/fail)
- Recommended component inventory (sorted by priority: essential → nice-to-have)
- Formatted Markdown report

**Example:**
```bash
ux-ui-pilot design-system --colors "#1a73e8" "#ff5722" --typography "Inter" --platform web
```

---

### 2. Component Architecture

**What it does:** Analyzes a UI requirement or existing code and produces a hierarchical component breakdown with typed props, state management approach, composition patterns, and a Mermaid data flow diagram.

**Input:** Description of UI (or paste existing code), optional framework (React/Vue/Svelte/Angular/agnostic)

**Output:**
- Recursive component tree (root → children → grandchildren)
- Each component: props (typed), state, events, accessibility requirements
- State management recommendation
- Composition patterns used
- Mermaid data flow diagram
- Formatted Markdown report

**Example:**
```bash
ux-ui-pilot component-arch --description "User profile settings page with avatar, bio, and preferences" --framework React
```

---

### 3. Accessibility Audit (WCAG 2.2)

**What it does:** Audits UI code, HTML, or a description against WCAG 2.2 criteria at the specified level (A, AA, or AAA). Returns severity-ranked findings with specific criterion references, evidence, recommendations, and corrected code examples.

**Input:** Code file, HTML file, or text description + WCAG level (default: AA)

**Output:**
- Summary (total findings, critical/major/minor counts, passed criteria)
- Findings array: criterion ID, severity, issue description, evidence, recommendation, corrected code
- Formatted Markdown report

**Knowledge base:** Imports 50+ WCAG 2.2 rules from `wcag-rules.ts`, filtered by target level, and injects them into the system prompt so Claude audits against actual criteria.

**Example:**
```bash
ux-ui-pilot a11y-audit --code ./components/Button.tsx --standard WCAG2.2-AA
ux-ui-pilot a11y-audit --html ./page.html
ux-ui-pilot a11y-audit --description "Login form with email and password fields"
```

---

### 4. User Flow Mapper

**What it does:** Maps complete user flows with Mermaid flowcharts, decision points, error states with recovery paths, and edge cases. Considers the user persona when designing flows.

**Input:** Feature description, optional user persona, optional existing flows

**Output:**
- Mermaid flowchart diagram (start/end as rounded rects, actions as rects, decisions as diamonds, errors as hexagons)
- Entry points list
- Happy path (numbered steps)
- Decision points with options
- Error states with trigger, description, and recovery path
- Edge cases with handling strategy
- Formatted Markdown report

**Example:**
```bash
ux-ui-pilot user-flow --feature "User signs up and verifies email" --user-type "New visitor" --output flow.mmd
```

The `--output` flag saves the raw Mermaid diagram to a file for rendering.

---

### 5. Wireframe Advisor

**What it does:** Produces layout recommendations with information hierarchy, content zones, navigation patterns, responsive strategy, and ASCII wireframes for each target device.

**Input:** Feature requirements, optional page type (landing/dashboard/form/detail/list/settings), optional target devices

**Output:**
- Information hierarchy (ordered by importance with rationale)
- Content zones (name, purpose, priority, suggested components, placement)
- Navigation pattern recommendation (type, rationale, items)
- Responsive strategy (breakpoint → layout changes)
- ASCII wireframes (one per device, using box-drawing characters)
- Formatted Markdown report

**Example:**
```bash
ux-ui-pilot wireframe --feature "Dashboard with charts and activity feed" --platform desktop
```

**ASCII wireframe sample:**
```
┌──────────────────────────────────────────────────────────────┐
│ HEADER            [Logo]  [Search...]  [Profile ▼]           │
├──────────┬───────────────────────────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT                                     │
│          │  ┌─────────────┐  ┌─────────────┐                │
│ □ Home   │  │  Chart 1    │  │  Chart 2    │                │
│ □ Stats  │  │             │  │             │                │
│ □ Users  │  └─────────────┘  └─────────────┘                │
│ □ Config │  ┌───────────────────────────────┐                │
│          │  │  Activity Feed                │                │
│          │  │  ─ Event 1    10:30am         │                │
│          │  │  ─ Event 2     9:15am         │                │
│          │  └───────────────────────────────┘                │
└──────────┴───────────────────────────────────────────────────┘
```

---

### 6. Design Critique

**What it does:** Evaluates UI against Nielsen's 10 usability heuristics. Leads with strengths, identifies severity-rated issues (1=cosmetic to 4=catastrophe), scores each heuristic 0-10, and provides prioritized action items with effort/impact estimates.

**Input:** UI description, component code, or design spec

**Output:**
- Strengths (linked to specific heuristics)
- Issues array: heuristic ID, severity 1-4, issue, evidence, recommendation
- Heuristic scores (0-10 per heuristic, with visual bars)
- Priority actions (priority, action, impact, effort)
- Overall score (0-100, calculated from heuristic averages)
- Formatted Markdown report

**Knowledge base:** Imports all 10 Nielsen heuristics from `nielsen-heuristics.ts` with good examples, violation examples, and evaluation questions.

**Example:**
```bash
ux-ui-pilot design-critique --description "Checkout flow with 3 steps and progress indicator"
ux-ui-pilot design-critique --code ./CheckoutForm.tsx
```

---

## Knowledge Bases

The agent doesn't rely on Claude's training data alone. Four embedded knowledge bases provide authoritative reference material:

| Knowledge Base | File | Contents |
|----------------|------|----------|
| **WCAG 2.2 Rules** | `wcag-rules.ts` | 50+ criteria across 4 principles (Perceivable, Operable, Understandable, Robust) with techniques and common failures |
| **Nielsen Heuristics** | `nielsen-heuristics.ts` | 10 heuristics with good examples, violation examples, and evaluation questions |
| **Design Tokens** | `design-tokens.ts` | Type scale ratios, color scale generation, spacing scales, standard breakpoints, shadows, border radii |
| **UI Patterns** | `ui-patterns.ts` | 18+ patterns across 5 categories (navigation, forms, data display, feedback, layout) with accessibility notes |

Capabilities import relevant knowledge and inject it into their system prompts, ensuring Claude evaluates against real standards rather than approximations.

---

## End-to-End Workflow

### Via MCP (IDE Integration)

```
1. You (in Cursor): "Use UX Pilot to audit this component for accessibility"
                          │
2. Cursor sends MCP request → server.ts
   { name: "ux_accessibility_audit", arguments: { code: "..." } }
                          │
3. server.ts maps tool → capability ID
   Transforms MCP args → AccessibilityAuditInput
                          │
4. UXPilot.execute("accessibility-audit", input)
   Lazy-loads AccessibilityAuditCapability (cached after first use)
                          │
5. Capability validates input
   Builds system prompt (injects WCAG rules filtered by level)
   Calls llm.chatJSON<AccessibilityAuditOutput>(systemPrompt, userMessage)
                          │
6. LLMClient calls Claude API → parses JSON response
                          │
7. Capability generates markdownReport from structured data
                          │
8. Result returned through MCP → displayed in Cursor
```

### Via CLI

```
1. Terminal: ux-ui-pilot a11y-audit --code ./Button.tsx --standard WCAG2.2-AA
                          │
2. Commander parses args → resolves API key → reads file content
                          │
3. Maps CLI options → AccessibilityAuditInput
                          │
4. UXPilot.execute("accessibility-audit", input)
   (same flow as MCP from step 4 onward)
                          │
5. Prints markdownReport to stdout (or JSON with --json flag)
```

---

## Practical Example

**Scenario:** You're building a login form and want a full UX review.

### Step 1: Component Architecture

```bash
ux-ui-pilot component-arch --description "Login form with email, password, remember me, forgot password link, and social login buttons" --framework React
```

**Output includes:**
- Component tree: `LoginPage` → `LoginForm` → `EmailInput`, `PasswordInput`, `RememberMe`, `ForgotPasswordLink`, `SocialLoginGroup` → `SocialLoginButton`
- Props for each component (typed)
- State: `email`, `password`, `rememberMe`, `isSubmitting`, `errors`
- Mermaid data flow diagram
- Accessibility requirements per component (labels, ARIA attributes, focus management)

### Step 2: Accessibility Audit

```bash
ux-ui-pilot a11y-audit --description "Login form with email and password fields, remember me checkbox, forgot password link, Google and GitHub social login buttons" --standard WCAG2.2-AA
```

**Output includes:**
- Findings like: *WCAG 1.3.1 (Info and Relationships) — Major: Form inputs must have programmatically associated labels*
- Each finding with corrected code examples
- Pass/fail on criteria like 2.4.7 (Focus Visible), 3.3.2 (Labels or Instructions)

### Step 3: Design Critique

```bash
ux-ui-pilot design-critique --description "Login form: centered card on gradient background, email and password inputs with floating labels, 'Remember me' checkbox below, 'Forgot password?' link right-aligned, primary 'Sign In' button full-width, divider with 'or continue with', Google and GitHub buttons side by side"
```

**Output includes:**
- Heuristic scores (e.g., Error Prevention: 6/10, Consistency: 8/10)
- Strengths: "Clear visual hierarchy", "Familiar login pattern"
- Issues: "No visible password toggle (Flexibility: severity 2)", "Floating labels may confuse screen readers (Match: severity 3)"
- Priority actions ranked by impact/effort

---

## Two Interfaces

### MCP Server

Add to your MCP client config:

```json
{
  "mcpServers": {
    "ux-ui-pilot": {
      "command": "node",
      "args": ["C:/path/to/ux-ui-pilot/dist/mcp/server.js"],
      "env": { "ANTHROPIC_API_KEY": "sk-ant-..." }
    }
  }
}
```

**6 MCP tools registered:**

| Tool Name | Capability | Required Input |
|-----------|------------|----------------|
| `ux_design_system` | Design System | (none — brandColors optional) |
| `ux_component_architecture` | Component Arch | `description` |
| `ux_accessibility_audit` | A11y Audit | One of: `code`, `html`, `description` |
| `ux_user_flow` | User Flow | `feature` |
| `ux_wireframe` | Wireframe | `feature` |
| `ux_design_critique` | Design Critique | One of: `description`, `code` |

### CLI

```bash
npm run build
npm link  # or npx directly

ux-ui-pilot --help
ux-ui-pilot design-system --colors "#1a73e8" --platform web
ux-ui-pilot component-arch --description "..." --framework React
ux-ui-pilot a11y-audit --code ./Component.tsx --standard WCAG2.2-AA
ux-ui-pilot user-flow --feature "..." --user-type "..." --output flow.mmd
ux-ui-pilot wireframe --feature "..." --platform desktop
ux-ui-pilot design-critique --description "..."

# Global options
ux-ui-pilot --json ...     # Raw JSON output instead of Markdown
ux-ui-pilot --api-key ...  # Override ANTHROPIC_API_KEY
ux-ui-pilot --model ...    # Override default model
```

---

## LLM Configuration

| Setting | Default | Override |
|---------|---------|---------|
| Model | `claude-sonnet-4-20250514` | `ANTHROPIC_MODEL` env or `--model` CLI flag |
| Max Tokens | 8192 | Constructor option |
| Temperature | 0.3 | Per-request option |

All capabilities use `llm.chatJSON<T>()` which automatically strips markdown code fences from Claude's response before parsing.

---

## Design Decisions

- **Lazy-loading capabilities:** Only imported when first requested, keeping startup fast and memory low
- **Capability interface pattern:** Every capability implements the same `Capability<TInput, TOutput>` interface — makes adding new capabilities trivial
- **Embedded knowledge bases:** Static TypeScript modules (no database, no API calls) — reproducible, offline-capable, and version-controlled
- **Dual interface (MCP + CLI):** Same orchestrator serves both — no code duplication between interfaces
- **Structured output + Markdown reports:** Every capability returns both machine-readable JSON and human-readable Markdown

---

## File Structure

```
ux-ui-pilot/
├── src/
│   ├── core/
│   │   ├── types.ts                    # Shared types, Capability interface, UXPilotError
│   │   ├── llm-client.ts              # Claude API wrapper (chat, chatJSON)
│   │   └── ux-ui-pilot.ts             # Orchestrator (lazy-load, route, execute)
│   ├── capabilities/
│   │   ├── design-system.ts           # Design token generation
│   │   ├── component-architecture.ts  # Component breakdown + data flow
│   │   ├── accessibility-audit.ts     # WCAG 2.2 compliance audit
│   │   ├── user-flow-mapper.ts        # User flow + Mermaid diagrams
│   │   ├── wireframe-advisor.ts       # Layout + ASCII wireframes
│   │   └── design-critique.ts         # Nielsen heuristic evaluation
│   ├── knowledge/
│   │   ├── design-tokens.ts           # Type scales, color scales, spacing, breakpoints
│   │   ├── nielsen-heuristics.ts      # 10 usability heuristics with examples
│   │   ├── wcag-rules.ts             # 50+ WCAG 2.2 criteria with techniques
│   │   └── ui-patterns.ts            # 18+ UI patterns across 5 categories
│   ├── mcp/
│   │   └── server.ts                  # MCP server (stdio, 6 tools)
│   └── cli/
│       └── ux-ui-pilot.ts             # CLI (Commander, 6 subcommands)
├── package.json
├── tsconfig.json
├── README.md
├── ARCHITECTURE.md
├── CLAUDE.md
├── CHANGELOG.md
└── PROJECT_OVERVIEW.md                # ← You are here
```

---

## Setup & Configuration

```bash
git clone https://github.com/AbsoluteELEV8/ux-ui-pilot.git
cd ux-ui-pilot
npm install
cp .env.example .env
# Set ANTHROPIC_API_KEY in .env
npm run build
npm run cli -- --help
# or: npm run mcp (for MCP server mode)
```

**Required:** `ANTHROPIC_API_KEY` — used by the LLM client for all Claude API calls.

---

**Author:** Charley Scholz, ELEV8
**Co-authored:** Claude 4.6 Opus (AI), Cursor (IDE)
**Last Updated:** 2026-02-24
