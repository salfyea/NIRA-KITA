import { isEn } from '../i18n';

/** Lokasi tersimpan dalam bahasa Indonesia; di mode English kata "Desa" ditampilkan sebagai "Village". */
export const locLabel = (loc: string): string => (isEn() ? loc.replace(/^Desa /, 'Village ') : loc);

const AUDIT_ACTION: Record<string, string> = {
  'Menyetujui rekaman': 'Approved recording',
  'Meminta revisi': 'Requested revision',
  'Menolak rekaman': 'Rejected recording',
  'Membuat batch QR': 'Created QR batch',
  'Mengunggah rekaman': 'Uploaded recording',
  'Memvalidasi pelajar': 'Validated learner',
  'Meminta revisi pelajar': 'Requested learner revision',
  'Menulis anotasi klip': 'Wrote clip annotation',
  'Menyetujui anotasi klip': 'Approved clip annotation',
  'Mencatat pembelian': 'Recorded purchase',
  'Mengatur harga batch': 'Set batch price',
};
const AUDIT_NOTE: Record<string, string> = {
  'Publik (halaman QR)': 'Public (QR page)',
  'Akses Pelajar': 'Learner access',
  Privat: 'Private',
  'Menunggu tinjauan kurator': 'Awaiting curator review',
  'Menunggu persetujuan kurator': 'Awaiting curator approval',
  'Tampil di Arsip Gerakan': 'Shown in the Movement Archive',
};
const ROLE: Record<string, string> = { Kurator: 'Curator', Mentor: 'Mentor', Admin: 'Admin', Enterprise: 'Enterprise' };

export const auditAction = (a: string) => (isEn() ? AUDIT_ACTION[a] ?? a : a);
export const auditNote = (n: string) =>
  isEn() ? AUDIT_NOTE[n] ?? n.replace(/^Menaut ke /, 'Linked to ').replace('tanpa rekaman', 'no recordings').replace(/% ke dana pelestarian/, '% to the preservation fund') : n;
export const auditRole = (r: string) => (isEn() ? ROLE[r] ?? r : r);
export const auditStamp = (s: string) =>
  isEn() ? s.replace(/\bMei\b/, 'May').replace(/\bAgu\b/, 'Aug').replace(/\bOkt\b/, 'Oct').replace(/\bDes\b/, 'Dec') : s;

export const subStatus = (s: string) =>
  isEn() ? ({ 'Menunggu Validasi': 'Awaiting validation', 'Tervalidasi Mentor': 'Mentor-validated', 'Perlu Revisi': 'Needs revision' } as Record<string, string>)[s] ?? s : s;
