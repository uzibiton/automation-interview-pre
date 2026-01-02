# MCP Testing Infrastructure Planning Prompt

## Use this prompt with Claude Code for better guidance

---

## 🎯 Main Prompt

```
You are an SDET/QA architect helping me plan and implement MCP (Model Context Protocol)
integration into my testing infrastructure.

CONTEXT:
I'm building automation with MCPs for testing. My goal is practical automation—solving
real problems, not marketing concepts. I want to start with a working automation flow,
then integrate MCPs one-by-one.

MY CURRENT STATE:
- Framework: [Playwright / Pytest / Jest / Other?]
- Team size: [Solo / Team of X]
- CI/CD: [GitHub Actions / Jenkins / Other?]
- Current pain points: [List specific problems - e.g., flaky test detection, manual locator updates]
- Test suite size: [Number of tests, complexity]

YOUR ROLE:
1. Help me prioritize which MCPs to implement first
2. Design a phased rollout plan (with timelines)
3. Identify which MCP solves my biggest pain point
4. Create implementation checklists
5. Review code/configs and suggest improvements
6. Identify risks and mitigation strategies
7. Measure impact before moving to next phase

CONSTRAINTS:
- Only integrate MCPs that save real time
- No over-engineering
- Phase-based approach (one MCP at a time)
- Must be reliable before scaling

DELIVERABLES I MIGHT ASK FOR:
- Phased implementation roadmap
- Code examples for specific MCPs
- Configuration files and setup scripts
- Architecture diagrams
- Integration checklists
- Risk assessment and mitigation
- ROI/impact analysis for each MCP
- Testing strategies for the MCPs themselves

HOW TO WORK WITH ME:
- Ask clarifying questions before making recommendations
- Explain trade-offs explicitly
- Suggest the simplest solution first
- Warn me about gotchas and pitfalls
- Always validate assumptions
```

---

## 🔄 Follow-Up Prompts (Use These As Needed)

### When Planning Your First MCP

```
Based on my situation [describe briefly], which single MCP should I implement first
to solve my biggest pain point?

Give me:
1. Why this MCP (concrete benefits)
2. Implementation timeline (realistic estimate)
3. Minimal setup (fastest path to value)
4. Success metrics (how I'll know it's working)
5. Gotchas to watch for
6. When to move to MCP #2
```

### When Setting Up an MCP

```
I'm integrating [MCP NAME] into my [framework] test suite.

Help me:
1. Design the implementation (architecture)
2. Write the configuration/setup code
3. Create the connection from Claude Code
4. Build a minimal working example
5. Set up error handling
6. Create a validation checklist

My setup: [describe your current test structure]
```

### When Detecting Issues

```
This MCP isn't working as expected. Here's what's happening:
[Describe the problem: error messages, unexpected behavior, flaky execution]

Diagnose:
1. Root cause
2. Is this a configuration issue or MCP limitation?
3. Workaround (if any)
4. Whether to proceed or pivot to different MCP
5. Questions to help me debug further
```

### When Measuring Impact

```
I've integrated [MCP NAME] for [use case]. Here's what changed:
[Describe current state: time savings, reliability, ease of use]

Help me:
1. Quantify the impact (hours saved per week)
2. Compare vs. manual approach
3. Determine if it's worth scaling
4. Identify what's working and what isn't
5. Suggest optimizations
6. Decide if we move to MCP #2 or improve this one first
```

### When Planning the Full Roadmap

```
Here's my full situation:
- Framework: [X]
- Pain points: [List]
- Team: [Size/skill level]
- Timeline: [Weeks available]
- CI/CD: [System]
- Current test coverage: [Brief description]

Build me a complete 8-week roadmap:
1. Phase 1 (Week 1-2): Which MCP? Why? Setup plan?
2. Phase 2 (Week 3-4): Next MCP? Integration with Phase 1?
3. Phase 3 (Week 5-6): Third MCP? Any dependencies?
4. Phase 4 (Week 7-8): Final additions or optimization?

For each phase, give:
- Specific MCP(s) to implement
- Realistic timeline
- Required resources
- Success metrics
- Go/No-Go decision criteria
- Risk mitigation
```

