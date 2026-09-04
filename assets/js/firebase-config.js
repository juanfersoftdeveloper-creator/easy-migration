// Importación de las librerías de Firebase (Módulos ES)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app-check.js";

// Credenciales y configuración de Firebase
import { firebaseConfig } from './firebase-credenciales.js';

const appId = 'easy-migration-web';

let db = null;
let auth = null;
let appCheck = null;

/**
 * Devuelve el UID del usuario autenticado.
 * Lanza un error si no hay sesión activa.
 */
function getUserId() {
    if (!auth || !auth.currentUser) {
        throw new Error("No hay una sesión de usuario activa.");
    }
    return auth.currentUser.uid;
}

/**
 * Inicializa Firebase, autentica al usuario de forma anónima y activa App Check si está configurado.
 */
export async function initFirebase() {
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);

        // Inicializar Firebase App Check de forma opcional y segura si se proporciona una clave reCAPTCHA v3
        if (firebaseConfig.recaptchaSiteKey) {
            try {
                // En entornos de desarrollo local (localhost), se puede habilitar el token de depuración
                if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
                    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
                }
                appCheck = initializeAppCheck(app, {
                    provider: new ReCaptchaV3Provider(firebaseConfig.recaptchaSiteKey),
                    isTokenAutoRefreshEnabled: true
                });
                console.info("Firebase App Check inicializado con éxito.");
            } catch (appCheckError) {
                console.warn("Aviso: No se pudo inicializar App Check:", appCheckError.message);
            }
        }

        await signInAnonymously(auth);

        if (!auth.currentUser) {
            throw new Error("La autenticación anónima no generó una sesión válida.");
        }

        return true;

    } catch (error) {
        console.error("Error al inicializar Firebase:", error.message);
        return false;
    }
}

/**
 * Guarda una solicitud de contacto en Firestore cumpliendo estrictamente con el esquema de seguridad.
 * @param {Object} formData - Los datos validados del formulario del cliente.
 */
export async function guardarSolicitudContacto(formData) {
    if (!db) {
        throw new Error("La base de datos no está inicializada.");
    }

    const userId = getUserId();
    const collectionPath = `artifacts/${appId}/users/${userId}/contact_requests`;

    // Estructura sanitizada que cumple con firestore.rules
    const dataToSave = {
        nombre: String(formData.nombre || '').trim(),
        email: String(formData.email || '').trim(),
        telefono: String(formData.telefono || '').trim(),
        paisInteres: String(formData.paisInteres || '').trim(),
        mensaje: String(formData.mensaje || '').trim(),
        consentimiento: Boolean(formData.consentimiento),
        fechaSolicitud: new Date().toISOString(),
        estado: 'Pendiente'
    };

    const docRef = await addDoc(collection(db, collectionPath), dataToSave);
    return docRef.id;
}