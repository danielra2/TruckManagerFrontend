import React, { useState } from 'react';
import api from '../api/axiosClient';
import { X } from 'lucide-react';

export default function AddTruckModal({ onClose, onTruckAdded }) {
  const [form, setForm] = useState({
    licensePlate: '',
    make: '',
    model: '',
    itpExpiryDate: '',
    insuranceExpiryDate: '',
    tachoExpiryDate: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      setError(err.response?.data?.message || 'Eroare la salvare.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2>Adaugă Camion Nou</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Număr Înmatriculare</label>
            <input name="licensePlate" placeholder="ex: SB 12 ABC" value={form.licensePlate} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Marcă</label>
              <input name="make" placeholder="ex: MAN, Volvo" value={form.make} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input name="model" placeholder="ex: TGX, FH500" value={form.model} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Expirare ITP</label>
            <input type="date" name="itpExpiryDate" value={form.itpExpiryDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Expirare Asigurare (RCA)</label>
            <input type="date" name="insuranceExpiryDate" value={form.insuranceExpiryDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Expirare Card Tahograf</label>
            <input type="date" name="tachoExpiryDate" value={form.tachoExpiryDate} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Se salvează...' : 'Salvează Camion'}
          </button>
        </form>
      </div>
    </div>
  );
}