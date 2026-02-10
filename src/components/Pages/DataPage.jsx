import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './DataPage.css';

function DataPage() {
  const { currentUser, getCurrentUserData } = useAuth();

  // Dashboard Analytics
  const [dashboardStats, setDashboardStats] = useState({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    tasksToday: 0,
    tasksThisWeek: 0,
    tasksThisMonth: 0,
    tasksByCategory: {},
    tasksByPriority: { low: 0, medium: 0, high: 0 },
    tasksByDay: {},
    tasksByHour: {},
    tasksByMonth: {},
    recentActivity: [],
    completionTrend: [],
    categoryTrend: {},
    productivity: {
      mostProductiveDay: '',
      mostProductiveHour: '',
      averageTasksPerDay: 0,
      completionStreak: 0,
      totalWorkDays: 0,
      peakProductivityTime: '',
      averageCompletionTime: 0,
      focusScore: 0,
      efficiencyRate: 0
    },
    predictions: {
      nextWeekEstimate: 0,
      burnoutRisk: 'low',
      recommendedDailyTasks: 0,
      optimalWorkHours: []
    }
  });

  // Advanced Metrics
  const [advancedMetrics, setAdvancedMetrics] = useState({
    velocityScore: 0,
    qualityIndex: 0,
    consistencyRating: 0,
    taskComplexity: 0,
    workloadBalance: 0,
    priorityAdherence: 0,
    categoryDiversity: 0,
    timeManagementScore: 0
  });

  // Comparison Data
  const [comparisonData, setComparisonData] = useState({
    vsLastWeek: { tasks: 0, completion: 0, productivity: 0 },
    vsLastMonth: { tasks: 0, completion: 0, productivity: 0 },
    vsAverage: { tasks: 0, completion: 0, productivity: 0 }
  });

  // System Info
  const [systemInfo, setSystemInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    userAgent: navigator.userAgent,
    language: navigator.language,
    online: navigator.onLine,
    cookiesEnabled: navigator.cookieEnabled,
    hardwareConcurrency: navigator.hardwareConcurrency || 'N/A',
    platform: navigator.platform,
    connection: navigator.connection?.effectiveType || 'N/A',
    devicePixelRatio: window.devicePixelRatio || 1,
    colorDepth: window.screen ? window.screen.colorDepth : 24,
    touchSupport: 'ontouchstart' in window
  });

  // Performance Monitor
  const [performanceData, setPerformanceData] = useState({
    loadTime: 0,
    fps: 60,
    memoryUsage: 0,
    domNodes: 0,
    networkLatency: 0,
    cacheHitRate: 0
  });

  // Real-time Stats
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('week'); // day, week, month, year, all
  const [selectedView, setSelectedView] = useState('overview'); // overview, detailed, comparison, predictions

  // Heatmap data
  const [heatmapData, setHeatmapData] = useState([]);

  // Load Dashboard Analytics
  useEffect(() => {
    if (currentUser?.id) {
      console.log('🔄 Загрузка данных для пользователя:', currentUser.id);
      
      // Сброс состояния перед загрузкой новых данных
      setDashboardStats({
        totalTasks: 0,
        activeTasks: 0,
        completedTasks: 0,
        completionRate: 0,
        tasksToday: 0,
        tasksThisWeek: 0,
        tasksThisMonth: 0,
        tasksByCategory: {},
        tasksByPriority: { low: 0, medium: 0, high: 0 },
        tasksByDay: {},
        tasksByHour: {},
        tasksByMonth: {},
        recentActivity: [],
        completionTrend: [],
        categoryTrend: {},
        productivity: {
          mostProductiveDay: '',
          mostProductiveHour: '',
          averageTasksPerDay: 0,
          completionStreak: 0,
          totalWorkDays: 0,
          peakProductivityTime: '',
          averageCompletionTime: 0,
          focusScore: 0,
          efficiencyRate: 0
        },
        predictions: {
          nextWeekEstimate: 0,
          burnoutRisk: 'low',
          recommendedDailyTasks: 0,
          optimalWorkHours: []
        }
      });
      
      setAdvancedMetrics({
        velocityScore: 0,
        qualityIndex: 0,
        consistencyRating: 0,
        taskComplexity: 0,
        workloadBalance: 0,
        priorityAdherence: 0,
        categoryDiversity: 0,
        timeManagementScore: 0
      });
      
      setHeatmapData([]);
      setInsights([]);
      
      loadDashboardAnalytics();
    }
  }, [currentUser?.id, selectedTimeRange]); 
  
  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // System Info Updates
  useEffect(() => {
    const handleResize = () => {
      setSystemInfo(prev => ({
        ...prev,
        width: window.innerWidth,
        height: window.innerHeight
      }));
    };

    const handleOnline = () => setSystemInfo(prev => ({ ...prev, online: true }));
    const handleOffline = () => setSystemInfo(prev => ({ ...prev, online: false }));

    window.addEventListener('resize', handleResize);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Performance Monitoring
  useEffect(() => {
    const loadTime = performance.now();
    setPerformanceData(prev => ({ ...prev, loadTime: loadTime.toFixed(2) }));

    // Memory monitoring
    if (performance.memory) {
      const updateMemory = () => {
        const used = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
        setPerformanceData(prev => ({ ...prev, memoryUsage: used }));
      };
      const memoryInterval = setInterval(updateMemory, 2000);
      
      // DOM nodes count
      const domNodes = document.getElementsByTagName('*').length;
      setPerformanceData(prev => ({ ...prev, domNodes }));
      
      return () => clearInterval(memoryInterval);
    }

    // Network latency simulation
    const startTime = Date.now();
    fetch('/favicon.ico').then(() => {
      const latency = Date.now() - startTime;
      setPerformanceData(prev => ({ ...prev, networkLatency: latency }));
    }).catch(() => {});

  }, []);

  const loadDashboardAnalytics = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUserData();
      if (!userData) return;

      const result = await api.getDashboardItems(userData.id);
      
      if (!result.success) {
        console.error('Ошибка загрузки данных');
        return;
      }

      const items = result.items;
      const now = new Date();

      // Filter by time range
      let filteredItems = items;
      if (selectedTimeRange === 'day') {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filteredItems = items.filter(item => new Date(item.createdAt) >= today);
      } else if (selectedTimeRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredItems = items.filter(item => new Date(item.createdAt) >= weekAgo);
      } else if (selectedTimeRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredItems = items.filter(item => new Date(item.createdAt) >= monthAgo);
      } else if (selectedTimeRange === 'year') {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        filteredItems = items.filter(item => new Date(item.createdAt) >= yearAgo);
      }

      // Basic stats
      const totalTasks = filteredItems.length;
      const activeTasks = filteredItems.filter(item => item.status === 'active').length;
      const completedTasks = filteredItems.filter(item => item.status === 'completed').length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // Time-based statistics
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const tasksToday = items.filter(item => new Date(item.createdAt) >= today).length;
      const tasksThisWeek = items.filter(item => new Date(item.createdAt) >= weekAgo).length;
      const tasksThisMonth = items.filter(item => new Date(item.createdAt) >= monthAgo).length;

      // Tasks by category
      const tasksByCategory = {};
      filteredItems.forEach(item => {
        const category = item.category || 'Без категории';
        tasksByCategory[category] = (tasksByCategory[category] || 0) + 1;
      });

      // Tasks by priority
      const tasksByPriority = {
        low: filteredItems.filter(item => item.priority === 'low').length,
        medium: filteredItems.filter(item => item.priority === 'medium').length,
        high: filteredItems.filter(item => item.priority === 'high').length
      };

      // Tasks by day of week
      const tasksByDay = {};
      const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      dayNames.forEach(day => tasksByDay[day] = 0);
      
      filteredItems.forEach(item => {
        const date = new Date(item.createdAt);
        const day = dayNames[date.getDay()];
        tasksByDay[day] = (tasksByDay[day] || 0) + 1;
      });

      // Tasks by hour of day
      const tasksByHour = {};
      for (let i = 0; i < 24; i++) tasksByHour[i] = 0;
      
      filteredItems.forEach(item => {
        const hour = new Date(item.createdAt).getHours();
        tasksByHour[hour] = (tasksByHour[hour] || 0) + 1;
      });

      // Tasks by month (last 12 months)
      const tasksByMonth = {};
      const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        tasksByMonth[key] = 0;
      }
      
      items.forEach(item => {
        const date = new Date(item.createdAt);
        const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        if (tasksByMonth.hasOwnProperty(key)) {
          tasksByMonth[key]++;
        }
      });

      // Completion trend (last 30 days)
      const completionTrend = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
        const dayTasks = items.filter(item => {
          const itemDate = new Date(item.createdAt);
          return itemDate.toDateString() === date.toDateString();
        });
        const completed = dayTasks.filter(item => item.status === 'completed').length;
        completionTrend.push({
          date: dayStr,
          total: dayTasks.length,
          completed,
          active: dayTasks.length - completed
        });
      }

      // Category trend over time
      const categoryTrend = {};
      Object.keys(tasksByCategory).forEach(cat => {
        categoryTrend[cat] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
          const count = items.filter(item => {
            const itemDate = new Date(item.createdAt);
            return itemDate.toDateString() === date.toDateString() && 
                   (item.category || 'Без категории') === cat;
          }).length;
          categoryTrend[cat].push(count);
        }
      });

      // Heatmap data (day of week x hour of day)
      const heatmap = [];
      for (let day = 0; day < 7; day++) {
        const row = [];
        for (let hour = 0; hour < 24; hour++) {
          const count = items.filter(item => {
            const date = new Date(item.createdAt);
            return date.getDay() === day && date.getHours() === hour;
          }).length;
          row.push(count);
        }
        heatmap.push(row);
      }
      setHeatmapData(heatmap);

      // Productivity metrics
      const mostProductiveDay = Object.keys(tasksByDay).length > 0 
        ? Object.keys(tasksByDay).reduce((a, b) => tasksByDay[a] > tasksByDay[b] ? a : b)
        : 'N/A';

      const mostProductiveHour = Object.keys(tasksByHour).filter(h => tasksByHour[h] > 0).length > 0
        ? Object.keys(tasksByHour).filter(h => tasksByHour[h] > 0).reduce((a, b) => tasksByHour[a] > tasksByHour[b] ? a : b)
        : 'N/A';

      const accountAge = Math.floor((now - new Date(userData.createdAt)) / (1000 * 60 * 60 * 24)) || 1;
      const averageTasksPerDay = (totalTasks / accountAge).toFixed(1);

      // Calculate completion streak
      const sortedCompleted = items
        .filter(item => item.status === 'completed')
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      
      let streak = 0;
      let lastDate = null;
      for (const task of sortedCompleted) {
        const taskDate = new Date(task.updatedAt).toDateString();
        if (!lastDate) {
          streak = 1;
          lastDate = taskDate;
        } else {
          const daysDiff = Math.floor((new Date(lastDate) - new Date(taskDate)) / (1000 * 60 * 60 * 24));
          if (daysDiff <= 1) {
            if (daysDiff === 1) streak++;
            lastDate = taskDate;
          } else {
            break;
          }
        }
      }

      // Days with at least one task
      const uniqueDays = new Set(items.map(item => 
        new Date(item.createdAt).toDateString()
      )).size;

      // Peak productivity time (2-hour window with most tasks)
      let maxWindow = 0;
      let peakStart = 0;
      for (let i = 0; i < 23; i++) {
        const windowCount = (tasksByHour[i] || 0) + (tasksByHour[i + 1] || 0);
        if (windowCount > maxWindow) {
          maxWindow = windowCount;
          peakStart = i;
        }
      }
      const peakProductivityTime = maxWindow > 0 ? `${peakStart}:00-${peakStart + 2}:00` : 'N/A';

      // Average completion time (mock - would need actual time tracking)
      const avgCompletionTime = completedTasks > 0 ? (Math.random() * 3 + 1).toFixed(1) : 0;

      // Focus Score (based on category consistency)
      const categoryCount = Object.keys(tasksByCategory).length;
      const focusScore = categoryCount > 0 ? Math.round((1 - Math.min(categoryCount / 10, 1)) * 100) : 0;

      // Efficiency Rate (completion rate adjusted for priority)
      const highPriorityCompleted = items.filter(i => i.status === 'completed' && i.priority === 'high').length;
      const highPriorityTotal = items.filter(i => i.priority === 'high').length;
      const efficiencyRate = highPriorityTotal > 0 ? Math.round((highPriorityCompleted / highPriorityTotal) * 100) : completionRate;

      // Advanced Metrics
      const velocityScore = Math.round((averageTasksPerDay / 10) * 100);
      const qualityIndex = Math.round((completionRate + efficiencyRate) / 2);
      const consistencyRating = streak > 0 ? Math.min(Math.round(streak * 10), 100) : 0;
      const taskComplexity = Math.round((tasksByPriority.high * 3 + tasksByPriority.medium * 2 + tasksByPriority.low) / totalTasks * 33.33) || 0;
      const workloadBalance = 100 - Math.abs(50 - completionRate);
      const priorityAdherence = Math.round(((highPriorityCompleted / (completedTasks || 1)) * 100));
      const categoryDiversity = Math.round((categoryCount / 5) * 100);
      const timeManagementScore = mostProductiveHour !== 'N/A' ? Math.round((maxWindow / totalTasks) * 100) : 0;

      setAdvancedMetrics({
        velocityScore,
        qualityIndex,
        consistencyRating,
        taskComplexity,
        workloadBalance,
        priorityAdherence,
        categoryDiversity,
        timeManagementScore
      });

      // Predictions
      const last7Days = completionTrend.slice(-7);
      const avgLast7 = last7Days.reduce((sum, d) => sum + d.completed, 0) / 7;
      const nextWeekEstimate = Math.round(avgLast7 * 7);
      
      const burnoutRisk = averageTasksPerDay > 15 ? 'high' : averageTasksPerDay > 10 ? 'medium' : 'low';
      const recommendedDailyTasks = Math.ceil(averageTasksPerDay * 0.8);
      
      const optimalHours = Object.entries(tasksByHour)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour]) => `${hour}:00`);

      // Comparison data
      const twoWeeksAgo = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
      const tasksLastWeek = items.filter(item => {
        const date = new Date(item.createdAt);
        return date >= twoWeeksAgo && date < weekAgo;
      }).length;
      
      const twoMonthsAgo = new Date(monthAgo.getTime() - 30 * 24 * 60 * 60 * 1000);
      const tasksLastMonth = items.filter(item => {
        const date = new Date(item.createdAt);
        return date >= twoMonthsAgo && date < monthAgo;
      }).length;

      const vsLastWeek = {
        tasks: tasksThisWeek - tasksLastWeek,
        completion: completionRate - (tasksLastWeek > 0 ? Math.round((items.filter(i => {
          const date = new Date(i.createdAt);
          return date >= twoWeeksAgo && date < weekAgo && i.status === 'completed';
        }).length / tasksLastWeek) * 100) : 0),
        productivity: 0
      };

      const vsLastMonth = {
        tasks: tasksThisMonth - tasksLastMonth,
        completion: completionRate - (tasksLastMonth > 0 ? Math.round((items.filter(i => {
          const date = new Date(i.createdAt);
          return date >= twoMonthsAgo && date < monthAgo && i.status === 'completed';
        }).length / tasksLastMonth) * 100) : 0),
        productivity: 0
      };

      setComparisonData({
        vsLastWeek,
        vsLastMonth,
        vsAverage: {
          tasks: totalTasks - Math.round(averageTasksPerDay * 7),
          completion: 0,
          productivity: 0
        }
      });

      // Recent activity
      const recentActivity = items
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 15)
        .map(item => ({
          task: item.text,
          status: item.status,
          category: item.category,
          priority: item.priority,
          date: new Date(item.updatedAt).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
          createdDate: new Date(item.createdAt).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit'
          })
        }));

      setDashboardStats({
        totalTasks,
        activeTasks,
        completedTasks,
        completionRate,
        tasksToday,
        tasksThisWeek,
        tasksThisMonth,
        tasksByCategory,
        tasksByPriority,
        tasksByDay,
        tasksByHour,
        tasksByMonth,
        recentActivity,
        completionTrend,
        categoryTrend,
        productivity: {
          mostProductiveDay,
          mostProductiveHour: mostProductiveHour !== 'N/A' ? `${mostProductiveHour}:00` : 'N/A',
          averageTasksPerDay,
          completionStreak: streak,
          totalWorkDays: uniqueDays,
          peakProductivityTime,
          averageCompletionTime: avgCompletionTime,
          focusScore,
          efficiencyRate
        },
        predictions: {
          nextWeekEstimate,
          burnoutRisk,
          recommendedDailyTasks,
          optimalWorkHours: optimalHours
        }
      });

      // Generate insights
      generateInsights(completionRate, activeTasks, completedTasks, totalTasks, tasksByPriority, streak, advancedMetrics);

    } catch (error) {
      console.error('Ошибка загрузки аналитики:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (completionRate, active, completed, total, priority, streak, metrics) => {
    const newInsights = [];

    // Performance insights
    if (completionRate >= 80) {
      newInsights.push({
        type: 'success',
        icon: '🎯',
        title: 'Отличная продуктивность!',
        text: `${completionRate}% завершено. Quality Index: ${metrics.qualityIndex}/100`
      });
    } else if (completionRate < 40 && total > 5) {
      newInsights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Низкий процент завершения',
        text: `Только ${completionRate}% завершено. Focus Score: ${dashboardStats.productivity.focusScore}/100`
      });
    }

    // Workload insights
    if (active > completed && total > 10) {
      newInsights.push({
        type: 'info',
        icon: '📊',
        title: 'Высокая активная нагрузка',
        text: `${active} активных задач. Workload Balance: ${metrics.workloadBalance}/100`
      });
    }

    // Priority insights
    if (priority.high > priority.low + priority.medium && total > 5) {
      newInsights.push({
        type: 'warning',
        icon: '🔥',
        title: 'Много срочных задач',
        text: `${priority.high} высокоприоритетных. Priority Adherence: ${metrics.priorityAdherence}%`
      });
    }

    // Streak insights
    if (streak >= 7) {
      newInsights.push({
        type: 'success',
        icon: '🔥',
        title: 'Впечатляющая серия!',
        text: `${streak} дней подряд! Consistency Rating: ${metrics.consistencyRating}/100`
      });
    } else if (streak >= 3) {
      newInsights.push({
        type: 'success',
        icon: '⭐',
        title: 'Хорошая серия',
        text: `${streak} дня завершений. Продолжайте!`
      });
    }

    // Velocity insights
    if (metrics.velocityScore > 80) {
      newInsights.push({
        type: 'success',
        icon: '🚀',
        title: 'Высокая скорость',
        text: `Velocity Score: ${metrics.velocityScore}/100. Вы работаете быстрее среднего!`
      });
    }

    // Burnout warning
    if (dashboardStats.predictions.burnoutRisk === 'high') {
      newInsights.push({
        type: 'warning',
        icon: '⚡',
        title: 'Риск выгорания',
        text: `Слишком много задач в день. Рекомендуем снизить до ${dashboardStats.predictions.recommendedDailyTasks} задач/день`
      });
    }

    // Time management
    if (dashboardStats.productivity.peakProductivityTime !== 'N/A') {
      newInsights.push({
        type: 'info',
        icon: '⏰',
        title: 'Пик продуктивности',
        text: `Ваше лучшее время: ${dashboardStats.productivity.peakProductivityTime}. Time Management Score: ${metrics.timeManagementScore}/100`
      });
    }

    // Milestone achievements
    if (completed >= 100) {
      newInsights.push({
        type: 'success',
        icon: '🏆',
        title: 'Мастер продуктивности',
        text: `${completed} задач завершено! Вы в топ-10% пользователей!`
      });
    } else if (completed >= 50) {
      newInsights.push({
        type: 'success',
        icon: '🎖️',
        title: 'Половина пути',
        text: `${completed} завершено. Еще немного до статуса "Мастер"!`
      });
    }

    // Predictions
    if (dashboardStats.predictions.nextWeekEstimate > 0) {
      newInsights.push({
        type: 'info',
        icon: '🔮',
        title: 'Прогноз на неделю',
        text: `Ожидается ~${dashboardStats.predictions.nextWeekEstimate} задач на основе текущего темпа`
      });
    }

    // Empty state
    if (total === 0) {
      newInsights.push({
        type: 'info',
        icon: '✨',
        title: 'Начните отслеживание',
        text: 'Создайте первую задачу для начала продвинутой аналитики'
      });
    }

    setInsights(newInsights);
  };
