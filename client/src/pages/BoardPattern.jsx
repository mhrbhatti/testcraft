import React, { useState, useEffect } from 'react';
import api from '../api';

export default function BoardPattern({ onPaperReady }) {
  const [subjects, setSubjects]     = useState([]);
  const [subject, setSubject]       = useState('Computer Science');
  const [classLevel, setClassLevel] = useState('13');
  const [testNo, setTestNo]         = useState('1');
  const [difficulty, setDifficulty] = useState('any');
  const [chapters, setChapters]     = useState([]);
  const [pairing, setPairing]       = useState({});
  const [generating, setGenerating] = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    api.get('/questions/subjects').then(r => setSubjects(r.data.data));
  }, []);

  useEffect(() => {
    if (!subject) return;
    api.get('/questions/chapters', { params: { subject } }).then(r => {
      setChapters(r.data.data);
      const p = {};
      r.data.data.forEach(ch => {
        p[ch] = { mcqCount: 0, shortGroup: 0, longSlot: 0 };
      });
      setPairing(p);
    });
  }, [subject]);

  function setPair(ch, key, val) {
    setPairing(prev => ({ ...prev, [ch]: { ...prev[ch], [key]: Number(val) } }));
  }

  // Summary totals
  const totalMCQ   = Object.values(pairing).reduce((s, p) => s + (p.mcqCount  || 0), 0);
  const totalShort = Object.values(pairing).filter(p => p.shortGroup > 0).length * 3; // ~3 per chapter
  const totalLong  = Object.values(pairing).filter(p => p.longSlot  > 0).length;
  const totalMarks = totalMCQ * 1 + totalShort * 2 + totalLong * 8;

  async function handleGenerate() {
    setError('');
    const activePairing = Object.entries(pairing)
      .filter(([, p]) => p.mcqCount > 0 || p.shortGroup > 0 || p.longSlot > 0)
      .map(([chapter, p]) => ({ chapter, ...p }));

    if (activePairing.length === 0)
      return setError('Set at least one chapter in the pairing scheme.');

    setGenerating(true);
    try {
      const r = await api.post('/board/generate', {
        subject, classLevel, testNo, difficulty,
        pairing: activePairing,
      });
      onPaperReady(r.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Make sure enough questions exist per chapter.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      {error && <div className="alert alert-error">{error}</div>}

      {/* Settings */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 14 }}>Board Pattern Settings</h3>
        <div className="grid-2">
          <div className="form-group" style={{ margin: 0 }}>
            <label>Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Difficulty</label>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="any">Any / Mixed</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Class</label>
            <select value={classLevel} onChange={e => setClassLevel(e.target.value)}>
              {['7','8','9','10','11','12','13','14'].map(c => (
                <option key={c} value={c}>
                  {c === '13' ? '1st Year' : c === '14' ? '2nd Year' : `Class ${c}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Test No.</label>
            <input value={testNo} onChange={e => setTestNo(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Pairing scheme table */}
      <div className="card" style={{ marginBottom: 16, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>Pairing Scheme</h3>
            <p style={{ fontSize: 13, color: 'var(--ink2)', marginTop: 2 }}>
              Set how many MCQs from each chapter, which short question group (Q2/Q3/Q4), and which long question slot. System auto-picks questions.
            </p>
          </div>
        </div>

        {chapters.length === 0 ? (
          <div className="empty-state"><p>No chapters found for this subject.</p></div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--paper)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 12, color: 'var(--ink2)', textTransform: 'uppercase' }}>Chapter</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase' }}>MCQs</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 12, color: 'var(--success)', textTransform: 'uppercase' }}>Short Group</th>
                <th style={{ textAlign: 'center', padding: '10px 12px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 12, color: 'var(--warning)', textTransform: 'uppercase' }}>Long Slot</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map(ch => {
                const p = pairing[ch] || { mcqCount: 0, shortGroup: 0, longSlot: 0 };
                const active = p.mcqCount > 0 || p.shortGroup > 0 || p.longSlot > 0;
                return (
                  <tr key={ch} style={{ background: active ? 'var(--accent-light)' : 'var(--surface)' }}>
                    <td style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', fontWeight: active ? 600 : 400 }}>{ch}</td>
                    <td style={{ padding: '6px 12px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                      <input
                        type="number" min={0} max={15}
                        value={p.mcqCount || 0}
                        onChange={e => setPair(ch, 'mcqCount', e.target.value)}
                        style={{ width: 56, textAlign: 'center', padding: '5px 6px' }}
                      />
                    </td>
                    <td style={{ padding: '6px 12px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                      <select
                        value={p.shortGroup || 0}
                        onChange={e => setPair(ch, 'shortGroup', e.target.value)}
                        style={{ width: 90 }}
                      >
                        <option value={0}>None</option>
                        <option value={1}>Q.2</option>
                        <option value={2}>Q.3</option>
                        <option value={3}>Q.4</option>
                        <option value={4}>Q.5</option>
                        <option value={5}>Q.6</option>
                      </select>
                    </td>
                    <td style={{ padding: '6px 12px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                      <select
                        value={p.longSlot || 0}
                        onChange={e => setPair(ch, 'longSlot', e.target.value)}
                        style={{ width: 90 }}
                      >
                        <option value={0}>None</option>
                        <option value={1}>Q.5</option>
                        <option value={2}>Q.6</option>
                        <option value={3}>Q.7</option>
                        <option value={4}>Q.8</option>
                        <option value={5}>Q.9</option>
                        <option value={6}>Q.10</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      {totalMCQ > 0 || totalLong > 0 ? (
        <div className="card" style={{ marginBottom: 16, background: 'var(--accent-light)', border: '1px solid #bfdbfe', padding: '14px 18px' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Paper Summary</div>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
            {[
              { label: 'MCQs',       val: totalMCQ,   color: 'var(--accent)',  marks: `${totalMCQ} marks` },
              { label: 'Short Qs',   val: `~${totalShort}`, color: 'var(--success)', marks: `~${totalShort * 2} marks` },
              { label: 'Long Qs',    val: totalLong,  color: 'var(--warning)', marks: `${totalLong * 8} marks` },
              { label: 'Total',      val: `~${totalMarks}`, color: 'var(--ink)',    marks: 'marks' },
            ].map(({ label, val, color, marks }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: 'var(--ink3)', textTransform: 'uppercase', fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
                <div style={{ fontSize: 11, color: 'var(--ink3)' }}>{marks}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--ink2)' }}>
            ℹ️ Short question count is approximate (~3 per chapter). Exact count depends on available questions.
          </div>
        </div>
      ) : null}

      <button
        className="btn-primary btn-lg"
        style={{ width: '100%' }}
        onClick={handleGenerate}
        disabled={generating || (totalMCQ === 0 && totalLong === 0)}
      >
        {generating
          ? <><span className="spinner" style={{ width: 16, height: 16, marginRight: 8 }} />Generating Board Paper...</>
          : '🏫 Generate Board Pattern Paper'}
      </button>
    </div>
  );
}
