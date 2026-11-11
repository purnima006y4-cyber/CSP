import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
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
      await loginAdmin(identifier, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setIdentifier('admin');
    setPassword('Admin@123');
  };

  return (
    <div className="bg-light d-flex align-items-center min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={8}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              <div
                className="card-header text-white p-4 text-center"
                style={{ background: 'linear-gradient(135deg, #071f37 0%, #0b4f8a 100%)' }}
              >
                <div
                  className="portal-emblem-icon mx-auto mb-2"
                  style={{
                    width: '54px',
                    height: '54px',
                    fontSize: '1.5rem',
                    background: 'linear-gradient(135deg, #f59e0b, #1f8a4c)'
                  }}
                >
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h4 className="fw-bold mb-1">Panchayat Administration</h4>
                <p className="small text-white-50 mb-0">Venkatapuram Gram Panchayat • Official Portal</p>
              </div>

              <Card.Body className="p-4 p-md-5">
                {error && (
                  <Alert variant="danger" className="py-2 small mb-4 shadow-sm">
                    <i className="bi bi-exclamation-octagon-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username or Official Email <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light"><i className="bi bi-person-badge"></i></InputGroup.Text>
                      <Form.Control
                        type="text"
                        required
                        placeholder="e.g. admin or admin@venkatapuram.gov.in"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light"><i className="bi bi-key-fill"></i></InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter administrative password"
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

                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-portal-primary w-100 py-2 fs-6 mb-3"
                  >
                    {loading ? 'Authenticating...' : <><i className="bi bi-box-arrow-in-right me-2"></i> Sign In to Admin Console</>}
                  </Button>
                </Form>

                {/* Default Credentials Helper */}
                <div className="bg-light border rounded-3 p-3 mt-4 small">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark">
                      <i className="bi bi-shield-check text-success me-1"></i>Default Admin Credentials:
                    </span>
                    <button onClick={fillDemoAdmin} className="btn btn-link btn-sm p-0 text-decoration-none small">
                      Auto-Fill
                    </button>
                  </div>
                  <div className="text-secondary">Username: <code className="text-primary">admin</code></div>
                  <div className="text-secondary">Password: <code className="text-primary">Admin@123</code></div>
                  <div className="text-secondary mt-1">
                    <i className="bi bi-info-circle me-1"></i>Role: Sri K. Ramesh (Panchayat Secretary)
                  </div>
                </div>

                <div className="text-center mt-4 pt-3 border-top">
                  <Link to="/" className="text-decoration-none text-secondary small">
                    <i className="bi bi-arrow-left me-1"></i> Return to Resident Public Portal
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
