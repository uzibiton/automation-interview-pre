# Data-TestID Naming Convention

## Overview

This document defines the standard naming convention for `data-testid` attributes used throughout the Expense Tracker application. Consistent test identifiers enable reliable automated testing and make it easier for QA engineers and developers to write and maintain tests.

## Naming Convention

### General Pattern

```
[component]-[element]-[action|type]
```

### Rules

1. **Use kebab-case**: All lowercase with hyphens between words
2. **Be descriptive**: Names should clearly indicate what the element represents
3. **Follow hierarchy**: Start with component/context, then element, then action/type
4. **Avoid implementation details**: Don't reference CSS classes, IDs, or framework-specific details
5. **Keep it concise**: Balance between descriptiveness and brevity

### Examples

```html
<!-- Good -->
<button data-testid="login-submit-button">Login</button>
<input data-testid="expense-amount-input" />
<div data-testid="expense-item">...</div>

<!-- Avoid -->
<button data-testid="btn1">Login</button>
<!-- Too vague -->
<input data-testid="input-field-for-expense-amount-currency-usd" />
<!-- Too verbose -->
<div data-testid="expenseListItemDiv">...</div>
<!-- Uses camelCase -->
```

## Component-Specific Conventions

### 1. Login Component

**Component Prefix:** `login-`

| Element               | data-testid                | Purpose                       |
| --------------------- | -------------------------- | ----------------------------- |
| Email input           | `login-email-input`        | Email address field           |
| Password input        | `login-password-input`     | Password field                |
| Name input (register) | `login-name-input`         | Name field for registration   |
| Submit button         | `login-submit-button`      | Submit login/register form    |
| Toggle mode button    | `login-toggle-mode-button` | Switch between login/register |
| Google login button   | `login-google-button`      | Google OAuth sign-in          |
| Error message         | `login-error-message`      | Display error messages        |
| Form container        | `login-form`               | Main form element             |

### 2. Navigation Component

**Component Prefix:** `nav-`

| Element            | data-testid              | Purpose                       |
| ------------------ | ------------------------ | ----------------------------- |
| Dashboard link     | `nav-dashboard-link`     | Navigate to dashboard         |
| Analytics link     | `nav-analytics-link`     | Navigate to analytics         |
| Expenses link      | `nav-expenses-link`      | Navigate to expenses          |
| Add expense button | `nav-add-expense-button` | Quick add expense (➕ button) |
| User avatar        | `nav-user-avatar`        | User profile picture          |
| User name          | `nav-user-name`          | Display user name             |
| Logout button      | `nav-logout-button`      | Logout action                 |
| Language switcher  | `nav-language-switcher`  | Language selection container  |

### 3. Dashboard Home Component

**Component Prefix:** `dashboard-`

| Element             | data-testid                | Purpose                       |
| ------------------- | -------------------------- | ----------------------------- |
| Total amount card   | `dashboard-total-amount`   | Monthly total expense amount  |
| Expense count card  | `dashboard-expense-count`  | Number of expenses this month |
| Category count card | `dashboard-category-count` | Number of categories used     |
| Analytics link      | `dashboard-analytics-link` | Quick link to analytics       |
| Expenses link       | `dashboard-expenses-link`  | Quick link to expenses        |

### 4. Expense Form Component

**Component Prefix:** `expense-form-`

| Element               | data-testid                          | Purpose                     |
| --------------------- | ------------------------------------ | --------------------------- |
| Category select       | `expense-form-category-select`       | Select expense category     |
| Sub-category select   | `expense-form-subcategory-select`    | Select expense sub-category |
| Amount input          | `expense-form-amount-input`          | Enter expense amount        |
| Currency select       | `expense-form-currency-select`       | Select currency             |
| Date input            | `expense-form-date-input`            | Select expense date         |
| Payment method select | `expense-form-payment-method-select` | Select payment method       |
| Description textarea  | `expense-form-description-input`     | Enter expense description   |
| Submit button         | `expense-form-submit-button`         | Save expense                |
| Form container        | `expense-form`                       | Main form element           |

