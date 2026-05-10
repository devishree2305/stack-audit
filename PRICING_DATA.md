# Pricing Data Reference

This file documents the normalized public pricing assumptions used by the Stack Audit deterministic recommendation engine.

## Purpose

- Keep pricing inputs transparent and reviewable.
- Separate vendor pricing facts from recommendation logic.
- Ensure optimized pricing always maps to a real public plan or explicitly stays unchanged.

## Vendor Pricing

### Cursor

- Hobby: $0/month
- Pro: $20/month
- Business: $40/user/month
- Enterprise: Custom pricing
- Source: https://cursor.com/pricing

### GitHub Copilot

- Individual: $10/month
- Business: $19/user/month
- Enterprise: $39/user/month
- Source: https://github.com/features/copilot/plans

### Claude

- Free: $0/month
- Pro: $17/month
- Max: $100/month
- Team: $30/user/month
- Enterprise: Custom pricing
- API Direct: Usage-based pricing
- Source: https://claude.com/pricing

### ChatGPT

- Plus: $20/month
- Team: $30/user/month
- Enterprise: Custom pricing
- API Direct: Usage-based pricing
- Source: https://chatgpt.com/pricing/

### Anthropic API

- API Direct: Usage-based pricing
- Source: https://claude.com/pricing#api

### OpenAI API

- API Direct: Usage-based pricing
- Source: https://openai.com/api/pricing/

### Gemini

- Pro: $20/month normalized
- Ultra: $42/month normalized
- API: Usage-based pricing
- Sources:
  - https://one.google.com/about/ai-premium/
  - https://ai.google.dev/gemini-api/docs/pricing

### Windsurf

- Free: $0/month
- Pro: $20/month
- Team: $40/user/month
- Enterprise: Custom pricing
- Source: https://windsurf.com/pricing

## Normalization Rules

- Public monthly prices are treated as the pricing source of truth for deterministic calculations.
- Enterprise plans are treated as custom pricing and are never assigned fake optimized prices.
- API products are treated as usage-priced products and should surface credit or procurement opportunities rather than made-up downgrade math.
- Region-specific pricing display differences are normalized to approximate USD monthly values for consistency inside the app.

## Engine Principles

- Same-vendor downgrades are preferred over vendor switches.
- Vendor switches are only suggested when the workflow fit remains plausible and the savings difference is meaningful.
- Free-tier downgrades are only suggested for truly low-intensity solo usage.
- If a stack already looks reasonable, the engine returns maintain recommendations rather than forcing savings.
