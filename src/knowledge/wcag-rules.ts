/**
 * @file wcag-rules.ts
 * @description WCAG 2.2 AA rules organized by principle with techniques and common failures
 * @author Charley Scholz, ELEV8
 * @coauthor Claude 4.6 Opus, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-23
 * @updated 2026-02-23
 */

export type WCAGLevel = 'A' | 'AA' | 'AAA';
export type WCAGPrinciple = 'Perceivable' | 'Operable' | 'Understandable' | 'Robust';

export interface WCAGRule {
  readonly id: string;
  readonly name: string;
  readonly level: WCAGLevel;
  readonly principle: WCAGPrinciple;
  readonly description: string;
  readonly techniques: readonly string[];
  readonly failures: readonly string[];
}

export const WCAG_RULES: readonly WCAGRule[] = [
  /* ======================================================================== */
  /*  1. PERCEIVABLE                                                          */
  /* ======================================================================== */

  /* -- 1.1 Text Alternatives -- */
  {
    id: '1.1.1',
    name: 'Non-text Content',
    level: 'A',
    principle: 'Perceivable',
    description: 'All non-text content presented to the user has a text alternative that serves the equivalent purpose.',
    techniques: [
      'Provide alt text for images that conveys the same information',
      'Use empty alt="" for decorative images',
      'Provide text alternatives for image maps',
      'Use aria-label or aria-labelledby for icon buttons',
      'Provide captions for CAPTCHA with alternative forms',
    ],
    failures: [
      'Missing alt attribute on <img> elements',
      'Alt text that says "image" or "photo" without description',
      'Icon buttons without accessible names',
      'CSS background images conveying information without text alternative',
      'Complex images (charts, diagrams) without long description',
    ],
  },

  /* -- 1.2 Time-based Media -- */
  {
    id: '1.2.1',
    name: 'Audio-only and Video-only (Prerecorded)',
    level: 'A',
    principle: 'Perceivable',
    description: 'For prerecorded audio-only and prerecorded video-only media, alternatives are provided.',
    techniques: [
      'Provide a transcript for audio-only content',
      'Provide an audio or text alternative for video-only content',
    ],
    failures: [
      'Podcast without transcript',
      'Silent instructional video without text description',
    ],
  },
  {
    id: '1.2.2',
    name: 'Captions (Prerecorded)',
    level: 'A',
    principle: 'Perceivable',
    description: 'Captions are provided for all prerecorded audio content in synchronized media.',
    techniques: [
      'Provide synchronized captions using WebVTT or SRT tracks',
      'Include speaker identification in captions',
      'Caption non-speech sounds relevant to understanding',
    ],
    failures: [
      'Video with no captions',
      'Auto-generated captions with significant errors left uncorrected',
      'Captions that omit relevant sound effects',
    ],
  },
  {
    id: '1.2.3',
    name: 'Audio Description or Media Alternative (Prerecorded)',
    level: 'A',
    principle: 'Perceivable',
    description: 'An alternative for time-based media or audio description of the prerecorded video content is provided.',
    techniques: [
      'Provide audio description track for video',
      'Provide a complete text transcript as alternative',
    ],
    failures: [
      'Video with critical visual information not described in audio',
    ],
  },
  {
    id: '1.2.5',
    name: 'Audio Description (Prerecorded)',
    level: 'AA',
    principle: 'Perceivable',
    description: 'Audio description is provided for all prerecorded video content in synchronized media.',
    techniques: [
      'Add a secondary audio track with descriptions of visual content',
      'Use extended audio descriptions when pauses in dialogue are insufficient',
    ],
    failures: [
      'Video relies on visual-only information with no audio description',
    ],
  },

  /* -- 1.3 Adaptable -- */
  {
    id: '1.3.1',
    name: 'Info and Relationships',
    level: 'A',
    principle: 'Perceivable',
    description: 'Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.',
    techniques: [
      'Use semantic HTML elements (headings, lists, tables, landmarks)',
      'Associate form labels with inputs using <label> or aria-labelledby',
      'Use <fieldset>/<legend> for related form controls',
      'Mark required fields with aria-required',
      'Use table headers with <th scope="col|row">',
    ],
    failures: [
      'Using visual formatting (bold, indentation) to convey structure without semantic markup',
      'Form inputs without associated labels',
      'Data tables without header cells',
      'Heading hierarchy that skips levels (h1 → h3)',
      'Using <br> tags to create visual lists instead of <ul>/<ol>',
    ],
  },
  {
    id: '1.3.2',
    name: 'Meaningful Sequence',
    level: 'A',
    principle: 'Perceivable',
    description: 'When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined.',
    techniques: [
      'Ensure DOM order matches visual order',
      'Use CSS flexbox/grid order property carefully — screen readers follow DOM order',
      'Ensure tabindex does not create illogical tab order',
    ],
    failures: [
      'CSS repositioning that makes reading order different from DOM order',
      'Using tabindex values > 0 that override natural tab order',
      'Content that only makes sense visually but not when linearized',
    ],
  },
  {
    id: '1.3.3',
    name: 'Sensory Characteristics',
    level: 'A',
    principle: 'Perceivable',
    description: 'Instructions provided for understanding and operating content do not rely solely on sensory characteristics such as shape, color, size, visual location, orientation, or sound.',
    techniques: [
      'Supplement color indicators with text labels or icons',
      'Reference content by its text label, not just position ("the Submit button" not "the button on the right")',
    ],
    failures: [
      'Instructions like "click the green button"',
      'Error states indicated only by color change',
      'Required fields marked only with asterisk color (no text explanation)',
    ],
  },
  {
    id: '1.3.4',
    name: 'Orientation',
    level: 'AA',
    principle: 'Perceivable',
    description: 'Content does not restrict its view and operation to a single display orientation unless a specific orientation is essential.',
    techniques: [
      'Ensure content works in both portrait and landscape',
      'Use responsive design that adapts to orientation changes',
    ],
    failures: [
      'Forcing portrait-only mode via CSS or meta viewport',
      'Content that is unusable when rotated',
    ],
  },
  {
    id: '1.3.5',
    name: 'Identify Input Purpose',
    level: 'AA',
    principle: 'Perceivable',
    description: 'The purpose of each input field collecting information about the user can be programmatically determined when the field relates to known input purposes.',
    techniques: [
      'Use autocomplete attribute with appropriate values (name, email, tel, address-line1, etc.)',
      'Use input type attributes that match the data (type="email", type="tel")',
    ],
    failures: [
      'Personal data fields without autocomplete attribute',
      'Using type="text" for email, phone, or URL fields',
    ],
  },

  /* -- 1.4 Distinguishable -- */
  {
    id: '1.4.1',
    name: 'Use of Color',
    level: 'A',
    principle: 'Perceivable',
    description: 'Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.',
    techniques: [
      'Add text labels or icons alongside color indicators',
      'Use patterns or textures in addition to color in charts',
      'Underline links in body text (not just color difference)',
    ],
    failures: [
      'Form errors indicated only by red border',
      'Required fields marked only by color',
      'Links distinguishable from text only by color',
      'Chart data differentiated only by color',
    ],
  },
  {
    id: '1.4.2',
    name: 'Audio Control',
    level: 'A',
    principle: 'Perceivable',
    description: 'If any audio on a web page plays automatically for more than 3 seconds, a mechanism is available to pause or stop the audio, or to control audio volume independently.',
    techniques: [
      'Do not auto-play audio',
      'If audio must auto-play, provide pause/stop/mute control within first 3 seconds',
      'Provide independent volume control',
    ],
    failures: [
      'Background audio that plays automatically with no way to stop it',
      'Video that auto-plays with sound',
    ],
  },
  {
    id: '1.4.3',
    name: 'Contrast (Minimum)',
    level: 'AA',
    principle: 'Perceivable',
    description: 'Text and images of text have a contrast ratio of at least 4.5:1, except for large text (3:1), incidental text, or logotypes.',
    techniques: [
      'Test all text against background using contrast ratio tools',
      'Ensure 4.5:1 ratio for normal text (< 18pt or < 14pt bold)',
      'Ensure 3:1 ratio for large text (>= 18pt or >= 14pt bold)',
      'Test contrast in all UI states (hover, focus, disabled)',
    ],
    failures: [
      'Light gray text on white background',
      'Text over images without overlay to ensure contrast',
      'Placeholder text with insufficient contrast',
      'Disabled state text that is still intended to be read',
    ],
  },
  {
    id: '1.4.4',
    name: 'Resize Text',
    level: 'AA',
    principle: 'Perceivable',
    description: 'Text can be resized without assistive technology up to 200 percent without loss of content or functionality.',
    techniques: [
      'Use relative units (rem, em, %) for font sizes',
      'Ensure layouts adapt when text is zoomed to 200%',
      'Do not set maximum-scale in viewport meta',
    ],
    failures: [
      'Fixed pixel font sizes',
      'Text clipped or overlapping when zoomed',
      'Horizontal scroll required when text is enlarged',
      'viewport meta with maximum-scale=1 or user-scalable=no',
    ],
  },
  {
    id: '1.4.5',
    name: 'Images of Text',
    level: 'AA',
    principle: 'Perceivable',
    description: 'If the technologies being used can achieve the visual presentation, text is used to convey information rather than images of text.',
    techniques: [
      'Use styled HTML text instead of text in images',
      'Use web fonts for custom typography',
      'Use SVG text for scalable graphic text',
    ],
    failures: [
      'Using image files for headings or body text',
      'Buttons rendered as images instead of styled HTML',
    ],
  },
  {
    id: '1.4.10',
    name: 'Reflow',
    level: 'AA',
    principle: 'Perceivable',
    description: 'Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions, at 320 CSS px wide (for vertical content) and 256 CSS px high (for horizontal content).',
    techniques: [
      'Use responsive design that reflows to single column at 320px',
      'Avoid fixed-width layouts',
      'Use CSS Flexbox or Grid for adaptive layouts',
      'Ensure tables have a mobile-friendly alternative',
    ],
    failures: [
      'Horizontal scrollbar at 320px viewport width',
      'Content that is cut off at narrow widths',
      'Fixed-width containers that do not resize',
    ],
  },
  {
    id: '1.4.11',
    name: 'Non-text Contrast',
    level: 'AA',
    principle: 'Perceivable',
    description: 'UI components and graphical objects have a contrast ratio of at least 3:1 against adjacent colors.',
    techniques: [
      'Ensure form field borders have 3:1 contrast against background',
      'Icon contrast is 3:1 or higher',
      'Focus indicators are clearly visible with 3:1 contrast',
      'Chart elements have sufficient contrast',
    ],
    failures: [
      'Light gray form borders on white background',
      'Icons that blend into background',
      'Focus indicators with insufficient contrast',
      'Custom checkboxes/radios with low-contrast borders',
    ],
  },
  {
    id: '1.4.12',
    name: 'Text Spacing',
    level: 'AA',
    principle: 'Perceivable',
    description: 'No loss of content or functionality occurs when users override text spacing: line height to 1.5x, paragraph spacing to 2x, letter spacing to 0.12x, word spacing to 0.16x font size.',
    techniques: [
      'Use relative units for spacing',
      'Do not set fixed heights on text containers',
      'Allow text containers to expand vertically',
    ],
    failures: [
      'Text clipped when spacing is increased',
      'Content overlaps when line height is changed',
      'Fixed-height containers that hide text overflow',
    ],
  },
  {
    id: '1.4.13',
    name: 'Content on Hover or Focus',
    level: 'AA',
    principle: 'Perceivable',
    description: 'Where receiving and then removing hover or focus triggers additional content: the additional content is dismissible, hoverable, and persistent.',
    techniques: [
      'Tooltips/popovers are dismissible with Escape',
      'User can hover over the tooltip without it disappearing',
      'Content persists until user dismisses or moves focus/hover away',
    ],
    failures: [
      'Tooltip that disappears when moving mouse toward it',
      'Tooltip that cannot be dismissed by Escape',
      'Hover content that obscures other content with no dismiss option',
    ],
  },

  /* ======================================================================== */
  /*  2. OPERABLE                                                             */
  /* ======================================================================== */

  /* -- 2.1 Keyboard Accessible -- */
  {
    id: '2.1.1',
    name: 'Keyboard',
    level: 'A',
    principle: 'Operable',
    description: 'All functionality is operable through a keyboard interface without requiring specific timings for individual keystrokes.',
    techniques: [
      'Use native interactive elements (button, a, input) that are keyboard-accessible by default',
      'Add tabindex="0" and keyboard handlers to custom interactive elements',
      'Ensure all click handlers also work with Enter/Space',
      'Implement keyboard shortcuts for complex interactions',
    ],
    failures: [
      'Click-only interactions without keyboard equivalents',
      'Drag-and-drop without keyboard alternative',
      'Custom components that cannot receive focus',
      'Mouse-dependent interactions (hover-only menus without keyboard support)',
    ],
  },
  {
    id: '2.1.2',
    name: 'No Keyboard Trap',
    level: 'A',
    principle: 'Operable',
    description: 'If keyboard focus can be moved to a component using a keyboard interface, focus can be moved away using only a keyboard interface.',
    techniques: [
      'Ensure Tab and Shift+Tab can move focus through all interactive elements',
      'Modals must allow Escape to close and return focus',
      'Do not prevent default Tab behavior except in intentional focus traps (modals)',
    ],
    failures: [
      'Focus trapped in an element with no way to escape',
      'Custom widgets that capture Tab key without allowing exit',
      'Embedded content (iframes, video players) that trap keyboard focus',
    ],
  },
  {
    id: '2.1.4',
    name: 'Character Key Shortcuts',
    level: 'A',
    principle: 'Operable',
    description: 'If a keyboard shortcut is implemented using only letter, punctuation, number, or symbol characters, then the shortcut can be turned off, remapped, or is only active on focus.',
    techniques: [
      'Use modifier keys (Ctrl, Alt, Cmd) with single-character shortcuts',
      'Provide a way to disable or remap single-character shortcuts',
      'Only activate single-key shortcuts when the relevant component has focus',
    ],
    failures: [
      'Single-letter shortcuts that activate globally, causing conflicts with assistive technology',
    ],
  },

  /* -- 2.2 Enough Time -- */
  {
    id: '2.2.1',
    name: 'Timing Adjustable',
    level: 'A',
    principle: 'Operable',
    description: 'For each time limit set by the content, the user can turn off, adjust, or extend the time limit.',
    techniques: [
      'Warn users before session timeout with option to extend',
      'Allow users to set their own time limits',
      'Provide at least 20 seconds to respond to a timeout warning',
    ],
    failures: [
      'Session expires without warning',
      'Timed quizzes with no extension option',
      'Auto-advancing slideshows with no pause control',
    ],
  },
  {
    id: '2.2.2',
    name: 'Pause, Stop, Hide',
    level: 'A',
    principle: 'Operable',
    description: 'For moving, blinking, scrolling, or auto-updating information, the user can pause, stop, or hide it.',
    techniques: [
      'Provide pause/stop controls for carousels and auto-scrolling content',
      'Animations should respect prefers-reduced-motion',
      'Auto-updating content should have pause option',
    ],
    failures: [
      'Auto-playing carousel with no pause button',
      'Animations that cannot be stopped',
      'Live regions that update too frequently without pause option',
    ],
  },

  /* -- 2.3 Seizures and Physical Reactions -- */
  {
    id: '2.3.1',
    name: 'Three Flashes or Below Threshold',
    level: 'A',
    principle: 'Operable',
    description: 'Web pages do not contain anything that flashes more than three times in any one second period.',
    techniques: [
      'Avoid flashing content entirely',
      'If flashing is necessary, keep below 3 flashes per second',
      'Provide a warning and option to disable flashing content',
    ],
    failures: [
      'Rapidly flashing animations or GIFs',
      'Video content with strobe effects',
    ],
  },

  /* -- 2.4 Navigable -- */
  {
    id: '2.4.1',
    name: 'Bypass Blocks',
    level: 'A',
    principle: 'Operable',
    description: 'A mechanism is available to bypass blocks of content that are repeated on multiple web pages.',
    techniques: [
      'Provide "Skip to main content" link as first focusable element',
      'Use landmark roles (main, nav, aside, footer)',
      'Use heading hierarchy for easy navigation',
    ],
    failures: [
      'No skip navigation link',
      'Missing landmark roles on major page sections',
    ],
  },
  {
    id: '2.4.2',
    name: 'Page Titled',
    level: 'A',
    principle: 'Operable',
    description: 'Web pages have titles that describe topic or purpose.',
    techniques: [
      'Set descriptive <title> for each page',
      'Update title for single-page applications on route change',
      'Format: "Page Name — Site Name"',
    ],
    failures: [
      'Generic or missing page title',
      'Same title on all pages',
      'SPA that does not update title on navigation',
    ],
  },
  {
    id: '2.4.3',
    name: 'Focus Order',
    level: 'A',
    principle: 'Operable',
    description: 'If a web page can be navigated sequentially and the navigation sequences affect meaning, focusable components receive focus in an order that preserves meaning.',
    techniques: [
      'Ensure DOM order matches logical reading order',
      'Manage focus when content changes dynamically',
      'Use tabindex="0" (not positive values) for custom focusable elements',
    ],
    failures: [
      'Positive tabindex values creating illogical order',
      'Modal that does not receive focus when opened',
      'Dynamic content inserted without focus management',
    ],
  },
  {
    id: '2.4.4',
    name: 'Link Purpose (In Context)',
    level: 'A',
    principle: 'Operable',
    description: 'The purpose of each link can be determined from the link text alone or from the link text together with its programmatically determined context.',
    techniques: [
      'Use descriptive link text ("View order #1234" not "Click here")',
      'If link text is generic, add aria-label or aria-describedby for context',
      'Ensure linked images have descriptive alt text',
    ],
    failures: [
      'Links that say "Click here", "Read more", "Learn more" without context',
      'Multiple identical link texts leading to different destinations',
    ],
  },
  {
    id: '2.4.5',
    name: 'Multiple Ways',
    level: 'AA',
    principle: 'Operable',
    description: 'More than one way is available to locate a web page within a set of web pages.',
    techniques: [
      'Provide navigation menu, search, and sitemap',
      'Include breadcrumbs for hierarchical navigation',
      'Provide related links/content suggestions',
    ],
    failures: [
      'Single navigation method with no search or sitemap alternative',
    ],
  },
  {
    id: '2.4.6',
    name: 'Headings and Labels',
    level: 'AA',
    principle: 'Operable',
    description: 'Headings and labels describe topic or purpose.',
    techniques: [
      'Use descriptive headings that summarize the following content',
      'Form labels clearly describe what input is expected',
      'Section headings are unique and specific',
    ],
    failures: [
      'Vague headings like "Section 1"',
      'Form labels that do not describe the expected input',
      'Multiple identical headings on the same page',
    ],
  },
  {
    id: '2.4.7',
    name: 'Focus Visible',
    level: 'AA',
    principle: 'Operable',
    description: 'Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.',
    techniques: [
      'Keep default browser focus outlines or provide custom visible focus styles',
      'Focus style should have at least 3:1 contrast',
      'Use :focus-visible to show focus only for keyboard users',
      'Ensure focus is visible in all color themes',
    ],
    failures: [
      'outline: none without replacement focus style',
      'Focus indicator with insufficient contrast',
      'Focus style that is invisible on certain backgrounds',
    ],
  },
  {
    id: '2.4.11',
    name: 'Focus Not Obscured (Minimum)',
    level: 'AA',
    principle: 'Operable',
    description: 'When a UI component receives keyboard focus, the component is not entirely hidden due to author-created content.',
    techniques: [
      'Ensure sticky headers, footers, and overlays do not fully obscure focused elements',
      'Scroll focused elements into view accounting for sticky element heights',
      'Use scroll-padding-top to offset for fixed headers',
    ],
    failures: [
      'Focused element completely hidden behind sticky header',
      'Chat widget or cookie banner obscuring focused element',
    ],
  },

  /* -- 2.5 Input Modalities -- */
  {
    id: '2.5.1',
    name: 'Pointer Gestures',
    level: 'A',
    principle: 'Operable',
    description: 'All functionality that uses multipoint or path-based gestures can be operated with a single pointer without a path-based gesture.',
    techniques: [
      'Provide single-tap/click alternatives for pinch-zoom, swipe, and multi-touch gestures',
      'Add on-screen buttons for actions triggered by gestures',
    ],
    failures: [
      'Swipe-only actions with no button alternative',
      'Pinch-to-zoom as only way to zoom',
    ],
  },
  {
    id: '2.5.2',
    name: 'Pointer Cancellation',
    level: 'A',
    principle: 'Operable',
    description: 'For functionality operated using a single pointer, at least one of the following is true: the down-event is not used; completion is on up-event; the up-event reverses the down-event outcome; or the down-event is essential.',
    techniques: [
      'Use click (up-event) not mousedown for actions',
      'Allow users to move pointer away to cancel an action',
    ],
    failures: [
      'Triggering destructive actions on mousedown/touchstart',
    ],
  },
  {
    id: '2.5.3',
    name: 'Label in Name',
    level: 'A',
    principle: 'Operable',
    description: 'For UI components with labels that include text or images of text, the accessible name contains the text that is presented visually.',
    techniques: [
      'Ensure aria-label matches or includes visible text label',
      'Use visible text as the accessible name when possible',
    ],
    failures: [
      'Button with visible text "Search" but aria-label="Find items"',
      'Mismatch between visible label and accessible name',
    ],
  },
  {
    id: '2.5.4',
    name: 'Motion Actuation',
    level: 'A',
    principle: 'Operable',
    description: 'Functionality operated by device motion or user motion can also be operated by user interface components, and the motion response can be disabled.',
    techniques: [
      'Provide UI controls as alternatives to shake, tilt, or other motion gestures',
      'Allow users to disable motion-triggered features',
    ],
    failures: [
      'Shake-to-undo with no button alternative',
      'Tilt-to-scroll with no disable option',
    ],
  },
  {
    id: '2.5.7',
    name: 'Dragging Movements',
    level: 'AA',
    principle: 'Operable',
    description: 'All functionality that uses a dragging movement can be achieved by a single pointer without dragging, unless dragging is essential.',
    techniques: [
      'Provide click-based alternatives for drag-and-drop (e.g., move buttons, context menus)',
      'Allow keyboard-based reordering as alternative to drag-and-drop',
    ],
    failures: [
      'Drag-to-reorder with no keyboard or click alternative',
      'Slider that can only be operated by dragging',
    ],
  },
  {
    id: '2.5.8',
    name: 'Target Size (Minimum)',
    level: 'AA',
    principle: 'Operable',
    description: 'The size of the target for pointer inputs is at least 24 by 24 CSS pixels, except where an equivalent target exists, the target is in-line, the user agent determines the size, or the size is essential.',
    techniques: [
      'Ensure interactive elements are at least 24x24 CSS pixels',
      'Add padding to small targets to increase hit area',
      'Space targets sufficiently apart (at least 8px gap)',
    ],
    failures: [
      'Tiny icon buttons smaller than 24x24px',
      'Densely packed links or buttons without adequate spacing',
    ],
  },

  /* ======================================================================== */
  /*  3. UNDERSTANDABLE                                                       */
  /* ======================================================================== */

  /* -- 3.1 Readable -- */
  {
    id: '3.1.1',
    name: 'Language of Page',
    level: 'A',
    principle: 'Understandable',
    description: 'The default human language of each web page can be programmatically determined.',
    techniques: [
      'Set lang attribute on the <html> element',
      'Use valid IETF language tags (e.g., "en", "fr", "ja")',
    ],
    failures: [
      'Missing lang attribute',
      'Incorrect language code',
    ],
  },
  {
    id: '3.1.2',
    name: 'Language of Parts',
    level: 'AA',
    principle: 'Understandable',
    description: 'The language of each passage or phrase in the content can be programmatically determined.',
    techniques: [
      'Use lang attribute on elements containing text in a different language',
      'Mark up language changes for proper pronunciation by screen readers',
    ],
    failures: [
      'Foreign language phrases without lang attribute',
      'Mixed-language content with no language markup',
    ],
  },

  /* -- 3.2 Predictable -- */
  {
    id: '3.2.1',
    name: 'On Focus',
    level: 'A',
    principle: 'Understandable',
    description: 'When any UI component receives focus, it does not initiate a change of context.',
    techniques: [
      'Do not trigger navigation, form submission, or modal opening on focus',
      'Use activation events (click, Enter) for context changes, not focus',
    ],
    failures: [
      'Form that submits when last field receives focus',
      'Dropdown that navigates on focus instead of on selection',
    ],
  },
  {
    id: '3.2.2',
    name: 'On Input',
    level: 'A',
    principle: 'Understandable',
    description: 'Changing the setting of any UI component does not automatically cause a change of context unless the user has been advised beforehand.',
    techniques: [
      'Use a submit button for forms, not auto-submit on change',
      'If auto-submit is used, warn users before the form',
      'Language/currency selectors should use a "Go" button',
    ],
    failures: [
      'Selecting a dropdown option navigates to a new page without warning',
      'Checkbox that triggers page reload on change',
    ],
  },
  {
    id: '3.2.3',
    name: 'Consistent Navigation',
    level: 'AA',
    principle: 'Understandable',
    description: 'Navigational mechanisms that are repeated on multiple pages occur in the same relative order each time they are repeated.',
    techniques: [
      'Keep navigation menus in the same position and order across pages',
      'Use consistent header/footer layout site-wide',
    ],
    failures: [
      'Navigation items in different order on different pages',
      'Header layout that varies between pages',
    ],
  },
  {
    id: '3.2.4',
    name: 'Consistent Identification',
    level: 'AA',
    principle: 'Understandable',
    description: 'Components that have the same functionality within a set of web pages are identified consistently.',
    techniques: [
      'Use the same label for the same action across pages (e.g., always "Search" not sometimes "Find")',
      'Use consistent icon + label combinations',
    ],
    failures: [
      'Search labeled "Search" on one page and "Find" on another',
      'Print icon that means "print" on one page and "preview" on another',
    ],
  },
  {
    id: '3.2.6',
    name: 'Consistent Help',
    level: 'A',
    principle: 'Understandable',
    description: 'If a web page contains help mechanisms (contact info, self-help option, human contact), they are in a consistent location relative to other content across pages.',
    techniques: [
      'Place help link or chat widget in the same position on every page',
      'Keep contact information in consistent footer location',
    ],
    failures: [
      'Help link in header on some pages and footer on others',
      'Inconsistent placement of support chat widget',
    ],
  },

  /* -- 3.3 Input Assistance -- */
  {
    id: '3.3.1',
    name: 'Error Identification',
    level: 'A',
    principle: 'Understandable',
    description: 'If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.',
    techniques: [
      'Display specific error messages next to the problematic field',
      'Use aria-invalid and aria-describedby to associate error with field',
      'Provide an error summary at the top of the form',
    ],
    failures: [
      'Generic "Form has errors" with no specifics',
      'Error indicator is color-only (no text)',
      'Error messages not associated with their fields programmatically',
    ],
  },
  {
    id: '3.3.2',
    name: 'Labels or Instructions',
    level: 'A',
    principle: 'Understandable',
    description: 'Labels or instructions are provided when content requires user input.',
    techniques: [
      'Provide visible labels for all form inputs',
      'Add helper text for fields with specific format requirements',
      'Mark required fields clearly',
    ],
    failures: [
      'Placeholder text as the only label',
      'No indication of required fields',
      'No format hints for fields like dates or phone numbers',
    ],
  },
  {
    id: '3.3.3',
    name: 'Error Suggestion',
    level: 'AA',
    principle: 'Understandable',
    description: 'If an input error is automatically detected and suggestions for correction are known, the suggestions are provided unless it would jeopardize security.',
    techniques: [
      'Suggest the correct format ("Date must be MM/DD/YYYY")',
      'Offer alternatives ("Did you mean user@example.com?")',
      'Provide examples of valid input',
    ],
    failures: [
      'Error says "Invalid input" without explaining what is expected',
      'No suggestion for how to fix the error',
    ],
  },
  {
    id: '3.3.4',
    name: 'Error Prevention (Legal, Financial, Data)',
    level: 'AA',
    principle: 'Understandable',
    description: 'For pages that cause legal commitments or financial transactions: submissions are reversible, data is checked for errors and user can correct, or a mechanism is available to review and confirm.',
    techniques: [
      'Provide review/confirmation step before final submission',
      'Allow corrections after submission (within a time window)',
      'Show a summary of all entered data before confirming',
    ],
    failures: [
      'Financial transaction with no confirmation step',
      'Irreversible data deletion without confirmation dialog',
    ],
  },
  {
    id: '3.3.7',
    name: 'Redundant Entry',
    level: 'A',
    principle: 'Understandable',
    description: 'Information previously entered by or provided to the user that is required to be entered again in the same process is either auto-populated or available for the user to select.',
    techniques: [
      'Auto-fill fields with previously entered data (e.g., shipping address → billing address)',
      'Provide "Same as above" checkbox for repeated information',
    ],
    failures: [
      'Requiring user to re-enter shipping address for billing',
      'Asking for name again in a later step of a wizard',
    ],
  },
  {
    id: '3.3.8',
    name: 'Accessible Authentication (Minimum)',
    level: 'AA',
    principle: 'Understandable',
    description: 'A cognitive function test is not required for any step in an authentication process unless an alternative method or mechanism is available.',
    techniques: [
      'Support password managers (allow paste in password fields)',
      'Offer passwordless authentication (magic links, OAuth, passkeys)',
      'If CAPTCHA is used, provide an audio or logic-based alternative',
    ],
    failures: [
      'Blocking paste in password fields',
      'CAPTCHA as the only authentication method',
      'Requiring users to transcribe or recall a code without copy/paste support',
    ],
  },

  /* ======================================================================== */
  /*  4. ROBUST                                                               */
  /* ======================================================================== */

  {
    id: '4.1.2',
    name: 'Name, Role, Value',
    level: 'A',
    principle: 'Robust',
    description: 'For all UI components, the name and role can be programmatically determined; states, properties, and values that can be set by the user can be programmatically set.',
    techniques: [
      'Use semantic HTML elements with built-in roles',
      'Custom components: add appropriate ARIA roles, states, and properties',
      'Ensure accessible name via label, aria-label, or aria-labelledby',
      'Update ARIA states (aria-expanded, aria-checked, etc.) dynamically',
    ],
    failures: [
      'Custom checkbox without role="checkbox" and aria-checked',
      'Interactive div without role and keyboard support',
      'Button-like element using <span> without role="button"',
      'Dynamic state changes not reflected in ARIA attributes',
    ],
  },
  {
    id: '4.1.3',
    name: 'Status Messages',
    level: 'AA',
    principle: 'Robust',
    description: 'In content implemented using markup languages, status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus.',
    techniques: [
      'Use role="status" with aria-live="polite" for success/info messages',
      'Use role="alert" with aria-live="assertive" for errors',
      'Use aria-live regions for search result counts',
      'Use role="progressbar" for progress updates',
    ],
    failures: [
      'Toast notifications without aria-live or role="status"',
      'Search result count updates not announced',
      'Error messages that only appear visually without live region',
    ],
  },
] as const;

export const WCAG_PRINCIPLES: readonly { name: WCAGPrinciple; description: string }[] = [
  {
    name: 'Perceivable',
    description: 'Information and user interface components must be presentable to users in ways they can perceive.',
  },
  {
    name: 'Operable',
    description: 'User interface components and navigation must be operable.',
  },
  {
    name: 'Understandable',
    description: 'Information and the operation of the user interface must be understandable.',
  },
  {
    name: 'Robust',
    description: 'Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.',
  },
] as const;
