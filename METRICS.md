# METRICS.md

## 1. North Star Metric

The North Star Metric for Stack Audit is:

**consultation-qualified audits completed**

A consultation-qualified audit is an audit where the team completes the assessment, receives a meaningful savings or optimization finding, and signals willingness to share contact information or discuss procurement next steps.

This matters more than traffic because Stack Audit is not primarily a content site or daily-use dashboard. It is a procurement-intent product designed to identify teams with real AI spend, real overlap, and enough trust in the recommendations to continue the conversation.

DAU is not the right metric because most teams should not need to audit AI subscriptions every day. A small number of high-intent audits from startup teams spending hundreds or thousands per month is more valuable than frequent casual usage from low-fit users.

This metric aligns directly with Credex business value because each consultation-qualified audit can become a procurement, credit, financing, or vendor-optimization opportunity.

---

## 2. Why This Metric Matters

Consultation-qualified audits combine three important signals:

- The user has enough AI tooling spend to make the audit relevant.
- The audit produced a recommendation credible enough to create intent.
- The team is willing to move from self-serve analysis into a business conversation.

That makes the metric much stronger than raw visitors, started audits, or report views. It measures whether Stack Audit is creating qualified procurement opportunities, not just curiosity.

---

## 3. Three Input Metrics

### Audit completion rate

This measures the percentage of users who start an audit and finish it. It shows whether the input flow is simple enough for busy founders, operators, and engineering leads to complete without heavy onboarding.

### High-savings audit percentage

This measures the share of completed audits that identify a meaningful annual savings or optimization opportunity. It shows whether the product is reaching teams with real AI spend inefficiency rather than low-value or already-optimized users.

### Lead capture conversion rate

This measures the percentage of completed audits that submit contact information or express consultation interest. It shows whether the report feels trustworthy enough for users to take the next step with Credex.

---

## 4. What Would Be Instrumented First

The MVP should track the core procurement funnel before adding heavier analytics:

- Landing page view to audit start
- Audit start to audit completion
- Savings range and recommendation type
- Lead form submission after report view
- Public share link creation and click-through
- Consultation intent signal, such as requesting a follow-up or submitting a work email

This could be instrumented with lightweight tooling: Vercel Analytics for page and funnel basics, PostHog for product events, and Supabase event records for audit-level outcomes tied to share tokens and lead submissions.

The goal is practical attribution: which channels and report types create qualified procurement conversations.

---

## 5. Pivot Threshold / Failure Signal

The pivot trigger would be:

**100 completed audits with fewer than 5 consultation-qualified audits.**

That would imply users are willing to try the tool, but the audit output is not creating enough procurement intent. Possible causes could be weak savings discovery, unclear recommendation trust, poor lead timing, or targeting users with too little AI spend.

If this happens, Stack Audit should pivot toward one of three directions:

- Narrow the target to higher-spend startup teams.
- Improve the report into a stronger finance-ready procurement artifact.
- Shift from self-serve audits toward founder-led teardown and advisory workflows.

The product should only scale acquisition once completed audits reliably convert into qualified business conversations.
