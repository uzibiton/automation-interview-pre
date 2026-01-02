/**
 * Unit tests for ExpenseListItem component
 *
 * Tests the display of expense information including creator attribution
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseListItem from '../../../app/frontend/src/components/expenses/ExpenseListItem';
import { Expense, Category } from '../../../app/frontend/src/types/expense.types';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'expenses.createdBy': 'Created by',
        'expenses.edit': 'Edit',
        'expenses.delete': 'Delete',
        'paymentMethods.credit_card': 'Credit Card',
        'paymentMethods.cash': 'Cash',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'en',
    },
  }),
}));

// Mock avatar utilities
jest.mock('../../../app/frontend/src/utils/avatar.utils', () => ({
  getAvatarUrl: (_avatar: string | undefined, name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285f4&color=fff`;
  },
}));

describe('ExpenseListItem', () => {
  const mockCategories: Category[] = [
    {
      id: 1,
      nameEn: 'Food',
      nameHe: 'אוכל',
      icon: '🍕',
      color: '#FF6B6B',
    },
    {
      id: 2,
      nameEn: 'Transport',
      nameHe: 'תחבורה',
      icon: '🚗',
      color: '#4ECDC4',
    },
  ];

  const mockExpense: Expense = {
    id: 1,
    categoryId: 1,
    subCategoryId: 1,
    amount: 45.99,
    currency: 'USD',
    description: 'Weekly grocery shopping',
    date: '2024-01-15',
    paymentMethod: 'Credit Card',
    labels: ['groceries', 'weekly'],
    createdBy: 'John Doe',
  };

  const mockHandlers = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onRowClick: jest.fn(),
    onRowKeyDown: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render expense details correctly', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      expect(screen.getByText('Weekly grocery shopping')).toBeInTheDocument();
      expect(screen.getByText('USD 45.99')).toBeInTheDocument();
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('🍕')).toBeInTheDocument();
    });

    it('should format date correctly', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      // Date formatting is locale-dependent, so we check for the expected formatted output
      const expectedDate = new Date('2024-01-15').toLocaleDateString();
      const dateElement = screen.getByText(expectedDate);
      expect(dateElement).toBeInTheDocument();
    });

    it('should translate payment method', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      expect(screen.getByText('Credit Card')).toBeInTheDocument();
    });
  });

  describe('Creator Attribution', () => {
    it('should display creator information when createdBy is present', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      expect(screen.getByTestId('creator-info-1')).toBeInTheDocument();
      expect(screen.getByTestId('creator-name-1')).toHaveTextContent('Created by: John Doe');
    });

    it('should display avatar for creator', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      const avatar = screen.getByTestId('creator-avatar-1') as HTMLImageElement;
      expect(avatar).toBeInTheDocument();
      expect(avatar.src).toContain('ui-avatars.com');
      expect(avatar.alt).toBe('John Doe');
    });

    it('should not display creator info when createdBy is missing', () => {
      const expenseWithoutCreator = { ...mockExpense, createdBy: undefined };

      render(
        <table>
          <tbody>
            <ExpenseListItem
              expense={expenseWithoutCreator}
              categories={mockCategories}
              {...mockHandlers}
            />
          </tbody>
        </table>,
      );

      expect(screen.queryByTestId('creator-info-1')).not.toBeInTheDocument();
    });

    it('should apply subtle styling to creator info', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      const creatorInfo = screen.getByTestId('creator-info-1');
      expect(creatorInfo).toHaveStyle({
        fontSize: '0.85em',
        color: '#666',
      });
    });
  });

  describe('User Interactions', () => {
    it('should call onEdit when edit button is clicked', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      const editButton = screen.getByTestId('edit-button-1');
      fireEvent.click(editButton);

      expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockExpense);
      expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when delete button is clicked', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      const deleteButton = screen.getByTestId('delete-button-1');
      fireEvent.click(deleteButton);

      expect(mockHandlers.onDelete).toHaveBeenCalledWith(1);
      expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
    });

    it('should call onRowClick when row is clicked', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      const row = screen.getByTestId('expense-row-1');
      fireEvent.click(row);

      expect(mockHandlers.onRowClick).toHaveBeenCalledTimes(1);
    });

    it('should call onRowKeyDown when key is pressed on row', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      const row = screen.getByTestId('expense-row-1');
      fireEvent.keyDown(row, { key: 'Enter' });

      expect(mockHandlers.onRowKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing category gracefully', () => {
      const expenseWithInvalidCategory = { ...mockExpense, categoryId: 999 };

      render(
        <table>
          <tbody>
            <ExpenseListItem
              expense={expenseWithInvalidCategory}
              categories={mockCategories}
              {...mockHandlers}
            />
          </tbody>
        </table>,
      );

      // Should show default icon
      expect(screen.getByText('📝')).toBeInTheDocument();
    });

    it('should handle missing payment method', () => {
      const expenseWithoutPayment = { ...mockExpense, paymentMethod: '' };

      render(
        <table>
          <tbody>
            <ExpenseListItem
              expense={expenseWithoutPayment}
              categories={mockCategories}
              {...mockHandlers}
            />
          </tbody>
        </table>,
      );

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should handle string amounts', () => {
      const expenseWithStringAmount = { ...mockExpense, amount: '50.00' };

      render(
        <table>
          <tbody>
            <ExpenseListItem
              expense={expenseWithStringAmount}
              categories={mockCategories}
              {...mockHandlers}
            />
          </tbody>
        </table>,
      );

      expect(screen.getByText('USD 50.00')).toBeInTheDocument();
    });

    it('should render multiple expenses with different creators', () => {
      const expense1 = { ...mockExpense, id: 1, createdBy: 'Alice' };
      const expense2 = { ...mockExpense, id: 2, createdBy: 'Bob' };

      render(
        <table>
          <tbody>
            <ExpenseListItem expense={expense1} categories={mockCategories} {...mockHandlers} />
            <ExpenseListItem expense={expense2} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      expect(screen.getByTestId('creator-name-1')).toHaveTextContent('Created by: Alice');
      expect(screen.getByTestId('creator-name-2')).toHaveTextContent('Created by: Bob');
    });
  });

  describe('Accessibility', () => {
    it('should have proper test ids for automation', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      expect(screen.getByTestId('expense-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('edit-button-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-button-1')).toBeInTheDocument();
      expect(screen.getByTestId('creator-info-1')).toBeInTheDocument();
      expect(screen.getByTestId('creator-avatar-1')).toBeInTheDocument();
      expect(screen.getByTestId('creator-name-1')).toBeInTheDocument();
    });

    it('should have focusable row', () => {
      render(
        <table>
          <tbody>
            <ExpenseListItem expense={mockExpense} categories={mockCategories} {...mockHandlers} />
          </tbody>
        </table>,
      );

      const row = screen.getByTestId('expense-row-1');
      expect(row).toHaveAttribute('tabIndex', '0');
    });
  });
});
