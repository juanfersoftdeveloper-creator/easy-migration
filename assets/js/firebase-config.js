// Importación de las librerías de Firebase (Módulos ES)
import { initializeApp, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Variables globales para la conexión
let db = null;
let auth = null;
let userId = null;

// Configuración inyectada desde el entorno
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

/**
 * Inicializa Firebase y autentica al usuario (anónimo o por token).
 */
export async function initFirebase() {
    if (!firebaseConfig) {
        console.error("Error: La configuración de Firebase no está disponible.");
        return false;
    }

    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        setLogLevel('Debug');

        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
        
        userId = auth.currentUser?.uid || crypto.randomUUID();
        console.log("Firebase inicializado correctamente. User ID:", userId);
        return true;

    } catch (error) {
        console.error("Error al inicializar Firebase:", error);
        return false;
    }
}

/**
 * Guarda una solicitud de contacto en Firestore.
 * @param {Object} formData - Los datos del formulario del cliente.
 */
export async function guardarSolicitudContacto(formData) {
    if (!db || !userId) {
        throw new Error("La base de datos no está inicializada.");
    }

    const collectionPath = `artifacts/${appId}/users/${userId}/contact_requests`;
    
    // Añadimos metadatos extra antes de guardar
    const dataToSave = {
        ...formData,
        fechaSolicitud: new Date().toISOString(),
        estado: 'Pendiente'
    };

    const docRef = await addDoc(collection(db, collectionPath), dataToSave);
    return docRef.id;
}