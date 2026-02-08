import React, { useState, useEffect } from 'react';
import './DataPage.css';

function DataPage() {
  // System Info
  const [systemInfo, setSystemInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    userAgent: navigator.userAgent,
    language: navigator.language,
    online: navigator.onLine,
    cookiesEnabled: navigator.cookieEnabled,
    deviceMemory: navigator.deviceMemory || 'N/A',
    hardwareConcurrency: navigator.hardwareConcurrency || 'N/A'
  });

  // Timer
  const [time, setTime] = useState(new Date());
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [countdownTime, setCountdownTime] = useState(300); // 5 минут
  const [countdownRunning, setCountdownRunning] = useState(false);
  const [countdownInput, setCountdownInput] = useState(5);

  // Performance Monitor
  const [performanceData, setPerformanceData] = useState({
    loadTime: 0,
    fps: 60,
    memoryUsage: 0
  });

  // API Mock Data
  const [apiData, setApiData] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);

  // Network Speed Test
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [testing, setTesting] = useState(false);

  // Local Storage Manager
  const [storageKey, setStorageKey] = useState('');
  const [storageValue, setStorageValue] = useState('');
  const [storageItems, setStorageItems] = useState([]);

  // Update system info on resize
  useEffect(() => {
    const handleResize = () => {
      setSystemInfo(prev => ({
        ...prev,
        width: window.innerWidth,
        height: window.innerHeight
      }));
    };

    const handleOnline = () => {
      setSystemInfo(prev => ({ ...prev, online: true }));
    };

    const handleOffline = () => {
      setSystemInfo(prev => ({ ...prev, online: false }));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Stopwatch
  useEffect(() => {
    let interval;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  // Countdown
  useEffect(() => {
    let interval;
    if (countdownRunning && countdownTime > 0) {
      interval = setInterval(() => {
        setCountdownTime(prev => {
          if (prev <= 1) {
            setCountdownRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdownRunning, countdownTime]);

  // Performance monitoring
  useEffect(() => {
    const loadTime = performance.now();
    setPerformanceData(prev => ({ ...prev, loadTime: loadTime.toFixed(2) }));

    if (performance.memory) {
      const updateMemory = () => {
        const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
        setPerformanceData(prev => ({ ...prev, memoryUsage: used }));
      };
      const memoryInterval = setInterval(updateMemory, 1000);
      return () => clearInterval(memoryInterval);
    }
  }, []);

  // Load storage items
  useEffect(() => {
    loadStorageItems();
  }, []);

  const loadStorageItems = () => {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      items.push({ key, value: localStorage.getItem(key) });
    }
    setStorageItems(items);
  };

  const formatStopwatchTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const formatCountdownTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchMockData = async () => {
    setApiLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.floor(Math.random() * 100),
        status: Math.random() > 0.5 ? 'active' : 'inactive',
        timestamp: new Date().toISOString()
      }));
      setApiData(mockData);
      setApiLoading(false);
    }, 1500);
  };

  const testDownloadSpeed = async () => {
    setTesting(true);
    const startTime = Date.now();
    const imageSize = 5000000; // 5MB

    try {
      // Create a random image URL to avoid caching
      const response = await fetch(`https://via.placeholder.com/2000x2000?${Date.now()}`);
      await response.blob();
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // seconds
      const speedMbps = ((imageSize * 8) / duration / 1000000).toFixed(2);
      setDownloadSpeed(speedMbps);
    } catch (error) {
      setDownloadSpeed('Ошибка');
    }
    setTesting(false);
  };

  const saveToStorage = () => {
    if (storageKey && storageValue) {
      localStorage.setItem(storageKey, storageValue);
      setStorageKey('');
      setStorageValue('');
      loadStorageItems();
    }
  };

  const deleteFromStorage = (key) => {
    localStorage.removeItem(key);
    loadStorageItems();
  };

  const clearAllStorage = () => {
    if (window.confirm('Очистить все данные localStorage?')) {
      localStorage.clear();
      loadStorageItems();
    }
  };

  const getDeviceType = () => {
    if (systemInfo.width < 768) return 'Мобильное';
    if (systemInfo.width < 1024) return 'Планшет';
    return 'Десктоп';
  };

  const getBrowser = () => {
    const ua = systemInfo.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Другой';
  };

  return (
    <div className="data-page">
      <div className="page-header">
        <h1>Аналитика и данные</h1>
        <p>Системная информация, мониторинг и управление данными</p>
      </div>

      <div className="data-grid">
        {/* Live Clock */}
        <div className="data-card">
          <h3>🕐 Текущее время</h3>
          <div className="clock-display">
            <div className="time">{time.toLocaleTimeString('ru-RU')}</div>
            <div className="date">{time.toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
        </div>

        {/* System Info */}
        <div className="data-card">
          <h3>💻 Системная информация</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Разрешение:</span>
              <span className="info-value">{systemInfo.width} × {systemInfo.height}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Устройство:</span>
              <span className="info-value">{getDeviceType()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Браузер:</span>
              <span className="info-value">{getBrowser()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Язык:</span>
              <span className="info-value">{systemInfo.language}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Статус:</span>
              <span className={`status-badge ${systemInfo.online ? 'online' : 'offline'}`}>
                {systemInfo.online ? 'Онлайн' : 'Оффлайн'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Cookies:</span>
              <span className="info-value">{systemInfo.cookiesEnabled ? 'Включены' : 'Выключены'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">CPU ядра:</span>
              <span className="info-value">{systemInfo.hardwareConcurrency}</span>
            </div>
          </div>
        </div>

        {/* Performance Monitor */}
        <div className="data-card">
          <h3>📊 Производительность</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="info-label">Время загрузки:</span>
              <span className="info-value">{performanceData.loadTime} мс</span>
            </div>
            <div className="info-item">
              <span className="info-label">FPS:</span>
              <span className="info-value">{performanceData.fps}</span>
            </div>
            {performanceData.memoryUsage > 0 && (
              <div className="info-item">
                <span className="info-label">Память (JS):</span>
                <span className="info-value">{performanceData.memoryUsage} MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Stopwatch */}
        <div className="data-card">
          <h3>⏱️ Секундомер</h3>
          <div className="timer-display">
            {formatStopwatchTime(stopwatchTime)}
          </div>
          <div className="timer-controls">
            <button onClick={() => setStopwatchRunning(!stopwatchRunning)}>
              {stopwatchRunning ? 'Пауза' : 'Старт'}
            </button>
            <button onClick={() => { setStopwatchTime(0); setStopwatchRunning(false); }}>
              Сброс
            </button>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="data-card">
          <h3>⏲️ Таймер обратного отсчета</h3>
          <div className="timer-display">
            {formatCountdownTime(countdownTime)}
          </div>
          <div className="timer-controls">
            <input
              type="number"
              min="1"
              max="60"
              value={countdownInput}
              onChange={(e) => setCountdownInput(parseInt(e.target.value) || 1)}
              placeholder="Минуты"
              disabled={countdownRunning}
            />
            <button 
              onClick={() => {
                if (!countdownRunning) {
                  setCountdownTime(countdownInput * 60);
                }
                setCountdownRunning(!countdownRunning);
              }}
            >
              {countdownRunning ? 'Пауза' : 'Старт'}
            </button>
            <button onClick={() => { 
              setCountdownTime(countdownInput * 60); 
              setCountdownRunning(false); 
            }}>
              Сброс
            </button>
          </div>
        </div>

        {/* Network Speed Test */}
        <div className="data-card">
          <h3>🌐 Тест скорости</h3>
          <div className="speed-test">
            {downloadSpeed > 0 && !testing && (
              <div className="speed-result">
                <span className="speed-value">{downloadSpeed}</span>
                <span className="speed-unit">Mbps</span>
              </div>
            )}
            <button onClick={testDownloadSpeed} disabled={testing}>
              {testing ? 'Тестирование...' : 'Начать тест'}
            </button>
            {testing && <div className="loading-spinner"></div>}
          </div>
        </div>

        {/* API Data Fetcher */}
        <div className="data-card full-width">
          <h3>📡 Загрузка данных (Mock API)</h3>
          <div className="api-section">
            <button onClick={fetchMockData} disabled={apiLoading}>
              {apiLoading ? 'Загрузка...' : 'Получить данные'}
            </button>
            {apiLoading && <div className="loading-spinner"></div>}
            {apiData.length > 0 && (
              <div className="api-table-container">
                <table className="api-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Название</th>
                      <th>Значение</th>
                      <th>Статус</th>
                      <th>Время</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiData.map(item => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.value}</td>
                        <td>
                          <span className={`status-badge ${item.status}`}>
                            {item.status === 'active' ? 'Активно' : 'Неактивно'}
                          </span>
                        </td>
                        <td>{new Date(item.timestamp).toLocaleTimeString('ru-RU')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* LocalStorage Manager */}
        <div className="data-card full-width">
          <h3>💾 Менеджер localStorage</h3>
          <div className="storage-section">
            <div className="storage-input">
              <input
                type="text"
                placeholder="Ключ"
                value={storageKey}
                onChange={(e) => setStorageKey(e.target.value)}
              />
              <input
                type="text"
                placeholder="Значение"
                value={storageValue}
                onChange={(e) => setStorageValue(e.target.value)}
              />
              <button onClick={saveToStorage}>Сохранить</button>
              <button onClick={clearAllStorage} className="danger">Очистить всё</button>
            </div>
            {storageItems.length > 0 ? (
              <div className="storage-list">
                {storageItems.map(item => (
                  <div key={item.key} className="storage-item">
                    <div className="storage-item-content">
                      <strong>{item.key}:</strong>
                      <span>{item.value}</span>
                    </div>
                    <button onClick={() => deleteFromStorage(item.key)}>Удалить</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-message">localStorage пуст</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataPage;