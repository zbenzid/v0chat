// Météo Wouf : un chien low poly présente la météo en France, façon console 2002.
// Fonction pure du temps : window.seek(t) peint l'image t (voir lib/motion.js).
// Tout est rendu en 640x360 (three.js sans antialiasing + habillage 2-D) puis agrandi x3 au plus proche voisin.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as M from './lib/motion.js';
import { buildDog, poseDog, GEO, P, MAT, MATB, mesh, box, cyl, cone, ico, pigeon, setLip } from './sets/dog.js';
import { studioSet, mapSet, dioramaSet, CITIES } from './sets/sets.js';

const { E, prog, lerp, clamp, springU, SPRING, font, TAU } = M;
const LW = 640, LH = 360;
const DISPLAY = 'Display', UI = 'UI';

// Chaque accent visuel : [beat, label, sfx, opts]. scripts/sfx.mjs en fait le bruitage.
const HITS = [
  [0, 'titre', 'impact'], [1, 'titre rebond', 'boing', { pitch: 'F4', to: 'C5' }],
  [4, 'plan chien', 'click'], [4.7, 'bandeau nom', 'pop', { pitch: 'A5' }],
  [8, 'carte', 'whoosh', { len: 0.5 }],
  ...CITIES.map((c, i) => [8.6 + i * 0.5, `épingle ${c.key}`, 'blip', { pitch: ['C5', 'E5', 'G5', 'A5', 'C6'][i] }]),
  [12, 'zoom Lyon', 'whoosh', { len: 0.5, from: 500, to: 2600 }], [13.5, 'Lyon', 'thud'],
  [16.5, 'parapluie', 'boing', { pitch: 'C5', to: 'G5' }], [19, 'gros parapluie', 'boing', { pitch: 'C3', to: 'C4' }],
  [21.5, 'caca géant tombe', 'riser', { len: 0.7 }], [21.5, 'caca géant atterrit', 'impact'],
  [24, 'zoom Marseille', 'whoosh', { len: 0.5, from: 500, to: 2600 }], [25.5, 'Marseille', 'thud'],
  [26, 'lunettes', 'pop', { pitch: 'E5' }], [26.6, '47 degrés', 'bell', { pitch: 'A5' }], [28.5, 'merguez', 'whoosh', { len: 0.6, from: 2400, to: 400 }],
  [32, 'zoom Lille', 'whoosh', { len: 0.5, from: 500, to: 2600 }], [33.3, 'tornade', 'swell', { len: 0.8 }],
  [36, 'alerte', 'blip', { pitch: 'A5' }], [36.5, 'alerte', 'blip', { pitch: 'A5' }], [37, 'alerte', 'blip', { pitch: 'A5' }], [37.5, 'alerte', 'blip', { pitch: 'A5' }],
  [40, 'zoom Bretagne', 'whoosh', { len: 0.5, from: 500, to: 2600 }], [41.3, 'Bretagne', 'tick'], [43.5, 'voilà', 'tick'], [45.1, "c'est tout", 'tok', { pitch: 'C4' }],
  [48, 'zoom Paris', 'whoosh', { len: 0.5, from: 500, to: 2600 }], [49.3, 'Paris', 'thud'], [52, 'gros plan', 'click'], [53.7, 'tampon NUL', 'thud'],
  [56, 'retour studio', 'impact'], [58, 'toilettes', 'boing', { pitch: 'G4', to: 'C4' }],
  [59.5, 'toilette', 'thud'], [60, 'danse', 'crash', { len: 1.2 }], [60.5, 'toilette', 'thud'], [61.5, 'toilette', 'thud'],
  [63.3, 'bisous', 'bell', { pitch: 'E6' }], [64, 'carton de fin', 'impact'], [64.5, 'logo', 'coins'],
];

