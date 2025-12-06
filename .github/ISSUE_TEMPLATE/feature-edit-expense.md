---
name: Feature - Edit Expense
about: Add ability to edit existing expenses
title: '[FEATURE] Add Edit Expense Functionality'
labels: ['feature', 'frontend', 'backend']
assignees: ''
---

## Description
**Found During:** Manual testing of PR #XX (Separate Graph and Table Pages)

Currently, users can only create and delete expenses. There is no way to edit an existing expense if they made a mistake or need to update information. Users must delete and recreate the expense.

## User Story
**As a user,**
- I want to edit an existing expense
- So that I can fix mistakes or update information without deleting and recreating

**Example Scenarios:**
- User entered wrong amount → Edit to correct amount
- User selected wrong category → Change category
- User made typo in description → Fix description
- User entered wrong date → Update date

## Proposed Functionality

### UI/UX
**Edit Trigger:**
- Edit button/icon on each expense row in table
- Edit button/icon on expense cards (if card view exists)
- Double-click on expense row (optional)
- Keyboard shortcut (optional)

**Edit Interface Options:**

**Option 1: Inline Editing**
- Click edit button → Row becomes editable
- Fields become input fields
- Save/Cancel buttons appear
- Click save → Update expense
- Click cancel → Revert changes

**Option 2: Edit Modal/Dialog** (RECOMMENDED)
- Click edit button → Modal opens
- Modal shows expense form with current values pre-filled
- User modifies fields
- Click "Save Changes" → Update expense
- Click "Cancel" or close modal → No changes

**Option 3: Navigate to Edit Page**
- Click edit → Navigate to `/expenses/:id/edit`
- Full page form with current values
- Save/Cancel buttons
- After save → Redirect back to table/list

**Recommendation:** Option 2 (Edit Modal) - Consistent with delete confirmation dialog, keeps user in context, reuses form component from "Add Expense"

### Edit Form Fields
- **Description** (text input, required)
- **Amount** (number input, required, positive)
- **Date** (date picker, required)
- **Category** (dropdown, optional or required based on requirements)

### Validation
- All validations from "Add Expense" apply
- Description: Not empty, max length
- Amount: Positive number, reasonable max value
- Date: Valid date, not in future (or allow future dates?)
- Show validation errors inline

### Confirmation
**Option 1:** No confirmation (direct save)
**Option 2:** Show summary of changes before saving
**Option 3:** "Unsaved changes" warning if user tries to close modal

**Recommendation:** Option 1 for simplicity, with "Undo" feature (future enhancement)

## Acceptance Criteria

### Functionality
- [ ] User can initiate edit from expenses table
- [ ] Edit interface opens with current expense values pre-filled
- [ ] User can modify description, amount, date, category
- [ ] User can save changes
- [ ] User can cancel without saving
- [ ] Changes persist to database
- [ ] Table updates immediately after save (optimistic update or refetch)
- [ ] Graph updates if expense changes affect graph data
- [ ] Success message shown after save
- [ ] Error message shown if save fails

### Validation
- [ ] All fields validated (same rules as add expense)
- [ ] Validation errors shown inline
- [ ] Save button disabled if validation fails
- [ ] User cannot save invalid data

### Edge Cases
- [ ] Editing an expense that was deleted by another user → Graceful error
- [ ] Editing while offline → Error message or queue for sync
- [ ] Editing very old expense (archived?) → Works or shows appropriate message
- [ ] Concurrent edits by multiple users → Last write wins (or conflict detection)

### UX/UI
- [ ] Edit button clearly visible and labeled
- [ ] Edit interface consistent with add expense
- [ ] Modal is responsive (mobile-friendly)
- [ ] Focus management (focus on first field when modal opens)
- [ ] ESC key closes modal (with unsaved changes warning?)
- [ ] Click outside modal closes it (with unsaved changes warning?)

### Accessibility
- [ ] Edit button has proper ARIA label
- [ ] Modal has proper ARIA role and labels
- [ ] Keyboard navigation works (Tab, Enter, ESC)
- [ ] Screen reader announces modal open/close
- [ ] Focus trapped in modal while open

### Testing
- [ ] Unit tests for edit logic
- [ ] Unit tests for validation
- [ ] Integration tests for API endpoint
- [ ] E2E test: Edit expense successfully
- [ ] E2E test: Edit expense and cancel
- [ ] E2E test: Edit with validation errors
- [ ] E2E test: Edit updates table and graph
- [ ] E2E test: Edit with network error

