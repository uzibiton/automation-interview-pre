# AI Prompts Library

## Overview

This directory contains reusable AI prompt templates designed to accelerate development, testing, and documentation workflows in this QA/SDET showcase project. These prompts are optimized for use with GitHub Copilot and other AI assistants.

## Quick Start

🚀 **New!** Use the prompt catalog for easy access:

```
Simply say: "load [name]"
Example: "load reset" or "load planning for issue #123"
```

See **[PROMPT_CATALOG.md](PROMPT_CATALOG.md)** for the complete quick reference guide.

**📖 New to prompt engineering?** Start with [Prompt Engineering Guide](prompt-engineering-guide.md) to learn core principles, patterns, and best practices before diving into specific templates.

## Purpose

- **Consistency**: Standardize AI-assisted workflows across all project activities
- **Efficiency**: Reduce time spent crafting effective prompts from scratch
- **Quality**: Leverage proven prompt patterns that produce reliable results
- **Knowledge Sharing**: Document effective prompt strategies for team collaboration

## Integration with Agent Workflow

These prompts complement the guidelines in [WORKING_WITH_AGENTS.md](../dev/WORKING_WITH_AGENTS.md). Use them as starting points and customize based on specific needs.

## 📚 Prompt Catalog System

The **[Prompt Catalog](PROMPT_CATALOG.md)** provides a streamlined way to access prompts:

### How to Use

Just say: **`load [name]`**

**Examples:**

- `load reset` - Save context at end of session
- `load planning for issue #123` - Break down an issue into tasks
- `load docs for POST /api/expenses` - Generate API documentation
- `load test for expense component` - Create test cases

The AI will:

1. ✅ **Load the appropriate prompt** from this library
2. ✅ **Ask for missing info** if needed (interactive)
3. ✅ **Execute immediately** if you provide context
4. ✅ **Deliver results** in the expected format

**📖 Full Reference**: [PROMPT_CATALOG.md](PROMPT_CATALOG.md) - Complete catalog with all commands and examples

**🔧 For AI Assistants**: [PROMPT_LOADER.md](PROMPT_LOADER.md) - Implementation guide for handling load commands

## Prompt Categories

### 1. [Requirements Gathering](requirements-gathering.md)

Convert ideas into structured requirements following the REQ-### template format. Includes prompts for:

- User story generation
- Acceptance criteria expansion
- Requirements refinement
- Traceability matrix updates

### 2. [Task Planning & Breakdown](task-planning.md)

Break down ideas and epics into actionable tasks and phases. Includes prompts for:

- Idea → task decomposition
- Phase planning with estimates
- Risk assessment and mitigation
- Sprint planning and prioritization
- Research task structuring

### 3. [Test Generation](test-generation.md)

Create comprehensive test cases and automation scripts. Includes prompts for:

- E2E test scenario generation
- Edge case identification
- Test data creation
- Playwright test implementation
- API contract testing

### 4. [Code Review](code-review.md)

Systematic code quality analysis following PR workflow guidelines. Includes prompts for:

- Security review checklist
- Performance analysis
- Best practices validation
- Refactoring suggestions

### 5. [PR Fix](pr-fix.md)

Automatically address PR review feedback with interactive workflow. Includes prompts for:

- Fetching unresolved PR comments
- Applying code fixes locally
- Prioritizing P1/P2 issues
- Interactive test-or-commit workflow

### 6. [Documentation](documentation.md)

Generate consistent, high-quality documentation. Includes prompts for:

- README generation
- API documentation
- Inline code comments
- Architecture decision records

### 7. [Design Patterns](design-patterns.md)

Create high-level and detailed designs following HLD-### template format. Includes prompts for:

- System architecture design
- API endpoint specification
- Database schema design
- Component interaction diagrams

### 8. [Context Reset](context-reset.md)

Generate concise AI context summaries for session continuity. Includes prompts for:

- Project state documentation
- Decision tracking
- Work resumption
- AI agent context restoration

### 9. [Prompt Engineering Guide](prompt-engineering-guide.md) ⭐

**Start here if you're new to prompts!** Comprehensive guide covering:

- Core prompt engineering principles
- Prompt patterns by use case (code, tests, docs, debugging)
- Advanced techniques (chain-of-thought, few-shot learning)
- Validation methods and quality checklist
- Learning resources and best practices
- Action plan for improving project prompts

## Usage Guidelines

### Basic Workflow

1. **Select appropriate prompt**: Choose from the category that matches your task
2. **Customize context**: Replace placeholder values with project-specific details
3. **Iterate if needed**: Refine outputs by asking follow-up questions
4. **Document improvements**: Update prompts based on what works well

### Best Practices

✅ **DO:**

- Provide specific context (file paths, feature names, requirements IDs)
- Reference existing templates and conventions
- Request incremental changes for complex tasks
- Ask for explanations when needed
- Save effective prompt variations back to this library

❌ **DON'T:**

- Use generic prompts without project context
- Request multiple unrelated changes in one prompt
- Skip verification of AI-generated code
- Ignore project coding standards and conventions

### Example Usage

```markdown
**Task**: Create a test plan for the group management feature

**Prompt** (from test-generation.md):

> Create a test plan following the TEST-### template for the group management
> feature (REQ-002). Include functional tests for role-based permissions, security
> tests for authorization bypass attempts, and integration tests with the auth service.
> Follow the structure in docs/qa/test-plans/TEST_PLAN_TEMPLATE.md.

**Result**: Structured test plan document ready for review and execution
```

## Prompt Effectiveness Tracking

To improve prompt quality over time:

1. **Track success rate**: Note which prompts consistently produce good results
2. **Document modifications**: Keep effective variations in prompt comments
3. **Share learnings**: Update prompts based on team feedback
4. **Version control**: Treat prompts like code—commit improvements

## Related Resources

- [WORKING_WITH_AGENTS.md](../dev/WORKING_WITH_AGENTS.md) - Best practices for AI-assisted development
- [TRACEABILITY_MATRIX.md](../product/TRACEABILITY_MATRIX.md) - Document linking standards
- [PR_WORKFLOW_GUIDE.md](../qa/PR_WORKFLOW_GUIDE.md) - Code review process
- [TEST_STRATEGY.md](../qa/TEST_STRATEGY.md) - Testing approach overview

## Contributing New Prompts

When adding new prompts:

1. **Use clear structure**: Include context, task description, and expected output format
2. **Add examples**: Show sample inputs and outputs when helpful
3. **Reference templates**: Link to relevant project templates and conventions
4. **Test effectiveness**: Verify prompts produce quality results before adding
5. **Update this README**: Add new categories to the index above

## Testing-Specific Prompts

For prompts focused on test automation and MCP (Model Context Protocol) integration, see:

- `tests/mcp/prompts/` - Playwright MCP test generation prompts (when implemented)

---

**Last Updated**: December 20, 2025  
**Maintained By**: QA/SDET Team
