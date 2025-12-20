# data-testid Quick Reference

## Quick Lookup Guide

This is a condensed reference for developers implementing data-testid attributes. For detailed explanations, see [DATA_TESTID_CONVENTION.md](./DATA_TESTID_CONVENTION.md).

## General Rules

```
Format: [component]-[element]-[type]
Case: kebab-case (all lowercase, hyphen-separated)
Example: expense-form-amount-input
```

## Quick Reference by Component

### Login (`Login.tsx`)

```html
<form data-testid="login-form">
  <input data-testid="login-email-input" type="email" />
  <input data-testid="login-password-input" type="password" />
  <input data-testid="login-name-input" type="text" />
  <button data-testid="login-submit-button" type="submit" />
  <button data-testid="login-toggle-mode-button" type="button" />
  <button data-testid="login-google-button" />
  <div data-testid="login-error-message" />
</form>
```

### Navigation (`Navigation.tsx`)

```html
<NavLink data-testid="nav-dashboard-link" />
<NavLink data-testid="nav-analytics-link" />
<NavLink data-testid="nav-expenses-link" />
<Link data-testid="nav-add-expense-button" />
<img data-testid="nav-user-avatar" />
<span data-testid="nav-user-name" />
<button data-testid="nav-logout-button" />
<div data-testid="nav-language-switcher" />
```

### Dashboard Home (`DashboardHome.tsx`)

```html
<div data-testid="dashboard-total-amount" />
<div data-testid="dashboard-expense-count" />
<div data-testid="dashboard-category-count" />
<Link data-testid="dashboard-analytics-link" />
<Link data-testid="dashboard-expenses-link" />
```

### Expense Form (`ExpenseForm.tsx`)

```html
<form data-testid="expense-form">
  <select data-testid="expense-form-category-select" />
  <select data-testid="expense-form-subcategory-select" />
  <input data-testid="expense-form-amount-input" type="number" />
  <select data-testid="expense-form-currency-select" />
  <input data-testid="expense-form-date-input" type="date" />
  <select data-testid="expense-form-payment-method-select" />
  <textarea data-testid="expense-form-description-input" />
  <button data-testid="expense-form-submit-button" type="submit" />
</form>
```

### Expense List (`ExpenseList.tsx`)

```html
<table data-testid="expense-list-table">
  <thead>
    <th data-testid="expense-list-header-date" />
    <th data-testid="expense-list-header-category" />
    <th data-testid="expense-list-header-description" />
    <th data-testid="expense-list-header-amount" />
    <th data-testid="expense-list-header-payment-method" />
  </thead>
  <tbody>
    <tr data-testid={`expense-list-item-${expense.id}`}>
      <button data-testid={`expense-list-edit-button-${expense.id}`} />
      <button data-testid={`expense-list-delete-button-${expense.id}`} />
    </tr>
  </tbody>
</table>
<div data-testid="expense-list-loading" />
<div data-testid="expense-list-empty-state" />
```

### Expense Dialog (`ExpenseDialog.tsx`)

```html
<div data-testid="expense-dialog-overlay">
  <div data-testid="expense-dialog-content">
    <h3 data-testid="expense-dialog-title" />
    <button data-testid="expense-dialog-close-button" />
    <form>
      <select data-testid="expense-dialog-category-select" />
      <select data-testid="expense-dialog-subcategory-select" />
      <input data-testid="expense-dialog-amount-input" />
      <select data-testid="expense-dialog-currency-select" />
      <input data-testid="expense-dialog-date-input" type="date" />
      <select data-testid="expense-dialog-payment-method-select" />
      <textarea data-testid="expense-dialog-description-input" />
      <button data-testid="expense-dialog-cancel-button" />
      <button data-testid="expense-dialog-save-button" type="submit" />
    </form>
  </div>
</div>
```

### Expenses Page (`ExpensesPage.tsx`)

```html
<div data-testid="expenses-page">
  <h2 data-testid="expenses-page-title" />
  <p data-testid="expenses-page-description" />
  <Link data-testid="expenses-page-analytics-link" />
</div>
```

### Analytics Page (`AnalyticsPage.tsx`)

```html
<div data-testid="analytics-page">
  <h2 data-testid="analytics-page-title" />
  <p data-testid="analytics-page-description" />
  <Link data-testid="analytics-page-expenses-link" />
</div>
```

### Expense Pie Chart (`ExpensePieChart.tsx`)

```html
<div data-testid="chart-container">
  <h3 data-testid="chart-title" />
  <Pie data-testid="chart-canvas" />
  <strong data-testid="chart-total-amount" />
  <span data-testid="chart-expense-count" />
  <div data-testid="chart-loading" />
  <div data-testid="chart-empty-state" />
</div>
```

### Confirmation Dialog (`ConfirmationDialog.tsx`)

```html
<div data-testid="confirm-dialog-overlay">
  <div data-testid="confirm-dialog-content">
    <h3 data-testid="confirm-dialog-title" />
    <p data-testid="confirm-dialog-message" />
    <button data-testid="confirm-dialog-close-button" />
    <button data-testid="confirm-dialog-cancel-button" />
    <button data-testid="confirm-dialog-confirm-button" />
  </div>
</div>
```

### Task Form (`TaskForm.tsx`)

