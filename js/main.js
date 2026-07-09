// js/main.js
import { getFile, putFile } from "./githubApi.js";
import { checkPassword, getStoredToken, setStoredToken, isUnlocked, setUnlocked } from "./auth.js";
import { GITHUB_OWNER, GITHUB_REPO, APP_PASSWORD } from "./config.js";
import { addProduct, updateProduct, deleteProduct } from "./logic/productLogic.js";
import { renderProductsTable } from "./render/productsView.js";
import { assignProduct, clearSlot } from "./logic/slotLogic.js";
import { renderStandGrid } from "./render/slotsView.js";
import { setQty } from "./logic/inventoryLogic.js";
import { renderInventoryForm } from "./render/inventoryView.js";
import { addToOrderList, markOrdered } from "./logic/orderLogic.js";
import { renderOrdersList } from "./render/ordersView.js";

const state = {
  products: [],
  slots: [],
  inventory: [],
  orders: [],
  shas: {},
  route: "slots",
};

const DATA_FILES = {
  products: "data/products.json",
  slots: "data/slots.json",
  inventory: "data/inventory.json",
  orders: "data/orders.json",
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

async function loadAll() {
  const token = getStoredToken(localStorage);
  const syncStatus = document.getElementById("sync-status");
  syncStatus.textContent = "불러오는 중...";
  for (const [key, path] of Object.entries(DATA_FILES)) {
    const { content, sha } = await getFile({ owner: GITHUB_OWNER, repo: GITHUB_REPO, path, token });
    state[key] = content;
    state.shas[key] = sha;
  }
  syncStatus.textContent = "";
}

async function saveKey(key) {
  const token = getStoredToken(localStorage);
  const syncStatus = document.getElementById("sync-status");
  syncStatus.textContent = "저장 중...";
  try {
    const { sha } = await putFile({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: DATA_FILES[key],
      token,
      content: state[key],
      sha: state.shas[key],
      message: `update ${key} via app`,
    });
    state.shas[key] = sha;
    syncStatus.textContent = "저장 완료";
  } catch (err) {
    syncStatus.textContent = `저장 실패: ${err.message}`;
    throw err;
  }
}

function render() {
  const container = document.getElementById("view-container");
  if (state.route === "products") {
    container.innerHTML = `
      ${renderProductsTable(state.products)}
      <form id="add-product-form">
        <input name="name" placeholder="상품명" required />
        <input name="design" placeholder="디자인" required />
        <input name="color" placeholder="색상" required />
        <input name="costPrice" type="number" placeholder="사입가" required />
        <input name="supplier" placeholder="도매처" required />
        <input name="minStock" type="number" placeholder="최소재고" required />
        <button type="submit">상품 추가</button>
      </form>`;
  } else if (state.route === "slots") {
    const stands = ["A", "B", "C", "D", "E", "F"];
    container.innerHTML = stands
      .map((stand) => `<h3>매대 ${stand}</h3>${renderStandGrid(stand, state.slots, state.products)}`)
      .join("");
  } else if (state.route === "inventory") {
    container.innerHTML = renderInventoryForm(state.products, state.inventory);
  } else if (state.route === "orders") {
    container.innerHTML = `
      ${renderOrdersList(state.orders, state.products)}
      <form id="add-order-form">
        <select name="productId">
          ${state.products.map((p) => `<option value="${p.id}">${p.name}</option>`).join("")}
        </select>
        <input name="qty" type="number" placeholder="수량" required />
        <button type="submit">발주 담기</button>
      </form>`;
  } else if (state.route === "settings") {
    container.innerHTML = `
      <label>GitHub Token: <input id="token-input" type="password" value="${getStoredToken(localStorage) ?? ""}" /></label>
      <button id="save-token">토큰 저장</button>`;
  }
  attachViewHandlers();
}

function attachViewHandlers() {
  const addProductForm = document.getElementById("add-product-form");
  if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(addProductForm);
      state.products = addProduct(state.products, {
        name: formData.get("name"),
        design: formData.get("design"),
        color: formData.get("color"),
        costPrice: Number(formData.get("costPrice")),
        supplier: formData.get("supplier"),
        minStock: Number(formData.get("minStock")),
      });
      await saveKey("products");
      render();
    });
  }

  document.querySelectorAll(".delete-product").forEach((btn) => {
    btn.addEventListener("click", async () => {
      state.products = deleteProduct(state.products, btn.dataset.productId);
      await saveKey("products");
      render();
    });
  });

  document.querySelectorAll(".slot").forEach((slotEl) => {
    slotEl.addEventListener("click", async () => {
      const slotId = slotEl.dataset.slotId;
      const productName = prompt("이 칸에 배정할 상품명을 입력하세요 (비우면 칸 비움):");
      if (productName === null) return;
      if (productName.trim() === "") {
        state.slots = clearSlot(state.slots, slotId);
      } else {
        const product = state.products.find((p) => p.name === productName.trim());
        if (!product) {
          alert("일치하는 상품명을 찾을 수 없습니다.");
          return;
        }
        state.slots = assignProduct(state.slots, slotId, product.id);
      }
      await saveKey("slots");
      render();
    });
  });

  const inventoryForm = document.querySelector(".inventory-form");
  if (inventoryForm) {
    inventoryForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      document.querySelectorAll("[data-qty-input]").forEach((input) => {
        state.inventory = setQty(state.inventory, input.dataset.qtyInput, Number(input.value), today());
      });
      await saveKey("inventory");
      render();
    });
  }

  const addOrderForm = document.getElementById("add-order-form");
  if (addOrderForm) {
    addOrderForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(addOrderForm);
      state.orders = addToOrderList(state.orders, formData.get("productId"), Number(formData.get("qty")), today());
      await saveKey("orders");
      render();
    });
  }

  document.querySelectorAll("[data-mark-ordered]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      state.orders = markOrdered(state.orders, btn.dataset.markOrdered);
      await saveKey("orders");
      render();
    });
  });

  const saveTokenBtn = document.getElementById("save-token");
  if (saveTokenBtn) {
    saveTokenBtn.addEventListener("click", () => {
      setStoredToken(localStorage, document.getElementById("token-input").value);
      alert("토큰이 저장되었습니다.");
    });
  }
}

function setupNav() {
  document.querySelectorAll("#nav-bar button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.route = btn.dataset.route;
      render();
    });
  });
}

async function init() {
  const lockScreen = document.getElementById("lock-screen");
  const app = document.getElementById("app");

  if (isUnlocked(localStorage)) {
    lockScreen.hidden = true;
    app.hidden = false;
  }

  document.getElementById("unlock-button").addEventListener("click", async () => {
    const input = document.getElementById("password-input").value;
    if (checkPassword(input, APP_PASSWORD)) {
      setUnlocked(localStorage);
      lockScreen.hidden = true;
      app.hidden = false;
      setupNav();
      await loadAll();
      render();
    } else {
      document.getElementById("lock-error").textContent = "비밀번호가 틀렸습니다.";
    }
  });

  if (isUnlocked(localStorage)) {
    setupNav();
    await loadAll();
    render();
  }
}

init();
