import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Create the Task Context
const TaskContext = createContext(undefined);

/**
 * TaskProvider component that provides task management functionality to the component tree
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - TaskProvider component
 */
export function TaskProvider({ children }) {
  // State management with localStorage persistence
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [filter, setFilter] = useLocalStorage('taskFilter', 'all');

  /**
   * Add a new task to the list
   * @param {string} description - The task description
   */
  const addTask = useCallback((description) => {
    if (!description || description.trim() === '') {
      return; // Prevent empty task creation
    }

    const newTask = {
      id: uuidv4(),
      description: description.trim(),
      completed: false,
      createdAt: new Date(),
      order: tasks.length // Set order based on current length
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
  }, [tasks.length, setTasks]);

  /**
   * Toggle the completion status of a task
   * @param {string} id - The task ID
   */
  const toggleTask = useCallback((id) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }, [setTasks]);

  /**
   * Delete a task from the list
   * @param {string} id - The task ID
   */
  const deleteTask = useCallback((id) => {
    setTasks(prevTasks => {
      const filteredTasks = prevTasks.filter(task => task.id !== id);
      // Reorder remaining tasks to maintain sequential order
      return filteredTasks.map((task, index) => ({
        ...task,
        order: index
      }));
    });
  }, [setTasks]);

  /**
   * Reorder tasks based on drag and drop operation
   * @param {number} startIndex - The starting index of the dragged item
   * @param {number} endIndex - The ending index where the item is dropped
   */
  const reorderTasks = useCallback((startIndex, endIndex) => {
    setTasks(prevTasks => {
      const result = Array.from(prevTasks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      
      // Update order property for all tasks
      return result.map((task, index) => ({
        ...task,
        order: index
      }));
    });
  }, [setTasks]);

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

  // Context value object
  const contextValue = useMemo(() => ({
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    filter,
    setFilter,
    filteredTasks
  }), [
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    reorderTasks,
    filter,
    setFilter,
    filteredTasks
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