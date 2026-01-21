import { NavigateFunction } from 'react-router-dom';

/**
 * Utility function to check if the user is an admin and automatically redirect to admin dashboard
 * @param navigate - React Router's navigate function
 * @returns boolean - Whether the user was redirected
 */
export const checkAdminAutoLogin = (navigate: NavigateFunction): boolean => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const adminJwt = localStorage.getItem('adminJwt');
  
  if (isAdmin && adminJwt) {
    navigate('/admin');
    return true;
  }
  
  return false;
};
