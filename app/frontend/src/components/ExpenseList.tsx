import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getApiServiceUrl } from '../utils/config';
import { getLocalizedName } from '../utils/i18n.utils';
import { parseExpenseAmount } from '../utils/expense.utils';
import { Expense, Category } from '../types/expense.types';
import ExpenseDialog from './ExpenseDialog';
import ExpenseDetailsDialog from './ExpenseDetailsDialog';
import ConfirmationDialog from './ConfirmationDialog';
import ContextMenu, { ContextMenuItem } from './ContextMenu';

const API_SERVICE_URL = getApiServiceUrl();

type SortField = 'date' | 'description' | 'category' | 'amount' | 'paymentMethod' | null;
type SortDirection = 'asc' | 'desc' | null;

interface ExpenseListProps {
  token: string;
  refreshKey: number;
  onUpdate: () => void;
}

function ExpenseList({ token, refreshKey, onUpdate }: ExpenseListProps) {
  const { t: translation, i18n } = useTranslation();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    expense: Expense | null;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    expense: null,
  });

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_SERVICE_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedExpenses = Array.isArray(response.data) ? response.data : [];
      setExpenses(fetchedExpenses);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
      setExpenses([]);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_SERVICE_URL}/expenses/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchExpenses();
     
    fetchCategories();
  }, [refreshKey]);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return '';
    return getLocalizedName(category, i18n.language);
  };

  const getCategoryIcon = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || '📝';
  };

  const handleDeleteClick = (id: number) => {
    setDeletingExpenseId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingExpenseId) return;

    try {
      await axios.delete(`${API_SERVICE_URL}/expenses/${deletingExpenseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletingExpenseId(null);
      onUpdate();
    } catch (error) {
      console.error('Failed to delete expense', error);
      setDeletingExpenseId(null);
      // Note: In production, this should show a proper error notification/toast
    }
  };

  const handleCancelDelete = () => {
    setDeletingExpenseId(null);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleCloseDialog = () => {
    setEditingExpense(null);
  };

  const handleExpenseUpdated = () => {
    onUpdate();
  };

  const handleRowClick = (expense: Expense, event: React.MouseEvent<HTMLTableRowElement>) => {
    // Don't open context menu if clicking on action buttons
    const target = event.target as HTMLElement | null;
    if (target && target.closest('button')) {
      return;
    }

    event.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      expense,
    });
  };

  const handleRowKeyDown = (expense: Expense, event: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setContextMenu({
        isOpen: true,
        position: { x: rect.left + 20, y: rect.top + 20 },
        expense,
      });
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      expense: null,
    });
  };

  const handleShowDetails = () => {
    if (contextMenu.expense) {
      setViewingExpense(contextMenu.expense);
    }
  };

  const handleEditFromMenu = () => {
    if (contextMenu.expense) {
      setEditingExpense(contextMenu.expense);
    }
  };

  const handleDeleteFromMenu = () => {
    if (contextMenu.expense) {
      setDeletingExpenseId(contextMenu.expense.id);
    }
  };

  const contextMenuItems: ContextMenuItem[] = [
    {
      label: translation('expenses.show'),
      onClick: handleShowDetails,
      icon: '👁️',
      testId: 'context-menu-show',
    },
    {
      label: translation('expenses.edit'),
      onClick: handleEditFromMenu,
      icon: '✏️',
      testId: 'context-menu-edit',
    },
    {
      label: translation('expenses.delete'),
      onClick: handleDeleteFromMenu,
      icon: '🗑️',
      testId: 'context-menu-delete',
    },
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      // New field: start with ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedExpenses = () => {
    if (!sortField || !sortDirection) {
      // Default sort: date descending when no sort is active
      return [...expenses].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    }

    return [...expenses].sort((a, b) => {
      let compareResult = 0;

      switch (sortField) {
        case 'date': {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          compareResult = dateA - dateB;
          break;
        }
        case 'description':
          compareResult = a.description.localeCompare(b.description);
          break;
        case 'category': {
          const categoryA = getCategoryName(a.categoryId) || 'Unknown';
          const categoryB = getCategoryName(b.categoryId) || 'Unknown';
          compareResult = categoryA.localeCompare(categoryB);
          break;
        }
        case 'amount': {
          const amountA = typeof a.amount === 'string' ? parseFloat(a.amount) : a.amount;
          const amountB = typeof b.amount === 'string' ? parseFloat(b.amount) : b.amount;
          // Handle NaN cases by treating them as 0
          const validAmountA = isNaN(amountA) ? 0 : amountA;
          const validAmountB = isNaN(amountB) ? 0 : amountB;
          compareResult = validAmountA - validAmountB;
          break;
        }
        case 'paymentMethod': {
          const paymentA = a.paymentMethod || '';
          const paymentB = b.paymentMethod || '';
          compareResult = paymentA.localeCompare(paymentB);
          break;
        }
      }

      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return null;
    }
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
        <p>{translation('expenses.noExpenses')}</p>
      </div>
    );
  }

  const sortedExpenses = getSortedExpenses();

  return (
    <div>
      <h2>{translation('expenses.title')}</h2>
      <table className="table">
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
            <th className="sortable-header" onClick={() => handleSort('description')}>
              {translation('expenses.description')}
              {getSortIcon('description')}
            </th>
            <th className="sortable-header" onClick={() => handleSort('amount')}>
              {translation('expenses.amount')}
              {getSortIcon('amount')}
            </th>
            <th className="sortable-header" onClick={() => handleSort('paymentMethod')}>
              {translation('expenses.paymentMethod')}
              {getSortIcon('paymentMethod')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.map((expense) => (
            <tr
              key={expense.id}
              onClick={(e) => handleRowClick(expense, e)}
              onKeyDown={(e) => handleRowKeyDown(expense, e)}
              tabIndex={0}
              data-testid={`expense-row-${expense.id}`}
            >
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>
                <span style={{ fontSize: '1.5em', marginRight: '8px' }}>
                  {getCategoryIcon(expense.categoryId)}
                </span>
                {getCategoryName(expense.categoryId)}
              </td>
              <td>{expense.description}</td>
              <td style={{ fontWeight: 'bold' }}>
                {expense.currency} {parseExpenseAmount(expense.amount).toFixed(2)}
              </td>
              <td>
                {expense.paymentMethod
                  ? translation(
                      `paymentMethods.${expense.paymentMethod.toLowerCase().replace(/ /g, '_')}`,
                    )
                  : '-'}
              </td>
              <td>
                <button
                  onClick={() => handleEdit(expense)}
                  className="btn btn-secondary btn-sm"
                  style={{ marginRight: '8px' }}
                  data-testid={`edit-button-${expense.id}`}
                >
                  {translation('expenses.edit')}
                </button>
                <button
                  onClick={() => handleDeleteClick(expense.id)}
                  className="btn btn-danger btn-sm"
                  data-testid={`delete-button-${expense.id}`}
                >
                  {translation('expenses.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ExpenseDialog
        token={token}
        isOpen={!!editingExpense}
        onClose={handleCloseDialog}
        onSuccess={handleExpenseUpdated}
        expense={editingExpense}
      />

      <ExpenseDetailsDialog
        token={token}
        isOpen={!!viewingExpense}
        onClose={() => setViewingExpense(null)}
        expense={viewingExpense}
      />

      <ConfirmationDialog
        isOpen={!!deletingExpenseId}
        title={translation('expenses.deleteConfirmTitle')}
        message={translation('expenses.deleteConfirmMessage')}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="danger"
      />

      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        items={contextMenuItems}
        onClose={handleCloseContextMenu}
      />
    </div>
  );
}

export default ExpenseList;
