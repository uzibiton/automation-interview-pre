# Prompt Engineering Best Practices Guide

## Overview

This guide consolidates methods and techniques for crafting effective AI prompts. Use it to improve prompt quality across the project's documentation and day-to-day AI interactions.

---

## Current State

**Existing Prompts in Project**:

- [context-reset.md](context-reset.md) - Context restoration for AI sessions
- [test-generation.md](test-generation.md) - Generating test cases
- [requirements-gathering.md](requirements-gathering.md) - Requirements elicitation
- [code-review.md](code-review.md) - Code review assistance
- [documentation.md](documentation.md) - Documentation generation
- [design-patterns.md](design-patterns.md) - Design pattern guidance

**Gaps Identified**:

- No standardized structure across prompts
- Limited guidance on prompt optimization
- Missing validation/iteration methods
- No learning resources referenced

---

## Core Prompt Engineering Principles

### 1. Structure & Clarity

**RTFM Pattern** (Role, Task, Format, Motivation):

```
You are a [ROLE].
Your task is to [TASK].
Output should be [FORMAT].
This is needed because [MOTIVATION].
```

**Example**:

```
You are a senior test automation engineer.
Your task is to generate E2E test scenarios for a user registration flow.
Output should be Gherkin format with Given/When/Then syntax.
This is needed to ensure comprehensive coverage of edge cases.
```

### 2. Context Provision

**Always Include**:

- Relevant domain knowledge
- Constraints (technical, business, regulatory)
- Success criteria
- Examples of desired output
- Anti-patterns to avoid

**Example**:

```
Context:
- E-commerce platform with 100K+ daily users
- Must support GDPR compliance
- Response time < 200ms
- No breaking changes to existing API

Avoid:
- Solutions requiring database schema changes
- Third-party dependencies without enterprise licenses
```

### 3. Specificity > Ambiguity

| ❌ Vague           | ✅ Specific                                                       |
| ------------------ | ----------------------------------------------------------------- |
| "Make it better"   | "Reduce API response time from 500ms to 200ms"                    |
| "Add tests"        | "Add E2E tests covering happy path + 3 error scenarios"           |
| "Improve security" | "Implement OWASP Top 10 mitigations for authentication flow"      |
| "Fix the bug"      | "Resolve null pointer exception in payment validation (line 142)" |

### 4. Iterative Refinement

**Method**:

1. Start with basic prompt
2. Test output quality
3. Identify gaps/issues
4. Add constraints/examples
5. Re-test and compare
6. Document winning version

**Prompt Versioning**:

```
# v1: Initial attempt (vague)
"Create a test plan"

# v2: Added context (better)
"Create a test plan for the checkout flow"

# v3: Added structure (optimal)
"Create a test plan for the checkout flow.
Include:
- Test scope (in/out)
- 5-10 test scenarios
- Pass/fail criteria
- Risk areas
Format: Markdown with sections"
```

---

## Prompt Patterns by Use Case

### Pattern 1: Code Generation

```
Generate [COMPONENT] for [FEATURE].

Requirements:
- [Functional requirement 1]
- [Functional requirement 2]

Technical Constraints:
- Language/Framework: [TECH_STACK]
- Design patterns: [PATTERNS]
- Performance: [METRICS]

Include:
- Type safety
- Error handling
- Unit tests
- JSDoc comments

Reference style: [EXISTING_FILE_PATH]
```

### Pattern 2: Code Review

```
Review this [LANGUAGE] code for [PURPOSE].

Focus areas:
- [ ] Security vulnerabilities
- [ ] Performance bottlenecks
- [ ] Code maintainability
- [ ] Test coverage gaps

Standards:
- Follow [STYLE_GUIDE]
- Max complexity: [METRIC]
- Min test coverage: [PERCENTAGE]

Output:
- Issues (priority: High/Medium/Low)
- Suggested fixes with code snippets
- Learning resources for improvement
```

### Pattern 3: Testing

```
Generate [TEST_TYPE] tests for [FEATURE].

Test cases should cover:
- Happy path (2-3 scenarios)
- Edge cases (3-5 scenarios)
- Error handling (2-3 scenarios)

Format: [Playwright/Jest/Cucumber/etc]

Constraints:
- Use existing fixtures from [PATH]
- Follow AAA pattern (Arrange, Act, Assert)
- Max test duration: [TIME]

Include:
- Test data setup/teardown
- Clear assertions with failure messages
- Tags for selective execution
```

### Pattern 4: Documentation

```
Document [COMPONENT/FEATURE] for [AUDIENCE].

Include:
- Overview (2-3 sentences)
- Prerequisites
- Step-by-step guide
- Code examples
- Common issues & solutions
- Related resources

Tone: [Professional/Conversational/Technical]
Format: Markdown
Max length: [WORDS/SECTIONS]

Avoid:
- Obvious statements
- Outdated information
- Unclear acronyms
```

### Pattern 5: Debugging

```
Debug [ERROR/ISSUE] in [COMPONENT].

Symptoms:
- [Observable behavior]
- [Error messages]
- [Frequency/conditions]

Context:
- Environment: [DEV/STAGING/PROD]
- Recent changes: [COMMITS/PRs]
- Related components: [LIST]

Expected behavior: [DESCRIPTION]

Provide:
- Root cause analysis
- Fix recommendation
- Prevention strategy
- Test to verify fix
```

---

## Advanced Techniques

### Chain-of-Thought Prompting

**Use when**: Complex reasoning required

