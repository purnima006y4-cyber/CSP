import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Breadcrumb, Card } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Timeline from '../../components/Timeline';

export default function TrackComplaint() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cidInput, setCidInput] = useState(searchParams.get('cid') || '');
  const [complaint, setComplaint] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTracking = async (cid) => {
    if (!cid.trim()) return;
    setError('');
    setComplaint(null);
    setUpdates([]);
    setLoading(true);

    try {
      const res = await api.get(`/complaints/track/${encodeURIComponent(cid.trim())}`);
      if (res.success && res.data) {
        setComplaint(res.data.complaint);
        setUpdates(res.data.updates || []);
      }
    } catch (err) {
      setError(err.message || `No grievance found with Tracking ID: ${cid}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlCid = searchParams.get('cid');
    if (urlCid) {
      setCidInput(urlCid);
      fetchTracking(urlCid);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (cidInput.trim()) {
      setSearchParams({ cid: cidInput.trim() });
      fetchTracking(cidInput.trim());
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
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          {t('nav_home')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('nav_track')}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Search Box Header */}
      <Card className="shadow-sm border-0 rounded-4 p-4 mb-4 bg-white">
        <Row className="align-items-center g-3">
          <Col lg={6}>
            <div className="d-flex align-items-center gap-3">
              <div className="portal-emblem-icon" style={{ width: '50px', height: '50px', fontSize: '1.4rem' }}>
                <i className="bi bi-search"></i>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-1">{t('btn_track_cmp')}</h4>
                <p className="small text-secondary mb-0">Enter your official Complaint ID to view live status and Panchayat action timeline</p>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <Form onSubmit={handleSearch} className="d-flex gap-2">
              <Form.Control
                size="lg"
                type="text"
                placeholder="e.g. SCM-2026-0001"
                value={cidInput}
                onChange={(e) => setCidInput(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading} className="btn-portal-primary btn-lg px-4 text-nowrap">
                {loading ? 'Searching...' : <><i className="bi bi-search me-1"></i> {t('btn_track')}</>}
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="warning" className="py-3 rounded-4 shadow-sm mb-4">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill fs-4 text-warning"></i>
            <div>
              <h6 className="fw-bold mb-1">Grievance Not Found or Access Restricted</h6>
              <p className="small mb-0 text-secondary">{error}</p>
            </div>
          </div>
        </Alert>
      )}

      {/* Details & Progress Timeline Display */}
      {complaint && (
        <Row className="g-4">
          {/* Left: Grievance Details Card */}
          <Col lg={5}>
            <div className="portal-card p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 font-monospace fs-6">
                  {complaint.complaintId}
                </span>
                <StatusBadge status={complaint.status} />
              </div>

              <h4 className="fw-bold text-dark mb-2">{complaint.title}</h4>
              <div className="mb-3 d-flex gap-2 align-items-center">
                <span className="badge bg-light text-dark border">
                  <i className="bi bi-tag me-1"></i>
                  {complaint.category}
                </span>
                {getPriorityBadge(complaint.priority)}
              </div>

              <p className="text-secondary small mb-4 bg-light p-3 rounded-3" style={{ whiteSpace: 'pre-line' }}>
                {complaint.description}
              </p>

              <div className="d-flex flex-column gap-2 small text-secondary border-top pt-3 mb-4">
                <div>
                  <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                  <strong>Location:</strong> {complaint.location}, {complaint.village}
                </div>
                <div>
                  <i className="bi bi-calendar-check text-primary me-2"></i>
                  <strong>Submitted:</strong>{' '}
                  {new Date(complaint.complaintDate).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div>
                  <i className="bi bi-person-gear text-success me-2"></i>
                  <strong>Assigned Staff:</strong>{' '}
                  {complaint.assignedTo ? (
                    <span className="text-dark fw-semibold">{complaint.assignedTo}</span>
                  ) : (
                    <span className="text-muted">Awaiting Allocation</span>
                  )}
                </div>
                {complaint.resolvedDate && (
                  <div>
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <strong>Resolved On:</strong>{' '}
                    {new Date(complaint.resolvedDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                )}
              </div>

              {/* Photo Preview if uploaded */}
              {complaint.photo && (
                <div className="border-top pt-3">
                  <span className="fw-bold text-dark small d-block mb-2">
                    <i className="bi bi-image text-primary me-1"></i>Resident Submitted Photo Evidence:
                  </span>
                  <a href={`/uploads/${complaint.photo}`} target="_blank" rel="noreferrer" title="Click to view full size">
                    <img
                      src={`/uploads/${complaint.photo}`}
                      alt="Complaint Photo"
                      className="img-fluid rounded-3 border shadow-sm"
                      style={{ maxHeight: '220px', width: '100%', objectFit: 'cover' }}
                    />
                  </a>
                </div>
              )}
            </div>
          </Col>

          {/* Right: Progress Timeline */}
          <Col lg={7}>
            <div className="portal-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h5 className="fw-bold text-dark mb-0">
                  <i className="bi bi-clock-history text-primary me-2"></i>Redressal Progress Timeline
                </h5>
                <span className="small text-muted">{updates.length} Status Step(s) Recorded</span>
              </div>

              <Timeline updates={updates} />
            </div>
          </Col>
        </Row>
      )}

      {/* Idle Prompt */}
      {!complaint && !loading && !error && (
        <div className="text-center py-5">
          <div className="portal-emblem-icon mx-auto mb-3" style={{ width: '64px', height: '64px', fontSize: '1.8rem' }}>
            <i className="bi bi-search"></i>
          </div>
          <h5 className="fw-bold text-dark">Ready to Track Your Grievance</h5>
          <p className="text-secondary small mx-auto" style={{ maxWidth: '500px' }}>
            Please enter your Complaint Tracking Number above (for example <code>SCM-2026-0001</code>) to inspect live field actions, staff assignments, and remarks.
          </p>
        </div>
      )}
    </Container>
  );
}
