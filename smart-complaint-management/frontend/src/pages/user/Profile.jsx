import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Breadcrumb, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user, updateCurrentUser } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    wardNumber: user?.wardNumber || 'Ward 1',
    address: user?.address || '',
    preferredLanguage: user?.preferredLanguage || 'en'
  });

  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setLoadingProfile(true);

    try {
      const res = await api.put('/users/me', profileData);
      if (res.success && res.data) {
        updateCurrentUser(res.data);
        if (profileData.preferredLanguage !== i18n.language) {
          i18n.changeLanguage(profileData.preferredLanguage);
        }
        setProfileMsg({ type: 'success', text: 'Profile details updated successfully!' });
      }
    } catch (err) {
      setProfileMsg({ type: 'danger', text: err.message || 'Failed to update profile.' });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });

    if (pwdData.newPassword.length < 6) {
      setPwdMsg({ type: 'danger', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (pwdData.newPassword !== pwdData.confirmNewPassword) {
      setPwdMsg({ type: 'danger', text: 'New password and confirmation do not match.' });
      return;
    }

    setLoadingPwd(true);
    try {
      const res = await api.put('/users/me/password', {
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword
      });
      if (res.success) {
        setPwdMsg({ type: 'success', text: 'Password has been successfully changed!' });
        setPwdData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      setPwdMsg({ type: 'danger', text: err.message || 'Failed to update password.' });
    } finally {
      setLoadingPwd(false);
    }
  };

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/dashboard' }}>
          {t('nav_dashboard')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('nav_profile')}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="g-4">
        {/* Left: Resident Summary Card */}
        <Col lg={4}>
          <div className="portal-card p-4 text-center">
            <div
              className="avatar mx-auto mb-3 rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
              style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}
            >
              <i className="bi bi-person"></i>
            </div>
            <h5 className="fw-bold text-dark mb-1">{user?.fullName}</h5>
            <Badge bg="success-subtle" className="text-success-emphasis border border-success-subtle mb-3">
              <i className="bi bi-check-circle-fill me-1"></i>Verified Resident
            </Badge>

            <div className="text-start border-top pt-3 small text-secondary d-flex flex-column gap-2">
              <div>
                <i className="bi bi-geo-alt text-danger me-2"></i>
                <strong>Village:</strong> {user?.village || 'Venkatapuram'}
              </div>
              <div>
                <i className="bi bi-pin-map text-primary me-2"></i>
                <strong>Ward:</strong> {user?.wardNumber || 'Ward 1'}
              </div>
              <div>
                <i className="bi bi-phone text-success me-2"></i>
                <strong>Mobile:</strong> +91 {user?.mobile}
              </div>
              <div>
                <i className="bi bi-envelope text-info me-2"></i>
                <strong>Email:</strong> {user?.email}
              </div>
            </div>
          </div>
        </Col>

        {/* Right: Update Forms */}
        <Col lg={8}>
          {/* Personal Details Form */}
          <div className="portal-card p-4 mb-4">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-pencil-square text-primary me-2"></i>Personal Details
            </h5>

            {profileMsg.text && (
              <Alert variant={profileMsg.type} className="py-2 small mb-3">
                {profileMsg.text}
              </Alert>
            )}

            <Form onSubmit={handleProfileSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>{t('field_name')} <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={profileData.fullName}
                    onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>{t('field_mobile')} <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    required
                    maxLength={10}
                    value={profileData.mobile}
                    onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>{t('field_email')} <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>{t('field_ward')}</Form.Label>
                  <Form.Select
                    value={profileData.wardNumber}
                    onChange={(e) => setProfileData({ ...profileData, wardNumber: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5, 6].map((w) => (
                      <option key={w} value={`Ward ${w}`}>
                        Ward {w}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={12}>
                  <Form.Label>{t('field_address')}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  />
                </Col>
                <Col xs={12}>
                  <Button type="submit" disabled={loadingProfile} className="btn-portal-primary px-4">
                    {loadingProfile ? 'Saving...' : <><i className="bi bi-save me-1"></i> {t('btn_save')}</>}
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>

          {/* Change Password Form */}
          <div className="portal-card p-4">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-shield-lock text-primary me-2"></i>Change Password
            </h5>

            {pwdMsg.text && (
              <Alert variant={pwdMsg.type} className="py-2 small mb-3">
                {pwdMsg.text}
              </Alert>
            )}

            <Form onSubmit={handlePasswordSubmit}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Label>Current Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    required
                    value={pwdData.currentPassword}
                    onChange={(e) => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>New Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    required
                    minLength={6}
                    value={pwdData.newPassword}
                    onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    required
                    minLength={6}
                    value={pwdData.confirmNewPassword}
                    onChange={(e) => setPwdData({ ...pwdData, confirmNewPassword: e.target.value })}
                  />
                </Col>
                <Col xs={12}>
                  <Button type="submit" disabled={loadingPwd} variant="outline-primary" className="px-4">
                    {loadingPwd ? 'Updating...' : <><i className="bi bi-key me-1"></i> Update Password</>}
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
