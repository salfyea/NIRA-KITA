import React from 'react';
import {
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  LatheGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  RingGeometry,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import QRCode from 'qrcode';
import type { Prop3D } from '../data/praktik';
import { t } from '../i18n';

/** Data langsung dari pelacak tangan. Dibaca tiap frame oleh adegan 3D tanpa memicu render React. */
export interface Live {
  ts: number; // waktu terakhir tangan terlihat (performance.now); 0 = belum pernah
  roll: number; // sudut miring tangan, derajat
  stir: number; // sudut putar kumulatif pergelangan, radian
  progress: number; // 0..1 kemajuan gerakan
  done: boolean; // gerakan sudah selesai
  lm: { x: number; y: number }[] | null; // 21 titik tangan (0..1) frame ini, null bila tidak terlihat
}

export const mat = (color: number, rough = 0.85, metal = 0) => new MeshStandardMaterial({ color, roughness: rough, metalness: metal });
const BAMBU = 0xc9b05f;
const KAYU = 0x8a5a2b;

const labelOf = (p: Prop3D) =>
  ({
    pongkor: t('Pongkor: wadah bambu penampung nira', 'Pongkor: the bamboo container for sap'),
    wajan: t('Wajan di atas tungku batu, dengan pengaduk kayu', 'A wok on a stone stove, with a wooden stirrer'),
    kain: t('Kain saring dan kotoran yang tersangkut', 'The filter cloth and the debris caught on it'),
    pohon: t('Pohon kelapa: pelajar belajar dari darat', 'The coconut tree: learners study from the ground'),
    tungku: t('Tungku panas: jaga jarak aman', 'A hot stove: keep a safe distance'),
    kemasan: t('Kemasan dengan QR Paspor Warisan', 'A package with the Heritage Passport QR'),
  } as Record<Prop3D, string>)[p];

interface Built {
  root: Group;
  update: (time: number, dt: number, live: Live, hand: boolean) => void;
}

/* ---------------- bagian-bagian model ---------------- */
export const bambu = () => {
  const g = new Group();
  g.add(new Mesh(new CylinderGeometry(0.26, 0.28, 1.5, 24, 1, true), (() => { const m = mat(BAMBU, 0.6); m.side = 2; return m; })()));
  const inner = new Mesh(new CircleGeometry(0.24, 24), mat(0x3a2c12));
  inner.rotation.x = -Math.PI / 2;
  inner.position.y = 0.5;
  g.add(inner);
  const bottom = new Mesh(new CircleGeometry(0.28, 24), mat(0x9c8540));
  bottom.rotation.x = Math.PI / 2;
  bottom.position.y = -0.75;
  g.add(bottom);
  for (const y of [-0.3, 0.2, 0.75]) {
    const r = new Mesh(new TorusGeometry(0.27, 0.035, 8, 28), mat(0x9c8540, 0.7));
    r.rotation.x = Math.PI / 2;
    r.position.y = y;
    g.add(r);
  }
  return g;
};

export const bowl = (r = 1) => {
  const g = new Group();
  const pts = [[0, 0], [0.45, 0.03], [0.85, 0.18], [1.15, 0.48], [1.32, 0.86], [1.34, 0.9]].map(([x, y]) => new Vector2(x * r, y * r));
  const shell = new Mesh(new LatheGeometry(pts, 40), (() => { const m = mat(0x2c2c2f, 0.5, 0.6); m.side = 2; return m; })());
  g.add(shell);
  const rim = new Mesh(new TorusGeometry(1.33 * r, 0.04 * r, 8, 40), mat(0x3a3a3f, 0.4, 0.7));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.9 * r;
  g.add(rim);
  return g;
};

export const sapSurface = (r: number, color = 0xc98a3a) => {
  const m = new Mesh(new CircleGeometry(r, 40), new MeshStandardMaterial({ color, roughness: 0.25, metalness: 0.1, emissive: 0x5a3208, emissiveIntensity: 0.5 }));
  m.rotation.x = -Math.PI / 2;
  return m;
};

const stove = () => {
  const g = new Group();
  const base = new Mesh(new CylinderGeometry(1.55, 1.75, 0.95, 32), mat(0x8c8678, 1));
  base.position.y = -0.48;
  g.add(base);
  // mulut tungku di depan
  const mouth = new Mesh(new BoxGeometry(0.85, 0.55, 0.5), mat(0x1c1612, 1));
  mouth.position.set(0, -0.55, 1.5);
  g.add(mouth);
  // batu-batu
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    const s = new Mesh(new SphereGeometry(0.2 + (i % 3) * 0.04, 8, 6), mat(0x9a9486, 1));
    s.position.set(Math.cos(a) * 1.62, -0.12, Math.sin(a) * 1.62);
    s.scale.y = 0.6;
    g.add(s);
  }
  return g;
};

