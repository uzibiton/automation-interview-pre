# Expense Tracker Testing Guide

## Overview

This document provides step-by-step testing instructions for the bilingual Expense Tracker application.

## Prerequisites

- Docker and Docker Compose installed
- All containers running: `docker-compose ps`
- Application accessible at: http://localhost

## Test Scenarios

### 1. Authentication Test

#### 1.1 Google OAuth Login

1. Navigate to http://localhost
2. Click "Continue with Google" button
3. Login with your Google account
4. Verify redirect to Dashboard
5. Check that your name and avatar appear in the header

#### 1.2 Email/Password Registration

1. Navigate to http://localhost
2. Click "Register" link
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
4. Click "Register" button
5. Verify redirect to Dashboard

#### 1.3 Email/Password Login

1. Logout if logged in
2. Navigate to http://localhost
3. Enter registered email and password
4. Click "Login" button
5. Verify redirect to Dashboard

### 2. Language Switching Test

#### 2.1 English → Hebrew

1. Login to Dashboard
2. Click "עברית" button in header
3. Verify:
   - UI changes to Hebrew text
   - Layout switches to RTL (right-to-left)
   - Title shows "מעקב הוצאות"
   - Button texts are in Hebrew

#### 2.2 Hebrew → English

1. While in Hebrew mode
2. Click "English" button
3. Verify:
   - UI changes to English text
   - Layout switches to LTR (left-to-right)
   - Title shows "Expense Tracker"
   - Button texts are in English

### 3. Expense Management Tests

#### 3.1 View Expenses

1. Login to Dashboard
2. Verify stats display:
   - This Month: Total amount spent
   - Count: Number of expenses
   - By Category: Number of categories with expenses
3. Scroll down to expense list
4. Verify table shows:
   - Date column
   - Category column (with icon)
   - Description column
   - Amount column (with currency)
   - Payment Method column
   - Delete button

#### 3.2 Add New Expense (All Fields)

1. Click "Add Expense" button
2. Fill in form:
   - Category: Food (מזון)
   - Sub Category: Restaurant (מסעדה)
   - Amount: 50.00
   - Currency: USD $
   - Date: Today's date
   - Payment Method: Credit Card
   - Description: Lunch at cafe
3. Click "Save" button
4. Verify:
   - Form closes
   - New expense appears in list
   - Stats update (count increases, amount increases)

#### 3.3 Add Expense (Minimal Fields)

1. Click "Add Expense" button
2. Fill in only required fields:
   - Category: Transportation (תחבורה)
   - Amount: 25.50
   - Date: Today's date
3. Click "Save" button
4. Verify expense is created successfully

#### 3.4 Test Different Categories

Add expenses in these categories and verify icons display correctly:

- 🎭 Entertainment (פנאי)
- 🍔 Food (מזון)
- ⚕️ Health (בריאות)
- 🛡️ Insurance (ביטוח)
- 📚 Education (חינוך)
- 🚗 Transportation (תחבורה)
- 📄 Bills (חשבונות)
- 💰 Savings (חסכונות)
- 🏠 Household (משק בית)

#### 3.5 Test Different Currencies

1. Add expense with USD currency
2. Add expense with ILS (₪) currency
3. Add expense with EUR (€) currency
4. Verify all display correctly in the list

#### 3.6 Test Different Payment Methods

Add expenses with each payment method:

- Credit Card (כרטיס אשראי)
- Debit Card (כרטיס חיוב)
- Cash (מזומן)
- Bank Transfer (העברה בנקאית)

#### 3.7 Delete Expense

1. Find an expense in the list
2. Click "Delete" button
3. Confirm deletion in the dialog
4. Verify:
   - Expense removed from list
   - Stats update (count decreases, amount decreases)

### 4. Bilingual Data Display Test

#### 4.1 Category Names in English

1. Switch to English language
2. Add expense with "Food" category
3. Verify category displays as "Food" in the list

#### 4.2 Category Names in Hebrew

1. Switch to Hebrew language
2. View same expense
3. Verify category displays as "מזון" in the list

#### 4.3 Payment Method Translation

1. Add expense with "credit_card" payment method
2. Switch between English/Hebrew
3. Verify:
   - English: "Credit Card"
   - Hebrew: "כרטיס אשראי"

### 5. Multi-User Isolation Test

#### 5.1 User A Data

1. Login as User A (e.g., with Google OAuth)
2. Add 3 expenses
3. Note the total amount and count
4. Logout

#### 5.2 User B Data

1. Login as User B (e.g., with email/password)
2. Verify:
   - Expense list is empty (no User A expenses)
   - Stats show 0
3. Add 2 expenses
4. Verify only User B's expenses appear

#### 5.3 User A Data Persistence

1. Logout from User B
2. Login again as User A
3. Verify:
   - User A's 3 expenses still appear
   - User B's expenses are NOT visible
   - Stats show correct count for User A

### 6. Form Validation Tests

#### 6.1 Required Fields

1. Click "Add Expense"
2. Try to submit without filling any fields
3. Verify form validation prevents submission
4. Fill in required fields (Category, Amount, Date)
5. Verify submission succeeds

#### 6.2 Amount Validation

1. Try entering negative amount: -50
2. Try entering zero: 0
3. Try entering very large amount: 999999.99
4. Verify appropriate validation

