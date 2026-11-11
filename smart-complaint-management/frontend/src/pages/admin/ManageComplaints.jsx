import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Modal, Alert, Pagination, Badge } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function ManageComplaints() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || ''
  });

  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('Pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [modalMsg, setModalMsg] = useState({ type: '', text: '' });
  const [pageAlert, setPageAlert] = useState('');

  const categories = [
    'Drinking Water',
    'Roads and Potholes',
    'Streetlights',
    'Drainage and Sanitation',
    'Garbage Collection',
    'Electricity',
    'Other'
  ];

  const statuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  const priorities = ['Low', 'Medium', 'High'];

  const staffList = [
    'B. Naidu (Water Lines Technician)',
    'P. Prasad (Panchayat Lineman)',
    'M. Srinivas (Sanitation Supervisor)',
    'A. Ramana (APEPDCL Sub-Station Lineman)',
    'K. Varma (Roads & Buildings Assistant)',
    'Grama Sachivalayam Sanitation Crew'
  ];

  const fetchComplaints = async (currentPage = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });

      for (const [key, val] of [...params.entries()]) {
        if (!val) params.delete(key);
      }

      const res = await api.get(`/admin/complaints?${params.toString()}`);
      if (res.success) {
        setComplaints(res.data);
        setTotal(res.total);
        setPage(res.page);
        setTotalPages(res.totalPages || 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints(1);
  }, [filters.category, filters.status, filters.priority]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints(1);
  };

  const handleReset = () => {
    setFilters({ search: '', category: '', status: '', priority: '' });
    setSearchParams({});
    setPage(1);
  };

  const openUpdateModal = (c) => {
    setSelectedComplaint(c);
    setUpdateStatus(c.status);
    setAssignedTo(c.assignedTo || '');
    setRemarks('');
    setModalMsg({ type: '', text: '' });
    setShowModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setModalMsg({ type: 'danger', text: 'Official remarks must be provided.' });
      return;
    }

    setUpdating(true);
    try {
      const res = await api.put(`/admin/complaints/${selectedComplaint._id}`, {
        status: updateStatus,
        assignedTo,
        remarks: remarks.trim()
      });

      if (res.success) {
        setPageAlert(`Grievance ${selectedComplaint.complaintId} updated successfully and resident notified.`);
        setShowModal(false);
        fetchComplaints(page);
      }
    } catch (err) {
      setModalMsg({ type: 'danger', text: err.message || 'Update failed.' });
    } finally {
      setUpdating(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const badgeClass =
      priority === 'High'
        ? 'bg-danger-subtle text-danger border border-danger-subtle'
        : priority === 'Medium'
        ? 'bg-warning-subtle text-dark border border-warning-subtle'
        : 'bg-info-subtle text-info-emphasis border border-info-subtle';
    return <span className={`badge ${badgeClass} px-2 py-1 rounded`}>{priority}</span>;
  };

  return (
    <Container className="py-4">
      {/* Page Title */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-card-checklist text-primary me-2"></i>Manage Citizen Grievances
          </h3>
          <p className="text-secondary small mb-0">
            Review complaints, assign Sachivalayam staff, update status, and log progress remarks
          </p>
        </div>
        <Badge bg="light" className="text-dark border px-3 py-2 fs-6">
          Total Records: <strong>{total}</strong>
        </Badge>
      </div>

      {pageAlert && (
        <Alert variant="success" dismissible onClose={() => setPageAlert('')} className="py-2 small mb-4 shadow-sm">
          <i className="bi bi-check-circle-fill me-2"></i>{pageAlert}
        </Alert>
      )}

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
        <Form onSubmit={handleSearchSubmit}>
          <Row className="g-2 align-items-center">
            {/* Search */}
            <Col lg={3} md={6}>
              <Form.Control
                type="text"
                placeholder="ID, resident, or title..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Col>

            {/* Category */}
            <Col lg={3} md={6}>
              <Form.Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Col>

            {/* Status */}
            <Col lg={2} md={4}>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Form.Select>
            </Col>

            {/* Priority */}
            <Col lg={2} md={4}>
              <Form.Select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              >
                <option value="">All Priorities</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </Form.Select>
            </Col>

            {/* Reset */}
            <Col lg={2} md={4} className="text-end">
              <Button variant="outline-secondary" onClick={handleReset} className="w-100">
                <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Master Complaints Table */}
      <div className="portal-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
              <h5 className="fw-bold text-dark">No Grievances Match Search</h5>
              <p className="text-secondary small">Try clearing your filters to view all village complaints.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light small text-secondary">
                  <tr>
                    <th className="ps-3">ID</th>
                    <th>Resident</th>
                    <th>Title & Location</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned Staff</th>
                    <th>Lodged Date</th>
                    <th className="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c._id}>
                      <td className="ps-3">
                        <span className="fw-bold text-primary font-monospace">{c.complaintId}</span>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{c.user?.fullName || 'Resident'}</div>
                        <div className="small text-muted">
                          <i className="bi bi-telephone me-1"></i>{c.user?.mobile || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '200px' }}>
                          {c.title}
                        </div>
                        <div className="small text-muted">
                          <i className="bi bi-geo-alt me-1"></i>{c.location}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border small">{c.category}</span>
                      </td>
                      <td>{getPriorityBadge(c.priority)}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td className="small text-secondary">
                        {c.assignedTo ? (
                          <span className="text-dark fw-semibold">{c.assignedTo}</span>
                        ) : (
                          <span className="text-warning">Unassigned</span>
                        )}
                      </td>
                      <td className="small text-secondary">
                        {new Date(c.complaintDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="text-end pe-3">
                        <Button
                          size="sm"
                          className="btn-portal-primary"
                          onClick={() => openUpdateModal(c)}
                        >
                          <i className="bi bi-pencil-square me-1"></i> Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center">
            <span className="small text-muted">Showing page {page} of {totalPages}</span>
            <Pagination className="mb-0">
              <Pagination.Prev disabled={page <= 1} onClick={() => fetchComplaints(page - 1)} />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item key={i + 1} active={i + 1 === page} onClick={() => fetchComplaints(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next disabled={page >= totalPages} onClick={() => fetchComplaints(page + 1)} />
            </Pagination>
          </div>
        )}
      </div>

      {/* Update & Triage Modal */}
      {selectedComplaint && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton className="bg-primary text-white rounded-top-4">
            <Modal.Title className="fw-bold fs-5">
              <i className="bi bi-clipboard-check me-2"></i>Review Grievance: {selectedComplaint.complaintId}
            </Modal.Title>
          </Modal.Header>

          <Form onSubmit={handleUpdateSubmit}>
            <Modal.Body className="p-4">
              {modalMsg.text && (
                <Alert variant={modalMsg.type} className="py-2 small mb-3">
                  {modalMsg.text}
                </Alert>
              )}

              {/* Information Grid */}
              <div className="row g-3 mb-4 p-3 bg-light rounded-3">
                <Col md={6}>
                  <div className="small text-muted">Resident Name:</div>
                  <div className="fw-bold text-dark">
                    {selectedComplaint.user?.fullName} ({selectedComplaint.user?.wardNumber || 'Ward 1'})
                  </div>
                  <div className="small text-secondary">
                    <i className="bi bi-phone me-1"></i>+91 {selectedComplaint.user?.mobile}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="small text-muted">Category & Priority:</div>
                  <div className="fw-bold text-dark">{selectedComplaint.category}</div>
                  <div className="mt-1 d-flex gap-2">
                    {getPriorityBadge(selectedComplaint.priority)}
                    <StatusBadge status={selectedComplaint.status} />
                  </div>
                </Col>
                <Col xs={12} className="border-top pt-2">
                  <div className="small text-muted">Location / Street Landmark:</div>
                  <div className="fw-semibold text-dark">
                    {selectedComplaint.location}, {selectedComplaint.village}
                  </div>
                </Col>
                <Col xs={12}>
                  <div className="small text-muted">Grievance Description:</div>
                  <div className="p-2 bg-white rounded border small text-dark" style={{ whiteSpace: 'pre-line' }}>
                    {selectedComplaint.description}
                  </div>
                </Col>
                {selectedComplaint.photo && (
                  <Col xs={12} className="border-top pt-2">
                    <div className="small text-muted mb-1">
                      <i className="bi bi-image text-primary me-1"></i>Resident Submitted Photo:
                    </div>
                    <a href={`/uploads/${selectedComplaint.photo}`} target="_blank" rel="noreferrer">
                      <img
                        src={`/uploads/${selectedComplaint.photo}`}
                        alt="Evidence"
                        className="img-thumbnail rounded-3"
                        style={{ maxHeight: '140px' }}
                      />
                    </a>
                  </Col>
                )}
              </div>

              <h6 className="fw-bold text-primary mb-3">
                <i className="bi bi-gear-fill me-1"></i>Administrative Action
              </h6>

              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>Update Status <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    required
                  >
                    <option value="Pending">Pending (Reviewing)</option>
                    <option value="In Progress">In Progress (Work Assigned)</option>
                    <option value="Resolved">Resolved (Issue Fixed)</option>
                    <option value="Rejected">Rejected (Invalid / Duplicate)</option>
                  </Form.Select>
                </Col>

                <Col md={6}>
                  <Form.Label>Assign Sachivalayam Staff</Form.Label>
                  <Form.Control
                    type="text"
                    list="staffOptions"
                    placeholder="e.g. B. Naidu (Water Lines Technician)"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  />
                  <datalist id="staffOptions">
                    {staffList.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </Col>

                <Col xs={12}>
                  <Form.Label>Official Remarks / Action Taken <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    required
                    placeholder="Write clear remarks. These remarks will appear directly on the resident's progress timeline and in their notifications..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                  <Form.Text className="small text-muted">
                    This message will be permanently logged to the progress timeline audit trail.
                  </Form.Text>
                </Col>
              </Row>
            </Modal.Body>

            <Modal.Footer className="bg-light rounded-bottom-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updating} className="btn-portal-success">
                {updating ? 'Saving...' : <><i className="bi bi-check2-circle me-1"></i> Save & Notify Resident</>}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}
    </Container>
  );
}
