import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(searchParams.get('add') === 'true');

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowForm(true);
      // Remove the query param after opening form
      searchParams.delete('add');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleExpenseCreated = () => {
    setShowForm(false);
    onUpdate();
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>{t('expenses.title')}</h2>
        <p className="page-description">{t('expenses.pageDescription')}</p>
      </div>

      <div className="page-actions-row">
        <Link to="/analytics" className="btn btn-secondary">
          {t('expenses.viewAnalytics')}
        </Link>
      </div>

      <ExpenseList token={token} refreshKey={refreshKey} onUpdate={onUpdate} />
    </div>
  );
}

export default ExpensesPage;
