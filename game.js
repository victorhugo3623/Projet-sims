'use strict';
/* ==============================================================
   PROJET SIMS — mini-jeu 2D façon Game Boy Color
   Tout est dessiné dans le code : aucune image à télécharger.
   ============================================================== */

/* ==============================================================
   1) LES PERSONNAGES — modifie ici (codes, couleurs, infos…)
   ============================================================== */
const PERSOS = {
  hakan: {
    id: 'hakan', nom: 'Hakan', fem: false,
    code: '1912',                        // <- code de connexion
    naissance: '2007-12-19',
    fiche: [
      ['Taille', '178 cm'],
      ['Origine', 'Turque'],
      ['Yeux', 'Marron'],
      ['Cheveux', 'Mi-longs, bruns'],
      ['Barbe', 'Bouc + moustache'],
    ],
    look: {
      grand: true, coiffure: 'milong', barbe: true,
      peau: '#f3c6a0', yeux: '#3a2214',
      cheveux: '#5b3a24', cheveuxOmbre: '#36200f', cheveuxClair: '#7d5436',
    },
    tenue: { haut: '#3a6cc0', bas: '#2e3550', chaussures: '#f2f2f2' },
    depart: { scene: 'town', x: 5, y: 7, dir: 'down' },
  },
  peline: {
    id: 'peline', nom: 'Peline', fem: true,
    code: '2602',                        // <- code de connexion
    naissance: '2009-02-26',
    fiche: [
      ['Taille', '160 cm'],
      ['Poids', '62 kg'],
      ['Origine', 'Turque'],
      ['Yeux', 'Marron noisette'],
      ['Cheveux', 'Longs, lisses, brun-châtain'],
    ],
    look: {
      grand: false, coiffure: 'long', barbe: false,
      peau: '#f3c6a0', yeux: '#6a4520',
      cheveux: '#4a2a18', cheveuxOmbre: '#2a160a', cheveuxClair: '#94603a',
    },
    tenue: { haut: '#d04f78', bas: '#4a5aa8', chaussures: '#ffffff' },
    depart: { scene: 'town', x: 7, y: 7, dir: 'down' },
  },
};

/* Couleurs proposées dans le menu « Tenue » */
const COULEURS_TENUE = {
  haut:       ['#3a6cc0', '#d04f78', '#e04040', '#3f9f5f', '#f0c030', '#f2f2f2', '#303038', '#8050c0', '#f08a30'],
  bas:        ['#2e3550', '#4a5aa8', '#303038', '#8a6a48', '#c8c8c8', '#5a7a3a', '#a03838', '#f2f2f2'],
  chaussures: ['#f2f2f2', '#ffffff', '#303038', '#8a5a32', '#e04040', '#3a6cc0', '#f0c030'],
};

/* ==============================================================
   2) DESTINATIONS du menu « Aller à »
   ============================================================== */
const DESTINATIONS = [
  { label: 'Maison',         scene: 'house',  x: 5,  y: 8, icone: 'D', iconeScene: 'town' },
  { label: 'École',          scene: 'school', x: 7,  y: 2, icone: 'e', iconeScene: 'school' },
  { label: 'Salle de sport', scene: 'gym',    x: 6,  y: 5, icone: 'U', iconeScene: 'gym' },
  { label: 'Jardin',         scene: 'town',   x: 14, y: 5, icone: '*', iconeScene: 'town' },
];

/* ==============================================================
   3) LES CARTES (1 caractère = 1 case de 16x16)
   --------------------------------------------------------------
   EXTÉRIEUR : T arbre  . herbe  , hautes herbes  = chemin  * fleurs
               F clôture  v potager  B banc  p bassin  Y buisson
               1-4 panneaux  r/u/o toits  W mur  w fenêtre
               D porte maison  E porte école  S porte salle de sport
   INTÉRIEUR : # mur  _ parquet  : carrelage  ; sol école  - sol sport
               X sortie  m tapis  g tapis de sol
               K frigo  C plan de travail  O cuisinière  L évier
               A table  h chaise  q/Q canapé  V télé  b/n lit
               z armoire  i table de chevet  k étagère  P plante
               H douche  l lavabo  j toilettes
               x tableau  e bureau élève  M bureau prof  Z casiers
               a fontaine  y miroir  R tapis de course  N banc muscu
               U haltères  I sac de frappe
   ============================================================== */
const SCENES = {
  town: {
    nom: 'Quartier',
    floor: '.',
    map: [
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      'T..,,.....,,.....,,.....,,.T',
      'T.rrrrrr.FFFFFFFFFF.uuuuuuuT',
      'T.rrrrrr.F*.vvvv.*F.uuuuuuuT',
      'T.WwWWwW.F..vvvv..F.WwWwWwWT',
      'T.WWWDWW.F.B...pp.F.WwWEWwWT',
      'T..1.=...FY.*..*.YF..2.=...T',
      'T....=...FFFF4=FFFF....=...T',
      'T.========================.T',
      'T,,..=.*..,,,,,,..*...=..,,T',
      'T,...=..T.,,,,,,.T....=...,T',
      'T....=.......*.....*..=....T',
      'T.T..=................=.T..T',
      'T....=....oooooooo....=....T',
      'T.,..=....oooooooo....=..,.T',
      'T....=....WwWwwWwW....=....T',
      'T....=...3WWWSWWWW....=....T',
      'T....==================....T',
      'T,,...*......,,,,.....pp..,T',
      'T,..T....*.....,,,,..*pp.T,T',
      'T.....,,,......T........,,.T',
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    ],
    zones: [{ nom: 'Jardin', x1: 10, y1: 3, x2: 17, y2: 6 }],
  },

  house: {
    nom: 'Maison',
    floor: '_',
    wall: { face: '#ead8b4', stripe: '#dcc79c', top: '#6a4e38', base: '#a07850' },
    map: [
      '################',
      '#KCOCL:#z_P__bi#',
      '#::::::#_____n_#',
      '#:hAAh:#__mm___#',
      '#::hh::#_______#',
      '#::::::#_______#',
      '####:####_######',
      '#k___V____#H:lj#',
      '#__mmmm___#::::#',
      '#P__qQ____:::::#',
      '#_________#::::#',
      '#####X##########',
    ],
    entry: { x: 5, y: 10, dir: 'up' },
    exit: { scene: 'town', x: 5, y: 6, dir: 'down' },
    zones: [
      { nom: 'Cuisine',       x1: 1,  y1: 1, x2: 6,  y2: 6 },
      { nom: 'Chambre',       x1: 8,  y1: 1, x2: 14, y2: 6 },
      { nom: 'Salon',         x1: 1,  y1: 7, x2: 9,  y2: 10 },
      { nom: 'Salle de bain', x1: 10, y1: 7, x2: 14, y2: 10 },
    ],
  },

  school: {
    nom: 'École',
    floor: ';',
    wall: { face: '#d8e6c8', stripe: '#c4d4b0', top: '#4a5a48', base: '#7a8a6a' },
    map: [
      '####xxxxxx####',
      '#k;;;;MM;;;;P#',
      '#;;;;;;;;;;;;#',
      '#;e;e;;;;e;e;#',
      '#;;;;;;;;;;;;#',
      '#;e;e;;;;e;e;#',
      '#;;;;;;;;;;;;#',
      '#;e;e;;;;e;e;#',
      '#;;;;;;;;;;;;#',
      '#ZZZ;;;;;;;;a#',
      '#######X######',
    ],
    entry: { x: 7, y: 9, dir: 'up' },
    exit: { scene: 'town', x: 23, y: 6, dir: 'down' },
    zones: [{ nom: 'Salle de classe', x1: 0, y1: 0, x2: 13, y2: 10 }],
  },

  gym: {
    nom: 'Salle de sport',
    floor: '-',
    wall: { face: '#c8ccd6', stripe: '#b4b8c4', top: '#3a3e4a', base: '#5a5e6e' },
    map: [
      '##yyyyyyyyyy##',
      '#RRR--UU--I-a#',
      '#------------#',
      '#-N-N----ggg-#',
      '#--------ggg-#',
      '#------------#',
      '#I---------P-#',
      '#------------#',
      '#UU--------ZZ#',
      '#------------#',
      '######X#######',
    ],
    entry: { x: 6, y: 9, dir: 'up' },
    exit: { scene: 'town', x: 13, y: 17, dir: 'down' },
    zones: [],
  },
};

/* ==============================================================
   4) OUTILS DE DESSIN PIXEL
   ============================================================== */
const TS = 16;            // taille d'une case
let G = null;             // contexte de dessin courant
function R(c, x, y, w = 1, h = 1) { G.fillStyle = c; G.fillRect(x, y, w, h); }
function pat(rows, ox, oy, pal) {
  for (let r = 0; r < rows.length; r++)
    for (let c = 0; c < rows[r].length; c++) {
      const ch = rows[r][c];
      if (pal[ch]) R(pal[ch], ox + c, oy + r);
    }
}
function hash(a, b) {
  let h = Math.imul(a | 0, 73856093) ^ Math.imul(b | 0, 19349663);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}
function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  let rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  rgb = rgb.map(v => (f < 1 ? v * f : v + (255 - v) * (f - 1)));
  return '#' + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}
function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const has = (c, set) => !!c && set.includes(c);

/* ==============================================================
   5) LES CASES (TILES)
   ============================================================== */

