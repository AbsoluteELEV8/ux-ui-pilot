/**
 * @file server.ts
 * @description MCP server for UX Pilot — exposes 6 UX/UI design tools via stdio transport
 * @author Charley Scholz, ELEV8
 * @coauthor Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { UXPilot } from '../core/ux-pilot.js';

type CapabilityId =
  | 'design-system'
  | 'component-architecture'
  | 'accessibility-audit'
  | 'user-flow'
  | 'wireframe'
  | 'design-critique';

interface ToolDefinition {
  name: string;
  description: string;
  capabilityId: CapabilityId;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

const TOOLS: ToolDefinition[] = [
  {
    name: 'ux_design_system',
    description:
      'Generate a comprehensive design system with tokens, typography, spacing, and color palettes',
    capabilityId: 'design-system',
    inputSchema: {
      type: 'object',
      properties: {
        brandColors: {
          type: 'array',
          items: { type: 'string' },
          description: 'Brand color hex values (e.g. ["#1a73e8", "#ff5722"])',
        },
        typography: {
          type: 'string',
          description: 'Typography preferences or font family name',
        },
        targetPlatform: {
          type: 'string',
          enum: ['web', 'ios', 'android', 'cross-platform'],
          description: 'Target platform for the design system',
        },
        requirements: {
          type: 'string',
          description: 'Additional design system requirements or constraints',
        },
      },
    },
  },
  {
    name: 'ux_component_architecture',
    description:
      'Analyze component architecture — break down UI into reusable components with hierarchy and data flow',
    capabilityId: 'component-architecture',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Description of the UI or feature to analyze',
        },
        code: {
          type: 'string',
          description: 'Existing component code to analyze',
        },
        framework: {
          type: 'string',
          description: 'UI framework (e.g. React, Vue, Angular, Svelte)',
        },
      },
      required: ['description'],
    },
  },
  {
    name: 'ux_accessibility_audit',
    description:
      'Run an accessibility audit against WCAG guidelines — identify issues and suggest fixes',
    capabilityId: 'accessibility-audit',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'Component or page code to audit',
        },
        html: {
          type: 'string',
          description: 'Raw HTML markup to audit',
        },
        description: {
          type: 'string',
          description: 'Description of the UI being audited',
        },
        standard: {
          type: 'string',
          enum: [
            'WCAG2.0-A',
            'WCAG2.0-AA',
            'WCAG2.0-AAA',
            'WCAG2.1-A',
            'WCAG2.1-AA',
            'WCAG2.1-AAA',
            'WCAG2.2-AA',
          ],
          description:
            'Accessibility standard to audit against (default: WCAG2.1-AA)',
        },
      },
    },
  },
  {
    name: 'ux_user_flow',
    description:
      'Map user flows with Mermaid diagrams — analyze steps, decision points, and edge cases',
    capabilityId: 'user-flow',
    inputSchema: {
      type: 'object',
      properties: {
        feature: {
          type: 'string',
          description: 'Feature or task to map the user flow for',
        },
        userType: {
          type: 'string',
          description: 'Target user persona or type',
        },
        context: {
          type: 'string',
          description:
            'Additional context about the application or domain',
        },
      },
      required: ['feature'],
    },
  },
  {
    name: 'ux_wireframe',
    description:
      'Generate wireframe recommendations with layout structure and ASCII wireframes',
    capabilityId: 'wireframe',
    inputSchema: {
      type: 'object',
      properties: {
        feature: {
          type: 'string',
          description: 'Feature or screen to wireframe',
        },
        platform: {
          type: 'string',
          enum: ['web', 'mobile', 'tablet', 'desktop'],
          description: 'Target platform for the wireframe',
        },
        constraints: {
          type: 'string',
          description: 'Design constraints or requirements',
        },
      },
      required: ['feature'],
    },
  },
  {
    name: 'ux_design_critique',
    description:
      "Critique a design using Nielsen's heuristics — evaluate usability, consistency, and error prevention",
    capabilityId: 'design-critique',
    inputSchema: {
      type: 'object',
      properties: {
        description: {
          type: 'string',
          description: 'Description of the design to critique',
        },
        code: {
          type: 'string',
          description: 'UI code implementing the design',
        },
        screenshot: {
          type: 'string',
          description:
            'Base64-encoded screenshot or image URL of the design',
        },
      },
    },
  },
];

const TOOL_CAPABILITY_MAP = new Map<string, CapabilityId>(
  TOOLS.map((t) => [t.name, t.capabilityId]),
);

function parseWcagLevel(standard?: string): 'A' | 'AA' | 'AAA' | undefined {
  if (!standard) return undefined;
  const match = /-(A{1,3})$/.exec(standard);
  return (match?.[1] as 'A' | 'AA' | 'AAA') ?? undefined;
}

function transformInput(
  capabilityId: CapabilityId,
  args: Record<string, unknown>,
): Record<string, unknown> {
  switch (capabilityId) {
    case 'design-system': {
      const input: Record<string, unknown> = {
        brandName: 'Design System',
      };
      if (args.brandColors) input.colors = args.brandColors;
      if (args.typography) {
        input.typographyPreferences = { headingFont: args.typography };
      }
      if (args.targetPlatform) input.targetPlatform = args.targetPlatform;
      if (args.requirements) input.additionalContext = args.requirements;
      return input;
    }

    case 'component-architecture': {
      const input: Record<string, unknown> = {};
      if (args.description) input.description = args.description;
      if (args.code) input.existingCode = args.code;
      if (args.framework) input.framework = args.framework;
      return input;
    }

    case 'accessibility-audit': {
      const input: Record<string, unknown> = {};
      if (args.code) {
        input.target = args.code;
        input.targetType = 'component-code';
      } else if (args.html) {
        input.target = args.html;
        input.targetType = 'html';
      } else if (args.description) {
        input.target = args.description;
        input.targetType = 'description';
      }
      if (args.standard) input.wcagLevel = parseWcagLevel(args.standard as string);
      return input;
    }

    case 'user-flow': {
      const input: Record<string, unknown> = {};
      if (args.feature) input.featureDescription = args.feature;
      if (args.userType) input.userPersona = args.userType;
      if (args.context) input.additionalContext = args.context;
      return input;
    }

    case 'wireframe': {
      const input: Record<string, unknown> = {};
      if (args.feature) input.requirements = args.feature;
      if (args.platform) input.targetDevices = [args.platform];
      if (args.constraints) input.additionalContext = args.constraints;
      return input;
    }

    case 'design-critique': {
      const input: Record<string, unknown> = {};
      if (args.code) {
        input.target = args.code;
        input.targetType = 'component-code';
      } else if (args.description) {
        input.target = args.description;
        input.targetType = 'ui-description';
      } else if (args.screenshot) {
        input.target = args.screenshot;
        input.targetType = 'design-spec';
      }
      return input;
    }

    default:
      return args;
  }
}

function createServer(): Server {
  const server = new Server(
    { name: 'ux-pilot', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOLS.map(({ name, description, inputSchema }) => ({
      name,
      description,
      inputSchema,
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    const capabilityId = TOOL_CAPABILITY_MAP.get(name);
    if (!capabilityId) {
      return {
        content: [{ type: 'text' as const, text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        content: [
          {
            type: 'text' as const,
            text: 'ANTHROPIC_API_KEY environment variable is not set. Configure it before using UX Pilot tools.',
          },
        ],
        isError: true,
      };
    }

    try {
      const pilot = new UXPilot({ apiKey, model: process.env.ANTHROPIC_MODEL });
      const input = transformInput(capabilityId, (args ?? {}) as Record<string, unknown>);
      const result = await pilot.execute(capabilityId, input as never);
      const text =
        typeof result === 'string' ? result : JSON.stringify(result, null, 2);

      return { content: [{ type: 'text' as const, text }] };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error executing ${name}: ${message}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  await server.connect(transport);
  console.error('UX Pilot MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error starting UX Pilot MCP server:', error);
  process.exit(1);
});
