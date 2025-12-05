import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getApiServiceUrl } from '../utils/config';

const API_SERVICE_URL = getApiServiceUrl();

interface Expense {
  id: number;
  amount: string | number;
  currency: string;
  categoryId: number;
  subCategoryId: number;
  description: string;
  date: string;
  paymentMethod: string;
  labels: string[];
}

interface Category {
  id: number;
  nameEn: string;
  nameHe: string;
  icon: string;
  color: string;
}

interface ExpenseListProps {
  token: string;
  refreshKey: number;
  onUpdate: () => void;
}

function ExpenseList({ token, refreshKey, onUpdate }: ExpenseListProps) {
  const { t, i18n } = useTranslation();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
    return i18n.language === 'he' ? category.nameHe : category.nameEn;
  };

  const getCategoryIcon = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || '📝';
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('expenses.delete') + '?')) return;

    try {
      await axios.delete(`${API_SERVICE_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate();
    } catch (error) {
      console.error('Failed to delete expense', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
        <p>{t('expenses.noExpenses')}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>{t('expenses.title')}</h2>
      <table className="table">
        <thead>
          <tr>
            <th>{t('expenses.date')}</th>
            <th>{t('expenses.category')}</th>
            <th>{t('expenses.description')}</th>
            <th>{t('expenses.amount')}</th>
            <th>{t('expenses.paymentMethod')}</th>
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
              <td>{expense.paymentMethod ? t(`paymentMethods.${expense.paymentMethod}`) : '-'}</td>
              <td>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="btn btn-danger btn-sm"
                  style={{ fontSize: '0.8em', padding: '4px 8px' }}
                >
                  {t('expenses.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;
