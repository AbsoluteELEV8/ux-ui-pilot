/**
 * @file design-system.ts
 * @description Generates complete design token sets from brand requirements
 * @author Charley Scholz, ELEV8
 * @coauthor Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

import type { LLMClient } from '../core/llm-client.js';
import type {
  Capability,
  DesignSystemInput,
  DesignSystemOutput,
  DesignTokens,
} from '../core/types.js';
import { UXPilotError } from '../core/types.js';

const SYSTEM_PROMPT = `You are an expert design systems engineer. You create production-quality design token sets that follow industry best practices.

Given brand requirements, produce a complete design token system. You must:
1. Generate color palettes with 10-stop scales (50, 100, 200, 300, 400, 500, 600, 700, 800, 900) for each color family
2. Calculate WCAG contrast ratios for each color against white (#FFFFFF) and black (#000000)
3. Create a typography scale using the requested ratio
4. Define an 8-point grid spacing system (with 4px half-step)
5. Set responsive breakpoints
6. Define elevation/shadow tokens
7. Define border-radius tokens
8. Recommend a component inventory prioritized by necessity

Output valid JSON matching the exact schema requested. No commentary outside JSON.`;

interface LLMDesignSystemResponse {
  tokens: DesignTokens;
  contrastReport: DesignSystemOutput['contrastReport'];
  componentInventory: DesignSystemOutput['componentInventory'];
}

export class DesignSystemCapability implements Capability<DesignSystemInput, DesignSystemOutput> {
  readonly id = 'design-system' as const;
  readonly name = 'Design System Generation';
  readonly description = 'Generates brand-aligned design token sets with color, typography, spacing, and component inventory';

  private readonly llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  async execute(input: DesignSystemInput): Promise<DesignSystemOutput> {
    this.validateInput(input);

    const userMessage = this.buildPrompt(input);
    const structured = await this.llm.chatJSON<LLMDesignSystemResponse>(
      SYSTEM_PROMPT,
      userMessage,
      { maxTokens: 8192 },
    );

    const markdownReport = this.generateReport(input, structured);

    return {
      tokens: structured.tokens,
      contrastReport: structured.contrastReport,
      componentInventory: structured.componentInventory,
      markdownReport,
    };
  }

  private validateInput(input: DesignSystemInput): void {
    if (!input.brandName?.trim()) {
      throw new UXPilotError(
        'brandName is required',
        'INVALID_INPUT',
        { field: 'brandName' },
      );
    }
  }

  private buildPrompt(input: DesignSystemInput): string {
    const parts = [
      `Brand: ${input.brandName}`,
    ];

    if (input.colors?.length) {
      parts.push(`Brand colors: ${input.colors.join(', ')}`);
    }

    if (input.typographyPreferences) {
      const tp = input.typographyPreferences;
      if (tp.headingFont) parts.push(`Heading font: ${tp.headingFont}`);
      if (tp.bodyFont) parts.push(`Body font: ${tp.bodyFont}`);
      if (tp.monoFont) parts.push(`Mono font: ${tp.monoFont}`);
      if (tp.scaleRatio) parts.push(`Type scale ratio: ${tp.scaleRatio}`);
    }

    if (input.targetPlatform) {
      parts.push(`Target platform: ${input.targetPlatform}`);
    }

    if (input.additionalContext) {
      parts.push(`Additional context: ${input.additionalContext}`);
    }

    parts.push('');
    parts.push('Respond with a JSON object containing:');
    parts.push('- "tokens": full design tokens object (colors with primary/secondary/neutral/semantic, typography, spacing, breakpoints, shadows, borderRadii)');
    parts.push('- "contrastReport": array of {foreground, background, ratio, passesAA, passesAAA, passesAALargeText} for key color pairs');
    parts.push('- "componentInventory": array of {name, category, priority: "essential"|"recommended"|"optional", description}');
    parts.push('');
    parts.push('Color scales must have stops: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900');
    parts.push('Each stop: {shade, hex, hsl, contrastOnWhite, contrastOnBlack}');

    return parts.join('\n');
  }

  private generateReport(input: DesignSystemInput, data: LLMDesignSystemResponse): string {
    const lines: string[] = [
      `# Design System: ${input.brandName}`,
      '',
      '## Overview',
      '',
      `Platform: ${input.targetPlatform ?? 'web'}`,
      '',
      '## Color Palette',
      '',
    ];

    const colorFamilies = [
      { label: 'Primary', scale: data.tokens.colors.primary },
      { label: 'Secondary', scale: data.tokens.colors.secondary },
      { label: 'Neutral', scale: data.tokens.colors.neutral },
    ];

    for (const { label, scale } of colorFamilies) {
      lines.push(`### ${label} (${scale.name})`);
      lines.push('');
      lines.push('| Shade | Hex | Contrast (white) | Contrast (black) |');
      lines.push('|-------|-----|-------------------|-------------------|');
      for (const stop of scale.stops) {
        lines.push(`| ${stop.shade} | ${stop.hex} | ${stop.contrastOnWhite.toFixed(2)}:1 | ${stop.contrastOnBlack.toFixed(2)}:1 |`);
      }
      lines.push('');
    }

    lines.push('### Semantic Colors');
    lines.push('');
    for (const [name, scale] of Object.entries(data.tokens.colors.semantic)) {
      lines.push(`- **${name}**: ${(scale as { stops: Array<{ hex: string }> }).stops[5]?.hex ?? 'N/A'} (500)`);
    }
    lines.push('');

    lines.push('## Typography Scale');
    lines.push('');
    lines.push('| Token | Size | Weight | Line Height | Family |');
    lines.push('|-------|------|--------|-------------|--------|');
    for (const t of data.tokens.typography) {
      lines.push(`| ${t.name} | ${t.fontSize} | ${t.fontWeight} | ${t.lineHeight} | ${t.fontFamily} |`);
    }
    lines.push('');

    lines.push('## Spacing Scale');
    lines.push('');
    lines.push('| Token | Value |');
    lines.push('|-------|-------|');
    for (const s of data.tokens.spacing) {
      lines.push(`| ${s.name} | ${s.value} (${s.px}px) |`);
    }
    lines.push('');

    lines.push('## Breakpoints');
    lines.push('');
    for (const bp of data.tokens.breakpoints) {
      lines.push(`- **${bp.name}**: ${bp.value} (${bp.minWidth}px)`);
    }
    lines.push('');

    lines.push('## Contrast Report');
    lines.push('');
    lines.push('| Foreground | Background | Ratio | AA | AAA | AA Large |');
    lines.push('|------------|------------|-------|----|-----|----------|');
    for (const cr of data.contrastReport) {
      lines.push(`| ${cr.foreground} | ${cr.background} | ${cr.ratio.toFixed(2)}:1 | ${cr.passesAA ? '✓' : '✗'} | ${cr.passesAAA ? '✓' : '✗'} | ${cr.passesAALargeText ? '✓' : '✗'} |`);
    }
    lines.push('');

    lines.push('## Component Inventory');
    lines.push('');
    const grouped: Record<string, typeof data.componentInventory> = {};
    for (const comp of data.componentInventory) {
      (grouped[comp.priority] ??= []).push(comp);
    }
    for (const priority of ['essential', 'recommended', 'optional'] as const) {
      const items = grouped[priority];
      if (!items?.length) continue;
      lines.push(`### ${priority.charAt(0).toUpperCase() + priority.slice(1)}`);
      lines.push('');
      for (const item of items) {
        lines.push(`- **${item.name}** (${item.category}): ${item.description}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }
}
