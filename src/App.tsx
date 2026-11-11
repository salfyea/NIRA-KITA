import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PhoneShell } from './components/PhoneShell';
import { Perjalanan } from './screens/Perjalanan';
import { Bab } from './screens/Bab';
import { Koleksi, KoleksiDetail } from './screens/Koleksi';
import { Profil } from './screens/Profil';
import { Lab } from './screens/Lab';
import { Arsip, ArsipDetail } from './screens/Arsip';
import { Kurator, KuratorDetail, RequireStaff } from './screens/Kurator';
import { Admin } from './screens/Admin';
import { Mentor } from './screens/Mentor';
import { QuestDetail } from './screens/Misi';
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
    <Route element={<PhoneShell />}>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/masuk" element={<Masuk />} />
      <Route path="/kode-undangan" element={<KodeUndangan />} />
      <Route path="/p/:code" element={<PasporPublik />} />
      <Route path="/tur" element={<TurStart />} />
      <Route path="/kurator" element={<RequireStaff><Kurator /></RequireStaff>} />
      <Route path="/kurator/:id" element={<RequireStaff><KuratorDetail /></RequireStaff>} />
      <Route path="/admin" element={<RequireStaff><Admin /></RequireStaff>} />
      <Route path="/mentor" element={<RequireStaff><Mentor /></RequireStaff>} />
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
