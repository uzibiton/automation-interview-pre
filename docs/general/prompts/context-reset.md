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

The AI will create two files with different levels of detail:

- **File 1 (Strategic)**: Brief current state for quick reference (`docs/ai-context.md`)
- **File 2 (Detailed)**: Comprehensive conversation analysis for full context restoration (`docs/context-resets/<YYYY-MM-DD>/<index>_<topic>.md`)

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
Create a Context Reset Summary for this project based on the current conversation.

Output TWO files automatically:

FILE 1: docs/ai-context.md (Strategic Context - Always Overwrite)
Use this structure:
- Goal
- Current State
- Constraints
- Decisions Made
- High-Level Plan (numbered)
- Current Focus
- Out of Scope

Rules:
- Max 10 bullet points total
- Strategic context only
- Include requirement/design IDs when relevant

FILE 2: docs/context-resets/<YYYY-MM-DD>/<index>_<topic>.md (Detailed Snapshot - Never Overwrite)
Create a comprehensive conversation summary with these sections:

1. **Conversation Overview**
   - Primary objectives and goals
   - Session context and user intent evolution

2. **Technical Foundation**
   - Technologies, tools, and frameworks used
   - Project structure and architecture decisions

3. **Codebase Status**
   - Files created/modified with purpose and key changes
   - Current state of each component
   - Dependencies between components

4. **Problem Resolution**
   - Issues encountered and solutions implemented
   - Debugging context and lessons learned

5. **Progress Tracking**
   - Completed tasks ✅
   - Partially complete work 🟡
   - Validated outcomes

6. **Active Work State**
   - Current focus and recent context
   - Working code/configurations
   - Immediate next steps

7. **Recent Operations**
   - Last agent commands executed
   - Tool results summary
   - Pre-summary state

8. **Continuation Plan**
   - Remaining work and dependencies
   - Next immediate steps
   - Known blockers

Rules:
- Comprehensive analysis for full context restoration
- Include file paths, commit hashes, issue numbers
- Capture decisions, constraints, and technical details
- Use chronological order where relevant
- Format for easy scanning (bullets, checkboxes, sections)

After generating both summaries, create the files automatically.
```

---

**Example Output**:

**File 1: docs/ai-context.md** (Strategic Summary)

```markdown
# Current AI Context

**Goal**: Break down issue #68 into actionable GitHub subtasks

**Current State**:

