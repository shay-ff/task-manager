import { memo, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import { useTaskContext } from '../contexts/TaskContext';
import SortableTaskItem from './SortableTaskItem';
import './TaskList.css';

/**
 * TaskList component - Displays filtered tasks with drag-and-drop reordering
 * Memoized for performance optimization with large task lists
 */
const TaskList = memo(() => {
  const { filteredTasks, reorderTasks } = useTaskContext();

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance to start dragging
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handle drag end event to reorder tasks with error handling
   * @param {object} event - The drag end event
   */
  const handleDragEnd = useCallback((event) => {
    try {
      const { active, over } = event;

      // Validate drag event data
      if (!active || !active.id) {
        console.warn('Invalid drag event: missing active item');
        return;
      }

      // Only proceed if dropped over a valid target
      if (active.id !== over?.id && over?.id) {
        const oldIndex = filteredTasks.findIndex(task => task.id === active.id);
        const newIndex = filteredTasks.findIndex(task => task.id === over.id);
        
        // Validate indices
        if (oldIndex === -1) {
          console.warn('Drag error: Could not find source task');
          return;
        }
        
        if (newIndex === -1) {
          console.warn('Drag error: Could not find target position');
          return;
        }

        // Validate that indices are within bounds
        if (oldIndex < 0 || oldIndex >= filteredTasks.length || 
            newIndex < 0 || newIndex >= filteredTasks.length) {
          console.warn('Drag error: Invalid task indices');
          return;
        }

        // Perform the reorder operation
        reorderTasks(oldIndex, newIndex);
      }
    } catch (error) {
      console.error('Error during drag and drop operation:', error);
      
      // Optionally show user-friendly error message
      // This could be enhanced with a toast notification system
      alert('Failed to reorder tasks. Please try again.');
    }
  }, [filteredTasks, reorderTasks]);

  /**
   * Handle drag start event with error handling
   * @param {object} event - The drag start event
   */
  const handleDragStart = useCallback((event) => {
    try {
      // Validate that we're dragging a valid task
      const taskExists = filteredTasks.some(task => task.id === event.active.id);
      if (!taskExists) {
        console.warn('Drag start error: Task not found in current list');
        return;
      }
    } catch (error) {
      console.error('Error during drag start:', error);
    }
  }, [filteredTasks]);

  /**
   * Handle drag cancel event
   * @param {object} event - The drag cancel event
   */
  const handleDragCancel = useCallback(() => {
    // Log for debugging purposes
    console.log('Drag operation was cancelled');
  }, []);

  // Show empty state if no tasks
  if (filteredTasks.length === 0) {
    return (
      <div className="task-list task-list--empty">
        <div className="task-list__empty-state">
          <svg
            className="task-list__empty-icon"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L19.7071 9.70711C19.8946 9.89464 20 10.149 20 10.4142V19C20 20.1046 19.1046 21 18 21H17Z"/>
          </svg>
          <p className="task-list__empty-text">No tasks found</p>
          <p className="task-list__empty-subtext">
            Add a new task above to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext
          items={filteredTasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="task-list__container">
            {filteredTasks.map((task) => (
              <SortableTaskItem
                key={task.id}
                task={task}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
});

TaskList.displayName = 'TaskList';

export default TaskList;