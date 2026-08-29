# Easy-Migration

Easy-Migration es una plataforma web de servicios y asistencia para procesos de traducción legal de documentos (inglés-español) y trámites migratorios. Ofrece una interfaz amigable y segura para gestionar solicitudes de contacto y trámites migratorios.

## Características principales

- **Interfaz amigable**: Facilita la gestión de solicitudes de contacto y trámites migratorios.
- **Traducción legal**: Ofrece servicios de traducción legal de documentos de inglés a español.
- **Seguridad**: Implementa autenticación anónima y almacenamiento seguro de solicitudes de contacto mediante Firebase.
- **Escala**: Diseñado para manejar un alto volumen de solicitudes de contacto y trámites migratorios.

## Tecnologías utilizadas

- **Frontend**: HTML5, Tailwind CSS (vía CDN), JavaScript vanilla (ES6 modules).
- **Backend**: Firebase (Firestore Database, Autenticación anónima).
- **Estructura del proyecto**: Organizado en un directorio `assets/` para estilos CSS y scripts JavaScript.

## Estructura del proyecto

El proyecto está organizado de la siguiente manera:

```
easy-migration/
├── assets/
│   ├── css/
│   │   └── custom.css
│   └── js/
│       ├── firebase-config.js
│       └── main.js
├── index.html
└── README.md
```

## Instalación y ejecución local

Para ejecutar Easy-Migration localmente, sigue estos pasos:

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/easy-migration.git
   ```

2. **Navega al directorio del proyecto**:
   ```bash
   cd easy-migration
   ```

3. **Instala las dependencias**:
   ```bash
   npm install
   ```

4. **Inicia la aplicación**:
   ```bash
   npm start
   ```

   La aplicación estará disponible en `http://localhost:3000`.

## Contribución

Si deseas contribuir a Easy-Migration, sigue estos pasos:

1. **Fork el repositorio**.
2. **Crea una nueva rama** para tu contribución:
   ```bash
   git checkout -b nombre-de-tu-rama
   ```
3. **Realiza los cambios** y realiza un commit:
   ```bash
   git commit -m "Descripción de los cambios"
   ```
4. **Envía una solicitud de fusión (pull request)**.

## Licencia

Easy-Migration está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
