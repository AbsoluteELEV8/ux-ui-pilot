/**
 * @file ux-ui-pilot.ts
 * @description Main orchestrator — routes requests to capabilities via lazy-loading
 * @author Charley Scholz, ELEV8
 * @coauthor Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

import { LLMClient } from './llm-client.js';
import type {
  Capability,
  CapabilityId,
  CapabilityInputMap,
  CapabilityOutputMap,
  UXPilotErrorCode,
} from './types.js';
import { UXPilotError } from './types.js';

type AnyCapability = Capability<unknown, unknown>;

const CAPABILITY_MODULES: Record<CapabilityId, string> = {
  'design-system': '../capabilities/design-system.js',
  'component-architecture': '../capabilities/component-architecture.js',
  'accessibility-audit': '../capabilities/accessibility-audit.js',
  'user-flow': '../capabilities/user-flow-mapper.js',
  'wireframe': '../capabilities/wireframe-advisor.js',
  'design-critique': '../capabilities/design-critique.js',
};

const CAPABILITY_EXPORTS: Record<CapabilityId, string> = {
  'design-system': 'DesignSystemCapability',
  'component-architecture': 'ComponentArchCapability',
  'accessibility-audit': 'AccessibilityAuditCapability',
  'user-flow': 'UserFlowMapperCapability',
  'wireframe': 'WireframeAdvisorCapability',
  'design-critique': 'DesignCritiqueCapability',
};

const CAPABILITY_KEYWORDS: Record<CapabilityId, string[]> = {
  'design-system': ['design system', 'tokens', 'color palette', 'typography', 'spacing', 'brand', 'theme'],
  'component-architecture': ['component', 'architecture', 'props', 'state', 'composition', 'breakdown'],
  'accessibility-audit': ['accessibility', 'a11y', 'wcag', 'aria', 'screen reader', 'contrast'],
  'user-flow': ['user flow', 'journey', 'flowchart', 'navigation path', 'user journey', 'steps'],
  'wireframe': ['wireframe', 'layout', 'page structure', 'information hierarchy', 'content zones'],
  'design-critique': ['critique', 'review', 'evaluate', 'heuristic', 'usability', 'feedback'],
};

export interface UXPilotOptions {
  apiKey: string;
  model?: string;
}

export class UXPilot {
  private readonly llm: LLMClient;
  private readonly capabilities: Map<CapabilityId, AnyCapability> = new Map();

  constructor(options: UXPilotOptions) {
    this.llm = new LLMClient({
      apiKey: options.apiKey,
      model: options.model,
    });
  }

  analyzeRequest(request: string): CapabilityId[] {
    const lower = request.toLowerCase();
    const matches: Array<{ id: CapabilityId; score: number }> = [];

    for (const [id, keywords] of Object.entries(CAPABILITY_KEYWORDS) as Array<[CapabilityId, string[]]>) {
      let score = 0;
      for (const keyword of keywords) {
        if (lower.includes(keyword)) {
          score += keyword.split(' ').length;
        }
      }
      if (score > 0) {
        matches.push({ id, score });
      }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches.map((m) => m.id);
  }

  async execute<K extends CapabilityId>(
    capabilityId: K,
    input: CapabilityInputMap[K],
  ): Promise<CapabilityOutputMap[K]> {
    const capability = await this.loadCapability(capabilityId);
    try {
      return await capability.execute(input) as CapabilityOutputMap[K];
    } catch (error: unknown) {
      if (error instanceof UXPilotError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new UXPilotError(
        `Capability "${capabilityId}" execution failed: ${message}`,
        'UNKNOWN' as UXPilotErrorCode,
        { capabilityId, originalError: message },
      );
    }
  }

  getLLMClient(): LLMClient {
    return this.llm;
  }

  private async loadCapability(id: CapabilityId): Promise<AnyCapability> {
    const cached = this.capabilities.get(id);
    if (cached) {
      return cached;
    }

    const modulePath = CAPABILITY_MODULES[id];
    const exportName = CAPABILITY_EXPORTS[id];
    if (!modulePath || !exportName) {
      throw new UXPilotError(
        `Unknown capability: ${id}`,
        'CAPABILITY_NOT_FOUND',
        { capabilityId: id },
      );
    }

    try {
      const mod = await import(modulePath) as Record<string, unknown>;
      const CapClass = mod[exportName] as new (llm: LLMClient) => AnyCapability;
      if (typeof CapClass !== 'function') {
        throw new UXPilotError(
          `Capability module "${id}" does not export class "${exportName}"`,
          'CAPABILITY_NOT_FOUND',
          { modulePath, exportName },
        );
      }

      const instance = new CapClass(this.llm);
      this.capabilities.set(id, instance);
      return instance;
    } catch (error: unknown) {
      if (error instanceof UXPilotError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new UXPilotError(
        `Failed to load capability "${id}": ${message}`,
        'CAPABILITY_NOT_FOUND',
        { modulePath, originalError: message },
      );
    }
  }
}
