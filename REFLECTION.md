# REFLECTION.md

## 1. The hardest bug I hit this week, and how I debugged it

The hardest issue I faced was around Supabase integration and deployment consistency between local development and production. Early in the project, I initially created a normal Next.js application manually and tried wiring Supabase into it myself. The frontend rendered correctly, but API routes and database persistence behaved inconsistently. I kept getting issues where routes worked locally but broke during actual integration, especially around public API access and audit persistence.

My first hypothesis was that the environment variables were incorrect, so I repeatedly checked my `.env.local` configuration and regenerated API keys. After that did not solve the issue, I suspected the database schema itself was failing, especially around UUID references and JSONB storage. I manually tested inserts directly inside Supabase and confirmed the schema was actually correct.

The real issue ended up being the overall project setup and auth middleware assumptions inherited from the Supabase starter architecture. I had unintentionally kept auth-related routing behavior even though the app itself did not require authentication. Some `/api/*` routes were being intercepted unexpectedly.

I solved the issue by restarting the setup using `npx create-next-app -e with-supabase`, then carefully removing unnecessary auth boilerplate while explicitly ensuring API routes remained public. I also added better error handling and graceful fallbacks so failures surfaced cleanly instead of silently breaking.

That debugging process taught me that architecture decisions early in a project can create cascading issues later if the defaults are not fully understood.

---

## 2. A decision I reversed mid-week, and what made me reverse it

One important decision I reversed was how aggressive the audit recommendation engine should be. Initially, I wanted the system to aggressively recommend cheaper alternative vendors whenever there was any visible pricing advantage. For example, if ChatGPT Plus was more expensive than Claude Pro for a similar use case, the engine would quickly recommend switching vendors.

After implementing some early recommendation logic and testing different scenarios, I realized the recommendations felt unrealistic and overly simplistic. A real finance or procurement team would not immediately migrate vendors just to save a small amount monthly, especially if workflow familiarity, integrations, or team habits were already established.

I reversed the approach and redesigned the engine to strongly prioritize same-vendor downgrades first, then seat reductions, and only consider vendor switching when the savings difference was materially meaningful. I also intentionally penalized vendor-switch recommendations internally so they would only surface when genuinely defensible.

This changed the entire tone of the product. The recommendations started feeling more trustworthy and finance-oriented rather than “AI tool opinionated.” It also aligned much better with the assignment requirement that recommendations should be explainable and defensible rather than arbitrary.

That reversal taught me that realistic product behavior matters more than maximizing theoretical optimization numbers.

---

## 3. What I would build in week 2 if I had it

If I had another week, I would focus heavily on making Stack Audit feel more like a collaborative procurement platform instead of just a single audit experience.

The first thing I would add is historical audit tracking and trend analysis. Right now, each audit is mostly independent. I would want teams to compare monthly spend changes over time and visualize where AI procurement costs are growing across their organization.

I would also add actual API usage ingestion instead of relying entirely on manual inputs. For example, integrating with OpenAI usage exports, Anthropic API dashboards, or GitHub billing APIs would make recommendations much more accurate and less dependent on self-reported spend.

Another important improvement would be a procurement-credit optimization system. Several vendors offer startup credits, cloud bundles, or accelerator partnerships. I would want Stack Audit to actively recommend possible credits, grants, or procurement channels instead of only suggesting downgrades.

On the technical side, I would move AI summary generation into asynchronous background jobs with caching and retry handling. At larger scale, AI generation should not happen synchronously inside request-response flows.

Finally, I would improve team collaboration by allowing shared workspaces, multiple stakeholders, saved reports, and procurement approval workflows. That would make the product feel closer to a real B2B SaaS platform rather than an isolated calculator tool.

---

## 4. How I used AI tools

I used AI tools extensively throughout the project, mainly ChatGPT and Codex. I used them primarily for architecture discussions, debugging guidance, UI refinement ideas, deployment troubleshooting, documentation structuring, and improving engineering reasoning around the audit engine.

One area where AI was especially helpful was helping me think through recommendation-system logic and deterministic audit flows. It was useful for discussing tradeoffs, edge cases, and reviewer expectations. I also used AI to help structure technical documentation like `DEVLOG.md`, `ARCHITECTURE.md`, and testing documentation in a cleaner and more professional way.

However, I intentionally did not trust AI with the actual pricing optimization math or financial recommendation logic. The assignment specifically emphasized defensible reasoning, so I kept the core audit engine deterministic and manually reviewed all pricing assumptions and recommendation behavior myself.

One specific case where the AI was wrong was around vendor-switch recommendations. Early suggestions pushed aggressive cross-vendor switching purely based on price differences, even when the workflow fit was questionable. I realized that logic would make the product feel unrealistic and financially naive, so I redesigned the engine to prefer same-vendor downgrades first and only allow vendor switches conservatively.

I also caught AI-generated assumptions around API pricing where suggested “optimized plans” did not actually exist publicly. That reinforced the importance of verifying pricing manually against official vendor pricing pages rather than blindly trusting generated outputs.

Overall, AI was extremely useful as a development partner and reasoning assistant, but I treated it as guidance rather than a source of truth.

---

## 5. Self-rating

### Discipline — 9/10

I maintained steady progress across all 7 days, kept meaningful git history, continuously iterated on the product, and completed all MVP requirements without abandoning difficult parts of the assignment.

### Code Quality — 8/10

I believe the codebase is reasonably structured for an MVP, especially around deterministic recommendation logic, API handling, testing, and separation of concerns, although there are still areas I would refactor further with more time.

### Design Sense — 8/10

A major focus of the project was creating a polished startup-style experience instead of a generic dashboard. I spent significant effort refining layouts, spacing, shareable report visuals, and landing page presentation.

### Problem Solving — 8/10

Several issues required architectural changes and debugging beyond simple syntax fixes, especially around Supabase integration, recommendation realism, public-share privacy shaping, and deployment behavior.

### Entrepreneurial Thinking — 8/10

I tried to approach the assignment like a real product rather than only a technical implementation. I focused heavily on believable SaaS behavior, procurement logic, trustworthiness, sharing mechanics, and realistic recommendation flows instead of just maximizing feature count.