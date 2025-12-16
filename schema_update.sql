-- ============================================
-- ACTUALIZACIÓN DE ESQUEMA PARA SISTEMA CMS
-- ============================================
-- INSTRUCCIONES:
-- 1. Ejecuta este script en tu base de datos PostgreSQL (Neon)
-- 2. Puedes ejecutarlo desde la consola de Neon o usando un cliente SQL
-- 3. Este script es SEGURO de ejecutar múltiples veces (usa IF NOT EXISTS)
-- ============================================

-- 1. Agregar nuevo rol 'editor' a los usuarios existentes
-- Los roles serán: 'admin' (acceso total) y 'editor' (solo encuestas)

-- 2. Tabla para contenido editable del sitio
CREATE TABLE IF NOT EXISTS site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) UNIQUE NOT NULL, -- Identificador único de la sección
    section_name VARCHAR(255) NOT NULL,       -- Nombre visible en el panel (editable)
    content JSONB NOT NULL DEFAULT '{}',      -- Contenido en formato JSON
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES app_users(id)
);

-- 3. Tabla para imágenes/evidencias de trabajo
CREATE TABLE IF NOT EXISTS work_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES app_users(id)
);

-- 4. Tabla para clientes (editable)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    website VARCHAR(500),
    description TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tabla para servicios (editable)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100), -- Nombre del icono
    features JSONB DEFAULT '[]', -- Lista de características
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Tabla para estudios/casos de éxito
CREATE TABLE IF NOT EXISTS studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(500),
    date DATE,
    content TEXT, -- Contenido completo del estudio
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Tabla para miembros del equipo
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT,
    photo_url VARCHAR(500),
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Tabla para enlaces de navegación (menú)
CREATE TABLE IF NOT EXISTS navigation_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(100) NOT NULL,
    href VARCHAR(255) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true
);

-- 9. Insertar contenido inicial del sitio
INSERT INTO site_content (section_key, section_name, content) VALUES

('about', 'Nosotros', '{
    "subtitle": "Sobre GyP",
    "title": "Consultoría e Investigación de Mercados",
    "description": "GyP Consultoría es una empresa especializada en investigación de mercados y estudios de opinión. Proporcionamos información confiable para una verdadera comprensión de la sociedad, los mercados y las personas.",
    "description2": "Nuestro equipo de profesionales experimentados utiliza metodologías rigurosas y tecnología de vanguardia para entregar insights accionables que ayudan a nuestros clientes a tomar mejores decisiones.",
    "stats": [
        {"value": "15+", "label": "Años de experiencia"},
        {"value": "50+", "label": "Clientes activos"},
        {"value": "500+", "label": "Estudios realizados"}
    ],
    "image": "/hero-bg-2.jpg"
}'::jsonb),

('mission_vision', 'Misión y Visión', '{
    "mission": {
        "subtitle": "Nuestra Misión",
        "title": "Generar conocimiento para mejores decisiones",
        "description": "Proporcionar información confiable y oportuna a través de investigaciones rigurosas, contribuyendo al desarrollo de organizaciones y la sociedad."
    },
    "vision": {
        "subtitle": "Nuestra Visión",
        "title": "Ser referentes en investigación",
        "description": "Consolidarnos como la empresa líder en investigación de mercados y estudios de opinión, reconocida por la calidad y confiabilidad de nuestros estudios."
    },
    "values": [
        {"title": "Rigor Metodológico", "description": "Aplicamos estándares de calidad en cada estudio"},
        {"title": "Confidencialidad", "description": "Protegemos la información de nuestros clientes"},
        {"title": "Objetividad", "description": "Resultados imparciales basados en datos"},
        {"title": "Innovación", "description": "Metodologías y tecnología de vanguardia"}
    ]
}'::jsonb),

('company_info', 'Información de la Empresa', '{
    "name": "GyP Consultoría",
    "shortName": "GyP",
    "tagline": "Consultoría",
    "logo": "/logo.png",
    "description": "Investigación de mercados y estudios de opinión. Información confiable para mejores decisiones.",
    "address": "Lima, Perú",
    "phone": "+51 956 478 233",
    "email": "gypsac@hotmail.com",
    "socialMedia": {
        "facebook": "",
        "linkedin": "",
        "twitter": "",
        "instagram": ""
    }
}'::jsonb),

('hero', 'Hero Principal', '{
    "tag": "Investigación de Mercados",
    "title": "Información confiable para mejores decisiones",
    "description": "Encuestas, sondeos de opinión e investigación de mercados para comprender a la sociedad, los mercados y las personas.",
    "image": "/team-meeting.jpg"
}'::jsonb),

('stats', 'Estadísticas', '{
    "items": [
        {"value": "500+", "label": "Estudios"},
        {"value": "50+", "label": "Clientes"},
        {"value": "10K+", "label": "Encuestas"},
        {"value": "15+", "label": "Años"}
    ]
}'::jsonb),

