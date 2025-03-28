document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartSummary = document.getElementById("cart-summary");
  const subtotalElement = document.getElementById("subtotal");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Load cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartSummary.classList.add("hidden");
    const emptyCartMessage = `
      <div class="text-center py-10">
        <p class="text-gray-500">Your cart is empty</p>
        <a href="/" class="text-[#0066C0] hover:underline mt-2 inline-block">Continue shopping</a>
      </div>
    `;
    cartItemsContainer.innerHTML = emptyCartMessage;
    return;
  }

  // Render cart items
  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    subtotal += item.price * (item.quantity || 1);

    const itemElement = document.createElement("div");
    itemElement.className = "cart-item flex items-start py-4";
    itemElement.innerHTML = `
      <div class="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
        <img src="${item.image}" alt="${
      item.name
    }" class="w-full h-full object-contain">
      </div>
      <div class="ml-4 flex-1">
        <h3 class="font-medium">${item.name}</h3>
        <p class="text-gray-500 text-sm">${
          item.description || "No description"
        }</p>
        <div class="flex items-center mt-2">
          <span class="font-bold">₹${item.price}</span>
          <div class="ml-auto flex items-center">
            <button class="quantity-btn bg-gray-200 px-2 py-1 rounded" data-index="${index}" data-action="decrease">-</button>
            <span class="mx-2">${item.quantity || 1}</span>
            <button class="quantity-btn bg-gray-200 px-2 py-1 rounded" data-index="${index}" data-action="increase">+</button>
            <button class="remove-btn ml-4 text-red-500 hover:text-red-700" data-index="${index}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });

  // Update subtotal
  subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
  cartSummary.classList.remove("hidden");

  // Add event listeners for quantity and remove buttons
  document.querySelectorAll(".quantity-btn").forEach((btn) => {
    btn.addEventListener("click", updateQuantity);
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", removeItem);
  });

  checkoutBtn.addEventListener("click", () => {
    window.location.href = "/buy.html";
  });
});

function updateQuantity(event) {
  const index = event.target.dataset.index;
  const action = event.target.dataset.action;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (action === "increase") {
    cart[index].quantity = (cart[index].quantity || 1) + 1;
  } else if (action === "decrease" && cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload(); // Refresh to show updated quantities
}

function removeItem(event) {
  const index = event.target.dataset.index;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload(); // Refresh to show updated cart
}
