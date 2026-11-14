import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, MessageSquareText } from 'lucide-react';
import { useStore } from '../store';
import { t } from '../i18n';
import { subStatus } from '../data/display';

const MIN = 40;

/**
 * Tugas refleksi: muncul setelah bab selesai. Pelajar menulis beberapa kalimat, tulisan itu masuk antrean
 * validasi mentor manusia. Aplikasi tidak menilai isinya.
 */
export const QuestDetail: React.FC = () => {
  const { id } = useParams();
  const { quests, modules, submissions, submitReflection, showToast } = useStore();
  const q = quests.find((x) => x.id === id);
  const mod = modules.find((m) => m.associatedQuestId === id);
  const mine = submissions.find((x) => x.questId === id && x.learnerId === 'DEMO');
  const [text, setText] = React.useState('');
  const ready = !!mod && mod.completionPercent >= 100;

  if (!q || !mod) return <Navigate to="/learn" replace />;
  if (!ready) return <Navigate to="/learn" replace />;

  const canSend = text.trim().length >= MIN;
  const revise = mine?.status === 'Perlu Revisi';
  return (
    <div className="space-y-5 px-5 pb-28 pt-2">
      <Link to="/learn" className="inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-deep-forest">
        <ArrowLeft className="h-4 w-4" /> {t('Perjalanan', 'Journey')}
      </Link>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-caramel-dark">{mod.number.replace('MODUL ', t('Modul ', 'Module '))} · {t('Tugas refleksi', 'Reflection task')}</p>
        <h1 className="mt-1 font-serif text-[28px] leading-tight text-deep-forest">{t('Ceritakan apa yang kamu pelajari', 'Tell us what you learned')}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {t('Setelah selesai membaca bab, tulis beberapa kalimat dengan kata-katamu sendiri. Tulisanmu dibaca oleh mentor, bukan dinilai oleh aplikasi.', 'After finishing the chapter, write a few sentences in your own words. A mentor reads what you write; the app does not grade it.')}
        </p>
      </div>

      {mine && !revise ? (
        <div className="surface rounded-3xl p-5">
          <p className="flex items-center gap-2 text-base font-semibold text-deep-forest">
            {mine.status === 'Tervalidasi Mentor' ? <CheckCircle2 className="h-5 w-5 text-forest" /> : <Clock className="h-5 w-5 text-caramel-dark" />}
            {subStatus(mine.status)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-charcoal">"{mine.reflectionText}"</p>
          {mine.mentorFeedback && (
            <p className="mt-3 rounded-xl bg-forest/10 p-3 text-sm text-deep-forest">
              <b>{mine.mentorName}:</b> {mine.mentorFeedback}
            </p>
          )}
          <p className="mt-3 text-xs text-ink-soft">
            {mine.status === 'Tervalidasi Mentor' ? t('Mentor sudah memvalidasi. Lencana tervalidasi mentor terbuka di Profil.', 'The mentor has validated it. The mentor-validated badge is unlocked in your Profile.') : t(`+${q.xpReward} XP sudah kamu terima. Lencana tervalidasi mentor terbuka setelah mentor memvalidasi.`, `You received +${q.xpReward} XP. The mentor-validated badge unlocks after a mentor validates it.`)}
          </p>
        </div>
      ) : (
        <div className="surface rounded-3xl p-5">
          {revise && mine?.mentorFeedback && (
            <p className="mb-3 rounded-xl bg-caramel/15 p-3 text-sm text-caramel-dark">
              <b>{t('Catatan mentor', 'Mentor\'s note')}:</b> {mine.mentorFeedback}
            </p>
          )}
          <p className="flex items-center gap-2 text-sm font-bold text-deep-forest">
            <MessageSquareText className="h-4 w-4 text-caramel-dark" /> {t('Pertanyaan pemandu', 'Guiding questions')}
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-charcoal">
            <li>{t('Apa satu hal baru yang kamu pelajari?', 'What is one new thing you learned?')}</li>
            <li>{t('Alat atau istilah apa yang paling kamu ingat, dan apa fungsinya?', 'Which tool or term do you remember most, and what does it do?')}</li>
            <li>{t('Apa yang ingin kamu tanyakan kepada mentor?', 'What would you like to ask the mentor?')}</li>
          </ul>
          <label className="mt-4 block text-sm font-semibold text-deep-forest">
            {t('Refleksimu', 'Your reflection')}
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} placeholder={t('Tulis 2 sampai 4 kalimat...', 'Write 2 to 4 sentences...')} className="mt-1 w-full rounded-[16px_20px_16px_20px] border border-bamboo bg-cream p-3 text-base text-charcoal focus:border-caramel focus:outline-none focus:ring-2 focus:ring-caramel/30" />
          </label>
          <p className="mt-1 text-xs text-ink-soft">{text.trim().length} / {MIN} {t('karakter minimal', 'minimum characters')}</p>
          <button
            type="button"
            disabled={!canSend}
            onClick={() => {
              submitReflection(q.id, text.trim());
              showToast(t(`Terkirim ke mentor. +${q.xpReward} XP.`, `Sent to the mentor. +${q.xpReward} XP.`));
            }}
            className="mt-3 min-h-[52px] w-full rounded-full bg-forest text-base font-semibold text-coconut disabled:bg-sage disabled:text-deep-forest"
          >
            {t('Kirim ke mentor', 'Send to the mentor')}
          </button>
          <p className="mt-2 text-xs text-ink-soft">{t('Hanya mentor manusia yang membuka lencana tervalidasi mentor.', 'Only a human mentor unlocks the mentor-validated badge.')}</p>
        </div>
      )}
    </div>
  );
};
