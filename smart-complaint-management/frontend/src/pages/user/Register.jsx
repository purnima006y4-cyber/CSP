import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { t } = useTranslation();
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    village: 'Venkatapuram',
    wardNumber: 'Ward 1',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Card className="shadow-sm border-0 rounded-4">
            <div className="card-header bg-primary text-white py-3 rounded-top-4">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-person-plus-fill fs-4"></i>
                <div>
                  <h4 className="mb-0 fw-bold">{t('nav_register')}</h4>
                  <p className="mb-0 small text-white-50">Create an account to report and track grievances in Venkatapuram Village</p>
                </div>
              </div>
            </div>

            <Card.Body className="p-4 p-md-5">
              {error && (
                <Alert variant="danger" className="py-2 small mb-4 shadow-sm">
                  <i className="bi bi-exclamation-octagon-fill me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  {/* Full Name */}
                  <Col md={6}>
                    <Form.Label>{t('field_name')} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="e.g. Venkat Rao"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </Col>

                  {/* Mobile */}
                  <Col md={6}>
                    <Form.Label>{t('field_mobile')} <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">+91</InputGroup.Text>
                      <Form.Control
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      />
                    </InputGroup>
                    <Form.Text className="small text-muted">Used for login access.</Form.Text>
                  </Col>

                  {/* Email */}
                  <Col md={6}>
                    <Form.Label>{t('field_email')} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="email"
                      required
                      placeholder="name@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Col>

                  {/* Village */}
                  <Col md={3}>
                    <Form.Label>{t('field_village')}</Form.Label>
                    <Form.Control type="text" value={formData.village} readOnly />
                  </Col>

                  {/* Ward Number */}
                  <Col md={3}>
                    <Form.Label>{t('field_ward')}</Form.Label>
                    <Form.Select
                      value={formData.wardNumber}
                      onChange={(e) => setFormData({ ...formData, wardNumber: e.target.value })}
                    >
                      {[1, 2, 3, 4, 5, 6].map((w) => (
                        <option key={w} value={`Ward ${w}`}>
                          Ward {w}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  {/* Address */}
                  <Col xs={12}>
                    <Form.Label>{t('field_address')}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Door number, street name, landmark in Venkatapuram"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </Col>

                  {/* Password */}
                  <Col md={6}>
                    <Form.Label>{t('field_password')} <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </Button>
                    </InputGroup>
                  </Col>

                  {/* Confirm Password */}
                  <Col md={6}>
                    <Form.Label>{t('field_confirm_pwd')} <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Repeat password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      />
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </Button>
                    </InputGroup>
                  </Col>

                  <Col xs={12} className="mt-4">
                    <Button type="submit" disabled={loading} className="btn-portal-primary w-100 py-2 fs-6">
                      {loading ? 'Creating Account...' : <><i className="bi bi-person-check-fill me-2"></i>{t('btn_register')}</>}
                    </Button>
                  </Col>
                </Row>
              </Form>

              <div className="text-center mt-4 pt-3 border-top">
                <span className="text-secondary">Already have a registered account?</span>{' '}
                <Link to="/login" className="fw-bold text-primary text-decoration-none">
                  {t('nav_login')} <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
