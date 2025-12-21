# Prompt Loader - AI Instructions

## Purpose

This document provides instructions for AI assistants on how to respond to "load [prompt]" commands from users. It enables a streamlined prompt activation system.

---

## How It Works

When a user says **"load [name]"**, follow this workflow:

### Step 1: Identify Prompt Type

Match the command to the prompt catalog:

| User Says                                      | Load This Prompt                                       |
| ---------------------------------------------- | ------------------------------------------------------ |
| `load reset`, `load context`                   | [context-reset.md](context-reset.md)                   |
| `load resume`, `load continue`                 | Context resume workflow                                |
| `load requirements`, `load req`                | [requirements-gathering.md](requirements-gathering.md) |
| `load planning`, `load plan`, `load breakdown` | [task-planning.md](task-planning.md)                   |
| `load design`, `load hld`, `load architecture` | [design-patterns.md](design-patterns.md)               |
| `load test`, `load testing`                    | [test-generation.md](test-generation.md)               |
| `load testplan`, `load test-plan`              | [test-generation.md](test-generation.md) (test plan)   |
| `load review`, `load code-review`              | [code-review.md](code-review.md)                       |
| `load docs`, `load documentation`              | [documentation.md](documentation.md)                   |

### Step 2: Check for Context

Does the user provide specific context in their request?

**Examples with context:**

- ✅ `load planning for issue #123`
- ✅ `load test for expense component`
- ✅ `load docs for POST /api/expenses`

**Examples without context:**

- ❌ `load planning`
- ❌ `load test`
- ❌ `load docs`

### Step 3: Response Pattern

#### If Context Provided → Execute Immediately

```
User: load planning for issue #123

AI Response:
"I'll break down issue #123 into actionable tasks. Let me first check the issue details..."
[Read issue, apply task-planning.md prompt, execute]
```

#### If No Context → Request Information Interactively

```
User: load docs

AI Response:
"I'll help with documentation. What type do you need?
1. API endpoint documentation
2. README or guide
3. Architecture decision record (ADR)
4. Inline code comments"

[Wait for user response, then ask for specific details]
```

### Step 4: Apply the Prompt

Once you have all required information:

1. Read the prompt file from `docs/general/prompts/[name].md`
2. Apply the prompt template with user's specific context
3. Execute the workflow
4. Deliver results

---

## Required Information by Prompt Type

### Context Reset (`load reset`)

- **Required**: None (uses current conversation)
- **Action**: Immediately analyze and create context files
- **Output**:
  - `docs/ai-context.md` (strategic)
  - `docs/context-resets/YYYY-MM-DD/###_topic.md` (detailed)

### Session Resume (`load resume`)

- **Required**:
  - Path to context file OR "use latest"
- **Questions to ask if missing**:
  - "Which context file should I load? (provide path or say 'latest')"
- **Action**: Read context file and restore state
- **Output**: Confirmation of loaded state

### Requirements Gathering (`load requirements`)

- **Required**:
  - Feature/idea description
- **Optional but helpful**:
  - Target users
  - Related requirements
  - Acceptance criteria
- **Questions to ask if missing**:
  - "What feature or idea do you want to document?"
  - "Who are the target users?"
  - "Any specific acceptance criteria?"
- **Output**: REQ-### formatted document

### Task Planning (`load planning`)

- **Required**:
  - Issue number OR feature description
- **Optional but helpful**:
  - Timeline/deadline
  - Team size
  - Constraints
- **Questions to ask if missing**:
  - "Which issue or feature should I break down?"
  - "Should I create GitHub issues or just provide the breakdown?"
- **Output**: Phased task breakdown + optional GitHub issues

### Design Patterns (`load design`)

- **Required**:
  - Component/system name
  - Related requirement ID
- **Optional but helpful**:
  - Technical constraints
  - Integration points
  - Performance requirements
- **Questions to ask if missing**:
  - "What component or system should I design?"
  - "Which requirements does this relate to?"
  - "Any technical constraints I should know?"
- **Output**: HLD-### formatted design document

### Test Generation (`load test`)

- **Required**:
  - Component/feature to test
  - Test type (E2E, integration, unit, API)
- **Optional but helpful**:
  - Related requirement ID
  - Existing test files
  - Coverage requirements
- **Questions to ask if missing**:
  - "What component or feature should I test?"
  - "What type of tests? (E2E, integration, API, unit)"
  - "Related requirement ID?"
- **Output**: Test script (Playwright/Jest/etc)

### Test Plan Creation (`load testplan`)

