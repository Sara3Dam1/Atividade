// Script principal da aplicação

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se está autenticado
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Event listener para logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Carregar dashboard por padrão
    loadDashboard();
});

// Mostrar seção
function showSection(sectionId) {
    // Esconder todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Mostrar seção selecionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');

        // Carregar dados da seção
        if (sectionId === 'dashboard') {
            loadDashboard();
        } else if (sectionId === 'categorias') {
            loadCategories();
        } else if (sectionId === 'produtos') {
            loadProducts();
        } else if (sectionId === 'movimentacoes') {
            loadMovements();
        }
    }
}

// ===== DASHBOARD =====
async function loadDashboard() {
    try {
        const stats = await getDashboardStats();
        
        if (stats) {
            document.getElementById('totalProducts').textContent = stats.totalProducts || 0;
            document.getElementById('totalCategories').textContent = stats.totalCategories || 0;
            document.getElementById('recentMovements').textContent = stats.recentMovements || 0;
        }
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

// ===== CATEGORIAS =====
async function loadCategories() {
    try {
        const categories = await getCategories();
        const tbody = document.querySelector('#categoriesTable tbody');
        tbody.innerHTML = '';

        if (categories && categories.length > 0) {
            categories.forEach(category => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category.id}</td>
                    <td>${category.name}</td>
                    <td>
                        <button class="btn-secondary" onclick="editCategory(${category.id}, '${category.name}')">Editar</button>
                        <button class="btn-secondary" onclick="deleteCategory(${category.id})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

async function deleteCategory(id) {
    if (confirm('Deseja realmente excluir esta categoria?')) {
        try {
            await deleteCategory(id);
            loadCategories();
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
        }
    }
}

// ===== PRODUTOS =====
async function loadProducts() {
    try {
        const products = await getProducts();
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';

        if (products && products.length > 0) {
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category_name || 'N/A'}</td>
                    <td>R$ ${parseFloat(product.price).toFixed(2)}</td>
                    <td>${product.quantity}</td>
                    <td>
                        <button class="btn-secondary" onclick="editProduct(${product.id})">Editar</button>
                        <button class="btn-secondary" onclick="deleteProduct(${product.id})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function deleteProduct(id) {
    if (confirm('Deseja realmente excluir este produto?')) {
        try {
            await deleteProduct(id);
            loadProducts();
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
        }
    }
}

// ===== MOVIMENTAÇÕES =====
async function loadMovements() {
    try {
        const movements = await getMovements();
        const tbody = document.querySelector('#movementsTable tbody');
        tbody.innerHTML = '';

        if (movements && movements.length > 0) {
            movements.forEach(movement => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${movement.id}</td>
                    <td>${movement.product_name || 'N/A'}</td>
                    <td>${movement.type === 'in' ? 'Entrada' : 'Saída'}</td>
                    <td>${movement.quantity}</td>
                    <td>${new Date(movement.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-secondary" onclick="deleteMovement(${movement.id})">Excluir</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar movimentações:', error);
    }
}

async function deleteMovement(id) {
    if (confirm('Deseja realmente excluir esta movimentação?')) {
        try {
            await deleteMovement(id);
            loadMovements();
        } catch (error) {
            console.error('Erro ao excluir movimentação:', error);
        }
    }
}

// ===== FORMULÁRIOS =====
function showForm(type) {
    const modal = document.getElementById('formModal');
    const formFields = document.getElementById('formFields');
    const dataForm = document.getElementById('dataForm');

    formFields.innerHTML = '';
    dataForm.onsubmit = (e) => handleFormSubmit(e, type);

    if (type === 'category') {
        formFields.innerHTML = `
            <div class="form-group">
                <label for="categoryName">Nome</label>
                <input type="text" id="categoryName" required>
            </div>
        `;
    } else if (type === 'product') {
        formFields.innerHTML = `
            <div class="form-group">
                <label for="productName">Nome</label>
                <input type="text" id="productName" required>
            </div>
            <div class="form-group">
                <label for="categoryId">Categoria</label>
                <select id="categoryId" required></select>
            </div>
            <div class="form-group">
                <label for="price">Preço</label>
                <input type="number" id="price" step="0.01" required>
            </div>
            <div class="form-group">
                <label for="quantity">Quantidade</label>
                <input type="number" id="quantity" required>
            </div>
        `;
        loadCategoriesForSelect();
    } else if (type === 'movement') {
        formFields.innerHTML = `
            <div class="form-group">
                <label for="productId">Produto</label>
                <select id="productId" required></select>
            </div>
            <div class="form-group">
                <label for="movementType">Tipo</label>
                <select id="movementType" required>
                    <option value="in">Entrada</option>
                    <option value="out">Saída</option>
                </select>
            </div>
            <div class="form-group">
                <label for="movementQuantity">Quantidade</label>
                <input type="number" id="movementQuantity" required>
            </div>
        `;
        loadProductsForSelect();
    }

    modal.style.display = 'block';
}

function closeForm() {
    const modal = document.getElementById('formModal');
    modal.style.display = 'none';
}

async function handleFormSubmit(e, type) {
    e.preventDefault();

    try {
        if (type === 'category') {
            const name = document.getElementById('categoryName').value;
            await createCategory(name);
            loadCategories();
        } else if (type === 'product') {
            const data = {
                name: document.getElementById('productName').value,
                category_id: document.getElementById('categoryId').value,
                price: document.getElementById('price').value,
                quantity: document.getElementById('quantity').value
            };
            await createProduct(data);
            loadProducts();
        } else if (type === 'movement') {
            const data = {
                product_id: document.getElementById('productId').value,
                type: document.getElementById('movementType').value,
                quantity: document.getElementById('movementQuantity').value
            };
            await createMovement(data);
            loadMovements();
        }
        closeForm();
    } catch (error) {
        console.error('Erro ao submeter formulário:', error);
        alert('Erro ao salvar dados');
    }
}

async function loadCategoriesForSelect() {
    try {
        const categories = await getCategories();
        const select = document.getElementById('categoryId');
        select.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

async function loadProductsForSelect() {
    try {
        const products = await getProducts();
        const select = document.getElementById('productId');
        select.innerHTML = '';
        products.forEach(prod => {
            const option = document.createElement('option');
            option.value = prod.id;
            option.textContent = prod.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modal = document.getElementById('formModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
