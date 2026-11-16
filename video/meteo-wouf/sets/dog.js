// Briques low poly (géométries fusionnées, couleurs par sommet, ombrage plat) + le chien présentateur.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as M from '../lib/motion.js';

const { clamp, noise1, TAU } = M;

export const MAT = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true, side: THREE.DoubleSide });
export const MATB = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });   // non éclairé (soleil, écrans)

export const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
export const cyl = (rt, rb, h, s = 6) => new THREE.CylinderGeometry(rt, rb, h, s);
export const cone = (r, h, s = 6) => new THREE.ConeGeometry(r, h, s);
export const ico = (r, d = 0) => new THREE.IcosahedronGeometry(r, d);

// une pièce : géométrie + couleur + placement, prête à fusionner
export function P(geo, color, pos = [0, 0, 0], rot = [0, 0, 0], scl = 1) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  const s = typeof scl === 'number' ? [scl, scl, scl] : scl;
  g.applyMatrix4(new THREE.Matrix4().compose(new THREE.Vector3(...pos), new THREE.Quaternion().setFromEuler(new THREE.Euler(...rot)), new THREE.Vector3(...s)));
  const c = new THREE.Color(color), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3));
  g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
  g.computeVertexNormals();
  return g;
}
export const merge = (parts) => mergeGeometries(parts);
export const mesh = (parts, mat = MAT) => new THREE.Mesh(Array.isArray(parts) ? mergeGeometries(parts) : parts, mat);

// ---------------------------------------------------------------- géométries partagées
const lathe = (pts, s = 7) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), s);
const POOP_PROFILE = [[0.001, 1.0], [0.15, 0.86], [0.25, 0.7], [0.2, 0.62], [0.42, 0.42], [0.35, 0.34], [0.6, 0.14], [0.52, 0.0], [0.001, 0.0]];
const poop = () => P(lathe(POOP_PROFILE), '#6b3d17', [0, -0.45, 0]);
const eyes = (y, z, dx, r) => [P(ico(r), '#ffffff', [-dx, y, z]), P(ico(r), '#ffffff', [dx, y, z]), P(ico(r * 0.5), '#111111', [-dx, y, z + r * 0.7]), P(ico(r * 0.5), '#111111', [dx, y, z + r * 0.7])];
const sunParts = (r) => [P(ico(r, 1), '#ffd61f'), ...Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * TAU; return P(cone(r * 0.28, r * 0.7, 4), '#ff9d1f', [Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45, 0], [0, 0, a - Math.PI / 2]); })];
export const GEO = {
  poop: poop(),
  poopFace: merge([poop(), ...eyes(-0.18, 0.4, 0.16, 0.1), P(box(0.22, 0.04, 0.05), '#111111', [0, -0.34, 0.5])]),
  merguez: P(new THREE.CapsuleGeometry(0.075, 0.46, 1, 6), '#9a2f1c', [0, 0, 0], [0, 0, Math.PI / 2]),
  fry: P(box(0.07, 0.46, 0.07), '#ffd23e'),
  rain: P(box(0.025, 0.5, 0.025), '#cfe6ff'),
  mayo: P(ico(0.22, 0), '#fffbe6', [0, 0, 0], [0, 0, 0], [1, 0.7, 1]),
  sun: merge(sunParts(1)),
  cloud: merge([P(ico(0.5), '#f4f6ff', [-0.4, 0, 0]), P(ico(0.65), '#ffffff', [0.1, 0.15, 0]), P(ico(0.45), '#e6eaff', [0.65, -0.05, 0])]),
  heart: merge([P(ico(0.3), '#ff4fa0', [-0.22, 0.15, 0]), P(ico(0.3), '#ff4fa0', [0.22, 0.15, 0]), P(cone(0.48, 0.6, 4), '#ff2f86', [0, -0.25, 0], [Math.PI, Math.PI / 4, 0], [1, 1, 0.55])]),
  toilet: merge([
    P(box(0.42, 0.34, 0.5), '#f2f4f8', [0, 0.17, 0.02]), P(cyl(0.36, 0.24, 0.26, 8), '#ffffff', [0, 0.46, 0.1]),
    P(cyl(0.3, 0.3, 0.03, 8), '#3a7bd5', [0, 0.6, 0.1]), P(box(0.62, 0.5, 0.22), '#e8ebf2', [0, 0.72, -0.34]),
    P(box(0.66, 0.06, 0.26), '#ffffff', [0, 1.0, -0.34]), P(box(0.1, 0.05, 0.04), '#c0c6d2', [-0.2, 0.9, -0.21]),
  ]),
  fries: merge(Array.from({ length: 6 }, (_, i) => P(box(0.07, 0.5, 0.07), '#ffd23e', [(i % 3 - 1) * 0.1, 0.1 + (i % 2) * 0.08, (i > 2 ? 0.06 : -0.06)], [0, 0, (i % 3 - 1) * 0.25])).concat([P(box(0.4, 0.34, 0.2), '#e8352c', [0, -0.2, 0])])),
};

