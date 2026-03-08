/**
 * Fisher-Yates shuffle algorithm
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random item from array
 */
export const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Get random items from array
 */
export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
};
