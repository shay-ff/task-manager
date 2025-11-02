import { memo } from 'react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import TaskItem from './TaskItem';
import './SortableTaskItem.css';

/**
 * SortableTaskItem component - Wraps TaskItem with drag-and-drop functionality
 * Memoized to prevent unnecessary re-renders during drag operations
 */
const SortableTaskItem = memo(({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-task-item ${isDragging ? 'sortable-task-item--dragging' : ''}`}
    >
      <div className="sortable-task-item__content">
        <div
          className="sortable-task-item__drag-handle"
          {...attributes}
          {...listeners}
          aria-label={`Drag to reorder task: ${task.description}`}
        >
          <svg
            className="sortable-task-item__drag-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        <div className="sortable-task-item__task">
          <TaskItem task={task} />
        </div>
      </div>
    </div>
  );
});

SortableTaskItem.displayName = 'SortableTaskItem';

export default SortableTaskItem;