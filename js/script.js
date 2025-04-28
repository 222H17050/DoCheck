document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    // Login con Firebase
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log("Usuario logeado:", user.email);
                window.location.href = 'dashboard.html'; // Redirige al dashboard
            } catch (error) {
                console.error("Error al iniciar sesión:", error.message);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // Recuperar contraseña
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async function(e) {
            e.preventDefault();
            const email = prompt("Ingresa tu correo para recuperar contraseña:");
            if (email) {
                try {
                    await sendPasswordResetEmail(auth, email);
                    alert("¡Correo de recuperación enviado! Revisa tu bandeja de entrada.");
                } catch (error) {
                    console.error("Error al enviar correo:", error.message);
                    alert(`Error: ${error.message}`);
                }
            }
        });
    }
});