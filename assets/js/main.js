// Importación de las librerías de Firebase (Módulos ES)
import { initializeApp, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Variables globales para la aplicación
let db;
let auth;
let userId = null;

// Configuración de Firebase y Autenticación
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

/**
 * Inicializa Firebase, configura la autenticación y establece el User ID.
 */
async function initFirebase() {
    if (!firebaseConfig) {
        console.error("Error: Firebase configuration is missing.");
        return;
    }

    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    setLogLevel('Debug');

    try {
        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
        
        userId = auth.currentUser?.uid || crypto.randomUUID();
        console.log("Firebase initialized. User ID:", userId);

    } catch (error) {
        console.error("Error de autenticación de Firebase:", error);
    }
}

/**
 * Función para manejar el cambio de pestañas.
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
 * Función para manejar el envío del formulario y guardarlo en Firestore.
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = document.getElementById('contactForm');
    const messageBox = document.getElementById('messageBox');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!db || !userId) {
        messageBox.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        messageBox.classList.add('bg-red-100', 'text-red-700');
        messageBox.innerHTML = '<span class="font-bold">Error:</span> El sistema no está listo. Por favor, recarga la página.';
        console.error("Firestore DB or User ID not initialized.");
        return;
    }
    
    submitButton.disabled = true;
    submitButton.textContent = 'Guardando Solicitud...';
    messageBox.classList.add('hidden');
    
    try {
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            paisInteres: document.getElementById('pais').value,
            mensaje: document.getElementById('mensaje').value,
            fechaSolicitud: new Date().toISOString(),
            estado: 'Pendiente'
        };
        
        const collectionPath = `artifacts/${appId}/users/${userId}/contact_requests`;
        
        await addDoc(collection(db, collectionPath), formData);

        messageBox.classList.remove('hidden', 'bg-red-100', 'text-red-700');
        messageBox.classList.add('bg-green-100', 'text-green-700');
        messageBox.innerHTML = '<span class="font-bold">¡Solicitud Enviada!</span> Gracias por contactarnos. Tu información ha sido guardada con éxito. Pronto una paralegal se comunicará contigo.';
        
        form.reset();

    } catch (error) {
        console.error("Error al guardar la solicitud en Firestore:", error);
        messageBox.classList.remove('hidden', 'bg-green-100', 'text-green-700');
        messageBox.classList.add('bg-red-100', 'text-red-700');
        messageBox.innerHTML = '<span class="font-bold">Error al Enviar:</span> No pudimos guardar tu solicitud. Intenta de nuevo o contáctanos por email.';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Solicitud de Cita Gratuita';
        messageBox.scrollIntoView({ behavior: 'smooth' });
    }
}

// Configurar el evento del formulario al cargar
document.getElementById('contactForm').addEventListener('submit', handleFormSubmit);

// Desplazamiento suave para enlaces de anclaje
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Inicializar al cargar la ventana
window.onload = function() {
    initFirebase();
    window.showTab('usa');
};