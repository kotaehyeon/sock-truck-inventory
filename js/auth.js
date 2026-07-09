const TOKEN_KEY = "sock-truck-github-token";
const UNLOCKED_KEY = "sock-truck-unlocked";

export function checkPassword(input, storedPassword) {
  return input === storedPassword;
}

export function getStoredToken(storage) {
  return storage.getItem(TOKEN_KEY);
}

export function setStoredToken(storage, token) {
  storage.setItem(TOKEN_KEY, token);
}

export function isUnlocked(storage) {
  return storage.getItem(UNLOCKED_KEY) === "true";
}

export function setUnlocked(storage) {
  storage.setItem(UNLOCKED_KEY, "true");
}
