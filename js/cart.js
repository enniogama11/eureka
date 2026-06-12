let cart = [];

// Carregar carrinho do localStorage
function loadCart() {
    const saved = localStorage.getItem('eurekCart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

// Salvar carrinho no localStorage
function saveCart() {
    localStorage.setItem('eurekCart', JSON.stringify(cart));
    updateCartUI();
}

// Adicionar ao carrinho
function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    saveCart();
    showNotification(`${productName} adicionado ao carrinho!`);
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

// Atualizar quantidade
function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
    } else {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            saveCart();
        }
    }
}

// Calcular total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Atualizar UI do carrinho
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');

    // Atualizar contagem
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Atualizar total
    const total = getCartTotal();
    cartTotal.textContent = total.toLocaleString('pt-AO') + ' Kz';

    // Renderizar itens
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="cart-empty">Seu carrinho está vazio</div>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString('pt-AO')} Kz</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remover</button>
                </div>
            </div>
        `).join('');
    }
}

// Toggle carrinho
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #d4af37 0%, #ffd700 100%);
        color: #000;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Adicionar animações
const style = document.createElement('style');
style.textContent = `
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

// Carregar carrinho ao iniciar
document.addEventListener('DOMContentLoaded', loadCart);
