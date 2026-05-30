import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthCtx } from '../App';
import api from '../api';

export default function Login() {
  const { login }   = useContext(AuthCtx);
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const r = await api.post('/auth/login', form);
      login(r.data.token, r.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="slide" style={{ background: 'var(--bg)' }}>
      {/* Top accent bar */}
      <div style={{ height: 4, background: 'linear-gradient(90deg, var(--orange), var(--cyan))' }} />

      {/* Hero section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 24px' }}>
        {/* Logo illustration */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={{ margin: '0 auto 16px', display: 'block' }}>
            <circle cx="50" cy="50" r="50" fill="var(--surface)"/>
            <circle cx="50" cy="50" r="50" fill="url(#lg1)" opacity="0.15"/>
            <defs>
              <linearGradient id="lg1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ff6b2b"/>
                <stop offset="1" stopColor="#00d4ff"/>
              </linearGradient>
            </defs>
            {/* Book */}
            <rect x="28" y="30" width="44" height="40" rx="4" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1.5"/>
            <rect x="28" y="30" width="22" height="40" rx="4" fill="#ff6b2b" opacity="0.9"/>
            <line x1="50" y1="30" x2="50" y2="70" stroke="var(--border)" strokeWidth="1.5"/>
            {/* Lines on right page */}
            <line x1="55" y1="42" x2="66" y2="42" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round"/>
            <line x1="55" y1="49" x2="68" y2="49" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
            <line x1="55" y1="56" x2="63" y2="56" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
            {/* Star */}
            <path d="M39 44l1.5 3 3.5 0.5-2.5 2.5 0.5 3.5L39 52l-2.5 1.5 0.5-3.5L34.5 47.5l3.5-0.5z" fill="white"/>
          </svg>
          <h1 style={{ fontSize: 32, fontWeight: 900, background: 'linear-gradient(135deg, var(--orange), var(--cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>
            CodexCS
          </h1>
          <p style={{ color: 'var(--ink2)', fontSize: 14, fontWeight: 600 }}>Powered by BytesStack.net</p>
        </div>

        {/* Form */}
        <div style={{ background: 'var(--surface)', borderRadius: 24, padding: '28px 24px', border: '1px solid var(--border)' }}>
          <h2 style={{ marginBottom: 6, fontSize: 22 }}>Welcome back</h2>
          <p style={{ color: 'var(--ink2)', fontSize: 13, marginBottom: 24, fontWeight: 600 }}>Sign in to continue learning</p>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label>Email</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--ink2)', fontWeight: 600, marginTop: 20, fontSize: 14 }}>
          New student?{' '}
          <Link to="/register" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: 800 }}>Create account</Link>
        </p>
        {/* Social Links */}
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
