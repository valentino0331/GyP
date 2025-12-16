# 🚀 GUÍA DE CONFIGURACIÓN - Sistema CMS GyP Consultoría

## ✅ Lo que se ha implementado

### 1. **Sistema de Roles**
- **Administrador (admin)**: Acceso completo a todas las funciones
- **Editor**: Solo puede ver dashboard y gestionar encuestas

### 2. **Panel de Administración Mejorado**
Nuevas secciones para el **Administrador**:
- 📊 **Dashboard** - Estadísticas generales
- 📝 **Encuestas** - Crear y gestionar encuestas
- 🌐 **Contenido** - Editar textos del sitio web
- 🖼️ **Galería** - Subir fotos de trabajos realizados
- 🏢 **Clientes** - Gestionar logos de clientes
- 👤 **Usuarios** - Crear editores y administradores
- 📈 **Reportes** - Ver estadísticas
- ⚙️ **Configuración** - Ajustes del sistema

### 3. **APIs Creadas**
- `/api/content` - Gestión de contenido del sitio
- `/api/gallery` - Gestión de galería de trabajos
- `/api/clients` - Gestión de clientes
- `/api/navigation` - Gestión de menú de navegación
- `/api/users` - CRUD completo de usuarios

---

## 📋 PASOS PARA CONFIGURAR

### Paso 1: Ejecutar el script SQL

Debes ejecutar el archivo `schema_update.sql` en tu base de datos PostgreSQL.

**Si usas Neon Database:**
1. Ve a tu dashboard en [console.neon.tech](https://console.neon.tech)
2. Selecciona tu proyecto
3. Ve a la pestaña **"SQL Editor"**
4. Copia todo el contenido de `schema_update.sql`
5. Pégalo en el editor y haz clic en **"Run"**

**Si usas otro cliente SQL (DBeaver, pgAdmin, etc.):**
1. Conéctate a tu base de datos
2. Abre el archivo `schema_update.sql`
3. Ejecuta todas las sentencias

### Paso 2: Verificar la instalación

1. Inicia tu servidor local: `npm run dev`
2. Ve a `http://localhost:3000/login`
3. Ingresa con las credenciales de admin
4. Verifica que veas todas las secciones en el menú lateral

### Paso 3: Crear usuarios editores

1. Ve a la sección **"Usuarios"** en el panel
2. Haz clic en **"Nuevo Usuario"**
3. Completa los datos:
   - Nombre
   - Email
   - Contraseña
   - Rol: **Editor**
4. Guarda

---

## 🎯 Cómo usar cada función

### Editar Contenido del Sitio
1. Ve a **Contenido** en el menú
2. Haz clic en **Editar** en la sección que quieras modificar
3. Cambia los textos (puedes cambiar títulos, descripciones, etc.)
4. Guarda los cambios

**Ejemplo**: Si quieres que "Nosotros" se llame "Nuestro Trabajo":
- Edita la sección "Nosotros"
- Cambia el campo "Nombre de la sección"
- Guarda

### Subir Fotos de Trabajos
1. Ve a **Galería**
2. Haz clic en **Agregar Imagen**
3. Sube la foto, pon un título y descripción
4. Guarda

### Agregar Clientes
1. Ve a **Clientes**
2. Haz clic en **Agregar Cliente**
3. Sube el logo, pon el nombre de la empresa
4. Guarda

---

## ⚠️ Notas Importantes

1. **Base de datos**: El script SQL debe ejecutarse ANTES de usar las nuevas funciones
2. **Imágenes**: Las imágenes se suben a `/public/uploads/` (asegúrate de que el servidor tenga permisos)
3. **Roles**: Los editores NO pueden ver las secciones de contenido, galería, clientes ni usuarios
4. **Seguridad**: Cambia la contraseña del admin después de la primera configuración

---

## 🔧 Solución de Problemas

### "No se pudo cargar el contenido"
- Ejecuta el script `schema_update.sql` en tu base de datos

### "Error al subir imagen"
- Verifica que la carpeta `public/uploads` exista y tenga permisos de escritura
- En Netlify/Vercel, las imágenes deben subirse a un servicio externo como Cloudinary

### "Solo el administrador puede..."
- El usuario actual es un **editor**. Solo los administradores pueden editar contenido

---

## 📁 Archivos Modificados/Creados

```
gyp-consultoria/
├── schema_update.sql          # ⭐ EJECUTAR EN BASE DE DATOS
├── MANUAL_USUARIO.md          # Manual actualizado
├── SETUP_CMS.md               # Esta guía
└── src/
    ├── app/
    │   ├── admin/
    │   │   └── page.tsx       # Panel mejorado con nuevas secciones
    │   └── api/
    │       ├── content/
    │       │   └── route.ts   # API de contenido
    │       ├── gallery/
    │       │   └── route.ts   # API de galería
    │       ├── clients/
    │       │   └── route.ts   # API de clientes
    │       ├── navigation/
    │       │   └── route.ts   # API de navegación
    │       └── users/
    │           └── route.ts   # API de usuarios (mejorada)
```

---

## 🌐 Despliegue en Netlify + Neon

### 1. Configura Neon Database
1. Crea cuenta en [neon.tech](https://neon.tech)
2. Crea un proyecto nuevo
3. Ejecuta `schema.sql` y luego `schema_update.sql`
4. Copia la `DATABASE_URL`

### 2. Configura Netlify
1. Sube tu código a GitHub
2. Conecta el repo con Netlify
3. Agrega estas variables de entorno:
   - `DATABASE_URL` = tu URL de Neon
   - `NEXTAUTH_SECRET` = una clave secreta (puedes generar una con `openssl rand -base64 32`)
   - `NEXTAUTH_URL` = la URL de tu sitio en Netlify

### 3. Despliega
1. Haz clic en Deploy
2. ¡Listo! 🎉
