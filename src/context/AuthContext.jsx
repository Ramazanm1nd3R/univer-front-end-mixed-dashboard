import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем, есть ли сохраненная сессия
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      // Проверяем, не истекла ли сессия (24 часа)
      if (new Date(session.expiresAt) > new Date()) {
        setCurrentUser(session.user);
      } else {
        localStorage.removeItem('currentSession');
      }
    }
    setLoading(false);
  }, []);

  const register = (userData) => {
    // Получаем всех пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Проверяем, существует ли уже такой email
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    // Создаем нового пользователя
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      password: userData.password, // В реальном приложении пароль должен быть захеширован
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date().toISOString(),
      profile: {
        phone: '',
        bio: '',
        company: '',
        position: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        twitter: ''
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
    };

    // Сохраняем пользователя
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Автоматически входим
    login({ email: userData.email, password: userData.password });
  };

  const login = (credentials) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    // Создаем сессию (24 часа)
    const session = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem('currentSession', JSON.stringify(session));
    setCurrentUser(session.user);

    // Логируем последний вход
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const logout = () => {
    localStorage.removeItem('currentSession');
    setCurrentUser(null);
  };

  const updateUserProfile = (profileData) => {
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, profile: { ...user.profile, ...profileData } };
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateUserSettings = (settingsData) => {
    if (!currentUser) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => {
      if (user.id === currentUser.id) {
        return { ...user, settings: { ...user.settings, ...settingsData } };
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const getCurrentUserData = () => {
    if (!currentUser) return null;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === currentUser.id);
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateUserProfile,
    updateUserSettings,
    getCurrentUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};