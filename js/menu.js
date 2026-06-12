let menuData = null;

// Carregar dados do menu
async function loadMenu() {
    try {
        const response = await fetch('data/menu.json');
        menuData = await response.json();
        renderCategories();
        renderMenu();
        setupEventListeners();
    } catch (error) {
        console.error('Erro ao carregar menu:', error);
    }
}

// Renderizar botões de categorias
function renderCategories() {
    const categoriesNav = document.getElementById('categoriesNav');
    categoriesNav.innerHTML = '';

    menuData.categories.forEach((category, index) => {
        const btn = document.createElement('button');
        btn.className = `category-btn ${index === 0 ? 'active' : ''}`;
        btn.textContent = `${category.emoji} ${category.name}`;
        btn.onclick = () => filterByCategory(category.id, btn);
        categoriesNav.appendChild(btn);
    });
}

// Renderizar menu completo
function renderMenu(categoryFilter = null) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    const categoriesToRender = categoryFilter 
        ? menuData.categories.filter(c => c.id === categoryFilter)
        : menuData.categories;

    categoriesToRender.forEach(category => {
        const products = menuData.products.filter(p => p.category === category.id);
        
        if (products.length === 0) return;

        const section = document.createElement('section');
        section.className = 'category-section';

        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = `${category.emoji} ${category.name}`;
        section.appendChild(title);

        const grid = document.createElement('div');
        grid.className = 'menu-grid';

        products.forEach(product => {
            const card = createProductCard(product);
            grid.appendChild(card);
        });

        section.appendChild(grid);
        mainContent.appendChild(section);
    });
}

// Criar card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'card';

    let itemsHTML = '';
    if (product.items && product.items.length > 0) {
        itemsHTML = `
            <div class="card-items">
                ${product.items.map(item => `
                    <div class="item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">${item.price.toLocaleString('pt-AO')} Kz</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    card.innerHTML = `
        <div class="dish-img" style="background-image: url('${product.image}')"></div>
        <h3>${product.name}</h3>
        <p class="card-price">${product.price.toLocaleString('pt-AO')} Kz</p>
        ${product.description ? `<p class="card-description">${product.description}</p>` : ''}
        ${itemsHTML}
        <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
            <i class="ph-bold ph-plus"></i> Adicionar
        </button>
    `;

    return card;
}

// Filtrar por categoria
function filterByCategory(categoryId, btnElement) {
    // Atualizar botão ativo
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    // Renderizar apenas a categoria selecionada
    renderMenu(categoryId);
}

// Setup de event listeners
function setupEventListeners() {
    document.getElementById('qrBtn').addEventListener('click', openQRModal);
    document.getElementById('adminBtn').addEventListener('click', () => {
        window.location.href = 'admin.html';
    });
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadMenu);