## Technical Implementation

### Frontend Changes

**Components:**
```
EditExpenseModal.tsx (new)
  ├── Uses ExpenseForm.tsx (shared with AddExpense)
  ├── Handles pre-filling values
  └── Handles update vs. create

ExpenseTable.tsx (modify)
  ├── Add edit button to each row
  └── Open EditExpenseModal on click
```

**API Call:**
```typescript
// Update expense
PUT /api/expenses/:id
Body: {
  description: string,
  amount: number,
  date: string,
  category: string
}

Response: Updated expense object
```

### Backend Changes

**API Endpoint:**
```javascript
// services/api-service/src/routes/expenses.ts

router.put('/:id', async (req, res) => {
  // Validate user owns this expense
  // Validate input data
  // Update expense in database
  // Return updated expense
});
```

**Database:**
- Add `updated_at` timestamp (optional but recommended)
- Track edit history (optional future feature)

### Files to Create/Modify
- `app/frontend/src/components/EditExpenseModal.tsx` (new)
- `app/frontend/src/components/ExpenseTable.tsx` (add edit button)
- `app/frontend/src/hooks/useExpenseUpdate.ts` (new hook for update logic)
- `services/api-service/src/routes/expenses.ts` (add PUT endpoint)
- `tests/e2e/edit-expense.spec.ts` (new E2E tests)
- `tests/integration/api/expenses.test.ts` (update tests)

### Security Considerations
- [ ] Verify user owns the expense being edited (authorization)
- [ ] Validate all input on backend (don't trust frontend validation)
- [ ] Prevent SQL injection (use parameterized queries)
- [ ] Rate limit updates (prevent spam)

## Test Scenarios

### Happy Path
1. User clicks edit on expense
2. Modal opens with current values
3. User changes description from "Lunch" to "Dinner"
4. User clicks "Save Changes"
5. Modal closes
6. Table shows updated description
7. Success toast appears

### Edge Cases
1. **Cancel without changes**: Open edit modal, don't change anything, cancel → No API call
2. **Cancel with changes**: Open edit modal, change values, cancel → Confirm discard changes?
3. **Validation errors**: Enter invalid data, try to save → Validation errors shown, save blocked
4. **Network error**: Try to save while offline → Error message shown
5. **Expense deleted**: Try to edit expense that was just deleted → "Expense not found" error
6. **Amount change affects total**: Edit amount → Graph totals update correctly

### Negative Tests
1. Try to edit expense belonging to different user → 403 Forbidden
2. Try to edit with invalid ID → 404 Not Found
3. Try to edit with missing fields → 400 Bad Request
4. Try to edit with XSS in description → Input sanitized

## UI Mockup / Design

**Edit Button in Table:**
```
| Date       | Description | Amount | Category | Actions        |
|------------|-------------|--------|----------|----------------|
| 2024-01-15 | Coffee      | $5.00  | Food     | [Edit] [Delete]|
```

**Edit Modal:**
```
┌─────────────────────────────────────┐
│  Edit Expense                     × │
├─────────────────────────────────────┤
│                                     │
│  Description                        │
│  [Coffee shop meeting          ]    │
│                                     │
│  Amount                             │
│  [5.00                         ]    │
│                                     │
│  Date                               │
│  [01/15/2024                   ]    │
│                                     │
│  Category                           │
│  [Food                    ▼]        │
│                                     │
│         [Cancel]  [Save Changes]    │
└─────────────────────────────────────┘
```

## Priority
**Medium-High** - Common user need, improves UX significantly

## Dependencies
- May need to create shared ExpenseForm component (if not exists)
- May need to implement Edit API endpoint (if not exists)
- Consider confirmation dialog pattern (Issue #XX - Delete confirmation)

## Future Enhancements
- Undo edit (restore previous value)
- Edit history / audit log (see who edited what when)
- Bulk edit (edit multiple expenses at once)
- Duplicate expense (create new based on existing)
- Inline editing (edit directly in table without modal)

## Related Issues
- Issue #XX - Add/Edit Expense in Dialog (combines this with add expense)
- Issue #XX - Delete Confirmation Dialog (similar modal pattern)
