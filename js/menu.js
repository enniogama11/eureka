let menuData = null;
const MENU_STORAGE_KEY = 'eurekMenuData';

function isValidMenuData(data) {
    return Boolean(data && Array.isArray(data.categories) && Array.isArray(data.products));
}

function showMenuError(message) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <section class="category-section">
            <h2 class="category-title">⚠️ Não foi possível carregar o menu</h2>
            <p style="color: rgba(255,255,255,0.8);">${message}</p>
        </section>
    `;
}

// Carregar dados do menu
async function loadMenu() {
    try {
        const savedMenu = localStorage.getItem(MENU_STORAGE_KEY);

        if (savedMenu) {
            const parsedMenu = JSON.parse(savedMenu);
            if (isValidMenuData(parsedMenu)) {
                menuData = parsedMenu;
                renderCategories();
                renderMenu();
                setupEventListeners();
                return;
            }
        }

        // Tentar carregar do Supabase
        if (typeof supabaseClient !== 'undefined') {
            const supabaseMenu = await loadMenuFromSupabase();
            if (supabaseMenu && supabaseMenu.categories.length > 0) {
                // Transformar dados do Supabase para o formato esperado
                menuData = {
                    categories: supabaseMenu.categories.map(cat => ({
                        id: cat.id,
                        name: cat.name,
                        emoji: getEmojiForCategory(cat.name),
                        icon: getIconForCategory(cat.name)
                    })),
                    products: supabaseMenu.products.map(prod => ({
                        id: prod.id,
                        name: prod.name,
                        description: prod.description,
                        price: prod.price,
                        image: prod.image_url,
                        category: prod.category_id,
                        items: []
                    }))
                };
                localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuData));
                renderCategories();
                renderMenu();
                setupEventListeners();
                return;
            }
        }

        // Fallback para ficheiro JSON local
        const response = await fetch('data/menu.json');
        if (!response.ok) {
            throw new Error(`Falha ao carregar menu: ${response.status}`);
        }

        menuData = await response.json();
        if (!isValidMenuData(menuData)) {
            throw new Error('Estrutura do menu inválida.');
        }

        localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuData));
        renderCategories();
        renderMenu();
        setupEventListeners();
    } catch (error) {
        console.error('Erro ao carregar menu:', error);
        showMenuError('Tente recarregar a página ou verificar a conexão.');
    }
}

// Função auxiliar para obter emoji baseado na categoria
function getEmojiForCategory(categoryName) {
    const emojiMap = {
        'Entradas / Petiscos': '🍴',
        'Carnes & Grelhados': '🥩',
        'Pratos': '🍲',
        'Guarnições': '🥕',
        'Fast Food': '🍔',
        'Peixes & Mariscos': '🐟',
        'Bebidas & Bar': '🍹'
    };
    return emojiMap[categoryName] || '🍽️';
}

// Função auxiliar para obter ícone baseado na categoria
function getIconForCategory(categoryName) {
    const iconMap = {
        'Entradas / Petiscos': 'ph-fork-knife',
        'Carnes & Grelhados': 'ph-steak',
        'Pratos': 'ph-bowl-food',
        'Guarnições': 'ph-carrot',
        'Fast Food': 'ph-hamburger',
        'Peixes & Mariscos': 'ph-fish',
        'Bebidas & Bar': 'ph-martini'
    };
    return iconMap[categoryName] || 'ph-fork-knife';
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
    const card = document.createElement('article');
    card.className = 'card';

    const image = document.createElement('div');
    image.className = 'dish-img';
    image.style.backgroundImage = `url("${product.image || ''}")`;
    card.appendChild(image);

    const title = document.createElement('h3');
    title.textContent = product.name || 'Produto';
    card.appendChild(title);

    const price = document.createElement('p');
    price.className = 'card-price';
    price.textContent = `${Number(product.price || 0).toLocaleString('pt-AO')} Kz`;
    card.appendChild(price);

    if (product.description) {
        const description = document.createElement('p');
        description.className = 'card-description';
        description.textContent = product.description;
        card.appendChild(description);
    }

    if (Array.isArray(product.items) && product.items.length > 0) {
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'card-items';

        product.items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'item';

            const name = document.createElement('span');
            name.className = 'item-name';
            name.textContent = item.name || 'Item';

            const priceItem = document.createElement('span');
            priceItem.className = 'item-price';
            priceItem.textContent = `${Number(item.price || 0).toLocaleString('pt-AO')} Kz`;

            row.appendChild(name);
            row.appendChild(priceItem);
            itemsContainer.appendChild(row);
        });

        card.appendChild(itemsContainer);
    }

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'add-to-cart-btn';
    addButton.innerHTML = '<i class="ph-bold ph-plus"></i> Adicionar';
    addButton.addEventListener('click', () => {
        addToCart(product.id, product.name, Number(product.price || 0));
    });
    card.appendChild(addButton);

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
