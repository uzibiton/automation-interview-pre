import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';

interface ExpensesPageProps {
  token: string;
  refreshKey: number;
  onUpdate: () => void;
}

function ExpensesPage({ token, refreshKey, onUpdate }: ExpensesPageProps) {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);

  const handleExpenseCreated = () => {
    setShowForm(false);
    onUpdate();
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>{t('expenses.title')}</h2>
        <p className="page-description">{t('expenses.pageDescription')}</p>
      </div>

      <div className="page-actions-row">
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? t('expenses.cancel') : t('expenses.addNew')}
        </button>
        <Link to="/analytics" className="btn btn-secondary">
          {t('expenses.viewAnalytics')}
        </Link>
      </div>

      {showForm && <ExpenseForm token={token} onSuccess={handleExpenseCreated} />}

      <ExpenseList token={token} refreshKey={refreshKey} onUpdate={onUpdate} />
    </div>
  );
}

export default ExpensesPage;
