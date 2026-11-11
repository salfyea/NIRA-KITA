import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Layers, Map as MapIcon, Route, User, BookOpen, ShieldCheck, QrCode, UserCheck, Users } from 'lucide-react';
import { useStore } from '../store';
import { Toast } from './ui';

const TABS = [
  { to: '/learn', label: 'Perjalanan', Icon: Route, end: true },
  { to: '/learn/peta', label: 'Peta', Icon: MapIcon },
  { to: '/learn/koleksi', label: 'Koleksi', Icon: Layers },
  { to: '/learn/profil', label: 'Profil', Icon: User },
];

const TabBar: React.FC = () => (
  <nav
    aria-label="Navigasi utama"
    className="absolute inset-x-0 bottom-0 z-30 border-t border-bamboo bg-coconut/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md"
  >
    <ul className="grid grid-cols-4">
      {TABS.map(({ to, label, Icon, end }) => (
        <li key={to}>
          <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[11px] font-semibold transition-colors ${
                isActive ? 'text-deep-forest' : 'text-ink-soft hover:text-deep-forest'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute -top-2 h-[3px] w-8 rounded-full bg-caramel transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
                />
                <Icon className={`h-[22px] w-[22px] ${isActive ? 'text-caramel-dark' : ''}`} strokeWidth={isActive ? 2.3 : 1.9} />
                {label}
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

const ROLES = [
  { label: 'Pelajar', desc: 'Perjalanan, peta, koleksi', Icon: BookOpen, active: true },
  { label: 'Pengunjung QR', desc: 'Paspor warisan dari QR (placeholder)', Icon: QrCode, active: false },
  { label: 'Mentor', desc: 'Unggah dan validasi (kode undangan)', Icon: UserCheck, active: false },
  { label: 'Kurator', desc: 'Persetujuan budaya', Icon: ShieldCheck, active: false },
  { label: 'Admin', desc: 'Program dan batch QR', Icon: Users, active: false },
];

/** Panel kiri di desktop: konteks ekosistem lima peran supaya juri tidak melihat satu aplikasi saja. */
const SidePanel: React.FC = () => {
  const { reset } = useStore();
  return (
    <aside className="hidden max-w-sm flex-col justify-center gap-6 pr-10 lg:flex">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-caramel-dark">Prototipe konsep</p>
        <h1 className="mt-2 text-5xl leading-[1.05] text-deep-forest">NIRA KITA</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          Jejak pengetahuan, warisan masa depan. Platform belajar dan pelestarian pengetahuan gula kelapa Cilongok,
          dengan persetujuan komunitas di setiap langkah.
        </p>
      </div>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">Lima peran dalam satu ekosistem</p>
        <ul className="space-y-1.5">
          {ROLES.map(({ label, desc, Icon, active }) => (
            <li
              key={label}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                active ? 'border-forest/30 bg-coconut' : 'border-bamboo/60 bg-transparent opacity-75'
              }`}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-forest text-coconut' : 'bg-bamboo/50 text-ink-soft'}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-deep-forest">{label}</span>
                <span className="block text-xs text-ink-soft">{desc}</span>
              </span>
              <span className="text-[11px] font-semibold text-ink-soft">{active ? 'Sedang dilihat' : 'Segera'}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs leading-relaxed text-ink-soft">
        Data ilustratif. Istilah lokal masih menunggu validasi komunitas. Seluruh pembelajaran berbasis darat.
      </p>
      <button
        type="button"
        onClick={reset}
        className="min-h-[44px] w-fit rounded-lg border border-bamboo px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-coconut"
      >
        Setel ulang demo
      </button>
    </aside>
  );
};

export const PhoneShell: React.FC = () => {
  const { toast } = useStore();
  const { pathname } = useLocation();
  const showTabs = pathname.startsWith('/learn') && !pathname.startsWith('/learn/bab');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="paper flex min-h-dvh items-center justify-center md:p-6">
      <SidePanel />
      <div
        className="relative flex h-dvh w-full flex-col overflow-hidden bg-cream md:h-[min(844px,calc(100dvh-48px))] md:w-[390px] md:rounded-[46px] md:border-[10px] md:border-night md:shadow-[0_40px_80px_-30px_rgba(16,38,30,0.6)]"
      >
        <Toast message={toast} />
        <div ref={scrollRef} className={`no-scrollbar relative flex-1 overflow-y-auto ${showTabs ? (pathname === '/learn/peta' ? 'pb-[72px]' : 'pb-24') : ''}`}>
          <div key={pathname} className={`screen-enter ${showTabs && pathname !== '/learn/peta' ? '' : 'h-full'}`}>
            <Outlet />
          </div>
        </div>
        {showTabs && <TabBar />}
        <div id="phone-overlay" className="pointer-events-none absolute inset-0 z-50" />
      </div>
    </div>
  );
};
