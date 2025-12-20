# Context Reset Summary Prompts

## Overview

This document contains a reusable prompt template for generating context reset summaries. Use it to capture the current state of your work so you can restore AI agent context in future sessions.

## How to Use

### Step 1: Copy the Prompt

When you're ready to capture context, copy the **Prompt Template** below and paste it into your AI chat.

### Step 2: AI Generates Summary

The AI will output a markdown summary with two sections:

- **Current AI Context**: Working state for `docs/ai-context.md`
- **Context Reset Snapshot**: Immutable snapshot for `docs/ai/context-resets/<date>_<topic>_<index>.md`

### Step 3: Save Manually

Copy the output and save it to the appropriate file(s). The AI will not save files automatically.

### Step 4: Resume Later

In a new session, share the saved context file with the AI to restore working state instantly.

---

## When to Use

- End of work session (capture current state)
- Before major decision points
- After completing significant milestones
- When switching between different features/tasks
- Before taking breaks or pausing work

---

## Prompt Template

**Copy and paste this into your AI chat:**

```
Create a Context Reset Summary for this project.

Output TWO Markdown sections only.

SECTION 1: Current AI Context
- Suitable for saving as: docs/ai-context.md
- Represents the current working state only

SECTION 2: Context Reset Snapshot
- Suitable for saving as:
  docs/ai/context-resets/<YYYY-MM-DD>_<topic>_<index>.md
- This is an immutable snapshot (do NOT overwrite previous ones)

Use this structure for BOTH sections:
- Goal
- Current State
- Constraints
- Decisions Made
- High-Level Plan (numbered)
- Current Focus
- Out of Scope

Rules:
- Raw Markdown only
- Max 10 bullet points total per section
- No code snippets
- Strategic context only
- Include requirement/design IDs when relevant
- Do NOT assume you can save files
- I will copy and save the output manually
```

---

**Example Output**:

```markdown
# Current AI Context

**Goal**: Implement expense filtering with multiple criteria (REQ-005)

**Current State**:

- Backend API complete and tested
- Frontend components scaffolded
- Integration pending

**Constraints**:

- Must maintain sub-200ms response time
- No breaking changes to existing API
- Deploy only after all tests pass

**Decisions Made**:

- Using query params instead of request body for filters
- Client-side filtering for < 100 items, server-side for more

**High-Level Plan**:

1. Complete frontend integration with React Query
2. Fix failing E2E tests (4 remaining)
3. Performance test with 10K records
4. Deploy to staging

**Current Focus**: Frontend integration (step 1)

**Out of Scope**: Advanced filters (date ranges, custom categories)

---

# Context Reset Snapshot

**Date**: 2025-12-15  
**Topic**: Expense Filtering Implementation  
**Snapshot**: 001

**Goal**: Implement expense filtering with multiple criteria (REQ-005)

**Current State**:

- Backend API complete and tested
- Frontend components scaffolded
- Integration pending

**Constraints**:

- Must maintain sub-200ms response time
- No breaking changes to existing API
- Deploy only after all tests pass

**Decisions Made**:

- Using query params instead of request body for filters
- Client-side filtering for < 100 items, server-side for more

**High-Level Plan**:

1. Complete frontend integration with React Query
2. Fix failing E2E tests (4 remaining)
3. Performance test with 10K records
4. Deploy to staging

**Current Focus**: Frontend integration (step 1)

**Out of Scope**: Advanced filters (date ranges, custom categories)
```

---

## Best Practices

**File Organization**:

- `docs/ai-context.md` - Always overwrite with latest state
- `docs/ai/context-resets/<YYYY-MM-DD>_<topic>_<index>.md` - Never overwrite; create new snapshots
- Topic naming: Use descriptive slugs (e.g., "expense-filtering-implementation", "auth-refactor")
- Index format: 001, 002, 003 (increment for same topic on same day)

**Workflow Tips**:

- Update `docs/ai-context.md` at the **start** and **end** of each work session
- Create snapshots at key decision points or before major changes
- Keep summaries concise (max 10 bullets across all sections)
- Reference requirement/design IDs when relevant
- Focus on strategic context, not implementation details

**Context Restoration**:

- Start new AI session by sharing the saved context file
- AI will understand the project state instantly
- Combine with [SESSION_RESUME.md](../../general/SESSION_RESUME.md) for complete workflow

**Example Folder Structure**:

```
docs/
  ai-context.md (current state - overwrite)
  ai/
    context-resets/
      2025-12-20_expense-filtering_001.md
      2025-12-20_auth-refactor_001.md
      2025-12-21_expense-filtering_002.md
```
