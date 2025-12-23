/**
 * Utility function to safely convert error objects to strings
 * to avoid "Objects are not valid as a React child" errors
 */
export const getErrorMessage = (error: any): string => {
  if (error === null || error === undefined) {
    return 'An unknown error occurred';
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object') {
    // Check for common error object patterns
    if (error.message && typeof error.message === 'string') {
      return error.message;
    }
    
    if (error.error && typeof error.error === 'string') {
      return error.error;
    }
    
    if (error.status && error.path) {
      return `Error ${error.status} at ${error.path}`;
    }
    
    // Try to stringify the object, but handle circular references
    try {
      return JSON.stringify(error);
    } catch (e) {
      return 'Complex error object (could not stringify)';
    }
  }
  
  return 'An unexpected error occurred';
};
