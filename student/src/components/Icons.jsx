import React from 'react';

export function IconStar({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

export function IconFire({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2c0 0-6 6-6 11a6 6 0 0012 0c0-5-6-11-6-11zm0 16a4 4 0 01-4-4c0-2.5 2-5.5 4-8 2 2.5 4 5.5 4 8a4 4 0 01-4 4z"/>
    </svg>
  );
}

export function IconTrophy({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="8 21 12 21 16 21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
      <path d="M7 4H4a2 2 0 000 4c0 3.31 2.69 6 6 6h4c3.31 0 6-2.69 6-6a2 2 0 000-4h-3"/>
      <rect x="7" y="2" width="10" height="6" rx="1"/>
    </svg>
  );
}

export function IconCheck({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

export function IconX({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export function IconMinus({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

export function IconBook({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
}

export function IconChart({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
      <line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  );
}

export function IconArrowRight({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

export function IconArrowLeft({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

export function IconLogout({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
}

export function IconZap({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

export function IconShield({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}

export function IconUser({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

export function IconPlay({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  );
}

export function BadgeIcon({ type, size = 44 }) {
  const configs = {
    first_quiz:    { bg: ['#7c3aed','#a855f7'], Icon: IconBook,   label: 'First Quiz'    },
    perfect_score: { bg: ['#059669','#10b981'], Icon: IconCheck,  label: 'Perfect Score' },
    week_streak:   { bg: ['#dc2626','#f97316'], Icon: IconFire,   label: '7-Day Streak'  },
    month_streak:  { bg: ['#d97706','#fbbf24'], Icon: IconZap,    label: '30-Day Streak' },
    xp_500:        { bg: ['#2563eb','#60a5fa'], Icon: IconStar,   label: '500 XP'        },
    xp_1000:       { bg: ['#7c3aed','#ec4899'], Icon: IconTrophy, label: '1000 XP'       },
  };
  const cfg = configs[type] || { bg: ['#6b7280','#9ca3af'], Icon: IconShield, label: type };
  const { bg, Icon, label } = cfg;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `linear-gradient(135deg, ${bg[0]}, ${bg[1]})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 6px',
        boxShadow: `0 4px 12px ${bg[0]}44`,
      }}>
        <Icon size={size * 0.45} color="#fff" />
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink2)', lineHeight: 1.2 }}>{label}</div>
    </div>
  );
}
