function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

export function renderProductsTable(products) {
  if (products.length === 0) {
    return `<p class="empty-message">등록된 상품이 없습니다.</p>`;
  }

  const rows = products
    .map(
      (p) => `
    <tr data-product-id="${escapeHtml(p.id)}">
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(p.design)}</td>
      <td>${escapeHtml(p.color)}</td>
      <td>${p.costPrice}원</td>
      <td>${escapeHtml(p.supplier)}</td>
      <td>${p.minStock}</td>
      <td>
        <button class="edit-product" data-product-id="${escapeHtml(p.id)}">수정</button>
        <button class="delete-product" data-product-id="${escapeHtml(p.id)}">삭제</button>
      </td>
    </tr>`
    )
    .join("");

  return `
    <table class="products-table">
      <thead>
        <tr>
          <th>상품명</th><th>디자인</th><th>색상</th><th>사입가</th><th>도매처</th><th>최소재고</th><th></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}
