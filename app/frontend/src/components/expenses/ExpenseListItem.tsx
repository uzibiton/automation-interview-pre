import React from 'react';
import { useTranslation } from 'react-i18next';
import { Expense, Category } from '../../types/expense.types';
import { getLocalizedName } from '../../utils/i18n.utils';
import { parseExpenseAmount } from '../../utils/expense.utils';
import { getAvatarUrl } from '../../utils/avatar.utils';

interface ExpenseListItemProps {
  expense: Expense;
  index: number;
  categories: Category[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  onRowClick: (expense: Expense, event: React.MouseEvent<HTMLTableRowElement>) => void;
  onRowKeyDown: (expense: Expense, event: React.KeyboardEvent<HTMLTableRowElement>) => void;
}

function ExpenseListItem({
  expense,
  index,
  categories,
  onEdit,
  onDelete,
  onRowClick,
  onRowKeyDown,
}: ExpenseListItemProps) {
  const { t: translation, i18n } = useTranslation();

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return '';
    return getLocalizedName(category, i18n.language);
  };

  const getCategoryIcon = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || '📝';
  };

  const avatarUrl = expense.createdBy ? getAvatarUrl(undefined, expense.createdBy) : '';

  return (
    <tr
      onClick={(e) => onRowClick(expense, e)}
      onKeyDown={(e) => onRowKeyDown(expense, e)}
      tabIndex={0}
      data-testid={`expenses-table-row-${index}`}
    >
      <td data-testid={`expenses-table-row-${index}-cell-date`}>
        {new Date(expense.date).toLocaleDateString()}
      </td>
      <td data-testid={`expenses-table-row-${index}-cell-category`}>
        <span style={{ fontSize: '1.5em', marginRight: '8px' }}>
          {getCategoryIcon(expense.categoryId)}
        </span>
        {getCategoryName(expense.categoryId)}
      </td>
      <td data-testid={`expenses-table-row-${index}-cell-description`}>{expense.description}</td>
      <td style={{ fontWeight: 'bold' }} data-testid={`expenses-table-row-${index}-cell-amount`}>
        {expense.currency} {parseExpenseAmount(expense.amount).toFixed(2)}
      </td>
      <td data-testid={`expenses-table-row-${index}-cell-payment-method`}>
        {expense.paymentMethod
          ? translation(`paymentMethods.${expense.paymentMethod.toLowerCase().replace(/ /g, '_')}`)
          : '-'}
      </td>
      <td data-testid={`expenses-table-row-${index}-cell-created-by`}>
        {expense.createdBy || '-'}
      </td>
      <td data-testid={`expenses-table-row-${index}-cell-actions`}>
        <button
          onClick={() => onEdit(expense)}
          className="btn btn-secondary btn-sm"
          style={{ marginRight: '8px' }}
          data-testid={`expenses-table-row-${index}-edit-button`}
        >
          {translation('expenses.edit')}
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="btn btn-danger btn-sm"
          data-testid={`expenses-table-row-${index}-delete-button`}
        >
          {translation('expenses.delete')}
        </button>
      </td>
    </tr>
  );
}

export default ExpenseListItem;
