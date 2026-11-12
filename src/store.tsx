import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AchievementBadge,
  AuditLogEntry,
  CuratorChecklist,
  CurriculumModule,
  ReviewStatus,
  VisibilityScope,
  HeritageRecord,
  LearnerSubmission,
  Quest,
} from './types/jejakNira';
import {
  CURRICULUM_MODULES,
  INITIAL_BADGES,
  INITIAL_HERITAGE_RECORDS,
  INITIAL_QUESTS,
  JOURNEY_LEVELS,
} from './data/initialData';
import { QR_BATCHES, QrBatch } from './data/batches';
import { BADGE_EN, LEVEL_EN, MOD_EN, QUEST_EN, REC_EN } from './data/en';
import { useLang } from './i18n';

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
  /** Batch kemasan QR (dibuat Admin) dan catatan audit tata kelola. */
  batches: QrBatch[];
  audit: AuditLogEntry[];
  /** Pengajuan pelajar yang menunggu validasi mentor, dan anotasi mentor pada klip Arsip Gerakan. */
  submissions: LearnerSubmission[];
  annotations: Record<string, Annotation>;
  /** NIRA Enterprise: mitra, catatan pembelian, dan harga acuan pasar (Rp per kg). */
  partners: Partner[];
  purchases: Purchase[];
  marketRef: number;
  session: Session | null;
  onboarded: boolean;
}

/** Mitra perajin NIRA Enterprise. Data ilustratif sampai kelompok sungguhan terdaftar dan memberi izin. */
export interface Partner {
  id: string;
  name: string;
  village: string;
  members: number;
  capacityKg: number; // kapasitas gula per bulan
  status: 'Mitra aktif' | 'Penjajakan';
  consentName: boolean; // boleh menampilkan nama kelompok di halaman publik
}

export interface Purchase {
  id: string;
  date: string;
  partnerId: string;
  kg: number;
  pricePerKg: number;
  marketRef: number; // harga acuan pasar saat dicatat
}

export interface Annotation {
  /** Irama acuan hasil pengukuran kamera (hanya untuk anotasi irama). */
  rhythm?: { rpm: number; regularity: number };
  text: string;
  author: string;
  approved: boolean;
}

export interface Session {
  name: string;
  /** Peran sesi. Pendaftaran mandiri selalu menjadi Pelajar. */
  role: 'learner' | 'mentor' | 'curator' | 'admin' | 'enterprise';
}

const SEED_AUDIT: AuditLogEntry[] = [
  { id: 'AUD-001', timestamp: '14 Mei 2026, 09.12', actor: 'Nadia Kusuma', role: 'Kurator', action: 'Menyetujui rekaman', target: 'REC-CLG-001', visibilityNote: 'Publik (halaman QR)' },
  { id: 'AUD-002', timestamp: '15 Mei 2026, 10.40', actor: 'Nadia Kusuma', role: 'Kurator', action: 'Menyetujui rekaman', target: 'REC-CLG-002', visibilityNote: 'Publik (halaman QR)' },
  { id: 'AUD-003', timestamp: '18 Mei 2026, 14.05', actor: 'Nadia Kusuma', role: 'Kurator', action: 'Menyetujui rekaman', target: 'REC-CLG-004', visibilityNote: 'Akses Pelajar' },
  { id: 'AUD-004', timestamp: '20 Mei 2026, 08.30', actor: 'Admin Program', role: 'Admin', action: 'Membuat batch QR', target: 'NK-001', visibilityNote: 'Menaut ke REC-CLG-001' },
];

const NO_CHECK = { identifiesTools: false, explainsFunctions: false, understandsSequence: false, identifiesGroundHazards: false, understandsSafetyPrinciples: false };
const SEED_PARTNERS: Partner[] = [
  { id: 'MIT-01', name: 'Kelompok Penderes Pernasidi', village: 'Pernasidi', members: 14, capacityKg: 220, status: 'Mitra aktif', consentName: true },
  { id: 'MIT-02', name: 'Kelompok Pengolah Panembangan', village: 'Panembangan', members: 9, capacityKg: 160, status: 'Mitra aktif', consentName: true },
  { id: 'MIT-03', name: 'Kelompok Penderes Karangtengah', village: 'Karangtengah', members: 11, capacityKg: 120, status: 'Penjajakan', consentName: false },
];
const SEED_PURCHASES: Purchase[] = [
  { id: 'PUR-001', date: '4 Mei 2026', partnerId: 'MIT-01', kg: 90, pricePerKg: 20000, marketRef: 16000 },
  { id: 'PUR-002', date: '9 Mei 2026', partnerId: 'MIT-02', kg: 70, pricePerKg: 20000, marketRef: 16000 },
  { id: 'PUR-003', date: '16 Mei 2026', partnerId: 'MIT-01', kg: 110, pricePerKg: 20500, marketRef: 16000 },
];

