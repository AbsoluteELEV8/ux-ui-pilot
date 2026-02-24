/**
 * @file design-tokens.ts
 * @description Reference templates for design token structures — color scales, typography, spacing, breakpoints, shadows, radii
 * @author Charley Scholz, ELEV8
 * @coauthor Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

/* -------------------------------------------------------------------------- */
/*  Type Scale Ratios                                                         */
/* -------------------------------------------------------------------------- */

export type TypeScaleRatio =
  | 'minor-second'
  | 'major-second'
  | 'minor-third'
  | 'major-third'
  | 'perfect-fourth'
  | 'augmented-fourth'
  | 'perfect-fifth'
  | 'golden-ratio';

export const TYPE_SCALE_RATIOS: Readonly<Record<TypeScaleRatio, number>> = {
  'minor-second': 1.067,
  'major-second': 1.125,
  'minor-third': 1.200,
  'major-third': 1.250,
  'perfect-fourth': 1.333,
  'augmented-fourth': 1.414,
  'perfect-fifth': 1.500,
  'golden-ratio': 1.618,
};

export interface TypeScaleStep {
  name: string;
  factor: number;
  rem: string;
  px: number;
  suggestedWeight: number;
  suggestedLineHeight: string;
}

/**
 * Generates a typography scale from a base size and ratio.
 * Returns steps from smallest (sm) to largest (display).
 */
export function generateTypeScale(
  baseSizePx: number,
  ratio: TypeScaleRatio,
): readonly TypeScaleStep[] {
  const r = TYPE_SCALE_RATIOS[ratio];

  const steps = [
    { name: 'xs', exponent: -2, weight: 400, lineHeight: '1.5' },
    { name: 'sm', exponent: -1, weight: 400, lineHeight: '1.5' },
    { name: 'base', exponent: 0, weight: 400, lineHeight: '1.5' },
    { name: 'lg', exponent: 1, weight: 400, lineHeight: '1.45' },
    { name: 'xl', exponent: 2, weight: 500, lineHeight: '1.4' },
    { name: '2xl', exponent: 3, weight: 600, lineHeight: '1.35' },
    { name: '3xl', exponent: 4, weight: 600, lineHeight: '1.3' },
    { name: '4xl', exponent: 5, weight: 700, lineHeight: '1.2' },
    { name: '5xl', exponent: 6, weight: 700, lineHeight: '1.15' },
    { name: 'display', exponent: 7, weight: 800, lineHeight: '1.1' },
  ];

  return steps.map((step) => {
    const px = Math.round(baseSizePx * Math.pow(r, step.exponent) * 100) / 100;
    const rem = `${(px / 16).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}rem`;

    return {
      name: step.name,
      factor: Math.pow(r, step.exponent),
      rem,
      px,
      suggestedWeight: step.weight,
      suggestedLineHeight: step.lineHeight,
    };
  });
}

/* -------------------------------------------------------------------------- */
/*  Color Scale                                                               */
/* -------------------------------------------------------------------------- */

export interface ColorScaleStop {
  shade: number;
  lightness: number;
}

/**
 * Standard 10-stop shade definitions (shade → target lightness in HSL).
 * These lightness values are tuned for typical UI palettes.
 */
export const STANDARD_COLOR_SHADES: readonly ColorScaleStop[] = [
  { shade: 50, lightness: 97 },
  { shade: 100, lightness: 93 },
  { shade: 200, lightness: 85 },
  { shade: 300, lightness: 74 },
  { shade: 400, lightness: 62 },
  { shade: 500, lightness: 50 },
  { shade: 600, lightness: 41 },
  { shade: 700, lightness: 33 },
  { shade: 800, lightness: 24 },
  { shade: 900, lightness: 15 },
];

export interface ColorScaleConfig {
  name: string;
  hue: number;
  saturation: number;
}

export interface GeneratedColorStop {
  shade: number;
  hsl: string;
  hex: string;
}

