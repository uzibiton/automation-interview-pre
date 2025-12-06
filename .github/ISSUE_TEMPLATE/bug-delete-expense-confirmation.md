---
name: Bug - Delete Expense Missing Proper Confirmation
about: Replace alert with proper confirmation dialog showing expense details
title: '[BUG] Delete Expense Uses Alert Instead of Confirmation Dialog'
labels: ['bug', 'ux', 'frontend']
assignees: ''
---

## Description
**Found During:** Manual testing of PR #XX (Separate Graph and Table Pages)

Currently, deleting an expense uses a browser `alert()` which provides poor UX and doesn't show the user what they're about to delete.

## Current Behavior
1. User clicks delete button on an expense
2. Browser alert shows generic confirmation message
3. No details about the expense being deleted
4. User confirms or cancels

**Issue:** Alert is abrupt, doesn't show expense details, and uses native browser UI (inconsistent with app design)

## Expected Behavior
1. User clicks delete button on an expense
2. **Modal/Dialog appears** showing:
   - Expense details (description, amount, date, category)
   - Clear warning message: "Are you sure you want to delete this expense?"
   - Two buttons: "Cancel" and "Delete" (with destructive styling)
3. User can review the details before confirming
4. Clicking "Cancel" closes dialog, no action taken
5. Clicking "Delete" removes the expense and shows success message

## Why This Matters
- **Prevents accidental deletion** - Users can review what they're deleting
- **Better UX** - Consistent with modern web app patterns
- **Accessible** - Custom dialog can be made screen-reader friendly
- **Professional** - Browser alerts look unprofessional

## Acceptance Criteria
- [ ] Replace `alert()` with custom confirmation dialog/modal
- [ ] Dialog displays expense details:
  - Description
  - Amount (formatted with currency)
  - Date (formatted)
  - Category (if available)
- [ ] Dialog has two clear action buttons:
  - "Cancel" (secondary button) - closes dialog
  - "Delete" (destructive/red button) - deletes expense
- [ ] Clicking outside dialog or pressing ESC closes it (cancel action)
- [ ] After successful deletion:
  - Dialog closes
  - Success message/toast shown
  - Expense removed from list
  - Table/graph updates automatically
- [ ] Dialog is accessible (keyboard navigation, ARIA labels, focus management)
- [ ] Dialog is responsive (works on mobile)

## Technical Notes
- Consider using existing modal/dialog component if available
- If creating new dialog component, make it reusable for future confirmations
- Add `data-testid` attributes for E2E testing:
  - `data-testid="delete-confirmation-dialog"`
  - `data-testid="confirm-delete-button"`
  - `data-testid="cancel-delete-button"`

## Files Likely Affected
- `app/frontend/src/components/ExpenseTable.tsx` (or similar)
- `app/frontend/src/components/Dialog.tsx` (if creating new component)
- `app/frontend/src/services/expenseService.ts` (might need changes)

## Test Plan
**Manual Testing:**
1. Navigate to expenses table
2. Click delete on any expense
3. Verify dialog appears with correct expense details
4. Click "Cancel" → Dialog closes, expense not deleted
5. Click delete again, then click "Delete" → Expense deleted, success message shown
6. Test with different expense amounts, dates, descriptions
7. Test on mobile (touch interactions)
8. Test keyboard navigation (Tab, Enter, ESC)

**E2E Test Cases:**
1. Delete expense - cancel action
2. Delete expense - confirm action
3. Delete expense - ESC key closes dialog
4. Delete expense - click outside closes dialog
5. Verify expense removed from list after deletion
6. Verify expense removed from database

## Priority
**Medium** - UX improvement, prevents accidental deletions

## Screenshots/Examples
Similar pattern seen in:
- Gmail (delete email confirmation)
- Trello (delete card confirmation)
- GitHub (delete repository confirmation)

## Related Issues
- #XX - Add expense editing (will also need confirmation dialog)
