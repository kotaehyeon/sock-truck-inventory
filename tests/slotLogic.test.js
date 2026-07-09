import { test } from "node:test";
import assert from "node:assert/strict";
import { assignProduct, clearSlot } from "../js/logic/slotLogic.js";

test("assignProduct sets productId on matching slot only", () => {
  const slots = [
    { id: "A-1-1", stand: "A", row: 1, col: 1, productId: null },
    { id: "A-1-2", stand: "A", row: 1, col: 2, productId: null },
  ];
  const result = assignProduct(slots, "A-1-1", "p000001");
  assert.equal(result[0].productId, "p000001");
  assert.equal(result[1].productId, null);
});

test("clearSlot resets productId to null", () => {
  const slots = [{ id: "A-1-1", stand: "A", row: 1, col: 1, productId: "p000001" }];
  const result = clearSlot(slots, "A-1-1");
  assert.equal(result[0].productId, null);
});

test("assignProduct throws when slotId does not exist", () => {
  const slots = [{ id: "A-1-1", stand: "A", row: 1, col: 1, productId: null }];
  assert.throws(() => assignProduct(slots, "Z-9-9", "p000001"), /slot not found: Z-9-9/);
});
