import React from 'react';

/**
 * Dua bahasa (Indonesia dan English) tanpa pustaka tambahan.
 * `t('teks Indonesia', 'English text')` mengembalikan teks sesuai bahasa aktif.
 * Saat bahasa diganti, subtree aplikasi dimuat ulang (key) sehingga semua teks ikut berubah,
 * sedangkan data (store) tetap utuh.
 */
export type Lang = 'id' | 'en';

const KEY = 'niraKita.lang';

let lang: Lang = (() => {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'en' || v === 'id') return v;
  } catch {
    /* penyimpanan tidak tersedia */
  }
  return 'id';
})();

const subs = new Set<() => void>();

export const getLang = (): Lang => lang;

export const setLang = (l: Lang) => {
  if (l === lang) return;
  lang = l;
  try {
    localStorage.setItem(KEY, l);
  } catch {
    /* abaikan */
  }
  document.documentElement.lang = l;
  subs.forEach((f) => f());
};

const subscribe = (f: () => void) => {
  subs.add(f);
  return () => {
    subs.delete(f);
  };
};

export const isEn = (): boolean => lang === 'en';

/** Teks dua bahasa. Dipakai di mana saja, termasuk fungsi non-komponen. */
export const t = (id: string, en: string): string => (lang === 'en' ? en : id);

export const useLang = (): Lang => React.useSyncExternalStore(subscribe, getLang, getLang);

/** Memuat ulang subtree saat bahasa berubah supaya semua t() dihitung ulang. */
export const LangRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const l = useLang();
  React.useEffect(() => {
    document.documentElement.lang = l;
  }, [l]);
  return <React.Fragment key={l}>{children}</React.Fragment>;
};

/** Tombol ID | EN. */
export const LangToggle: React.FC<{ className?: string; tone?: 'light' | 'dark' }> = ({ className = '', tone = 'light' }) => {
  const l = useLang();
  const base = tone === 'dark' ? 'bg-deep-forest/80 text-coconut' : 'bg-coconut/95 text-deep-forest';
  return (
    <div className={`inline-flex rounded-full p-0.5 shadow ${base} ${className}`} role="group" aria-label="Bahasa / Language">
      {(['id', 'en'] as const).map((k) => (
        <button
          key={k}
          type="button"
          aria-pressed={l === k}
          onClick={() => setLang(k)}
          className={`min-h-[40px] min-w-[44px] rounded-full px-3 text-sm font-bold ${l === k ? 'bg-caramel-dark text-coconut' : 'opacity-80'}`}
        >
          {k.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
