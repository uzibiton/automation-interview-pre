import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Stats {
  total: number;
  totalAmount: number;
  count: number;
  byCategory: { categoryId: number; categoryName: string; total: number }[];
}

interface DashboardHomeProps {
  stats: Stats;
}

function DashboardHome({ stats }: DashboardHomeProps) {
  const { translate } = useTranslation();

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>{translate('nav.dashboard')}</h2>
          <p className="page-description">{translate('dashboard.description')}</p>
        </div>
        <Link to="/expenses/new" className="btn btn-primary">
          {translate('expenses.addExpense')}
        </Link>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>{translate('expenses.thisMonth')}</h3>
          <div className="value">${stats.totalAmount?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="stat-card">
          <h3>{translate('stats.count')}</h3>
          <div className="value" style={{ color: '#2196f3' }}>
            {stats.count || 0}
          </div>
        </div>
        <div className="stat-card">
          <h3>{translate('stats.byCategory')}</h3>
          <div className="value" style={{ fontSize: '14px' }}>
            {stats.byCategory?.length || 0} {translate('nav.categories')}
          </div>
        </div>
      </div>

      <div className="quick-links">
        <h3>{translate('dashboard.quickLinks')}</h3>
        <div className="quick-links-grid">
          <Link to="/analytics" className="quick-link-card">
            <div className="quick-link-icon">📊</div>
            <div className="quick-link-content">
              <h4>{translate('nav.analytics')}</h4>
              <p>{translate('dashboard.viewCharts')}</p>
            </div>
          </Link>
          <Link to="/expenses" className="quick-link-card">
            <div className="quick-link-icon">📝</div>
            <div className="quick-link-content">
              <h4>{translate('nav.expenses')}</h4>
              <p>{translate('dashboard.manageExpenses')}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
