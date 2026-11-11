import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Breadcrumb } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function RegisterComplaint() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    title: '',
    category: searchParams.get('cat') || '',
    description: '',
    village: 'Venkatapuram',
    location: user?.address || '',
    priority: 'Medium'
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const categories = [
    'Drinking Water',
    'Roads and Potholes',
    'Streetlights',
    'Drainage and Sanitation',
    'Garbage Collection',
    'Electricity',
    'Other'
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds the 2 MB limit. Please select a smaller photo.');
        e.target.value = '';
        setPhotoFile(null);
        setPhotoPreview(null);
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Invalid file format. Only JPG, PNG, and WebP images are permitted.');
        e.target.value = '';
        setPhotoFile(null);
        setPhotoPreview(null);
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setPhotoPreview(event.target.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.category || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('description', formData.description.trim());
      data.append('village', formData.village);
      data.append('location', formData.location.trim());
      data.append('priority', formData.priority);

      if (photoFile) {
        data.append('photo', photoFile);
      }

      const res = await api.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.success && res.data) {
        setSuccessData(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit grievance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/dashboard' }}>
          {t('nav_dashboard')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('nav_register_cmp')}</Breadcrumb.Item>
      </Breadcrumb>

      <Row className="justify-content-center">
        <Col lg={9}>
          {successData ? (
            /* Success Banner */
            <Card className="shadow-sm border-0 rounded-4 p-4 p-md-5 text-center mb-5 bg-white">
              <div
                className="mx-auto mb-3 rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center"
                style={{ width: '72px', height: '72px', fontSize: '2.2rem' }}
              >
                <i className="bi bi-check2-circle"></i>
              </div>
              <h3 className="fw-bold text-dark mb-2">Grievance Registered Successfully!</h3>
              <p className="text-secondary mb-4">
                Your civic complaint has been registered in the Venkatapuram Gram Panchayat database.
              </p>

              <div className="bg-light border rounded-3 p-3 d-inline-block mx-auto mb-4">
                <div className="small text-muted text-uppercase fw-semibold mb-1">Your Unique Tracking Number</div>
                <div className="display-6 fw-bold text-primary font-monospace">{successData.complaintId}</div>
              </div>

              <p className="small text-muted mb-4">
                Please note down this Tracking ID. You can also monitor live updates in your dashboard.
              </p>

              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to={`/track?cid=${successData.complaintId}`} className="btn btn-portal-primary px-4 py-2">
                  <i className="bi bi-clock-history me-1"></i> Track Progress Timeline
                </Link>
                <Button
                  variant="outline-secondary"
                  className="px-4 py-2"
                  onClick={() => {
                    setSuccessData(null);
                    setFormData({
                      title: '',
                      category: '',
                      description: '',
                      village: 'Venkatapuram',
                      location: user?.address || '',
                      priority: 'Medium'
                    });
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                >
                  <i className="bi bi-plus-circle me-1"></i> File Another Grievance
                </Button>
                <Link to="/dashboard" className="btn btn-light px-4 py-2">
                  <i className="bi bi-speedometer2 me-1"></i> Back to Dashboard
                </Link>
              </div>
            </Card>
          ) : (
            /* Complaint Submission Form */
            <Card className="shadow-sm border-0 rounded-4">
              <div className="card-header bg-primary text-white py-3 rounded-top-4">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-pencil-square fs-4"></i>
                  <div>
                    <h4 className="mb-0 fw-bold">{t('btn_lodge_cmp')}</h4>
                    <p className="mb-0 small text-white-50">Report village issues directly to the Gram Panchayat administration</p>
                  </div>
                </div>
              </div>

              <Card.Body className="p-4 p-md-5">
                {error && (
                  <Alert variant="danger" className="py-2 small mb-4 shadow-sm">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-4">
                    {/* Problem Category */}
                    <Col md={6}>
                      <Form.Label>{t('field_category')} <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="">-- Choose Category / విభాగం --</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    {/* Priority Level */}
                    <Col md={6}>
                      <Form.Label>{t('field_priority')} <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="Low">{t('priority_low')} - General maintenance</option>
                        <option value="Medium">{t('priority_medium')} - Normal priority (SLA 48 hrs)</option>
                        <option value="High">{t('priority_high')} - Hazardous / Urgent emergency</option>
                      </Form.Select>
                    </Col>

                    {/* Grievance Title */}
                    <Col xs={12}>
                      <Form.Label>{t('field_title')} <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        required
                        placeholder="e.g. Drinking water pipeline leak near Temple Street"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </Col>

                    {/* Village and Specific Location */}
                    <Col md={5}>
                      <Form.Label>{t('field_village')}</Form.Label>
                      <Form.Control type="text" value={formData.village} readOnly />
                    </Col>

                    <Col md={7}>
                      <Form.Label>{t('field_location')} <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        required
                        placeholder="e.g. Ward 2, Opp. Shiva Temple, House No. 3-45"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </Col>

                    {/* Description */}
                    <Col xs={12}>
                      <Form.Label>{t('field_description')} <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        required
                        placeholder="Please describe what happened, how long the issue has persisted, and any relevant details..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </Col>

                    {/* Photo Upload with Dropzone & Live Preview */}
                    <Col xs={12}>
                      <Form.Label>{t('field_photo')}</Form.Label>
                      <div
                        className="upload-dropzone"
                        onClick={() => document.getElementById('photoInput').click()}
                      >
                        <i className="bi bi-cloud-arrow-up fs-1 text-primary d-block mb-2"></i>
                        <div className="fw-bold text-dark">Click here to select an image from your device</div>
                        <p className="small text-muted mb-0">Accepted formats: JPG, PNG, WebP (Max size: 2 MB)</p>
                        <input
                          type="file"
                          id="photoInput"
                          className="d-none"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handlePhotoChange}
                        />
                      </div>

                      {photoPreview && (
                        <div className="mt-3 text-center">
                          <span className="badge bg-secondary mb-2">Selected Photo Preview:</span>
                          <br />
                          <img
                            src={photoPreview}
                            alt="Selected"
                            className="img-thumbnail rounded-3 shadow-sm"
                            style={{ maxHeight: '200px' }}
                          />
                        </div>
                      )}
                    </Col>

                    {/* Submit Button */}
                    <Col xs={12} className="pt-3 border-top">
                      <div className="d-flex justify-content-between align-items-center">
                        <Link to="/dashboard" className="btn btn-outline-secondary">
                          {t('btn_back')}
                        </Link>
                        <Button type="submit" disabled={loading} className="btn-portal-success px-4 py-2 fs-6">
                          {loading ? 'Submitting...' : <><i className="bi bi-send-check me-2"></i>{t('btn_submit')}</>}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}
