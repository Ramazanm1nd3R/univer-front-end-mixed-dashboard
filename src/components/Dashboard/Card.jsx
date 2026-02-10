import React from 'react';
import '../../styles/Dashboard.css';

function Card({ item, onDelete, onToggleStatus, onToggleLike, onEdit }) {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getCategoryEmoji = (category) => {
    switch (category) {
      case 'work':
        return '💼';
      case 'personal':
        return '👤';
      case 'health':
        return '💪';
      default:
        return '📌';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (date, time) => {
    if (!date) return null;
    
    const formattedDate = formatDate(date);
    if (time) {
      return `${formattedDate} в ${time}`;
    }
    return formattedDate;
  };

  const isOverdue = () => {
    if (!item.dueDate) return false;
    if (item.status === 'completed') return false;
    
    const now = new Date();
    const dueDateTime = new Date(item.dueDate + (item.dueTime ? `T${item.dueTime}` : 'T23:59:59'));
    
    return dueDateTime < now;
  };

  return (
    <div className={`card ${item.status === 'completed' ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''}`}>
      <div className="card-header">
        <div className="card-category">
          <span className="category-emoji">{getCategoryEmoji(item.category)}</span>
          <span className="category-name">{item.category}</span>
        </div>
        <span className={`priority-badge ${getPriorityClass(item.priority)}`}>
          {item.priority === 'high' ? 'Высокий' : item.priority === 'medium' ? 'Средний' : 'Низкий'}
        </span>
      </div>

      <h3 className="card-title">{item.title}</h3>
      <p className="card-description">{item.description}</p>

      {(item.dueDate || item.dueTime) && (
        <div className={`card-due-date ${isOverdue() ? 'overdue-text' : ''}`}>
          <span className="due-icon">📅</span>
          <span>{formatDateTime(item.dueDate, item.dueTime)}</span>
          {isOverdue() && <span className="overdue-badge">Просрочено</span>}
        </div>
      )}

      <div className="card-footer">
        <div className="card-meta">
          <span className="card-date">
            {formatDate(item.date)}
          </span>
          <button
            className="like-button"
            onClick={() => onToggleLike(item.id)}
          >
            ❤️ {item.likes}
          </button>
        </div>

        <div className="card-actions">
          <button
            className={`status-button ${item.status === 'completed' ? 'active' : ''}`}
            onClick={() => onToggleStatus(item.id)}
            title={item.status === 'completed' ? 'Вернуть в активные' : 'Отметить как завершенную'}
          >
            {item.status === 'completed' ? '✓' : '○'}
          </button>
          <button
            className="edit-button"
            onClick={() => onEdit(item)}
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            className="delete-button"
            onClick={() => {
              if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
                onDelete(item.id);
              }
            }}
            title="Удалить"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;