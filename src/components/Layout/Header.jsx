import React from 'react';

function Header({ onViewChange, currentView }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="logo">🎯 Mixed Dashboard</h1>
        <nav className="nav-menu">
          <button
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => onViewChange('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={currentView === 'basic' ? 'active' : ''}
            onClick={() => onViewChange('basic')}
          >
            Базовые
          </button>
          <button
            className={currentView === 'data' ? 'active' : ''}
            onClick={() => onViewChange('data')}
          >
            Данные
          </button>
          <button
            className={currentView === 'profile' ? 'active' : ''}
            onClick={() => onViewChange('profile')}
          >
            Профиль
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;