/* ----- Extérieur ----- */
function grass(i) {
  R('#a3d873', 0, 0, 16, 16);
  const h = hash(i.x, i.y);
  for (let k = 0; k < 6; k++) {
    const v = hash(h, k);
    R(k < 4 ? '#8fca62' : '#c2ea98', v % 15, (v >>> 5) % 15, k < 4 ? 2 : 1, 1);
  }
}
const TUFT = ['d.....d', 'dd.d.dd', 'dldldld', '.dllld.', '..ddd..'];
function tallGrass(i) {
  grass(i);
  const pal = { d: '#3e8a35', l: '#72c250' };
  pat(TUFT, 0, 2, pal); pat(TUFT, 8, 2, pal); pat(TUFT, 1, 10, pal); pat(TUFT, 9, 10, pal);
}
function pathT(i) {
  R('#eae6c6', 0, 0, 16, 16);
  const h = hash(i.x, i.y);
  for (let k = 0; k < 7; k++) { const v = hash(h, k + 9); R('#c9c1a0', v % 16, (v >>> 6) % 16); }
}
function flowers(i) {
  grass(i);
  const fl = (x, y, c) => { R(c, x + 1, y); R(c, x, y + 1); R(c, x + 2, y + 1); R(c, x + 1, y + 2); R('#f8e060', x + 1, y + 1); };
  const alt = hash(i.x, i.y) % 2;
  fl(2, 2, '#e84a4a'); fl(10, 4, '#ffffff'); fl(4, 10, alt ? '#f070b0' : '#ffffff'); fl(11, 11, '#e84a4a');
}
function tree(i) {
  grass(i);
  R('#7ab456', 3, 14, 10, 2);
  const w = [3, 5, 6, 7, 7, 7, 7, 7, 6, 5, 3];
  for (let r = 0; r < 11; r++) R('#1f4a2a', 8 - w[r], r, w[r] * 2, 1);
  for (let r = 1; r < 10; r++) { const ww = w[r] - 1; R(r > 6 ? '#2e7038' : '#3c8a46', 8 - ww, r, ww * 2, 1); }
  R('#5cb05a', 5, 2, 3, 2); R('#5cb05a', 3, 4, 2, 2); R('#5cb05a', 9, 3, 2, 1); R('#5cb05a', 7, 5, 2, 1); R('#86d47a', 5, 2, 1, 1);
  R('#1f4a2a', 6, 10, 4, 5); R('#8a5a32', 7, 10, 2, 4); R('#6a4224', 8, 11, 1, 3);
}
function bush(i) {
  grass(i);
  R('#7ab456', 3, 14, 10, 2);
  const w = [4, 6, 7, 7, 7, 7, 7, 6, 4];
  for (let r = 0; r < 9; r++) R('#1f4a2a', 8 - w[r], r + 5, w[r] * 2, 1);
  for (let r = 1; r < 8; r++) { const ww = w[r] - 1; R('#3c8a46', 8 - ww, r + 5, ww * 2, 1); }
  R('#5cb05a', 4, 7, 3, 2); R('#5cb05a', 9, 7, 2, 1);
  R('#f070b0', 5, 10, 1, 1); R('#f070b0', 10, 9, 1, 1); R('#ffffff', 8, 11, 1, 1);
}
function fence(i) {
  grass(i);
  const isF = c => has(c, 'F4');
  const vert = (isF(i.at(0, -1)) || isF(i.at(0, 1))) && !(isF(i.at(-1, 0)) || isF(i.at(1, 0)));
  const d = '#5a3a1c', w = '#b07a40', l = '#d49a5a';
  if (vert) {
    R(d, 5, 0, 6, 16); R(w, 6, 0, 4, 16); R(l, 6, 0, 1, 16);
    R(d, 4, 5, 8, 5); R(w, 5, 6, 6, 3); R(l, 5, 6, 6, 1);
  } else {
    R(d, 0, 4, 16, 3); R(w, 0, 5, 16, 1);
    R(d, 0, 9, 16, 3); R(w, 0, 10, 16, 1);
    for (const x of [2, 10]) { R(d, x, 2, 4, 13); R(w, x + 1, 3, 2, 11); R(l, x + 1, 3, 1, 11); }
  }
}
function veg(i) {
  R('#8c5a34', 0, 0, 16, 16);
  R('#6e4426', 0, 7, 16, 1); R('#6e4426', 0, 15, 16, 1);
  for (const y of [0, 8]) for (const x of [1, 6, 11]) {
    R('#2f7a34', x, y + 2, 4, 3); R('#4caa3c', x + 1, y + 1, 2, 3); R('#78d060', x + 1, y + 1, 1, 1);
    if ((x + y) % 2) R('#e84040', x + 3, y + 4, 1, 1);
  }
}
function bench(i) {
  grass(i);
  const d = '#4a2e18', w = '#b07840', l = '#d8a060';
  R(d, 1, 2, 14, 4); R(w, 2, 3, 12, 2); R(l, 2, 3, 12, 1);
  R(d, 1, 7, 14, 5); R(w, 2, 8, 12, 3); R(l, 2, 8, 12, 1); R(d, 5, 8, 1, 3); R(d, 10, 8, 1, 3);
  R(d, 2, 12, 2, 3); R(d, 12, 12, 2, 3);
}
function pond(i) {
  R('#5aa8e0', 0, 0, 16, 16);
  const e = '#a6aea4', ed = '#6a746a', isP = c => c === 'p';
  if (!isP(i.at(0, -1))) { R(ed, 0, 0, 16, 3); R(e, 0, 0, 16, 2); }
  if (!isP(i.at(0, 1))) { R(ed, 0, 13, 16, 3); R(e, 0, 14, 16, 2); }
  if (!isP(i.at(-1, 0))) { R(ed, 0, 0, 3, 16); R(e, 0, 0, 2, 16); }
  if (!isP(i.at(1, 0))) { R(ed, 13, 0, 3, 16); R(e, 14, 0, 2, 16); }
  R('#a8d8f8', 4, 6, 4, 1); R('#a8d8f8', 8, 10, 3, 1);
  if (hash(i.x, i.y) % 2) { R('#f08030', 9, 6, 2, 1); R('#f8b070', 11, 6, 1, 1); }
}
function sign(i) {
  grass(i);
  const d = '#4a2e18';
  R(d, 7, 10, 2, 5); R(d, 1, 2, 14, 9); R('#d8a868', 2, 3, 12, 7); R('#b88848', 2, 9, 12, 1);
  R(d, 4, 5, 8, 1); R(d, 4, 7, 6, 1);
}
const ROOFS = { r: ['#c84444', '#922c2c', '#e87c6c'], u: ['#4a7acc', '#2e4e96', '#80a8ec'], o: ['#e48a3a', '#a85a1a', '#f6b678'] };
function roof(i) {
  const [b, d, l] = ROOFS[i.ch];
  R(b, 0, 0, 16, 16);
  for (let y = 3; y < 16; y += 4) {
    R(d, 0, y, 16, 1);
    R(l, 0, y - 3, 16, 1);
    const off = ((y >> 2) % 2) * 4;
    for (let x = off; x < 16; x += 8) R(d, x, y - 3, 1, 3);
  }
  if (i.at(0, -1) !== i.ch) { R(l, 0, 0, 16, 2); R(d, 0, 2, 16, 1); R('#3a2020', 0, 0, 16, 1); }
  if (i.at(0, 1) !== i.ch) { R(d, 0, 12, 16, 4); R('#3a2020', 0, 15, 16, 1); }
  if (i.at(-1, 0) !== i.ch) R('#3a2020', 0, 0, 1, 16);
  if (i.at(1, 0) !== i.ch) R('#3a2020', 15, 0, 1, 16);
}
function wallOut(i) {
  R('#f2ead2', 0, 0, 16, 16);
  R('#ddd0ae', 0, 5, 16, 1); R('#ddd0ae', 0, 10, 16, 1);
  R('#a89878', 0, 14, 16, 2);
  if (!has(i.at(-1, 0), 'WwDES')) R('#4a3a2a', 0, 0, 1, 16);
  if (!has(i.at(1, 0), 'WwDES')) R('#4a3a2a', 15, 0, 1, 16);
}
function windowT(i) {
  wallOut(i);
  R('#5a4030', 3, 2, 10, 9); R('#8ccaf0', 4, 3, 8, 7);
  R('#5a4030', 7, 3, 2, 7); R('#5a4030', 4, 6, 8, 1);
  R('#e2f4ff', 5, 4, 1, 1); R('#e2f4ff', 9, 4, 2, 1);
  R('#c4b48e', 2, 11, 12, 2);
}
function doorT(i, col) {
  wallOut(i);
  R('#3a2618', 3, 1, 10, 15); R(col, 4, 2, 8, 14);
  R(shade(col, 0.75), 5, 4, 6, 4); R(shade(col, 0.75), 5, 10, 6, 4);
  R('#f0d060', 10, 9, 1, 2);
  R('#b0a890', 2, 15, 12, 1);
}
function doorSchool(i) {
  wallOut(i);
  R('#3a2618', 2, 1, 12, 15); R('#8ccaf0', 3, 2, 10, 14); R('#3a2618', 7, 2, 2, 14);
  R('#e2f4ff', 4, 3, 1, 4); R('#e2f4ff', 10, 3, 1, 4);
  R('#c0c4cc', 5, 9, 1, 2); R('#c0c4cc', 10, 9, 1, 2);
  R('#b0a890', 1, 15, 14, 1);
}

/* ----- Intérieur : murs et sols ----- */
const isWallI = c => has(c, '#xy');
function wallFace(i) {
  const w = i.scene.wall;
  R(w.face, 0, 0, 16, 16);
  for (const x of [3, 7, 11, 15]) R(w.stripe, x, 3, 1, 10);
  R(w.top, 0, 0, 16, 3);
  R(w.base, 0, 13, 16, 3); R(shade(w.base, 0.7), 0, 15, 16, 1);
}
function wallTop(i) {
  const w = i.scene.wall;
  R(shade(w.top, 0.75), 0, 0, 16, 16); R(w.top, 1, 1, 14, 14);
}
function wallI(i) {
  const b = i.at(0, 1);
  if (b && !isWallI(b) && b !== 'X') wallFace(i); else wallTop(i);
}
function chalkboard(i) {
  wallFace(i);
  R('#6a4224', 0, 3, 16, 10); R('#2e5a3c', 0, 4, 16, 8);
  if (i.at(-1, 0) !== 'x') R('#6a4224', 0, 3, 2, 10);
  if (i.at(1, 0) !== 'x') R('#6a4224', 14, 3, 2, 10);
  const h = hash(i.x, 7) % 4;
  R('#e8f0e8', 3, 6, 4 + h, 1); R('#e8f0e8', 3, 8, 9 - h, 1);
  if (h === 2) R('#f0e080', 10, 5, 2, 2);
  R('#a07850', 0, 12, 16, 1); R('#ffffff', 5, 11, 2, 1);
}
function mirror(i) {
  wallFace(i);
  R('#8a96a8', 0, 2, 16, 11); R('#cfe6f4', 0, 3, 16, 9);
  if (i.at(-1, 0) !== 'y') R('#8a96a8', 0, 2, 2, 11);
  if (i.at(1, 0) !== 'y') R('#8a96a8', 14, 2, 2, 11);
  const s = i.x % 3;
  R('#ffffff', 4 + s, 4, 2, 1); R('#ffffff', 3 + s, 5, 2, 1); R('#ffffff', 2 + s, 6, 2, 1);
}
function wood(i) {
  R('#dcae70', 0, 0, 16, 16);
  for (const y of [3, 7, 11, 15]) R('#c09050', 0, y, 16, 1);
  const s = (i.x * 7 + i.y * 3) % 4;
  R('#c09050', (s * 4 + 2) % 16, 0, 1, 3); R('#c09050', (s * 4 + 9) % 16, 4, 1, 3);
  R('#c09050', (s * 4 + 5) % 16, 8, 1, 3); R('#c09050', (s * 4 + 13) % 16, 12, 1, 3);
}
function tilesF() {
  R('#eef1f7', 0, 0, 16, 16); R('#cdd6e6', 8, 0, 8, 8); R('#cdd6e6', 0, 8, 8, 8);
}
function schoolFloor() {
  R('#d4ddb9', 0, 0, 16, 16); R('#bcc79e', 0, 0, 16, 1); R('#bcc79e', 0, 0, 1, 16);
}
function gymFloor(i) {
  R('#6e7686', 0, 0, 16, 16);
  const h = hash(i.x, i.y);
  for (let k = 0; k < 8; k++) { const v = hash(h, k); R(k % 2 ? '#5c6474' : '#828a9a', v % 16, (v >>> 5) % 16); }
}
function bordered(i, ch, base, border, inner) {
  R(base, 0, 0, 16, 16);
  if (i.at(0, -1) !== ch) R(border, 0, 0, 16, 2);
  if (i.at(0, 1) !== ch) R(border, 0, 14, 16, 2);
  if (i.at(-1, 0) !== ch) R(border, 0, 0, 2, 16);
  if (i.at(1, 0) !== ch) R(border, 14, 0, 2, 16);
  if (inner) inner();
}
function rug(i) { bordered(i, 'm', '#c0584a', '#f0c870', () => { R('#9a3c32', 7, 5, 2, 6); R('#9a3c32', 5, 7, 6, 2); }); }
function gymMat(i) { bordered(i, 'g', '#4a6cc0', '#2a3e7a', () => R('#5a7cd0', 3, 3, 10, 1)); }
function exitMat(i) {
  T[i.scene.floor].draw(i);
  R('#7a2424', 1, 1, 14, 14); R('#c84848', 2, 2, 12, 12); R('#e07060', 2, 2, 12, 1);
  R('#fbe0d0', 7, 4, 2, 5); R('#fbe0d0', 5, 8, 6, 1); R('#fbe0d0', 6, 9, 4, 1); R('#fbe0d0', 7, 10, 2, 1);
}

