import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, FileAudio, Lock, Upload } from 'lucide-react';
import { Ornate } from '../components/ui';
import { GERAKAN } from '../data/gerakan';
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
const ETHICS = ['Tidak mengubah makna yang dianggap sakral oleh komunitas', 'Atribusi dicantumkan sesuai persetujuan narasumber', 'Tidak memuat kegiatan berbahaya, termasuk memanjat pohon'];

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
    showToast(`${id} terkirim ke antrean kurator.`);
  };

  if (created) {
    return (
      <Ornate className="mt-4 p-5 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-forest" />
        <h2 className="mt-2 text-2xl text-deep-forest">Terkirim ke kurator</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          {created} berstatus <b>Menunggu tinjauan</b> dan <b>Privat</b>. Belum tampil ke pelajar maupun publik sampai kurator menyetujuinya.
        </p>
        <div className="mt-4 grid gap-2">
          <Link to="/kurator" className="flex min-h-[52px] items-center justify-center rounded-full bg-forest text-base font-semibold text-coconut">
            Lihat di antrean kurator
          </Link>
          <button type="button" onClick={() => { setCreated(null); setTitle(''); setText(''); setFile(''); setRecorded(false); setEthics([false, false, false]); }} className="min-h-[52px] rounded-full border-2 border-bamboo text-base font-semibold text-deep-forest">
            Unggah lagi
          </button>
        </div>
      </Ornate>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      <p className="text-sm leading-relaxed text-ink-soft">
        Unggah demonstrasi atau cerita dari narasumber. Rekaman baru berstatus Privat dan menunggu kurator, jadi aman.
      </p>
      <label className="block text-sm font-semibold text-deep-forest">
        Judul rekaman
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Cara memegang pengaduk saat memasak" className={field} />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-semibold text-deep-forest">
          Jenis
          <select value={category} onChange={(e) => setCategory(e.target.value as KnowledgeCategory)} className={field}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-deep-forest">
          Untuk modul
          <select value={slug} onChange={(e) => setSlug(e.target.value)} className={field}>
            {modules.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.number.replace('MODUL ', 'Modul ')}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm font-semibold text-deep-forest">
        Penjelasan budaya
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Ceritakan apa yang diperagakan atau dijelaskan narasumber, dengan kata-kata mereka." className={`${field} py-2`} />
      </label>
      <label className="flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-bamboo bg-coconut px-3 py-2 text-sm font-semibold text-deep-forest">
        <FileAudio className="h-6 w-6 shrink-0 text-caramel-dark" />
        <span className="min-w-0 flex-1 truncate">{file || 'Pilih berkas audio, video, atau foto'}</span>
        <input type="file" accept="audio/*,video/*,image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')} />
        <Upload className="h-5 w-5 shrink-0 text-ink-soft" />
      </label>
      <p className="-mt-2 text-xs text-ink-soft">Prototipe: berkas tidak dikirim ke server, hanya namanya yang dicatat.</p>

      <fieldset className="rounded-2xl bg-coconut p-3">
        <legend className="px-1 text-sm font-bold text-deep-forest">Narasumber</legend>
        <label className="block text-sm font-semibold text-deep-forest">
          Nama
          <input value={name} onChange={(e) => setName(e.target.value)} className={field} />
        </label>
        <label className="mt-2 block text-sm font-semibold text-deep-forest">
          Peran
          <input value={role} onChange={(e) => setRole(e.target.value)} className={field} />
        </label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className="block text-sm font-semibold text-deep-forest">
            Atribusi
            <select value={attr} onChange={(e) => setAttr(e.target.value as HeritageRecord['attributionPreference'])} className={field}>
              <option>Tampilkan Nama Lengkap</option>
              <option>Tampilkan Inisial Komunitas</option>
              <option>Anonim</option>
            </select>
          </label>
          <label className="block text-sm font-semibold text-deep-forest">
            Desa
            <select value={village} onChange={(e) => setVillage(e.target.value)} className={field}>
              {VILLAGES.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl bg-coconut p-3">
        <legend className="px-1 text-sm font-bold text-deep-forest">Izin dari narasumber</legend>
        {([
          ['internalLearning', 'Boleh dipakai untuk pembelajaran di aplikasi'],
          ['publicQrPage', 'Boleh tampil di halaman QR publik'],
          ['promotionalMaterial', 'Boleh dipakai untuk materi promosi'],
        ] as const).map(([k, t]) => (
          <label key={k} className="flex min-h-[48px] cursor-pointer items-center gap-3 text-sm leading-snug text-charcoal">
            <input type="checkbox" checked={consent[k]} onChange={() => setConsent((c) => ({ ...c, [k]: !c[k] }))} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
            {t}
          </label>
        ))}
        <label className="mt-1 flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl bg-forest/10 px-2 text-sm font-semibold leading-snug text-forest">
          <input type="checkbox" checked={recorded} onChange={() => setRecorded((v) => !v)} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
          Persetujuan narasumber sudah direkam dan disimpan
        </label>
      </fieldset>

      <fieldset className="rounded-2xl bg-coconut p-3">
        <legend className="px-1 text-sm font-bold text-deep-forest">Pernyataan etika</legend>
        {ETHICS.map((t, i) => (
          <label key={t} className="flex min-h-[48px] cursor-pointer items-center gap-3 text-sm leading-snug text-charcoal">
            <input type="checkbox" checked={ethics[i]} onChange={() => setEthics((a) => a.map((v, k) => (k === i ? !v : v)))} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
            {t}
          </label>
        ))}
      </fieldset>

      <button type="submit" disabled={!ready} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-caramel-dark text-lg font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
        {!ready && <Lock className="h-5 w-5" />} Kirim ke kurator
      </button>
      {!ready && <p className="text-center text-xs text-ink-soft">Lengkapi judul, penjelasan, rekaman izin, dan tiga pernyataan etika.</p>}
    </form>
  );
};

/* ============================ Validasi pelajar ============================ */
const COMP: [keyof LearnerSubmission['competencyChecklist'], string][] = [
  ['identifiesTools', 'Mengenali alat tradisional'],
  ['explainsFunctions', 'Menjelaskan fungsi alat'],
  ['understandsSequence', 'Memahami urutan proses'],
  ['identifiesGroundHazards', 'Mengenali bahaya di darat'],
  ['understandsSafetyPrinciples', 'Memahami prinsip keselamatan'],
];

const Validasi: React.FC = () => {
  const { submissions, validateSubmission, showToast } = useStore();
  const [open, setOpen] = React.useState<string | null>(null);
  return (
    <ul className="mt-4 space-y-3">
      <li className="rounded-xl bg-bamboo/40 p-3 text-sm leading-relaxed text-deep-forest">
        Hanya validasi mentor manusia yang membuka lencana "Tervalidasi mentor". Aplikasi tidak menilai teknik.
      </li>
      {submissions.map((s) => (
        <li key={s.id}>
          <Ornate className="p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-base font-semibold text-deep-forest">{s.learnerName}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${s.status === 'Tervalidasi Mentor' ? 'bg-forest/10 text-forest' : s.status === 'Perlu Revisi' ? 'bg-[#9E4F37]/10 text-[#9E4F37]' : 'bg-caramel/15 text-caramel-dark'}`}>{s.status}</span>
            </div>
            <p className="text-xs text-ink-soft">
              {s.questTitle} · {s.submittedDate}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal">"{s.reflectionText}"</p>
            <p className="mt-1 text-xs text-ink-soft">Jawaban alat: {s.selectedToolAnswer}</p>
            {s.status === 'Menunggu Validasi' ? (
              open === s.id ? (
                <ValidateForm sub={s} onSave={(i) => { validateSubmission(s.id, i); setOpen(null); showToast(i.status === 'Tervalidasi Mentor' ? 'Pelajar divalidasi dan tercatat di audit.' : 'Revisi diminta dan tercatat di audit.'); }} />
              ) : (
                <button type="button" onClick={() => setOpen(s.id)} className="mt-3 min-h-[48px] w-full rounded-full bg-forest text-base font-semibold text-coconut">
                  Tinjau dan validasi
                </button>
              )
            ) : (
              s.mentorFeedback && <p className="mt-2 text-xs text-ink-soft">Catatan: {s.mentorFeedback}</p>
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
      {COMP.map(([k, t]) => (
        <label key={k} className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl bg-cream px-3 text-sm text-charcoal">
          <input type="checkbox" checked={c[k]} onChange={() => setC((v) => ({ ...v, [k]: !v[k] }))} className="h-6 w-6 shrink-0 accent-[#234B3A]" />
          {t}
        </label>
      ))}
      <textarea value={fb} onChange={(e) => setFb(e.target.value)} rows={2} placeholder="Catatan untuk pelajar (wajib bila meminta revisi)" className={`${field} py-2`} />
      <button type="button" disabled={!all} onClick={() => onSave({ status: 'Tervalidasi Mentor', checklist: c, feedback: fb })} className="min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest">
        {all ? 'Validasi' : 'Centang kelima kompetensi untuk validasi'}
      </button>
      <button type="button" disabled={!fb.trim()} onClick={() => onSave({ status: 'Perlu Revisi', checklist: c, feedback: fb })} className="min-h-[48px] w-full rounded-full border-2 border-caramel-dark text-base font-semibold text-caramel-dark disabled:opacity-40">
        Minta revisi
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
        Tandai teknik pada klip Arsip Gerakan. Anotasi baru tampil setelah kurator menyetujuinya.
      </li>
      {GERAKAN.map((g) => {
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
                  {a && <p className={`mt-1 text-xs font-bold ${a.approved ? 'text-forest' : 'text-caramel-dark'}`}>{a.approved ? 'Disetujui kurator' : 'Menunggu persetujuan kurator'}</p>}
                </div>
              </div>
              <textarea value={draft} onChange={(e) => setDrafts((d) => ({ ...d, [g.id]: e.target.value }))} rows={2} placeholder="Contoh: pegangan di dua pertiga bawah gagang, putaran searah jarum jam." className={`${field} mt-2 py-2`} />
              <button
                type="button"
                disabled={!draft.trim()}
                onClick={() => { saveAnnotation(g.id, draft.trim()); showToast('Anotasi dikirim ke kurator.'); }}
                className="mt-2 min-h-[48px] w-full rounded-full bg-caramel-dark text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
              >
                Kirim anotasi
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
        <h1 className="text-[28px] leading-tight text-deep-forest">Ruang mentor</h1>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">Mentor membawa pengetahuan dari lapangan dengan persetujuan narasumber, menandai teknik, dan memvalidasi pelajar.</p>
        <div className="mt-4 grid grid-cols-3 rounded-full border border-bamboo bg-coconut p-1" role="tablist">
          {([
            ['unggah', 'Unggah'],
            ['validasi', 'Validasi'],
            ['anotasi', 'Anotasi'],
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
