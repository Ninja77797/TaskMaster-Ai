# TaskMaster AI

TaskMaster AI es una plataforma moderna de gestión de tareas que combina un backend en Node.js/Express con MongoDB y un frontend en React + Vite, incorporando asistentes de IA para crear y organizar tareas de forma inteligente.

## Características principales

- Autenticación con email/contraseña y Google OAuth 2.0.
- Panel de tareas con creación, edición y eliminación de tareas y subtareas.
- Modo "lenguaje natural": crea tareas a partir de instrucciones escritas, asistido por IA.
- Chat con asistente contextual para planificar trabajo y resolver dudas.
- Perfil de usuario con edición de datos, avatar y eliminación de cuenta.
- Interfaz moderna en React + Tailwind CSS, con modo claro/oscuro y diseño responsive.

## Tecnologías

- **Frontend**: React, Vite, Tailwind CSS, Zustand, React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, Multer.
- **IA**: Integración con Groq para generación de texto.
- **Autenticación externa**: Google OAuth 2.0.

## Requisitos previos

- Node.js 18+ y npm.
- Cuenta de MongoDB Atlas (o instancia local).
- Credenciales OAuth 2.0 de Google (cliente web).

## Estructura del proyecto

- `backend/`: API REST, conexión a MongoDB y lógica de negocio.
- `frontend/`: SPA en React/Vite con la interfaz completa de la aplicación.
- `INSTRUCCIONES.md`: notas adicionales específicas del proyecto.

## Configuración de entorno

### Backend (`backend/.env`)

Define al menos las siguientes variables (nunca las subas a Git):

```env
PORT=5000
MONGODB_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=una_clave_secreta_segura
GROQ_API_KEY=tu_clave_de_groq
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

## Instalación y ejecución en desarrollo

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

2. Instalar dependencias del backend:

```bash
cd backend
npm install
```

3. Instalar dependencias del frontend:

```bash
cd ../frontend
npm install
```

4. Levantar el backend:

```bash
cd ../backend
npm run dev
```

5. Levantar el frontend:

```bash
cd ../frontend
npm run dev
```

- Backend por defecto en: `http://localhost:5000`
- Frontend por defecto en: `http://localhost:3000`

## Despliegue

Para producción se recomienda:

- Desplegar el **frontend** (Vite/React) en Vercel u otra plataforma de static hosting.
- Desplegar el **backend** (Express) en un servicio como Render, Railway, Heroku u otro, apuntando a MongoDB Atlas.
- Configurar `FRONTEND_URL`, `VITE_API_URL` y `GOOGLE_REDIRECT_URI` con los dominios reales de producción.
