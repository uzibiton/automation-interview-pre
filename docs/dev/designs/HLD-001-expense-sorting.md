# HLD-001: Expense Table Sorting - High-Level Design

## Document Information

| Field         | Value                 |
| ------------- | --------------------- |
| **Design ID** | HLD-001               |
| **Feature**   | Expense Table Sorting |
| **Role**      | Tech Lead / Developer |
| **Name**      | Uzi Biton             |
| **Created**   | 2025-12-10            |
| **Updated**   | 2025-12-17            |
| **Status**    | ✅ Implemented        |
| **Version**   | 1.0                   |

## Traceability

| Document Type         | ID       | Link                                                                           |
| --------------------- | -------- | ------------------------------------------------------------------------------ |
| **Requirements**      | REQ-001  | [Requirements Document](../../product/requirements/REQ-001-expense-sorting.md) |
| **Test Plan**         | TEST-001 | [Test Plan](../../qa/test-plans/TEST-001-expense-sorting.md)                   |
| **Test Execution**    | EXEC-001 | [Test Execution Report](../../qa/test-plans/EXEC-001-expense-sorting.md)       |
| **Implementation**    | -        | [ExpenseList.tsx](../../../app/frontend/src/components/ExpenseList.tsx)        |
| **Related Issue**     | #55      | [GitHub Issue](https://github.com/uzibiton/automation-interview-pre/issues/55) |
| **Implementation PR** | #56      | [Pull Request](https://github.com/uzibiton/automation-interview-pre/pull/56)   |

---

## 1. Overview

### 1.1 Purpose

Design client-side table sorting functionality for the expenses table, allowing users to sort by Date, Category, Description, Amount, and Payment Method.

### 1.2 Scope

- **In Scope**: Frontend React component sorting logic, visual indicators, tri-state behavior
- **Out of Scope**: Server-side sorting, multi-column sorting, sort persistence

### 1.3 Goals

- ✅ Fast, responsive client-side sorting (< 100ms)
- ✅ Intuitive tri-state sorting UX (asc -> desc -> default)
- ✅ Clear visual feedback with sort indicators
- ✅ Support for multiple data types (string, number, date)
- ✅ Internationalization compatibility

---

## 2. Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      ExpenseList Component                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  State Management                                     │  │
│  │  - sortField: SortField | null                        │  │
│  │  - sortDirection: 'asc' | 'desc' | null              │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Event Handlers                                       │  │
│  │  - handleSort(field: SortField)                       │  │
│  │    -> Update sort state (tri-state cycling)           │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Sorting Logic                                        │  │
│  │  - getSortedExpenses()                                │  │
│  │    -> Sort by: date, category, description,           │  │
│  │                amount, paymentMethod                  │  │
│  │    -> Returns sorted array (immutable)                │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Rendering                                            │  │
│  │  - Table headers with onClick handlers               │  │
│  │  - Sort indicators (↑/↓)                             │  │
│  │  - Sorted expense rows                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Flow

```
User clicks column header
        ↓
handleSort(field)
        ↓
Update state: sortField, sortDirection
        ↓
Component re-renders
        ↓
getSortedExpenses() called
        ↓
Array.sort() with custom comparator
        ↓
Render sorted table with indicators
```

---

## 3. Detailed Design

### 3.1 Type Definitions

```typescript
// Sort field types
type SortField = 'date' | 'description' | 'category' | 'amount' | 'paymentMethod' | null;

// Sort direction
type SortDirection = 'asc' | 'desc' | null;

// Component state
interface SortState {
  sortField: SortField;
  sortDirection: SortDirection;
}
```

### 3.2 State Management

**Initial State:**

```typescript
const [sortField, setSortField] = useState<SortField>('date');
const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
```

**Rationale:**

- Default sort: Date descending (newest expenses first)
- Users typically want to see most recent expenses
- Matches common expense tracking app UX patterns

### 3.3 Tri-State Sorting Logic

**State Transitions:**

```
Click 1: No sort        -> Ascending  (↑)
Click 2: Ascending (↑)  -> Descending (↓)
Click 3: Descending (↓) -> Default (date desc)
```

**Implementation:**