// Bandeaux : [u0, u1, titre, sous-titre, couleur]
const CAPS = [
  [4.7, 8, 'JEAN-MICHEL WOUF', 'Présentateur · très bon chien', '#ff6a00'],
  [8, 12, 'LA MÉTÉO', "C'est l'heure. Hélas.", '#ff6a00'],
  [12, 16, 'LYON', 'Il pleut du caca', '#8a4f1d'], [16, 19, 'LYON', 'Prenez un parapluie', '#8a4f1d'], [19, 24, 'LYON', 'Un gros.', '#8a4f1d'],
  [24, 28.4, 'MARSEILLE', '47°C · ça va pas du tout', '#e8352c'], [28.4, 32, 'MARSEILLE', 'Averses de merguez', '#e8352c'],
  [32, 36, 'LILLE', 'Tornade de frites', '#c98f00'], [36, 40, 'LILLE', 'Vigilance mayonnaise', '#c98f00'],
  [40, 43.4, 'BRETAGNE', 'Il pleut', '#3f6387'], [43.4, 45, 'BRETAGNE', 'Voilà.', '#3f6387'], [45, 48, 'BRETAGNE', "C'est tout.", '#3f6387'],
  [48, 52, 'PARIS', 'Brouillard de pigeons', '#6d6d86'], [52, 56, 'PARIS', 'Ressenti : nul', '#6d6d86'],
  [56, 60.6, 'DEMAIN', 'Skibidi sur tout le pays', '#b01fd6'], [60.6, 63.2, 'DEMAIN', 'Ouaf, ouaf !', '#b01fd6'], [63.2, 64, 'DEMAIN', 'Bisous', '#b01fd6'],
];
const TICKER = 'FLASH : le vent est annulé /// TOULOUSE : 100 % de chances de saucisse /// STRASBOURG : neige de knacks /// BORDEAUX : brume de pinard /// NICE : ciel bleu, suspect /// CLERMONT : le volcan a la flemme /// NANTES : ni oui ni non /// CORSE : ne répond pas /// ';

let R, LO, lo, S = {}, scan;

function render3D(set, t, u) {
  set.update(t, u);
  R.render(set.scene, set.camera);
  lo.drawImage(R.domElement, 0, 0);
}

// ---------------------------------------------------------------- habillage 2-D (640x360)
function bar(c, x, y, w, h, col, skew = 6) {
  c.fillStyle = col; c.beginPath(); c.moveTo(x, y); c.lineTo(x + w + skew, y); c.lineTo(x + w, y + h); c.lineTo(x - skew, y + h); c.closePath(); c.fill();
}
function label(c, str, x, y, f, col, align = 'left') { c.font = f; c.fillStyle = col; c.textAlign = align; c.fillText(str, x, y); }
function outlined(c, str, x, y, f, col, out = '#10102a', w = 3, align = 'left') {
  c.font = f; c.textAlign = align; c.lineJoin = 'round'; c.lineWidth = w; c.strokeStyle = out; c.strokeText(str, x, y); c.fillStyle = col; c.fillText(str, x, y);
}