### 5. Expense List Component

**Component Prefix:** `expense-list-`

| Element               | data-testid                          | Purpose                                 |
| --------------------- | ------------------------------------ | --------------------------------------- |
| Table                 | `expense-list-table`                 | Main expenses table                     |
| Table header          | `expense-list-header`                | Table header row                        |
| Date header           | `expense-list-header-date`           | Date column header (sortable)           |
| Category header       | `expense-list-header-category`       | Category column header (sortable)       |
| Description header    | `expense-list-header-description`    | Description column header (sortable)    |
| Amount header         | `expense-list-header-amount`         | Amount column header (sortable)         |
| Payment method header | `expense-list-header-payment-method` | Payment method column header (sortable) |
| Expense row           | `expense-list-item-{id}`             | Individual expense row (dynamic ID)     |
| Edit button           | `expense-list-edit-button-{id}`      | Edit specific expense                   |
| Delete button         | `expense-list-delete-button-{id}`    | Delete specific expense                 |
| Empty state           | `expense-list-empty-state`           | No expenses message                     |
| Loading state         | `expense-list-loading`               | Loading indicator                       |

### 6. Expense Dialog Component

**Component Prefix:** `expense-dialog-`

| Element               | data-testid                            | Purpose                     |
| --------------------- | -------------------------------------- | --------------------------- |
| Modal overlay         | `expense-dialog-overlay`               | Background overlay          |
| Modal content         | `expense-dialog-content`               | Dialog content container    |
| Title                 | `expense-dialog-title`                 | Dialog title                |
| Close button          | `expense-dialog-close-button`          | Close dialog (X button)     |
| Category select       | `expense-dialog-category-select`       | Select expense category     |
| Sub-category select   | `expense-dialog-subcategory-select`    | Select expense sub-category |
| Amount input          | `expense-dialog-amount-input`          | Enter expense amount        |
| Currency select       | `expense-dialog-currency-select`       | Select currency             |
| Date input            | `expense-dialog-date-input`            | Select expense date         |
| Payment method select | `expense-dialog-payment-method-select` | Select payment method       |
| Description textarea  | `expense-dialog-description-input`     | Enter expense description   |
| Cancel button         | `expense-dialog-cancel-button`         | Cancel and close dialog     |
| Save button           | `expense-dialog-save-button`           | Save expense                |

### 7. Expenses Page Component

**Component Prefix:** `expenses-page-`

| Element          | data-testid                    | Purpose               |
| ---------------- | ------------------------------ | --------------------- |
| Page container   | `expenses-page`                | Main page container   |
| Page title       | `expenses-page-title`          | Page heading          |
| Page description | `expenses-page-description`    | Page description text |
| Analytics link   | `expenses-page-analytics-link` | View analytics button |

### 8. Analytics Page Component

**Component Prefix:** `analytics-page-`

| Element            | data-testid                    | Purpose               |
| ------------------ | ------------------------------ | --------------------- |
| Page container     | `analytics-page`               | Main page container   |
| Page title         | `analytics-page-title`         | Page heading          |
| Page description   | `analytics-page-description`   | Page description text |
| View expenses link | `analytics-page-expenses-link` | View expenses button  |

### 9. Expense Pie Chart Component

**Component Prefix:** `chart-`

| Element         | data-testid           | Purpose                     |
| --------------- | --------------------- | --------------------------- |
| Chart container | `chart-container`     | Pie chart wrapper           |
| Chart title     | `chart-title`         | Chart heading               |
| Chart canvas    | `chart-canvas`        | Actual chart element        |
| Total amount    | `chart-total-amount`  | Total displayed below chart |
| Expense count   | `chart-expense-count` | Count displayed below chart |
| Empty state     | `chart-empty-state`   | No data message             |
| Loading state   | `chart-loading`       | Loading indicator           |

