'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaUsers, FaPoll, FaChartBar, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaBars, FaSpinner, FaImage, FaUpload, FaCalendar, FaCopy, FaDownload, FaGlobe, FaBuilding, FaImages } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Tipos
interface Survey {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  createdByName: string;
  responseCount: number;
}

interface Stats {
  activeSurveys: number;
  totalSurveys: number;
  responsesToday: number;
  totalResponses: number;
  totalUsers: number;
  responseRate: string;
}

interface DashboardData {
  stats: Stats;
  responsesByDay: { date: string; count: number }[];
  recentSurveys: Survey[];
  recentActivity: { type: string; surveyTitle: string; timestamp: string }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface SiteContent {
  id: string;
  section_key: string;
  section_name: string;
  content: any;
  updated_at: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_visible: boolean;
}

interface Client {
  id: string;
  name: string;
  logo_url: string;
  website: string;
  description: string;
  display_order: number;
  is_visible: boolean;
}

type Tab = 'dashboard' | 'encuestas' | 'contenido' | 'galeria' | 'clientes' | 'usuarios' | 'reportes' | 'configuracion';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Obtener el rol del usuario
  const userRole = (session?.user as any)?.role || 'editor';
  const isAdmin = userRole === 'admin';

  // Auto-cerrar sidebar en móvil
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // Si es editor y está en una pestaña no permitida, redirigir a encuestas
  useEffect(() => {
    if (!isAdmin && !['dashboard', 'encuestas'].includes(activeTab)) {
      setActiveTab('encuestas');
    }
  }, [isAdmin, activeTab]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  if (!session) return null;

  // Menú según rol
  const allMenuItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: FaChartBar, adminOnly: false },
    { id: 'encuestas' as Tab, label: 'Encuestas', icon: FaPoll, adminOnly: false },
    { id: 'contenido' as Tab, label: 'Contenido', icon: FaGlobe, adminOnly: true },
    { id: 'galeria' as Tab, label: 'Galería', icon: FaImages, adminOnly: true },
    { id: 'clientes' as Tab, label: 'Clientes', icon: FaBuilding, adminOnly: true },
    { id: 'usuarios' as Tab, label: 'Usuarios', icon: FaUsers, adminOnly: true },
    { id: 'reportes' as Tab, label: 'Reportes', icon: FaChartBar, adminOnly: true },
    { id: 'configuracion' as Tab, label: 'Configuración', icon: FaCog, adminOnly: true },
  ];

  const menuItems = isAdmin ? allMenuItems : allMenuItems.filter(item => !item.adminOnly);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Overlay para móvil */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-20 lg:translate-x-0'} 
        bg-gray-900 text-white transition-all duration-300 flex flex-col
      `}>
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-white rounded p-1 flex-shrink-0">
              <Image src="/logo.png" alt="GyP Logo" fill className="object-contain" />
            </div>
            <div className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>
              <span className="font-bold">GyP Admin</span>
              <span className="text-xs text-gray-400 block">Panel de Control</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors ${
                activeTab === item.id 
                  ? 'bg-teal-600 text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link 
            href="/"
            className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>Volver al sitio</span>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center space-x-3 text-gray-400 hover:text-red-400 transition-colors w-full"
          >
            <FaTimes className="w-5 h-5" />
            <span className={`${sidebarOpen ? 'block' : 'hidden lg:hidden'}`}>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 p-2 -ml-2"
            >
              <FaBars className="w-5 h-5" />
            </button>
            <h1 className="text-lg lg:text-xl font-bold text-gray-900 capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{session.user?.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {isAdmin ? '👑 Admin' : '✏️ Editor'}
              </span>
            </div>
            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base ${isAdmin ? 'bg-purple-600' : 'bg-teal-600'}`}>
              {session.user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {activeTab === 'dashboard' && <DashboardContent key={refreshKey} />}
          {activeTab === 'encuestas' && <EncuestasContent key={refreshKey} onCrear={() => setModalCrear(true)} />}
          {activeTab === 'contenido' && isAdmin && <ContenidoContent />}
          {activeTab === 'galeria' && isAdmin && <GaleriaContent />}
          {activeTab === 'clientes' && isAdmin && <ClientesContent />}
          {activeTab === 'usuarios' && isAdmin && <UsuariosContent />}
          {activeTab === 'reportes' && isAdmin && <ReportesContent />}
          {activeTab === 'configuracion' && isAdmin && <ConfiguracionContent />}
        </main>
      </div>

      {modalCrear && (
        <ModalCrearEncuesta onClose={() => setModalCrear(false)} onSuccess={() => {
          setModalCrear(false);
          setRefreshKey(k => k + 1);
        }} />
      )}
    </div>
  );
}

