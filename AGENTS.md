# EmHa Elektro — project instructions

## Project mission

Build a fast, trustworthy and conversion-focused Czech website for **EmHa Elektro** in React + Vite.

The primary commercial focus is electrical installations during apartment and house renovations. Secondary services may include general electrical work, Ajax security systems, home automation, internet/data cabling and other low-voltage work. Keep renovation wiring visually and semantically dominant; secondary services support the offer and must not dilute it.

## Source of truth

- Inspect the repository, `package.json`, existing components and content before changing anything.
- Preserve confirmed client facts. Never invent qualifications, authorizations, certificates, warranties, response times, prices, service areas, years of experience, review scores, partner statuses or supported brands.
- Treat missing business details as placeholders or explicit TODOs. Ask for the real value when it blocks a correct implementation.
- Use the exact client-approved spelling of service names. Use “Ajax” or “Ajax Systems” only if this is the intended security brand; do not silently reinterpret it as the JavaScript AJAX technique.
- Do not claim that EmHa Elektro performs inspections/revisions unless this is explicitly confirmed and legally accurate.
- Do not publish personal data, tracking, maps, third-party embeds or form processors without approval.

## Audience and message

Primary visitors are Czech homeowners or apartment owners planning a renovation. They need to understand quickly:

1. Does EmHa Elektro handle electrical work for my renovation?
2. Can I trust the workmanship and communication?
3. What related systems can be handled in the same project?
4. How do I request a consultation or quote?

Lead with outcomes and reduced uncertainty rather than technical jargon. Use short, concrete Czech sentences. Explain specialist terms in plain language.

## Visual direction

Follow the approved visual direction visible in the supplied design reference:

- Calm, professional trade-service aesthetic.
- Deep green primary surfaces, warm off-white backgrounds and restrained warm yellow accents.
- Strong editorial headings, clean sans-serif body text and generous spacing.
- Authentic electrical-work imagery; avoid generic corporate imagery and fake project photos.
- Clear cards, proof sections, process steps, service navigation and a visible contact CTA.
- Mobile is a designed layout, not a compressed desktop screenshot.

Reuse existing design tokens and components before introducing new patterns. Avoid gradients, glassmorphism, excessive shadows, decorative animations and competing accent colors unless the current design system already requires them.

## Information architecture

Keep the homepage hierarchy intentional:

1. Hero: renovation-focused value proposition and one primary CTA.
2. Trust/proof strip using only verified facts.
3. Main renovation-electrics offer.
4. Supporting services: electrical work, Ajax/security, automation, internet/data and low voltage.
5. Process or reasons to choose EmHa Elektro.
6. Real projects/references, if approved assets exist.
7. Contact section with low-friction form and direct contact alternatives.
8. Footer with consistent business identity and legal links.

Create dedicated service pages only when they contain genuinely useful, unique content. Do not produce thin pages merely to target keyword variants.

## React and Vite rules

- Follow the repository’s existing language: do not migrate JavaScript to TypeScript or vice versa without approval.
- Prefer small semantic components with clear responsibilities. Avoid premature abstractions and one-use component factories.
- Keep route-level content and reusable UI separate where the current architecture supports it.
- Use stable keys, explicit state names and predictable data flow. Do not store derived state unnecessarily.
- Avoid `dangerouslySetInnerHTML`. If unavoidable for trusted structured content, document the source and sanitize untrusted HTML.
- Lazy-load non-critical route or media code only when it improves the real loading path; do not fragment tiny bundles pointlessly.
- Keep dependencies lean. Before adding one, explain why the platform or current stack is insufficient.
- Never expose secrets in `VITE_*` variables; Vite client variables are part of the public browser bundle.
- Preserve the existing lockfile and package manager. Do not regenerate another lockfile.

## CSS and responsiveness

- Use mobile-first CSS and content-driven breakpoints, not device-name breakpoints.
- Test at approximately 320, 375, 768, 1024 and 1440 CSS pixels, plus intermediate widths where wrapping changes.
- No horizontal overflow at 320 CSS pixels.
- Use fluid sizing with `clamp()` where appropriate, but cap line lengths and component growth.
- Allow headings and CTA labels to wrap naturally; never solve overflow by shrinking important text below readable sizes.
- Reserve media dimensions or use `aspect-ratio` to reduce layout shifts.
- Keep touch targets comfortably usable and separated.
- Respect `prefers-reduced-motion`; no essential information may depend on animation.

## Accessibility

- Target WCAG 2.2 AA for the implemented UI.
- Use semantic landmarks, logical headings, visible keyboard focus and native controls first.
- Every form control needs a programmatic label, useful autocomplete where applicable and accessible validation feedback.
- Do not use placeholders as labels.
- Ensure menus, dialogs, accordions and carousels are keyboard-operable and restore focus sensibly.
- Images need meaningful Czech `alt` text when informative and empty `alt` when decorative.
- Do not encode status or meaning by color alone.

## SEO

