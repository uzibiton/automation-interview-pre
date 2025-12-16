import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Navigation from './Navigation';
import DashboardHome from './DashboardHome';
import AnalyticsPage from './AnalyticsPage';
import ExpensesPage from './ExpensesPage';
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
  const [refreshKey, setRefreshKey] = useState(0);

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
      const data = response.data || {};
      setStats({
        total: data.total || 0,
        totalAmount: data.totalAmount || data.total || 0,
        count: data.count || 0,
        byCategory: Array.isArray(data.byCategory) ? data.byCategory : [],
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
      setStats({ total: 0, totalAmount: 0, count: 0, byCategory: [] });
    }
  };

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserProfile();
     
    fetchStats();
  }, [refreshKey]);

  return (
    <div>
      <Navigation userName={user?.name} userAvatar={user?.avatarUrl} onLogout={onLogout} />

      <Routes>
        <Route
          path="/"
          element={<DashboardHome stats={stats} token={token} onUpdate={handleUpdate} />}
        />
        <Route
          path="/analytics"
          element={<AnalyticsPage token={token} refreshKey={refreshKey} />}
        />
        <Route
          path="/expenses"
          element={<ExpensesPage token={token} refreshKey={refreshKey} onUpdate={handleUpdate} />}
        />
      </Routes>
    </div>
  );
}

export default Dashboard;
