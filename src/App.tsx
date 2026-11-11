import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PhoneShell } from './components/PhoneShell';
import { Beranda } from './screens/Beranda';
import { Belajar, ModuleDetail, QuestDetail } from './screens/Belajar';
import { Jelajahi, RecordDetail } from './screens/Jelajahi';
import { Lab } from './screens/Lab';
import { Paspor } from './screens/Paspor';
import { Peta } from './screens/Peta';
import { ArtGallery } from './art/ArtGallery';

export const App: React.FC = () => (
  <Routes>
    <Route path="/galeri-art" element={<ArtGallery />} />
    <Route element={<PhoneShell />}>
      <Route path="/learn" element={<Beranda />} />
      <Route path="/learn/belajar" element={<Belajar />} />
      <Route path="/learn/belajar/:slug" element={<ModuleDetail />} />
      <Route path="/learn/misi/:id" element={<QuestDetail />} />
      <Route path="/learn/jelajah" element={<Jelajahi />} />
      <Route path="/learn/jelajah/:id" element={<RecordDetail />} />
      <Route path="/learn/lab" element={<Lab />} />
      <Route path="/learn/paspor" element={<Paspor />} />
      <Route path="/learn/peta" element={<Peta />} />
      <Route path="*" element={<Navigate to="/learn" replace />} />
    </Route>
  </Routes>
);
