# Task Planning & Breakdown Prompts

## Feature Planning Workflow

**Use Case**: Convert a high-level idea or epic into professional, traceable documentation and actionable tasks following software engineering best practices.

**When to use**: When you have a GitHub issue/idea and need comprehensive planning from requirements through implementation tasks.

**Complete Workflow**:

### Step 1: Discussion Phase

**Goal**: Clarify scope, approach, and priorities before creating documentation

1. Read the idea/issue from GitHub or project documentation
2. Discuss with stakeholder:
   - **Scope & Vision**: What's included/excluded, user scenarios, core features
   - **Planning Approach**: Which phases to prioritize (MVP vs. full feature)
   - **Integration Points**: Dependencies on existing system components
   - **Success Criteria**: How to measure success
   - **Risk & Constraints**: Technical limitations, time/budget constraints

### Step 2: Create Requirements Document (REQ-XXX)

**Goal**: Define what we're building and why

- Use template: `docs/product/REQUIREMENTS_TEMPLATE.md`
- Output location: `docs/product/requirements/REQ-XXX-[feature-name].md`
- Must include:
  - Executive summary & business context
  - User stories with acceptance criteria
  - Functional requirements (FR-001, FR-002, etc.)
  - Non-functional requirements (performance, security, usability)
  - Success metrics
  - Traceability to HLD and test plans

### Step 3: Create High-Level Design (HLD-XXX)

**Goal**: Define how we'll build it (architecture & design)

- Use template: `docs/dev/HLD_TEMPLATE.md`
- Output location: `docs/dev/designs/HLD-XXX-[feature-name].md`
- Must include:
  - System architecture diagram
  - Component design (frontend, backend, database)
  - API specifications
  - Data models & schemas
  - Security & authentication approach
  - Traceability to requirements and test plans

### Step 4: Create Test Plan (TEST-XXX)

**Goal**: Define how we'll validate quality

- Use template: `docs/qa/test-plans/TEST_PLAN_TEMPLATE.md`
- Output location: `docs/qa/test-plans/TEST-XXX-[feature-name].md`
- Must include:
  - Test scope (in/out of scope)
  - Test strategy & types (unit, integration, e2e, non-functional)
  - Test cases with priorities
  - Entry/exit criteria
  - Test data requirements
  - Traceability to requirements

### Step 5: Break Down into Implementation Tasks (TASKS-XXX)

**Goal**: Create actionable, trackable work items

- Use structured task document format
- Output location: `docs/dev/TASKS-XXX-[feature-name].md`
- Must include:
  - Task summary table (phases, effort, priorities)
  - UI-First Development Approach (if applicable)
  - Detailed task breakdown by phase
  - Each task: ID, title, priority, effort, dependencies, acceptance criteria, files to modify, labels
  - Task dependencies diagram
  - GitHub issues template with examples

### Step 6: Setup GitHub Infrastructure

**Goal**: Enable tracking and assignment in GitHub

1. **Create GitHub Labels** (if not exist):
   - Use `tools/setup-github-labels.js`
   - Main label: `TASK-XXX`
   - Phase labels: `phase-0-db`, `phase-1-auth`, `phase-2-api`, `phase-3-ui`, `phase-4-testing`
   - Priority labels: `priority-critical`, `priority-high`, `priority-medium`
   - Tech stack labels: `frontend`, `backend`, `database`, etc.

2. **Create GitHub Issues**:
   - Use `tools/create-task-issues.js` or create manually
   - One issue per task with proper:
     - Title: `[TASK-XXX-001] Task Name`
     - Labels: All relevant labels from task definition
     - Body: Link to parent issue, dependencies, tracking document
     - Link dependencies between issues
   - Close any duplicate issues

3. **Verify Setup**:
   - Test filter: `label:TASK-XXX` shows all tasks
   - Phase filters work: `label:TASK-XXX label:phase-3-ui`
   - Dependencies are linked between issues

### Step 7: Update Documentation & Tracking

**Goal**: Maintain bidirectional traceability

- Update `docs/product/TRACEABILITY_MATRIX.md`:
  - Add new REQ-XXX row with links to HLD, TEST, TASKS
  - Update test coverage tables
  - Add FR/NFR mappings
- Update `README.md`:
  - Update parent issue progress (e.g., 0% → 15%)
  - Add documentation links
  - Update traceability example if needed
- Update `docs/TABLE_OF_CONTENTS.md`:
  - Add REQ-XXX, HLD-XXX, TEST-XXX, TASKS-XXX entries
  - Update traceability system section

---

## Output Structure

When running "load planning for issue #XX", the agent should produce:

### 1. Discussion Summary (10-15 minutes)

**Purpose**: Clarify scope before documentation

