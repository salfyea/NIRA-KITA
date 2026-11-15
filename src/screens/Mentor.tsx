import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, FileAudio, Lock, Upload } from 'lucide-react';
import { Ornate } from '../components/ui';
import { getGerakan } from '../data/gerakan';
import { t } from '../i18n';
import { subStatus } from '../data/display';
import { RoleMascot } from '../art/RoleMascot';
import { LeafArrow } from '../art/Organic';
import { RekamIrama } from '../components/RekamIrama';
import { HeritageRecord, KnowledgeCategory, LearnerSubmission } from '../types/jejakNira';
import { useStore } from '../store';

const CATEGORIES: KnowledgeCategory[] = ['Cerita lisan', 'Teknik tradisional', 'Alat produksi', 'Istilah lokal', 'Tahapan proses'];
const EXPLORE: Record<KnowledgeCategory, HeritageRecord['exploreCategory']> = {
  'Cerita lisan': 'Cerita Cilongok',
  'Teknik tradisional': 'Proses Tradisional',
  'Alat produksi': 'Kenali Peralatan',
  'Istilah lokal': 'Bahasa dan Istilah Lokal',
  'Tahapan proses': 'Proses Tradisional',
};
const VILLAGES = ['Pernasidi', 'Panembangan', 'Karangtengah'];
const getEthics = () => [
  t('Tidak mengubah makna yang dianggap sakral oleh komunitas', 'Does not alter meanings the community holds sacred'),
  t('Atribusi dicantumkan sesuai persetujuan narasumber', 'Attribution is given as the source agreed'),
  t('Tidak memuat kegiatan berbahaya, termasuk memanjat pohon', 'Contains no hazardous activity, including tree climbing'),
];
const catLabel = (c: string) =>
  ({ 'Cerita lisan': t('Cerita lisan', 'Oral story'), 'Teknik tradisional': t('Teknik tradisional', 'Traditional technique'), 'Alat produksi': t('Alat produksi', 'Production tool'), 'Istilah lokal': t('Istilah lokal', 'Local term'), 'Tahapan proses': t('Tahapan proses', 'Process stage') } as Record<string, string>)[c] ?? c;

const field = 'mt-1 min-h-[48px] w-full rounded-xl border border-bamboo bg-cream px-3 text-base text-charcoal placeholder:text-ink-soft';

/* ============================ Rekam bertahap ============================ */
const DRAFT_KEY = 'niraKita.mentorDraft.v1';

interface Draft {
  step: number;
  title: string;
  category: KnowledgeCategory;
  slug: string;
  name: string;
  role: string;
  attr: HeritageRecord['attributionPreference'];
  village: string;
  text: string;
  file: string;
  consent: { internalLearning: boolean; publicQrPage: boolean; promotionalMaterial: boolean };
  recorded: boolean;
  ethics: boolean[];
}

const loadDraft = (): Partial<Draft> => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw) as Partial<Draft>;
  } catch {
    /* tanpa penyimpanan */
  }
  return {};
};

const big = 'mt-1 min-h-[54px] w-full rounded-[16px_20px_16px_20px] border border-bamboo bg-cream px-4 text-[17px] text-charcoal placeholder:text-ink-soft focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/30';

/**
 * Alur rekam satu layar per langkah: narasumber, izin lebih dulu, cerita, lalu periksa dan kirim.
 * Draf tersimpan di ponsel setiap perubahan, jadi tidak hilang saat sinyal putus atau layar tertutup.
 */
