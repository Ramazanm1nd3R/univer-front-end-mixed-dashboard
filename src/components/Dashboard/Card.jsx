import React, { useState } from 'react';

function Card({ item, onDelete, onToggleStatus, onToggleLike, onEdit }) {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4757';
      case 'medium': return '#ffa502';
      case 'low': return '#5352ed';
      default: return '#747d8c';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'work': return '💼';
      case 'personal': return '👤';
      case 'health': return '💪';
      case 'other': return '📌';
      default: return '📋';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  return (
    <div
      className={`dashboard-card ${item.status} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ '--priority-color': getPriorityColor(item.priority) }}
    >
      <div className="card-header">
        <span className="category-icon">{getCategoryIcon(item.category)}</span>
        <span className={`priority-badge ${item.priority}`}>
          {item.priority === 'high' ? 'Высокий' : item.priority === 'medium' ? 'Средний' : 'Низкий'}
        </span>
      </div>

      <h3 className="card-title">{item.title}</h3>
      <p className="card-description">{item.description}</p>

      <div className="card-meta">
        <span className="card-date">📅 {formatDate(item.date)}</span>
        <button
          className="like-button"
          onClick={() => onToggleLike(item.id)}
        >
          ❤️ {item.likes}
        </button>
      </div>

      <div className="card-actions">
        <button
          className={`status-button ${item.status}`}
          onClick={() => onToggleStatus(item.id)}
        >
          {item.status === 'active' ? '✓ Завершить' : '↺ Активировать'}
        </button>
        <button
          className="edit-button"
          onClick={() => onEdit(item)}
        >
          ✏️
        </button>
        <button
          className="delete-button"
          onClick={() => onDelete(item.id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default Card;