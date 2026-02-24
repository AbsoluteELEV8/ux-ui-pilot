/**
 * @file wireframe-advisor.ts
 * @description Layout recommendations with information hierarchy, content zones, and ASCII wireframe sketches
 * @author Charley Scholz, ELEV8
 * @coauthor Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

import type { LLMClient } from '../core/llm-client.js';
import type {
  Capability,
  ContentZone,
  WireframeInput,
  WireframeOutput,
} from '../core/types.js';
import { UXPilotError } from '../core/types.js';

const SYSTEM_PROMPT = `You are a senior UX designer specializing in information architecture and layout design.

Given page/feature requirements, produce layout recommendations:

1. Information Hierarchy — ordered list of content by importance (level 1 = most important), with rationale
2. Content Zones — named regions with purpose, priority (1 = highest), suggested components, and placement description
3. Navigation Pattern — which pattern to use (sidebar, top nav, tabs, breadcrumbs, etc.), why, and what items to include
4. Responsive Strategy — for each breakpoint (mobile, tablet, desktop), specify layout changes
5. ASCII Wireframes — one per target device, using box-drawing characters:
   ┌─────────────────────┐
   │  HEADER / NAV       │
   ├─────┬───────────────┤
   │ SB  │  MAIN CONTENT │
   │     │               │
   ├─────┴───────────────┤
   │  FOOTER             │
   └─────────────────────┘

Keep wireframes clear with labeled zones. Use reasonable widths (60-80 chars for desktop, 30-40 for mobile).

Output valid JSON. No commentary outside JSON.`;

interface LLMWireframeResponse {
  informationHierarchy: Array<{
    level: number;
    content: string;
    rationale: string;
  }>;
  contentZones: ContentZone[];
  navigationPattern: {
    type: string;
    rationale: string;
    items: string[];
  };
  responsiveStrategy: Array<{
    breakpoint: string;
    layoutChanges: string[];
  }>;
  asciiWireframes: Record<string, string>;
}

export class WireframeAdvisorCapability implements Capability<WireframeInput, WireframeOutput> {
  readonly id = 'wireframe' as const;
  readonly name = 'Wireframe Advisor';
  readonly description = 'Produces layout recommendations with information hierarchy, content zones, and ASCII wireframe sketches';

  private readonly llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  async execute(input: WireframeInput): Promise<WireframeOutput> {
    this.validateInput(input);

    const userMessage = this.buildPrompt(input);
    const result = await this.llm.chatJSON<LLMWireframeResponse>(
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

  private validateInput(input: WireframeInput): void {
    if (!input.requirements?.trim()) {
      throw new UXPilotError(
        'requirements is required',
        'INVALID_INPUT',
        { field: 'requirements' },
      );
    }
  }

  private buildPrompt(input: WireframeInput): string {
    const parts = [
      `## Page Requirements`,
      '',
      input.requirements,
    ];

    if (input.pageType) {
      parts.push('', `Page type: ${input.pageType}`);
    }

    const devices = input.targetDevices ?? ['mobile', 'desktop'];
    parts.push('', `Target devices: ${devices.join(', ')}`);
    parts.push(`Create ASCII wireframes for: ${devices.join(', ')}`);

    if (input.additionalContext) {
      parts.push('', `## Additional Context`, '', input.additionalContext);
    }

    parts.push('');
    parts.push('Respond with JSON: {informationHierarchy, contentZones, navigationPattern, responsiveStrategy, asciiWireframes}');
    parts.push('asciiWireframes keys should be device names (e.g. "mobile", "desktop").');

    return parts.join('\n');
  }

  private generateReport(input: WireframeInput, data: LLMWireframeResponse): string {
    const lines: string[] = [
      '# Wireframe & Layout Recommendations',
      '',
      `**Page Type:** ${input.pageType ?? 'custom'}`,
      `**Target Devices:** ${(input.targetDevices ?? ['mobile', 'desktop']).join(', ')}`,
      '',
    ];

    lines.push('## Information Hierarchy');
    lines.push('');
    const sorted = [...data.informationHierarchy].sort((a, b) => a.level - b.level);
    for (const item of sorted) {
      lines.push(`${item.level}. **${item.content}** — ${item.rationale}`);
    }
    lines.push('');

    lines.push('## Content Zones');
    lines.push('');
    const zonesSorted = [...data.contentZones].sort((a, b) => a.priority - b.priority);
    for (const zone of zonesSorted) {
      lines.push(`### ${zone.name} (Priority ${zone.priority})`);
      lines.push('');
      lines.push(`**Purpose:** ${zone.purpose}`);
      lines.push(`**Placement:** ${zone.placement}`);
      lines.push(`**Components:** ${zone.suggestedComponents.join(', ')}`);
      lines.push('');
    }

    lines.push('## Navigation Pattern');
    lines.push('');
    lines.push(`**Type:** ${data.navigationPattern.type}`);
    lines.push('');
    lines.push(`**Rationale:** ${data.navigationPattern.rationale}`);
    lines.push('');
    lines.push('**Items:**');
    for (const item of data.navigationPattern.items) {
      lines.push(`- ${item}`);
    }
    lines.push('');

    lines.push('## Responsive Strategy');
    lines.push('');
    for (const strategy of data.responsiveStrategy) {
      lines.push(`### ${strategy.breakpoint}`);
      lines.push('');
      for (const change of strategy.layoutChanges) {
        lines.push(`- ${change}`);
      }
      lines.push('');
    }

    lines.push('## Wireframes');
    lines.push('');
    for (const [device, ascii] of Object.entries(data.asciiWireframes)) {
      lines.push(`### ${device.charAt(0).toUpperCase() + device.slice(1)}`);
      lines.push('');
      lines.push('```');
      lines.push(ascii);
      lines.push('```');
      lines.push('');
    }

    return lines.join('\n');
  }
}
