import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExpensePieChart from './ExpensePieChart';

interface AnalyticsPageProps {
  token: string;
  refreshKey: number;
}

function AnalyticsPage({ token, refreshKey }: AnalyticsPageProps) {
  const { translate } = useTranslation();

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>{translate('nav.analytics')}</h2>
          <p className="page-description">{translate('analytics.description')}</p>
        </div>
        <Link to="/expenses/new" className="btn btn-primary">
          {translate('expenses.addExpense')}
        </Link>
      </div>

      <ExpensePieChart token={token} refreshKey={refreshKey} />

      <div className="page-actions">
        <Link to="/expenses" className="btn btn-secondary">
          {translate('analytics.viewExpenses')}
        </Link>
      </div>
    </div>
  );
}

export default AnalyticsPage;