/* ----- Meubles ----- */
const KITCHEN = 'KCOL';
function sideEdges(i, set, dark, y, h) {
  if (!has(i.at(-1, 0), set)) R(dark, 0, y, 1, h);
  if (!has(i.at(1, 0), set)) R(dark, 15, y, 1, h);
}
function fridge() {
  R('#3a3a48', 1, 0, 14, 16); R('#f4f6fa', 2, 1, 12, 14);
  R('#c8ccd8', 2, 6, 12, 1); R('#dde1ea', 12, 1, 2, 14);
  R('#8a92a4', 3, 3, 1, 2); R('#8a92a4', 3, 8, 1, 4);
  R('#e05050', 6, 2, 2, 2); R('#50a0e0', 9, 3, 2, 2);
}
function counter(i) {
  R('#4a3020', 0, 1, 16, 15);
  R('#ece0c4', 0, 1, 16, 5); R('#d4c4a0', 0, 5, 16, 1);
  R('#b07840', 1, 6, 14, 9); R('#7a4a24', 7, 6, 1, 9); R('#7a4a24', 8, 6, 1, 9);
  R('#f0d060', 5, 9, 1, 1); R('#f0d060', 10, 9, 1, 1);
  sideEdges(i, KITCHEN, '#4a3020', 1, 15);
}
function stove(i) {
  counter(i);
  R('#3a3a48', 1, 1, 14, 6); R('#5a5e6a', 2, 1, 12, 5);
  R('#202028', 3, 2, 4, 3); R('#e05030', 4, 3, 2, 1); R('#202028', 9, 2, 4, 3);
  R('#3a3a48', 1, 6, 14, 9); R('#c8ccd6', 2, 7, 12, 7); R('#303038', 4, 9, 8, 3); R('#5a6070', 5, 10, 3, 1);
}
function sink(i) {
  counter(i);
  R('#6a7a90', 3, 1, 10, 5); R('#b8d0e8', 4, 2, 8, 3); R('#a0a8b8', 7, 0, 2, 2);
}
function table(i) {
  const d = '#5a3a1c';
  R(d, 0, 2, 16, 10); R('#c08850', 0, 3, 16, 7); R('#a06a38', 0, 10, 16, 1);
  if (i.at(-1, 0) !== 'A') { R(d, 0, 2, 1, 10); R(d, 1, 11, 2, 4); }
  if (i.at(1, 0) !== 'A') { R(d, 15, 2, 1, 10); R(d, 13, 11, 2, 4); }
  R('#ffffff', 5, 4, 6, 4); R('#e0e0e8', 6, 5, 4, 2); R('#e05030', 7, 5, 2, 1);
}
function chair() {
  R('#4a2e18', 4, 3, 8, 11); R('#c08850', 5, 4, 6, 9); R('#a06a38', 5, 4, 6, 2);
}
function sofa(i) {
  const d = '#203060', b = '#4a6cc0', l = '#7a9ae0';
  R(d, 0, 2, 16, 13);
  if (i.ch === 'q') {
    R(b, 1, 3, 3, 11); R(l, 4, 3, 12, 7); R(b, 4, 10, 12, 4); R(d, 0, 2, 1, 13);
  } else {
    R(b, 12, 3, 3, 11); R(l, 0, 3, 12, 7); R(b, 0, 10, 12, 4); R(d, 0, 3, 1, 7); R(d, 15, 2, 1, 13);
  }
  R('#9ab4f0', i.ch === 'q' ? 5 : 1, 4, 4, 1);
}
function tv() {
  R('#4a2e18', 1, 10, 14, 5); R('#a06838', 2, 11, 12, 3); R('#f0d060', 7, 12, 2, 1);
  R('#202028', 2, 1, 12, 9); R('#3c5a78', 3, 2, 10, 7); R('#7aa0c8', 4, 3, 3, 1); R('#7aa0c8', 4, 4, 1, 1);
}
function bedTop() {
  R('#4a2e18', 1, 0, 14, 16); R('#a06838', 2, 1, 12, 2);
  R('#f4f4f8', 2, 4, 12, 12); R('#c8c8d8', 4, 8, 8, 1); R('#ffffff', 4, 5, 8, 3);
  R('#5878d0', 2, 11, 12, 5); R('#9ab0f0', 2, 11, 12, 1);
}
function bedBottom() {
  R('#4a2e18', 1, 0, 14, 16);
  R('#5878d0', 2, 0, 12, 12); R('#4a66b8', 2, 5, 12, 1); R('#4a66b8', 2, 9, 12, 1);
  R('#a06838', 2, 13, 12, 2);
}
function wardrobe() {
  R('#4a2e18', 1, 0, 14, 16); R('#b07a48', 2, 1, 12, 14); R('#d09a68', 2, 1, 12, 1);
  R('#7a4e28', 8, 2, 1, 13); R('#f0d060', 6, 7, 1, 2); R('#f0d060', 10, 7, 1, 2);
}
function nightstand() {
  R('#4a2e18', 2, 6, 12, 9); R('#b07a48', 3, 7, 10, 7); R('#7a4e28', 3, 10, 10, 1); R('#f0d060', 7, 11, 2, 1);
  R('#4a2e18', 4, 0, 8, 6); R('#f6e08a', 5, 1, 6, 3); R('#5a3a1c', 7, 4, 2, 2);
}
function bookshelf() {
  R('#4a2e18', 0, 0, 16, 16); R('#a06838', 1, 1, 14, 14);
  const cols = ['#d04040', '#3a6cc0', '#3f9f5f', '#f0c030', '#8050c0', '#e08030'];
  for (const [y, h] of [[1, 4], [6, 4], [11, 4]]) {
    R('#6a4224', 1, y + h, 14, 1);
    for (let x = 2, k = y; x < 14; x += 2, k++) R(cols[k % cols.length], x, y + (k % 2), 2, h - (k % 2));
  }
}
function plant() {
  R('#5a2e18', 4, 10, 8, 6); R('#c8683a', 5, 11, 6, 4); R('#e08850', 4, 9, 8, 2);
  R('#1f4a2a', 2, 1, 12, 9);
  R('#4caa4c', 3, 3, 4, 5); R('#4caa4c', 9, 3, 4, 5); R('#4caa4c', 6, 2, 4, 7);
  R('#7ad070', 4, 4, 1, 2); R('#7ad070', 7, 3, 1, 2); R('#7ad070', 11, 4, 1, 1);
}
function shower() {
  R('#5a6a80', 0, 0, 16, 16); R('#d8eef8', 1, 1, 14, 14);
  R('#b8d8ea', 1, 8, 14, 1); R('#b8d8ea', 8, 1, 1, 14);
  R('#5a6a80', 7, 7, 2, 2); R('#a0a8b8', 6, 1, 4, 2); R('#7ac0f0', 7, 3, 1, 2); R('#7ac0f0', 9, 4, 1, 2);
}
function washbasin() {
  R('#3a3a48', 2, 1, 12, 9); R('#ffffff', 3, 2, 10, 7); R('#c8e0f0', 5, 3, 6, 4);
  R('#a0a8b8', 7, 1, 2, 2);
  R('#3a3a48', 6, 10, 4, 5); R('#f0f0f4', 7, 10, 2, 4);
}
function toilet() {
  R('#3a3a48', 3, 0, 10, 5); R('#ffffff', 4, 1, 8, 3);
  R('#3a3a48', 3, 5, 10, 10); R('#ffffff', 4, 5, 8, 9); R('#c8e0f0', 6, 7, 4, 5);
}
function studentDesk() {
  R('#5a3a1c', 1, 1, 14, 8); R('#d0a060', 2, 2, 12, 5); R('#a06838', 2, 7, 12, 1);
  R('#ffffff', 4, 3, 5, 3); R('#a0a0a8', 5, 4, 3, 1); R('#f0c030', 10, 4, 3, 1);
  R('#2a4a2a', 4, 10, 8, 5); R('#5aa05a', 5, 10, 6, 3); R('#3a7a3a', 5, 13, 6, 1);
}
function teacherDesk(i) {
  const d = '#4a2e18';
  R(d, 0, 2, 16, 12); R('#b07a48', 0, 3, 16, 8); R('#8a5a32', 0, 11, 16, 2);
  if (i.at(-1, 0) !== 'M') R(d, 0, 2, 1, 12);
  if (i.at(1, 0) !== 'M') R(d, 15, 2, 1, 12);
  if (i.at(1, 0) === 'M') { R('#ffffff', 3, 4, 6, 5); R('#e0e0e8', 4, 5, 4, 1); R('#e0e0e8', 4, 7, 3, 1); }
  else { R('#e03838', 9, 5, 3, 3); R('#4caa4c', 10, 4, 1, 1); R('#3a6cc0', 3, 5, 4, 3); }
}
function lockers() {
  R('#2e3a50', 0, 0, 16, 16); R('#6a88b0', 1, 1, 14, 14); R('#2e3a50', 8, 1, 1, 14);
  for (const x of [2, 10]) { R('#4a6488', x, 3, 4, 1); R('#4a6488', x, 5, 4, 1); R('#4a6488', x, 7, 4, 1); }
  R('#d0d8e0', 6, 9, 1, 2); R('#d0d8e0', 13, 9, 1, 2);
}
function fountain() {
  R('#3a3a48', 3, 5, 10, 10); R('#f0f4f8', 4, 6, 8, 8); R('#a0a8b8', 7, 9, 2, 1);
  R('#2e4e80', 4, 0, 8, 6); R('#7ac0f0', 5, 1, 6, 4); R('#c0e4fa', 6, 1, 1, 3);
}
function treadmill() {
  R('#2a2a30', 2, 0, 12, 16); R('#3e3e46', 4, 4, 8, 11);
  for (let y = 6; y < 15; y += 3) R('#55555e', 4, y, 8, 1);
  R('#5a6070', 2, 0, 12, 4); R('#5adc8a', 6, 1, 4, 2);
  R('#a0a8b8', 2, 3, 1, 12); R('#a0a8b8', 13, 3, 1, 12);
}
function benchPress() {
  R('#3a1a1a', 5, 2, 6, 13); R('#b03030', 6, 3, 4, 11); R('#d05050', 6, 3, 4, 1);
  R('#5a6070', 3, 2, 1, 4); R('#5a6070', 12, 2, 1, 4);
  R('#a0a8b8', 0, 4, 16, 1);
  R('#202028', 0, 2, 2, 5); R('#202028', 14, 2, 2, 5);
}
function dumbbells() {
  R('#3a3e48', 0, 3, 16, 12); R('#6a7080', 1, 4, 14, 10); R('#3a3e48', 1, 9, 14, 1);
  for (const y of [5, 10]) for (let x = 2; x < 14; x += 5) {
    R('#202028', x, y, 1, 3); R('#a0a8b8', x + 1, y + 1, 2, 1); R('#202028', x + 3, y, 1, 3);
  }
}
function punchingBag() {
  R('#a0a8b8', 7, 0, 2, 3);
  R('#4a1010', 4, 3, 8, 12); R('#c83030', 5, 3, 6, 11); R('#e86060', 6, 5, 1, 6);
  R('#202028', 4, 6, 8, 1); R('#202028', 4, 12, 8, 1);
}