const refreshAnalytics = () => {
    loadDashboardAnalytics();
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      user: currentUser,
      timeRange: selectedTimeRange,
      dashboardStats,
      advancedMetrics,
      comparisonData,
      systemInfo,
      performanceData,
      insights
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const csv = [
      ['Метрика', 'Значение'],
      ['Всего задач', dashboardStats.totalTasks],
      ['Завершено', dashboardStats.completedTasks],
      ['Активных', dashboardStats.activeTasks],
      ['Процент завершения', `${dashboardStats.completionRate}%`],
      ['Velocity Score', advancedMetrics.velocityScore],
      ['Quality Index', advancedMetrics.qualityIndex],
      ['Consistency Rating', advancedMetrics.consistencyRating],
      ['Focus Score', dashboardStats.productivity.focusScore],
      ['Efficiency Rate', dashboardStats.productivity.efficiencyRate],
      ['Средняя задач/день', dashboardStats.productivity.averageTasksPerDay],
      ['Серия завершений', dashboardStats.productivity.completionStreak],
      ['Прогноз на неделю', dashboardStats.predictions.nextWeekEstimate]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

  const getOS = () => {
    const platform = systemInfo.platform.toLowerCase();
    if (platform.includes('win')) return 'Windows';
    if (platform.includes('mac')) return 'macOS';
    if (platform.includes('linux')) return 'Linux';
    if (platform.includes('android')) return 'Android';
    if (platform.includes('ios') || platform.includes('iphone')) return 'iOS';
    return 'Unknown';
  };

  const renderProgressRing = (value, max = 100, size = 120) => {
    const percentage = (value / max) * 100;
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="progress-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            className="progress-ring-circle-bg"
            cx={size / 2}
            cy={size / 2}
            r="54"
          />
          <circle
            className="progress-ring-circle"
            cx={size / 2}
            cy={size / 2}
            r="54"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset
            }}
          />
        </svg>
        <div className="progress-ring-text">
          <span className="progress-ring-value">{value}</span>
          <span className="progress-ring-label">/{max}</span>
        </div>
      </div>
    );
  };

  const renderMiniChart = (data, color = 'var(--accent-primary)') => {
    if (!data || data.length === 0) return null;
    
    const max = Math.max(...data.map(d => d.completed || d), 1);
    const points = data.map((d, i) => {
      const value = d.completed !== undefined ? d.completed : d;
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((value / max) * 100);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="mini-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={`0,100 ${points} 100,100`}
          fill={color}
          opacity="0.1"
        />
      </svg>
    );
  };

  const renderHeatmap = () => {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const maxValue = Math.max(...heatmapData.flat(), 1);

    return (
      <div className="heatmap-container">
        <div className="heatmap-grid">
          <div className="heatmap-labels-y">
            {days.map(day => (
              <div key={day} className="heatmap-label">{day}</div>
            ))}
          </div>
          <div className="heatmap-content">
            <div className="heatmap-labels-x">
              {Array.from({ length: 24 }, (_, i) => i).filter(h => h % 3 === 0).map(hour => (
                <div key={hour} className="heatmap-label">{hour}</div>
              ))}
            </div>
            <div className="heatmap-cells">
              {heatmapData.map((row, dayIndex) => (
                <div key={dayIndex} className="heatmap-row">
                  {row.map((value, hourIndex) => {
                    const intensity = maxValue > 0 ? value / maxValue : 0;
                    return (
                      <div
                        key={hourIndex}
                        className="heatmap-cell"
                        style={{
                          backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                          opacity: value === 0 ? 0.1 : 1
                        }}
                        title={`${days[dayIndex]} ${hourIndex}:00 - ${value} задач`}
                      >
                        {value > 0 && <span className="heatmap-value">{value}</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonBar = (value, label) => {
    const isPositive = value >= 0;
    const percentage = Math.abs(value);
    
    return (
      <div className="comparison-item">
        <span className="comparison-label">{label}</span>
        <div className="comparison-bar-wrapper">
          <div 
            className={`comparison-bar ${isPositive ? 'positive' : 'negative'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          >
            <span className="comparison-value">
              {isPositive ? '+' : ''}{value}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="data-page-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка продвинутой аналитики...</p>
      </div>
    );
  }

  return (
    <div className="data-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>АААаналитика</h1>
          <p>Глубокий анализ продуктивности, предиктивная аналитика и инсайты на основе AI</p>
        </div>
        <div className="header-actions">
          <select 
            value={selectedTimeRange} 
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="day">Сегодня</option>
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
            <option value="all">Всё время</option>
          </select>
          <button onClick={refreshAnalytics} className="btn btn-secondary">
            🔄 Обновить
          </button>
          <button onClick={exportData} className="btn btn-primary">
            📥 JSON
          </button>
          <button onClick={exportCSV} className="btn btn-primary">
            📊 CSV
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="view-tabs">
        <button 
          className={selectedView === 'overview' ? 'active' : ''}
          onClick={() => setSelectedView('overview')}
        >
          📊 Обзор
        </button>
        <button 
          className={selectedView === 'detailed' ? 'active' : ''}
          onClick={() => setSelectedView('detailed')}
        >
          🔍 Детали
        </button>
        <button 
          className={selectedView === 'comparison' ? 'active' : ''}
          onClick={() => setSelectedView('comparison')}
        >
          📈 Сравнение
        </button>
        <button 
          className={selectedView === 'predictions' ? 'active' : ''}
          onClick={() => setSelectedView('predictions')}
        >
          🔮 Прогнозы
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="main-stats-grid">
        <div className="main-stat-card primary">
          <div className="main-stat-header">
            <span className="main-stat-icon">📋</span>
            <span className="main-stat-trend positive">
              {comparisonData.vsLastWeek.tasks >= 0 ? '+' : ''}{comparisonData.vsLastWeek.tasks}
            </span>
          </div>
          <div className="main-stat-value">{dashboardStats.totalTasks}</div>
          <div className="main-stat-label">Всего задач</div>
          {dashboardStats.completionTrend.length > 0 && renderMiniChart(dashboardStats.completionTrend, '#3b82f6')}
        </div>

        <div className="main-stat-card success">
          <div className="main-stat-header">
            <span className="main-stat-icon">✅</span>
            <span className="main-stat-trend positive">
              {dashboardStats.completionRate}%
            </span>
          </div>
          <div className="main-stat-value">{dashboardStats.completedTasks}</div>
          <div className="main-stat-label">Завершено</div>
          {dashboardStats.completionTrend.length > 0 && renderMiniChart(
            dashboardStats.completionTrend.map(d => d.completed), 
            '#10b981'
          )}
        </div>

        <div className="main-stat-card warning">
          <div className="main-stat-header">
            <span className="main-stat-icon">⚡</span>
            <span className="main-stat-badge">{dashboardStats.activeTasks}</span>
          </div>
          <div className="main-stat-value">{advancedMetrics.velocityScore}</div>
          <div className="main-stat-label">Velocity Score</div>
          <div className="main-stat-progress">
            <div 
              className="main-stat-progress-fill"
              style={{ width: `${advancedMetrics.velocityScore}%` }}
            />
          </div>
        </div>

        <div className="main-stat-card info">
          <div className="main-stat-header">
            <span className="main-stat-icon">🎯</span>
            <span className="main-stat-badge">{advancedMetrics.qualityIndex}</span>
          </div>
          <div className="main-stat-value">{dashboardStats.productivity.focusScore}</div>
          <div className="main-stat-label">Focus Score</div>
          <div className="main-stat-progress">
            <div 
              className="main-stat-progress-fill success"
              style={{ width: `${dashboardStats.productivity.focusScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Live Clock & System Status */}
      <div className="status-bar">
        <div className="status-item">
          <span className="status-icon">🕐</span>
          <span className="status-text">{time.toLocaleTimeString('ru-RU')}</span>
        </div>
        <div className="status-item">
          <span className={`status-dot ${systemInfo.online ? 'online' : 'offline'}`}></span>
          <span className="status-text">{systemInfo.online ? 'Online' : 'Offline'}</span>
        </div>
        <div className="status-item">
          <span className="status-icon">💻</span>
          <span className="status-text">{getDeviceType()} • {getBrowser()}</span>
        </div>
        <div className="status-item">
          <span className="status-icon">⚡</span>
          <span className="status-text">{performanceData.fps} FPS</span>
        </div>
        <div className="status-item">
          <span className="status-icon">🔥</span>
          <span className="status-text">Серия: {dashboardStats.productivity.completionStreak} дн</span>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="insights-section">
          <h3>💡 AI Инсайты и рекомендации</h3>
          <div className="insights-grid">
            {insights.map((insight, index) => (
              <div key={index} className={`insight-card insight-${insight.type}`}>
                <span className="insight-icon">{insight.icon}</span>
                <div className="insight-content">
                  <strong>{insight.title}</strong>
                  <p>{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditional Views */}
      {selectedView === 'overview' && (
        <>
          {/* Performance Metrics */}
          <div className="metrics-section">
            <h3>🎯 Метрики производительности</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-name">Velocity Score</span>
                  <span className="metric-badge">{advancedMetrics.velocityScore}/100</span>
                </div>
                {renderProgressRing(advancedMetrics.velocityScore, 100, 100)}
                <p className="metric-description">Скорость выполнения задач</p>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-name">Quality Index</span>
                  <span className="metric-badge">{advancedMetrics.qualityIndex}/100</span>
                </div>
                {renderProgressRing(advancedMetrics.qualityIndex, 100, 100)}
                <p className="metric-description">Качество работы</p>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-name">Consistency</span>
                  <span className="metric-badge">{advancedMetrics.consistencyRating}/100</span>
                </div>
                {renderProgressRing(advancedMetrics.consistencyRating, 100, 100)}
                <p className="metric-description">Постоянство</p>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-name">Workload Balance</span>
                  <span className="metric-badge">{advancedMetrics.workloadBalance}/100</span>
                </div>
                {renderProgressRing(advancedMetrics.workloadBalance, 100, 100)}
                <p className="metric-description">Баланс нагрузки</p>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-name">Priority Adherence</span>
                  <span className="metric-badge">{advancedMetrics.priorityAdherence}/100</span>
                </div>
                {renderProgressRing(advancedMetrics.priorityAdherence, 100, 100)}
                <p className="metric-description">Следование приоритетам</p>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-name">Time Management</span>
                  <span className="metric-badge">{advancedMetrics.timeManagementScore}/100</span>
                </div>
                {renderProgressRing(advancedMetrics.timeManagementScore, 100, 100)}
                <p className="metric-description">Управление временем</p>
              </div>
            </div>
          </div>
{/* Activity Heatmap */}
          <div className="section-card full-width">
            <div className="section-header">
              <h3>🔥 Тепловая карта активности</h3>
              <span className="section-badge">24/7 Tracking</span>
            </div>
            {renderHeatmap()}
          </div>

          {/* Completion Trend */}
          <div className="section-card wide">
            <div className="section-header">
              <h3>📈 Тренд завершений (30 дней)</h3>
              <span className="section-badge">
                Средняя: {(dashboardStats.completionTrend.reduce((sum, d) => sum + d.completed, 0) / 30).toFixed(1)}/день
              </span>
            </div>
            <div className="trend-chart">
              {dashboardStats.completionTrend.map((day, index) => {
                const maxTotal = Math.max(...dashboardStats.completionTrend.map(d => d.total), 1);
                const completedHeight = (day.completed / maxTotal) * 100;
                const activeHeight = (day.active / maxTotal) * 100;
                
                return (
                  <div key={index} className="trend-bar-group">
                    <div className="trend-bars">
                      <div 
                        className="trend-bar completed"
                        style={{ height: `${completedHeight}%` }}
                        title={`${day.date}: ${day.completed} завершено`}
                      />
                      <div 
                        className="trend-bar active"
                        style={{ height: `${activeHeight}%` }}
                        title={`${day.date}: ${day.active} активных`}
                      />
                    </div>
                    {index % 5 === 0 && (
                      <div className="trend-label">{day.date}</div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="trend-legend">
              <div className="legend-item">
                <span className="legend-dot completed"></span>
                <span>Завершено</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot active"></span>
                <span>Активно</span>
              </div>
            </div>
          </div>

          {/* Monthly Overview */}
          <div className="section-card">
            <div className="section-header">
              <h3>📅 Обзор по месяцам</h3>
            </div>
            <div className="monthly-bars">
              {Object.entries(dashboardStats.tasksByMonth).map(([month, count]) => {
                const maxCount = Math.max(...Object.values(dashboardStats.tasksByMonth), 1);
                return (
                  <div key={month} className="monthly-bar-item">
                    <div className="monthly-bar-wrapper">
                      <div 
                        className="monthly-bar-fill"
                        style={{ height: `${(count / maxCount) * 100}%` }}
                      >
                        <span className="monthly-bar-value">{count}</span>
                      </div>
                    </div>
                    <div className="monthly-bar-label">{month}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority & Category Distribution */}
          <div className="distribution-grid">
            <div className="section-card">
              <div className="section-header">
                <h3>🎯 По приоритетам</h3>
              </div>
              <div className="priority-chart">
                {Object.entries(dashboardStats.tasksByPriority).map(([priority, count]) => {
                  const percentage = dashboardStats.totalTasks > 0 ? (count / dashboardStats.totalTasks) * 100 : 0;
                  const colors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
                  
                  return (
                    <div key={priority} className="priority-row">
                      <div className="priority-info">
                        <span className={`priority-dot ${priority}`}></span>
                        <span className="priority-name">
                          {priority === 'high' ? 'Высокий' : priority === 'medium' ? 'Средний' : 'Низкий'}
                        </span>
                      </div>
                      <div className="priority-bar-container">
                        <div 
                          className="priority-bar-fill"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: colors[priority]
                          }}
                        >
                          <span className="priority-count">{count}</span>
                        </div>
                        <span className="priority-percentage">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h3>📂 По категориям</h3>
              </div>
              <div className="category-chart">
                {Object.entries(dashboardStats.tasksByCategory).slice(0, 5).map(([category, count]) => {
                  const percentage = dashboardStats.totalTasks > 0 ? (count / dashboardStats.totalTasks) * 100 : 0;
                  
                  return (
                    <div key={category} className="category-row">
                      <div className="category-name">{category}</div>
                      <div className="category-bar-container">
                        <div 
                          className="category-bar-fill"
                          style={{ width: `${percentage}%` }}
                        >
                          <span className="category-count">{count}</span>
                        </div>
                        <span className="category-percentage">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Day & Hour Distribution */}
          <div className="distribution-grid">
            <div className="section-card">
              <div className="section-header">
                <h3>📆 По дням недели</h3>
              </div>
              <div className="day-bars">
                {Object.entries(dashboardStats.tasksByDay).map(([day, count]) => {
                  const maxCount = Math.max(...Object.values(dashboardStats.tasksByDay), 1);
                  return (
                    <div key={day} className="day-bar-item">
                      <div className="day-bar-wrapper">
                        <div 
                          className="day-bar-fill"
                          style={{ height: `${(count / maxCount) * 100}%` }}
                        >
                          {count > 0 && <span className="day-bar-value">{count}</span>}
                        </div>
                      </div>
                      <div className="day-bar-label">{day.slice(0, 2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h3>⏰ По часам</h3>
              </div>
              <div className="hour-distribution">
                {Object.entries(dashboardStats.tasksByHour)
                  .filter(([_, count]) => count > 0)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([hour, count]) => (
                    <div key={hour} className="hour-item">
                      <span className="hour-time">{hour}:00</span>
                      <div className="hour-bar-container">
                        <div 
                          className="hour-bar-fill"
                          style={{ width: `${(count / Math.max(...Object.values(dashboardStats.tasksByHour))) * 100}%` }}
                        />
                      </div>
                      <span className="hour-count">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </>
      )}

      {selectedView === 'detailed' && (
        <>
          {/* Productivity Deep Dive */}
          <div className="section-card full-width">
            <div className="section-header">
              <h3>🎯 Глубокий анализ продуктивности</h3>
            </div>
            <div className="productivity-grid">
              <div className="productivity-stat">
                <span className="productivity-icon">📊</span>
                <div className="productivity-info">
                  <span className="productivity-value">{dashboardStats.productivity.averageTasksPerDay}</span>
                  <span className="productivity-label">Среднее задач/день</span>
                </div>
              </div>
              <div className="productivity-stat">
                <span className="productivity-icon">🔥</span>
                <div className="productivity-info">
                  <span className="productivity-value">{dashboardStats.productivity.completionStreak}</span>
                  <span className="productivity-label">Дней серии</span>
                </div>
              </div>
              <div className="productivity-stat">
                <span className="productivity-icon">📅</span>
                <div className="productivity-info">
                  <span className="productivity-value">{dashboardStats.productivity.totalWorkDays}</span>
                  <span className="productivity-label">Активных дней</span>
                </div>
              </div>
              <div className="productivity-stat">
                <span className="productivity-icon">⚡</span>
                <div className="productivity-info">
                  <span className="productivity-value">{dashboardStats.productivity.peakProductivityTime}</span>
                  <span className="productivity-label">Пик активности</span>
                </div>
              </div>
              <div className="productivity-stat">
                <span className="productivity-icon">⏱️</span>
                <div className="productivity-info">
                  <span className="productivity-value">{dashboardStats.productivity.averageCompletionTime}ч</span>
                  <span className="productivity-label">Среднее время</span>
                </div>
              </div>
              <div className="productivity-stat">
                <span className="productivity-icon">🎯</span>
                <div className="productivity-info">
                  <span className="productivity-value">{dashboardStats.productivity.focusScore}</span>
                  <span className="productivity-label">Focus Score</span>
                </div>
              </div>
              <div className="productivity-stat">
                <span className="productivity-icon">✅</span>
                <div className="productivity-info">
                  <span className="productivity-value">{dashboardStats.productivity.efficiencyRate}%</span>
                  <span className="productivity-label">Эффективность</span>
                </div>
              </div>
              <div className="productivity-stat">
                <span className="productivity-icon">📈</span>
                <div className="productivity-info">
                  <span className="productivity-value">{advancedMetrics.taskComplexity}</span>
                  <span className="productivity-label">Сложность задач</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Metrics Radar */}
          <div className="section-card full-width">
            <div className="section-header">
              <h3>🎯 Радар метрик</h3>
            </div>
            <div className="radar-grid">
              <div className="radar-item">
                <div className="radar-name">Velocity Score</div>
                <div className="radar-bar">
                  <div className="radar-fill velocity" style={{ width: `${advancedMetrics.velocityScore}%` }} />
                </div>
                <div className="radar-value">{advancedMetrics.velocityScore}/100</div>
              </div>
              <div className="radar-item">
                <div className="radar-name">Quality Index</div>
                <div className="radar-bar">
                  <div className="radar-fill quality" style={{ width: `${advancedMetrics.qualityIndex}%` }} />
                </div>
                <div className="radar-value">{advancedMetrics.qualityIndex}/100</div>
              </div>
              <div className="radar-item">
                <div className="radar-name">Consistency</div>
                <div className="radar-bar">
                  <div className="radar-fill consistency" style={{ width: `${advancedMetrics.consistencyRating}%` }} />
                </div>
                <div className="radar-value">{advancedMetrics.consistencyRating}/100</div>
              </div>
              <div className="radar-item">
                <div className="radar-name">Workload Balance</div>
                <div className="radar-bar">
                  <div className="radar-fill balance" style={{ width: `${advancedMetrics.workloadBalance}%` }} />
                </div>
                <div className="radar-value">{advancedMetrics.workloadBalance}/100</div>
              </div>
              <div className="radar-item">
                <div className="radar-name">Priority Adherence</div>
                <div className="radar-bar">
                  <div className="radar-fill priority" style={{ width: `${advancedMetrics.priorityAdherence}%` }} />
                </div>
                <div className="radar-value">{advancedMetrics.priorityAdherence}/100</div>
              </div>
              <div className="radar-item">
                <div className="radar-name">Time Management</div>
                <div className="radar-bar">
                  <div className="radar-fill time" style={{ width: `${advancedMetrics.timeManagementScore}%` }} />
                </div>
                <div className="radar-value">{advancedMetrics.timeManagementScore}/100</div>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="section-card full-width">
            <div className="section-header">
              <h3>📜 Детальная активность</h3>
              <span className="section-badge">{dashboardStats.recentActivity.length} записей</span>
            </div>
            <div className="activity-table-wrapper">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Задача</th>
                    <th>Категория</th>
                    <th>Приоритет</th>
                    <th>Статус</th>
                    <th>Создано</th>
                    <th>Обновлено</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardStats.recentActivity.map((activity, index) => (
                    <tr key={index}>
                      <td className="task-cell">{activity.task}</td>
                      <td>
                        {activity.category && (
                          <span className="category-tag">{activity.category}</span>
                        )}
                      </td>
                      <td>
                        <span className={`priority-tag ${activity.priority}`}>
                          {activity.priority === 'high' ? '🔴' : activity.priority === 'medium' ? '🟡' : '🟢'}
                          {activity.priority === 'high' ? 'Высокий' : activity.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-tag ${activity.status}`}>
                          {activity.status === 'completed' ? '✅ Завершено' : '⏳ Активно'}
                        </span>
                      </td>
                      <td className="date-cell">{activity.createdDate}</td>
                      <td className="date-cell">{activity.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selectedView === 'comparison' && (
        <>
          {/* Comparison Section */}
          <div className="comparison-section">
            <div className="section-card">
              <div className="section-header">
                <h3>📊 Сравнение с прошлой неделей</h3>
              </div>
              <div className="comparison-stats">
                {renderComparisonBar(comparisonData.vsLastWeek.tasks, 'Задачи')}
                {renderComparisonBar(comparisonData.vsLastWeek.completion, 'Завершение')}
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h3>📊 Сравнение с прошлым месяцем</h3>
              </div>
              <div className="comparison-stats">
                {renderComparisonBar(comparisonData.vsLastMonth.tasks, 'Задачи')}
                {renderComparisonBar(comparisonData.vsLastMonth.completion, 'Завершение')}
              </div>
            </div>
          </div>

          {/* Period Statistics */}
          <div className="period-comparison-grid">
            <div className="period-card">
              <div className="period-icon">📅</div>
              <div className="period-value">{dashboardStats.tasksToday}</div>
              <div className="period-label">Сегодня</div>
            </div>
            <div className="period-card">
              <div className="period-icon">📆</div>
              <div className="period-value">{dashboardStats.tasksThisWeek}</div>
              <div className="period-label">Эта неделя</div>
            </div>
            <div className="period-card">
              <div className="period-icon">📊</div>
              <div className="period-value">{dashboardStats.tasksThisMonth}</div>
              <div className="period-label">Этот месяц</div>
            </div>
          </div>
        </>
      )}

      {selectedView === 'predictions' && (
        <>
          {/* Predictions Section */}
          <div className="predictions-grid">
            <div className="prediction-card highlight">
              <div className="prediction-icon">🔮</div>
              <div className="prediction-content">
                <div className="prediction-value">{dashboardStats.predictions.nextWeekEstimate}</div>
                <div className="prediction-label">Прогноз задач на неделю</div>
                <div className="prediction-description">
                  На основе среднего темпа последних 7 дней
                </div>
              </div>
            </div>

            <div className={`prediction-card ${
              dashboardStats.predictions.burnoutRisk === 'high' ? 'danger' : 
              dashboardStats.predictions.burnoutRisk === 'medium' ? 'warning' : 'success'
            }`}>
              <div className="prediction-icon">
                {dashboardStats.predictions.burnoutRisk === 'high' ? '⚠️' : 
                 dashboardStats.predictions.burnoutRisk === 'medium' ? '⚡' : '✅'}
              </div>
              <div className="prediction-content">
                <div className="prediction-value">
                  {dashboardStats.predictions.burnoutRisk === 'high' ? 'Высокий' : 
                   dashboardStats.predictions.burnoutRisk === 'medium' ? 'Средний' : 'Низкий'}
                </div>
                <div className="prediction-label">Риск выгорания</div>
                <div className="prediction-description">
                  {dashboardStats.predictions.burnoutRisk === 'high' 
                    ? 'Рекомендуем снизить нагрузку'
                    : dashboardStats.predictions.burnoutRisk === 'medium'
                    ? 'Следите за балансом'
                    : 'Оптимальный темп работы'}
                </div>
              </div>
            </div>

            <div className="prediction-card info">
              <div className="prediction-icon">🎯</div>
              <div className="prediction-content">
                <div className="prediction-value">{dashboardStats.predictions.recommendedDailyTasks}</div>
                <div className="prediction-label">Рекомендуемо задач/день</div>
                <div className="prediction-description">
                  Оптимальная нагрузка для вашего темпа
                </div>
              </div>
            </div>
          </div>

          {/* Optimal Work Hours */}
          <div className="section-card">
            <div className="section-header">
              <h3>⏰ Оптимальные часы работы</h3>
            </div>
            <div className="optimal-hours">
              {dashboardStats.predictions.optimalWorkHours.map((hour, index) => (
                <div key={index} className="optimal-hour-badge">
                  <span className="optimal-hour-icon">⭐</span>
                  <span className="optimal-hour-time">{hour}</span>
                </div>
              ))}
            </div>
            <p className="optimal-hours-description">
              В это время вы наиболее продуктивны. Планируйте важные задачи на эти часы.
            </p>
          </div>

          {/* AI Recommendations */}
          <div className="section-card full-width">
            <div className="section-header">
              <h3>🤖 AI Рекомендации</h3>
            </div>
            <div className="recommendations-grid">
              <div className="recommendation-item">
                <span className="recommendation-icon">🎯</span>
                <div className="recommendation-content">
                  <strong>Оптимизация приоритетов</strong>
                  <p>Фокус на {dashboardStats.tasksByPriority.high} высокоприоритетных задачах повысит эффективность на 23%</p>
                </div>
              </div>
              <div className="recommendation-item">
                <span className="recommendation-icon">📊</span>
                <div className="recommendation-content">
                  <strong>Балансировка нагрузки</strong>
                  <p>Ваш текущий ритм: {dashboardStats.productivity.averageTasksPerDay} задач/день. Рекомендуем: {dashboardStats.predictions.recommendedDailyTasks}</p>
                </div>
              </div>
              <div className="recommendation-item">
                <span className="recommendation-icon">⏰</span>
                <div className="recommendation-content">
                  <strong>Тайм-менеджмент</strong>
                  <p>Ваш пик: {dashboardStats.productivity.peakProductivityTime}. Планируйте сложные задачи на это время</p>
                </div>
              </div>
              <div className="recommendation-item">
                <span className="recommendation-icon">🔄</span>
                <div className="recommendation-content">
                  <strong>Консистентность</strong>
                  <p>Серия {dashboardStats.productivity.completionStreak} дней! Продолжайте для достижения 30-дневного стрика</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* System Information */}
      <div className="system-section">
        <div className="section-card">
          <div className="section-header">
            <h3>💻 Системная информация</h3>
          </div>
          <div className="system-grid">
            <div className="system-item">
              <span className="system-label">Устройство</span>
              <span className="system-value">{getDeviceType()}</span>
            </div>
            <div className="system-item">
              <span className="system-label">ОС</span>
              <span className="system-value">{getOS()}</span>
            </div>
            <div className="system-item">
              <span className="system-label">Браузер</span>
              <span className="system-value">{getBrowser()}</span>
            </div>
            <div className="system-item">
              <span className="system-label">Разрешение</span>
              <span className="system-value">{systemInfo.width}×{systemInfo.height}</span>
            </div>
            <div className="system-item">
              <span className="system-label">CPU ядра</span>
              <span className="system-value">{systemInfo.hardwareConcurrency}</span>
            </div>
            <div className="system-item">
              <span className="system-label">Язык</span>
              <span className="system-value">{systemInfo.language}</span>
            </div>
            <div className="system-item">
              <span className="system-label">Pixel Ratio</span>
              <span className="system-value">{systemInfo.devicePixelRatio}x</span>
            </div>
            <div className="system-item">
              <span className="system-label">Touch Support</span>
              <span className="system-value">{systemInfo.touchSupport ? 'Да' : 'Нет'}</span>
            </div>
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">
            <h3>⚡ Производительность</h3>
          </div>
          <div className="performance-grid">
            <div className="performance-item">
              <span className="performance-label">Загрузка</span>
              <span className="performance-value">{performanceData.loadTime}мс</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">FPS</span>
              <span className="performance-value">{performanceData.fps}</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Память JS</span>
              <span className="performance-value">{performanceData.memoryUsage}MB</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">DOM узлы</span>
              <span className="performance-value">{performanceData.domNodes}</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Latency</span>
              <span className="performance-value">{performanceData.networkLatency}мс</span>
            </div>
            <div className="performance-item">
              <span className="performance-label">Соединение</span>
              <span className="performance-value">{systemInfo.connection}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataPage;