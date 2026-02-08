import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Создаем демо-аккаунт при первом запуске
const initDemoAccount = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (!users.find(u => u.email === 'demo@example.com')) {
    users.push({
      id: 'demo-user',
      email: 'demo@example.com',
      password: 'demo123',
      firstName: 'Демо',
      lastName: 'Пользователь',
      createdAt: new Date().toISOString(),
      profile: {
        phone: '+7 700 123 4567',
        bio: 'Это демо-аккаунт для тестирования системы',
        company: 'Demo Company',
        position: 'Тестовый пользователь',
        location: 'Алматы, Казахстан',
        website: 'https://example.com',
        github: 'demouser',
        linkedin: 'demouser',
        twitter: 'demouser'
      },
      settings: {
        emailNotifications: true,
        pushNotifications: false,
        weeklyDigest: true,
        language: 'ru',
        timezone: 'Asia/Almaty',
        dateFormat: 'DD.MM.YYYY',
        theme: 'auto'
      }
    });
    localStorage.setItem('users', JSON.stringify(users));
  }
};

initDemoAccount();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);