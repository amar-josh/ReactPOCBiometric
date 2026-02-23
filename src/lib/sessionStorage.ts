export const setSessionStorageData = (key: string, data: unknown) => {
  try {
    const serializableState = JSON.stringify(data);
    sessionStorage.setItem(key, serializableState);
  } catch (error) {
    console.log("Error occurred while saving session data:", error);
  }
};

const normalizeValue = (value: any): any => {
  if (value === "null" || value === "undefined") {
    return null;
  }
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalizeValue(v)])
    );
  }
  return value;
};

export const getSessionStorageData = <T>(key: string): T | null => {
  try {
    const serializableState = sessionStorage.getItem(key);
    if (!serializableState) return null;

    const parsed = JSON.parse(serializableState);
    return normalizeValue(parsed) as T;
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
