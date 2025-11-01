// Core Task interface
export interface Task {
  id: string;          // UUID for unique identification
  description: string; // User-provided task description
  completed: boolean;  // Completion status
  createdAt: Date;    // Creation timestamp
  order: number;      // Position for drag-and-drop ordering
}

// Filter types for task display
export type FilterType = 'all' | 'completed' | 'pending';

// Theme configuration interface
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    danger: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

// Theme type for light/dark mode
export type Theme = 'light' | 'dark';

// Context interfaces
export interface TaskContextType {
  tasks: Task[];
  addTask: (description: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  filteredTasks: Task[];
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}