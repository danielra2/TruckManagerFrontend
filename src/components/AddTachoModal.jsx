import React, { useState } from 'react';
import api from '../api/axiosClient';
import { X, Plus, Calendar } from 'lucide-react';

export default function AddTachoModal({ onClose, onAdded }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const next28Str = new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    licensePlate: '',
    driverName: '',
    lastDownloadDate: todayStr,
    nextDownloadDate: next28Str,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLastDateChange = (val) => {
    const d = new Date(val);
    d.setDate(d.getDate() + 28);
    setForm({
      ...form,
      lastDownloadDate: val,
      nextDownloadDate: d.toISOString().split('T')[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/tacho-downloads', form);
      onAdded();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la adăugare.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#fde68a' }}>Adaugă Tahograf 28 Zile</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c4b5a5', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Număr Înmatriculare (Matrícula)</label>
            <input
              name="licensePlate"
              placeholder="ex: GG 320 HL"
              value={form.licensePlate}
              onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Nume Șofer (Chofer)</label>
            <input
              name="driverName"
              placeholder="ex: FLORIN RUS"
              value={form.driverName}
              onChange={(e) => setForm({ ...form, driverName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Data Ultimei Descărcări (Fecha Descarga)</label>
            <input
              type="date"
              value={form.lastDownloadDate}
              onChange={(e) => handleLastDateChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Data Următoarei Descărcări (Automat +28 zile)</label>
            <input
              type="date"
              value={form.nextDownloadDate}
              onChange={(e) => setForm({ ...form, nextDownloadDate: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.2rem' }} disabled={loading}>
            <Plus size={18} /> {loading ? 'Se salvează...' : 'Adaugă Înregistrare'}
          </button>
        </form>
      </div>
    </div>
  );
}