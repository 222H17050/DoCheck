// Funcionalidad común para todas las páginas
document.addEventListener('DOMContentLoaded', function() {
    // Simular login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validación simple (en un proyecto real harías una petición al servidor)
            if (email && password) {
                window.location.href = 'dashboard.html';
            } else {
                alert('Por favor ingresa tus credenciales');
            }
        });
    }
    
    // Logout
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});
