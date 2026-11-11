import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ward, setWard] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (ward) params.append('ward', ward);

      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res.success) {
        setUsers(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [ward]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleReset = () => {
    setSearch('');
    setWard('');
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-people-fill text-primary me-2"></i>Registered Village Residents
          </h3>
          <p className="text-secondary small mb-0">Directory of Venkatapuram citizens enrolled on the grievance portal</p>
        </div>
        <Badge bg="light" className="text-dark border px-3 py-2 fs-6">
          Total Residents: <strong>{users.length}</strong>
        </Badge>
      </div>

      {/* Filter / Search */}
      <div className="card shadow-sm border-0 rounded-4 p-3 mb-4 bg-white">
        <Form onSubmit={handleSearchSubmit}>
          <Row className="g-2 align-items-center">
            <Col lg={6} md={6}>
              <Form.Control
                type="text"
                placeholder="Search by resident name, mobile (+91), or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col lg={3} md={3}>
              <Form.Select value={ward} onChange={(e) => setWard(e.target.value)}>
                <option value="">All Wards (వార్డులు)</option>
                {[1, 2, 3, 4, 5, 6].map((w) => (
                  <option key={w} value={`Ward ${w}`}>
                    Ward {w}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={3} md={3}>
              <div className="d-flex gap-2">
                <Button type="submit" className="btn-portal-primary w-100">
                  <i className="bi bi-search me-1"></i> Search
                </Button>
                <Button variant="outline-secondary" onClick={handleReset} title="Reset">
                  <i className="bi bi-arrow-counterclockwise"></i>
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Users Master Table */}
      <div className="portal-card">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people fs-1 text-muted d-block mb-2"></i>
              <h5 className="fw-bold text-dark">No Residents Found</h5>
              <p className="text-secondary small">No residents match your search criteria.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="table-light small text-secondary">
                  <tr>
                    <th className="ps-3">Resident Name</th>
                    <th>Contact Information</th>
                    <th>Ward & Address</th>
                    <th>Total Grievances</th>
                    <th>Pending</th>
                    <th>Resolved</th>
                    <th>Enrolled Date</th>
                    <th className="text-end pe-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="ps-3">
                        <div className="fw-bold text-dark">{u.fullName}</div>
                        <span className="badge bg-success-subtle text-success small">Resident</span>
                      </td>
                      <td>
                        <div>
                          <i className="bi bi-phone me-1 text-success"></i>+91 {u.mobile}
                        </div>
                        <div className="small text-muted">
                          <i className="bi bi-envelope me-1 text-secondary"></i>{u.email}
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{u.wardNumber || 'Ward 1'}</div>
                        <div className="small text-muted text-truncate" style={{ maxWidth: '180px' }}>
                          {u.address || 'Venkatapuram'}
                        </div>
                      </td>
                      <td>
                        <Badge bg="light" className="text-primary border fs-6 px-2 py-1">
                          {u.complaintStats?.total || 0}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg="warning" className="text-dark px-2 py-1">
                          {u.complaintStats?.pending || 0}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg="success" className="text-white px-2 py-1">
                          {u.complaintStats?.resolved || 0}
                        </Badge>
                      </td>
                      <td className="small text-secondary">
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="text-end pe-3">
                        <Link
                          to={`/admin/complaints?search=${u.mobile}`}
                          className="btn btn-sm btn-outline-primary"
                          title="View Resident Grievances"
                        >
                          <i className="bi bi-card-list me-1"></i> View Grievances
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
