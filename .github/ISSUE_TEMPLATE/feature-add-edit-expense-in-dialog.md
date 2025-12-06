---
name: Feature - Add/Edit Expense in Dialog
about: Move add and edit expense forms into modal dialogs instead of separate pages
title: '[FEATURE] Add/Edit Expense in Modal Dialog Instead of Separate Page'
labels: ['feature', 'frontend', 'ux', 'enhancement']
assignees: ''
---

## Description
**Found During:** Manual testing of PR #XX (Separate Graph and Table Pages)

Currently, adding a new expense (and potentially editing) requires navigating to a separate page. This breaks the user's flow and requires multiple navigation steps. Modern web apps typically use modal dialogs for quick data entry, keeping users in context.

## User Story
**As a user,**
- I want to add/edit expenses without leaving the current page
- So that I can quickly enter data and continue working without disruption

**Current Flow (Add Expense):**
1. User viewing expenses table/graph
2. Clicks "Add Expense" button
3. Navigates to `/expenses/new` (separate page)
4. Fills form
5. Clicks save
6. Navigates back to table/graph

**Proposed Flow (Add Expense in Dialog):**
1. User viewing expenses table/graph
2. Clicks "Add Expense" button
3. Modal dialog opens (stays on same page)
4. Fills form in modal
5. Clicks save
6. Modal closes, table/graph updates immediately
7. User sees new expense instantly

## Benefits

**Better UX:**
- ✅ Faster - No page navigation
- ✅ Maintains context - User stays on table/graph page
- ✅ Visual feedback - See new expense added immediately
- ✅ Less clicking - Fewer steps to complete task
- ✅ Modern pattern - Consistent with industry standards

**Better Development:**
- ✅ Reusable component - Same dialog for add and edit
- ✅ Less routing - Fewer pages to maintain
- ✅ Optimistic updates - Can update UI before API response
- ✅ Better state management - No need to pass data between pages

## Proposed Implementation

### Add Expense Dialog

**Trigger:**
- "Add Expense" button in navigation/header
- "+" floating action button (FAB) on mobile
- Keyboard shortcut (e.g., Ctrl+N or Cmd+N)

**Dialog Content:**
```
┌─────────────────────────────────────┐
│  Add Expense                      × │
├─────────────────────────────────────┤
│                                     │
│  Description *                      │
│  [Enter description...         ]    │
│                                     │
│  Amount *                           │
│  [0.00                         ]    │
│                                     │
│  Date *                             │
│  [01/15/2024                   ]    │
│                                     │
│  Category                           │
│  [Select category          ▼]       │
│                                     │
│         [Cancel]  [Add Expense]     │
└─────────────────────────────────────┘
```

### Edit Expense Dialog

**Trigger:**
- Edit button on expense row
- Double-click expense row (optional)

**Dialog Content:**
- Same as Add Expense dialog
- Title: "Edit Expense"
- Fields pre-filled with current values
- Button: "Save Changes" instead of "Add Expense"

### Shared Dialog Component

Both add and edit use the same component with different props:

```typescript
<ExpenseDialog
  mode="add" | "edit"
  expense={existingExpense} // For edit mode
  onSave={handleSave}
  onCancel={handleCancel}
  open={isOpen}
/>
```

## Acceptance Criteria

