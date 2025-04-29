import { 
    auth, 
    onAuthStateChanged 
  } from './firebase.js';
  import { 
    collection, 
    addDoc,
    serverTimestamp 
  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  import { db } from './firebase.js';
  
  document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del formulario
    const agendarForm = document.getElementById('agendarForm');
    const btnSubmit = agendarForm.querySelector('button[type="submit"]');
    const btnCancelar = agendarForm.querySelector('button[type="button"]');
  
    // Verificar autenticación
    onAuthStateChanged(auth, function(user) {
      if (!user) {
        window.location.href = 'index.html';
      }
    });
  
    // Manejar envío del formulario
    agendarForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      try {
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Agendando...";
        
        // Obtener valores del formulario
        const especialidad = document.getElementById('especialidad').value;
        const doctor = document.getElementById('doctor').value;
        const doctorSelect = document.getElementById('doctor');
        const nombreDoctor = doctorSelect.options[doctorSelect.selectedIndex].text;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const motivo = document.getElementById('motivo').value;
        
        // Validaciones básicas
        if (!especialidad || !doctor || !fecha || !hora || !motivo) {
          throw new Error('Por favor complete todos los campos');
        }
  
        // Obtener usuario actual
        const user = auth.currentUser;
        if (!user) {
          throw new Error('Usuario no autenticado');
        }
  
        // Crear objeto de cita
        const nuevaCita = {
          especialidad: especialidad,
          fecha: new Date(fecha + 'T' + hora + ':00'), // Combina fecha y hora
          hora: hora + ' hrs', // Formato: "14:00 hrs"
          id_horario: 'horario-' + Date.now(), // ID único temporal
          id_usuario: user.uid,
          motivo: motivo,
          nombre_doctor: nombreDoctor,
          ubicacion: "Consultorio " + (Math.floor(Math.random() * 5) + 1), // Ejemplo
          createdAt: serverTimestamp() // Marca de tiempo del servidor
        };
  
        // Guardar en Firestore
        const docRef = await addDoc(collection(db, "consultas"), nuevaCita);
        
        // Mostrar mensaje de éxito
        //alert('¡Cita agendada correctamente! ID: ' + docRef.id);
        
        // Redirigir al dashboard
        window.location.href = 'dashboard.html';
  
      } catch (error) {
        console.error('Error al agendar cita:', error);
        alert('Error al agendar cita: ' + error.message);
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Agendar Cita";
      }
    });
  
    // Manejar botón cancelar
    btnCancelar.addEventListener('click', function() {
      if (confirm('¿Desea cancelar el agendamiento de la cita?')) {
        window.location.href = 'dashboard.html';
      }
    });
  });