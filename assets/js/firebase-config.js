// Importación de las librerías de Firebase (Módulos ES)
import { initializeApp, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Tus credenciales reales de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.firebasestorage.app",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:e4733d5a798d8586430b60",
    measurementId: "G-G51G1RR2PE"
};

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