---
name: frontend-quality
description: Reviews and improves EmHa Elektro React/Vite architecture, components, state, dependencies, tests and build quality. Use for implementation, refactoring, bug fixing or pull-request review.
---

# React and Vite quality

## Start

Read `AGENTS.md`, `package.json`, lockfile, Vite config and nearby code. Detect JavaScript/TypeScript, styling approach, router, test runner and lint rules. Do not impose a new stack without approval.

## Implementation rules

- Prefer clear component boundaries and colocated behavior.
- Keep derived values derived; avoid synchronization effects unless interacting with an external system.
- Clean up timers, listeners, observers and requests.
- Use semantic elements and preserve browser behavior.
- Keep data/content definitions separate from repeated visual markup when this simplifies maintenance.
- Avoid broad context providers, global state and memoization without demonstrated need.
- Do not add a dependency for trivial behavior available in the platform or current stack.
- Never put secrets in frontend code or `VITE_*` environment variables.
- Preserve unrelated code and avoid formatting the entire repository for a focused change.

## Validation

Use the existing package manager and scripts. Typical checks, only when present or safely supported:

1. Lint.
2. Type-check (`tsc --noEmit` or project equivalent).
3. Unit/component tests.
4. Production build.
5. Targeted manual interaction checks.

Do not use `vite preview` as a production server. Do not claim success for commands not run.

## Review format

Lead with actionable findings ordered by severity. Reference files and lines where possible. Explain the failure mode, not merely a style preference. Then note test gaps, assumptions and a concise change summary.
