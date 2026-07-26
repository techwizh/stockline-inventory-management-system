import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Layout from '../components/Layout';

const emptyForm = { productId: '', customerName: '', quantity: '', unitPrice: '', paymentStatus: 'paid' };

const statusPill = { paid: 'pill-success', pending: 'pill-warning', partial: 'pill-info' };

function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const loadData = () => {
    API.get('/sales').then((res) => setSales(res.data)).catch(() => navigate('/login'));
    API.get('/products').then((res) => setProducts(res.data));
  };

  useEffect(() => { loadData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const res = await API.post('/sales', form);
      setMessage(`Sale recorded. Remaining stock: ${res.data.updatedStock}`);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const getProductName = (id) => products.find((p) => p.id === id)?.name || `#${id}`;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Stock Out</div>
          <h1 className="page-title">Sales</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <form onSubmit={handleSubmit} className="form-panel">
        <div className="form-grid">
          <select name="productId" value={form.productId} onChange={handleChange} required>
            <option value="">Select Product</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
          </select>
          <input name="customerName" placeholder="Customer Name" value={form.customerName} onChange={handleChange} required />
          <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
          <input name="unitPrice" type="number" placeholder="Unit Price" value={form.unitPrice} onChange={handleChange} required />
          <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
          </select>
          <button type="submit" className="btn btn-primary">Record Sale</button>
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Product</th><th>Customer</th><th>Qty</th><th>Unit Price</th><th>Total</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr><td colSpan={7}><div className="empty-state">No sales recorded yet.</div></td></tr>
            )}
            {sales.map((s) => (
              <tr key={s.id}>
                <td>{getProductName(s.productId)}</td>
                <td>{s.customerName}</td>
                <td className="mono">{s.quantity}</td>
                <td className="mono">{s.unitPrice}</td>
                <td className="mono">{s.totalAmount}</td>
                <td><span className={`pill ${statusPill[s.paymentStatus] || ''}`}>{s.paymentStatus}</span></td>
                <td className="text-muted">{new Date(s.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Sales;