/**
 * Data pembayaran CONTOH untuk prototipe. Ganti dengan nomor dan rekening koperasi yang sebenarnya.
 * Prototipe tidak memproses pembayaran: pembeli mentransfer sendiri, lalu koperasi menandai pesanan sudah dibayar.
 */
export const PAYMENT = {
  whatsapp: '6281200000000', // contoh, format internasional tanpa +
  whatsappLabel: '0812 0000 0000',
  bank: 'Bank Contoh',
  account: '123 456 7890',
  holder: 'Koperasi NIRA (contoh)',
};

export const waLink = (message: string) => `https://wa.me/${PAYMENT.whatsapp}?text=${encodeURIComponent(message)}`;
