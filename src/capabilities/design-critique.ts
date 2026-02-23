/**
 * @file design-critique.ts
 * @description Evaluates UI against Nielsen's 10 usability heuristics with structured feedback
 * @author Charley Scholz, JLAI
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

import type { LLMClient } from '../core/llm-client.js';
import type {
  Capability,
  CritiqueIssue,
  DesignCritiqueInput,
  DesignCritiqueOutput,
  HeuristicScore,
} from '../core/types.js';
import { UXPilotError } from '../core/types.js';
import { NIELSEN_HEURISTICS } from '../knowledge/nielsen-heuristics.js';

const SYSTEM_PROMPT = `You are a senior UX design critic with deep knowledge of usability principles.

Evaluate the given UI against Nielsen's 10 Usability Heuristics. Your approach:
1. ALWAYS lead with strengths — what the design does well, mapped to specific heuristics
2. Then identify issues — each mapped to a heuristic, with severity 1-4:
   - 1: Cosmetic — fix if time permits
   - 2: Minor — low priority fix
   - 3: Major — important to fix, top priority
   - 4: Catastrophe — must fix before release
3. Score each heuristic 0-10 (10 = perfect adherence)
4. Provide priority actions sorted by impact and effort

The 10 heuristics:
1. Visibility of System Status
2. Match Between System and Real World
3. User Control and Freedom
4. Consistency and Standards
5. Error Prevention
6. Recognition Rather Than Recall
7. Flexibility and Efficiency of Use
8. Aesthetic and Minimalist Design
9. Help Users Recognize, Diagnose, and Recover from Errors
10. Help and Documentation

Output valid JSON. No commentary outside JSON.`;

interface LLMCritiqueResponse {
  strengths: Array<{
    area: string;
    description: string;
    heuristicId: number;
  }>;
  issues: CritiqueIssue[];
  heuristicScores: HeuristicScore[];
  priorityActions: Array<{
    priority: number;
    action: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
  }>;
}

export class DesignCritiqueCapability implements Capability<DesignCritiqueInput, DesignCritiqueOutput> {
  readonly id = 'design-critique' as const;
  readonly name = 'Design Critique';
  readonly description = 'Evaluates UI against Nielsen\'s 10 usability heuristics with evidence-based recommendations';

  private readonly llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  async execute(input: DesignCritiqueInput): Promise<DesignCritiqueOutput> {
    this.validateInput(input);

    const userMessage = this.buildPrompt(input);
    const result = await this.llm.chatJSON<LLMCritiqueResponse>(
      SYSTEM_PROMPT,
      userMessage,
      { maxTokens: 8192 },
    );

    const overallScore = this.calculateOverallScore(result.heuristicScores);
    const markdownReport = this.generateReport(input, result, overallScore);

    return {
      ...result,
      overallScore,
      markdownReport,
    };
  }

  private validateInput(input: DesignCritiqueInput): void {
    if (!input.target?.trim()) {
      throw new UXPilotError(
        'target is required for critique',
        'INVALID_INPUT',
        { field: 'target' },
      );
    }

    const validTypes = ['ui-description', 'component-code', 'design-spec'] as const;
    if (!validTypes.includes(input.targetType)) {
      throw new UXPilotError(
        `targetType must be one of: ${validTypes.join(', ')}`,
        'INVALID_INPUT',
        { field: 'targetType', received: input.targetType },
      );
    }
  }

  private buildPrompt(input: DesignCritiqueInput): string {
    const heuristicsReference = NIELSEN_HEURISTICS
      .map((h) => `${h.id}. ${h.name}: ${h.description}`)
      .join('\n');

    const parts = [
      `## Target (${input.targetType})`,
      '',
      input.targetType === 'component-code'
        ? `\`\`\`\n${input.target}\n\`\`\``
        : input.target,
      '',
      `## Nielsen's Heuristics Reference`,
      '',
      heuristicsReference,
    ];

    if (input.focusAreas?.length) {
      parts.push('', `## Focus Areas`, '', input.focusAreas.map((a) => `- ${a}`).join('\n'));
    }

    if (input.additionalContext) {
      parts.push('', `## Additional Context`, '', input.additionalContext);
    }

    parts.push('');
    parts.push('Respond with JSON: {strengths, issues, heuristicScores, priorityActions}');
    parts.push('strengths: [{area, description, heuristicId}]');
    parts.push('issues: [{heuristicId, heuristicName, severity (1-4), issue, evidence, recommendation}]');
    parts.push('heuristicScores: [{heuristicId, heuristicName, score (0-10), maxScore: 10}]');
    parts.push('priorityActions: [{priority, action, impact, effort}]');

    return parts.join('\n');
  }

  private calculateOverallScore(scores: HeuristicScore[]): number {
    if (scores.length === 0) return 0;
    const total = scores.reduce((sum, s) => sum + s.score, 0);
    const max = scores.reduce((sum, s) => sum + s.maxScore, 0);
    return max > 0 ? Math.round((total / max) * 100) : 0;
  }

  private generateReport(
    input: DesignCritiqueInput,
    data: LLMCritiqueResponse,
    overallScore: number,
  ): string {
    const lines: string[] = [
      '# Design Critique Report',
      '',
      `**Target Type:** ${input.targetType}`,
      `**Overall Score:** ${overallScore}/100`,
      '',
    ];

    lines.push('## Heuristic Scores');
    lines.push('');
    lines.push('| # | Heuristic | Score |');
    lines.push('|---|-----------|-------|');
    for (const hs of data.heuristicScores) {
      const bar = '█'.repeat(hs.score) + '░'.repeat(hs.maxScore - hs.score);
      lines.push(`| ${hs.heuristicId} | ${hs.heuristicName} | ${bar} ${hs.score}/${hs.maxScore} |`);
    }
    lines.push('');

    lines.push('## Strengths');
    lines.push('');
    if (data.strengths.length === 0) {
      lines.push('_No specific strengths identified._');
    } else {
      for (const s of data.strengths) {
        const heuristic = NIELSEN_HEURISTICS.find((h) => h.id === s.heuristicId);
        lines.push(`- **${s.area}** (H${s.heuristicId}: ${heuristic?.name ?? 'Unknown'})`);
        lines.push(`  ${s.description}`);
      }
    }
    lines.push('');

    lines.push('## Issues');
    lines.push('');
    if (data.issues.length === 0) {
      lines.push('_No issues found. Excellent!_');
    } else {
      const sorted = [...data.issues].sort((a, b) => b.severity - a.severity);
      for (const [i, issue] of sorted.entries()) {
        const severityLabel = this.severityLabel(issue.severity);
        lines.push(`### ${i + 1}. ${severityLabel} — ${issue.heuristicName} (H${issue.heuristicId})`);
        lines.push('');
        lines.push(`**Issue:** ${issue.issue}`);
        lines.push('');
        lines.push(`**Evidence:** ${issue.evidence}`);
        lines.push('');
        lines.push(`**Recommendation:** ${issue.recommendation}`);
        lines.push('');
      }
    }

    lines.push('## Priority Actions');
    lines.push('');
    if (data.priorityActions.length > 0) {
      lines.push('| # | Action | Impact | Effort |');
      lines.push('|---|--------|--------|--------|');
      for (const pa of data.priorityActions) {
        lines.push(`| ${pa.priority} | ${pa.action} | ${pa.impact} | ${pa.effort} |`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }

  private severityLabel(severity: 1 | 2 | 3 | 4): string {
    switch (severity) {
      case 4: return '🔴 Catastrophe';
      case 3: return '🟠 Major';
      case 2: return '🟡 Minor';
      case 1: return '⚪ Cosmetic';
    }
  }
}
