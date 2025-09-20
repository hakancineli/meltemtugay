// Global error handler for console errors
export const setupErrorHandlers = () => {
  // Handle uncaught errors
  const handleError = (event: ErrorEvent) => {
    if (
      event.message.includes('querySelector') ||
      event.message.includes('message port closed') ||
      event.message.includes('chrome-extension') ||
      event.message.includes('Unchecked runtime.lastError')
    ) {
      event.preventDefault();
      return false;
    }
  };

  // Handle unhandled promise rejections
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (
      event.reason &&
      typeof event.reason === 'object' &&
      'message' in event.reason &&
      typeof event.reason.message === 'string' &&
      (event.reason.message.includes('querySelector') ||
        event.reason.message.includes('message port closed') ||
        event.reason.message.includes('chrome-extension'))
    ) {
      event.preventDefault();
      return false;
    }
  };

  // Add event listeners
  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  // Cleanup function
  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
};

// Console error suppression
export const suppressConsoleErrors = () => {
  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (
      message.includes('querySelector') ||
      message.includes('message port closed') ||
      message.includes('chrome-extension') ||
      message.includes('Unchecked runtime.lastError')
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    if (
      message.includes('querySelector') ||
      message.includes('message port closed') ||
      message.includes('chrome-extension') ||
      message.includes('Unchecked runtime.lastError')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
};
