import React from 'react';
import StatusBadge from './StatusBadge';

export default function Timeline({ updates = [] }) {
  if (!updates || updates.length === 0) {
    return <div className="text-muted small">No progress timeline entries recorded yet.</div>;
  }

  const getDotClass = (status) => {
    switch (status) {
      case 'Resolved':
        return 'dot-resolved';
      case 'In Progress':
        return 'dot-progress';
      case 'Pending':
        return 'dot-pending';
      default:
        return '';
    }
  };

  return (
    <div className="timeline-container">
      {updates.map((item, index) => (
        <div key={item._id || index} className="timeline-item">
          <div className={`timeline-dot ${getDotClass(item.status)}`}></div>
          <div className="timeline-card">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="d-flex align-items-center gap-2">
                <StatusBadge status={item.status} />
                <span className="small text-muted">
                  by <strong className="text-dark">{item.updatedBy}</strong>
                </span>
              </div>
              <span className="small text-muted">
                {new Date(item.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className="mb-0 small text-secondary" style={{ whiteSpace: 'pre-line' }}>
              {item.remarks}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