const fire = () => {
  const g = new Group();
  const cols = [0xff7a1f, 0xffb02e, 0xffd84d];
  const cones = cols.map((c, i) => {
    const m = new Mesh(new ConeGeometry(0.2 - i * 0.04, 0.55 - i * 0.1, 8), new MeshBasicMaterial({ color: c, transparent: true, opacity: 0.92 }));
    m.position.set((i - 1) * 0.14, -0.52 + 0.28, 1.55);
    g.add(m);
    return m;
  });
  const light = new PointLight(0xff8a2b, 7, 5);
  light.position.set(0, -0.3, 1.9);
  g.add(light);
  return { g, cones, light };
};

const steamPuffs = () => {
  const g = new Group();
  const puffs = Array.from({ length: 7 }, () => {
    const m = new Mesh(new SphereGeometry(0.16, 10, 8), new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 }));
    g.add(m);
    return m;
  });
  const tick = (time: number, y0: number) =>
    puffs.forEach((p, i) => {
      const ph = (time * 0.35 + i / puffs.length) % 1;
      p.position.set(Math.sin(i * 2.1 + time) * 0.35, y0 + ph * 1.5, Math.cos(i * 1.7) * 0.3);
      p.scale.setScalar(0.7 + ph * 1.6);
      (p.material as MeshBasicMaterial).opacity = 0.32 * (1 - ph);
    });
  return { g, tick };
};

const person = (color: number) => {
  const g = new Group();
  const body = new Mesh(new ConeGeometry(0.3, 0.9, 14), mat(color, 0.9));
  body.position.y = 0.45;
  const head = new Mesh(new SphereGeometry(0.2, 14, 12), mat(0xe8bc94, 0.9));
  head.position.y = 1.1;
  g.add(body, head);
  return g;
};

