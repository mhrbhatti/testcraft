import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BADGE_META = {
  first_quiz:    { label:'First Quiz',   color:['#ff6b2b','#ff8c42'] },
  perfect_score: { label:'Perfect Score',color:['#00e676','#00c853'] },
  week_streak:   { label:'7 Day Streak', color:['#ff4757','#ff6b81'] },
  month_streak:  { label:'30 Days',      color:['#ffd700','#ffab00'] },
  xp_500:        { label:'500 XP',       color:['#00d4ff','#00b8e6'] },
  xp_1000:       { label:'1000 XP',      color:['#7c3aed','#a855f7'] },
};

function ScoreRing({ score }) {
  const r   = 54;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - score / 100);
  const color = score >= 80 ? 'var(--green)' : score >= 50 ? 'var(--gold)' : 'var(--red)';
  const label = score >= 80 ? 'Excellent' : score >= 50 ? 'Good Job' : 'Keep Going';
  return (
    <div style={{ position:'relative', width:140, height:140, margin:'0 auto' }}>
      <svg width="140" height="140" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--surface2)" strokeWidth="10"/>
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={fill}
          strokeLinecap="round"
          style={{ filter:`drop-shadow(0 0 8px ${color})`, transition:'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontSize:32, fontWeight:900, color, lineHeight:1 }}>{score}%</div>
        <div style={{ fontSize:11, color:'var(--ink2)', fontWeight:800, marginTop:4, textTransform:'uppercase', letterSpacing:'0.5px' }}>{label}</div>
      </div>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const { result, chapter } = location.state || {};
  if(!result) { navigate('/'); return null; }

  const { score, correct, wrong, skipped, totalQ, xpEarned, newBadges, answers } = result;

  return (
    <div className="slide" style={{ background:'var(--bg)' }}>
      <div style={{ height:4, background:'linear-gradient(90deg, var(--orange), var(--cyan))' }} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', background:'var(--surface)', borderBottom:'1px solid var(--border)' }}>
        <button onClick={() => navigate('/')} style={{ background:'none', color:'var(--cyan)', padding:0, fontSize:22, lineHeight:1 }}>←</button>
        <div style={{ fontWeight:800, fontSize:16 }}>Quiz Results</div>
        <div style={{ width:24 }} />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 16px' }}>

        {/* Score ring */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <ScoreRing score={score} />
          <div style={{ fontSize:14, color:'var(--ink2)', fontWeight:700, marginTop:12 }}>{chapter}</div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:16 }}>
          {[
            { label:'Correct', val:correct, color:'var(--green)', bg:'rgba(0,230,118,0.1)', border:'rgba(0,230,118,0.2)' },
            { label:'Wrong',   val:wrong,   color:'var(--red)',   bg:'rgba(255,71,87,0.1)', border:'rgba(255,71,87,0.2)'  },
            { label:'Skipped', val:skipped, color:'var(--gold)',  bg:'rgba(255,215,0,0.1)', border:'rgba(255,215,0,0.2)'  },
          ].map(({ label, val, color, bg, border }) => (
            <div key={label} style={{ background:bg, border:`1px solid ${border}`, borderRadius:16, padding:'14px 8px', textAlign:'center' }}>
              <div style={{ fontSize:26, fontWeight:900, color }}>{val}</div>
              <div style={{ fontSize:11, color, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.5px', marginTop:3 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* XP card */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'16px 20px', marginBottom:16, display:'flex', alignItems:'center', justifyContent:'space-between', overflow:'hidden', position:'relative' }}>
          <div style={{ position:'absolute', right:-20, top:-20, width:100, height:100, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,107,43,0.15) 0%, transparent 70%)' }} />
          <div>
            <div style={{ fontSize:12, color:'var(--ink2)', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:4 }}>XP Earned</div>
            <div style={{ fontSize:32, fontWeight:900, color:'var(--orange)' }}>+{xpEarned}</div>
          </div>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--orange)" opacity="0.3">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>

        {/* New badges */}
        {newBadges?.length > 0 && (
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'16px 20px', marginBottom:16, textAlign:'center' }}>
            <div style={{ fontSize:12, fontWeight:800, color:'var(--gold)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:14 }}>
              Badge{newBadges.length > 1 ? 's' : ''} Unlocked!
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:16 }}>
              {newBadges.map(b => {
                const m = BADGE_META[b] || { label:b, color:['#555','#777'] };
                return (
                  <div key={b} style={{ textAlign:'center' }}>
                    <div style={{ width:56, height:56, borderRadius:'50%', margin:'0 auto 6px', background:`linear-gradient(135deg,${m.color[0]},${m.color[1]})`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 20px ${m.color[0]}66` }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div style={{ fontSize:10, fontWeight:800, color:'var(--ink2)' }}>{m.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Answer review */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:'16px 18px', marginBottom:20 }}>
          <div style={{ fontSize:12, fontWeight:800, color:'var(--cyan)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:14 }}>Answer Review</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {answers.map((a, i) => {
              const isCorrect = a.isCorrect;
              const skipped   = !a.studentAnswer;
              const color     = isCorrect ? 'var(--green)' : skipped ? 'var(--gold)' : 'var(--red)';
              const bg        = isCorrect ? 'rgba(0,230,118,0.07)' : skipped ? 'rgba(255,215,0,0.07)' : 'rgba(255,71,87,0.07)';
              const border    = isCorrect ? 'rgba(0,230,118,0.2)' : skipped ? 'rgba(255,215,0,0.2)' : 'rgba(255,71,87,0.2)';
              return (
                <div key={i} style={{ background:bg, border:`1px solid ${border}`, borderRadius:14, padding:'12px 14px' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)', marginBottom:8, lineHeight:1.4 }}>
                    <span style={{ color:'var(--ink2)', fontWeight:800 }}>Q{i+1}.</span> {a.questionText}
                  </div>
                  <div style={{ fontSize:12, fontWeight:700 }}>
                    {isCorrect ? (
                      <span style={{ color:'var(--green)', display:'flex', alignItems:'center', gap:6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {a.correctAnswer}
                      </span>
                    ) : skipped ? (
                      <div>
                        <span style={{ color:'var(--gold)' }}>Skipped</span>
                        <span style={{ color:'var(--green)', marginLeft:8 }}>· Correct: {a.correctAnswer}</span>
                      </div>
                    ) : (
                      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                        <span style={{ color:'var(--red)', display:'flex', alignItems:'center', gap:6 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          Your answer: {a.studentAnswer}
                        </span>
                        <span style={{ color:'var(--green)', display:'flex', alignItems:'center', gap:6 }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          Correct: {a.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button className="btn-primary" onClick={() => navigate('/')}>Back to Home</button>
          <button className="btn-ghost" onClick={() => navigate('/')}>Try Another Quiz</button>
        </div>
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
