import React, { useState } from 'react';
import './App.css';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ThemeToggle from './components/ThemeToggle';
import Dashboard from './components/Dashboard/Dashboard';
import ToolsPage from './components/Pages/ToolsPage';
import DataPage from './components/Pages/DataPage';
import ProfilePage from './components/Pages/ProfilePage';

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tools':
        return <ToolsPage />;
      case 'data':
        return <DataPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <Header 
        onViewChange={setCurrentView} 
        currentView={currentView}
      />
      
      <ThemeToggle isDark={isDarkTheme} onToggle={toggleTheme} />
      
      <main className="main-content">
        {renderView()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;