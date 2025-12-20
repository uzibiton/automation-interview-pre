# Task Planning & Breakdown Prompts

## Break Down Idea into Actionable Tasks

**Use Case**: Convert a high-level idea or epic into structured phases, tasks, and subtasks with clear deliverables and estimates. Creates GitHub issues for each subtask with proper parent/child relationships.

**When to use**: After initial idea validation, when you have a GitHub issue and need to break it down into trackable subtasks.

**Workflow**:

1. Read the idea/issue from GitHub
2. Apply this prompt to generate phase/task breakdown
3. Analyze dependencies and critical path
4. Create GitHub issues for each subtask with parent references
5. Update parent issue with complete task list

---

## Prompt Template

```
Break down this idea/feature into actionable tasks and phases suitable for GitHub issue tracking.

**Parent Issue**: [GITHUB_ISSUE_URL or #NUMBER]

**Idea/Feature**: [BRIEF_DESCRIPTION]

**Context**:
- Current system capabilities: [WHAT_EXISTS_TODAY]
- User problem being solved: [PROBLEM_STATEMENT]
- Success criteria: [HOW_WE_MEASURE_SUCCESS]
- Available labels: [LIST_OF_GITHUB_LABELS]

**Output Requirements**:
1. Structured phase/task breakdown with clear numbering (0.1, 1.1, 2.1, etc.)
2. Each task must include:
   - Clear title: "[Phase X] Task X.Y: Descriptive Name"
   - Sub-deliverables (what gets produced)
   - Estimated effort (in days, e.g., "5-7 days")
   - Dependencies (list task numbers that must complete first, or "NONE")
   - Acceptance criteria (how we know it's done)
   - Appropriate labels (component, team, priority, size)
3. Identify critical path tasks (highest priority)
4. Flag tasks that can run in parallel

**Output Structure**:

### Phase 0: Prototype/Validation (Optional)
**Goal**: [EARLY_VALIDATION_WITHOUT_BACKEND]
**Can start immediately**: Tasks with no dependencies, often UI mockups

- Task 0.1: [SPECIFIC_TASK]
  - Sub-deliverables: [BULLET_LIST]
  - Estimated effort: X-Y days
  - Dependencies: NONE ✅ Can run in parallel
  - Acceptance criteria: [BULLET_LIST]
  - Labels: enhancement, component:frontend, team:dev, priority:medium, size:small

### Phase 1: Research & Planning (Critical Foundation)
**Goal**: [WHAT_TO_VALIDATE_BEFORE_BUILDING]
**Critical path**: Flag tasks that block everything else

- Task 1.1: [RESEARCH_TASK]
  - Sub-deliverables: [WHAT_GETS_PRODUCED]
  - Estimated effort: X-Y days
  - Dependencies: NONE ✅ Can run in parallel
  - Acceptance criteria: [HOW_WE_KNOW_ITS_DONE]
  - Labels: enhancement, team:dev, team:product, priority:critical, size:medium
  - 🔴 **CRITICAL** - Blocks multiple downstream tasks

### Phase 2: MVP / Proof of Concept
**Goal**: [SIMPLEST_WORKING_VERSION]

- Task 2.1: [DEVELOPMENT_TASK]
  - Sub-deliverables: [BULLET_LIST]
  - Estimated effort: X-Y days
  - Dependencies: **Blocked by:** Task 1.X, Task 1.Y
  - Acceptance criteria: [MEASURABLE_OUTCOMES]
  - Labels: enhancement, component:backend, team:dev, priority:high, size:large
  - **Blocks**: Task 2.2, Task 3.1

### Phase 3+: Advanced Features
[Continue pattern for additional phases]

### Testing & Validation
**Goal**: [QUALITY_ASSURANCE_ACROSS_FEATURES]

- Test 1: [TEST_FOCUS]
  - Sub-deliverables: [TEST_ARTIFACTS]
  - Estimated effort: X-Y days
  - Dependencies: **Blocked by:** Task X.Y
  - Acceptance criteria: [METRICS_AND_PASS_CRITERIA]
  - Labels: enhancement, team:qa, priority:high, size:medium

**Total Estimates**:
- Total effort: X-Y days (~Z months with N developers)
- MVP only (Phases 0-2): X-Y days (~Z months)
- Critical path: [LIST_CRITICAL_TASKS]

**Dependency Analysis**:
- Tasks with no dependencies (can start immediately): [LIST]
- Critical path (blocks most work): [LIST]
- Tasks that can run in parallel: [LIST]

**Constraints & Risks**:
- Technical constraints: [LIST]
- Budget/time limitations: [LIST]
- Regulatory/compliance: [LIST]
- High-risk tasks: [LIST]

**Recommended Approach**:
1. Start Phase 0 immediately for early user feedback (UI mockups)
2. Critical path: Phase 1 tasks X, Y, Z must complete first
3. Phase 2 can begin after Phase 1 completes
4. Phase 3+ are optional/lower priority
5. Testing runs after each phase completes
```

