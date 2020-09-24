export function setLocalStorage(key, value) {
  localStorage.setItem(key, value)
}

export function getLocalStorage(key) {
  return localStorage.getItem(key)
}

export function removeStorage(key) {
  return localStorage.removeItem(key)
}