- **Required**:
  - Feature name
  - Related requirement ID (REQ-###)
- **Optional but helpful**:
  - Test scope (unit, E2E, performance, security, etc.)
  - Test coverage priorities
  - Timeline/schedule
- **Questions to ask if missing**:
  - "Which feature needs a test plan?"
  - "Related requirement ID (REQ-###)?"
  - "What test types should be included? (unit, E2E, performance, security)"
- **Output**: TEST-### formatted test plan document

### Code Review (`load review`)

- **Required**:
  - File paths OR PR number
- **Optional but helpful**:
  - Focus areas (security, performance, best practices)
  - Specific concerns
- **Questions to ask if missing**:
  - "Which files should I review? (provide paths or PR number)"
  - "Any specific focus areas? (security, performance, architecture)"
- **Output**: Review checklist with findings

### Documentation (`load docs`)

- **Required**:
  - Documentation type (API, README, ADR, comments)
  - Component/endpoint name
- **Optional but helpful**:
  - Target audience
  - Related requirements
  - Existing docs to update
- **Questions to ask if missing**:
  - "What type of documentation? (API, README, ADR, comments)"
  - "Which component or endpoint?"
  - "Creating new or updating existing?"
- **Output**: Structured documentation in appropriate format

---

## Response Templates

### Template 1: Immediate Execution (Context Provided)

```
I'll [ACTION] for [SPECIFIC_CONTEXT]. [BRIEF_PLAN]
[Execute prompt workflow]
```

**Example:**

```
I'll break down issue #68 into actionable tasks. Let me first analyze the issue details and create a phased breakdown.
```

### Template 2: Interactive Request (No Context)

```
I'll help with [PROMPT_TYPE]. [KEY_QUESTION]
[Optional: numbered choices or additional context questions]
```

**Example:**

```
I'll help with documentation. What type do you need?
1. API endpoint documentation
2. README or guide
3. Architecture decision record (ADR)
4. Inline code comments
```

### Template 3: Partial Context (Some Info Missing)

```
I'll [ACTION] for [PROVIDED_CONTEXT]. I need a few more details:
- [Missing detail 1]
- [Missing detail 2]
```

**Example:**

```
I'll create tests for the expense component. I need a few more details:
- What type of tests? (E2E, integration, API, unit)
- Related requirement ID? (if any)
```

---

## Special Cases

### Case 1: Ambiguous Prompt Name

If user says something unclear like "load rest":

```
I can help with:
1. load reset - Save current context
2. load test - Generate tests

Which did you mean?
```

### Case 2: Chained Prompts

If user wants multiple prompts:

```
User: load requirements then planning then design

AI: I'll run a workflow:
1. Create requirements document
2. Break down into tasks
3. Generate design document

Starting with requirements. What feature should I document?
```

### Case 3: Prompt Not Found

If user requests unknown prompt:

```
I don't have a "[name]" prompt. Available prompts:
- reset, resume, requirements, planning, design, test, review, docs

See the full catalog: docs/general/prompts/PROMPT_CATALOG.md

Which would you like to use?
```

---

## Best Practices for AI

1. **Be Conversational**: Use natural language, not robotic responses
2. **Be Efficient**: If you have 80% of info, ask only for critical missing pieces
3. **Be Helpful**: Suggest related prompts when relevant
4. **Be Proactive**: If you can infer info from context, do it (then confirm)
5. **Be Clear**: Explain what you're about to do before executing

### Good Example

```
User: load planning

AI: I'll help break down work into tasks. Which issue or feature should I focus on?
(I can see you have issues #68, #84-108 in the project - let me know which one, or describe a new feature)
```

### Bad Example

```
User: load planning

AI: TASK_PLANNING_PROMPT_LOADED. AWAITING_INPUT: ISSUE_NUMBER
```

---

## Integration with Existing Workflow

### Works With

- **Context Reset**: Use after completing work with any other prompt
- **Session Resume**: Use before starting work with any prompt
- **Requirements → Planning → Design → Test → Docs**: Natural workflow chain

### Examples of Natural Flow

```
Session 1:
load requirements → create REQ-005
load reset → save work

Session 2:
load resume → restore context
load planning for REQ-005 → break down tasks
load reset → save work

Session 3:
load resume → restore context
load test for REQ-005 tasks → generate tests
load reset → save work
```

---

## Testing Your Understanding

If implementing this system, verify you can handle these scenarios:

1. `load reset` → Should immediately create context files
2. `load test` → Should ask what to test and test type
3. `load planning for issue #123` → Should check issue then execute
4. `load docs for POST /api/expenses` → Should ask doc type
5. `load xyz` → Should show available prompts
6. `load requirements then planning` → Should chain workflows

---

## Maintenance

When new prompts are added:

1. Update command mapping table (Step 1)
2. Add required information section
3. Update examples
4. Test with various user inputs
5. Update [PROMPT_CATALOG.md](PROMPT_CATALOG.md)

---

**For AI Assistants**: This document is your guide to the prompt loader system. Follow these patterns to provide a seamless, interactive experience for users loading prompts.

**For Users**: See [PROMPT_CATALOG.md](PROMPT_CATALOG.md) for the user-facing guide.
