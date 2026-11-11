/** Batch kemasan contoh (data ilustratif). Setiap batch menaut ke rekaman yang boleh tampil di halaman QR publik. */
export interface QrBatch {
  code: string;
  productName: string;
  village: string;
  period: string;
  linkedRecordIds: string[];
}

export const QR_BATCHES: QrBatch[] = [
  { code: 'NK-001', productName: 'Gula Kelapa Cetak', village: 'Pernasidi', period: 'Mei 2026', linkedRecordIds: ['REC-CLG-001'] },
  { code: 'NK-002', productName: 'Gula Kelapa Cetak', village: 'Panembangan', period: 'Mei 2026', linkedRecordIds: ['REC-CLG-002'] },
];

export const findBatch = (code?: string) => QR_BATCHES.find((b) => b.code.toLowerCase() === (code ?? '').toLowerCase());
