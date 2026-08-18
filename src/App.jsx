import React, { useEffect, useState } from 'react';
import api from './api/axiosClient';
import LoginModal from './components/LoginModal';
import AddTruckModal from './components/AddTruckModal';
import TruckCard from './components/TruckCard';
import { Plus, LogOut, Truck as TruckIcon } from 'lucide-react';
import './App.css';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

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

  if (!isAuthenticated) {
    return <LoginModal onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container">
      <header className="navbar">
        <div className="nav-brand">
          <TruckIcon size={28} color="#3b82f6" />
          <span>TruckManager</span>
        </div>
        <div className="nav-actions">
          <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
            <Plus size={18} /> Adaugă Camion
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            <LogOut size={18} /> Ieșire
          </button>
        </div>
      </header>

      <input
        type="text"
        className="search-bar"
        placeholder="Caută după număr înmatriculare, marcă sau model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid">
        {filteredTrucks.map((truck) => (
          <TruckCard key={truck.id} truck={truck} onDelete={handleDelete} />
        ))}
      </div>

      {filteredTrucks.length === 0 && (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#94a3b8' }}>
          Nu a fost găsit niciun camion.
        </div>
      )}

      {isAddOpen && (
        <AddTruckModal onClose={() => setIsAddOpen(false)} onTruckAdded={fetchTrucks} />
      )}
    </div>
  );
}