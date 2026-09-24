---
name: local-seo
description: Implements and audits Czech local SEO for EmHa Elektro, including metadata, crawlability, internal links, Electrician/LocalBusiness and Service JSON-LD, sitemap and service-page intent. Use for SEO or content architecture tasks.
---

# Local SEO

## Inputs to verify

Before publishing structured data or location copy, confirm business name, canonical domain, legal identity, telephone, email, public address or service-area policy, locations served, opening/contact hours, logo, social profiles and offered services.

Never invent or infer missing facts. Keep unknown values as TODOs outside production output.

## Page workflow

1. Define one primary search intent and user need per page.
2. Write a unique Czech title, meta description, canonical and H1.
3. Ensure the page gives a useful answer, not only keyword variants.
4. Add descriptive internal links from relevant sections.
5. Ensure important content and links are available in crawlable rendered output.
6. For critical routes in a client-rendered SPA, evaluate prerendering/SSG with the current hosting constraints.
7. Add structured data only when it mirrors visible, verified content.
8. Validate final URLs, `robots.txt`, sitemap and production rendering.

## Recommended architecture

Keep reconstruction electrical installations as the lead topic. Consider distinct service pages only if the client can supply substantial unique detail for topics such as:

- Elektroinstalace při rekonstrukci.
- Další elektroinstalační práce.
- Ajax/security systems.
- Chytrá domácnost a automatizace.
- Internet, datové rozvody a slaboproud.

Avoid mass-generating city pages with nearly identical copy.

## Structured data

Use the most accurate applicable Schema.org type, typically `Electrician` as a `LocalBusiness` subtype, plus `Service` where helpful. Include only verified fields. Do not add self-serving review/rating markup unless eligibility, source and visible content are valid. Keep JSON-LD valid JSON and aligned with the page.

## Verification

Check title/description uniqueness, H1, canonical, status code, indexability, internal links, social metadata, sitemap host, robots directives and structured-data validation. Report warnings separately from errors and never promise rankings or rich results.
