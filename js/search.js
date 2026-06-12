// Busca em tempo real
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm === '') {
            // Se vazio, mostrar menu completo
            renderMenu();
            document.querySelectorAll('.category-btn').forEach((btn, index) => {
                btn.classList.toggle('active', index === 0);
            });
        } else {
            // Filtrar produtos
            searchProducts(searchTerm);
        }
    });
});

// Função para pesquisar produtos
function searchProducts(searchTerm) {
    if (!menuData || !Array.isArray(menuData.products) || !Array.isArray(menuData.categories)) {
        return;
    }

    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    // Filtrar produtos que correspondem ao termo de busca
    const filteredProducts = menuData.products.filter(product => {
        const matchName = product.name.toLowerCase().includes(searchTerm);
        const matchDescription = product.description && product.description.toLowerCase().includes(searchTerm);
        const matchItems = product.items && product.items.some(item => 
            item.name.toLowerCase().includes(searchTerm)
        );

        return matchName || matchDescription || matchItems;
    });

    if (filteredProducts.length === 0) {
        mainContent.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(212, 175, 55, 0.5);">
                <p style="font-size: 1.2rem;">Nenhum produto encontrado para "${searchTerm}"</p>
            </div>
        `;
        return;
    }

    // Agrupar por categoria
    const groupedByCategory = {};
    filteredProducts.forEach(product => {
        if (!groupedByCategory[product.category]) {
            groupedByCategory[product.category] = [];
        }
        groupedByCategory[product.category].push(product);
    });

    // Renderizar resultados agrupados
    Object.keys(groupedByCategory).forEach(categoryId => {
        const category = menuData.categories.find(c => c.id === categoryId);
        const products = groupedByCategory[categoryId];

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

    // Desativar todos os botões de categoria
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}
