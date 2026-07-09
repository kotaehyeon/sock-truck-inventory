export function addToOrderList(orders, productId, qty, dateString) {
  const maxNumber = orders.reduce((max, o) => {
    const num = parseInt(o.id.slice(1), 10);
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);
  const id = `o${String(maxNumber + 1).padStart(6, "0")}`;
  return [
    ...orders,
    { id, productId, qty, status: "담김", orderedAt: dateString, note: "" },
  ];
}

export function markOrdered(orders, orderId) {
  return orders.map((order) =>
    order.id === orderId ? { ...order, status: "발주완료" } : order
  );
}

export function updateOrderQty(orders, orderId, qty) {
  return orders.map((order) =>
    order.id === orderId ? { ...order, qty } : order
  );
}
