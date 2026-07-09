import { test } from "node:test";
import assert from "node:assert/strict";
import { addProduct, updateProduct, deleteProduct } from "../js/logic/productLogic.js";

test("addProduct assigns sequential id and appends to list", () => {
  const products = [];
  const result = addProduct(products, {
    name: "발목양말",
    design: "도트무늬",
    color: "베이지",
    costPrice: 1200,
    supplier: "동대문 OO상사",
    minStock: 5,
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "p000001");
  assert.equal(result[0].name, "발목양말");

  const result2 = addProduct(result, {
    name: "무지양말",
    design: "무지",
    color: "블랙",
    costPrice: 1000,
    supplier: "동대문 OO상사",
    minStock: 10,
  });
  assert.equal(result2.length, 2);
  assert.equal(result2[1].id, "p000002");
});

test("updateProduct patches matching product only", () => {
  const products = [
    { id: "p000001", name: "발목양말", minStock: 5 },
    { id: "p000002", name: "무지양말", minStock: 10 },
  ];
  const result = updateProduct(products, "p000001", { minStock: 8 });
  assert.equal(result[0].minStock, 8);
  assert.equal(result[1].minStock, 10);
});

test("deleteProduct removes matching product", () => {
  const products = [
    { id: "p000001", name: "발목양말" },
    { id: "p000002", name: "무지양말" },
  ];
  const result = deleteProduct(products, "p000001");
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "p000002");
});

test("addProduct does not reuse an id after a product is deleted", () => {
  let products = addProduct([], { name: "A", design: "d", color: "c", costPrice: 1, supplier: "s", minStock: 1 });
  products = addProduct(products, { name: "B", design: "d", color: "c", costPrice: 1, supplier: "s", minStock: 1 });
  products = deleteProduct(products, "p000001");
  products = addProduct(products, { name: "C", design: "d", color: "c", costPrice: 1, supplier: "s", minStock: 1 });
  const ids = products.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(products[products.length - 1].id, "p000003");
});
