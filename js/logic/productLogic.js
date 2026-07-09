export function addProduct(products, { name, design, color, costPrice, supplier, minStock }) {
  const nextNumber = products.length + 1;
  const id = `p${String(nextNumber).padStart(6, "0")}`;
  return [...products, { id, name, design, color, costPrice, supplier, minStock }];
}

export function updateProduct(products, id, patch) {
  return products.map((product) =>
    product.id === id ? { ...product, ...patch } : product
  );
}

export function deleteProduct(products, id) {
  return products.filter((product) => product.id !== id);
}