/* ----- Dictionnaire des cases ----- */
const T = {};
function tile(chars, o) { for (const c of chars) T[c] = Object.assign({ solid: true }, o); }
const FURN = { furniture: true };

// Extérieur
tile('.', { solid: false, draw: grass });
tile(',', { solid: false, draw: tallGrass });
tile('=', { solid: false, draw: pathT });
tile('*', { solid: false, draw: flowers });
tile('T', { draw: tree });
tile('Y', { draw: bush, msg: ['Un buisson bien taillé.'] });
tile('F', { draw: fence });
tile('v', { draw: veg, msg: ['Des tomates et des salades poussent ici.', '{n} arrose le potager.'] });
tile('B', { draw: bench, msg: ['{n} s\'assoit sur le banc et profite du soleil.'] });
tile('p', { draw: pond, msg: ['Un petit bassin… On voit des poissons rouges !'] });
tile('1', { draw: sign, msg: ['Panneau : « MAISON »'] });
tile('2', { draw: sign, msg: ['Panneau : « ÉCOLE »'] });
tile('3', { draw: sign, msg: ['Panneau : « SALLE DE SPORT »'] });
tile('4', { draw: sign, msg: ['Panneau : « JARDIN »'] });
tile('ruo', { draw: roof });
tile('W', { draw: wallOut });
tile('w', { draw: windowT });
tile('D', { solid: false, door: 'house', draw: i => doorT(i, '#9a6234') });
tile('E', { solid: false, door: 'school', draw: doorSchool });
tile('S', { solid: false, door: 'gym', draw: i => doorT(i, '#c03838') });

// Intérieur — murs / sols
tile('#', { draw: wallI });
tile('x', { draw: chalkboard, msg: ['Au tableau : « Contrôle de maths demain ! »', 'Au tableau : « Lire le chapitre 3 pour lundi. »'] });
tile('y', { draw: mirror, msg: ['{n} se regarde dans le miroir. Pas mal !'] });
tile('_', { solid: false, draw: wood });
tile(':', { solid: false, draw: tilesF });
tile(';', { solid: false, draw: schoolFloor });
tile('-', { solid: false, draw: gymFloor });
tile('m', { solid: false, draw: rug });
tile('g', { solid: false, draw: gymMat });
tile('X', { solid: false, door: 'exit', draw: exitMat });

// Maison
tile('K', { ...FURN, under: ':', draw: fridge, msg: ['{n} ouvre le frigo… Il y a du fromage et des yaourts.', 'Le frigo ronronne doucement.'] });
tile('C', { ...FURN, under: ':', draw: counter, msg: ['Le plan de travail est tout propre.'] });
tile('O', { ...FURN, under: ':', draw: stove, msg: ['{n} se prépare un petit plat. Ça sent bon !'] });
tile('L', { ...FURN, under: ':', draw: sink, msg: ['{n} fait la vaisselle. Quelle corvée !'] });
tile('A', { ...FURN, under: ':', draw: table, msg: ['Une table pour manger tranquille.'] });
tile('h', { ...FURN, under: ':', draw: chair, msg: ['Une chaise.'] });
tile('qQ', { ...FURN, draw: sofa, msg: ['{n} se pose dans le canapé. Trop confortable !'] });
tile('V', { ...FURN, draw: tv, msg: ['{n} allume la télé. C\'est l\'heure des infos.', 'Un match de foot passe à la télé !'] });
tile('b', { ...FURN, draw: bedTop, msg: ['{n} fait une petite sieste… Zzz…'] });
tile('n', { ...FURN, draw: bedBottom, msg: ['{n} fait une petite sieste… Zzz…'] });
tile('z', { ...FURN, draw: wardrobe, msg: ['L\'armoire est pleine de vêtements.'] });
tile('i', { ...FURN, draw: nightstand, msg: ['Une lampe de chevet.'] });
tile('k', { ...FURN, draw: bookshelf, msg: ['Plein de livres… {n} en feuillette un.'] });
tile('P', { ...FURN, draw: plant, msg: ['Une jolie plante verte.'] });
tile('H', { ...FURN, under: ':', draw: shower, msg: ['{n} prend une douche bien chaude.'] });
tile('l', { ...FURN, under: ':', draw: washbasin, msg: ['{n} se lave les mains.'] });
tile('j', { ...FURN, under: ':', draw: toilet, msg: ['Les toilettes. Rien à signaler !'] });
// École
tile('e', { ...FURN, draw: studentDesk, msg: ['{n} s\'assoit et révise ses cours.'] });
tile('M', { ...FURN, draw: teacherDesk, msg: ['Le bureau du prof. Mieux vaut ne pas y toucher…'] });
tile('Z', { ...FURN, draw: lockers, msg: ['Des casiers. Ils sont fermés à clé.'] });
tile('a', { ...FURN, draw: fountain, msg: ['{n} boit un peu d\'eau. Ça fait du bien !'] });
// Salle de sport
tile('R', { ...FURN, draw: treadmill, msg: ['{n} court sur le tapis. Allez, encore 5 minutes !'] });
tile('N', { ...FURN, draw: benchPress, msg: ['{n} fait du développé couché. Ça brûle !'] });
tile('U', { ...FURN, draw: dumbbells, msg: ['{n} soulève des haltères. Les muscles travaillent !'] });
tile('I', { ...FURN, draw: punchingBag, msg: ['{n} tape dans le sac de frappe. Bam ! Bam !'] });

const DOORS = { D: 'house', E: 'school', S: 'gym' };

/* Pré-rendu de chaque carte dans une image */
function drawTileAt(g, sc, ch, x, y, ox, oy) {
  const d = T[ch];
  if (!d) return;
  const info = { x, y, ch, scene: sc, at: (dx, dy) => { const r = sc.map[y + dy]; return r ? r[x + dx] : undefined; } };
  g.save(); g.translate(ox, oy); G = g;
  if (d.furniture) T[d.under || sc.floor].draw({ ...info, ch: d.under || sc.floor });
  d.draw(info);
  g.restore();
}
function renderScene(id) {
  const sc = SCENES[id];
  sc.H = sc.map.length; sc.W = sc.map[0].length;
  sc.map.forEach((row, y) => { if (row.length !== sc.W) console.warn(`Carte ${id} : ligne ${y} de longueur ${row.length} (attendu ${sc.W})`); });
  const c = makeCanvas(sc.W * TS, sc.H * TS), g = c.getContext('2d');
  for (let y = 0; y < sc.H; y++) for (let x = 0; x < sc.W; x++) drawTileAt(g, sc, sc.map[y][x], x, y, x * TS, y * TS);
  sc.canvas = c;
}

/* ==============================================================
   6) SPRITES DES PERSONNAGES (16x20, contour auto)
   ============================================================== */
