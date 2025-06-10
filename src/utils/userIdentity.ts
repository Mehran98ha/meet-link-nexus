
/**
 * User Identity Management
 * Handles generation and persistence of user IDs for link ownership
 */

const USER_ID_KEY = 'lovelabel_user_id';

/**
 * Generate a cryptographically secure user ID
 */
export const generateUserId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get or create user ID from localStorage
 */
export const getUserId = (): string => {
  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = generateUserId();
      localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch (error) {
    console.warn('localStorage not available, generating temporary user ID');
    return generateUserId();
  }
};

/**
 * Check if localStorage is available and working
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Clear user ID (for testing or reset purposes)
 */
export const clearUserId = (): void => {
  try {
    localStorage.removeItem(USER_ID_KEY);
  } catch (error) {
    console.warn('Could not clear user ID from localStorage');
  }
};
