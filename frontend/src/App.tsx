import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './i18n/config';
import { useTranslation } from 'react-i18next';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthCallback from './components/AuthCallback';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial direction based on language
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/auth/callback" element={<AuthCallback onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
