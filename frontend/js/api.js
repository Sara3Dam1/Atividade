// Funções para comunicação com a API

// Função genérica para fazer requisições
async function apiCall(endpoint, method = 'GET', data = null) {
    const url = `${CONFIG.API_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Adicionar token de autenticação se existir
    const token = getToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Adicionar corpo da requisição se houver dados
    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        
        // Se não autorizado, fazer logout
        if (response.status === 401) {
            logout();
            return null;
        }

        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// ===== AUTENTICAÇÃO =====
async function login(email, password) {
    return apiCall('/auth/login', 'POST', { email, password });
}

// ===== CATEGORIAS =====
async function getCategories() {
    return apiCall('/categories');
}

async function createCategory(name) {
    return apiCall('/categories', 'POST', { name });
}

async function updateCategory(id, name) {
    return apiCall(`/categories/${id}`, 'PUT', { name });
}

async function deleteCategory(id) {
    return apiCall(`/categories/${id}`, 'DELETE');
}

// ===== PRODUTOS =====
async function getProducts() {
    return apiCall('/products');
}

async function getProductById(id) {
    return apiCall(`/products/${id}`);
}

async function createProduct(productData) {
    return apiCall('/products', 'POST', productData);
}

async function updateProduct(id, productData) {
    return apiCall(`/products/${id}`, 'PUT', productData);
}

async function deleteProduct(id) {
    return apiCall(`/products/${id}`, 'DELETE');
}

// ===== MOVIMENTAÇÕES =====
async function getMovements() {
    return apiCall('/movements');
}

async function getMovementById(id) {
    return apiCall(`/movements/${id}`);
}

async function createMovement(movementData) {
    return apiCall('/movements', 'POST', movementData);
}

async function updateMovement(id, movementData) {
    return apiCall(`/movements/${id}`, 'PUT', movementData);
}

async function deleteMovement(id) {
    return apiCall(`/movements/${id}`, 'DELETE');
}

// ===== DASHBOARD =====
async function getDashboardStats() {
    return apiCall('/dashboard/stats');
}
