---
name: 🔧 Task - Implement Consistent Date Filtering Across All Pages
about: Add date range filters and ensure data consistency between Dashboard, Analytics, and Expenses
title: '[TASK] Implement Consistent Date Filtering Across All Pages'
labels: 'task, frontend, backend, ux, data-consistency'
assignees: ''
---

## 📋 Task Description

Implement consistent date range filtering across Dashboard, Analytics, and Expenses pages to ensure all views show the same data for the same time period.

## 🎯 Goal

- Ensure data consistency across all pages
- Give users control over what time period they're viewing
- Make it clear what data is being displayed
- Improve data transparency and user trust

## 🔍 Current Issues

**Problem:**
- Dashboard queries `/expenses/stats?period=month`
- Analytics queries different data (unclear timeframe)
- Expenses table shows ALL expenses (no filter)
- Result: Three pages show different totals

**Impact:**
- Users confused by inconsistent numbers
- Can't trust the data displayed
- No way to view historical data intentionally

## 📝 Implementation Steps

### Phase 1: Backend - Add Date Filtering Support

#### 1. Update API Endpoints

**API Service - Expenses Controller:**

```typescript
// app/services/api-service/src/expenses/expenses.controller.ts

interface DateRangeQuery {
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
  period?: 'day' | 'week' | 'month' | 'year' | 'all';
}

@Get()
async findAll(
  @Query() query: DateRangeQuery,
  @Req() req: Request
) {
  const userId = (req.user as any).id;
  
  // Calculate date range based on period or explicit dates
  const dateRange = this.calculateDateRange(query);
  
  return this.expensesService.findAll(userId, dateRange);
}

@Get('stats')
async getStats(
  @Query() query: DateRangeQuery,
  @Req() req: Request
) {
  const userId = (req.user as any).id;
  const dateRange = this.calculateDateRange(query);
  
  return this.expensesService.getStats(userId, dateRange);
}

private calculateDateRange(query: DateRangeQuery) {
  if (query.startDate && query.endDate) {
    return {
      start: new Date(query.startDate),
      end: new Date(query.endDate)
    };
  }
  
  const now = new Date();
  
  switch (query.period) {
    case 'day':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'week':
      return { start: startOfWeek(now), end: endOfWeek(now) };
    case 'month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'year':
      return { start: startOfYear(now), end: endOfYear(now) };
    case 'all':
      return { start: new Date(0), end: now }; // All time
    default:
      // Default to current month
      return { start: startOfMonth(now), end: endOfMonth(now) };
  }
}
```

**Update ExpensesService:**

```typescript
// app/services/api-service/src/expenses/expenses.service.ts

async findAll(
  userId: number, 
  dateRange?: { start: Date; end: Date }
): Promise<Expense[]> {
  const query = this.expenseRepository
    .createQueryBuilder('expense')
    .where('expense.userId = :userId', { userId });
  
  if (dateRange) {
    query.andWhere('expense.date >= :start', { start: dateRange.start })
         .andWhere('expense.date <= :end', { end: dateRange.end });
  }
  
  return query
    .orderBy('expense.date', 'DESC')
    .getMany();
}
```

### Phase 2: Frontend - Add Date Filter UI Component

#### 1. Create DateRangePicker Component

```typescript
// app/frontend/src/components/DateRangePicker.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';

interface DateRangePickerProps {
  value: 'day' | 'week' | 'month' | 'year' | 'all';
  onChange: (period: string) => void;
}

function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const { t } = useTranslation();
  
  return (
    <div className="date-range-picker">
      <label>{t('filters.timePeriod')}:</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="form-select"
      >
        <option value="day">{t('filters.today')}</option>
        <option value="week">{t('filters.thisWeek')}</option>
        <option value="month">{t('filters.thisMonth')}</option>
        <option value="year">{t('filters.thisYear')}</option>
        <option value="all">{t('filters.allTime')}</option>
      </select>
    </div>
  );
}

export default DateRangePicker;
```

#### 2. Add Shared Date Filter State in Dashboard