const Unggah: React.FC = () => {
  const { records, modules, addRecord, showToast } = useStore();
  const saved = React.useMemo(loadDraft, []);
  const [step, setStep] = React.useState(saved.step ?? 0);
  const [title, setTitle] = React.useState(saved.title ?? '');
  const [category, setCategory] = React.useState<KnowledgeCategory>(saved.category ?? 'Teknik tradisional');
  const [slug, setSlug] = React.useState(saved.slug ?? modules[1]?.slug ?? modules[0].slug);
  const [name, setName] = React.useState(saved.name ?? 'Pak Parmadi');
  const [role, setRole] = React.useState(saved.role ?? 'Penderes Senior & Mentor Komunitas');
  const [attr, setAttr] = React.useState<HeritageRecord['attributionPreference']>(saved.attr ?? 'Tampilkan Nama Lengkap');
  const [village, setVillage] = React.useState(saved.village ?? VILLAGES[0]);
  const [text, setText] = React.useState(saved.text ?? '');
  const [file, setFile] = React.useState(saved.file ?? '');
  const [consent, setConsent] = React.useState(saved.consent ?? { internalLearning: true, publicQrPage: false, promotionalMaterial: false });
  const [recorded, setRecorded] = React.useState(saved.recorded ?? false);
  const [ethics, setEthics] = React.useState<boolean[]>(saved.ethics ?? [false, false, false]);
  const [created, setCreated] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (created) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, title, category, slug, name, role, attr, village, text, file, consent, recorded, ethics } satisfies Draft));
    } catch {
      /* abaikan */
    }
  }, [step, title, category, slug, name, role, attr, village, text, file, consent, recorded, ethics, created]);

  const STEPS = [t('Narasumber', 'Source'), t('Izin', 'Consent'), t('Cerita', 'Story'), t('Kirim', 'Send')];
  const canNext = [!!name.trim(), recorded, !!title.trim() && !!text.trim(), ethics.every(Boolean)][step];
  const whyNot = [t('Isi nama narasumber.', 'Enter the source\'s name.'), t('Centang bahwa persetujuan sudah direkam.', 'Tick that the consent has been recorded.'), t('Isi judul dan penjelasan.', 'Fill in the title and explanation.'), t('Setujui tiga pernyataan etika.', 'Agree to the three ethics statements.')][step];

  const submit = () => {
    if (!ethics.every(Boolean)) return;
    const n = records.reduce((m, r) => Math.max(m, Number(r.id.replace(/\D/g, '')) || 0), 0) + 1;
    const id = `REC-CLG-${String(n).padStart(3, '0')}`;
    addRecord({
      id,
      title: title.trim(),
      category,
      exploreCategory: EXPLORE[category],
      shortDescription: text.trim().slice(0, 140),
      culturalExplanation: text.trim(),
      contributorName: name.trim(),
      contributorRole: role.trim(),
      attributionPreference: attr,
      language: 'Bahasa Indonesia',
      location: `Desa ${village}, Cilongok, Banyumas`,
      duration: '',
      imageUrl: '',
      audioTranscript: '',
      audioDurationSec: 0,
      consent,
      reviewStatus: 'In Review',
      visibility: 'private',
      submittedDate: 'Hari ini',
      relatedModuleSlug: slug,
      isIllustrativePlaceholder: false,
      bookmarked: false,
    });
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* abaikan */
    }
    setCreated(id);
    showToast(t(`${id} terkirim ke antrean kurator.`, `${id} sent to the curator queue.`));
  };

  const reset = () => {
    setCreated(null);
    setStep(0);
    setTitle('');
    setText('');
    setFile('');
    setRecorded(false);
    setEthics([false, false, false]);
    setConsent({ internalLearning: true, publicQrPage: false, promotionalMaterial: false });
  };

  if (created) {
    return (
      <div className="surface mt-4 rounded-[28px_36px_28px_36px] p-6 text-center">
        <RoleMascot role="mentor" size={104} mood="cheer" className="mx-auto" />
        <h2 className="mt-2 font-serif text-[26px] leading-tight text-deep-forest">{t('Terkirim ke kurator', 'Sent to the curator')}</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {created} {t('berstatus', 'has the status')} <b>{t('Menunggu tinjauan', 'Awaiting review')}</b> {t('dan', 'and is')} <b>{t('Privat', 'Private')}</b>. {t('Belum tampil ke pelajar maupun publik sampai kurator menyetujuinya.', 'It is not shown to learners or the public until the curator approves it.')}
        </p>
        <button type="button" onClick={reset} className="btn-sticker mt-5 min-h-[56px] w-full rounded-[28px_32px_26px_32px] bg-caramel-dark text-lg font-semibold text-coconut">
          {t('Rekam cerita lain', 'Record another story')}
        </button>
        <Link to="/mentor" className="mt-1 flex min-h-[48px] items-center justify-center text-sm font-semibold text-forest underline decoration-caramel decoration-2 underline-offset-[5px]">
          {t('Kembali ke Hari ini', 'Back to Today')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* kemajuan */}
      <div role="progressbar" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1} aria-label={t('Langkah', 'Step')}>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full ${i < step ? 'bg-forest' : i === step ? 'bg-caramel-dark' : 'bg-bamboo/70'}`} />
          ))}
        </div>
        <p className="mt-2 flex items-baseline justify-between text-sm font-semibold text-deep-forest">
          <span>{t('Langkah', 'Step')} {step + 1} {t('dari', 'of')} 4 · {STEPS[step]}</span>
          <span className="text-xs font-normal text-ink-soft">{t('Draf tersimpan di ponsel', 'Draft saved on this phone')}</span>
        </p>
      </div>

      <div className="surface mt-3 rounded-[26px_34px_26px_34px] p-5">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-[24px] leading-tight text-deep-forest">{t('Siapa yang bercerita?', 'Who is telling the story?')}</h2>
              <p className="mt-1 text-sm text-ink-soft">{t('Narasumberlah pemilik pengetahuan ini.', 'The source owns this knowledge.')}</p>
            </div>
            <label className="block text-sm font-semibold text-deep-forest">{t('Nama', 'Name')}<input value={name} onChange={(e) => setName(e.target.value)} className={big} /></label>
            <label className="block text-sm font-semibold text-deep-forest">{t('Peran', 'Role')}<input value={role} onChange={(e) => setRole(e.target.value)} className={big} /></label>
            <label className="block text-sm font-semibold text-deep-forest">
              {t('Bagaimana namanya ditampilkan?', 'How should the name be shown?')}
              <select value={attr} onChange={(e) => setAttr(e.target.value as HeritageRecord['attributionPreference'])} className={big}>
                <option value="Tampilkan Nama Lengkap">{t('Nama lengkap', 'Full name')}</option>
                <option value="Tampilkan Inisial Komunitas">{t('Inisial komunitas', 'Community initials')}</option>
                <option value="Anonim">{t('Anonim', 'Anonymous')}</option>
              </select>
            </label>
            <label className="block text-sm font-semibold text-deep-forest">
              {t('Desa', 'Village')}
              <select value={village} onChange={(e) => setVillage(e.target.value)} className={big}>{VILLAGES.map((v) => <option key={v}>{v}</option>)}</select>
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div>
              <h2 className="font-serif text-[24px] leading-tight text-deep-forest">{t('Izin dulu, baru cerita', 'Consent first, then the story')}</h2>
              <p className="mt-1 text-sm text-ink-soft">{t('Tanyakan ke narasumber, lalu centang sesuai jawabannya.', 'Ask the source, then tick according to their answer.')}</p>
            </div>
            {([
              ['internalLearning', t('Boleh dipakai untuk pembelajaran di aplikasi', 'May be used for learning in the app')],
              ['publicQrPage', t('Boleh tampil di halaman QR publik', 'May be shown on the public QR page')],
              ['promotionalMaterial', t('Boleh dipakai untuk materi promosi', 'May be used for promotional material')],
            ] as const).map(([k, label]) => (
              <label key={k} className="flex min-h-[60px] cursor-pointer items-center gap-3 rounded-2xl bg-cream px-4 py-2 text-[16px] leading-snug text-charcoal">
                <input type="checkbox" checked={consent[k]} onChange={() => setConsent((c) => ({ ...c, [k]: !c[k] }))} className="h-7 w-7 shrink-0 accent-[#8F5A2C]" />
                {label}
              </label>
            ))}
            <label className="flex min-h-[64px] cursor-pointer items-center gap-3 rounded-2xl bg-forest/10 px-4 py-2 text-[16px] font-semibold leading-snug text-forest">
              <input type="checkbox" checked={recorded} onChange={() => setRecorded((v) => !v)} className="h-7 w-7 shrink-0 accent-[#234B3A]" />
              {t('Persetujuan narasumber sudah direkam dan disimpan', 'The source\'s consent has been recorded and stored')}
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-[24px] leading-tight text-deep-forest">{t('Ceritanya', 'The story')}</h2>
              <p className="mt-1 text-sm text-ink-soft">{t('Pakai kata-kata narasumber sendiri.', 'Use the source\'s own words.')}</p>
            </div>
            <label className="flex min-h-[68px] cursor-pointer items-center gap-3 rounded-[16px_20px_16px_20px] border-2 border-dashed border-bamboo bg-coconut px-4 text-[16px] font-semibold text-deep-forest">
              <FileAudio className="h-7 w-7 shrink-0 text-caramel-dark" />
              <span className="min-w-0 flex-1 truncate">{file || t('Ambil atau pilih audio, video, atau foto', 'Take or choose audio, video, or a photo')}</span>
              <input type="file" accept="audio/*,video/*,image/*" capture className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')} />
              <Upload className="h-6 w-6 shrink-0 text-ink-soft" />
            </label>
            <p className="-mt-2 text-xs text-ink-soft">{t('Prototipe: berkas tidak dikirim ke server, hanya namanya yang dicatat.', 'Prototype: the file is not sent to a server, only its name is recorded.')}</p>
            <label className="block text-sm font-semibold text-deep-forest">
              {t('Judul', 'Title')}
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('Contoh: Cara memegang pengaduk', 'Example: How to hold the stirrer')} className={big} />
            </label>
            <label className="block text-sm font-semibold text-deep-forest">
              {t('Apa yang diperagakan atau dijelaskan?', 'What was shown or explained?')}
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder={t('Ceritakan dengan kata-kata narasumber.', 'Tell it in the source\'s words.')} className={`${big} py-3`} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-semibold text-deep-forest">
                {t('Jenis', 'Type')}
                <select value={category} onChange={(e) => setCategory(e.target.value as KnowledgeCategory)} className={big}>{CATEGORIES.map((c) => <option key={c} value={c}>{catLabel(c)}</option>)}</select>
              </label>
              <label className="block text-sm font-semibold text-deep-forest">
                {t('Untuk modul', 'For module')}
                <select value={slug} onChange={(e) => setSlug(e.target.value)} className={big}>{modules.map((m) => <option key={m.slug} value={m.slug}>{m.number.replace('MODUL ', t('Modul ', 'Module '))}</option>)}</select>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-[24px] leading-tight text-deep-forest">{t('Periksa, lalu kirim', 'Check, then send')}</h2>
              <p className="mt-1 text-sm text-ink-soft">{t('Rekaman baru Privat dan menunggu kurator, jadi aman.', 'New recordings are Private and wait for the curator, so it is safe.')}</p>
            </div>
            <dl className="space-y-2 rounded-2xl bg-cream p-4 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-ink-soft">{t('Narasumber', 'Source')}</dt><dd className="text-right font-semibold text-deep-forest">{name} · {village}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-ink-soft">{t('Judul', 'Title')}</dt><dd className="text-right font-semibold text-deep-forest">{title}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-ink-soft">{t('Izin', 'Consent')}</dt><dd className="text-right font-semibold text-deep-forest">{[consent.internalLearning && t('pembelajaran', 'learning'), consent.publicQrPage && 'QR', consent.promotionalMaterial && t('promosi', 'promo')].filter(Boolean).join(', ') || '-'}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-ink-soft">{t('Berkas', 'File')}</dt><dd className="max-w-[55%] truncate text-right font-semibold text-deep-forest">{file || '-'}</dd></div>
            </dl>
            <div>
              <p className="text-sm font-bold text-deep-forest">{t('Pernyataan etika', 'Ethics statement')}</p>
              {getEthics().map((label, i) => (
                <label key={label} className="mt-1 flex min-h-[56px] cursor-pointer items-center gap-3 text-[15px] leading-snug text-charcoal">
                  <input type="checkbox" checked={ethics[i]} onChange={() => setEthics((a) => a.map((v, k) => (k === i ? !v : v)))} className="h-7 w-7 shrink-0 accent-[#234B3A]" />
                  {label}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-3">
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="min-h-[58px] w-[34%] rounded-full border-2 border-bamboo text-base font-semibold text-deep-forest">
            {t('Kembali', 'Back')}
          </button>
        )}
        {step < 3 ? (
          <button type="button" disabled={!canNext} onClick={() => setStep(step + 1)} className="btn-sticker flex min-h-[58px] flex-1 items-center justify-center gap-2 rounded-[28px_32px_26px_32px] bg-caramel-dark text-lg font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
            {t('Lanjut', 'Next')} <LeafArrow className="h-6 w-6" />
          </button>
        ) : (
          <button type="button" disabled={!canNext} onClick={submit} className="btn-sticker flex min-h-[58px] flex-1 items-center justify-center gap-2 rounded-[28px_32px_26px_32px] bg-forest text-lg font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
            {!canNext && <Lock className="h-5 w-5" />} {t('Kirim ke kurator', 'Send to curator')}
          </button>
        )}
      </div>
      {!canNext && <p className="mt-2 text-center text-xs text-ink-soft">{whyNot}</p>}
    </div>
  );
};

/* ============================ Validasi pelajar ============================ */
const getComp = (): [keyof LearnerSubmission['competencyChecklist'], string][] => [
  ['identifiesTools', t('Mengenali alat tradisional', 'Recognises traditional tools')],
  ['explainsFunctions', t('Menjelaskan fungsi alat', 'Explains what the tools do')],
  ['understandsSequence', t('Memahami urutan proses', 'Understands the process sequence')],
  ['identifiesGroundHazards', t('Mengenali bahaya di darat', 'Recognises ground-level hazards')],
  ['understandsSafetyPrinciples', t('Memahami prinsip keselamatan', 'Understands safety principles')],
];

const Validasi: React.FC = () => {
  const { submissions, validateSubmission, showToast } = useStore();
  const [open, setOpen] = React.useState<string | null>(null);
  return (
    <ul className="mt-4 space-y-3">
      <li className="rounded-xl bg-bamboo/40 p-3 text-sm leading-relaxed text-deep-forest">
        {t('Hanya validasi mentor manusia yang membuka lencana "Tervalidasi mentor". Aplikasi tidak menilai teknik.', 'Only human mentor validation unlocks the "Mentor-validated" badge. The app does not judge technique.')}
      </li>
      {submissions.map((s) => (
        <li key={s.id}>
          <Ornate className="p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-base font-semibold text-deep-forest">{s.learnerName}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${s.status === 'Tervalidasi Mentor' ? 'bg-forest/10 text-forest' : s.status === 'Perlu Revisi' ? 'bg-[#9E4F37]/10 text-[#9E4F37]' : 'bg-caramel/15 text-caramel-dark'}`}>{subStatus(s.status)}</span>
            </div>
            <p className="text-xs text-ink-soft">
              {s.questTitle} · {s.submittedDate === 'Hari ini' ? t('Hari ini', 'Today') : s.submittedDate}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal">"{s.reflectionText}"</p>
            {s.selectedToolAnswer && <p className="mt-1 text-xs text-ink-soft">{t('Jawaban alat', 'Tool answer')}: {s.selectedToolAnswer}</p>}
            {s.status === 'Menunggu Validasi' ? (
              open === s.id ? (
                <ValidateForm sub={s} onSave={(i) => { validateSubmission(s.id, i); setOpen(null); showToast(i.status === 'Tervalidasi Mentor' ? t('Pelajar divalidasi dan tercatat di audit.', 'Learner validated and logged in the audit.') : t('Revisi diminta dan tercatat di audit.', 'Revision requested and logged in the audit.')); }} />
              ) : (
                <button type="button" onClick={() => setOpen(s.id)} className="mt-3 min-h-[48px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
                  {t('Tinjau dan validasi', 'Review and validate')}
                </button>
              )
            ) : (
              s.mentorFeedback && <p className="mt-2 text-xs text-ink-soft">{t('Catatan', 'Note')}: {s.mentorFeedback}</p>
            )}
          </Ornate>
        </li>
      ))}
    </ul>
  );
};