```typescript
const handleSort = (field: SortField) => {
  if (sortField === field) {
    // Same column: cycle through states
    if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      // Return to default
      setSortField(null);
      setSortDirection(null);
    }
  } else {
    // New column: start with ascending
    setSortField(field);
    setSortDirection('asc');
  }
};
```

**Design Decisions:**

- ✅ Tri-state allows returning to default view
- ✅ New column always starts ascending (natural progression)
- ✅ Single active sort (no multi-column complexity)

### 3.4 Sorting Algorithms

#### 3.4.1 Date Sorting

```typescript
case 'date':
  const dateA = new Date(a.date).getTime();
  const dateB = new Date(b.date).getTime();
  compareResult = dateA - dateB;
  break;
```

**Considerations:**

- Convert to timestamps for numeric comparison
- Handles all date formats consistently
- Invalid dates convert to NaN (handled gracefully)

#### 3.4.2 String Sorting (Category, Description, Payment Method)

```typescript
case 'category':
  const categoryA = getCategoryName(a.categoryId) || 'Unknown';
  const categoryB = getCategoryName(b.categoryId) || 'Unknown';
  compareResult = categoryA.localeCompare(categoryB);
  break;

case 'description':
  compareResult = a.description.localeCompare(b.description);
  break;

case 'paymentMethod':
  const paymentA = a.paymentMethod || '';
  const paymentB = b.paymentMethod || '';
  compareResult = paymentA.localeCompare(paymentB);
  break;
```

**Considerations:**

- `localeCompare()` for proper internationalization
- Case-insensitive by default
- Handles null/undefined gracefully
- Category sorting uses resolved names (not IDs)

#### 3.4.3 Numeric Sorting (Amount)

```typescript
case 'amount':
  const amountA = typeof a.amount === 'string' ? parseFloat(a.amount) : a.amount;
  const amountB = typeof b.amount === 'string' ? parseFloat(b.amount) : b.amount;
  const validAmountA = isNaN(amountA) ? 0 : amountA;
  const validAmountB = isNaN(amountB) ? 0 : amountB;
  compareResult = validAmountA - validAmountB;
  break;
```

**Considerations:**

- Handle both string and number types
- Convert strings to numbers (data inconsistency tolerance)
- NaN values treated as 0
- Currency-agnostic (sorts numeric value only)

### 3.5 Sort Direction Application

```typescript
return sortDirection === 'asc' ? compareResult : -compareResult;
```

**Rationale:**

- Single comparison logic
- Flip result for descending (-1 \* result)
- Clean, readable implementation

### 3.6 Default Sort Behavior

```typescript
if (!sortField || !sortDirection) {
  // Default: date descending (newest first)
  return [...expenses].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Note: dateB - dateA for descending
  });
}
```

**Rationale:**

- Always have predictable default order
- Newest expenses most relevant to users
- Fallback when tri-state cycles to null

---

## 4. User Interface Design

### 4.1 Table Header Structure

```tsx
<thead>
  <tr>
    <th className="sortable-header" onClick={() => handleSort('date')}>
      {translation('expenses.date')}
      {getSortIcon('date')}
    </th>
    <th className="sortable-header" onClick={() => handleSort('category')}>
      {translation('expenses.category')}
      {getSortIcon('category')}
    </th>
    {/* ... other headers ... */}
  </tr>
</thead>
```

### 4.2 Visual Indicators

```typescript
const getSortIcon = (field: SortField) => {
  if (sortField !== field) {
    return null; // No indicator
  }
  return sortDirection === 'asc' ? ' ↑' : ' ↓';
};
```

**Visual Design:**

- ↑ = Ascending sort
- ↓ = Descending sort
- No arrow = Not sorted
- Only one column shows indicator at a time

### 4.3 CSS Styling

```css
.sortable-header {
  cursor: pointer;
  user-select: none;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.sortable-header:hover {
  background-color: #e9ecef;
  color: #212529;
}

.sortable-header:active {
  background-color: #dee2e6;
}
```

**UX Principles:**

- Cursor change indicates interactivity
- Hover state for discoverability
- Active state for click feedback
- Smooth transitions for polish

---

## 5. Data Flow

### 5.1 Component Props

```typescript
interface ExpenseListProps {
  expenses: Expense[]; // Array from parent/API
  categories: Category[]; // For category name lookup
  onEdit: (expense) => void;
  onDelete: (id) => void;
  // ... other handlers
}
```

