# Security Notes

## Abuse protection

This project uses a lightweight honeypot field on lead capture.

- The hidden `website` field is rendered in the form but should remain empty for real users.
- If that field is filled, the server accepts the request shape but silently filters the submission without writing a lead or sending email.
- This was chosen because it adds near-zero friction, avoids CAPTCHAs, and fits a startup-grade UX where the lead form should stay fast and low-friction.

## Supabase security approach

The app writes and reads data through server-side route handlers instead of exposing direct client-side table writes.

- `app/api/audit/route.ts` validates audit payloads, generates the deterministic report, and persists the saved audit.
- `app/api/leads/route.ts` validates email input, applies honeypot filtering, checks for duplicates, writes the lead, and triggers confirmation email delivery.
- Public report access should be constrained in Supabase with Row Level Security policies that allow reads only when a valid `share_token` is used by the server workflow, while lead inserts and duplicate checks remain scoped to the server route behavior.
- No savings math is delegated to the database or the email provider. Supabase stores the final audit snapshot so shared links continue to render a stable saved report.

## Why deterministic audit logic is safer

Savings calculations come from deterministic pricing logic in `lib/audit-engine.ts`, not from model-generated math.

- The audit engine computes current spend, optimized spend, and savings from explicit tool plans and seat counts.
- AI-generated text is used only for summary language, never for financial calculation or recommendation totals.
- This reduces hallucination risk, keeps shared reports reproducible, and makes validation and regression testing much more reliable.

## Email failure handling

Transactional email is intentionally non-blocking.

- Lead capture succeeds even if Resend is unavailable or returns an error.
- The API reports whether email delivery succeeded, but the saved lead remains intact either way.
- This prevents email outages from interrupting the primary conversion flow.
