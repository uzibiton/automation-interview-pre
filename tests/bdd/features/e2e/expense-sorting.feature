# Feature: Expense Table Sorting
# 
# As a user managing expenses
# I want to sort expenses by different columns
# So that I can find and analyze expenses efficiently
#
# Traceability:
# - Requirements: REQ-001 (docs/product/requirements/REQ-001-expense-sorting.md)
# - Test Plan: TEST-001 (docs/qa/test-plans/TEST-001-expense-sorting.md)
# - Design: HLD-001 (docs/dev/designs/HLD-001-expense-sorting.md)
# - Execution: EXEC-001 (docs/qa/test-plans/EXEC-001-expense-sorting.md)

@expense-sorting @e2e @TEST-001
Feature: Expense Table Sorting

  Background: Test data setup
    Given the user is logged in as "test@expenses.local"
    And the test data is loaded from "data/expense-sorting.data.json"
    And the expenses from "input.expenses" exist in the database
    And the user navigates to the expenses page

  @TC-001-001 @high-priority @smoke
  Scenario: TC-001-001 - Sort expenses by date column
    # Test tri-state sorting: ascending -> descending -> default
    
    When the user clicks on the "Date" column header
    Then the expenses should be sorted by date in ascending order
    And the "Date" column should display the ascending indicator "↑"
    And the expenses should match the order from "output.sorted.date_asc"
    
    When the user clicks on the "Date" column header again
    Then the expenses should be sorted by date in descending order
    And the "Date" column should display the descending indicator "↓"
    And the expenses should match the order from "output.sorted.date_desc"
    
    When the user clicks on the "Date" column header a third time
    Then the expenses should be sorted by the default order
    And the "Date" column should display the descending indicator "↓"

  @TC-001-002 @high-priority @regression
  Scenario: TC-001-002 - Sort expenses by category column
    # Test alphabetical sorting of category names
    
    When the user clicks on the "Category" column header
    Then the expenses should be sorted by category in ascending order
    And the "Category" column should display the ascending indicator "↑"
    And the expenses should match the order from "output.sorted.category_asc"
    
    When the user clicks on the "Category" column header again
    Then the expenses should be sorted by category in descending order
    And the "Category" column should display the descending indicator "↓"
    And the expenses should match the order from "output.sorted.category_desc"
    
    When the user clicks on the "Category" column header a third time
    Then the expenses should be sorted by the default order
    And the "Category" column should not display a sort indicator

  @TC-001-004 @high-priority @regression
  Scenario: TC-001-004 - Sort expenses by amount column
    # Test numerical sorting (not string sorting)
    
    When the user clicks on the "Amount" column header
    Then the expenses should be sorted by amount in ascending order
    And the "Amount" column should display the ascending indicator "↑"
    And the expenses should match the order from "output.sorted.amount_asc"
    
    When the user clicks on the "Amount" column header again
    Then the expenses should be sorted by amount in descending order
    And the "Amount" column should display the descending indicator "↓"
    And the expenses should match the order from "output.sorted.amount_desc"
    
    When the user clicks on the "Amount" column header a third time
    Then the expenses should be sorted by the default order
    And the "Amount" column should not display a sort indicator

  @TC-001-005 @high-priority @regression
  Scenario: TC-001-005 - Sort expenses by payment method column
    # Test translation-aware sorting and normalization
    
    When the user clicks on the "Payment Method" column header
    Then the expenses should be sorted by payment method in ascending order
    And the "Payment Method" column should display the ascending indicator "↑"
    And the expenses should match the order from "output.sorted.payment_method_asc"
    
    When the user clicks on the "Payment Method" column header again
    Then the expenses should be sorted by payment method in descending order
    And the "Payment Method" column should display the descending indicator "↓"
    And the expenses should match the order from "output.sorted.payment_method_desc"
    
    When the user clicks on the "Payment Method" column header a third time
    Then the expenses should be sorted by the default order
    And the "Payment Method" column should not display a sort indicator

  # Additional scenarios for edge cases and comprehensive coverage
  
  @TC-001-006 @smoke
  Scenario: TC-001-006 - Verify only one column can be sorted at a time
    Given the user clicks on the "Category" column header
    And the "Category" column displays the ascending indicator "↑"
    When the user clicks on the "Amount" column header
    Then the "Amount" column should display the ascending indicator "↑"
    And the "Category" column should not display a sort indicator

  @TC-001-007 @regression
  Scenario: TC-001-007 - Verify sortable headers have pointer cursor
    When the user hovers over the "Date" column header
    Then the cursor should change to pointer
    And the header should have a visual hover effect
