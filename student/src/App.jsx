import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login    from './pages/Login';
import Register from './pages/Register';
import Home     from './pages/Home';
import Quiz     from './pages/Quiz';
import Results  from './pages/Results';
import History  from './pages/History';
import api      from './api';

export const AuthCtx = React.createContext(null);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('student_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(r => setUser(r.data.user))
      .catch(() => localStorage.removeItem('student_token'))
      .finally(() => setLoading(false));
  }, []);

  function login(token, userData) {
    localStorage.setItem('student_token', token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('student_token');
    setUser(null);
  }

  function updateUser(u) { setUser(prev => ({ ...prev, ...u })); }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ borderTopColor: 'var(--purple)', borderColor: 'var(--purple-light)', width: 40, height: 40, borderWidth: 4 }} />
        <div style={{ marginTop: 12, color: 'var(--purple)', fontWeight: 700 }}>Loading...</div>
      </div>
    </div>
  );

  return (
    <AuthCtx.Provider value={{ user, login, logout, updateUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={!user ? <Login />    : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/"         element={user  ? <Home />     : <Navigate to="/login" />} />
          <Route path="/quiz"     element={user  ? <Quiz />     : <Navigate to="/login" />} />
          <Route path="/results"  element={user  ? <Results />  : <Navigate to="/login" />} />
          <Route path="/history"  element={user  ? <History />  : <Navigate to="/login" />} />
          <Route path="*"         element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthCtx.Provider>
  );
}
