import { 
    auth,
    db,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    setDoc,
    doc
  } from "../src/firebase.js";
  
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistro');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm-password');
    const btnSubmit = form.querySelector('button[type="submit"]');
    const spinner = document.getElementById('spinner');
    
    // Validación en tiempo real
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmInput.addEventListener('input', validateConfirmPassword);
    
    // Validar formulario antes de enviar
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      try {
        toggleLoading(true);
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        // 1. Crear usuario
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 2. Crear documento de usuario en Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date(),
          emailVerified: false,
          role: "user", // Puedes añadir roles si necesitas
          lastLogin: null
        });
        
        // 3. Enviar verificación por correo
        await sendEmailVerification(user);
        
        // 4. Mostrar feedback y redirigir
        showToast('success', `¡Registro exitoso! Se envió un correo de verificación a ${email}`);
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
          window.location.href = "verificar-correo.html?email=" + encodeURIComponent(email);
        }, 3000);
        
      } catch (error) {
        handleAuthError(error);
      } finally {
        toggleLoading(false);
      }
    });
    
    // Funciones de ayuda
    function validateEmail() {
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email) {
        showError(emailInput, "El correo es requerido");
        return false;
      }
      
      if (!emailRegex.test(email)) {
        showError(emailInput, "Correo inválido");
        return false;
      }
      
      clearError(emailInput);
      return true;
    }
    
    function validatePassword() {
      const password = passwordInput.value;
      
      if (password.length < 6) {
        showError(passwordInput, "Mínimo 6 caracteres");
        return false;
      }
      
      clearError(passwordInput);
      return true;
    }
    
    function validateConfirmPassword() {
      const password = passwordInput.value;
      const confirm = confirmInput.value;
      
      if (confirm !== password) {
        showError(confirmInput, "Las contraseñas no coinciden");
        return false;
      }
      
      clearError(confirmInput);
      return true;
    }
    
    function validateForm() {
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();
      const isConfirmValid = validateConfirmPassword();
      const isTermsChecked = document.getElementById('terms').checked;
      
      if (!isTermsChecked) {
        showToast('error', "Debes aceptar los términos y condiciones");
        return false;
      }
      
      return isEmailValid && isPasswordValid && isConfirmValid;
    }
    
    function toggleLoading(isLoading) {
      btnSubmit.disabled = isLoading;
      document.querySelector('.button-text').classList.toggle('hidden', isLoading);
      spinner.classList.toggle('hidden', !isLoading);
    }
    
    function handleAuthError(error) {
      let errorMessage = "Error al registrar";
      
      switch(error.code) {
        case "auth/email-already-in-use":
          errorMessage = "El correo ya está registrado";
          break;
        case "auth/invalid-email":
          errorMessage = "Correo inválido";
          break;
        case "auth/weak-password":
          errorMessage = "La contraseña debe tener al menos 6 caracteres";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Operación no permitida";
          break;
        case "auth/network-request-failed":
          errorMessage = "Error de conexión. Verifica tu internet";
          break;
        default:
          console.error("Error de autenticación:", error);
      }
      
      showToast('error', errorMessage);
    }
    function showError(input, message) {
        const errorElement = document.getElementById(`${input.id}-error`);
        input.classList.add('error');
        
        if (errorElement) {
          errorElement.textContent = message;
          errorElement.style.display = 'block';
        } else {
          // Opción alternativa si el elemento no existe
          console.error(`Elemento ${input.id}-error no encontrado`);
          // Puedes mostrar el error de otra manera, como un alert o toast
          showToast('error', message);
        }
      }
      
      function clearError(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        input.classList.remove('error');
        
        if (errorElement) {
          errorElement.textContent = '';
          errorElement.style.display = 'none';
        }
      }
    
    function showToast(type, message) {
      // Implementar un sistema de notificaciones toast
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 5000);
    }
  });