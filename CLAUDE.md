# CLAUDE.md — UX Pilot AI Guidelines

## Project Identity

**UX Pilot** is a specialized UX/UI design agent that can be called into action from any project. It provides actionable design guidance, not rendered UI — all outputs are structured Markdown or JSON consumed by developers, designers, or other AI agents.

### Capabilities

| Capability | Description |
|---|---|
| **Design System Generation** | Brand-aligned token sets (color, type, spacing, breakpoints, shadows) |
| **Accessibility Auditing** | WCAG 2.2 AA compliance analysis with severity-ranked findings |
| **User Flow Mapping** | Mermaid flowcharts with happy paths, error states, and edge cases |
| **Component Architecture** | Structured component specs with props, states, and a11y requirements |
| **Design Critique** | Nielsen heuristic evaluation with evidence-based recommendations |
| **Wireframing Guidance** | Layout recommendations and information hierarchy analysis |

### Invocation Modes

- **MCP Server** — callable from Cursor, Claude Code, or any MCP-compatible client
- **CLI** — `ux-pilot <command>` for terminal-based usage

---

## Quick Facts

| Aspect | Value |
|---|---|
| **Runtime** | Node.js 22 |
| **Language** | TypeScript 5.9+ (strict mode, ESM) |
| **MCP SDK** | `@modelcontextprotocol/sdk` ^1.0.0 |
| **LLM SDK** | `@anthropic-ai/sdk` ^0.39.0 |
| **CLI** | `commander` ^12.1.0 |
| **Output** | `chalk` ^5.3.0, `ora` ^8.1.0 |
| **Module System** | ESM (`"type": "module"` in package.json) |
| **Build** | `tsc` → `dist/` |

---

## Session Startup Protocol

Every session begins with these reads, in order:

1. **Read `CLAUDE.md`** (this file) — project context and rules
2. **Read `tasks/todo.md`** — current work items and priorities
3. **Read `tasks/lessons.md`** — accumulated corrections and patterns
4. **Scan `.cursor/rules/`** — active enforcement rules
5. **Check open files/context** — understand what the developer is working on

---

## Things You MUST Do

1. **TypeScript strict mode** — `strict: true` in tsconfig, no exceptions
2. **Explicit return types** on all exported functions and public methods
3. **Each capability is a standalone module** — own directory under `src/capabilities/`, own class with a standard `execute()` method
4. **All outputs are structured** — Markdown (for human consumption) or JSON (for programmatic consumption), never raw text dumps
5. **MCP tools have clear JSON schemas** — every tool parameter has a type, description, and validation
6. **Custom error class** — use `UXPilotError` with error codes and context, never throw raw strings
7. **Import ordering** — Node built-ins → third-party → local modules → type imports
8. **Kebab-case filenames** — `design-system.ts`, not `designSystem.ts`
9. **Update `tasks/todo.md`** when starting or completing work
10. **Update `tasks/lessons.md`** after any correction from the user

---

## Things to NEVER Do

1. **NEVER use `any` type** — use `unknown` + type guards, generics, or proper interfaces
2. **NEVER hardcode design values** — all design tokens must be configurable input, not baked-in constants
3. **NEVER render UI** — UX Pilot produces *guidance*, not pixels. No React, no HTML rendering, no screenshots
4. **NEVER use `console.log`** — use structured output through the CLI formatter or MCP response
5. **NEVER commit API keys** — use environment variables via `.env` (see `.env.example`)
6. **NEVER skip accessibility** — every component spec must include a11y requirements
7. **NEVER use CommonJS** — this is an ESM project (`import`/`export` only)
8. **NEVER use default exports** — named exports only for grep-ability and refactoring safety

---

## Common Tasks

### Add a New Capability

1. Create `src/capabilities/<name>/` directory
2. Create `<name>.ts` with a class implementing the `Capability` interface
3. Add an `execute(input: <Name>Input): Promise<<Name>Output>` method
4. Register the capability in `src/core/registry.ts`
5. Add MCP tool definition in `src/mcp/tools/<name>.ts`
6. Add CLI command in `src/cli/commands/<name>.ts`
7. Add skill file in `.claude/skills/<name>/SKILL.md`

### Update WCAG Rules

1. Edit the knowledge base in `src/knowledge/wcag/`
2. Update criterion definitions with the latest WCAG 2.2 spec
3. Ensure the accessibility capability picks up new rules
4. Add test cases for new criteria

### Extend the MCP Server

1. Define tool schema in `src/mcp/tools/`
2. Register tool in `src/mcp/server.ts`
3. Each tool maps to exactly one capability's `execute()` method
4. Validate inputs against JSON Schema before execution

### Run the Project

```bash
# Build
npm run build

# Start MCP server
npm run mcp

# Use CLI
npm run cli -- design-system --colors "#1a1a2e,#16213e,#0f3460,#e94560"

# Type-check without emitting
npm run type-check
```

---

## Architecture Overview

```
Request Flow:
  invoke (MCP tool call or CLI command)
    → parse & validate input
      → route to capability module
        → capability queries knowledge base (WCAG rules, heuristics, token schemas)
          → capability produces structured output
            → format response (Markdown for humans, JSON for machines)
              → return via MCP response or CLI stdout
```

### Directory Structure

```
ux-pilot/
├── CLAUDE.md                    ← you are here
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── core/                    ← orchestration, registry, shared types
│   │   └── ux-pilot.ts
│   ├── capabilities/            ← standalone capability modules
│   │   ├── design-system/
│   │   ├── accessibility/
│   │   ├── user-flows/
│   │   ├── component-arch/
│   │   ├── design-critique/
│   │   └── wireframing/
│   ├── knowledge/               ← reference data (WCAG rules, heuristics, token schemas)
│   ├── mcp/                     ← MCP server and tool definitions
│   │   ├── server.ts
│   │   └── tools/
│   └── cli/                     ← commander-based CLI
│       ├── ux-pilot.ts
│       └── commands/
├── tasks/
│   ├── todo.md
│   └── lessons.md
├── references/                  ← external specs, guidelines
├── .cursor/
│   ├── rules/                   ← enforcement rules (*.mdc)
│   └── agents/                  ← subagent definitions
└── .claude/
    └── skills/                  ← domain skills (*/SKILL.md)
        ├── design-system/
        ├── accessibility/
        ├── user-flows/
        └── design-critique/
```

---

## AI Development Tooling

### IDE & Agents

| Tool | Role |
|---|---|
| **Cursor** | Primary IDE with AI-assisted editing and rule enforcement |
| **Claude Code** | Terminal-based AI agent for autonomous multi-step tasks |
| **MCP Protocol** | Standardized tool interface — UX Pilot *is* an MCP server |

### The 4 .md Pattern

This project follows the **4 .md File Pattern** for AI-assisted development:

| File | Location | Purpose |
|---|---|---|
| `CLAUDE.md` | Project root | Project brain — AI reads first every session |
| `*.mdc` rules | `.cursor/rules/` | Automatic enforcement of standards |
| `SKILL.md` files | `.claude/skills/*/` | Domain expertise loaded on demand |
| Agent definitions | `.cursor/agents/` | Specialized subagent workflows |

### Session Continuity

- `tasks/todo.md` — persistent task tracking across sessions
- `tasks/lessons.md` — accumulated corrections and patterns, reviewed at session start

---

Author: Charley Scholz, ELEV8
Co-authored: Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
Last Updated: 2026-02-23