/* ---------------- adegan per alat ---------------- */
const buildWajan = (withSpatula: boolean, hazard: boolean): Built => {
  const root = new Group();
  root.add(stove());
  const b = bowl(1);
  b.position.y = 0.02;
  root.add(b);
  const sap = sapSurface(1.1);
  sap.position.y = 0.58;
  root.add(sap);
  // pusaran di permukaan
  const swirl = new Group();
  [0.35, 0.62, 0.88].forEach((r, i) => {
    const arc = new Mesh(new RingGeometry(r, r + 0.04, 28, 1, i, Math.PI * 1.1), new MeshBasicMaterial({ color: 0xe9bd74, transparent: true, opacity: 0.8, side: 2 }));
    arc.rotation.x = -Math.PI / 2;
    swirl.add(arc);
  });
  swirl.position.y = 0.585;
  root.add(swirl);

  const f = fire();
  root.add(f.g);
  const steam = steamPuffs();
  steam.g.position.y = 0.6;
  root.add(steam.g);

  const pivot = new Group();
  pivot.position.y = 0.62;
  const arm = new Group();
  arm.position.x = 0.55;
  arm.rotation.z = -0.5;
  const handle = new Mesh(new CylinderGeometry(0.05, 0.06, 2.1, 10), mat(KAYU, 0.8));
  handle.position.y = 0.95;
  const blade = new Mesh(new BoxGeometry(0.34, 0.03, 0.24), mat(0x9a6a36, 0.8));
  blade.position.y = -0.08;
  arm.add(handle, blade);
  pivot.add(arm);
  if (withSpatula) root.add(pivot);
  else {
    // pengaduk bersandar, tidak dipakai
    const rest = new Group();
    rest.add(arm);
    arm.position.set(0, 0, 0);
    rest.position.set(0.9, 0.7, -0.2);
    rest.rotation.z = -0.8;
    root.add(rest);
  }

  let ring: Mesh | null = null;
  if (hazard) {
    ring = new Mesh(new RingGeometry(2.05, 2.28, 48), new MeshBasicMaterial({ color: 0xe0523a, transparent: true, opacity: 0.7, side: 2 }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.95;
    root.add(ring);
    const p = person(0x4c9b45);
    p.position.set(2.9, -0.95, 0.6);
    p.scale.setScalar(0.95);
    root.add(p);
  }
  const ground = new Mesh(new CircleGeometry(3.6, 40), mat(0xd9cdb1, 1));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.96;
  root.add(ground);

  let ang = 0;
  return {
    root,
    update: (time, dt, live, hand) => {
      const target = hand ? live.stir : time * 2.3;
      ang += (target - ang) * Math.min(1, dt * 12);
      pivot.rotation.y = ang;
      swirl.rotation.z = -ang * 0.9;
      const fl = 1 + Math.sin(time * 14) * 0.12;
      f.cones.forEach((c, i) => c.scale.set(1, fl + Math.sin(time * 11 + i) * 0.15, 1));
      f.light.intensity = 6 + Math.sin(time * 17) * 1.2;
      steam.tick(time, 0.7);
      if (ring) (ring.material as MeshBasicMaterial).opacity = 0.5 + Math.sin(time * 3) * 0.2;
    },
  };
};

const buildPongkor = (): Built => {
  const root = new Group();
  const b = bowl(0.62);
  b.position.set(0, -1.1, 0);
  root.add(b);
  const sap = sapSurface(0.68);
  sap.position.set(0, -1.1 + 0.2, 0);
  root.add(sap);
  const ground = new Mesh(new CircleGeometry(3, 36), mat(0xd9cdb1, 1));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.12;
  root.add(ground);

  const pivot = new Group();
  pivot.position.set(0, 0.55, 0);
  pivot.add(bambu());
  root.add(pivot);

  // butiran nira
  const N = 44;
  const drops = Array.from({ length: N }, () => {
    const m = new Mesh(new SphereGeometry(0.055, 8, 6), new MeshBasicMaterial({ color: 0xf0cf84, transparent: true, opacity: 0.95 }));
    m.visible = false;
    root.add(m);
    return { m, v: new Vector3(), life: 0 };
  });
  let emit = 0;
  const mouth = new Vector3();
  let ang = 0;
  return {
    root,
    update: (time, dt, live, hand) => {
      const target = hand ? MathUtils.clamp(live.roll, -115, 115) : Math.sin(time * 1.3) * 75 + 5;
      ang += (target - ang) * Math.min(1, dt * 12);
      pivot.rotation.z = MathUtils.degToRad(ang);
      pivot.updateMatrixWorld(true);
      const tilt = Math.abs(ang);
      if (tilt > 38) {
        emit += dt * (28 + (tilt - 38) * 0.9);
        while (emit > 1) {
          emit -= 1;
          const d = drops.find((x) => x.life <= 0);
          if (!d) break;
          mouth.set(0, 0.74, 0);
          pivot.localToWorld(mouth);
          d.m.position.copy(mouth);
          d.v.set(Math.sign(ang) * (0.5 + Math.random() * 0.6) * 0.2 + (Math.random() - 0.5) * 0.12, 0.2 * Math.random(), (Math.random() - 0.5) * 0.12);
          d.life = 1.4;
          d.m.visible = true;
        }
      }
      for (const d of drops) {
        if (d.life <= 0) continue;
        d.life -= dt;
        d.v.y -= 6.5 * dt;
        d.m.position.addScaledVector(d.v, dt * 1);
        if (d.m.position.y < -0.82) {
          d.life = 0;
          d.m.visible = false;
        }
      }
    },
  };
};

const buildKain = (): Built => {
  const root = new Group();
  const b = bowl(0.95);
  b.position.y = -0.55;
  root.add(b);
  const sap = sapSurface(1.0);
  sap.position.y = -0.55 + 0.45;
  root.add(sap);
  const cloth = new Mesh(new CircleGeometry(1.28, 40), (() => { const m = mat(0xf4efe0, 0.95); m.side = 2; m.transparent = true; m.opacity = 0.92; return m; })());
  cloth.rotation.x = -Math.PI / 2;
  cloth.position.y = 0.42;
  root.add(cloth);
  const rim = new Mesh(new TorusGeometry(1.28, 0.03, 8, 40), mat(0xe8e0c8));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.42;
  root.add(rim);
  const ground = new Mesh(new CircleGeometry(3, 36), mat(0xd9cdb1, 1));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.58;
  root.add(ground);

  const kinds: [number, number, number][] = [
    [0x1b1b1b, 0.07, 0.05], // semut
    [0xf08a2c, 0.12, 0.05], // bunga kelapa
    [0xe8c130, 0.1, 0.07], // lebah
    [0x1b1b1b, 0.07, 0.05],
    [0xf5e8c8, 0.13, 0.05],
    [0xe8c130, 0.1, 0.07],
  ];
  const debris = kinds.map(([c, r, h], i) => {
    const m = new Mesh(new SphereGeometry(r, 10, 8), mat(c, 0.6));
    m.scale.y = h / r;
    const a = (i / kinds.length) * Math.PI * 2 + 0.4;
    const rad = 0.35 + (i % 3) * 0.28;
    const base = new Vector3(Math.cos(a) * rad, 0.46, Math.sin(a) * rad);
    m.position.copy(base);
    root.add(m);
    return { m, base };
  });
  return {
    root,
    update: (time, _dt, live, hand) => {
      const p = live.done ? 1 : hand ? live.progress : (time * 0.28) % 1.4;
      debris.forEach(({ m, base }, i) => {
        const lift = MathUtils.clamp(p * 6 - i, 0, 1);
        m.position.set(base.x, base.y + lift * 1.3, base.z);
        m.scale.setScalar(1 - lift * 0.9);
        m.visible = lift < 0.98;
      });
      cloth.position.y = 0.42 + Math.sin(time * 2) * 0.004;
    },
  };
};

const buildPohon = (): Built => {
  const root = new Group();
  const ground = new Mesh(new CircleGeometry(3, 36), mat(0xb9c98f, 1));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.5;
  root.add(ground);
  const trunk = new Mesh(new CylinderGeometry(0.17, 0.26, 3.3, 14), mat(0x7a5a3a, 1));
  trunk.position.y = 0.15;
  root.add(trunk);
  for (let i = 0; i < 9; i++) {
    const r = new Mesh(new TorusGeometry(0.2 + (8 - i) * 0.008, 0.02, 6, 16), mat(0x5e4529, 1));
    r.rotation.x = Math.PI / 2;
    r.position.y = -1.3 + i * 0.36;
    root.add(r);
  }
  const crown = new Group();
  crown.position.y = 1.85;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const leaf = new Mesh(new ConeGeometry(0.16, 1.7, 5), mat(i % 2 ? 0x3f9a58 : 0x58b56a, 0.8));
    leaf.geometry.rotateZ(Math.PI / 2); // runcing ke +x
    leaf.position.set(Math.cos(a) * 0.8, 0.08 - (i % 2) * 0.12, Math.sin(a) * 0.8);
    leaf.rotation.y = -a;
    leaf.rotation.z = -0.35;
    crown.add(leaf);
  }
  for (let i = 0; i < 3; i++) {
    const c = new Mesh(new SphereGeometry(0.17, 12, 10), mat(0x9bbf6a, 0.7));
    c.position.set(Math.cos(i * 2.1) * 0.22, -0.15, Math.sin(i * 2.1) * 0.22);
    crown.add(c);
  }
  root.add(crown);
  // tanda dilarang memanjat
  const sign = new Group();
  const ring = new Mesh(new RingGeometry(0.42, 0.55, 32), new MeshBasicMaterial({ color: 0xd8402e, side: 2 }));
  const bar = new Mesh(new PlaneGeometry(1.0, 0.13), new MeshBasicMaterial({ color: 0xd8402e, side: 2 }));
  bar.rotation.z = Math.PI / 4;
  const disc = new Mesh(new CircleGeometry(0.42, 32), new MeshBasicMaterial({ color: 0xfffdf8, side: 2 }));
  disc.position.z = -0.01;
  const stick = person(0x234b3a);
  stick.scale.setScalar(0.32);
  stick.position.set(0, -0.3, 0.02);
  sign.add(disc, stick, ring, bar);
  sign.position.set(1.55, 0.9, 0.2);
  root.add(sign);
  return {
    root,
    update: (time) => {
      crown.rotation.y = Math.sin(time * 0.8) * 0.06;
      sign.rotation.y = -root.rotation.y; // tanda selalu menghadap layar
      sign.position.y = 0.9 + Math.sin(time * 1.6) * 0.05;
    },
  };
};

const buildKemasan = (): Built => {
  const root = new Group();
  const ground = new Mesh(new CircleGeometry(3, 36), mat(0xd9cdb1, 1));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.0;
  root.add(ground);
  const body = new Mesh(new BoxGeometry(1.45, 1.9, 0.42), mat(0xc9a26b, 0.9));
  body.position.y = 0;
  root.add(body);
  // lipatan atas
  const fold = new Mesh(new BoxGeometry(1.45, 0.12, 0.46), mat(0xa9824d, 0.9));
  fold.position.y = 0.97;
  root.add(fold);
  // label dengan QR
  const cvs = document.createElement('canvas');
  cvs.width = cvs.height = 256;
  const g = cvs.getContext('2d')!;
  g.fillStyle = '#FFFDF8';
  g.fillRect(0, 0, 256, 256);
  try {
    const q = QRCode.create('https://nirakita.vercel.app/p/NK-001', { errorCorrectionLevel: 'M' });
    const n = q.modules.size;
    const cell = 224 / n;
    g.fillStyle = '#18382C';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (q.modules.get(x, y)) g.fillRect(16 + x * cell, 16 + y * cell, Math.ceil(cell), Math.ceil(cell));
  } catch {
    /* tanpa QR bila gagal */
  }
  const tex = new CanvasTexture(cvs);
  tex.colorSpace = SRGBColorSpace;
  const label = new Mesh(new PlaneGeometry(0.95, 0.95), new MeshBasicMaterial({ map: tex }));
  label.position.set(0, -0.15, 0.215);
  root.add(label);
  const stripe = new Mesh(new PlaneGeometry(1.2, 0.2), new MeshBasicMaterial({ color: 0x234b3a }));
  stripe.position.set(0, 0.65, 0.215);
  root.add(stripe);
  // lencana izin
  const badge = new Mesh(new CircleGeometry(0.17, 24), new MeshBasicMaterial({ color: 0x4c9b45 }));
  badge.position.set(0.5, 0.65, 0.22);
  root.add(badge);
  return {
    root,
    update: (time) => {
      root.position.y = Math.sin(time * 1.4) * 0.05;
    },
  };
};

const build = (p: Prop3D): Built =>
  p === 'pongkor' ? buildPongkor() : p === 'kain' ? buildKain() : p === 'pohon' ? buildPohon() : p === 'kemasan' ? buildKemasan() : buildWajan(p === 'wajan', p === 'tungku');

/**
 * Alat 3D yang mengikuti tanganmu: pongkor miring mengikuti sudut tangan, pengaduk berputar mengikuti putaran
 * pergelangan, dan seterusnya. Tanpa tangan, alat memeragakan gerakannya sendiri sebagai contoh.
 */
const Alat3D: React.FC<{ prop: Prop3D; live: React.MutableRefObject<Live>; className?: string; caption?: boolean }> = ({ prop, live, className = '', caption = true }) => {
  const host = React.useRef<HTMLDivElement>(null);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';

    const scene = new Scene();
    const wide = prop === 'tungku';
    const camera = new PerspectiveCamera(wide ? 44 : 36, 1, 0.1, 50);
    const tall = prop === 'pohon';
    camera.position.set(0, wide ? 3.4 : tall ? 2.2 : 2.7, wide ? 7.2 : tall ? 8.6 : 5.6);
    camera.lookAt(0, wide ? -0.1 : tall ? 0.35 : 0.1, 0);
    scene.add(new HemisphereLight(0xfff3dc, 0x7a6a48, 1.55));
    const sun = new DirectionalLight(0xffffff, 1.7);
    sun.position.set(2.5, 5, 3);
    scene.add(sun);

    const built = build(prop);
    scene.add(built.root);

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    let last = performance.now();
    const start = last;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = (now - start) / 1000;
      const hand = live.current.ts > 0 && now - live.current.ts < 600;
      built.root.rotation.y = prop === 'pongkor' ? 0 : Math.sin(time * 0.35) * 0.32;
      built.update(time, dt, live.current, hand);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as Mesh;
        m.geometry?.dispose?.();
        const mm = m.material as { dispose?: () => void; map?: { dispose: () => void } } | undefined;
        mm?.map?.dispose();
        mm?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [prop, live]);

  return (
    <div className={`relative overflow-hidden bg-gradient-to-b from-[#FBF1D9] to-[#E4D8B8] ${className}`}>
      <div ref={host} className="absolute inset-0" aria-hidden />
      {(caption || failed) && (
      <p className="pointer-events-none absolute inset-x-1.5 bottom-1.5 rounded-lg bg-deep-forest/80 px-2 py-1 text-[11px] font-semibold leading-snug text-coconut">
        {failed ? t('Tampilan 3D tidak didukung di perangkat ini.', '3D view is not supported on this device.') : labelOf(prop)}
      </p>
      )}
    </div>
  );
};

export default Alat3D;
