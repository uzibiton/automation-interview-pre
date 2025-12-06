---
name: Separate graph and table into different pages
about: Improve UX by splitting expense visualization and list into separate pages
title: 'TASK: Separate expense graph and table into different pages'
labels: enhancement, frontend, ux
assignees: ''

---

## Description
Currently, the expense graph (pie chart) and expense table are displayed on the same dashboard page. Split these into separate pages to improve user experience, reduce visual clutter, and allow for better focus on each view.

## Problem
- Dashboard is crowded with both graph and table on the same page
- Users cannot focus on one view without the other taking up screen space
- Difficult to expand or enhance either component without making the page too long
- Mobile view is cramped with both components
- No dedicated space for future enhancements to either view

## Proposed Solution
Create two separate pages:
1. **Analytics Page** - Expense visualization with pie chart and future chart types
2. **Expenses Page** - Expense table/list with filtering and sorting capabilities

Update navigation to include links to both pages.

## Implementation Tasks

### Navigation Updates
- [ ] Add new navigation menu items:
  - "Analytics" or "Reports" for graph page
  - "Expenses" or "Expense List" for table page
- [ ] Update navigation component to highlight active page
- [ ] Ensure navigation is responsive on mobile

### Analytics Page
- [ ] Create new route `/analytics` or `/reports`
- [ ] Move `ExpensePieChart` component to this page
- [ ] Add page title and description
- [ ] Add filters: date range, category selection
- [ ] Add "View Details" button linking to expense list
- [ ] Ensure responsive layout for mobile
- [ ] Add loading state while fetching expense data

### Expenses Page  
- [ ] Create new route `/expenses`
- [ ] Move `ExpenseList` component to this page
- [ ] Add page title and description
- [ ] Keep existing table functionality (edit, delete)
- [ ] Add "View Analytics" button linking to analytics page
- [ ] Add search/filter capabilities
- [ ] Add sorting by date, amount, category
- [ ] Ensure responsive table on mobile
- [ ] Add pagination if needed for large datasets

### Dashboard Updates
- [ ] Update main dashboard to show summary cards
- [ ] Add quick links to both Analytics and Expenses pages
- [ ] Show recent expenses (last 5-10)
- [ ] Show quick stats (total expenses, top category, etc.)
- [ ] Remove full graph and table from dashboard

### Routing
- [ ] Update React Router configuration
- [ ] Add route guards if authentication required
- [ ] Update any internal links pointing to dashboard components
- [ ] Test navigation between all pages

### Testing
- [ ] Test navigation between pages
- [ ] Test data loads correctly on each page
- [ ] Test mobile responsiveness of both pages
- [ ] Test browser back/forward buttons work correctly
- [ ] Update E2E tests for new page structure
- [ ] Update component tests if needed

## Benefits
- ✅ Cleaner, less cluttered user interface
- ✅ Better focus on specific tasks (analyzing vs. managing expenses)
- ✅ Room for future enhancements on each page
- ✅ Improved mobile experience
- ✅ Better performance (load only needed components)
- ✅ More intuitive navigation structure
- ✅ Follows single responsibility principle

## Acceptance Criteria
- [ ] Analytics page displays expense pie chart with proper data
- [ ] Expenses page displays expense table with all existing functionality
- [ ] Navigation menu includes links to both new pages
- [ ] Active page is highlighted in navigation
- [ ] Dashboard shows summary view with links to detail pages
- [ ] All existing features (add, edit, delete expenses) still work
- [ ] Pages are responsive on mobile devices
- [ ] No console errors or warnings
- [ ] E2E tests updated and passing
- [ ] Code reviewed and merged to main

## Design Considerations
- Maintain consistent styling across all pages
- Use same color scheme and typography
- Ensure smooth transitions between pages
- Consider adding breadcrumbs for navigation clarity
- Mobile-first responsive design

## Technical Notes
- Update routes in `App.tsx` or main routing file
- May need to lift state up or use context for shared expense data
- Consider adding page-level loading states
- Update TypeScript types if needed for new components

## References
- Current implementation: `app/frontend/src/components/Dashboard.tsx`
- Pie chart component: `app/frontend/src/components/ExpensePieChart.tsx`
- Table component: `app/frontend/src/components/ExpenseList.tsx`
