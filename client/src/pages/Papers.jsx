import React, { useEffect, useState } from 'react';
import api from '../api';

const TYPE_BADGE = {
  'class-test':    'badge-blue',
  'revision-test': 'badge-green',
  'flp':           'badge-amber',
};

const TYPE_LABEL = {
  'class-test':    'Class Test',
  'revision-test': 'Revision Test',
  'flp':           'FLP',
};

export default function Papers() {
  const [papers, setPapers]   = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await api.get('/generate/papers');
    setPapers(r.data.data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this paper?')) return;
    await api.delete(`/generate/papers/${id}`);
    load();
  }

  function fmt(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Saved Papers</h1>
          <p className="page-subtitle">{papers.length} paper{papers.length !== 1 ? 's' : ''} generated</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div>
        ) : papers.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 40 }}>📄</div>
            <h3 style={{ marginTop: 12 }}>No papers yet</h3>
            <p>Go to Generate Test to create your first paper.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Chapters</th>
                <th>Marks</th>
                <th>Date</th>
                <th>Export</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {papers.map(p => (
                <tr key={p._id}>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td><span className={`badge ${TYPE_BADGE[p.testType]}`}>{TYPE_LABEL[p.testType]}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--ink2)' }}>
                    {p.chapters?.join(', ') || '—'}
                  </td>
                  <td style={{ fontWeight: 500 }}>{p.totalMarks}</td>
                  <td style={{ color: 'var(--ink3)', fontSize: 13 }}>{fmt(p.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                    
<button
  className="btn-secondary btn-sm"
  onClick={async () => {
    const res = await fetch(`/api/export/pdf/${p._id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.title.replace(/\s+/g, '_')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }}
>
  PDF
</button>

<button
  className="btn-secondary btn-sm"
  onClick={async () => {
    const res = await fetch(`/api/export/word/${p._id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${p.title.replace(/\s+/g, '_')}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }}
>
  Word
</button>
                    </div>
                  </td>
                  <td>
                    <button className="btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
