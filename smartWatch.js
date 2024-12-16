// Elements
const colors = document.querySelectorAll("#band-color div");
const sizes = document.querySelectorAll("#wrist-size button");
const sizeTitle = document.querySelectorAll(".sizeTitle");
const mainImage = document.getElementById("main-image");
const quantityInput = document.getElementById("quantity");
const decrementBtn = document.getElementById("decrement");
const incrementBtn = document.getElementById("increment");
const addToCartBtn = document.getElementById("add-to-cart");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartQuantity = document.getElementById("cart-quantity");
const continueShoppingBtn = document.getElementById("continue-shopping");
const customAlert = document.getElementById("custom-alert");
const favoriteBtn = document.getElementById("favorite-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedColor = null;
let selectedColorImage = null; // Separate variable for the image
let selectedSize = null;

// Show Custom Alert
function showCustomAlert(message, type = "success") {
  customAlert.textContent = message;

  // Set the background color based on the type
  if (type === "success") {
    customAlert.style.background = "#4caf50"; // Green for success
  } else if (type === "warning") {
    customAlert.style.background = "#ff9800"; // Yellow for warning
  } else if (type === "error") {
    customAlert.style.background = "#f44336"; // Red for error
  }

  // Show the alert
  customAlert.classList.add("show");
  setTimeout(() => {
    customAlert.classList.remove("show");
  }, 2000);
}


// Change Thumbnail Image Based on Band Color
colors.forEach((color, index) => {
  if (index === 0) {
    // Default to first color
    color.classList.add("border-[#6b46c1]");
    selectedColor = color.getAttribute("data-band-color"); // Store color code
    selectedColorImage = color.getAttribute("data-band-image"); // Store image URL
    mainImage.src = selectedColorImage; // Set initial image based on first selected color
  }

  color.addEventListener("click", () => {
    // Remove the border from all colors
    colors.forEach((c) => {
      c.classList.remove("border-[#6b46c1]");
    });

    // Update selected color and image
    selectedColor = color.getAttribute("data-band-color");
    selectedColorImage = color.getAttribute("data-band-image");

    // Update the border color based on the selected band color
    color.classList.add("border-[#6b46c1]");

    // Update the main image with the selected color's image
    mainImage.src = selectedColorImage;
  });
});

// Select Size
sizes.forEach((size) => {
  size.addEventListener("click", () => {
    // Reset styles for all buttons
    sizes.forEach((s) => {
      s.classList.remove("border-[#6576FF]");
      const sizeTitle = s.querySelector(".sizeTitle");
      sizeTitle.classList.remove("text-[#6576FF]");
      sizeTitle.classList.add("text-[#364A63]");
    });

    // Highlight the selected button
    size.classList.add("border-[#6576FF]");
    const sizeTitle = size.querySelector(".sizeTitle");
    sizeTitle.classList.remove("text-[#364A63]");
    sizeTitle.classList.add("text-[#6576FF]");

    // Update the selectedSize variable
    selectedSize = size.dataset;
  });
});

// Increment/Decrement Quantity
incrementBtn.addEventListener("click", () => quantityInput.value++);
decrementBtn.addEventListener("click", () => {
  if (quantityInput.value > 1) quantityInput.value--;
});

// Add to Cart
addToCartBtn.addEventListener("click", () => {
  if (!selectedColor || !selectedSize) {
    showCustomAlert("Please select a size!", "warning");
    return;
  }

  const productName = document.querySelector("h1").textContent; // Product name

  const item = {
    productName: productName,
    color: selectedColor, // Store selected color name/code
    colorImage: selectedColorImage, // Store selected image URL
    size: selectedSize.size,
    price: parseInt(selectedSize.price),
    quantity: parseInt(quantityInput.value),
    id: new Date(),
  };

  // Push the item to the cart and save it to localStorage
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart UI and show alert
  updateCartUI();
  showCustomAlert("Item added to cart!", "success");
});

// Update Floating Checkout Button
function updateCartUI() {
  cartCount.textContent = cart.length;
  checkoutBtn.classList.toggle("hidden", cart.length === 0);
}

// Open Cart Modal
checkoutBtn.addEventListener("click", () => {
  renderCartModal();
  cartModal.classList.remove("hidden");
});

// Render Cart Modal
function renderCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let totalQuantity = 0; // Variable to track total quantity

  cart.forEach((item, index) => {
    total += item.price * item.quantity; // Calculate total price
    totalQuantity += item.quantity; // Calculate total quantity
    cartItemsContainer.innerHTML += `
   <tr class="border-b">
                <td class="flex gap-3 items-center py-4 md:pr-6">
                  <img
                    class="w-[36px] h-[36px] rounded-[3px]"
                    src="${item.colorImage}"
                    alt="${item.color}"
                  />
                  <span class="text-[#364A63] line-clamp-1"
                    >${item.productName}</span
                  >
                </td>
                <td class="text-[#364A63]  py-4 md:px-6">${item.color}</td>
                <td class=" py-4 md:px-6 text-[#364A63] font-bold">${item.size}</td>
                <td class=" py-4 md:px-6 text-[#364A63] font-bold">${item.quantity}</td>
                <td class=" py-4 md:px-6 text-[#364A63] font-bold">$${item.price}</td>
                <td
                  class="remove-item text-gray-500 text-md hover:text-red-500  py-4 rounded"
                  onclick="removeItemFromCart(${index})"
                >
                  <i class="fa-solid fa-trash-can"></i>
                </td>
              </tr>
 `;
  });

  cartTotal.textContent = total.toFixed(2); // Format total to 2 decimal places
  cartQuantity.textContent = totalQuantity;
}

// Remove item from cart
function removeItemFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCartModal();
  updateCartUI();
}

// Continue shopping
continueShoppingBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});

// Function to update the UI based on the favorite status
function updateFavoriteUI() {
  const favoriteStatus = JSON.parse(localStorage.getItem("favorite"));

  if (favoriteStatus === true) {
    favoriteBtn.innerHTML = `<i class="fa-solid fa-heart text-xl text-red-500"></i>`;
  } else {
    favoriteBtn.innerHTML = `<i class="fa-regular fa-heart text-xl text-[#6576FF]"></i>`;
  }
}

// Manage favorite button click
favoriteBtn.addEventListener("click", () => {
  // Toggle favorite status in localStorage
  const favoriteStatus = JSON.parse(localStorage.getItem("favorite"));

  if (favoriteStatus === true) {
    localStorage.setItem("favorite", JSON.stringify(false));
    showCustomAlert("Removed from Whitelist", "warning")
  } else {
    localStorage.setItem("favorite", JSON.stringify(true));
    showCustomAlert("Added in Whitelist", "success")

  }

  // Update the UI
  updateFavoriteUI();
});

// Initialize the UI on page load
document.addEventListener("DOMContentLoaded", updateFavoriteUI);


// On Load
updateCartUI();