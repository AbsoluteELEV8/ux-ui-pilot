/**
 * @file component-architecture.ts
 * @description Analyzes and recommends component architecture with tree structure, props, state, and data flow
 * @author Charley Scholz, JLAI
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

import type { LLMClient } from '../core/llm-client.js';
import type {
  Capability,
  ComponentArchInput,
  ComponentArchOutput,
  ComponentSpec,
} from '../core/types.js';
import { UXPilotError } from '../core/types.js';

const SYSTEM_PROMPT = `You are an expert frontend architect specializing in component-based UI systems.

Analyze the given page, feature, or code and produce a comprehensive component architecture recommendation. You must:

1. Break the UI into a hierarchical component tree
2. Define a typed props interface for each component
3. Identify all local and shared state
4. Recommend composition patterns (compound components, render props, slots, etc.)
5. Produce a Mermaid data flow diagram showing how data moves between components
6. Include accessibility requirements for every component

Each component spec must include:
- name: PascalCase component name
- description: what it renders and why
- props: array of {name, type, required, defaultValue?, description}
- state: array of {name, type, initialValue, description}
- events: array of {name, payload, description}
- accessibilityRequirements: array of strings
- children: nested component specs (recursive)

Output valid JSON. No commentary outside JSON.`;

interface LLMComponentArchResponse {
  rootComponent: ComponentSpec;
  stateManagementApproach: string;
  compositionPatterns: string[];
  dataFlowDiagram: string;
}

export class ComponentArchCapability implements Capability<ComponentArchInput, ComponentArchOutput> {
  readonly id = 'component-architecture' as const;
  readonly name = 'Component Architecture';
  readonly description = 'Analyzes UI requirements and recommends component breakdown, props, state management, and data flow';

  private readonly llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  async execute(input: ComponentArchInput): Promise<ComponentArchOutput> {
    this.validateInput(input);

    const userMessage = this.buildPrompt(input);
    const structured = await this.llm.chatJSON<LLMComponentArchResponse>(
      SYSTEM_PROMPT,
      userMessage,
      { maxTokens: 8192 },
    );

    const markdownReport = this.generateReport(input, structured);

    return {
      rootComponent: structured.rootComponent,
      stateManagementApproach: structured.stateManagementApproach,
      compositionPatterns: structured.compositionPatterns,
      dataFlowDiagram: structured.dataFlowDiagram,
      markdownReport,
    };
  }

  private validateInput(input: ComponentArchInput): void {
    if (!input.description?.trim() && !input.existingCode?.trim()) {
      throw new UXPilotError(
        'Either description or existingCode is required',
        'INVALID_INPUT',
        { fields: ['description', 'existingCode'] },
      );
    }
  }

  private buildPrompt(input: ComponentArchInput): string {
    const parts: string[] = [];

    if (input.description) {
      parts.push(`## Feature / Page Description\n${input.description}`);
    }

    if (input.existingCode) {
      parts.push(`## Existing Code\n\`\`\`\n${input.existingCode}\n\`\`\``);
    }

    if (input.framework && input.framework !== 'agnostic') {
      parts.push(`Framework: ${input.framework}`);
    }

    if (input.additionalContext) {
      parts.push(`## Additional Context\n${input.additionalContext}`);
    }

    parts.push('');
    parts.push('Respond with JSON: {rootComponent, stateManagementApproach, compositionPatterns, dataFlowDiagram}');
    parts.push('dataFlowDiagram must be valid Mermaid flowchart syntax.');

    return parts.join('\n\n');
  }

  private generateReport(input: ComponentArchInput, data: LLMComponentArchResponse): string {
    const lines: string[] = [
      '# Component Architecture Analysis',
      '',
      `Framework: ${input.framework ?? 'agnostic'}`,
      '',
      '## Component Tree',
      '',
    ];

    this.renderComponentTree(data.rootComponent, lines, 0);

    lines.push('');
    lines.push('## State Management');
    lines.push('');
    lines.push(data.stateManagementApproach);
    lines.push('');

    lines.push('## Composition Patterns');
    lines.push('');
    for (const pattern of data.compositionPatterns) {
      lines.push(`- ${pattern}`);
    }
    lines.push('');

    lines.push('## Data Flow');
    lines.push('');
    lines.push('```mermaid');
    lines.push(data.dataFlowDiagram);
    lines.push('```');
    lines.push('');

    lines.push('## Component Specifications');
    lines.push('');
    this.renderComponentSpecs(data.rootComponent, lines);

    return lines.join('\n');
  }

  private renderComponentTree(spec: ComponentSpec, lines: string[], depth: number): void {
    const indent = '  '.repeat(depth);
    const propsCount = spec.props.length;
    const stateCount = spec.state.length;
    lines.push(`${indent}- **${spec.name}** (${propsCount} props, ${stateCount} state)`);
    for (const child of spec.children) {
      this.renderComponentTree(child, lines, depth + 1);
    }
  }

  private renderComponentSpecs(spec: ComponentSpec, lines: string[]): void {
    lines.push(`### ${spec.name}`);
    lines.push('');
    lines.push(spec.description);
    lines.push('');

    if (spec.props.length > 0) {
      lines.push('**Props:**');
      lines.push('');
      lines.push('| Name | Type | Required | Default | Description |');
      lines.push('|------|------|----------|---------|-------------|');
      for (const p of spec.props) {
        lines.push(`| \`${p.name}\` | \`${p.type}\` | ${p.required ? '✓' : '—'} | ${p.defaultValue ?? '—'} | ${p.description} |`);
      }
      lines.push('');
    }

    if (spec.state.length > 0) {
      lines.push('**State:**');
      lines.push('');
      for (const s of spec.state) {
        lines.push(`- \`${s.name}\` (\`${s.type}\`, initial: \`${s.initialValue}\`): ${s.description}`);
      }
      lines.push('');
    }

    if (spec.events.length > 0) {
      lines.push('**Events:**');
      lines.push('');
      for (const e of spec.events) {
        lines.push(`- \`${e.name}\` → \`${e.payload}\`: ${e.description}`);
      }
      lines.push('');
    }

    if (spec.accessibilityRequirements.length > 0) {
      lines.push('**Accessibility:**');
      lines.push('');
      for (const req of spec.accessibilityRequirements) {
        lines.push(`- ${req}`);
      }
      lines.push('');
    }

    for (const child of spec.children) {
      this.renderComponentSpecs(child, lines);
    }
  }
}
