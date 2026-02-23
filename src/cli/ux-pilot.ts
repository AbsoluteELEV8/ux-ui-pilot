#!/usr/bin/env node
/**
 * @file ux-pilot.ts
 * @description CLI interface for UX Pilot — design systems, accessibility, user flows, wireframes, and design critique
 * @author Charley Scholz, JLAI
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { UXPilot } from '../core/ux-pilot.js';

const localRequire = createRequire(import.meta.url);
const pkg: { version: string } = localRequire('../../package.json');

type CapabilityId =
  | 'design-system'
  | 'component-architecture'
  | 'accessibility-audit'
  | 'user-flow'
  | 'wireframe'
  | 'design-critique';

interface GlobalOptions {
  apiKey?: string;
  model?: string;
  json?: boolean;
}

const program = new Command();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveApiKey(): string {
  const globals = program.opts<GlobalOptions>();
  const key = globals.apiKey ?? process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.error(
      chalk.red('Error: ANTHROPIC_API_KEY is required.'),
    );
    console.error(
      chalk.yellow(
        'Provide --api-key or set the ANTHROPIC_API_KEY environment variable.',
      ),
    );
    process.exit(1);
  }
  return key;
}

function applyModelOverride(): void {
  const globals = program.opts<GlobalOptions>();
  if (globals.model) {
    process.env.ANTHROPIC_MODEL = globals.model;
  }
}

/**
 * If `value` points to an existing file, return its contents.
 * Otherwise return the raw string (which may be inline content).
 */
function resolveFileContent(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const filePath = resolve(value);
  if (existsSync(filePath)) {
    return readFileSync(filePath, 'utf-8');
  }
  return value;
}

async function runCapability(
  capabilityId: CapabilityId,
  input: Record<string, unknown>,
  label: string,
): Promise<unknown> {
  const apiKey = resolveApiKey();
  applyModelOverride();

  const spinner = ora({ text: chalk.cyan(label), spinner: 'dots' }).start();

  try {
    const pilot = new UXPilot({ apiKey });
    const result = await pilot.execute(capabilityId, input);
    spinner.succeed(chalk.green(label));
    return result;
  } catch (error) {
    spinner.fail(chalk.red(label));
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`\nError: ${message}`));
    process.exit(1);
  }
}

