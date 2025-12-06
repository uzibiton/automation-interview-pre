import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface NavigationProps {
  userName?: string;
  userAvatar?: string;
  onLogout: () => void;
}

function Navigation({ userName, userAvatar, onLogout }: NavigationProps) {
  const { t } = useTranslation();

  return (
    <div className="header">
      <h1>💰 {t('app.title')}</h1>
      <nav className="main-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          {t('nav.dashboard')}
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          {t('nav.analytics')}
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          {t('nav.expenses')}
        </NavLink>
      </nav>
      <div className="user-info">
        <LanguageSwitcher />
        {userAvatar && <img src={userAvatar} alt={userName} className="user-avatar" />}
        <span>{userName}</span>
        <button onClick={onLogout} className="btn btn-secondary">
          {t('app.logout')}
        </button>
      </div>
    </div>
  );
}

export default Navigation;
