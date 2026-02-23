/**
 * @file ui-patterns.ts
 * @description Comprehensive UI patterns library covering navigation, forms, data display, and feedback
 * @author Charley Scholz, JLAI
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

export interface UIPattern {
  readonly name: string;
  readonly category: 'navigation' | 'form' | 'data-display' | 'feedback' | 'layout';
  readonly description: string;
  readonly bestFor: readonly string[];
  readonly accessibilityNotes: readonly string[];
  readonly implementationHints: readonly string[];
}

export const UI_PATTERNS: readonly UIPattern[] = [
  /* ---------------------------------------------------------------------- */
  /*  Navigation Patterns                                                    */
  /* ---------------------------------------------------------------------- */
  {
    name: 'Sidebar Navigation',
    category: 'navigation',
    description: 'Persistent vertical navigation panel on the left (or right in RTL) that shows primary navigation items. Can be collapsible to icon-only mode on smaller screens.',
    bestFor: [
      'Applications with 5-15 top-level sections',
      'Admin dashboards and management panels',
      'Tools where users frequently switch between sections',
      'Desktop-first applications',
    ],
    accessibilityNotes: [
      'Use <nav> landmark with aria-label="Main navigation"',
      'Current page item needs aria-current="page"',
      'Collapsible sidebar must announce state with aria-expanded',
      'Keyboard focus must be trapped inside when sidebar overlays content on mobile',
      'Ensure sufficient color contrast for active vs inactive states',
    ],
    implementationHints: [
      'Use CSS Grid or Flexbox for sidebar + content layout',
      'Collapsible variant: animate width transition, swap text labels for tooltips',
      'Store collapsed/expanded preference in localStorage',
      'On mobile: convert to overlay drawer with backdrop',
      'Group related items with headings or visual separators',
    ],
  },
  {
    name: 'Tab Bar Navigation',
    category: 'navigation',
    description: 'Horizontal row of tabs, typically at the top of a content area, allowing users to switch between related views without leaving the page.',
    bestFor: [
      'Sections with 2-7 peer-level views',
      'Settings pages with categorized options',
      'Content that shares the same hierarchical level',
      'Mobile bottom navigation (up to 5 items)',
    ],
    accessibilityNotes: [
      'Use role="tablist", role="tab", role="tabpanel" ARIA pattern',
      'Active tab: aria-selected="true"',
      'Arrow keys should navigate between tabs; Enter/Space activates',
      'Tab panels need aria-labelledby pointing to their tab',
      'Ensure focus is managed when switching panels',
    ],
    implementationHints: [
      'Implement roving tabindex for keyboard navigation',
      'Use scroll overflow with fade indicators for many tabs',
      'Lazy-load tab panel content for performance',
      'Bottom tab bar on mobile: max 5 items, use icons + short labels',
      'Consider URL-synced tabs for shareability',
    ],
  },
  {
    name: 'Breadcrumb Navigation',
    category: 'navigation',
    description: 'Horizontal trail showing the user\'s location within a hierarchical structure. Each segment is a link back to that level.',
    bestFor: [
      'Deeply nested content hierarchies (3+ levels)',
      'E-commerce category browsing',
      'File system or document management UIs',
      'Any flow where users need to backtrack efficiently',
    ],
    accessibilityNotes: [
      'Wrap in <nav aria-label="Breadcrumb">',
      'Use <ol> for ordered list semantics',
      'Separator characters should be aria-hidden',
      'Current page (last item) should not be a link, or use aria-current="page"',
    ],
    implementationHints: [
      'Truncate middle segments on mobile with an ellipsis menu',
      'Use CSS pseudo-elements or SVG for separators (not text characters)',
      'Generate breadcrumbs from URL path or route config',
      'Add structured data (BreadcrumbList schema) for SEO',
    ],
  },
  {
    name: 'Hamburger Menu',
    category: 'navigation',
    description: 'Three-line icon that reveals a hidden navigation menu, typically used on mobile or when screen space is limited.',
    bestFor: [
      'Mobile-first responsive layouts',
      'Sites with extensive navigation that must be hidden on small screens',
      'Progressive disclosure of secondary navigation',
    ],
    accessibilityNotes: [
      'Button must have aria-label="Open menu" (or similar)',
      'Toggle must set aria-expanded on the button',
      'Menu must be role="navigation" or within a <nav>',
      'Focus trap inside open menu; return focus to hamburger on close',
      'Escape key should close the menu',
    ],
    implementationHints: [
      'Animate the icon transition (hamburger → X) for visual feedback',
      'Use a slide-in drawer pattern with backdrop overlay',
      'Consider replacing with visible navigation on larger breakpoints',
      'Prerender menu HTML (hidden) for fast open, rather than lazy-loading',
    ],
  },
  {
    name: 'Command Palette',
    category: 'navigation',
    description: 'Keyboard-activated search overlay (Cmd+K / Ctrl+K) that lets users search and navigate across the entire application.',
    bestFor: [
      'Power-user tools and developer applications',
      'Applications with many pages or actions',
      'Reducing cognitive load in feature-rich interfaces',
      'Quick action execution (search, navigate, run commands)',
    ],
    accessibilityNotes: [
      'Must be operable by keyboard alone',
      'Use role="combobox" with role="listbox" for results',
      'Announce result count to screen readers via aria-live region',
      'Trap focus within the palette when open',
      'Provide visible keyboard shortcut hint in the UI',
    ],
    implementationHints: [
      'Debounce search input (200-300ms)',
      'Categorize results (pages, actions, recent items)',
      'Support fuzzy matching for typo tolerance',
      'Show keyboard shortcuts next to actions',
      'Persist recent searches for quick re-access',
    ],
  },

  /* ---------------------------------------------------------------------- */
  /*  Form Patterns                                                          */
  /* ---------------------------------------------------------------------- */
  {
    name: 'Multi-Step Form (Wizard)',
    category: 'form',
    description: 'Breaks a long form into sequential steps with progress indication. Each step validates independently before advancing.',
    bestFor: [
      'Onboarding and registration flows',
      'Checkout processes',
      'Complex data entry (insurance, applications)',
      'Any form with 10+ fields',
    ],
    accessibilityNotes: [
      'Step indicator needs aria-current="step" on active step',
      'Announce step changes with aria-live region',
      'Provide "Back" button — never trap users on a step',
      'Validate and announce errors before allowing advancement',
      'Progress bar/stepper must be decorative or properly labeled',
    ],
    implementationHints: [
      'Persist form state across steps (React: context or form library state)',
      'Allow optional saving of draft state (localStorage or server)',
      'Show step titles, not just numbers, in the progress indicator',
      'Consider allowing non-linear navigation for edit flows',
      'Validate each step on "Next" click, not on mount',
    ],
  },
  {
    name: 'Inline Validation',
    category: 'form',
    description: 'Validates form fields as the user interacts with them (on blur or on change), showing success/error indicators immediately.',
    bestFor: [
      'Any form where early feedback reduces errors',
      'Fields with specific format requirements (email, phone, password strength)',
      'Real-time availability checks (username, domain)',
    ],
    accessibilityNotes: [
      'Error messages must be associated with input via aria-describedby',
      'Use aria-invalid="true" on invalid fields',
      'Do NOT validate on every keystroke — validate on blur or after a debounce',
      'Error messages must be visible (not just color-indicated)',
      'Announce errors via aria-live="polite" region',
    ],
    implementationHints: [
      'Validate on blur for most fields, on change for confirmations (password match)',
      'Show success state (green check) only after user has finished input',
      'Debounce async validations (username availability) by 500ms+',
      'Display error message below the field, not in tooltip',
      'Group related validations (e.g. password strength meter)',
    ],
  },
  {
    name: 'Progressive Disclosure Form',
    category: 'form',
    description: 'Shows only essential fields initially, revealing additional fields based on user selections or actions.',
    bestFor: [
      'Forms with conditional fields',
      'Reducing visual complexity for simple cases',
      'Search/filter UIs with advanced options',
      'Configuration panels with basic/advanced modes',
    ],
    accessibilityNotes: [
      'New fields must be announced to screen readers when revealed',
      'Use aria-expanded on the toggle that reveals additional fields',
      'Hidden fields must not be in the tab order',
      'Ensure focus moves logically when new fields appear',
    ],
    implementationHints: [
      'Use CSS transitions for smooth reveal animations',
      'Conditionally render fields (don\'t just hide with CSS)',
      'Default to showing fewer fields — let user opt into complexity',
      'Clearly label the toggle ("Show advanced options")',
      'Preserve values if fields are hidden and re-shown',
    ],
  },
  {
    name: 'Autocomplete / Typeahead',
    category: 'form',
    description: 'Text input that suggests matching options as the user types, reducing input effort and preventing errors.',
    bestFor: [
      'Large option sets (cities, products, contacts)',
      'Reducing typos in free-text fields',
      'Address and location inputs',
      'Tag/label selection',
    ],
    accessibilityNotes: [
      'Use role="combobox" with aria-autocomplete',
      'Suggestion list needs role="listbox" with role="option" items',
      'Announce number of suggestions via aria-live',
      'Arrow keys navigate suggestions; Enter selects',
      'Clear button needs accessible label',
    ],
    implementationHints: [
      'Debounce API calls by 200-300ms',
      'Highlight matching substring in suggestions',
      'Support keyboard navigation (up/down/enter/escape)',
      'Show "No results" state, not empty dropdown',
      'Cache recent results for instant display',
    ],
  },

  /* ---------------------------------------------------------------------- */
  /*  Data Display Patterns                                                  */
  /* ---------------------------------------------------------------------- */
  {
    name: 'Data Table',
    category: 'data-display',
    description: 'Rows and columns for displaying structured data with sorting, filtering, and pagination capabilities.',
    bestFor: [
      'Displaying homogeneous records (users, orders, transactions)',
      'Data that needs comparison across rows',
      'Datasets requiring sorting and filtering',
      'Admin panels and reporting dashboards',
    ],
    accessibilityNotes: [
      'Use semantic <table>, <thead>, <tbody>, <th scope="col"> elements',
      'Sortable column headers need aria-sort attribute',
      'Row selection: use role="checkbox" with aria-label per row',
      'Pagination controls need descriptive labels',
      'Ensure table is responsive: horizontal scroll or stacked layout on mobile',
    ],
    implementationHints: [
      'Virtualize rows for large datasets (1000+ rows)',
      'Sticky header for scrolling tables',
      'Support column resizing and reordering for power users',
      'Provide CSV/Excel export for data portability',
      'Mobile: consider card layout or horizontal scroll with pinned first column',
    ],
  },
  {
    name: 'Card Grid',
    category: 'data-display',
    description: 'Visual cards arranged in a responsive grid, each containing a preview of an entity with key information.',
    bestFor: [
      'Visual content (images, videos, products)',
      'Entity browsing where visual identity matters',
      'Dashboard widgets and metric summaries',
      'Portfolio and gallery displays',
    ],
    accessibilityNotes: [
      'Each card should be a complete semantic unit (article or li)',
      'If card is clickable, the entire card should be the click target',
      'Images need descriptive alt text',
      'Ensure sufficient spacing between interactive elements within cards',
      'Card actions must be keyboard accessible',
    ],
    implementationHints: [
      'Use CSS Grid with auto-fill/auto-fit for responsive columns',
      'Consistent card heights per row (use aspect-ratio or fixed image heights)',
      'Lazy-load images below the fold',
      'Add hover state that reveals secondary actions',
      'Skeleton loading cards during fetch',
    ],
  },
  {
    name: 'List View',
    category: 'data-display',
    description: 'Vertical list of items showing key information per row, optimized for scanning and comparison.',
    bestFor: [
      'Sequential content (messages, notifications, activity feeds)',
      'Search results',
      'Mobile-first data displays',
      'Content where order matters',
    ],
    accessibilityNotes: [
      'Use <ul>/<ol> for semantic list structure',
      'Interactive list items need clear focus indicators',
      'If items are selectable, use aria-selected',
      'Group actions (delete, edit) with proper labeling',
      'Infinite scroll needs "Load more" button alternative',
    ],
    implementationHints: [
      'Virtualize long lists for performance',
      'Add swipe actions on mobile (with button fallbacks)',
      'Group by date, category, or status with sticky section headers',
      'Provide empty state message when list is empty',
      'Support pull-to-refresh on mobile',
    ],
  },
  {
    name: 'Infinite Scroll',
    category: 'data-display',
    description: 'Automatically loads more content as the user scrolls near the bottom of the page or container.',
    bestFor: [
      'Social feeds and activity streams',
      'Image galleries',
      'Continuous content consumption',
      'Mobile-optimized browsing',
    ],
    accessibilityNotes: [
      'MUST provide a "Load more" button as a fallback for keyboard/screen reader users',
      'Announce new content loading via aria-live region',
      'Ensure focus is not lost when new content loads',
      'Provide a way to skip to footer content (it may be unreachable with infinite scroll)',
      'Consider pagination as an alternative for accessibility',
    ],
    implementationHints: [
      'Use Intersection Observer API for scroll detection',
      'Load content when user is ~200px from bottom (not at bottom)',
      'Show loading indicator while fetching',
      'Implement scroll position restoration for back-navigation',
      'Set a maximum auto-load count, then switch to "Load more" button',
    ],
  },

  /* ---------------------------------------------------------------------- */
  /*  Feedback Patterns                                                      */
  /* ---------------------------------------------------------------------- */
  {
    name: 'Toast Notification',
    category: 'feedback',
    description: 'Temporary, non-blocking message that appears briefly to confirm an action or provide status information.',
    bestFor: [
      'Success confirmations ("Item saved")',
      'Non-critical status updates',
      'Background operation completion',
      'Undo actions ("Message deleted — Undo")',
    ],
    accessibilityNotes: [
      'Use role="status" and aria-live="polite" for non-critical toasts',
      'Use role="alert" and aria-live="assertive" only for errors',
      'Must not disappear too quickly — minimum 5 seconds, or persist until dismissed',
      'Provide a close button with accessible label',
      'Do not stack too many toasts — limit to 3 visible at once',
    ],
    implementationHints: [
      'Position in bottom-right (or top-right) corner, above all content',
      'Stack vertically with newest on top',
      'Auto-dismiss after 5-8 seconds for info/success; persist errors',
      'Include action button for undo-capable operations',
      'Animate entrance (slide in) and exit (fade out)',
    ],
  },
  {
    name: 'Modal Dialog',
    category: 'feedback',
    description: 'Overlay dialog that requires user attention or action before returning to the main content.',
    bestFor: [
      'Destructive action confirmations',
      'Critical decisions that need focused attention',
      'Complex sub-tasks (compose email, edit profile)',
      'Content that must be completed before proceeding',
    ],
    accessibilityNotes: [
      'Use <dialog> element or role="dialog" with aria-modal="true"',
      'Must trap focus within the modal',
      'Escape key must close the modal',
      'Return focus to the triggering element on close',
      'Inert attribute on background content',
      'Modal title must be associated via aria-labelledby',
    ],
    implementationHints: [
      'Use native <dialog> element where possible',
      'Add backdrop click to dismiss (except for critical actions)',
      'Animate entrance: scale up + fade in',
      'Prevent body scroll while modal is open',
      'Size modals appropriately: small for confirmations, large for complex tasks',
    ],
  },
  {
    name: 'Inline Message',
    category: 'feedback',
    description: 'Contextual message displayed within the content flow, near the element it relates to.',
    bestFor: [
      'Form validation errors',
      'Contextual help and tips',
      'Status of a specific item or section',
      'Empty states with guidance',
    ],
    accessibilityNotes: [
      'Associate with related element using aria-describedby',
      'Error messages: use role="alert" for immediate announcement',
      'Info/help messages: use aria-live="polite"',
      'Ensure message is not conveyed by color alone — add icon and text',
    ],
    implementationHints: [
      'Use consistent styling: colored left border + icon + message text',
      'Types: info (blue), success (green), warning (yellow), error (red)',
      'Place error messages directly below the related input',
      'Animate appearance with a subtle slide-down',
      'Allow dismissal for non-error messages',
    ],
  },
  {
    name: 'Skeleton Loading',
    category: 'feedback',
    description: 'Placeholder UI shapes that mimic the layout of actual content while data loads, indicating progress.',
    bestFor: [
      'Initial page/component data loading',
      'Content-heavy pages (cards, lists, profiles)',
      'Perceived performance improvement',
      'Replacing spinners for a better UX',
    ],
    accessibilityNotes: [
      'Mark loading region with aria-busy="true"',
      'Set aria-hidden="true" on skeleton elements',
      'Announce completion: aria-busy="false" + aria-live on the container',
      'Ensure animation respects prefers-reduced-motion',
    ],
    implementationHints: [
      'Match skeleton shapes closely to actual content layout',
      'Use a shimmer/wave animation (CSS gradient animation)',
      'Apply prefers-reduced-motion: reduce to disable animation',
      'Skeleton count should match expected item count (or reasonable default)',
      'Transition smoothly from skeleton to real content',
    ],
  },
  {
    name: 'Progress Indicator',
    category: 'feedback',
    description: 'Visual representation of operation progress — determinate (percentage) or indeterminate (ongoing).',
    bestFor: [
      'File uploads and downloads',
      'Multi-step processes with known duration',
      'Background task progress',
      'Page/content loading',
    ],
    accessibilityNotes: [
      'Use role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax',
      'For indeterminate: omit aria-valuenow',
      'Add aria-label or aria-labelledby describing what is loading',
      'Update aria-valuenow as progress changes',
      'Respect prefers-reduced-motion for animations',
    ],
    implementationHints: [
      'Determinate: show percentage text alongside the bar',
      'Indeterminate: use a looping animation (pulse or stripe)',
      'Top-of-page thin bar (like YouTube/GitHub) for page transitions',
      'Circular variant for compact spaces',
      'Provide estimated time remaining when possible',
    ],
  },

  /* ---------------------------------------------------------------------- */
  /*  Layout Patterns                                                        */
  /* ---------------------------------------------------------------------- */
  {
    name: 'Split View',
    category: 'layout',
    description: 'Two-panel layout where one panel shows a list/tree and the other shows detail for the selected item.',
    bestFor: [
      'Email clients (inbox list + message detail)',
      'File managers',
      'Settings panels with categories',
      'Master-detail interfaces',
    ],
    accessibilityNotes: [
      'Both panels must be navigable via keyboard',
      'Use aria-label to differentiate panel landmarks',
      'Selection in the list must update detail and announce the change',
      'Resizable divider needs role="separator" with aria-orientation',
    ],
    implementationHints: [
      'Use CSS Grid with resizable columns (via drag handle)',
      'Responsive: stack vertically on mobile, show list first',
      'Lazy-load detail panel content on selection change',
      'Persist split ratio in user preferences',
      'Support keyboard resizing (arrow keys on the divider)',
    ],
  },
  {
    name: 'Sticky Header',
    category: 'layout',
    description: 'Page or section header that remains fixed at the top of the viewport as the user scrolls.',
    bestFor: [
      'Pages with frequent navigation needs',
      'Long-form content where users need constant access to actions',
      'Dashboard headers with filters or controls',
    ],
    accessibilityNotes: [
      'Sticky elements must not obscure focused elements',
      'Ensure skip-navigation link accounts for sticky header offset',
      'Reduce header height on scroll to preserve content space',
    ],
    implementationHints: [
      'Use position: sticky with top: 0',
      'Add box-shadow or border on scroll for visual separation',
      'Consider a compact variant that activates after scroll threshold',
      'Account for sticky header height in scroll-to-anchor offsets',
      'Z-index management: header above content but below modals',
    ],
  },
  {
    name: 'Responsive Dashboard Grid',
    category: 'layout',
    description: 'Grid of widget cards that reflows based on viewport size, with optional drag-and-drop rearrangement.',
    bestFor: [
      'Analytics and monitoring dashboards',
      'Home screens with multiple data summaries',
      'Customizable user interfaces',
      'Overview pages',
    ],
    accessibilityNotes: [
      'Each widget needs role="region" with aria-label',
      'Drag-and-drop must have keyboard alternative (move up/down/left/right)',
      'Widget content must be independently scrollable if it overflows',
      'Announce layout changes to screen readers',
    ],
    implementationHints: [
      'Use CSS Grid with named grid areas for predefined layouts',
      'For customizable grids: use a library like react-grid-layout',
      'Define 1-col (mobile), 2-col (tablet), 3-4 col (desktop) layouts',
      'Persist user layout customization',
      'Support widget minimization/maximization',
    ],
  },
] as const;
