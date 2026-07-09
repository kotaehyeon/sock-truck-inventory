function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

export function renderStandGrid(stand, slots, products) {
  const standSlots = slots
    .filter((slot) => slot.stand === stand)
    .sort((a, b) => a.row - b.row || a.col - b.col);

  const cells = standSlots
    .map((slot) => {
      const product = products.find((p) => p.id === slot.productId);
      const isEmpty = !product;
      return `
      <div class="slot ${isEmpty ? "empty" : "filled"}" data-slot-id="${escapeHtml(slot.id)}">
        <div class="slot-label">${escapeHtml(slot.id)}</div>
        <div class="slot-product">${isEmpty ? "빈 칸" : escapeHtml(product.name)}</div>
      </div>`;
    })
    .join("");

  return `<div class="stand-grid" data-stand="${escapeHtml(stand)}">${cells}</div>`;
}
