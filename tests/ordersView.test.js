import { test } from "node:test";
import assert from "node:assert/strict";
import { renderOrdersList } from "../js/render/ordersView.js";

test("renderOrdersList shows product name, qty, and status", () => {
  const orders = [
    { id: "o000001", productId: "p000001", qty: 20, status: "담김", orderedAt: "2026-07-09" },
  ];
  const products = [{ id: "p000001", name: "발목양말" }];
  const html = renderOrdersList(orders, products);
  assert.match(html, /발목양말/);
  assert.match(html, /20/);
  assert.match(html, /담김/);
  assert.match(html, /data-order-id="o000001"/);
});

test("renderOrdersList shows mark-ordered button only for 담김 status", () => {
  const orders = [
    { id: "o000001", productId: "p000001", qty: 20, status: "담김", orderedAt: "2026-07-09" },
    { id: "o000002", productId: "p000001", qty: 10, status: "발주완료", orderedAt: "2026-07-08" },
  ];
  const products = [{ id: "p000001", name: "발목양말" }];
  const html = renderOrdersList(orders, products);
  assert.match(html, /data-mark-ordered="o000001"/);
  assert.doesNotMatch(html, /data-mark-ordered="o000002"/);
});

test("renderOrdersList shows edit-qty button only for 담김 status", () => {
  const orders = [
    { id: "o000001", productId: "p000001", qty: 20, status: "담김", orderedAt: "2026-07-09" },
    { id: "o000002", productId: "p000001", qty: 10, status: "발주완료", orderedAt: "2026-07-08" },
  ];
  const products = [{ id: "p000001", name: "발목양말" }];
  const html = renderOrdersList(orders, products);
  assert.match(html, /data-edit-qty="o000001"/);
  assert.doesNotMatch(html, /data-edit-qty="o000002"/);
});
