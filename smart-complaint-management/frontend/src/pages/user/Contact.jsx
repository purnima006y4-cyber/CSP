import React, { useState } from 'react';
import { Container, Row, Col, Badge, Breadcrumb, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', mobile: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>
          {t('nav_home')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('nav_contact')}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center mb-5">
        <Badge bg="primary-subtle" className="text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-2">
          Panchayat Administration
        </Badge>
        <h2 className="fw-bold text-dark">Get in Touch with Venkatapuram Panchayat</h2>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Visit our Grama Sachivalayam office or contact the relevant administrative officers below.
        </p>
      </div>

      <Row className="g-4">
        {/* Office Details */}
        <Col lg={5}>
          <div className="portal-card p-4 h-100">
            <h5 className="fw-bold text-dark mb-3">
              <i className="bi bi-geo-alt-fill text-danger me-2"></i>Official Office Details
            </h5>

            <div className="mb-4">
              <strong className="text-dark d-block">Gram Panchayat Office & Sachivalayam:</strong>
              <p className="text-secondary small mb-1">Main Bazaar Road, Opp. Zilla Parishad High School</p>
              <p className="text-secondary small mb-1">Venkatapuram Village, Andhra Pradesh - 522001</p>
              <p className="text-secondary small">
                <i className="bi bi-clock me-1 text-primary"></i>Monday to Saturday: 9:00 AM – 5:00 PM
              </p>
            </div>

            <h6 className="fw-bold text-dark mb-2 border-top pt-3">
              <i className="bi bi-telephone-fill text-success me-2"></i>Administrative Directory
            </h6>
            <div className="d-flex flex-column gap-2 small text-secondary mb-4">
              <div className="d-flex justify-content-between p-2 bg-light rounded">
                <span>Panchayat Secretary:</span>
                <strong className="text-dark">0866-234567</strong>
              </div>
              <div className="d-flex justify-content-between p-2 bg-light rounded">
                <span>Sarpanch Office:</span>
                <strong className="text-dark">0866-234568</strong>
              </div>
              <div className="d-flex justify-content-between p-2 bg-light rounded">
                <span>Water Works Supervisor:</span>
                <strong className="text-dark">98765 43215</strong>
              </div>
              <div className="d-flex justify-content-between p-2 bg-light rounded">
                <span>Electricity Sub-station:</span>
                <strong className="text-dark">1912 / 0866-234569</strong>
              </div>
            </div>

            <Alert variant="info" className="py-2 small mb-0">
              <i className="bi bi-info-circle-fill me-1"></i>
              For active complaints, please use the <Link to="/complaints/new" className="alert-link">Register Complaint</Link> page for automated tracking.
            </Alert>
          </div>
        </Col>

        {/* Message Form */}
        <Col lg={7}>
          <div className="portal-card p-4">
            <h5 className="fw-bold text-dark mb-2">
              <i className="bi bi-envelope-fill text-primary me-2"></i>General Inquiry / Suggestion
            </h5>
            <p className="text-muted small mb-4">Leave a message directly for the Grama Sachivalayam team.</p>

            {submitted ? (
              <Alert variant="success" className="py-3">
                <h6 className="fw-bold mb-1">
                  <i className="bi bi-check-circle-fill me-2"></i>Message Received
                </h6>
                <p className="small mb-0">Our Panchayat administrative staff will review your message during office working hours.</p>
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Your Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="e.g. Ramesh Reddy"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Mobile Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    />
                  </Col>
                  <Col xs={12}>
                    <Form.Label>Subject / Purpose</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. RO Plant Timings Inquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </Col>
                  <Col xs={12}>
                    <Form.Label>Message Details <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      required
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </Col>
                  <Col xs={12}>
                    <Button type="submit" className="btn-portal-primary px-4 py-2">
                      <i className="bi bi-send-fill me-1"></i> Send Message
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
