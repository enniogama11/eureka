let menuData = null;
const MENU_STORAGE_KEY = 'eurekMenuData';

// Função para obter emoji baseado na categoria
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

function isValidMenuData(data) {
    return Boolean(data && Array.isArray(data.categories) && Array.isArray(data.products));
}

function showMenuError(message) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <section class="category-section">
            <h2 class="category-title">⚠️ Erro ao carregar</h2>
            <p style="color: #d4af37; text-align: center;">${message}</p>
        </section>
    `;
}

// Carregar dados do menu
async function loadMenu() {
    const renderLoadedMenu = data => {
        if (!isValidMenuData(data)) throw new Error('Formato de menu inválido.');
        menuData = data;
        renderCategories();
        renderMenu();
        setupEventListeners();
    };

    // Primeira opção: endpoint local PHP. Assim o painel administrativo atualiza o menu imediatamente.
    try {
        const localResponse = await fetch(`api/menu.php?t=${Date.now()}`, { cache: 'no-store' });
        if (localResponse.ok) {
            const localMenu = await localResponse.json();
            if (isValidMenuData(localMenu)) {
                renderLoadedMenu(localMenu);
                return;
            }
        }
    } catch (error) {
        console.warn('Endpoint PHP indisponível, usando fallback:', error);
    }

    // Segunda opção: Supabase, preservado para instalações que ainda o utilizem.
    try {
        if (typeof supabaseClient !== 'undefined') {
            const supabaseMenu = await loadMenuFromSupabase();
            if (supabaseMenu && supabaseMenu.categories && supabaseMenu.categories.length > 0) {
                renderLoadedMenu({
                    restaurant: supabaseMenu.restaurant || {
                        name: 'Eureka Lounge',
                        phone: '+244950671427',
                        location: 'Camama 1 - Shopping Popular, Luanda, Angola',
                        hours: 'Segunda-feira à Domingo 11h às 01h',
                        instagram: '@eurekalounge'
                    },
                    categories: supabaseMenu.categories.map(cat => ({
                        id: cat.id,
                        name: cat.name,
                        emoji: getEmojiForCategory(cat.name)
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
                });
                return;
            }
        }
    } catch (error) {
        console.warn('Supabase indisponível, usando fallback local:', error);
    }

    // Terceira opção: cache local do browser.
    try {
        const savedMenu = localStorage.getItem(MENU_STORAGE_KEY);
        if (savedMenu) {
            const parsed = JSON.parse(savedMenu);
            if (isValidMenuData(parsed)) {
                renderLoadedMenu(parsed);
                return;
            }
        }
    } catch (error) {
        console.warn('Cache local inválido:', error);
        localStorage.removeItem(MENU_STORAGE_KEY);
    }

    // Última opção: ficheiro JSON estático, útil em testes locais e hosts sem PHP ativo.
    try {
        const response = await fetch('data/menu.json');
        if (!response.ok) throw new Error('Não foi possível carregar os dados do menu.');
        renderLoadedMenu(await response.json());
    } catch (error) {
        console.error('Erro crítico no loadMenu:', error);
        showMenuError('Verifique a configuração do alojamento ou a sua ligação à internet.');
    }
}

// Renderizar botões de categorias
function renderCategories() {
    const categoriesNav = document.getElementById('categoriesNav');
    if (!categoriesNav) return;
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
    if (!mainContent) return;
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

    if (product.image) {
        const image = document.createElement('div');
        image.className = 'dish-img';
        image.style.backgroundImage = `url("${product.image}")`;
        card.appendChild(image);
    }

    const title = document.createElement('h3');
    title.textContent = product.name;
    card.appendChild(title);

    const price = document.createElement('p');
    price.className = 'card-price';
    price.textContent = `${Number(product.price).toLocaleString('pt-AO')} Kz`;
    card.appendChild(price);

    if (product.description) {
        const description = document.createElement('p');
        description.className = 'card-description';
        description.textContent = product.description;
        card.appendChild(description);
    }

    const addButton = document.createElement('button');
    addButton.className = 'add-to-cart-btn';
    addButton.innerHTML = '<i class="ph-bold ph-plus"></i> Adicionar';
    addButton.onclick = () => {
        if (typeof addToCart === 'function') {
            addToCart(product.id, product.name, Number(product.price));
        }
    };
    card.appendChild(addButton);

    return card;
}

// Filtrar por categoria
function filterByCategory(categoryId, btnElement) {
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    renderMenu(categoryId);
}

// Setup de event listeners
function setupEventListeners() {
    const qrBtn = document.getElementById('qrBtn');
    if (qrBtn) qrBtn.onclick = () => typeof openQRModal === 'function' && openQRModal();

    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) adminBtn.onclick = () => window.location.href = 'admin.php';

    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) cartBtn.onclick = () => typeof toggleCart === 'function' && toggleCart();

    const closeCart = document.getElementById('closeCart');
    if (closeCart) closeCart.onclick = () => typeof toggleCart === 'function' && toggleCart();
}

// Inicializar
document.addEventListener('DOMContentLoaded', loadMenu);
