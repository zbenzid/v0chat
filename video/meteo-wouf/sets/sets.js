// Les trois plateaux : le studio, la carte de France en relief, et les dioramas des villes.
// update(t, u) pose TOUT à partir du temps : aucun état entre deux images.
import * as THREE from 'three';
import * as M from '../lib/motion.js';
import { buildDog, poseDog, GEO, P, MAT, MATB, mesh, merge, box, cyl, cone, ico, pigeon } from './dog.js';

const { E, prog, lerp, clamp, springU, SPRING, hash01, noise1, bump, TAU } = M;
const PI = Math.PI;

export const CITIES = [
  { key: 'lyon', name: 'LYON', u0: 12, cut: 13.5, u1: 24, lon: 4.85, lat: 45.75 },
  { key: 'marseille', name: 'MARSEILLE', u0: 24, cut: 25.5, u1: 32, lon: 5.37, lat: 43.3 },
  { key: 'lille', name: 'LILLE', u0: 32, cut: 33.3, u1: 40, lon: 3.06, lat: 50.63 },
  { key: 'bretagne', name: 'BRETAGNE', u0: 40, cut: 41.3, u1: 48, lon: -3.0, lat: 48.2 },
  { key: 'paris', name: 'PARIS', u0: 48, cut: 49.3, u1: 56, lon: 2.35, lat: 48.85 },
];
// contour (très) simplifié de l'Hexagone, en lon/lat
const FR = [[2.5, 51.1], [4.2, 50.0], [5.8, 49.5], [8.2, 49.0], [7.6, 47.6], [6.8, 47.0], [6.1, 46.3], [7.0, 45.9], [6.6, 45.1], [7.0, 44.2], [7.5, 43.8],
  [6.2, 43.1], [5.0, 43.4], [4.2, 43.5], [3.2, 43.2], [3.1, 42.4], [1.7, 42.5], [0.7, 42.8], [-1.8, 43.4], [-1.2, 44.6], [-1.1, 45.6], [-1.2, 46.2],
  [-2.1, 46.9], [-2.5, 47.3], [-4.4, 47.8], [-4.8, 48.4], [-3.5, 48.8], [-2.0, 48.6], [-1.6, 48.7], [-1.9, 49.7], [-1.1, 49.4], [0.1, 49.5], [1.5, 50.1], [1.6, 50.9]];
const CORSE = [[8.6, 42.0], [9.4, 43.0], [9.55, 42.0], [9.2, 41.4], [8.8, 41.6]];
const proj = (lon, lat) => [(lon - 2.5) * 0.69, lat - 46.5];
const sky = (scene, hex, near, far) => { scene.background.set(hex); scene.fog.color.set(hex); scene.fog.near = near; scene.fog.far = far; };
const camera = (fov) => new THREE.PerspectiveCamera(fov, 16 / 9, 0.1, 300);
function look(cam, p, tg, roll = 0) { cam.position.set(...p); cam.up.set(Math.sin(roll), Math.cos(roll), 0); cam.lookAt(...tg); }
const mix3 = (a, b, p) => a.map((v, i) => lerp(v, b[i], p));
function lights(scene, amb = 1.7, dir = 2.4) {
  const a = new THREE.AmbientLight(0xffffff, amb), d = new THREE.DirectionalLight(0xffffff, dir);
  d.position.set(4, 8, 6); scene.add(a, d); return { a, d };
}
function tex(w, h, fn) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; fn(cv.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false;
  return t;
}
function landGeo(poly, depth, top, side) {
  const s = new THREE.Shape(); poly.forEach(([lo, la], i) => { const [x, y] = proj(lo, la); i ? s.lineTo(x, y) : s.moveTo(x, y); });
  const g0 = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false }); g0.rotateX(-PI / 2);
  const g = P(g0, top), n = g.attributes.normal, c = g.attributes.color, sc = new THREE.Color(side);
  for (let i = 0; i < n.count; i++) if (Math.abs(n.getY(i)) < 0.5) c.setXYZ(i, sc.r, sc.g, sc.b);
  return g;
}
const _o = new THREE.Object3D();
function put(im, i, x, y, z, rx = 0, ry = 0, rz = 0, s = 1) { _o.position.set(x, y, z); _o.rotation.set(rx, ry, rz); _o.scale.setScalar(s); _o.updateMatrix(); im.setMatrixAt(i, _o.matrix); }
function inst(geo, n) { const m = new THREE.InstancedMesh(geo, MAT, n); m.frustumCulled = false; return m; }
// pluie d'objets : chaque instance retombe en boucle, à partir de t0 (rien avant)
function fall(im, t, { t0 = 0, area = [-6, 6, -5, 4], top = 9, speed = 5, spin = 3, size = [0.6, 1], slant = 0, seed = 1 }) {
  for (let i = 0; i < im.count; i++) {
    const cyc = ((t - t0) * speed) / top - hash01(i, seed) * 1.0;
    if (cyc < 0) { put(im, i, 0, -50, 0, 0, 0, 0, 0); continue; }
    const k = Math.floor(cyc), f = cyc - k, y = top * (1 - f);
    const x = lerp(area[0], area[1], hash01(i * 7 + k * 13, seed + 1)) + slant * y, z = lerp(area[2], area[3], hash01(i * 11 + k * 17, seed + 2));
    put(im, i, x, y, z, spin * t * (0.5 + hash01(i, seed + 3)) + i, i * 1.7, spin ? spin * t * 0.7 + i : -slant * 0.9, lerp(size[0], size[1], hash01(i, seed + 4)));
  }
  im.instanceMatrix.needsUpdate = true;
}

