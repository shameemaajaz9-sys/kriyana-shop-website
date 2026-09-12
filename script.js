// Sample Products Data
const products = [
    { id: 1, name: 'Rice (1kg)', price: 150, emoji: '🍚' },
    { id: 2, name: 'Wheat Flour (1kg)', price: 80, emoji: '🌾' },
    { id: 3, name: 'Sugar (1kg)', price: 45, emoji: '🍬' },
    { id: 4, name: 'Salt (500g)', price: 25, emoji: '🧂' },
    { id: 5, name: 'Oil (1L)', price: 120, emoji: '🫒' },
    { id: 6, name: 'Milk (1L)', price: 60, emoji: '🥛' },
    { id: 7, name: 'Butter (500g)', price: 250, emoji: '🧈' },
    { id: 8, name: 'Yogurt (500ml)', price: 50, emoji: '🥣' },
    { id: 9, name: 'Cheese (500g)', price: 200, emoji: '🧀' },
    { id: 10, name: 'Bread (1pc)', price: 40, emoji: '🍞' },
    { id: 11, name: 'Eggs (12pc)', price: 120, emoji: '🥚' },
    { id: 12, name: 'Tomatoes (1kg)', price: 60, emoji: '🍅' },
    { id: 13, name: 'Potatoes (1kg)', price: 40, emoji: '🥔' },
    { id: 14, name: 'Onions (1kg)', price: 50, emoji: '🧅' },
    { id: 15, name: 'Garlic (250g)', price: 80, emoji: '🧄' },
    { id: 16, name: 'Spinach (500g)', price: 35, emoji: '🥬' },
    { id: 17, name: 'Carrots (1kg)', price: 45, emoji: '🥕' },
    { id: 18, name: 'Apples (1kg)', price: 150, emoji: '🍎' },
    { id: 19, name: 'Bananas (1kg)', price: 60, emoji: '🍌' },
    { id: 20, name: 'Oranges (1kg)', price: 80, emoji: '🍊' }
];

// Shopping Cart Array
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    loadCartFromLocalStorage();
});

// Display Products
function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price}</div>
                <div class="product-quantity">
                    <input type="number" id="qty-${product.id}" value="1" min="1" max="100">
                    <span>units</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);

    if (quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }

    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: quantity
        });
    }

    // Reset quantity input
    document.getElementById(`qty-${productId}`).value = 1;

    // Update cart display
    updateCart();
    saveCartToLocalStorage();

    // Show notification
    showNotification(`${product.name} added to cart!`);
}

// Update Cart Display
function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    const cartTotalSpan = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
        cartCountSpan.textContent = '0';
        cartTotalSpan.textContent = '0';
        return;
    }

    let cartHTML = '';
    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        totalItems += item.quantity;

        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.emoji} ${item.name}</div>
                    <div>Qty: ${item.quantity} × ₹${item.price}</div>
                    <div class="cart-item-price">₹${itemTotal}</div>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    });

    cartItemsDiv.innerHTML = cartHTML;
    cartCountSpan.textContent = totalItems;
    cartTotalSpan.textContent = totalPrice;
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToLocalStorage();
    showNotification('Item removed from cart');
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    alert(`Order Summary:\n\nTotal Items: ${itemsCount}\nTotal Price: ₹${total}\n\nThank you for shopping!\nYour order has been placed successfully.`);

    // Clear cart
    cart = [];
    updateCart();
    saveCartToLocalStorage();
    toggleCart();
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #2ecc71;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 2000;
        animation: slideIn 0.3s ease-in-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Save Cart to Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem('kriyanaCart', JSON.stringify(cart));
}

// Load Cart from Local Storage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('kriyanaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Add animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);