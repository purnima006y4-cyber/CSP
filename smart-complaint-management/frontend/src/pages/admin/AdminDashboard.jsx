import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, ProgressBar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    totalUsers: 0,
    resolutionRate: 0,
    categoryBreakdown: {}
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, complaintsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/complaints?limit=6')
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (complaintsRes.success) setRecentComplaints(complaintsRes.data);
      } catch (e) {
        console.error('[Admin Dashboard fetch error]', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  // Category Doughnut Chart Config
  const chartLabels = Object.keys(stats.categoryBreakdown || {});
  const chartDataValues = Object.values(stats.categoryBreakdown || {});

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartDataValues.length ? chartDataValues : [1],
        backgroundColor: [
          '#0284c7', // Water
          '#d97706', // Roads
          '#ca8a04', // Lights
          '#16a34a', // Drainage
          '#dc2626', // Garbage
          '#9333ea', // Electricity
          '#64748b'  // Other
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 12, font: { size: 11 } }
      }
    }
  };

  return (
    <Container className="py-4">
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-speedometer2 text-primary me-2"></i>Administration Overview
          </h3>
          <p className="text-secondary small mb-0">
            Venkatapuram Gram Panchayat Grievance Monitoring & Resolution System
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/reports" className="btn btn-outline-secondary">
            <i className="bi bi-file-earmark-spreadsheet me-1"></i> Analytics & Reports
          </Link>
          <Link to="/admin/complaints" className="btn btn-portal-primary">
            <i className="bi bi-list-check me-1"></i> Manage All Grievances
          </Link>
        </div>
      </div>

      {/* 5 KPI Stat Cards */}
      <Row className="g-3 mb-4">
        <Col xl md={4} sm={6}>
          <StatCard type="total" icon="bi-inbox-fill" value={stats.total} label="Total Logged" />
        </Col>
        <Col xl md={4} sm={6}>
          <StatCard type="pending" icon="bi-clock-history" value={stats.pending} label="Pending Review" />
        </Col>
        <Col xl md={4} sm={6}>
          <StatCard type="progress" icon="bi-gear-wide-connected" value={stats.inProgress} label="In Progress" />
        </Col>
        <Col xl md={6} sm={6}>
          <StatCard type="resolved" icon="bi-check2-all" value={stats.resolved} label="Resolved" />
        </Col>
        <Col xl md={6} sm={12}>
          <div className="stat-card" style={{ borderLeft: '4px solid #6366f1' }}>
            <div className="stat-card-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>
              <i className="bi bi-people-fill"></i>
            </div>
            <div>
              <div className="stat-card-val">{stats.totalUsers}</div>
              <div className="stat-card-lbl">Residents Registered</div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Chart.js & Efficiency Metrics */}
      <Row className="g-4 mb-4">
        {/* Category Breakdown Chart */}
        <Col lg={6}>
          <div className="portal-card h-100 p-4">
            <h5 className="fw-bold text-dark mb-1">
              <i className="bi bi-pie-chart-fill text-primary me-2"></i>Grievances by Category
            </h5>
            <p className="small text-muted mb-4">Distribution across 6 civic problem categories</p>
            <div style={{ position: 'relative', height: '280px' }}>
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          </div>
        </Col>

        {/* Resolution Efficiency */}
        <Col lg={6}>
          <div className="portal-card h-100 p-4">
            <h5 className="fw-bold text-dark mb-1">
              <i className="bi bi-graph-up-arrow text-success me-2"></i>Panchayat Redressal Metrics
            </h5>
            <p className="small text-muted mb-3">Target vs actual resolution performance in Venkatapuram</p>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-semibold small text-dark">Overall Resolution Completion</span>
                <span className="fw-bold text-success">{stats.resolutionRate}%</span>
              </div>
              <ProgressBar now={stats.resolutionRate} variant="success" animated striped style={{ height: '12px' }} />
            </div>

            <Row className="g-3 mb-4">
              <Col xs={6}>
                <div className="p-3 bg-light rounded-3 text-center border">
                  <span className="d-block text-muted small">Average Response Time</span>
                  <span className="fs-4 fw-bold text-primary">24.5 Hrs</span>
                  <br />
                  <span className="badge bg-success-subtle text-success small">Within 72h SLA</span>
                </div>
              </Col>
              <Col xs={6}>
                <div className="p-3 bg-light rounded-3 text-center border">
                  <span className="d-block text-muted small">Pending Attention</span>
                  <span className="fs-4 fw-bold text-warning">{stats.pending}</span>
                  <br />
                  <span className="badge bg-warning-subtle text-dark small">Action Required</span>
                </div>
              </Col>
            </Row>

            <div className="border-top pt-3 d-flex justify-content-between align-items-center">
              <span className="small text-muted">Field Staff Status: <strong>5 Active Technicians</strong></span>
              <Link to="/admin/complaints?status=Pending" className="btn btn-sm btn-outline-warning">
                <i className="bi bi-clock me-1"></i> Review {stats.pending} Pending
              </Link>
            </div>
          </div>
        </Col>
      </Row>

      {/* Recent Grievances Master Table */}
      <div className="portal-card mb-4">
        <div className="portal-card-header d-flex justify-content-between align-items-center">
          <span className="fs-6 fw-bold">
            <i className="bi bi-clock-history text-primary me-2"></i>Recently Lodged Grievances
          </span>
          <Link to="/admin/complaints" className="small fw-semibold text-decoration-none">
            View All Complaints <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light small text-secondary">
                <tr>
                  <th className="ps-3">Complaint ID</th>
                  <th>Resident</th>
                  <th>Title & Location</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Assigned Staff</th>
                  <th>Date</th>
                  <th className="text-end pe-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">No grievances logged yet.</td>
                  </tr>
                ) : (
                  recentComplaints.map((c) => (
                    <tr key={c._id}>
                      <td className="ps-3">
                        <span className="fw-bold text-primary font-monospace">{c.complaintId}</span>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{c.user?.fullName || 'Resident'}</div>
                        <div className="small text-muted">{c.user?.wardNumber || 'Ward 1'}</div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '200px' }}>
                          {c.title}
                        </div>
                        <div className="small text-muted">{c.location}</div>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border small">{c.category}</span>
                      </td>
                      <td><StatusBadge status={c.status} /></td>
                      <td className="small text-secondary">{c.assignedTo || 'Unassigned'}</td>
                      <td className="small text-secondary">
                        {new Date(c.complaintDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="text-end pe-3">
                        <Link to={`/admin/complaints?search=${c.complaintId}`} className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-pencil-square"></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Container>
  );
}
