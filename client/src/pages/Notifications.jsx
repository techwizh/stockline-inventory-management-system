import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Layout from '../components/Layout';

const typeClass = {
  low_stock: 'unread-low',
  out_of_stock: 'unread-out',
  new_purchase: 'unread-purchase',
  delayed_delivery: 'unread-delay',
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const loadNotifications = () => {
    API.get('/notifications').then((res) => setNotifications(res.data)).catch(() => navigate('/login'));
  };

  useEffect(() => { loadNotifications(); }, []);

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Alerts</div>
          <h1 className="page-title">Notifications</h1>
        </div>
      </div>

      <div className="table-wrap">
        {notifications.length === 0 && <div className="empty-state">No notifications yet.</div>}
        {notifications.map((n) => (
          <div key={n.id} className={`notif ${typeClass[n.type] || ''} ${n.isRead ? 'is-read' : ''}`}>
            <div>
              <div className="notif-type">{n.type.replace('_', ' ')}</div>
              <div className="notif-msg">{n.message}</div>
              <div className="notif-time">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            {!n.isRead && (
              <button className="btn btn-ghost btn-sm" onClick={() => markAsRead(n.id)}>Mark as read</button>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}

export default Notifications;