const ValidateForm: React.FC<{ sub: LearnerSubmission; onSave: (i: { status: 'Tervalidasi Mentor' | 'Perlu Revisi'; checklist: LearnerSubmission['competencyChecklist']; feedback: string }) => void }> = ({ sub, onSave }) => {
  const [c, setC] = React.useState(sub.competencyChecklist);
  const [fb, setFb] = React.useState('');
  const all = Object.values(c).every(Boolean);
  return (
    <div className="mt-3 space-y-2">
      {getComp().map(([k, label]) => (
        <label key={k} className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl bg-cream px-3 text-sm text-charcoal">
          <input type="checkbox" checked={c[k]} onChange={() => setC((v) => ({ ...v, [k]: !v[k] }))} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
          {label}
        </label>
      ))}
      <textarea value={fb} onChange={(e) => setFb(e.target.value)} rows={2} placeholder={t('Catatan untuk pelajar (wajib bila meminta revisi)', 'Note for the learner (required when requesting a revision)')} className={`${field} py-2`} />
      <button type="button" disabled={!all} onClick={() => onSave({ status: 'Tervalidasi Mentor', checklist: c, feedback: fb })} className="min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
        {all ? t('Validasi', 'Validate') : t('Centang kelima kompetensi untuk validasi', 'Tick all five competencies to validate')}
      </button>
      <button type="button" disabled={!fb.trim()} onClick={() => onSave({ status: 'Perlu Revisi', checklist: c, feedback: fb })} className="min-h-[48px] w-full rounded-full border-2 border-caramel-dark text-base font-semibold text-caramel-dark disabled:opacity-40">
        {t('Minta revisi', 'Request revision')}
      </button>
    </div>
  );
};

