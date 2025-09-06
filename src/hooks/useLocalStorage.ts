import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.log('Error reading from localStorage:', error);
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      if (typeof window !== 'undefined') {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
}