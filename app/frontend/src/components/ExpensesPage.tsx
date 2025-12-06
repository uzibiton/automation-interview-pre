import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExpenseList from './ExpenseList';
import ExpenseDialog from './ExpenseDialog';

interface ExpensesPageProps {
  token: string;
  refreshKey: number;
  onUpdate: () => void;
}

function ExpensesPage({ token, refreshKey, onUpdate }: ExpensesPageProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDialog, setShowDialog] = useState(searchParams.get('add') === 'true');

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowDialog(true);
      // Remove the query param after opening dialog
      searchParams.delete('add');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleExpenseCreated = () => {
    onUpdate();
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
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

      <ExpenseDialog
        token={token}
        isOpen={showDialog}
        onClose={handleCloseDialog}
        onSuccess={handleExpenseCreated}
      />
    </div>
  );
}

export default ExpensesPage;
