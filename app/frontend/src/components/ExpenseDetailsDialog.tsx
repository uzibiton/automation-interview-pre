import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getApiServiceUrl } from '../utils/config';
import { getLocalizedName } from '../utils/i18n.utils';
import { parseExpenseAmount } from '../utils/expense.utils';
import { Category, SubCategory, Expense } from '../types/expense.types';

const API_SERVICE_URL = getApiServiceUrl();

interface ExpenseDetailsDialogProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
}

function ExpenseDetailsDialog({ token, isOpen, onClose, expense }: ExpenseDetailsDialogProps) {
  const { t: translation, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

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

  const fetchSubCategories = async (categoryId: number) => {
    try {
      const response = await axios.get(
        `${API_SERVICE_URL}/expenses/categories/${categoryId}/subcategories`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setSubCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch subcategories', error);
      setSubCategories([]);
    }
  };

  useEffect(() => {
    if (isOpen && expense) {
      // Fetch categories when dialog opens - this is an acceptable use of setState in effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCategories();
      if (expense.categoryId) {
         
        fetchSubCategories(expense.categoryId);
      }
    }
  }, [isOpen, expense]);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return '';
    return getLocalizedName(category, i18n.language);
  };

  const getCategoryIcon = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || '📝';
  };

  const getSubCategoryName = (subCategoryId: number) => {
    const subCategory = subCategories.find((sc) => sc.id === subCategoryId);
    if (!subCategory) return '';
    return getLocalizedName(subCategory, i18n.language);
  };

  if (!isOpen || !expense) return null;

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="expense-details-dialog">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{translation('expenses.viewDetails')}</h3>
          <button className="modal-close" onClick={onClose} data-testid="close-details-button">
            ✕
          </button>
        </div>
        <div style={{ padding: '20px' }}>
          <div className="detail-row">
            <label className="detail-label">{translation('expenses.category')}</label>
            <div className="detail-value">
              <span style={{ fontSize: '1.5em', marginRight: '8px' }}>
                {getCategoryIcon(expense.categoryId)}
              </span>
              {getCategoryName(expense.categoryId)}
            </div>
          </div>

          {expense.subCategoryId && (
            <div className="detail-row">
              <label className="detail-label">{translation('expenses.subCategory')}</label>
              <div className="detail-value">{getSubCategoryName(expense.subCategoryId)}</div>
            </div>
          )}

          <div className="detail-row">
            <label className="detail-label">{translation('expenses.amount')}</label>
            <div className="detail-value" style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
              {expense.currency} {parseExpenseAmount(expense.amount).toFixed(2)}
            </div>
          </div>

          <div className="detail-row">
            <label className="detail-label">{translation('expenses.date')}</label>
            <div className="detail-value">{new Date(expense.date).toLocaleDateString()}</div>
          </div>

          <div className="detail-row">
            <label className="detail-label">{translation('expenses.paymentMethod')}</label>
            <div className="detail-value">
              {expense.paymentMethod
                ? translation(
                    `paymentMethods.${expense.paymentMethod.toLowerCase().replace(/ /g, '_')}`,
                  )
                : '-'}
            </div>
          </div>

          <div className="detail-row">
            <label className="detail-label">{translation('expenses.description')}</label>
            <div className="detail-value">{expense.description || '-'}</div>
          </div>
        </div>
        <div className="modal-actions" style={{ padding: '20px', paddingTop: '0' }}>
          <button className="btn btn-primary" onClick={onClose} data-testid="close-details-ok">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetailsDialog;