/* ============================ Anotasi klip ============================ */
const Anotasi: React.FC = () => {
  const { annotations, saveAnnotation, showToast } = useStore();
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});
  return (
    <ul className="mt-4 space-y-3">
      <li>
        <RekamIrama
          onSave={(r) => {
            saveAnnotation('irama-aduk', t(`Irama acuan mengaduk: ${Math.round(r.rpm)} putaran per menit, keteraturan ${Math.round(r.regularity * 100)}%.`, `Reference stirring rhythm: ${Math.round(r.rpm)} rounds per minute, steadiness ${Math.round(r.regularity * 100)}%.`), { rpm: r.rpm, regularity: r.regularity });
            showToast(t('Irama acuan dikirim ke kurator.', 'Reference rhythm sent to the curator.'));
          }}
        />
        {annotations['irama-aduk'] && (
          <p className={`mt-2 text-xs font-bold ${annotations['irama-aduk'].approved ? 'text-forest' : 'text-caramel-dark'}`}>
            {annotations['irama-aduk'].text} · {annotations['irama-aduk'].approved ? t('Disetujui kurator', 'Approved by the curator') : t('Menunggu persetujuan kurator', 'Awaiting curator approval')}
          </p>
        )}
      </li>
      <li className="rounded-xl bg-bamboo/40 p-3 text-sm leading-relaxed text-deep-forest">
        {t('Tandai teknik pada klip Arsip Gerakan. Anotasi baru tampil setelah kurator menyetujuinya.', 'Mark technique on the Movement Archive clips. An annotation only appears after the curator approves it.')}
      </li>
      {getGerakan().map((g) => {
        const a = annotations[g.id];
        const draft = drafts[g.id] ?? a?.text ?? '';
        return (
          <li key={g.id}>
            <Ornate className="p-3">
              <div className="flex gap-3">
                <video src={`${g.clip}#t=0.6`} preload="metadata" muted playsInline className="h-20 w-28 shrink-0 rounded-lg bg-night object-cover" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-caramel-dark">{g.step}</p>
                  <p className="text-base leading-snug text-deep-forest">{g.title}</p>
                  {a && <p className={`mt-1 text-xs font-bold ${a.approved ? 'text-forest' : 'text-caramel-dark'}`}>{a.approved ? t('Disetujui kurator', 'Approved by the curator') : t('Menunggu persetujuan kurator', 'Awaiting curator approval')}</p>}
                </div>
              </div>
              <textarea value={draft} onChange={(e) => setDrafts((d) => ({ ...d, [g.id]: e.target.value }))} rows={2} placeholder={t('Contoh: pegangan di dua pertiga bawah gagang, putaran searah jarum jam.', 'Example: grip on the lower two thirds of the handle, clockwise rotation.')} className={`${field} mt-2 py-2`} />
              <button
                type="button"
                disabled={!draft.trim()}
                onClick={() => { saveAnnotation(g.id, draft.trim()); showToast(t('Anotasi dikirim ke kurator.', 'Annotation sent to the curator.')); }}
                className="mt-2 min-h-[48px] w-full rounded-full bg-caramel-dark text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
              >
                {t('Kirim anotasi', 'Send annotation')}
              </button>
            </Ornate>
          </li>
        );
      })}
    </ul>
  );
};

