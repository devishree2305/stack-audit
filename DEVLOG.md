## Day 1 — 2026-05-06

**Hours worked:** 2

**What I did:**
Created the GitHub repository for Stack Audit and reviewed the assignment requirements. Planned the overall MVP structure and explored how the audit flow should work from landing page to recommendation report.

**What I learned:**
The assignment focuses more on product thinking and defensible business logic than just frontend implementation.

**Blockers / what I'm stuck on:**
Still deciding the backend/database approach and how to structure audit persistence cleanly.

**Plan for tomorrow:**
Research Supabase, Anthropic API integration, and possible deployment architecture.

---

## Day 2 — 2026-05-07

**Hours worked:** 3

**What I did:**
Researched the tech stack and evaluated Supabase, Anthropic API, and Vercel deployment. Initially started with a normal Next.js app setup but struggled with database integration and Supabase connection flow.

**What I learned:**
Using the official Supabase Next.js starter simplifies authentication and database configuration significantly.

**Blockers / what I'm stuck on:**
Had issues connecting the manually created Next.js app cleanly with Supabase persistence.

**Plan for tomorrow:**
Restart using the official Supabase starter template and begin implementing the frontend structure.

---

## Day 3 — 2026-05-08

**Hours worked:** 3

**What I did:**
Recreated the project using `npx create-next-app -e with-supabase`. Created Supabase tables for audits and leads. Built the primary frontend flow including the landing page, spend input form, and initial report layout.

**What I learned:**
JSONB storage in Supabase works well for flexible audit recommendation payloads.

**Blockers / what I'm stuck on:**
Still refining how recommendation logic should be structured and how much data should persist per audit.

**Plan for tomorrow:**
Research real vendor pricing data and implement CI/testing workflow.

---

## Day 4 — 2026-05-09

**Hours worked:** 2

**What I did:**
Collected real pricing data from official vendor pricing pages for Cursor, Claude, ChatGPT, Gemini, Windsurf, GitHub Copilot, OpenAI API, and Anthropic API. Created `PRICING_DATA.md` and normalized pricing assumptions. Added GitHub Actions CI workflow with linting and tests.

**What I learned:**
Pricing normalization and plan mapping matter a lot for deterministic recommendation engines.

**Blockers / what I'm stuck on:**
Needed to decide how aggressive vendor-switching recommendations should be versus same-vendor downgrades.

**Plan for tomorrow:**
Implement the deterministic audit engine and recommendation workflow.

---

## Day 5 — 2026-05-10

**Hours worked:** 3

**What I did:**
Built the AI spend audit engine and recommendation workflow. Added deterministic pricing logic, downgrade recommendations, maintain states, API credit opportunity handling, and finance-oriented reasoning. Implemented recommendation cards, savings summaries, and audit result generation.

**What I learned:**
Rule-based recommendation systems are often more trustworthy and explainable than AI-generated financial logic.

**Blockers / what I'm stuck on:**
Balancing realistic optimization behavior without producing overly aggressive downgrade recommendations.

**Plan for tomorrow:**
Implement persistence, lead capture, and transactional email flow.

---

## Day 6 — 2026-05-11

**Hours worked:** 2

**What I did:**
Implemented audit persistence using Supabase, lead capture flow, transactional email integration with Resend, honeypot-based abuse protection, and share-token report loading. Added graceful fallback handling for Anthropic API failures and provider email errors.

**What I learned:**
Production-style workflows require strong failure handling and graceful degradation for third-party services.

**Blockers / what I'm stuck on:**
Email delivery restrictions in Resend free-tier testing mode required additional handling and fallback messaging.

**Plan for tomorrow:**
Complete public sharing experience, Open Graph metadata, deployment prep, and final documentation.

---

## Day 7 — 2026-05-12

**Hours worked:** 6

**What I did:**
Implemented public shareable audit reports with Open Graph metadata and social preview support. Improved landing page and report UI polish, added privacy-safe public DTO shaping, finalized documentation files, cleaned up unused Supabase auth boilerplate, verified tests/builds, and prepared the project for deployment.

**What I learned:**
Small UX and trust details make a major difference in how polished SaaS products feel.

**Blockers / what I'm stuck on:**
Fine-tuning metadata previews and ensuring private lead information never leaked into public report views.

**Plan for tomorrow:**
Deploy the application to Vercel, verify production behavior, and do final submission checks.