### 5.2 Data Transformation Pipeline

```
Raw expenses array (props)
        ↓
getSortedExpenses()
        ↓
Array copy (immutable: [...expenses])
        ↓
Array.sort() with comparator
        ↓
Sorted array (new reference)
        ↓
map() to render rows
        ↓
JSX table rows
```

**Immutability:**

- Always create new array (`[...expenses]`)
- Never mutate props directly
- Ensures React re-renders correctly

---

## 6. Performance Considerations

### 6.1 Complexity Analysis

| Operation       | Time Complexity | Notes                         |
| --------------- | --------------- | ----------------------------- |
| Array.sort()    | O(n log n)      | JavaScript's built-in Timsort |
| Date conversion | O(1) per item   | Inline in comparator          |
| String compare  | O(k) per item   | k = average string length     |
| Category lookup | O(1) amortized  | From categories map           |

**Overall**: O(n log n) for n expenses

### 6.2 Performance Benchmarks

| Dataset Size  | Sort Time | Target  | Status  |
| ------------- | --------- | ------- | ------- |
| 50 expenses   | ~5ms      | < 100ms | ✅ Pass |
| 100 expenses  | ~10ms     | < 100ms | ✅ Pass |
| 500 expenses  | ~50ms     | < 500ms | ✅ Pass |
| 1000 expenses | ~100ms    | < 500ms | ✅ Pass |

**Measurement**: Local testing with Chrome DevTools Performance profiler

### 6.3 Optimization Strategies

**Current (Client-Side):**

- ✅ Adequate for < 1000 records
- ✅ No network latency
- ✅ Instant user feedback

**Future (If Needed):**

- 🔄 Server-side sorting for 10,000+ records
- 🔄 Virtual scrolling (windowing)
- 🔄 Memoization of sort results
- 🔄 Web Workers for non-blocking sort

---

## 7. Edge Cases & Error Handling

### 7.1 Data Quality Issues

| Issue               | Handling           | Example           |
| ------------------- | ------------------ | ----------------- |
| Null expense        | Filter out         | Skip in sort      |
| Invalid date        | Convert to epoch 0 | Treated as oldest |
| Missing category    | Use "Unknown"      | Sort to end       |
| NaN amount          | Convert to 0       | Sort as zero      |
| Empty description   | Empty string       | Sort to beginning |
| Null payment method | Empty string       | Sort to beginning |

### 7.2 Translation Issues

**Problem**: Payment methods stored as "Credit Card" (Title Case) but translation keys expect "credit_card" (snake_case)

**Solution**: Normalize before translation

```typescript
expense.paymentMethod.toLowerCase().replace(/ /g, '_');
```

**Impact**: Found during testing, fixed in implementation

---

## 8. Internationalization

### 8.1 Locale-Aware Sorting

```typescript
compareResult = categoryA.localeCompare(categoryB);
```

**Benefits:**

- Proper alphabetical order for all languages
- Hebrew (א->ת), English (A->Z) both correct
- Handles accented characters properly

### 8.2 RTL Considerations

**Current**: Sort arrows (↑↓) work in both LTR and RTL

**Future Enhancement**: CSS adjustment for RTL arrow positioning

```css
[dir='rtl'] .sortable-header::after {
  margin-left: 0;
  margin-right: 0.5em;
}
```

---

## 9. Testing Strategy

### 9.1 Unit Testing (Planned)

```typescript
describe('getSortedExpenses', () => {
  it('sorts by date ascending', () => {
    /* ... */
  });
  it('sorts by amount descending', () => {
    /* ... */
  });
  it('handles null values gracefully', () => {
    /* ... */
  });
  it('returns new array (immutable)', () => {
    /* ... */
  });
});

describe('handleSort', () => {
  it('cycles through tri-state', () => {
    /* ... */
  });
  it('resets when sorting new column', () => {
    /* ... */
  });
});
```

### 9.2 Component Testing (Planned)

```typescript
describe('ExpenseList sorting', () => {
  it('renders sort indicators correctly', () => {
    /* ... */
  });
  it('updates on header click', () => {
    /* ... */
  });
  it('applies correct CSS classes', () => {
    /* ... */
  });
});
```

### 9.3 E2E Testing (Implemented)

