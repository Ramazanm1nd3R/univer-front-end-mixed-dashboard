import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// API URL для Flask backend
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
  const [pendingVerification, setPendingVerification] = useState(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('currentSession');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (new Date(session.expiresAt) > new Date()) {
        setCurrentUser(session.user);
      } else {
        localStorage.removeItem('currentSession');
      }
    }
    setLoading(false);
  }, []);

  // Генерация 6-значного кода
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Отправка кода через Flask backend
  const sendVerificationCode = async (email, type = 'login') => {
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 60000).toISOString();

    // Сохраняем код локально
    const verificationData = {
      email,
      code,
      expiresAt,
      type,
      attempts: 0
    };

    localStorage.setItem('pendingVerification', JSON.stringify(verificationData));
    setPendingVerification(verificationData);

    console.log('📧 Отправка кода на email:', email);
    console.log('🔐 Код:', code);

    try {
      // Отправляем запрос на Flask backend
      const response = await fetch(`${API_URL}/send-verification-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          code: code,
          type: type
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Email успешно отправлен на:', email);
        alert(`✅ Код отправлен на ${email}\n\n🔐 Код (для теста): ${code}\n⏱️ Действителен 60 секунд`);
      } else {
        throw new Error(data.error || 'Ошибка отправки');
      }

      return { success: true };

    } catch (error) {
      console.error('❌ Ошибка отправки:', error);
      alert(`⚠️ Ошибка отправки email\n\n🔐 Ваш код: ${code}\n⏱️ Действителен 60 секунд\n\nВведите его на странице`);
      return { success: false };
    }
  };

  const initiateRegister = async (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    localStorage.setItem('pendingRegistration', JSON.stringify(userData));
    await sendVerificationCode(userData.email, 'register');
  };

  const completeRegister = (code) => {
    const verification = JSON.parse(localStorage.getItem('pendingVerification') || '{}');
    const userData = JSON.parse(localStorage.getItem('pendingRegistration') || '{}');

    if (!verification.code || !userData.email) {
      throw new Error('Данные не найдены');
    }

    if (new Date(verification.expiresAt) < new Date()) {
      throw new Error('Код истек. Запросите новый код.');
    }

    if (verification.code !== code) {
      verification.attempts = (verification.attempts || 0) + 1;
      localStorage.setItem('pendingVerification', JSON.stringify(verification));
      
      if (verification.attempts >= 3) {
        localStorage.removeItem('pendingVerification');
        localStorage.removeItem('pendingRegistration');
        throw new Error('Превышено количество попыток');
      }
      
      throw new Error(`Неверный код. Осталось попыток: ${3 - verification.attempts}`);
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      password: userData.password,
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

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    localStorage.removeItem('pendingVerification');
    localStorage.removeItem('pendingRegistration');
    setPendingVerification(null);

    createSession(newUser);
  };

  const initiateLogin = async (email) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    await sendVerificationCode(email, 'login');
  };

  const completeLogin = (code) => {
    const verification = JSON.parse(localStorage.getItem('pendingVerification') || '{}');

    if (!verification.code) {
      throw new Error('Данные не найдены');
    }

    if (new Date(verification.expiresAt) < new Date()) {
      throw new Error('Код истек. Запросите новый код.');
    }

    if (verification.code !== code) {
      verification.attempts = (verification.attempts || 0) + 1;
      localStorage.setItem('pendingVerification', JSON.stringify(verification));
      
      if (verification.attempts >= 3) {
        localStorage.removeItem('pendingVerification');
        throw new Error('Превышено количество попыток');
      }
      
      throw new Error(`Неверный код. Осталось попыток: ${3 - verification.attempts}`);
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === verification.email);

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    localStorage.removeItem('pendingVerification');
    setPendingVerification(null);

    createSession(user);
  };

  const createSession = (user) => {
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

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const resendCode = async () => {
    const verification = JSON.parse(localStorage.getItem('pendingVerification') || '{}');
    
    if (!verification.email) {
      throw new Error('Нет активной верификации');
    }

    await sendVerificationCode(verification.email, verification.type);
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
    pendingVerification,
    initiateRegister,
    completeRegister,
    initiateLogin,
    completeLogin,
    resendCode,
    logout,
    updateUserProfile,
    updateUserSettings,
    getCurrentUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};