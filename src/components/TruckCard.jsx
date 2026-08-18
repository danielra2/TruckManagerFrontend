import React from 'react';
import { Trash2 } from 'lucide-react';

export default function TruckCard({ truck, onDelete }) {
  const renderDoc = (title, doc) => {
    let text = `${doc.daysRemaining} zile`;
    if (doc.daysRemaining < 0) {
      text = `Expirat de ${Math.abs(doc.daysRemaining)} zile`;
    } else if (doc.daysRemaining === 0) {
      text = 'Expiră azi!';
    }

    return (
      <div className="doc-item">
        <span className="doc-name">{title}</span>
        <span className={`badge badge-${doc.status}`}>{text}</span>
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
        <button className="btn btn-danger" style={{ padding: '0.4rem' }} onClick={() => onDelete(truck.id)}>
          <Trash2 size={16} />
        </button>
      </div>

      <div className="doc-list">
        {renderDoc('ITP', truck.itp)}
        {renderDoc('Asigurare', truck.insurance)}
        {renderDoc('Tahograf', truck.tacho)}
      </div>
    </div>
  );
}