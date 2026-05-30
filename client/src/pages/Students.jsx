import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Students() {
  const [results, setResults]   = useState([]);
  const [students, setStudents] = useState([]);
  const [tab, setTab]           = useState('results');
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/results'),
      api.get('/admin/students'),
    ]).then(([r, s]) => {
      setResults(r.data.data);
      setStudents(s.data.data);
    }).finally(() => setLoading(false));
  }, []);

  function fmt(d) {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{students.length} registered · {results.length} quiz attempts</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--paper)', padding: 4, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', width: 'fit-content' }}>
        {[{ key: 'results', label: '📊 Results' }, { key: 'students', label: '👥 Students' }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 20px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 14,
            background: tab === t.key ? 'var(--surface)' : 'transparent',
            color: tab === t.key ? 'var(--accent)' : 'var(--ink2)',
            boxShadow: tab === t.key ? 'var(--shadow)' : 'none',
            cursor: 'pointer',
          }}>{t.label}</button>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" /></div>}

      {/* Results tab */}
      {!loading && tab === 'results' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {results.length === 0 ? (
            <div className="empty-state"><div style={{ fontSize: 36 }}>📭</div><h3 style={{ marginTop: 12 }}>No quiz attempts yet</h3></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Chapter</th>
                  <th>Score</th>
                  <th>Correct</th>
                  <th>Wrong</th>
                  <th>XP</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                    <td>{r.classLevel === '13' ? '1st Year' : r.classLevel === '14' ? '2nd Year' : `Class ${r.classLevel}`}</td>
                    <td style={{ color: 'var(--ink2)' }}>{r.chapter}</td>
                    <td>
                      <span style={{
                        padding: '2px 10px', borderRadius: 99, fontWeight: 700, fontSize: 13,
                        background: r.score >= 80 ? 'var(--success-light)' : r.score >= 50 ? 'var(--warning-light)' : 'var(--danger-light)',
                        color: r.score >= 80 ? 'var(--success)' : r.score >= 50 ? 'var(--warning)' : 'var(--danger)',
                      }}>{r.score}%</span>
                    </td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{r.correct}</td>
                    <td style={{ color: 'var(--danger)',  fontWeight: 600 }}>{r.wrong}</td>
                    <td style={{ color: 'var(--accent)',  fontWeight: 600 }}>+{r.xpEarned}</td>
                    <td style={{ color: 'var(--ink3)', fontSize: 13 }}>{fmt(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Students tab */}
      {!loading && tab === 'students' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {students.length === 0 ? (
            <div className="empty-state"><div style={{ fontSize: 36 }}>👥</div><h3 style={{ marginTop: 12 }}>No students yet</h3></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Class</th>
                  <th>XP</th>
                  <th>Streak</th>
                  <th>Badges</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ color: 'var(--ink2)', fontSize: 13 }}>{s.email}</td>
                    <td>{s.classLevel === '13' ? '1st Year' : s.classLevel === '14' ? '2nd Year' : `Class ${s.classLevel}`}</td>
                    <td style={{ color: 'var(--accent)', fontWeight: 600 }}>⭐ {s.xp}</td>
                    <td style={{ fontWeight: 600 }}>🔥 {s.streak}</td>
                    <td style={{ fontSize: 16 }}>{s.badges?.map(b => ({ first_quiz:'🎯', perfect_score:'💯', week_streak:'🔥', month_streak:'⚡', xp_500:'🌟', xp_1000:'👑' }[b] || '🎖️')).join(' ') || '—'}</td>
                    <td style={{ color: 'var(--ink3)', fontSize: 13 }}>{fmt(s.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
