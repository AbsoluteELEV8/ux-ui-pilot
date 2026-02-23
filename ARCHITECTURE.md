# Architecture — UX Pilot

This document describes the system architecture, module design, and extension patterns for UX Pilot.

---

## System Overview

UX Pilot is a **capability-based design agent** that routes user requests to specialized modules. Each capability combines:

1. **LLM reasoning** — Claude generates structured output via the Anthropic API
2. **Embedded knowledge** — Static reference data (WCAG, Nielsen, UI patterns, design tokens) injected into prompts
3. **Structured output** — JSON schemas and Markdown reports for consistent, parseable results

The system exposes two interfaces:

- **MCP (Model Context Protocol)** — For IDE integration (Cursor, Claude Desktop); tools are invoked by AI assistants
- **CLI** — For direct command-line use and scripting

---

## Core Modules

### UXPilot (Orchestrator)

**Location:** `src/core/ux-pilot.ts`

The main entry point for all capability execution. Responsibilities:

- **Lazy-load capabilities** — Modules are imported on first use to reduce startup time
- **Route by capability ID** — `execute(capabilityId, input)` dispatches to the correct module
- **Request analysis** — `analyzeRequest(request)` uses keyword matching to suggest capabilities (for future use)
- **Error handling** — Wraps capability errors in `UXPilotError` with codes (`INVALID_INPUT`, `LLM_ERROR`, `CAPABILITY_NOT_FOUND`, etc.)

### LLMClient

**Location:** `src/core/llm-client.ts`

Thin wrapper around the Anthropic SDK. Provides:

- `chat(systemPrompt, userMessage, options)` — Returns raw text
- `chatJSON<T>(systemPrompt, userMessage, options)` — Returns parsed JSON; strips markdown fences and validates

Configuration: `apiKey`, `model` (default: `claude-sonnet-4-20250514`), `maxTokens` (default: 8192).

### Capability Modules

| Capability | Module | Export |
|------------|--------|--------|
| design-system | `design-system.ts` | `DesignSystemCapability` |
| component-architecture | `component-architecture.ts` | `ComponentArchCapability` |
| accessibility-audit | `accessibility-audit.ts` | `AccessibilityAuditCapability` |
| user-flow | `user-flow-mapper.ts` | `UserFlowMapperCapability` |
| wireframe | `wireframe-advisor.ts` | `WireframeAdvisorCapability` |
| design-critique | `design-critique.ts` | `DesignCritiqueCapability` |

---

## Capability Interface Pattern

Every capability implements the `Capability<TInput, TOutput>` interface:

```typescript
export interface Capability<TInput, TOutput> {
  readonly id: CapabilityId;
  readonly name: string;
  readonly description: string;
  execute(input: TInput): Promise<TOutput>;
}
```

**Constructor:** Each capability receives an `LLMClient` instance. The orchestrator passes its shared client.

**Execution flow:**

1. Validate input (throw `UXPilotError` with `INVALID_INPUT` if invalid)
2. Build system prompt (include relevant knowledge base content)
3. Build user message (serialize input)
4. Call `llm.chat()` or `llm.chatJSON<T>()`
5. Post-process and return structured output (including `markdownReport` where applicable)

---

## Knowledge Base Architecture

Knowledge is **static and embedded** in TypeScript modules under `src/knowledge/`:

| File | Purpose |
|------|---------|
| `wcag-rules.ts` | WCAG 2.2 criteria with id, name, level, principle, description, techniques, failures |
| `nielsen-heuristics.ts` | 10 heuristics with id, name, description, goodExamples, violationExamples, evaluationQuestions |
| `ui-patterns.ts` | UI patterns with name, category, description, bestFor, accessibilityNotes, implementationHints |
| `design-tokens.ts` | Type scale ratios, spacing grids, color scale helpers, breakpoint templates |

Capabilities **import** these modules and **inject** relevant slices into prompts. There is no external database or API — all reference data lives in code for reproducibility and offline use.

