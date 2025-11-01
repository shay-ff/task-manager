import React, { useState } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import './TaskForm.css';

/**
 * TaskForm component for creating new tasks with validation
 * @returns {JSX.Element} - TaskForm component
 */
function TaskForm() {
  const { addTask } = useTaskContext();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    // Validate input
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      setError('Task description cannot be empty');
      return;
    }

    if (trimmedValue.length > 500) {
      setError('Task description must be 500 characters or less');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Add the task
      addTask(trimmedValue);
      
      // Clear the input field after successful creation
      setInputValue('');
      setError('');
    } catch (err) {
      setError('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError('');
    }
  };

  /**
   * Handle key press for accessibility
   * @param {Event} e - Key press event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="task-form-container">
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <label htmlFor="task-input" className="sr-only">
            Enter a new task
          </label>
          <input
            id="task-input"
            type="text"
            className={`task-input ${error ? 'error' : ''}`}
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isSubmitting}
            maxLength={500}
            aria-describedby={error ? 'task-error' : undefined}
            aria-invalid={error ? 'true' : 'false'}
          />
          <button
            type="submit"
            className="add-button primary"
            disabled={isSubmitting || !inputValue.trim()}
            aria-label="Add new task"
          >
            {isSubmitting ? (
              <span className="loading-spinner" aria-hidden="true">⏳</span>
            ) : (
              <span aria-hidden="true">+</span>
            )}
            <span className="button-text">
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </span>
          </button>
        </div>
        
        {error && (
          <div 
            id="task-error" 
            className="error-message" 
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}
        
        <div className="form-hint">
          <span className="character-count">
            {inputValue.length}/500 characters
          </span>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;