// ================================================================ STUDIO
export function studioSet() {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#141a4a'); scene.fog = new THREE.Fog('#141a4a', 14, 40);
  const cam = camera(40), L = lights(scene);
  const floorT = tex(32, 32, (c) => { c.fillStyle = '#2a2f7a'; c.fillRect(0, 0, 32, 32); c.fillStyle = '#3d46a8'; c.fillRect(0, 0, 16, 16); c.fillRect(16, 16, 16, 16); });
  floorT.wrapS = floorT.wrapT = THREE.RepeatWrapping; floorT.repeat.set(14, 10);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 28), new THREE.MeshLambertMaterial({ map: floorT })); floor.rotation.x = -PI / 2; scene.add(floor);
  const wallT = tex(256, 96, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1b2a8f'); g.addColorStop(0.6, '#2f6fe0'); g.addColorStop(1, '#69c5ff'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = -4; i < 20; i++) { c.beginPath(); c.moveTo(i * 24, h); c.lineTo(i * 24 + 10, h); c.lineTo(i * 24 + 58, 0); c.lineTo(i * 24 + 48, 0); c.fill(); }
    c.fillStyle = '#ffd400'; c.fillRect(0, h - 14, w, 3); c.fillStyle = '#ff6a00'; c.fillRect(0, h - 9, w, 2);
  });
  const wallM = new THREE.MeshBasicMaterial({ map: wallT }), wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 13), wallM); wall.position.set(0, 6.5, -4.6); scene.add(wall);
  // l'écran derrière le chien : la carte en 2-D
  const mapT = tex(160, 100, (c, w, h) => {
    c.fillStyle = '#123a9c'; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(255,255,255,0.15)'; for (let i = 0; i < w; i += 10) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); } for (let i = 0; i < h; i += 10) { c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); }
    const q = ([lo, la]) => { const [x, y] = proj(lo, la); return [80 + x * 9.5 + 4, 50 - y * 9.5]; };
    for (const poly of [FR, CORSE]) { c.beginPath(); poly.forEach((p, i) => { const [x, y] = q(p); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath(); c.fillStyle = '#6fcf4f'; c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.stroke(); }
    c.fillStyle = '#ff2a2a'; CITIES.forEach((k) => { const [x, y] = q([k.lon, k.lat]); c.fillRect(x - 2, y - 2, 5, 5); });
  });
  const screen = new THREE.Group(); screen.position.set(3.3, 3.0, -3.6); screen.rotation.y = -0.3;
  screen.add(mesh([P(box(5.6, 3.6, 0.2), '#10102a', [0, 0, -0.12]), P(box(0.3, 3, 0.3), '#10102a', [0, -3, -0.2])]));
  screen.add(new THREE.Mesh(new THREE.PlaneGeometry(5.2, 3.25), new THREE.MeshBasicMaterial({ map: mapT }))); scene.add(screen);
  const logoT = tex(128, 32, (c) => { c.fillStyle = '#27306b'; c.fillRect(0, 0, 128, 32); c.fillStyle = '#ffd400'; c.font = '400 24px Display'; c.textAlign = 'center'; c.fillText('WOUF TV', 64, 25); });
  const desk = new THREE.Group();
  desk.add(mesh([P(box(3.8, 1.05, 1.0), '#f1f3fa', [0, 0.525, 0.75]), P(box(3.95, 0.1, 1.15), '#ff6a00', [0, 1.08, 0.75]),
    P(cyl(0.1, 0.085, 0.22, 6), '#e8352c', [1.25, 1.24, 0.85]), P(cyl(0.035, 0.035, 0.36, 5), '#fffdf2', [-1.2, 1.18, 0.95], [0, 0.4, PI / 2]),
    P(ico(0.07), '#fffdf2', [-1.36, 1.18, 0.86]), P(ico(0.07), '#fffdf2', [-1.04, 1.18, 1.04])]));
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.65), new THREE.MeshBasicMaterial({ map: logoT })); logo.position.set(0, 0.52, 1.26); desk.add(logo); scene.add(desk);
  const sun = new THREE.Mesh(GEO.sun, MATB); sun.position.set(-3.6, 3.6, -3.8); scene.add(sun);
  const cloud = mesh(GEO.cloud); cloud.position.set(-3.0, 3.1, -3.2); cloud.scale.setScalar(1.3); scene.add(cloud);
  scene.add(mesh([P(cyl(0.3, 0.22, 0.5, 6), '#c8552b', [-5.2, 0.25, -2.5]), P(cone(0.5, 1.2, 5), '#2f9e44', [-5.2, 1.1, -2.5]), P(cone(0.4, 1.0, 5), '#3fbf5a', [-5.2, 1.7, -2.5])]));
  const dog = buildDog(); scene.add(dog.root);
  const toilets = Array.from({ length: 16 }, () => { const m = mesh(GEO.toilet); scene.add(m); return m; });
  const heart = mesh(GEO.heart); scene.add(heart);
  const set = { scene, camera: cam, shake: null };
  set.update = (t, u) => {
    const outro = u >= 56, disco = u >= 58, dance = u >= 60;
    desk.visible = !dance;
    sun.rotation.z = t * 0.8; sun.scale.setScalar(0.85 + 0.06 * Math.sin(u * PI)); cloud.position.y = 3.1 + 0.1 * Math.sin(t * 1.4);
    if (disco) { L.a.color.setHSL((u * 0.25) % 1, 0.75, 0.72); wallM.color.setHSL((u * 0.25 + 0.5) % 1, 0.6, 0.75); } else { L.a.color.set(0xffffff); wallM.color.set(0xffffff); }
    poseDog(dog, t, u, dance ? { z: 1.4, dance: 1, spin: u >= 64 ? E.inOutCubic(((u - 64) / 4) % 1) * TAU : 0 } : { y: 0.3, armsUp: disco ? 0.5 * clamp(springU(u, 58, SPRING.bouncy), 0, 1.3) : 0, headPitch: u < 4 ? 0 : 0 });
    toilets.forEach((m, i) => {
      const tl = M.TS(58 + i * 0.45), dt = t - tl;
      m.visible = dt > 0; if (!m.visible) return;
      const side = i % 2 ? 1 : -1, x = side * (1.7 + 3.4 * hash01(i, 21)), z = -2.6 + 4.6 * hash01(i, 22), fallT = 0.75;
      let y, r = 0;
      if (dt < fallT) { y = 9 * (1 - (dt / fallT) ** 2); r = (1 - dt / fallT) * 5; } else { const b = dt - fallT; y = 1.1 * Math.abs(Math.sin(b * 6)) * Math.exp(-b * 2.2) + (dance ? 0.18 * Math.abs(Math.sin(u * PI + i)) : 0); }
      m.position.set(x, y, z); m.rotation.set(r, hash01(i, 23) * TAU + (dance ? 0.4 * Math.sin(u * PI / 2 + i) : 0), r * 0.6); m.scale.setScalar(1.15);
    });
    const hk = springU(u, 63.3, SPRING.bouncy);
    heart.visible = hk > 0.01 && u < 67.5;
    if (heart.visible) { heart.position.set(dog.root.position.x + 0.7, 2.7 + (u - 63.3) * 0.45, 1.6); heart.rotation.y = t * 3; heart.scale.setScalar(hk * 1.1); }
    if (u < 4) { const p = prog(u, 0, 4); look(cam, mix3([-5.5, 3.4, 9], [-3.6, 2.7, 7.4], E.outCubic(p)), [0.5, 2.0, 0]); }
    else if (u < 8) look(cam, mix3([0.7, 2.05, 4.9], [0.35, 2.05, 4.2], prog(u, 4, 8)), [0.1, 2.05, 0]);
    else if (u < 60) look(cam, mix3([-1.3, 2.2, 5.4], [-0.6, 2.1, 4.6], prog(u, 56, 60)), [0.1, 2.0, 0]);
    else if (u < 64) look(cam, mix3([-1.5, 1.5, 8.2], [1.6, 1.2, 7.2], prog(u, 60, 64)), [0, 1.6, 0.6], 0.06 * Math.sin(u * PI / 2));
    else look(cam, mix3([-1.6, 0.6, 6.6], [1.6, 0.6, 6.6], E.inOutSine(prog(u, 64, 72))), [0, 1.35, 1.0], 0.05 * Math.sin(u * PI / 2));
    set.shake = u >= 56 && u < 57 ? [5 * Math.exp(-(u - 56) * 5) * noise1(u * 40, 3), 5 * Math.exp(-(u - 56) * 5) * noise1(u * 40, 8)] : null;
  };
  return set;
}