const SEED_SUBMISSIONS: LearnerSubmission[] = [
  {
    id: 'SUB-001', learnerId: 'L-01', learnerName: 'Rani (pilot)', learnerAvatar: '', questId: 'QUEST-02', questTitle: 'The Alchemy of Warm Sap', moduleTitle: 'Kerajinan Tradisional & Transfer Pengetahuan',
    submittedDate: '20 Mei 2026', selectedToolAnswer: 'Pengaduk kayu panjang', reflectionText: 'Aku melihat nira disaring dulu, lalu diaduk terus supaya matang merata. Apinya dibesarkan di awal lalu dikecilkan.',
    status: 'Menunggu Validasi', mentorName: 'Pak Parmadi', competencyChecklist: { ...NO_CHECK },
  },
  {
    id: 'SUB-002', learnerId: 'L-02', learnerName: 'Dimas (pilot)', learnerAvatar: '', questId: 'QUEST-01', questTitle: 'The Forgotten Stories', moduleTitle: 'Identitas Budaya & Warisan Lokal',
    submittedDate: '21 Mei 2026', selectedToolAnswer: 'Pongkor', reflectionText: 'Pongkor adalah wadah bambu penampung nira. Wadahnya harus bersih supaya nira tidak cepat asam.',
    status: 'Menunggu Validasi', mentorName: 'Pak Parmadi', competencyChecklist: { ...NO_CHECK },
  },
  {
    id: 'SUB-003', learnerId: 'DEMO', learnerName: 'Kamu (akun demo)', learnerAvatar: '', questId: 'QUEST-03', questTitle: 'Safe Ground, Safe Hands', moduleTitle: 'Keselamatan Kerja & Manajemen Risiko',
    submittedDate: 'Hari ini', selectedToolAnswer: 'Jarak aman dari tungku', reflectionText: 'Pelajar tidak memanjat. Mengamati dari darat dan menjaga jarak dari tungku serta gula yang panas.',
    status: 'Menunggu Validasi', mentorName: 'Pak Parmadi', competencyChecklist: { ...NO_CHECK },
  },
];

