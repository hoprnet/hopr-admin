export function getObjectFromLocalStorage(key: string) {
  try {
    const string = localStorage.getItem(key) as string;
    const object = JSON.parse(string);
    return object;
  } catch (e) {
    return null;
  }
}
