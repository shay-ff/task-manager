import { useState, useEffect, useCallback } from 'react';
import { validateLocalStorageData } from '../utils/validation';

/**
 * Custom hook for managing localStorage with comprehensive error handling and fallback behavior
 * @param {string} key - The localStorage key
 * @param {*} initialValue - The initial value if no stored value exists
 * @returns {[*, function, object]} - Returns [storedValue, setValue, errorState] tuple
 */
export function useLocalStorage(key, initialValue) {
  // State to track localStorage errors
  const [errorState, setErrorState] = useState({
    hasError: false,
    errorType: null,
    errorMessage: null
  });

  // Check if localStorage is available
  const isLocalStorageAvailable = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      
      // Test localStorage functionality
      const testKey = '__localStorage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  // Validate and sanitize data from localStorage using centralized validation
  const validateStoredData = useCallback((data, key) => {
    const validation = validateLocalStorageData(key, data);
    return {
      isValid: validation.isValid,
      reason: validation.error,
      sanitized: validation.sanitized
    };
  }, []);

  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Check if localStorage is available
      if (!isLocalStorageAvailable()) {
        setErrorState({
          hasError: true,
          errorType: 'UNAVAILABLE',
          errorMessage: 'localStorage is not available'
        });
        return initialValue;
      }

      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        return initialValue;
      }

      // Parse stored json
      const parsedData = JSON.parse(item);
      
      // Validate the parsed data
      const validation = validateStoredData(parsedData, key);
      if (!validation.isValid) {
        console.warn(`Invalid localStorage data for key "${key}": ${validation.reason}`);
        setErrorState({
          hasError: true,
          errorType: 'INVALID_DATA',
          errorMessage: validation.reason
        });
        
        // Clear corrupted data and return initial value
        window.localStorage.removeItem(key);
        return initialValue;
      }

      // Clear any previous errors
      setErrorState({
        hasError: false,
        errorType: null,
        errorMessage: null
      });

      // Return sanitized data if available, otherwise original data
      return validation.sanitized !== undefined ? validation.sanitized : parsedData;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      
      // Determine error type
      let errorType = 'PARSE_ERROR';
      if (error.name === 'QuotaExceededError') {
        errorType = 'QUOTA_EXCEEDED';
      } else if (error.name === 'SecurityError') {
        errorType = 'SECURITY_ERROR';
      }

      setErrorState({
        hasError: true,
        errorType,
        errorMessage: error.message
      });

      // Try to clear corrupted data
      try {
        if (isLocalStorageAvailable()) {
          window.localStorage.removeItem(key);
        }
      } catch (clearError) {
        console.warn(`Could not clear corrupted localStorage key "${key}":`, clearError);
      }

      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Validate and sanitize data before storing
      const validation = validateStoredData(valueToStore, key);
      if (!validation.isValid) {
        console.warn(`Attempted to store invalid data for key "${key}": ${validation.reason}`);
        setErrorState({
          hasError: true,
          errorType: 'INVALID_DATA',
          errorMessage: `Cannot store invalid data: ${validation.reason}`
        });
        return;
      }

      // Use sanitized data if available
      const dataToStore = validation.sanitized !== undefined ? validation.sanitized : valueToStore;
      
      // Save state first
      setStoredValue(dataToStore);
      
      // Save to local storage if available
      if (isLocalStorageAvailable()) {
        const serializedValue = JSON.stringify(dataToStore);
        
        // Check if the serialized data would exceed reasonable size limits
        if (serializedValue.length > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('Data size exceeds reasonable localStorage limits');
        }
        
        window.localStorage.setItem(key, serializedValue);
        
        // Clear any previous errors on successful save
        setErrorState({
          hasError: false,
          errorType: null,
          errorMessage: null
        });
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      
      // Determine error type
      let errorType = 'WRITE_ERROR';
      let errorMessage = error.message;
      
      if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
        errorType = 'QUOTA_EXCEEDED';
        errorMessage = 'Storage quota exceeded. Try deleting some tasks or clearing browser data.';
        
        // Attempt to free up space by clearing old data
        try {
          if (isLocalStorageAvailable()) {
            // Clear non-essential data first
            const keysToTry = ['taskFilter', 'theme'];
            for (const keyToRemove of keysToTry) {
              if (keyToRemove !== key) {
                window.localStorage.removeItem(keyToRemove);
              }
            }
            
            // Try saving again with reduced data
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            errorMessage = 'Storage quota exceeded but data was saved after cleanup.';
          }
        } catch (retryError) {
          console.error('Failed to save data even after cleanup:', retryError);
        }
      } else if (error.name === 'SecurityError') {
        errorType = 'SECURITY_ERROR';
        errorMessage = 'Cannot access localStorage due to security restrictions.';
      }

      setErrorState({
        hasError: true,
        errorType,
        errorMessage
      });
      
      // Still update the state even if localStorage fails
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    }
  }, [storedValue, key, isLocalStorageAvailable, validateStoredData]);

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    // Only add listener if localStorage is available
    if (typeof window !== 'undefined' && window.localStorage) {
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key]);

  return [storedValue, setValue, errorState];
}