// Dashboard con datos reales
function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Error al cargar estadísticas');
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error || 'Error al cargar datos'}</p>
        <button onClick={fetchStats} className="mt-2 text-red-700 underline">Reintentar</button>
      </div>
    );
  }

  const statsCards = [
    { label: 'Encuestas Activas', value: data.stats.activeSurveys.toString(), color: 'bg-teal-500', icon: FaPoll },
    { label: 'Respuestas Hoy', value: data.stats.responsesToday.toString(), color: 'bg-blue-500', icon: FaChartBar },
    { label: 'Total Respuestas', value: data.stats.totalResponses.toString(), color: 'bg-green-500', icon: FaUsers },
    { label: 'Tasa de Respuesta', value: data.stats.responseRate, color: 'bg-purple-500', icon: FaCheck },
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diff < 60) return 'Hace unos segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    return `Hace ${Math.floor(diff / 86400)} días`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Respuestas por Día</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {data.responsesByDay.length > 0 ? (
              data.responsesByDay.slice(-7).map((day, index) => {
                const maxCount = Math.max(...data.responsesByDay.map(d => d.count), 1);
                const height = (day.count / maxCount) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-teal-500 rounded-t min-h-[4px]"
                      style={{ height: `${height}%` }}
                      title={`${day.count} respuestas`}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {new Date(day.date).toLocaleDateString('es', { weekday: 'short' })}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center w-full py-10">Sin datos de respuestas</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Encuestas Recientes</h3>
          <div className="space-y-3">
            {data.recentSurveys.length > 0 ? (
              data.recentSurveys.map((encuesta) => (
                <div key={encuesta.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{encuesta.title}</p>
                    <p className="text-xs text-gray-500">{encuesta.responseCount} respuestas</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    encuesta.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {encuesta.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No hay encuestas aún</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {data.recentActivity.length > 0 ? (
            data.recentActivity.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                <p className="text-sm text-gray-700">Nueva respuesta en &quot;{item.surveyTitle}&quot;</p>
                <span className="text-xs text-gray-500">{formatTimeAgo(item.timestamp)}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">Sin actividad reciente</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Encuestas con datos reales
function EncuestasContent({ onCrear }: { onCrear: () => void }) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const res = await fetch('/api/surveys');
      if (!res.ok) throw new Error('Error al cargar encuestas');
      const data = await res.json();
      setSurveys(data);
    } catch (err) {
      setError('No se pudieron cargar las encuestas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta encuesta?')) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/surveys/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      setSurveys(surveys.filter(s => s.id !== id));
    } catch (err) {
      alert('Error al eliminar la encuesta');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (survey: Survey) => {
    try {
      const res = await fetch(`/api/surveys/${survey.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !survey.isActive }),
      });
      if (!res.ok) throw new Error('Error al actualizar');
      setSurveys(surveys.map(s => 
        s.id === survey.id ? { ...s, isActive: !s.isActive } : s
      ));
    } catch (err) {
      alert('Error al actualizar la encuesta');
    }
  };

  const filteredSurveys = surveys.filter(s => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && s.isActive) || 
      (filter === 'inactive' && !s.isActive);
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gestión de Encuestas</h2>
          <p className="text-sm text-gray-500">Crea, edita y administra tus encuestas</p>
        </div>
        <button 
          onClick={onCrear}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Nueva Encuesta
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar encuesta..." 
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {filteredSurveys.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaPoll className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No hay encuestas</h3>
          <p className="text-gray-500 mb-4">Crea tu primera encuesta para empezar</p>
          <button
            onClick={onCrear}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Crear Encuesta
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Nombre</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Estado</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Respuestas</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Fecha</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSurveys.map((survey) => (
                <tr key={survey.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{survey.title}</p>
                    {survey.description && (
                      <p className="text-sm text-gray-500 truncate max-w-xs">{survey.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(survey)}
                      className={`text-xs font-bold px-2 py-1 rounded cursor-pointer ${
                        survey.isActive 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {survey.isActive ? 'Activa' : 'Inactiva'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{survey.responseCount}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(survey.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/encuestas/${survey.id}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-teal-600 transition-colors" 
                        title="Ver Encuesta"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(survey.id)}
                        disabled={deleting === survey.id}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50" 
                        title="Eliminar"
                      >
                        {deleting === survey.id ? (
                          <FaSpinner className="w-4 h-4 animate-spin" />
                        ) : (
                          <FaTrash className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Usuarios con CRUD completo
function UsuariosContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Error al eliminar usuario');
      }
    } catch (err) {
      alert('Error al eliminar usuario');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-sm text-gray-500">Administra usuarios y permisos</p>
        </div>
        <button
          onClick={() => { setEditingUser(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Info de roles */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-blue-800 font-bold mb-2">📋 Tipos de Usuario</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li><strong>Administrador:</strong> Acceso completo. Puede editar contenido del sitio, usuarios, galería, clientes y encuestas.</li>
          <li><strong>Editor:</strong> Solo puede ver el dashboard y gestionar encuestas. No puede editar el contenido del sitio.</li>
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay usuarios registrados</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Usuario</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Rol</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Registro</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-teal-100 text-teal-700'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role === 'admin' ? '👑 Administrador' : '✏️ Editor'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.created_at).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingUser(user); setShowModal(true); }}
                        className="text-teal-600 hover:text-teal-700"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleting === user.id}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        title="Eliminar"
                      >
                        {deleting === user.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <ModalUsuario
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchUsers(); }}
        />
      )}
    </div>
  );
}

// Modal para crear/editar usuario
function ModalUsuario({ user, onClose, onSuccess }: {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'editor');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!name || !email) {
      setError('Nombre y email son requeridos');
      return;
    }
    if (!user && !password) {
      setError('La contraseña es requerida para nuevos usuarios');
      return;
    }
    if (password && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const method = user ? 'PUT' : 'POST';
      const body: any = { name, email, role };
      if (user) body.id = user.id;
      if (password) body.password = password;

      const res = await fetch('/api/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar');
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error al guardar usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {user ? '(dejar vacío para mantener actual)' : '*'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              placeholder={user ? '••••••••' : 'Mínimo 6 caracteres'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
            >
              <option value="editor">✏️ Editor (solo encuestas)</option>
              <option value="admin">👑 Administrador (acceso completo)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {role === 'admin' 
                ? 'Podrá editar todo el contenido del sitio, usuarios, galería y clientes.'
                : 'Solo podrá ver el dashboard y gestionar encuestas.'}
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <FaSpinner className="animate-spin w-4 h-4" />}
            {user ? 'Actualizar' : 'Crear Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Reportes
function ReportesContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Reportes y Análisis</h2>
        <p className="text-sm text-gray-500">Genera reportes de tus encuestas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { titulo: 'Reporte de Respuestas', descripcion: 'Análisis detallado de todas las respuestas', icon: FaChartBar },
          { titulo: 'Reporte de Usuarios', descripcion: 'Estadísticas de participación de usuarios', icon: FaUsers },
          { titulo: 'Reporte de Tendencias', descripcion: 'Evolución temporal de las métricas', icon: FaPoll },
        ].map((reporte, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 p-3 rounded-lg">
                <reporte.icon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{reporte.titulo}</h3>
                <p className="text-sm text-gray-500 mt-1">{reporte.descripcion}</p>
                <button className="mt-4 text-teal-600 font-bold text-sm hover:text-teal-700">
                  Generar Reporte →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Configuración
function ConfiguracionContent() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Configuración</h2>
        <p className="text-sm text-gray-500">Ajusta las preferencias del sistema</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Información de la Empresa</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Empresa</label>
              <input 
                type="text" 
                defaultValue="GyP Consultoría" 
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto</label>
              <input 
                type="email" 
                defaultValue="contacto@gypconsultoria.com" 
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal Crear Encuesta mejorado
function ModalCrearEncuesta({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [paso, setPaso] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [questions, setQuestions] = useState<{ text: string; type: string; options: string[]; image?: string }[]>([
    { text: '', type: 'single_choice', options: ['', ''], image: '' }
  ]);
  const [isActive, setIsActive] = useState(false);

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al subir imagen');
      }
      
      const data = await res.json();
      callback(data.url);
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, (url) => setCoverImage(url));
    }
  };

  const handleQuestionImageChange = (qIndex: number, file: File) => {
    handleImageUpload(file, (url) => {
      const updated = [...questions];
      updated[qIndex].image = url;
      setQuestions(updated);
    });
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'single_choice', options: ['', ''], image: '' }]);
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updated = [...questions];
    if (field === 'text') {
      updated[index].text = value;
    } else if (field === 'type') {
      updated[index].type = value;
    }
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push('');
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }

    for (const q of questions) {
      if (!q.text.trim()) {
        setError('Todas las preguntas deben tener texto');
        return;
      }
      if (q.type !== 'text' && q.options.filter(o => o.trim()).length < 2) {
        setError('Las preguntas de opción necesitan al menos 2 opciones');
        return;
      }
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        title,
        description,
        isActive: publish,
        questions: questions.map(q => ({
          text: q.text,
          type: q.type,
          options: q.type === 'text' ? [] : q.options.filter(o => o.trim()).map(text => ({ text })),
        })),
      };

      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear encuesta');
      }

      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nueva Encuesta</h2>
            <p className="text-sm text-gray-500">Paso {paso} de 3</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {paso === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Encuesta *</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Satisfacción del Cliente Q1 2025"
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe el objetivo de esta encuesta..."
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="satisfaccion">Satisfacción del Cliente</option>
                    <option value="mercado">Estudio de Mercado</option>
                    <option value="producto">Evaluación de Producto</option>
                    <option value="clima">Clima Laboral</option>
                    <option value="opinion">Opinión Pública</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Público Objetivo</label>
                  <input 
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Ej: Clientes mayores de 25 años"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                  <input 
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                  <input 
                    type="date"
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Imagen de portada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen de Portada</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-500 transition-colors">
                  {coverImage ? (
                    <div className="relative">
                      <img src={coverImage} alt="Portada" className="max-h-40 mx-auto rounded" />
                      <button
                        onClick={() => setCoverImage('')}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                      />
                      {uploadingImage ? (
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <FaSpinner className="animate-spin" />
                          <span>Subiendo...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-500">
                          <FaImage className="w-8 h-8" />
                          <span className="text-sm">Clic para subir imagen</span>
                          <span className="text-xs text-gray-400">JPG, PNG, GIF (máx. 5MB)</span>
                        </div>
                      )}
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">Agrega preguntas a tu encuesta:</p>
              
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-medium text-gray-900">Pregunta {qIndex + 1}</span>
                    <div className="flex items-center gap-2">
                      <select 
                        value={q.type}
                        onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white text-gray-900"
                      >
                        <option value="single_choice">Opción Única</option>
                        <option value="multiple_choice">Opción Múltiple</option>
                        <option value="text">Texto Libre</option>
                        <option value="rating">Calificación 1-5</option>
                      </select>
                      {questions.length > 1 && (
                        <button 
                          onClick={() => removeQuestion(qIndex)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <input 
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                    placeholder="Escribe tu pregunta..."
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />

                  {/* Imagen de la pregunta */}
                  <div className="flex items-center gap-2">
                    {q.image ? (
                      <div className="relative inline-block">
                        <img src={q.image} alt="Imagen pregunta" className="h-16 rounded" />
                        <button
                          onClick={() => {
                            const updated = [...questions];
                            updated[qIndex].image = '';
                            setQuestions(updated);
                          }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full hover:bg-red-600"
                        >
                          <FaTimes className="w-2 h-2" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleQuestionImageChange(qIndex, file);
                          }}
                          className="hidden"
                        />
                        <FaImage className="w-4 h-4" />
                        <span>Agregar imagen</span>
                      </label>
                    )}
                  </div>
                  
                  {q.type !== 'text' && (
                    <div className="space-y-2 pl-4">
                      {q.options.map((opt, oIndex) => (
                        <input
                          key={oIndex}
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Opción ${oIndex + 1}`}
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      ))}
                      <button
                        onClick={() => addOption(qIndex)}
                        className="text-teal-600 text-sm font-medium hover:text-teal-700"
                      >
                        + Agregar opción
                      </button>
                    </div>
                  )}
                </div>
              ))}

              <button 
                onClick={addQuestion}
                className="flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700"
              >
                <FaPlus className="w-4 h-4" />
                Agregar Pregunta
              </button>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-4">
              <p className="text-gray-600">Resumen de tu encuesta:</p>
              
              {/* Vista previa con imagen */}
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {coverImage && (
                  <div className="relative h-32 w-full">
                    <img src={coverImage} alt="Portada" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <p className="absolute bottom-2 left-4 text-white font-bold text-lg">{title}</p>
                  </div>
                )}
                <div className="p-4 space-y-2">
                  {!coverImage && <p className="font-bold text-gray-900 text-lg">{title}</p>}
                  {description && <p className="text-gray-600 text-sm">{description}</p>}
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-500 mt-3 pt-3 border-t border-gray-200">
                    <p><span className="font-medium">Categoría:</span> {category || 'Sin categoría'}</p>
                    <p><span className="font-medium">Público:</span> {targetAudience || 'General'}</p>
                    <p><span className="font-medium">Inicio:</span> {startDate || 'Sin definir'}</p>
                    <p><span className="font-medium">Fin:</span> {endDate || 'Sin definir'}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-200">
                    <p className="text-sm text-teal-600 font-medium">{questions.length} pregunta(s)</p>
                    {questions.filter(q => q.image).length > 0 && (
                      <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                        <FaImage className="w-3 h-3" />
                        {questions.filter(q => q.image).length} con imagen
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <span className="text-gray-700">Publicar inmediatamente (activar encuesta)</span>
              </label>

              <div className="bg-green-50 border border-green-200 rounded p-4 mt-4">
                <p className="text-green-800 font-medium">¡Todo listo!</p>
                <p className="text-green-700 text-sm">Tu encuesta está lista para ser guardada.</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button 
            onClick={() => paso > 1 ? setPaso(paso - 1) : onClose()}
            className="text-gray-600 hover:text-gray-800 font-medium"
            disabled={saving}
          >
            {paso === 1 ? 'Cancelar' : 'Anterior'}
          </button>
          <div className="flex flex-wrap gap-2">
            {paso === 3 && (
              <button 
                onClick={() => handleSubmit(false)}
                disabled={saving}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 px-3 sm:px-4 rounded transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                Borrador
              </button>
            )}
            <button 
              onClick={() => paso < 3 ? setPaso(paso + 1) : handleSubmit(isActive)}
              disabled={saving || uploadingImage}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-3 sm:px-4 rounded transition-colors flex items-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              {saving && <FaSpinner className="animate-spin w-4 h-4" />}
              {paso === 3 ? 'Guardar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: GESTIÓN DE CONTENIDO DEL SITIO
// ==========================================
function ContenidoContent() {
  const [sections, setSections] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSection, setEditingSection] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/content');
      if (!res.ok) throw new Error('Error al cargar contenido');
      const data = await res.json();
      setSections(data);
    } catch (err) {
      setError('No se pudo cargar el contenido. Ejecuta el script schema_update.sql en tu base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: SiteContent) => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_key: section.section_key,
          section_name: section.section_name,
          content: section.content
        }),
      });
      if (!res.ok) throw new Error('Error al guardar');
      const updated = await res.json();
      setSections(sections.map(s => s.section_key === updated.section_key ? updated : s));
      setEditingSection(null);
      alert('¡Contenido actualizado correctamente!');
    } catch (err) {
      alert('Error al guardar el contenido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-bold mb-2">⚠️ Configuración Requerida</h3>
        <p className="text-yellow-700 mb-4">{error}</p>
        <p className="text-sm text-yellow-600">
          Ejecuta el archivo <code className="bg-yellow-100 px-1 rounded">schema_update.sql</code> en tu base de datos PostgreSQL para habilitar esta función.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Gestión de Contenido</h2>
        <p className="text-sm text-gray-500">Edita los textos e información que aparecen en el sitio web</p>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaGlobe className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">Sin contenido configurado</h3>
          <p className="text-gray-500">Ejecuta el script SQL para crear el contenido inicial</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sections.map((section) => (
            <div key={section.section_key} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{section.section_name}</h3>
                  <p className="text-xs text-gray-500">Clave: {section.section_key}</p>
                </div>
                <button
                  onClick={() => setEditingSection(section)}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  <FaEdit className="w-4 h-4" />
                  Editar
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Última actualización: {new Date(section.updated_at).toLocaleString('es-PE')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {editingSection && (
        <ModalEditarContenido
          section={editingSection}
          onClose={() => setEditingSection(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </div>
  );
}

// Modal para editar contenido - VERSIÓN AMIGABLE
function ModalEditarContenido({ section, onClose, onSave, saving }: {
  section: SiteContent;
  onClose: () => void;
  onSave: (section: SiteContent) => void;
  saving: boolean;
}) {
  const [editedSection, setEditedSection] = useState<SiteContent>({ ...section });
  const [jsonError, setJsonError] = useState('');

  const handleContentChange = (key: string, value: any) => {
    setEditedSection({
      ...editedSection,
      content: {
        ...editedSection.content,
        [key]: value
      }
    });
  };

  // Etiquetas amigables para los campos
  const fieldLabels: { [key: string]: string } = {
    title: '📝 Título',
    subtitle: '📌 Subtítulo',
    description: '📄 Descripción',
    description2: '📄 Descripción adicional',
    tag: '🏷️ Etiqueta',
    cta: '🔘 Texto del botón',
    image: '🖼️ URL de imagen',
    heroSubtitle: '📌 Subtítulo del encabezado',
    heroTitle: '📝 Título del encabezado',
    heroDescription: '📄 Descripción del encabezado',
    heroImage: '🖼️ Imagen del encabezado',
    name: '🏢 Nombre',
    shortName: '🏷️ Nombre corto',
    tagline: '💬 Eslogan',
    logo: '🖼️ Logo',
    address: '📍 Dirección',
    phone: '📞 Teléfono',
    email: '✉️ Correo electrónico',
    teamSectionTitle: '👥 Título sección equipo',
    teamSectionSubtitle: '📌 Subtítulo sección equipo',
  };

  const getFieldLabel = (key: string) => fieldLabels[key] || key.replace(/_/g, ' ');

  // Renderizar campos de forma amigable
  const renderField = (key: string, value: any, path: string[] = []) => {
    const fullPath = [...path, key];
    const fieldId = fullPath.join('.');

    if (typeof value === 'string') {
      const isLongText = value.length > 100 || key.includes('description') || key.includes('Description');
      const isUrl = key.toLowerCase().includes('url') || key.toLowerCase().includes('image') || key === 'logo' || key === 'href';
      
      return (
        <div key={fieldId} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {getFieldLabel(key)}
          </label>
          {isLongText ? (
            <textarea
              value={value}
              onChange={(e) => {
                if (path.length === 0) {
                  handleContentChange(key, e.target.value);
                }
              }}
              rows={3}
              placeholder={`Escribe ${key.replace(/_/g, ' ')}...`}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          ) : (
            <input
              type={isUrl ? 'url' : 'text'}
              value={value}
              onChange={(e) => {
                if (path.length === 0) {
                  handleContentChange(key, e.target.value);
                }
              }}
              placeholder={isUrl ? 'https://...' : `Escribe ${key.replace(/_/g, ' ')}...`}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          )}
        </div>
      );
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={fieldId} className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            📁 {getFieldLabel(key)}
          </h4>
          <div className="space-y-3">
            {Object.entries(value).map(([subKey, subValue]) => (
              <div key={`${fieldId}.${subKey}`}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {getFieldLabel(subKey)}
                </label>
                <input
                  type="text"
                  value={String(subValue)}
                  onChange={(e) => {
                    const newObj = { ...value, [subKey]: e.target.value };
                    handleContentChange(key, newObj);
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-teal-500"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={fieldId} className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              📋 {getFieldLabel(key)} ({value.length} elementos)
            </h4>
          </div>
          <div className="space-y-3">
            {value.map((item, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Elemento {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newArray = value.filter((_, i) => i !== index);
                      handleContentChange(key, newArray);
                    }}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    ❌ Eliminar
                  </button>
                </div>
                {typeof item === 'object' ? (
                  <div className="grid gap-2">
                    {Object.entries(item).map(([itemKey, itemValue]) => (
                      <div key={itemKey}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {getFieldLabel(itemKey)}
                        </label>
                        <input
                          type="text"
                          value={String(itemValue)}
                          onChange={(e) => {
                            const newArray = [...value];
                            newArray[index] = { ...item, [itemKey]: e.target.value };
                            handleContentChange(key, newArray);
                          }}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={String(item)}
                    onChange={(e) => {
                      const newArray = [...value];
                      newArray[index] = e.target.value;
                      handleContentChange(key, newArray);
                    }}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-gray-900"
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItem = value.length > 0 && typeof value[0] === 'object' 
                  ? Object.fromEntries(Object.keys(value[0]).map(k => [k, '']))
                  : '';
                handleContentChange(key, [...value, newItem]);
              }}
              className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-teal-500 hover:text-teal-600 transition-colors"
            >
              ➕ Agregar elemento
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderContentEditor = () => {
    const content = editedSection.content;
    
    if (typeof content !== 'object') {
      return (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-yellow-700">Contenido no editable visualmente</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {Object.entries(content).map(([key, value]) => renderField(key, value))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Editar: {editedSection.section_name}</h2>
              <input
                type="text"
                value={editedSection.section_name}
                onChange={(e) => setEditedSection({ ...editedSection, section_name: e.target.value })}
                placeholder="Nombre de la sección"
                className="mt-2 text-sm border border-gray-300 rounded px-2 py-1 text-gray-700"
              />
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {jsonError && (
            <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
              <p className="text-red-600 text-sm">{jsonError}</p>
            </div>
          )}
          {renderContentEditor()}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(editedSection)}
            disabled={saving || !!jsonError}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {saving && <FaSpinner className="animate-spin w-4 h-4" />}
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: GALERÍA DE TRABAJOS
// ==========================================
function GaleriaContent() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch('/api/gallery');
      if (!res.ok) throw new Error('Error al cargar galería');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      setError('No se pudo cargar la galería. Ejecuta el script schema_update.sql.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta imagen de la galería?')) return;
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleToggleVisibility = async (item: GalleryItem) => {
    try {
      await fetch('/api/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_visible: !item.is_visible }),
      });
      setItems(items.map(i => i.id === item.id ? { ...i, is_visible: !i.is_visible } : i));
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-bold mb-2">⚠️ Configuración Requerida</h3>
        <p className="text-yellow-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Galería de Trabajos</h2>
          <p className="text-sm text-gray-500">Evidencias y fotos de trabajos realizados</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Agregar Imagen
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">Sin imágenes</h3>
          <p className="text-gray-500">Agrega fotos de tus trabajos realizados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className={`bg-white rounded-lg shadow-sm overflow-hidden ${!item.is_visible ? 'opacity-60' : ''}`}>
              <div className="relative h-48">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                {!item.is_visible && (
                  <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                    Oculto
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { setEditingItem(item); setShowModal(true); }}
                    className="text-teal-600 hover:text-teal-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(item)}
                    className={item.is_visible ? 'text-green-600' : 'text-gray-400'}
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ModalGalleryItem
          item={editingItem}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchGallery(); }}
        />
      )}
    </div>
  );
}

// Modal para agregar/editar imagen de galería
function ModalGalleryItem({ item, onClose, onSuccess }: {
  item: GalleryItem | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [imageUrl, setImageUrl] = useState(item?.image_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } catch (err) {
      alert('Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !imageUrl) {
      alert('Título e imagen son requeridos');
      return;
    }

    setSaving(true);
    try {
      const method = item ? 'PUT' : 'POST';
      const body = item
        ? { id: item.id, title, description, image_url: imageUrl }
        : { title, description, image_url: imageUrl };

      const res = await fetch('/api/gallery', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Error al guardar');
      onSuccess();
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Editar Imagen' : 'Nueva Imagen'}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              placeholder="Ej: Trabajo en empresa ABC"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              rows={3}
              placeholder="Descripción del trabajo..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen *</label>
            {imageUrl ? (
              <div className="relative">
                <img src={imageUrl} alt="Preview" className="w-full h-40 object-cover rounded" />
                <button
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {uploading ? (
                  <FaSpinner className="animate-spin text-2xl text-gray-400 mx-auto" />
                ) : (
                  <>
                    <FaImage className="text-3xl text-gray-400 mx-auto mb-2" />
                    <span className="text-gray-500">Clic para subir imagen</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <FaSpinner className="animate-spin w-4 h-4" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE: GESTIÓN DE CLIENTES
// ==========================================
function ClientesContent() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      if (!res.ok) throw new Error('Error al cargar clientes');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      setError('No se pudieron cargar los clientes. Ejecuta el script schema_update.sql.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este cliente?')) return;
    try {
      await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleToggleVisibility = async (client: Client) => {
    try {
      await fetch('/api/clients', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: client.id, is_visible: !client.is_visible }),
      });
      setClients(clients.map(c => c.id === client.id ? { ...c, is_visible: !c.is_visible } : c));
    } catch (err) {
      alert('Error al actualizar');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-yellow-800 font-bold mb-2">⚠️ Configuración Requerida</h3>
        <p className="text-yellow-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gestión de Clientes</h2>
          <p className="text-sm text-gray-500">Empresas y clientes que han trabajado con ustedes</p>
        </div>
        <button
          onClick={() => { setEditingClient(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Agregar Cliente
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">Sin clientes registrados</h3>
          <p className="text-gray-500">Agrega los logos y nombres de tus clientes</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Cliente</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Website</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Estado</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className={!client.is_visible ? 'opacity-60' : ''}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {client.logo_url ? (
                        <img src={client.logo_url} alt={client.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <FaBuilding className="text-gray-400" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {client.website ? (
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline text-sm">
                        {client.website}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${client.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {client.is_visible ? 'Visible' : 'Oculto'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingClient(client); setShowModal(true); }} className="text-teal-600 hover:text-teal-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleToggleVisibility(client)} className={client.is_visible ? 'text-green-600' : 'text-gray-400'}>
                        <FaEye />
                      </button>
                      <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-700">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <ModalClienteItem
          client={editingClient}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchClients(); }}
        />
      )}
    </div>
  );
}

// Modal para agregar/editar cliente
function ModalClienteItem({ client, onClose, onSuccess }: {
  client: Client | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState(client?.name || '');
  const [website, setWebsite] = useState(client?.website || '');
  const [description, setDescription] = useState(client?.description || '');
  const [logoUrl, setLogoUrl] = useState(client?.logo_url || '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) setLogoUrl(data.url);
    } catch (err) {
      alert('Error al subir logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      alert('El nombre es requerido');
      return;
    }

    setSaving(true);
    try {
      const method = client ? 'PUT' : 'POST';
      const body = client
        ? { id: client.id, name, website, description, logo_url: logoUrl }
        : { name, website, description, logo_url: logoUrl };

      const res = await fetch('/api/clients', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Error al guardar');
      onSuccess();
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              placeholder="Nombre de la empresa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              placeholder="https://ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              rows={2}
              placeholder="Breve descripción..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
            {logoUrl ? (
              <div className="relative inline-block">
                <img src={logoUrl} alt="Logo" className="h-20 object-contain" />
                <button
                  onClick={() => setLogoUrl('')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                {uploading ? (
                  <FaSpinner className="animate-spin text-xl text-gray-400 mx-auto" />
                ) : (
                  <>
                    <FaUpload className="text-2xl text-gray-400 mx-auto mb-1" />
                    <span className="text-sm text-gray-500">Subir logo</span>
                  </>
                )}
              </label>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 font-medium px-4 py-2">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <FaSpinner className="animate-spin w-4 h-4" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
