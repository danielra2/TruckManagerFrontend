import React, { useEffect, useState } from 'react';
import api from './api/axiosClient';
import LoginModal from './components/LoginModal';
import AddTruckModal from './components/AddTruckModal';
import EditTruckModal from './components/EditTruckModal';
import TruckCard from './components/TruckCard';
import { Plus, LogOut, Truck as TruckIcon, Shield, FileText, Cpu } from 'lucide-react';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('tm_token');
    if (token) {
      setIsAuthenticated(true);
      fetchTrucks();
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

  const handleDelete = async (id) => {
    if (window.confirm('Sigur dorești să ștergi acest camion?')) {
      try {
        await api.delete(`/trucks/${id}`);
        fetchTrucks();
      } catch (err) {
        alert('Eroare la ștergere.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tm_token');
    setIsAuthenticated(false);
  };

  const filteredTrucks = trucks.filter((t) =>
    t.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
    t.make.toLowerCase().includes(search.toLowerCase()) ||
    t.model.toLowerCase().includes(search.toLowerCase())
  );

  const getStats = (field) => {
    return {
      valid: trucks.filter((t) => t[field]?.status === 'VALID').length,
      expiring: trucks.filter((t) => t[field]?.status === 'EXPIRING_SOON').length,
      expired: trucks.filter((t) => t[field]?.status === 'EXPIRED').length,
    };
  };

  const itpStats = getStats('itp');
  const rcaStats = getStats('insurance');
  const tachoStats = getStats('tacho');

  if (!isAuthenticated) {
    return <LoginModal onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container">
      {/* Header cu butoane responsive */}
      <header className="navbar">
        <div className="nav-brand">
          <div className="nav-brand-icon">
            <TruckIcon size={24} color="#c48b52" />
          </div>
          <span className="nav-brand-text" style={{ fontSize: '0.9rem', color: '#c4b5a5', fontWeight: 600 }}>
            {trucks.length} {trucks.length === 1 ? 'camion' : 'camioane'}
          </span>
        </div>
        <div className="nav-actions">
          <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
            <Plus size={18} /> Adaugă Camion
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={17} /> Ieșire
          </button>
        </div>
      </header>

      {/* Statistici pe categorii cu accente Caramel & Bej */}
      <section className="stats-container">
        <div className="category-card">
          <div className="category-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={18} color="#c48b52" /> ITP
            </span>
          </div>
          <div className="category-stats-row">
            <div className="sub-stat">
              <span className="sub-stat-label color-valid">În regulă</span>
              <span className="sub-stat-value color-valid">{itpStats.valid}</span>
            </div>
            <div className="sub-stat">
              <span className="sub-stat-label color-warning">Curând</span>
              <span className="sub-stat-value color-warning">{itpStats.expiring}</span>
            </div>
            <div className="sub-stat">
              <span className="sub-stat-label color-danger">Expirate</span>
              <span className="sub-stat-value color-danger">{itpStats.expired}</span>
            </div>
          </div>
        </div>

        <div className="category-card">
          <div className="category-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} color="#c48b52" /> RCA
            </span>
          </div>
          <div className="category-stats-row">
            <div className="sub-stat">
              <span className="sub-stat-label color-valid">În regulă</span>
              <span className="sub-stat-value color-valid">{rcaStats.valid}</span>
            </div>
            <div className="sub-stat">
              <span className="sub-stat-label color-warning">Curând</span>
              <span className="sub-stat-value color-warning">{rcaStats.expiring}</span>
            </div>
            <div className="sub-stat">
              <span className="sub-stat-label color-danger">Expirate</span>
              <span className="sub-stat-value color-danger">{rcaStats.expired}</span>
            </div>
          </div>
        </div>

        <div className="category-card">
          <div className="category-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} color="#c48b52" /> Tahograf
            </span>
          </div>
          <div className="category-stats-row">
            <div className="sub-stat">
              <span className="sub-stat-label color-valid">În regulă</span>
              <span className="sub-stat-value color-valid">{tachoStats.valid}</span>
            </div>
            <div className="sub-stat">
              <span className="sub-stat-label color-warning">Curând</span>
              <span className="sub-stat-value color-warning">{tachoStats.expiring}</span>
            </div>
            <div className="sub-stat">
              <span className="sub-stat-label color-danger">Expirate</span>
              <span className="sub-stat-value color-danger">{tachoStats.expired}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Căutare */}
      <input
        type="text"
        className="search-bar"
        placeholder="Caută după număr, marcă sau model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Listă Camioane */}
      <div className="grid">
        {filteredTrucks.map((truck) => (
          <TruckCard
            key={truck.id}
            truck={truck}
            onEdit={(trk) => setEditingTruck(trk)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredTrucks.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#87776b', fontSize: '0.95rem' }}>
          Nu a fost găsit niciun camion.
        </div>
      )}

      {isAddOpen && (
        <AddTruckModal onClose={() => setIsAddOpen(false)} onTruckAdded={fetchTrucks} />
      )}

      {editingTruck && (
        <EditTruckModal
          truck={editingTruck}
          onClose={() => setEditingTruck(null)}
          onTruckUpdated={fetchTrucks}
        />
      )}
    </div>
  );
}