import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import ExpensePieChart from './ExpensePieChart';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { getApiServiceUrl, getAuthServiceUrl } from '../utils/config';

const API_SERVICE_URL = getApiServiceUrl();
const AUTH_SERVICE_URL = getAuthServiceUrl();

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

interface User {
  id: number;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface Stats {
  total: number;
  totalAmount: number;
  count: number;
  byCategory: { categoryId: number; categoryName: string; total: number }[];
}

function Dashboard({ token, onLogout }: DashboardProps) {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({ total: 0, totalAmount: 0, count: 0, byCategory: [] });
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchUserProfile();
    fetchStats();
  }, [refreshKey]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${AUTH_SERVICE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      onLogout();
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_SERVICE_URL}/expenses/stats?period=month`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  const handleExpenseCreated = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <div className="header">
        <h1>� {t('app.title')}</h1>
        <div className="user-info">
          <LanguageSwitcher />
          {user?.avatarUrl && <img src={user.avatarUrl} alt={user.name} className="user-avatar" />}
          <span>{user?.name}</span>
          <button onClick={onLogout} className="btn btn-secondary">
            {t('app.logout')}
          </button>
        </div>
      </div>

      <div className="container">
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

        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? t('expenses.cancel') : t('expenses.addNew')}
          </button>
        </div>

        {showForm && <ExpenseForm token={token} onSuccess={handleExpenseCreated} />}

        <ExpensePieChart token={token} refreshKey={refreshKey} />

        <ExpenseList
          token={token}
          refreshKey={refreshKey}
          onUpdate={() => setRefreshKey((prev) => prev + 1)}
        />
      </div>
    </div>
  );
}

export default Dashboard;
