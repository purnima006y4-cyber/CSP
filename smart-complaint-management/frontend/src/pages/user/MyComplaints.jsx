import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Pagination, Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function MyComplaints() {
  const { t } = useTranslation();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    priority: ''
  });

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

  const fetchComplaints = async (currentPage = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 8,
        ...filters
      });

      // Remove empty params
      for (const [key, val] of [...queryParams.entries()]) {
        if (!val) queryParams.delete(key);
      }

      const res = await api.get(`/complaints/my?${queryParams.toString()}`);
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
    setPage(1);
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
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/dashboard' }}>
          {t('nav_dashboard')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('nav_my_complaints')}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-collection-fill text-primary me-2"></i>
            {t('nav_my_complaints')}
          </h3>
          <p className="text-secondary small mb-0">Complete history of all civic grievances filed from your account</p>
        </div>
        <Link to="/complaints/new" className="btn btn-portal-success">
          <i className="bi bi-plus-circle me-1"></i> {t('nav_register_cmp')}
        </Link>
      </div>

      {/* Search & Filter Card */}
      <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
        <Form onSubmit={handleSearchSubmit}>
          <Row className="g-2 align-items-center">
            {/* Search Input */}
            <Col lg={4} md={12}>
              <Form.Control
                type="text"
                placeholder={t('search_placeholder')}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Col>

            {/* Category Filter */}
            <Col lg={3} md={4}>
              <Form.Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Status Filter */}
            <Col lg={2} md={4}>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Priority Filter */}
            <Col lg={2} md={4}>
              <Form.Select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              >
                <option value="">All Priorities</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Reset */}
            <Col lg={1} md={12} className="text-end">
              <Button variant="outline-secondary" onClick={handleReset} className="w-100" title="Reset Filters">
                <i className="bi bi-arrow-counterclockwise"></i>
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Complaints Table */}
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
              <i className="bi bi-card-checklist fs-1 text-muted d-block mb-2"></i>
              <h5 className="fw-bold text-dark">No Complaints Found</h5>
              <p className="text-secondary small mb-3">No grievances match your current search or filter criteria.</p>
              <Link to="/complaints/new" className="btn btn-sm btn-portal-primary">
                <i className="bi bi-plus-circle me-1"></i> File a New Grievance
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light small text-secondary">
                  <tr>
                    <th className="ps-3">Complaint ID</th>
                    <th>Title & Location</th>
                    <th>Category</th>
                    <th>Priority</th>
                    <th>Current Status</th>
                    <th>Lodged Date</th>
                    <th className="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c._id}>
                      <td className="ps-3">
                        <Link to={`/track?cid=${c.complaintId}`} className="fw-bold text-decoration-none text-primary">
                          {c.complaintId}
                        </Link>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{c.title}</div>
                        <div className="small text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {c.location}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border">{c.category}</span>
                      </td>
                      <td>{getPriorityBadge(c.priority)}</td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="small text-secondary">
                        {new Date(c.complaintDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="text-end pe-3">
                        <Link to={`/track?cid=${c.complaintId}`} className="btn btn-sm btn-outline-primary" title="View Progress Timeline">
                          <i className="bi bi-eye-fill me-1"></i> View Progress
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center">
            <span className="small text-muted">
              Showing page {page} of {totalPages} ({total} records total)
            </span>
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
    </Container>
  );
}
