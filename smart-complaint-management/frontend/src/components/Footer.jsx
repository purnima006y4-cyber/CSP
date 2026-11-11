import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="portal-footer">
      <Container>
        <Row className="g-4">
          {/* Col 1: Project & Village */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="portal-emblem-icon" style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
                <i className="bi bi-shield-check"></i>
              </div>
              <span className="fs-5 fw-bold text-white">{t('village_name')}</span>
            </div>
            <p className="small text-secondary mb-3">{t('footer_about_text')}</p>
            <div className="badge bg-success-subtle text-success-emphasis border border-success-subtle py-2 px-3">
              <i className="bi bi-award-fill me-1"></i> B.Tech CSE Community Service Project (CSP)
            </div>
          </Col>

          {/* Col 2: Quick Links */}
          <Col lg={2} md={6}>
            <h5>{t('footer_links_title')}</h5>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li>
                <Link to="/">
                  <i className="bi bi-chevron-right me-1"></i>
                  {t('nav_home')}
                </Link>
              </li>
              <li>
                <Link to="/about">
                  <i className="bi bi-chevron-right me-1"></i>
                  {t('nav_about')}
                </Link>
              </li>
              <li>
                <Link to="/services">
                  <i className="bi bi-chevron-right me-1"></i>
                  {t('nav_services')}
                </Link>
              </li>
              <li>
                <Link to="/track">
                  <i className="bi bi-chevron-right me-1"></i>
                  {t('nav_track')}
                </Link>
              </li>
              <li>
                <Link to="/complaints/new">
                  <i className="bi bi-chevron-right me-1"></i>
                  {t('nav_register_cmp')}
                </Link>
              </li>
              <li>
                <Link to="/admin/login">
                  <i className="bi bi-shield-lock me-1"></i>
                  {t('nav_admin')}
                </Link>
              </li>
            </ul>
          </Col>

          {/* Col 3: Village Civic Amenities */}
          <Col lg={3} md={6}>
            <h5>Village Services</h5>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-secondary">
              <li>
                <i className="bi bi-droplet text-info me-2"></i>RO Drinking Water Plant (Ward 1 & 3)
              </li>
              <li>
                <i className="bi bi-lightning-charge text-warning me-2"></i>APEPDCL Feeder Station Sub-center
              </li>
              <li>
                <i className="bi bi-hospital text-danger me-2"></i>Primary Health Center (PHC) Sub-centre
              </li>
              <li>
                <i className="bi bi-mortarboard text-success me-2"></i>Zilla Parishad High School
              </li>
              <li>
                <i className="bi bi-building text-primary me-2"></i>Grama Sachivalayam / Village Secretariat
              </li>
            </ul>
          </Col>

          {/* Col 4: Contact & Emergency Helplines */}
          <Col lg={3} md={6}>
            <h5>{t('footer_contact_title')}</h5>
            <p className="small text-secondary mb-2">
              <i className="bi bi-geo-alt-fill text-danger me-2"></i>
              {t('footer_address')}
            </p>
            <p className="small text-secondary mb-2">
              <i className="bi bi-clock-fill text-warning me-2"></i>
              {t('footer_hours')}
            </p>
            <div className="mt-3 p-2 rounded bg-dark border border-secondary border-opacity-25 small">
              <div className="text-white fw-bold mb-1">
                <i className="bi bi-telephone-plus me-1 text-success"></i>Emergency Helplines:
              </div>
              <div className="text-light">
                Sachivalayam: <strong className="text-warning">0866-234567</strong>
              </div>
              <div className="text-light">
                Police: <strong className="text-warning">100 / 112</strong> | Medical: <strong className="text-warning">108</strong>
              </div>
            </div>
          </Col>
        </Row>

        {/* Bottom Strip */}
        <div className="footer-bottom-bar d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            &copy; {new Date().getFullYear()} {t('village_name')}. {t('footer_copyright')}.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-secondary">Designed for Rural Digital Governance (MERN Stack)</span>
            <a href="#top" className="text-white-50">
              <i className="bi bi-arrow-up-circle fs-5"></i>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