let tickW = 0;
function drawUI(c, u, t) {
  // logo de chaîne + DIRECT
  if (u >= 4 && u < 64) {
    bar(c, 22, 14, 74, 16, '#10102a', 4); label(c, 'WOUF TV', 27, 26.5, font(12, 400, DISPLAY), '#fff');
    if (Math.floor(t * 2) % 2 === 0) { c.fillStyle = '#ff2a2a'; c.fillRect(106, 18, 8, 8); }
    label(c, 'DIRECT', 118, 26, font(10, 700, UI), '#fff');
  }
  // bandeau déroulant
  if (u >= 4 && u < 64) {
    c.fillStyle = '#10102a'; c.fillRect(0, LH - 20, LW, 20); c.fillStyle = '#ffd400'; c.fillRect(0, LH - 21, LW, 1);
    c.font = font(11, 700, UI); if (!tickW) tickW = c.measureText(TICKER).width;
    const x = -((t * 55) % tickW);
    label(c, TICKER, x, LH - 6, font(11, 700, UI), '#ffd400'); label(c, TICKER, x + tickW, LH - 6, font(11, 700, UI), '#ffd400');
  }
  // bandeau titre + sous-titre
  const cap = CAPS.find((k) => u >= k[0] && u < k[1]);
  if (cap) {
    const first = CAPS.find((k) => k[2] === cap[2]);
    const kt = clamp(springU(u, first[0], SPRING.snappy), 0, 1.2), ks = springU(u, cap[0] + 0.1, SPRING.bouncy);
    const fT = font(30, 400, DISPLAY), fS = font(16, 700, UI);
    c.font = fT; const wT = c.measureText(cap[2]).width + 28;
    c.font = fS; const wS = c.measureText(cap[3]).width + 24;
    const x = lerp(-wT - 60, 26, kt);
    bar(c, x, 268, wT, 36, cap[4]); label(c, cap[2], x + 12, 296, fT, '#fff');
    if (ks > 0.02) {
      c.save(); c.translate(x + 8, 318); c.scale(1, clamp(ks, 0, 1.3)); bar(c, 0, -13, wS, 25, '#fff', 4); label(c, cap[3], 12, 5, fS, '#10102a'); c.restore();
    }
  }
  // carton titre (u 0..4)
  if (u < 4) {
    const str = 'MÉTÉO WOUF', f = font(64, 400, DISPLAY);
    c.font = f; let x = 34;
    [...str].forEach((ch, i) => {
      const k = springU(u, -0.3 + i * 0.12, SPRING.bouncy), w = c.measureText(ch).width;
      const out = E.inBack(prog(u, 3.5 + i * 0.03, 3.95));
      if (k > 0) { c.save(); c.translate(x + w / 2, 300 + (1 - k) * 120 + out * 160); c.rotate((1 - k) * 0.5); outlined(c, ch, 0, 0, f, i < 5 ? '#ffd400' : '#fff', '#10102a', 8, 'center'); c.restore(); }
      x += w;
    });
    const k2 = springU(u, 1.6, SPRING.snappy);
    if (k2 > 0.02 && u < 3.6) { c.save(); c.translate(38, 316); c.scale(clamp(k2, 0, 1.2), 1); bar(c, 0, 0, 300, 22, '#ff6a00', 4); label(c, "Le bulletin que personne n'a demandé", 10, 15.5, font(13, 700, UI), '#fff'); c.restore(); }
  }
  // 47°C
  if (u >= 26.6 && u < 28.5) {
    const k = springU(u, 26.6, SPRING.wobbly);
    c.save(); c.translate(500, 150 + Math.sin(t * 9) * 3); c.scale(k, k); c.rotate(-0.08);
    outlined(c, '47°C', 0, 0, font(84, 400, DISPLAY), '#ff3b1f', '#fff', 10, 'center'); c.restore();
  }
  // VIGILANCE MAYONNAISE
  if (u >= 36 && u < 40) {
    const k = clamp(springU(u, 36, SPRING.snappy), 0, 1.1), on = Math.floor(u * 2) % 2 === 0;
    c.save(); c.translate(0, lerp(-60, 44, k));
    c.fillStyle = on ? '#ffd400' : '#fffbe0'; c.fillRect(0, 0, LW, 44);
    c.fillStyle = '#10102a';
    for (let i = -2; i < 50; i++) { const x = i * 16 - ((t * 40) % 16); c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 8, 0); c.lineTo(x + 2, 6); c.lineTo(x - 6, 6); c.fill(); c.beginPath(); c.moveTo(x, 38); c.lineTo(x + 8, 38); c.lineTo(x + 2, 44); c.lineTo(x - 6, 44); c.fill(); }
    label(c, 'VIGILANCE MAYONNAISE', LW / 2, 32, font(31, 400, DISPLAY), '#10102a', 'center');
    c.restore();
  }
  // tampon NUL
  if (u >= 53.7 && u < 56) {
    const k = clamp(springU(u, 53.7, { stiffness: 500, damping: 22 }), 0, 1.2), s = lerp(4, 1, k);
    c.save(); c.translate(480, 150); c.rotate(-0.22); c.scale(s, s); c.globalAlpha = clamp(k * 2);
    c.strokeStyle = '#e01b1b'; c.lineWidth = 7; c.strokeRect(-112, -58, 224, 104);
    label(c, 'NUL', 0, 34, font(96, 400, DISPLAY), '#e01b1b', 'center'); c.restore();
  }
  // carton de fin
  if (u >= 64) {
    const str = 'MÉTÉO WOUF', f = font(72, 400, DISPLAY);
    c.font = f; const tw = c.measureText(str).width; let x = (LW - tw) / 2;
    [...str].forEach((ch, i) => {
      const k = springU(u, 64 + i * 0.1, SPRING.bouncy), w = c.measureText(ch).width;
      if (k > 0) { c.save(); c.translate(x + w / 2, 92 - (1 - k) * 140); c.rotate(Math.sin(u * Math.PI + i) * 0.06); outlined(c, ch, 0, 0, f, i < 5 ? '#ffd400' : '#fff', '#10102a', 9, 'center'); c.restore(); }
      x += w;
    });
    const k2 = springU(u, 65.5, SPRING.bouncy);
    if (k2 > 0.02) { c.save(); c.translate(LW / 2, 322); c.scale(clamp(k2, 0, 1.3), clamp(k2, 0, 1.3)); bar(c, -150, -20, 300, 30, '#ff6a00'); label(c, 'À demain. Ou pas.', 0, 2, font(20, 700, UI), '#fff', 'center'); c.restore(); }
  }
}

