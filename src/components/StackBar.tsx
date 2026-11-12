import React from 'react';
import { rupiah } from '../lib/finance';

/** Batang bertumpuk: tiga bagian dari satu nilai. */
export const StackBar: React.FC<{ parts: { label: string; value: number; color: string }[] }> = ({ parts }) => {
  const total = parts.reduce((a, p) => a + Math.max(0, p.value), 0) || 1;
  return (
    <div>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-bamboo/50" role="img" aria-label={parts.map((p) => `${p.label} ${rupiah(p.value)}`).join(', ')}>
        {parts.map((p) => (
          <div key={p.label} style={{ width: `${(Math.max(0, p.value) / total) * 100}%`, background: p.color }} />
        ))}
      </div>
      <ul className="mt-2 space-y-1">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-2 text-sm text-charcoal">
            <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: p.color }} />
            <span className="flex-1">{p.label}</span>
            <b className="text-deep-forest">{rupiah(p.value)}</b>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const COLORS = { artisan: '#4C9B45', preserve: '#B87943', rest: '#9CAAA2' };