### Add Expense
- [ ] "Add Expense" button opens modal dialog
- [ ] Dialog overlays current page (doesn't navigate away)
- [ ] Form fields: Description, Amount, Date, Category
- [ ] All validation works in dialog (same rules as current form)
- [ ] Click "Add Expense" → Creates expense, closes dialog, shows success message
- [ ] Click "Cancel" → Closes dialog without saving
- [ ] ESC key closes dialog
- [ ] Click outside dialog closes it (with unsaved changes warning?)
- [ ] After save, table/graph updates immediately with new expense
- [ ] Focus returns to "Add Expense" button after dialog closes

### Edit Expense
- [ ] Edit button opens modal dialog
- [ ] Dialog pre-filled with current expense values
- [ ] User can modify any field
- [ ] Click "Save Changes" → Updates expense, closes dialog, shows success message
- [ ] Click "Cancel" → Closes dialog without saving
- [ ] After save, table/graph updates immediately with edited expense

### Validation
- [ ] Required fields validated
- [ ] Validation errors shown inline in dialog
- [ ] Save button disabled if validation fails
- [ ] Amount must be positive number
- [ ] Description has max length
- [ ] Date must be valid date

### UX/UI
- [ ] Dialog is centered on screen
- [ ] Dialog has backdrop (darkened background)
- [ ] Dialog is responsive (mobile-friendly)
- [ ] Dialog scrolls if content too tall
- [ ] Form fields have clear labels
- [ ] Focus on first input when dialog opens
- [ ] Tab order makes sense
- [ ] Loading spinner shown during save

### Accessibility
- [ ] Dialog has role="dialog"
- [ ] Dialog has aria-labelledby (title)
- [ ] Focus trapped in dialog while open
- [ ] ESC key closes dialog
- [ ] Screen reader announces dialog open/close
- [ ] All form inputs have labels
- [ ] Keyboard navigation works (Tab, Enter, ESC)

### Error Handling
- [ ] Network error during save → Error message shown, dialog stays open
- [ ] Validation error → Error shown inline, dialog stays open
- [ ] Success → Success toast/message, dialog closes
- [ ] Unsaved changes warning when closing dialog (optional)

### Testing
- [ ] Unit tests for dialog component
- [ ] Unit tests for form validation
- [ ] E2E test: Add expense via dialog
- [ ] E2E test: Edit expense via dialog
- [ ] E2E test: Cancel without saving
- [ ] E2E test: Validation errors
- [ ] E2E test: Save with network error
- [ ] E2E test: ESC key closes dialog
- [ ] E2E test: Click outside closes dialog
- [ ] E2E test: Table updates after save

## Technical Implementation

### Component Structure

```
ExpenseDialog.tsx (new shared component)
  ├── Dialog/Modal wrapper (Material-UI, Headless UI, or custom)
  ├── ExpenseForm.tsx (form logic)
  │   ├── Form validation
  │   ├── Input fields
  │   └── Submit handler
  └── Dialog actions (Cancel/Save buttons)
```

### State Management

**Local State (Simple):**
```typescript
const [isDialogOpen, setIsDialogOpen] = useState(false);
const [mode, setMode] = useState<'add' | 'edit'>('add');
const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

// Open for add
const openAddDialog = () => {
  setMode('add');
  setEditingExpense(null);
  setIsDialogOpen(true);
};

// Open for edit
const openEditDialog = (expense: Expense) => {
  setMode('edit');
  setEditingExpense(expense);
  setIsDialogOpen(true);
};
```

**Global State (If using Redux/Context):**
- Store dialog state in global state
- Can be opened from anywhere in the app

### API Integration

**Add:**
```typescript
POST /api/expenses
Body: { description, amount, date, category }
Response: Created expense object
```

**Edit:**
```typescript
PUT /api/expenses/:id
Body: { description, amount, date, category }
Response: Updated expense object
```

**Optimistic Update:**
```typescript
// Add to UI immediately (optimistic)
addExpenseToTable(newExpense);

// Save to backend
try {
  const savedExpense = await api.createExpense(newExpense);
  updateExpenseInTable(savedExpense); // Update with real data
} catch (error) {
  removeExpenseFromTable(newExpense); // Rollback on error
  showError('Failed to save expense');
}
```

### Dialog Library Options

**Option 1: Material-UI Dialog**
```typescript
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
```

**Option 2: Headless UI Dialog**
```typescript
import { Dialog } from '@headlessui/react';
```

**Option 3: Custom Dialog**
- Use native HTML5 `<dialog>` element
- Or build with div + portal + backdrop

### Files to Create/Modify
- `app/frontend/src/components/ExpenseDialog.tsx` (new)
- `app/frontend/src/components/ExpenseForm.tsx` (new or refactor existing)
- `app/frontend/src/components/ExpenseTable.tsx` (add edit button, open dialog)
- `app/frontend/src/components/Header.tsx` (add expense button opens dialog)
- `app/frontend/src/hooks/useExpenseDialog.ts` (state management hook)
- `tests/e2e/expense-dialog.spec.ts` (new E2E tests)

### Migration Plan

**Phase 1:** Create dialog component
**Phase 2:** Implement add expense in dialog
**Phase 3:** Test add expense thoroughly
**Phase 4:** Implement edit expense in dialog
**Phase 5:** Test edit expense thoroughly
**Phase 6:** Remove old add expense page (if no longer needed)
**Phase 7:** Update all links/buttons to use new dialog

## Design Considerations

### Dialog Size
- **Desktop:** Medium width (500-600px)
- **Mobile:** Full screen or near full screen
- **Height:** Auto based on content, with max height + scroll

### Animation
- Fade in/out for backdrop
- Slide up or scale for dialog
- Smooth transitions (200-300ms)

### Mobile Considerations
- Full screen dialog on small screens
- Touch-friendly input sizes
- Virtual keyboard doesn't cover inputs
- Consider native date/number pickers on mobile

### Dark Mode
- Dialog respects user's theme preference
- Backdrop darkens appropriately for theme

## Test Scenarios

### Add Expense
1. Click "Add Expense" → Dialog opens
2. Fill form → Click "Add Expense" → Expense created, dialog closes, table updates
3. Open dialog → Click "Cancel" → Dialog closes, no expense created
4. Open dialog → Press ESC → Dialog closes, no expense created
5. Open dialog → Click backdrop → Dialog closes (or shows unsaved warning)
6. Enter invalid data → Save → Validation errors shown, dialog stays open

### Edit Expense
1. Click edit on expense → Dialog opens with values pre-filled
2. Change description → Save → Expense updated, dialog closes, table updates
3. Open dialog → Click "Cancel" → Dialog closes, no changes saved
4. Open dialog → Press ESC → Dialog closes, no changes saved

### Edge Cases
1. Open dialog → Submit while offline → Error shown, dialog stays open
2. Open add dialog → Open edit dialog (from elsewhere) → Previous dialog closes
3. Submit form → Close dialog during save → Waits for save to complete (or cancels)
4. Very long description → Dialog scrolls correctly
5. Multiple fields with validation errors → All errors shown

## Priority
**Medium** - Improves UX significantly, follows modern patterns

## Dependencies
- Requires Edit Expense functionality (Issue #XX)
- May require modal/dialog component library
- Should align with delete confirmation dialog (Issue #XX)

## Future Enhancements
- Keyboard shortcuts (Ctrl+N for new expense)
- Form auto-save (save draft to localStorage)
- Duplicate expense (create new from existing)
- Attach receipts/images to expenses
- Multi-step wizard for complex expenses
- Batch add (add multiple expenses quickly)

## Related Issues
- Issue #XX - Edit Expense (implement first)
- Issue #XX - Delete Confirmation Dialog (similar dialog pattern)
- Issue #XX - Define Requirements (what fields are required?)