M.film({
  fonts: [font(64, 400, DISPLAY), font(14, 700, UI)],
  hits: HITS,
  samples: 1,
  async init() {
    const [lip] = await Promise.all([fetch('audio/lipsync.json').then((r) => r.json())]);
    setLip(lip);
    const cv = document.createElement('canvas'); cv.width = LW; cv.height = LH;
    R = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: false, preserveDrawingBuffer: true });
    R.setPixelRatio(1); R.setSize(LW, LH, false);
    LO = document.createElement('canvas'); LO.width = LW; LO.height = LH; lo = LO.getContext('2d', { alpha: false });
    S.studio = studioSet(); S.map = mapSet(); S.dio = dioramaSet();
    // trame : une ligne sombre sur trois, comme une télé cathodique
    scan = document.createElement('canvas'); scan.width = 4; scan.height = 3;
    const sc = scan.getContext('2d'); sc.fillStyle = 'rgba(0,0,10,0.2)'; sc.fillRect(0, 2, 4, 1);
  },
  draw(ctx, _u, t0) {
    // 30 images/s, comme le jeu d'origine qui n'a jamais existé
    const t = Math.floor(t0 * 30 + 1e-4) / 30, u = M.U(t);
    let set = S.studio;
    if (u >= 8 && u < 56) {
      set = S.map;
      if (u >= 12) { const c = CITIES.find((k) => u >= k.u0 && u < k.u1); if (u >= c.cut) set = S.dio; }
    }
    render3D(set, t, u);
    lo.save(); lo.textBaseline = 'alphabetic';
    for (const l of set.labels || []) if (l.k > 0.02) { lo.save(); lo.translate(Math.round(l.x), Math.round(l.y)); lo.scale(l.k, l.k); outlined(lo, l.name, 0, 0, font(15, 400, DISPLAY), '#fff', '#10102a', 4, 'center'); lo.restore(); }
    drawUI(lo, u, t); lo.restore();
    ctx.imageSmoothingEnabled = false;
    const sh = (set.shake || [0, 0]).map((v) => Math.round(v) * 3);
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, M.W, M.H);
    ctx.drawImage(LO, 0, 0, LW, LH, sh[0], sh[1], M.W, M.H);
    ctx.fillStyle = ctx.createPattern(scan, 'repeat'); ctx.fillRect(0, 0, M.W, M.H);
    const g = ctx.createRadialGradient(M.W / 2, M.H / 2, M.H * 0.55, M.W / 2, M.H / 2, M.H * 1.05);
    g.addColorStop(0, 'rgba(0,0,20,0)'); g.addColorStop(1, 'rgba(0,0,20,0.45)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, M.W, M.H);
  },
});
