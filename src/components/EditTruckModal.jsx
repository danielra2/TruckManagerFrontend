import React, { useState } from 'react';
import api from '../api/axiosClient';
import { X, Save, CalendarPlus } from 'lucide-react';

export default function EditTruckModal({ truck, onClose, onTruckUpdated }) {
  const addMonths = (dateStr, months) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1 + months, 1);
    const maxDays = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
    const day = Math.min(d, maxDays);
    const result = new Date(targetDate.getFullYear(), targetDate.getMonth(), day);
    const resYear = result.getFullYear();
    const resMonth = String(result.getMonth() + 1).padStart(2, '0');
    const resDay = String(result.getDate()).padStart(2, '0');
    return `${resYear}-${resMonth}-${resDay}`;
  };

  // Reconstituie data inițială de realizare scăzând durata de valabilitate din data de expirare existentă
  const getInitialCreation = (expiryDate, months) => {
    if (!expiryDate) return '';
    return addMonths(expiryDate, -months);
  };

  const [form, setForm] = useState({
    licensePlate: truck.licensePlate || '',
    make: truck.make || '',
    model: truck.model || '',
    vgpCreationDate: getInitialCreation(truck.vgpExpiryDate || truck.vgp?.expiryDate, 6),
    itvCreationDate: getInitialCreation(truck.itvExpiryDate || truck.itv?.expiryDate, 12),
    limitVCreationDate: getInitialCreation(truck.limitVExpiryDate || truck.limitV?.expiryDate, 12),
    tGrafoCreationDate: getInitialCreation(truck.tGrafoExpiryDate || truck.tGrafo?.expiryDate, 24),
    seguroCreationDate: getInitialCreation(truck.seguroExpiryDate || truck.seguro?.expiryDate, 12),
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const setToday = (field) => {
    const today = new Date().toISOString().split('T')[0];
    setForm((prev) => ({ ...prev, [field]: today }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      licensePlate: form.licensePlate,
      make: form.make,
      model: form.model,
      vgpExpiryDate: addMonths(form.vgpCreationDate, 6) || null,
      itvExpiryDate: addMonths(form.itvCreationDate, 12) || null,
      limitVExpiryDate: addMonths(form.limitVCreationDate, 12) || null,
      tGrafoExpiryDate: addMonths(form.tGrafoCreationDate, 24) || null,
      seguroExpiryDate: addMonths(form.seguroCreationDate, 12) || null,
    };

    try {
      await api.put(`/trucks/${truck.id}`, payload);
      onTruckUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el camión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ color: '#fde68a', fontSize: '1.3rem' }}>Editar Camión ({truck.licensePlate})</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#c4b5a5', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.88rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Matrícula</label>
            <input
              name="licensePlate"
              value={form.licensePlate}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label>Marca</label>
              <input name="make" value={form.make} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Modelo</label>
              <input name="model" value={form.model} onChange={handleChange} required />
            </div>
          </div>

          {/* VGP (6 Meses) */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>VGP - Grúa (Validez: 6 meses)</label>
              {form.vgpCreationDate && (
                <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                  Vence: {addMonths(form.vgpCreationDate, 6)}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="date"
                name="vgpCreationDate"
                value={form.vgpCreationDate}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{ background: '#382c25', color: '#f59e0b', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setToday('vgpCreationDate')}
              >
                <CalendarPlus size={14} /> Hoy
              </button>
            </div>
          </div>

          {/* ITV (12 Meses) */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>ITV - Inspección Técnica (Validez: 12 meses)</label>
              {form.itvCreationDate && (
                <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                  Vence: {addMonths(form.itvCreationDate, 12)}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="date"
                name="itvCreationDate"
                value={form.itvCreationDate}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{ background: '#382c25', color: '#f59e0b', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setToday('itvCreationDate')}
              >
                <CalendarPlus size={14} /> Hoy
              </button>
            </div>
          </div>

          {/* LIMIT V (12 Meses) */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>LIMIT V - Limitador de Velocidad (Validez: 12 meses)</label>
              {form.limitVCreationDate && (
                <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                  Vence: {addMonths(form.limitVCreationDate, 12)}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="date"
                name="limitVCreationDate"
                value={form.limitVCreationDate}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{ background: '#382c25', color: '#f59e0b', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setToday('limitVCreationDate')}
              >
                <CalendarPlus size={14} /> Hoy
              </button>
            </div>
          </div>

          {/* TACÓGRAFO (24 Meses) */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>TACÓGRAFO - Revisión (Validez: 24 meses)</label>
              {form.tGrafoCreationDate && (
                <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                  Vence: {addMonths(form.tGrafoCreationDate, 24)}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="date"
                name="tGrafoCreationDate"
                value={form.tGrafoCreationDate}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{ background: '#382c25', color: '#f59e0b', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setToday('tGrafoCreationDate')}
              >
                <CalendarPlus size={14} /> Hoy
              </button>
            </div>
          </div>

          {/* SEGURO (12 Meses) */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>SEGURO - Póliza (Validez: 12 meses)</label>
              {form.seguroCreationDate && (
                <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                  Vence: {addMonths(form.seguroCreationDate, 12)}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="date"
                name="seguroCreationDate"
                value={form.seguroCreationDate}
                onChange={handleChange}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn"
                style={{ background: '#382c25', color: '#f59e0b', padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
                onClick={() => setToday('seguroCreationDate')}
              >
                <CalendarPlus size={14} /> Hoy
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1.2rem' }}
            disabled={loading}
          >
            <Save size={18} /> {loading ? 'Actualizando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}