- Task planning prompt created and documented
- Applied breakdown methodology to issue #68
- Created 25 GitHub issues (#84-108) across 6 phases
- Updated parent issue with complete task list

**Constraints**:

- Each task must be 2-10 days max
- Clear dependencies required
- Proper GitHub labels mandatory

**Decisions Made**:

- Phase 0 for UI prototypes (parallel work)
- Critical path: Research → Architecture → Implementation
- Testing tasks separate from development phases

**High-Level Plan**:

1. ✅ Create task-planning.md prompt template
2. ✅ Apply to issue #68 and create all subtasks
3. Update task-planning.md to reflect actual workflow
4. Commit and document methodology

**Current Focus**: Documenting context reset workflow

**Out of Scope**: Implementing any of the #68 tasks (future work)
```

**File 2: docs/context-resets/2025-12-20/004_task-planning-workflow.md** (Detailed Analysis)

```markdown
# Context Reset: Task Planning Workflow

**Date**: 2025-12-20  
**Topic**: Task Planning & Issue #68 Breakdown  
**Session**: 004

## 1. Conversation Overview

**Primary Objectives**:

- Break down issue #68 (AI-powered conversational expense input) into actionable subtasks
- Create comprehensive task planning prompt template
- Establish GitHub issue tracking workflow

**Session Context**:

- User had existing idea in issue #68
- Needed systematic breakdown into trackable tasks with dependencies
- Wanted proper GitHub integration with parent/child relationships

**User Intent Evolution**:

- Started: "Break down issue #68 into subtasks"
- Evolved: "Create reusable prompt template for task planning"
- Final: "Document complete workflow including GitHub integration"

## 2. Technical Foundation

**Git/GitHub**:

- Version control with gh CLI v2.x
- Issue creation, editing, parent/child linking
- Labels: enhancement, component:{frontend|backend|database}, team:{dev|qa|product}, priority:{critical|high|medium|low}, size:{small|medium|large}

**Documentation**:

- Markdown format
- Structured prompts in docs/general/prompts/
- Context resets in docs/context-resets/YYYY-MM-DD/

**Workflow Tools**:

- `gh issue create` - Create subtask issues
- `gh issue edit` - Update parent with task list
- `gh label list` - Get available labels

## 3. Codebase Status

**docs/general/prompts/task-planning.md**:

- Purpose: Template for breaking down ideas/epics into phases and tasks
- Current State: Complete with GitHub workflow integration
- Key Sections:
  - Prompt template with phase structure (0-5 phases + testing)
  - GitHub issue creation workflow with gh CLI examples
  - Label guidelines and issue body template
  - Real example from issue #68 (25 subtasks)
  - Best practices for estimation, dependencies, risk mitigation
- Dependencies: Integrates with requirements-gathering, design-patterns, test-generation prompts

**GitHub Issues Created**:

- #84-86: Phase 0 (UI Prototype, 3 tasks)
- #87-90: Phase 1 (Research & Design, 4 tasks)
- #91-94: Phase 2 (MVP Implementation, 4 tasks)
- #95-97: Phase 3 (Consultation Features, 3 tasks)
- #98-100: Phase 4 (Analytics, 3 tasks)
- #101-103: Phase 5 (Benchmarking, 3 tasks)
- #104-108: Testing (5 tasks)

**Issue #68**:

- Updated with complete task breakdown
- Checkboxes for progress tracking
- Links to all 25 subtasks
- Total estimates: 125-175 days

## 4. Problem Resolution

**Issues Encountered**:

- First issue creation failed with "label 'type:task' not found"
- User unsure how to apply task planning to specific issue
- Wanted comprehensive conversation summaries in context-resets folder

**Solutions Implemented**:

- Retrieved available labels with `gh label list`, used correct labels
- Demonstrated filling template placeholders with issue #68 details
- Updated context-reset prompt to include detailed conversation analysis

**Lessons Learned**:

- Always check available labels before creating issues
- Phase 0 (prototype) enables parallel work while research happens
- Context resets need both strategic summary AND detailed conversation analysis

## 5. Progress Tracking

**Completed Tasks**:

- ✅ Created task-planning.md prompt template
- ✅ Applied planning prompt to issue #68
- ✅ Analyzed dependencies and critical path
- ✅ Created 25 GitHub subtask issues (#84-108)
- ✅ Updated parent issue #68 with complete task list
- ✅ Updated task-planning.md with real workflow
- ✅ Committed and pushed all changes

**Validated Outcomes**:

- All 25 issues created with proper parent references
- Dependencies tracked with "Blocked by" markers
- Critical path identified (Research → Architecture → Implementation)
- User can now refine each task individually

## 6. Active Work State

**Current Focus**: Updating context-reset prompt to include conversation summaries

**Recent Context**: User noticed context-resets folder exists but expected conversation summaries to be automatically added there when triggering context reset

**Immediate Next Steps**:

1. Update context-reset.md prompt template
2. Commit and push changes
3. Test updated workflow

## 7. Recent Operations

**Last Commands**:

- `gh label list` - Retrieved 27 available labels
- `gh issue create` (x25) - Created all subtask issues
- `gh issue edit 68` - Updated parent with task breakdown
- `git add/commit/push` - Committed task-planning.md updates

**Tool Results**: Successfully created complete task tracking system for issue #68

## 8. Continuation Plan

**Remaining Work**:

- Update context-reset.md with conversation summary structure
- Commit and push context-reset changes
- User will refine individual tasks before implementation

**Next Immediate Step**: Update context-reset prompt template (in progress)
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
