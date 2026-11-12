import React from 'react';
import { Nira, NiraMood } from './Nira';

export type StaffRole = 'mentor' | 'curator' | 'admin' | 'enterprise';

/** Atribut gambar tangan yang dibawa Nira untuk tiap peran. Digambar sendiri, bukan ikon generik. */
const Prop: React.FC<{ role: StaffRole }> = ({ role }) => {
  if (role === 'mentor')
    // pongkor bambu
    return (
      <svg viewBox="0 0 30 60" aria-hidden>
        <rect x="6" y="6" width="18" height="50" rx="7" fill="#C9B05F" stroke="#8F7A38" strokeWidth="1.6" />
        <rect x="5" y="19" width="20" height="4" rx="2" fill="#9C8540" />
        <rect x="5" y="38" width="20" height="4" rx="2" fill="#9C8540" />
        <ellipse cx="15" cy="7" rx="8" ry="3" fill="#4A3A18" />
        <path d="M15 -2 C13 1 13 3 15 5 C17 3 17 1 15 -2Z" fill="#E0A04C" />
      </svg>
    );
  if (role === 'curator')
    // kaca pembesar
    return (
      <svg viewBox="0 0 48 56" aria-hidden>
        <circle cx="20" cy="20" r="15" fill="#E8F2F0" fillOpacity="0.7" stroke="#8F5A2C" strokeWidth="4" />
        <path d="M11 15 C13 10 18 8 23 9" stroke="#FFFDF8" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <path d="M31 31 L44 48" stroke="#7A4F28" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  if (role === 'admin')
    // papan catatan dengan grafik batang
    return (
      <svg viewBox="0 0 40 52" aria-hidden>
        <rect x="3" y="6" width="34" height="43" rx="5" fill="#FFFDF8" stroke="#234B3A" strokeWidth="2.4" />
        <rect x="12" y="2" width="16" height="9" rx="3" fill="#8F5A2C" />
        <rect x="9" y="30" width="5" height="12" rx="1.5" fill="#4C9B45" />
        <rect x="17.5" y="22" width="5" height="20" rx="1.5" fill="#B87943" />
        <rect x="26" y="27" width="5" height="15" rx="1.5" fill="#234B3A" />
      </svg>
    );
  // enterprise: karung gula dengan kubus gula
  return (
    <svg viewBox="0 0 48 52" aria-hidden>
      <path d="M8 18 C6 30 6 42 10 48 H38 C42 42 42 30 40 18 C34 22 14 22 8 18Z" fill="#D9B27A" stroke="#8F5A2C" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M10 18 C14 8 18 6 16 2 C20 4 28 4 32 2 C30 6 34 8 38 18 C32 22 16 22 10 18Z" fill="#E7C79A" stroke="#8F5A2C" strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cx="24" cy="33" rx="8" ry="6.5" fill="#FFFDF8" fillOpacity="0.85" />
      <path d="M19 33 h10 M24 28.5 v9" stroke="#8F5A2C" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};

const PROP_BOX: Record<StaffRole, { w: number; h: number; x: number; y: number; rot: number }> = {
  mentor: { w: 0.26, h: 0.52, x: 0.74, y: 0.5, rot: 8 },
  curator: { w: 0.4, h: 0.44, x: 0.66, y: 0.52, rot: 0 },
  admin: { w: 0.34, h: 0.44, x: 0.68, y: 0.54, rot: 8 },
  enterprise: { w: 0.4, h: 0.43, x: 0.66, y: 0.58, rot: -4 },
};

/** Nira dengan atribut peran: pongkor (Mentor), kaca pembesar (Kurator), papan catatan (Admin), karung gula (Enterprise). */
export const RoleMascot: React.FC<{ role: StaffRole; size?: number; mood?: NiraMood; className?: string }> = ({ role, size = 96, mood = 'happy', className = '' }) => {
  const b = PROP_BOX[role];
  return (
    <span className={`relative inline-block shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Nira mood={mood} size={size} float={false} />
      <span className="absolute" style={{ width: size * b.w, height: size * b.h, left: size * b.x, top: size * b.y, transform: `rotate(${b.rot}deg)` }}>
        <Prop role={role} />
      </span>
    </span>
  );
};
