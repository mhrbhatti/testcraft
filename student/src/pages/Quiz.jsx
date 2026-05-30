import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthCtx } from '../App';
import api from '../api';

export default function Quiz() {
  const { updateUser } = useContext(AuthCtx);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { questions, subject, chapter } = location.state || {};

  const [current, setCurrent]       = useState(0);
  const [selected, setSelected]     = useState(null);
  const [answers, setAnswers]       = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft]     = useState(30);
  const timerRef  = useRef(null);
  const startTime = useRef(Date.now());

  useEffect(() => { if(!questions?.length) navigate('/'); }, []);

  useEffect(() => {
    setTimeLeft(30); setSelected(null);
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if(t <= 1) { clearInterval(timerRef.current); goNext(null); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  if(!questions?.length) return null;

  const q       = questions[current];
  const total   = questions.length;
  const pct     = ((current) / total) * 100;

  function pickAnswer(opt) {
    if(selected !== null) return;
    clearInterval(timerRef.current);
    setSelected(opt);
  }

  function goNext(forced) {
    const ans = forced !== undefined ? forced : selected;
    const rec = { questionId: q._id, questionText: q.questionText, options: q.options, correctAnswer: q.correctAnswer, studentAnswer: ans };
    const all = [...answers, rec];
    if(current + 1 < total) {
      setAnswers(all); setCurrent(c => c+1);
    } else {
      submitQuiz(all);
    }
  }

  async function submitQuiz(final) {
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    try {
      const r = await api.post('/student/submit', { subject, chapter, answers: final, timeTaken });
      updateUser(r.data.data.user);
      navigate('/results', { state:{ result: r.data.data, subject, chapter } });
    } catch(err) {
      alert('Submit failed'); navigate('/');
    }
  }

  const timerPct   = (timeLeft / 30) * 100;
  const timerColor = timeLeft > 15 ? 'var(--cyan)' : timeLeft > 7 ? 'var(--gold)' : 'var(--red)';
  const circumference = 2 * Math.PI * 22;

  return (
    <div className="slide" style={{ background:'var(--bg)' }}>
      {/* Progress bar */}
      <div style={{ height:4, background:'var(--surface2)' }}>
        <div style={{ height:'100%', background:'linear-gradient(90deg, var(--orange), var(--cyan))', width:`${pct}%`, transition:'width 0.4s ease' }} />
      </div>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 20px', background:'var(--surface)', borderBottom:'1px solid var(--border)' }}>
        <div>
          <div style={{ fontSize:11, color:'var(--ink2)', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.8px' }}>{chapter}</div>
          <div style={{ fontSize:15, fontWeight:900 }}>Q{current+1} <span style={{ color:'var(--ink2)', fontWeight:600 }}>of {total}</span></div>
        </div>

        {/* Timer ring */}
        <div style={{ position:'relative', width:52, height:52 }}>
          <svg width="52" height="52" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="26" cy="26" r="22" fill="none" stroke="var(--surface2)" strokeWidth="4"/>
            <circle cx="26" cy="26" r="22" fill="none" stroke={timerColor} strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - timerPct/100)}
              strokeLinecap="round"
              style={{ transition:'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:timerColor }}>
            {timeLeft}
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', padding:'20px 18px' }}>
        <div style={{
          background:'var(--surface)', border:'1px solid var(--border)',
          borderRadius:20, padding:'22px 20px', marginBottom:20,
          borderLeft:`4px solid var(--orange)`,
          boxShadow:'0 4px 20px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize:11, color:'var(--orange)', fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', marginBottom:10 }}>Question</div>
          <div style={{ fontSize:16, fontWeight:700, lineHeight:1.6, color:'var(--ink)' }}>{q.questionText}</div>
        </div>

        {/* Options */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, flex:1 }}>
          {q.options.map((opt, i) => (
            <button key={i} className={`opt-btn${selected === opt ? ' selected' : ''}`}
              onClick={() => pickAnswer(opt)} disabled={selected !== null}>
              <span className="opt-letter">{String.fromCharCode(65+i)}</span>
              <span style={{ flex:1 }}>{opt}</span>
            </button>
          ))}
        </div>

        {/* Action button */}
        <div style={{ marginTop:20 }}>
          {selected !== null ? (
            <button className="btn-primary" onClick={() => goNext(selected)} disabled={submitting}>
              {submitting ? <span className="spinner" /> : current+1 < total ? 'Next Question' : 'Finish Quiz'}
            </button>
          ) : (
            <button className="btn-ghost" onClick={() => goNext(null)}>Skip</button>
          )}
        </div>
      </div>
    </div>
  );
}
