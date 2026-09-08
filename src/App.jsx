import React, { useEffect, useState } from 'react';
import api from './api/axiosClient';
import LoginModal from './components/LoginModal';
import AddTruckModal from './components/AddTruckModal';
import EditTruckModal from './components/EditTruckModal';
import TruckCard from './components/TruckCard';
import AddTachoModal from './components/AddTachoModal';
import EditTachoModal from './components/EditTachoModal';
import { 
  Plus, LogOut, Truck as TruckIcon, Shield, FileText, Cpu, Gauge, Anchor, 
  Edit3, Trash2
} from 'lucide-react';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' sau 'tacho'
  
  // State Camioane
  const [trucks, setTrucks] = useState([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);

  // State Tacógrafo 28 Días
  const [tachoList, setTachoList] = useState([]);
  const [tachoSearch, setTachoSearch] = useState('');
  const [isAddTachoOpen, setIsAddTachoOpen] = useState(false);
  const [editingTacho, setEditingTacho] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('tm_token');
    if (token) {
      setIsAuthenticated(true);
      fetchTrucks();
      fetchTachoDownloads();
    }
  }, [isAuthenticated]);

  const fetchTrucks = async () => {
    try {
      const res = await api.get('/trucks');
      setTrucks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTachoDownloads = async () => {
    try {
      const res = await api.get('/tacho-downloads');
      setTachoList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTruck = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este camión?')) {
      try {
        await api.delete(`/trucks/${id}`);
        fetchTrucks();
      } catch (err) {
        alert('Error al eliminar.');
      }
    }
  };

  const handleDeleteTacho = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este registro de tacógrafo?')) {
      try {
        await api.delete(`/tacho-downloads/${id}`);
        fetchTachoDownloads();
      } catch (err) {
        alert('Error al eliminar.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tm_token');
    setIsAuthenticated(false);
  };

  // Filtrare Camioane
  const filteredTrucks = trucks.filter((t) =>
    t.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
    t.make.toLowerCase().includes(search.toLowerCase()) ||
    t.model.toLowerCase().includes(search.toLowerCase())
  );

  // Filtrare Tacógrafo
  const filteredTacho = tachoList.filter((t) =>
    t.licensePlate.toLowerCase().includes(tachoSearch.toLowerCase()) ||
    (t.driverName && t.driverName.toLowerCase().includes(tachoSearch.toLowerCase()))
  );

  // Statistici Camioane
  const getStats = (field) => ({
    valid: trucks.filter((t) => t[field]?.status === 'VALID').length,
    expiring: trucks.filter((t) => t[field]?.status === 'EXPIRING_SOON').length,
    expired: trucks.filter((t) => t[field]?.status === 'EXPIRED').length,
  });

  const vgpStats = getStats('vgp');
  const itvStats = getStats('itv');
  const limitVStats = getStats('limitV');
  const tGrafoStats = getStats('tGrafo');
  const seguroStats = getStats('seguro');

  // Statistici Tacógrafo 28d
  const tachoValid = tachoList.filter((t) => t.status === 'VALID').length;
  const tachoExpiring = tachoList.filter((t) => t.status === 'EXPIRING_SOON').length;
  const tachoExpired = tachoList.filter((t) => t.status === 'EXPIRED').length;

  if (!isAuthenticated) {
    return <LoginModal onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container">
      {/* Header cu Navigație Tab-uri */}
      <header className="navbar">
        <div className="nav-brand">
          <div className="nav-brand-icon">
            <TruckIcon size={24} color="#f59e0b" />
          </div>
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 'fleet' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('fleet')}
            >
              Documentos Flota ({trucks.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'tacho' ? 'tab-btn-active' : ''}`}
              onClick={() => setActiveTab('tacho')}
            >
              Tacógrafo 28 Días ({tachoList.length})
            </button>
          </div>
        </div>

        <div className="nav-actions">
          {activeTab === 'fleet' ? (
            <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
              <Plus size={18} /> Añadir Camión
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setIsAddTachoOpen(true)}>
              <Plus size={18} /> Registrar Tacógrafo
            </button>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={17} /> Salir
          </button>
        </div>
      </header>

      {/* TAB 1: DOCUMENTOS FLOTA */}
      {activeTab === 'fleet' && (
        <>
          <section className="stats-container">
            <div className="category-card">
              <div className="category-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Anchor size={16} color="#f59e0b" /> VGP (6M)
                </span>
              </div>
              <div className="category-stats-row">
                <div className="sub-stat"><span className="sub-stat-label color-valid">OK</span><span className="sub-stat-value color-valid">{vgpStats.valid}</span></div>
                <div className="sub-stat"><span className="sub-stat-label color-warning">Próx</span><span className="sub-stat-value color-warning">{vgpStats.expiring}</span></div>
                <div className="sub-stat"><span className="sub-stat-label color-danger">Venc</span><span className="sub-stat-value color-danger">{vgpStats.expired}</span></div>
              </div>
            </div>

            <div className="category-card">
              <div className="category-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={16} color="#f59e0b" /> ITV (12M)
                </span>
              </div>
              <div className="category-stats-row">
                <div className="sub-stat"><span className="sub-stat-label color-valid">OK</span><span className="sub-stat-value color-valid">{itvStats.valid}</span></div>
                <div className="sub-stat"><span className="sub-stat-label color-warning">Próx</span><span className="sub-stat-value color-warning">{itvStats.expiring}</span></div>
                <div className="sub-stat"><span className="sub-stat-label color-danger">Venc</span><span className="sub-stat-value color-danger">{itvStats.expired}</span></div>
              </div>
            </div>

            <div className="category-card">
              <div className="category-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Gauge size={16} color="#f59e0b" /> LIMIT V (12M)
                </span>
              </div>
              <div className="category-stats-row">
                <div className="sub-stat"><span className="sub-stat-label color-valid">OK</span><span className="sub-stat-value color-valid">{limitVStats.valid}</span></div>
                <div className="sub-stat"><span className="sub-stat-label color-warning">Próx</span><span className="sub-stat-value color-warning">{limitVStats.expiring}</span></div>
                <div className="sub-stat"><span className="sub-stat-label color-danger">Venc</span><span className="sub-stat-value color-danger">{limitVStats.expired}</span></div>
              </div>
            </div>

            <div className="category-card">
              <div className="category-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Cpu size={16} color="#f59e0b" /> TACÓGRAFO (24M)
                </span>
              </div>
              <div className="category-stats-row">
                <div className="sub-stat"><span className="sub-stat-label color-valid">OK</span><span className="sub-stat-value color-valid">{tGrafoStats.valid}</span></div>
                <div className="sub-stat"><span className="sub-stat-label color-warning">Próx</span><span className="sub-stat-value color-warning">{tGrafoStats.expiring}</span></div>
                <div className="sub-stat"><span className="sub-stat-label color-danger">Venc</span><span className="sub-stat-value color-danger">{tGrafoStats.expired}</span></div>
              </div>
            </div>

            <div className="category-card">
              <div className="category-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={16} color="#f59e0b" /> SEGURO (12M)
                </span>
              </div>
              <div className="category-stats-row">
                <div className="sub-stat"><span className="sub-stat-label color-valid">OK</span><span className="sub-stat-value color-valid">{seguroStats.valid}</span></div>
                <div className="sub-stat"><span className="sub-stat-label color-warning">Próx</span><span className="sub-stat-value color-warning">{seguroStats.expiring}</span></div>
                <div className="sub-stat"><span className="sub-stat-label color-danger">Venc</span><span className="sub-stat-value color-danger">{seguroStats.expired}</span></div>
              </div>
            </div>
          </section>

          <input
            type="text"
            className="search-bar"
            placeholder="Buscar por matrícula, marca o modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid">
            {filteredTrucks.map((truck) => (
              <TruckCard
                key={truck.id}
                truck={truck}
                onEdit={(trk) => setEditingTruck(trk)}
                onDelete={handleDeleteTruck}
              />
            ))}
          </div>

          {filteredTrucks.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#9e8a78' }}>
              No se encontró ningún camión.
            </div>
          )}
        </>
      )}

      {/* TAB 2: TACÓGRAFO 28 DÍAS */}
      {activeTab === 'tacho' && (
        <>
          <section className="tacho-summary-grid">
            <div className="stat-box stat-box-ok">
              <span className="stat-box-title">En regla (&gt; 7 días)</span>
              <span className="stat-box-num">{tachoValid}</span>
            </div>
            <div className="stat-box stat-box-warn">
              <span className="stat-box-title">Atención (4 - 7 días)</span>
              <span className="stat-box-num">{tachoExpiring}</span>
            </div>
            <div className="stat-box stat-box-danger">
              <span className="stat-box-title">Urgente / Vencido (&le; 3 días)</span>
              <span className="stat-box-num">{tachoExpired}</span>
            </div>
          </section>

          <input
            type="text"
            className="search-bar"
            placeholder="Buscar por matrícula o conductor..."
            value={tachoSearch}
            onChange={(e) => setTachoSearch(e.target.value)}
          />

          <div className="tacho-table-wrapper">
            <table className="tacho-table">
              <thead>
                <tr>
                  <th>MATRÍCULA</th>
                  <th>CONDUCTOR</th>
                  <th>FECHA DESCARGA</th>
                  <th>PRÓXIMA DESCARGA</th>
                  <th>ESTADO</th>
                  <th style={{ textAlign: 'right' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {filteredTacho.map((row) => (
                  <tr key={row.id} className={`tacho-row status-${row.status}`}>
                    <td>
                      <span className="license-badge" style={{ fontSize: '1rem', padding: '0.2rem 0.5rem' }}>
                        {row.licensePlate}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, color: row.driverName ? '#fff8f0' : '#87776b' }}>
                      {row.driverName || '— Sin conductor asignado —'}
                    </td>
                    <td style={{ color: '#d6c5b3' }}>{row.lastDownloadDate}</td>
                    <td style={{ fontWeight: 700 }}>{row.nextDownloadDate}</td>
                    <td>
                      <span className={`badge badge-${row.status}`}>
                        {row.daysRemaining <= 0 ? `Vencido (${Math.abs(row.daysRemaining)}d)` : `${row.daysRemaining} días`}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          className="btn"
                          style={{ padding: '0.4rem', background: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b' }}
                          onClick={() => setEditingTacho(row)}
                          title="Editar"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.4rem' }}
                          onClick={() => handleDeleteTacho(row.id)}
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTacho.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: '#9e8a78' }}>
              No se encontró ningún registro de tacógrafo.
            </div>
          )}
        </>
      )}

      {/* Modale */}
      {isAddOpen && <AddTruckModal onClose={() => setIsAddOpen(false)} onTruckAdded={fetchTrucks} />}
      {editingTruck && (
        <EditTruckModal truck={editingTruck} onClose={() => setEditingTruck(null)} onTruckUpdated={fetchTrucks} />
      )}
      {isAddTachoOpen && <AddTachoModal onClose={() => setIsAddTachoOpen(false)} onAdded={fetchTachoDownloads} />}
      {editingTacho && (
        <EditTachoModal item={editingTacho} onClose={() => setEditingTacho(null)} onUpdated={fetchTachoDownloads} />
      )}
    </div>
  );
}