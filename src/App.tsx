import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PhoneShell } from './components/PhoneShell';
import { Perjalanan } from './screens/Perjalanan';
import { Bab } from './screens/Bab';
import { Koleksi, KoleksiDetail } from './screens/Koleksi';
import { Profil } from './screens/Profil';
import { Lab } from './screens/Lab';
import { Arsip, ArsipDetail } from './screens/Arsip';
import { Kurator, KuratorDetail } from './screens/Kurator';
import { Admin } from './screens/Admin';
import { MentorAnotasi, MentorHome, MentorRekam, MentorValidasi } from './screens/Mentor';
import { EnterpriseFinance, EnterprisePartners, EnterprisePrice } from './screens/Enterprise';
import { EnterpriseHome, EnterpriseOrders } from './screens/EnterprisePages';
import { EnterpriseCare, EnterpriseVoucher } from './screens/EnterpriseCare';
import { RequireRole, StaffShell } from './staff/StaffShell';
import { t } from './i18n';
import { QuestDetail } from './screens/Misi';
import { Toko, TokoPesanan } from './screens/Toko';
import { Peta } from './screens/Peta';
import { Splash } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { Masuk } from './screens/Masuk';
import { KodeUndangan } from './screens/KodeUndangan';
import { PasporPublik } from './screens/PasporPublik';
import { useStore } from './store';
import { TurStart } from './tour/TourContext';

/** Penjaga: semua rute /learn/* butuh sesi, kalau tidak diarahkan ke /masuk. */
const RequireSession: React.FC = () => {
  const { session } = useStore();
  return session ? <Outlet /> : <Navigate to="/masuk" replace />;
};

export const App: React.FC = () => (
  <Routes>
    {/* Ruang kerja staf: satu cangkang per peran, tanpa pengalih peran. */}
    <Route element={<RequireRole role="enterprise" />}>
      <Route element={<StaffShell role="enterprise" items={[{ to: '/enterprise', label: t('Beranda', 'Home'), end: true }, { to: '/enterprise/pesanan', label: t('Pesanan', 'Orders') }, { to: '/enterprise/mitra', label: t('Mitra', 'Partners') }, { to: '/enterprise/harga', label: t('Harga QR', 'QR price') }, { to: '/enterprise/voucher', label: 'Voucher' }, { to: '/enterprise/perlindungan', label: t('Perlindungan', 'Protection') }, { to: '/enterprise/keuangan', label: t('Keuangan', 'Finance') }]} />}>
        <Route path="/enterprise" element={<EnterpriseHome />} />
        <Route path="/enterprise/pesanan" element={<EnterpriseOrders />} />
        <Route path="/enterprise/mitra" element={<EnterprisePartners />} />
        <Route path="/enterprise/harga" element={<EnterprisePrice />} />
        <Route path="/enterprise/voucher" element={<EnterpriseVoucher />} />
        <Route path="/enterprise/perlindungan" element={<EnterpriseCare />} />
        <Route path="/enterprise/keuangan" element={<EnterpriseFinance />} />
      </Route>
    </Route>
    <Route element={<RequireRole role="curator" />}>
      <Route element={<StaffShell role="curator" items={[{ to: '/kurator', label: t('Kotak masuk', 'Inbox'), end: true }, { to: '/kurator/anotasi', label: t('Anotasi', 'Annotations') }, { to: '/kurator/arsip', label: t('Arsip', 'Archive') }]} />}>
        <Route path="/kurator" element={<Kurator view="inbox" />} />
        <Route path="/kurator/anotasi" element={<Kurator view="anotasi" />} />
        <Route path="/kurator/arsip" element={<Kurator view="arsip" />} />
        <Route path="/kurator/:id" element={<KuratorDetail />} />
      </Route>
    </Route>
    <Route element={<RequireRole role="mentor" />}>
      <Route element={<StaffShell role="mentor" items={[{ to: '/mentor', label: t('Hari ini', 'Today'), end: true }, { to: '/mentor/rekam', label: t('Rekam', 'Record') }, { to: '/mentor/validasi', label: t('Validasi', 'Validate') }, { to: '/mentor/anotasi', label: t('Anotasi', 'Annotate') }]} />}>
        <Route path="/mentor" element={<MentorHome />} />
        <Route path="/mentor/rekam" element={<MentorRekam />} />
        <Route path="/mentor/validasi" element={<MentorValidasi />} />
        <Route path="/mentor/anotasi" element={<MentorAnotasi />} />
      </Route>
    </Route>
    <Route element={<RequireRole role="admin" />}>
      <Route element={<StaffShell role="admin" items={[{ to: '/admin', label: t('Ringkasan', 'Overview'), end: true }, { to: '/admin/batch', label: t('Batch QR', 'QR batches') }, { to: '/admin/audit', label: 'Audit' }, { to: '/admin/pengguna', label: t('Pengguna', 'Users') }]} />}>
        <Route path="/admin" element={<Admin view="ringkasan" />} />
        <Route path="/admin/batch" element={<Admin view="batch" />} />
        <Route path="/admin/audit" element={<Admin view="audit" />} />
        <Route path="/admin/pengguna" element={<Admin view="pengguna" />} />
      </Route>
    </Route>

    <Route element={<PhoneShell />}>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/masuk" element={<Masuk />} />
      <Route path="/kode-undangan" element={<KodeUndangan />} />
      <Route path="/p/:code" element={<PasporPublik />} />
      <Route path="/toko" element={<Toko />} />
      <Route path="/toko/pesanan/:id" element={<TokoPesanan />} />
      <Route path="/tur" element={<TurStart />} />
      <Route element={<RequireSession />}>
        <Route path="/learn" element={<Perjalanan />} />
        <Route path="/learn/bab/:slug" element={<Bab />} />
        <Route path="/learn/misi/:id" element={<QuestDetail />} />
        <Route path="/learn/peta" element={<Peta />} />
        <Route path="/learn/koleksi" element={<Koleksi />} />
        <Route path="/learn/koleksi/:id" element={<KoleksiDetail />} />
        <Route path="/learn/profil" element={<Profil />} />
        <Route path="/learn/lab" element={<Lab />} />
        <Route path="/learn/arsip" element={<Arsip />} />
        <Route path="/learn/arsip/:id" element={<ArsipDetail />} />
        <Route path="/learn/gerak" element={<Navigate to="/learn/bab/kerajinan-tradisional-transfer-pengetahuan?kartu=praktik" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
