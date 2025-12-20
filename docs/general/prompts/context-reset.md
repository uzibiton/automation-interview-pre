# Context Reset Summary Prompts

## Overview

This document contains a reusable prompt template for generating context reset summaries. Use it to capture the current state of your work so you can restore AI agent context in future sessions.

**Why this matters:** AI agents lose context between sessions. These summaries let you resume work instantly by sharing a single file that captures your project state, decisions, and next steps.

**What gets created:**

1. **Current Context** (`docs/ai-context.md`) - Living document of your current work state (always updated)
2. **Snapshot** (`docs/context-resets/YYYY-MM-DD/###_topic.md`) - Immutable historical record (never modified)

## How to Use

### Step 1: Copy the Prompt

When you're ready to capture context, copy the **Prompt Template** below and paste it into your AI chat.

### Step 2: AI Generates Summary

The AI will output a markdown summary with two sections:

- **Current AI Context**: Working state for `docs/ai-context.md`
- **Context Reset Snapshot**: Immutable snapshot for `docs/context-resets/<YYYY-MM-DD>/<index>_<topic>.md`

### Step 3: Files Created

The AI will automatically create both files:

- `docs/ai-context.md` (overwrite)
- `docs/context-resets/<YYYY-MM-DD>/<index>_<topic>.md` (new snapshot)

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
  docs/context-resets/<YYYY-MM-DD>/<index>_<topic>.md
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
- Create both files automatically
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

**File Organization Explained**:

The new structure uses **date-based folders** for better organization:

```
docs/context-resets/2025-12-20/
├── 001_prompt-engineering-guide.md   ← First topic of the day
├── 002_file-structure-update.md      ← Second topic of the day
└── 003_bug-fix-authentication.md     ← Third topic of the day
```

**Why this structure?**

- **Date folders** (`2025-12-20/`) - Easily find all work from a specific day
- **Index prefix** (`001`, `002`) - Chronological ordering within each day
- **Descriptive topic** (`prompt-engineering-guide`) - Instantly understand what was worked on
- **Separation** - Each work session/topic gets its own file for clarity

**Naming Guidelines**:

- `docs/ai-context.md` - Always overwrite with latest state (living document)
- `docs/context-resets/<YYYY-MM-DD>/<index>_<topic>.md` - Never overwrite (historical archive)
- Date format: YYYY-MM-DD (ISO 8601 for proper sorting)
- Topic naming: kebab-case slugs (e.g., "expense-filtering", "auth-refactor", "bug-fix-payment")
- Index format: 001, 002, 003 (zero-padded, increment within same date folder)

**Workflow Tips**:

- Update `docs/ai-context.md` at the **start** and **end** of each work session
- Create snapshots at key decision points or before major changes
- Keep summaries concise (max 10 bullets across all sections)
- Reference requirement/design IDs when relevant
- Focus on strategic context, not implementation details

**Context Restoration**:

When starting a new AI session:

1. **Share the context file**: Attach `docs/ai-context.md` or a specific snapshot
2. **AI reads and understands**: Agent immediately knows your project state, decisions, and next steps
3. **Continue seamlessly**: No need to re-explain - just start working

**Pro tips:**

- Use `ai-context.md` for continuing today's work
- Use specific snapshots to jump back to previous work states
- Combine with [SESSION_RESUME.md](../../general/SESSION_RESUME.md) for complete workflow
- Share snapshots with team members to align on project decisions

**Why snapshots matter:**

- **Audit trail** - Track how decisions evolved over time
- **Rollback capability** - Reference previous states if needed
- **Team communication** - Share specific work context with others
- **Documentation** - Historical record of project evolution

**Example Folder Structure**:

```
docs/
  ai-context.md (current state - overwrite)
  context-resets/
    2025-12-20/
      001_expense-filtering.md
      002_auth-refactor.md
    2025-12-21/
      001_expense-filtering.md
      002_performance-testing.md
```
