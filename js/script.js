// ====================== CONFIGURACIÓN DE FIREBASE ======================
// Importaciones dinámicas de Firebase (CDN modular)
const firebaseScript = document.createElement('script');
firebaseScript.type = 'module';
firebaseScript.textContent = `
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import { 
    getAuth, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

  // Configuración de Firebase (usa tus datos reales)
  const firebaseConfig = {
    apiKey: "AIzaSyCyolxxonmLbCUUB9DgOR-1rD3HYoS8U00",
    authDomain: "docheck-bd7c2.firebaseapp.com",
    projectId: "docheck-bd7c2",
    storageBucket: "docheck-bd7c2.appspot.com",
    messagingSenderId: "322997418614",
    appId: "1:322997418614:web:de45ad692a995e5be23d57"
  };

  // Inicializa Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // Exporta las funciones necesarias al ámbito global
  window.firebaseAuth = {
    auth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
  };
`;
document.head.appendChild(firebaseScript);

// ====================== LÓGICA DE LA APLICACIÓN ======================
document.addEventListener('DOMContentLoaded', function() {
  // Espera a que Firebase cargue
  const checkFirebaseReady = setInterval(() => {
    if (window.firebaseAuth) {
      clearInterval(checkFirebaseReady);
      initApp();
    }
  }, 100);
});

function initApp() {
  const { auth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } = window.firebaseAuth;

  // Elementos del DOM
  const loginForm = document.getElementById('loginForm');
  const forgotPasswordLink = document.getElementById('forgotPassword');
  const logoutBtn = document.querySelector('.btn-logout');

  // 1. Verificar sesión activa
  onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes("index.html")) {
      window.location.href = "dashboard.html";
    }
    if (!user && window.location.pathname.includes("dashboard.html")) {
      window.location.href = "index.html";
    }
  });

  // 2. Login con email/contraseña
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      submitBtn.disabled = true;
      submitBtn.textContent = "Ingresando...";

      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "dashboard.html";
      } catch (error) {
        let message = "Error al iniciar sesión";
        switch (error.code) {
          case "auth/user-not-found": message = "Usuario no registrado"; break;
          case "auth/wrong-password": message = "Contraseña incorrecta"; break;
        }
        alert(message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Ingresar";
      }
    });
  }

  // 3. Recuperar contraseña
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = prompt("Ingresa tu correo para recuperar contraseña:");
      if (email) {
        try {
          await sendPasswordResetEmail(auth, email);
          alert("Correo enviado. Revisa tu bandeja de entrada.");
        } catch (error) {
          alert(`Error: ${error.message}`);
        }
      }
    });
  }

  // 4. Cerrar sesión
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await signOut(auth);
        window.location.href = "index.html";
      } catch (error) {
        alert(`Error al cerrar sesión: ${error.message}`);
      }
    });
  }
}