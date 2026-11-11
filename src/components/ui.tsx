import React from 'react';
import { createPortal } from 'react-dom';
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

/** Bottom sheet yang tampil di dalam bingkai ponsel (portal ke #phone-overlay). */
export const Sheet: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({
  open,
  onClose,
  title,
  children,
}) => {
  const [host, setHost] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => setHost(document.getElementById('phone-overlay')), []);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open || !host) return null;
  return createPortal(
    <div className="pointer-events-auto absolute inset-0 flex items-end bg-night/50" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="sheet-enter max-h-[85%] w-full overflow-y-auto rounded-t-[28px] bg-cream pb-6 shadow-2xl"
      >
        <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-bamboo" />
        {children}
      </div>
    </div>,
    host,
  );
};
