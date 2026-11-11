import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Form, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState('');
  const [stats, setStats] = useState({
    totalComplaints: 6,
    resolvedComplaints: 2,
    totalResidents: 3,
    resolutionRate: 85
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/complaints/public-stats');
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (e) {
        // Fallback to initial defaults
      }
    };
    fetchStats();
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/track?cid=${encodeURIComponent(trackId.trim())}`);
    }
  };

  const categories = [
    { key: 'water', icon: 'bi-droplet-half', css: 'icon-water', param: 'Drinking Water' },
    { key: 'roads', icon: 'bi-signpost-2', css: 'icon-roads', param: 'Roads and Potholes' },
    { key: 'lights', icon: 'bi-lightbulb', css: 'icon-lights', param: 'Streetlights' },
    { key: 'drainage', icon: 'bi-water', css: 'icon-drainage', param: 'Drainage and Sanitation' },
    { key: 'garbage', icon: 'bi-trash3', css: 'icon-garbage', param: 'Garbage Collection' },
    { key: 'electricity', icon: 'bi-lightning-charge', css: 'icon-electricity', param: 'Electricity' }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="portal-hero">
        <Container className="position-relative">
          <Row className="align-items-center g-4">
            <Col lg={7}>
              <span className="hero-pill-badge mb-2">
                <i className="bi bi-shield-check me-1 text-warning"></i> {t('hero_badge')}
              </span>
              <h1 className="hero-title">{t('hero_title')}</h1>
              <p className="hero-desc">{t('hero_desc')}</p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/complaints/new" className="btn btn-portal-success btn-lg px-4 py-3 shadow">
                  <i className="bi bi-pencil-square me-2"></i>
                  {t('btn_lodge_cmp')}
                </Link>
                <Link to="/track" className="btn btn-outline-light btn-lg px-4 py-3">
                  <i className="bi bi-search me-2"></i>
                  {t('btn_track_cmp')}
                </Link>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block">
              <Card className="bg-white text-dark shadow-lg border-0 rounded-4 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="portal-emblem-icon" style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-geo-alt-fill text-warning"></i>
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold">{t('village_name')}</h5>
                    <span className="text-success small fw-semibold">
                      <i className="bi bi-dot"></i>Active Grama Sachivalayam Portal
                    </span>
                  </div>
                </div>
                <p className="small text-muted mb-3">
                  Residents can report drinking water leaks, streetlights, sanitation, road potholes, and agricultural power issues directly to Panchayat officers.
                </p>
                <div className="p-3 bg-light rounded-3 mb-3">
                  <div className="d-flex justify-content-between small text-secondary mb-1">
                    <span>Civic Resolution Rate</span>
                    <span className="fw-bold text-success">{stats.resolutionRate}%</span>
                  </div>
                  <ProgressBar now={stats.resolutionRate} variant="success" style={{ height: '8px' }} />
                </div>
                <Row className="g-2 text-center">
                  <Col xs={4}>
                    <div className="border rounded p-2">
                      <div className="fw-bold fs-5 text-primary">{stats.totalComplaints}</div>
                      <div className="text-muted" style={{ fontSize: '0.725rem' }}>Total Logged</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="border rounded p-2">
                      <div className="fw-bold fs-5 text-success">{stats.resolvedComplaints}</div>
                      <div className="text-muted" style={{ fontSize: '0.725rem' }}>Resolved</div>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="border rounded p-2">
                      <div className="fw-bold fs-5 text-warning">{stats.totalResidents}</div>
                      <div className="text-muted" style={{ fontSize: '0.725rem' }}>Residents</div>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Floating Stats Counter Banner */}
      <Container>
        <div className="hero-stats-banner">
          <Row className="text-center g-3">
            <Col md={4} className="border-end-md">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <i className="bi bi-people fs-2 text-primary"></i>
                <div className="text-start">
                  <div className="fw-bold fs-5">{t('hero_stat_residents')}</div>
                  <div className="text-muted small">6 Wards Covered</div>
                </div>
              </div>
            </Col>
            <Col md={4} className="border-end-md">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <i className="bi bi-stopwatch fs-2 text-success"></i>
                <div className="text-start">
                  <div className="fw-bold fs-5">{t('hero_stat_resolution')}</div>
                  <div className="text-muted small">Average Response Time</div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="d-flex align-items-center justify-content-center gap-3">
                <i className="bi bi-qr-code fs-2 text-info"></i>
                <div className="text-start">
                  <div className="fw-bold fs-5">{t('hero_stat_transparency')}</div>
                  <div className="text-muted small">End-to-End Audit Trail</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      {/* 6 Civic Categories from Venkatapuram Field Survey */}
      <section className="py-5 mt-3">
        <Container>
          <div className="text-center mb-5">
            <Badge bg="primary-subtle" className="text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-2">
              Panchayat Focus Areas
            </Badge>
            <h2 className="fw-bold text-dark">{t('cat_heading')}</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
              {t('cat_subheading')}
            </p>
          </div>

          <Row className="g-4">
            {categories.map((c) => (
              <Col lg={4} md={6} key={c.key}>
                <div className="category-card">
                  <div className={`category-icon-box ${c.css}`}>
                    <i className={`bi ${c.icon}`}></i>
                  </div>
                  <h5 className="fw-bold text-dark">{t(`cat_${c.key}`)}</h5>
                  <p className="text-secondary small mb-3 flex-grow-1">
                    {t(`cat_${c.key}_desc`)}
                  </p>
                  <Link to={`/complaints/new?cat=${encodeURIComponent(c.param)}`} className="text-decoration-none fw-semibold small text-primary">
                    Report Issue <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 4-Step How It Works */}
      <section className="py-5 bg-white border-top border-bottom">
        <Container>
          <div className="text-center mb-5">
            <Badge bg="success-subtle" className="text-success border border-success-subtle px-3 py-2 rounded-pill fw-semibold mb-2">
              Swift Redressal Workflow
            </Badge>
            <h2 className="fw-bold text-dark">{t('how_heading')}</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              {t('how_subheading')}
            </p>
          </div>

          <Row className="g-4 text-center">
            {[1, 2, 3, 4].map((step) => {
              const colors = ['bg-primary', 'bg-info', 'bg-warning text-dark', 'bg-success'];
              return (
                <Col lg={3} md={6} key={step}>
                  <div className="p-3">
                    <div
                      className={`mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle ${colors[step - 1]} text-white`}
                      style={{ width: '64px', height: '64px', fontSize: '1.6rem', fontWeight: 700 }}
                    >
                      {step}
                    </div>
                    <h5 className="fw-bold mb-2">{t(`step_${step}_title`)}</h5>
                    <p className="text-secondary small">{t(`step_${step}_desc`)}</p>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>

      {/* Why Use Portal & Quick Track Section */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <Badge bg="warning-subtle" className="text-warning-emphasis border border-warning-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
                B.Tech Community Service Project
              </Badge>
              <h2 className="fw-bold text-dark mb-3">Transforming Venkatapuram Village Governance</h2>
              <p className="text-secondary mb-4">
                In traditional rural administration, villagers had to repeatedly travel to the Panchayat office, wait for officials, or file paper applications with no status tracking.
              </p>
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded bg-primary-subtle text-primary">
                    <i className="bi bi-shield-check fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Direct Accountability</h6>
                    <p className="small text-secondary mb-0">Every issue is directly logged in the Gram Panchayat central dashboard visible to the Sarpanch and Secretary.</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded bg-success-subtle text-success">
                    <i className="bi bi-clock-history fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Audit Trail & Timeline</h6>
                    <p className="small text-secondary mb-0">Transparent progress updates show who is assigned, field inspection remarks, and completion proofs.</p>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-3">
                  <div className="p-2 rounded bg-info-subtle text-info">
                    <i className="bi bi-translate fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Bilingual Support (తెలుగు & English)</h6>
                    <p className="small text-secondary mb-0">Complete access in mother tongue Telugu ensures elderly and non-English-speaking residents can report problems easily.</p>
                  </div>
                </div>
              </div>
              <Link to="/about" className="btn btn-outline-primary">
                <i className="bi bi-journal-text me-1"></i> Read Full CSP Project Objectives
              </Link>
            </Col>

            <Col lg={6}>
              <div className="portal-card p-4">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-lightning-charge-fill text-warning me-2"></i>Quick Track Grievance
                </h5>
                <p className="small text-muted mb-3">
                  Have a complaint tracking number? Enter it below to check current resolution progress immediately without logging in.
                </p>
                <Form onSubmit={handleTrackSubmit} className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="e.g. SCM-2026-0001"
                    value={trackId}
                    onChange={(e) => setTrackId(e.target.value)}
                    required
                  />
                  <Button type="submit" className="btn-portal-primary px-4 text-nowrap">
                    <i className="bi bi-search me-1"></i> Track
                  </Button>
                </Form>
                <div className="mt-4 pt-3 border-top small text-secondary">
                  <span className="fw-semibold text-dark">Demo Tracking IDs:</span>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <Link to="/track?cid=SCM-2026-0001" className="badge bg-light text-primary border text-decoration-none">
                      SCM-2026-0001 (Water)
                    </Link>
                    <Link to="/track?cid=SCM-2026-0002" className="badge bg-light text-success border text-decoration-none">
                      SCM-2026-0002 (Lights)
                    </Link>
                    <Link to="/track?cid=SCM-2026-0004" className="badge bg-light text-warning border text-decoration-none">
                      SCM-2026-0004 (Roads)
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
