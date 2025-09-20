// Hydration utility to prevent SSR/client mismatches
export const isClient = typeof window !== 'undefined';

export const isServer = typeof window === 'undefined';

// Safe localStorage access
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (isClient) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('localStorage access failed:', error);
        return null;
      }
    }
    return null;
  },
  
  setItem: (key: string, value: string): void => {
    if (isClient) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('localStorage setItem failed:', error);
      }
    }
  },
  
  removeItem: (key: string): void => {
    if (isClient) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('localStorage removeItem failed:', error);
      }
    }
  }
};

// Safe document access
export const safeDocument = {
  getElementById: (id: string): HTMLElement | null => {
    if (isClient) {
      return document.getElementById(id);
    }
    return null;
  },
  
  querySelector: (selector: string): Element | null => {
    if (isClient) {
      return document.querySelector(selector);
    }
    return null;
  },
  
  addEventListener: (event: string, handler: EventListener): void => {
    if (isClient) {
      document.addEventListener(event, handler);
    }
  },
  
  removeEventListener: (event: string, handler: EventListener): void => {
    if (isClient) {
      document.removeEventListener(event, handler);
    }
  }
};