const Head: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div>
    <h1 className="font-serif text-[30px] leading-tight text-deep-forest">{title}</h1>
    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text}</p>
  </div>
);

export const MentorRekam: React.FC = () => (
  <div className="px-4 pt-4">
    <Head title={t('Rekam cerita', 'Record a story')} text={t('Langkah demi langkah: izin narasumber lebih dulu, lalu cerita. Rekaman baru Privat sampai disetujui kurator.', 'Step by step: the source\'s consent first, then the story. New recordings stay Private until the curator approves.')} />
    <Unggah />
  </div>
);

export const MentorValidasi: React.FC = () => (
  <div className="px-4 pt-4">
    <Head title={t('Validasi pelajar', 'Validate learners')} text={t('Baca refleksi pelajar, centang kompetensi yang sudah terlihat, lalu validasi atau minta revisi.', 'Read the learners\' reflections, tick the competencies you saw, then validate or ask for a revision.')} />
    <Validasi />
  </div>
);

export const MentorAnotasi: React.FC = () => (
  <div className="px-4 pt-4">
    <Head title={t('Anotasi klip dan irama acuan', 'Clip annotations and reference rhythm')} text={t('Tandai teknik pada klip, atau rekam irama mengaduk perajin sebagai acuan bagi pelajar.', 'Mark technique on clips, or record an artisan\'s stirring rhythm as a reference for learners.')} />
    <Anotasi />
  </div>
);

