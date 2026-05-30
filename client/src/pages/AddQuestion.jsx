import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const EMPTY = {
  type: 'mcq',
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: '',
  subject: 'Computer Science',
  chapter: '',
  topic: '',
  difficulty: 'medium',
  classLevel: '9',
  marks: 1,
};

export default function AddQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm]       = useState(EMPTY);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/questions/${id}`).then(r => {
        const q = r.data.data;
        setForm({
          ...q,
          options: q.options?.length ? q.options : ['', '', '', ''],
        });
      });
    }
  }, [id, isEdit]);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function setOption(i, val) {
    setForm(f => {
      const opts = [...f.options];
      opts[i] = val;
      return { ...f, options: opts };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.questionText.trim()) return setError('Question text is required.');
    if (!form.chapter.trim()) return setError('Chapter is required.');
    if (form.type === 'mcq' && form.options.some(o => !o.trim())) return setError('All 4 MCQ options are required.');

    const payload = { ...form };
    if (form.type !== 'mcq') { delete payload.options; delete payload.correctAnswer; }
    payload.marks = Number(payload.marks);

    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/questions/${id}`, payload);
        setSuccess('Question updated!');
      } else {
        await api.post('/questions', payload);
        setSuccess('Question added!');
        setForm({ ...EMPTY });
      }
      setTimeout(() => navigate('/questions'), 800);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEdit ? 'Edit Question' : 'Add Question'}</h1>
          <p className="page-subtitle">Fill in the details below</p>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/questions')}>← Back</button>
      </div>

      {error   && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Type + Difficulty + Marks */}
          <div className="grid-3" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Question Type</label>
              <select value={form.type} onChange={e => {
                set('type', e.target.value);
                set('marks', e.target.value === 'mcq' ? 1 : e.target.value === 'short' ? 2 : 8);
              }}>
                <option value="mcq">MCQ</option>
                <option value="short">Short</option>
                <option value="long">Long</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Difficulty</label>
              <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Marks</label>
              <input type="number" value={form.marks} min={1} max={20} onChange={e => set('marks', e.target.value)} />
            </div>
          </div>

          {/* Subject + Chapter + Topic */}
          <div className="grid-3" style={{ marginBottom: 16 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Subject</label>
              <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="e.g. Computer Science" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Chapter *</label>
              <input value={form.chapter} onChange={e => set('chapter', e.target.value)} placeholder="e.g. Python Basics" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Topic (optional)</label>
              <input value={form.topic} onChange={e => set('topic', e.target.value)} placeholder="e.g. Functions" />
            </div>
          </div>

          {/* Class Level */}
          <div className="form-group" style={{ marginBottom: 16, maxWidth: 140 }}>
            <label>Class Level</label>
            <select value={form.classLevel} onChange={e => set('classLevel', e.target.value)}>
              {['7','8','9','10','11','12'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Question Text */}
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Question Text *</label>
            <textarea
              rows={3}
              value={form.questionText}
              onChange={e => set('questionText', e.target.value)}
              placeholder="Enter the question..."
            />
          </div>

          {/* MCQ Options */}
          {form.type === 'mcq' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ marginBottom: 8, display: 'block' }}>Options *</label>
              <div className="grid-2">
                {form.options.map((opt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'var(--accent-light)', color: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 600, flexShrink: 0,
                    }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <input value={opt} onChange={e => setOption(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <label>Correct Answer</label>
                <select value={form.correctAnswer} onChange={e => set('correctAnswer', e.target.value)}>
                  <option value="">Select correct answer</option>
                  {form.options.map((opt, i) => opt && <option key={i} value={opt}>{String.fromCharCode(65 + i)}) {opt}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Update Question' : 'Add Question'}
            </button>
            {!isEdit && (
              <button type="button" className="btn-secondary" onClick={() => setForm({ ...EMPTY })}>
                Clear
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
