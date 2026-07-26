import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Layout from '../components/Layout';

const emptyForm = { companyName: '', contactPerson: '', phone: '', email: '', address: '' };

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadSuppliers = () => {
    API.get('/suppliers').then((res) => setSuppliers(res.data)).catch(() => navigate('/login'));
  };

  useEffect(() => { loadSuppliers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) await API.put(`/suppliers/${editingId}`, form);
      else await API.post('/suppliers', form);
      resetForm();
      loadSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleEdit = (supplier) => {
    setForm({
      companyName: supplier.companyName, contactPerson: supplier.contactPerson || '',
      phone: supplier.phone || '', email: supplier.email || '', address: supplier.address || '',
    });
    setEditingId(supplier.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await API.delete(`/suppliers/${id}`);
      loadSuppliers();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Partners</div>
          <h1 className="page-title">Suppliers</h1>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form-panel">
        <div className="form-grid">
          <input name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} required />
          <input name="contactPerson" placeholder="Contact Person" value={form.contactPerson} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
          <button type="submit" className="btn btn-primary">{editingId ? 'Update Supplier' : 'Add Supplier'}</button>
          {editingId && <button type="button" className="btn btn-ghost" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Company</th><th>Contact</th><th>Phone</th><th>Email</th><th>Address</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {suppliers.length === 0 && (
              <tr><td colSpan={6}><div className="empty-state">No suppliers yet — add your first one above.</div></td></tr>
            )}
            {suppliers.map((s) => (
              <tr key={s.id}>
                <td>{s.companyName}</td>
                <td>{s.contactPerson}</td>
                <td className="mono">{s.phone}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(s)}>Edit</button>{' '}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Suppliers;