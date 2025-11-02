import { useState, useCallback, memo } from 'react';
import { useTaskContext } from '../contexts/TaskContext';
import { validateTaskDescription, sanitizeInput } from '../utils/validation';
import './TaskForm.css';

/**
 * TaskForm component for creating new tasks with validation
 * Memoized to prevent unnecessary re-renders
 * @returns {JSX.Element} - TaskForm component
 */
const TaskForm = memo(function TaskForm() {
  const { addTask } = useTaskContext();
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle form submission with validation and sanitization
   * @param {Event} e - Form submit event
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Clear previous error
    setError('');
    
    try {
      setIsSubmitting(true);
      
      // Validate and sanitize the input
      const validation = validateTaskDescription(inputValue);
      
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }

      // Use the sanitized value
      const sanitizedDescription = validation.sanitized;
      
      // Add the task with sanitized description
      addTask(sanitizedDescription);
      
      // Clear the input field after successful creation
      setInputValue('');
      setError('');
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [addTask, inputValue]);

  /**
   * Handle input change with real-time sanitization
   * @param {Event} e - Input change event
   */
  const handleInputChange = useCallback((e) => {
    let value = e.target.value;
    
    // Apply basic sanitization in real-time to prevent obvious XSS attempts
    // But allow the user to see what they're typing
    const sanitized = sanitizeInput(value);
    
    // If the sanitized version is significantly different, use the sanitized version
    // This prevents script tags and other dangerous content from being displayed
    if (sanitized !== value && (value.includes('<') || value.includes('javascript:'))) {
      value = sanitized;
    }
    
    setInputValue(value);
    
    // Clear error when user starts typing valid content
    if (error && value.trim()) {
      setError('');
    }
    
    // Show real-time validation for length
    if (value.length > 500) {
      setError('Task description must be 500 characters or less');
    }
  }, [error]);

  /**
   * Handle key down for accessibility (replacing deprecated onKeyPress)
   * @param {Event} e - Key down event
   */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

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
            onKeyDown={handleKeyDown}
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
});

export default TaskForm;