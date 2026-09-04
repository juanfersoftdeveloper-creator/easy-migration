# 🌍 Easy-Migration

> Plataforma web de asistencia para procesos migratorios (EE. UU., Canadá y Colombia) y servicios de traducción de documentos.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

---

## 📌 Descripción

**Easy-Migration** es una solución web diseñada para ofrecer orientación, asistencia paralegal y traducción de documentos legales (inglés-español) a personas interesadas en realizar trámites migratorios hacia **Estados Unidos, Canadá o Colombia**.

Proporciona una interfaz moderna, rápida y responsiva que permite a los usuarios conocer los diferentes trámites disponibles y agendar consultas iniciales mediante un formulario integrado directamente con **Firebase Cloud Firestore**.

---

## ✨ Características Principales

- 📱 **Diseño Moderno y Responsivo**: Interfaz optimizada para dispositivos móviles y de escritorio mediante Tailwind CSS.
- 🗂️ **Catálogo de Trámites Interactivo**: Navegación dinámica por pestañas para consultar los requisitos y servicios según el país de destino.
- 📬 **Recepción de Solicitudes en Tiempo Real**: Formulario de contacto directo con almacenamiento seguro en la nube.
- 🔐 **Autenticación Anónima**: Integración con Firebase Authentication para asegurar el acceso controlado a la base de datos Firestore.
- ⚖️ **Enfoque Paralegal y Transparente**: Información clara sobre el alcance de los servicios de asistencia documental y traducción.

---

## 🌎 Servicios Ofrecidos por País

### 🇺🇸 Estados Unidos (USCIS & Dept. of State)
- Peticiones Familiares (`I-130`)
- Ajuste de Estatus (`I-485`)
- Asilo Afirmativo y Defensivo (`I-589`)
- Solicitud de Permiso de Trabajo (`I-765`)
- Acción Diferida para los Llegados en la Infancia (`DACA`)
- Solicitud de Naturalización y Ciudadanía (`N-400`)

### 🇨🇦 Canadá (IRCC)
- Gestión y perfiles de **Express Entry**
- Patrocinio Familiar (cónyuge, hijos, dependientes)
- Visas de Estudio y Permisos de Trabajo
- Visas de Visitante (Turismo y Negocios)
- Programas de Nominación Provincial (**PNP**)
- Procesos de Residencia Permanente

### 🇨🇴 Colombia (Cancillería & Migración Colombia)
- Visa de Residente (`Tipo R`)
- Visa de Migrante (`Tipo M` - Cónyuge, Socios, etc.)
- Visa de Visitante (`Tipo V` - Turismo y Negocios)
- Permisos de Ingreso y Permanencia (`PIP`)
- Registro de Extranjeros y Cédula de Extranjería (`CE`)

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología / Herramienta | Uso |
| :--- | :--- | :--- |
| **Frontend** | HTML5 Semántico | Estructura de la aplicación |
| **Estilos** | Tailwind CSS (CDN) + CSS3 | Diseño responsivo y personalizaciones |
| **Tipografía** | Google Fonts (Inter) | Fuente principal de la interfaz |
| **Lógica** | JavaScript Vanilla (ES6 Modules) | Interactividad, manejo del DOM y eventos |
| **BaaS / Backend** | Firebase JS SDK v11 (Modular) | Autenticación y base de datos NoSQL |
| **Base de Datos** | Cloud Firestore | Almacenamiento de solicitudes de contacto |
| **Seguridad** | Firebase Auth | Autenticación anónima para sesiones cliente |

---

## 📂 Estructura del Proyecto

```text
easy-migration/
├── assets/
│   ├── css/
│   │   └── custom.css                    # Estilos personalizados, botón flotante de WhatsApp
│   ├── images/                           # Recursos gráficos e imágenes
│   └── js/
│       ├── firebase-config.js            # Inicialización de Firebase y funciones Firestore
│       ├── firebase-credenciales.js      # Credenciales reales de Firebase (Ignorado en Git)
│       ├── firebase-credenciales.example.js # Plantilla de configuración pública
│       ├── notifications.js              # Módulo de alertas (WhatsApp, Webhooks, EmailJS)
│       └── main.js                       # Lógica de pestañas, validación, UI y eventos
├── index.html                            # Página principal (Single Page Application)
├── .gitignore                            # Archivos y carpetas excluidos del control de versiones
└── README.md                             # Documentación del proyecto
```

