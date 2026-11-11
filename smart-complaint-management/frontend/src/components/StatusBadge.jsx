import React from 'react';
import { useTranslation } from 'react-i18next';

export default function StatusBadge({ status }) {
  const { t } = useTranslation();

  const config = {
    Pending: {
      className: 'bg-warning text-dark',
      icon: 'bi-clock-history',
      label: t('status_pending')
    },
    'In Progress': {
      className: 'bg-primary text-white',
      icon: 'bi-gear-wide-connected',
      label: t('status_in_progress')
    },
    Resolved: {
      className: 'bg-success text-white',
      icon: 'bi-check-circle-fill',
      label: t('status_resolved')
    },
    Rejected: {
      className: 'bg-danger text-white',
      icon: 'bi-x-circle-fill',
      label: t('status_rejected')
    }
  };

  const current = config[status] || {
    className: 'bg-secondary text-white',
    icon: 'bi-info-circle',
    label: status
  };

  return (
    <span className={`badge ${current.className} px-3 py-2 rounded-pill fw-medium`}>
      <i className={`bi ${current.icon} me-1`}></i>
      {current.label}
    </span>
  );
}
