import React, { memo, useCallback, useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import './TaskItem.css';

/**
 * TaskItem component - Individual task with checkbox, text, and delete functionality
 * Memoized to prevent unnecessary re-renders when other tasks change
 */
const TaskItem = memo(({ task }) => {
  const { toggleTask, deleteTask } = useTaskContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Memoized event handlers to prevent unnecessary re-renders
  const handleToggle = useCallback(() => {
    toggleTask(task.id);
  }, [task.id, toggleTask]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  }, [task.id, deleteTask]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteConfirm(false);
  }, []);

  return (
    <div className={`task-item ${task.completed ? 'task-item--completed' : ''}`}>
      <div className="task-item__content">
        <label className="task-item__checkbox-wrapper">
          <input
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            onChange={handleToggle}
            aria-label={`Mark task "${task.description}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="task-item__checkmark"></span>
        </label>
        
        <span className={`task-item__text ${task.completed ? 'task-item__text--completed' : ''}`}>
          {task.description}
        </span>
      </div>

      <div className="task-item__actions">
        {showDeleteConfirm ? (
          <div className="task-item__delete-confirm">
            <button
              className="task-item__confirm-btn task-item__confirm-btn--danger"
              onClick={handleConfirmDelete}
              aria-label="Confirm delete task"
            >
              Delete
            </button>
            <button
              className="task-item__confirm-btn task-item__confirm-btn--cancel"
              onClick={handleCancelDelete}
              aria-label="Cancel delete task"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="task-item__delete-btn"
            onClick={handleDeleteClick}
            aria-label={`Delete task "${task.description}"`}
          >
            <svg
              className="task-item__delete-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;