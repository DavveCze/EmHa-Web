---
name: responsive-accessibility
description: Audits and fixes EmHa Elektro responsive behavior and WCAG 2.2 AA accessibility. Use for mobile layouts, navigation, forms, keyboard behavior, semantics, focus and contrast.
---

# Responsive and accessibility audit

## Audit order

1. Inspect the real DOM and CSS before proposing changes.
2. Test narrow widths first: about 320 and 375 CSS pixels.
3. Test layout transitions around 768, 1024 and 1440 pixels and where content naturally breaks.
4. Navigate the page with keyboard only.
5. Inspect landmarks, heading hierarchy, accessible names and form errors.
6. Check zoom/reflow, reduced motion and touch ergonomics.

## Required behavior

- No horizontal page scrolling at 320 CSS pixels.
- Navigation remains operable without pointer input and exposes state with `aria-expanded` where appropriate.
- Focus is visible and not hidden behind sticky UI.
- Links look and behave as links; buttons perform actions.
- Labels remain visible after typing. Errors are specific, associated with fields and announced appropriately.
- Success messages confirm outcome without unexpectedly moving focus.
- Decorative images have empty alt text; useful images describe purpose, not visual trivia.
- Content order stays logical when grid/flex layouts collapse.
- Motion is optional and disabled or reduced when requested by the user.

## Fix strategy

Prefer semantic HTML and native behavior before ARIA. Fix root causes rather than adding arbitrary pixel overrides. Use content-based wrapping, `min-width: 0`, sensible grid minimums and reserved media dimensions.

## Report

List findings by severity: blocker, high, medium, low. For each include affected component, user impact, evidence, fix and verification performed. Never state WCAG compliance from an automated scan alone.
