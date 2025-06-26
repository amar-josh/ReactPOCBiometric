export const setSessionStorageData = (key: string, data: unknown) => {
  try {
    const serializableState = JSON.stringify(data);
    sessionStorage.setItem(key, serializableState);
  } catch (error) {
    console.log("Error occurred while saving session data:", error);
  }
};

export const getSessionStorageData = <T>(key: string): T | null => {
  try {
    const serializableState = sessionStorage.getItem(key);
    return serializableState ? (JSON.parse(serializableState) as T) : null;
  } catch (error) {
    console.log("Error occurred while fetching session data:", error);
    return null;
  }
};

export const removeSessionStorageData = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.log("Error occurred while removing session data:", error);
  }
};

export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.log("Error occurred while clearing session storage:", error);
  }
};
