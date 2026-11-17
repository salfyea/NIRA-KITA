import React from 'react';
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { RoleMascot, StaffRole } from '../art/RoleMascot';
import { SidePanel } from '../components/PhoneShell';
import { Toast } from '../components/ui';
import { LangToggle, t } from '../i18n';
import { useStore } from '../store';
import { TourOverlay } from '../tour/TourOverlay';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
  badge?: number;
}

interface RoleConfig {
  label: string;
  tagline: string;
  /** Warna aksen: dipakai untuk sidebar, tombol utama, dan penanda aktif. Tiap peran berbeda. */
  accent: string;
  accentSoft: string;
  base: string;
}

export const ROLE_CONFIG: Record<StaffRole, () => RoleConfig> = {
  mentor: () => ({ label: 'Mentor', tagline: t('Membawa pengetahuan dari lapangan', 'Bringing knowledge from the field'), accent: '#8F5A2C', accentSoft: '#F3E3CC', base: '/mentor' }),
  curator: () => ({ label: t('Kurator', 'Curator'), tagline: t('Menjaga izin dan konteks budaya', 'Guarding consent and cultural context'), accent: '#234B3A', accentSoft: '#DDEBDD', base: '/kurator' }),
  admin: () => ({ label: 'Admin', tagline: t('Super admin · tim founder', 'Super admin · founding team'), accent: '#10261E', accentSoft: '#DCE6DF', base: '/admin' }),
  enterprise: () => ({ label: 'Enterprise', tagline: t('Koperasi dan pengadaan adil', 'Cooperative and fair procurement'), accent: '#A8672F', accentSoft: '#F7E6C9', base: '/enterprise' }),
};

/** Hanya sesi dengan peran yang sama yang boleh masuk ke ruang kerjanya. */
export const RequireRole: React.FC<{ role: StaffRole }> = ({ role }) => {
  const { session } = useStore();
  return session?.role === role ? <Outlet /> : <Navigate to="/kode-undangan" replace />;
};

/** Ukuran desain layar laptop. Isi dirender pada ukuran ini lalu diskalakan agar muat di jendela. */
const LAPTOP_W = 1280;
const LAPTOP_H = 800;