('services', 'Servicios Preview', '{
    "tag": "Servicios",
    "title": "Soluciones de Investigación",
    "items": [
        {"title": "Encuestas", "description": "Diseño y aplicación de encuestas cuantitativas.", "href": "/servicios"},
        {"title": "Sondeos de Opinión", "description": "Estudios rápidos sobre temas de actualidad.", "href": "/servicios"},
        {"title": "Investigación de Mercados", "description": "Análisis profundo de mercados y competencia.", "href": "/servicios"},
        {"title": "Estudios Cualitativos", "description": "Focus groups y entrevistas a profundidad.", "href": "/servicios"}
    ]
}'::jsonb),

('studies', 'Estudios Preview', '{
    "tag": "Publicaciones",
    "title": "Estudios Recientes",
    "description": "Explora nuestros últimos estudios e investigaciones. Datos actualizados sobre opinión pública, comportamiento del consumidor y tendencias de mercado.",
    "image": "/charts-screen.jpg",
    "highlights": [
        {"value": "72%", "label": "prefiere marcas con propósito"},
        {"value": "45%", "label": "incremento en compras online"}
    ]
}'::jsonb),

('cta', 'Llamado a la Acción', '{
    "tag": "Únete a nosotros",
    "title": "¿Quieres participar en nuestras encuestas?",
    "description": "Únete a nuestro panel de encuestados y contribuye con tu opinión a la toma de decisiones importantes en el Perú.",
    "buttonText": "PARTICIPAR AHORA",
    "image": "/survey-people.jpg"
}'::jsonb),

('quickLinks', 'Enlaces Rápidos', '{
    "items": [
        {"title": "Nosotros", "description": "Conoce nuestra historia y equipo", "href": "/nosotros"},
        {"title": "Clientes", "description": "Empresas que confían en nosotros", "href": "/clientes"},
        {"title": "Contacto", "description": "Solicita una cotización", "href": "/contacto"}
    ]
}'::jsonb),

('nosotros_page', 'Página Nosotros', '{
    "heroSubtitle": "Conócenos",
    "heroTitle": "Quiénes Somos",
    "heroDescription": "Un equipo de profesionales comprometidos con la calidad y la excelencia en investigación de mercados.",
    "heroImage": "/team-meeting.jpg",
    "teamSectionTitle": "Nuestro Equipo",
    "teamSectionSubtitle": "Profesionales Experimentados"
}'::jsonb)

ON CONFLICT (section_key) DO UPDATE SET 
    section_name = EXCLUDED.section_name,
    content = EXCLUDED.content,
    updated_at = NOW();

-- 10. Insertar enlaces de navegación por defecto
INSERT INTO navigation_links (label, href, display_order) VALUES
('Servicios', '/servicios', 1),
('Estudios', '/estudios', 2),
('Nosotros', '/nosotros', 3),
('Clientes', '/clientes', 4),
('Contacto', '/contacto', 5)
ON CONFLICT DO NOTHING;

-- 11. Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_site_content_section_key ON site_content(section_key);
CREATE INDEX IF NOT EXISTS idx_work_gallery_visible ON work_gallery(is_visible, display_order);
CREATE INDEX IF NOT EXISTS idx_clients_visible ON clients(is_visible, display_order);
CREATE INDEX IF NOT EXISTS idx_services_visible ON services(is_visible, display_order);
CREATE INDEX IF NOT EXISTS idx_studies_visible ON studies(is_visible, created_at);
CREATE INDEX IF NOT EXISTS idx_team_members_visible ON team_members(is_visible, display_order);

-- 12. Agregar columna is_read a contact_messages (para el panel de mensajes)
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- 13. Insertar servicios iniciales de ejemplo
INSERT INTO services (title, description, icon, display_order) VALUES
('Investigación de Mercados', 'Estudios cuantitativos y cualitativos para conocer a tu público objetivo, competencia y oportunidades de mercado.', 'chart', 1),
('Estudios de Opinión Pública', 'Encuestas y sondeos para medir la percepción ciudadana sobre temas políticos, sociales y económicos.', 'users', 2),
('Análisis de Datos', 'Procesamiento y análisis estadístico de grandes volúmenes de información para obtener insights accionables.', 'graph', 3),
('Consultoría Estratégica', 'Asesoría especializada para la toma de decisiones basada en datos e investigación.', 'target', 4)
ON CONFLICT DO NOTHING;

-- 14. Insertar miembros del equipo de ejemplo
INSERT INTO team_members (name, position, bio, display_order) VALUES
('Director General', 'CEO & Fundador', 'Más de 20 años de experiencia en investigación de mercados y consultoría estratégica.', 1),
('Directora de Investigación', 'Head of Research', 'Especialista en metodologías cuantitativas y cualitativas con amplia experiencia en el sector.', 2),
('Analista Senior', 'Data Analyst', 'Experto en procesamiento de datos y visualización de información.', 3)
ON CONFLICT DO NOTHING;
