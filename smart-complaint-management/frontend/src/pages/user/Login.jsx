import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(identifier, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = () => {
    setIdentifier('venkat@gmail.com');
    setPassword('User@123');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={5} md={8}>
          <Card className="shadow-sm border-0 rounded-4">
            <div className="card-header bg-primary text-white py-3 rounded-top-4 text-center">
              <div className="portal-emblem-icon mx-auto mb-2" style={{ width: '48px', height: '48px', fontSize: '1.3rem' }}>
                <i className="bi bi-person-lock"></i>
              </div>
              <h4 className="mb-0 fw-bold">{t('nav_login')}</h4>
              <p className="mb-0 small text-white-50">Venkatapuram Gram Panchayat Citizen Portal</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              {error && (
                <Alert variant="danger" className="py-2 small mb-4 shadow-sm">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address or Mobile Number <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><i className="bi bi-person"></i></InputGroup.Text>
                    <Form.Control
                      type="text"
                      required
                      placeholder="e.g. 9876543210 or venkat@gmail.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>{t('field_password')} <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="bg-light"><i className="bi bi-key"></i></InputGroup.Text>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button type="submit" disabled={loading} className="btn-portal-primary w-100 py-2 fs-6 mb-3">
                  {loading ? 'Signing In...' : <><i className="bi bi-box-arrow-in-right me-2"></i>{t('btn_login')}</>}
                </Button>
              </Form>

              {/* Demo Credentials Box */}
              <div className="bg-light border rounded-3 p-3 mt-4 small">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-bold text-dark">
                    <i className="bi bi-info-circle-fill text-primary me-1"></i>Demo Resident Login:
                  </span>
                  <button onClick={fillDemoUser} className="btn btn-link btn-sm p-0 text-decoration-none small">
                    Auto-Fill
                  </button>
                </div>
                <div className="text-secondary">Email / Mobile: <code className="text-primary">venkat@gmail.com</code> / <code className="text-primary">9876543210</code></div>
                <div className="text-secondary">Password: <code className="text-primary">User@123</code></div>
              </div>

              <div className="text-center mt-4 pt-3 border-top">
                <span className="text-secondary">New resident in Venkatapuram?</span>{' '}
                <Link to="/register" className="fw-bold text-primary text-decoration-none ms-1">
                  {t('nav_register')} <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
