import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function History() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/history').then(r => setResults(r.data.data)).finally(() => setLoading(false));
  }, []);

  function fmt(d) {
    return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  }

  return (
    <div className="screen" style={{ background:'var(--bg)' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', background:'var(--surface)', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:100 }}>
        <button onClick={() => navigate('/')} style={{ background:'none', color:'var(--cyan)', padding:0, fontSize:22, lineHeight:1 }}>←</button>
        <div style={{ fontWeight:800, fontSize:16 }}>Quiz History</div>
        <div style={{ width:24 }} />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px' }}>
        {loading && (
          <div style={{ textAlign:'center', padding:60 }}>
            <div className="spinner" style={{ width:36, height:36, borderWidth:4, borderTopColor:'var(--orange)', borderColor:'var(--surface2)', margin:'0 auto' }} />
          </div>
        )}

        {!loading && results.length === 0 && (
          <div style={{ textAlign:'center', padding:'80px 24px' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ margin:'0 auto 20px', display:'block' }}>
              <circle cx="40" cy="40" r="40" fill="var(--surface)"/>
              <rect x="22" y="22" width="36" height="36" rx="6" fill="none" stroke="var(--border)" strokeWidth="2"/>
              <line x1="30" y1="33" x2="50" y2="33" stroke="var(--ink3)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="30" y1="40" x2="44" y2="40" stroke="var(--ink3)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="30" y1="47" x2="38" y2="47" stroke="var(--ink3)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div style={{ fontWeight:800, fontSize:18, color:'var(--ink)', marginBottom:8 }}>No quizzes yet</div>
            <div style={{ fontSize:14, color:'var(--ink2)', marginBottom:24 }}>Complete your first quiz to see results here</div>
            <button className="btn-primary" style={{ maxWidth:200, margin:'0 auto' }} onClick={() => navigate('/')}>Start a Quiz</button>
          </div>
        )}

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {results.map(r => {
            const color  = r.score>=80 ? 'var(--green)' : r.score>=50 ? 'var(--gold)' : 'var(--red)';
            const bg     = r.score>=80 ? 'rgba(0,230,118,0.12)' : r.score>=50 ? 'rgba(255,215,0,0.12)' : 'rgba(255,71,87,0.12)';
            const border = r.score>=80 ? 'rgba(0,230,118,0.25)' : r.score>=50 ? 'rgba(255,215,0,0.25)' : 'rgba(255,71,87,0.25)';
            return (
              <div key={r._id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:18, padding:'16px', position:'relative', overflow:'hidden' }}>
                {/* Score accent */}
                <div style={{ position:'absolute', top:0, left:0, bottom:0, width:4, background:color, borderRadius:'18px 0 0 18px' }} />
                <div style={{ paddingLeft:12, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, fontSize:15, marginBottom:4 }}>{r.chapter}</div>
                    <div style={{ fontSize:12, color:'var(--ink2)', marginBottom:8 }}>{r.subject} · {fmt(r.createdAt)}</div>
                    {/* Mini stats */}
                    <div style={{ display:'flex', gap:14, fontSize:12, fontWeight:700 }}>
                      <span style={{ color:'var(--green)' }}>✓ {r.correct}</span>
                      <span style={{ color:'var(--red)' }}>✗ {r.wrong}</span>
                      <span style={{ color:'var(--gold)' }}>— {r.skipped}</span>
                      <span style={{ color:'var(--cyan)', marginLeft:'auto' }}>+{r.xpEarned} XP</span>
                    </div>
                  </div>
                  <div style={{ background:bg, border:`1px solid ${border}`, borderRadius:12, padding:'8px 14px', marginLeft:12, textAlign:'center', flexShrink:0 }}>
                    <div style={{ fontSize:22, fontWeight:900, color }}>{r.score}%</div>
                    <div style={{ fontSize:10, color, fontWeight:800, textTransform:'uppercase' }}>{r.totalQ} Qs</div>
                  </div>
                </div>
              </div>
            );
          })}
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
