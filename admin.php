<?php
require_once __DIR__ . '/config/config.php';
eureka_require_admin();
?>
<!DOCTYPE html>
<html lang="pt">
    <head>
    <meta name="eureka-csrf" content="<?php echo htmlspecialchars(eureka_csrf_token(), ENT_QUOTES, 'UTF-8'); ?>">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Eureka Lounge</title>
    <link rel="icon" href="img/eurea.png" type="image/png">
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.0/src/bold/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --gold: #d4af37;
            --gold-light: #ffd700;
            --bg: #000000;
            --card-bg: #111111;
            --gradient: linear-gradient(135deg, #d4af37 0%, #ffd700 100%);
            --green: #25d366;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            background-color: var(--bg);
            background-image: radial-gradient(circle at 25% 25%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
            color: var(--gold);
            font-family: 'Roboto', sans-serif;
            padding: 20px;
            line-height: 1.6;
            font-size: 16px;
            min-height: 100vh;
        }

        .admin-container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .admin-header h1 {
            font-family: 'Playfair Display', serif;
            color: var(--gold-light);
            font-size: 2.5rem;
        }

        .admin-header a, .btn-github {
            background: var(--gradient);
            color: #000;
            padding: 10px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            transition: all 0.3s;
            border: none;
            cursor: pointer;
        }

        .admin-header a:hover, .btn-github:hover {
            transform: scale(1.05);
        }

        .admin-content {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }

        .sidebar {
            background: linear-gradient(145deg, var(--card-bg) 0%, #1a1a1a 100%);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 15px;
            padding: 20px;
        }

        .sidebar h2 {
            color: var(--gold-light);
            margin-bottom: 15px;
            font-size: 1.3rem;
        }

        .category-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .category-item {
            background: rgba(212, 175, 55, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.2);
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .category-item:hover,
        .category-item.active {
            background: var(--gradient);
            color: #000;
            border-color: var(--gold-light);
        }

        .main-content {
            background: linear-gradient(145deg, var(--card-bg) 0%, #1a1a1a 100%);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 15px;
            padding: 25px;
        }

        .section-title {
            color: var(--gold-light);
            font-size: 1.5rem;
            margin-bottom: 20px;
            font-family: 'Playfair Display', serif;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block;
            color: var(--gold);
            margin-bottom: 5px;
            font-weight: 600;
        }

        input, textarea, select {
            width: 100%;
            padding: 10px;
            background: rgba(212, 175, 55, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 8px;
            color: var(--gold);
            font-family: 'Roboto', sans-serif;
            transition: all 0.3s;
        }

        input:focus, textarea:focus, select:focus {
            outline: none;
            background: rgba(212, 175, 55, 0.1);
            border-color: var(--gold-light);
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.2);
        }

        textarea {
            resize: vertical;
            min-height: 80px;
        }

        .button-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        button {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            flex: 1;
        }

        .btn-save {
            background: var(--gradient);
            color: #000;
        }

        .btn-save:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }

        .btn-delete {
            background: #ff4444;
            color: white;
        }

        .btn-delete:hover {
            background: #cc0000;
        }

        .btn-cancel {
            background: rgba(212, 175, 55, 0.2);
            color: var(--gold);
        }

        .btn-cancel:hover {
            background: rgba(212, 175, 55, 0.3);
        }

        .products-list {
            display: grid;
            gap: 15px;
            max-height: 600px;
            overflow-y: auto;
        }

        .product-item {
            background: rgba(212, 175, 55, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.2);
            padding: 15px;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s;
        }

        .product-item:hover {
            background: rgba(212, 175, 55, 0.1);
            border-color: var(--gold-light);
        }

        .product-item.selected {
            background: var(--gradient);
            color: #000;
        }

        .product-info {
            flex: 1;
        }

        .product-name {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .product-price {
            font-size: 0.9rem;
            opacity: 0.8;
        }

        .product-actions {
            display: flex;
            gap: 10px;
        }

        .btn-small {
            padding: 8px 12px;
            font-size: 0.9rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .btn-edit {
            background: var(--gradient);
            color: #000;
        }

        .btn-remove {
            background: #ff4444;
            color: white;
        }

        .btn-remove:hover {
            background: #cc0000;
        }

        .success-message {
            background: var(--green);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            display: none;
        }

        .success-message.show {
            display: block;
            animation: slideIn 0.3s ease;
        }

        .upload-status {
            font-size: 0.85rem;
            margin-top: 5px;
            display: none;
        }

        .sync-status {
            font-size: 0.9rem;
            margin-left: 10px;
            font-weight: normal;
            color: var(--gold);
        }

        @keyframes slideIn {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        @media (max-width: 768px) {
            .admin-content {
                grid-template-columns: 1fr;
            }

            .admin-header {
                flex-direction: column;
                gap: 15px;
                align-items: flex-start;
            }

            .admin-header a {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <h1>🔧 Painel Admin <span id="syncStatus" class="sync-status"></span></h1>
            <div style="display: flex; gap: 10px;">
                <button onclick="exportMenu()" class="btn-github">📥 Baixar menu.json</button>
                <a href="index.php">← Voltar ao Menu</a>
                <button onclick="logout()" style="background: #ff4444; color: white; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: all 0.3s;">🔒 Logout</button>
            </div>
        </div>

        <div class="success-message" id="successMessage">
            ✓ Alterações guardadas no servidor!
        </div>

        <div class="admin-content">
            <!-- Sidebar -->
            <div class="sidebar">
                <h2>Categorias</h2>
                <div class="category-list" id="categoryList"></div>

                <h2 style="margin-top: 30px;">Produtos</h2>
                <div class="products-list" id="productsList"></div>
            </div>

            <!-- Main Content -->
            <div class="main-content">
                <h2 class="section-title">Editar Produto</h2>

                <div class="form-group">
                    <label>Nome do Produto</label>
                    <input type="text" id="productName" placeholder="Ex: Muamba de Galinha">
                </div>

                <div class="form-group">
                    <label>Preço (Kz)</label>
                    <input type="number" id="productPrice" placeholder="Ex: 3500" min="0">
                </div>

                <div class="form-group">
                    <label>Descrição</label>
                    <textarea id="productDescription" placeholder="Descrição do produto"></textarea>
                </div>

                <div class="form-group">
                    <label>Imagem do Produto</label>
                    <div style="display: flex; gap: 10px; align-items: flex-start;">
                        <input type="text" id="productImage" placeholder="Link da imagem aparecerá aqui..." readonly>
                        <button onclick="document.getElementById('productImageFile').click()" style="flex: 0 0 auto; background: var(--gold); color: #000; padding: 10px;">📸 Upload</button>
                    </div>
                    <input type="file" id="productImageFile" accept="image/*" style="display: none;">
                    <div id="uploadStatus" class="upload-status">Enviando para o Cloudinary...</div>
                    <small style="color: rgba(212, 175, 55, 0.75); display: block; margin-top: 6px;">As fotos são enviadas automaticamente para o seu Cloudinary.</small>
                </div>

                <div class="form-group">
                    <label>Categoria</label>
                    <select id="productCategory">
                        <!-- Preenchido dinamicamente -->
                    </select>
                </div>

                <div class="form-group">
                    <label>Itens Adicionais (um por linha, formato: Nome - Preço)</label>
                    <textarea id="productItems" placeholder="Sopa - 1500&#10;Azeitonas ao Alho - 1500"></textarea>
                </div>

                <div class="button-group">
                    <button class="btn-save" id="saveBtn" onclick="saveProduct()">💾 Salvar no servidor</button>
                    <button class="btn-delete" onclick="deleteProduct()" id="deleteBtn" style="display: none;">🗑️ Deletar</button>
                    <button class="btn-cancel" onclick="resetForm()">✕ Cancelar</button>
                </div>

                <h2 class="section-title" style="margin-top: 40px;">Novo Produto</h2>
                <button class="btn-save" onclick="addNewProduct()" style="width: 100%;">➕ Adicionar Novo Produto</button>
            </div>
        </div>
    </div>

    <script>
        // Upload direto para Cloudinary usando um preset unsigned. Nenhum token privado fica no browser.
        const CLOUDINARY_CLOUD_NAME = 'dy2baee3r';
        const CLOUDINARY_UPLOAD_PRESET = 'eureka_presets';
        const MENU_API_URL = 'api/menu.php';
        const MENU_SAVE_API_URL = 'api/menu-save.php';

        function logout() {
            fetch('api/logout.php', { method: 'POST', credentials: 'same-origin' })
                .catch(error => console.warn('Logout local concluído:', error))
                .finally(() => { window.location.href = 'admin-login.php'; });
        }

        const MENU_STORAGE_KEY = 'eurekMenuData';
        let menuData = null;
        let selectedProductId = null;
        let selectedCategoryId = null;

        function isValidMenuData(data) {
            return Boolean(data && Array.isArray(data.categories) && Array.isArray(data.products));
        }

        async function loadMenu() {
            try {
                updateSyncStatus('⏳ Carregando...');
                const response = await fetch(`${MENU_API_URL}?t=${Date.now()}`, {
                    cache: 'no-store',
                    credentials: 'same-origin'
                });
                if (!response.ok) throw new Error('Falha ao carregar o menu.');
                menuData = await response.json();
                if (!isValidMenuData(menuData)) throw new Error('Formato de menu inválido.');

                renderCategories();
                renderProducts();
                renderCategorySelect();
                updateSyncStatus('✅ Sincronizado');
            } catch (error) {
                console.error('Erro ao carregar menu:', error);
                updateSyncStatus('❌ Erro ao carregar');
            }
        }

        function updateSyncStatus(text) {
            document.getElementById('syncStatus').textContent = text;
        }

        async function syncToServer() {
            const saveBtn = document.getElementById('saveBtn');
            const originalText = saveBtn.textContent;

            try {
                saveBtn.disabled = true;
                saveBtn.textContent = '⏳ A guardar...';
                updateSyncStatus('⏳ Enviando ao servidor...');

                const response = await fetch(MENU_SAVE_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Eureka-CSRF': document.querySelector('meta[name="eureka-csrf"]').content
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(menuData)
                });
                const result = await response.json();

                if (!response.ok || !result.ok) {
                    throw new Error(result.error || 'Falha ao guardar o menu.');
                }

                menuData = result.menu || menuData;
                showSuccess();
                updateSyncStatus('✅ Guardado no servidor');
                localStorage.removeItem(MENU_STORAGE_KEY);
            } catch (error) {
                console.error('Erro ao guardar menu:', error);
                alert(error.message || 'Erro ao guardar o menu.');
                updateSyncStatus('❌ Erro ao guardar');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = originalText;
            }
        }

        function renderCategories() {
            const list = document.getElementById('categoryList');
            list.innerHTML = '';
            menuData.categories.forEach(cat => {
                const item = document.createElement('div');
                item.className = `category-item ${selectedCategoryId === cat.id ? 'active' : ''}`;
                item.innerHTML = `${cat.emoji} ${cat.name}`;
                item.onclick = () => {
                    selectedCategoryId = cat.id;
                    renderCategories();
                    renderProducts();
                };
                list.appendChild(item);
            });
            if (!selectedCategoryId && menuData.categories.length > 0) {
                selectedCategoryId = menuData.categories[0].id;
                renderCategories();
                renderProducts();
            }
        }

        function renderProducts() {
            const list = document.getElementById('productsList');
            list.innerHTML = '';
            const products = menuData.products.filter(p => p.category === selectedCategoryId);
            products.forEach(p => {
                const item = document.createElement('div');
                item.className = 'product-item';
                item.innerHTML = `
                    <div class="product-info">
                        <div class="product-name">${p.name}</div>
                        <div class="product-price">${p.price.toLocaleString('pt-AO')} Kz</div>
                    </div>
                    <div class="product-actions">
                        <button class="btn-small btn-edit" onclick="editProduct('${p.id}')">Editar</button>
                    </div>
                `;
                list.appendChild(item);
            });
        }

        function editProduct(id) {
            const p = menuData.products.find(x => String(x.id) === String(id));
            if (!p) return;
            selectedProductId = id;
            document.getElementById('productName').value = p.name;
            document.getElementById('productPrice').value = p.price;
            document.getElementById('productDescription').value = p.description || '';
            document.getElementById('productImage').value = p.image || '';
            document.getElementById('productCategory').value = p.category;
            document.getElementById('productItems').value = (p.items || []).map(i => `${i.name} - ${i.price}`).join('\n');
            document.getElementById('deleteBtn').style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        async function handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const status = document.getElementById('uploadStatus');
            status.style.display = 'block';
            status.textContent = '⏳ Enviando para o Cloudinary...';
            status.style.color = 'var(--gold)';

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Falha no upload');

                const data = await response.json();
                document.getElementById('productImage').value = data.secure_url;
                status.textContent = '✅ Upload concluído!';
                status.style.color = 'var(--green)';
                setTimeout(() => status.style.display = 'none', 3000);
            } catch (error) {
                console.error(error);
                status.textContent = '❌ Erro no upload.';
                status.style.color = '#ff4444';
            }
        }

        document.getElementById('productImageFile').addEventListener('change', handleImageUpload);

        async function saveProduct() {
            if (!selectedProductId) return alert('Selecione um produto ou adicione um novo');
            
            const p = menuData.products.find(x => String(x.id) === String(selectedProductId));
            p.name = document.getElementById('productName').value;
            p.price = Number(document.getElementById('productPrice').value);
            p.description = document.getElementById('productDescription').value;
            p.image = document.getElementById('productImage').value;
            p.category = document.getElementById('productCategory').value;
            p.items = document.getElementById('productItems').value.split('\n').filter(l => l.includes('-')).map(l => {
                const [n, pr] = l.split('-');
                return { name: n.trim(), price: Number(pr.trim()) };
            });

            await syncToServer();
            renderProducts();
        }

        async function deleteProduct() {
            if (!confirm('Deletar produto?')) return;
            menuData.products = menuData.products.filter(x => String(x.id) !== String(selectedProductId));
            await syncToServer();
            resetForm();
            renderProducts();
        }

        function addNewProduct() {
            const id = crypto.randomUUID();
            const p = { id, name: 'Novo Produto', price: 0, category: selectedCategoryId, image: '', items: [] };
            menuData.products.push(p);
            editProduct(id);
            renderProducts();
        }

        function resetForm() {
            selectedProductId = null;
            document.getElementById('productName').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productDescription').value = '';
            document.getElementById('productImage').value = '';
            document.getElementById('productItems').value = '';
            document.getElementById('deleteBtn').style.display = 'none';
        }

        function showSuccess() {
            const msg = document.getElementById('successMessage');
            msg.classList.add('show');
            setTimeout(() => msg.classList.remove('show'), 4000);
        }

        function renderCategorySelect() {
            const s = document.getElementById('productCategory');
            s.innerHTML = '';
            menuData.categories.forEach(c => {
                const o = document.createElement('option');
                o.value = c.id;
                o.textContent = c.name;
                s.appendChild(o);
            });
        }

        function exportMenu() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(menuData, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "menu.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }

        document.addEventListener('DOMContentLoaded', loadMenu);
    </script>
</body>
</html>
