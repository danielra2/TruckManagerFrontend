import React, { useState } from 'react';
import api from '../api/axiosClient';
import { X, Save } from 'lucide-react';

export default function EditTachoModal({ item, onClose, onUpdated }) {
  const [form, setForm] = useState({
    licensePlate: item.licensePlate || '',
    driverName: item.driverName || '',
    lastDownloadDate: item.lastDownloadDate || '',
    nextDownloadDate: item.nextDownloadDate || '',
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
      await api.put(`/tacho-downloads/${item.id}`, form);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Eroare la actualizare.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#fde68a' }}>Editează Tahograf ({item.licensePlate})</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c4b5a5', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Număr Înmatriculare</label>
            <input
              value={form.licensePlate}
              onChange={(e) => setForm({ ...form, licensePlate: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Nume Șofer</label>
            <input
              value={form.driverName}
              onChange={(e) => setForm({ ...form, driverName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Data Descărcare</label>
            <input
              type="date"
              value={form.lastDownloadDate}
              onChange={(e) => handleLastDateChange(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Următoarea Descărcare</label>
            <input
              type="date"
              value={form.nextDownloadDate}
              onChange={(e) => setForm({ ...form, nextDownloadDate: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.2rem' }} disabled={loading}>
            <Save size={18} /> {loading ? 'Se actualizează...' : 'Salvează Modificările'}
          </button>
        </form>
      </div>
    </div>
  );
}