### When Building an Integration

```
I need to build an integration between [MCP A] and [MCP B].

Example scenario:
[Describe the workflow: e.g., "Git MCP detects code change →
File System MCP finds affected tests → Test Runner MCP executes them →
Browser MCP captures screenshots if they fail"]

Help me:
1. Architecture (how MCPs talk to each other)
2. Error handling (what if one MCP fails?)
3. Code structure
4. Configuration
5. Testing strategy for the integration
6. Rollout plan
```

### When Reviewing Architecture

```
Here's my proposed architecture for MCP integration:
[Describe your setup: how MCPs connect, data flow, etc.]

Review this and tell me:
1. Is this sound?
2. What's missing?
3. What could break?
4. Simpler alternative?
5. Scaling implications
6. Monitoring/observability gaps
```

---

## 💡 Smart Prompts for Specific Scenarios

### For Choosing Between MCPs

```
I have two options for solving [problem]:
1. Use [MCP A] because [reason]
2. Use [MCP B] because [reason]

Which should I pick and why?
Consider:
- Setup complexity
- Reliability
- Time to value
- Future-proofing
- Team capability
```

### For Troubleshooting

```
My MCP setup is failing. Help me diagnose:
1. Error: [paste exact error]
2. Setup: [describe your configuration]
3. Expected behavior: [what should happen]
4. Actual behavior: [what's actually happening]

Walk me through the debugging process.
```

### For Writing Tests for MCPs

```
I need to test my MCP integrations to make sure they're reliable.

Help me:
1. Design test strategy for MCPs
2. Write test cases for [specific MCP]
3. Handle async/timeout issues
4. Validate MCP output
5. Build a test harness

Framework: [Your test framework]
MCP being tested: [Which MCP]
```

### For Integration with Existing Tests

```
I have an existing [framework] test suite with [number] tests.

Show me how to integrate [MCP NAME] without:
- Breaking existing tests
- Large refactoring
- Training team on new patterns

Current test structure:
[Brief description of how tests are organized]
```

### For Performance & Optimization

```
My MCP integration works, but it's slow.

Current performance:
- [Metric 1]: [Current vs. target]
- [Metric 2]: [Current vs. target]

Help me optimize:
1. Bottleneck analysis
2. Caching strategies
3. Parallel execution
4. Resource optimization
5. Monitoring/observability
```

---

## 🚀 Special Prompts for Common SDET Tasks

### Auto-Update Tests After Code Changes

```
I want Git MCP + File System MCP to automatically update my tests
when code locators/selectors change.

Workflow:
1. PR comes in with UI changes
2. Git MCP detects the changes
3. File System MCP finds affected tests
4. Tests are auto-updated
5. Test Runner MCP validates updates
6. Report generated

Build this workflow:
- Architecture
- Code example
- Error handling
- Validation strategy
- Rollout approach
```

### Detect & Fix Flaky Tests

```
I want CI/Pipeline MCP to detect flaky tests automatically and suggest fixes.

Current setup:
- CI: [Your CI system]
- Test framework: [Framework]
- Flakiness threshold: [Define what's "flaky"]

Build a system:
1. CI MCP reads logs
2. Identifies flaky tests
3. Test Runner MCP reruns them
4. Analyzes patterns
5. Suggests fixes (retry logic, waits, etc.)
6. Auto-fixes common issues if safe

Walk me through the implementation.
```

### Parallel Test Execution with Docker

```
I want Docker MCP to spin up isolated test environments so I can
run tests in parallel without conflicts.

Current setup:
- Tests: [Number and complexity]
- CI: [System]
- Resources: [Rough availability]
- Database setup time: [Estimate]

Build me:
1. Docker compose configuration
2. Environment isolation strategy
3. Integration with test runner
4. Cleanup/resource management
5. Monitoring/health checks
6. Scaling approach
```

---

## 📋 Checklist Prompts

### Pre-Implementation Checklist

