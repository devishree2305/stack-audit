# Stack Audit

Stack Audit is a procurement-focused AI spend auditing tool for startups and engineering teams using tools like ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, and OpenAI APIs. The platform analyzes AI tooling spend, identifies unnecessary costs, recommends realistic optimizations, and generates shareable finance-style audit reports with AI-generated summaries.

Built as a production-style SaaS MVP using Next.js, TypeScript, Supabase, Anthropic API, and Resend.

---

# Live Demo

Deployed URL:

https://stack-audit-wheat.vercel.app

Sample Public Audit Report:

https://stack-audit-wheat.vercel.app/report/sample-audit

---

# Demo Video

https://youtu.be/zf2aSkUa68k?si=yA5AygMWd-t3P5dn

---

# Quick Start

## 1. Clone Repository

```bash id="7p5qmr"
git clone https://github.com/devishree2305/stack-audit.git
cd stack-audit
```

---

## 2. Install Dependencies

```bash id="0h6evh"
npm install
```

---

## 3. Create Environment Variables

Create:

```bash id="q7v0vh"
.env.local
```

Add:

```env id="i7y7wb"
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

ANTHROPIC_API_KEY=your_anthropic_api_key

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL="Stack Audit <onboarding@resend.dev>"
```

---

## 4. Get Required Keys

### Supabase Project URL + Publishable Key

Video:
https://youtu.be/zf2aSkUa68k?si=yA5AygMWd-t3P5dn

Direct links:

* https://supabase.com/dashboard
* Project → Settings → API

Copy:

* Project URL
* anon/public key

---

### Supabase Service Role Key

Direct links:

* https://supabase.com/dashboard
* Project → Settings → API

Copy:

* service_role key

Important:
Do NOT expose this key publicly.

---

### Anthropic API Key

Video:
https://youtu.be/EhHELsEqbAM?si=aqX-EN8gzdCyt37H

Direct link:

* https://platform.claude.com/settings/keys

---

### Resend API Key

Direct links:

* https://resend.com/api-keys
* Create API Key

For development:

```txt id="pn8xgl"
RESEND_FROM_EMAIL="Stack Audit <onboarding@resend.dev>"
```

---

## 5. Configure Database

Run inside Supabase SQL Editor:

```sql id="vyzt5r"
create table audits (
  id uuid primary key default gen_random_uuid(),
  tools jsonb not null,
  team_size integer,
  primary_use_case text,
  current_monthly_spend numeric(10,2),
  optimized_monthly_spend numeric(10,2),
  total_monthly_savings numeric(10,2),
  total_annual_savings numeric(10,2),
  recommendations jsonb,
  ai_summary text,
  share_token text unique,
  created_at timestamp with time zone default timezone('utc', now())
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references audits(id) on delete cascade,
  email text not null,
  company_name text,
  role text,
  created_at timestamp with time zone default timezone('utc', now())
);
```

---

## 6. Run Locally

```bash id="7g0tn8"
npm run dev
```

Open:

```txt id="8gy3c3"
http://localhost:3000
```

---

# Deployment

The project is deployed using Vercel.

Deploy command:

```bash id="77t2cw"
git push
```

Production automatically redeploys on push to `main`.

---

# Decisions / Trade-Offs

## 1. Deterministic recommendation logic instead of AI-generated pricing decisions

The audit engine uses fixed pricing logic so recommendations remain explainable, reviewable, and finance-oriented.

---

## 2. Same-vendor downgrades prioritized before vendor switching

The engine avoids unrealistic migration suggestions and prefers conservative optimization recommendations.

---

## 3. Public reports exclude sensitive information

Shared reports intentionally hide company names, emails, and internal identifiers while preserving savings insights.

---

## 4. Transactional email failures are non-blocking

Audit persistence and lead capture continue working even if Resend sandbox restrictions prevent email delivery.

---

## 5. Built as a custom Next.js application instead of website builders/templates

The UI and architecture were built directly using React, Tailwind, and TypeScript without Wix, Webflow, Bubble, or dashboard templates.

---

# Tech Stack

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* Supabase
* Anthropic API
* Resend
* Vercel

---

# Documentation

Additional documentation:

* ARCHITECTURE.md
* DEVLOG.md
* PRICING_DATA.md
* TESTS.md
* GTM.md
* ECONOMICS.md
* METRICS.md
* REFLECTION.md
* USER_INTERVIEWS.md
* LANDING_COPY.md
