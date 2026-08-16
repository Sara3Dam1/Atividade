// Script de login

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se já está autenticado
    if (isAuthenticated()) {
        window.location.href = 'app.html';
        return;
    }

    // Event listener para o formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');

    try {
        // Fazer requisição de login
        const response = await login(email, password);

        if (response && response.token) {
            // Salvar token e dados do usuário
            setToken(response.token);
            setCurrentUser(response.user);

            // Redirecionar para dashboard
            window.location.href = 'app.html';
        } else {
            // Exibir erro
            errorDiv.textContent = response?.message || 'Erro ao fazer login';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro no login:', error);
        errorDiv.textContent = 'Erro ao conectar ao servidor. Tente novamente.';
        errorDiv.style.display = 'block';
    }
}
