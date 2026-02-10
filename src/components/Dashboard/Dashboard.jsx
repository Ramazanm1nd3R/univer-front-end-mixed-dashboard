import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Card from './Card';
import FilterPanel from './FilterPanel';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import '../../styles/Dashboard.css';

function Dashboard() {
  const { currentUser } = useAuth();
  
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardItems = useCallback(async () => {
    if (!currentUser?.id) {
      console.log('⚠️ Dashboard: Нет текущего пользователя');
      setItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('📊 Dashboard: Загрузка данных для пользователя', currentUser.id);
      
      const result = await api.getDashboardItems(currentUser.id);
      
      console.log('📦 Dashboard: Получено задач', result.items?.length || 0);
      
      if (result.success) {
        const transformedItems = result.items.map(item => ({
          id: item.id,
          title: item.text,
          description: item.text,
          category: item.category || 'other',
          status: item.status,
          priority: item.priority || 'medium',
          dueDate: item.dueDate || null,
          dueTime: item.dueTime || null,
          date: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          likes: 0
        }));
        
        setItems(transformedItems);
      } else {
        setError(result.error || 'Ошибка загрузки данных');
        setItems([]);
      }
    } catch (err) {
      console.error('❌ Dashboard: Ошибка загрузки', err);
      setError('Не удалось загрузить задачи');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    loadDashboardItems();
  }, [loadDashboardItems]);

  useEffect(() => {
    let result = [...items];

    if (filters.category !== 'all') {
      result = result.filter(item => item.category === filters.category);
    }

    if (filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }

    if (filters.search) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'likes':
          return b.likes - a.likes;
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          const dateA = new Date(a.dueDate + (a.dueTime ? `T${a.dueTime}` : ''));
          const dateB = new Date(b.dueDate + (b.dueTime ? `T${b.dueTime}` : ''));
          return dateA - dateB;
        default:
          return 0;
      }
    });

    setFilteredItems(result);
  }, [items, filters, sortBy]);

  const addItem = async (newItem) => {
    try {
      const itemData = {
        text: newItem.title,
        status: newItem.status || 'active',
        priority: newItem.priority || 'medium',
        category: newItem.category || 'other',
        dueDate: newItem.dueDate || null,
        dueTime: newItem.dueTime || null
      };

      console.log('➕ Dashboard: Создание задачи', itemData);

      const result = await api.createDashboardItem(currentUser.id, itemData);

      if (result.success) {
        console.log('✅ Dashboard: Задача создана', result.item.id);
        await loadDashboardItems();
      } else {
        alert('Ошибка создания задачи: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (err) {
      console.error('❌ Dashboard: Ошибка создания задачи', err);
      alert('Не удалось создать задачу');
    }
  };

  const updateItem = async (updatedItem) => {
    try {
      const itemData = {
        text: updatedItem.title,
        status: updatedItem.status,
        priority: updatedItem.priority,
        category: updatedItem.category,
        dueDate: updatedItem.dueDate || null,
        dueTime: updatedItem.dueTime || null
      };

      console.log('📝 Dashboard: Обновление задачи', updatedItem.id);

      const result = await api.updateDashboardItem(
        currentUser.id,
        updatedItem.id,
        itemData
      );

      if (result.success) {
        console.log('✅ Dashboard: Задача обновлена');
        await loadDashboardItems();
      } else {
        alert('Ошибка обновления задачи: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (err) {
      console.error('❌ Dashboard: Ошибка обновления задачи', err);
      alert('Не удалось обновить задачу');
    }
  };

  const deleteItem = async (id) => {
    try {
      console.log('🗑️ Dashboard: Удаление задачи', id);

      const result = await api.deleteDashboardItem(currentUser.id, id);

      if (result.success) {
        console.log('✅ Dashboard: Задача удалена');
        await loadDashboardItems();
      } else {
        alert('Ошибка удаления задачи: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (err) {
      console.error('❌ Dashboard: Ошибка удаления задачи', err);
      alert('Не удалось удалить задачу');
    }
  };

  const toggleStatus = async (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const newStatus = item.status === 'active' ? 'completed' : 'active';
    
    try {
      console.log('🔄 Dashboard: Изменение статуса', id, '->', newStatus);

      const result = await api.updateDashboardItem(
        currentUser.id,
        id,
        {
          text: item.title,
          status: newStatus,
          priority: item.priority,
          category: item.category,
          dueDate: item.dueDate,
          dueTime: item.dueTime
        }
      );

      if (result.success) {
        console.log('✅ Dashboard: Статус изменен');
        await loadDashboardItems();
      } else {
        alert('Ошибка изменения статуса: ' + (result.error || 'Неизвестная ошибка'));
      }
    } catch (err) {
      console.error('❌ Dashboard: Ошибка изменения статуса', err);
      alert('Не удалось изменить статус');
    }
  };

  const toggleLike = (id) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, likes: item.likes + 1 }
        : item
    ));
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const getCategoryStats = () => {
    const stats = {
      work: 0,
      personal: 0,
      health: 0,
      other: 0
    };
    items.forEach(item => {
      stats[item.category] = (stats[item.category] || 0) + 1;
    });
    return stats;
  };

  const stats = getCategoryStats();
  const activeCount = items.filter(item => item.status === 'active').length;
  const completedCount = items.filter(item => item.status === 'completed').length;

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="dashboard-container">
        <div className="empty-state">
          <p>Пожалуйста, войдите в систему</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={loadDashboardItems} className="retry-button">
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Mixed Dashboard</h1>
          <p className="user-info">
            👤 {currentUser.firstName} {currentUser.lastName}
          </p>
        </div>
        <button
          className="add-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Добавить элемент
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h4>Всего</h4>
          <p className="stat-number">{items.length}</p>
        </div>
        <div className="stat-card">
          <h4>Активных</h4>
          <p className="stat-number active">{activeCount}</p>
        </div>
        <div className="stat-card">
          <h4>Завершенных</h4>
          <p className="stat-number completed">{completedCount}</p>
        </div>
        <div className="stat-card">
          <h4>Работа</h4>
          <p className="stat-number">{stats.work || 0}</p>
        </div>
      </div>

      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="cards-grid">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <p>Нет элементов для отображения</p>
            {items.length === 0 && (
              <p className="hint">Создайте первую задачу!</p>
            )}
          </div>
        ) : (
          filteredItems.map(item => (
            <Card
              key={item.id}
              item={item}
              onDelete={deleteItem}
              onToggleStatus={toggleStatus}
              onToggleLike={toggleLike}
              onEdit={openEditModal}
            />
          ))
        )}
      </div>

      {isAddModalOpen && (
        <AddItemModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={addItem}
        />
      )}

      {isEditModalOpen && (
        <EditItemModal
          item={editingItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          onUpdate={updateItem}
        />
      )}
    </div>
  );
}

export default Dashboard;