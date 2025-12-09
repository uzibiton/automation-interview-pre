import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getApiServiceUrl } from '../utils/config';
import { getLocalizedName } from '../utils/i18n.utils';
import { Expense, Category } from '../types/expense.types';
import ExpenseDialog from './ExpenseDialog';
import ConfirmationDialog from './ConfirmationDialog';

const API_SERVICE_URL = getApiServiceUrl();

type SortField = 'date' | 'description' | 'category' | 'amount' | null;
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
  const [deletingExpenseId, setDeletingExpenseId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [refreshKey]);

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
        case 'date':
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          compareResult = dateA - dateB;
          break;
        case 'description':
          compareResult = a.description.localeCompare(b.description);
          break;
        case 'category':
          const categoryA = getCategoryName(a.categoryId);
          const categoryB = getCategoryName(b.categoryId);
          compareResult = categoryA.localeCompare(categoryB);
          break;
        case 'amount':
          const amountA = typeof a.amount === 'string' ? parseFloat(a.amount) : a.amount;
          const amountB = typeof b.amount === 'string' ? parseFloat(b.amount) : b.amount;
          compareResult = amountA - amountB;
          break;
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
              {translation('expenses.date')}{getSortIcon('date')}
            </th>
            <th className="sortable-header" onClick={() => handleSort('category')}>
              {translation('expenses.category')}{getSortIcon('category')}
            </th>
            <th className="sortable-header" onClick={() => handleSort('description')}>
              {translation('expenses.description')}{getSortIcon('description')}
            </th>
            <th className="sortable-header" onClick={() => handleSort('amount')}>
              {translation('expenses.amount')}{getSortIcon('amount')}
            </th>
            <th>{translation('expenses.paymentMethod')}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedExpenses.map((expense) => (
            <tr key={expense.id}>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
              <td>
                <span style={{ fontSize: '1.5em', marginRight: '8px' }}>
                  {getCategoryIcon(expense.categoryId)}
                </span>
                {getCategoryName(expense.categoryId)}
              </td>
              <td>{expense.description}</td>
              <td style={{ fontWeight: 'bold' }}>
                {expense.currency}{' '}
                {(typeof expense.amount === 'string'
                  ? parseFloat(expense.amount)
                  : expense.amount
                ).toFixed(2)}
              </td>
              <td>{expense.paymentMethod ? translation(`paymentMethods.${expense.paymentMethod}`) : '-'}</td>
              <td>
                <button
                  onClick={() => handleEdit(expense)}
                  className="btn btn-secondary btn-sm"
                  style={{ marginRight: '8px' }}
                >
                  {translation('expenses.edit')}
                </button>
                <button
                  onClick={() => handleDeleteClick(expense.id)}
                  className="btn btn-danger btn-sm"
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

      <ConfirmationDialog
        isOpen={!!deletingExpenseId}
        title={translation('expenses.deleteConfirmTitle')}
        message={translation('expenses.deleteConfirmMessage')}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="danger"
      />
    </div>
  );
}

export default ExpenseList;
