import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedName } from '../utils/i18n.utils';
import { Category } from '../types/expense.types';

interface ParsedExpense {
  amount: number | null;
  currency: string;
  categoryId: number | null;
  description: string;
  date: string;
  paymentMethod: string;
  confidence: number;
}

interface ExpensePreviewProps {
  parsedExpense: ParsedExpense;
  categories: Category[];
  onApprove: () => void;
  onEdit: () => void;
  onCancel: () => void;
  loading?: boolean;
}

function ExpensePreview({
  parsedExpense,
  categories,
  onApprove,
  onEdit,
  onCancel,
  loading = false,
}: ExpensePreviewProps) {
  const { t: translation, i18n } = useTranslation();

  const category = categories.find((c) => c.id === parsedExpense.categoryId);
  const confidenceLevel =
    parsedExpense.confidence >= 0.8 ? 'high' : parsedExpense.confidence >= 0.6 ? 'medium' : 'low';

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      USD: '$',
      ILS: '₪',
      EUR: '€',
    };
    return symbols[currency] || currency;
  };

  return (
    <div className="expense-preview-container">
      <div className="expense-preview-header">
        <h3>{translation('chat.preview.title')}</h3>
        <div className={`confidence-badge confidence-${confidenceLevel}`}>
          {translation(`chat.preview.confidence.${confidenceLevel}`)} (
          {Math.round(parsedExpense.confidence * 100)}%)
        </div>
      </div>

      <div className="expense-preview-content">
        <div className="expense-preview-field">
          <span className="field-label">{translation('expenses.amount')}:</span>
          <span className="field-value amount-value">
            {parsedExpense.amount !== null
              ? `${getCurrencySymbol(parsedExpense.currency)}${parsedExpense.amount.toFixed(2)}`
              : translation('chat.preview.notDetected')}
          </span>
        </div>

        <div className="expense-preview-field">
          <span className="field-label">{translation('expenses.category')}:</span>
          <span className="field-value">
            {category ? (
              <>
                {category.icon} {getLocalizedName(category, i18n.language)}
              </>
            ) : (
              translation('chat.preview.notDetected')
            )}
          </span>
        </div>

        <div className="expense-preview-field">
          <span className="field-label">{translation('expenses.date')}:</span>
          <span className="field-value">{parsedExpense.date}</span>
        </div>

        <div className="expense-preview-field">
          <span className="field-label">{translation('expenses.paymentMethod')}:</span>
          <span className="field-value">
            {translation(`paymentMethods.${parsedExpense.paymentMethod}`)}
          </span>
        </div>

        <div className="expense-preview-field">
          <span className="field-label">{translation('expenses.description')}:</span>
          <span className="field-value description-value">{parsedExpense.description}</span>
        </div>
      </div>

      <div className="expense-preview-actions">
        <button
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
          aria-label={translation('expenses.cancel')}
        >
          {translation('expenses.cancel')}
        </button>
        <button
          className="btn btn-secondary"
          onClick={onEdit}
          disabled={loading}
          aria-label={translation('expenses.edit')}
        >
          {translation('expenses.edit')}
        </button>
        <button
          className="btn btn-primary"
          onClick={onApprove}
          disabled={loading || parsedExpense.amount === null}
          aria-label={translation('chat.preview.approve')}
        >
          {loading ? translation('expenses.saving') : translation('chat.preview.approve')}
        </button>
      </div>
    </div>
  );
}

export default ExpensePreview;