// un pigeon : corps + deux ailes articulées
export function pigeon() {
  const g = new THREE.Group();
  g.add(mesh([P(ico(0.2), '#8d93a3', [0, 0, 0], [0, 0, 0], [0.75, 0.75, 1.3]), P(ico(0.11), '#6b7285', [0, 0.14, 0.22]),
    P(cone(0.035, 0.12, 4), '#ff9d1f', [0, 0.12, 0.36], [Math.PI / 2, 0, 0]), P(box(0.05, 0.02, 0.22), '#5b6172', [0, 0, -0.3]),
    P(ico(0.02), '#ff5a1f', [-0.06, 0.18, 0.3]), P(ico(0.02), '#ff5a1f', [0.06, 0.18, 0.3])]));
  const wing = (sx) => { const w = new THREE.Group(); w.add(mesh([P(box(0.36, 0.025, 0.22), '#a7adbd', [sx * 0.2, 0, 0])])); w.position.set(sx * 0.1, 0.06, 0); g.add(w); return w; };
  g.userData.wl = wing(-1); g.userData.wr = wing(1);
  return g;
}

// ---------------------------------------------------------------- le chien
const FUR = '#e39a3f', FUR_D = '#b86d22', CREAM = '#fff0d2', SUIT = '#27306b', SUIT_D = '#1b2250';
export function buildDog() {
  const root = new THREE.Group(), d = { root };
  d.body = mesh([
    P(cyl(0.4, 0.5, 0.95, 6), SUIT, [0, 1.0, 0]), P(box(0.3, 0.6, 0.08), '#ffffff', [0, 1.12, 0.42], [-0.08, 0, 0]),
    P(box(0.12, 0.14, 0.1), '#e8352c', [0, 1.36, 0.45]), P(cone(0.1, 0.42, 4), '#e8352c', [0, 1.1, 0.47], [Math.PI, Math.PI / 4, 0], [1, 1, 0.4]),
    P(box(0.2, 0.62, 0.3), SUIT_D, [-0.22, 0.3, 0]), P(box(0.2, 0.62, 0.3), SUIT_D, [0.22, 0.3, 0]),
    P(box(0.24, 0.12, 0.42), FUR, [-0.22, 0.06, 0.08]), P(box(0.24, 0.12, 0.42), FUR, [0.22, 0.06, 0.08]),
  ]);
  root.add(d.body);
  d.tail = new THREE.Group(); d.tail.position.set(0, 0.7, -0.42); d.tail.add(mesh([P(cone(0.1, 0.6, 5), FUR, [0, 0.2, -0.2], [-0.9, 0, 0]), P(ico(0.09), CREAM, [0, 0.4, -0.44])])); root.add(d.tail);
  // tête : pivot à la base du cou
  d.head = new THREE.Group(); d.head.position.set(0, 1.48, 0.02); root.add(d.head);
  d.head.add(mesh([
    P(box(0.82, 0.68, 0.7), FUR, [0, 0.42, 0]), P(box(0.5, 0.2, 0.2), FUR, [0, 0.8, -0.05]),
    P(box(0.4, 0.22, 0.42), CREAM, [0, 0.3, 0.5]), P(box(0.16, 0.11, 0.12), '#1a1414', [0, 0.42, 0.72]),
    P(box(0.24, 0.3, 0.06), CREAM, [0, 0.52, 0.34]),
    P(box(0.2, 0.05, 0.05), '#3a2412', [-0.21, 0.72, 0.36], [0, 0, 0.18]), P(box(0.2, 0.05, 0.05), '#3a2412', [0.21, 0.72, 0.36], [0, 0, -0.18]),
  ]));
  d.eyes = new THREE.Group(); d.eyes.position.set(0, 0.56, 0.35);
  d.eyes.add(mesh([P(ico(0.11), '#ffffff', [-0.21, 0, 0]), P(ico(0.11), '#ffffff', [0.21, 0, 0]), P(ico(0.058), '#14100c', [-0.2, 0, 0.075]), P(ico(0.058), '#14100c', [0.2, 0, 0.075])]));
  d.head.add(d.eyes);
  d.jaw = new THREE.Group(); d.jaw.position.set(0, 0.2, 0.3);
  d.jaw.add(mesh([P(box(0.34, 0.08, 0.4), CREAM, [0, -0.03, 0.2]), P(box(0.22, 0.04, 0.3), '#ff6f91', [0, 0.02, 0.22]), P(box(0.3, 0.1, 0.1), FUR, [0, -0.05, -0.02])]));
  d.head.add(d.jaw);
  const ear = (sx) => { const e = new THREE.Group(); e.position.set(sx * 0.4, 0.74, -0.02); e.add(mesh([P(box(0.14, 0.46, 0.34), FUR_D, [sx * 0.05, -0.2, 0])])); d.head.add(e); return e; };
  d.earL = ear(-1); d.earR = ear(1);
  d.glasses = mesh([P(box(0.3, 0.17, 0.06), '#0c0c14', [-0.21, 0, 0]), P(box(0.3, 0.17, 0.06), '#0c0c14', [0.21, 0, 0]), P(box(0.14, 0.04, 0.05), '#0c0c14', [0, 0.04, 0]), P(box(0.06, 0.05, 0.04), '#ffffff', [-0.28, 0.04, 0.03]), P(box(0.06, 0.05, 0.04), '#ffffff', [0.14, 0.04, 0.03])]);
  d.glasses.position.set(0, 0.57, 0.47); d.glasses.visible = false; d.head.add(d.glasses);
  d.hat = pigeon(); d.hat.position.set(0.05, 0.98, 0.05); d.hat.scale.setScalar(1.25); d.hat.visible = false; d.head.add(d.hat);
  const arm = (sx) => { const a = new THREE.Group(); a.position.set(sx * 0.5, 1.36, 0); a.add(mesh([P(cyl(0.11, 0.1, 0.62, 5), SUIT, [0, -0.3, 0]), P(ico(0.13), FUR, [0, -0.66, 0])])); root.add(a); return a; };
  d.armR = arm(-1); d.armL = arm(1);
  // parapluie (main droite) : toile rayée rouge/blanc
  d.umb = new THREE.Group(); d.umb.position.set(-0.62, 0, 0.3); d.umb.visible = false;
  d.umb.add(mesh([P(cyl(0.025, 0.025, 2.0, 4), '#c8ccd8', [0, 1.75, 0])]));
  const can = P(new THREE.ConeGeometry(1.15, 0.5, 8, 1, true), '#e8352c'), cc = can.attributes.color, w = new THREE.Color('#ffffff');
  for (let i = 0; i < cc.count; i++) if (Math.floor(i / 3) % 2) cc.setXYZ(i, w.r, w.g, w.b);
  d.canopy = new THREE.Mesh(can, MAT); d.canopy.position.set(0.5, 2.9, -0.2); d.umb.add(d.canopy);
  root.add(d.umb);
  return d;
}

// ---------------------------------------------------------------- synchro labiale : enveloppe 100 Hz de la voix
let LIP = { rate: 100, env: [] };
export const setLip = (l) => { LIP = l; };
export function lip(t) {
  const i = Math.round(t * LIP.rate), e = LIP.env;
  return clamp(((e[i - 1] || 0) + 2 * (e[i] || 0) + (e[i + 1] || 0)) / 4 * 1.25);
}

// Pose le chien entièrement à partir de (t, u, o) : aucun état conservé entre deux images.
// o : { x, y, z, yaw, scale, squash, talk, sad, pant, dance, spin, umb, canopy, glasses, hat, armsUp }
export function poseDog(d, t, u, o = {}) {
  const m = Math.max(lip(t), o.pant ? 0.45 + 0.25 * Math.sin(t * 22) : 0), talk = o.talk ?? 1, dance = o.dance || 0;
  const hop = dance ? 0.28 * Math.abs(Math.sin(u * Math.PI)) : 0.025 * Math.abs(Math.sin(u * Math.PI));
  const sq = o.squash || 0;
  d.root.position.set((o.x || 0) + (dance ? 0.45 * Math.sin(u * Math.PI / 2) : 0), (o.y || 0) + hop, o.z || 0);
  d.root.rotation.set(o.tiltX || 0, (o.yaw || 0) + (o.spin || 0) + (dance ? 0.5 * Math.sin(u * Math.PI / 2) : 0), dance ? 0.16 * Math.sin(u * Math.PI) : (o.tiltZ || 0));
  const s = o.scale || 1;
  d.root.scale.set(s * (1 + 0.55 * sq), s * (1 - 0.72 * sq), s * (1 + 0.55 * sq));
  d.jaw.rotation.x = m * 0.62;
  d.head.rotation.set((o.sad ? 0.22 : 0) - 0.1 * m * talk + 0.05 * noise1(t * 2.1, 7) + (o.headPitch || 0), 0.16 * noise1(t * 1.3, 5) * talk + (o.headYaw || 0), 0.07 * noise1(t * 0.9, 9) + (dance ? 0.22 * Math.sin(u * Math.PI + 1) : 0));
  const flop = (o.sad ? 0.02 : 0.16) + 0.22 * m + (dance ? 0.5 * Math.abs(Math.sin(u * Math.PI)) : 0) + (o.earUp || 0);
  d.earL.rotation.z = -flop; d.earR.rotation.z = flop;
  d.eyes.scale.y = (t % 2.9) < 0.1 || (o.sad && (t % 2.9) < 0.3) ? 0.12 : (o.sad ? 0.6 : 1);
  d.tail.rotation.y = o.sad ? 0.05 * Math.sin(t * 3) : 0.6 * Math.sin(t * 15);
  // bras : gestes de présentateur quand il parle, bras en l'air quand il danse
  const g = talk * (0.35 + 0.65 * clamp(m * 2));
  const up = o.armsUp || 0;
  d.armL.rotation.set(-0.45 * g - 0.35 * g * noise1(t * 1.6, 3), 0, 0.22 + 0.5 * g * (0.5 + 0.5 * noise1(t * 1.1, 4)) + up * 2.3);
  d.armR.rotation.set(-0.3 * g * (0.5 + 0.5 * noise1(t * 1.4, 6)), 0, -0.22 - up * 2.3);
  if (dance) { const a = Math.sin(u * Math.PI); d.armL.rotation.set(0, 0, 2.3 + 0.5 * a); d.armR.rotation.set(0, 0, -2.3 + 0.5 * a); }
  if (o.sad) { d.armL.rotation.set(0, 0, 0.12 + up * 1.2); d.armR.rotation.set(0, 0, -0.12 - up * 1.2); }
  const ub = o.umb || 0;
  d.umb.visible = ub > 0.01;
  if (d.umb.visible) {
    d.umb.scale.set(1, Math.min(ub, 1.15), 1);
    const c = o.canopy || 1; d.canopy.scale.set(ub * c, ub * (1 + (c - 1) * 0.35), ub * c);
    d.armR.rotation.set(-1.25, 0, -0.1);
  }
  d.glasses.visible = (o.glasses ?? -1) >= 0;
  if (d.glasses.visible) d.glasses.position.y = 0.57 + (1 - o.glasses) * 1.6;
  d.hat.visible = !!o.hat;
  if (d.hat.visible) { d.hat.rotation.set(0.5 * Math.max(0, Math.sin(t * 9)) * (Math.sin(t * 1.7) > 0 ? 1 : 0), 0.6 * Math.sin(t * 0.8), 0); d.hat.userData.wl.rotation.z = 0.5; d.hat.userData.wr.rotation.z = -0.5; }
}
