import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './i18n/config';
import { useTranslation } from 'react-i18next';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AuthCallback from './components/AuthCallback';
import InvitationAcceptance from './components/InvitationAcceptance';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial direction based on language
    document.documentElement.dir = i18n.language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered:', registration.scope);

            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60000); // Check every minute
          })
          .catch((error) => {
            console.log('❌ Service Worker registration failed:', error);
          });
      });
    }

    // Handle install prompt
    let _deferredPrompt: BeforeInstallPromptEvent | null = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      _deferredPrompt = e as BeforeInstallPromptEvent;
      console.log('💾 PWA install prompt ready');

      // Optionally show custom install button
      // You can add UI to trigger: deferredPrompt.prompt()
    });

    // Track installation
    window.addEventListener('appinstalled', () => {
      console.log('🎉 PWA installed successfully');
      _deferredPrompt = null;
    });
  }, []);
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
        <Route path="/invitations/:token" element={<InvitationAcceptance />} />
        <Route
          path="/*"
          element={
            token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
