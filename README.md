# Task Manager App

A modern, responsive task management application built with React and Vite. Features drag-and-drop reordering, local storage persistence, theme switching, and comprehensive error handling.

## Features

- ✅ **Task Management**: Create, complete, and delete tasks
- 🎯 **Smart Filtering**: Filter tasks by all, completed, or pending status
- 🔄 **Drag & Drop**: Reorder tasks with intuitive drag-and-drop interface
- 💾 **Local Storage**: Automatic data persistence across browser sessions
- 🌙 **Theme Support**: Light and dark theme with system preference detection
- 🛡️ **Security**: XSS protection and input sanitization
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Performance Optimized**: React.memo, useCallback, and useMemo optimizations
- 🚨 **Error Handling**: Comprehensive error boundaries and graceful fallbacks

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Architecture

### Component Structure

```
src/
├── components/
│   ├── ErrorBoundary.jsx     # Error boundary for graceful error handling
│   ├── Header.jsx            # App header with theme toggle
│   ├── TaskForm.jsx          # Task creation form with validation
│   ├── TaskFilters.jsx       # Task filtering controls
│   ├── TaskList.jsx          # Main task list with drag-and-drop
│   ├── TaskItem.jsx          # Individual task item component
│   └── SortableTaskItem.jsx  # Drag-and-drop wrapper for tasks
├── contexts/
│   ├── TaskContext.jsx       # Task state management
│   └── ThemeContext.jsx      # Theme state management
├── hooks/
│   └── useLocalStorage.js    # Custom hook for localStorage with error handling
├── utils/
│   └── validation.js         # Data validation and sanitization utilities
└── App.jsx                   # Main application component
```

### Key Technologies

- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **@dnd-kit** - Modern drag-and-drop library
- **UUID** - Unique identifier generation
- **CSS Custom Properties** - Theme system implementation

## Security Features

### XSS Protection
- Input sanitization removes HTML tags and dangerous scripts
- Validation prevents malicious content injection
- Safe handling of user-generated content

### Data Validation
- Comprehensive validation for all user inputs
- localStorage data integrity checks
- Graceful handling of corrupted data

## Error Handling

### Error Boundaries
- Component-level error recovery
- Graceful fallback UI for broken components
- Development-mode error details

### Storage Error Handling
- localStorage quota exceeded scenarios
- Corrupted data recovery
- Cross-tab synchronization error handling

### Drag-and-Drop Error Handling
- Invalid drag operation recovery
- Index validation for reordering
- Graceful fallbacks for drag failures

## Performance Optimizations

- **React.memo**: Prevents unnecessary component re-renders
- **useCallback**: Memoizes event handlers and functions
- **useMemo**: Optimizes expensive computations (filtered tasks)
- **Lazy Loading**: Components loaded on demand
- **Efficient Re-rendering**: Optimized dependency arrays

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Local Storage Schema

### Tasks
```json
[
  {
    "id": "uuid-string",
    "description": "Task description",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "order": 0
  }
]
```

### Settings
- `taskFilter`: "all" | "completed" | "pending"
- `theme`: "light" | "dark"

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## Development Guidelines

### Code Style
- Use functional components with hooks
- Implement proper TypeScript-style JSDoc comments
- Follow React best practices for performance
- Use semantic HTML and ARIA attributes for accessibility

### Testing
- Write unit tests for utility functions
- Test error scenarios and edge cases
- Validate accessibility features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Drag-and-drop powered by [@dnd-kit](https://dndkit.com/)
- Icons from [Lucide React](https://lucide.dev/)