```typescript
// app/frontend/src/components/Dashboard.tsx

function Dashboard({ token, onLogout }: DashboardProps) {
  const [dateFilter, setDateFilter] = useState<string>('month'); // Shared state
  
  // Pass dateFilter to all child pages
  
  return (
    <div>
      <Navigation 
        userName={user?.name}
        userAvatar={user?.avatarUrl}
        onLogout={onLogout}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
      />
      
      <Routes>
        <Route path="/" element={
          <DashboardHome 
            stats={stats} 
            token={token} 
            onUpdate={handleUpdate}
            dateFilter={dateFilter}
          />
        } />
        <Route path="/analytics" element={
          <AnalyticsPage 
            token={token} 
            refreshKey={refreshKey}
            dateFilter={dateFilter}
          />
        } />
        <Route path="/expenses" element={
          <ExpensesPage 
            token={token} 
            refreshKey={refreshKey} 
            onUpdate={handleUpdate}
            dateFilter={dateFilter}
          />
        } />
      </Routes>
    </div>
  );
}
```

#### 3. Update API Calls to Include Date Filter

```typescript
// Example in ExpensesPage.tsx

useEffect(() => {
  fetchExpenses();
}, [token, refreshKey, dateFilter]); // Re-fetch when filter changes

const fetchExpenses = async () => {
  try {
    const response = await axios.get(
      `${API_SERVICE_URL}/expenses?period=${dateFilter}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setExpenses(response.data);
  } catch (error) {
    console.error('Failed to fetch expenses', error);
  }
};
```

### Phase 3: Update All Pages

**Update each page to:**
1. Accept `dateFilter` prop
2. Display DateRangePicker component
3. Use dateFilter in API calls
4. Show current filter in UI (e.g., "Showing: This Month")

### Phase 4: Add Translations

```json
// app/frontend/src/i18n/translations/en.json

{
  "filters": {
    "timePeriod": "Time Period",
    "today": "Today",
    "thisWeek": "This Week",
    "thisMonth": "This Month",
    "thisYear": "This Year",
    "allTime": "All Time",
    "showing": "Showing"
  }
}
```

### Phase 5: Testing

**Test Cases:**

1. **Filter Consistency:**
   - Set filter to "This Month" on Dashboard
   - Navigate to Analytics → Should show same month
   - Navigate to Expenses → Should show same month
   - Verify totals match across all pages

2. **Filter Persistence:**
   - Change filter to "This Year"
   - Refresh page → Filter should persist (localStorage)
   - Navigate between pages → Filter stays consistent

3. **Data Refresh:**
   - Add new expense
   - Verify it appears in all views (if within date range)
   - Change filter → Data updates correctly

4. **Edge Cases:**
   - No data for selected period → Show "No expenses" message
   - Switch from "All Time" to "Today" → Large to small dataset
   - Invalid date range → Handle gracefully

## ✅ Acceptance Criteria

- [ ] All API endpoints support date range filtering
- [ ] Date filter UI component created and styled
- [ ] Filter appears in consistent location on all pages
- [ ] All three pages use the same date filter state
- [ ] Dashboard stats match Expenses table totals for same period
- [ ] Analytics graphs show same data as table
- [ ] Filter selection persists across page navigation
- [ ] Clear indication of what period is being displayed
- [ ] Translations added for all date filter labels
- [ ] Tests added for filter functionality
- [ ] Documentation updated in API_REFERENCE.md

## 🎨 UI/UX Considerations

**Placement Options:**

1. **In Navigation Bar (Recommended):**
   - Always visible
   - Consistent across pages
   - Clear global filter

2. **In Page Header:**
   - Per-page customization
   - More flexible
   - Potentially inconsistent

**Visual Indicators:**

```
┌─────────────────────────────────────────┐
│ 💰 Expense Tracker  [➕]  [This Month ▼]│  ← Filter in nav
├─────────────────────────────────────────┤
│ Dashboard  Analytics  Expenses          │
└─────────────────────────────────────────┘

Showing data for: December 2025  ← Clear label
```

## 📚 Documentation Updates

**API_REFERENCE.md:**
```markdown
### GET /expenses

Query parameters:
- `period` (optional): 'day' | 'week' | 'month' | 'year' | 'all'
- `startDate` (optional): ISO date string (YYYY-MM-DD)
- `endDate` (optional): ISO date string (YYYY-MM-DD)

Default: Current month if no parameters provided
```

## 🔗 Related Issues

- Bug: Data inconsistency across pages
- Task: Data migration strategy
- Enhancement: Add custom date range picker (calendar)

## 🏷️ Labels

`task`, `frontend`, `backend`, `ux`, `data-consistency`, `feature`

---

**Priority:** High (blocks bug fix)
**Effort Estimate:** 4-6 hours
**Complexity:** Medium
