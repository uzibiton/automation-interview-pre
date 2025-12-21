@e2e @sorting @expenses
Feature: Expense Table Sorting
  As a user managing my expenses
  I want to sort the expense table by different columns
  So that I can find and analyze expenses more efficiently

  Background:
    Given the user is logged in as "test@expenses.local"
    And the test data is loaded from "expense-sorting.data.json"
    And the expenses from "input.expenses" exist in the database
    And the user navigates to the expenses page

  @smoke @TC-001-001
  Scenario: TC-001-001 - Sort expenses by date in ascending order
    When the user clicks on the "Date" column header
    Then the expenses should be sorted by date in ascending order
    And the "Date" column should display the ascending indicator "↑"
    And the expenses should match the order from "output.sorted.date_asc"

  @regression @TC-001-002
  Scenario: TC-001-002 - Sort expenses by date in descending order
    When the user clicks on the "Date" column header
    And the user clicks on the "Date" column header again
    Then the expenses should be sorted by date in descending order
    And the "Date" column should display the descending indicator "↓"
    And the expenses should match the order from "output.sorted.date_desc"

  @regression @TC-001-004
  Scenario: TC-001-004 - Sort expenses by category alphabetically
    When the user clicks on the "Category" column header
    Then the expenses should be sorted by category in ascending order
    And the "Category" column should display the ascending indicator "↑"
    And the expenses should match the order from "output.sorted.category_asc"

  @regression @TC-001-005
  Scenario: TC-001-005 - Sortable headers have hover effects
    When the user hovers over the "Date" column header
    Then the cursor should change to pointer
    And the header should have a visual hover effect