### 10. Confirmation Dialog Component

**Component Prefix:** `confirm-dialog-`

| Element        | data-testid                     | Purpose                   |
| -------------- | ------------------------------- | ------------------------- |
| Modal overlay  | `confirm-dialog-overlay`        | Background overlay        |
| Modal content  | `confirm-dialog-content`        | Dialog content container  |
| Title          | `confirm-dialog-title`          | Dialog title              |
| Message        | `confirm-dialog-message`        | Confirmation message text |
| Close button   | `confirm-dialog-close-button`   | Close dialog (X button)   |
| Cancel button  | `confirm-dialog-cancel-button`  | Cancel action             |
| Confirm button | `confirm-dialog-confirm-button` | Confirm action            |

### 11. Task Form Component

**Component Prefix:** `task-form-`

| Element              | data-testid                   | Purpose                |
| -------------------- | ----------------------------- | ---------------------- |
| Form container       | `task-form`                   | Main form element      |
| Title input          | `task-form-title-input`       | Task title field       |
| Description textarea | `task-form-description-input` | Task description field |
| Priority select      | `task-form-priority-select`   | Select task priority   |
| Status select        | `task-form-status-select`     | Select task status     |
| Due date input       | `task-form-due-date-input`    | Select due date        |
| Submit button        | `task-form-submit-button`     | Create task            |

### 12. Task List Component

**Component Prefix:** `task-list-`

| Element              | data-testid                           | Purpose                           |
| -------------------- | ------------------------------------- | --------------------------------- |
| Task container       | `task-list-item-{id}`                 | Individual task card (dynamic ID) |
| Task title           | `task-list-title-{id}`                | Task title text                   |
| Task status          | `task-list-status-{id}`               | Task status badge                 |
| Task description     | `task-list-description-{id}`          | Task description text             |
| Update status button | `task-list-update-status-button-{id}` | Start/Complete task               |
| Delete button        | `task-list-delete-button-{id}`        | Delete task                       |
| Empty state          | `task-list-empty-state`               | No tasks message                  |
| Loading state        | `task-list-loading`                   | Loading indicator                 |

### 13. Language Switcher Component

**Component Prefix:** `language-`

| Element        | data-testid               | Purpose                     |
| -------------- | ------------------------- | --------------------------- |
| Container      | `language-switcher`       | Language switcher container |
| English button | `language-english-button` | Switch to English           |
| Hebrew button  | `language-hebrew-button`  | Switch to Hebrew            |

### 14. Auth Callback Component

**Component Prefix:** `auth-callback-`

| Element         | data-testid             | Purpose                |
| --------------- | ----------------------- | ---------------------- |
| Loading message | `auth-callback-loading` | Authenticating message |

## Special Cases and Patterns

### Dynamic Content

For elements with dynamic IDs (lists, repeated items):

```html
<!-- Use the item ID in the testid -->
<div data-testid="expense-list-item-{expense.id}">
  <button data-testid="expense-list-edit-button-{expense.id}">Edit</button>
  <button data-testid="expense-list-delete-button-{expense.id}">Delete</button>
</div>
```

### Conditional Elements

Elements that appear conditionally should still follow the same naming pattern:

```html
<!-- Error messages -->
<div data-testid="login-error-message">Invalid credentials</div>

<!-- Loading states -->
<div data-testid="expense-list-loading">Loading...</div>

<!-- Empty states -->
<div data-testid="expense-list-empty-state">No expenses found</div>
```

### Form Fields

For form inputs, use the pattern: `[component]-[field-name]-[input|select|textarea]`

```html
<input data-testid="expense-form-amount-input" type="number" />
<select data-testid="expense-form-category-select">
  ...
</select>
<textarea data-testid="expense-form-description-input">...</textarea>
```

### Buttons

