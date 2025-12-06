import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { getApiServiceUrl } from '../utils/config';

const API_SERVICE_URL = getApiServiceUrl();

interface Category {
  id: number;
  nameEn: string;
  nameHe: string;
  icon: string;
  color: string;
}

interface SubCategory {
  id: number;
  categoryId: number;
  nameEn: string;
  nameHe: string;
}

interface ExpenseFormProps {
  token: string;
  onSuccess: () => void;
}

function ExpenseForm({ token, onSuccess }: ExpenseFormProps) {
  const { t, i18n } = useTranslation();
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

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_SERVICE_URL}/expenses`,
        {
          categoryId: parseInt(formData.categoryId),
          subCategoryId: formData.subCategoryId ? parseInt(formData.subCategoryId) : null,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          description: formData.description,
          date: formData.date,
          paymentMethod: formData.paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      onSuccess();
      setFormData({
        categoryId: '',
        subCategoryId: '',
        amount: '',
        currency: 'USD',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'credit_card',
      });
    } catch (error) {
      console.error('Failed to create expense', error);
      alert('Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category: Category) => {
    return i18n.language === 'he' ? category.nameHe : category.nameEn;
  };

  const getSubCategoryName = (subCategory: SubCategory) => {
    return i18n.language === 'he' ? subCategory.nameHe : subCategory.nameEn;
  };

  return (
    <div className="form-container">
      <h3>{t('expenses.addNew')}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>{t('expenses.category')}</label>
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            required
          >
            <option value="">{t('expenses.allCategories')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {getCategoryName(category)}
              </option>
            ))}
          </select>
        </div>

        {subCategories.length > 0 && (
          <div className="form-group">
            <label>{t('expenses.subCategory')}</label>
            <select
              value={formData.subCategoryId}
              onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
            >
              <option value="">-</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {getSubCategoryName(subCategory)}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>{t('expenses.amount')}</label>
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
          <label>{t('expenses.date')}</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>{t('expenses.paymentMethod')}</label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
          >
            <option value="credit_card">{t('paymentMethods.credit_card')}</option>
            <option value="debit_card">{t('paymentMethods.debit_card')}</option>
            <option value="cash">{t('paymentMethods.cash')}</option>
            <option value="bank_transfer">{t('paymentMethods.bank_transfer')}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{t('expenses.description')}</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : t('expenses.save')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
