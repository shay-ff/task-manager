
import { memo } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { TaskProvider } from './contexts/TaskContext';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  Header, 
  TaskForm, 
  TaskFilters, 
  TaskList 
} from './components';
import './App.css';

/**
 * Main App component - Assembles the complete task manager application
 * 
 * This component serves as the root of the application and is responsible for:
 * - Setting up context providers at the application root (ThemeProvider, TaskProvider)
 * - Implementing proper component hierarchy and data flow
 * - Providing responsive layout structure
 * - Coordinating between major application sections
 * 
 * Performance optimizations implemented:
 * - React.memo for preventing unnecessary re-renders
 * - Context providers handle useCallback and useMemo optimizations
 * - Proper dependency arrays in context providers
 * - Memoized filtered task computations in TaskContext
 * 
 * Requirements addressed:
 * - 1.1: Task creation functionality through TaskForm
 * - 2.1: Task completion tracking through TaskList
 * - 3.1: Task deletion through TaskList
 * - 4.1: Task filtering through TaskFilters
 * - 5.1: Data persistence through context providers
 * - 6.1: Theme management through ThemeProvider
 * - 7.1: Smooth animations through component integration
 * - 8.1: Drag-and-drop through TaskList
 * - 9.1: Responsive design through layout structure
 * - 10.1: React.memo optimization for components
 * - 10.2: useCallback for event handlers in contexts
 * - 10.3: useMemo for filtered task lists in TaskContext
 * - 10.4: Optimized re-rendering with proper dependency arrays
 */
const App = memo(function App() {
  return (
    <ErrorBoundary fallbackMessage="The Task Manager encountered an unexpected error. Your tasks are safely stored and will be restored when you reload the page.">
      <ThemeProvider>
        <TaskProvider>
          <div className="app">
            {/* Application header with theme toggle */}
            <ErrorBoundary fallbackMessage="There was an error with the header. Try refreshing the page.">
              <Header />
            </ErrorBoundary>
            
            {/* Main content area with task management functionality */}
            <main className="app__main">
              <div className="app__container">
                <div className="app__content">
                  {/* Task creation form */}
                  <ErrorBoundary fallbackMessage="There was an error with the task form. Try refreshing the page to continue adding tasks.">
                    <TaskForm />
                  </ErrorBoundary>
                  
                  {/* Task filtering controls */}
                  <ErrorBoundary fallbackMessage="There was an error with the task filters. Try refreshing the page.">
                    <TaskFilters />
                  </ErrorBoundary>
                  
                  {/* Task list with drag-and-drop functionality */}
                  <ErrorBoundary fallbackMessage="There was an error displaying your tasks. Your tasks are safely stored and will be restored when you reload the page.">
                    <TaskList />
                  </ErrorBoundary>
                </div>
              </div>
            </main>
          </div>
        </TaskProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
});

export default App;
