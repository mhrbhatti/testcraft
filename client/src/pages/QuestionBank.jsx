import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const TYPE_BADGE = {
  mcq:   'badge-blue',
  short: 'badge-green',
  long:  'badge-amber',
};

const DIFF_BADGE = {
  easy:   'badge-green',
  medium: 'badge-amber',
  hard:   'badge-red',
};

export default function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [subjects, setSubjects]   = useState([]);
  const [chapters, setChapters]   = useState([]);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    subject: '', chapter: '', type: '', difficulty: '', search: '',
  });

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const r = await api.get('/questions', { params });
      setQuestions(r.data.data);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  useEffect(() => {
    api.get('/questions/subjects').then(r => setSubjects(r.data.data));
  }, []);

  useEffect(() => {
    if (filters.subject) {
      api.get('/questions/chapters', { params: { subject: filters.subject } }).then(r => setChapters(r.data.data));
    } else {
      api.get('/questions/chapters').then(r => setChapters(r.data.data));
    }
  }, [filters.subject]);

  async function handleDelete(id) {
    if (!confirm('Delete this question?')) return;
    await api.delete(`/questions/${id}`);
    fetchQuestions();
  }

  function set(key, val) { setFilters(f => ({ ...f, [key]: val })); }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Question Bank</h1>
          <p className="page-subtitle">{questions.length} questions</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/add')}>+ Add Question</button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="grid-3" style={{ gap: 12 }}>
          <div>
            <label>Subject</label>
            <select value={filters.subject} onChange={e => set('subject', e.target.value)}>
              <option value="">All subjects</option>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label>Chapter</label>
            <select value={filters.chapter} onChange={e => set('chapter', e.target.value)}>
              <option value="">All chapters</option>
              {chapters.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Type</label>
            <select value={filters.type} onChange={e => set('type', e.target.value)}>
              <option value="">All types</option>
              <option value="mcq">MCQ</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
          </div>
          <div>
            <label>Difficulty</label>
            <select value={filters.difficulty} onChange={e => set('difficulty', e.target.value)}>
              <option value="">Any difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div style={{ gridColumn: '2 / -1' }}>
            <label>Search</label>
            <input
              placeholder="Search question text..."
              value={filters.search}
              onChange={e => set('search', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div>
        ) : questions.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 40 }}>🗄️</div>
            <h3 style={{ marginTop: 12 }}>No questions found</h3>
            <p>Try adjusting your filters or add new questions.</p>
            <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/add')}>Add Question</button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ width: '45%' }}>Question</th>
                <th>Type</th>
                <th>Chapter</th>
                <th>Difficulty</th>
                <th>Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(q => (
                <tr key={q._id}>
                  <td style={{ maxWidth: 300 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                      {q.questionText}
                    </div>
                    {q.type === 'mcq' && q.options && (
                      <div style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 2 }}>
                        {q.options.join(' · ')}
                      </div>
                    )}
                  </td>
                  <td><span className={`badge ${TYPE_BADGE[q.type]}`}>{q.type.toUpperCase()}</span></td>
                  <td style={{ color: 'var(--ink2)' }}>{q.chapter}</td>
                  <td><span className={`badge ${DIFF_BADGE[q.difficulty]}`}>{q.difficulty}</span></td>
                  <td>{q.marks}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-secondary btn-sm" onClick={() => navigate(`/add/${q._id}`)}>Edit</button>
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(q._id)}>Del</button>
                    </div>
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
