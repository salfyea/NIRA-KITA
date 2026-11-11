import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AchievementBadge,
  CurriculumModule,
  HeritageRecord,
  Quest,
} from './types/jejakNira';
import {
  CURRICULUM_MODULES,
  INITIAL_BADGES,
  INITIAL_HERITAGE_RECORDS,
  INITIAL_QUESTS,
  JOURNEY_LEVELS,
} from './data/initialData';

const STORAGE_KEY = 'niraKita.learner.v2';

interface PersistedState {
  records: HeritageRecord[];
  modules: CurriculumModule[];
  quests: Quest[];
  badges: AchievementBadge[];
  xp: number;
  collected: string[];
  /** Eksperimen Lab yang sudah diselesaikan (XP sekali per eksperimen). */
  labDone: string[];
  session: Session | null;
  onboarded: boolean;
}

export interface Session {
  name: string;
  /** Peran sesi. Pendaftaran mandiri selalu menjadi Pelajar. */
  role: 'learner';
}

const initialState = (): PersistedState => ({
  records: INITIAL_HERITAGE_RECORDS,
  modules: CURRICULUM_MODULES,
  quests: INITIAL_QUESTS,
  badges: INITIAL_BADGES,
  xp: 320,
  collected: ['REC-CLG-001'],
  labDone: [],
  session: null,
  onboarded: false,
});

const load = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const base = initialState();
      const saved = JSON.parse(raw) as Partial<PersistedState>;
      // Misi baru di data awal tetap muncul bagi pengguna yang sudah punya data tersimpan.
      const quests = [...(saved.quests ?? [])];
      base.quests.forEach((q) => {
        if (!quests.some((x) => x.id === q.id)) quests.push(q);
      });
      return { ...base, ...saved, quests };
    }
  } catch {
    /* penyimpanan tidak tersedia, pakai data awal */
  }
  return initialState();
};

interface Store extends PersistedState {
  level: (typeof JOURNEY_LEVELS)[number];
  nextLevel?: (typeof JOURNEY_LEVELS)[number];
  toast: string | null;
  showToast: (msg: string) => void;
  completeQuest: (questId: string) => void;
  checkIn: (recordId: string) => void;
  completeModule: (moduleSlug: string, recordIds: string[], xp: number) => void;
  completeLab: (labId: string, xp: number) => void;
  signIn: (name: string) => void;
  signOut: () => void;
  finishOnboarding: () => void;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(load);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* abaikan */
    }
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((msg: string) => setToast(msg), []);

  const completeQuest = useCallback((questId: string) => {
    setState((s) => {
      const quest = s.quests.find((q) => q.id === questId);
      if (!quest || quest.completed) return s;
      return {
        ...s,
        xp: s.xp + quest.xpReward,
        quests: s.quests.map((q) =>
          q.id === questId ? { ...q, completed: true, steps: q.steps.map((st) => ({ ...st, completed: true })) } : q,
        ),
        // Lencana digital terbuka; lencana "tervalidasi mentor" tetap menunggu validasi manusia.
        badges: s.badges.map((b) =>
          (questId === 'QUEST-01' && b.id === 'BADGE-02') || (questId === 'QUEST-04' && b.id === 'BADGE-04')
            ? { ...b, unlocked: true, dateAchieved: 'Hari ini' }
            : b,
        ),
      };
    });
  }, []);

  const checkIn = useCallback((recordId: string) => {
    setState((s) => (s.collected.includes(recordId) ? s : { ...s, collected: [...s.collected, recordId], xp: s.xp + 20 }));
  }, []);

  /** Selesaikan bab: semua pelajaran modul ditandai selesai, kartu warisan terkait terkumpul, XP sekali saja. */
  const completeModule = useCallback((moduleSlug: string, recordIds: string[], xp: number) => {
    setState((s) => {
      const mod = s.modules.find((m) => m.slug === moduleSlug);
      if (!mod) return s;
      const already = mod.completionPercent === 100;
      return {
        ...s,
        xp: already ? s.xp : s.xp + xp,
        collected: Array.from(new Set([...s.collected, ...recordIds])),
        modules: s.modules.map((m) =>
          m.slug === moduleSlug
            ? { ...m, completionPercent: 100, lessons: m.lessons.map((l) => ({ ...l, completed: true })) }
            : m,
        ),
      };
    });
  }, []);

  const completeLab = useCallback((labId: string, xp: number) => {
    setState((s) => (s.labDone.includes(labId) ? s : { ...s, labDone: [...s.labDone, labId], xp: s.xp + xp }));
  }, []);

  /** Simulasi: hanya nama tampilan yang disimpan, kata sandi tidak pernah disimpan. */
  const signIn = useCallback((name: string) => {
    setState((s) => ({ ...s, session: { name: name.trim() || 'Sahabat Nira', role: 'learner' } }));
  }, []);
  const signOut = useCallback(() => setState((s) => ({ ...s, session: null })), []);
  const finishOnboarding = useCallback(() => setState((s) => ({ ...s, onboarded: true })), []);

  /** Setel ulang progres demo; sesi dan status onboarding dipertahankan. */
  const reset = useCallback(() => {
    setState((s) => ({ ...initialState(), session: s.session, onboarded: s.onboarded }));
  }, []);

  const value = useMemo<Store>(() => {
    const reached = JOURNEY_LEVELS.filter((l) => state.xp >= l.minXp);
    const level = reached[reached.length - 1] ?? JOURNEY_LEVELS[0];
    const nextLevel = JOURNEY_LEVELS.find((l) => l.minXp > state.xp);
    return { ...state, level, nextLevel, toast, showToast, completeQuest, checkIn, completeModule, completeLab, signIn, signOut, finishOnboarding, reset };
  }, [state, toast, showToast, completeQuest, checkIn, completeModule, completeLab, signIn, signOut, finishOnboarding, reset]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useStore = (): Store => {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore harus dipakai di dalam StoreProvider');
  return v;
};

/** Rekaman yang boleh dilihat Pelajar: sudah disetujui kurator dan visibilitas pelajar atau publik. */
export const isLearnerVisible = (r: HeritageRecord) =>
  r.reviewStatus === 'Approved' && (r.visibility === 'learner' || r.visibility === 'public');
