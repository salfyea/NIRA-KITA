import React from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PhoneShell } from './components/PhoneShell';
import { Perjalanan } from './screens/Perjalanan';
import { Bab } from './screens/Bab';
import { Koleksi, KoleksiDetail } from './screens/Koleksi';
import { Profil } from './screens/Profil';
import { Belajar, ModuleDetail, QuestDetail } from './screens/Belajar';
import { Jelajahi, RecordDetail } from './screens/Jelajahi';
import { Lab } from './screens/Lab';
import { Paspor } from './screens/Paspor';
import { Peta } from './screens/Peta';
import { Splash } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { Masuk } from './screens/Masuk';
import { KodeUndangan } from './screens/KodeUndangan';
import { PasporPublik } from './screens/PasporPublik';
import { useStore } from './store';
import { ArtGallery } from './art/ArtGallery';

/** Penjaga: semua rute /learn/* butuh sesi, kalau tidak diarahkan ke /masuk. */
const RequireSession: React.FC = () => {
  const { session } = useStore();
  return session ? <Outlet /> : <Navigate to="/masuk" replace />;
};

export const App: React.FC = () => (
  <Routes>
    <Route path="/galeri-art" element={<ArtGallery />} />
    <Route element={<PhoneShell />}>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/masuk" element={<Masuk />} />
      <Route path="/kode-undangan" element={<KodeUndangan />} />
      <Route path="/p/:code" element={<PasporPublik />} />
      <Route element={<RequireSession />}>
      <Route path="/learn" element={<Perjalanan />} />
      <Route path="/learn/bab/:slug" element={<Bab />} />
      <Route path="/learn/belajar" element={<Belajar />} />
      <Route path="/learn/belajar/:slug" element={<ModuleDetail />} />
      <Route path="/learn/misi/:id" element={<QuestDetail />} />
      <Route path="/learn/jelajah" element={<Jelajahi />} />
      <Route path="/learn/jelajah/:id" element={<RecordDetail />} />
      <Route path="/learn/lab" element={<Lab />} />
      <Route path="/learn/paspor" element={<Paspor />} />
      <Route path="/learn/peta" element={<Peta />} />
      <Route path="/learn/koleksi" element={<Koleksi />} />
      <Route path="/learn/koleksi/:id" element={<KoleksiDetail />} />
      <Route path="/learn/profil" element={<Profil />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
