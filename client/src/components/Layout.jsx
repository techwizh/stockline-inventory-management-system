import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api';

const navItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/products', label: 'Products' },
  { path: '/suppliers', label: 'Suppliers' },
  { path: '/purchases', label: 'Purchases' },
  { path: '/sales', label: 'Sales' },
  { path: '/notifications', label: 'Notifications' },
  { path: '/reports', label: 'Reports' },
];

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    API.get('/notifications')
      .then((res) => setUnreadCount(res.data.filter((n) => !n.isRead).length))
      .catch(() => {});
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-name">STOCKLINE</div>
          <div className="brand-sub">Inventory Control</div>
          <div className="barcode" />
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span>{item.label}</span>
              {item.path === '/notifications' && unreadCount > 0 && (
                <span className="nav-badge">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <>
              <div className="user-role">{user.role}</div>
              <div className="user-name">{user.name}</div>
            </>
          )}
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 10, width: '100%' }} onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}

export default Layout;