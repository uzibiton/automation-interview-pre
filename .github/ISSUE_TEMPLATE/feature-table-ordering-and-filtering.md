---
name: Feature - Table Ordering and Filtering
about: Add sorting and filtering capabilities to the expenses table
title: '[FEATURE] Add Ordering and Filtering to Expenses Table'
labels: ['feature', 'frontend', 'enhancement']
assignees: ''
---

## Description
**Found During:** Manual testing of PR #XX (Separate Graph and Table Pages)

The expenses table currently displays all expenses in insertion order (or database default order) with no way to sort or filter. For users with many expenses, this makes it difficult to:
- Find specific expenses
- Analyze expenses by category or date range
- View highest/lowest expenses
- Focus on recent vs. old expenses

## User Stories

**As a user,**
- I want to sort expenses by amount (highest to lowest or vice versa)
- I want to sort expenses by date (newest to oldest or vice versa)
- I want to sort expenses by description (alphabetically)
- I want to filter expenses by category
- I want to filter expenses by date range
- I want to search expenses by description
- So that I can quickly find and analyze my expense data

## Proposed Features

### 1. Table Sorting (Column Headers)

**Sortable Columns:**
- **Date** - Ascending (oldest first) / Descending (newest first)
- **Description** - Alphabetically A-Z / Z-A
- **Amount** - Lowest to highest / Highest to lowest
- **Category** - Alphabetically by category name

**UI Behavior:**
- Click column header to sort by that column
- First click: Ascending order (or default order)
- Second click: Descending order
- Third click: Return to default (unsorted)
- Visual indicator showing sort direction (↑ ↓ icons)
- Only one column sorted at a time (or consider multi-column sort)

**Default Sort:** Date descending (newest first)

### 2. Filtering

**Filter Controls:**
- **Date Range Filter**
  - Start date picker
  - End date picker
  - Quick filters: "Last 7 days", "Last 30 days", "This month", "This year"
  - Clear filter button

- **Category Filter**
  - Dropdown or multi-select with all categories
  - Show expense count per category
  - "All categories" option (default)
  - Clear filter button

- **Amount Range Filter** (Optional)
  - Min amount input
  - Max amount input
  - Clear filter button

- **Search/Text Filter**
  - Search input field
  - Filters by expense description
  - Case-insensitive
  - Clears with X button or ESC key

**Filter Behavior:**
- Filters apply in real-time (or with "Apply" button)
- Multiple filters combine with AND logic (all must match)
- Show count: "Showing X of Y expenses"
- "Clear All Filters" button when any filter active
- Filters persist during session (not across page refresh)

### 3. UI/UX Design

**Filter Panel Location Options:**
1. Above table (horizontal filters)
2. Sidebar (vertical filters)
3. Collapsible panel (hide when not needed)

**Responsive Design:**
- Desktop: All filters visible
- Tablet: Some filters in dropdown
- Mobile: Filters in slide-out panel or modal

**Visual Feedback:**
- Loading indicator while filtering large datasets
- Highlight active filters
- Show "No results" message if filters match nothing

## Acceptance Criteria

### Sorting
- [ ] User can click column header to sort table
- [ ] Visual indicator shows current sort column and direction
- [ ] Sort persists when filtering (sorted view remains sorted)
- [ ] Sort is applied to filtered results (sort after filter)
- [ ] Table updates immediately when sort changes
- [ ] Keyboard accessible (Enter key on column header)

### Filtering
- [ ] User can filter by date range
- [ ] User can filter by category
- [ ] User can search by description
- [ ] Filters combine correctly (AND logic)
- [ ] "Clear filters" restores full table
- [ ] Filter count shows "X of Y expenses"
- [ ] No results message when filters match nothing
- [ ] Filters are keyboard accessible

### Performance
- [ ] Filtering and sorting is fast (< 500ms) for up to 1000 expenses
- [ ] Loading indicator shown for operations > 500ms
- [ ] Consider pagination if performance degrades with large datasets

### Accessibility
- [ ] Sort controls have proper ARIA labels
- [ ] Filter inputs have proper labels
- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] Screen reader announces sort changes
- [ ] Focus management on filter panel open/close

### Testing
- [ ] Unit tests for sort logic
- [ ] Unit tests for filter logic
- [ ] E2E tests for sorting each column
- [ ] E2E tests for each filter type
- [ ] E2E tests for combined filters
- [ ] Test with empty results
- [ ] Test with large datasets (performance)

## Technical Implementation

### Frontend State Management
```typescript
interface TableState {
  sortBy: 'date' | 'description' | 'amount' | 'category' | null;
  sortDirection: 'asc' | 'desc' | null;
  filters: {
    dateRange: { start: Date | null; end: Date | null };
    categories: string[];
    searchText: string;
    amountRange: { min: number | null; max: number | null };
  };
}
```

### Sort/Filter Logic Location
**Option 1: Client-side** (for small datasets)
- Fetch all expenses from API
- Apply sort and filter in React component
- Fast for < 1000 expenses
- Simple implementation

**Option 2: Server-side** (for large datasets)
- API supports query parameters: `?sortBy=date&sortDir=desc&category=food&startDate=2024-01-01`
- Backend applies sort and filter in database query
- Scales to any number of expenses
- More complex implementation

**Recommendation:** Start with client-side, migrate to server-side if performance issues

### API Changes (if server-side)
```
GET /api/expenses?sortBy=date&sortDir=desc&category=food&startDate=2024-01-01&endDate=2024-12-31&search=coffee
```

### Files to Modify
- `app/frontend/src/components/ExpenseTable.tsx` - Add sort/filter UI
- `app/frontend/src/hooks/useExpenseFilters.ts` - Filter state management (new file)
- `app/frontend/src/utils/tableHelpers.ts` - Sort and filter logic (new file)
- `services/api-service/src/routes/expenses.ts` - API support (if server-side)
- `tests/e2e/expenses-table.spec.ts` - E2E tests

## Design Mockup / Reference
Similar to:
- Google Sheets (column sorting)
- Excel (filter dropdowns)
- Airtable (filter sidebar)
- Notion (database views)

## Test Scenarios

### Sorting
1. Click date column → Sort by date ascending
2. Click date column again → Sort by date descending
3. Click amount column → Sort by amount (date sort cleared)
4. Sort with filters active → Results sorted correctly

### Filtering
1. Select category "Food" → Only food expenses shown
2. Set date range "Last 30 days" → Only recent expenses shown
3. Search "coffee" → Only expenses with "coffee" in description shown
4. Combine: Category="Food" + Search="coffee" → Only food expenses with "coffee"
5. Clear all filters → Full table restored

### Edge Cases
1. Filter with no matching results → Show "No expenses found"
2. Sort empty table → No errors
3. Filter then paginate (if pagination added) → Correct results
4. Fast typing in search → Debounced filter updates

## Priority
**Medium** - Important for usability with larger datasets

## Dependencies
- May want to implement pagination first (if large datasets expected)
- May want to define requirements first (Issue #XX)

## Future Enhancements
- Save favorite filter combinations
- Export filtered results to CSV
- Multi-column sorting
- Advanced filters (contains, doesn't contain, is greater than, etc.)
- Filter by multiple categories (OR logic)
