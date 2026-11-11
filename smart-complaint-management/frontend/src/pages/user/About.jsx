import React from 'react';
import { Container, Row, Col, Badge, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          {t('nav_home')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('nav_about')}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header Banner */}
      <div className="p-4 p-md-5 mb-4 rounded-4 text-white" style={{ background: 'linear-gradient(135deg, #073663 0%, #0b4f8a 100%)' }}>
        <Row className="align-items-center">
          <Col lg={8}>
            <Badge bg="warning" className="text-dark px-3 py-2 rounded-pill fw-bold mb-2">
              Community Service Project
            </Badge>
            <h1 className="display-6 fw-bold mb-3">About Venkatapuram & This Civic Initiative</h1>
            <p className="lead mb-0 text-white-50">
              A digital governance transformation designed and deployed by B.Tech Computer Science & Engineering students to empower rural residents and Gram Panchayat administration.
            </p>
          </Col>
          <Col lg={4} className="text-center mt-4 mt-lg-0">
            <div className="p-3 bg-white text-dark rounded-4 shadow d-inline-block text-start">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-geo-alt-fill text-danger fs-4"></i>
                <span className="fw-bold fs-6">Venkatapuram Village</span>
              </div>
              <div className="small text-muted"><strong>State:</strong> Andhra Pradesh</div>
              <div className="small text-muted"><strong>Households:</strong> ~820 families</div>
              <div className="small text-muted"><strong>Wards:</strong> 6 Administrative Wards</div>
              <div className="small text-muted"><strong>Panchayat Office:</strong> Main Bazaar</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Background & Findings */}
      <Row className="g-4 mb-5">
        <Col lg={7}>
          <h3 className="fw-bold text-dark mb-3">Background & Community Survey</h3>
          <p className="text-secondary">
            As part of the mandatory <strong>Community Service Project (CSP)</strong> in B.Tech CSE, our team conducted an intensive door-to-door survey across all 6 wards of <strong>Venkatapuram Village</strong>. We met with local farmers, small shopkeepers, women self-help groups (SHGs), teachers, and youth to understand civic hurdles in daily village life.
          </p>
          <p className="text-secondary">
            We observed that while the Gram Panchayat administration was eager to resolve citizen issues, they lacked a centralized digital tracking tool. Grievances were reported verbally at the weekly Prajavani or written on loose papers, which frequently resulted in delays, lack of accountability, and citizen frustration.
          </p>
          <div className="p-3 bg-light rounded-3 border-start border-4 border-primary mt-3">
            <h6 className="fw-bold text-primary mb-1">
              <i className="bi bi-quote me-1"></i>Core Project Mission
            </h6>
            <p className="small text-muted mb-0">
              "To replace manual, untracked paper complaints with a simple, transparent, and mobile-friendly bilingual digital grievance portal that brings governance straight to every villager's fingertips."
            </p>
          </div>
        </Col>
        <Col lg={5}>
          <div className="portal-card p-4 h-100">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-bullseye text-primary me-2"></i>Key Project Objectives
            </h5>
            <ul className="list-unstyled d-flex flex-column gap-3 mb-0 small text-secondary">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                <span><strong>Zero Physical Travel:</strong> Villagers report issues directly from home via phone or computer.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                <span><strong>Guaranteed Unique Tracking ID:</strong> Instant tracking number (e.g. SCM-2026-0001) for every issue.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                <span><strong>Photographic Evidence:</strong> Residents attach photos of pipeline bursts, broken streetlights, or road craters.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                <span><strong>Bilingual Inclusivity:</strong> Dual-language toggle (Telugu / English) removes linguistic hurdles.</span>
              </li>
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                <span><strong>Data-Driven Reports:</strong> Charts and CSV exports aid Panchayat budget and workforce planning.</span>
              </li>
            </ul>
          </div>
        </Col>
      </Row>

      {/* Governance Hierarchy */}
      <div className="mb-5">
        <h3 className="fw-bold text-dark text-center mb-4">Gram Panchayat Governance Structure</h3>
        <Row className="g-4 justify-content-center">
          <Col md={4}>
            <div className="portal-card p-4 text-center">
              <div
                className="avatar mx-auto mb-3 rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                style={{ width: '70px', height: '70px', fontSize: '2rem' }}
              >
                <i className="bi bi-person-badge"></i>
              </div>
              <h5 className="fw-bold mb-1">Sri K. Ramesh</h5>
              <Badge bg="primary" className="mb-2">Panchayat Secretary</Badge>
              <p className="small text-muted mb-0">Oversees grievance assignments, field technician dispatch, and resolution audits.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="portal-card p-4 text-center">
              <div
                className="avatar mx-auto mb-3 rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                style={{ width: '70px', height: '70px', fontSize: '2rem' }}
              >
                <i className="bi bi-award"></i>
              </div>
              <h5 className="fw-bold mb-1">Smt. M. Saraswathi</h5>
              <Badge bg="success" className="mb-2">Sarpanch (Village Head)</Badge>
              <p className="small text-muted mb-0">Policy guidance, village welfare priorities, and civic development funds allocation.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="portal-card p-4 text-center">
              <div
                className="avatar mx-auto mb-3 rounded-circle bg-warning-subtle text-warning-emphasis d-flex align-items-center justify-content-center"
                style={{ width: '70px', height: '70px', fontSize: '2rem' }}
              >
                <i className="bi bi-tools"></i>
              </div>
              <h5 className="fw-bold mb-1">Grama Sachivalayam Team</h5>
              <Badge bg="warning" className="text-dark mb-2">Field Staff & Linemen</Badge>
              <p className="small text-muted mb-0">Sanitation supervisors, water lines operators, electricians, and ward volunteers.</p>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
