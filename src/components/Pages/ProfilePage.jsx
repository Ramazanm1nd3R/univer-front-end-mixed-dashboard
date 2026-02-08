import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  // Profile State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    company: '',
    position: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: ''
  });

  // Settings State
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    language: 'ru',
    timezone: 'Asia/Almaty',
    dateFormat: 'DD.MM.YYYY',
    theme: 'auto'
  });

  // Activity Log
  const [activities, setActivities] = useState([]);

  // Statistics
  const [stats, setStats] = useState({
    tasksCompleted: 0,
    projectsActive: 0,
    hoursWorked: 0,
    achievements: 0
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Load data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedSettings = localStorage.getItem('userSettings');
    const savedActivities = localStorage.getItem('userActivities');
    const savedStats = localStorage.getItem('userStats');

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  // Validate profile
  const validateProfile = () => {
    const newErrors = {};

    if (!profile.firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }

    if (!profile.lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }

    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (profile.phone && !/^\+?[\d\s\-()]+$/.test(profile.phone)) {
      newErrors.phone = 'Неверный формат телефона';
    }

    if (profile.website && !/^https?:\/\/.+/.test(profile.website)) {
      newErrors.website = 'URL должен начинаться с http:// или https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle profile update
  const handleProfileChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Save profile
  const saveProfile = () => {
    if (validateProfile()) {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      addActivity('Профиль обновлен');
      alert('Профиль успешно сохранен!');
    }
  };

  // Handle settings change
  const handleSettingChange = (field, value) => {
    const newSettings = { ...settings, [field]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
    addActivity(`Настройки изменены: ${field}`);
  };

  // Add activity
  const addActivity = (action) => {
    const newActivity = {
      id: Date.now(),
      action,
      timestamp: new Date().toISOString()
    };
    const newActivities = [newActivity, ...activities].slice(0, 20);
    setActivities(newActivities);
    localStorage.setItem('userActivities', JSON.stringify(newActivities));
  };

  // Clear all data
  const clearAllData = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные профиля? Это действие необнеобратимо.')) {
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userSettings');
      localStorage.removeItem('userActivities');
      localStorage.removeItem('userStats');
      
      setProfile({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
        company: '',
        position: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        twitter: ''
      });
      setActivities([]);
      setStats({
        tasksCompleted: 0,
        projectsActive: 0,
        hoursWorked: 0,
        achievements: 0
      });
      
      alert('Все данные удалены');
    }
  };

  // Export data
  const exportData = () => {
    const data = {
      profile,
      settings,
      activities,
      stats,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profile-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    addActivity('Данные экспортированы');
  };

  // Import data
  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          if (data.profile) {
            setProfile(data.profile);
            localStorage.setItem('userProfile', JSON.stringify(data.profile));
          }
          if (data.settings) {
            setSettings(data.settings);
            localStorage.setItem('userSettings', JSON.stringify(data.settings));
          }
          if (data.activities) {
            setActivities(data.activities);
            localStorage.setItem('userActivities', JSON.stringify(data.activities));
          }
          if (data.stats) {
            setStats(data.stats);
            localStorage.setItem('userStats', JSON.stringify(data.stats));
          }
          
          addActivity('Данные импортированы');
          alert('Данные успешно импортированы!');
        } catch (error) {
          alert('Ошибка при импорте данных. Проверьте файл.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Get initials
  const getInitials = () => {
    const first = profile.firstName.charAt(0).toUpperCase();
    const last = profile.lastName.charAt(0).toUpperCase();
    return first + last || '??';
  };

  // Format date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Профиль пользователя</h1>
        <p>Управление личной информацией и настройками</p>
      </div>

      <div className="profile-layout">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          {/* Avatar Card */}
          <div className="profile-card avatar-card">
            <div className="avatar-large">
              {getInitials()}
            </div>
            <h2 className="profile-name">
              {profile.firstName || profile.lastName 
                ? `${profile.firstName} ${profile.lastName}` 
                : 'Имя не указано'}
            </h2>
            {profile.position && (
              <p className="profile-title">{profile.position}</p>
            )}
            {profile.company && (
              <p className="profile-company">{profile.company}</p>
            )}
          </div>

          {/* Stats Card */}
          <div className="profile-card stats-card">
            <h3>Статистика</h3>
            <div className="stats-list">
              <div className="stat-item">
                <span className="stat-icon">✅</span>
                <div>
                  <div className="stat-value">{stats.tasksCompleted}</div>
                  <div className="stat-label">Задач выполнено</div>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📁</span>
                <div>
                  <div className="stat-value">{stats.projectsActive}</div>
                  <div className="stat-label">Активных проектов</div>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⏱️</span>
                <div>
                  <div className="stat-value">{stats.hoursWorked}</div>
                  <div className="stat-label">Часов работы</div>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🏆</span>
                <div>
                  <div className="stat-value">{stats.achievements}</div>
                  <div className="stat-label">Достижений</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="profile-card actions-card">
            <h3>Действия</h3>
            <div className="actions-list">
              <button onClick={exportData} className="action-button">
                📤 Экспорт данных
              </button>
              <label className="action-button">
                📥 Импорт данных
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  style={{ display: 'none' }}
                />
              </label>
              <button onClick={clearAllData} className="action-button danger">
                🗑️ Очистить всё
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main">
          {/* Personal Info */}
          <div className="profile-card">
            <h3>Личная информация</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Имя *</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-field">
                <label>Фамилия *</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>

              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label>Телефон</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-field full-width">
                <label>О себе</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                  rows="4"
                  placeholder="Расскажите о себе..."
                />
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="profile-card">
            <h3>Профессиональная информация</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Компания</label>
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => handleProfileChange('company', e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Должность</label>
                <input
                  type="text"
                  value={profile.position}
                  onChange={(e) => handleProfileChange('position', e.target.value)}
                />
              </div>

              <div className="form-field">
                <label>Местоположение</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  placeholder="Город, Страна"
                />
              </div>

              <div className="form-field">
                <label>Веб-сайт</label>
                <input
                  type="url"
                  value={profile.website}
                  onChange={(e) => handleProfileChange('website', e.target.value)}
                  className={errors.website ? 'error' : ''}
                  placeholder="https://example.com"
                />
                {errors.website && <span className="error-message">{errors.website}</span>}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="profile-card">
            <h3>Социальные сети</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>GitHub</label>
                <div className="input-with-icon">
                  <span className="input-icon">github.com/</span>
                  <input
                    type="text"
                    value={profile.github}
                    onChange={(e) => handleProfileChange('github', e.target.value)}
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>LinkedIn</label>
                <div className="input-with-icon">
                  <span className="input-icon">linkedin.com/in/</span>
                  <input
                    type="text"
                    value={profile.linkedin}
                    onChange={(e) => handleProfileChange('linkedin', e.target.value)}
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Twitter</label>
                <div className="input-with-icon">
                  <span className="input-icon">@</span>
                  <input
                    type="text"
                    value={profile.twitter}
                    onChange={(e) => handleProfileChange('twitter', e.target.value)}
                    placeholder="username"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="profile-card">
            <h3>Настройки</h3>
            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <strong>Email уведомления</strong>
                  <span>Получать уведомления на почту</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <strong>Push уведомления</strong>
                  <span>Получать push-уведомления</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <strong>Еженедельная сводка</strong>
                  <span>Получать дайджест раз в неделю</span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.weeklyDigest}
                    onChange={(e) => handleSettingChange('weeklyDigest', e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <strong>Язык</strong>
                  <span>Язык интерфейса</span>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="kz">Қазақша</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <strong>Часовой пояс</strong>
                  <span>Ваш часовой пояс</span>
                </div>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                >
                  <option value="Asia/Almaty">Алматы (GMT+6)</option>
                  <option value="Europe/Moscow">Москва (GMT+3)</option>
                  <option value="Europe/London">Лондон (GMT+0)</option>
                  <option value="America/New_York">Нью-Йорк (GMT-5)</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <strong>Формат даты</strong>
                  <span>Как отображать даты</span>
                </div>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                >
                  <option value="DD.MM.YYYY">ДД.ММ.ГГГГ</option>
                  <option value="MM/DD/YYYY">ММ/ДД/ГГГГ</option>
                  <option value="YYYY-MM-DD">ГГГГ-ММ-ДД</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="profile-card">
            <h3>История активности</h3>
            {activities.length > 0 ? (
              <div className="activity-list">
                {activities.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">📝</div>
                    <div className="activity-content">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-time">{formatDate(activity.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">Нет активности</p>
            )}
          </div>

          {/* Save Button */}
          <div className="profile-actions">
            <button onClick={saveProfile} className="save-button">
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;