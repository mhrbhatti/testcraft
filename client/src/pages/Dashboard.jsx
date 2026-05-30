import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [papers, setPapers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/questions/stats/overview').then(r => setStats(r.data.data));
    api.get('/generate/papers').then(r => setPapers(r.data.data.slice(0, 5)));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your test paper generator</p>
        </div>
        <button className="btn-primary btn-lg" onClick={() => navigate('/generate')}>
          ⚡ Generate Test
        </button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Questions', value: stats?.total ?? '—', color: 'var(--ink)' },
          { label: 'MCQs',            value: stats?.mcqs ?? '—',  color: 'var(--accent)' },
          { label: 'Short Qs',        value: stats?.shorts ?? '—', color: 'var(--success)' },
          { label: 'Long Qs',         value: stats?.longs ?? '—', color: 'var(--warning)' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="label">{s.label}</div>
            <div className="value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Recent papers */}
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Recent Papers</h2>
          {papers.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 32 }}>📄</div>
              <p>No papers yet. Generate your first test!</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {papers.map(p => (
                  <tr key={p._id} style={{ cursor: 'pointer' }} onClick={() => navigate('/papers')}>
                    <td style={{ fontWeight: 500 }}>{p.title}</td>
                    <td><span className="badge badge-blue">{p.testType}</span></td>
                    <td>{p.totalMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* By chapter */}
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Questions by Chapter</h2>
          {stats?.byChapter?.length === 0 && (
            <div className="empty-state">
              <div style={{ fontSize: 32 }}>📚</div>
              <p>No chapters yet. Add some questions!</p>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(stats?.byChapter || []).map(c => (
              <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, color: 'var(--ink)' }}>{c._id}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    height: 6, borderRadius: 3, background: 'var(--accent)',
                    width: Math.max(20, (c.count / (stats?.total || 1)) * 120),
                  }} />
                  <span style={{ fontSize: 13, color: 'var(--ink2)', minWidth: 24, textAlign: 'right' }}>{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
