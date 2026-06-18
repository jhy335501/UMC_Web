const useLocalStorage = (key: string) => {
  function setItem(value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('localStorage setItem error:', error);
    }
  }

  function getItem<T>(): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('localStorage getItem error:', error);
      return null;
    }
  }

  function removeItem() {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('localStorage removeItem error:', error);
    }
  }

  return { setItem, getItem, removeItem };
};

export default useLocalStorage;
