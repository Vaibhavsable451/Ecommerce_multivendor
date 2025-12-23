export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateMobile = (mobile: string): boolean => {
  const re = /^[0-9]{10}$/;
  return re.test(mobile);
};