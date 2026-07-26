import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Layout from '../components/Layout';

const emptyForm = {
  name: '', sku: '', category: '', brand: '', barcode: '',
  purchasePrice: '', sellingPrice: '', quantity: '',
};

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadProducts = () => {
    API.get('/products').then((res) => setProducts(res.data)).catch(() => navigate('/login'));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await API.put(`/products/${editingId}`, form);
      else await API.post('/products', form);
      resetForm();
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name, sku: product.sku, category: product.category || '',
      brand: product.brand || '', barcode: product.barcode || '',
      purchasePrice: product.purchasePrice, sellingPrice: product.sellingPrice, quantity: product.quantity,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Catalog</div>
          <h1 className="page-title">Products</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-panel">
        <div className="form-grid">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
          <input name="barcode" placeholder="Barcode" value={form.barcode} onChange={handleChange} />
          <input name="purchasePrice" type="number" placeholder="Purchase Price" value={form.purchasePrice} onChange={handleChange} required />
          <input name="sellingPrice" type="number" placeholder="Selling Price" value={form.sellingPrice} onChange={handleChange} required />
          <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
          <button type="submit" className="btn btn-primary">{editingId ? 'Update Product' : 'Add Product'}</button>
          {editingId && <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>SKU</th><th>Category</th><th>Brand</th>
              <th>Qty</th><th>Purchase</th><th>Selling</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr><td colSpan={8}><div className="empty-state">No products yet — add your first one above.</div></td></tr>
            )}
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td className="mono">{p.sku}</td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td className={`mono ${p.quantity <= 10 ? 'text-warn' : ''}`}>{p.quantity}</td>
                <td className="mono">{p.purchasePrice}</td>
                <td className="mono">{p.sellingPrice}</td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(p)}>Edit</button>{' '}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Products;