let cart = [];

function normalizeCartItem(item) {
    return {
        id: Number(item.id) || 0,
        name: String(item.name || 'Produto'),
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1)
    };
}

function safeReadCart() {
    try {
        const saved = localStorage.getItem('eurekCart');
        if (!saved) return [];

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(normalizeCartItem).filter(item => item.id) : [];
    } catch (error) {
        console.warn('Carrinho inválido, limpando armazenamento:', error);
        localStorage.removeItem('eurekCart');
        return [];
    }
}

// Carregar carrinho do localStorage
function loadCart() {
    cart = safeReadCart();
    updateCartUI();
}

// Salvar carrinho no localStorage
function saveCart() {
    try {
        localStorage.setItem('eurekCart', JSON.stringify(cart));
    } catch (error) {
        console.warn('Não foi possível salvar o carrinho:', error);
    }
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

    if (!cartItemsContainer) return;

    const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    if (cartCount) cartCount.textContent = String(totalItems);

    const total = getCartTotal();
    if (cartTotal) cartTotal.textContent = `${total.toLocaleString('pt-AO')} Kz`;

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'cart-empty';
        emptyState.textContent = 'Seu carrinho está vazio';
        cartItemsContainer.appendChild(emptyState);
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const info = document.createElement('div');
        info.className = 'cart-item-info';

        const name = document.createElement('div');
        name.className = 'cart-item-name';
        name.textContent = item.name;

        const price = document.createElement('div');
        price.className = 'cart-item-price';
        price.textContent = `${Number(item.price || 0).toLocaleString('pt-AO')} Kz`;

        info.appendChild(name);
        info.appendChild(price);

        const qtyWrap = document.createElement('div');
        qtyWrap.className = 'cart-item-qty';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'qty-btn';
        minusBtn.type = 'button';
        minusBtn.textContent = '−';
        minusBtn.addEventListener('click', () => updateQuantity(item.id, item.quantity - 1));

        const quantity = document.createElement('span');
        quantity.textContent = String(item.quantity || 1);

        const plusBtn = document.createElement('button');
        plusBtn.className = 'qty-btn';
        plusBtn.type = 'button';
        plusBtn.textContent = '+';
        plusBtn.addEventListener('click', () => updateQuantity(item.id, item.quantity + 1));

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remover';
        removeBtn.addEventListener('click', () => removeFromCart(item.id));

        qtyWrap.appendChild(minusBtn);
        qtyWrap.appendChild(quantity);
        qtyWrap.appendChild(plusBtn);
        qtyWrap.appendChild(removeBtn);

        cartItem.appendChild(info);
        cartItem.appendChild(qtyWrap);
        cartItemsContainer.appendChild(cartItem);
    });
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
