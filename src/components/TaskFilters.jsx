import React from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import './TaskFilters.css';

/**
 * TaskFilters component for filtering tasks by status
 * @returns {JSX.Element} - TaskFilters component
 */
function TaskFilters() {
  const { filter, setFilter, tasks } = useTaskContext();

  // Calculate task counts for each filter
  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length
  };

  /**
   * Handle filter change
   * @param {string} newFilter - The new filter to apply
   */
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  /**
   * Filter button configuration
   */
  const filterButtons = [
    {
      key: 'all',
      label: 'All Tasks',
      count: taskCounts.all,
      icon: '📋'
    },
    {
      key: 'pending',
      label: 'Pending',
      count: taskCounts.pending,
      icon: '⏳'
    },
    {
      key: 'completed',
      label: 'Completed',
      count: taskCounts.completed,
      icon: '✅'
    }
  ];

  return (
    <div className="task-filters">
      <div className="filters-header">
        <h2 className="filters-title">Filter Tasks</h2>
        <span className="total-count">
          {taskCounts.all} {taskCounts.all === 1 ? 'task' : 'tasks'} total
        </span>
      </div>
      
      <div className="filter-buttons" role="tablist" aria-label="Task filter options">
        {filterButtons.map(({ key, label, count, icon }) => (
          <button
            key={key}
            className={`filter-button ${filter === key ? 'active' : ''}`}
            onClick={() => handleFilterChange(key)}
            role="tab"
            aria-selected={filter === key}
            aria-controls="task-list"
            aria-label={`Show ${label.toLowerCase()} (${count} ${count === 1 ? 'task' : 'tasks'})`}
          >
            <span className="filter-icon" aria-hidden="true">
              {icon}
            </span>
            <span className="filter-label">
              {label}
            </span>
            <span className="filter-count">
              {count}
            </span>
          </button>
        ))}
      </div>
      
      {/* Active filter indicator for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Currently showing {filter === 'all' ? 'all tasks' : `${filter} tasks`}. 
        {taskCounts[filter]} {taskCounts[filter] === 1 ? 'task' : 'tasks'} found.
      </div>
    </div>
  );
}

export default TaskFilters;