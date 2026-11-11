import React from 'react';
import { ShieldCheck, Lock, Eye, Users } from 'lucide-react';
import { HeritageRecord } from '../types/jejakNira';

/** Kartu berornamen: bahasa visual tunggal untuk semua kartu di aplikasi. */
export const Ornate: React.FC<{
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'button';
  onClick?: () => void;
}> = ({ children, className = '', as = 'div', onClick }) => {
  const Tag = as as React.ElementType;
  return (
    <Tag onClick={onClick} className={`ornate ${as === 'button' ? 'text-left w-full' : ''} ${className}`}>
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      {children}
    </Tag>
  );
};

export const SectionTitle: React.FC<{ title: string; action?: React.ReactNode; kicker?: string; flush?: boolean }> = ({
  title,
  action,
  kicker,
  flush,
}) => (
  <div className={`flex items-end justify-between gap-3 ${flush ? '' : 'px-5'}`}>
    <div>
      {kicker && <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{kicker}</p>}
      <h2 className="text-[22px] leading-tight text-deep-forest">{title}</h2>
    </div>
    {action}
  </div>
);

export const ProgressBar: React.FC<{ value: number; tone?: 'forest' | 'caramel'; className?: string }> = ({
  value,
  tone = 'caramel',
  className = '',
}) => (
  <div
    className={`h-1.5 w-full overflow-hidden rounded-full bg-bamboo/70 ${className}`}
    role="progressbar"
    aria-valuenow={Math.round(value)}
    aria-valuemin={0}
    aria-valuemax={100}
  >
    <div
      className={`h-full rounded-full transition-[width] duration-700 ${tone === 'forest' ? 'bg-forest' : 'bg-caramel'}`}
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

/**
 * Chip tata kelola: membuat persetujuan kurator dan cakupan izin terlihat langsung di setiap kartu.
 * Inilah pembeda Jejak Nira dari aplikasi budaya biasa.
 */
export const ApprovalChip: React.FC<{ record: HeritageRecord; compact?: boolean }> = ({ record, compact }) => {
  const approved = record.reviewStatus === 'Approved';
  const scope =
    record.visibility === 'public'
      ? { label: 'Izin publik', Icon: Eye }
      : record.visibility === 'learner'
        ? { label: 'Izin pelajar', Icon: Users }
        : { label: 'Privat', Icon: Lock };
  const label = approved ? `Disetujui kurator · ${scope.label}` : record.reviewStatus === 'In Review' ? 'Menunggu kurator' : 'Perlu revisi';
  const Icon = approved ? ShieldCheck : scope.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
        approved
          ? 'border-forest/25 bg-forest/10 text-forest'
          : 'border-terracotta/30 bg-terracotta/10 text-terracotta'
      }`}
    >
      <Icon className="h-3 w-3" />
      {compact ? (approved ? 'Disetujui' : label) : label}
    </span>
  );
};

export const Pill: React.FC<{ children: React.ReactNode; tone?: 'caramel' | 'forest' | 'sage' }> = ({
  children,
  tone = 'caramel',
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
      tone === 'forest'
        ? 'bg-forest text-coconut'
        : tone === 'sage'
          ? 'bg-sage/30 text-deep-forest'
          : 'bg-caramel/15 text-caramel-dark'
    }`}
  >
    {children}
  </span>
);

/** Maskot Nira: tetes nira dengan tunas daun kelapa. */
export const Mascot: React.FC<{ size?: number; mood?: 'happy' | 'cheer' | 'think'; className?: string }> = ({
  size = 72,
  mood = 'happy',
  className = '',
}) => (
  <svg
    width={size}
    height={size * 1.17}
    viewBox="0 0 120 140"
    role="img"
    aria-label="Nira, maskot NIRA KITA"
    className={`mascot-float shrink-0 ${className}`}
  >
    <path d="M60 22 C58 12 50 6 38 6 C40 18 48 24 60 22Z" fill="#234B3A" />
    <path d="M60 22 C62 10 72 4 86 6 C84 18 74 24 60 22Z" fill="#3B6B53" />
    <path d="M60 24 L60 14" stroke="#18382C" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M60 20 C60 20 18 66 18 94 a42 42 0 0 0 84 0 C102 66 60 20 60 20Z" fill="#B87943" />
    <path d="M60 20 C60 20 102 66 102 94 a42 42 0 0 1 -30 40 C92 112 92 70 60 20Z" fill="#9C6232" opacity="0.45" />
    <ellipse cx="38" cy="86" rx="7" ry="13" fill="#FFFDF8" opacity="0.35" transform="rotate(14 38 86)" />
    <ellipse cx="47" cy="98" rx="4.5" ry={mood === 'cheer' ? 5.5 : 6} fill="#292D29" />
    <ellipse cx="73" cy="98" rx="4.5" ry={mood === 'cheer' ? 5.5 : 6} fill="#292D29" />
    <circle cx="48.5" cy="96" r="1.5" fill="#FFFDF8" />
    <circle cx="74.5" cy="96" r="1.5" fill="#FFFDF8" />
    <ellipse cx="37" cy="110" rx="6" ry="3.5" fill="#B9674C" opacity="0.55" />
    <ellipse cx="83" cy="110" rx="6" ry="3.5" fill="#B9674C" opacity="0.55" />
    {mood === 'happy' && <path d="M51 112 Q60 121 69 112" stroke="#292D29" strokeWidth="3" fill="none" strokeLinecap="round" />}
    {mood === 'cheer' && <path d="M50 110 Q60 126 70 110 Z" fill="#292D29" />}
    {mood === 'think' && <path d="M53 115 Q60 113 67 116" stroke="#292D29" strokeWidth="3" fill="none" strokeLinecap="round" />}
  </svg>
);

export const Toast: React.FC<{ message: string | null }> = ({ message }) =>
  message ? (
    <div
      role="status"
      className="pointer-events-none absolute inset-x-4 top-12 z-40 rounded-2xl bg-deep-forest px-4 py-3 text-sm text-coconut shadow-xl"
      style={{ animation: 'fade-up 0.3s ease both' }}
    >
      {message}
    </div>
  ) : null;
