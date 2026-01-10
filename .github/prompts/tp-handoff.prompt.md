---
agent: edit
model: GPT-5 mini (copilot)
---

<!--
description: Produce a final, self-contained Markdown handoff document for implementing tests.
type: action
-->

# Test Plan — Final Handoff Artifact

Create a single, self-contained Markdown document intended to be copied as a file.

STRICT RULES:

- Output MUST be plain Markdown text.
- Do NOT use code fences (```), inline code, or block formatting.
- Do NOT wrap the document in quotes.
- Do NOT reference the chat or say “we discussed”.
- Assume the implementation agent has NO access to this conversation.

This is a FINAL HANDOFF ARTIFACT.

---

## Required sections

### 1. Context and Goal

- System or component scope
- Testing objective

### 2. System Overview

- High-level architecture
- Relevant flows
- Assumptions made

### 3. Existing State

- Existing tests
- Existing CI / automation
- Known constraints or limitations

### 4. Risk Analysis

- Critical paths
- Failure modes
- High-impact areas

### 5. Test Plan

For each category below, specify:

- What to test
- What NOT to test
- Priority (P0 / P1 / P2)

Categories:

- Unit tests
- Integration tests
- End-to-end tests
- Contract / API tests
- Non-functional tests (if relevant)

### 6. Coverage Gaps

- Untested or under-tested areas
- Why they matter

### 7. Test Data and Environments

- Required data
- Environment assumptions
- Mocking vs real dependencies

### 8. Automation Guidance

- What runs on PR
- What runs nightly
- What gates releases

### 9. Implementation Notes for Agent

- Ordering and dependencies
- Known tricky areas
- Explicit do / do-not rules

### 10. Open Questions

- Anything that must be clarified before or during implementation

---

## Formatting guidance

- Use Markdown headers and bullet points only.
- No code blocks.
- No decorative formatting.
- Clarity over verbosity.

Deliver the full Markdown so it can be copied as-is into a `.md` file.
