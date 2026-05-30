import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import BoardPattern from './BoardPattern';

// ── Constants ─────────────────────────────────────────────────────────────────
const TEST_TYPES = [
  { value: 'class-test',    label: 'Class Test',    marks: 25, time: '1 Hour',    desc: '5 MCQ · 5 Short · 1 Long' },
  { value: 'revision-test', label: 'Revision Test', marks: 30, time: '1.5 Hours', desc: '8 MCQ · 7 Short · 1 Long' },
  { value: 'flp',           label: 'FLP',           marks: 50, time: '2 Hours',   desc: '10 MCQ · Groups · 2 Long' },
];

const TEST_SCHEMAS = {
  'class-test': {
    name: 'Class Test', totalMarks: 25, time: '1 Hour',
    sections: [
      { type: 'mcq',   count: 5, marksEach: 1 },
      { type: 'short', count: 5, marksEach: 2, attempt: 5 },
      { type: 'long',  count: 1, marksEach: 8 },
    ],
  },
  'revision-test': {
    name: 'Revision Test', totalMarks: 30, time: '1.5 Hours',
    sections: [
      { type: 'mcq',   count: 8, marksEach: 1 },
      { type: 'short', count: 7, marksEach: 2, attempt: 7 },
      { type: 'long',  count: 1, marksEach: 8 },
    ],
  },
  'flp': {
    name: 'FLP', totalMarks: 50, time: '2 Hours',
    sections: [
      { type: 'mcq',   count: 10, marksEach: 1 },
      { type: 'short', groups: 3, questionsPerGroup: 6, attemptPerGroup: 4, marksEach: 2, totalQuestionsNeeded: 18 },
      { type: 'long',  totalQuestions: 3, attempt: 2, marksEach: 8 },
    ],
  },
};

const TYPE_COLOR = { mcq: 'var(--accent)', short: 'var(--success)', long: 'var(--warning)' };
const TYPE_BADGE = { mcq: 'badge-blue', short: 'badge-green', long: 'badge-amber' };

// ── Helpers ───────────────────────────────────────────────────────────────────
async function downloadFile(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Server error ' + res.status);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (err) {
    alert('Download failed: ' + err.message);
  }
}

// ── Paper Preview ─────────────────────────────────────────────────────────────
function PaperPreview({ paper, onReset }) {
  const { sections, schema, subject, classLevel, testNo, time, totalMarks } = paper;
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Paper Generated ✓</h1>
          <p className="page-subtitle">{subject} · Class {classLevel} · {totalMarks} marks</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-secondary" onClick={onReset}>Generate Another</button>
          <button className="btn-secondary" onClick={() => downloadFile(`/api/export/word/${paper.paperId}`, `paper.docx`)}>⬇ Word</button>
          <button className="btn-primary"   onClick={() => downloadFile(`/api/export/pdf/${paper.paperId}`,  `paper.pdf`)}>⬇ PDF</button>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {[['Type', schema.name], ['Test No', testNo], ['Time', time], ['Marks', totalMarks]].map(([l, v]) => (
          <div key={l}>
            <div style={{ fontSize: 11, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>
      {sections?.mcqs?.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 14, color: 'var(--accent)' }}>MCQs ({sections.mcqs.length})</h3>
          <ol style={{ paddingLeft: 20 }}>
            {sections.mcqs.map((q, i) => (
              <li key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 500 }}>{q.questionText}</div>
                {q.options && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 16px', marginTop: 3, paddingLeft: 8 }}>
                    {q.options.map((opt, oi) => <span key={oi} style={{ fontSize: 13, color: 'var(--ink2)' }}>{String.fromCharCode(65+oi)}) {opt}</span>)}
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
      {sections?.shorts?.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 14, color: 'var(--success)' }}>Short Questions ({sections.shorts.length})</h3>
          <ol style={{ paddingLeft: 20 }}>
            {sections.shorts.map((q, i) => <li key={i} style={{ marginBottom: 5, fontWeight: 500 }}>{q.questionText}</li>)}
          </ol>
        </div>
      )}
      {sections?.shortGroups?.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 14, color: 'var(--success)' }}>Short Questions — Groups</h3>
          {sections.shortGroups.map((g, gi) => (
            <div key={gi} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 600, color: 'var(--ink2)', fontSize: 13, marginBottom: 4 }}>Group {gi+1} — Attempt any {g.attempt}</div>
              <ol style={{ paddingLeft: 20 }}>{g.questions.map((q, qi) => <li key={qi} style={{ marginBottom: 3 }}>{q.questionText}</li>)}</ol>
            </div>
          ))}
        </div>
      )}
      {sections?.longs?.length > 0 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 14, color: 'var(--warning)' }}>
            Long Questions {sections.longsAttempt ? `(Attempt any ${sections.longsAttempt})` : ''}
          </h3>
          <ol style={{ paddingLeft: 20 }}>{sections.longs.map((q, i) => <li key={i} style={{ marginBottom: 8, fontWeight: 500 }}>{q.questionText}</li>)}</ol>
        </div>
      )}
    </div>
  );
}