const OUTLINE = [34, 32, 42];
function drawHair(p, dir, o) {
  const L = p.look, H = L.cheveux, HS = L.cheveuxOmbre, HL = L.cheveuxClair;
  if (L.coiffure === 'milong') {
    if (dir === 'down') {
      R(H, 4, 2 + o, 8, 1); R(H, 3, 3 + o, 10, 2);
      R(H, 3, 5 + o, 4, 1); R(H, 10, 5 + o, 3, 1);
      R(H, 2, 4 + o, 2, 6); R(H, 12, 4 + o, 2, 6);
      R(HS, 2, 9 + o, 2, 1); R(HS, 12, 9 + o, 2, 1);
      R(HL, 5, 3 + o, 3, 1);
    } else if (dir === 'up') {
      R(H, 4, 2 + o, 8, 1); R(H, 3, 3 + o, 10, 7);
      R(H, 2, 4 + o, 2, 6); R(H, 12, 4 + o, 2, 6);
      R(HS, 2, 9 + o, 12, 1); R(HL, 5, 3 + o, 4, 1); R(HL, 9, 5 + o, 1, 2);
    } else {
      R(H, 4, 2 + o, 8, 1); R(H, 3, 3 + o, 10, 2);
      R(H, 3, 5 + o, 2, 1);
      R(H, 8, 5 + o, 5, 5); R(H, 13, 4 + o, 1, 5);
      R(HS, 8, 9 + o, 5, 1);
      R(L.peau, 8, 7 + o, 1, 2);
      R(HL, 5, 3 + o, 3, 1);
    }
  } else {
    if (dir === 'down') {
      R(H, 4, 2 + o, 8, 1); R(H, 3, 3 + o, 10, 2);
      R(H, 3, 5 + o, 4, 1); R(H, 9, 5 + o, 4, 1);
      R(H, 2, 4 + o, 2, 9); R(H, 12, 4 + o, 2, 9);
      R(HL, 5, 3 + o, 2, 1); R(HL, 10, 4 + o, 1, 1);
      R(HL, 2, 7 + o, 1, 4); R(HL, 13, 7 + o, 1, 4);
      R(HS, 2, 12 + o, 2, 1); R(HS, 12, 12 + o, 2, 1);
    } else if (dir === 'up') {
      R(H, 4, 2 + o, 8, 1); R(H, 3, 3 + o, 10, 10);
      R(H, 2, 4 + o, 2, 9); R(H, 12, 4 + o, 2, 9);
      R(HL, 5, 4 + o, 1, 7); R(HL, 9, 5 + o, 1, 6); R(HL, 7, 3 + o, 2, 1);
      R(HS, 3, 12 + o, 10, 1);
    } else {
      R(H, 4, 2 + o, 8, 1); R(H, 3, 3 + o, 10, 2);
      R(H, 3, 5 + o, 3, 1);
      R(H, 7, 5 + o, 6, 8); R(H, 13, 5 + o, 1, 7);
      R(HL, 9, 6 + o, 1, 6); R(HL, 11, 8 + o, 1, 4); R(HL, 5, 3 + o, 2, 1);
      R(HS, 7, 12 + o, 6, 1);
    }
  }
  if (L.barbe) {
    if (dir === 'down') { R(HS, 6, 9 + o, 4, 1); R(HS, 7, 10 + o, 2, 1); }
    else if (dir === 'left') { R(HS, 3, 9 + o, 3, 1); R(HS, 4, 10 + o, 2, 1); }
  }
}
function drawPerso(p, dir, f) {
  const L = p.look, Tn = p.tenue, o = L.grand ? -1 : 0;
  const skin = L.peau, top = Tn.haut, topS = shade(Tn.haut, 0.72);
  const bot = Tn.bas, botS = shade(Tn.bas, 0.72), shoe = Tn.chaussures;
  const lt = 15 + o, legH = 18 - lt;
  if (dir !== 'left') {
    R(top, 4, 11 + o, 8, 3); R(topS, 4, 13 + o, 8, 1);
    R(top, 3, 11 + o, 1, 2); R(top, 12, 11 + o, 1, 2); R(skin, 3, 13 + o); R(skin, 12, 13 + o);
    if (dir === 'down') R(skin, 7, 11 + o, 2, 1);
    R(bot, 4, 14 + o, 8, 1);
    const hl = f === 1 ? legH - 1 : legH, hr = f === 2 ? legH - 1 : legH;
    R(bot, 4, lt, 3, hl); R(botS, 6, lt, 1, hl); R(shoe, 4, lt + hl, 3, 1);
    R(bot, 9, lt, 3, hr); R(botS, 11, lt, 1, hr); R(shoe, 9, lt + hr, 3, 1);
    R(skin, 4, 3 + o, 8, 8); R(skin, 3, 4 + o, 10, 6);
    if (dir === 'down') {
      R(L.yeux, 6, 6 + o, 1, 2); R(L.yeux, 9, 6 + o, 1, 2);
      if (!L.barbe) R('#d97c7c', 7, 9 + o, 2, 1);
    }
  } else {
    R(top, 5, 11 + o, 6, 3); R(topS, 5, 13 + o, 6, 1); R(bot, 5, 14 + o, 6, 1);
    if (f === 0) { R(bot, 6, lt, 4, legH); R(botS, 9, lt, 1, legH); R(shoe, 5, 18, 5, 1); }
    else { R(bot, 4, lt, 3, legH); R(bot, 9, lt, 3, legH); R(botS, 11, lt, 1, legH); R(shoe, 3, 18, 4, 1); R(shoe, 9, 18, 3, 1); }
    const ax = f === 0 ? 7 : (f === 1 ? 5 : 9);
    R(topS, ax, 11 + o, 2, 2); R(skin, ax, 13 + o, 2, 1);
    R(skin, 4, 3 + o, 8, 8); R(skin, 3, 4 + o, 10, 6);
    R(L.yeux, 5, 6 + o, 1, 2);
    if (!L.barbe) R('#d97c7c', 4, 9 + o, 1, 1);
  }
  drawHair(p, dir, o);
}
function addOutline(c) {
  const g = c.getContext('2d'), w = c.width, h = c.height;
  const img = g.getImageData(0, 0, w, h), d = img.data, src = new Uint8ClampedArray(d);
  const filled = (x, y) => x >= 0 && y >= 0 && x < w && y < h && src[(y * w + x) * 4 + 3] > 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = (y * w + x) * 4;
    if (src[k + 3]) continue;
    if (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1)) {
      d[k] = OUTLINE[0]; d[k + 1] = OUTLINE[1]; d[k + 2] = OUTLINE[2]; d[k + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
}
const SPRITES = {};
function buildSprites(id) {
  const p = PERSOS[id], s = {};
  for (const dir of ['down', 'up', 'left']) {
    s[dir] = [0, 1, 2].map(f => {
      const c = makeCanvas(16, 20); G = c.getContext('2d');
      drawPerso(p, dir, f); addOutline(c); return c;
    });
  }
  s.right = s.left.map(c => {
    const m = makeCanvas(16, 20), g = m.getContext('2d');
    g.translate(16, 0); g.scale(-1, 1); g.drawImage(c, 0, 0); return m;
  });
  SPRITES[id] = s;
}
function paintSprite(canvas, id, dir = 'down', f = 0) {
  const g = canvas.getContext('2d');
  g.clearRect(0, 0, canvas.width, canvas.height);
  g.imageSmoothingEnabled = false;
  g.drawImage(SPRITES[id][dir][f], 0, 0);
}

/* ==============================================================
   7) MOTEUR DU JEU
   ============================================================== */
const STEP_TIME = 0.2;        // secondes pour traverser une case
const DIRV = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const SAVE_KEY = 'projetSims_v1';

const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
let S = 3, cam = { x: 0, y: 0 }, cur = null, running = false, busy = false, marker = null;

const st = id => PERSOS[id].state;
const me = () => PERSOS[cur];
const actor = () => st(cur);

function tileChar(scId, x, y) { const r = SCENES[scId].map[y]; return r ? r[x] : undefined; }
function tileDef(scId, x, y) { const c = tileChar(scId, x, y); return c ? T[c] : null; }
function otherAt(scId, x, y) {
  for (const id in PERSOS) {
    if (id === cur) continue;
    const s = st(id);
    if (s.scene === scId && s.x === x && s.y === y) return PERSOS[id];
  }
  return null;
}
function walkable(scId, x, y) { const d = tileDef(scId, x, y); return !!d && !d.solid && !d.door; }
function findChar(scId, ch) {
  const m = SCENES[scId].map;
  for (let y = 0; y < m.length; y++) { const x = m[y].indexOf(ch); if (x >= 0) return [x, y]; }
  return null;
}

/* Recherche de chemin (BFS). Les portes ne sont traversables que si c'est la destination. */
function findPath(scId, sx, sy, goals) {
  const sc = SCENES[scId], W = sc.W, H = sc.H;
  const isGoal = (x, y) => goals.some(g => g[0] === x && g[1] === y);
  if (isGoal(sx, sy)) return [];
  const prev = new Int32Array(W * H).fill(-1), seen = new Uint8Array(W * H);
  const q = [sy * W + sx]; seen[sy * W + sx] = 1;
  for (let qi = 0; qi < q.length; qi++) {
    const k = q[qi], x = k % W, y = (k / W) | 0;
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const nk = ny * W + nx;
      if (seen[nk]) continue;
      const goal = isGoal(nx, ny), d = tileDef(scId, nx, ny);
      if (!d || d.solid || (d.door && !goal)) continue;
      seen[nk] = 1; prev[nk] = k;
      if (goal) {
        const path = []; let c = nk;
        while (c !== sy * W + sx) { path.unshift([c % W, (c / W) | 0]); c = prev[c]; }
        return path;
      }
      q.push(nk);
    }
  }
  return null;
}
function nearestFree(scId, x, y, selfId) {
  const free = (a, b) => walkable(scId, a, b) && !Object.keys(PERSOS).some(id => id !== selfId && st(id).scene === scId && st(id).x === a && st(id).y === b);
  if (free(x, y)) return [x, y];
  const sc = SCENES[scId], seen = new Set([x + ',' + y]), q = [[x, y]];
  while (q.length) {
    const [cx, cy] = q.shift();
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = cx + dx, ny = cy + dy, key = nx + ',' + ny;
      if (seen.has(key) || nx < 0 || ny < 0 || nx >= sc.W || ny >= sc.H) continue;
      seen.add(key);
      if (free(nx, ny)) return [nx, ny];
      const d = tileDef(scId, nx, ny);
      if (d && !d.solid) q.push([nx, ny]);
    }
  }
  return [x, y];
}

/* ---------- Sauvegarde (dans le navigateur) ---------- */
function loadSave() {
  let s = {};
  try { s = JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch (e) { s = {}; }
  for (const id in PERSOS) {
    const p = PERSOS[id], d = s[id] || {};
    if (d.tenue) Object.assign(p.tenue, d.tenue);
    const ok = d.scene && SCENES[d.scene] && walkable(d.scene, d.x, d.y);
    const pos = ok ? d : p.depart;
    p.state = {
      id, scene: pos.scene, x: pos.x, y: pos.y, dir: pos.dir || 'down',
      moving: false, fromX: pos.x, fromY: pos.y, t: 0, steps: 0, path: [], action: null, goal: null,
    };
  }
}
function writeSave() {
  const s = {};
  for (const id in PERSOS) {
    const a = st(id);
    s[id] = { scene: a.scene, x: a.x, y: a.y, dir: a.dir, tenue: PERSOS[id].tenue };
  }
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); } catch (e) { /* stockage indisponible */ }
  if (cur) netPush(cur);
}

