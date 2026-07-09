import { test } from "node:test";
import assert from "node:assert/strict";
import { renderProductsTable } from "../js/render/productsView.js";

test("renderProductsTable renders one row per product with fields", () => {
  const products = [
    {
      id: "p000001",
      name: "발목양말",
      design: "도트무늬",
      color: "베이지",
      costPrice: 1200,
      supplier: "동대문 OO상사",
      minStock: 5,
    },
  ];
  const html = renderProductsTable(products);
  assert.match(html, /발목양말/);
  assert.match(html, /도트무늬/);
  assert.match(html, /동대문 OO상사/);
  assert.match(html, /data-product-id="p000001"/);
});

test("renderProductsTable shows empty message when no products", () => {
  const html = renderProductsTable([]);
  assert.match(html, /등록된 상품이 없습니다/);
});

test("renderProductsTable escapes HTML in product fields", () => {
  const products = [
    {
      id: "p000001",
      name: '<img src=x onerror="alert(1)">',
      design: "d",
      color: "c",
      costPrice: 1000,
      supplier: "s",
      minStock: 1,
    },
  ];
  const html = renderProductsTable(products);
  assert.doesNotMatch(html, /<img src=x onerror/);
  assert.match(html, /&lt;img src=x onerror/);
});