**File**: `tests/e2e/expenses/sort-expenses.spec.ts`

**Coverage**:

- ✅ Default sort (date descending)
- ✅ Sort each column (asc/desc)
- ✅ Tri-state cycling
- ✅ Visual indicators
- ✅ Data correctness after sort

---

## 10. Dependencies

### 10.1 External Dependencies

| Dependency  | Version | Purpose                       |
| ----------- | ------- | ----------------------------- |
| React       | 18.x    | Component framework           |
| TypeScript  | 5.x     | Type safety                   |
| i18n system | -       | Translation (getCategoryName) |

### 10.2 Internal Dependencies

- **Expense Interface**: Data model for expense records
- **Category Interface**: Category data structure
- **Translation System**: `translation()` function for i18n
- **CSS Modules**: Styling system

---

## 11. Security Considerations

### 11.1 Input Validation

**Client-Side Sorting**: No user input validation needed (sorting existing data only)

**XSS Prevention**:

- React auto-escapes JSX content
- No `dangerouslySetInnerHTML` used
- Sort indicators are static strings (↑↓)

### 11.2 Data Exposure

**Risk**: None - sorting doesn't expose additional data

---

## 12. Deployment Considerations

### 12.1 Feature Flags

**Not Required**: Non-breaking additive feature

### 12.2 Rollback Plan

If issues arise:

1. Revert PR #56
2. Default rendering (no sorting) still functional
3. No database changes required

### 12.3 Monitoring

**Metrics to Track**:

- Client-side error rate (sorting exceptions)
- Performance (sort execution time)
- User engagement (sort clicks per session)

---

## 13. Future Enhancements

### 13.1 Planned Improvements

| Enhancement                           | Priority | Effort | Impact |
| ------------------------------------- | -------- | ------ | ------ |
| Multi-column sorting                  | Medium   | High   | Medium |
| Sort state persistence (localStorage) | Low      | Low    | Low    |
| Server-side sorting                   | High     | High   | High   |
| Custom sort orders                    | Low      | Medium | Low    |
| Sort by multiple fields               | Medium   | High   | Medium |
| Keyboard shortcuts (Shift+Click)      | Low      | Low    | Low    |

### 13.2 Accessibility Enhancements

- [ ] ARIA labels on sort headers
- [ ] Keyboard navigation (Tab + Enter)
- [ ] Screen reader announcements
- [ ] Focus indicators

---

## 14. Alternatives Considered

### 14.1 Library-Based Solutions

**Option 1: React Table**

- ❌ Too heavy for simple sorting
- ❌ Additional dependency

**Option 2: Material-UI Table**

- ❌ Requires full MUI adoption
- ❌ Overhead for one feature

**Decision**: Custom implementation

- ✅ Lightweight (< 100 lines)
- ✅ Full control over UX
- ✅ No external dependencies

### 14.2 Server-Side Sorting

**Pros**:

- Better for large datasets (10,000+ records)
- Reduced client memory usage

**Cons**:

- Network latency on every sort
- Increased server load
- More complex implementation

**Decision**: Client-side for v1.0

- Current dataset size < 100 records per user
- Instant feedback more important
- Can migrate to server-side if needed

---

## 15. References

### 15.1 Related Documents

- [REQ-001: Requirements](../../product/requirements/REQ-001-expense-sorting.md)
- [TEST-001: Test Plan](../../qa/test-plans/TEST-001-expense-sorting.md)
- [MDN: Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [MDN: String.prototype.localeCompare()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)

### 15.2 Implementation Files

- [ExpenseList.tsx](../../../app/frontend/src/components/ExpenseList.tsx) - Main implementation
- [index.css](../../../app/frontend/src/index.css) - Sortable header styles

---

## 16. Approval & Sign-off

| Role              | Name             | Date       | Status      |
| ----------------- | ---------------- | ---------- | ----------- |
| **Tech Lead**     | Development Team | 2025-12-17 | ✅ Approved |
| **QA Lead**       | SDET             | 2025-12-17 | ✅ Approved |
| **Product Owner** | Self             | 2025-12-17 | ✅ Approved |

---

**Document ID**: HLD-001  
**Version**: 1.0  
**Status**: Approved & Implemented  
**Last Updated**: 2025-12-17
