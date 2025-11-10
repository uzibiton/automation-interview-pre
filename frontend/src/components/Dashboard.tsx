import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

const API_SERVICE_URL = import.meta.env.VITE_API_SERVICE_URL || 'http://localhost:3002';

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
  pending: number;
  in_progress: number;
  completed: number;
}

function Dashboard({ token, onLogout }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchUserProfile();
    fetchStats();
  }, [refreshKey]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/profile', {
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
      const response = await axios.get(`${API_SERVICE_URL}/tasks/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats', error);
    }
  };

  const handleTaskCreated = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <div className="header">
        <h1>📋 Task Manager</h1>
        <div className="user-info">
          {user?.avatarUrl && <img src={user.avatarUrl} alt={user.name} className="user-avatar" />}
          <span>{user?.name}</span>
          <button onClick={onLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <div className="value">{stats.total}</div>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <div className="value" style={{ color: '#ffc107' }}>
              {stats.pending}
            </div>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <div className="value" style={{ color: '#2196f3' }}>
              {stats.in_progress}
            </div>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <div className="value" style={{ color: '#4caf50' }}>
              {stats.completed}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {showForm && <TaskForm token={token} onSuccess={handleTaskCreated} />}

        <TaskList
          token={token}
          refreshKey={refreshKey}
          onUpdate={() => setRefreshKey((prev) => prev + 1)}
        />
      </div>
    </div>
  );
}

export default Dashboard;