---

## MCP Server Architecture

**Location:** `src/mcp/server.ts`

- **Transport:** `StdioServerTransport` — MCP communicates via stdin/stdout; the host (Cursor, Claude Desktop) spawns the process and pipes I/O
- **Tool registration:** `ListToolsRequestSchema` handler returns 6 tools with `name`, `description`, `inputSchema`
- **Tool execution:** `CallToolRequestSchema` handler:
  1. Maps tool name → capability ID
  2. Transforms MCP tool args → capability input (via `transformInput`)
  3. Instantiates `UXPilot` and calls `execute(capabilityId, input)`
  4. Returns result as text (Markdown or JSON string)
- **Environment:** Requires `ANTHROPIC_API_KEY`; optional `ANTHROPIC_MODEL` override

---

## CLI Architecture

**Location:** `src/cli/ux-pilot.ts`

- **Framework:** Commander with subcommands
- **Global options:** `--api-key`, `--model`, `--json`
- **Subcommands:** One per capability (`design-system`, `component-arch`, `a11y-audit`, `user-flow`, `wireframe`, `design-critique`)
- **File resolution:** Options like `--code` and `--html` accept file paths; content is read from disk if the path exists
- **Output:** Prints `markdownReport` by default; `--json` prints raw JSON

---

## Data Flow

```
Request (MCP tool call or CLI subcommand)
    │
    ▼
Transform input (MCP: tool args → capability input; CLI: options → capability input)
    │
    ▼
UXPilot.execute(capabilityId, input)
    │
    ▼
Load capability (lazy import if not cached)
    │
    ▼
Capability.execute(input)
    │
    ├─ Validate input
    ├─ Build system prompt (incl. knowledge base)
    ├─ Build user message
    ├─ LLMClient.chat / chatJSON
    └─ Post-process → structured output
    │
    ▼
Return result (Markdown report + JSON fields)
    │
    ▼
MCP: Return text content  |  CLI: Print to stdout
```

---

## Adding a New Capability

1. **Define types** in `src/core/types.ts`:
   - Add `CapabilityId` union member
   - Add `*Input` and `*Output` interfaces
   - Add entries to `CapabilityInputMap` and `CapabilityOutputMap`

2. **Implement capability** in `src/capabilities/<name>.ts`:
   - Export class implementing `Capability<TInput, TOutput>`
   - Constructor: `(llm: LLMClient)`
   - `execute(input)`: validate, build prompt, call LLM, return output

3. **Register in UXPilot** (`src/core/ux-pilot.ts`):
   - Add to `CAPABILITY_MODULES`
   - Add to `CAPABILITY_EXPORTS`
   - Add to `CAPABILITY_KEYWORDS` (for `analyzeRequest`)

4. **Add MCP tool** (`src/mcp/server.ts`):
   - Add `ToolDefinition` to `TOOLS`
   - Add `transformInput` case
   - Ensure `TOOL_CAPABILITY_MAP` includes the new tool

5. **Add CLI subcommand** (`src/cli/ux-pilot.ts`):
   - Add `program.command(...)` with options
   - Map options to capability input
   - Call `runCapability` and `printResult`

6. **Add knowledge** (if needed) in `src/knowledge/` and reference in the capability’s system prompt.

---

## Output Format Standards

### Markdown Report

Every capability that produces human-readable output includes a `markdownReport` string. It should:

- Use clear headings (##, ###)
- Include tables where appropriate
- Embed Mermaid diagrams when applicable (e.g. user-flow)
- Be self-contained and readable without the JSON

### JSON Structure

- Use camelCase for property names
- Include `markdownReport` for capabilities that generate reports
- Use typed arrays and objects; avoid `any`
- Preserve backward compatibility when extending schemas

---

Author: Charley Scholz, JLAI  
Co-authored: Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)  
Last Updated: 2026-02-23
