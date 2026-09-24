---
name: release-audit
description: Runs a final multidisciplinary release review of the EmHa Elektro website across content, responsive UI, accessibility, SEO, security, privacy, performance and React/Vite build health. Use before staging approval or production deployment.
---

# Release audit

## Preconditions

Read `AGENTS.md`, inspect the deployment target and identify which business facts remain unverified. Audit the production build or a representative staging deployment when available.

## Gate checklist

### Build and behavior

- Existing lint, type-check and test commands complete successfully.
- Production build completes with the repository package manager.
- No critical console errors, broken routes or broken assets.
- Navigation, CTA, telephone/email links and enquiry flow work.

### Content and trust

- Renovation electrical work is clearly the primary offer.
- Secondary services are understandable and correctly named.
- No invented reviews, certificates, locations, numbers, warranties or legal claims.
- Contact and identity data are consistent.

### Responsive and accessibility

- No horizontal overflow at narrow widths.
- Keyboard navigation and visible focus work.
- Heading hierarchy, landmarks, labels, errors, alt text and reduced motion are checked.
- Mobile header/menu and long Czech content remain usable.

### SEO

- Unique title, description, canonical and H1 on every indexable route.
- Production host is used in canonical, sitemap, robots and social metadata.
- Important content/links are crawlable; SPA rendering risk is documented.
- Structured data matches visible verified facts and validates.

### Security and privacy

- No frontend secrets or personal-data logging.
- Endpoint validation/abuse controls and allowed origins are confirmed server-side.
- Third parties and consent behavior match the approved privacy design.
- Deployment headers are verified from the actual response, not assumed from source.

### Performance

- Hero/LCP image loading is intentional.
- Below-the-fold images are deferred and dimensions reserved.
- Fonts, scripts and animations are restrained.
- Any performance score cited was actually measured with conditions recorded.

## Result

Return one of: `BLOCKED`, `READY WITH KNOWN RISKS`, or `READY`. List blockers first, then high/medium/low findings, commands and tools actually run, files/routes checked, unverified client facts and explicit follow-up actions. Never mark `READY` while critical facts or form-security dependencies remain unresolved.
