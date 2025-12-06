import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExpenseDialog from './ExpenseDialog';

interface Stats {
  total: number;
  totalAmount: number;
  count: number;
  byCategory: { categoryId: number; categoryName: string; total: number }[];
}

interface DashboardHomeProps {
  stats: Stats;
  token: string;
  onUpdate: () => void;
}

function DashboardHome({ stats, token, onUpdate }: DashboardHomeProps) {
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
        <div>
          <h2>{t('nav.dashboard')}</h2>
          <p className="page-description">{t('dashboard.description')}</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>{t('expenses.thisMonth')}</h3>
          <div className="value">${stats.totalAmount?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="stat-card">
          <h3>{t('stats.count')}</h3>
          <div className="value" style={{ color: '#2196f3' }}>
            {stats.count || 0}
          </div>
        </div>
        <div className="stat-card">
          <h3>{t('stats.byCategory')}</h3>
          <div className="value" style={{ fontSize: '14px' }}>
            {stats.byCategory?.length || 0} {t('nav.categories')}
          </div>
        </div>
      </div>

      <div className="quick-links">
        <h3>{t('dashboard.quickLinks')}</h3>
        <div className="quick-links-grid">
          <Link to="/analytics" className="quick-link-card">
            <div className="quick-link-icon">📊</div>
            <div className="quick-link-content">
              <h4>{t('nav.analytics')}</h4>
              <p>{t('dashboard.viewCharts')}</p>
            </div>
          </Link>
          <Link to="/expenses" className="quick-link-card">
            <div className="quick-link-icon">📝</div>
            <div className="quick-link-content">
              <h4>{t('nav.expenses')}</h4>
              <p>{t('dashboard.manageExpenses')}</p>
            </div>
          </Link>
        </div>
      </div>

      <ExpenseDialog
        token={token}
        isOpen={showDialog}
        onClose={handleCloseDialog}
        onSuccess={handleExpenseCreated}
      />
    </div>
  );
}

export default DashboardHome;