// ================================================================ CARTE
export function mapSet() {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#1c57c9'); scene.fog = new THREE.Fog('#1c57c9', 16, 46);
  const cam = camera(40); lights(scene, 1.9, 2.2);
  scene.add(mesh([P(box(90, 0.1, 90), '#2466dd', [0, -0.06, 0])]));
  const grid = new THREE.GridHelper(60, 60, 0x6aa6ff, 0x4a8cf0); grid.position.y = 0.01; scene.add(grid);
  const mount = (lo, la, h, r) => { const [x, y] = proj(lo, la); return [P(cone(r, h, 5), '#8a8f7a', [x, 0.35 + h / 2, -y]), P(cone(r * 0.45, h * 0.45, 5), '#ffffff', [x, 0.36 + h * 0.78, -y])]; };
  scene.add(mesh([landGeo(FR, 0.35, '#62c048', '#c9a66b'), landGeo(CORSE, 0.35, '#62c048', '#c9a66b'),
    ...mount(6.6, 45.5, 0.9, 0.5), ...mount(6.5, 44.5, 0.7, 0.45), ...mount(0.2, 42.9, 0.6, 0.4), ...mount(1.4, 42.75, 0.6, 0.4), ...mount(-0.6, 43.1, 0.5, 0.35), ...mount(2.9, 45.3, 0.45, 0.45), ...mount(7.0, 48.0, 0.4, 0.35),
    ...[[-0.57, 44.84], [1.44, 43.6], [7.75, 48.58], [-1.55, 47.22], [7.26, 43.7], [3.08, 45.78], [0.1, 49.2], [1.9, 47.9], [5.04, 47.32]].map(([lo, la]) => { const [x, y] = proj(lo, la); return P(box(0.14, 0.12, 0.14), '#f4f4f4', [x, 0.41, -y]); })]));
  const icons = { lyon: () => mesh(GEO.poopFace), marseille: () => new THREE.Mesh(GEO.sun, MATB), lille: () => mesh(GEO.fries), bretagne: () => mesh(GEO.cloud), paris: () => pigeon() };
  const iconScale = { lyon: 0.75, marseille: 0.33, lille: 0.85, bretagne: 0.55, paris: 1.5 };
  const pins = CITIES.map((c) => {
    const [x, y] = proj(c.lon, c.lat), g = new THREE.Group(); g.position.set(x, 0.35, -y);
    g.add(mesh([P(cone(0.15, 0.55, 5), '#ff2a2a', [0, 0.28, 0], [PI, 0, 0]), P(ico(0.2), '#ff2a2a', [0, 0.62, 0]), P(ico(0.08), '#ffffff', [0, 0.66, 0.16])]));
    const ic = icons[c.key](); ic.position.y = 1.45; g.add(ic);
    const ring = mesh([P(new THREE.TorusGeometry(0.5, 0.05, 4, 10), '#ffffff', [0, 0.03, 0], [PI / 2, 0, 0])]); g.add(ring);
    scene.add(g); return { g, ic, ring, c, x, z: -y };
  });
  const P0 = [-0.4, 13.5, 10.2], T0 = [-0.4, 0, 0.1], v = new THREE.Vector3();
  const set = { scene, camera: cam, shake: null, labels: [] };
  set.update = (t, u) => {
    const act = u >= 12 ? CITIES.findIndex((c) => u >= c.u0 && u < c.u1) : -1;
    pins.forEach((p, i) => {
      const k = u < 12 ? springU(u, 8.6 + i * 0.5, SPRING.bouncy) : 1, on = i === act;
      p.g.visible = k > 0.001; p.g.position.y = 0.35 + (1 - k) * 9;
      const s = (on ? 1.25 + 0.2 * Math.abs(Math.sin(u * PI * 2)) : u < 12 ? 1.35 : 0.8);
      p.g.scale.setScalar(s); p.ic.rotation.y = t * 2 + i; p.ic.scale.setScalar(iconScale[p.c.key]); p.ic.position.y = 1.45 + 0.12 * Math.sin(t * 4 + i);
      if (p.c.key === 'paris') { p.ic.userData.wl.rotation.z = Math.sin(t * 18) * 0.8; p.ic.userData.wr.rotation.z = -Math.sin(t * 18) * 0.8; }
      p.ring.visible = on; const r = (u * 1.5) % 1; p.ring.scale.set(0.6 + 2.2 * r, 1, 0.6 + 2.2 * r);
    });
    if (act < 0) { const a = 0.22 * Math.sin((u - 8) * 0.5); look(cam, [P0[0] + Math.sin(a) * 9, P0[1] - (u - 8) * 0.25, P0[2] - (u - 8) * 0.2], T0); }
    else { const p = pins[act], q = E.inOutCubic(prog(u, p.c.u0, p.c.cut + 0.1)); look(cam, mix3(P0, [p.x + 1.1, 2.3, p.z + 4.4], q), mix3(T0, [p.x, 1.1, p.z], q)); }
    cam.updateMatrixWorld();
    set.labels = act >= 0 ? [] : pins.map((p, i) => { v.set(p.x, p.g.position.y + 3.1, p.z).project(cam); return { name: p.c.name, x: (v.x * 0.5 + 0.5) * 640, y: (-v.y * 0.5 + 0.5) * 360, k: springU(u, 8.9 + i * 0.5, SPRING.bouncy) }; });
  };
  return set;
}

