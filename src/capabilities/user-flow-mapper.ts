/**
 * @file user-flow-mapper.ts
 * @description Maps user flows with Mermaid diagrams, decision points, error states, and edge cases
 * @author Charley Scholz, JLAI
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

import type { LLMClient } from '../core/llm-client.js';
import type {
  Capability,
  FlowStep,
  UserFlowInput,
  UserFlowOutput,
} from '../core/types.js';
import { UXPilotError } from '../core/types.js';

const SYSTEM_PROMPT = `You are a UX researcher and information architect specializing in user flow analysis.

Given a feature description, produce a comprehensive user flow analysis:

1. Create a Mermaid flowchart diagram using flowchart TD syntax
2. Identify all entry points into the flow
3. Map the happy path (ideal user journey) as an ordered list of steps
4. Identify all decision points with their possible outcomes
5. Map error states with triggers, descriptions, and recovery paths
6. Identify edge cases with their handling strategies

Each flow step must have: id, label, type (start|action|decision|end|error), description.
Transitions between steps: from (id), to (id), label, optional condition.

The Mermaid diagram should use:
- Rounded rectangles for start/end
- Rectangles for actions
- Diamonds for decisions
- Hexagons for error states

Output valid JSON. No commentary outside JSON.`;

interface LLMFlowResponse {
  mermaidDiagram: string;
  entryPoints: string[];
  happyPath: FlowStep[];
  decisionPoints: Array<{
    step: FlowStep;
    options: string[];
  }>;
  errorStates: Array<{
    trigger: string;
    errorDescription: string;
    recoveryPath: string;
  }>;
  edgeCases: Array<{
    scenario: string;
    handling: string;
  }>;
}

export class UserFlowMapperCapability implements Capability<UserFlowInput, UserFlowOutput> {
  readonly id = 'user-flow' as const;
  readonly name = 'User Flow Mapping';
  readonly description = 'Maps complete user flows with Mermaid diagrams, decision points, error states, and edge cases';

  private readonly llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  async execute(input: UserFlowInput): Promise<UserFlowOutput> {
    this.validateInput(input);

    const userMessage = this.buildPrompt(input);
    const result = await this.llm.chatJSON<LLMFlowResponse>(
      SYSTEM_PROMPT,
      userMessage,
      { maxTokens: 8192 },
    );

    const markdownReport = this.generateReport(input, result);

    return {
      ...result,
      markdownReport,
    };
  }

  private validateInput(input: UserFlowInput): void {
    if (!input.featureDescription?.trim()) {
      throw new UXPilotError(
        'featureDescription is required',
        'INVALID_INPUT',
        { field: 'featureDescription' },
      );
    }
  }

  private buildPrompt(input: UserFlowInput): string {
    const parts = [
      `## Feature Description`,
      '',
      input.featureDescription,
    ];

    if (input.userPersona) {
      parts.push('', `## User Persona`, '', input.userPersona);
    }

    if (input.existingFlows) {
      parts.push('', `## Existing Flows`, '', input.existingFlows);
    }

    if (input.additionalContext) {
      parts.push('', `## Additional Context`, '', input.additionalContext);
    }

    parts.push('');
    parts.push('Respond with JSON: {mermaidDiagram, entryPoints, happyPath, decisionPoints, errorStates, edgeCases}');

    return parts.join('\n');
  }

  private generateReport(input: UserFlowInput, data: LLMFlowResponse): string {
    const lines: string[] = [
      '# User Flow Analysis',
      '',
      `## Feature: ${input.featureDescription.slice(0, 100)}${input.featureDescription.length > 100 ? '...' : ''}`,
      '',
    ];

    if (input.userPersona) {
      lines.push(`**Persona:** ${input.userPersona}`);
      lines.push('');
    }

    lines.push('## Flow Diagram');
    lines.push('');
    lines.push('```mermaid');
    lines.push(data.mermaidDiagram);
    lines.push('```');
    lines.push('');

    lines.push('## Entry Points');
    lines.push('');
    for (const ep of data.entryPoints) {
      lines.push(`- ${ep}`);
    }
    lines.push('');

    lines.push('## Happy Path');
    lines.push('');
    for (const [i, step] of data.happyPath.entries()) {
      const icon = this.stepIcon(step.type);
      lines.push(`${i + 1}. ${icon} **${step.label}** — ${step.description}`);
    }
    lines.push('');

    if (data.decisionPoints.length > 0) {
      lines.push('## Decision Points');
      lines.push('');
      for (const dp of data.decisionPoints) {
        lines.push(`### ◇ ${dp.step.label}`);
        lines.push('');
        lines.push(dp.step.description);
        lines.push('');
        lines.push('**Options:**');
        for (const opt of dp.options) {
          lines.push(`- ${opt}`);
        }
        lines.push('');
      }
    }

    if (data.errorStates.length > 0) {
      lines.push('## Error States');
      lines.push('');
      lines.push('| Trigger | Error | Recovery |');
      lines.push('|---------|-------|----------|');
      for (const es of data.errorStates) {
        lines.push(`| ${es.trigger} | ${es.errorDescription} | ${es.recoveryPath} |`);
      }
      lines.push('');
    }

    if (data.edgeCases.length > 0) {
      lines.push('## Edge Cases');
      lines.push('');
      for (const ec of data.edgeCases) {
        lines.push(`- **${ec.scenario}**: ${ec.handling}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  private stepIcon(type: FlowStep['type']): string {
    switch (type) {
      case 'start': return '▶';
      case 'action': return '●';
      case 'decision': return '◇';
      case 'end': return '■';
      case 'error': return '⚠';
    }
  }
}