```html
<form data-testid="task-form">
  <input data-testid="task-form-title-input" type="text" />
  <textarea data-testid="task-form-description-input" />
  <select data-testid="task-form-priority-select" />
  <select data-testid="task-form-status-select" />
  <input data-testid="task-form-due-date-input" type="date" />
  <button data-testid="task-form-submit-button" type="submit" />
</form>
```

### Task List (`TaskList.tsx`)

```html
<div data-testid={`task-list-item-${task.id}`}>
  <div data-testid={`task-list-title-${task.id}`} />
  <span data-testid={`task-list-status-${task.id}`} />
  <p data-testid={`task-list-description-${task.id}`} />
  <button data-testid={`task-list-update-status-button-${task.id}`} />
  <button data-testid={`task-list-delete-button-${task.id}`} />
</div>
<div data-testid="task-list-empty-state" />
<div data-testid="task-list-loading" />
```

### Language Switcher (`LanguageSwitcher.tsx`)

```html
<div data-testid="language-switcher">
  <button data-testid="language-english-button" />
  <button data-testid="language-hebrew-button" />
</div>
```

### Auth Callback (`AuthCallback.tsx`)

```html
<p data-testid="auth-callback-loading">Authenticating...</p>
```

## Common Patterns

### Dynamic IDs in Lists

```tsx
// For list items with IDs
{expenses.map(expense => (
  <tr key={expense.id} data-testid={`expense-list-item-${expense.id}`}>
    <button data-testid={`expense-list-edit-button-${expense.id}`}>Edit</button>
    <button data-testid={`expense-list-delete-button-${expense.id}`}>Delete</button>
  </tr>
))}
```

### Conditional Elements

```tsx
// Loading state
{loading && <div data-testid="expense-list-loading">Loading...</div>}

// Empty state
{items.length === 0 && (
  <div data-testid="expense-list-empty-state">No items found</div>
)}

// Error message
{error && <div data-testid="login-error-message">{error}</div>}
```

### Modal/Dialog Pattern

```tsx
{isOpen && (
  <div data-testid="expense-dialog-overlay" onClick={onClose}>
    <div data-testid="expense-dialog-content" onClick={e => e.stopPropagation()}>
      <h3 data-testid="expense-dialog-title">Title</h3>
      <button data-testid="expense-dialog-close-button">X</button>
      {/* Form content */}
      <button data-testid="expense-dialog-cancel-button">Cancel</button>
      <button data-testid="expense-dialog-save-button">Save</button>
    </div>
  </div>
)}
```

## Testing Examples

### Playwright Test Selectors

```typescript
// Finding elements
await page.locator('[data-testid="login-email-input"]').fill('user@example.com');
await page.locator('[data-testid="login-submit-button"]').click();

// With dynamic IDs
await page.locator(`[data-testid="expense-list-item-${expenseId}"]`).click();
await page.locator(`[data-testid="expense-list-edit-button-${expenseId}"]`).click();

// Assertions
await expect(page.locator('[data-testid="login-error-message"]')).toBeVisible();
await expect(page.locator('[data-testid="expense-list-item"]')).toHaveCount(5);
```

### React Testing Library

```typescript
import { render, screen } from '@testing-library/react';

// Finding elements
const emailInput = screen.getByTestId('login-email-input');
const submitButton = screen.getByTestId('login-submit-button');

// With dynamic IDs
const expenseItem = screen.getByTestId(`expense-list-item-${expenseId}`);

// Assertions
expect(screen.getByTestId('login-error-message')).toBeInTheDocument();
expect(screen.queryByTestId('expense-list-loading')).not.toBeInTheDocument();
```

## Checklist for New Components

When creating a new component, add data-testid to:

- [ ] Form inputs (input, select, textarea)
- [ ] Buttons (submit, cancel, action buttons)
- [ ] Links (navigation, quick links)
- [ ] List items (with dynamic IDs)
- [ ] Modal/dialog elements (overlay, content, close button)
- [ ] Status indicators (loading, empty, error states)
- [ ] Headers/titles (page titles, section headers)

## Do's and Don'ts

### ✅ Do

- Use kebab-case: `expense-form-amount-input`
- Be descriptive: `login-submit-button` not `btn1`
- Include component context: `expense-dialog-save-button`
- Use dynamic IDs for list items: `expense-list-item-${id}`
- Add to interactive elements only

### ❌ Don't

- Use camelCase: `expenseFormAmountInput`
- Be too verbose: `expense-form-input-field-for-amount-in-usd`
- Add to purely presentational elements
- Use implementation details: `expense-form-input-0`
- Duplicate IDs across components without context

## Related Documents

- [DATA_TESTID_CONVENTION.md](./DATA_TESTID_CONVENTION.md) - Full convention documentation
- [COMPONENT_AUDIT_REPORT.md](./COMPONENT_AUDIT_REPORT.md) - Detailed component analysis
- [tests/e2e/](../../tests/e2e/) - E2E test examples

## Quick Links

- **Naming Pattern:** `[component]-[element]-[type]`
- **Case Style:** kebab-case
- **Dynamic IDs:** `${component}-${element}-${id}`
- **Total Components:** 15
- **Total Test IDs:** 120+

---

**Last Updated:** 2024-12-18  
**Version:** 1.0.0
