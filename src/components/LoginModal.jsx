import React, { useState } from 'react';
import api from '../api/axiosClient';
import { Lock } from 'lucide-react';

export default function LoginModal({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { password });
      localStorage.setItem('tm_token', res.data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Parolă incorectă');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center', maxWidth: '380px' }}>
        <div style={{
          display: 'inline-flex',
          padding: '1rem',
          background: 'var(--bg-inner)',
          borderRadius: '50%',
          marginBottom: '1rem',
          border: '1px solid var(--border)'
        }}>
          <Lock size={28} color="#c48b52" />
        </div>
        <h2 style={{ marginBottom: '0.4rem', color: '#edd8c4' }}>Autentificare</h2>
        <p style={{ color: '#c4b5a5', fontSize: '0.88rem', marginBottom: '1.4rem' }}>
          Introdu parola de acces pentru a gestiona flota.
        </p>

        {error && <div style={{ color: '#e06c53', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              placeholder="Parola de acces..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={loading}>
            {loading ? 'Se verifică...' : 'Deblochează'}
          </button>
        </form>
      </div>
    </div>
  );
}