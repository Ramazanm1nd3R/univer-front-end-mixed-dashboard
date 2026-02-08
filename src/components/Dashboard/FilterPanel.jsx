import React from 'react';

function FilterPanel({ filters, setFilters, sortBy, setSortBy }) {
  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Поиск:</label>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="filter-group">
        <label>Категория:</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="all">Все</option>
          <option value="work">Работа</option>
          <option value="personal">Личное</option>
          <option value="health">Здоровье</option>
          <option value="other">Другое</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Статус:</label>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">Все</option>
          <option value="active">Активные</option>
          <option value="completed">Завершенные</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Сортировка:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">По дате</option>
          <option value="title">По названию</option>
          <option value="priority">По приоритету</option>
          <option value="likes">По лайкам</option>
        </select>
      </div>

      <button
        className="reset-filters"
        onClick={() => {
          setFilters({ category: 'all', status: 'all', search: '' });
          setSortBy('date');
        }}
      >
        Сбросить фильтры
      </button>
    </div>
  );
}

export default FilterPanel;