// ================================================================ DIORAMAS
export function dioramaSet() {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(); scene.fog = new THREE.Fog(0xffffff, 10, 40);
  const cam = camera(42), L = lights(scene);
  const dog = buildDog(); scene.add(dog.root);
  const G = {};
  const add = (key, parts) => { const g = new THREE.Group(); g.add(mesh(parts)); scene.add(g); G[key] = g; return g; };

  // --- Lyon : maisons ocre, colline, basilique
  const ly = [P(cyl(10, 10, 0.4, 10), '#8a9a5b', [0, -0.2, 0]), P(cone(4.5, 2.8, 7), '#5f7f45', [-5.5, 1.1, -9.5]), P(box(1.4, 1.3, 0.9), '#f2efe6', [-5.5, 3.0, -9.5]),
    ...[[-0.6, -0.4], [0.6, -0.4], [-0.6, 0.4], [0.6, 0.4]].map(([a, b]) => P(cyl(0.1, 0.12, 2.0, 4), '#f2efe6', [-5.5 + a, 3.4, -9.5 + b])),
    P(cyl(0.9, 0.9, 0.03, 7), '#6b3d17', [2.4, 0.02, 1.6]), P(cyl(0.6, 0.6, 0.03, 7), '#6b3d17', [-2.6, 0.02, 2.4]), P(cyl(0.7, 0.7, 0.03, 7), '#6b3d17', [3.4, 0.02, -1.6])];
  for (let i = 0; i < 8; i++) { const x = -6.5 + i * 1.85, z = -4.6 - (i % 2) * 1.3, h = 1.5 + hash01(i, 31) * 1.3; ly.push(P(box(1.4, h, 1.4), ['#e8b96a', '#e79a7a', '#f0d28a'][i % 3], [x, h / 2, z]), P(cone(1.15, 0.8, 4), '#c8552b', [x, h + 0.4, z], [0, PI / 4, 0]), P(box(0.3, 0.4, 0.05), '#5a3a2a', [x, 0.9, z + 0.71])); }
  add('lyon', ly);
  // --- Marseille : sable, mer, Bonne Mère, palmiers
  const palm = (x, z) => [P(cyl(0.1, 0.15, 2.5, 5), '#8a5a2b', [x, 1.25, z]), ...Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * TAU; return P(box(1.3, 0.06, 0.32), i % 2 ? '#2f9e44' : '#3fbf5a', [x + Math.cos(a) * 0.58, 2.42, z + Math.sin(a) * 0.58], [0, -a, -0.4]); })];
  add('marseille', [P(cyl(10, 10, 0.4, 10), '#ecd28f', [0, -0.2, 0]), P(box(90, 0.1, 40), '#1e86e0', [0, -0.12, -26]), P(cone(3.6, 2.4, 6), '#d9c39a', [-5, 1.0, -8]),
    P(box(0.9, 1.5, 0.9), '#f6ead0', [-5, 2.7, -8]), P(box(0.45, 1.5, 0.45), '#f6ead0', [-5, 4.1, -8]), P(ico(0.22), '#ffd61f', [-5, 5.05, -8]), ...palm(3.6, -2.4), ...palm(-3.2, -3.4), ...palm(5.4, -5)]);
  // --- Lille : briques, pignons à gradins, beffroi
  const li = [P(cyl(10, 10, 0.4, 10), '#6f9a4e', [0, -0.2, 0]), P(box(1.1, 5.2, 1.1), '#b0563a', [5, 2.6, -6.5]), P(box(0.75, 1.5, 0.75), '#e2d2a8', [5, 5.9, -6.5]), P(cone(0.65, 1.1, 4), '#3d4a5c', [5, 7.2, -6.5], [0, PI / 4, 0]), P(cyl(0.28, 0.28, 0.06, 8), '#ffffff', [5, 6.0, -6.1], [PI / 2, 0, 0])];
  for (let i = 0; i < 6; i++) { const x = -7 + i * 1.95, h = 2.1 + hash01(i, 41) * 0.9, c = ['#a8432e', '#8f3a2a', '#c2603a'][i % 3]; li.push(P(box(1.7, h, 1.3), c, [x, h / 2, -5.2]), P(box(1.25, 0.32, 1.3), c, [x, h + 0.16, -5.2]), P(box(0.8, 0.32, 1.3), c, [x, h + 0.48, -5.2]), P(box(0.35, 0.32, 1.3), c, [x, h + 0.8, -5.2]), P(box(0.3, 0.42, 0.05), '#ffe9a8', [x - 0.4, h * 0.62, -4.53]), P(box(0.3, 0.42, 0.05), '#ffe9a8', [x + 0.4, h * 0.62, -4.53])); }
  add('lille', li);
  // --- Bretagne : un caillou, un phare, des menhirs, la mer grise
  const lh = [-3.4, -4.8];
  add('bretagne', [P(box(120, 0.1, 120), '#465c68', [0, -0.2, 0]), P(cyl(3.3, 4.2, 0.5, 7), '#5c615b', [0, -0.05, 0]), P(cyl(2.9, 3.3, 0.1, 7), '#5d7a4a', [0, 0.22, 0]),
    P(ico(1.5), '#5c615b', [lh[0], 0, lh[1]], [0, 0, 0], [1, 0.45, 1]),
    ...[0, 1, 2, 3].map((k) => P(cyl(0.52 - 0.07 * (k + 1), 0.52 - 0.07 * k, 0.95, 7), k % 2 ? '#e8352c' : '#f4f4f0', [lh[0], 0.95 + 0.95 * k, lh[1]])),
    P(cyl(0.3, 0.3, 0.45, 6), '#ffe45c', [lh[0], 4.5, lh[1]]), P(cone(0.42, 0.5, 6), '#e8352c', [lh[0], 4.95, lh[1]]),
    P(ico(0.5), '#80837d', [2.2, 0.85, -1.3], [0, 0.4, 0.12], [0.6, 1.7, 0.5]), P(ico(0.4), '#74777a', [3.0, 0.6, -0.5], [0, 1, -0.1], [0.6, 1.5, 0.5])]);
  // --- Paris : la tour, de l'haussmannien, du gris
  const ex = 3.6, ez = -7.5, br = '#5a4634';
  const pa = [P(cyl(10, 10, 0.4, 10), '#8f8f98', [0, -0.2, 0]), P(cyl(0.95, 2.1, 2.7, 4), br, [ex, 1.35, ez], [0, PI / 4, 0]), P(box(2.0, 0.16, 2.0), '#463627', [ex, 2.75, ez]),
    P(cyl(0.48, 0.9, 2.7, 4), br, [ex, 4.15, ez], [0, PI / 4, 0]), P(box(1.0, 0.14, 1.0), '#463627', [ex, 5.55, ez]), P(cyl(0.05, 0.44, 4.0, 4), br, [ex, 7.6, ez], [0, PI / 4, 0]),
    P(box(1.5, 1.3, 3.2), '#8f8f98', [ex, 0.5, ez]), P(box(3.2, 1.3, 1.5), '#8f8f98', [ex, 0.5, ez])];
  for (let i = 0; i < 5; i++) { const x = -8 + i * 2.25, h = 2.6 + (i % 2) * 0.5; pa.push(P(box(2.0, h, 1.5), '#eadfc6', [x, h / 2, -5.4]), P(box(1.8, 0.6, 1.3), '#5d6b7d', [x, h + 0.3, -5.4]), P(box(0.2, 0.5, 0.2), '#c8552b', [x - 0.5, h + 0.8, -5.4]), ...[-0.55, 0, 0.55].map((dx) => P(box(0.28, 0.55, 0.05), '#6f7f95', [x + dx, h * 0.6, -4.63]))); }
  add('paris', pa);
  const birds = Array.from({ length: 30 }, () => { const b = pigeon(); G.paris.add(b); return b; });
  const sunM = new THREE.Mesh(GEO.sun, MATB); G.marseille.add(sunM);

  const FX = { poop: inst(GEO.poop, 80), merguez: inst(GEO.merguez, 90), fry: inst(GEO.fry, 190), rain: inst(GEO.rain, 320), mayo: inst(GEO.mayo, 46) };
  Object.values(FX).forEach((m) => scene.add(m));
  const giant = mesh(GEO.poopFace); giant.scale.setScalar(2.5); scene.add(giant);

  const set = { scene, camera: cam, shake: null };
  set.update = (t, u) => {
    const c = CITIES.find((k) => u >= k.u0 && u < k.u1) || CITIES[0], key = c.key;
    for (const k in G) G[k].visible = k === key;
    for (const k in FX) FX[k].visible = false;
    giant.visible = false; set.shake = null; L.a.color.set(0xffffff); L.d.color.set(0xffffff);
    const shot = (a, b, p0, p1, tg, roll = 0) => look(cam, mix3(p0, p1, prog(u, a, b)), tg, roll);
    if (key === 'lyon') {
      sky(scene, '#c2ae78', 12, 38); L.a.color.set('#fff2cf');
      FX.poop.visible = true; fall(FX.poop, t, { t0: M.TS(12.6), area: [-7, 7, -6, 1.5], top: 10, speed: 5.5, spin: 2.2, size: [0.4, 0.75], seed: 5 });
      const ub = clamp(springU(u, 16.5, SPRING.bouncy), 0, 1.4), big = 1 + 1.9 * springU(u, 19, SPRING.wobbly), k = clamp(springU(u, 21.5, { stiffness: 420, damping: 16 }), 0, 1.25);
      poseDog(dog, t, u, { umb: ub, canopy: big, squash: k, headPitch: u < 16.5 ? -0.25 * bump(u, 14.6, 1.2) : 0 });
      if (u >= 20.2) { giant.visible = true; const p = prog(u, 20.2, 21.5); giant.position.set(-0.12, u < 21.5 ? lerp(19, 4.35, p * p) : lerp(4.35, 2.0, k), 0.1); giant.rotation.set(0, u < 21.5 ? (1 - p) * 3 : 0, 0); giant.scale.set(2.5 * (1 + 0.15 * (k > 0 ? M.wobble(u - 21.5, 1.5, 3) : 0)), 2.5 * (1 - 0.15 * (k > 0 ? M.wobble(u - 21.5, 1.5, 3) : 0)), 2.5); }
      if (u >= 21.5) { const a = 8 * Math.exp(-(u - 21.5) * 2.5); set.shake = [a * noise1(u * 40, 3), a * noise1(u * 40, 8)]; }
      if (u < 19) shot(13.5, 19, [3.6, 2.5, 8.2], [2.4, 2.2, 6.8], [0, 1.7, 0]);
      else shot(19, 24, [-2.6, 0.9, 8.0], [-3.4, 0.9, 10], [0, 3.0, 0]);
    } else if (key === 'marseille') {
      sky(scene, '#ffb04a', 14, 48); L.a.color.set('#ffe2b0'); L.d.color.set('#fff0c0');
      sunM.position.set(4.6, 5.6, -10); sunM.rotation.z = t * 0.9; sunM.scale.setScalar(2.0 + 0.3 * Math.sin(u * PI * 2));
      FX.merguez.visible = u >= 28.2; fall(FX.merguez, t, { t0: M.TS(28.3), top: 10, speed: 6.5, spin: 4, size: [0.8, 1.3], seed: 9 });
      poseDog(dog, t, u, { glasses: clamp(springU(u, 26, SPRING.bouncy), 0, 1.3), pant: u < 26 || u > 30.9, armsUp: 0.6 * bump(u, 29.6, 1.4) });
      if (u < 28.5) shot(25.5, 28.5, [1.5, 1.95, 4.4], [1.1, 1.95, 3.6], [-0.2, 1.85, 0]);
      else shot(28.5, 32, [-4.4, 2.6, 8.4], [-3.4, 2.2, 7.4], [0.3, 2.0, 0]);
    } else if (key === 'lille') {
      sky(scene, '#8fa6bd', 12, 40);
      FX.fry.visible = true;
      const cx = 0.5 * Math.sin(t * 1.3);
      for (let i = 0; i < FX.fry.count; i++) { const h = (hash01(i, 51) + t * 0.3) % 1, y = h * 8, r = 0.7 + y * 0.52 + 0.3 * hash01(i, 52), a = hash01(i, 53) * TAU + t * (7 - h * 3); put(FX.fry, i, cx * (1 + h) + Math.cos(a) * r, y, Math.sin(a) * r, t * 5 + i, i, t * 3 + i * 2, 1); }
      FX.fry.instanceMatrix.needsUpdate = true;
      FX.mayo.visible = u >= 36; fall(FX.mayo, t, { t0: M.TS(36), top: 10, speed: 7, spin: 1, size: [0.8, 1.6], seed: 13 });
      const a = t * 4.2; poseDog(dog, t, u, { x: cx + Math.cos(a) * 2.1, y: 2.0 + 0.8 * Math.sin(t * 2.6), z: Math.sin(a) * 2.1, spin: -a * 1.7, tiltZ: 0.5, tiltX: 0.3 * Math.sin(t * 3), armsUp: 0.9, earUp: 0.9 });
      if (u < 36) shot(33.3, 36, [0, 2.4, 13], [0, 2.8, 11], [0, 3.2, 0]);
      else shot(36, 40, [4.5, 1.2, 9.5], [3.2, 1.0, 8.2], [0, 3.4, 0], 0.12 * Math.sin(u * PI / 2));
    } else if (key === 'bretagne') {
      sky(scene, '#77838a', 6, 30); L.a.color.set('#c9d6df'); L.d.color.set('#aab8c4');
      FX.rain.visible = true; fall(FX.rain, t, { t0: -10, area: [-9, 7, -7, 5], top: 9, speed: 17, spin: 0, slant: 0.22, size: [0.8, 1.4], seed: 17 });
      poseDog(dog, t, u, { y: 0.27, sad: 1, talk: 0.15, armsUp: bump(u, 45.5, 0.55) });
      shot(41.3, 48, [0.5, 1.75, 6.8], [0.3, 1.75, 5.2], [0, 1.6, 0]);
    } else {
      sky(scene, '#b9b9b4', 5, 24); L.a.color.set('#e4e4e0');
      birds.forEach((b, i) => {
        const dir = i % 2 ? 1 : -1, r = 1.5 + 3.6 * hash01(i, 61), a = hash01(i, 62) * TAU + t * (0.9 + 1.1 * hash01(i, 63)) * dir;
        b.position.set(Math.cos(a) * r, 1.3 + 3.6 * hash01(i, 64) + 0.3 * Math.sin(t * 2 + i), Math.sin(a) * r);
        b.rotation.set(0, -a + (dir > 0 ? 0 : PI), 0.3 * dir); const f = Math.sin(t * 19 + i) * 0.85; b.userData.wl.rotation.z = f; b.userData.wr.rotation.z = -f;
      });
      poseDog(dog, t, u, { hat: 1, headYaw: 0.25 * Math.sin(t * 1.1), armsUp: 0.45 * bump(u, 53.9, 0.8) });
      if (u < 52) shot(49.3, 52, [-3.4, 1.2, 7.6], [-2.8, 1.2, 6.6], [0.9, 2.9, -2]);
      else shot(52, 56, [0.9, 2.15, 4.0], [0.7, 2.15, 3.5], [0, 2.1, 0]);
    }
  };
  return set;
}
