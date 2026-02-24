/**
 * @file accessibility-audit.ts
 * @description WCAG 2.2 accessibility auditing with severity-ranked findings and fix recommendations
 * @author Charley Scholz, ELEV8
 * @coauthor Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

import type { LLMClient } from '../core/llm-client.js';
import type {
  AccessibilityAuditInput,
  AccessibilityAuditOutput,
  AccessibilityFinding,
  Capability,
} from '../core/types.js';
import { UXPilotError } from '../core/types.js';
import { WCAG_RULES } from '../knowledge/wcag-rules.js';

const SYSTEM_PROMPT = `You are a senior accessibility specialist with deep expertise in WCAG 2.2.

Audit the provided content against WCAG criteria. For each issue found:
1. Reference the specific WCAG criterion (e.g., "1.4.3 Contrast (Minimum)")
2. Classify severity: "critical" (blocks access), "major" (significant barrier), "minor" (inconvenience)
3. Describe the issue clearly
4. Provide specific evidence from the content
5. Give an actionable recommendation
6. Include a corrected code example where applicable

Also identify criteria that are satisfied — list these as passedCriteria.

Output valid JSON. No commentary outside JSON.`;

interface LLMAuditResponse {
  findings: AccessibilityFinding[];
  passedCriteria: string[];
}

export class AccessibilityAuditCapability implements Capability<AccessibilityAuditInput, AccessibilityAuditOutput> {
  readonly id = 'accessibility-audit' as const;
  readonly name = 'Accessibility Audit';
  readonly description = 'Audits UI components against WCAG 2.2 AA criteria with severity-ranked findings';

  private readonly llm: LLMClient;

  constructor(llm: LLMClient) {
    this.llm = llm;
  }

  async execute(input: AccessibilityAuditInput): Promise<AccessibilityAuditOutput> {
    this.validateInput(input);

    const userMessage = this.buildPrompt(input);
    const result = await this.llm.chatJSON<LLMAuditResponse>(
      SYSTEM_PROMPT,
      userMessage,
      { maxTokens: 8192 },
    );

    const summary = {
      totalFindings: result.findings.length,
      critical: result.findings.filter((f) => f.severity === 'critical').length,
      major: result.findings.filter((f) => f.severity === 'major').length,
      minor: result.findings.filter((f) => f.severity === 'minor').length,
      passedCriteria: result.passedCriteria,
    };

    const markdownReport = this.generateReport(input, summary, result.findings);

    return {
      summary,
      findings: result.findings,
      markdownReport,
    };
  }

  private validateInput(input: AccessibilityAuditInput): void {
    if (!input.target?.trim()) {
      throw new UXPilotError(
        'target content is required for audit',
        'INVALID_INPUT',
        { field: 'target' },
      );
    }

    const validTypes = ['component-code', 'html', 'description'] as const;
    if (!validTypes.includes(input.targetType)) {
      throw new UXPilotError(
        `targetType must be one of: ${validTypes.join(', ')}`,
        'INVALID_INPUT',
        { field: 'targetType', received: input.targetType },
      );
    }
  }

  private buildPrompt(input: AccessibilityAuditInput): string {
    const level = input.wcagLevel ?? 'AA';

    const relevantRules = WCAG_RULES.filter((rule) => {
      if (level === 'A') return rule.level === 'A';
      if (level === 'AA') return rule.level === 'A' || rule.level === 'AA';
      return true;
    });

    const rulesSummary = relevantRules
      .map((r) => `${r.id} ${r.name} (Level ${r.level}): ${r.description}`)
      .join('\n');

    const parts = [
      `## Target (${input.targetType})`,
      '',
      input.targetType === 'component-code' || input.targetType === 'html'
        ? `\`\`\`\n${input.target}\n\`\`\``
        : input.target,
      '',
      `## WCAG Level: ${level}`,
      '',
      '## Applicable Criteria',
      '',
      rulesSummary,
    ];

    if (input.additionalContext) {
      parts.push('', `## Additional Context`, '', input.additionalContext);
    }

    parts.push('');
    parts.push('Respond with JSON: {findings: [...], passedCriteria: [...]}');
    parts.push('findings items: {criterion, criterionName, severity, issue, evidence, recommendation, codeExample}');

    return parts.join('\n');
  }

  private generateReport(
    input: AccessibilityAuditInput,
    summary: AccessibilityAuditOutput['summary'],
    findings: AccessibilityFinding[],
  ): string {
    const lines: string[] = [
      '# Accessibility Audit Report',
      '',
      `**WCAG Level:** ${input.wcagLevel ?? 'AA'}`,
      `**Target Type:** ${input.targetType}`,
      '',
      '## Summary',
      '',
      `| Severity | Count |`,
      `|----------|-------|`,
      `| Critical | ${summary.critical} |`,
      `| Major    | ${summary.major} |`,
      `| Minor    | ${summary.minor} |`,
      `| **Total** | **${summary.totalFindings}** |`,
      '',
    ];

    if (summary.passedCriteria.length > 0) {
      lines.push('## Passed Criteria');
      lines.push('');
      for (const c of summary.passedCriteria) {
        lines.push(`- ✓ ${c}`);
      }
      lines.push('');
    }

    if (findings.length === 0) {
      lines.push('No accessibility issues found. Well done!');
      lines.push('');
      return lines.join('\n');
    }

    const severityOrder = { critical: 0, major: 1, minor: 2 } as const;
    const sorted = [...findings].sort(
      (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
    );

    lines.push('## Findings');
    lines.push('');

    for (const [i, finding] of sorted.entries()) {
      const icon = finding.severity === 'critical' ? '🔴' : finding.severity === 'major' ? '🟠' : '🟡';
      lines.push(`### ${i + 1}. ${icon} ${finding.criterionName} (${finding.criterion})`);
      lines.push('');
      lines.push(`**Severity:** ${finding.severity}`);
      lines.push('');
      lines.push(`**Issue:** ${finding.issue}`);
      lines.push('');
      lines.push(`**Evidence:** ${finding.evidence}`);
      lines.push('');
      lines.push(`**Recommendation:** ${finding.recommendation}`);
      lines.push('');

      if (finding.codeExample) {
        lines.push('**Corrected Example:**');
        lines.push('');
        lines.push('```');
        lines.push(finding.codeExample);
        lines.push('```');
        lines.push('');
      }
    }

    return lines.join('\n');
  }
}