---

## After Breaking Down: Create GitHub Issues

**Step 1**: List available labels

```bash
gh label list
```

**Step 2**: Create issues systematically for each task

```bash
gh issue create \
  --title "[Phase X] Task X.Y: Descriptive Name" \
  --label "enhancement,component:frontend,team:dev,priority:high,size:medium" \
  --body "## Task Description
[Description from breakdown]

## Sub-deliverables
- [Item 1]
- [Item 2]

## Estimated Effort
X-Y days

## Dependencies
**Blocked by:**
- Task A.B: [Description] (#ISSUE_NUMBER)

**NONE** ✅ Can run in parallel (if no dependencies)

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Parent Issue
Part of #PARENT_ISSUE - [Parent Title]

## Blocks
- Task X.Y: [Description] (will reference after creation)
"
```

**Step 3**: Update parent issue with task list

```bash
gh issue edit PARENT_NUMBER --body "## 📋 Task Breakdown

[Prepend complete task list with links to all subtasks]

[Keep original issue body below]
"
```

**Label Guidelines**:

- **Component**: frontend, backend, database, ci-cd, docs
- **Team**: dev, qa, devops, product
- **Priority**: critical, high, medium, low
- **Size**: small (1-3 days), medium (3-5 days), large (5-10 days)
- **Type**: enhancement (for new features)
- **UX**: Add for user experience tasks

**Issue Body Template** (complete example):

```markdown
## Task Description

Build natural language processor to extract expense details from user messages.

## Sub-deliverables

- Intent classification (add expense vs. query)
- Entity extraction (amount, category, merchant, date, notes)
- Ambiguity detection & clarification prompts
- Multi-currency support
- Unit tests for parser

## Estimated Effort

7-10 days

## Dependencies

**Blocked by:**

- Task 1.4: Technical Architecture Design (#90)

## Acceptance Criteria

- [ ] Parser extracts all entities with >90% accuracy
- [ ] Handles ambiguous inputs with clarification
- [ ] Unit tests pass with >80% coverage
- [ ] Supports USD, EUR, GBP

## Parent Issue

Part of #68 - AI-Powered Conversational Expense Input

## Blocks

- Task 2.3: Chat Interface Implementation
- Testing: Test 1 - NLP Accuracy Testing
```

---

## Example: Complete Workflow for Issue #68

