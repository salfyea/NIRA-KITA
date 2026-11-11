import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, FileAudio, Lock, Upload } from 'lucide-react';
import { Ornate } from '../components/ui';
import { getGerakan } from '../data/gerakan';
import { t } from '../i18n';
import { subStatus } from '../data/display';
import { HeritageRecord, KnowledgeCategory, LearnerSubmission } from '../types/jejakNira';
import { useStore } from '../store';
import { StaffBar } from './Kurator';

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

/* ============================ Unggah ============================ */
const Unggah: React.FC = () => {
  const { records, modules, addRecord, showToast } = useStore();
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState<KnowledgeCategory>('Teknik tradisional');
  const [slug, setSlug] = React.useState(modules[1]?.slug ?? modules[0].slug);
  const [name, setName] = React.useState('Pak Parmadi');
  const [role, setRole] = React.useState('Penderes Senior & Mentor Komunitas');
  const [attr, setAttr] = React.useState<HeritageRecord['attributionPreference']>('Tampilkan Nama Lengkap');
  const [village, setVillage] = React.useState(VILLAGES[0]);
  const [text, setText] = React.useState('');
  const [file, setFile] = React.useState('');
  const [consent, setConsent] = React.useState({ internalLearning: true, publicQrPage: false, promotionalMaterial: false });
  const [recorded, setRecorded] = React.useState(false);
  const [ethics, setEthics] = React.useState([false, false, false]);
  const [created, setCreated] = React.useState<string | null>(null);

  const ready = title.trim() && text.trim() && name.trim() && recorded && ethics.every(Boolean);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
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
    setCreated(id);
    showToast(t(`${id} terkirim ke antrean kurator.`, `${id} sent to the curator queue.`));
  };

  if (created) {
    return (
      <Ornate className="mt-4 p-5 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-forest" />
        <h2 className="mt-2 text-2xl text-deep-forest">{t('Terkirim ke kurator', 'Sent to the curator')}</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {created} {t('berstatus', 'has the status')} <b>{t('Menunggu tinjauan', 'Awaiting review')}</b> {t('dan', 'and is')} <b>{t('Privat', 'Private')}</b>. {t('Belum tampil ke pelajar maupun publik sampai kurator menyetujuinya.', 'It is not shown to learners or the public until the curator approves it.')}
        </p>
        <div className="mt-4 grid gap-2">
          <Link to="/kurator" className="flex min-h-[52px] items-center justify-center rounded-full bg-forest text-base font-semibold text-coconut">
            {t('Lihat di antrean kurator', 'See it in the curator queue')}
          </Link>
          <button type="button" onClick={() => { setCreated(null); setTitle(''); setText(''); setFile(''); setRecorded(false); setEthics([false, false, false]); }} className="min-h-[52px] rounded-full border-2 border-bamboo text-base font-semibold text-deep-forest">
            {t('Unggah lagi', 'Upload another')}
          </button>
        </div>
      </Ornate>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      <p className="text-sm leading-relaxed text-ink-soft">
        {t('Unggah demonstrasi atau cerita dari narasumber. Rekaman baru berstatus Privat dan menunggu kurator, jadi aman.', 'Upload a demonstration or story from a source. New recordings are Private and wait for the curator, so it is safe.')}
      </p>
      <label className="block text-sm font-semibold text-deep-forest">
        {t('Judul rekaman', 'Recording title')}
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('Contoh: Cara memegang pengaduk saat memasak', 'Example: How to hold the stirrer while cooking')} className={field} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-semibold text-deep-forest">
          {t('Jenis', 'Type')}
          <select value={category} onChange={(e) => setCategory(e.target.value as KnowledgeCategory)} className={field}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{catLabel(c)}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-deep-forest">
          {t('Untuk modul', 'For module')}
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className={field}>
            {modules.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.number.replace('MODUL ', t('Modul ', 'Module '))}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm font-semibold text-deep-forest">
        {t('Penjelasan budaya', 'Cultural explanation')}
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder={t('Ceritakan apa yang diperagakan atau dijelaskan narasumber, dengan kata-kata mereka.', 'Describe what the source demonstrated or explained, in their own words.')} className={`${field} py-2`} />
      </label>
      <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-bamboo bg-coconut px-3 py-2 text-sm font-semibold text-deep-forest">
        <FileAudio className="h-6 w-6 shrink-0 text-caramel-dark" />
        <span className="min-w-0 flex-1 truncate">{file || t('Pilih berkas audio, video, atau foto', 'Choose an audio, video, or photo file')}</span>
        <input type="file" accept="audio/*,video/*,image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')} />
        <Upload className="h-5 w-5 shrink-0 text-ink-soft" />
      </label>
      <p className="-mt-2 text-xs text-ink-soft">{t('Prototipe: berkas tidak dikirim ke server, hanya namanya yang dicatat.', 'Prototype: the file is not sent to a server, only its name is recorded.')}</p>

      <fieldset className="rounded-2xl bg-coconut p-3">
        <legend className="px-1 text-sm font-bold text-deep-forest">{t('Narasumber', 'Source')}</legend>
        <label className="block text-sm font-semibold text-deep-forest">
          {t('Nama', 'Name')}
          <input value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </label>
        <label className="mt-2 block text-sm font-semibold text-deep-forest">
          {t('Peran', 'Role')}
          <input value={role} onChange={(e) => setRole(e.target.value)} className={field} />
        </label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-deep-forest">
            {t('Atribusi', 'Attribution')}
            <select value={attr} onChange={(e) => setAttr(e.target.value as HeritageRecord['attributionPreference'])} className={field}>
              <option value="Tampilkan Nama Lengkap">{t('Tampilkan Nama Lengkap', 'Show full name')}</option>
              <option value="Tampilkan Inisial Komunitas">{t('Tampilkan Inisial Komunitas', 'Show community initials')}</option>
              <option value="Anonim">{t('Anonim', 'Anonymous')}</option>
            </select>
          </label>
          <label className="block text-sm font-semibold text-deep-forest">
            {t('Desa', 'Village')}
            <select value={village} onChange={(e) => setVillage(e.target.value)} className={field}>
              {VILLAGES.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl bg-coconut p-3">
        <legend className="px-1 text-sm font-bold text-deep-forest">{t('Izin dari narasumber', 'Permissions from the source')}</legend>
        {([
          ['internalLearning', t('Boleh dipakai untuk pembelajaran di aplikasi', 'May be used for learning in the app')],
          ['publicQrPage', t('Boleh tampil di halaman QR publik', 'May be shown on the public QR page')],
          ['promotionalMaterial', t('Boleh dipakai untuk materi promosi', 'May be used for promotional material')],
        ] as const).map(([k, t]) => (
          <label key={k} className="flex min-h-[48px] cursor-pointer items-center gap-3 text-sm leading-snug text-charcoal">
            <input type="checkbox" checked={consent[k]} onChange={() => setConsent((c) => ({ ...c, [k]: !c[k] }))} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
            {t}
          </label>
        ))}
        <label className="mt-1 flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl bg-forest/10 px-2 text-sm font-semibold leading-snug text-forest">
          <input type="checkbox" checked={recorded} onChange={() => setRecorded((v) => !v)} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
          {t('Persetujuan narasumber sudah direkam dan disimpan', 'The source\'s consent has been recorded and stored')}
        </label>
      </fieldset>

      <fieldset className="rounded-2xl bg-coconut p-3">
        <legend className="px-1 text-sm font-bold text-deep-forest">{t('Pernyataan etika', 'Ethics statement')}</legend>
        {getEthics().map((label, i) => (
          <label key={label} className="flex min-h-[48px] cursor-pointer items-center gap-3 text-sm leading-snug text-charcoal">
            <input type="checkbox" checked={ethics[i]} onChange={() => setEthics((a) => a.map((v, k) => (k === i ? !v : v)))} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
            {label}
          </label>
        ))}
      </fieldset>

      <button type="submit" disabled={!ready} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-caramel-dark text-lg font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
        {!ready && <Lock className="h-5 w-5" />} {t('Kirim ke kurator', 'Send to curator')}
      </button>
      {!ready && <p className="text-center text-xs text-ink-soft">{t('Lengkapi judul, penjelasan, rekaman izin, dan tiga pernyataan etika.', 'Complete the title, explanation, consent recording, and the three ethics statements.')}</p>}
    </form>
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
            <p className="mt-1 text-xs text-ink-soft">{t('Jawaban alat', 'Tool answer')}: {s.selectedToolAnswer}</p>
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

export const Mentor: React.FC = () => {
  const [tab, setTab] = React.useState<'unggah' | 'validasi' | 'anotasi'>('unggah');
  return (
    <div className="min-h-full bg-cream pb-10">
      <StaffBar current="mentor" />
      <div className="px-5 pt-4">
        <h1 className="text-[28px] leading-tight text-deep-forest">{t('Ruang mentor', 'Mentor room')}</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t('Mentor membawa pengetahuan dari lapangan dengan persetujuan narasumber, menandai teknik, dan memvalidasi pelajar.', 'Mentors bring knowledge from the field with the source\'s consent, mark technique, and validate learners.')}</p>
        <div className="mt-4 grid grid-cols-3 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
          {([
            ['unggah', t('Unggah', 'Upload')],
            ['validasi', t('Validasi', 'Validate')],
            ['anotasi', t('Anotasi', 'Annotate')],
          ] as const).map(([k, t]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-[44px] rounded-full text-sm font-semibold ${tab === k ? 'bg-forest text-coconut' : 'text-ink-soft'}`}>
              {t}
            </button>
          ))}
        </div>
        {tab === 'unggah' && <Unggah />}
        {tab === 'validasi' && <Validasi />}
        {tab === 'anotasi' && <Anotasi />}
      </div>
    </div>
  );
};
