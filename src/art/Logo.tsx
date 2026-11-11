import React from 'react';
import { Nira } from './Nira';

/** Logo NIRA KITA: Nira si kelapa hijau di samping tulisan merek. */
export const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 56, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`} role="img" aria-label="NIRA KITA">
    <Nira mood="happy" size={size} float={false} />
    <div className="leading-none">
      <p className="font-serif text-[40px] leading-[0.95] text-deep-forest">NIRA KITA</p>
      <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.2em] text-caramel-dark">Sahabat belajar warisan</p>
    </div>
  </div>
);