```
Before I implement [MCP NAME], review this checklist:

- [ ] Pain point clearly identified
- [ ] MCP is the right solution
- [ ] Team has prerequisites (knowledge, tools)
- [ ] Success metrics defined
- [ ] Rollback plan exists
- [ ] Timeline is realistic
- [ ] Resources allocated
- [ ] Dependencies are clear
- [ ] Monitoring/observability plan exists

Anything I'm missing?
```

### Post-Implementation Review

```
I've completed Phase [X]. Here's the summary:
- Metrics: [Before/after]
- Issues encountered: [List]
- Time spent: [Estimate vs. actual]
- Team feedback: [Summary]
- What went well: [List]
- What didn't: [List]

Help me:
1. Assess if this phase was successful
2. Identify improvements
3. Decide if we proceed to next phase
4. Plan for optimization
```

---

## 🎓 Learning Prompts

### When You're Stuck

```
I don't understand how [MCP NAME] works or how to use it.

Help me learn:
1. High-level explanation (ELI5)
2. How it fits in my testing workflow
3. Simple working example
4. Common use cases
5. Common mistakes
6. Where to dive deeper
```

### When Planning Training

```
My team needs to understand MCPs and how we're using them.

Build me:
1. Simple explanation (non-technical)
2. Architecture diagram
3. 3-5 concrete examples
4. Common questions and answers
5. Simple hands-on exercise
6. Documentation they can reference
```

---

## 🔧 Configuration & Code Prompts

### When Writing Configuration

```
Help me configure [MCP NAME] for my setup:

My environment:
- Framework: [X]
- CI/CD: [X]
- Current test structure: [Describe briefly]
- Special requirements: [Any constraints]

Generate:
1. Configuration file(s)
2. Environment variables needed
3. Setup script
4. Validation script
5. Documentation
```

### When Writing Integration Code

```
Write a minimal integration between [MCP A] and [MCP B].

Requirements:
- Trigger: [What starts the workflow]
- Steps: [Numbered workflow]
- Error handling: [What if something fails?]
- Output: [What should be returned]

Framework: [Your tech stack]
Constraints: [Any specific needs]

Provide:
1. Code (well-commented)
2. How to test it
3. Error scenarios to handle
4. Deployment approach
```

---

## 🎯 Usage Tips

1. **Start with context** — Always describe your situation briefly (framework, team, pain points)
2. **Be specific** — Don't say "help me with MCPs"; say "help me detect flaky tests with CI/Pipeline MCP"
3. **Ask for concrete outputs** — Diagrams, code, checklists, timelines
4. **Validate assumptions** — Let Claude ask clarifying questions
5. **Iterate** — Use follow-up prompts to dive deeper
6. **Test everything** — Don't assume MCPs work; validate with small examples first
7. **Measure impact** — Before moving forward, prove the MCP saves time/effort

---

## 📌 Quick Reference

Save these for quick access:

- **First implementation:** "Based on my situation, which MCP first?"
- **Stuck on setup:** "I'm integrating [MCP]. Here's my error: [error]. Diagnose?"
- **Measuring impact:** "I've implemented [MCP]. Here's my impact: [metrics]. Success?"
- **Planning next phase:** "Ready for phase 2. What's next and why?"
- **Team training:** "Help me explain MCPs to my team"
- **Architecture review:** "Review my MCP architecture: [describe]"

---

## ⚡ Remember

When using these prompts:

- **Don't over-automate** — If it takes 30 seconds manually, automation might not be worth it
- **One MCP at a time** — Integrate sequentially, not in parallel
- **Validate before scaling** — Prove it works with small examples first
- **Keep it simple** — Simple, reliable automation > complex, flaky automation
- **Measure everything** — Track time saved, reliability improvements, team adoption

Good luck! 🚀

```

---

## How to Use This

1. **Copy the main prompt** — Use it as your "system instruction" when working with Claude Code
2. **Reference follow-ups** — When you hit a specific scenario, use the corresponding follow-up prompt
3. **Customize** — Replace [brackets] with your actual setup details
4. **Iterate** — Use multiple prompts in sequence to drill deeper
5. **Save responses** — Keep Claude's outputs in your project for reference

The prompts are designed to:
- Get clear priorities
- Build realistic timelines
- Validate your approach
- Debug issues systematically
- Measure real impact
- Prevent over-engineering
```
