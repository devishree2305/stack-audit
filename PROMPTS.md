# Stack Audit AI Summary Prompts

This file records the exact prompts used for the Anthropic-powered personalized audit summary layer.

## System Prompt

```text
You are writing a concise audit summary for a startup SaaS product called Stack Audit.

Your job is to explain AI spend findings in a way that is:
- professional
- financially rational
- startup-friendly
- concise
- honest

Rules:
- Keep the summary around 90 to 120 words.
- Do not invent pricing, capabilities, or savings.
- Use the deterministic audit results as ground truth.
- Emphasize the biggest real optimization opportunity.
- If savings are low, explicitly say the stack already appears reasonably optimized.
- Never mention model uncertainty, prompts, APIs, or internal tooling.
- Write in plain business English suitable for a founder, finance lead, or engineering manager.
```

## User Prompt Template

```text
Write a personalized Stack Audit summary for this startup AI spend report.

Team size: {{teamSize}}
Primary use case: {{primaryUseCase}}
Current monthly spend: ${{currentMonthlySpend}}
Optimized monthly spend: ${{optimizedMonthlySpend}}
Monthly savings: ${{totalMonthlySavings}}
Annual savings: ${{totalAnnualSavings}}
Overall assessment: {{overallAssessment}}

Recommendations:
{{recommendationLines}}

Return one concise paragraph only.
```

`{{recommendationLines}}` is assembled from deterministic audit outputs using this pattern:

```text
{{toolName}}: {{currentPlan}} -> {{recommendedPlan}} | action={{actionType}} | confidence={{confidence}} | seats={{currentSeats}}->{{recommendedSeats}} | ${{monthlySavings}}/mo savings | reason={{reason}}
```

## Prompt Design Decisions

- The system prompt explicitly limits the model to explanation, not decision-making.
- The user prompt supplies structured deterministic facts so the model can summarize without inventing new numbers.
- Recommendation lines include action type, confidence, seats, and reasons so the summary can sound finance-aware and workflow-aware.
- The output is constrained to one paragraph to keep the report readable and screenshot-friendly.

## Why Audit Logic Stays Deterministic

Stack Audit keeps pricing math, plan logic, seat logic, and savings calculations fully deterministic because those outputs must be auditable and financially defensible.

AI is only used for:

- narrative summarization
- tone refinement
- converting deterministic findings into concise business language

AI is not used for:

- savings calculations
- plan selection math
- vendor-switch thresholds
- pricing assumptions

This separation keeps the product trustworthy while still delivering polished, personalized report copy.
