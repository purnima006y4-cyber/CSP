import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function AppNavbar() {
  const { t, i18n } = useTranslation();
  const { user, admin, logoutUser } = useAuth();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'te' ? 'en' : 'te';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className="gov-top-bar">
        <Container className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <span>
              <i className="bi bi-geo-alt-fill text-warning me-1"></i>
              {t('village_name')}, Andhra Pradesh
            </span>
            <span className="d-none d-md-inline text-secondary">|</span>
            <span className="d-none d-md-inline">
              <i className="bi bi-telephone-inbound-fill me-1 text-info"></i>
              {t('helpline')}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Language Switcher */}
            <button onClick={toggleLanguage} className="lang-switch-btn border-0" title="Switch Language">
              <i className="bi bi-translate me-1"></i>
              {t('toggle_lang')}
            </button>

            {admin ? (
              <Link to="/admin/dashboard" className="badge bg-warning text-dark text-decoration-none px-2 py-1">
                <i className="bi bi-shield-lock-fill me-1"></i>Admin Console
              </Link>
            ) : (
              <Link to="/admin/login" className="text-white-50 small text-decoration-none">
                <i className="bi bi-person-badge me-1"></i>
                {t('nav_admin')}
              </Link>
            )}
          </div>
        </Container>
      </div>

      {/* Main Navbar */}
      <Navbar expand="lg" className="portal-navbar sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="portal-brand-logo">
            <div className="portal-emblem-icon">
              <i className="bi bi-building-check"></i>
            </div>
            <div>
              <div className="portal-brand-title">{t('app_name')}</div>
              <div className="portal-brand-subtitle">{t('village_name')} • CSP</div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="portal-nav-collapse" className="border-0 shadow-none">
            <i className="bi bi-list fs-2 text-primary"></i>
          </Navbar.Toggle>

          <Navbar.Collapse id="portal-nav-collapse">
            <Nav className="ms-auto align-items-lg-center gap-1">
              <Nav.Link as={NavLink} to="/" end className="portal-nav-link">
                <i className="bi bi-house-door me-1"></i>
                {t('nav_home')}
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about" className="portal-nav-link">
                {t('nav_about')}
              </Nav.Link>
              <Nav.Link as={NavLink} to="/services" className="portal-nav-link">
                {t('nav_services')}
              </Nav.Link>
              <Nav.Link as={NavLink} to="/track" className="portal-nav-link">
                <i className="bi bi-search me-1"></i>
                {t('nav_track')}
              </Nav.Link>
              <Nav.Link as={NavLink} to="/contact" className="portal-nav-link">
                {t('nav_contact')}
              </Nav.Link>

              {user ? (
                <>
                  <Nav.Link as={NavLink} to="/dashboard" className="portal-nav-link">
                    <i className="bi bi-speedometer2 me-1"></i>
                    {t('nav_dashboard')}
                  </Nav.Link>

                  <Link to="/complaints/new" className="btn btn-portal-success btn-sm ms-lg-2">
                    <i className="bi bi-plus-circle me-1"></i>
                    {t('nav_register_cmp')}
                  </Link>

                  <div className="ms-lg-2">
                    <NotificationBell />
                  </div>

                  <Dropdown align="end" className="ms-lg-2">
                    <Dropdown.Toggle as="button" className="btn btn-link text-dark p-0 border-0 shadow-none d-flex align-items-center gap-1">
                      <i className="bi bi-person-circle fs-4 text-primary"></i>
                      <span className="d-none d-lg-inline fw-semibold small text-secondary ms-1">
                        {user.fullName.split(' ')[0]}
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="shadow border-0 rounded-3">
                      <div className="px-3 py-2 border-bottom">
                        <div className="fw-bold text-dark">{user.fullName}</div>
                        <div className="small text-muted">
                          {user.village} ({user.wardNumber || 'Ward 1'})
                        </div>
                      </div>
                      <Dropdown.Item as={Link} to="/dashboard" className="py-2">
                        <i className="bi bi-grid me-2 text-primary"></i>
                        {t('nav_dashboard')}
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/my-complaints" className="py-2">
                        <i className="bi bi-card-checklist me-2 text-primary"></i>
                        {t('nav_my_complaints')}
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/profile" className="py-2">
                        <i className="bi bi-person-gear me-2 text-primary"></i>
                        {t('nav_profile')}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout} className="py-2 text-danger">
                        <i className="bi bi-box-arrow-right me-2"></i>
                        {t('nav_logout')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-primary btn-sm px-3 ms-lg-2">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    {t('nav_login')}
                  </Link>
                  <Link to="/register" className="btn btn-portal-primary btn-sm px-3 ms-lg-1">
                    <i className="bi bi-person-plus me-1"></i>
                    {t('nav_register')}
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