/* ---------- Déplacements ---------- */
function startMove(a, [nx, ny]) {
  const dx = nx - a.x, dy = ny - a.y;
  a.dir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
  a.fromX = a.x; a.fromY = a.y; a.x = nx; a.y = ny;
  a.moving = true; a.t = 0; a.steps++;
  if (a.id === cur) netPush(a.id);
}
function arrive(a) {
  const d = tileDef(a.scene, a.x, a.y);
  if (d && d.door) { useDoor(a, d); return; }
  writeSave();
  if (!a.path.length) {
    if (marker && marker.x === a.x && marker.y === a.y) marker = null;
    if (!a.action && a.goal) planGoal(a);
  }
}
function useDoor(a, d) {
  const to = d.door === 'exit' ? SCENES[a.scene].exit : { scene: d.door, ...SCENES[d.door].entry };
  a.path = []; a.action = null; marker = null; busy = true;
  el.fade.style.opacity = '1';
  setTimeout(() => {
    const [x, y] = nearestFree(to.scene, to.x, to.y, a.id);
    Object.assign(a, { scene: to.scene, x, y, fromX: x, fromY: y, dir: to.dir, moving: false, t: 0 });
    writeSave();
    updateHud();
    el.fade.style.opacity = '0';
    setTimeout(() => { busy = false; if (a.goal) planGoal(a); }, 200);
  }, 220);
}
function planGoal(a) {
  const g = a.goal;
  if (!g) return;
  let target;
  if (a.scene === g.scene) {
    const [gx, gy] = nearestFree(g.scene, g.x, g.y, a.id);
    if (a.x === gx && a.y === gy) {
      a.goal = null;
      toast(`${me().nom} est arrivé${me().fem ? 'e' : ''} : ${g.label}`);
      return;
    }
    target = [gx, gy];
  } else if (a.scene !== 'town') {
    target = findChar(a.scene, 'X');
  } else {
    const ch = Object.keys(DOORS).find(k => DOORS[k] === g.scene);
    target = findChar('town', ch);
  }
  const p = target && findPath(a.scene, a.x, a.y, [target]);
  if (!p) { a.goal = null; toast('Impossible d\'y aller !'); return; }
  a.path = p;
}
function goTo(dest) {
  const a = actor();
  a.goal = { ...dest }; a.action = null; a.path = []; marker = null;
  if (!a.moving && !busy) planGoal(a);
}

/* ---------- Interactions ---------- */
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function interactTile(tx, ty) {
  const a = actor();
  const goals = [[0, -1], [1, 0], [0, 1], [-1, 0]].map(([dx, dy]) => [tx + dx, ty + dy]).filter(([x, y]) => walkable(a.scene, x, y) && !otherAt(a.scene, x, y));
  const path = findPath(a.scene, a.x, a.y, goals);
  if (!path) { toast('Impossible d\'y aller !'); return; }
  a.path = path; a.action = { tx, ty };
}
function doAction(a) {
  const { tx, ty } = a.action; a.action = null;
  const dx = tx - a.x, dy = ty - a.y;
  if (Math.abs(dx) + Math.abs(dy) !== 1) return;
  a.dir = dx > 0 ? 'right' : dx < 0 ? 'left' : dy > 0 ? 'down' : 'up';
  const o = otherAt(a.scene, tx, ty);
  if (o) {
    if (NET.online[o.id]) say(`C'est ${o.nom} ! ${o.fem ? 'Elle' : 'Il'} est en ligne en ce moment.`);
    else say(`C'est ${o.nom} ! ${o.fem ? 'Elle' : 'Il'} attend sans bouger.\n(${o.fem ? 'Elle' : 'Il'} n'est pas connecté${o.fem ? 'e' : ''}.)`);
    return;
  }
  const d = tileDef(a.scene, tx, ty);
  if (d && d.msg) say(pick(d.msg).replace(/\{n\}/g, me().nom));
}
function onTap(tx, ty) {
  const a = actor();
  const d = tileDef(a.scene, tx, ty);
  if (!d) return;
  a.goal = null; a.action = null;
  if (otherAt(a.scene, tx, ty) || (d.solid && d.msg)) { interactTile(tx, ty); marker = null; return; }
  if (d.solid) return;
  if (tx === a.x && ty === a.y) { a.path = []; return; }
  const path = findPath(a.scene, a.x, a.y, [[tx, ty]]);
  if (!path) { toast('Impossible d\'y aller !'); return; }
  a.path = path; marker = { x: tx, y: ty };
}
function interactFront() {
  const a = actor(); if (a.moving) return;
  const [dx, dy] = DIRV[a.dir], tx = a.x + dx, ty = a.y + dy;
  const d = tileDef(a.scene, tx, ty);
  if (otherAt(a.scene, tx, ty) || (d && d.msg)) a.action = { tx, ty };
}

/* ---------- Clavier ---------- */
const held = [];
const KEYMAP = { arrowup: 'up', arrowdown: 'down', arrowleft: 'left', arrowright: 'right', z: 'up', w: 'up', s: 'down', q: 'left', a: 'left', d: 'right' };

/* ---------- Boucle principale ---------- */
function update(dt) {
  if (busy || dlg.open || panelOpen()) return;
  const a = actor();
  if (a.moving) {
    a.t += dt / STEP_TIME;
    if (a.t < 1) return;
    a.moving = false; a.t = 0;
    arrive(a);
    if (busy) return;
  }
  let next = null;
  const kd = held[held.length - 1];
  if (kd) {
    a.path = []; a.goal = null; a.action = null; marker = null;
    a.dir = kd;
    const nx = a.x + DIRV[kd][0], ny = a.y + DIRV[kd][1], d = tileDef(a.scene, nx, ny);
    if (d && !d.solid && !otherAt(a.scene, nx, ny)) next = [nx, ny];
  } else if (a.path.length) {
    next = a.path.shift();
    const d = tileDef(a.scene, next[0], next[1]);
    if (!d || d.solid) { a.path = []; next = null; }
  }
  if (next) { startMove(a, next); return; }
  if (a.action) doAction(a);
}

function actorPx(a) {
  if (!a.moving) return { x: a.x * TS, y: a.y * TS };
  return { x: (a.fromX + (a.x - a.fromX) * a.t) * TS, y: (a.fromY + (a.y - a.fromY) * a.t) * TS };
}

function render(now) {
  const a = actor(), sc = SCENES[a.scene];
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#101018'; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.setTransform(S, 0, 0, S, 0, 0);
  ctx.imageSmoothingEnabled = false;

  const vw = cv.width / S, vh = cv.height / S, mw = sc.W * TS, mh = sc.H * TS;
  const ap = actorPx(a);
  let cx = ap.x + 8 - vw / 2, cy = ap.y + 8 - vh / 2;
  cx = mw <= vw ? (mw - vw) / 2 : Math.max(0, Math.min(cx, mw - vw));
  cy = mh <= vh ? (mh - vh) / 2 : Math.max(0, Math.min(cy, mh - vh));
  cam.x = Math.round(cx); cam.y = Math.round(cy);

  ctx.drawImage(sc.canvas, -cam.x, -cam.y);

  // marqueur de destination
  if (marker && Math.floor(now / 220) % 2 === 0) {
    const mx = marker.x * TS - cam.x, my = marker.y * TS - cam.y;
    ctx.fillStyle = '#ffffff';
    for (const [x, y, w, h] of [[1, 1, 4, 1], [1, 1, 1, 4], [11, 1, 4, 1], [14, 1, 1, 4], [1, 14, 4, 1], [1, 11, 1, 4], [11, 14, 4, 1], [14, 11, 1, 4]])
      ctx.fillRect(mx + x, my + y, w, h);
  }

  // personnages présents dans la scène (triés par profondeur)
  const here = Object.keys(PERSOS).map(st).filter(s => s.scene === a.scene)
    .map(s => ({ s, p: actorPx(s) })).sort((u, v) => u.p.y - v.p.y);
  for (const { s, p } of here) {
    const sx = Math.round(p.x - cam.x), sy = Math.round(p.y - cam.y);
    let f = 0;
    if (s.moving && s.t < 0.5) f = s.steps % 2 ? 1 : 2;
    ctx.fillStyle = 'rgba(0,0,0,.22)';
    ctx.fillRect(sx + 4, sy + 13, 8, 3); ctx.fillRect(sx + 3, sy + 14, 10, 1);
    ctx.drawImage(SPRITES[s.id][s.dir][f], sx, sy - 4);
    // hautes herbes devant les jambes
    const tx = Math.round(p.x / TS), ty = Math.round(p.y / TS);
    if (tileChar(a.scene, tx, ty) === ',') ctx.drawImage(sc.canvas, tx * TS, ty * TS + 10, TS, 6, tx * TS - cam.x, ty * TS + 10 - cam.y, TS, 6);
    // petite flèche au-dessus du perso joué (si l'autre est là)
    if (s.id === cur && here.length > 1) {
      const b = Math.floor(now / 350) % 2, ax = sx + 4, ay = sy - 11 + b;
      ctx.fillStyle = '#202028'; ctx.fillRect(ax, ay, 8, 2); ctx.fillRect(ax + 1, ay + 2, 6, 1); ctx.fillRect(ax + 2, ay + 3, 4, 1); ctx.fillRect(ax + 3, ay + 4, 2, 1);
      ctx.fillStyle = '#f8e060'; ctx.fillRect(ax + 1, ay + 1, 6, 1); ctx.fillRect(ax + 2, ay + 2, 4, 1); ctx.fillRect(ax + 3, ay + 3, 2, 1);
    }
  }
  drawBubbles(here, now);
}

/* Bulle de tchat au-dessus de la tête (quelques secondes) */
function wrapText(text, maxW) {
  const words = text.split(/\s+/), lines = [];
  let line = '';
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (ctx.measureText(t).width <= maxW || !line) line = t;
    else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines.length > 3 ? [...lines.slice(0, 2), lines[2].slice(0, -1) + '…'] : lines;
}
function drawBubbles(here, now) {
  const list = here.filter(({ s }) => PERSOS[s.id].bubble && PERSOS[s.id].bubble.until > now);
  if (!list.length) return;
  const u = Math.max(1, Math.round(S / 3));          // 1 « pixel » de bulle
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = `${7 * u}px 'Press Start 2P', monospace`;
  ctx.textBaseline = 'top';
  for (const { s, p } of list) {
    const lines = wrapText(PERSOS[s.id].bubble.text, 110 * u);
    const lh = 10 * u, pad = 5 * u;
    const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + pad * 2;
    const h = lines.length * lh + pad * 2 - 3 * u;
    const cx = (p.x - cam.x + 8) * S;
    let x = Math.round(cx - w / 2), y = Math.round((p.y - cam.y - 12) * S - h - 6 * u);
    x = Math.max(4, Math.min(x, cv.width - w - 4)); y = Math.max(4, y);
    ctx.fillStyle = '#202028';
    ctx.fillRect(x - 2 * u, y, w + 4 * u, h); ctx.fillRect(x, y - 2 * u, w, h + 4 * u);
    ctx.fillRect(Math.round(cx) - 4 * u, y + h, 8 * u, 4 * u); ctx.fillRect(Math.round(cx) - 2 * u, y + h + 4 * u, 4 * u, 2 * u);
    ctx.fillStyle = '#f8f8f0';
    ctx.fillRect(x, y, w, h); ctx.fillRect(Math.round(cx) - 2 * u, y + h, 4 * u, 2 * u);
    ctx.fillStyle = '#202028';
    lines.forEach((l, i) => ctx.fillText(l, x + pad, y + pad + i * lh));
  }
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (running) { updateOthers(dt); update(dt); render(now); updateHud(); }
  requestAnimationFrame(loop);
}

