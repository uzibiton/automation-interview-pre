# Prompt Catalog

## Quick Reference Guide

This catalog provides a quick way to load and use prompts. Simply say **"load [name]"** to activate a prompt type.

---

## 📚 Available Prompts

### Context & Session Management

#### `load reset` - Context Reset

**Purpose**: Save current work state and create session snapshots  
**When to use**: End of session, before major changes, when switching tasks  
**Info needed**: None (analyzes current conversation)  
**Output**: Two files - `ai-context.md` (current state) and dated snapshot  
**File**: [context-reset.md](context-reset.md)

#### `load resume` - Session Resume

**Purpose**: Continue work from a previous session  
**When to use**: Starting new session, after breaks  
**Info needed**:

- Path to context file (e.g., `docs/ai-context.md`)
- Optional: Specific work to focus on
  **File**: [context-reset.md](context-reset.md)

---

### Planning & Requirements

#### `load requirements` - Requirements Gathering

**Purpose**: Convert ideas into structured REQ-### documents  
**When to use**: New feature ideas, user story creation  
**Info needed**:

- Feature/idea description
- Target users
- Optional: Related requirements or issues
  **Output**: REQ-### formatted markdown document  
  **File**: [requirements-gathering.md](requirements-gathering.md)

#### `load planning` - Task Planning & Breakdown

**Purpose**: Break down epics/features into actionable tasks  
**When to use**: Sprint planning, issue breakdown, epic decomposition  
**Info needed**:

- Issue number or feature description
- Scope and constraints
- Optional: Timeline, team size
  **Output**: Phased task breakdown with GitHub issues  
  **File**: [task-planning.md](task-planning.md)

#### `load design` - Design Patterns & HLD

