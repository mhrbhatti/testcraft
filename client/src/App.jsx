import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import QuestionBank from './pages/QuestionBank';
import AddQuestion from './pages/AddQuestion';
import GenerateTest from './pages/GenerateTest';
import Papers from './pages/Papers';
import Students from './pages/Students';

function Sidebar() {
  const links = [
    { to: '/',          label: 'Dashboard',      icon: '⊞' },
    { to: '/questions', label: 'Question Bank',   icon: '❓' },
    { to: '/add',       label: 'Add Question',    icon: '＋' },
    { to: '/generate',  label: 'Generate Test',   icon: '⚡' },
    { to: '/papers',    label: 'Saved Papers',    icon: '📄' },
    { to: '/students',  label: 'Students',        icon: '👥' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Test<span>Craft</span>
      </div>
      <nav>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div style={{ fontSize: 11, color: 'var(--ink3)', paddingLeft: 12 }}>
        Personal Edition
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/questions"  element={<QuestionBank />} />
            <Route path="/add"        element={<AddQuestion />} />
            <Route path="/add/:id"    element={<AddQuestion />} />
            <Route path="/generate"   element={<GenerateTest />} />
            <Route path="/papers"     element={<Papers />} />
            <Route path="/students"   element={<Students />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