function resize() {
  const dpr = window.devicePixelRatio || 1, w = window.innerWidth, h = window.innerHeight;
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const cssScale = Math.min(6, Math.max(2, Math.min(w, h) / (16 * 9)));
  S = Math.max(1, Math.round(cssScale * dpr));
}

/* ==============================================================
   8) INTERFACE (écrans, HUD, panneaux, dialogues)
   ============================================================== */
const $ = id => document.getElementById(id);
const el = {
  fade: $('fade'), dialog: $('dialog'), dialogText: $('dialog-text'), toast: $('toast'),
  hudName: $('hud-name'), hudPlace: $('hud-place'), hudAvatar: $('hud-avatar'),
};

function showScreen(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id)); }

function age(iso) {
  const [y, m, d] = iso.split('-').map(Number), n = new Date();
  let a = n.getFullYear() - y;
  if (n.getMonth() + 1 < m || (n.getMonth() + 1 === m && n.getDate() < d)) a--;
  return a;
}
const dateFr = iso => iso.split('-').reverse().join('/');

/* --- Dialogue façon Pokémon --- */
const dlg = { open: false, text: '', n: 0, timer: null };
function say(text) {
  clearInterval(dlg.timer);
  Object.assign(dlg, { open: true, text, n: 0 });
  el.dialogText.textContent = '';
  el.dialog.classList.remove('hidden', 'done');
  dlg.timer = setInterval(() => {
    dlg.n++;
    el.dialogText.textContent = text.slice(0, dlg.n);
    if (dlg.n >= text.length) { clearInterval(dlg.timer); dlg.timer = null; el.dialog.classList.add('done'); }
  }, 22);
}
function dialogNext() {
  if (dlg.timer) {
    clearInterval(dlg.timer); dlg.timer = null;
    el.dialogText.textContent = dlg.text; el.dialog.classList.add('done');
    return;
  }
  dlg.open = false; el.dialog.classList.add('hidden');
}
el.dialog.addEventListener('pointerdown', e => { e.preventDefault(); dialogNext(); });

let toastTimer = null;
function toast(msg) {
  el.toast.textContent = msg; el.toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.toast.classList.remove('show'), 1800);
}

/* --- HUD --- */
let lastPlace = '';
function placeName() {
  const a = actor(), sc = SCENES[a.scene];
  const z = (sc.zones || []).find(z => a.x >= z.x1 && a.x <= z.x2 && a.y >= z.y1 && a.y <= z.y2);
  if (a.scene === 'town') return z ? z.nom : sc.nom;
  return z && z.nom !== sc.nom ? `${sc.nom} · ${z.nom}` : sc.nom;
}
function updateHud(force) {
  const p = placeName();
  if (p === lastPlace && !force) return;
  lastPlace = p; el.hudPlace.textContent = p;
}

/* --- Panneaux --- */
const panelOpen = () => !!document.querySelector('.panel:not(.hidden)');
function openPanel(id) {
  if (id === 'panel-goto') buildGoto();
  if (id === 'panel-outfit') buildOutfit();
  if (id === 'panel-info') buildInfo();
  if (id === 'panel-chat') openChat();
  held.length = 0;
  $(id).classList.remove('hidden');
}
function closePanels() { document.querySelectorAll('.panel').forEach(p => p.classList.add('hidden')); }
document.querySelectorAll('[data-open]').forEach(b => b.addEventListener('click', () => openPanel(b.dataset.open)));
$('hud-perso').addEventListener('click', () => openPanel('panel-info'));
document.querySelectorAll('.panel').forEach(p => {
  p.addEventListener('click', e => { if (e.target === p) closePanels(); });
  p.querySelector('.btn-close').addEventListener('click', closePanels);
});

function tileIcon(ch, scId) {
  const c = makeCanvas(16, 16), sc = SCENES[scId];
  drawTileAt(c.getContext('2d'), sc, ch, 0, 0, 0, 0);
  return c;
}
function buildGoto() {
  const list = $('dest-list'); list.innerHTML = '';
  for (const d of DESTINATIONS) {
    const b = document.createElement('button');
    b.className = 'dest';
    b.appendChild(tileIcon(d.icone, d.iconeScene));
    b.appendChild(document.createTextNode(d.label));
    b.addEventListener('click', () => { closePanels(); goTo(d); });
    list.appendChild(b);
  }
}
function buildOutfit() {
  const p = me(), rows = $('outfit-rows');
  const refresh = () => {
    document.querySelectorAll('.outfit-preview canvas').forEach(c => paintSprite(c, cur, c.dataset.dir, 0));
    paintSprite(el.hudAvatar, cur);
  };
  rows.innerHTML = '';
  for (const [key, label] of [['haut', 'Haut'], ['bas', 'Bas'], ['chaussures', 'Chaussures']]) {
    const row = document.createElement('div'); row.className = 'swatch-row';
    row.innerHTML = `<h3>${label}</h3>`;
    const sw = document.createElement('div'); sw.className = 'swatches';
    for (const col of COULEURS_TENUE[key]) {
      const b = document.createElement('button');
      b.style.background = col;
      if (p.tenue[key].toLowerCase() === col.toLowerCase()) b.classList.add('sel');
      b.addEventListener('click', () => {
        p.tenue[key] = col; buildSprites(cur); writeSave();
        sw.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b));
        refresh();
      });
      sw.appendChild(b);
    }
    row.appendChild(sw); rows.appendChild(row);
  }
  refresh();
}
function buildInfo() {
  const p = me();
  $('info-title').textContent = `Fiche de ${p.nom}`;
  paintSprite($('info-avatar'), cur);
  const rows = [['Prénom', p.nom], ['Âge', `${age(p.naissance)} ans`], [p.fem ? 'Née le' : 'Né le', dateFr(p.naissance)], ...p.fiche];
  $('info-list').innerHTML = rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
}

/* --- Écran 1 : choix du perso --- */
let cardFrame = 0;
function setupSelect() {
  document.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.perso, p = PERSOS[id];
    card.querySelector('.card-name').textContent = p.nom;
    card.querySelector('.card-info').innerHTML = `${age(p.naissance)} ans<br>${p.fiche[0][1]}<br><span class="net-state"></span>`;
    card.addEventListener('click', () => openCode(id));
  });
  setInterval(() => {
    if (!$('screen-select').classList.contains('active')) return;
    cardFrame = (cardFrame + 1) % 4;
    const f = [0, 1, 0, 2][cardFrame];
    document.querySelectorAll('.card').forEach(card => paintSprite(card.querySelector('canvas'), card.dataset.perso, 'down', f));
  }, 260);
  document.querySelectorAll('.card').forEach(card => paintSprite(card.querySelector('canvas'), card.dataset.perso));
}

/* --- Écran 2 : code --- */
let codeFor = null, codeInput = '';
function openCode(id) {
  codeFor = id; codeInput = '';
  $('code-title').textContent = `Code de ${PERSOS[id].nom}`;
  $('code-error').textContent = '';
  paintSprite($('code-avatar'), id);
  renderDots();
  showScreen('screen-code');
}
function renderDots() {
  const n = PERSOS[codeFor].code.length;
  $('code-dots').innerHTML = Array.from({ length: n }, (_, i) => `<span class="${i < codeInput.length ? 'on' : ''}"></span>`).join('');
}
function codeKey(k) {
  const code = PERSOS[codeFor].code;
  if (k === 'del') codeInput = codeInput.slice(0, -1);
  else if (k === 'ok') return checkCode();
  else if (codeInput.length < code.length) codeInput += k;
  $('code-error').textContent = '';
  renderDots();
  if (codeInput.length === code.length) setTimeout(checkCode, 120);
}
function checkCode() {
  if (codeInput === PERSOS[codeFor].code) { login(codeFor); return; }
  $('code-error').textContent = 'Code incorrect !';
  const box = $('code-box'); box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
  codeInput = ''; renderDots();
}
document.querySelectorAll('.keypad button').forEach(b => b.addEventListener('click', () => codeKey(b.dataset.k)));
$('code-back').addEventListener('click', () => showScreen('screen-select'));

/* --- Connexion / déconnexion --- */
function login(id) {
  cur = id;
  try { sessionStorage.setItem('projetSims_cur', id); } catch (e) { /* rien */ }
  const a = actor();
  const [x, y] = nearestFree(a.scene, a.x, a.y, id);
  Object.assign(a, { x, y, fromX: x, fromY: y, moving: false, path: [], goal: null, action: null });
  el.hudName.textContent = me().nom;
  paintSprite(el.hudAvatar, id);
  showScreen('screen-game');
  resize(); updateHud(true);
  running = true;
  netPresence(true); refreshOnlineUi(); renderChat();
  say(`Salut ${me().nom} !\nTouche l'écran pour te déplacer, ou utilise « Aller à ».`);
}
function logout() {
  const a = actor();
  if (a) { a.path = []; a.goal = null; a.action = null; a.moving = false; a.fromX = a.x; a.fromY = a.y; }
  writeSave();
  netPresence(false);
  running = false; cur = null; marker = null; held.length = 0;
  dlg.open = false; el.dialog.classList.add('hidden'); closePanels();
  try { sessionStorage.removeItem('projetSims_cur'); } catch (e) { /* rien */ }
  showScreen('screen-select');
}
$('btn-switch').addEventListener('click', logout);

/* --- Entrées : tactile / souris --- */
cv.addEventListener('pointerdown', e => {
  if (!running) return;
  e.preventDefault();
  if (dlg.open) { dialogNext(); return; }
  if (busy) return;
  const r = cv.getBoundingClientRect();
  const gx = (e.clientX - r.left) * (cv.width / r.width) / S + cam.x;
  const gy = (e.clientY - r.top) * (cv.height / r.height) / S + cam.y;
  onTap(Math.floor(gx / TS), Math.floor(gy / TS));
});

/* --- Entrées : clavier --- */
document.addEventListener('keydown', e => {
  if ($('screen-code').classList.contains('active')) {
    if (/^[0-9]$/.test(e.key)) codeKey(e.key);
    else if (e.key === 'Backspace') codeKey('del');
    else if (e.key === 'Enter') codeKey('ok');
    else if (e.key === 'Escape') showScreen('screen-select');
    return;
  }
  if (!running) return;
  if (panelOpen()) { if (e.key === 'Escape') closePanels(); return; }
  const k = KEYMAP[e.key.toLowerCase()];
  if (k) { e.preventDefault(); if (dlg.open) return; if (!held.includes(k)) held.push(k); return; }
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (dlg.open) dialogNext(); else interactFront(); }
  if (e.key.toLowerCase() === 't' && !dlg.open) { e.preventDefault(); openPanel('panel-chat'); }
});
document.addEventListener('keyup', e => {
  const k = KEYMAP[e.key.toLowerCase()];
  if (k) { const i = held.indexOf(k); if (i >= 0) held.splice(i, 1); }
});
window.addEventListener('blur', () => { held.length = 0; });
window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => { if (document.hidden) writeSave(); });

