document.addEventListener("DOMContentLoaded", () => {
  const orderItemsContainer = document.getElementById("order-items");
  const orderSubtotal = document.getElementById("order-subtotal");
  const orderTotal = document.getElementById("order-total");
  const orderDetailsInput = document.getElementById("order-details-input");
  const checkoutForm = document.getElementById("checkout-form");
  const upiIdDisplay = document.getElementById("upi-id-display");

  // Load cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    window.location.href = "/";
    return;
  }

  // Render order items
  let subtotal = 0;
  orderItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;
    subtotal += itemTotal;

    const itemElement = document.createElement("div");
    itemElement.className =
      "flex justify-between py-2 border-b border-gray-100";
    itemElement.innerHTML = `
          <div>
              <h4 class="font-medium">
                  <i class="fas fa-shopping-bag"></i> ${item.name}
              </h4>
              <p class="text-sm text-gray-500">
                  <i class="fas fa-box"></i> Qty: ${quantity}
              </p>
          </div>
          <span><i class="fas fa-coins"></i> ₹${itemTotal.toFixed(2)}</span>
        `;
    orderItemsContainer.appendChild(itemElement);
  });

  // Update totals
  orderSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
  orderTotal.textContent = `₹${subtotal.toFixed(2)}`;

  // Set up UPI ID display
  upiIdDisplay.textContent = "yourstore@upi"; // Replace with actual UPI ID

  // Prepare order details for form submission
  const orderDetails = {
    items: cart,
    subtotal: subtotal,
    total: subtotal,
    date: new Date().toISOString(),
  };
  orderDetailsInput.value = JSON.stringify(orderDetails);

  // Form submission handler
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Submit form data to Web3Forms
    const formData = new FormData(checkoutForm);

    fetch(checkoutForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Clear cart on successful submission
          localStorage.removeItem("cart");
          // Redirect to success page (handled by Web3Forms redirect)
        } else {
          throw new Error("Form submission failed");
        }
      })
      .catch((error) => {
        alert("There was an error submitting your order. Please try again.");
        console.error("Error:", error);
      });
  });

  // Form validation
  function validateForm() {
    const upiId = document.getElementById("upi").value;
    const phone = document.getElementById("phone").value;

    // Basic UPI ID validation
    if (!upiId.includes("@")) {
      alert("Please enter a valid UPI ID (e.g., yourname@upi)");
      return false;
    }

    // Basic phone number validation
    if (phone.length < 10 || !/^\d+$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  }
});
