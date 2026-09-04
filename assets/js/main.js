// Importamos los servicios de Firebase y el módulo de notificaciones
import { initFirebase, guardarSolicitudContacto } from "./firebase-config.js";
import { notificarNuevoLead, obtenerEnlaceWhatsApp } from "./notifications.js";

// --- Constantes de validación ---
const MAX_NOMBRE_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_TELEFONO_LENGTH = 30;
const MAX_MENSAJE_LENGTH = 2000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^[+\d\s().-]{7,30}$/;


/**
 * Maneja el cambio de pestañas en la sección de servicios.
 * Usa data-attributes para evitar inyección en selectores CSS.
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button[data-country]');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const countryId = button.getAttribute('data-country');

            // Validar que el ID corresponda a un panel existente
            const targetPane = document.getElementById(countryId);
            if (!targetPane) return;

            // Ocultar todos los paneles
            tabPanes.forEach(pane => pane.classList.add('hidden'));

            // Desactivar todos los botones
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Activar el botón y panel seleccionados
            button.classList.add('active');
            targetPane.classList.remove('hidden');
        });
    });

    // Activar la pestaña por defecto
    const defaultButton = document.querySelector('.tab-button[data-country="usa"]');
    if (defaultButton) {
        defaultButton.click();
    }
}

/**
 * Valida y sanitiza los datos del formulario.
 * @returns {Object|null} Los datos validados, o null si hay errores.
 */
function validateFormData() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const pais = document.getElementById('pais').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    const errors = [];

    // --- Validar honeypot (anti-spam) ---
    const honeypot = document.getElementById('website_url');
    if (honeypot && honeypot.value.length > 0) {
        // Bot detectado — simular éxito silencioso
        return { isBot: true };
    }

    // --- Nombre ---
    if (!nombre || nombre.length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres.');
    }
    if (nombre.length > MAX_NOMBRE_LENGTH) {
        errors.push(`El nombre no puede exceder ${MAX_NOMBRE_LENGTH} caracteres.`);
    }

    // --- Email ---
    if (!email || !EMAIL_REGEX.test(email)) {
        errors.push('Ingresa un correo electrónico válido.');
    }
    if (email.length > MAX_EMAIL_LENGTH) {
        errors.push(`El correo no puede exceder ${MAX_EMAIL_LENGTH} caracteres.`);
    }

    // --- Teléfono ---
    if (!telefono || !TELEFONO_REGEX.test(telefono)) {
        errors.push('Ingresa un número de teléfono válido (solo dígitos, espacios, +, -, paréntesis).');
    }
    if (telefono.length > MAX_TELEFONO_LENGTH) {
        errors.push(`El teléfono no puede exceder ${MAX_TELEFONO_LENGTH} caracteres.`);
    }

    // --- País ---
    const validCountries = ['USA', 'CAN', 'COL', 'VEN', 'OTRO'];
    if (!pais || !validCountries.includes(pais)) {
        errors.push('Selecciona un país de interés válido.');
    }

    // --- Mensaje ---
    if (!mensaje || mensaje.length < 10) {
        errors.push('La descripción de tu caso debe tener al menos 10 caracteres.');
    }
    if (mensaje.length > MAX_MENSAJE_LENGTH) {
        errors.push(`La descripción no puede exceder ${MAX_MENSAJE_LENGTH} caracteres.`);
    }

    // --- Consentimiento de Tratamiento de Datos ---
    const consentimiento = document.getElementById('consentimiento');
    if (!consentimiento || !consentimiento.checked) {
        errors.push('Debes autorizar el tratamiento de datos personales para continuar.');
    }

    if (errors.length > 0) {
        return { errors };
    }

    return {
        data: {
            nombre,
            email,
            telefono,
            paisInteres: pais,
            mensaje,
            consentimiento: true
        }
    };
}

/**
 * Muestra un mensaje en el messageBox de forma segura (sin innerHTML).
 * @param {HTMLElement} box - El contenedor del mensaje.
 * @param {string} type - 'success' o 'error'.
 * @param {string} title - Título en negrita.
 * @param {string|string[]} body - Cuerpo del mensaje o lista de errores.
 */
function showMessage(box, type, title, body) {
    // Limpiar contenido anterior
    box.textContent = '';

    // Configurar estilos
    box.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700');
    if (type === 'success') {
        box.classList.add('bg-green-100', 'text-green-700');
    } else {
        box.classList.add('bg-red-100', 'text-red-700');
    }

    // Construir contenido de forma segura
    const titleEl = document.createElement('span');
    titleEl.className = 'font-bold';
    titleEl.textContent = title;
    box.appendChild(titleEl);

    if (Array.isArray(body)) {
        const list = document.createElement('ul');
        list.className = 'mt-2 text-sm text-left list-disc list-inside';
        body.forEach(msg => {
            const li = document.createElement('li');
            li.textContent = msg;
            list.appendChild(li);
        });
        box.appendChild(list);
    } else {
        box.appendChild(document.createTextNode(' ' + body));
    }

    box.classList.remove('hidden');
}

/**
 * Maneja el envío del formulario de contacto.
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('contactForm');
    const messageBox = document.getElementById('messageBox');
    const submitButton = form.querySelector('button[type="submit"]');

    // Validar datos antes de enviar
    const result = validateFormData();

    // Honeypot detectó un bot — simular éxito sin enviar
    if (result.isBot) {
        showMessage(messageBox, 'success', '¡Solicitud Enviada!', 'Gracias por contactarnos.');
        form.reset();
        return;
    }

    // Errores de validación
    if (result.errors) {
        showMessage(messageBox, 'error', 'Por favor corrige lo siguiente:', result.errors);
        messageBox.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Guardando Solicitud...';
    messageBox.classList.add('hidden');

    try {
        // Llamamos a la función modular para guardar en Firebase
        await guardarSolicitudContacto(result.data);

        // Despachar alerta de notificación al equipo (webhook/email)
        notificarNuevoLead(result.data).catch(err => console.warn("Error en despacho de alerta:", err));

        // Mensaje de éxito
        showMessage(messageBox, 'success', '¡Solicitud Enviada!', 'Gracias por contactarnos. Tu información ha sido guardada con éxito.');

        form.reset();

    } catch (error) {
        console.error("Error al procesar el formulario:", error.message);
        showMessage(messageBox, 'error', 'Error al Enviar:', 'No pudimos guardar tu solicitud. Intenta de nuevo más tarde.');
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
window.onload = async function () {
    await initFirebase();
    initTabs();

    // Sincronizar enlace del botón flotante de WhatsApp
    const floatBtn = document.getElementById('whatsappFloatBtn');
    if (floatBtn) {
        floatBtn.href = obtenerEnlaceWhatsApp();
    }
};