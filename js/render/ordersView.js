function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

export function renderOrdersList(orders, products) {
  if (orders.length === 0) {
    return `<p class="empty-message">발주 목록이 비어 있습니다.</p>`;
  }

  const rows = orders
    .map((order) => {
      const product = products.find((p) => p.id === order.productId);
      const actionButton =
        order.status === "담김"
          ? `<button data-mark-ordered="${escapeHtml(order.id)}">발주완료 처리</button>`
          : "";
      return `
      <tr data-order-id="${escapeHtml(order.id)}">
        <td>${product ? escapeHtml(product.name) : escapeHtml(order.productId)}</td>
        <td>${order.qty}</td>
        <td>${escapeHtml(order.status)}</td>
        <td>${escapeHtml(order.orderedAt)}</td>
        <td>${actionButton}</td>
      </tr>`;
    })
    .join("");

  return `
    <table class="orders-table">
      <thead><tr><th>상품</th><th>수량</th><th>상태</th><th>담은 날짜</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}
