import React, { useState, useEffect } from 'react';
import Card from './Card';
import FilterPanel from './FilterPanel';
import AddItemModal from './AddItemModal';
import EditItemModal from './EditItemModal';
import '../../styles/Dashboard.css';

function Dashboard() {
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

  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const savedItems = localStorage.getItem('dashboardItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    } else {
      // Начальные данные
      const initialItems = [
        {
          id: 1,
          title: 'Завершить проект',
          description: 'Доработать функционал дашборда',
          category: 'work',
          status: 'active',
          priority: 'high',
          date: new Date('2024-02-10'),
          likes: 5
        },
        {
          id: 2,
          title: 'Купить продукты',
          description: 'Молоко, хлеб, яйца',
          category: 'personal',
          status: 'active',
          priority: 'medium',
          date: new Date('2024-02-08'),
          likes: 2
        },
        {
          id: 3,
          title: 'Тренировка',
          description: 'Зал в 18:00',
          category: 'health',
          status: 'completed',
          priority: 'low',
          date: new Date('2024-02-07'),
          likes: 8
        }
      ];
      setItems(initialItems);
    }
  }, []);

  // Сохранение в localStorage при изменении
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('dashboardItems', JSON.stringify(items));
    }
  }, [items]);

  // Фильтрация и сортировка
  useEffect(() => {
    let result = [...items];

    // Фильтр по категории
    if (filters.category !== 'all') {
      result = result.filter(item => item.category === filters.category);
    }

    // Фильтр по статусу
    if (filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }

    // Поиск
    if (filters.search) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Сортировка
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
        default:
          return 0;
      }
    });

    setFilteredItems(result);
  }, [items, filters, sortBy]);

  const addItem = (newItem) => {
    const item = {
      ...newItem,
      id: Date.now(),
      date: new Date(),
      likes: 0
    };
    setItems([...items, item]);
  };

  const updateItem = (updatedItem) => {
    setItems(items.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleStatus = (id) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, status: item.status === 'active' ? 'completed' : 'active' }
        : item
    ));
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
      stats[item.category]++;
    });
    return stats;
  };

  const stats = getCategoryStats();
  const activeCount = items.filter(item => item.status === 'active').length;
  const completedCount = items.filter(item => item.status === 'completed').length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Mixed Dashboard</h1>
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
          <p className="stat-number">{stats.work}</p>
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