```
Solve this problem step-by-step:

Problem: [DESCRIPTION]

Think through:
1. What information do we have?
2. What's the core challenge?
3. What approaches could work?
4. Which approach is optimal and why?
5. What's the implementation plan?

Then provide the solution.
```

### Few-Shot Learning

**Use when**: Specific output format needed

```
Generate API error responses following these examples:

Example 1:
Input: User not found
Output: {"error": "USER_NOT_FOUND", "message": "No user exists with ID 12345", "status": 404}

Example 2:
Input: Invalid email
Output: {"error": "VALIDATION_ERROR", "message": "Email format is invalid", "status": 400}

Now generate for:
Input: [YOUR_CASE]
```

### Constrained Output

**Use when**: Structured data required

```
Analyze this code and output ONLY valid JSON (no explanation):

{
  "complexity": "low|medium|high",
  "issues": [
    {"type": "security|performance|style", "line": <number>, "severity": "high|medium|low"}
  ],
  "score": <0-100>
}
```

### Meta-Prompting

**Use when**: Creating prompts for others

```
Create a prompt template for [USE_CASE].

The template should:
- Guide users to provide sufficient context
- Enforce output format
- Include examples
- Be reusable across similar scenarios

Output: Markdown with placeholder sections
```

---

## Validation & Quality Checklist

### Before Publishing a Prompt

- [ ] **Clear objective**: Single, well-defined purpose
- [ ] **Sufficient context**: Domain, constraints, success criteria
- [ ] **Output format specified**: Structure, length, style
- [ ] **Examples provided**: Good and bad outputs shown
- [ ] **Tested**: Verified with 3+ different scenarios
- [ ] **Documented**: Use case and tips included
- [ ] **Versioned**: Changes tracked if iterating
- [ ] **Concise**: No unnecessary wordiness
- [ ] **Accessible**: Understandable by target audience

### Testing Prompts

1. **Run baseline**: Test with minimal context
2. **Add context incrementally**: See what improves output
3. **Test edge cases**: Unusual inputs, missing data
4. **Compare versions**: A/B test variations
5. **Get feedback**: Share with team for review
6. **Document findings**: What worked, what didn't

---

## Learning Resources

### Foundational

- **OpenAI Prompt Engineering Guide**: [platform.openai.com/docs/guides/prompt-engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- **Anthropic Prompt Engineering**: [docs.anthropic.com/claude/docs/prompt-engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
- **Google's Prompt Design Guide**: [ai.google.dev/docs/prompt_best_practices](https://ai.google.dev/docs/prompt_best_practices)

### Advanced Techniques

- **Chain-of-Thought Prompting** (Wei et al.): Technique for multi-step reasoning
- **ReAct Pattern** (Reasoning + Acting): Interleaving thought and action
- **Constitutional AI**: Building safety into prompts
- **Prompt Injection Defense**: Security considerations

### Communities & Tools

- **Prompt Engineering Subreddit**: r/PromptEngineering
- **Awesome Prompts**: [github.com/f/awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
- **LangChain**: Framework for chaining prompts and tools
- **PromptBase**: Marketplace for prompts (study patterns)

### Academic Papers

- "Large Language Models are Zero-Shot Reasoners" (Kojima et al., 2022)
- "Self-Consistency Improves Chain of Thought Reasoning" (Wang et al., 2022)
- "Constitutional AI" (Anthropic, 2022)

### Courses

- **DeepLearning.AI**: "ChatGPT Prompt Engineering for Developers" (Free)
- **Coursera**: "Prompt Engineering Specialization"
- **LinkedIn Learning**: "Prompt Engineering for Business"

---

## Action Plan: Improving Project Prompts

### Phase 1: Audit (Week 1)

- [ ] Review all existing prompts in `docs/general/prompts/`
- [ ] Test each prompt with 3 scenarios
- [ ] Document issues/gaps
- [ ] Prioritize improvements

### Phase 2: Standardize (Week 2)

- [ ] Create prompt template with required sections
- [ ] Refactor top 3 high-use prompts
- [ ] Add validation checklist to each
- [ ] Document changes and improvements

### Phase 3: Expand (Week 3-4)

- [ ] Create missing prompt types (identified in audit)
- [ ] Add examples to all prompts
- [ ] Build prompt library by category
- [ ] Share with team for feedback

### Phase 4: Optimize (Ongoing)

- [ ] Collect usage feedback
- [ ] Track which prompts work best
- [ ] Iterate based on results
- [ ] Update learning resources

---

## Quick Reference: Prompt Improvement Formula

```
❌ BEFORE (weak prompt):
"Write tests for the login feature"

✅ AFTER (strong prompt):
"Generate E2E tests for user login feature.

Test scenarios:
- Valid credentials → successful login
- Invalid password → error message displayed
- Account locked → appropriate lockout message

Technical:
- Framework: Playwright + TypeScript
- Page object pattern
- Use fixtures from tests/fixtures/auth-fixtures.ts

Output:
- One test file with 3 test cases
- AAA pattern (Arrange, Act, Assert)
- Clear test descriptions
- Data-testid selectors"
```

---

## Contributing

Found a technique that works? Improve this guide:

1. Test the technique with 3+ scenarios
2. Document the pattern with examples
3. Add to appropriate section
4. Submit PR with results/metrics

---

**Status**: 🟡 Living Document  
**Last Updated**: 2025-12-20  
**Maintainer**: Team  
**Feedback**: [Open an issue](../../README.md)
