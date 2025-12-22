import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExpenseDialog from './ExpenseDialog';
import GroupCreationDialog from './groups/GroupCreationDialog';

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
  const { t: translation } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDialog, setShowDialog] = useState(false);
  const [showGroupDialog, setShowGroupDialog] = useState(false);

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

  const handleGroupSuccess = (groupId: string) => {
    console.log('Group created successfully with ID:', groupId);
    // Refresh the dashboard to show updated data
    onUpdate();
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h2>{translation('nav.dashboard')}</h2>
          <p className="page-description">{translation('dashboard.description')}</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>{translation('expenses.thisMonth')}</h3>
          <div className="value">${stats.totalAmount?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="stat-card">
          <h3>{translation('stats.count')}</h3>
          <div className="value" style={{ color: '#2196f3' }}>
            {stats.count || 0}
          </div>
        </div>
        <div className="stat-card">
          <h3>{translation('stats.byCategory')}</h3>
          <div className="value" style={{ fontSize: '14px' }}>
            {stats.byCategory?.length || 0} {translation('nav.categories')}
          </div>
        </div>
      </div>

      <div className="quick-links">
        <h3>{translation('dashboard.quickLinks')}</h3>
        <div className="quick-links-grid">
          <Link to="/analytics" className="quick-link-card">
            <div className="quick-link-icon">📊</div>
            <div className="quick-link-content">
              <h4>{translation('nav.analytics')}</h4>
              <p>{translation('dashboard.viewCharts')}</p>
            </div>
          </Link>
          <Link to="/expenses" className="quick-link-card">
            <div className="quick-link-icon">📝</div>
            <div className="quick-link-content">
              <h4>{translation('nav.expenses')}</h4>
              <p>{translation('dashboard.manageExpenses')}</p>
            </div>
          </Link>
          <button className="quick-link-card" onClick={() => setShowGroupDialog(true)}>
            <div className="quick-link-icon">👥</div>
            <div className="quick-link-content">
              <h4>Groups</h4>
              <p>Create and manage groups</p>
            </div>
          </button>
        </div>
      </div>

      <ExpenseDialog
        token={token}
        isOpen={showDialog}
        onClose={handleCloseDialog}
        onSuccess={handleExpenseCreated}
      />

      <GroupCreationDialog
        isOpen={showGroupDialog}
        onClose={() => setShowGroupDialog(false)}
        onSuccess={handleGroupSuccess}
      />
    </div>
  );
}

export default DashboardHome;
