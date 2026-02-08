import React from 'react';
import { useAuth } from '../../context/AuthContext';

function Header({ onViewChange, currentView }) {
  const { currentUser, logout } = useAuth();

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
            className={currentView === 'tools' ? 'active' : ''}
            onClick={() => onViewChange('tools')}
          >
            Инструменты
          </button>
          <button
            className={currentView === 'data' ? 'active' : ''}
            onClick={() => onViewChange('data')}
          >
            Аналитика
          </button>
          <button
            className={currentView === 'profile' ? 'active' : ''}
            onClick={() => onViewChange('profile')}
          >
            Профиль
          </button>
          {currentUser && (
            <>
              <span className="user-info">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <button onClick={logout} className="logout-button">
                Выйти
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;