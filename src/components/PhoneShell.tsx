import React from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layers, Map as MapIcon, Route, User, BookOpen, ShieldCheck, QrCode, UserCheck, Users, Store, LogOut } from 'lucide-react';
import { useStore } from '../store';
import { Toast } from './ui';
import { Logo } from '../art/Logo';
import { TourOverlay } from '../tour/TourOverlay';
import { useTour } from '../tour/TourContext';
import { getTour } from '../data/tour';
import { LangToggle, t } from '../i18n';
import { OfflinePill } from '../lib/pwa';

const getTabs = () => [
  { to: '/learn', label: t('Perjalanan', 'Journey'), Icon: Route, end: true },
  { to: '/learn/peta', label: t('Peta', 'Map'), Icon: MapIcon },
  { to: '/learn/koleksi', label: t('Koleksi', 'Collection'), Icon: Layers },
  { to: '/learn/profil', label: t('Profil', 'Profile'), Icon: User },
];

const TabBar: React.FC = () => (
  <nav
    aria-label={t('Navigasi utama', 'Main navigation')}
    className="absolute inset-x-0 bottom-0 z-30 border-t border-bamboo bg-coconut/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md"
  >
    <ul className="grid grid-cols-4">
      {getTabs().map(({ to, label, Icon, end }) => (
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

type RoleKey = 'learner' | 'visitor' | 'mentor' | 'curator' | 'admin' | 'enterprise';
const getRoles = (): { key: RoleKey; label: string; desc: string; Icon: typeof BookOpen; path: string }[] => [
  { key: 'learner', label: t('Pelajar', 'Learner'), desc: t('Perjalanan, peta, koleksi, praktik gerak', 'Journey, map, collection, movement practice'), Icon: BookOpen, path: '/learn' },
  { key: 'visitor', label: t('Pengunjung QR', 'QR visitor'), desc: t('Paspor warisan dan game dari kemasan', 'Heritage passport and game from the package'), Icon: QrCode, path: '/p/NK-001' },
  { key: 'mentor', label: 'Mentor', desc: t('Unggah dengan izin, validasi pelajar, anotasi', 'Consented upload, learner validation, annotation'), Icon: UserCheck, path: '/mentor' },
  { key: 'curator', label: t('Kurator', 'Curator'), desc: t('Persetujuan budaya dan visibilitas', 'Cultural approval and visibility'), Icon: ShieldCheck, path: '/kurator' },
  { key: 'admin', label: 'Admin', desc: t('Capaian pilot, batch QR, audit', 'Pilot progress, QR batches, audit'), Icon: Users, path: '/admin' },
  { key: 'enterprise', label: 'Enterprise', desc: t('Mitra, pembelian adil, harga QR, keuangan', 'Partners, fair purchasing, QR price, finance'), Icon: Store, path: '/enterprise' },
];

const roleOfPath = (p: string): RoleKey | null =>
  p.startsWith('/learn') ? 'learner' : p.startsWith('/p/') ? 'visitor' : p.startsWith('/mentor') ? 'mentor' : p.startsWith('/kurator') ? 'curator' : p.startsWith('/admin') ? 'admin' : p.startsWith('/enterprise') ? 'enterprise' : null;

/** Panel kiri di desktop: konteks ekosistem lima peran supaya juri tidak melihat satu aplikasi saja. */
const SidePanel: React.FC = () => {
  const { reset, session, signIn } = useStore();
  const tour = useTour();
  const TOUR = getTour();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = roleOfPath(pathname);
  const open = (r: RoleKey, path: string) => {
    // Tiap peran dibuka sebagai akun demo, tanpa kode undangan.
    if (r === 'mentor') signIn('Pak Parmadi (mentor demo)', 'mentor');
    else if (r === 'curator') signIn('Kurator Budaya (demo)', 'curator');
    else if (r === 'admin') signIn('Admin Program (demo)', 'admin');
    else if (r === 'enterprise') signIn('Koperasi NIRA (demo)', 'enterprise');
    else if (r === 'learner' && !session) signIn('Tamu Demo', 'learner');
    navigate(path);
  };
  return (
    <aside className="hidden max-w-sm flex-col justify-center gap-6 pr-10 lg:flex">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-caramel-dark">{t('Prototipe konsep', 'Concept prototype')}</p>
        <Logo className="mt-3" size={72} />
        <LangToggle className="mt-3" />
        <p className="mt-3 text-base leading-relaxed text-ink-soft">
          {t('Jejak pengetahuan, warisan masa depan. Platform belajar dan pelestarian pengetahuan gula kelapa Cilongok, dengan persetujuan komunitas di setiap langkah.', 'Trail of knowledge, heritage for the future. A learning and preservation platform for the coconut sugar knowledge of Cilongok, with community consent at every step.')}
        </p>
      </div>
      <div className="rounded-2xl border border-caramel/40 bg-coconut p-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Tur untuk juri · ±4 menit', 'Judges\' tour · ~4 minutes')}</p>
        {tour.active ? (
          <>
          <ol className="mt-2 space-y-1">
            {TOUR.map((st, i) => (
              <li key={st.id}>
                <button
                  type="button"
                  onClick={() => tour.go(i)}
                  className={`flex min-h-[40px] w-full items-center gap-2 rounded-lg px-2 text-left text-sm font-semibold ${
                    i === tour.step ? 'bg-forest text-coconut' : i < tour.step ? 'text-forest' : 'text-ink-soft hover:bg-cream'
                  }`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === tour.step ? 'bg-coconut text-forest' : 'bg-bamboo/60 text-deep-forest'}`}>{i + 1}</span>
                  {st.short}
                </button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={tour.stop} className="mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border-2 border-bamboo text-sm font-semibold text-deep-forest">
            <LogOut className="h-4 w-4" /> {t('Keluar dari tur', 'Exit the tour')}
          </button>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t(`${TOUR.length} layar yang menunjukkan klaim di proposal, satu per satu, dengan panduan singkat.`, `${TOUR.length} screens that show the proposal's claims one by one, with a short guide.`)}</p>
            <button type="button" onClick={() => tour.start(0)} className="mt-3 min-h-[48px] rounded-full bg-forest px-6 text-base font-semibold text-coconut">
              {t('Mulai tur', 'Start the tour')}
            </button>
          </>
        )}
      </div>
      {!tour.active && (
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft">{t('Enam peran dalam satu ekosistem', 'Six roles in one ecosystem')}</p>
        <ul className="space-y-1.5">
          {getRoles().map(({ key, label, desc, Icon, path }) => {
            const active = current === key;
            return (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => open(key, path)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-[56px] w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors ${
                    active ? 'border-forest/40 bg-coconut shadow-sm' : 'border-bamboo/70 bg-transparent hover:bg-coconut'
                  }`}
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-forest text-coconut' : 'bg-bamboo/50 text-deep-forest'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-deep-forest">{label}</span>
                    <span className="block text-xs text-ink-soft">{desc}</span>
                  </span>
                  <span className={`shrink-0 text-[11px] font-semibold ${active ? 'text-forest' : 'text-caramel-dark'}`}>{active ? t('Sedang dilihat', 'Viewing') : t('Buka', 'Open')}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      )}
      <p className="text-xs leading-relaxed text-ink-soft">
        {t('Data ilustratif. Seluruh pembelajaran berbasis darat.', 'Illustrative data. All learning is ground-based.')}
      </p>
      <button
        type="button"
        onClick={reset}
        className="min-h-[44px] w-fit rounded-lg border border-bamboo px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-coconut"
      >
        {t('Setel ulang demo', 'Reset demo')}
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
        <TourOverlay />
        <OfflinePill />
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