**Input** (GitHub issue #68):
"Add AI-powered conversational expense input and comparative analytics"

**Step 1: Apply Planning Prompt**

```
Break down this idea/feature into actionable tasks and phases suitable for GitHub issue tracking.

**Parent Issue**: https://github.com/uzibiton/automation-interview-pre/issues/68

**Idea/Feature**: AI-powered conversational expense input with comparative analytics

**Context**:
- Current system: Manual form-based expense entry (date, category, amount)
- User problem: Slow data entry, requires many clicks, no spending insights
- Success criteria: 80%+ parsing accuracy, users prefer chat input, actionable insights
- Available labels: enhancement, component:{frontend|backend|database|ci-cd|docs}, team:{dev|qa|devops|product}, priority:{critical|high|medium|low}, size:{small|medium|large}, ux

[AI generates complete breakdown with phases 0-5, testing tasks]
```

**Output**: Structured breakdown with 25 tasks across 6 phases:

- Phase 0: UI Prototype (3 tasks, can start immediately)
- Phase 1: Research & Design (4 tasks, critical foundation)
- Phase 2: MVP Implementation (4 tasks)
- Phase 3: Consultation Features (3 tasks)
- Phase 4: Analytics (3 tasks)
- Phase 5: Comparative Benchmarking (3 tasks)
- Testing: 5 tasks

**Step 2: Analyze Dependencies**

```
Analyze the dependencies between these tasks. Which can run in parallel? What's the critical path?
```

**Output**:

- **No dependencies (start immediately)**: Phase 0 all tasks, Tasks 1.1, 1.2, 1.3
- **Critical path**: 1.1 (AI provider) → 1.4 (architecture) → 2.1 (NLP) → 2.3 (UI) → Testing
- **Parallel work possible**: UI mockups (Phase 0) while doing research (Phase 1)

**Step 3: Create GitHub Issues**

```bash
# Get available labels first
gh label list

# Create each task as a GitHub issue
gh issue create --title "[Phase 0] Task 0.1: Chat Interface UI Mockup" \
  --label "enhancement,component:frontend,team:dev,priority:medium,size:small" \
  --body "[Complete body with sub-deliverables, dependencies, etc.]"

# Created issues: #84-108 (25 total)
```

**Step 4: Update Parent Issue**

```bash
gh issue edit 68 --body "## 📋 Task Breakdown

### Phase 0: UI Prototype (Optional - Can Start Immediately)
- [ ] #84 - Task 0.1: Chat Interface UI Mockup (3-4 days)
- [ ] #85 - Task 0.2: Expense Preview & Confirmation UI (2-3 days)
- [ ] #86 - Task 0.3: User Testing with UI Mockups (2-3 days)

### Phase 1: Research & Design (Critical Foundation)
- [ ] #87 - Task 1.1: AI Provider Evaluation 🔴 **CRITICAL**
...

### 📊 Total Estimates
- Total Effort: 125-175 days (~6-9 months)
- MVP Only: 31-48 days (~1.5-2.5 months)
- Critical Path: Tasks 1.1, 1.2, 1.4 → 2.1, 2.2 → 2.3 → Testing

[Original issue content below]
"
```

**Result**:

- ✅ 25 trackable GitHub issues created (#84-108)
- ✅ Parent issue #68 updated with complete task list
- ✅ Dependencies clearly marked with "Blocked by" references
- ✅ Each subtask includes parent reference to #68
- ✅ Critical path identified
- ✅ Parallel work opportunities highlighted

---

## Real Example Output

**Phase 0: UI Prototype (Can Start Immediately)**

Task 0.1: Chat Interface UI Mockup

- Sub-deliverables: Figma/wireframes, chat bubble design, input field, message history
- Estimated effort: 3-4 days
- Dependencies: NONE ✅ Can run in parallel
- Acceptance: Mockups approved by team, user-testable prototype
- Labels: enhancement, component:frontend, team:dev, priority:medium, size:small

Task 0.2: Expense Preview & Confirmation UI

- Sub-deliverables: Preview card component, edit controls, confirm/cancel buttons
- Estimated effort: 2-3 days
- Dependencies: **Blocked by** Task 0.1
- Acceptance: Interactive preview, edit functionality works
- Labels: enhancement, component:frontend, team:dev, priority:medium, size:small

**Phase 1: Research & Design (Critical Foundation)**

Task 1.1: AI Provider Evaluation & Cost Analysis

- Sub-deliverables: Provider comparison matrix, cost projections, accuracy benchmarks
- Estimated effort: 3-5 days
- Dependencies: NONE ✅ Can run in parallel
- Acceptance: Clear provider recommendation with cost model
- Labels: enhancement, team:dev, team:product, priority:critical, size:medium
- 🔴 **CRITICAL** - Blocks Task 1.4 (architecture)

Task 1.4: Technical Architecture Design

- Sub-deliverables: Component diagram, API contracts, data flow, tech stack
- Estimated effort: 5-7 days
- Dependencies: **Blocked by** Task 1.1 (AI provider decision)
- Acceptance: HLD document complete, reviewed by team
- Labels: enhancement, team:dev, priority:high, size:large
- **Blocks**: Task 2.1, 2.2, 2.3 (all MVP tasks)

**Phase 2: MVP Implementation**

Task 2.1: NLP Expense Parser Implementation

- Sub-deliverables: Intent classification, entity extraction, unit tests
- Estimated effort: 7-10 days
- Dependencies: **Blocked by** Task 1.4 (architecture)
- Acceptance: >90% accuracy, handles ambiguity, >80% test coverage
- Labels: enhancement, component:backend, team:dev, priority:high, size:large
- **Blocks**: Task 2.3 (chat UI)

**Testing**

Test 1: NLP Accuracy Testing

- Sub-deliverables: Test dataset (500+ inputs), accuracy metrics, regression suite
- Estimated effort: 5-7 days
- Dependencies: **Blocked by** Task 2.1 (NLP parser)
- Acceptance: >90% accuracy, all edge cases documented
- Labels: enhancement, team:qa, priority:high, size:medium

---

## Breakdown for Different Contexts

### For Small Features (< 1 week)

```
Break down [FEATURE_NAME] into daily tasks.

Output:
- Day 1: [WHAT_TO_BUILD]
- Day 2: [WHAT_TO_BUILD]
- Day 3: Testing + refinement

Keep each day focused on one deliverable.
```

### For Large Epics (Multiple sprints)

```
Break down [EPIC_NAME] into sprint-sized chunks.

Output:
- Sprint 1: MVP with core value
- Sprint 2: Enhanced version
- Sprint 3: Polish + edge cases

Each sprint should deliver working software.
```

### For Research Tasks

```
Create a research plan for [TOPIC].

Output:
- Research questions to answer
- Sources to investigate
- Experiments to run
- Expected outcomes
- Timeline: X days
```

---

## Tips for Effective Task Breakdown

**Good Task Characteristics**:

- ✅ Clear deliverable (code, document, decision)
- ✅ Testable acceptance criteria with metrics (>90% accuracy, <2s latency)
- ✅ Realistic time estimate in days (2-10 days max per task)
- ✅ Explicit dependencies with task references
- ✅ Single responsibility (one goal per task)
- ✅ Proper labels (component, team, priority, size)
- ✅ Parent issue reference
- ✅ Lists what it blocks (downstream dependencies)

**Bad Task Characteristics**:

- ❌ Vague outcome ("Investigate X", "Research Y")
- ❌ No acceptance criteria or unmeasurable criteria
- ❌ Too large (> 10 days → split into smaller tasks)
- ❌ Multiple unrelated goals in one task
- ❌ Missing dependencies or blocking relationships
- ❌ Unclear who does it (no team label)

**Estimation Guidelines**:

- Research/planning tasks: 2-5 days
- Small implementation: 2-4 days
- Medium implementation: 4-7 days
- Large implementation: 7-10 days (max)
- Testing tasks: 5-7 days
- If > 10 days: Split into multiple subtasks
- Total estimates: Provide range (e.g., "125-175 days")
- MVP estimate: Separate from full feature estimate

**Dependency Management**:

- Identify tasks with **no dependencies** (can start immediately)
- Order tasks by dependency chain (critical path)
- Flag external dependencies (legal review, design approval)
- Plan parallel work where possible (e.g., UI mockups + research)
- Use clear markers: "**NONE** ✅ Can run in parallel" vs "**Blocked by:** Task X.Y (#ISSUE)"
- Each task should list what it **blocks** (downstream tasks)

**Phase Structure Best Practices**:

- **Phase 0: Prototype/Validation** (Optional)
  - UI mockups, user testing without backend
  - Can start immediately (no dependencies)
  - Provides early feedback
  
- **Phase 1: Research & Planning** (Critical)
  - Technology evaluation, cost analysis
  - Legal/compliance review
  - Architecture design
  - Critical path starts here
  
- **Phase 2: MVP** (Core Value)
  - Simplest working version
  - Focus on core user value
  - Should be deliverable on its own
  
- **Phase 3+: Advanced Features** (Optional)
  - Build on MVP foundation
  - Can be deferred if needed
  - Each phase should be independently valuable
  
- **Testing** (Continuous)
  - Testing tasks after each phase
  - Security/privacy testing flagged as critical
  - Performance, accuracy, bias testing

**Risk Mitigation**:

- High-risk tasks → Add POC/spike task first
- Uncertain estimates → Add research phase before implementation
- External dependencies → Have fallback plan in task description
- New technology → Budget learning time in estimate
- Critical path tasks → Flag with 🔴 **CRITICAL** marker

**GitHub Issue Creation**:

1. Get labels first: `gh label list`
2. Create issues in order (Phase 0 → Phase 1 → ...)
3. Reference parent in every subtask body
4. Include "Blocked by" with issue numbers after creation
5. Include "Blocks" section listing downstream tasks
6. Update parent issue with complete task list at end
7. Use checkboxes in parent for progress tracking

---

## Integration with Other Prompts

**Before this prompt**:

- Use [requirements-gathering.md](requirements-gathering.md) if user stories aren't clear
- Review [prompt-engineering-guide.md](prompt-engineering-guide.md) for best practices

**After this prompt**:

- Use [design-patterns.md](design-patterns.md) for technical HLD (once tasks are defined)
- Use [test-generation.md](test-generation.md) for detailed test cases
- Use [context-reset.md](context-reset.md) to save planning state

---

## Related Resources

- [IDEA_TEMPLATE.md](../../qa/IDEA_TEMPLATE.md) - Structure for documenting ideas
- [PROJECT_STATUS.md](../../general/PROJECT_STATUS.md) - Track work in progress
- Agile story splitting techniques
- Work Breakdown Structure (WBS) best practices