/* ==============================================================
   9) EN DIRECT (Firebase Realtime Database)
   --------------------------------------------------------------
   Position + tenue de chaque perso dans  sims/persos/<id>
   Présence (qui est connecté)        dans  sims/online/<id>/<connexion>
   Sans réseau, le jeu marche quand même (sauvegarde locale).
   ============================================================== */
const FIREBASE_URL = 'https://jeu-sims-default-rtdb.europe-west1.firebasedatabase.app';
// ?test dans l'adresse = base de test séparée (ne dérange pas les vraies parties)
const DB_ROOT = new URLSearchParams(location.search).has('test') ? 'sims/test' : 'sims';
const NET = { db: null, first: true, ready: false, online: {}, sent: {}, pres: null };

function netPush(id) {
  if (!NET.db) return;
  const a = st(id), d = { scene: a.scene, x: a.x, y: a.y, dir: a.dir, tenue: { ...PERSOS[id].tenue } };
  const k = JSON.stringify(d);
  if (k === NET.sent[id]) return;
  NET.sent[id] = k;
  NET.db.ref(DB_ROOT + '/persos/' + id).set(d).catch(e => console.warn('Envoi impossible', e));
}

function netPresence(on) {
  if (!NET.db) return;
  if (NET.pres) { NET.pres.onDisconnect().cancel(); NET.pres.remove(); NET.pres = null; }
  if (!on || !cur) return;
  NET.pres = NET.db.ref(DB_ROOT + '/online/' + cur).push();
  NET.pres.onDisconnect().remove();
  NET.pres.set(true);
}

/* Place le perso directement sur la case (sans animation) */
function snapTo(s, d) {
  Object.assign(s, { scene: d.scene, x: d.x, y: d.y, fromX: d.x, fromY: d.y, dir: d.dir || s.dir, moving: false, t: 0, path: [], net: null });
}

/* Reçoit l'état partagé des persos */
function applyRemote(all) {
  for (const id in PERSOS) {
    const d = all[id];
    if (!d || !SCENES[d.scene] || !tileDef(d.scene, d.x, d.y)) continue;
    const p = PERSOS[id], s = st(id);
    if (id === cur) {
      // au démarrage seulement : on reprend là où ce perso s'était arrêté (autre appareil)
      if (NET.first && !s.moving && !s.path.length && !busy) {
        snapTo(s, d);
        if (d.tenue) { Object.assign(p.tenue, d.tenue); buildSprites(id); paintSprite(el.hudAvatar, id); }
        updateHud(true);
      }
      continue;
    }
    if (d.tenue && ['haut', 'bas', 'chaussures'].some(k => d.tenue[k] && d.tenue[k] !== p.tenue[k])) {
      Object.assign(p.tenue, d.tenue); buildSprites(id);
    }
    if (!running) snapTo(s, d); else s.net = d;
  }
  NET.first = false;
}

/* Fait marcher l'autre perso jusqu'à sa position reçue */
function updateOthers(dt) {
  for (const id in PERSOS) {
    if (id === cur) continue;
    const s = st(id);
    if (s.moving) {
      s.t += dt / STEP_TIME;
      if (s.t < 1) continue;
      s.moving = false; s.t = 0;
    }
    const d = s.net;
    if (!d) continue;
    if (d.scene === s.scene && d.x === s.x && d.y === s.y) { s.dir = d.dir || s.dir; s.net = null; continue; }
    const path = d.scene === s.scene ? findPath(s.scene, s.x, s.y, [[d.x, d.y]]) : null;
    if (path && path.length && path.length <= 6) startMove(s, path[0]);
    else snapTo(s, d);
  }
}

function refreshOnlineUi() {
  document.querySelectorAll('.card').forEach(card => {
    const on = !!NET.online[card.dataset.perso], n = card.querySelector('.net-state');
    if (n) { n.textContent = NET.db ? (on ? '● en ligne' : '○ hors ligne') : ''; n.classList.toggle('on', on); }
  });
  const other = cur && Object.keys(PERSOS).find(id => id !== cur), h = $('hud-other');
  if (h) {
    const on = other && NET.online[other];
    h.textContent = other && NET.db ? `${on ? '●' : '○'} ${PERSOS[other].nom}` : '';
    h.classList.toggle('on', !!on);
  }
}

/* ---------- Tchat ----------
   Messages dans  sims/chat/<clé>  = { de, texte, t }
   Les clés Firebase sont triées dans l'ordre d'envoi. */
const CHAT = { msgs: [], lastKey: '', max: 50 };
const CHAT_READ_KEY = 'projetSims_chatLu';

function chatRead() {
  try { return JSON.parse(localStorage.getItem(CHAT_READ_KEY)) || {}; } catch (e) { return {}; }
}
function markChatRead() {
  if (!cur || !CHAT.msgs.length) return;
  const r = chatRead(); r[cur] = CHAT.msgs[CHAT.msgs.length - 1].key;
  try { localStorage.setItem(CHAT_READ_KEY, JSON.stringify(r)); } catch (e) { /* rien */ }
}
function updateChatBadge() {
  const b = $('chat-badge');
  const lu = (cur && chatRead()[cur]) || '';
  const n = cur ? CHAT.msgs.filter(m => m.de !== cur && m.key > lu).length : 0;
  b.textContent = n > 9 ? '9+' : n;
  b.classList.toggle('hidden', !n);
}
const chatOpen = () => !$('panel-chat').classList.contains('hidden');

function renderChat() {
  const list = $('chat-list');
  if (!NET.db) { list.innerHTML = '<p class="chat-empty">Pas de connexion :<br>le tchat est indisponible.</p>'; return; }
  if (!CHAT.msgs.length) { list.innerHTML = '<p class="chat-empty">Aucun message.<br>Dis bonjour !</p>'; updateChatBadge(); return; }
  list.innerHTML = '';
  for (const m of CHAT.msgs) {
    const d = document.createElement('div');
    d.className = 'chat-msg' + (m.de === cur ? ' mine' : '');
    const who = document.createElement('div'); who.className = 'who';
    const h = m.t ? new Date(m.t).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
    who.textContent = `${PERSOS[m.de] ? PERSOS[m.de].nom : '?'} ${h}`;
    const txt = document.createElement('div'); txt.className = 'txt'; txt.textContent = m.texte;
    d.append(who, txt); list.appendChild(d);
  }
  list.scrollTop = list.scrollHeight;
  if (chatOpen()) markChatRead();
  updateChatBadge();
}
function openChat() {
  renderChat(); markChatRead(); updateChatBadge();
  if (NET.db && window.matchMedia('(pointer: fine)').matches) setTimeout(() => $('chat-input').focus(), 50);
}
function onChatMessage(key, m) {
  if (!m || typeof m.texte !== 'string' || !PERSOS[m.de]) return;
  if (CHAT.msgs.some(x => x.key === key)) return;
  const isNew = key > CHAT.lastKey;
  CHAT.msgs.push({ key, de: m.de, texte: m.texte.slice(0, 200), t: m.t });
  CHAT.msgs.sort((a, b) => (a.key < b.key ? -1 : 1));
  if (CHAT.msgs.length > CHAT.max) CHAT.msgs.shift();
  if (isNew) {
    CHAT.lastKey = key;
    // bulle au-dessus de la tête + notification
    PERSOS[m.de].bubble = { text: m.texte, until: performance.now() + 5000 };
    if (running && m.de !== cur && !chatOpen()) toast(`💬 ${PERSOS[m.de].nom} : ${m.texte.length > 28 ? m.texte.slice(0, 27) + '…' : m.texte}`);
  }
  renderChat();
}
function sendChat(texte) {
  texte = texte.replace(/\s+/g, ' ').trim().slice(0, 200);
  if (!texte || !cur || !NET.db) return;
  NET.db.ref(DB_ROOT + '/chat').push({ de: cur, texte, t: firebase.database.ServerValue.TIMESTAMP })
    .catch(() => toast('Message non envoyé !'));
}
$('chat-form').addEventListener('submit', e => {
  e.preventDefault();
  const i = $('chat-input');
  sendChat(i.value); i.value = '';
  if (window.matchMedia('(pointer: fine)').matches) i.focus();
});

function chatStart() {
  const q = NET.db.ref(DB_ROOT + '/chat').limitToLast(CHAT.max);
  // d'abord l'historique (sans bulles ni notifications), puis les nouveaux messages
  q.once('value', snap => {
    snap.forEach(c => {
      const m = c.val();
      if (m && typeof m.texte === 'string' && PERSOS[m.de]) CHAT.msgs.push({ key: c.key, de: m.de, texte: m.texte.slice(0, 200), t: m.t });
      CHAT.lastKey = c.key > CHAT.lastKey ? c.key : CHAT.lastKey;
    });
    renderChat();
    q.on('child_added', c => onChatMessage(c.key, c.val()));
  });
}

function netStart() {
  if (typeof firebase === 'undefined') { console.warn('Firebase non chargé : mode hors ligne'); return; }
  try {
    firebase.initializeApp({ databaseURL: FIREBASE_URL });
    NET.db = firebase.database();
  } catch (e) { console.warn('Firebase indisponible', e); NET.db = null; return; }
  NET.db.ref(DB_ROOT + '/persos').on('value', snap => applyRemote(snap.val() || {}));
  NET.db.ref(DB_ROOT + '/online').on('value', snap => {
    const v = snap.val() || {};
    for (const id in PERSOS) {
      const on = !!v[id];
      if (NET.ready && running && id !== cur && on !== !!NET.online[id])
        toast(on ? `${PERSOS[id].nom} vient de se connecter !` : `${PERSOS[id].nom} s'est déconnecté${PERSOS[id].fem ? 'e' : ''}.`);
      NET.online[id] = on;
    }
    NET.ready = true;
    refreshOnlineUi();
  });
  chatStart();
  // après une coupure réseau, on se redéclare « en ligne »
  NET.db.ref('.info/connected').on('value', snap => { if (snap.val() && cur) netPresence(true); });
}

/* ==============================================================
   10) DÉMARRAGE
   ============================================================== */
for (const id in SCENES) renderScene(id);
loadSave();
for (const id in PERSOS) buildSprites(id);
netStart();
setupSelect();
resize();
(function restoreSession() {
  let id = null;
  try { id = sessionStorage.getItem('projetSims_cur'); } catch (e) { /* rien */ }
  if (id && PERSOS[id]) login(id);
})();
requestAnimationFrame(loop);
