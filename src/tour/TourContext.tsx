import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOUR } from '../data/tour';
import { useStore } from '../store';

const KEY = 'niraKita.tour.v1';

interface TourState {
  active: boolean;
  step: number;
  open: boolean;
}

interface TourApi extends TourState {
  start: (at?: number) => void;
  go: (n: number) => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
  setOpen: (v: boolean) => void;
}

const Ctx = React.createContext<TourApi | null>(null);

const load = (): TourState => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as TourState;
  } catch {
    /* abaikan */
  }
  return { active: false, step: 0, open: true };
};

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [s, setS] = React.useState<TourState>(load);
  const navigate = useNavigate();
  const { session, signIn } = useStore();
  const sessionRef = React.useRef(session);
  sessionRef.current = session;

  React.useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* abaikan */
    }
  }, [s]);

  const go = React.useCallback(
    (n: number) => {
      const step = Math.max(0, Math.min(TOUR.length - 1, n));
      // Layar staf butuh peran yang sesuai; tur menyiapkannya supaya juri tidak perlu kode undangan.
      const need = TOUR[step].role;
      if (need && sessionRef.current?.role !== need) signIn(need === 'curator' ? 'Kurator Budaya (demo)' : 'Admin Program (demo)', need);
      setS({ active: true, step, open: true });
      navigate(TOUR[step].route);
    },
    [navigate, signIn],
  );

  const start = React.useCallback(
    (at = 0) => {
      // Tur memakai akun demo supaya layar pelajar terbuka tanpa mengisi form masuk.
      if (!session) signIn('Tamu Juri');
      go(at);
    },
    [go, session, signIn],
  );

  const api = React.useMemo<TourApi>(
    () => ({
      ...s,
      start,
      go,
      next: () => (s.step + 1 >= TOUR.length ? setS({ active: false, step: 0, open: true }) : go(s.step + 1)),
      prev: () => go(s.step - 1),
      stop: () => setS((v) => ({ ...v, active: false })),
      setOpen: (open) => setS((v) => ({ ...v, open })),
    }),
    [s, start, go],
  );
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
};

export const useTour = (): TourApi => {
  const v = React.useContext(Ctx);
  if (!v) throw new Error('useTour harus dipakai di dalam TourProvider');
  return v;
};

/** Rute /tur: tautan yang bisa dibagikan ke juri untuk langsung memulai tur. */
export const TurStart: React.FC = () => {
  const { start } = useTour();
  React.useEffect(() => {
    start(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};
