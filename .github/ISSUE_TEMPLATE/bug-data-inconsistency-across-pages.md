---
name: 🐛 Bug - Data Inconsistency Across Dashboard, Analytics, and Expenses Pages
about: Different pages show different expense data - not aligned/synchronized
title: '[BUG] Data inconsistency across pages - old data appears in table but not in graphs'
labels: 'bug, data-consistency, critical, frontend, backend'
assignees: ''
---

## 🐛 Bug Description

The expense data shown across the three main pages (Dashboard, Analytics, Expenses) is not consistent. The Expenses table shows old/historical data that does not appear in the Dashboard stats or Analytics graphs.

## 📊 Observed Behavior

**Expenses Page (Table):**
- Shows old historical expense records
- Displays all expenses from database

**Dashboard Page (Stats):**
- Shows different totals/counts
- Does not include old expense data
- Stats seem filtered or limited

**Analytics Page (Pie Chart):**
- Graph does not include old expenses
- Category breakdown missing historical data
- Inconsistent with table data

## ✅ Expected Behavior

All three pages should show **consistent data**:
- Dashboard stats should match total from Expenses table
- Analytics graph should include all expenses from table
- Same time period/filter should apply to all views
- If filtering by period (month/year), it should be consistent

## 🔍 Root Cause Analysis Needed

Investigate:

1. **API Endpoints:**
   - `/expenses/stats?period=month` - What does this return?
   - `/expenses` - What does this return?
   - Are they querying the same data source?
   - Different date filters applied?

2. **Frontend Data Fetching:**
   - Does Dashboard filter by date range?
   - Does ExpenseList fetch all expenses?
   - Is there a `refreshKey` synchronization issue?

3. **Database Schema:**
   - Are there soft-deleted records?
   - Orphaned data without proper relationships?
   - Old data before a schema migration?

4. **Business Logic:**
   - Should old data be included?
   - Is there a default time filter (e.g., last 30 days)?
   - Are we mixing different user data?

## 📝 Reproduction Steps

1. Navigate to Dashboard - note the total expenses and count
2. Navigate to Analytics - check pie chart totals
3. Navigate to Expenses - scroll through table and sum totals
4. Compare all three:
   - Dashboard total ≠ Expenses table sum
   - Analytics graph ≠ Table data
   - Data appears misaligned

## 🖥️ Environment

- **Browser:** [Chrome/Firefox/Safari]
- **Environment:** [Local Docker / PR Environment / Production]
- **User Account:** [Specify if using Google OAuth or test account]

## 📸 Screenshots

[Add screenshots showing:]
1. Dashboard with stats
2. Analytics with pie chart
3. Expenses table with old data
4. Highlight the differences

## 🔧 Potential Solutions

### Option 1: Align All Queries (Recommended)
- Make all pages query the same date range
- Add explicit date filters to all API calls
- Default to "last 30 days" or "current month"

### Option 2: Add Time Range Filter UI
- Add date range picker to all pages
- Let user choose: "Last 7 days", "Last 30 days", "All time"
- Store preference in state/localStorage
- Apply consistently across all pages

### Option 3: Separate "Archive" View
- Keep current pages showing recent data
- Add "Archive" or "All Expenses" page for historical data
- Make it clear which view shows what timeframe

## ✅ Acceptance Criteria

- [ ] All three pages show consistent data for the same time period
- [ ] If Dashboard shows "This Month: $500", Expenses table sum = $500
- [ ] Analytics pie chart totals match Dashboard stats
- [ ] `refreshKey` properly triggers data reload on all pages
- [ ] Clear indication to user what time period is being displayed
- [ ] Old/historical data handling is documented and intentional

## 🔗 Related Tasks

- **Task:** Define data migration strategy for old expenses
- **Task:** Implement consistent date filtering across all pages
- **Task:** Add data validation tests to catch inconsistencies
- **Task:** Document expected behavior for historical data
- **Task:** Clean up orphaned or invalid data in database

## 🏷️ Labels

`bug`, `data-consistency`, `critical`, `frontend`, `backend`, `api`, `database`

---

**Priority:** High (affects data integrity and user trust)
**Severity:** Critical (users see incorrect information)
**Effort Estimate:** 2-4 hours (investigation + fix)
