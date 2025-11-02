/**
 * Utility functions for data validation and sanitization
 */

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Validate task description
 * @param {string} description - The task description to validate
 * @returns {object} - Validation result with isValid and error message
 */
export function validateTaskDescription(description) {
  // Sanitize first
  const sanitized = sanitizeInput(description);
  
  if (!sanitized || sanitized.length === 0) {
    return {
      isValid: false,
      error: 'Task description cannot be empty',
      sanitized: ''
    };
  }

  if (sanitized.length > 500) {
    return {
      isValid: false,
      error: 'Task description must be 500 characters or less',
      sanitized: sanitized.substring(0, 500)
    };
  }

  // Check for suspicious patterns that might indicate XSS attempts
  const suspiciousPatterns = [
    /javascript:/i,
    /vbscript:/i,
    /data:/i,
    /onload/i,
    /onerror/i,
    /onclick/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<script/i
  ];

  const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
    pattern.test(description)
  );

  if (hasSuspiciousContent) {
    return {
      isValid: false,
      error: 'Task description contains invalid characters',
      sanitized
    };
  }

  return {
    isValid: true,
    error: null,
    sanitized
  };
}

/**
 * Validate task object structure
 * @param {object} task - The task object to validate
 * @returns {object} - Validation result
 */
export function validateTaskObject(task) {
  if (!task || typeof task !== 'object') {
    return {
      isValid: false,
      error: 'Task must be an object'
    };
  }

  // Required fields
  const requiredFields = ['id', 'description', 'completed'];
  const missingFields = requiredFields.filter(field => !(field in task));
  
  if (missingFields.length > 0) {
    return {
      isValid: false,
      error: `Missing required fields: ${missingFields.join(', ')}`
    };
  }

  // Validate field types
  if (typeof task.id !== 'string' || task.id.length === 0) {
    return {
      isValid: false,
      error: 'Task ID must be a non-empty string'
    };
  }

  if (typeof task.description !== 'string') {
    return {
      isValid: false,
      error: 'Task description must be a string'
    };
  }

  if (typeof task.completed !== 'boolean') {
    return {
      isValid: false,
      error: 'Task completed status must be a boolean'
    };
  }

  // Validate optional fields
  if (task.createdAt && !(task.createdAt instanceof Date) && typeof task.createdAt !== 'string') {
    return {
      isValid: false,
      error: 'Task createdAt must be a Date or string'
    };
  }

  if (task.order !== undefined && (typeof task.order !== 'number' || task.order < 0)) {
    return {
      isValid: false,
      error: 'Task order must be a non-negative number'
    };
  }

  // Validate description content
  const descriptionValidation = validateTaskDescription(task.description);
  if (!descriptionValidation.isValid) {
    return {
      isValid: false,
      error: `Task description validation failed: ${descriptionValidation.error}`
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validate and sanitize an array of tasks
 * @param {Array} tasks - The tasks array to validate
 * @returns {object} - Validation result with sanitized tasks
 */
export function validateTasksArray(tasks) {
  if (!Array.isArray(tasks)) {
    return {
      isValid: false,
      error: 'Tasks must be an array',
      sanitizedTasks: []
    };
  }

  const sanitizedTasks = [];
  const errors = [];

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const validation = validateTaskObject(task);
    
    if (validation.isValid) {
      // Sanitize the task description
      const descriptionValidation = validateTaskDescription(task.description);
      sanitizedTasks.push({
        ...task,
        description: descriptionValidation.sanitized,
        // Ensure dates are properly handled
        createdAt: task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt || Date.now()),
        // Ensure order is a number
        order: typeof task.order === 'number' ? task.order : i
      });
    } else {
      errors.push(`Task ${i}: ${validation.error}`);
    }
  }

  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? errors.join('; ') : null,
    sanitizedTasks,
    removedCount: tasks.length - sanitizedTasks.length
  };
}

/**
 * Validate filter type
 * @param {string} filter - The filter value to validate
 * @returns {object} - Validation result
 */
export function validateFilter(filter) {
  const validFilters = ['all', 'completed', 'pending'];
  
  if (!validFilters.includes(filter)) {
    return {
      isValid: false,
      error: `Invalid filter type. Must be one of: ${validFilters.join(', ')}`,
      sanitized: 'all'
    };
  }

  return {
    isValid: true,
    error: null,
    sanitized: filter
  };
}

/**
 * Sanitize and validate localStorage data
 * @param {string} key - The localStorage key
 * @param {*} data - The data to validate
 * @returns {object} - Validation result with sanitized data
 */
export function validateLocalStorageData(key, data) {
  try {
    switch (key) {
      case 'tasks':
        return validateTasksArray(data);
      
      case 'taskFilter':
        return validateFilter(data);
      
      case 'theme':
        const validThemes = ['light', 'dark'];
        if (!validThemes.includes(data)) {
          return {
            isValid: false,
            error: 'Invalid theme value',
            sanitized: 'light'
          };
        }
        return {
          isValid: true,
          error: null,
          sanitized: data
        };
      
      default:
        // For unknown keys, just ensure it's not dangerous
        if (typeof data === 'string') {
          return {
            isValid: true,
            error: null,
            sanitized: sanitizeInput(data)
          };
        }
        return {
          isValid: true,
          error: null,
          sanitized: data
        };
    }
  } catch (error) {
    return {
      isValid: false,
      error: `Validation error: ${error.message}`,
      sanitized: null
    };
  }
}