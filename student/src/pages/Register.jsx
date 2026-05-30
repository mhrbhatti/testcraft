import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthCtx } from '../App';
import api from '../api';

const CLASSES = [
  { value:'6', label:'Class 6' }, { value:'7', label:'Class 7' },
  { value:'8', label:'Class 8' }, { value:'9', label:'Class 9' },
  { value:'10',label:'Class 10'},{ value:'11',label:'Class 11'},
  { value:'12',label:'Class 12'},{ value:'13',label:'1st Year'},
  { value:'14',label:'2nd Year'},
];

export default function Register() {
  const { login }   = useContext(AuthCtx);
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ name:'', email:'', password:'', classLevel:'9' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const r = await api.post('/auth/register', form);
      login(r.data.token, r.data.user);
      navigate('/');
    } catch(err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="slide" style={{ background: 'var(--bg)' }}>
      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--cyan), var(--orange))' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ margin: '0 auto 14px', display: 'block' }}>
            <circle cx="40" cy="40" r="40" fill="var(--surface)"/>
            {/* Rocket */}
            <path d="M40 12 C40 12 28 24 28 44 L40 52 L52 44 C52 24 40 12 40 12Z" fill="var(--orange)" opacity="0.9"/>
            <circle cx="40" cy="34" r="7" fill="var(--cyan)" opacity="0.9"/>
            <path d="M28 44 L22 54 L32 50Z" fill="var(--orange2)"/>
            <path d="M52 44 L58 54 L48 50Z" fill="var(--orange2)"/>
            <path d="M35 52 L40 64 L45 52Z" fill="#ff4757" opacity="0.8"/>
          </svg>
          <h1 style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(135deg, var(--cyan), var(--orange))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>
            Join TestCraft
          </h1>
          <p style={{ color: 'var(--ink2)', fontSize: 13, fontWeight: 600 }}>Start your learning journey today</p>
        </div>

        <div style={{ background: 'var(--surface)', borderRadius: 24, padding: '24px', border: '1px solid var(--border)' }}>
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={handleSubmit}>
            {[
              { key:'name',     label:'Full Name', type:'text',     ph:'Your full name'   },
              { key:'email',    label:'Email',     type:'email',    ph:'your@email.com'   },
              { key:'password', label:'Password',  type:'password', ph:'Create a password'},
            ].map(({ key, label, type, ph }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label>{label}</label>
                <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required />
              </div>
            ))}
            <div style={{ marginBottom: 24 }}>
              <label>Your Class</label>
              <select value={form.classLevel} onChange={e => setForm(f => ({ ...f, classLevel: e.target.value }))}>
                {CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <button type="submit" className="btn-cyan" disabled={loading}>
              {loading ? <span className="spinner" style={{ borderTopColor: '#000' }} /> : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--ink2)', fontWeight: 600, marginTop: 20, fontSize: 14 }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--orange)', textDecoration: 'none', fontWeight: 800 }}>Sign in</Link>
        </p>
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
