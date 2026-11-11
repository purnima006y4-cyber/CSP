import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    } catch (e) {
      // Quiet fail if network/auth drops
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // 15s poll
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  return (
    <Dropdown align="end">
      <Dropdown.Toggle as="button" className="btn btn-link text-dark position-relative p-2 border-0 shadow-none">
        <i className="bi bi-bell-fill fs-5 text-secondary"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
            {unreadCount}
          </span>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="shadow border-0 rounded-3 p-0" style={{ width: '320px', maxHeight: '400px', overflowY: 'auto' }}>
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light rounded-top-3">
          <span className="fw-bold small text-dark">Notifications</span>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="btn btn-link btn-sm p-0 text-decoration-none small text-primary">
              Mark all read
            </button>
          )}
        </div>

        <div className="p-2">
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-muted small">No notifications yet.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-2 mb-1 rounded small ${n.isRead ? 'bg-white' : 'bg-primary-subtle border-start border-3 border-primary'}`}
              >
                <div className="d-flex justify-content-between mb-1">
                  {n.complaint ? (
                    <Link to={`/track?cid=${n.complaint.complaintId}`} className="fw-bold text-decoration-none text-primary">
                      {n.complaint.complaintId}
                    </Link>
                  ) : (
                    <span className="fw-bold">Grievance Update</span>
                  )}
                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="mb-0 text-secondary" style={{ fontSize: '0.8rem' }}>
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
