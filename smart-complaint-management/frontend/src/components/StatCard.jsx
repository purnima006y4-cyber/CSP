import React from 'react';

export default function StatCard({ type = 'total', icon = 'bi-inbox', value = 0, label = '' }) {
  const typeClass = `stat-${type}`;

  return (
    <div className={`stat-card ${typeClass}`}>
      <div className="stat-card-icon">
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <div className="stat-card-val">{value}</div>
        <div className="stat-card-lbl">{label}</div>
      </div>
    </div>
  );
}
