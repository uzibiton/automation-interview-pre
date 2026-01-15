import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExpensePieChart from './ExpensePieChart';

interface AnalyticsPageProps {
  token: string;
  refreshKey: number;
}

function AnalyticsPage({ token, refreshKey }: AnalyticsPageProps) {
  const { t } = useTranslation();

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>{t('nav.analytics')}</h2>
          <p className="page-description">{t('analytics.description')}</p>
        </div>
      </div>

      <ExpensePieChart token={token} refreshKey={refreshKey} />

      <div className="page-actions">
        <Link
          to="/expenses"
          className="btn btn-secondary"
          data-testid="analytics-view-expenses-link"
        >
          {t('analytics.viewExpenses')}
        </Link>
      </div>
    </div>
  );
}

export default AnalyticsPage;
