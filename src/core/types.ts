/**
 * @file types.ts
 * @description Shared types, interfaces, and error class for UX Pilot
 * @author Charley Scholz, ELEV8
 * @coauthor Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

/* -------------------------------------------------------------------------- */
/*  Capability Registry                                                       */
/* -------------------------------------------------------------------------- */

export type CapabilityId =
  | 'design-system'
  | 'component-architecture'
  | 'accessibility-audit'
  | 'user-flow'
  | 'wireframe'
  | 'design-critique';

export interface Capability<TInput, TOutput> {
  readonly id: CapabilityId;
  readonly name: string;
  readonly description: string;
  execute(input: TInput): Promise<TOutput>;
}

/* -------------------------------------------------------------------------- */
/*  Custom Error                                                              */
/* -------------------------------------------------------------------------- */

export type UXPilotErrorCode =
  | 'INVALID_INPUT'
  | 'LLM_ERROR'
  | 'CAPABILITY_NOT_FOUND'
  | 'PARSE_ERROR'
  | 'UNKNOWN';

export class UXPilotError extends Error {
  readonly code: UXPilotErrorCode;
  readonly details: Record<string, unknown>;

  constructor(
    message: string,
    code: UXPilotErrorCode = 'UNKNOWN',
    details: Record<string, unknown> = {},
  ) {
    super(message);
    this.name = 'UXPilotError';
    this.code = code;
    this.details = details;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/* -------------------------------------------------------------------------- */
/*  Design System                                                             */
/* -------------------------------------------------------------------------- */

export interface DesignSystemInput {
  brandName: string;
  colors?: string[];
  typographyPreferences?: {
    headingFont?: string;
    bodyFont?: string;
    monoFont?: string;
    scaleRatio?: 'minor-third' | 'major-third' | 'perfect-fourth' | 'augmented-fourth' | 'perfect-fifth';
  };
  targetPlatform?: 'web' | 'mobile' | 'both';
  additionalContext?: string;
}

export interface ColorStop {
  shade: number;
  hex: string;
  hsl: string;
  contrastOnWhite: number;
  contrastOnBlack: number;
}

export interface ColorScale {
  name: string;
  stops: ColorStop[];
}

export interface TypographyToken {
  name: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing: string;
  fontFamily: string;
}

export interface SpacingToken {
  name: string;
  value: string;
  px: number;
}

export interface BreakpointToken {
  name: string;
  value: string;
  minWidth: number;
}

export interface ShadowToken {
  name: string;
  value: string;
}

export interface BorderRadiusToken {
  name: string;
  value: string;
}

export interface DesignTokens {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    neutral: ColorScale;
    semantic: {
      success: ColorScale;
      warning: ColorScale;
      error: ColorScale;
      info: ColorScale;
    };
  };
  typography: TypographyToken[];
  spacing: SpacingToken[];
  breakpoints: BreakpointToken[];
  shadows: ShadowToken[];
  borderRadii: BorderRadiusToken[];
}

export interface DesignSystemOutput {
  tokens: DesignTokens;
  contrastReport: Array<{
    foreground: string;
    background: string;
    ratio: number;
    passesAA: boolean;
    passesAAA: boolean;
    passesAALargeText: boolean;
  }>;
  componentInventory: Array<{
    name: string;
    category: string;
    priority: 'essential' | 'recommended' | 'optional';
    description: string;
  }>;
  markdownReport: string;
}

/* -------------------------------------------------------------------------- */
/*  Component Architecture                                                    */
/* -------------------------------------------------------------------------- */

export interface ComponentArchInput {
  description: string;
  existingCode?: string;
  framework?: 'react' | 'vue' | 'svelte' | 'angular' | 'agnostic';
  additionalContext?: string;
}

export interface ComponentSpec {
  name: string;
  description: string;
  props: Array<{
    name: string;
    type: string;
    required: boolean;
    defaultValue?: string;
    description: string;
  }>;
  state: Array<{
    name: string;
    type: string;
    initialValue: string;
    description: string;
  }>;
  events: Array<{
    name: string;
    payload: string;
    description: string;
  }>;
  accessibilityRequirements: string[];
  children: ComponentSpec[];
}

export interface ComponentArchOutput {
  rootComponent: ComponentSpec;
  stateManagementApproach: string;
  compositionPatterns: string[];
  dataFlowDiagram: string;
  markdownReport: string;
}

/* -------------------------------------------------------------------------- */
/*  Accessibility Audit                                                       */
/* -------------------------------------------------------------------------- */

export interface AccessibilityAuditInput {
  target: string;
  targetType: 'component-code' | 'html' | 'description';
  wcagLevel?: 'A' | 'AA' | 'AAA';
  additionalContext?: string;
}

export type AuditSeverity = 'critical' | 'major' | 'minor';

export interface AccessibilityFinding {
  criterion: string;
  criterionName: string;
  severity: AuditSeverity;
  issue: string;
  evidence: string;
  recommendation: string;
  codeExample: string;
}

export interface AccessibilityAuditOutput {
  summary: {
    totalFindings: number;
    critical: number;
    major: number;
    minor: number;
    passedCriteria: string[];
  };
  findings: AccessibilityFinding[];
  markdownReport: string;
}

/* -------------------------------------------------------------------------- */
/*  User Flow Mapping                                                         */
/* -------------------------------------------------------------------------- */

export interface UserFlowInput {
  featureDescription: string;
  userPersona?: string;
  existingFlows?: string;
  additionalContext?: string;
}

export interface FlowStep {
  id: string;
  label: string;
  type: 'start' | 'action' | 'decision' | 'end' | 'error';
  description: string;
}

export interface FlowTransition {
  from: string;
  to: string;
  label: string;
  condition?: string;
}

export interface UserFlowOutput {
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
  markdownReport: string;
}

/* -------------------------------------------------------------------------- */
/*  Wireframe Advisor                                                         */
/* -------------------------------------------------------------------------- */

export interface WireframeInput {
  requirements: string;
  pageType?: 'landing' | 'dashboard' | 'form' | 'detail' | 'list' | 'settings' | 'other';
  targetDevices?: Array<'mobile' | 'tablet' | 'desktop'>;
  additionalContext?: string;
}

export interface ContentZone {
  name: string;
  purpose: string;
  priority: number;
  suggestedComponents: string[];
  placement: string;
}

export interface WireframeOutput {
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
  markdownReport: string;
}

/* -------------------------------------------------------------------------- */
/*  Design Critique                                                           */
/* -------------------------------------------------------------------------- */

export interface DesignCritiqueInput {
  target: string;
  targetType: 'ui-description' | 'component-code' | 'design-spec';
  focusAreas?: string[];
  additionalContext?: string;
}

export interface HeuristicScore {
  heuristicId: number;
  heuristicName: string;
  score: number;
  maxScore: number;
}

export interface CritiqueIssue {
  heuristicId: number;
  heuristicName: string;
  severity: 1 | 2 | 3 | 4;
  issue: string;
  evidence: string;
  recommendation: string;
}

export interface DesignCritiqueOutput {
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
  overallScore: number;
  markdownReport: string;
}

/* -------------------------------------------------------------------------- */
/*  Capability Map (for dynamic dispatch)                                     */
/* -------------------------------------------------------------------------- */

export interface CapabilityInputMap {
  'design-system': DesignSystemInput;
  'component-architecture': ComponentArchInput;
  'accessibility-audit': AccessibilityAuditInput;
  'user-flow': UserFlowInput;
  'wireframe': WireframeInput;
  'design-critique': DesignCritiqueInput;
}

export interface CapabilityOutputMap {
  'design-system': DesignSystemOutput;
  'component-architecture': ComponentArchOutput;
  'accessibility-audit': AccessibilityAuditOutput;
  'user-flow': UserFlowOutput;
  'wireframe': WireframeOutput;
  'design-critique': DesignCritiqueOutput;
}
