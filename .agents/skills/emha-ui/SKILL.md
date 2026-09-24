---
name: emha-ui
description: Designs or implements EmHa Elektro React/Vite pages and components according to the approved green, cream and yellow visual direction. Use for layout, sections, component styling and service-page UI.
---

# EmHa Elektro UI

## Goal

Create a credible Czech electrician website where renovation electrical work is the primary offer and related systems remain easy to discover.

## Procedure

1. Read `AGENTS.md`, inspect current tokens/components and identify the requested user journey.
2. Preserve the visual language: deep green, warm off-white, restrained warm yellow, editorial headings, clean body type and generous whitespace.
3. Build the mobile composition first, then enhance for wider viewports.
4. Keep one dominant CTA per section. Secondary actions must be visually quieter.
5. Reuse components only when their content and behavior truly repeat.
6. Implement semantic section landmarks and heading order while building, not afterward.
7. Verify real content lengths, especially long Czech headings, phone/email strings and CTA labels.

## Homepage priorities

- Hero must identify renovation electrical work immediately.
- Proof elements may use only verified facts.
- Secondary services should be grouped clearly: electrical work, Ajax/security, automation and internet/data/low voltage.
- Project references should use real approved work; otherwise use an honest placeholder state rather than invented projects.
- Contact must offer a clear next step and a direct fallback such as phone/email when approved.

## Component states

For interactive components cover default, hover, focus-visible, active, disabled, loading, success and error where applicable. Do not communicate state only through color.

## Avoid

- Generic SaaS aesthetics.
- Multiple loud CTAs in one viewport.
- Tiny centered body copy, excessive uppercase and low-contrast text.
- Decorative electrical icons without labels.
- Desktop layouts merely scaled down for mobile.
- Unverified badges, counters, ratings or certifications.

## Completion checks

Check 320–1440 CSS pixels, heading wraps, focus states, media crops, reduced motion, horizontal overflow and consistency with existing tokens.
