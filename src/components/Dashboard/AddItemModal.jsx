import React, { useState } from 'react';
import '../../styles/Dashboard.css';

function AddItemModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'other',
    priority: 'medium',
    status: 'active',
    dueDate: '',
    dueTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Пожалуйста, введите название задачи');
      return;
    }

    onAdd(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Добавить новую задачу</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Название задачи *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Введите название задачи"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Категория</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="work">Работа</option>
                <option value="personal">Личное</option>
                <option value="health">Здоровье</option>
                <option value="other">Другое</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Приоритет</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Срок (дата)</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueTime">Срок (время)</label>
              <input
                type="time"
                id="dueTime"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Статус</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Активная</option>
              <option value="completed">Завершенная</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="submit-button">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddItemModal;