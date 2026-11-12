import React from 'react';
import {
  BoxGeometry,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  PlaneGeometry,
  RingGeometry,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { Prop3D } from '../data/praktik';
import { bambu, bowl, Live, mat, sapSurface } from './Alat3D';

/**
 * Lapisan AR di atas gambar kamera: alat 3D menempel pada tanganmu (pongkor tergenggam, kain tergantung dari
 * jari yang menjepit, pengaduk di tangan dengan ujung di wajan). Tanpa tangan, alat memeragakan gerakan sebagai contoh
 * (tampil samar). Semua dihitung di perangkat dari 21 titik tangan; tidak ada gambar yang dikirim.
 */

interface Pose {
  real: boolean;
  cx: number; // pusat telapak, piksel (y ke bawah)
  cy: number;
  s: number; // ukuran tangan: pergelangan ke pangkal jari tengah, piksel
  roll: number; // derajat, searah jarum jam dari atas
  px: number; // titik jepit (ujung jempol dan telunjuk)
  py: number;
}

const pose = (live: Live, W: number, H: number, time: number, prop: Prop3D): Pose => {
  const lm = live.lm;
  if (lm && lm.length >= 21) {
    const x0 = lm[0].x * W;
    const y0 = lm[0].y * H;
    const x9 = lm[9].x * W;
    const y9 = lm[9].y * H;
    return {
      real: true,
      cx: (x0 + x9) / 2,
      cy: (y0 + y9) / 2,
      s: Math.max(40, Math.hypot(x9 - x0, y9 - y0)),
      roll: live.roll,
      px: ((lm[4].x + lm[8].x) / 2) * W,
      py: ((lm[4].y + lm[8].y) / 2) * H,
    };
  }
  // contoh tanpa tangan
  const s = 0.17 * H;
  if (prop === 'wajan') {
    const a = time * 2.3;
    return { real: false, cx: 0.5 * W + Math.cos(a) * 0.1 * W, cy: 0.42 * H + Math.sin(a) * 0.07 * H, s, roll: 0, px: 0.5 * W, py: 0.3 * H };
  }
  if (prop === 'kain') return { real: false, cx: 0.5 * W, cy: 0.46 * H, s, roll: 0, px: 0.5 * W, py: 0.28 * H + Math.sin(time * 1.6) * 0.012 * H };
  return { real: false, cx: 0.5 * W, cy: 0.42 * H, s, roll: Math.sin(time * 1.3) * 75 + 5, px: 0.5 * W, py: 0.3 * H };
};

interface Rig {
  root: Group;
  update: (time: number, dt: number, live: Live, p: Pose, W: number, H: number) => void;
}

/* ---- pongkor di tangan, menuang ke mangkuk ---- */
const rigPongkor = (): Rig => {
  const root = new Group();
  const b = bowl(1);
  const sap = sapSurface(1.1);
  sap.position.y = 0.45;
  const bowlG = new Group();
  bowlG.add(b, sap);
  bowlG.rotation.x = 1.05; // miring ke arah kamera supaya bagian dalam (nira) terlihat
  root.add(bowlG);

  const held = new Group();
  held.add(bambu());
  root.add(held);

  const drops = Array.from({ length: 50 }, () => {
    const m = new Mesh(new SphereGeometry(1, 8, 6), new MeshBasicMaterial({ color: 0xf0cf84, transparent: true, opacity: 0.95 }));
    m.visible = false;
    root.add(m);
    return { m, vx: 0, vy: 0, life: 0 };
  });
  let emit = 0;
  return {
    root,
    update: (time, dt, live, p, W, H) => {
      const r = MathUtils.degToRad(p.roll);
      const k = 1.75 * p.s; // satuan model -> piksel (panjang pongkor ±2,6 kali ukuran tangan)
      const off = 0.95 * p.s;
      held.scale.setScalar(k);
      held.position.set(p.cx + Math.sin(r) * off, -(p.cy - Math.cos(r) * off), 40);
      held.rotation.z = -r;
      held.updateMatrixWorld(true);

      const bs = (0.15 * W) / 1.34;
      bowlG.scale.setScalar(bs);
      bowlG.position.set(0.5 * W, -0.88 * H, 0);
      const bowlTop = -0.88 * H + 0.5 * bs;

      const tilt = Math.abs(p.roll);
      if (tilt > 38) {
        emit += dt * (26 + (tilt - 38) * 0.9);
        while (emit > 1) {
          emit -= 1;
          const d = drops.find((x) => x.life <= 0);
          if (!d) break;
          d.m.position.copy(held.localToWorld(new Vector3(0, 0.74, 0)));
          d.m.scale.setScalar(Math.max(2.5, 0.05 * p.s));
          d.vx = Math.sign(p.roll) * (30 + Math.random() * 50) + (Math.random() - 0.5) * 20;
          d.vy = 20 * Math.random();
          d.life = 2;
          d.m.visible = true;
        }
      }
      for (const d of drops) {
        if (d.life <= 0) continue;
        d.life -= dt;
        d.vy -= H * 2.4 * dt;
        d.m.position.x += d.vx * dt;
        d.m.position.y += d.vy * dt;
        if (d.m.position.y < bowlTop || d.m.position.y < -H) {
          d.life = 0;
          d.m.visible = false;
        }
      }
    },
  };
};

/* ---- kain saring tergantung dari jari yang menjepit ---- */
const rigKain = (): Rig => {
  const root = new Group();
  const bowlG = new Group();
  bowlG.add(bowl(1));
  const sap = sapSurface(1.1);
  sap.position.y = 0.45;
  bowlG.add(sap);
  bowlG.rotation.x = 1.05; // miring ke arah kamera supaya bagian dalam (nira) terlihat
  root.add(bowlG);

  const cloth = new Group();
  const geo = new PlaneGeometry(1, 1.2, 10, 12);
  geo.translate(0, -0.6, 0);
  const pos = geo.attributes.position;
  const base: [number, number][] = [];
  for (let i = 0; i < pos.count; i++) base.push([pos.getX(i), pos.getY(i)]);
  const clothMat = new MeshStandardMaterial({ color: 0xf4efe0, roughness: 0.95, side: 2 });
  const sheet = new Mesh(geo, clothMat);
  cloth.add(sheet);
  const kinds: [number, number, number][] = [
    [0x1b1b1b, 0.035, -0.3],
    [0xf08a2c, 0.06, -0.5],
    [0xe8c130, 0.05, -0.72],
    [0x1b1b1b, 0.035, -0.4],
    [0xd9c79a, 0.065, -0.9],
    [0xe8c130, 0.05, -0.62],
  ];
  const debris = kinds.map(([c, r, y], i) => {
    const m = new Mesh(new SphereGeometry(r * 1.5, 10, 8), mat(c, 0.6));
    const x = (((i * 37) % 11) / 11 - 0.5) * 0.5;
    m.position.set(x, y, 0.03);
    cloth.add(m);
    return { m, x, y };
  });
  root.add(cloth);

  let sway = 0;
  let lastX = 0;
  return {
    root,
    update: (time, dt, live, p, W, H) => {
      const bs = (0.15 * W) / 1.34;
      bowlG.scale.setScalar(bs);
      bowlG.position.set(0.5 * W, -0.9 * H, 0);

      const vx = (p.px - lastX) / Math.max(dt, 0.001);
      lastX = p.px;
      sway += (-MathUtils.clamp(vx, -900, 900) * 0.0011 - sway) * Math.min(1, dt * 5);
      const width = 3.4 * p.s;
      cloth.scale.set(width, width, 1);
      cloth.position.set(p.px, -p.py, 30);
      cloth.rotation.z = sway + MathUtils.degToRad(-p.roll) * 0.3 + Math.sin(time * 2) * 0.03;
      // kain menggantung: melengkung dan bergelombang halus
      for (let i = 0; i < pos.count; i++) {
        const [x, y] = base[i];
        const depth = -y / 1.2;
        pos.setZ(i, Math.sin(x * 5 + time * 2.2 + depth * 3) * 0.035 * depth);
        pos.setX(i, x * Math.sqrt(Math.max(0.2, 1 - 0.8 * depth ** 3)));
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      const prog = live.done ? 1 : p.real ? live.progress : (time * 0.28) % 1.4;
      debris.forEach(({ m, x, y }, i) => {
        const lift = MathUtils.clamp(prog * 6 - i, 0, 1);
        m.position.set(x + lift * 0.25 * (i % 2 ? 1 : -1), y + lift * 0.9, 0.03 + lift * 0.2);
        m.scale.setScalar(1 - lift * 0.9);
        m.visible = lift < 0.98;
      });
    },
  };
};

/* ---- pengaduk di tangan, ujungnya di wajan ---- */
const rigAduk = (): Rig => {
  const root = new Group();
  const wok = new Group();
  wok.add(bowl(1));
  const sap = sapSurface(1.1);
  sap.position.y = 0.58;
  wok.add(sap);
  const swirl = new Group();
  [0.35, 0.62, 0.88].forEach((r, i) => {
    const arc = new Mesh(new RingGeometry(r, r + 0.05, 28, 1, i, Math.PI * 1.1), new MeshBasicMaterial({ color: 0xe9bd74, transparent: true, opacity: 0.85, side: 2 }));
    arc.rotation.x = -Math.PI / 2;
    swirl.add(arc);
  });
  swirl.position.y = 0.6;
  wok.add(swirl);
  wok.rotation.x = 1.0;
  root.add(wok);

  const stick = new Mesh(new CylinderGeometry(1, 1, 1, 10), mat(0x8a5a2b, 0.8));
  root.add(stick);
  const blade = new Mesh(new BoxGeometry(2.6, 1.0, 1.6), mat(0x9a6a36, 0.8));
  root.add(blade);
  const grip = new Mesh(new CircleGeometry(1, 16), new MeshBasicMaterial({ color: 0x4c9b45, transparent: true, opacity: 0.55 }));
  root.add(grip);

  let ex = 0;
  let ey = 0;
  let init = false;
  return {
    root,
    update: (time, dt, _live, p, W, H) => {
      if (!init) {
        ex = p.cx;
        ey = p.cy;
        init = true;
      }
      ex += (p.cx - ex) * Math.min(1, dt * 1.6);
      ey += (p.cy - ey) * Math.min(1, dt * 1.6);
      const wr = 0.19 * W;
      const ws = wr / 1.34;
      wok.scale.setScalar(ws);
      const wx = 0.5 * W;
      const wy = 0.86 * H;
      wok.position.set(wx, -wy, 0);
      const ox = (p.cx - ex) * 0.55;
      const oy = (p.cy - ey) * 0.4;
      swirl.rotation.y = -Math.atan2(oy, ox) * 0.9;
      // ujung bawah pengaduk di dalam wajan, ujung atas di tangan
      const x1 = wx + ox;
      const y1 = wy - 0.12 * wr + oy;
      const x0 = p.cx;
      const y0 = p.cy;
      const dx = x0 - x1;
      const dy = -(y0 - y1);
      const L = Math.hypot(dx, dy);
      const th = Math.atan2(-dx, dy);
      const rad = Math.max(3, p.s * 0.055);
      stick.scale.set(rad, L, rad);
      stick.position.set((x0 + x1) / 2, -(y0 + y1) / 2, 40);
      stick.rotation.z = th;
      blade.scale.set(rad * 1.7, rad * 1.0, rad * 1.5);
      blade.position.set(x1, -y1, 40);
      blade.rotation.z = th;
      grip.scale.setScalar(Math.max(8, p.s * 0.22));
      grip.position.set(x0, -y0, 45);
    },
  };
};

const ARLayer: React.FC<{ prop: Prop3D; live: React.MutableRefObject<Live>; className?: string }> = ({ prop, live, className = '' }) => {
  const host = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';

    const scene = new Scene();
    const camera = new OrthographicCamera(0, 100, 0, -100, -2000, 2000);
    scene.add(new HemisphereLight(0xfff3dc, 0x7a6a48, 1.7));
    const sun = new DirectionalLight(0xffffff, 1.9);
    sun.position.set(300, 500, 900);
    scene.add(sun);

    const rig = prop === 'kain' ? rigKain() : prop === 'wajan' ? rigAduk() : rigPongkor();
    scene.add(rig.root);

    let W = 100;
    let H = 100;
    const resize = () => {
      W = el.clientWidth || 100;
      H = el.clientHeight || 100;
      renderer.setSize(W, H, false);
      camera.left = 0;
      camera.right = W;
      camera.top = 0;
      camera.bottom = -H;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    let last = performance.now();
    const t0 = last;
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const time = (now - t0) / 1000;
      const p = pose(live.current, W, H, time, prop);
      rig.update(time, dt, live.current, p, W, H);
      renderer.domElement.style.opacity = p.real ? '1' : '0.6';
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
        (m.material as { dispose?: () => void } | undefined)?.dispose?.();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [prop, live]);

  return <div ref={host} className={className} aria-hidden />;
};

export default ARLayer;