---

## 🚀 Instalación y Ejecución Local

Dado que el proyecto utiliza **módulos de JavaScript nativos (ES6 Modules)**, es necesario ejecutarlo a través de un servidor web local para evitar restricciones de política CORS al cargar los módulos mediante `file://`.

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/easy-migration.git
cd easy-migration
```

### 2. Configurar las credenciales de Firebase
Crea un archivo llamado `firebase-credenciales.js` dentro del directorio `assets/js/`:

```javascript
// assets/js/firebase-credenciales.js
export const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

> ⚠️ **Nota:** El archivo `firebase-credenciales.js` está incluido en `.gitignore` para proteger tus claves y configuraciones.

### 3. Iniciar un servidor local

Puedes utilizar cualquiera de las siguientes opciones para levantar el entorno de desarrollo:

#### Opción A: Extensión Live Server (Visual Studio Code - Recomendado)
1. Instala la extensión **Live Server** en VS Code.
2. Abre `index.html` y haz clic en **"Go Live"** en la barra inferior.

#### Opción B: Con Python 3
```bash
python -m http.server 8000
```
Abre en tu navegador: `http://localhost:8000`

#### Opción C: Con Node.js (`npx serve` o `npx http-server`)
```bash
npx serve .
# o
npx http-server .
```

---

## ⚙️ Configuración de Firebase y Seguridad

Para habilitar el almacenamiento seguro de solicitudes:

1. Ve a la consola de [Firebase](https://console.firebase.google.com/) y crea un nuevo proyecto web.
2. En la sección **Authentication > Sign-in method**, habilita el proveedor **Anónimo**.
3. En la sección **Firestore Database**, crea la base de datos y copia las reglas de seguridad desde el archivo [`firestore.rules`](firestore.rules):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /artifacts/{appId}/users/{userId}/contact_requests/{requestId} {
         
         // Permitir crear solo en su propio UID y validando campos obligatorios estrictos
         allow create: if request.auth != null 
                       && request.auth.uid == userId
                       && request.resource.data.keys().hasOnly([
                         'nombre', 'email', 'telefono', 'paisInteres', 
                         'mensaje', 'consentimiento', 'fechaSolicitud', 'estado'
                       ])
                       && request.resource.data.nombre is string 
                       && request.resource.data.nombre.size() >= 2 && request.resource.data.nombre.size() <= 120
                       && request.resource.data.email is string 
                       && request.resource.data.email.size() >= 5 && request.resource.data.email.size() <= 254
                       && request.resource.data.telefono is string 
                       && request.resource.data.telefono.size() >= 7 && request.resource.data.telefono.size() <= 30
                       && request.resource.data.mensaje is string 
                       && request.resource.data.mensaje.size() >= 10 && request.resource.data.mensaje.size() <= 2000
                       && request.resource.data.paisInteres in ['USA', 'CAN', 'COL', 'VEN', 'OTRO']
                       && request.resource.data.consentimiento == true
                       && request.resource.data.estado == 'Pendiente'
                       && request.resource.data.fechaSolicitud is string;

         // No permitir lectura, modificación ni borrado desde la web pública
         allow read, update, delete: if false;
       }

       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
4. **Protección Anti-Bots (Opcional pero recomendado):** En **App Check**, registra tu aplicación con reCAPTCHA v3 e ingresa tu Site Key en `firebase-credenciales.js`.
5. **Cabeceras HTTP de Seguridad:** El proyecto incluye `.htaccess` (para Apache / XAMPP) y `firebase.json` (para Firebase Hosting) con directivas de `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` y `Referrer-Policy`.

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Si deseas colaborar:

1. Realiza un **Fork** del repositorio.
2. Crea una rama para tu funcionalidad o corrección:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y haz commit:
   ```bash
   git commit -m "feat: agregar soporte para nuevo formulario de contacto"
   ```
4. Sube tu rama al repositorio remoto:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un **Pull Request**.

---

## 📄 Licencia y Descargo de Responsabilidad

- **Licencia:** Este proyecto se encuentra bajo la Licencia [MIT](LICENSE).
- **Descargo de Responsabilidad:** El contenido y las herramientas de esta plataforma están orientadas a asistencia documental y preparación de formularios por paralegales certificadas. **No constituye asesoría legal de un abogado colegiado.**

---

Desarrollado con ❤️ para facilitar trámites migratorios claros y seguros.
