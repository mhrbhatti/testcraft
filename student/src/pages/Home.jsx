import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthCtx } from '../App';
import api from '../api';

const BADGE_META = {
  first_quiz:    { label:'First Quiz',   color:['#ff6b2b','#ff8c42'] },
  perfect_score: { label:'Perfect',      color:['#00e676','#00c853'] },
  week_streak:   { label:'7 Day Streak', color:['#ff4757','#ff6b81'] },
  month_streak:  { label:'30 Days',      color:['#ffd700','#ffab00'] },
  xp_500:        { label:'500 XP',       color:['#00d4ff','#00b8e6'] },
  xp_1000:       { label:'1000 XP',      color:['#7c3aed','#a855f7'] },
};

function BadgeDot({ type }) {
  const m = BADGE_META[type] || { label: type, color: ['#555','#777'] };
  return (
    <div style={{ textAlign:'center', width: 60 }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%', margin: '0 auto 5px',
        background: `linear-gradient(135deg, ${m.color[0]}, ${m.color[1]})`,
        boxShadow: `0 0 16px ${m.color[0]}66`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div style={{ fontSize: 9, fontWeight: 800, color:'var(--ink2)', lineHeight: 1.2 }}>{m.label}</div>
    </div>
  );
}

export default function Home() {
  const { user, logout } = useContext(AuthCtx);
  const navigate = useNavigate();
  const [subjects, setSubjects]   = useState([]);
  const [chapters, setChapters]   = useState([]);
  const [subject, setSubject]     = useState('');
  const [chapter, setChapter]     = useState('');
  const [count, setCount]         = useState(10);
  const [history, setHistory]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    api.get('/student/subjects').then(r => { setSubjects(r.data.data); if(r.data.data[0]) setSubject(r.data.data[0]); });
    api.get('/student/history').then(r => setHistory(r.data.data.slice(0,3)));
  }, []);

  useEffect(() => {
    if(!subject) return;
    api.get('/student/chapters', { params:{ subject } }).then(r => { setChapters(r.data.data); setChapter(''); });
  }, [subject]);

  async function startQuiz() {
    if(!chapter) return setError('Select a chapter first');
    setError(''); setLoading(true);
    try {
      const r = await api.get('/student/quiz', { params:{ subject, chapter, count } });
      navigate('/quiz', { state:{ questions: r.data.data, subject, chapter, count } });
    } catch(err) {
      setError(err.response?.data?.error || 'Failed to load questions');
    } finally { setLoading(false); }
  }

  const xp       = user?.xp || 0;
  const level    = Math.floor(xp / 100) + 1;
  const progress = xp % 100;
  const classLabel = user?.classLevel === '13' ? '1st Year' : user?.classLevel === '14' ? '2nd Year' : `Class ${user?.classLevel}`;

  return (
    <div className="screen" style={{ background:'var(--bg)' }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', background:'var(--surface)', borderBottom:'1px solid var(--border)' }}>
        <div>
          <div className="logo-text">CodexCS</div>
          <div style={{ fontSize:11, color:'var(--ink2)', fontWeight:700, marginTop:1 }}>{classLabel}</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => navigate('/history')} style={{ background:'var(--surface2)', color:'var(--cyan)', padding:'8px 14px', borderRadius:10, fontSize:13, border:'1px solid var(--border)' }}>
            History
          </button>
          <button onClick={logout} style={{ background:'var(--surface2)', color:'var(--ink2)', padding:'8px 12px', borderRadius:10, border:'1px solid var(--border)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
        {/* Hero card */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:24, padding:'20px', marginBottom:16, position:'relative', overflow:'hidden' }}>
          {/* Glow blobs */}
          <div style={{ position:'absolute', width:140, height:140, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,43,0.15) 0%, transparent 70%)', top:-40, right:-40 }} />
          <div style={{ position:'absolute', width:100, height:100, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)', bottom:-20, left:-20 }} />

          <div style={{ position:'relative' }}>
            <div style={{ fontSize:13, color:'var(--ink2)', fontWeight:700, marginBottom:2 }}>Hey there,</div>
            <div style={{ fontSize:24, fontWeight:900, marginBottom:18 }}>{user?.name?.split(' ')[0]}</div>

            {/* Stats row */}
            <div style={{ display:'flex', gap:10, marginBottom:18 }}>
              {[
                { label:'Streak', val:`${user?.streak||0}d`, accent:'var(--orange)' },
                { label:'XP',     val:xp,                    accent:'var(--cyan)'   },
                { label:'Level',  val:`Lv.${level}`,         accent:'var(--gold)'   },
              ].map(({ label, val, accent }) => (
                <div key={label} className="stat-pill">
                  <div style={{ fontSize:18, fontWeight:900, color:accent }}>{val}</div>
                  <div style={{ fontSize:10, color:'var(--ink2)', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.5px', marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* XP bar */}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--ink2)', fontWeight:700, marginBottom:6 }}>
              <span>Level {level}</span>
              <span>{progress}/100 XP → Level {level+1}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width:`${progress}%`, background:'linear-gradient(90deg, var(--orange), var(--cyan))' }} />
            </div>
          </div>
        </div>

        {/* Badges */}
        {user?.badges?.length > 0 && (
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'16px 18px', marginBottom:16 }}>
            <div style={{ fontSize:12, fontWeight:800, color:'var(--gold)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:12 }}>Badges Earned</div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {user.badges.map(b => <BadgeDot key={b} type={b} />)}
            </div>
          </div>
        )}

        {/* Quiz launcher */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:24, padding:'20px', marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'var(--orange)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:16 }}>Start a Quiz</div>

          {error && <div className="error-box">{error}</div>}

          <div style={{ marginBottom:14 }}>
            <label>Subject</label>
            <select value={subject} onChange={e => setSubject(e.target.value)}>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div style={{ marginBottom:14 }}>
            <label>Chapter</label>
            <select value={chapter} onChange={e => setChapter(e.target.value)}>
              <option value="">Select chapter...</option>
              {chapters.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ marginBottom:20 }}>
            <label>Questions</label>
            <div style={{ display:'flex', gap:8 }}>
              {[5,10,15,20].map(n => (
                <button key={n} onClick={() => setCount(n)} style={{
                  flex:1, padding:'12px 0', borderRadius:12, fontWeight:900, fontSize:16,
                  background: count===n ? 'var(--orange)' : 'var(--surface2)',
                  color: count===n ? '#fff' : 'var(--ink2)',
                  border: count===n ? 'none' : '1px solid var(--border)',
                  boxShadow: count===n ? 'var(--glow-o)' : 'none',
                  transition:'all 0.2s',
                }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" onClick={startQuiz} disabled={loading || !chapter}>
            {loading ? <span className="spinner" /> : `Start Quiz`}
          </button>
        </div>

        {/* Recent history */}
        {history.length > 0 && (
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'16px 18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:800, color:'var(--cyan)', textTransform:'uppercase', letterSpacing:'1px' }}>Recent Quizzes</div>
              <button onClick={() => navigate('/history')} style={{ background:'none', color:'var(--cyan)', fontSize:13, fontWeight:800, padding:0 }}>See all</button>
            </div>
            {history.map((r,i) => (
              <div key={r._id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom: i < history.length-1 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>{r.chapter}</div>
                  <div style={{ fontSize:12, color:'var(--ink2)', marginTop:2 }}>{r.totalQ} Qs · +{r.xpEarned} XP</div>
                </div>
                <div style={{
                  padding:'6px 14px', borderRadius:10, fontWeight:900, fontSize:15,
                  background: r.score>=80 ? 'rgba(0,230,118,0.15)' : r.score>=50 ? 'rgba(255,215,0,0.15)' : 'rgba(255,71,87,0.15)',
                  color: r.score>=80 ? 'var(--green)' : r.score>=50 ? 'var(--gold)' : 'var(--red)',
                }}>
                  {r.score}%
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:20 }}>
  
  {/* Instagram */}
  <a href="https://instagram.com/mhrbhatti" target="_blank" rel="noopener noreferrer"
    style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 16px', transition:'all 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.borderColor='#e1306c'}
    onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ig" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f09433"/><stop offset="0.25" stopColor="#e6683c"/>
          <stop offset="0.5" stopColor="#dc2743"/><stop offset="0.75" stopColor="#cc2366"/>
          <stop offset="1" stopColor="#bc1888"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2"/>
      <circle cx="12" cy="12" r="5" stroke="url(#ig)" strokeWidth="2"/>
      <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig)"/>
    </svg>
    <span style={{ fontSize:13, fontWeight:700, color:'var(--ink2)' }}>mhrbhatti</span>
  </a>

  {/* WhatsApp */}
  <a href="https://wa.me/923178495506" target="_blank" rel="noopener noreferrer"
    style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:'10px 16px', transition:'all 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.borderColor='#25d366'}
    onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    <span style={{ fontSize:13, fontWeight:700, color:'var(--ink2)' }}>BytesStack</span>
  </a>

</div>
      </div>
      
    </div>
  );
}
