import { isLowStock } from "../logic/inventoryLogic.js";

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

export function renderInventoryForm(products, inventory) {
  const rows = products
    .map((product) => {
      const entry = inventory.find((e) => e.productId === product.id);
      const qty = entry ? entry.qty : 0;
      const lowStockClass = isLowStock(product, inventory) ? "low-stock" : "";
      return `
      <div class="inventory-row ${lowStockClass}" data-product-id="${escapeHtml(product.id)}">
        <label>${escapeHtml(product.name)} (최소 ${product.minStock})</label>
        <input type="number" min="0" value="${qty}" data-qty-input="${escapeHtml(product.id)}" />
      </div>`;
    })
    .join("");

  return `<form class="inventory-form">${rows}<button type="submit">재고 저장</button></form>`;
}
