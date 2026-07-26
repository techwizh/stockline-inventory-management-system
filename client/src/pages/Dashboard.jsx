import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Layout from '../components/Layout';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => navigate('/login'));
  }, []);

  if (!stats) return <Layout><p className="text-muted">Loading…</p></Layout>;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Overview</div>
          <h1 className="page-title">Dashboard</h1>
        </div>
      </div>

      <div className="stat-grid">
        <Card label="Total Products" value={stats.totalProducts} />
        <Card label="Categories" value={stats.totalCategories} />
        <Card label="Low Stock Items" value={stats.lowStockCount} warn={stats.lowStockCount > 0} />
        <Card label="Inventory Value" value={stats.inventoryValue} />
        <Card label="Today's Sales" value={stats.todaysSalesTotal} />
        <Card label="Monthly Revenue" value={stats.monthlyRevenue} />
      </div>
    </Layout>
  );
}

function Card({ label, value, warn }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className={`stat-value ${warn ? 'warn' : ''}`}>{value}</div>
    </div>
  );
}

export default Dashboard;