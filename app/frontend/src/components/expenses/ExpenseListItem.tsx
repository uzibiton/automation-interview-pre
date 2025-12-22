import React from 'react';
import { useTranslation } from 'react-i18next';
import { Expense, Category } from '../../types/expense.types';
import { getLocalizedName } from '../../utils/i18n.utils';
import { parseExpenseAmount } from '../../utils/expense.utils';
import { getAvatarUrl } from '../../utils/avatar.utils';

interface ExpenseListItemProps {
  expense: Expense;
  categories: Category[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
  onRowClick: (expense: Expense, event: React.MouseEvent<HTMLTableRowElement>) => void;
  onRowKeyDown: (expense: Expense, event: React.KeyboardEvent<HTMLTableRowElement>) => void;
}

function ExpenseListItem({
  expense,
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
      data-testid={`expense-row-${expense.id}`}
    >
      <td>{new Date(expense.date).toLocaleDateString()}</td>
      <td>
        <span style={{ fontSize: '1.5em', marginRight: '8px' }}>
          {getCategoryIcon(expense.categoryId)}
        </span>
        {getCategoryName(expense.categoryId)}
      </td>
      <td>
        <div>{expense.description}</div>
        {expense.createdBy && (
          <div
            style={{
              fontSize: '0.85em',
              color: '#666',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            data-testid={`creator-info-${expense.id}`}
          >
            <img
              src={avatarUrl}
              alt={expense.createdBy}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                verticalAlign: 'middle',
              }}
              data-testid={`creator-avatar-${expense.id}`}
            />
            <span data-testid={`creator-name-${expense.id}`}>
              {translation('expenses.createdBy')}: {expense.createdBy}
            </span>
          </div>
        )}
      </td>
      <td style={{ fontWeight: 'bold' }}>
        {expense.currency} {parseExpenseAmount(expense.amount).toFixed(2)}
      </td>
      <td>
        {expense.paymentMethod
          ? translation(`paymentMethods.${expense.paymentMethod.toLowerCase().replace(/ /g, '_')}`)
          : '-'}
      </td>
      <td>
        <button
          onClick={() => onEdit(expense)}
          className="btn btn-secondary btn-sm"
          style={{ marginRight: '8px' }}
          data-testid={`edit-button-${expense.id}`}
        >
          {translation('expenses.edit')}
        </button>
        <button
          onClick={() => onDelete(expense.id)}
          className="btn btn-danger btn-sm"
          data-testid={`delete-button-${expense.id}`}
        >
          {translation('expenses.delete')}
        </button>
      </td>
    </tr>
  );
}

export default ExpenseListItem;
