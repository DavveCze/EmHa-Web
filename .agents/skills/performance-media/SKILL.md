---
name: performance-media
description: Optimizes EmHa Elektro loading performance, responsive images, fonts, animation and Vite bundles. Use when adding media, improving Core Web Vitals or investigating slow pages and layout shifts.
---

# Performance and media

## Measure first

Inspect the production build and current loading path before optimizing. Separate lab observations from real-user data. Never fabricate Lighthouse or Core Web Vitals numbers.

## Priority order

1. LCP/hero media and render-blocking resources.
2. Layout shifts from images, fonts, banners and async messages.
3. JavaScript shipped on initial load.
4. Below-the-fold images and third parties.
5. Animation and long-running work.

## Media rules

- Provide intrinsic `width`/`height` or stable `aspect-ratio`.
- Use responsive `srcset`/`sizes` or the project’s image pipeline.
- Use modern formats when supported while preserving a suitable fallback strategy.
- Do not lazy-load the likely LCP image; do lazy-load non-critical images.
- Match mobile crops to the composition rather than downloading an oversized desktop background.
- Use real approved project photos and accurate alt text; do not optimize away necessary visual quality.

## Fonts and code

Limit families/weights, subset if licensing and tooling allow, and preload only critical fonts actually used above the fold. Inspect bundle output before introducing manual chunks. Lazy-load meaningful route or feature boundaries, not every small component.

## Motion

Prefer CSS transform/opacity, avoid layout-heavy continuous animation and honor reduced-motion preferences. Decorative motion must never block interaction or comprehension.

## Report

Document baseline evidence, changes, production-build result and remaining bottlenecks. State whether findings came from source inspection, browser tooling, lab testing or real-user monitoring.