For buttons, use the pattern: `[component]-[action]-button`

```html
<button data-testid="expense-form-submit-button">Save</button>
<button data-testid="expense-dialog-cancel-button">Cancel</button>
<button data-testid="nav-logout-button">Logout</button>
```

### Links

For navigation links, use the pattern: `[component]-[destination]-link`

```html
<a data-testid="nav-dashboard-link">Dashboard</a>
<a data-testid="dashboard-analytics-link">View Analytics</a>
```

### Modal/Dialog Elements

For modals and dialogs:

```html
<div data-testid="expense-dialog-overlay">
  <div data-testid="expense-dialog-content">
    <h3 data-testid="expense-dialog-title">Edit Expense</h3>
    <button data-testid="expense-dialog-close-button">X</button>
    <!-- Form fields -->
    <button data-testid="expense-dialog-cancel-button">Cancel</button>
    <button data-testid="expense-dialog-save-button">Save</button>
  </div>
</div>
```

### Sortable Table Headers

For sortable columns, include the column name:

```html
<th data-testid="expense-list-header-date" onClick="{handleSort}">Date {sortIcon}</th>
```

## Implementation Guidelines

### When to Add data-testid

Add `data-testid` attributes to:

1. **Interactive elements**: Buttons, links, inputs, selects, textareas
2. **Navigation elements**: Nav links, menu items
3. **Form fields**: All input fields and their labels
4. **List items**: Items in dynamic lists (with dynamic IDs)
5. **Modal/dialog elements**: Overlays, content, close buttons
6. **Status indicators**: Loading states, error messages, empty states
7. **Data displays**: Key metrics, statistics, totals

### When NOT to Add data-testid

Avoid adding `data-testid` to:

1. **Pure presentational elements**: Divs used only for styling/layout
2. **Text content**: Plain text that doesn't represent a distinct UI element
3. **Icons**: Unless the icon is clickable and represents an action
4. **Decorative elements**: Elements that don't convey meaning or enable interaction

### Testing Best Practices

1. **Prefer data-testid over other selectors**: More stable than CSS classes or XPath
2. **Use exact matches**: `[data-testid="login-submit-button"]` not `[data-testid*="login"]`
3. **Avoid cascading selectors**: Query by data-testid directly when possible
4. **Test user flows**: Focus on how users interact with the application
5. **Keep tests maintainable**: Clear naming makes tests self-documenting

## Examples from Existing Tests

The E2E tests in `tests/e2e/expenses/create-expense.spec.ts` demonstrate expected usage:

```typescript
// Login flow
await page.fill('[data-testid="login-email-input"]', 'test@example.com');
await page.fill('[data-testid="login-password-input"]', 'TestPassword123');
await page.click('[data-testid="login-submit-button"]');

// Navigation
await page.click('[data-testid="nav-expenses-link"]');

// Creating an expense
await page.click('[data-testid="expense-form-add-button"]');
await page.fill('[data-testid="expense-form-amount-input"]', '100.50');
await page.selectOption('[data-testid="expense-form-category-select"]', 'food');
await page.click('[data-testid="expense-form-submit-button"]');

// Verifying results
await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
```

## Migration Plan

When adding data-testid attributes to existing components:

1. **Start with critical paths**: Login, navigation, expense creation
2. **Add incrementally**: One component at a time
3. **Test as you go**: Verify tests pass with new attributes
4. **Update tests**: Adjust test selectors to match implementation
5. **Document changes**: Update this document if patterns evolve

## References

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles/)
- [ARIA Attributes for Testing](https://www.w3.org/WAI/ARIA/apg/)

## Maintenance

This document should be updated when:

- New components are added to the application
- New patterns emerge that aren't covered here
- Naming conventions are refined based on team feedback
- Test requirements change

**Last Updated:** 2024-12-18
**Version:** 1.0.0
**Status:** ✅ Approved for Implementation