#### 6.3 Date Selection

1. Select past date
2. Select today's date
3. Select future date
4. Verify all dates are accepted

#### 6.4 Sub-Category Dependency

1. Select a category
2. Verify sub-category dropdown populates
3. Change to different category
4. Verify sub-category dropdown updates
5. Select category with no sub-categories
6. Verify sub-category dropdown hides or shows "-"

### 7. API Integration Tests

#### 7.1 Check API Endpoints

Run these curl commands to verify API:

```bash
# Login and get token
TOKEN=$(curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}' \
  | jq -r '.access_token')

# Get categories
curl -X GET http://localhost:3002/expenses/categories \
  -H "Authorization: Bearer $TOKEN"

# Get sub-categories for Food (categoryId=2)
curl -X GET http://localhost:3002/expenses/categories/2/subcategories \
  -H "Authorization: Bearer $TOKEN"

# Get expenses
curl -X GET http://localhost:3002/expenses \
  -H "Authorization: Bearer $TOKEN"

# Get stats
curl -X GET "http://localhost:3002/expenses/stats?period=month" \
  -H "Authorization: Bearer $TOKEN"

# Create expense
curl -X POST http://localhost:3002/expenses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 2,
    "subCategoryId": 7,
    "amount": 45.50,
    "currency": "USD",
    "description": "API Test Expense",
    "date": "2025-11-10",
    "paymentMethod": "credit_card"
  }'
```

### 8. Browser Console Tests

#### 8.1 Check for JavaScript Errors

1. Open Browser Developer Tools (F12)
2. Go to Console tab
3. Navigate through the app
4. Verify no red errors appear

#### 8.2 Check Network Requests

1. Open Developer Tools → Network tab
2. Perform actions (login, add expense, delete expense)
3. Verify:
   - All requests return 200 status
   - No 401 (unauthorized) errors
   - No 500 (server) errors

### 9. Database Verification Tests

#### 9.1 Check Expense Records

```bash
docker exec -it test-postgres psql -U postgres -d taskdb -c "SELECT * FROM expenses;"
```

#### 9.2 Check Categories

```bash
docker exec -it test-postgres psql -U postgres -d taskdb -c "SELECT id, name_en, name_he, icon FROM categories;"
```

#### 9.3 Check Sub-Categories

```bash
docker exec -it test-postgres psql -U postgres -d taskdb -c "SELECT id, category_id, name_en, name_he FROM sub_categories LIMIT 10;"
```

### 10. Performance Tests

#### 10.1 Large Dataset

1. Add 50+ expenses (you can use the API endpoint in a loop)
2. Verify:
   - List loads quickly
   - Scrolling is smooth
   - Stats calculate correctly

#### 10.2 Rapid Actions

1. Quickly add 5 expenses in succession
2. Quickly delete 3 expenses
3. Switch languages rapidly
4. Verify no race conditions or errors

## Expected Results Summary

### Working Features

✅ Google OAuth login
✅ Email/password registration and login
✅ Language switching (English ↔ Hebrew)
✅ RTL layout for Hebrew
✅ Add expense with all fields
✅ View expense list
✅ Delete expense
✅ Bilingual category names
✅ Translated payment methods
✅ Multi-user data isolation
✅ Stats display (This Month, Count, By Category)
✅ Sub-category filtering by category
✅ Currency selection (USD, ILS, EUR)

### Known Limitations

⚠️ No expense editing yet (PUT endpoint exists but no UI)
⚠️ No date range filtering yet
⚠️ No category filtering yet
⚠️ No pie chart visualization yet
⚠️ No export functionality yet
⚠️ Stats always show "This Month" period (not configurable yet)

## Troubleshooting

### Issue: Cannot login

- Check if auth-service container is running: `docker ps`
- Check logs: `docker logs auth-service`

### Issue: Expenses not showing

- Verify you're logged in
- Check API logs: `docker logs api-service`
- Verify database has data: `docker exec -it test-postgres psql -U postgres -d taskdb -c "SELECT COUNT(*) FROM expenses;"`

### Issue: Language not switching

- Check browser console for errors
- Verify translation files exist: `frontend/src/i18n/translations/`
- Hard refresh page: Ctrl+F5

### Issue: Categories not loading

- Check database: `docker exec -it test-postgres psql -U postgres -d taskdb -c "SELECT COUNT(*) FROM categories;"`
- Should return 9 categories
- Check API logs for errors

### Issue: User ID is null

- This is expected behavior for the current implementation
- Backend filters expenses by user_id from JWT token
- Even though logs show null, the userId is correctly extracted from the token in the controller

## Next Steps

After completing these tests, consider implementing:

1. **Expense Edit Feature**: Add PUT endpoint UI
2. **Pie Chart**: Visualize expenses by category
3. **Date Range Filter**: Filter expenses by date range
4. **Category Filter**: Filter expenses by specific category
5. **Export to CSV**: Download expense report
6. **Budget Limits**: Set monthly limits per category
7. **Receipt Upload**: Attach receipt images to expenses
8. **Recurring Expenses**: Set up automatic monthly expenses
9. **Reports**: Generate monthly/yearly expense reports
10. **Mobile Responsive**: Optimize for mobile devices
