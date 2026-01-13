---
agent: edit
---

<!--
description: Add data-testid attributes to UI components (scan existing or guide new)
type: action
-->

# Add data-testid Attributes

## Naming convention

- Use **kebab-case**: `login-button`, `user-email-input`
- Be descriptive: prefer `submit-form-button` over `btn1`
- Avoid generic names: no `div1`, `container`, `wrapper`

## Elements to target

Add `data-testid` to:

- buttons
- inputs, selects, textareas
- links with actions
- forms
- modals, dialogs
- cards, list items
- any interactive element

## Tables (full granularity)

| Element | Pattern | Example |
|---------|---------|---------|
| container | `{name}-table` | `users-table` |
| header cell | `{name}-table-header-{column}` | `users-table-header-email` |
| row | `{name}-table-row-{index}` | `users-table-row-0` |
| cell | `{name}-table-row-{index}-cell-{column}` | `users-table-row-0-cell-email` |

## Modes

### Scan & modify existing files

When user provides files or asks to scan:

1. Identify elements missing `data-testid`
2. Add appropriate testids following conventions
3. Preserve existing testids unless they violate conventions

### New component creation

When creating new components:

1. Include `data-testid` on all interactive elements from the start
2. Follow naming conventions
3. For dynamic lists/tables, use index-based patterns

## Rules

- Do not add testids to purely presentational elements (decorative icons, layout divs)
- Prefer semantic names derived from purpose, not implementation
- For mapped/dynamic elements, include index or unique identifier in testid
