// Global application state
const APP_STATE = {
    theme: localStorage.getItem('theme') || 'light',
    notes: JSON.parse(localStorage.getItem('myNotes')) || [],
    currentFilter: 'all',
    currentSort: 'default',
    cart: JSON.parse(localStorage.getItem('cart')) || []
};


const PRODUCTS = [
    { 
        id: 1, 
        name: "Dell Inspiron Laptop", 
        category: "tech", 
        price: 54999, 
        originalPrice: 64999,
        rating: 4.5, 
        featured: true,
        discount: 15,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
        description: "15.6-inch FHD display, Intel i5, 8GB RAM, 512GB SSD",
        inStock: true
    },
    { 
        id: 2, 
        name: "Nike Air Max Shoes", 
        category: "fashion", 
        price: 7999, 
        originalPrice: 9999,
        rating: 4.3, 
        featured: false,
        discount: 20,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
        description: "Premium running shoes with air cushioning",
        inStock: true
    },
    { 
        id: 3, 
        name: "Sony WH-1000XM4 Headphones", 
        category: "tech", 
        price: 24999, 
        originalPrice: 29999,
        rating: 4.7, 
        featured: true,
        discount: 17,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        description: "Industry-leading noise cancellation",
        inStock: true
    },
    { 
        id: 4, 
        name: "Levi's 501 Original Jeans", 
        category: "fashion", 
        price: 4499, 
        originalPrice: 5999,
        rating: 4.2, 
        featured: false,
        discount: 25,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop",
        description: "Classic fit, 100% cotton denim",
        inStock: true
    },
    { 
        id: 5, 
        name: "Apple Watch Series 8", 
        category: "tech", 
        price: 41999, 
        originalPrice: 45999,
        rating: 4.6, 
        featured: true,
        discount: 9,
        image: "https://images.unsplash.com/photo-1579586337278-3f6a89d84f84?w=400&h=300&fit=crop",
        description: "GPS + Cellular, 45mm, Midnight",
        inStock: false
    },
    { 
        id: 6, 
        name: "Cotton Kurti Set", 
        category: "fashion", 
        price: 1999, 
        originalPrice: 2999,
        rating: 4.1, 
        featured: false,
        discount: 33,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=300&fit=crop",
        description: "Handblock printed cotton with dupatta",
        inStock: true
    },
    { 
        id: 7, 
        name: "Prestige Cookware Set", 
        category: "home", 
        price: 8999, 
        originalPrice: 12999,
        rating: 4.4, 
        featured: false,
        discount: 31,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        description: "10-piece non-stick cookware set",
        inStock: true
    },
    { 
        id: 8, 
        name: "Philips LED Bulbs (Pack of 4)", 
        category: "home", 
        price: 899, 
        originalPrice: 1299,
        rating: 4.0, 
        featured: false,
        discount: 31,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
        description: "9W, 3 years warranty, daylight white",
        inStock: true
    },
    { 
        id: 9, 
        name: "Logitech G Pro Wireless Mouse", 
        category: "tech", 
        price: 3499, 
        originalPrice: 4999,
        rating: 4.7, 
        featured: true,
        discount: 30,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop",
        description: "Wireless gaming mouse with RGB lighting",
        inStock: true
    },
    { 
        id: 10, 
        name: "Winter Jacket", 
        category: "fashion", 
        price: 4499, 
        originalPrice: 6999,
        rating: 4.5, 
        featured: true,
        discount: 36,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
        description: "Waterproof with detachable hood",
        inStock: true
    },
    { 
        id: 11, 
        name: "Wooden Study Table", 
        category: "home", 
        price: 12999, 
        originalPrice: 17999,
        rating: 4.3, 
        featured: false,
        discount: 28,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
        description: "Engineered wood with storage shelf",
        inStock: false
    },
    { 
        id: 12, 
        name: "Samsung Galaxy Tab S7", 
        category: "tech", 
        price: 32999, 
        originalPrice: 39999,
        rating: 4.4, 
        featured: false,
        discount: 18,
        image: "https://images.unsplash.com/photo-1546054451-aa0f1c5d8e4b?w=400&h=300&fit=crop",
        description: "11-inch, 128GB, Wi-Fi + 4G, S-Pen included",
        inStock: true
    }
];




function formatCurrencyINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}


function showSpinner(id, message = 'Loading...') {
    const spinner = document.getElementById(id);
    if (spinner) {
        spinner.innerHTML = `<div class="spinner">${message}</div>`;
        spinner.style.display = 'block';
    }
}

// Hide loading spinner
function hideSpinner(id) {
    const spinner = document.getElementById(id);
    if (spinner) {
        spinner.style.display = 'none';
    }
}


function setActiveFilter(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        }
    });
}


function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add notification styles if not present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 400px;
            }
            .notification-info { background: var(--primary); }
            .notification-success { background: var(--success); }
            .notification-warning { background: var(--warning); }
            .notification-error { background: var(--danger); }
            .notification button {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 1rem;
                opacity: 0.8;
            }
            .notification button:hover { opacity: 1; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
 
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}


function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3 && rating % 1 <= 0.7;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}


function getCategoryIcon(category) {
    const icons = {
        tech: '💻',
        fashion: '👕',
        home: '🏠'
    };
    return icons[category] || '📦';
}



function displayProducts(items) {
    const container = document.getElementById('product-grid');
    if (!container) return;

    showSpinner('loading-spinner', 'Loading products...');
    
   
    container.innerHTML = '';
    
 
    setTimeout(() => {
        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty-notes" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
                    <h3>No products found</h3>
                    <p>Try selecting a different category or filter</p>
                </div>
            `;
        } else {
            items.forEach((product, index) => {
                const productElement = createProductElement(product, index);
                container.appendChild(productElement);
            });
        }
        
        updateProductStats(items);
        hideSpinner('loading-spinner');
    }, 300);
}


function createProductElement(product, index) {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.setAttribute('role', 'listitem');
    div.setAttribute('aria-label', `${product.name}, price ₹${product.price.toLocaleString('en-IN')}`);
    div.style.animationDelay = `${index * 0.1}s`;
    div.style.opacity = '0';
    
    // Calculate savings
    const savings = product.originalPrice ? product.originalPrice - product.price : 0;
    
    // Generate star rating
    const stars = generateStarRating(product.rating);
    
    div.innerHTML = `
        <div class="product-image-container">
            ${product.discount ? `<div class="discount-badge">${product.discount}% OFF</div>` : ''}
            ${product.featured ? `<div class="featured-badge">Featured</div>` : ''}
            ${!product.inStock ? `<div class="discount-badge" style="background: #666; top: 50px;">Out of Stock</div>` : ''}
            
            ${product.image ? 
                `<img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">` : 
                `<div class="image-placeholder">${getCategoryIcon(product.category)}</div>`
            }
        </div>
        
        <div class="product-details">
            <h3>${product.name}</h3>
            <span class="category-badge">${product.category}</span>
            
            <div class="rating">
                <div class="stars">${stars}</div>
                <span class="rating-value">${product.rating}/5</span>
            </div>
            
            <p class="product-description">
                ${product.description}
            </p>
            
            <div class="price-container">
                <div class="price">
                    <span style="font-size: 1rem;">₹</span>${product.price.toLocaleString('en-IN')}
                    ${product.originalPrice ? 
                        `<span class="original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>` : 
                        ''
                    }
                </div>
                
                ${savings > 0 ? 
                    `<div class="savings">Save ₹${savings.toLocaleString('en-IN')}</div>` : 
                    ''
                }
            </div>
            
            <div class="product-actions">
                <button class="view-details" onclick="viewProductDetails(${product.id})" 
                        aria-label="View details for ${product.name}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="add-to-cart" onclick="addToCart(${product.id})" 
                        aria-label="Add ${product.name} to cart"
                        ${!product.inStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${product.inStock ? 'Add' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `;
    
  
    setTimeout(() => {
        div.style.animation = 'fadeInUp 0.5s ease-out forwards';
    }, 10);
    
    return div;
}


function updateProductStats(items) {
    const countElement = document.getElementById('product-count');
    const priceRangeElement = document.getElementById('price-range');
    
    if (countElement && priceRangeElement) {
        const totalValue = items.reduce((sum, product) => sum + product.price, 0);
        const prices = items.map(p => p.price);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        
        countElement.innerHTML = `
            Showing <strong>${items.length}</strong> product${items.length !== 1 ? 's' : ''} 
            <span style="color: var(--accent); margin-left: 0.5rem;">
                • Total value: ₹${totalValue.toLocaleString('en-IN')}
            </span>
        `;
        
        priceRangeElement.textContent = `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`;
    }
}


function filterProducts(category) {
    APP_STATE.currentFilter = category;
    setActiveFilter(category);
    
    showSpinner('loading-spinner', 'Filtering products...');
    
    setTimeout(() => {
        let filteredProducts;
        if (category === 'all') {
            filteredProducts = [...PRODUCTS];
        } else {
            filteredProducts = PRODUCTS.filter(product => product.category === category);
        }
        
   
        filteredProducts = applySort(filteredProducts, APP_STATE.currentSort);
        displayProducts(filteredProducts);
    }, 200);
}


function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    APP_STATE.currentSort = sortSelect.value;
    
    showSpinner('loading-spinner', 'Sorting products...');
    
    setTimeout(() => {
        let filteredProducts;
        if (APP_STATE.currentFilter === 'all') {
            filteredProducts = [...PRODUCTS];
        } else {
            filteredProducts = PRODUCTS.filter(product => product.category === APP_STATE.currentFilter);
        }
        
        filteredProducts = applySort(filteredProducts, APP_STATE.currentSort);
        displayProducts(filteredProducts);
    }, 200);
}


function applySort(products, sortType) {
    const sorted = [...products];
    
    switch(sortType) {
        case 'low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        default:
            return sorted.sort((a, b) => a.id - b.id);
    }
}


function viewProductDetails(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const modal = createProductModal(product);
    document.body.appendChild(modal);
    

    const closeModal = () => modal.remove();
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            closeModal();
        }
    });
    
   
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}


function createProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
        animation: fadeIn 0.3s ease;
    `;
    
    const savings = product.originalPrice ? product.originalPrice - product.price : 0;
    const stars = generateStarRating(product.rating);
    
    modal.innerHTML = `
        <div class="modal-content" style="
            background: var(--card-bg);
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        ">
            <div style="position: relative;">
                <button class="close-modal" style="
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(0,0,0,0.5);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.2rem;
                    cursor: pointer;
                    z-index: 2;
                ">×</button>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem;">
                    <div>
                        <div style="
                            height: 300px;
                            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                            border-radius: 8px;
                            overflow: hidden;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            ${product.image ? 
                                `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                                `<div style="font-size: 4rem;">${getCategoryIcon(product.category)}</div>`
                            }
                        </div>
                        
                        <div style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                            ${product.discount ? `
                                <span style="background: #e74c3c; color: white; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 600;">
                                    ${product.discount}% OFF
                                </span>
                            ` : ''}
                            ${savings > 0 ? `
                                <span style="background: #27ae60; color: white; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 600;">
                                    Save ₹${savings.toLocaleString('en-IN')}
                                </span>
                            ` : ''}
                            ${product.featured ? `
                                <span style="background: var(--accent); color: white; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 600;">
                                    Featured
                                </span>
                            ` : ''}
                            ${!product.inStock ? `
                                <span style="background: #666; color: white; padding: 0.5rem 1rem; border-radius: 4px; font-weight: 600;">
                                    Out of Stock
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div>
                        <h2 style="margin: 0 0 1rem 0; color: var(--secondary);">${product.name}</h2>
                        
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                            <div class="stars" style="color: #FFD700;">${stars}</div>
                            <span>${product.rating}/5</span>
                            <span class="category-badge" style="font-size: 0.8rem;">${product.category}</span>
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: var(--secondary);">Description</h3>
                            <p style="color: var(--text-color); line-height: 1.6;">${product.description}</p>
                        </div>
                        
                        <div style="margin-bottom: 2rem;">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                                <span style="font-size: 2rem; font-weight: bold; color: var(--primary);">
                                    ₹${product.price.toLocaleString('en-IN')}
                                </span>
                                ${product.originalPrice ? `
                                    <span style="color: #999; text-decoration: line-through;">
                                        ₹${product.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                ` : ''}
                            </div>
                            
                            ${product.originalPrice ? `
                                <div style="color: #27ae60; font-weight: 600;">
                                    You save ₹${savings.toLocaleString('en-IN')} (${product.discount}%)
                                </div>
                            ` : ''}
                        </div>
                        
                        <div style="display: flex; gap: 1rem;">
                            <button onclick="addToCart(${product.id}); showNotification('Added to cart!', 'success');" 
                                    style="flex: 1; padding: 1rem; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
                                    ${!product.inStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                                <i class="fas fa-shopping-cart"></i> ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button style="flex: 1; padding: 1rem; background: var(--accent); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
                                    ${!product.inStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                                <i class="fas fa-bolt"></i> ${product.inStock ? 'Buy Now' : 'Unavailable'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}



// Add to cart function
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    if (!product.inStock) {
        showNotification(`${product.name} is out of stock!`, 'warning');
        return;
    }
    
    // Get existing cart or create new one
    let cart = APP_STATE.cart;
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    
    localStorage.setItem('cart', JSON.stringify(cart));
    APP_STATE.cart = cart;
    
    updateCartCount();
    
    showNotification(`${product.name} added to cart!`, 'success');
}

// Update cart count in UI
function updateCartCount() {
    const cart = APP_STATE.cart;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}


function viewCart() {
    const cart = APP_STATE.cart;
    
    if (cart.length === 0) {
        showNotification('Your cart is empty! Add some products first.', 'info');
        return;
    }
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let cartHTML = `
        <div style="background: var(--card-bg); color: var(--text-color); border-radius: 12px; padding: 1.5rem; max-width: 500px; width: 90vw; max-height: 80vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 2px solid var(--primary); padding-bottom: 1rem;">
                <h3 style="margin: 0; color: var(--secondary);">Shopping Cart (${cart.length} ${cart.length === 1 ? 'item' : 'items'})</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: var(--danger); font-size: 1.5rem; cursor: pointer;">×</button>
            </div>
            <div style="max-height: 300px; overflow-y: auto;">
    `;
    
    cart.forEach((item, index) => {
        cartHTML += `
            <div style="display: flex; align-items: center; padding: 1rem; border-bottom: 1px solid var(--border); background: ${index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent'}; border-radius: 6px;">
                <div style="width: 60px; height: 60px; margin-right: 1rem; background: #f5f5f5; border-radius: 6px; overflow: hidden; flex-shrink: 0;">
                    ${item.image ? 
                        `<img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                        `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 1.5rem;">${getCategoryIcon(item.category)}</div>`
                    }
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 0.95rem;">${item.name}</div>
                    <div style="color: #666; font-size: 0.85rem; margin-top: 0.2rem;">Quantity: ${item.quantity}</div>
                    <div style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" style="background: var(--danger); color: white; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">-</button>
                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" style="background: var(--success); color: white; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">+</button>
                        <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 0.85rem; margin-left: auto;">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
                <div style="font-weight: bold; color: var(--primary); margin-left: 1rem;">
                    ₹${(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
            </div>
        `;
    });
    
    cartHTML += `
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 2px solid var(--primary);">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1rem; margin-bottom: 1rem;">
                    <span>Subtotal:</span>
                    <span>₹${totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;">
                    <span>Shipping:</span>
                    <span>₹${totalAmount > 2000 ? 'Free' : '99'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem;">
                    <span>Total:</span>
                    <span>₹${(totalAmount + (totalAmount > 2000 ? 0 : 99)).toLocaleString('en-IN')}</span>
                </div>
                <button onclick="checkout()" style="width: 100%; padding: 1rem; background: var(--accent); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <i class="fas fa-lock"></i> Proceed to Checkout (₹${(totalAmount + (totalAmount > 2000 ? 0 : 99)).toLocaleString('en-IN')})
                </button>
                <button onclick="clearCart()" style="width: 100%; padding: 0.8rem; background: transparent; color: var(--danger); border: 2px solid var(--danger); border-radius: 8px; font-weight: 600; cursor: pointer; margin-top: 0.8rem;">
                    <i class="fas fa-trash"></i> Clear Cart
                </button>
            </div>
        </div>
    `;
    

    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
    `;
    modal.innerHTML = cartHTML;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}


function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = APP_STATE.cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(APP_STATE.cart));
        updateCartCount();
        viewCart(); 
    }
}


function removeFromCart(productId) {
    APP_STATE.cart = APP_STATE.cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(APP_STATE.cart));
    updateCartCount();
    showNotification('Item removed from cart', 'success');
    
    // Refresh cart view if open
    const cartModal = document.querySelector('.product-modal');
    if (cartModal) {
        viewCart();
    }
}


function clearCart() {
    if (confirm('Are you sure you want to clear your entire cart?')) {
        APP_STATE.cart = [];
        localStorage.removeItem('cart');
        updateCartCount();
        showNotification('Cart cleared', 'success');
        
      
        const cartModal = document.querySelector('.product-modal');
        if (cartModal) {
            cartModal.remove();
        }
    }
}


function checkout() {
    const totalAmount = APP_STATE.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = totalAmount > 2000 ? 0 : 99;
    const finalTotal = totalAmount + shipping;
    
    alert(`Checkout Simulation\n\nItems: ${APP_STATE.cart.length}\nSubtotal: ₹${totalAmount.toLocaleString('en-IN')}\nShipping: ₹${shipping}\nTotal: ₹${finalTotal.toLocaleString('en-IN')}\n\nThank you for your order! This is a demo project.`);
    
   
    APP_STATE.cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
    
   
    const cartModal = document.querySelector('.product-modal');
    if (cartModal) {
        cartModal.remove();
    }
    
    showNotification('Order placed successfully! (Demo)', 'success');
}




function addNote() {
    const input = document.getElementById('noteInput');
    const noteText = input.value.trim();
    
    if (!noteText) {
        showNotification('Please enter a note first', 'warning');
        input.focus();
        return;
    }
    
    if (noteText.length > 200) {
        showNotification('Note is too long (max 200 characters)', 'warning');
        return;
    }
    
 
    const noteWithTimestamp = {
        text: noteText,
        date: new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        id: Date.now()
    };
    
    APP_STATE.notes.unshift(noteWithTimestamp);
    saveNotes();
    input.value = '';
    input.focus();
    
    showNotification('Note added successfully!', 'success');
    loadNotes();
}


function saveNotes() {
    try {
        localStorage.setItem('myNotes', JSON.stringify(APP_STATE.notes));
        updateNotesCount();
    } catch (error) {
        console.error('Error saving notes:', error);
        showNotification('Failed to save note. Storage might be full.', 'error');
    }
}


function loadNotes() {
    const list = document.getElementById('noteList');
    if (!list) return;
    
    showSpinner('notes-spinner', 'Loading notes...');
    
    setTimeout(() => {
        list.innerHTML = '';
        
        if (APP_STATE.notes.length === 0) {
            list.innerHTML = `
                <li class="empty-notes">
                    <i class="fas fa-sticky-note"></i>
                    <p>No notes yet. Add your first note above!</p>
                </li>
            `;
        } else {
            APP_STATE.notes.forEach((note, index) => {
                const noteElement = createNoteElement(note, index);
                list.appendChild(noteElement);
            });
        }
        
        updateNotesCount();
        hideSpinner('notes-spinner');
    }, 300);
}


function createNoteElement(note, index) {
    const li = document.createElement('li');
    li.className = 'note-item';
    li.setAttribute('role', 'listitem');
    li.style.animationDelay = `${index * 0.1}s`;
    
    li.innerHTML = `
        <div class="note-content">
            <div class="note-text">${note.text}</div>
            <div class="note-date">${note.date}</div>
        </div>
        <button class="delete-note" onclick="deleteNote(${note.id})" aria-label="Delete this note">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return li;
}


function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        APP_STATE.notes = APP_STATE.notes.filter(note => note.id !== noteId);
        saveNotes();
        loadNotes();
        showNotification('Note deleted', 'success');
    }
}


function clearNotes() {
    if (APP_STATE.notes.length === 0) {
        showNotification('No notes to clear', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to delete ALL notes? This action cannot be undone.')) {
        APP_STATE.notes = [];
        saveNotes();
        loadNotes();
        showNotification('All notes cleared', 'success');
    }
}


function exportNotes() {
    if (APP_STATE.notes.length === 0) {
        showNotification('No notes to export', 'info');
        return;
    }
    
    let exportText = 'MY NOTES EXPORT\n================\n\n';
    APP_STATE.notes.forEach((note, index) => {
        exportText += `${index + 1}. ${note.text}\n   Date: ${note.date}\n\n`;
    });
    
    exportText += `\nTotal Notes: ${APP_STATE.notes.length}\nExported on: ${new Date().toLocaleString('en-IN')}`;
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes_export_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Notes exported successfully!', 'success');
}


function updateNotesCount() {
    const countElement = document.getElementById('notes-count');
    if (countElement) {
        const count = APP_STATE.notes.length;
        countElement.innerHTML = `
            You have <strong>${count}</strong> note${count !== 1 ? 's' : ''}
            ${count > 0 ? `<span style="color: var(--accent); margin-left: 0.5rem;">• Last saved: ${new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}</span>` : ''}
        `;
    }
}



// Theme toggle functionality
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    APP_STATE.theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', APP_STATE.theme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    }
    
    showNotification(`Switched to ${isDark ? 'dark' : 'light'} mode`, 'info');
}


function toggleMenu() {
    const menu = document.querySelector('nav ul');
    const hamburger = document.querySelector('.hamburger');
    const isExpanded = menu.classList.toggle('show');
    
    if (hamburger) {
        hamburger.setAttribute('aria-expanded', isExpanded);
        hamburger.innerHTML = isExpanded ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
    }
}


function initApp() {
    console.log('Initializing enhanced portfolio application...');
    
   
    if (APP_STATE.theme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
   
    displayProducts(PRODUCTS);
    
    
    loadNotes();
    
  
    updateCartCount();
    

    const noteInput = document.getElementById('noteInput');
    if (noteInput) {
        noteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addNote();
            }
        });
    }
    
    
    document.addEventListener('click', (e) => {
        const menu = document.querySelector('nav ul');
        const hamburger = document.querySelector('.hamburger');
        
        if (menu && menu.classList.contains('show') && 
            !menu.contains(e.target) && 
            hamburger && !hamburger.contains(e.target)) {
            toggleMenu();
        }
    });
    
    console.log('Portfolio application initialized successfully!');
}

// functions available globally
window.filterProducts = filterProducts;
window.sortProducts = sortProducts;
window.addNote = addNote;
window.clearNotes = clearNotes;
window.exportNotes = exportNotes;
window.viewProductDetails = viewProductDetails;
window.addToCart = addToCart;
window.viewCart = viewCart;
window.toggleTheme = toggleTheme;
window.toggleMenu = toggleMenu;
window.deleteNote = deleteNote;


document.addEventListener('DOMContentLoaded', initApp);