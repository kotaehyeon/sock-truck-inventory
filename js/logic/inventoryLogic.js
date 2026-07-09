export function setQty(inventory, productId, qty, dateString) {
  const exists = inventory.some((entry) => entry.productId === productId);
  if (exists) {
    return inventory.map((entry) =>
      entry.productId === productId
        ? { ...entry, qty, updatedAt: dateString }
        : entry
    );
  }
  return [...inventory, { productId, qty, updatedAt: dateString }];
}

export function isLowStock(product, inventory) {
  const entry = inventory.find((e) => e.productId === product.id);
  const qty = entry ? entry.qty : 0;
  return qty <= product.minStock;
}
