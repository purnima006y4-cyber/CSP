import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

export default function UserDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [metrics, setMetrics] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [complaintsRes, notifRes] = await Promise.all([
          api.get('/complaints/my?limit=5'),
          api.get('/notifications')
        ]);

        if (complaintsRes.success) {
          const all = complaintsRes.data;
          setRecentComplaints(all);

          // Calculate counts
          const total = complaintsRes.total;
          let pending = 0;
          let inProgress = 0;
          let resolved = 0;

          // Fetch all for accurate metric counts
          const fullRes = await api.get('/complaints/my?limit=100');
          if (fullRes.success) {
            fullRes.data.forEach((c) => {
              if (c.status === 'Pending') pending++;
              if (c.status === 'In Progress') inProgress++;
              if (c.status === 'Resolved') resolved++;
            });
          }

          setMetrics({ total, pending, inProgress, resolved });
        }

        if (notifRes.success) {
          setNotifications(notifRes.data);
        }
      } catch (e) {
        console.error('[Dashboard fetch error]', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const getPriorityBadge = (priority) => {
    const badgeClass =
      priority === 'High'
        ? 'bg-danger-subtle text-danger border border-danger-subtle'
        : priority === 'Medium'
        ? 'bg-warning-subtle text-dark border border-warning-subtle'
        : 'bg-info-subtle text-info-emphasis border border-info-subtle';
    return <span className={`badge ${badgeClass} px-2 py-1 rounded`}>{priority} Priority</span>;
  };

  return (
    <Container className="py-4">
      {/* Welcome Banner */}
      <div className="portal-card p-4 mb-4 bg-white border-0 shadow-sm rounded-4">
        <Row className="align-items-center g-3">
          <Col lg={8}>
            <div className="d-flex align-items-center gap-3">
              <div className="portal-emblem-icon" style={{ width: '52px', height: '52px', fontSize: '1.5rem' }}>
                <i className="bi bi-person-check"></i>
              </div>
              <div>
                <h3 className="fw-bold text-dark mb-1">
                  {t('dash_welcome')}, {user?.fullName}!
                </h3>
                <p className="text-secondary small mb-0">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {user?.village} ({user?.wardNumber || 'Ward 1'}) • Citizen Portal
                </p>
              </div>
            </div>
          </Col>
          <Col lg={4} className="text-lg-end">
            <div className="d-flex gap-2 justify-content-lg-end">
              <Link to="/complaints/new" className="btn btn-portal-success">
                <i className="bi bi-plus-circle me-1"></i> {t('nav_register_cmp')}
              </Link>
              <Link to="/track" className="btn btn-outline-primary">
                <i className="bi bi-search me-1"></i> {t('nav_track')}
              </Link>
            </div>
          </Col>
        </Row>
      </div>

      {/* 4 Metric Cards */}
      <Row className="g-3 mb-4">
        <Col xl={3} sm={6}>
          <StatCard type="total" icon="bi-folder2-open" value={metrics.total} label={t('dash_total')} />
        </Col>
        <Col xl={3} sm={6}>
          <StatCard type="pending" icon="bi-clock-history" value={metrics.pending} label={t('dash_pending')} />
        </Col>
        <Col xl={3} sm={6}>
          <StatCard type="progress" icon="bi-gear-wide-connected" value={metrics.inProgress} label={t('dash_in_progress')} />
        </Col>
        <Col xl={3} sm={6}>
          <StatCard type="resolved" icon="bi-check-circle-fill" value={metrics.resolved} label={t('dash_resolved')} />
        </Col>
      </Row>

      <Row className="g-4">
        {/* Main: Recent Complaints */}
        <Col lg={8}>
          <div className="portal-card h-100">
            <div className="portal-card-header d-flex justify-content-between align-items-center">
              <span className="fs-6 fw-bold">
                <i className="bi bi-card-checklist text-primary me-2"></i>
                {t('dash_recent_title')}
              </span>
              <Link to="/my-complaints" className="small fw-semibold text-decoration-none">
                {t('view_all')} <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="card-body p-0">
              {recentComplaints.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                  <p className="text-secondary mb-3">{t('no_complaints_yet')}</p>
                  <Link to="/complaints/new" className="btn btn-sm btn-portal-primary">
                    <i className="bi bi-plus-circle me-1"></i> {t('btn_lodge_cmp')}
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="table-light small text-secondary">
                      <tr>
                        <th className="ps-3">Complaint ID</th>
                        <th>Title & Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th className="text-end pe-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentComplaints.map((c) => (
                        <tr key={c._id}>
                          <td className="ps-3">
                            <Link to={`/track?cid=${c.complaintId}`} className="fw-bold text-decoration-none text-primary">
                              {c.complaintId}
                            </Link>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '220px' }}>
                              {c.title}
                            </div>
                            <span className="badge bg-light text-secondary border small">
                              {c.category}
                            </span>
                          </td>
                          <td>{getPriorityBadge(c.priority)}</td>
                          <td><StatusBadge status={c.status} /></td>
                          <td className="small text-secondary">
                            {new Date(c.complaintDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="text-end pe-3">
                            <Link to={`/track?cid=${c.complaintId}`} className="btn btn-sm btn-outline-primary" title="View Timeline">
                              <i className="bi bi-eye"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </Col>

        {/* Right Side: Notifications */}
        <Col lg={4}>
          <div className="portal-card h-100">
            <div className="portal-card-header d-flex justify-content-between align-items-center">
              <span className="fs-6 fw-bold">
                <i className="bi bi-bell-fill text-warning me-2"></i>
                {t('dash_notifications')}
              </span>
              {notifications.length > 0 && (
                <button onClick={markAllRead} className="btn btn-link btn-sm text-decoration-none p-0 text-muted small">
                  Mark all read
                </button>
              )}
            </div>
            <div className="card-body p-3">
              {notifications.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  <i className="bi bi-check-all fs-2 d-block text-secondary mb-1"></i>
                  No new status notifications at this time.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n._id}
                      className={`p-2 rounded border small ${n.isRead ? 'bg-light' : 'bg-primary-subtle border-primary-subtle'}`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        {n.complaint ? (
                          <Link to={`/track?cid=${n.complaint.complaintId}`} className="fw-bold text-decoration-none text-dark">
                            {n.complaint.complaintId}
                          </Link>
                        ) : (
                          <span className="fw-bold">Status Update</span>
                        )}
                        <span className="text-muted" style={{ fontSize: '0.725rem' }}>
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mb-0 text-secondary">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
