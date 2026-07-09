export function addProduct(products, { name, design, color, costPrice, supplier, minStock }) {
  const maxNumber = products.reduce((max, p) => {
    const num = parseInt(p.id.slice(1), 10);
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);
  const id = `p${String(maxNumber + 1).padStart(6, "0")}`;
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
