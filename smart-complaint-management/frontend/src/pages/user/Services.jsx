import React from 'react';
import { Container, Row, Col, Badge, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      category: 'Drinking Water',
      title: 'Drinking Water Supply & RO Maintenance',
      icon: 'bi-droplet-half',
      color: 'text-info',
      bg: 'bg-info-subtle',
      sla: '24 - 48 Hours',
      staff: 'Engineering Assistant / Water Line Fitter',
      desc: 'Covers tap water pressure loss, pipe bursts, borewell pump failures, RO plant purification filter replacements, and pipeline contamination reports.'
    },
    {
      category: 'Roads and Potholes',
      title: 'Village Link Roads, Potholes & Culverts',
      icon: 'bi-signpost-2',
      color: 'text-warning',
      bg: 'bg-warning-subtle',
      sla: '3 - 7 Working Days',
      staff: 'Panchayat Engineering Assistant / Roads & Buildings Dept',
      desc: 'Covers deep craters on main approach roads, broken concrete pavers in residential lanes, damaged storm culverts, and dangerous gravel patches.'
    },
    {
      category: 'Streetlights',
      title: 'Streetlights & Public Illumination',
      icon: 'bi-lightbulb',
      color: 'text-warning',
      bg: 'bg-warning-subtle',
      sla: '24 - 48 Hours',
      staff: 'Panchayat Electrical Lineman',
      desc: 'Covers blown LED fixtures, broken lamp poles, daytime lights burning due to sensor failure, and dark unsafe stretches along school roads.'
    },
    {
      category: 'Drainage and Sanitation',
      title: 'Drainage Desilting & Mosquito Control',
      icon: 'bi-water',
      color: 'text-success',
      bg: 'bg-success-subtle',
      sla: '24 - 36 Hours',
      staff: 'Sanitation Supervisor & Grama Sachivalayam Crew',
      desc: 'Covers clogged open drains, stagnant wastewater pooling on pedestrian paths, missing drain slab covers, and anti-larval chemical spraying requests.'
    },
    {
      category: 'Garbage Collection',
      title: 'Solid Waste Management & Tractor Rounds',
      icon: 'bi-trash3',
      color: 'text-danger',
      bg: 'bg-danger-subtle',
      sla: '24 Hours',
      staff: 'Green Ambassador / Solid Waste Management Team',
      desc: 'Covers missed door-to-door waste collection rounds, illegal open dumping on vacant village land, and damaged community dustbins.'
    },
    {
      category: 'Electricity',
      title: 'Agricultural Feeder & Power Grid',
      icon: 'bi-lightning-charge',
      color: 'text-primary',
      bg: 'bg-primary-subtle',
      sla: '12 - 24 Hours',
      staff: 'APEPDCL Sub-Station Lineman',
      desc: 'Covers agricultural 3-phase low voltage drops, transformer sparks, loose sagging high-tension wires, and damaged meter boxes.'
    }
  ];

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          {t('nav_home')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('nav_services')}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center mb-5">
        <Badge bg="primary-subtle" className="text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-2">
          Citizen Charter & Service Standards
        </Badge>
        <h2 className="fw-bold text-dark">Civic Grievance Services & SLA Timeframes</h2>
        <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
          Every civic grievance submitted through our portal is bound by official Panchayat Service Level Agreements (SLAs).
        </p>
      </div>

      <Row className="g-4">
        {services.map((item) => (
          <Col lg={6} key={item.category}>
            <div className="portal-card p-4 h-100 d-flex flex-column">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className={`p-3 rounded-3 ${item.bg} ${item.color} fs-3`}>
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div>
                  <h5 className="fw-bold text-dark mb-1">{item.title}</h5>
                  <Badge bg="light" className="text-secondary border">
                    Target SLA: <strong className="text-dark">{item.sla}</strong>
                  </Badge>
                </div>
              </div>
              <p className="text-secondary small mb-3 flex-grow-1">{item.desc}</p>
              <div className="bg-light p-2 rounded small text-secondary mb-3">
                <i className="bi bi-person-gear text-primary me-1"></i>
                <strong>Assigned Role:</strong> {item.staff}
              </div>
              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="small text-muted">
                  <i className="bi bi-shield-check text-success me-1"></i>Official Redressal
                </span>
                <Link to={`/complaints/new?cat=${encodeURIComponent(item.category)}`} className="btn btn-sm btn-portal-primary">
                  <i className="bi bi-pencil-square me-1"></i> File Grievance
                </Link>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
