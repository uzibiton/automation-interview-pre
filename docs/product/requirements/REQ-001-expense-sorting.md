# REQ-001: Expense Table Sorting

## Document Information

| Field              | Value                                                                  |
| ------------------ | ---------------------------------------------------------------------- |
| **ID**             | REQ-001                                                                |
| **Feature**        | Expense Table Sorting                                                  |
| **Role**           | Product Manager / SDET                                                 |
| **Name**           | Uzi Biton                                                              |
| **Created**        | 2025-12-10                                                             |
| **Updated**        | 2025-12-17                                                             |
| **Status**         | ✅ Implemented                                                         |
| **Priority**       | High                                                                   |
| **Related Issue**  | [#55](https://github.com/uzibiton/automation-interview-pre/issues/55)  |
| **Implementation** | [PR #56](https://github.com/uzibiton/automation-interview-pre/pull/56) |

## Traceability

| Document Type      | ID       | Link                                                                              |
| ------------------ | -------- | --------------------------------------------------------------------------------- |
| **Design**         | HLD-001  | [High-Level Design](../../dev/designs/HLD-001-expense-sorting.md) (To be created) |
| **Test Plan**      | TEST-001 | [Test Plan](../../qa/test-plans/TEST-001-expense-sorting.md)                      |
| **Test Execution** | EXEC-001 | [Test Execution Report](../../qa/test-plans/EXEC-001-expense-sorting.md)          |
| **Implementation** | -        | [ExpenseList.tsx](../../../app/frontend/src/components/ExpenseList.tsx)           |

---

## 1. Overview

### 1.1 Purpose

Enable users to sort expense records by multiple columns to facilitate data analysis and expense management.

### 1.2 Business Value

- **Time Savings**: Users can quickly find expenses without manual scanning
- **Data Analysis**: Easier to identify patterns (highest expenses, category trends)
- **User Experience**: Standard table functionality expected by users
- **Improved Usability**: Reduces cognitive load when managing many expenses

### 1.3 Success Metrics

- ✅ 100% of users can sort by any column within 2 clicks
- ✅ Sorting response time < 100ms for datasets up to 100 records
- ✅ Zero reported bugs related to incorrect sort order
- ✅ 90%+ user satisfaction in UX feedback

---

## 2. Functional Requirements

### FR-001: Date Column Sorting

**Priority**: Must Have  
**Status**: ✅ Implemented

**Description**: Users shall be able to sort expenses by date in ascending or descending order.

**Acceptance Criteria**:

- [ ] Clicking date column header sorts ascending (oldest first)
- [ ] Second click sorts descending (newest first)
- [ ] Third click returns to default (date descending)
- [ ] Visual indicator (↑/↓) shows current sort direction
- [ ] Date sorting handles all date formats correctly

**Business Rules**:

- Default sort: Date descending (newest expenses shown first)
- Invalid/null dates treated as oldest dates

---

### FR-002: Category Column Sorting

**Priority**: Must Have  
**Status**: ✅ Implemented

**Description**: Users shall be able to sort expenses alphabetically by category name.

**Acceptance Criteria**:

- [ ] Clicking category header sorts alphabetically A->Z
- [ ] Second click sorts Z->A
- [ ] Third click returns to default sort
- [ ] Visual indicator shows current sort direction
- [ ] Category names localized correctly before sorting

**Business Rules**:

- Sorting uses localized category names (not IDs)
- Case-insensitive sorting
- Unknown categories appear at end

---

### FR-003: Description Column Sorting

**Priority**: Should Have  
**Status**: ✅ Implemented

**Description**: Users shall be able to sort expenses alphabetically by description text.

**Acceptance Criteria**:

- [ ] Clicking description header sorts alphabetically A->Z
- [ ] Second click sorts Z->A
- [ ] Third click returns to default sort
- [ ] Visual indicator shows current sort direction
- [ ] Empty descriptions handled gracefully

**Business Rules**:

- Case-insensitive sorting
- Locale-aware string comparison
- Empty/null descriptions appear at end

---

### FR-004: Amount Column Sorting

**Priority**: Must Have  
**Status**: ✅ Implemented

**Description**: Users shall be able to sort expenses by amount in ascending or descending order.

**Acceptance Criteria**:

- [ ] Clicking amount header sorts ascending (smallest first)
- [ ] Second click sorts descending (largest first)
- [ ] Third click returns to default sort
- [ ] Visual indicator shows current sort direction
- [ ] Numeric sorting (not string-based)
- [ ] Invalid amounts handled without errors

**Business Rules**:

- Sorting by numeric value regardless of currency
- NaN/invalid amounts treated as 0
- Currency symbols ignored in sort order

---

### FR-005: Payment Method Column Sorting

**Priority**: Should Have  
**Status**: ✅ Implemented

**Description**: Users shall be able to sort expenses alphabetically by payment method.

**Acceptance Criteria**:

- [ ] Clicking payment method header sorts alphabetically
- [ ] Second click sorts reverse alphabetically
- [ ] Third click returns to default sort
- [ ] Visual indicator shows current sort direction
- [ ] Translated payment method names display correctly

**Business Rules**:

- Sorting uses translated display values
- Null/empty payment methods appear at end

---

### FR-006: Sort State Indicators

**Priority**: Must Have  
**Status**: ✅ Implemented

**Description**: Users shall see clear visual indicators of the current sort state.

**Acceptance Criteria**:

- [ ] Sorted column displays arrow indicator (↑ or ↓)
- [ ] Only one column shows indicator at a time
- [ ] Default state shows ↓ on Date column
- [ ] Indicator updates immediately on click
- [ ] Hover state shows column is sortable (cursor: pointer)

**Business Rules**:

- ↑ indicates ascending sort
- ↓ indicates descending sort
- No indicator when column not sorted

---

### FR-007: Tri-State Sorting Behavior

**Priority**: Must Have  
**Status**: ✅ Implemented

**Description**: Each sortable column shall cycle through three states: ascending, descending, default.

**Acceptance Criteria**:

- [ ] First click: Sort ascending (↑)
- [ ] Second click: Sort descending (↓)
- [ ] Third click: Return to default sort (date descending)
- [ ] Behavior consistent across all columns
- [ ] State resets when sorting different column

**Business Rules**:

- Default sort always available (date descending)
- Sorting one column clears sort on other columns

---

## 3. Non-Functional Requirements

### NFR-001: Performance

**Priority**: Must Have  
**Status**: ✅ Validated

**Description**: Sorting shall be fast and responsive.

**Requirements**:

- Sort operation completes < 100ms for 100 records
- Sort operation completes < 500ms for 1000 records
- No UI blocking during sort
- No perceived lag or jank

**Validation**: Performance tested with 50+ records, all sorts < 50ms

---

### NFR-002: Usability

**Priority**: Must Have  
**Status**: ✅ Validated

**Description**: Sorting functionality shall be intuitive and discoverable.

**Requirements**:

- Sortable columns indicated by cursor change on hover
- Visual feedback immediate (< 16ms)
- Sort indicators clear and unambiguous
- Consistent with standard table sorting UX

**Validation**: Manual usability testing completed

---

### NFR-003: Internationalization

**Priority**: Should Have  
**Status**: ⚠️ Partial

**Description**: Sorting shall work correctly with all supported locales.

**Requirements**:

- Correct locale-aware string sorting (EN, HE)
- RTL layout compatibility
- Translated values sorted correctly
- Currency and date formatting respected

**Validation**: English tested ✅, Hebrew partially tested ⚠️

---

### NFR-004: Browser Compatibility

**Priority**: Must Have  
**Status**: ⚠️ Partial

**Requirements**:

- Chrome 120+ ✅
- Firefox 121+ ✅
- Safari 17+ ⚠️ (not tested)
- Edge 120+ ✅

**Validation**: 3 of 4 browsers tested

---

### NFR-005: Accessibility

**Priority**: Should Have  
**Status**: ⬜ Not Validated

**Requirements**:

- Keyboard navigation support (Enter/Space to sort)
- Screen reader announces sort state
- ARIA labels on sortable headers
- Focus indicators visible

**Validation**: Deferred to future enhancement

---

## 4. User Stories

### US-001: Sort by Date

**As a** user managing monthly expenses  
**I want to** sort expenses by date  
**So that** I can see my most recent or oldest expenses first

**Acceptance**: FR-001

---

### US-002: Find Largest Expenses

**As a** user tracking spending  
**I want to** sort expenses by amount  
**So that** I can quickly identify my largest expenses

**Acceptance**: FR-004

---

### US-003: Group by Category

**As a** user analyzing spending patterns  
**I want to** sort expenses by category  
**So that** I can see all expenses in the same category together

**Acceptance**: FR-002

---

### US-004: Review Payment Methods

**As a** user managing multiple payment methods  
**I want to** sort by payment method  
**So that** I can see all credit card transactions together

**Acceptance**: FR-005

---

## 5. Constraints & Assumptions

### Constraints

- Client-side sorting only (no server-side sorting)
- Single-column sorting (no multi-column)
- No sort state persistence (resets on page reload)
- Limited to visible page data (no virtual scrolling)

### Assumptions

- Dataset size < 1000 records (client-side sorting performant)
- Users familiar with standard table sorting UX
- Browser JavaScript enabled
- React 18+ environment

---

## 6. Dependencies

### Technical Dependencies

- React 18 (useState hooks)
- TypeScript (type safety)
- i18n translation system (localized strings)
- CSS module support

### Data Dependencies

- Expense records with valid dates
- Category IDs mapped to names
- Payment methods with translations

---

## 7. Out of Scope

- ❌ Server-side/database sorting
- ❌ Multi-column sorting (sort by category, then amount)
- ❌ Custom sort orders
- ❌ Sort state persistence in localStorage
- ❌ Export sorted data
- ❌ Sort by additional columns (currency, tags, notes)
- ❌ Performance optimization for 10,000+ records

---

## 8. Risks & Mitigations

| Risk                                        | Impact | Likelihood | Mitigation                                         | Status     |
| ------------------------------------------- | ------ | ---------- | -------------------------------------------------- | ---------- |
| Performance degradation with large datasets | High   | Medium     | Implement virtual scrolling or server-side sorting | Monitored  |
| Translation key mismatches                  | Medium | Low        | Normalize data before translation                  | ✅ Fixed   |
| Browser inconsistencies                     | Medium | Low        | Cross-browser testing                              | ⚠️ Partial |
| RTL layout issues                           | Low    | Medium     | RTL-specific testing                               | 🔍 Open    |
| Data inconsistency (mixed formats)          | Medium | Low        | Backend data validation                            | 🔍 Open    |

---

## 9. Open Questions

- ❓ Should sort state persist across sessions?
- ❓ Should we add multi-column sorting in future?
- ❓ What's the maximum expected dataset size?
- ❓ Should server-side sorting be implemented for scalability?

**Resolution**: Deferred to future releases based on user feedback

---

## 10. Change History

| Date       | Version | Author    | Changes                            |
| ---------- | ------- | --------- | ---------------------------------- |
| 2025-12-10 | 0.1     | Developer | Initial implementation             |
| 2025-12-17 | 1.0     | SDET      | Requirements documentation created |

---

## 11. Approval

| Role              | Name | Date       | Status      |
| ----------------- | ---- | ---------- | ----------- |
| **Product Owner** | Self | 2025-12-17 | ✅ Approved |
| **Tech Lead**     | Self | 2025-12-17 | ✅ Approved |
| **QA Lead**       | SDET | 2025-12-17 | ✅ Approved |

---

**Document ID**: REQ-001  
**Status**: Approved & Implemented  
**Next Review**: On next major feature update
