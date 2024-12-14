// Elements
const colors = document.querySelectorAll("#band-color div");
const sizes = document.querySelectorAll("#wrist-size button");
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
const continueShoppingBtn = document.getElementById("continue-shopping");
const customAlert = document.getElementById("custom-alert");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedColor = null;
let selectedSize = null;

// Show Custom Alert
function showCustomAlert(message) {
    customAlert.textContent = message;
    customAlert.classList.add("show");
    setTimeout(() => {
        customAlert.classList.remove("show");
    }, 2000);
}

// Change Thumbnail Image and Border Color Based on Band Color
colors.forEach((color, index) => {
    if (index === 0) {
        // Default to first color
        color.classList.add("border-[#6b46c1]");
        selectedColor = color.getAttribute("data-image");
        mainImage.src = selectedColor;
    }

    color.addEventListener("click", () => {
        // Remove the border from all colors
        colors.forEach((c) => {
            c.classList.remove("border-[#6b46c1]");
            c.style.borderColor = "";
        });

        // Get the band color (or the relevant color code from the element)
        const bandColor = color.getAttribute("data-band-color");

        // Update the border color based on the selected band color
        color.style.borderColor = bandColor;

        // Update the main image with the selected thumbnail
        selectedColor = color.getAttribute("data-image");
        mainImage.src = selectedColor;
    });
});

// Select Size
sizes.forEach((size) => {
    size.addEventListener("click", () => {
        sizes.forEach((s) => s.classList.remove("bg-gray-200"));
        size.classList.add("bg-gray-200");
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
        showCustomAlert("Please select color and size!");
        return;
    }

    const item = {
        color: selectedColor,
        size: selectedSize.size,
        price: parseInt(selectedSize.price),
        quantity: parseInt(quantityInput.value),
    };
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
    showCustomAlert("Item added to cart!");
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
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
                 <div class="flex justify-between items-center border-b pb-2">
                     <img src="${item.color}" alt="Color" class="w-12 h-12">
                     <div>Size: ${item.size} - Qty: ${item.quantity}</div>
                     <div class="flex items-center gap-2">
                         <div>$${item.price * item.quantity}</div>
                         <button class="remove-item bg-red-500 text-white text-xs px-2 py-1 rounded" data-index="${index}">Remove</button>
                     </div>
                 </div>`;
    });
    cartTotal.textContent = total;

    // Attach Remove Event
    document.querySelectorAll(".remove-item").forEach((button) => {
        button.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            removeFromCart(index);
        });
    });
}

// Remove Item from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCartModal();
    updateCartUI();
}

// Close Modal
continueShoppingBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

// On Load
updateCartUI();