**Purpose**: Create high-level and detailed designs (HLD-### format)  
**When to use**: Architecture planning, API design, database schema  
**Info needed**:

- Component/system to design
- Related requirements
- Technical constraints
  **Output**: HLD-### formatted design document  
  **File**: [design-patterns.md](design-patterns.md)

---

### Testing & Quality

#### `load test` - Test Generation

**Purpose**: Generate test cases, scenarios, and automation scripts  
**When to use**: Creating E2E tests, test scripts, test data  
**Info needed**:

- Feature/component to test
- Test type (E2E, integration, API)
- Related requirement ID
  **Output**: Playwright test script or test scenarios  
  **File**: [test-generation.md](test-generation.md)

#### `load testplan` - Create Test Plan

**Purpose**: Generate comprehensive TEST-### test plan document  
**When to use**: Planning testing for a feature or release  
**Info needed**:

- Feature name
- Related requirement ID (REQ-###)
- Test scope (unit, E2E, performance, etc.)
  **Output**: TEST-### formatted test plan document  
  **File**: [test-generation.md](test-generation.md)

#### `load review` - Code Review

**Purpose**: Systematic code quality analysis  
**When to use**: PR reviews, security audits, refactoring  
**Info needed**:

- File paths or PR number
- Focus areas (security, performance, best practices)
  **Output**: Review checklist with findings  
  **File**: [code-review.md](code-review.md)

#### `load review-pr` - PR Review Workflow (Agent + Codex)

**Purpose**: Automated PR review with GitHub-formatted output  
**When to use**: Ready to review a PR, need senior-level code review  
**Info needed**:

- PR number (e.g., `#145`) or uses current branch
- Optional: Base branch (default: `main`)
  **Output**: Agent creates diff → outputs Codex prompt → Codex reviews → GitHub-pasteable comments  
  **Workflow**: `load review-pr #145` → Copy agent output → Paste to Copilot Chat → Copy review → Paste to GitHub  
  **File**: [review-pr.md](review-pr.md)

#### `load pr-fix` - Fix PR Review Comments

**Purpose**: Automatically address PR review feedback  
**When to use**: PR has unresolved comments, reviewer requested changes  
**Info needed**:

- PR number (e.g., `127`) or full PR URL
- Optional: Specific priority level to focus on (P1, P2)
  **Output**: Code fixes applied locally, ready to commit  
  **Workflow**: Fetch comments → Apply fixes → Ask to test or commit  
  **File**: [pr-fix.md](pr-fix.md)

---

### Documentation

#### `load docs` - Documentation Generation

**Purpose**: Create API docs, READMEs, inline comments, ADRs  
**When to use**: New endpoints, features, architecture decisions  
**Info needed**:

- Documentation type (API, README, ADR)
- Component/endpoint to document
- Target audience
  **Output**: Structured documentation in appropriate format  
  **File**: [documentation.md](documentation.md)

---

## 🎯 How to Use

### Basic Usage

```
You: load reset
AI: I'll create a context reset summary. Analyzing current conversation...
```

### With Specific Context

```
You: load planning for issue #123
AI: I'll break down issue #123 into tasks. Let me first check the issue details...
```

### Interactive Mode

```
You: load requirements
AI: I'll help create requirements. What feature or idea do you want to document?
You: Add expense filtering by date range
AI: Got it. Creating requirements for expense filtering. Should this be a new REQ or update existing one?
```

---

## 📖 Load Command Reference

| Command             | Prompt Type     | Info Auto-Requested             |
| ------------------- | --------------- | ------------------------------- |
| `load reset`        | Context Reset   | None (uses current state)       |
| `load resume`       | Session Resume  | Context file path               |
| `load requirements` | Requirements    | Feature description, user needs |
| `load planning`     | Task Planning   | Issue/feature to break down     |
| `load design`       | Design/HLD      | Component name, requirements    |
| `load test`         | Test Generation | Component to test, test type    |
| `load testplan`     | Test Plan       | Feature name, requirement ID    |
| `load review`       | Code Review     | Files to review, focus areas    |
| `load docs`         | Documentation   | Doc type, component name        |

---

## 🔍 Examples

### Example 1: Starting Documentation Work

```
You: load docs
AI: I'll help with documentation. What type do you need?
    1. API endpoint documentation
    2. README or guide
    3. Architecture decision record (ADR)
    4. Inline code comments
You: API endpoint
AI: Which endpoint? Please provide:
    - Method and path (e.g., POST /api/v1/expenses)
    - Service name
    - Related requirement ID (if any)
```

### Example 2: Quick Context Save

```
You: load reset
AI: Creating context reset summary...
    ✓ Analyzed conversation (23 messages)
    ✓ Created docs/ai-context.md
    ✓ Created docs/context-resets/2025-12-21/001_expense-filtering.md

    Summary saved. You can resume with: "load resume from docs/ai-context.md"
```

### Example 3: Breaking Down Work

```
You: load planning for issue #68
AI: Analyzing issue #68: "AI-powered conversational expense input"

    I'll break this down into phases. Estimated scope: 125-175 days

    Should I create GitHub subtask issues or just provide the breakdown?
You: Create the issues
AI: Creating subtasks... [proceeds with breakdown]
```

---

## 💡 Pro Tips

1. **Chain prompts**: Use multiple prompts in sequence

   ```
   load requirements → load design → load test → load docs
   ```

2. **Context aware**: Prompts can reference previous work

   ```
   load planning for the requirements we just created
   ```

3. **Iterate quickly**: Start broad, then narrow

   ```
   load test → "focus on edge cases" → "add error scenarios"
   ```

4. **Save progress**: Use `load reset` frequently
   ```
   After major milestones: load reset
   Before switching tasks: load reset
   ```

---

## 🎓 Learning Path

**New to prompts?** Follow this learning path:

1. Start: [Prompt Engineering Guide](prompt-engineering-guide.md)
2. Practice: Try `load requirements` with a simple feature
3. Expand: Use `load planning` to break it down
4. Document: Use `load reset` to save your work
5. Master: Explore all prompt types

---

## 🔧 Customization

### Adding New Prompts

When you create new prompts, add them to this catalog:

1. Add entry to appropriate section
2. Include load command format
3. List required info
4. Update command reference table
5. Add example usage

### Creating Aliases

You can create shortcuts:

- `reset` = `load reset`
- `plan` = `load planning`
- `doc` = `load docs`

Just mention your preferred shortcut and the AI will understand.

---

## 📚 Related Resources

- [README.md](README.md) - Full prompts library overview
- [prompt-engineering-guide.md](prompt-engineering-guide.md) - Learn prompt engineering
- [WORKING_WITH_AGENTS.md](../../dev/WORKING_WITH_AGENTS.md) - AI workflow best practices

---

**Last Updated**: December 21, 2025  
**Maintained By**: QA/SDET Team  
**Quick Start**: Type `load [name]` to activate any prompt!