- Every indexable route must have a unique Czech title, description, canonical URL and one clear H1.
- Keep business name, telephone, email, address/service area and URLs consistent wherever shown.
- Use crawlable links for navigation; do not implement primary navigation as click handlers on non-links.
- Provide useful internal links between the renovation page and relevant supporting services.
- Add valid `Electrician`/`LocalBusiness` and `Service` JSON-LD only from verified visible facts. Schema must match page content.
- Maintain `robots.txt` and `sitemap.xml` for the real production host. Do not ship staging URLs or placeholders.
- Do not use keyword stuffing, hidden text, fake reviews, doorway pages or unsupported location pages.
- For a marketing site where organic search matters, flag the indexing limitations of a client-only SPA. Prefer build-time prerendering or an approved SSR/SSG approach for important routes rather than relying solely on runtime rendering.

## Copywriting

- Write in natural Czech and address visitors consistently according to the approved brand voice.
- Lead with the customer’s situation, benefit and next safe step.
- Prefer precise CTA labels such as “Nezávazně poptat rekonstrukci” or “Probrat elektroinstalaci” over vague “Odeslat” or “Více”.
- Reduce anxiety around scope, coordination, timing and disruption without promising facts the client has not confirmed.
- Avoid fear-based security copy, inflated superlatives and empty claims such as “nejlepší kvalita”.
- Keep form microcopy transparent: say what happens after submission only if the process is confirmed.
- Never fabricate testimonials. Preserve the exact meaning of approved reviews and mark editorial shortening.

## Forms, security and privacy

- Client-side validation improves UX but never counts as security. The receiving API/server must validate and normalize all inputs again.
- Use a controlled allowlist for accepted fields, lengths and formats. Reject unexpected data server-side.
- Do not include API secrets, SMTP credentials or private tokens in the frontend.
- Do not log form contents or personal details to the browser console, analytics events or error services.
- Protect the form endpoint against abuse using server-side rate limiting and an approved anti-spam strategy. Honeypots are supplemental, not sufficient alone.
- Encode output by context and avoid unsafe DOM sinks. Treat CSP as defense in depth, not a replacement for safe code.
- Configure security headers at the host/CDN where possible: CSP, HSTS after HTTPS is proven, `X-Content-Type-Options: nosniff`, an appropriate `Referrer-Policy` and frame restrictions.
- Load third-party scripts only when necessary. Update CSP and consent behavior deliberately.
- Collect only data necessary for the enquiry. Link the privacy information near the form. Never pre-check optional marketing consent.
- Do not add a required “souhlas se zpracováním” checkbox mechanically; distinguish data needed to answer the request from optional marketing consent and have final wording reviewed for the actual implementation.

## Performance and media

- Protect the above-the-fold path: do not lazy-load the LCP hero image; do lazy-load below-the-fold images.
- Supply responsive image dimensions and modern formats when the deployment pipeline supports them.
- Avoid oversized background images on mobile. Art-direct crops where the composition requires it.
- Minimize font families, weights and third-party origins. Preload only genuinely critical assets.
- Prevent layout shifts by reserving image, icon, consent and form-message space.
- Use animation sparingly and favor transform/opacity. Stop off-screen or unnecessary motion.
- Assess changes with a production build, not only the dev server.

## Working method

Before editing:

1. Read this file and any nested `AGENTS.md`/`GEMINI.md` files.
2. Inspect `package.json`, scripts, lockfile, Vite config, routing, styling and existing conventions.
3. State assumptions and identify unverified business facts.
4. For broad work, propose a short plan and list affected files.

While editing:

1. Make the smallest coherent change.
2. Reuse existing tokens and components.
3. Preserve unrelated behavior and content.
4. Cover loading, empty, error, success and reduced-motion states where relevant.
5. Never silence diagnostics merely to make checks pass.

Before completion:

1. Run the project’s existing lint/type/test commands if present.
2. Run the production build using the repository’s package manager.
3. Inspect mobile and desktop behavior and keyboard navigation.
4. Check console errors, broken links, form behavior, metadata and structured data.
5. Report commands run, results, changed files, assumptions and remaining risks.

Never claim a test, audit, browser check, Lighthouse result or validation passed unless it was actually executed.

## Skill routing

Apply project skills autonomously when relevant:

- `emha-ui`: page sections, components and visual-system work.
- `responsive-accessibility`: responsive behavior, semantics and interaction accessibility.
- `local-seo`: metadata, crawlability, local business schema and service-page architecture.
- `conversion-copy`: Czech messaging, CTA, forms and trust-building copy.
- `frontend-quality`: React/Vite architecture, code review, testing and maintainability.
- `security-privacy`: forms, third parties, headers, personal data and frontend security.
- `performance-media`: images, fonts, loading strategy, animation and bundle performance.
- `release-audit`: final cross-discipline pre-release review.

When several disciplines are involved, use the focused skills and reconcile conflicts in this order: factual/legal correctness, security and privacy, accessibility, user comprehension, conversion, SEO, performance, visual polish.
