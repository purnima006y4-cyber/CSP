import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { Pie, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../../services/api';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const [reportData, setReportData] = useState({
    categories: [],
    statuses: [],
    priorities: [],
    monthlyTrend: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/admin/reports');
        if (res.success && res.data) {
          setReportData(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // 1. Category Pie Chart
  const catLabels = reportData.categories.map((c) => c._id);
  const catCounts = reportData.categories.map((c) => c.count);
  const categoryChartData = {
    labels: catLabels.length ? catLabels : ['No Data'],
    datasets: [
      {
        data: catCounts.length ? catCounts : [1],
        backgroundColor: ['#0284c7', '#d97706', '#ca8a04', '#16a34a', '#dc2626', '#9333ea', '#64748b'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  // 2. Status Bar Chart
  const statusMap = { Pending: 0, 'In Progress': 0, Resolved: 0, Rejected: 0 };
  reportData.statuses.forEach((s) => {
    if (statusMap.hasOwnProperty(s._id)) {
      statusMap[s._id] = s.count;
    }
  });

  const statusChartData = {
    labels: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    datasets: [
      {
        label: 'Grievance Count',
        data: [statusMap.Pending, statusMap['In Progress'], statusMap.Resolved, statusMap.Rejected],
        backgroundColor: ['#f59e0b', '#0284c7', '#16a34a', '#dc2626'],
        borderRadius: 6
      }
    ]
  };

  // 3. Monthly Trend Line Chart
  const monthlyLabels = reportData.monthlyTrend.map((m) => m.label);
  const monthlyCounts = reportData.monthlyTrend.map((m) => m.count);
  const monthlyChartData = {
    labels: monthlyLabels.length ? monthlyLabels : ['Nov 2026'],
    datasets: [
      {
        label: 'Grievances Registered',
        data: monthlyCounts.length ? monthlyCounts : [0],
        borderColor: '#0b4f8a',
        backgroundColor: 'rgba(11, 79, 138, 0.1)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#0b4f8a',
        pointRadius: 5
      }
    ]
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/admin/reports/export', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `venkatapuram_grievances_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to download CSV: ' + e.message);
    }
  };

  return (
    <Container className="py-4">
      {/* Header & Controls */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2 no-print">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-bar-chart-line-fill text-primary me-2"></i>Civic Grievance Analytics & Reports
          </h3>
          <p className="text-secondary small mb-0">Official statistical reports for Venkatapuram Gram Panchayat CSP Evaluation</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => window.print()}>
            <i className="bi bi-printer me-1"></i> Print / PDF
          </Button>
          <Button onClick={handleExportCSV} className="btn-portal-success">
            <i className="bi bi-file-earmark-spreadsheet-fill me-1"></i> Export to CSV
          </Button>
        </div>
      </div>

      {/* Official Report Header for Print Mode */}
      <div className="d-none d-print-block text-center mb-4 pb-3 border-bottom">
        <h2 className="fw-bold mb-1">Venkatapuram Gram Panchayat</h2>
        <h4>Civic Grievance Redressal Performance Report</h4>
        <p className="small text-muted mb-0">
          B.Tech Computer Science & Engineering • Community Service Project (CSP) • Generated on {new Date().toLocaleString()}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading Reports...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Charts Row 1 */}
          <Row className="g-4 mb-4">
            {/* Category Pie Chart */}
            <Col lg={6}>
              <div className="portal-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-1">
                  <i className="bi bi-pie-chart text-primary me-2"></i>Category-wise Breakdown
                </h5>
                <p className="small text-muted mb-3">Volume of reported issues by civic problem area</p>
                <div style={{ position: 'relative', height: '280px' }}>
                  <Pie data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </Col>

            {/* Status Bar Chart */}
            <Col lg={6}>
              <div className="portal-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-1">
                  <i className="bi bi-bar-chart-fill text-success me-2"></i>Grievance Status Breakdown
                </h5>
                <p className="small text-muted mb-3">Comparison between pending, in-progress, and resolved complaints</p>
                <div style={{ position: 'relative', height: '280px' }}>
                  <Bar
                    data={statusChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                      plugins: { legend: { display: false } }
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>

          {/* Charts Row 2 */}
          <Row className="g-4 mb-4">
            {/* Monthly Trend */}
            <Col lg={8}>
              <div className="portal-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-1">
                  <i className="bi bi-graph-up text-info me-2"></i>Monthly Grievance Inflow Trend
                </h5>
                <p className="small text-muted mb-3">Number of community complaints filed per month</p>
                <div style={{ position: 'relative', height: '260px' }}>
                  <Line
                    data={monthlyChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                    }}
                  />
                </div>
              </div>
            </Col>

            {/* Summary KPI List */}
            <Col lg={4}>
              <div className="portal-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-3">
                  <i className="bi bi-speedometer text-warning me-2"></i>Resolution Summary
                </h5>
                <div className="d-flex flex-column gap-3">
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span className="small text-muted">Pending Action:</span>
                    <Badge bg="warning" className="text-dark fs-6">{statusMap.Pending}</Badge>
                  </div>
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span className="small text-muted">In Progress:</span>
                    <Badge bg="primary" className="text-white fs-6">{statusMap['In Progress']}</Badge>
                  </div>
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span className="small text-muted">Resolved Successfully:</span>
                    <Badge bg="success" className="text-white fs-6">{statusMap.Resolved}</Badge>
                  </div>
                  <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                    <span className="small text-muted">Rejected / Duplicate:</span>
                    <Badge bg="danger" className="text-white fs-6">{statusMap.Rejected}</Badge>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
