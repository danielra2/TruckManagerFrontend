import React from 'react';
import { Trash2, Edit3, Calendar } from 'lucide-react';

export default function TruckCard({ truck, onEdit, onDelete }) {
  const renderDoc = (title, doc) => {
    if (!doc || !doc.expiryDate) {
      return (
        <div className="doc-item">
          <span className="doc-name">{title}</span>
          <span className="badge" style={{ background: '#382c25', color: '#9e8a78' }}>Nesetat</span>
        </div>
      );
    }

    let daysText = `${doc.daysRemaining}z`;
    if (doc.daysRemaining < 0) {
      daysText = `Expirat (${Math.abs(doc.daysRemaining)}z)`;
    } else if (doc.daysRemaining === 0) {
      daysText = 'Expiră azi!';
    }

    return (
      <div className="doc-item">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <span className="doc-name">{title}</span>
          <span style={{ fontSize: '0.74rem', color: '#d6c5b3', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={12} color="#f59e0b" /> {doc.expiryDate}
          </span>
        </div>
        <span className={`badge badge-${doc.status}`}>{daysText}</span>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="license-badge">{truck.licensePlate}</div>
          <div className="model-title">{truck.make} {truck.model}</div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className="btn"
            style={{ padding: '0.45rem', background: 'rgba(245, 158, 11, 0.18)', color: '#f59e0b' }}
            onClick={() => onEdit(truck)}
            title="Editează"
          >
            <Edit3 size={15} />
          </button>
          <button
            className="btn btn-danger"
            style={{ padding: '0.45rem' }}
            onClick={() => onDelete(truck.id)}
            title="Șterge"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="doc-list">
        {renderDoc('VGP (Grua)', truck.vgp)}
        {renderDoc('ITV', truck.itv)}
        {renderDoc('LIMIT V', truck.limitV)}
        {renderDoc('T GRAFO', truck.tGrafo)}
        {renderDoc('SEGURO', truck.seguro)}
      </div>
    </div>
  );
}