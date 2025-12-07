import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getApiServiceUrl } from '../utils/config';
import { getLocalizedName } from '../utils/i18n.utils';
import { Expense, Category } from '../types/expense.types';
import ExpenseDialog from './ExpenseDialog';
import ConfirmationDialog from './ConfirmationDialog';

const API_SERVICE_URL = getApiServiceUrl();

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

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [refreshKey]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${API_SERVICE_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(Array.isArray(response.data) ? response.data : []);
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
      alert(translation('expenses.saveFailed'));
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

  return (
    <div>
      <h2>{translation('expenses.title')}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>{translation('expenses.date')}</th>
            <th>{translation('expenses.category')}</th>
            <th>{translation('expenses.description')}</th>
            <th>{translation('expenses.amount')}</th>
            <th>{translation('expenses.paymentMethod')}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
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
