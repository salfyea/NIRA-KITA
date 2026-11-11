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
}

const initialState = (): PersistedState => ({
  records: INITIAL_HERITAGE_RECORDS,
  modules: CURRICULUM_MODULES,
  quests: INITIAL_QUESTS,
  badges: INITIAL_BADGES,
  xp: 320,
  collected: ['REC-CLG-001'],
});

const load = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...initialState(), ...JSON.parse(raw) };
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
  toggleBookmark: (recordId: string) => void;
  toggleLesson: (moduleSlug: string, lessonId: string) => void;
  completeQuest: (questId: string) => void;
  checkIn: (recordId: string) => void;
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

  const toggleBookmark = useCallback((recordId: string) => {
    setState((s) => ({
      ...s,
      records: s.records.map((r) => (r.id === recordId ? { ...r, bookmarked: !r.bookmarked } : r)),
    }));
  }, []);

  const toggleLesson = useCallback((moduleSlug: string, lessonId: string) => {
    setState((s) => ({
      ...s,
      modules: s.modules.map((m) => {
        if (m.slug !== moduleSlug) return m;
        const lessons = m.lessons.map((l) => (l.id === lessonId ? { ...l, completed: !l.completed } : l));
        const done = lessons.filter((l) => l.completed).length;
        return { ...m, lessons, completionPercent: Math.round((done / lessons.length) * 100) };
      }),
    }));
  }, []);

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
          questId === 'QUEST-01' && b.id === 'BADGE-02' ? { ...b, unlocked: true, dateAchieved: 'Hari ini' } : b,
        ),
      };
    });
  }, []);

  const checkIn = useCallback((recordId: string) => {
    setState((s) => (s.collected.includes(recordId) ? s : { ...s, collected: [...s.collected, recordId], xp: s.xp + 20 }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState());
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* abaikan */
    }
  }, []);

  const value = useMemo<Store>(() => {
    const reached = JOURNEY_LEVELS.filter((l) => state.xp >= l.minXp);
    const level = reached[reached.length - 1] ?? JOURNEY_LEVELS[0];
    const nextLevel = JOURNEY_LEVELS.find((l) => l.minXp > state.xp);
    return { ...state, level, nextLevel, toast, showToast, toggleBookmark, toggleLesson, completeQuest, checkIn, reset };
  }, [state, toast, showToast, toggleBookmark, toggleLesson, completeQuest, checkIn, reset]);

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