const initialState = (): PersistedState => ({
  records: INITIAL_HERITAGE_RECORDS,
  modules: CURRICULUM_MODULES,
  quests: INITIAL_QUESTS,
  badges: INITIAL_BADGES,
  xp: 320,
  collected: ['REC-CLG-001'],
  labDone: [],
  batches: QR_BATCHES,
  audit: SEED_AUDIT,
  submissions: SEED_SUBMISSIONS,
  annotations: {},
  partners: SEED_PARTNERS,
  purchases: SEED_PURCHASES,
  marketRef: 16000,
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
  signIn: (name: string, role?: Session['role']) => void;
  reviewRecord: (id: string, input: ReviewInput) => void;
  addBatch: (b: Omit<QrBatch, 'code'>) => QrBatch;
  addRecord: (r: HeritageRecord) => void;
  addPurchase: (p: { partnerId: string; kg: number; pricePerKg: number }) => void;
  setMarketRef: (v: number) => void;
  setBatchPricing: (code: string, pricing: NonNullable<QrBatch['pricing']>) => void;
  validateSubmission: (id: string, input: ValidateInput) => void;
  saveAnnotation: (clipId: string, text: string, rhythm?: { rpm: number; regularity: number }) => void;
  approveAnnotation: (clipId: string) => void;
  signOut: () => void;
  finishOnboarding: () => void;
  reset: () => void;
}

export interface ReviewInput {
  status: Extract<ReviewStatus, 'Approved' | 'Revision Requested' | 'Rejected'>;
  visibility: VisibilityScope;
  checklist: CuratorChecklist;
  note: string;
}

export interface ValidateInput {
  status: 'Tervalidasi Mentor' | 'Perlu Revisi';
  checklist: LearnerSubmission['competencyChecklist'];
  feedback: string;
}

const Ctx = createContext<Store | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lang = useLang();
  const [state, setState] = useState<PersistedState>(load);
  const [toast, setToast] = useState<string | null>(null);
  const stateRef = React.useRef(state);
  stateRef.current = state;

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
  const signIn = useCallback((name: string, role: Session['role'] = 'learner') => {
    setState((s) => ({ ...s, session: { name: name.trim() || 'Sahabat Nira', role } }));
  }, []);

  /** Keputusan kurator: status, visibilitas, dan checklist tersimpan, serta tercatat di audit. */
  const reviewRecord = useCallback((id: string, input: ReviewInput) => {
    setState((s) => {
      const rec = s.records.find((r) => r.id === id);
      if (!rec) return s;
      const actor = s.session?.name ?? 'Kurator';
      const label = input.status === 'Approved' ? 'Menyetujui rekaman' : input.status === 'Revision Requested' ? 'Meminta revisi' : 'Menolak rekaman';
      const scope = input.visibility === 'public' ? 'Publik (halaman QR)' : input.visibility === 'learner' ? 'Akses Pelajar' : 'Privat';
      const entry: AuditLogEntry = {
        id: `AUD-${String(s.audit.length + 1).padStart(3, '0')}`,
        timestamp: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        actor,
        role: 'Kurator',
        action: label,
        target: id,
        visibilityNote: input.status === 'Approved' ? scope : input.note || scope,
      };
      return {
        ...s,
        records: s.records.map((r) =>
          r.id === id
            ? {
                ...r,
                reviewStatus: input.status,
                visibility: input.status === 'Approved' ? input.visibility : 'private',
                checklist: input.checklist,
                revisionNotes: input.status === 'Approved' ? undefined : input.note,
                reviewerName: actor,
                publishedDate: input.status === 'Approved' ? 'Hari ini' : r.publishedDate,
              }
            : r,
        ),
        audit: [entry, ...s.audit],
      };
    });
  }, []);

  const stamp = () => new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const audited = (s: PersistedState, role: string, action: string, target: string, note: string): AuditLogEntry[] => [
    { id: `AUD-${String(s.audit.length + 1).padStart(3, '0')}`, timestamp: stamp(), actor: s.session?.name ?? role, role, action, target, visibilityNote: note },
    ...s.audit,
  ];

  /** Mentor mengunggah rekaman: masuk antrean kurator sebagai Privat, belum tampil ke siapa pun. */
  const addRecord = useCallback((r: HeritageRecord) => {
    setState((s) => ({ ...s, records: [r, ...s.records], audit: audited(s, 'Mentor', 'Mengunggah rekaman', r.id, 'Menunggu tinjauan kurator') }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Validasi manusia oleh mentor. Hanya validasi ini yang membuka lencana tervalidasi mentor. */
  const validateSubmission = useCallback((id: string, input: ValidateInput) => {
    setState((s) => {
      const sub = s.submissions.find((x) => x.id === id);
      if (!sub) return s;
      const unlock = input.status === 'Tervalidasi Mentor' && sub.learnerId === 'DEMO';
      return {
        ...s,
        submissions: s.submissions.map((x) =>
          x.id === id ? { ...x, status: input.status, competencyChecklist: input.checklist, mentorFeedback: input.feedback, validatedDate: 'Hari ini' } : x,
        ),
        badges: unlock ? s.badges.map((b) => (b.id === 'BADGE-03' ? { ...b, unlocked: true, dateAchieved: 'Hari ini' } : b)) : s.badges,
        audit: audited(s, 'Mentor', input.status === 'Tervalidasi Mentor' ? 'Memvalidasi pelajar' : 'Meminta revisi pelajar', sub.learnerName, sub.questTitle),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAnnotation = useCallback((clipId: string, text: string, rhythm?: { rpm: number; regularity: number }) => {
    setState((s) => ({
      ...s,
      annotations: { ...s.annotations, [clipId]: { text, rhythm, author: s.session?.name ?? 'Mentor', approved: false } },
      audit: audited(s, 'Mentor', 'Menulis anotasi klip', clipId, 'Menunggu persetujuan kurator'),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const approveAnnotation = useCallback((clipId: string) => {
    setState((s) => {
      const a = s.annotations[clipId];
      if (!a) return s;
      return { ...s, annotations: { ...s.annotations, [clipId]: { ...a, approved: true } }, audit: audited(s, 'Kurator', 'Menyetujui anotasi klip', clipId, 'Tampil di Arsip Gerakan') };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** NIRA Enterprise mencatat pembelian dari mitra. Tiap catatan masuk audit. */
  const addPurchase = useCallback((p: { partnerId: string; kg: number; pricePerKg: number }) => {
    setState((s) => {
      const id = `PUR-${String(s.purchases.length + 1).padStart(3, '0')}`;
      const rec: Purchase = { id, date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }), marketRef: s.marketRef, ...p };
      const partner = s.partners.find((x) => x.id === p.partnerId);
      return { ...s, purchases: [rec, ...s.purchases], audit: audited(s, 'Enterprise', 'Mencatat pembelian', id, `${partner?.name ?? p.partnerId}: ${p.kg} kg`) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMarketRef = useCallback((v: number) => {
    setState((s) => (v > 0 ? { ...s, marketRef: v } : s));
  }, []);

  const setBatchPricing = useCallback((code: string, pricing: NonNullable<QrBatch['pricing']>) => {
    setState((s) => ({
      ...s,
      batches: s.batches.map((b) => (b.code === code ? { ...b, pricing } : b)),
      audit: audited(s, 'Enterprise', 'Mengatur harga batch', code, `${pricing.preservePct}% ke dana pelestarian`),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addBatch = useCallback((b: Omit<QrBatch, 'code'>): QrBatch => {
    const cur = stateRef.current;
    const max = cur.batches.reduce((m, x) => Math.max(m, Number(x.code.replace(/\D/g, '')) || 0), 0);
    const created: QrBatch = { ...b, code: `NK-${String(max + 1).padStart(3, '0')}` };
    setState((s) => {
      const entry: AuditLogEntry = {
        id: `AUD-${String(s.audit.length + 1).padStart(3, '0')}`,
        timestamp: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        actor: s.session?.name ?? 'Admin',
        role: 'Admin',
        action: 'Membuat batch QR',
        target: created.code,
        visibilityNote: `Menaut ke ${b.linkedRecordIds.join(', ') || 'tanpa rekaman'}`,
      };
      return { ...s, batches: [...s.batches, created], audit: [entry, ...s.audit] };
    });
    return created;
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
    const en = lang === 'en';
    const lvl = (l?: (typeof JOURNEY_LEVELS)[number]) => (l && en && LEVEL_EN[l.level] ? { ...l, indonesianName: LEVEL_EN[l.level].name, description: LEVEL_EN[l.level].description } : l);
    const loc = en
      ? {
          records: state.records.map((r) => (REC_EN[r.id] ? { ...r, ...REC_EN[r.id] } : r)),
          modules: state.modules.map((m) => {
            const e = MOD_EN[m.id];
            return e ? { ...m, ...e, title: e.title ?? m.title, lessons: m.lessons.map((l) => ({ ...l, title: e.lessons?.[l.id] ?? l.title })) } : m;
          }),
          quests: state.quests.map((q) => {
            const e = QUEST_EN[q.id];
            return e ? { ...q, ...e, steps: q.steps.map((st) => ({ ...st, ...(e.steps?.[st.id] ?? {}) })) } : q;
          }),
          badges: state.badges.map((b) => (BADGE_EN[b.id] ? { ...b, ...BADGE_EN[b.id] } : b)),
        }
      : { records: state.records, modules: state.modules, quests: state.quests, badges: state.badges };
    return { ...state, ...loc, level: lvl(level) as typeof level, nextLevel: lvl(nextLevel), toast, showToast, completeQuest, checkIn, completeModule, completeLab, signIn, reviewRecord, addBatch, addRecord, addPurchase, setMarketRef, setBatchPricing, validateSubmission, saveAnnotation, approveAnnotation, signOut, finishOnboarding, reset };
  }, [state, lang, toast, showToast, completeQuest, checkIn, completeModule, completeLab, signIn, reviewRecord, addBatch, addRecord, addPurchase, setMarketRef, setBatchPricing, validateSubmission, saveAnnotation, approveAnnotation, signOut, finishOnboarding, reset]);

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
