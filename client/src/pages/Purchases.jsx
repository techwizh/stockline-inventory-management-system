import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Layout from '../components/Layout';

const emptyForm = { productId: '', supplierId: '', quantity: '', unitPrice: '' };

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const loadData = () => {
    API.get('/purchases').then((res) => setPurchases(res.data)).catch(() => navigate('/login'));
    API.get('/products').then((res) => setProducts(res.data));
    API.get('/suppliers').then((res) => setSuppliers(res.data));
  };

  useEffect(() => { loadData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const res = await API.post('/purchases', form);
      setMessage(`Purchase recorded. New stock level: ${res.data.updatedStock}`);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const getProductName = (id) => products.find((p) => p.id === id)?.name || `#${id}`;
  const getSupplierName = (id) => suppliers.find((s) => s.id === id)?.companyName || `#${id}`;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Stock In</div>
          <h1 className="page-title">Purchases</h1>
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
          <select name="supplierId" value={form.supplierId} onChange={handleChange} required>
            <option value="">Select Supplier</option>
            {suppliers.map((s) => <option key={s.id} value={s.id}>{s.companyName}</option>)}
          </select>
          <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
          <input name="unitPrice" type="number" placeholder="Unit Price" value={form.unitPrice} onChange={handleChange} required />
          <button type="submit" className="btn btn-primary">Record Purchase</button>
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Product</th><th>Supplier</th><th>Qty</th><th>Unit Price</th><th>Total</th><th>Date</th></tr>
          </thead>
          <tbody>
            {purchases.length === 0 && (
              <tr><td colSpan={6}><div className="empty-state">No purchases recorded yet.</div></td></tr>
            )}
            {purchases.map((p) => (
              <tr key={p.id}>
                <td>{getProductName(p.productId)}</td>
                <td>{getSupplierName(p.supplierId)}</td>
                <td className="mono">{p.quantity}</td>
                <td className="mono">{p.unitPrice}</td>
                <td className="mono">{p.totalAmount}</td>
                <td className="text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Purchases;