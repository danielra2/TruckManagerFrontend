import React, { useState } from 'react';
import api from '../api/axiosClient';
import { X, Plus, CalendarPlus } from 'lucide-react';

export default function AddTruckModal({ onClose, onTruckAdded }) {
  const [form, setForm] = useState({
    licensePlate: '',
    make: '',
    model: '',
    vgpExpiryDate: '',
    itvExpiryDate: '',
    limitVExpiryDate: '',
    tGrafoExpiryDate: '',
    seguroExpiryDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const quickSetDate = (field, months) => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    const formatted = d.toISOString().split('T')[0];
    setForm((prev) => ({ ...prev, [field]: formatted }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/trucks', form);
      onTruckAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la adăugarea camionului.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#fde68a' }}>Adaugă Camion Nou</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c4b5a5', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Număr Înmatriculare</label>
            <input
              name="licensePlate"
              placeholder="ex: CC 617 PX"
              value={form.licensePlate}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Marcă</label>
              <input name="make" placeholder="ex: IVECO" value={form.make} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input name="model" placeholder="ex: DAILY 55S17W" value={form.model} onChange={handleChange} required />
            </div>
          </div>

          {/* VGP (6 Luni) */}
          <div className="form-group">
            <label>VGP - Grua (la 6 luni)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="date"
                name="vgpExpiryDate"
                value={form.vgpExpiryDate}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{ background: '#382c25', color: '#f59e0b', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => quickSetDate('vgpExpiryDate', 6)}
              >
                <CalendarPlus size={14} /> +6 Luni
              </button>
            </div>
          </div>

          {/* ITV (12 Luni) */}
          <div className="form-group">
            <label>ITV - Inspecție Tehnică (la 12 luni)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="date"
                name="itvExpiryDate"
                value={form.itvExpiryDate}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{ background: '#382c25', color: '#f59e0b', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => quickSetDate('itvExpiryDate', 12)}
              >
                <CalendarPlus size={14} /> +12 Luni
              </button>
            </div>
          </div>

          {/* LIMIT V (12 Luni) */}
          <div className="form-group">
            <label>LIMIT V - Limitator Viteză (la 12 luni)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="date"
                name="limitVExpiryDate"
                value={form.limitVExpiryDate}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{ background: '#382c25', color: '#f59e0b', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => quickSetDate('limitVExpiryDate', 12)}
              >
                <CalendarPlus size={14} /> +12 Luni
              </button>
            </div>
          </div>

          {/* T GRAFO (24 Luni) */}
          <div className="form-group">
            <label>T GRAFO - Tahograf (la 24 luni)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="date"
                name="tGrafoExpiryDate"
                value={form.tGrafoExpiryDate}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{ background: '#382c25', color: '#f59e0b', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => quickSetDate('tGrafoExpiryDate', 24)}
              >
                <CalendarPlus size={14} /> +24 Luni
              </button>
            </div>
          </div>

          {/* SEGURO (12 Luni) */}
          <div className="form-group">
            <label>SEGURO - Asigurare (la 12 luni)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="date"
                name="seguroExpiryDate"
                value={form.seguroExpiryDate}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{ background: '#382c25', color: '#f59e0b', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => quickSetDate('seguroExpiryDate', 12)}
              >
                <CalendarPlus size={14} /> +12 Luni
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.2rem' }}
            disabled={loading}
          >
            <Plus size={18} /> {loading ? 'Se salvează...' : 'Adaugă Camion'}
          </button>
        </form>
      </div>
    </div>
  );
}