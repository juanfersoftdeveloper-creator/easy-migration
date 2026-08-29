// Importación de las librerías de Firebase (Módulos ES)
import { initializeApp, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Tus credenciales reales de Firebase
import { firebaseConfig } from './firebase-credenciales.js'; // Credenciales de Firebase

const appId = 'easy-migration-web';

let db = null;
let auth = null;
let userId = null;

/**
 * Inicializa Firebase y autentica al usuario de forma anónima.
 */
export async function initFirebase() {
    try {
        const app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        setLogLevel('Debug');

        await signInAnonymously(auth);
        
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
    
    const dataToSave = {
        ...formData,
        fechaSolicitud: new Date().toISOString(),
        estado: 'Pendiente'
    };

    const docRef = await addDoc(collection(db, collectionPath), dataToSave);
    return docRef.id;
}