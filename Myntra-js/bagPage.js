let bagItemObject = [];
let selectedItems = new Set(); // Track selected items
let bagCartPage = document.querySelector('.product-container');
let calculationContainer = document.querySelector('.calculation-container');

document.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    loadBagItemObjects();
    displayBagPage();
    updateCartSummary(); // Ensure cart summary updates on load
}

// Load stored cart items from localStorage
function loadBagItemObjects() {
    let bagItemStr = localStorage.getItem('bagItems');
    let bagItem = bagItemStr ? JSON.parse(bagItemStr) : []; // Retrieve stored item IDs

    // Filter `Items` to match the IDs stored in `bagItem`
    bagItemObject = Items.filter(item => bagItem.includes(item.id));

    console.log("Loaded Cart Items:", bagItemObject);
}

function displayBagPage() {
    let innerHtml = '';

    if (bagItemObject.length === 0) {
        innerHtml = "<p>Your cart is empty.</p>";
    } else {
        bagItemObject.forEach((item) => {
            innerHtml += `
                <div class="product-box" data-id="${item.id}">
                    <img height="150px" src="${item.image}" alt="Product Image">
                    <div class="text-container">
                        <h3 class="company">${item.company}</h3>
                        <p class="product-name">${item.item_name}</p> 
                        <p class="product-value">
                            <strong>Original Price:</strong> Rs ${item.price}<br>
                            <strong>Discounted Price:</strong> Rs ${item.current_price}<br>
                            <strong>Discount:</strong> ${item.off}% Off
                        </p>
                        <p class="deliver-time"><strong>Return Policy:</strong> ${item.deliver_time}</p>
                        <p class="deliver-atdate"><strong>Delivery Date:</strong> ${item.delivery_date}</p>
                    </div>
                    <button class="remove-item" data-id="${item.id}">X</button>
                </div>
            `;
        });
    }

    bagCartPage.innerHTML = innerHtml;

    // Add event listeners for item selection
    document.querySelectorAll('.product-box').forEach(product => {
        product.addEventListener('click', function () {
            toggleItemSelection(this.getAttribute('data-id'));
        });
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevent triggering selection event
            removeItemFromCart(this.getAttribute('data-id'));
        });
    });

    updateCartSummary(); // Update cart summary after rendering items
}

// Toggle item selection for calculation
function toggleItemSelection(itemId) {
    if (selectedItems.has(itemId)) {
        selectedItems.delete(itemId);
    } else {
        selectedItems.add(itemId);
    }
    updateCartSummary(); // Recalculate totals
}

// Remove item from cart
function removeItemFromCart(itemId) {
    let bagItemStr = localStorage.getItem('bagItems');
    let bagItem = bagItemStr ? JSON.parse(bagItemStr) : [];

    // Remove the selected item
    bagItem = bagItem.filter(id => id !== itemId);
    selectedItems.delete(itemId); // Also remove from selected items

    // Update localStorage
    localStorage.setItem('bagItems', JSON.stringify(bagItem));

    // Reload cart
    onLoad();
}

// Update Cart Summary (Calculation Method)
function updateCartSummary() {
    let selectedItemObjects = bagItemObject.filter(item => selectedItems.has(item.id));

    let totalItems = selectedItemObjects.length;
    let totalMrp = selectedItemObjects.reduce((sum, item) => sum + item.price, 0);
    let totalDiscount = selectedItemObjects.reduce((sum, item) => sum + (item.price - item.current_price), 0);
    let convenienceFee = totalItems > 0 ? 99 : 0; // Apply fee only if items exist
    let totalAmount = totalMrp - totalDiscount + convenienceFee;

    let summaryHtml = totalItems > 0 ? `
        <div class="cart-summary">
            <h3>PRICE DETAILS (<span id="total-items">${totalItems}</span> Items)</h3>
            <div class="price-details">
                <div class="row">
                    <span>Total MRP</span>
                    <span class="price" id="total-mrp">Rs ${totalMrp}</span>
                </div>
                <div class="row">
                    <span>Discount on MRP</span>
                    <span class="discount" id="total-discount">-Rs ${totalDiscount}</span>
                </div>
                <div class="row">
                    <span>Convenience Fee</span>
                    <span class="price" id="convenience-fee">Rs ${convenienceFee}</span>
                </div>
                <hr>
                <div class="row total">
                    <span>Total Amount</span>
                    <span class="price" id="total-amount">Rs ${totalAmount}</span>
                </div>
                <button class="place-order-btn">PLACE ORDER</button>
            </div>
        </div>
    ` : "<p>Select items to see the total.</p>";

    if (calculationContainer) {
        calculationContainer.innerHTML = summaryHtml;
    }
}
