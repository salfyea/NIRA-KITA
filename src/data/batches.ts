/** Batch kemasan contoh (data ilustratif). Setiap batch menaut ke rekaman yang boleh tampil di halaman QR publik. */
export interface QrBatch {
  code: string;
  /** Harga kemasan dan pembagiannya, diatur NIRA Enterprise. Opsional: tampil di halaman QR bila ada. */
  pricing?: { pricePerPack: number; packGram: number; artisanPerKg: number; preservePct: number };
  productName: string;
  village: string;
  period: string;
  linkedRecordIds: string[];
}

export const QR_BATCHES: QrBatch[] = [
  { code: 'NK-001', productName: 'Gula Kelapa Cetak', village: 'Pernasidi', period: 'Mei 2026', linkedRecordIds: ['REC-CLG-001'], pricing: { pricePerPack: 16000, packGram: 500, artisanPerKg: 20000, preservePct: 8 } },
  { code: 'NK-002', productName: 'Gula Kelapa Cetak', village: 'Panembangan', period: 'Mei 2026', linkedRecordIds: ['REC-CLG-002'] },
];

export const findBatch = (code?: string) => QR_BATCHES.find((b) => b.code.toLowerCase() === (code ?? '').toLowerCase());
