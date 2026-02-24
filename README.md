# UX Pilot — Your on-demand UX/UI design agent

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D22-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org)
[![MCP](https://img.shields.io/badge/MCP-enabled-purple.svg)](https://modelcontextprotocol.io)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](LICENSE)

**UX Pilot** is a specialized AI design agent you can call from any project via **MCP** (Model Context Protocol) or **CLI**. It provides expert UX/UI guidance powered by Claude, backed by embedded knowledge bases for design systems, accessibility, and usability heuristics.

---

## What It Does

UX Pilot acts as your on-demand design consultant. Invoke it from Cursor, Claude Desktop, or the command line to:

- Generate design systems with tokens, typography, and color palettes
- Analyze component architecture and recommend composition patterns
- Run accessibility audits against WCAG 2.2
- Map user flows with Mermaid diagrams
- Produce wireframe recommendations with ASCII layouts
- Critique designs using Nielsen's usability heuristics

---

## Capabilities

| Capability | Description |
|------------|-------------|
| **Design System Generator** | Creates comprehensive design token sets (colors, typography, spacing, breakpoints, shadows, radii) with WCAG contrast reports and component inventory |
| **Component Architecture** | Breaks down UI into reusable components with props, state, events, and data flow diagrams |
| **Accessibility Audit (WCAG 2.2)** | Audits code or HTML against WCAG A/AA/AAA, identifies issues, and suggests fixes with code examples |
| **User Flow Mapper** | Maps user journeys with Mermaid diagrams, happy paths, decision points, error states, and edge cases |
| **Wireframe Advisor** | Recommends layout structure, content zones, navigation patterns, and ASCII wireframes for web/mobile/tablet |
| **Design Critique (Nielsen Heuristics)** | Evaluates designs against 10 Nielsen heuristics — visibility, consistency, error prevention, and more |

---

## Quick Start — MCP Setup

Add UX Pilot to your MCP configuration so your IDE or Claude Desktop can call it.

### Cursor

Add to `.cursor/mcp.json` or Cursor Settings → MCP:

```json
{
  "mcpServers": {
    "ux-pilot": {
      "command": "node",
      "args": ["C:/path/to/ux-pilot/dist/mcp/server.js"],
      "env": {
        "ANTHROPIC_API_KEY": "<your-api-key>"
      }
    }
  }
}
```

### Claude Desktop

Add to your Claude config (e.g. `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "ux-pilot": {
      "command": "node",
      "args": ["C:/path/to/ux-pilot/dist/mcp/server.js"],
      "env": {
        "ANTHROPIC_API_KEY": "<your-api-key>"
      }
    }
  }
}
```

**Requirements:** `ANTHROPIC_API_KEY` must be set. Run `npm run build` in the ux-pilot directory first.

---

## Quick Start — CLI

```bash
# Install globally (from ux-pilot directory)
npm install -g .

# Or run via npx
npx ux-pilot --help
```

Set `ANTHROPIC_API_KEY` or pass `--api-key <key>`.

---

## CLI Examples

```bash
# Design system with brand colors and typography
ux-pilot design-system --colors "#1a73e8" "#ff5722" --typography "Inter" --platform web

# Component architecture for a feature
ux-pilot component-arch --description "User profile settings page with avatar, bio, and preferences" --framework React

# Accessibility audit (code, HTML, or description)
ux-pilot a11y-audit --code ./components/Button.tsx --standard WCAG2.2-AA
ux-pilot a11y-audit --html ./page.html
ux-pilot a11y-audit --description "Login form with email and password fields"

# User flow with Mermaid output
ux-pilot user-flow --feature "User signs up and verifies email" --user-type "New visitor" --output flow.mmd

# Wireframe recommendations
ux-pilot wireframe --feature "Dashboard with charts and activity feed" --platform desktop

# Design critique
ux-pilot design-critique --description "Checkout flow with 3 steps and progress indicator"
ux-pilot design-critique --code ./CheckoutForm.tsx
```

Use `--json` for raw JSON output instead of formatted Markdown.

---

## MCP Tool Reference

| Tool | Description | Input Schema |
|------|-------------|--------------|
| `ux_design_system` | Generate design system with tokens, typography, spacing, colors | `brandColors` (string[]), `typography` (string), `targetPlatform` (web\|ios\|android\|cross-platform), `requirements` (string) |
| `ux_component_architecture` | Analyze component architecture | `description` (required), `code` (string), `framework` (string) |
| `ux_accessibility_audit` | Run WCAG accessibility audit | `code`, `html`, or `description`; `standard` (WCAG2.0-A through WCAG2.2-AA) |
| `ux_user_flow` | Map user flows with Mermaid | `feature` (required), `userType`, `context` |
| `ux_wireframe` | Generate wireframe recommendations | `feature` (required), `platform` (web\|mobile\|tablet\|desktop), `constraints` |
| `ux_design_critique` | Critique using Nielsen heuristics | `description`, `code`, or `screenshot` (base64/URL) |

---

## Architecture Overview

- **UXPilot** — Orchestrator that routes requests to capabilities via lazy-loaded modules
- **LLMClient** — Claude API wrapper (Anthropic SDK) with structured JSON output
- **6 Capability modules** — Each implements `Capability<TInput, TOutput>` and uses the knowledge base
- **Knowledge base** — Static references (WCAG rules, Nielsen heuristics, UI patterns, design tokens) embedded in code
- **MCP server** — stdio transport, 6 tools registered
- **CLI** — Commander subcommands for each capability

---

## Knowledge Base

| Source | Contents |
|--------|----------|
| **WCAG 2.2** | 50+ criteria with techniques and common failures (Perceivable, Operable, Understandable, Robust) |
| **Nielsen Heuristics** | 10 usability heuristics with examples, violations, and evaluation questions |
| **UI Patterns** | 18+ patterns (navigation, forms, data display, feedback, layout) with accessibility notes |
| **Design Tokens** | Type scale ratios, spacing grids, color scale templates, breakpoint conventions |

---

## Tech Stack

- **Runtime:** Node.js 22+
- **Language:** TypeScript 5.7 (strict mode)
- **LLM:** Claude (Anthropic SDK)
- **MCP:** @modelcontextprotocol/sdk (stdio transport)
- **CLI:** Commander, Chalk, Ora

---

## Project Structure

```
ux-pilot/
├── src/
│   ├── core/
│   │   ├── ux-pilot.ts      # Orchestrator
│   │   ├── llm-client.ts   # Claude wrapper
│   │   └── types.ts        # Shared types, Capability interface
│   ├── capabilities/
│   │   ├── design-system.ts
│   │   ├── component-architecture.ts
│   │   ├── accessibility-audit.ts
│   │   ├── user-flow-mapper.ts
│   │   ├── wireframe-advisor.ts
│   │   └── design-critique.ts
│   ├── knowledge/
│   │   ├── wcag-rules.ts
│   │   ├── nielsen-heuristics.ts
│   │   ├── ui-patterns.ts
│   │   └── design-tokens.ts
│   ├── mcp/
│   │   └── server.ts       # MCP server
│   └── cli/
│       └── ux-pilot.ts    # CLI entry
├── dist/                   # Build output
├── package.json
├── tsconfig.json
└── README.md
```

---

## License

MIT

---

## Author

**Charley Scholz**, ELEV8  
Co-authored: Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)  
Last Updated: 2026-02-23
