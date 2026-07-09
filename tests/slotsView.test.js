import { test } from "node:test";
import assert from "node:assert/strict";
import { renderStandGrid } from "../js/render/slotsView.js";

test("renderStandGrid renders product name in assigned slot", () => {
  const slots = [
    { id: "A-1-1", stand: "A", row: 1, col: 1, productId: "p000001" },
    { id: "A-1-2", stand: "A", row: 1, col: 2, productId: null },
  ];
  const products = [{ id: "p000001", name: "발목양말" }];
  const html = renderStandGrid("A", slots, products);
  assert.match(html, /data-slot-id="A-1-1"/);
  assert.match(html, /발목양말/);
  assert.match(html, /data-slot-id="A-1-2"/);
  assert.match(html, /class="slot empty"/);
});

test("renderStandGrid only includes slots for the given stand", () => {
  const slots = [
    { id: "A-1-1", stand: "A", row: 1, col: 1, productId: null },
    { id: "B-1-1", stand: "B", row: 1, col: 1, productId: null },
  ];
  const html = renderStandGrid("A", slots, []);
  assert.match(html, /data-slot-id="A-1-1"/);
  assert.doesNotMatch(html, /data-slot-id="B-1-1"/);
});