function hslToHex(h: number, s: number, l: number): string {
  const lNorm = l / 100;
  const a = (s / 100) * Math.min(lNorm, 1 - lNorm);

  const f = (n: number): string => {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generates a 10-stop color scale for a given hue and saturation.
 * Saturation is slightly reduced for very light and very dark stops.
 */
export function generateColorScale(config: ColorScaleConfig): readonly GeneratedColorStop[] {
  return STANDARD_COLOR_SHADES.map((stop) => {
    const satAdjust = stop.lightness > 90 || stop.lightness < 20
      ? config.saturation * 0.7
      : config.saturation;

    return {
      shade: stop.shade,
      hsl: `hsl(${config.hue}, ${Math.round(satAdjust)}%, ${stop.lightness}%)`,
      hex: hslToHex(config.hue, Math.round(satAdjust), stop.lightness),
    };
  });
}

/* -------------------------------------------------------------------------- */
/*  Spacing Scale                                                             */
/* -------------------------------------------------------------------------- */

export interface SpacingStep {
  name: string;
  px: number;
  rem: string;
}

/**
 * Generates a spacing scale based on a base unit (default 4px).
 * Follows the 4px grid system: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, ...
 */
export function generateSpacingScale(baseUnit: number = 4): readonly SpacingStep[] {
  const multipliers = [0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32];

  return multipliers.map((mult) => {
    const px = baseUnit * mult;
    const rem = `${(px / 16).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}rem`;
    const name = mult === 0 ? '0'
      : mult < 1 ? `${mult}`.replace('0.', '0.')
      : String(mult);

    return { name, px, rem };
  });
}

/* -------------------------------------------------------------------------- */
/*  Breakpoints                                                               */
/* -------------------------------------------------------------------------- */

export interface BreakpointDefinition {
  name: string;
  minWidth: number;
  maxWidth: number | null;
  columns: number;
  gutter: number;
  margin: number;
}

export const STANDARD_BREAKPOINTS: readonly BreakpointDefinition[] = [
  { name: 'sm', minWidth: 640, maxWidth: 767, columns: 4, gutter: 16, margin: 16 },
  { name: 'md', minWidth: 768, maxWidth: 1023, columns: 8, gutter: 24, margin: 24 },
  { name: 'lg', minWidth: 1024, maxWidth: 1279, columns: 12, gutter: 24, margin: 32 },
  { name: 'xl', minWidth: 1280, maxWidth: 1535, columns: 12, gutter: 32, margin: 40 },
  { name: '2xl', minWidth: 1536, maxWidth: null, columns: 12, gutter: 32, margin: 40 },
];

/* -------------------------------------------------------------------------- */
/*  Shadow System                                                             */
/* -------------------------------------------------------------------------- */

export interface ShadowDefinition {
  name: string;
  value: string;
  elevation: string;
  useCase: string;
}

export const STANDARD_SHADOWS: readonly ShadowDefinition[] = [
  {
    name: 'xs',
    value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    elevation: '1dp',
    useCase: 'Subtle separation — cards, inputs',
  },
  {
    name: 'sm',
    value: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    elevation: '2dp',
    useCase: 'Default card elevation',
  },
  {
    name: 'md',
    value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    elevation: '4dp',
    useCase: 'Dropdowns, hover states, popovers',
  },
  {
    name: 'lg',
    value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    elevation: '8dp',
    useCase: 'Modals, sticky elements',
  },
  {
    name: 'xl',
    value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    elevation: '16dp',
    useCase: 'Full-screen overlays, dialogs',
  },
  {
    name: '2xl',
    value: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    elevation: '24dp',
    useCase: 'Maximum emphasis — hero images, featured elements',
  },
  {
    name: 'inner',
    value: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    elevation: 'inset',
    useCase: 'Pressed states, input fields, wells',
  },
];

/* -------------------------------------------------------------------------- */
/*  Border Radius System                                                      */
/* -------------------------------------------------------------------------- */

export interface BorderRadiusDefinition {
  name: string;
  value: string;
  useCase: string;
}

export const STANDARD_BORDER_RADII: readonly BorderRadiusDefinition[] = [
  { name: 'none', value: '0', useCase: 'Sharp edges — data-dense tables, code blocks' },
  { name: 'sm', value: '0.125rem', useCase: 'Subtle rounding — tags, badges' },
  { name: 'md', value: '0.375rem', useCase: 'Default — buttons, inputs, cards' },
  { name: 'lg', value: '0.5rem', useCase: 'Prominent cards, modals' },
  { name: 'xl', value: '0.75rem', useCase: 'Large cards, panels' },
  { name: '2xl', value: '1rem', useCase: 'Hero cards, feature sections' },
  { name: '3xl', value: '1.5rem', useCase: 'Large decorative containers' },
  { name: 'full', value: '9999px', useCase: 'Circular — avatars, pills, toggles' },
];
