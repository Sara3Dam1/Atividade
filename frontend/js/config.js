// Configurações da aplicação
const CONFIG = {
    // URL da API backend
    API_URL: 'http://localhost:3000/api',
    
    // Tempo de token em minutos
    TOKEN_EXPIRY: 60,
    
    // Chaves de localStorage
    STORAGE_KEYS: {
        TOKEN: 'authToken',
        USER: 'currentUser'
    }
};

// Função para obter o token do localStorage
function getToken() {
    return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
}

// Função para salvar o token
function setToken(token) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, token);
}

// Função para remover o token
function removeToken() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
}

// Função para obter o usuário atual
function getCurrentUser() {
    const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
}

// Função para salvar o usuário
function setCurrentUser(user) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
}

// Função para verificar se está autenticado
function isAuthenticated() {
    return getToken() !== null;
}

// Função para fazer logout
function logout() {
    removeToken();
    window.location.href = 'index.html';
}