/** Beranda Mentor: sederhana dan besar, karena dipakai di lapangan lewat ponsel. */
export const MentorHome: React.FC = () => {
  const { submissions, annotations, session } = useStore();
  const waiting = submissions.filter((s) => s.status === 'Menunggu Validasi').length;
  const validated = submissions.filter((s) => s.status === 'Tervalidasi Mentor').length;
  const notes = Object.keys(annotations).length;
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-4 rounded-[28px_36px_28px_36px] p-5" style={{ background: 'linear-gradient(120deg, #F3E3CC, #FBF1DC)' }}>
        <RoleMascot role="mentor" size={96} mood="wave" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{t('Hari ini', 'Today')}</p>
          <h1 className="font-serif text-[28px] leading-tight text-deep-forest">{t('Halo', 'Hello')}, {session?.name?.split(' (')[0]}</h1>
          <p className="mt-0.5 text-sm text-ink-soft">{t('Apa yang mau kamu lakukan?', 'What would you like to do?')}</p>
        </div>
      </div>

      <Link to="/mentor/rekam" className="btn-sticker mt-4 flex min-h-[72px] items-center justify-between gap-3 rounded-[32px_38px_30px_38px] bg-caramel-dark px-6 text-coconut">
        <span>
          <span className="block font-serif text-2xl leading-tight">{t('Rekam cerita', 'Record a story')}</span>
          <span className="block text-sm text-coconut/85">{t('Izin narasumber dulu, lalu ceritanya.', 'The source\'s consent first, then the story.')}</span>
        </span>
        <LeafArrow className="h-7 w-7 shrink-0" />
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link to="/mentor/validasi" className="surface rounded-[22px_28px_22px_28px] p-4">
          <span className="block font-serif text-[34px] leading-none text-deep-forest">{waiting}</span>
          <span className="mt-1 block text-sm font-semibold text-deep-forest">{t('Pelajar menunggu validasi', 'Learners awaiting validation')}</span>
        </Link>
        <Link to="/mentor/anotasi" className="surface rounded-[22px_28px_22px_28px] p-4">
          <span className="block font-serif text-[34px] leading-none text-deep-forest">{notes}</span>
          <span className="mt-1 block text-sm font-semibold text-deep-forest">{t('Anotasi klip dan irama', 'Clip and rhythm notes')}</span>
        </Link>
        <div className="surface col-span-2 rounded-[22px_28px_22px_28px] p-4">
          <span className="block font-serif text-[34px] leading-none text-forest">{validated}</span>
          <span className="mt-1 block text-sm font-semibold text-deep-forest">{t('Pelajar yang sudah kamu validasi', 'Learners you have validated')}</span>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-soft">{t('Hanya validasi mentor manusia yang membuka lencana tervalidasi mentor bagi pelajar.', 'Only human mentor validation unlocks the mentor-validated badge for learners.')}</p>
    </div>
  );
};
