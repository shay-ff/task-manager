import { createContext, useContext, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { validateTaskDescription, validateTasksArray } from '../utils/validation';

// Create the Task Context
const TaskContext = createContext(undefined);

/**
 * TaskProvider component that provides task management functionality to the component tree
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - TaskProvider component
 */
export function TaskProvider({ children }) {
  // State management with localStorage persistence and validation
  const [rawTasks, setRawTasks, tasksError] = useLocalStorage('tasks', []);
  const [filter, setFilter, filterError] = useLocalStorage('taskFilter', 'all');

  // Validate and sanitize tasks when they're loaded
  const tasks = useMemo(() => {
    if (!Array.isArray(rawTasks)) {
      console.warn('Tasks data is not an array, resetting to empty array');
      return [];
    }

    const validation = validateTasksArray(rawTasks);
    if (!validation.isValid) {
      console.warn('Invalid tasks data detected:', validation.error);
      if (validation.removedCount > 0) {
        console.warn(`Removed ${validation.removedCount} invalid tasks`);
      }
    }

    return validation.sanitizedTasks;
  }, [rawTasks]);

  /**
   * Add a new task to the list with validation and sanitization
   * @param {string} description - The task description
   */
  const addTask = useCallback((description) => {
    // Validate and sanitize the description
    const validation = validateTaskDescription(description);
    
    if (!validation.isValid) {
      console.error('Invalid task description:', validation.error);
      throw new Error(validation.error);
    }

    const newTask = {
      id: uuidv4(),
      description: validation.sanitized,
      completed: false,
      createdAt: new Date(),
      order: tasks.length // Set order based on current length
    };

    setRawTasks(prevTasks => [...prevTasks, newTask]);
  }, [tasks.length, setRawTasks]);

  /**
   * Toggle the completion status of a task with validation
   * @param {string} id - The task ID
   */
  const toggleTask = useCallback((id) => {
    if (!id || typeof id !== 'string') {
      console.error('Invalid task ID provided to toggleTask');
      return;
    }

    setRawTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }, [setRawTasks]);

  /**
   * Delete a task from the list with validation
   * @param {string} id - The task ID
   */
  const deleteTask = useCallback((id) => {
    if (!id || typeof id !== 'string') {
      console.error('Invalid task ID provided to deleteTask');
      return;
    }

    setRawTasks(prevTasks => {
      const filteredTasks = prevTasks.filter(task => task.id !== id);
      // Reorder remaining tasks to maintain sequential order
      return filteredTasks.map((task, index) => ({
        ...task,
        order: index
      }));
    });
  }, [setRawTasks]);

  /**
   * Reorder tasks based on drag and drop operation with validation
   * @param {number} startIndex - The starting index of the dragged item
   * @param {number} endIndex - The ending index where the item is dropped
   */
  const reorderTasks = useCallback((startIndex, endIndex) => {
    // Validate indices
    if (typeof startIndex !== 'number' || typeof endIndex !== 'number') {
      console.error('Invalid indices provided to reorderTasks');
      return;
    }

    if (startIndex < 0 || endIndex < 0) {
      console.error('Negative indices provided to reorderTasks');
      return;
    }

    if (startIndex >= tasks.length || endIndex >= tasks.length) {
      console.error('Indices out of bounds in reorderTasks');
      return;
    }

    setRawTasks(prevTasks => {
      const result = Array.from(prevTasks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Update order property for all tasks
      return result.map((task, index) => ({
        ...task,
        order: index
      }));
    });
  }, [tasks.length, setRawTasks]);

  /**
   * Get filtered tasks based on current filter
   * Memoized for performance optimization
   */
  const filteredTasks = useMemo(() => {
    // Sort tasks by order first
    const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
    
    switch (filter) {
      case 'completed':
        return sortedTasks.filter(task => task.completed);
      case 'pending':
        return sortedTasks.filter(task => !task.completed);
      case 'all':
      default:
        return sortedTasks;
    }
  }, [tasks, filter]);

  // Context value object with error states
  const contextValue = useMemo(() => ({
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    filter,
    setFilter,
    filteredTasks,
    // Expose error states for components to handle
    errors: {
      tasks: tasksError,
      filter: filterError
    }
  }), [
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    filter,
    setFilter,
    filteredTasks,
    tasksError,
    filterError
  ]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Custom hook to consume the Task Context
 * @returns {object} - Task context value with all task management functions
 * @throws {Error} - If used outside of TaskProvider
 */
export function useTaskContext() {
  const context = useContext(TaskContext);
  
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  
  return context;
}

export default TaskContext;