- Interactive Q&A with stakeholder covering:
  - Scope boundaries (MVP vs full feature)
  - User scenarios and core features
  - Technical approach and integration points
  - Success criteria and constraints
- Output: Brief summary of key decisions

### 2. Requirements Document (REQ-XXX) (1-2 hours)

### 2. Requirements Document (REQ-XXX)

**File**: `docs/product/requirements/REQ-XXX-[feature-name].md`

- Template: `docs/product/REQUIREMENTS_TEMPLATE.md`
- Contains:
  - Executive summary & business context
  - User stories (US-001, US-002, etc.)
  - Functional requirements (FR-001, FR-002, etc.)
  - Non-functional requirements (NFR-001, NFR-002, etc.)
  - Success metrics
- Traceability: Links to HLD-XXX, TEST-XXX, implementation tasks

### 3. High-Level Design (HLD-XXX) (2-3 hours)

**File**: `docs/dev/designs/HLD-XXX-[feature-name].md`

- Template: `docs/dev/HLD_TEMPLATE.md`
- Contains:
  - System architecture diagrams
  - Component design (frontend, backend, database)
  - API specifications (endpoints, request/response)
  - Data models & database schemas
  - Security & authentication approach
- Traceability: Links to REQ-XXX, TEST-XXX

### 4. Test Plan (TEST-XXX) (1-2 hours)

**File**: `docs/qa/test-plans/TEST-XXX-[feature-name].md`

- Template: `docs/qa/test-plans/TEST_PLAN_TEMPLATE.md`
- Contains:
  - Test scope (in/out of scope)
  - Test strategy by type (unit, integration, e2e, non-functional)
  - Detailed test cases with priorities (aim for 80-110 test cases)
  - Entry/exit criteria
- Traceability: Links to REQ-XXX, HLD-XXX

### 5. Implementation Tasks (TASKS-XXX) (1-2 hours)

**File**: `docs/dev/TASKS-XXX-[feature-name].md`

Structured breakdown with:

- Task summary table (phases, effort estimates, priorities)
- UI-First Development Approach section (if applicable)
- Detailed tasks by phase (TASK-XXX-001, TASK-XXX-002, etc.)
- Each task includes:
  - Priority, effort estimate, dependencies
  - Requirements traceability (FR-XXX, US-XXX)
  - Design section references (HLD-XXX Section X.X)
  - Acceptance criteria (checkboxes)
  - Files to modify/create
  - GitHub labels
- Task dependencies diagram
- GitHub Issues Template with examples

### 6. GitHub Setup (30-60 minutes)

**Create Labels**:

- Run `node tools/setup-github-labels.js gh | bash`
- Verify at: `https://github.com/[org]/[repo]/labels`

**Create Issues**:

- Use `gh issue create` or GitHub web UI
- Follow format from TASKS-XXX document
- Link dependencies between issues
- Example: Issue #117 for TASK-002-015

**Verify**:

- Test filter: `label:TASK-XXX`
- All phase filters work
- Dependencies linked correctly

### 7. Documentation Updates (15-30 minutes)

**Update Traceability**:

- `docs/product/TRACEABILITY_MATRIX.md`: Add REQ-XXX row
- `README.md`: Update parent issue progress
- `docs/TABLE_OF_CONTENTS.md`: Add new document entries

---

## Complete Example: REQ-002 (Group Management)

See these documents for reference:

- Discussion: Captured in REQ-002 introduction
- Requirements: `docs/product/requirements/REQ-002-group-management.md`
- Design: `docs/dev/designs/HLD-002-group-management.md`
- Test Plan: `docs/qa/test-plans/TEST-002-group-management.md`
- Tasks: `docs/dev/TASKS-002-group-management.md`
- GitHub: Issues #117-#126 with label `TASK-002`

---

## Task Breakdown Template

**Use this after REQ, HLD, and Test Plan documents are created**

```
Break down [FEATURE_NAME] into actionable implementation tasks and phases.

**Parent Issue**: [GITHUB_ISSUE_URL or #NUMBER]

**Context**:
- Requirements: REQ-XXX (link)
- Design: HLD-XXX (link)
- Test Plan: TEST-XXX (link)
- Current system capabilities: [WHAT_EXISTS_TODAY]
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
   - Links to related requirements (FR-XXX) and design sections
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

**Result**:

- ✅ **Discussion completed** with stakeholder clarifications
- ✅ **REQ-002 created** in docs/product/requirements/
- ✅ **HLD-002 created** in docs/dev/designs/
- ✅ **TEST-002 created** in docs/qa/test-plans/
- ✅ **18 trackable GitHub issues** created (#84-101)
- ✅ **Parent issue #68 updated** with complete task list and traceability links
- ✅ **Dependencies clearly marked** with "Blocked by" references
- ✅ **Each subtask references** specific requirements (FR-XXX) and design sections
- ✅ **Critical path identified**
- ✅ **Bidirectional traceability** established between all documents

---

## After Breaking Down: Create GitHub Issues

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

## Related Documents

- **Requirements**: REQ-002 FR-003 (NLP Parsing)
- **Design**: HLD-002 Section 4.2 (NLP Service Architecture)
- **Test Plan**: TEST-002 TC-002-005 to TC-002-010 (NLP Accuracy Tests)

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

**Step 0: Discussion Phase**

Ask stakeholder:

```
Before creating documents, let's discuss:

