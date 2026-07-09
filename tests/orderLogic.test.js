import { test } from "node:test";
import assert from "node:assert/strict";
import { addToOrderList, markOrdered, updateOrderQty } from "../js/logic/orderLogic.js";

test("addToOrderList appends order with 담김 status and sequential id", () => {
  const orders = [];
  const result = addToOrderList(orders, "p000001", 20, "2026-07-09");
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "o000001");
  assert.equal(result[0].status, "담김");
  assert.equal(result[0].qty, 20);
  assert.equal(result[0].orderedAt, "2026-07-09");
});

test("markOrdered changes status of matching order only", () => {
  const orders = [
    { id: "o000001", productId: "p000001", qty: 20, status: "담김", orderedAt: "2026-07-09" },
    { id: "o000002", productId: "p000002", qty: 10, status: "담김", orderedAt: "2026-07-09" },
  ];
  const result = markOrdered(orders, "o000001");
  assert.equal(result[0].status, "발주완료");
  assert.equal(result[1].status, "담김");
});

test("updateOrderQty changes qty of matching order only", () => {
  const orders = [
    { id: "o000001", productId: "p000001", qty: 20, status: "담김", orderedAt: "2026-07-09" },
    { id: "o000002", productId: "p000002", qty: 10, status: "담김", orderedAt: "2026-07-09" },
  ];
  const result = updateOrderQty(orders, "o000001", 35);
  assert.equal(result[0].qty, 35);
  assert.equal(result[1].qty, 10);
});
