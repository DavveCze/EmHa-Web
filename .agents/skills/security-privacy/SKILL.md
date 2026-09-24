---
name: security-privacy
description: Threat-models and audits the EmHa Elektro frontend, enquiry form, third-party integrations, headers and privacy behavior. Use for forms, APIs, analytics, embeds, deployment or security reviews.
---

# Security and privacy

## Threat model

Consider spam and automated abuse, XSS/DOM injection, exposed credentials, malicious links, unsafe redirects, permissive third parties, personal-data leakage, misconfigured CORS, missing server validation and excessive data collection.

## Frontend rules

- Treat all URL, storage, CMS, API and user-provided values as untrusted.
- Prefer React’s normal text rendering; avoid `dangerouslySetInnerHTML`, `innerHTML`, `eval`, string-built scripts and unsafe URL schemes.
- Never embed secrets. Assume all shipped JS, source maps and `VITE_*` values are public.
- Validate links and external destinations; use safe `rel` values for new tabs.
- Keep dependency additions minimal and review their maintenance/security impact.
- Do not log personal form data, tokens or full API responses containing personal data.

## Form/API boundary

Client validation is for UX. Require server-side allowlisting, validation, normalization, size limits, abuse controls and safe error handling. Return generic public errors while retaining useful server-side diagnostics without personal data leakage. Configure CORS to the actual trusted origins and methods; do not solve integration issues with broad wildcards.

## Hosting controls

Recommend and verify host-level HTTPS and headers appropriate to the deployment: CSP, HSTS only after HTTPS readiness, `X-Content-Type-Options`, `Referrer-Policy`, frame controls and a narrowly scoped permissions policy. Build CSP from actual origins and test in report-only mode where possible; do not paste a generic policy that breaks the app.

## Privacy

Map every collected field, recipient, processor, retention need, third-party script and storage mechanism. Minimize collection and distinguish enquiry handling from optional marketing. Flag legal wording for qualified review instead of presenting legal advice as certainty.

## Findings

Rank findings as critical, high, medium or low. Include exploit/impact, affected path, remediation, server/hosting dependency and verification. Do not report a header as implemented when it exists only in a source file unsupported by the deployed host.
