// Declare products globally so it's accessible in other parts of the script
let products = [];

// Product Loader
document.addEventListener("DOMContentLoaded", async () => {
  const productsContainer = document.getElementById("products-container");

  try {
    // Fetch the products.json file
    const response = await fetch("/products/products.json");
    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    // Parse the JSON response
    products = await response.json();  // Now products are available globally

    // Render products dynamically
    renderProducts(products);

    // Add event listeners to cart buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", addToCart);
    });
  } catch (error) {
    console.error("Error loading products:", error);
    productsContainer.innerHTML = `
      <div class="col-span-4 text-center py-10">
        <p class="text-red-500">Failed to load products. Please try again later.</p>
      </div>
    `;
  }
});

function showNotification(message) {
  const container = document.getElementById("notification-container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.innerText = message;

  container.appendChild(notification);

  // Remove the notification after 2 seconds
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Cart functionality
function addToCart(event) {
  const product = JSON.parse(event.target.dataset.product);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Check if product already in cart
  const existingItem = cart.find((item) => item.name === product.name);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  // Save updated cart to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  showNotification(`${product.name} added to cart!`);
}

// Search functionality
document.getElementById("Search2").addEventListener("input", function (event) {
  const query = event.target.value.toLowerCase();
  
  
  // Filter products only when they are loaded
  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  });
  
  // Re-render products based on search results
  renderProducts(filteredProducts);
});

// Function to render products
function renderProducts(products) {
  const productsContainer = document.getElementById("products-container");
  
  if (products.length === 0) {
    productsContainer.innerHTML = `<div class="text-center py-10">No products found.</div>`;
    return;
  }
  
  
  productsContainer.innerHTML = products
  .map(
    (product) => `
        <div class="product-card bg-white rounded-lg overflow-hidden shadow-sm">
            <div class="p-4">
                <img src="${product.image}" alt="${product.name}" class="product-image w-full">
            </div>
            <div class="p-4 border-t border-gray-100" id='${product.name}'>
                <h3 class="font-medium text-lg mb-1">${product.name}</h3>
                <p class="text-gray-500 text-sm mb-2">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-lg">₹${product.price}</span>
                    <button class="btn-primary add-to-cart" data-product='${JSON.stringify(product)}'>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
      `
    )
    .join("");

  // Add event listeners to cart buttons after re-rendering
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", addToCart);
  });
  
}

// Navbar and Search setup
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.getElementById("navbar");
  const navbarToggle = document.createElement("button");
  navbarToggle.setAttribute("id", "navbar-toggle");

  navbarToggle.innerHTML = "<i class='fas fa-bars' id='bars'></i>";
  navbarToggle.classList.add("text-white", "text-xl", "ml-4", "p-2", "bg-transparent");
  navbarToggle.setAttribute("aria-label", "Toggle navigation");

  document.querySelector("header .container").prepend(navbarToggle);

  let isNavbarOpen = false;

  function toggleNavbar() {
    isNavbarOpen = !isNavbarOpen;
    if (isNavbarOpen) {
      navbar.classList.add("active");
      navbar.classList.remove("hidden");
      navbar.style.display = "flex";
    } else {
      navbar.classList.remove("active");
      navbar.classList.add("hidden");
    }
  }

  navbarToggle.addEventListener("click", toggleNavbar);

  const searchInput = document.getElementById("Search2");
  const searchButton = document.getElementById("searchButton");

  // if (!searchInput || !searchButton) {
  //   console.error("Search elements not found");
  //   return;
  // }

  searchButton.addEventListener("click", function () {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
    }
  });

  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
      }
    }
  });
});