// ── Shared: Question picker per chapter ───────────────────────────────────────
function QuestionPicker({ subject, needed, selected, setSelected, counts }) {
  const [chapters, setChapters]       = useState([]);
  const [selChapters, setSelChapters] = useState([]);
  const [qByChapter, setQByChapter]   = useState({});
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  useEffect(() => {
    api.get('/questions/chapters', { params: { subject } }).then(r => setChapters(r.data.data));
  }, [subject]);

  async function loadChapter(ch) {
    if (qByChapter[ch]) return;
    setLoading(true);
    try {
      const r = await api.get('/questions', { params: { subject, chapter: ch } });
      setQByChapter(prev => ({ ...prev, [ch]: r.data.data }));
    } finally { setLoading(false); }
  }

  function toggleChapter(ch) {
    const has = selChapters.includes(ch);
    if (!has) { setSelChapters(p => [...p, ch]); loadChapter(ch); }
    else {
      setSelChapters(p => p.filter(c => c !== ch));
      const ids = (qByChapter[ch] || []).map(q => q._id);
      setSelected(prev => ({
        mcq:   prev.mcq.filter(id => !ids.includes(id)),
        short: prev.short.filter(id => !ids.includes(id)),
        long:  prev.long.filter(id => !ids.includes(id)),
      }));
    }
  }

  function toggleQuestion(q) {
    const type = q.type;
    const id   = q._id;
    setSelected(prev => {
      const isSel = prev[type].includes(id);
      if (isSel) return { ...prev, [type]: prev[type].filter(i => i !== id) };
      if (needed[type] > 0 && prev[type].length >= needed[type]) {
        setError(`Already have ${needed[type]} ${type}(s). Deselect one first.`);
        setTimeout(() => setError(''), 2500);
        return prev;
      }
      return { ...prev, [type]: [...prev[type], id] };
    });
  }

  return (
    <div>
      {error && <div className="alert alert-error" style={{ marginBottom: 12 }}>{error}</div>}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3>Select Chapters</h3>
          <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{selChapters.length} open</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chapters.map(ch => (
            <span key={ch} className={`tag-pill${selChapters.includes(ch) ? ' selected' : ''}`} onClick={() => toggleChapter(ch)}>
              {ch}{qByChapter[ch] ? ` (${qByChapter[ch].length})` : ''}
            </span>
          ))}
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 16 }}><span className="spinner" /></div>}

      {selChapters.map(ch => {
        const qs     = qByChapter[ch] || [];
        const mcqs   = qs.filter(q => q.type === 'mcq');
        const shorts = qs.filter(q => q.type === 'short');
        const longs  = qs.filter(q => q.type === 'long');

        return (
          <div key={ch} className="card" style={{ marginBottom: 14, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--paper)', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>📚 {ch}</div>
            {[
              { label: 'MCQs',            list: mcqs,   type: 'mcq'   },
              { label: 'Short Questions', list: shorts, type: 'short' },
              { label: 'Long Questions',  list: longs,  type: 'long'  },
            ].filter(({ list, type }) => list.length > 0 && (needed[type] > 0 || needed[type] === -1)).map(({ label, list, type }) => (
              <div key={type}>
                <div style={{ padding: '5px 16px', fontSize: 11, fontWeight: 600, color: TYPE_COLOR[type], textTransform: 'uppercase', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                  {label}{needed[type] > 0 ? ` — ${counts[type]}/${needed[type]} selected` : ''}
                </div>
                {list.map(q => {
                  const isSel  = selected[type].includes(q._id);
                  const maxed  = needed[type] > 0 && counts[type] >= needed[type] && !isSel;
                  return (
                    <div key={q._id} onClick={() => !maxed && toggleQuestion(q)} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 16px',
                      borderBottom: '1px solid var(--border)',
                      background: isSel ? 'var(--accent-light)' : 'var(--surface)',
                      cursor: maxed ? 'not-allowed' : 'pointer',
                      opacity: maxed ? 0.4 : 1, transition: 'all 0.12s',
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                        border: `2px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                        background: isSel ? 'var(--accent)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 11, fontWeight: 700,
                      }}>{isSel ? '✓' : ''}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: isSel ? 600 : 400 }}>{q.questionText}</div>
                        {q.options && (
                          <div style={{ display: 'flex', gap: 10, marginTop: 2, flexWrap: 'wrap' }}>
                            {q.options.map((opt, oi) => <span key={oi} style={{ fontSize: 11, color: 'var(--ink3)' }}>{String.fromCharCode(65+oi)}) {opt}</span>)}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                        <span className={`badge ${TYPE_BADGE[type]}`}>{type.toUpperCase()}</span>
                        <span className="badge badge-gray">{q.difficulty}</span>
                        <span className="badge badge-gray">{q.marks}m</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}

      {selChapters.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: 32 }}>☝️</div>
          <h3 style={{ marginTop: 10 }}>Select chapters above</h3>
          <p>Questions will appear here.</p>
        </div>
      )}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ counts, needed }) {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {[{ type: 'mcq', label: 'MCQs' }, { type: 'short', label: 'Short Qs' }, { type: 'long', label: 'Long Qs' }]
        .filter(({ type }) => needed[type] > 0)
        .map(({ type, label }) => {
          const count = counts[type];
          const total = needed[type];
          const done  = count === total;
          return (
            <div key={type} style={{
              flex: 1, padding: '10px 14px', borderRadius: 'var(--radius)',
              background: done ? 'var(--success-light)' : 'var(--paper)',
              border: `1px solid ${done ? '#bbf7d0' : 'var(--border)'}`,
              transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: 11, color: 'var(--ink3)', fontWeight: 500, textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: done ? 'var(--success)' : TYPE_COLOR[type], marginTop: 2 }}>
                {count}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink3)' }}>/{total}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', marginTop: 6 }}>
                <div style={{ height: '100%', borderRadius: 2, background: done ? 'var(--success)' : TYPE_COLOR[type], width: `${Math.min(100, (count/total)*100)}%`, transition: 'width 0.3s ease' }} />
              </div>
            </div>
          );
        })}
    </div>
  );
}

// ── TAB 1: Auto Generate ──────────────────────────────────────────────────────
function AutoGenerate({ onPaperReady }) {
  const [subjects, setSubjects]     = useState([]);
  const [chapters, setChapters]     = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError]           = useState('');
  const [form, setForm] = useState({ subject: 'Computer Science', testType: 'class-test', chapters: [], difficulty: 'any', classLevel: '9', testNo: '1' });

  useEffect(() => { api.get('/questions/subjects').then(r => setSubjects(r.data.data)); }, []);
  useEffect(() => {
    if (form.subject) api.get('/questions/chapters', { params: { subject: form.subject } }).then(r => { setChapters(r.data.data); setForm(f => ({ ...f, chapters: [] })); });
  }, [form.subject]);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function toggleCh(ch) { setForm(f => ({ ...f, chapters: f.chapters.includes(ch) ? f.chapters.filter(c => c !== ch) : [...f.chapters, ch] })); }

  async function handleGenerate() {
    setError('');
    if (!form.chapters.length) return setError('Select at least one chapter.');
    setGenerating(true);
    try { const r = await api.post('/generate', form); onPaperReady(r.data.data); }
    catch (err) { setError(err.response?.data?.error || 'Generation failed.'); }
    finally { setGenerating(false); }
  }

  return (
    <div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 14 }}>Test Type</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {TEST_TYPES.map(t => (
            <div key={t.value} onClick={() => set('testType', t.value)} style={{
              flex: 1, padding: '14px 16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              border: `2px solid ${form.testType === t.value ? 'var(--accent)' : 'var(--border)'}`,
              background: form.testType === t.value ? 'var(--accent-light)' : 'var(--surface)', transition: 'all 0.15s',
            }}>
              <div style={{ fontWeight: 600, color: form.testType === t.value ? 'var(--accent)' : 'var(--ink)' }}>{t.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{t.desc}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6, color: form.testType === t.value ? 'var(--accent)' : 'var(--ink2)' }}>{t.marks} marks</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 14 }}>Details</h3>
        <div className="grid-2" style={{ marginBottom: 14 }}>
          <div className="form-group" style={{ margin: 0 }}><label>Subject</label><select value={form.subject} onChange={e => set('subject', e.target.value)}>{subjects.map(s => <option key={s}>{s}</option>)}</select></div>
          <div className="form-group" style={{ margin: 0 }}><label>Difficulty</label><select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}><option value="any">Any/Mixed</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select></div>
          <div className="form-group" style={{ margin: 0 }}><label>Class</label><select value={form.classLevel} onChange={e => set('classLevel', e.target.value)}>{['7','8','9','10','11','12','13','14'].map(c => <option key={c} value={c}>{c==='13'?'1st Year':c==='14'?'2nd Year':`Class ${c}`}</option>)}</select></div>
          <div className="form-group" style={{ margin: 0 }}><label>Test No.</label><input value={form.testNo} onChange={e => set('testNo', e.target.value)} /></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ margin: 0 }}>Chapters ({form.chapters.length} selected)</label>
          <button className="btn-secondary btn-sm" onClick={() => setForm(f => ({ ...f, chapters: f.chapters.length === chapters.length ? [] : [...chapters] }))}>{form.chapters.length === chapters.length ? 'Deselect all' : 'Select all'}</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chapters.map(ch => <span key={ch} className={`tag-pill${form.chapters.includes(ch) ? ' selected' : ''}`} onClick={() => toggleCh(ch)}>{ch}</span>)}
        </div>
      </div>
      <button className="btn-primary btn-lg" style={{ width: '100%' }} onClick={handleGenerate} disabled={generating || !form.chapters.length}>
        {generating ? <><span className="spinner" style={{ width: 16, height: 16, marginRight: 8 }} />Generating...</> : '⚡ Generate Paper'}
      </button>
    </div>
  );
}

// ── TAB 2: MCQ Only ───────────────────────────────────────────────────────────
function MCQOnly({ onPaperReady }) {
  const [subjects, setSubjects]     = useState([]);
  const [subject, setSubject]       = useState('Computer Science');
  const [classLevel, setClassLevel] = useState('9');
  const [testNo, setTestNo]         = useState('1');
  const [mcqCount, setMcqCount]     = useState(10);
  const [chapters, setChapters]     = useState([]);
  const [selChapters, setSelChapters] = useState([]);
  const [qByChapter, setQByChapter] = useState({});
  const [loading, setLoading]       = useState(false);
  const [mcqIds, setMcqIds]         = useState([]);
  const mcqRef                      = useRef([]);
  const [building, setBuilding]     = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => { api.get('/questions/subjects').then(r => setSubjects(r.data.data)); }, []);
  useEffect(() => {
    if (subject) api.get('/questions/chapters', { params: { subject } }).then(r => setChapters(r.data.data));
  }, [subject]);

  async function loadChapter(ch) {
    if (qByChapter[ch]) return;
    setLoading(true);
    try {
      const r = await api.get('/questions', { params: { subject, chapter: ch } });
      setQByChapter(prev => ({ ...prev, [ch]: r.data.data }));
    } finally { setLoading(false); }
  }

  function toggleChapter(ch) {
    if (selChapters.includes(ch)) {
      setSelChapters(prev => prev.filter(c => c !== ch));
      const ids = (qByChapter[ch] || []).map(q => q._id.toString());
      setMcqIds(prev => { const n = prev.filter(id => !ids.includes(id)); mcqRef.current = n; return n; });
    } else {
      setSelChapters(prev => [...prev, ch]);
      loadChapter(ch);
    }
  }

  function toggleQ(q) {
    const id = q._id.toString();
    setMcqIds(prev => {
      if (prev.includes(id)) { const n = prev.filter(i => i !== id); mcqRef.current = n; return n; }
      if (prev.length >= mcqCount) { setError(`Need exactly ${mcqCount} MCQs`); setTimeout(() => setError(''), 2000); return prev; }
      const n = [...prev, id]; mcqRef.current = n; return n;
    });
  }

  const count   = mcqIds.length;
  const isReady = count === mcqCount;

  async function handleBuild() {
    setBuilding(true); setError('');
    try {
      const allIds = [...mcqRef.current];
      console.log('MCQ Only sending:', allIds.length);
      const schema = { name: 'MCQ Test', totalMarks: mcqCount, time: '30 mins', sections: [{ type: 'mcq', count: mcqCount, marksEach: 1 }] };
      const r = await api.post('/generate/manual', {
        testType: 'mcq-only', questionIds: allIds, subject, classLevel, testNo,
        time: '30 mins', totalMarks: mcqCount, schema,
      });
      onPaperReady(r.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Build failed.');
      console.error(err.response?.data);
    } finally { setBuilding(false); }
  }

  return (
    <div>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 14 }}>MCQ Test Settings</h3>
        <div className="grid-2">
          <div className="form-group" style={{ margin: 0 }}><label>Subject</label><select value={subject} onChange={e => { setSubject(e.target.value); setMcqIds([]); mcqRef.current = []; }}>{subjects.map(s => <option key={s}>{s}</option>)}</select></div>
          <div className="form-group" style={{ margin: 0 }}>
            <label>Number of MCQs</label>
            <input type="number" min={1} max={50} value={mcqCount} onChange={e => { setMcqCount(Number(e.target.value)); setMcqIds([]); mcqRef.current = []; }} />
          </div>
          <div className="form-group" style={{ margin: 0 }}><label>Class</label><select value={classLevel} onChange={e => setClassLevel(e.target.value)}>{['7','8','9','10','11','12','13','14'].map(c => <option key={c} value={c}>{c==='13'?'1st Year':c==='14'?'2nd Year':`Class ${c}`}</option>)}</select></div>
          <div className="form-group" style={{ margin: 0 }}><label>Test No.</label><input value={testNo} onChange={e => setTestNo(e.target.value)} /></div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 600 }}>MCQs selected: <span style={{ color: isReady ? 'var(--success)' : 'var(--accent)', fontSize: 18 }}>{count}</span>/{mcqCount}</div>
          <button className="btn-primary" disabled={!isReady || building} onClick={handleBuild}>{building ? 'Building...' : '✓ Build MCQ Test'}</button>
        </div>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--border)' }}>
          <div style={{ height: '100%', borderRadius: 3, background: isReady ? 'var(--success)' : 'var(--accent)', width: `${Math.min(100,(count/mcqCount)*100)}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <h3 style={{ marginBottom: 10 }}>Select Chapters</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chapters.map(ch => (
            <span key={ch} className={`tag-pill${selChapters.includes(ch) ? ' selected' : ''}`} onClick={() => toggleChapter(ch)}>
              {ch}{qByChapter[ch] ? ` (${qByChapter[ch].filter(q=>q.type==='mcq').length} MCQs)` : ''}
            </span>
          ))}
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 16 }}><span className="spinner" /></div>}

      {selChapters.map(ch => {
        const list = (qByChapter[ch] || []).filter(q => q.type === 'mcq');
        if (!list.length) return null;
        return (
          <div key={ch} className="card" style={{ marginBottom: 14, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--paper)', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>📚 {ch}</div>
            {list.map(q => {
              const id    = q._id.toString();
              const isSel = mcqIds.includes(id);
              const maxed = count >= mcqCount && !isSel;
              return (
                <div key={id} onClick={() => !maxed && toggleQ(q)} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 16px',
                  borderBottom: '1px solid var(--border)',
                  background: isSel ? 'var(--accent-light)' : 'var(--surface)',
                  cursor: maxed ? 'not-allowed' : 'pointer',
                  opacity: maxed ? 0.4 : 1, transition: 'all 0.12s',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                    border: `2px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                    background: isSel ? 'var(--accent)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                  }}>{isSel ? '✓' : ''}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: isSel ? 600 : 400 }}>{q.questionText}</div>
                    {q.options && (
                      <div style={{ display: 'flex', gap: 10, marginTop: 2, flexWrap: 'wrap' }}>
                        {q.options.map((opt, oi) => <span key={oi} style={{ fontSize: 11, color: 'var(--ink3)' }}>{String.fromCharCode(65+oi)}) {opt}</span>)}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                    <span className="badge badge-gray">{q.difficulty}</span>
                    <span className="badge badge-gray">{q.marks}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {selChapters.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: 32 }}>☝️</div>
          <h3 style={{ marginTop: 10 }}>Select chapters above</h3>
          <p>MCQ questions will appear here.</p>
        </div>
      )}
    </div>
  );
}

// ── TAB 3: Custom Test ────────────────────────────────────────────────────────
function CustomTest({ onPaperReady }) {
  const [step, setStep]             = useState(1);
  const [testType, setTestType]     = useState('');
  const [subjects, setSubjects]     = useState([]);
  const [subject, setSubject]       = useState('Computer Science');
  const [classLevel, setClassLevel] = useState('9');
  const [testNo, setTestNo]         = useState('1');
  const [building, setBuilding]     = useState(false);
  const [error, setError]           = useState('');

  // Question picking state — all managed HERE not in child
  const [chapters, setChapters]     = useState([]);
  const [selChapters, setSelChapters] = useState([]);
  const [qByChapter, setQByChapter] = useState({});
  const [loading, setLoading]       = useState(false);

  // THE KEY: one flat array per type, stored as plain strings
const [mcqIds, setMcqIds]     = useState([]);
const [shortIds, setShortIds] = useState([]);
const [longIds, setLongIds]   = useState([]);

  useEffect(() => { api.get('/questions/subjects').then(r => setSubjects(r.data.data)); }, []);

  useEffect(() => {
    if (step === 2 && subject) {
      api.get('/questions/chapters', { params: { subject } }).then(r => setChapters(r.data.data));
    }
  }, [step, subject]);

  const schema  = testType ? TEST_SCHEMAS[testType] : null;
  const needed  = schema ? {
    mcq:   schema.sections.find(s => s.type === 'mcq')?.count || 0,
    short: schema.sections.find(s => s.type === 'short')?.totalQuestionsNeeded
        || schema.sections.find(s => s.type === 'short')?.count || 0,
    long:  schema.sections.find(s => s.type === 'long')?.totalQuestions
        || schema.sections.find(s => s.type === 'long')?.count || 0,
  } : { mcq: 0, short: 0, long: 0 };

  const counts  = { mcq: mcqIds.length, short: shortIds.length, long: longIds.length };
  const isReady = counts.mcq === needed.mcq && counts.short === needed.short && counts.long === needed.long && needed.mcq > 0;

  async function loadChapter(ch) {
    if (qByChapter[ch]) return;
    setLoading(true);
    try {
      const r = await api.get('/questions', { params: { subject, chapter: ch } });
      setQByChapter(prev => ({ ...prev, [ch]: r.data.data }));
    } finally { setLoading(false); }
  }

  function toggleChapter(ch) {
    if (selChapters.includes(ch)) {
      setSelChapters(prev => prev.filter(c => c !== ch));
      // remove any selected questions from this chapter
      const ids = (qByChapter[ch] || []).map(q => q._id.toString());
     setMcqIds(prev => prev.filter(id => !ids.includes(id)));
setShortIds(prev => prev.filter(id => !ids.includes(id)));
setLongIds(prev => prev.filter(id => !ids.includes(id)));
    } else {
      setSelChapters(prev => [...prev, ch]);
      loadChapter(ch);
    }
  }

function toggleQ(q) {
  const id   = q._id.toString();
  const type = q.type;

  if (type === 'mcq') {
    setMcqIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }

      if (prev.length >= needed.mcq) {
        setError(`Need exactly ${needed.mcq} MCQs`);
        setTimeout(() => setError(''), 2000);
        return prev;
      }

      return [...prev, id];
    });
  }

  else if (type === 'short') {
    setShortIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }

      if (prev.length >= needed.short) {
        setError(`Need exactly ${needed.short} short questions`);
        setTimeout(() => setError(''), 2000);
        return prev;
      }

      return [...prev, id];
    });
  }

  else if (type === 'long') {
    setLongIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }

      if (prev.length >= needed.long) {
        setError(`Need exactly ${needed.long} long questions`);
        setTimeout(() => setError(''), 2000);
        return prev;
      }

      return [...prev, id];
    });
  }
}

async function handleBuild() {
  setBuilding(true);
  setError('');

  try {
    const allIds = [
      ...mcqIds,
      ...shortIds,
      ...longIds,
    ];

    console.log('MCQs:', mcqIds.length);
    console.log('Shorts:', shortIds.length);
    console.log('Longs:', longIds.length);
    console.log('Total IDs:', allIds.length);

    const r = await api.post('/generate/manual', {
      testType,
      questionIds: allIds,
      subject,
      classLevel,
      testNo,
      time: schema.time,
      totalMarks: schema.totalMarks,
      schema,
    });

    onPaperReady(r.data.data);

  } catch (err) {
    setError(err.response?.data?.error || 'Build failed.');
  } finally {
    setBuilding(false);
  }
}

  // ── Step 1: pick type ──
  if (step === 1) return (
    <div>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 14 }}>Select Test Type</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          {TEST_TYPES.map(t => (
            <div key={t.value} onClick={() => setTestType(t.value)} style={{
              flex: 1, padding: '14px 16px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              border: `2px solid ${testType === t.value ? 'var(--accent)' : 'var(--border)'}`,
              background: testType === t.value ? 'var(--accent-light)' : 'var(--surface)', transition: 'all 0.15s',
            }}>
              <div style={{ fontWeight: 600, color: testType === t.value ? 'var(--accent)' : 'var(--ink)' }}>{t.label}</div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginTop: 2 }}>{t.desc}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6, color: testType === t.value ? 'var(--accent)' : 'var(--ink2)' }}>{t.marks} marks</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 14 }}>Details</h3>
        <div className="grid-2">
          <div className="form-group" style={{ margin: 0 }}><label>Subject</label><select value={subject} onChange={e => setSubject(e.target.value)}>{subjects.map(s => <option key={s}>{s}</option>)}</select></div>
          <div className="form-group" style={{ margin: 0 }}><label>Class</label><select value={classLevel} onChange={e => setClassLevel(e.target.value)}>{['7','8','9','10','11','12','13','14'].map(c => <option key={c} value={c}>{c==='13'?'1st Year':c==='14'?'2nd Year':`Class ${c}`}</option>)}</select></div>
          <div className="form-group" style={{ margin: 0 }}><label>Test No.</label><input value={testNo} onChange={e => setTestNo(e.target.value)} /></div>
        </div>
      </div>
      <button className="btn-primary btn-lg" style={{ width: '100%' }} disabled={!testType} onClick={() => setStep(2)}>
        Next — Select Questions →
      </button>
    </div>
  );

  // ── Step 2: pick questions ──
  return (
    <div>
      {error && <div className="alert alert-error">{error}</div>}

      {/* Progress */}
      <div className="card" style={{ marginBottom: 16, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn-secondary btn-sm" onClick={() => setStep(1)}>← Back</button>
            <span style={{ fontWeight: 600 }}>{schema.name} — Pick Questions</span>
          </div>
          <button className="btn-primary" disabled={!isReady || building} onClick={handleBuild}>
            {building ? 'Building...' : '✓ Build Paper'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'MCQs',      count: mcqIds.length,   needed: needed.mcq,   color: 'var(--accent)'  },
            { label: 'Short Qs',  count: shortIds.length, needed: needed.short, color: 'var(--success)' },
            { label: 'Long Qs',   count: longIds.length,  needed: needed.long,  color: 'var(--warning)' },
          ].filter(i => i.needed > 0).map(({ label, count, needed: n, color }) => {
            const done = count === n;
            return (
              <div key={label} style={{ flex: 1, padding: '10px 14px', borderRadius: 'var(--radius)', background: done ? 'var(--success-light)' : 'var(--paper)', border: `1px solid ${done ? '#bbf7d0' : 'var(--border)'}`, transition: 'all 0.2s' }}>
                <div style={{ fontSize: 11, color: 'var(--ink3)', fontWeight: 500, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: done ? 'var(--success)' : color, marginTop: 2 }}>
                  {count}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--ink3)' }}>/{n}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', marginTop: 6 }}>
                  <div style={{ height: '100%', borderRadius: 2, background: done ? 'var(--success)' : color, width: `${Math.min(100,(count/n)*100)}%`, transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chapter pills */}
      <div className="card" style={{ marginBottom: 14 }}>
        <h3 style={{ marginBottom: 10 }}>Select Chapters</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {chapters.map(ch => (
            <span key={ch} className={`tag-pill${selChapters.includes(ch) ? ' selected' : ''}`} onClick={() => toggleChapter(ch)}>
              {ch}{qByChapter[ch] ? ` (${qByChapter[ch].length})` : ''}
            </span>
          ))}
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: 16 }}><span className="spinner" /></div>}

      {/* Questions per chapter */}
      {selChapters.map(ch => {
        const qs = qByChapter[ch] || [];
        return (
          <div key={ch} className="card" style={{ marginBottom: 14, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--paper)', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>📚 {ch}</div>
            {[
              { type: 'mcq',   label: 'MCQs',            ids: mcqIds,   color: TYPE_COLOR.mcq   },
              { type: 'short', label: 'Short Questions',  ids: shortIds, color: TYPE_COLOR.short },
              { type: 'long',  label: 'Long Questions',   ids: longIds,  color: TYPE_COLOR.long  },
            ].map(({ type, label, ids, color }) => {
              const list = qs.filter(q => q.type === type);
              if (!list.length) return null;
              const needCount = needed[type];
              return (
                <div key={type}>
                  <div style={{ padding: '5px 16px', fontSize: 11, fontWeight: 600, color, textTransform: 'uppercase', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                    {label} — {ids.length}/{needCount} selected
                  </div>
                  {list.map(q => {
                    const id    = q._id.toString();
                    const isSel = ids.includes(id);
                    const maxed = ids.length >= needCount && !isSel;
                    return (
                      <div key={id} onClick={() => !maxed && toggleQ(q)} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 16px',
                        borderBottom: '1px solid var(--border)',
                        background: isSel ? 'var(--accent-light)' : 'var(--surface)',
                        cursor: maxed ? 'not-allowed' : 'pointer',
                        opacity: maxed ? 0.4 : 1, transition: 'all 0.12s',
                      }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 2,
                          border: `2px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                          background: isSel ? 'var(--accent)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: 11, fontWeight: 700,
                        }}>{isSel ? '✓' : ''}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: isSel ? 600 : 400 }}>{q.questionText}</div>
                          {q.options && (
                            <div style={{ display: 'flex', gap: 10, marginTop: 2, flexWrap: 'wrap' }}>
                              {q.options.map((opt, oi) => <span key={oi} style={{ fontSize: 11, color: 'var(--ink3)' }}>{String.fromCharCode(65+oi)}) {opt}</span>)}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                          <span className={`badge ${TYPE_BADGE[type]}`}>{type.toUpperCase()}</span>
                          <span className="badge badge-gray">{q.difficulty}</span>
                          <span className="badge badge-gray">{q.marks}m</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}

      {selChapters.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: 32 }}>☝️</div>
          <h3 style={{ marginTop: 10 }}>Select chapters above</h3>
          <p>Questions will appear here to pick from.</p>
        </div>
      )}
    </div>
  );
}


// ── Main ──────────────────────────────────────────────────────────────────────
export default function GenerateTest() {
  const [tab, setTab]     = useState('auto');
  const [paper, setPaper] = useState(null);

  if (paper) return <PaperPreview paper={paper} onReset={() => setPaper(null)} />;

  const tabs = [
    { key: 'auto',    label: '⚡ Auto Generate' },
    { key: 'mcqonly', label: '✔ MCQ Only' },
    { key: 'custom',  label: '✋ Custom Test' },
    { key: 'board',   label: '🏫 Board Pattern' },
  ];

  return (
    <div style={{ maxWidth: 800 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">Generate Test</h1>
          <p className="page-subtitle">Choose a mode to create your paper</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--paper)', padding: 4, borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 13,
            background: tab === t.key ? 'var(--surface)' : 'transparent',
            color: tab === t.key ? 'var(--accent)' : 'var(--ink2)',
            boxShadow: tab === t.key ? 'var(--shadow)' : 'none',
            cursor: 'pointer', transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'auto'    && <AutoGenerate  onPaperReady={setPaper} />}
      {tab === 'mcqonly' && <MCQOnly       onPaperReady={setPaper} />}
      {tab === 'custom'  && <CustomTest    onPaperReady={setPaper} />}
      {tab === 'board'   && <BoardPattern  onPaperReady={setPaper} />}
    </div>
  );
}
