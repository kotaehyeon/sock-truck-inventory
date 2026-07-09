import { test } from "node:test";
import assert from "node:assert/strict";
import { renderInventoryForm } from "../js/render/inventoryView.js";

test("renderInventoryForm marks low-stock products with low-stock class", () => {
  const products = [{ id: "p000001", name: "발목양말", minStock: 5 }];
  const inventory = [{ productId: "p000001", qty: 3 }];
  const html = renderInventoryForm(products, inventory);
  assert.match(html, /class="inventory-row low-stock"/);
  assert.match(html, /value="3"/);
});

test("renderInventoryForm does not mark sufficient stock as low", () => {
  const products = [{ id: "p000001", name: "발목양말", minStock: 5 }];
  const inventory = [{ productId: "p000001", qty: 8 }];
  const html = renderInventoryForm(products, inventory);
  assert.match(html, /class="inventory-row "/);
});

test("renderInventoryForm includes an add-to-order button per product", () => {
  const products = [{ id: "p000001", name: "발목양말", minStock: 5 }];
  const inventory = [{ productId: "p000001", qty: 3 }];
  const html = renderInventoryForm(products, inventory);
  assert.match(html, /data-add-to-order="p000001"/);
});
