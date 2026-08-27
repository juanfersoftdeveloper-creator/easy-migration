// Importamos los servicios de Firebase desde tu archivo modularizado
import { initFirebase, guardarSolicitudContacto } from "./firebase-config.js";

/**
 * Maneja el cambio de pestañas en la sección de servicios.
 */
window.showTab = function(countryId) {
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.add('hidden');
    });

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    const activeButton = document.querySelector(`.tab-button[onclick="showTab('${countryId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active'); 
    }

    const activePanel = document.getElementById(countryId);
    if (activePanel) {
        activePanel.classList.remove('hidden');
    }
}

/**
 * Maneja el envío del formulario de contacto.
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('contactForm');
    const messageBox = document.getElementById('messageBox');
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = 'Guardando Solicitud...';
    messageBox.classList.add('hidden');
    
    try {
        // Recopilamos los datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            paisInteres: document.getElementById('pais').value,
            mensaje: document.getElementById('mensaje').value
        };
        
        // Llamamos a la función modular para guardar en Firebase
        await guardarSolicitudContacto(formData);

        // Mensaje de éxito
        messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-700');
        messageBox.classList.add('bg-green-100', 'text-green-700');
        messageBox.innerHTML = '<span class="font-bold">¡Solicitud Enviada!</span> Gracias por contactarnos. Tu información ha sido guardada con éxito.';
        
        form.reset();

    } catch (error) {
        console.error("Error al procesar el formulario:", error);
        messageBox.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        messageBox.classList.add('bg-red-100', 'text-red-700');
        messageBox.innerHTML = '<span class="font-bold">Error al Enviar:</span> No pudimos guardar tu solicitud. Intenta de nuevo más tarde.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Solicitud de Cita Gratuita';
        messageBox.scrollIntoView({ behavior: 'smooth' });
    }
}

// Configurar eventos al cargar el DOM
document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);

// Desplazamiento suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Inicialización general de la app
window.onload = async function() {
    await initFirebase();
    window.showTab('usa');
};