# Tests

This repository includes automated tests under [`tests/`](./tests), centered on the audit engine, summary generation, share-safe report shaping, and audit/lead persistence workflows.

## Run Commands

- All tests: `npm test`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Production build verification: `npm run build`

## Test Inventory

### `tests/audit-engine.test.ts`

**Purpose**  
Validates recommendation quality and pricing integrity in the core audit engine.

**Important scenarios covered**  
- Real plan names are used and pricing math stays non-negative.
- Heavy-user maintain behavior: heavy daily users stay on appropriate paid plans.
- Realistic downgrade recommendations: light premium usage downgrades to a real lower tier.
- Same-vendor downgrade preference: downgrades are preferred over marginal vendor switching.
- API credit opportunity handling: API spend is flagged as a credit opportunity instead of fake plan savings.
- Already-optimized stack honesty: optimized stacks produce honest `maintain` recommendations with zero savings.

**Why this test matters**  
This is the highest-signal recommendation-quality suite in the repo. It explicitly includes more than 5 automated audit-engine recommendation tests, covering the most important trust-sensitive behaviors in the product.

### `tests/anthropic.test.ts`

**Purpose**  
Checks summary prompt construction and the AI-summary fallback behavior.

**Important scenarios covered**  
- Deterministic prompt generation from audit facts.
- Anthropic fallback tests when the client throws an error.
- Successful AI response handling when the client returns text output.

**Why this test matters**  
It protects the summary layer from becoming brittle or nondeterministic, and ensures the product can still return a usable summary when the Anthropic integration fails.

### `tests/share.test.ts`

**Purpose**  
Verifies the public-share DTO is safe for external sharing.

**Important scenarios covered**  
- Public-share sanitization tests that remove private fields such as `teamSize`, `auditId`, `email`, `companyName`, and `role`.
- Share metadata generation including title, description, tool count, and team-size label.
- Clean social-preview copy for already-optimized reports.

**Why this test matters**  
It guards against leaking internal or lead-capture data in publicly shared audit reports and keeps share previews reviewer-safe.

### `tests/audit-workflow.test.ts`

**Purpose**  
Exercises audit persistence, API-route handling, and lead-capture workflows end to end with an in-memory repository.

**Important scenarios covered**  
- Persistence and lead workflow tests for saving an audit and returning a share token.
- Missing-token lookup returns `null`.
- Audit API route validation and persistence.
- Lead creation still succeeds when confirmation email delivery fails.
- Duplicate lead prevention for the same audit/email pair.
- Honeypot abuse protection tests that filter bot submissions without creating a lead.
- Lead capture by public share token.

**Why this test matters**  
It covers the operational workflow around storing audits and converting them into leads, while protecting the funnel from duplicate submissions and basic abuse.
