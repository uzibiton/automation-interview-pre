# Data-TestID Examples - Real Component Implementations

This document provides concrete before/after examples showing how data-testid attributes should be implemented in actual components.

## Table of Contents

- [Login Component](#login-component)
- [Navigation Component](#navigation-component)
- [Expense Form Component](#expense-form-component)
- [Expense List Component](#expense-list-component)
- [Expense Dialog Component](#expense-dialog-component)
- [Confirmation Dialog Component](#confirmation-dialog-component)

---

## Login Component

### Before (No Test IDs)

```tsx
function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Expense Tracker</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
          <button type="button" onClick={() => setIsRegisterMode(!isRegisterMode)}>
            {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </form>
        <button onClick={handleGoogleLogin}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
```

### After (With Test IDs)

```tsx
function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Expense Tracker</h1>
        <form data-testid="login-form" onSubmit={handleSubmit}>
          <div>
            <input
              data-testid="login-email-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              data-testid="login-password-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div data-testid="login-error-message" className="error">
              {error}
            </div>
          )}
          <button
            data-testid="login-submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
          <button
            data-testid="login-toggle-mode-button"
            type="button"
            onClick={() => setIsRegisterMode(!isRegisterMode)}
          >
            {isRegisterMode ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </form>
        <button data-testid="login-google-button" onClick={handleGoogleLogin}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
```

### Corresponding Test

```typescript
test('User can login with valid credentials', async ({ page }) => {
  await page.goto('/login');
  
  // Fill login form
  await page.fill('[data-testid="login-email-input"]', 'user@example.com');
  await page.fill('[data-testid="login-password-input"]', 'password123');
  
  // Submit
  await page.click('[data-testid="login-submit-button"]');
  
  // Verify success
  await expect(page).toHaveURL('/dashboard');
});

test('Login shows error for invalid credentials', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('[data-testid="login-email-input"]', 'invalid@example.com');
  await page.fill('[data-testid="login-password-input"]', 'wrongpass');
  await page.click('[data-testid="login-submit-button"]');
  
  // Verify error message
  await expect(page.locator('[data-testid="login-error-message"]')).toBeVisible();
  await expect(page.locator('[data-testid="login-error-message"]')).toContainText('Login failed');
});
```

---

## Navigation Component

### Before (No Test IDs)

```tsx
function Navigation({ userName, userAvatar, onLogout }: NavigationProps) {
  return (
    <div className="header">
      <nav className="main-nav">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
        <NavLink to="/expenses">Expenses</NavLink>
      </nav>
      <div className="user-info">
        {userAvatar && <img src={userAvatar} alt={userName} />}
        <span>{userName}</span>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
```

### After (With Test IDs)

```tsx
function Navigation({ userName, userAvatar, onLogout }: NavigationProps) {
  return (
    <div className="header">
      <nav className="main-nav">
        <NavLink data-testid="nav-dashboard-link" to="/" end>
          Dashboard
        </NavLink>
        <NavLink data-testid="nav-analytics-link" to="/analytics">
          Analytics
        </NavLink>
        <NavLink data-testid="nav-expenses-link" to="/expenses">
          Expenses
        </NavLink>
      </nav>
      <div className="user-info">
        {userAvatar && (
          <img
            data-testid="nav-user-avatar"
            src={userAvatar}
            alt={userName}
          />
        )}
        <span data-testid="nav-user-name">{userName}</span>
        <button data-testid="nav-logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
```

### Corresponding Test

```typescript
test('User can navigate between pages', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Navigate to analytics
  await page.click('[data-testid="nav-analytics-link"]');
  await expect(page).toHaveURL('/analytics');
  
  // Navigate to expenses
  await page.click('[data-testid="nav-expenses-link"]');
  await expect(page).toHaveURL('/expenses');
  
  // Back to dashboard
  await page.click('[data-testid="nav-dashboard-link"]');
  await expect(page).toHaveURL('/dashboard');
});

test('User can logout', async ({ page }) => {
  await page.goto('/dashboard');
  
  await page.click('[data-testid="nav-logout-button"]');
  
  await expect(page).toHaveURL('/login');
});
```

---

## Expense Form Component

### Before (No Test IDs)

```tsx
function ExpenseForm({ token, onSuccess }: ExpenseFormProps) {
  return (
    <div className="form-container">
      <h3>Add New Expense</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
```

### After (With Test IDs)

```tsx
function ExpenseForm({ token, onSuccess }: ExpenseFormProps) {
  return (
    <div className="form-container">
      <h3>Add New Expense</h3>
      <form data-testid="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select
            data-testid="expense-form-category-select"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Amount</label>
          <input
            data-testid="expense-form-amount-input"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        
        <button
          data-testid="expense-form-submit-button"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}
```

### Corresponding Test

```typescript
test('User can create an expense', async ({ page }) => {
  await page.goto('/expenses');
  
  // Fill form
  await page.selectOption('[data-testid="expense-form-category-select"]', 'food');
  await page.fill('[data-testid="expense-form-amount-input"]', '25.50');
  
  // Submit
  await page.click('[data-testid="expense-form-submit-button"]');
  
  // Verify success (expense appears in list)
  await expect(page.locator('[data-testid="expense-list-table"]')).toContainText('25.50');
});
```

---

## Expense List Component

### Before (No Test IDs)

```tsx
function ExpenseList({ token, refreshKey, onUpdate }: ExpenseListProps) {
  return (
    <div>
      <h2>Expenses</h2>
      {loading ? (
        <div>Loading...</div>
      ) : expenses.length === 0 ? (
        <div>No expenses yet</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')}>Date</th>
              <th onClick={() => handleSort('category')}>Category</th>
              <th onClick={() => handleSort('amount')}>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{getCategoryName(expense.categoryId)}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(expense)}>Edit</button>
                  <button onClick={() => handleDeleteClick(expense.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

### After (With Test IDs)

```tsx
function ExpenseList({ token, refreshKey, onUpdate }: ExpenseListProps) {
  return (
    <div>
      <h2>Expenses</h2>
      {loading ? (
        <div data-testid="expense-list-loading">Loading...</div>
      ) : expenses.length === 0 ? (
        <div data-testid="expense-list-empty-state">No expenses yet</div>
      ) : (
        <table data-testid="expense-list-table" className="table">
          <thead>
            <tr>
              <th
                data-testid="expense-list-header-date"
                onClick={() => handleSort('date')}
              >
                Date
              </th>
              <th
                data-testid="expense-list-header-category"
                onClick={() => handleSort('category')}
              >
                Category
              </th>
              <th
                data-testid="expense-list-header-amount"
                onClick={() => handleSort('amount')}
              >
                Amount
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                data-testid={`expense-list-item-${expense.id}`}
              >
                <td>{new Date(expense.date).toLocaleDateString()}</td>
                <td>{getCategoryName(expense.categoryId)}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>
                  <button
                    data-testid={`expense-list-edit-button-${expense.id}`}
                    onClick={() => handleEdit(expense)}
                  >
                    Edit
                  </button>
                  <button
                    data-testid={`expense-list-delete-button-${expense.id}`}
                    onClick={() => handleDeleteClick(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

### Corresponding Test

```typescript
test('User can sort expenses by date', async ({ page }) => {
  await page.goto('/expenses');
  
  // Click date header to sort
  await page.click('[data-testid="expense-list-header-date"]');
  
  // Verify sort order changed
  const firstExpense = page.locator('[data-testid^="expense-list-item-"]').first();
  await expect(firstExpense).toBeVisible();
});

test('User can delete an expense', async ({ page }) => {
  await page.goto('/expenses');
  
  // Get expense count
  const initialCount = await page.locator('[data-testid^="expense-list-item-"]').count();
  
  // Delete first expense
  const firstExpenseId = await page
    .locator('[data-testid^="expense-list-item-"]')
    .first()
    .getAttribute('data-testid');
  const expenseId = firstExpenseId?.replace('expense-list-item-', '');
  
  await page.click(`[data-testid="expense-list-delete-button-${expenseId}"]`);
  
  // Confirm deletion
  await page.click('[data-testid="confirm-dialog-confirm-button"]');
  
  // Verify count decreased
  await expect(page.locator('[data-testid^="expense-list-item-"]')).toHaveCount(initialCount - 1);
});
```

---

## Expense Dialog Component

### Before (No Test IDs)

```tsx
function ExpenseDialog({ isOpen, onClose, onSuccess, expense }: ExpenseDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}
```

### After (With Test IDs)

```tsx
function ExpenseDialog({ isOpen, onClose, onSuccess, expense }: ExpenseDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      data-testid="expense-dialog-overlay"
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        data-testid="expense-dialog-content"
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 data-testid="expense-dialog-title">
            {isEditMode ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          <button data-testid="expense-dialog-close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            data-testid="expense-dialog-amount-input"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <button
            data-testid="expense-dialog-cancel-button"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button data-testid="expense-dialog-save-button" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Corresponding Test

```typescript
test('User can edit an expense via dialog', async ({ page }) => {
  await page.goto('/expenses');
  
  // Click edit on first expense
  await page.click('[data-testid^="expense-list-edit-button-"]');
  
  // Wait for dialog
  await expect(page.locator('[data-testid="expense-dialog-overlay"]')).toBeVisible();
  await expect(page.locator('[data-testid="expense-dialog-title"]')).toContainText('Edit');
  
  // Update amount
  await page.fill('[data-testid="expense-dialog-amount-input"]', '99.99');
  
  // Save
  await page.click('[data-testid="expense-dialog-save-button"]');
  
  // Verify dialog closes
  await expect(page.locator('[data-testid="expense-dialog-overlay"]')).not.toBeVisible();
  
  // Verify update in list
  await expect(page.locator('[data-testid="expense-list-table"]')).toContainText('99.99');
});
```

---

## Confirmation Dialog Component

### Before (No Test IDs)

```tsx
function ConfirmationDialog({ isOpen, title, message, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onCancel}>✕</button>
        </div>
        <div className="confirmation-message">
          <p>{message}</p>
        </div>
        <div className="modal-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
```

### After (With Test IDs)

```tsx
function ConfirmationDialog({ isOpen, title, message, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div
      data-testid="confirm-dialog-overlay"
      className="modal-overlay"
      onClick={onCancel}
    >
      <div
        data-testid="confirm-dialog-content"
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 data-testid="confirm-dialog-title">{title}</h3>
          <button data-testid="confirm-dialog-close-button" onClick={onCancel}>
            ✕
          </button>
        </div>
        <div className="confirmation-message">
          <p data-testid="confirm-dialog-message">{message}</p>
        </div>
        <div className="modal-actions">
          <button data-testid="confirm-dialog-cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button data-testid="confirm-dialog-confirm-button" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Corresponding Test

```typescript
test('Confirmation dialog shows before deletion', async ({ page }) => {
  await page.goto('/expenses');
  
  // Click delete
  await page.click('[data-testid^="expense-list-delete-button-"]');
  
  // Verify confirmation dialog appears
  await expect(page.locator('[data-testid="confirm-dialog-overlay"]')).toBeVisible();
  await expect(page.locator('[data-testid="confirm-dialog-title"]')).toContainText('Delete');
  await expect(page.locator('[data-testid="confirm-dialog-message"]')).toBeVisible();
  
  // Can cancel
  await page.click('[data-testid="confirm-dialog-cancel-button"]');
  await expect(page.locator('[data-testid="confirm-dialog-overlay"]')).not.toBeVisible();
});
```

---

## Key Takeaways

### 1. Minimal Changes
- Only add `data-testid` attribute to existing elements
- No structural changes needed
- Preserves all existing functionality

### 2. Clear Pattern
- All testids follow `[component]-[element]-[type]` format
- Easy to predict what testid to use
- Consistent across all components

### 3. Dynamic IDs
- Use template literals for list items: `` data-testid={`expense-list-item-${id}`} ``
- Enables targeting specific items in tests
- Maintains uniqueness

### 4. Conditional Elements
- Add testids to loading states, error messages, empty states
- Makes testing different states possible
- Improves test reliability

### 5. Test Readability
- Testids make tests self-documenting
- Easy to understand what element is being tested
- Reduces need for comments in tests

---

**Document Version:** 1.0.0  
**Last Updated:** 2024-12-18  
**Status:** Ready for Implementation
