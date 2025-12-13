# GyP Consultoría - Sitio Web

Sistema web para **GyP Consultoría**, empresa especializada en investigación de mercados, encuestas y sondeos de opinión.

## 📋 Descripción

Plataforma integral que incluye:
- **Sitio público** con información corporativa
- **Sistema de encuestas** con respuestas en tiempo real
- **Panel de administración** para gestión de contenido
- **Dashboard** con estadísticas y métricas

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 14.0.4 | Framework React con SSR |
| React | 18 | Biblioteca UI |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 3.3 | Estilos |
| PostgreSQL | - | Base de datos |
| NextAuth.js | 4.24 | Autenticación |
| bcrypt | 6.0 | Hash de contraseñas |

## 📁 Estructura del Proyecto

```
gyp-consultoria/
├── public/                    # Archivos estáticos
│   └── uploads/              # Archivos subidos
├── scripts/
│   └── create-admin.js       # Script para crear admin
├── src/
│   ├── app/                  # App Router de Next.js
│   │   ├── admin/           # Panel de administración
│   │   ├── api/             # API Routes
│   │   │   ├── auth/        # Autenticación NextAuth
│   │   │   ├── surveys/     # CRUD encuestas
│   │   │   ├── stats/       # Estadísticas
│   │   │   ├── upload/      # Subida de archivos
│   │   │   └── users/       # Gestión de usuarios
│   │   ├── clientes/        # Página de clientes
│   │   ├── contacto/        # Formulario de contacto
│   │   ├── dashboard/       # Dashboard usuario
│   │   ├── encuestas/       # Sistema de encuestas
│   │   ├── estudios/        # Estudios realizados
│   │   ├── login/           # Inicio de sesión
│   │   ├── nosotros/        # Sobre la empresa
│   │   └── servicios/       # Servicios ofrecidos
│   ├── components/
│   │   └── landing/         # Componentes del sitio
│   ├── lib/
│   │   └── db.ts            # Conexión PostgreSQL
│   ├── providers/
│   │   └── AuthProvider.tsx # Proveedor de sesión
│   └── types/
│       └── next-auth.d.ts   # Tipos de autenticación
├── schema.sql               # Esquema de base de datos
└── package.json
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repo>
   cd gyp-consultoria
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear archivo `.env.local`:
   ```env
   # Base de datos PostgreSQL
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/gyp_consultoria
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui
   ```

4. **Crear la base de datos**
   ```bash
   psql -U postgres -c "CREATE DATABASE gyp_consultoria;"
   psql -U postgres -d gyp_consultoria -f schema.sql
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📊 Base de Datos

### Tablas principales

| Tabla | Descripción |
|-------|-------------|
| `app_users` | Usuarios administradores |
| `surveys` | Encuestas |
| `questions` | Preguntas de encuestas |
| `question_options` | Opciones de respuesta |
| `submissions` | Envíos de encuestas |
| `answers` | Respuestas individuales |

### Diagrama de relaciones

```
app_users
    │
    └──< surveys
            │
            ├──< questions
            │       │
            │       └──< question_options
            │
            └──< submissions
                    │
                    └──< answers
```

### Tipos de preguntas

- `text` - Respuesta abierta
- `single_choice` - Selección única
- `multiple_choice` - Selección múltiple

## 🔐 Autenticación

Sistema basado en **NextAuth.js** con credenciales.

### Usuario por defecto
```
Email: admin@gypconsultoria.com
Password: admin123
```

### Crear nuevo administrador
```bash
node scripts/create-admin.js
```

### Rutas protegidas

| Ruta | Acceso |
|------|--------|
| `/admin/*` | Solo administradores |
| `/dashboard/*` | Usuarios autenticados |

## 🌐 API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/[...nextauth]` | Login con NextAuth |
| POST | `/api/auth/register` | Registro de usuarios |

### Encuestas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/surveys` | Listar encuestas |
| POST | `/api/surveys` | Crear encuesta |
| GET | `/api/surveys/[id]` | Obtener encuesta |
| PUT | `/api/surveys/[id]` | Actualizar encuesta |
| DELETE | `/api/surveys/[id]` | Eliminar encuesta |
| POST | `/api/surveys/[id]/respond` | Enviar respuesta |

### Otros
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/stats` | Estadísticas generales |
| POST | `/api/upload` | Subir archivos |
| GET | `/api/users` | Listar usuarios |

## 📱 Páginas Públicas

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal con hero, stats y servicios |
| `/nosotros` | Información de la empresa, misión y visión |
| `/servicios` | Catálogo de servicios ofrecidos |
| `/estudios` | Estudios e investigaciones realizadas |
| `/clientes` | Empresas y organizaciones atendidas |
| `/contacto` | Formulario de contacto |
| `/encuestas` | Lista de encuestas públicas activas |
| `/encuestas/[id]` | Responder una encuesta específica |

## 🎨 Componentes Landing

| Componente | Descripción |
|------------|-------------|
| `Header` | Navegación principal |
| `Footer` | Pie de página |
| `Hero` | Sección principal con CTA |
| `About` | Información de la empresa |
| `Stats` | Estadísticas destacadas |
| `Clients` | Logos de clientes |
| `Contact` | Formulario de contacto |
| `Charts` | Gráficos y visualizaciones |
| `Methodology` | Metodología de trabajo |
| `MissionVision` | Misión y visión |
| `Newsletter` | Suscripción a boletín |
| `Presentation` | Presentación corporativa |
| `RecentStudies` | Estudios recientes |
| `CallToAction` | Llamados a la acción |

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint
```

## 🌍 Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | ✅ | URL de conexión PostgreSQL |
| `NEXTAUTH_URL` | ✅ | URL base de la aplicación |
| `NEXTAUTH_SECRET` | ✅ | Secreto para JWT |

## 📦 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio en Vercel
2. Configurar variables de entorno
3. Desplegar

### Docker

```dockerfile
# Próximamente
```

### VPS

1. Clonar repositorio
2. Instalar dependencias
3. Configurar `.env.local`
4. Ejecutar `npm run build`
5. Usar PM2: `pm2 start npm --name "gyp" -- start`

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Protección de rutas con middleware
- Validación de sesiones con JWT
- Prepared statements para SQL (prevención de inyección)

## 📝 Licencia

Proyecto privado - GyP Consultoría © 2024

## 👥 Contacto

- **Empresa**: GyP Consultoría
- **Email**: contacto@gypconsultoria.com
- **Web**: [gypconsultoria.com](https://gypconsultoria.com)