function printResult(result: unknown): void {
  const globals = program.opts<GlobalOptions>();

  if (globals.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (typeof result === 'string') {
    console.log(result);
    return;
  }

  if (result && typeof result === 'object') {
    const obj = result as Record<string, unknown>;

    if (typeof obj.markdownReport === 'string') {
      console.log(obj.markdownReport);
      return;
    }
  }

  console.log(JSON.stringify(result, null, 2));
}

// ---------------------------------------------------------------------------
// Program definition
// ---------------------------------------------------------------------------

program
  .name('ux-pilot')
  .description(
    'UX/UI Design Agent — design systems, accessibility, user flows, wireframes, and design critique',
  )
  .version(pkg.version)
  .option('--api-key <key>', 'Anthropic API key (overrides ANTHROPIC_API_KEY)')
  .option('--model <model>', 'Model override (overrides ANTHROPIC_MODEL)')
  .option('--json', 'Output raw JSON instead of formatted Markdown');

// ---------------------------------------------------------------------------
// design-system
// ---------------------------------------------------------------------------

program
  .command('design-system')
  .description('Generate a comprehensive design system')
  .option('--colors <colors...>', 'Brand color hex values')
  .option('--typography <font>', 'Typography / font family preference')
  .option('--platform <platform>', 'Target platform (web, ios, android, cross-platform)')
  .option('--requirements <req>', 'Additional design system requirements')
  .action(async (opts: {
    colors?: string[];
    typography?: string;
    platform?: string;
    requirements?: string;
  }) => {
    const input: Record<string, unknown> = {
      brandName: 'Design System',
    };
    if (opts.colors) input.colors = opts.colors;
    if (opts.typography) {
      input.typographyPreferences = { headingFont: opts.typography };
    }
    if (opts.platform) input.targetPlatform = opts.platform;
    if (opts.requirements) input.additionalContext = opts.requirements;

    const result = await runCapability(
      'design-system',
      input,
      'Generating design system',
    );
    printResult(result);
  });

// ---------------------------------------------------------------------------
// component-arch
// ---------------------------------------------------------------------------

program
  .command('component-arch')
  .description('Analyze component architecture')
  .requiredOption('--description <desc>', 'Description of the UI or feature')
  .option('--code <file>', 'Component code or path to file')
  .option('--framework <fw>', 'UI framework (React, Vue, Angular, Svelte)')
  .action(async (opts: {
    description: string;
    code?: string;
    framework?: string;
  }) => {
    const input: Record<string, unknown> = {
      description: opts.description,
    };
    if (opts.code) input.existingCode = resolveFileContent(opts.code);
    if (opts.framework) input.framework = opts.framework;

    const result = await runCapability(
      'component-architecture',
      input,
      'Analyzing component architecture',
    );
    printResult(result);
  });

// ---------------------------------------------------------------------------
// a11y-audit
// ---------------------------------------------------------------------------

program
  .command('a11y-audit')
  .description('Run an accessibility audit')
  .option('--code <file>', 'Component code or path to file')
  .option('--html <file>', 'HTML markup or path to file')
  .option('--description <desc>', 'Description of the UI being audited')
  .option(
    '--standard <std>',
    'WCAG standard (e.g. WCAG2.1-AA)',
    'WCAG2.1-AA',
  )
  .action(async (opts: {
    code?: string;
    html?: string;
    description?: string;
    standard?: string;
  }) => {
    const input: Record<string, unknown> = {};

    if (opts.code) {
      input.target = resolveFileContent(opts.code);
      input.targetType = 'component-code';
    } else if (opts.html) {
      input.target = resolveFileContent(opts.html);
      input.targetType = 'html';
    } else if (opts.description) {
      input.target = opts.description;
      input.targetType = 'description';
    } else {
      console.error(
        chalk.red('Error: Provide at least one of --code, --html, or --description.'),
      );
      process.exit(1);
    }

    if (opts.standard) {
      const match = /-(A{1,3})$/.exec(opts.standard);
      if (match) input.wcagLevel = match[1];
    }

    const result = await runCapability(
      'accessibility-audit',
      input,
      'Running accessibility audit',
    );
    printResult(result);
  });

// ---------------------------------------------------------------------------
// user-flow
// ---------------------------------------------------------------------------

program
  .command('user-flow')
  .description('Map user flows with Mermaid diagrams')
  .requiredOption('--feature <feature>', 'Feature or task to map')
  .option('--user-type <type>', 'Target user persona or type')
  .option('--context <ctx>', 'Additional context about the application')
  .option('--output <file>', 'Save Mermaid diagram to file')
  .action(async (opts: {
    feature: string;
    userType?: string;
    context?: string;
    output?: string;
  }) => {
    const input: Record<string, unknown> = { featureDescription: opts.feature };
    if (opts.userType) input.userPersona = opts.userType;
    if (opts.context) input.additionalContext = opts.context;

    const result = await runCapability(
      'user-flow',
      input,
      'Mapping user flow',
    );

    if (opts.output && result && typeof result === 'object') {
      const obj = result as Record<string, unknown>;
      const diagram =
        typeof obj.mermaidDiagram === 'string' ? obj.mermaidDiagram : null;

      if (diagram) {
        const outPath = resolve(opts.output);
        writeFileSync(outPath, diagram, 'utf-8');
        console.log(
          chalk.cyan(`Mermaid diagram saved to ${chalk.bold(outPath)}`),
        );
      }
    }

    printResult(result);
  });

// ---------------------------------------------------------------------------
// wireframe
// ---------------------------------------------------------------------------

program
  .command('wireframe')
  .description('Generate wireframe recommendations')
  .requiredOption('--feature <feature>', 'Feature or screen to wireframe')
  .option('--platform <platform>', 'Target platform (web, mobile, tablet, desktop)')
  .option('--constraints <constraints>', 'Design constraints or requirements')
  .action(async (opts: {
    feature: string;
    platform?: string;
    constraints?: string;
  }) => {
    const input: Record<string, unknown> = { requirements: opts.feature };
    if (opts.platform) input.targetDevices = [opts.platform];
    if (opts.constraints) input.additionalContext = opts.constraints;

    const result = await runCapability(
      'wireframe',
      input,
      'Generating wireframe recommendations',
    );
    printResult(result);
  });

// ---------------------------------------------------------------------------
// design-critique
// ---------------------------------------------------------------------------

program
  .command('design-critique')
  .description("Critique a design using Nielsen's heuristics")
  .option('--description <desc>', 'Description of the design to critique')
  .option('--code <file>', 'UI code or path to file')
  .action(async (opts: {
    description?: string;
    code?: string;
  }) => {
    const input: Record<string, unknown> = {};

    if (opts.code) {
      input.target = resolveFileContent(opts.code);
      input.targetType = 'component-code';
    } else if (opts.description) {
      input.target = opts.description;
      input.targetType = 'ui-description';
    } else {
      console.error(
        chalk.red('Error: Provide at least one of --description or --code.'),
      );
      process.exit(1);
    }

    const result = await runCapability(
      'design-critique',
      input,
      'Running design critique',
    );
    printResult(result);
  });

// ---------------------------------------------------------------------------
// Parse & run
// ---------------------------------------------------------------------------

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(`\nFatal error: ${message}`));
  process.exit(1);
});
