document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("product-form");
  const successMessage = document.getElementById("success-message");

  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const product = {
      name: document.getElementById("product-name").value,
      price: parseFloat(document.getElementById("product-price").value),
      image: document.getElementById("product-image").value,
      description: document.getElementById("product-description").value,
      createdAt: new Date().toISOString(),
    };

    // Generate filename (replace spaces with hyphens and make lowercase)
    const filename = product.name.toLowerCase().replace(/\s+/g, "-") + ".json";

    // In a real implementation, this would be sent to a server
    // For this demo, we'll simulate saving to localStorage
    const products = JSON.parse(localStorage.getItem("adminProducts") || "{}");
    products[filename] = product;
    localStorage.setItem("adminProducts", JSON.stringify(products));

    // Show success message
    successMessage.classList.remove("hidden");
    productForm.reset();

    // Hide message after 3 seconds
    setTimeout(() => {
      successMessage.classList.add("hidden");
    }, 3000);

    console.log("Product would be saved as:", `/products/${filename}`);
    console.log("Product data:", product);
  });
});
