import { test } from "node:test";
import assert from "node:assert/strict";
import { setQty, isLowStock } from "../js/logic/inventoryLogic.js";

test("setQty overwrites existing entry for the same product", () => {
  const inventory = [{ productId: "p000001", qty: 10, updatedAt: "2026-07-08" }];
  const result = setQty(inventory, "p000001", 4, "2026-07-09");
  assert.equal(result.length, 1);
  assert.equal(result[0].qty, 4);
  assert.equal(result[0].updatedAt, "2026-07-09");
});

test("setQty appends new entry when product has no prior record", () => {
  const inventory = [];
  const result = setQty(inventory, "p000001", 4, "2026-07-09");
  assert.equal(result.length, 1);
  assert.equal(result[0].productId, "p000001");
});

test("isLowStock returns true when qty is at or below minStock", () => {
  const product = { id: "p000001", minStock: 5 };
  assert.equal(isLowStock(product, [{ productId: "p000001", qty: 5 }]), true);
  assert.equal(isLowStock(product, [{ productId: "p000001", qty: 4 }]), true);
  assert.equal(isLowStock(product, [{ productId: "p000001", qty: 6 }]), false);
});

test("isLowStock treats missing inventory record as zero stock", () => {
  const product = { id: "p000001", minStock: 5 };
  assert.equal(isLowStock(product, []), true);
});
