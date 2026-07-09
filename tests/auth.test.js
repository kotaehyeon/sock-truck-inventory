import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkPassword,
  getStoredToken,
  setStoredToken,
  isUnlocked,
  setUnlocked,
} from "../js/auth.js";

function makeStorage() {
  const map = new Map();
  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, value),
  };
}

test("checkPassword matches exact string", () => {
  assert.equal(checkPassword("sock1234", "sock1234"), true);
  assert.equal(checkPassword("wrong", "sock1234"), false);
});

test("token storage round-trips through storage adapter", () => {
  const storage = makeStorage();
  assert.equal(getStoredToken(storage), null);
  setStoredToken(storage, "ghp_abc123");
  assert.equal(getStoredToken(storage), "ghp_abc123");
});

test("unlocked flag round-trips through storage adapter", () => {
  const storage = makeStorage();
  assert.equal(isUnlocked(storage), false);
  setUnlocked(storage);
  assert.equal(isUnlocked(storage), true);
});