1. **Scope & Vision**: Should this include real-time chat, historical context, multi-turn conversations?
2. **AI Provider**: OpenAI, Anthropic, or local models? Budget constraints?
3. **Integration**: How does this fit with existing expense form? Replace or supplement?
4. **Success Metrics**: What accuracy rate is acceptable? User adoption target?

[Wait for clarification before proceeding]
```

**Step 1: Create Requirements Document**

After discussion, create `docs/product/requirements/REQ-002-ai-expense-input.md`:

- Executive summary: "Enable users to add expenses via natural language chat"
- User stories: US-001 through US-010
- Functional requirements: FR-001 (NLP parsing), FR-002 (chat UI), etc.
- Non-functional: NFR-001 (response time <2s), NFR-002 (90% accuracy)

**Step 2: Create High-Level Design**

Create `docs/dev/designs/HLD-002-ai-expense-input.md`:

- Architecture: Add NLP service, chat controller
- API endpoints: POST /api/chat/message, GET /api/chat/history
- Data models: conversations, messages, parsed_expenses tables
- Security: Rate limiting, input sanitization

**Step 3: Create Test Plan**

Create `docs/qa/test-plans/TEST-002-ai-expense-input.md`:

- Functional tests: NLP accuracy, chat UI interaction
- Non-functional: Performance (100 concurrent users), accuracy (>90%)
- Test cases: TC-002-001 through TC-002-025

**Step 4: Break Down into Tasks**

Now apply task breakdown prompt:

```
Break down AI Expense Input feature into actionable tasks and phases suitable for GitHub issue tracking.

**Parent Issue**: https://github.com/uzibiton/automation-interview-pre/issues/68

**Context**:
- Requirements: REQ-002 (docs/product/requirements/REQ-002-ai-expense-input.md)
- Design: HLD-002 (docs/dev/designs/HLD-002-ai-expense-input.md)
- Test Plan: TEST-002 (docs/qa/test-plans/TEST-002-ai-expense-input.md)
- Current system: Manual form-based expense entry
- Available labels: enhancement, component:{frontend|backend|database}, team:{dev|qa}, priority:{critical|high|medium|low}, size:{small|medium|large}

[AI generates complete breakdown with phases 0-5, testing tasks]
```

**Step 5: Output - Structured Breakdown**

Generated 25 tasks across 6 phases:

- Phase 0: Database Schema (2 tasks) - implements HLD-002 Section 5.3
- Phase 1: Backend API (4 tasks) - implements FR-001, FR-002, FR-003
- Phase 2: Frontend Chat UI (3 tasks) - implements FR-004, FR-005
- Phase 3: NLP Integration (3 tasks) - implements FR-006
- Phase 4: Testing & QA (4 tasks) - covers TEST-002 test cases
- Phase 5: Documentation (2 tasks)

Each task references specific requirements (FR-XXX) and design sections.

**Step 6: Analyze Dependencies**

```
Analyze the dependencies between these tasks. Which can run in parallel? What's the critical path?
```

**Output**:

- **No dependencies (start immediately)**: Phase 0 (database schema)
- **Critical path**: Database → Backend API → Frontend UI → Testing
- **Parallel work possible**: Documentation can start anytime

**Step 7: Create GitHub Issues**

```bash
# Get available labels first
gh label list

# Create each task as a GitHub issue
gh issue create --title "[Phase 0] Task 0.1: Database Schema Design" \
  --label "enhancement,component:database,team:dev,priority:high,size:small" \
  --body "## Task Description
Create tables for conversations and messages.

## Related Documents
- Requirements: REQ-002 FR-001
- Design: HLD-002 Section 5.3
- Test Plan: TEST-002 TC-002-015

## Sub-deliverables
- migrations/create_conversations.sql
- migrations/create_messages.sql
- ER diagram

## Estimated Effort
2-3 days

## Dependencies
NONE ✅ Can start immediately

## Acceptance Criteria
- [ ] Tables created with proper indexes
- [ ] Foreign key constraints configured
- [ ] Migration tested on dev environment

## Parent Issue
Part of #68 - AI-Powered Expense Input

## Blocks
- Task 1.1: Chat API endpoint implementation
"

# Created issues: #84-108 (18 total)
```

**Step 8: Update Parent Issue & Documentation**

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
