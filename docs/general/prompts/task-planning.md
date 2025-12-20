# Task Planning & Breakdown Prompts

## Break Down Idea into Actionable Tasks

**Use Case**: Convert a high-level idea or epic into structured phases, tasks, and subtasks with clear deliverables and estimates.

**When to use**: After initial idea validation, before creating requirements or design documents.

---

## Prompt Template

```
Break down this idea/feature into actionable tasks and phases.

**Idea/Feature**: [BRIEF_DESCRIPTION or link to GitHub issue]

**Context**:
- Current system capabilities: [WHAT_EXISTS_TODAY]
- User problem being solved: [PROBLEM_STATEMENT]
- Success criteria: [HOW_WE_MEASURE_SUCCESS]

**Output Structure**:

### Phase 1: Research & Planning
**Goal**: [WHAT_TO_VALIDATE]
- [ ] Task 1.1: [SPECIFIC_TASK]
  - Sub-deliverables: [WHAT_GETS_PRODUCED]
  - Estimated effort: [HOURS_OR_DAYS]
  - Dependencies: [WHAT_MUST_BE_DONE_FIRST]
  - Acceptance criteria: [HOW_WE_KNOW_ITS_DONE]

[Repeat for each research task]

### Phase 2: MVP / Proof of Concept
**Goal**: [SIMPLEST_WORKING_VERSION]
- [ ] Task 2.1: [SPECIFIC_TASK]
  [Same structure as above]

### Phase 3+: Advanced Features
[Continue pattern for additional phases]

### Testing Tasks (Throughout)
- [ ] Test X.1: [TEST_FOCUS]
  - Test approach: [HOW_TO_TEST]
  - Success criteria: [METRICS]

**Constraints**:
- Identify technical constraints
- Budget/time limitations
- Regulatory/compliance requirements

**Risk Assessment**:
- List high-risk tasks
- Identify dependencies and blockers
- Suggest fallback strategies

**Decision Points**:
- Go/No-go criteria after Phase 1
- When to proceed to Phase 2+
- What validates success at each phase

**Recommended Approach**:
- Which phases to prioritize
- What to build first for fastest validation
- What can be deferred or descoped
```

---

## Example: AI-Powered Feature Breakdown

**Input**:

```
Break down: AI-powered conversational expense input

Context:
- Current: Manual form-based expense entry (date, category, amount)
- Problem: Slow data entry, requires many clicks
- Success: Users prefer chat input, 80%+ parsing accuracy
```

**Output**:

```
### Phase 1: Research & Validation (Week 1-2)

**Goal**: Validate feasibility and make informed technology choices

- [ ] Task 1.1: AI Provider Evaluation
  - Compare OpenAI, Claude, Gemini (cost, latency, accuracy)
  - Test parsing with 50 sample inputs per provider
  - Deliverable: Provider comparison matrix with recommendation
  - Estimated effort: 3 days
  - Acceptance: Clear provider choice with cost projection

- [ ] Task 1.2: Legal & Compliance Review
  - Research financial advice regulations
  - Draft disclaimer language
  - Deliverable: Legal compliance checklist
  - Estimated effort: 2 days
  - Dependencies: None
  - Acceptance: Legal clearance or clear constraints

### Phase 2: MVP - Basic NLP Parsing (Week 3-4)

**Goal**: Prove NLP can parse expenses accurately

- [ ] Task 2.1: Implement NLP Parser
  - Parse "Coffee $5" → expense object
  - Support 5 common formats
  - Deliverable: Working API endpoint
  - Estimated effort: 5 days
  - Dependencies: Task 1.1 (provider selected)
  - Acceptance: 80%+ accuracy on test dataset

- [ ] Task 2.2: Simple Chat UI
  - Basic text input → AI response
  - Display parsed expense for confirmation
  - Deliverable: Functional UI component
  - Estimated effort: 3 days
  - Acceptance: < 2s response time

### Testing Tasks

- [ ] Test 1: NLP Accuracy Testing
  - Create dataset of 100+ natural language inputs
  - Test accuracy across languages, formats, edge cases
  - Deliverable: Test report with accuracy metrics
  - Acceptance: 80%+ accuracy, zero critical bugs

**Risk Assessment**:
- HIGH: AI cost may be prohibitive → Mitigation: Set cost limits, cache results
- MEDIUM: Low accuracy for complex inputs → Mitigation: Add clarifying questions
- LOW: UI performance issues → Mitigation: Load testing

**Decision Points**:
- After Phase 1: Proceed only if cost < $500/month and legal clearance
- After Phase 2: Proceed to advanced features only if accuracy > 80%

**Recommended Approach**:
1. Start with Phase 1 research (validate before building)
2. Build MVP with simplest AI provider (OpenAI)
3. Get user feedback on MVP before adding complexity
4. Defer advanced features until MVP proves value
```

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
- ✅ Testable acceptance criteria
- ✅ Realistic time estimate (hours/days, not weeks)
- ✅ Explicit dependencies
- ✅ Single responsibility (one goal per task)

**Bad Task Characteristics**:

- ❌ Vague outcome ("Investigate X")
- ❌ No acceptance criteria
- ❌ Too large (> 5 days)
- ❌ Multiple unrelated goals
- ❌ Unclear who does it

**Estimation Guidelines**:

- Research tasks: 2-5 days
- Simple feature: 1-3 days
- Complex feature: Break into 3-5 day chunks
- Testing: 20-30% of development time
- Buffer: Add 20% for unknowns

**Dependency Management**:

- Identify blockers early
- Order tasks by dependency chain
- Flag external dependencies (legal, design, etc.)
- Plan parallel work where possible

**Risk Mitigation**:

- High-risk tasks → Add POC/spike first
- Uncertain estimates → Add research phase
- External dependencies → Have fallback plan
- New technology → Budget learning time

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
