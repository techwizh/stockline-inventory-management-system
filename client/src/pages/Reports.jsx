import API from '../api';
import Layout from '../components/Layout';

function Reports() {
  const downloadReport = async (type) => {
    try {
      const res = await API.get(`/reports/inventory/${type}`, { responseType: 'blob' });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `inventory_report.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download report');
    }
  };

  return (
    <Layout>
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Exports</div>
          <h1 className="page-title">Reports</h1>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 6 }}>Inventory Report</h3>
        <p className="text-muted" style={{ marginBottom: 16 }}>
          Full list of products with current stock and value.
        </p>
        <button className="btn btn-primary" style={{ marginRight: 10 }} onClick={() => downloadReport('excel')}>
          Download Excel
        </button>
        <button className="btn" onClick={() => downloadReport('pdf')}>
          Download PDF
        </button>
      </div>
    </Layout>
  );
}

export default Reports;