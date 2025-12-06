import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <button
        onClick={() => changeLanguage('en')}
        style={{
          padding: '5px 15px',
          backgroundColor: i18n.language === 'en' ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('he')}
        style={{
          padding: '5px 15px',
          backgroundColor: i18n.language === 'he' ? '#007bff' : '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        עברית
      </button>
    </div>
  );
};

export default LanguageSwitcher;
