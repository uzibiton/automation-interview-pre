import React from 'react';
import { NavLink, Link } from 'react-router-dom';
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1>💰 {t('app.title')}</h1>
        <Link
          to="/?add=true"
          className="btn btn-primary"
          data-testid="nav-add-expense-button"
          style={{
            fontSize: '24px',
            padding: '10px 20px',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0, 123, 255, 0.3)',
            minWidth: '50px',
          }}
        >
          ➕
        </Link>
      </div>
      <nav className="main-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end data-testid="nav-dashboard-link">
          {t('nav.dashboard')}
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} data-testid="nav-chat-link">
          {t('nav.chat')}
        </NavLink>
        <NavLink
          to="/analytics"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          data-testid="nav-analytics-link"
        >
          {t('nav.analytics')}
        </NavLink>
        <NavLink
          to="/expenses"
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          data-testid="nav-expenses-link"
        >
          {t('nav.expenses')}
        </NavLink>
        <NavLink to="/members" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} data-testid="nav-members-link">
          {t('nav.members', 'Members')}
        </NavLink>
        <NavLink to="/group" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} data-testid="nav-groups-link">
          {t('nav.groups')}
        </NavLink>
      </nav>
      <div className="user-info">
        <LanguageSwitcher />
        {userAvatar && <img src={userAvatar} alt={userName} className="user-avatar" />}
        <span>{userName}</span>
        <button onClick={onLogout} className="btn btn-secondary" data-testid="nav-logout-button">
          {t('app.logout')}
        </button>
      </div>
    </div>
  );
}

export default Navigation;