/** Di jendela lebar: ruang kerja tampil di dalam mockup laptop, berdampingan dengan panel konteks. Di ponsel: layar penuh. */
const LaptopFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dim, setDim] = React.useState({ w: window.innerWidth, h: window.innerHeight });
  React.useEffect(() => {
    const on = () => setDim({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  if (dim.w < 1024) return <>{children}</>;
  const withPanel = dim.w >= 1280;
  const availW = dim.w - 48 - (withPanel ? 400 : 0) - 28 - 70;
  const availH = (dim.h - 92) * 1.6;
  const sw = Math.max(480, Math.min(availW, availH, 1440));
  const scale = sw / LAPTOP_W;
  return (
    <div className="paper flex min-h-dvh items-center justify-center gap-0 px-6 py-5">
      {withPanel && <SidePanel />}
      <div style={{ width: LAPTOP_W * scale + 28 }}>
        <div className="relative rounded-t-[22px] rounded-b-md bg-[#0C1512] p-[14px] pb-4 shadow-[0_40px_70px_-30px_rgba(16,38,30,0.6),inset_0_0_0_2px_#1d2a25]">
          <span aria-hidden className="absolute left-1/2 top-[5px] h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-[#2c3b35]" />
          <div className="overflow-hidden rounded-md" style={{ width: LAPTOP_W * scale, height: LAPTOP_H * scale }}>
            <div
              className="no-scrollbar relative overflow-y-auto bg-cream"
              style={{ width: LAPTOP_W, height: LAPTOP_H, transform: `scale(${scale})`, transformOrigin: '0 0', ['--lh' as string]: `${LAPTOP_H}px` }}
            >
              {children}
            </div>
          </div>
        </div>
        <div aria-hidden className="relative -mx-[2.5%] h-4 rounded-b-[28px] bg-gradient-to-b from-[#DADDDA] to-[#A9AEA9] shadow-[0_14px_24px_-10px_rgba(16,38,30,0.5)]" />
      </div>
    </div>
  );
};

/**
 * Cangkang ruang kerja staf. Satu cangkang per peran, tanpa pengalih peran di dalamnya:
 * sidebar di desktop, bilah mengambang di ponsel. Konten halaman ditampilkan lewat <Outlet />.
 */
export const StaffShell: React.FC<{ role: StaffRole; items: NavItem[] }> = ({ role, items }) => {
  const { session, signOut, toast } = useStore();
  const navigate = useNavigate();
  const c = ROLE_CONFIG[role]();
  const out = () => {
    signOut();
    navigate('/masuk', { replace: true });
  };

  const linkCls = (active: boolean) =>
    `relative flex min-h-[46px] items-center justify-between gap-2 rounded-2xl px-4 text-[15px] font-semibold transition-colors ${active ? 'bg-coconut text-deep-forest shadow-[0_6px_14px_-8px_rgba(0,0,0,0.5)]' : 'text-coconut/85 hover:bg-white/10'}`;

  if (role === 'mentor') {
    // Mentor bekerja di lapangan lewat ponsel: selalu tampil dalam bingkai ponsel, tanpa sidebar desktop.
    return (
      <div className="paper flex min-h-dvh items-center justify-center md:p-6">
        <SidePanel />
        <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-cream md:h-[min(844px,calc(100dvh-48px))] md:w-[390px] md:rounded-[46px] md:border-[10px] md:border-night md:shadow-[0_40px_80px_-30px_rgba(16,38,30,0.6)]">
          <header className="flex shrink-0 items-center gap-3 px-4 py-3 text-coconut" style={{ background: c.accent }}>
            <RoleMascot role={role} size={48} />
            <div className="min-w-0 flex-1">
              <p className="font-serif text-xl leading-tight">{c.label}</p>
              <p className="truncate text-xs text-coconut/80">{session?.name}</p>
            </div>
            <LangToggle tone="dark" />
            <button type="button" onClick={out} className="min-h-[44px] px-2 text-sm font-semibold underline decoration-coconut/40 decoration-2 underline-offset-[5px]">
              {t('Keluar', 'Exit')}
            </button>
          </header>
          <div className="no-scrollbar relative flex-1 overflow-y-auto pb-28">
            <Outlet />
          </div>
          <nav aria-label={c.label} className="absolute inset-x-3 bottom-3 z-30 rounded-[30px] bg-coconut/[0.98] p-1.5 shadow-[0_16px_34px_-12px_rgba(16,38,30,0.55),0_2px_6px_rgba(16,38,30,0.08)]">
            <ul className="grid gap-1" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
              {items.map((it) => (
                <li key={it.to}>
                  <NavLink to={it.to} end={it.end} className={({ isActive }) => `flex min-h-[52px] items-center justify-center rounded-[22px] px-1 text-[13px] font-semibold ${isActive ? 'text-coconut' : 'text-ink-soft'}`} style={({ isActive }) => (isActive ? { background: c.accent } : undefined)}>
                    {it.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <Toast message={toast} />
          <TourOverlay />
          <div id="phone-overlay" className="pointer-events-none absolute inset-0 z-50" />
        </div>
      </div>
    );
  }

  return (
    // Di laptop: ruang kerja tampil di dalam mockup laptop. Di ponsel: layar penuh seperti biasa.
    <LaptopFrame>
    <div className="paper min-h-dvh lg:min-h-full lg:grid lg:grid-cols-[280px_1fr]" style={{ ['--accent' as string]: c.accent, ['--accent-soft' as string]: c.accentSoft }}>
      {/* sidebar desktop */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-5 overflow-y-auto px-4 py-6 lg:flex lg:h-[var(--lh)] lg:self-start" style={{ background: `linear-gradient(170deg, ${c.accent} 0%, ${c.accent}f0 60%, #10261E 130%)` }}>
        <div className="rounded-3xl bg-white/10 p-4 text-coconut">
          <div className="flex items-center gap-3">
            <RoleMascot role={role} size={84} mood="happy" className="-ml-1" />
            <div className="min-w-0">
              <p className="font-serif text-2xl leading-tight">{c.label}</p>
              <p className="mt-0.5 text-xs leading-snug text-coconut/80">{c.tagline}</p>
            </div>
          </div>
          <p className="mt-3 truncate border-t border-white/15 pt-3 text-xs text-coconut/80">{session?.name}</p>
        </div>

        <nav aria-label={c.label} className="flex flex-col gap-1.5">
          {items.map((it) => (
            <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => linkCls(isActive)}>
              {it.label}
              {it.badge ? <span className="rounded-full bg-caramel px-2 py-0.5 text-[11px] font-bold text-coconut">{it.badge}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between gap-2">
          <LangToggle tone="dark" />
          <button type="button" onClick={out} className="min-h-[44px] rounded-full px-4 text-sm font-semibold text-coconut underline decoration-coconut/40 decoration-2 underline-offset-[5px]">
            {t('Keluar', 'Sign out')}
          </button>
        </div>
        <p className="text-center text-[11px] text-coconut/60">NIRA KITA · {t('prototipe', 'prototype')}</p>
      </aside>

      {/* header ponsel */}
      <header className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 text-coconut lg:hidden" style={{ background: c.accent }}>
        <RoleMascot role={role} size={48} />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-xl leading-tight">{c.label}</p>
          <p className="truncate text-xs text-coconut/80">{session?.name}</p>
        </div>
        <LangToggle tone="dark" />
        <button type="button" onClick={out} className="min-h-[44px] px-2 text-sm font-semibold underline decoration-coconut/40 decoration-2 underline-offset-[5px]">
          {t('Keluar', 'Exit')}
        </button>
      </header>

      <main className="min-w-0 pb-28 lg:pb-14">
        <div className="mx-auto w-full max-w-[1080px] px-1 lg:px-8 lg:pt-6">
          <Outlet />
        </div>
      </main>

      {/* bilah navigasi ponsel: semua menu, bisa digeser bila banyak */}
      <nav aria-label={c.label} className="fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-30 rounded-[30px] bg-coconut/[0.98] p-1.5 shadow-[0_16px_34px_-12px_rgba(16,38,30,0.55),0_2px_6px_rgba(16,38,30,0.08)] lg:hidden">
        <ul className="no-scrollbar flex gap-1 overflow-x-auto [mask-image:linear-gradient(to_right,#000_calc(100%-22px),transparent_100%)]">
          {items.map((it) => (
            <li key={it.to} className="min-w-[76px] flex-1">
              <NavLink
                to={it.to}
                end={it.end}
                className={({ isActive }) => `relative flex min-h-[48px] items-center justify-center rounded-[22px] px-2 text-[12px] font-semibold leading-tight ${isActive ? 'text-coconut' : 'text-ink-soft'}`}
                style={({ isActive }) => (isActive ? { background: c.accent } : undefined)}
              >
                <span className="whitespace-nowrap text-center">{it.label}</span>
                {it.badge ? <span className="absolute -right-0.5 -top-0.5 rounded-full bg-caramel px-1.5 text-[10px] font-bold text-coconut">{it.badge}</span> : null}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* tur juri, toast */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 mx-auto h-24 w-full max-w-[420px]">
        <Toast message={toast} />
      </div>
      <div id="phone-overlay" className="pointer-events-none fixed inset-y-0 right-0 z-50 w-full max-w-[420px] lg:right-6" />
      <TourOverlay />
    </div>
    </LaptopFrame>
  );
};
