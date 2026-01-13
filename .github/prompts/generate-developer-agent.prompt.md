---
agent: edit
---

<!--
description: Scan codebase and generate a developer.agent.md with project conventions
type: action
-->

# Generate Developer Agent

Scan the current codebase and create a `developer.agent.md` file with discovered conventions.

## Steps

1. **Scan project structure**
   - Identify frameworks, libraries, languages
   - Note folder structure patterns
   - Find config files (tsconfig, eslint, prettier, etc.)

2. **Analyze code patterns**
   - Naming conventions (files, variables, components)
   - Import/export patterns
   - State management approach
   - API/data fetching patterns
   - Error handling patterns

3. **Generate agent file**
   - Output to: `.github/prompts/developer.agent.md`
   - Use structured template below

## Output template

```markdown
---
agent: developer
---

# Developer Agent — [Project Name]

## Tech stack

- [discovered frameworks, languages, tools]

## Project structure

- [key folders and their purpose]

## Naming conventions

- [files, components, variables]

## Code patterns

- [imports, exports, state, API calls]

## Linting & formatting

- [rules from config files]

## Rules (to be customized)

<!-- Add manual rules here after generation -->

- [ ] Always include data-testid on interactive elements
- [ ] No file-level eslint-disable
- [ ] [add more as needed]
```

## After generation

Inform user:

- File created at `.github/prompts/developer.agent.md`
- Review and add manual rules in the "Rules" section
- Reference `add-testids.prompt.md` for data-testid conventions
