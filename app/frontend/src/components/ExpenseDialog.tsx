import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getApiServiceUrl } from '../utils/config';
import { getLocalizedName } from '../utils/i18n.utils';
import { Category, SubCategory, Expense } from '../types/expense.types';
import ConfirmationDialog from './ConfirmationDialog';

const API_SERVICE_URL = getApiServiceUrl();

interface ExpenseDialogProps {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expense?: Expense | null;
}

function ExpenseDialog({ token, isOpen, onClose, onSuccess, expense }: ExpenseDialogProps) {
  const { t: translation, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    subCategoryId: '',
    amount: '',
    currency: 'USD',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'credit_card',
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isEditMode = !!expense;

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (expense) {
        // Populate form with existing expense data
        setFormData({
          categoryId: expense.categoryId.toString(),
          subCategoryId: expense.subCategoryId?.toString() || '',
          amount: typeof expense.amount === 'string' ? expense.amount : expense.amount.toString(),
          currency: expense.currency || 'USD',
          description: expense.description || '',
          date: expense.date
            ? new Date(expense.date).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          paymentMethod: expense.paymentMethod || 'credit_card',
        });
      } else {
        // Reset form for new expense
        setFormData({
          categoryId: '',
          subCategoryId: '',
          amount: '',
          currency: 'USD',
          description: '',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'credit_card',
        });
      }
    }
  }, [isOpen, expense]);

  useEffect(() => {
    if (formData.categoryId) {
      fetchSubCategories(parseInt(formData.categoryId));
    } else {
      setSubCategories([]);

      setFormData((prev) => ({ ...prev, subCategoryId: '' }));
    }
  }, [formData.categoryId]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmation(false);
    setLoading(true);

    try {
      const payload = {
        categoryId: parseInt(formData.categoryId),
        subCategoryId: formData.subCategoryId ? parseInt(formData.subCategoryId) : null,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        description: formData.description,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
      };

      if (isEditMode && expense) {
        // Update existing expense
        await axios.put(`${API_SERVICE_URL}/expenses/${expense.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Create new expense
        await axios.post(`${API_SERVICE_URL}/expenses`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save expense', error);
      // Note: In production, this should show a proper error notification/toast
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? translation('expenses.edit') : translation('expenses.addNew')}</h3>
          <button className="modal-close" onClick={handleClose} disabled={loading}>
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{translation('expenses.category')}</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              <option value="">{translation('expenses.allCategories')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {getLocalizedName(category, i18n.language)}
                </option>
              ))}
            </select>
          </div>

          {subCategories.length > 0 && (
            <div className="form-group">
              <label>{translation('expenses.subCategory')}</label>
              <select
                value={formData.subCategoryId}
                onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
              >
                <option value="">-</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {getLocalizedName(subCategory, i18n.language)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label>{translation('expenses.amount')}</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                style={{ flex: 1 }}
              />
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                style={{ width: '100px' }}
              >
                <option value="USD">USD $</option>
                <option value="ILS">ILS ₪</option>
                <option value="EUR">EUR €</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{translation('expenses.date')}</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>{translation('expenses.paymentMethod')}</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            >
              <option value="credit_card">{translation('paymentMethods.credit_card')}</option>
              <option value="debit_card">{translation('paymentMethods.debit_card')}</option>
              <option value="cash">{translation('paymentMethods.cash')}</option>
              <option value="bank_transfer">{translation('paymentMethods.bank_transfer')}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{translation('expenses.description')}</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              {translation('expenses.cancel')}
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading
                ? translation('expenses.saving')
                : isEditMode
                  ? translation('expenses.save')
                  : translation('expenses.addNew')}
            </button>
          </div>
        </form>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        title={translation(isEditMode ? 'expenses.editConfirmTitle' : 'expenses.addConfirmTitle')}
        message={translation(
          isEditMode ? 'expenses.editConfirmMessage' : 'expenses.addConfirmMessage',
        )}
        onConfirm={handleConfirmSave}
        onCancel={handleCancelConfirmation}
        type="info"
      />
    </div>
  );
}

export default ExpenseDialog;
