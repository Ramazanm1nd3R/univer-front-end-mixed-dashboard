import React, { useState } from 'react';
import Counter from './components/Counter';
import ListManager from './components/ListManager';
import TogglePanel from './components/TogglePanel';
import ProfileEditor from './components/ProfileEditor';
import ButtonInteractive from './components/ButtonInteractive';
import ThemeToggle from './components/ThemeToggle';
import DataFetcher from './components/DataFetcher';
import Timer from './components/Timer';
import WindowSize from './components/WindowSize';
import Dashboard from './components/Dashboard/Dashboard';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

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
      case 'tasks':
        return (
          <div className="tasks-view">
            <h2>Задачи (Tasks 1-10)</h2>
            <div className="tasks-grid">
              <Counter />
              <ListManager />
              <TogglePanel />
              <ProfileEditor />
              <ButtonInteractive />
              <DataFetcher />
              <Timer initialTime={60} />
              <WindowSize />
            </div>
          </div>
        );
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