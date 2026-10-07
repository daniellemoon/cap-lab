import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ============================================================
   CAP LAB — interactive 3D custom hat designer
   ============================================================ */

/* ---------- catalog ---------- */

const PALETTES = {
  core: [
    { name: 'Midnight Navy', hex: '#13224a' },
    { name: 'Jet Black', hex: '#15151a' },
    { name: 'Bone White', hex: '#f3ead9' },
    { name: 'Heather Gray', hex: '#9aa0ab' },
    { name: 'Fire Red', hex: '#d7263d' },
    { name: 'Court Orange', hex: '#f3712b' },
    { name: 'Pop Pink', hex: '#ff4f9a' },
    { name: 'Turf Green', hex: '#1e7f4f' },
    { name: 'Ice Blue', hex: '#8ed8f8' },
    { name: 'Royal Purple', hex: '#6a3df0' },
    { name: 'Sunbeam', hex: '#ffcf33' },
    { name: 'Cocoa Tan', hex: '#c9a279' },
  ],
  accent: [
    { name: 'Bone White', hex: '#f3ead9' },
    { name: 'Jet Black', hex: '#15151a' },
    { name: 'Sunbeam', hex: '#ffcf33' },
    { name: 'Fire Red', hex: '#d7263d' },
    { name: 'Ice Blue', hex: '#8ed8f8' },
    { name: 'Turf Green', hex: '#1e7f4f' },
    { name: 'Pop Pink', hex: '#ff4f9a' },
    { name: 'Royal Purple', hex: '#6a3df0' },
  ],
};

const STYLES = {
  clubhouse: {
    id: 'clubhouse',
    name: "'47 Classic Clean Up",
    emoji: '🧢',
    price: 31.99,
    spec: { fit: 'Unstructured Fit', crownSpec: 'Low Crown', billSpec: 'Curved Bill', closure: 'Buckle' },
    fabric: '100% Cotton Twill, garment washed',
    blurb: "Soft unstructured crown, pre-curved bill, broken-in from day one. The classic everyday dad-hat silhouette.",
    crownHeight: 0.90,
    crown: { k: 4.5, frontRise: 0.03, frontBulge: 0.02, seam: 0.010, slouch: 0.05, panel: 0.016 },
    structured: false,
    bill: { length: 0.64, droop: 0.66, curl: 0.075, tilt: -0.22, width: 1.04, thickness: 0.032 },
    meshBack: false,
    strap: 'buckle',
    colors: ['#13224a', '#15151a', '#f3ead9', '#9aa0ab', '#d7263d', '#1e7f4f', '#c9a279', '#6a3df0'],
  },
  flatbill: {
    id: 'flatbill',
    name: 'Custom 9FIFTY Snapback',
    emoji: '🟦',
    price: 34.99,
    spec: { fit: 'Structured Fit', crownSpec: 'High Crown', billSpec: 'Flat Bill', closure: 'Snapback' },
    fabric: '80% Acrylic / 20% Wool, flat embroidered eyelets',
    blurb: 'High structured crown with a dead-flat bill and snap closure. Loud, boxy, built to show off patches.',
    crownHeight: 1.20,
    crown: { k: 7.5, frontRise: 0.05, frontBulge: 0.03, seam: 0.013, slouch: 0, panel: 0.026 },
    structured: true,
    bill: { length: 0.74, droop: 0.05, curl: 0.0, tilt: -0.14, width: 1.06, thickness: 0.040 },
    meshBack: false,
    strap: 'snap',
    colors: ['#15151a', '#ff4f9a', '#6a3df0', '#f3712b', '#8ed8f8', '#ffcf33', '#13224a', '#f3ead9'],
  },
  trucker: {
    id: 'trucker',
    name: '112 Trucker',
    emoji: '🚚',
    price: 24.99,
    spec: { fit: 'Structured Fit', crownSpec: 'Mid Crown', billSpec: 'Normal Bill', closure: 'Snapback' },
    fabric: '50% Mesh / 32% Polyester / 18% Cotton, woven',
    blurb: 'Classic trucker build: solid front panels, breezy mesh back, snap closure for that perfect fit.',
    crownHeight: 1.05,
    crown: { k: 6.0, frontRise: 0.05, frontBulge: 0.03, seam: 0.012, slouch: 0, panel: 0.024 },
    structured: true,
    bill: { length: 0.66, droop: 0.48, curl: 0.06, tilt: -0.18, width: 1.05, thickness: 0.035 },
    meshBack: true,
    strap: 'snap',
    colors: ['#f3ead9', '#15151a', '#d7263d', '#1e7f4f', '#f3712b', '#8ed8f8', '#13224a', '#ffcf33'],
  },
  fitted: {
    id: 'fitted',
    name: 'Full Court Fitted',
    emoji: '⚾',
    price: 34.99,
    spec: { fit: 'Structured Fit', crownSpec: 'Mid Crown', billSpec: 'Curved Bill', closure: 'Fitted' },
    fabric: '98% Polyester / 2% Spandex, moisture wicking',
    blurb: 'On-field six-panel with a gentle pre-curve and a true fitted band. No strap, all business.',
    crownHeight: 1.15,
    crown: { k: 7.1, frontRise: 0.04, frontBulge: 0.025, seam: 0.011, slouch: 0, panel: 0.020 },
    structured: true,
    bill: { length: 0.66, droop: 0.42, curl: 0.05, tilt: -0.17, width: 1.04, thickness: 0.034 },
    meshBack: false,
    strap: 'none',
    colors: ['#13224a', '#15151a', '#d7263d', '#6a3df0', '#1e7f4f', '#9aa0ab', '#f3712b', '#f3ead9'],
  },
};

const SIZES = [
  { id: 'sm', label: 'S/M', scale: 0.96, fits: 'adjustable' },
  { id: 'ml', label: 'M/L', scale: 1.0, fits: 'adjustable' },
  { id: 'lxl', label: 'L/XL', scale: 1.05, fits: 'adjustable' },
  { id: '7', label: '7', scale: 0.97, fits: 'fitted' },
  { id: '714', label: '7 ¼', scale: 1.0, fits: 'fitted' },
  { id: '738', label: '7 ⅜', scale: 1.03, fits: 'fitted' },
  { id: '758', label: '7 ⅝', scale: 1.07, fits: 'fitted' },
];

/**
 * Patch catalog modeled on the Custom Lids embroidery design gallery, which is
 * organized by theme: mascots, stars, faith, sports, nature, space, kids/fun,
 * heritage and parks. Art here is original Cap Lab rendering of those motifs.
 */
const PATCHES = [
  // ---- Mascots ----
  { id: 'm-lion', cat: 'Mascots', name: 'Growling Lion', label: 'LIONS', emoji: '🦁', bg: '#7c2d12', fg: '#ffcf33', shape: 'shield' },
  { id: 'm-wolf', cat: 'Mascots', name: 'Snarling Wolf', label: 'WOLVES', emoji: '🐺', bg: '#1f2937', fg: '#9aa0ab', shape: 'shield' },
  { id: 'm-tiger', cat: 'Mascots', name: 'Growling Tiger', label: 'TIGERS', emoji: '🐯', bg: '#f3712b', fg: '#15151a', shape: 'circle' },
  { id: 'm-jaguar', cat: 'Mascots', name: 'Jaguar Face', label: 'JAGS', emoji: '🐆', bg: '#0e7490', fg: '#ffcf33', shape: 'shield' },
  { id: 'm-gorilla', cat: 'Mascots', name: 'Growling Gorilla', label: 'APES', emoji: '🦍', bg: '#15151a', fg: '#a3e635', shape: 'rect' },
  { id: 'm-bobcat', cat: 'Mascots', name: 'Bobcat Front Face', label: 'CATS', emoji: '🐱', bg: '#6a3df0', fg: '#f3ead9', shape: 'circle' },
  { id: 'm-fox', cat: 'Mascots', name: 'Fox Walking', label: 'FOXES', emoji: '🦊', bg: '#d7263d', fg: '#ffcf33', shape: 'shield' },
  { id: 'm-gator', cat: 'Mascots', name: 'Walking Gator', label: 'GATORS', emoji: '🐊', bg: '#1e7f4f', fg: '#f3ead9', shape: 'rect' },
  { id: 'm-bear', cat: 'Mascots', name: 'Mountain Bear Front', label: 'BEARS', emoji: '🐻', bg: '#78350f', fg: '#f3ead9', shape: 'shield' },
  { id: 'm-eagle', cat: 'Mascots', name: 'Screaming Eagle', label: 'EAGLES', emoji: '🦅', bg: '#13224a', fg: '#ffcf33', shape: 'circle' },

  // ---- Stars ----
  { id: 's-blue', cat: 'Stars', name: '5 Point Round Blue Star', kind: 'star', points: 5, bg: '#f3ead9', fg: '#1d4ed8', fg2: '#8ed8f8', shape: 'circle' },
  { id: 's-red', cat: 'Stars', name: '5 Point Round Red Star', kind: 'star', points: 5, bg: '#f3ead9', fg: '#d7263d', fg2: '#ffcf33', shape: 'circle' },
  { id: 's-yellow', cat: 'Stars', name: '5 Point Round Yellow Star', kind: 'star', points: 5, bg: '#13224a', fg: '#ffcf33', fg2: '#fff3bf', shape: 'circle' },
  { id: 's-purple', cat: 'Stars', name: '5 Point Purple and Blue Star', kind: 'star', points: 5, bg: '#1e1b4b', fg: '#6a3df0', fg2: '#8ed8f8', shape: 'circle' },
  { id: 's-pink', cat: 'Stars', name: '5 Point Pink and Yellow Star', kind: 'star', points: 5, bg: '#2b0f22', fg: '#ff4f9a', fg2: '#ffcf33', shape: 'circle' },
  { id: 's-green', cat: 'Stars', name: '5 Point Green and Yellow Star', kind: 'star', points: 5, bg: '#052e16', fg: '#a3e635', fg2: '#ffcf33', shape: 'circle' },
  { id: 's-sparkle', cat: 'Stars', name: 'Four-Pointed Sparkle Star', kind: 'star', points: 4, bg: '#15151a', fg: '#8ed8f8', fg2: '#f3ead9', shape: 'rect' },
  { id: 's-artsy8', cat: 'Stars', name: 'Artsy 8 Pointed Star', kind: 'star', points: 8, bg: '#6a3df0', fg: '#ffcf33', fg2: '#ff4f9a', shape: 'circle' },
  { id: 's-bethlehem', cat: 'Stars', name: 'Bethlehem Star', kind: 'star', points: 6, bg: '#13224a', fg: '#f3ead9', fg2: '#ffcf33', shape: 'shield' },
  { id: 's-patch', cat: 'Stars', name: 'Star Patch Curved', kind: 'star', points: 5, bg: '#d7263d', fg: '#f3ead9', fg2: '#13224a', shape: 'rect' },

  // ---- Faith ----
  { id: 'f-homeplate', cat: 'Faith', name: 'Home Plate with Cross', label: 'FAITH', emoji: '✝️', emoji2: '⚾', bg: '#f3ead9', fg: '#13224a', shape: 'shield' },
  { id: 'f-baseball', cat: 'Faith', name: 'Baseball with Cross', label: 'BELIEVE', emoji: '⚾', emoji2: '✝️', bg: '#13224a', fg: '#f3ead9', shape: 'circle' },
  { id: 'f-redcross', cat: 'Faith', name: 'Home Plate with Red Cross', label: 'PLAY 4 HIM', emoji: '✝️', bg: '#d7263d', fg: '#f3ead9', shape: 'shield' },
  { id: 'f-outline', cat: 'Faith', name: 'Religious Baseball Cross', label: 'FAITH FIRST', emoji: '🙏', bg: '#1e7f4f', fg: '#ffcf33', shape: 'rect' },

  // ---- Sports ----
  { id: 'sp-hoops', cat: 'Sports', name: 'Dinosaur Basketball', label: 'HOOPS', emoji: '🦖', emoji2: '🏀', bg: '#f3712b', fg: '#15151a', shape: 'circle' },
  { id: 'sp-football', cat: 'Sports', name: 'Dinosaur Football', label: 'GRIDIRON', emoji: '🦕', emoji2: '🏈', bg: '#1e7f4f', fg: '#f3ead9', shape: 'shield' },
  { id: 'sp-soccer', cat: 'Sports', name: 'Dinosaur Soccer', label: 'PITCH', emoji: '🦖', emoji2: '⚽', bg: '#13224a', fg: '#8ed8f8', shape: 'circle' },
  { id: 'sp-hockey', cat: 'Sports', name: 'Dinosaur Hockey', label: 'ICE', emoji: '🦕', emoji2: '🏒', bg: '#0e7490', fg: '#f3ead9', shape: 'rect' },
  { id: 'sp-triceratops', cat: 'Sports', name: 'Triceratops Baseball', label: 'SLUGGER', emoji: '🦕', emoji2: '⚾', bg: '#d7263d', fg: '#ffcf33', shape: 'shield' },
  { id: 'sp-court', cat: 'Sports', name: 'City Hoops Crest', label: 'CITY', emoji: '🏀', bg: '#5b2ea6', fg: '#ffd23f', shape: 'shield' },
  { id: 'sp-endzone', cat: 'Sports', name: 'End Zone Celebration', label: 'TD', emoji: '🙌', bg: '#15151a', fg: '#ffcf33', shape: 'circle' },
  { id: 'sp-scarf', cat: 'Sports', name: 'Supporters Scarf', label: 'ULTRAS', emoji: '🧣', bg: '#6a3df0', fg: '#ffd23f', shape: 'rect' },
  { id: 'sp-glove', cat: 'Sports', name: 'Bullpen Glove', label: 'BULLPEN', emoji: '🧤', bg: '#78350f', fg: '#f3ead9', shape: 'shield' },

  // ---- Nature ----
  { id: 'n-rose', cat: 'Nature', name: 'Rose with Leaves', label: '', emoji: '🌹', bg: '#2b0f22', fg: '#ff4f9a', shape: 'circle' },
  { id: 'n-sunflower', cat: 'Nature', name: 'Single Sunflower with Stem', label: '', emoji: '🌻', bg: '#13224a', fg: '#ffcf33', shape: 'shield' },
  { id: 'n-snake', cat: 'Nature', name: 'Snake with Roses', label: '', emoji: '🐍', emoji2: '🌹', bg: '#052e16', fg: '#a3e635', shape: 'rect' },
  { id: 'n-dragonfly', cat: 'Nature', name: 'Dragon Fly', label: '', emoji: '🦋', bg: '#0e7490', fg: '#8ed8f8', shape: 'circle' },
  { id: 'n-arrow', cat: 'Nature', name: 'Broken Arrow', label: '', emoji: '🏹', bg: '#78350f', fg: '#f3ead9', shape: 'rect' },
  { id: 'n-maple', cat: 'Nature', name: '2 Colored Maple Leaf', label: '', emoji: '🍁', bg: '#f3ead9', fg: '#d7263d', shape: 'circle' },

  // ---- Space ----
  { id: 'x-astronaut', cat: 'Space', name: 'Floating Astronaut', label: '', emoji: '👨‍🚀', bg: '#1e1b4b', fg: '#8ed8f8', shape: 'circle' },
  { id: 'x-rocket', cat: 'Space', name: 'Rocket Launch Badge', label: 'LIFTOFF', emoji: '🚀', bg: '#15151a', fg: '#ff4f9a', shape: 'shield' },
  { id: 'x-blackhole', cat: 'Space', name: 'Black Hole', label: '', emoji: '🕳️', bg: '#0b0b14', fg: '#6a3df0', shape: 'circle' },
  { id: 'x-galaxy', cat: 'Space', name: 'Spiral Galaxy', label: '', emoji: '🌌', bg: '#1e1b4b', fg: '#ffcf33', shape: 'circle' },
  { id: 'x-ufo', cat: 'Space', name: 'UFO Tracking Beam', label: '', emoji: '🛸', bg: '#052e16', fg: '#a3e635', shape: 'rect' },
  { id: 'x-moon', cat: 'Space', name: 'Crescent Moon Camp', label: 'NIGHT OWL', emoji: '🌙', bg: '#13224a', fg: '#ffcf33', shape: 'shield' },

  // ---- Fun & Kids ----
  { id: 'k-penguin', cat: 'Fun', name: 'Cute Penguin', label: '', emoji: '🐧', bg: '#8ed8f8', fg: '#13224a', shape: 'circle' },
  { id: 'k-redpanda', cat: 'Fun', name: 'Red Panda', label: '', emoji: '🦝', bg: '#7c2d12', fg: '#ffcf33', shape: 'circle' },
  { id: 'k-sloth', cat: 'Fun', name: 'Sloth Heart', label: '', emoji: '🦥', emoji2: '💚', bg: '#1e7f4f', fg: '#f3ead9', shape: 'shield' },
  { id: 'k-pineapple', cat: 'Fun', name: 'Silly Pineapple', label: '', emoji: '🍍', bg: '#ffcf33', fg: '#1e7f4f', shape: 'rect' },
  { id: 'k-monster', cat: 'Fun', name: 'Monster Truck', label: 'BIG RIG', emoji: '🛻', bg: '#15151a', fg: '#f3712b', shape: 'rect' },
  { id: 'k-firetruck', cat: 'Fun', name: 'Fire Truck Front View', label: 'ENGINE 1', emoji: '🚒', bg: '#d7263d', fg: '#f3ead9', shape: 'shield' },
  { id: 'k-tractor', cat: 'Fun', name: 'Toy Tractor', label: '', emoji: '🚜', bg: '#1e7f4f', fg: '#ffcf33', shape: 'circle' },
  { id: 'k-sushi', cat: 'Fun', name: 'Sushi Samurai', label: '', emoji: '🍣', emoji2: '⚔️', bg: '#15151a', fg: '#ff4f9a', shape: 'rect' },
  { id: 'k-popcorn', cat: 'Fun', name: 'Popcorn Bucket', label: '', emoji: '🍿', bg: '#d7263d', fg: '#f3ead9', shape: 'circle' },
  { id: 'k-waffle', cat: 'Fun', name: 'Waffle Smile', label: '', emoji: '🧇', bg: '#c9a279', fg: '#78350f', shape: 'circle' },
  { id: 'k-pig', cat: 'Fun', name: 'A Pig Deal', label: 'BIG DEAL', emoji: '🐷', bg: '#ff4f9a', fg: '#15151a', shape: 'shield' },
  { id: 'k-dino', cat: 'Fun', name: 'Baby Dinosaur', label: '', emoji: '🦕', bg: '#a3e635', fg: '#15151a', shape: 'circle' },

  // ---- Heritage ----
  { id: 'h-phsun', cat: 'Heritage', name: 'Philippines Sun', label: '', emoji: '☀️', bg: '#13224a', fg: '#ffcf33', shape: 'circle' },
  { id: 'h-phflags', cat: 'Heritage', name: 'Philippines USA Flags', label: '', emoji: '🇵🇭', emoji2: '🇺🇸', bg: '#f3ead9', fg: '#d7263d', shape: 'rect' },
  { id: 'h-svflag', cat: 'Heritage', name: 'El Salvador Flag Outline', label: 'SV', emoji: '🇸🇻', bg: '#13224a', fg: '#8ed8f8', shape: 'shield' },
  { id: 'h-dancer', cat: 'Heritage', name: 'El Salvador Dancer', label: '', emoji: '💃', bg: '#6a3df0', fg: '#ffcf33', shape: 'circle' },
  { id: 'h-adobo', cat: 'Heritage', name: 'Adobo Chicken', label: '', emoji: '🍗', bg: '#78350f', fg: '#ffcf33', shape: 'rect' },
  { id: 'h-halohalo', cat: 'Heritage', name: 'Halo Halo Dessert', label: '', emoji: '🍧', bg: '#ff4f9a', fg: '#f3ead9', shape: 'circle' },
  { id: 'h-buddha', cat: 'Heritage', name: 'Happy Buddha', label: '', emoji: '🧘', bg: '#f3712b', fg: '#15151a', shape: 'circle' },

  // ---- Parks ----
  { id: 'p-zion', cat: 'Parks', name: 'Zion NP Butte', label: 'ZION', emoji: '🏜️', bg: '#7c2d12', fg: '#ffcf33', shape: 'rect' },
  { id: 'p-peaks', cat: 'Parks', name: 'Mountain Range Badge', label: 'EXPLORE', emoji: '🏔️', bg: '#13224a', fg: '#8ed8f8', shape: 'shield' },
  { id: 'p-pines', cat: 'Parks', name: 'Pine Forest Patch', label: 'WANDER', emoji: '🌲', bg: '#052e16', fg: '#a3e635', shape: 'circle' },
  { id: 'p-wave', cat: 'Parks', name: 'Coastal Wave', label: 'SALT LIFE', emoji: '🌊', bg: '#0e7490', fg: '#f3ead9', shape: 'rect' },
];

const CATEGORIES = ['Mascots', 'Stars', 'Faith', 'Sports', 'Nature', 'Space', 'Fun', 'Heritage', 'Parks'];

const PLACEMENTS = [
  { id: 'front', label: 'Front', phi: 0, polar: 0.92, scale: 1.0, view: 'front' },
  { id: 'left', label: 'Left Side', phi: -Math.PI / 2, polar: 1.15, scale: 0.72, view: 'left' },
  { id: 'right', label: 'Right Side', phi: Math.PI / 2, polar: 1.15, scale: 0.72, view: 'right' },
  { id: 'back', label: 'Back', phi: Math.PI, polar: 1.12, scale: 0.8, view: 'back' },
  { id: 'bill', label: 'Bill', bill: true, scale: 0.6, view: 'top' },
];

// Decoration methods offered on real patch orders.
const DECORATIONS = [
  { id: 'embroidered', name: 'Embroidered', up: 0 },
  { id: 'print', name: 'Print Stitch', up: 2 },
  { id: 'woven', name: 'Woven', up: 3 },
  { id: 'sublimated', name: 'Sublimated', up: 3 },
  { id: 'metflex', name: 'Metflex', up: 5 },
  { id: 'leather', name: 'Leather', up: 5 },
  { id: 'pvc', name: 'PVC / Rubber', up: 5 },
  { id: 'chenille', name: 'Chenille', up: 6 },
];

/* Embroidery thread stocks, fonts and lettering sizes. Fonts are the ones
   preloaded in index.html so the canvas texture matches the on-screen preview. */
const FONTS = [
  { id: 'block',  name: 'Varsity Block', css: '"Archivo Black", Impact, sans-serif', weight: '400', track: 0.04 },
  { id: 'athletic', name: 'Athletic',    css: '"Graduate", "Archivo Black", serif',  weight: '400', track: 0.06 },
  { id: 'condensed', name: 'Condensed',  css: '"Bebas Neue", Impact, sans-serif',    weight: '400', track: 0.08 },
  { id: 'script', name: 'Script',        css: '"Pacifico", cursive',                 weight: '400', track: 0.0  },
  { id: 'marker', name: 'Marker',        css: '"Permanent Marker", cursive',         weight: '400', track: 0.02 },
  { id: 'serif',  name: 'Classic Serif', css: '"Playfair Display", Georgia, serif',  weight: '900', track: 0.02 },
  { id: 'tech',   name: 'Tech',          css: '"Rajdhani", sans-serif',              weight: '700', track: 0.07 },
  { id: 'round',  name: 'Rounded',       css: '"Baloo 2", sans-serif',               weight: '800', track: 0.03 },
];

const TEXT_SIZES = [
  { id: 'sm', label: 'Small', scale: 0.72 },
  { id: 'md', label: 'Medium', scale: 1.0 },
  { id: 'lg', label: 'Large', scale: 1.28 },
];

// Text can be stitched on any of the four sides (not the bill).
const TEXT_PLACEMENTS = ['front', 'left', 'right', 'back'];
const MAX_TEXT = 22;
// Lettering can be stacked into rows, e.g. "EST." over "2026".
const MAX_LINES = 3;

// Clamp raw input to the line/character budget, keeping blank rows intact
// while typing so the caret doesn't jump.
function sanitizeText(raw) {
  return String(raw ?? '')
    .replace(/\r/g, '')
    .split('\n')
    .slice(0, MAX_LINES)
    .map(l => l.slice(0, MAX_TEXT))
    .join('\n');
}

// The rows actually stitched: trimmed, blanks dropped.
function stackLines(entry) {
  return String(entry?.text ?? '')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .slice(0, MAX_LINES);
}

// First decorated side is $4, every additional side is $10.
const FIRST_SIDE = 4;
const EXTRA_SIDE = 10;
const BULK_QTY = 5;
const BULK_DISCOUNT = 0.10;
const POINTS_PER_REWARD = 200;   // Access Pass: 200 points = one $10 reward
const REWARD_VALUE = 10;
const PREMIUM_AT = 1000;         // points needed for Premium tier

/* ---------- design state ---------- */

const design = {
  style: 'clubhouse',
  size: 'ml',
  crown: '#13224a',
  bill: '#13224a',
  mesh: '#f3ead9',
  accent: '#f3ead9',
  patches: {}, // placementId -> patchId
  texts: {},   // placementId -> { text, font, size, color }
  deco: 'embroidered',
  qty: 1,
  name: '',
  points: 0,
  rewardsApplied: 0,
  enrolled: null,
};

/* ============================================================
   Patch artwork (shared by 2D thumbnails and 3D textures)
   ============================================================ */

function drawPatch(ctx, size, patch) {
  const s = size;
  ctx.clearRect(0, 0, s, s);
  ctx.save();
  ctx.translate(s / 2, s / 2);

  const r = s * 0.44;
  ctx.beginPath();
  if (patch.shape === 'circle') {
    ctx.arc(0, 0, r, 0, Math.PI * 2);
  } else if (patch.shape === 'shield') {
    ctx.moveTo(-r, -r * 0.92);
    ctx.lineTo(r, -r * 0.92);
    ctx.lineTo(r, r * 0.2);
    ctx.quadraticCurveTo(r * 0.9, r, 0, r);
    ctx.quadraticCurveTo(-r * 0.9, r, -r, r * 0.2);
    ctx.closePath();
  } else {
    const rr = r * 0.3;
    const w = r, h = r * 0.82;
    ctx.moveTo(-w + rr, -h);
    ctx.arcTo(w, -h, w, h, rr);
    ctx.arcTo(w, h, -w, h, rr);
    ctx.arcTo(-w, h, -w, -h, rr);
    ctx.arcTo(-w, -h, w, -h, rr);
    ctx.closePath();
  }
  ctx.fillStyle = patch.bg;
  ctx.fill();

  // embroidered merrow border
  ctx.lineWidth = s * 0.055;
  ctx.strokeStyle = patch.fg;
  ctx.stroke();
  ctx.lineWidth = s * 0.02;
  ctx.setLineDash([s * 0.035, s * 0.035]);
  ctx.strokeStyle = patch.bg;
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (patch.kind === 'star') {
    drawStar(ctx, 0, 0, patch.points || 5, r * 0.66, r * 0.3, patch.fg, patch.fg2);
  } else {
    const hasLabel = !!patch.label;
    ctx.font = `${Math.round(s * (hasLabel ? 0.34 : 0.42))}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
    ctx.fillText(patch.emoji, 0, hasLabel ? -s * 0.08 : 0);

    if (patch.emoji2) {
      ctx.font = `${Math.round(s * 0.17)}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      ctx.fillText(patch.emoji2, r * 0.46, hasLabel ? r * 0.08 : r * 0.44);
    }
    if (hasLabel) {
      ctx.fillStyle = patch.fg;
      let size = Math.round(s * 0.15);
      ctx.font = `900 ${size}px "Archivo Black", Impact, sans-serif`;
      while (ctx.measureText(patch.label).width > r * 1.6 && size > 8) {
        size -= 1;
        ctx.font = `900 ${size}px "Archivo Black", Impact, sans-serif`;
      }
      ctx.fillText(patch.label, 0, s * 0.21);
    }
  }

  ctx.restore();
}

// Two-tone embroidered star, as in the gallery's star patches.
function drawStar(ctx, cx, cy, points, outer, inner, fill, accent) {
  const path = (ro, ri) => {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const ang = (i * Math.PI) / points - Math.PI / 2;
      const rad = i % 2 ? ri : ro;
      const x = cx + Math.cos(ang) * rad;
      const y = cy + Math.sin(ang) * rad;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
  };
  path(outer, inner);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = outer * 0.14;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = accent;
  ctx.stroke();
  path(outer * 0.52, inner * 0.52);
  ctx.fillStyle = accent;
  ctx.fill();
}

function makePatchTexture(patch) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  drawPatch(c.getContext('2d'), 512, patch);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ---------- custom lettering ---------- */

const TEXT_TEX_W = 1024, TEXT_TEX_H = 256;

/**
 * Draws stitched lettering. Real embroidery has no flat fill: the thread
 * catches light along the stitch direction, so each glyph is built from a
 * dark underlay, a satin-stitch body, and a bright highlight offset up-left.
 * `bg` paints a backing (used for the 2D preview); the 3D texture leaves it
 * transparent so the lettering sits directly on the fabric.
 */
function drawEmbroideryText(ctx, w, h, entry, bg = null) {
  const font = FONTS.find(f => f.id === entry.font) || FONTS[0];
  const lines = stackLines(entry);
  ctx.clearRect(0, 0, w, h);
  if (bg) { ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); }
  if (!lines.length) return;

  /* Each row gets an equal horizontal band. Callers grow the canvas with the
     row count, so a band stays the same height whether there's one row or
     three — stacking makes the block taller instead of shrinking the glyphs. */
  const band = h / lines.length;
  const track = font.track * band * 0.42;
  const maxW = w * 0.9;
  const light = shade(entry.color, 0.42);
  const dark = shade(entry.color, -0.5);

  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  lines.forEach((line, i) => {
    const measure = s => {
      ctx.font = `${font.weight} ${s}px ${font.css}`;
      return ctx.measureText(line).width + track * Math.max(0, line.length - 1);
    };
    // shrink to fit the available width, accounting for letter tracking
    let size = band * 0.56;
    while (measure(size) > maxW && size > 10) size -= 2;

    const totalW = measure(size);
    ctx.font = `${font.weight} ${size}px ${font.css}`;
    const cy = band * (i + 0.5);

    // one pass per layer so tracking stays consistent across all three
    const pass = (dx, dy, fill) => {
      let x = (w - totalW) / 2;
      ctx.fillStyle = fill;
      for (const ch of line) {
        ctx.fillText(ch, x + dx, cy + dy);
        x += ctx.measureText(ch).width + track;
      }
    };

    const d = Math.max(1.5, size * 0.035);
    pass(d * 0.9, d * 0.9, dark);     // shadow under the stitch
    pass(0, 0, entry.color);          // satin body
    pass(-d * 0.5, -d * 0.5, light);  // thread sheen
    pass(0, 0, entry.color);          // re-lay the body so the sheen reads as an edge
  });
}

// Lighten (amt > 0) or darken (amt < 0) a hex color.
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(v =>
    Math.round(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))
  );
  return `rgb(${ch[0]}, ${ch[1]}, ${ch[2]})`;
}

function makeTextTexture(entry) {
  const c = document.createElement('canvas');
  // One texture band per stitched row keeps glyph resolution constant.
  const rows = Math.max(1, stackLines(entry).length);
  c.width = TEXT_TEX_W;
  c.height = TEXT_TEX_H * rows;
  drawEmbroideryText(c.getContext('2d'), c.width, c.height, entry);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ---------- fabric / seam / mesh textures ---------- */

/* Woven twill: diagonal rib pattern.
   `strength` scales the contrast. The bump map wants the full-contrast weave
   because it only drives surface relief, but a colour map multiplies the
   chosen hue — high contrast there makes one swatch read as several shades.
   Colour maps therefore use a faint weave and let the bump carry the texture. */
function paintTwill(ctx, w, h, scale, strength = 1) {
  const a = v => (v * strength).toFixed(3);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.lineWidth = scale * 0.55;
  for (let d = -h; d < w + h; d += scale) {
    ctx.strokeStyle = `rgba(0,0,0,${a(0.10)})`;
    ctx.beginPath(); ctx.moveTo(d, 0); ctx.lineTo(d + h, h); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${a(0.55)})`;
    ctx.beginPath(); ctx.moveTo(d + scale * 0.5, 0); ctx.lineTo(d + scale * 0.5 + h, h); ctx.stroke();
  }
  for (let i = 0; i < w * h * 0.02; i++) {
    ctx.fillStyle = `rgba(0,0,0,${(Math.random() * 0.05 * strength).toFixed(3)})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
  }
}

// How much of the weave/seam contrast survives into a colour map.
const ALBEDO_CONTRAST = 0.3;

function makeCrownTexture() {
  const c = document.createElement('canvas');
  c.width = 2048; c.height = 1024;
  const ctx = c.getContext('2d');
  paintTwill(ctx, c.width, c.height, 7, ALBEDO_CONTRAST);

  // six panel seams: shadow valley, raised fold, and flat-lock topstitching
  const k = ALBEDO_CONTRAST;
  for (let p = 0; p < 6; p++) {
    const x = (p / 6) * c.width;
    ctx.strokeStyle = `rgba(0,0,0,${0.30 * k})`;
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, c.height); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${0.28 * k})`;
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x - 6, 0); ctx.lineTo(x - 6, c.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 6, 0); ctx.lineTo(x + 6, c.height); ctx.stroke();

    // topstitching stays a little crisper than the weave so seams still read
    ctx.strokeStyle = `rgba(255,255,255,${0.65 * k * 1.6})`;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 12]);
    ctx.beginPath(); ctx.moveTo(x - 17, 0); ctx.lineTo(x - 17, c.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + 17, 0); ctx.lineTo(x + 17, c.height); ctx.stroke();
    ctx.setLineDash([]);
  }

  /* No baked base shading: darkening the lower third of the albedo made a
     single swatch look like two tones. Contact shading at the headband comes
     from the lighting and the sweatband geometry instead. */

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  /* The trucker's front panel is built from a phi range centred on zero, so
     half its UVs are negative. Clamping (the default) smeared texture column 0
     -- a panel seam -- across that whole half. Repeat wraps it correctly. */
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function makeBumpTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  paintTwill(c.getContext('2d'), 512, 512, 6);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(5, 3);
  return tex;
}

function makeBillTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const ctx = c.getContext('2d');
  paintTwill(ctx, c.width, c.height, 7, ALBEDO_CONTRAST);
  // concentric rows of topstitching running parallel to the bill edge
  const k = ALBEDO_CONTRAST * 1.6;
  ctx.lineWidth = 4;
  ctx.setLineDash([11, 13]);
  for (let i = 1; i <= 6; i++) {
    const y = c.height * (0.12 + i * 0.125);
    ctx.strokeStyle = `rgba(255,255,255,${0.55 * k})`;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(c.width, y); ctx.stroke();
    ctx.strokeStyle = `rgba(0,0,0,${0.18 * k})`;
    ctx.beginPath(); ctx.moveTo(0, y + 3); ctx.lineTo(c.width, y + 3); ctx.stroke();
  }
  ctx.setLineDash([]);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

function makeMeshAlphaTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 5.5;
  for (let i = 0; i <= 128; i += 16) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 128); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(128, i); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(22, 11);
  return tex;
}

function makeShadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 126);
  g.addColorStop(0, 'rgba(40,20,70,0.5)');
  g.addColorStop(0.55, 'rgba(40,20,70,0.22)');
  g.addColorStop(1, 'rgba(40,20,70,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/* ============================================================
   Geometry builders
   ============================================================ */

/* A real head opening is an oval: longer front-to-back than side-to-side. */
const HEAD_WIDTH = 0.87;
const PANELS = 6;

/**
 * Parametric cap crown.
 *
 * The silhouette comes from measuring a blank New Era 59FIFTY: sampling the
 * back view every 5% of crown height and fitting the radius gives
 * r = 1 - (1 - v)^k with k ~= 7 (RMS 0.018 across the whole profile).
 * That curve is why a real cap reads as a cap — it flares to nearly full
 * width within the top third, then runs essentially straight down to the
 * headband, instead of curving continuously like a dome.
 *
 * phi: 0 = front (+Z), sweeping counter-clockwise.  t: 0 = button, PI/2 = opening.
 */
function crownPoint(phi, t, style, target = new THREE.Vector3()) {
  const H = style.crownHeight;
  const c = style.crown;
  const s = THREE.MathUtils.clamp(t / (Math.PI / 2), 0, 1);  // 0 = button, 1 = opening

  let y = H * (1 - s);
  let r = 1 - Math.pow(1 - s, c.k);

  /* Shaping is confined to the upper crown so the lower wall stays plumb. */
  const shape = s < 0.8 ? Math.sin((Math.PI * s) / 0.8) : 0;
  const frontness = Math.max(0, Math.cos(phi));

  // structured caps stand taller and push forward across the two front panels
  y += c.frontRise * H * frontness * frontness * shape;
  r *= 1 + c.frontBulge * frontness * shape;

  // soft caps slump toward the back
  if (c.slouch) y -= c.slouch * H * Math.max(0, -Math.cos(phi)) * shape;

  // six panels are cut flat, so the crown pinches in between the seams
  const edgeFade = Math.min(1, (1 - s) / 0.12);
  r *= 1 - c.panel * Math.pow(Math.sin((PANELS * phi) / 2), 2) * edgeFade;

  // raised fold along each panel seam, fading out at the opening
  const seamPhase = (phi * PANELS) / (Math.PI * 2);
  const d = Math.abs(seamPhase - Math.round(seamPhase)) * ((Math.PI * 2) / PANELS);
  const ridge = c.seam * Math.exp(-Math.pow(d / 0.1, 2)) * edgeFade;
  r += ridge;
  y += ridge * 0.5 * shape;

  return target.set(Math.sin(phi) * r * HEAD_WIDTH, y, Math.cos(phi) * r);
}

function crownNormal(phi, t, style, target = new THREE.Vector3()) {
  const e = 0.004;
  const p = crownPoint(phi, t, style, new THREE.Vector3());
  const dPhi = crownPoint(phi + e, t, style, new THREE.Vector3()).sub(p);
  const dT = crownPoint(phi, Math.min(Math.PI / 2 - 1e-4, t + e), style, new THREE.Vector3()).sub(p);
  return target.crossVectors(dT, dPhi).normalize();
}

function buildCrownGeometry(style, phiStart = 0, phiLength = Math.PI * 2) {
  const nPhi = Math.max(24, Math.round(192 * (phiLength / (Math.PI * 2))));
  const nT = 56;
  const closed = phiLength >= Math.PI * 2 - 1e-6;
  const pos = [], uv = [], idx = [];
  const v = new THREE.Vector3();
  const ring = nT + 1;

  for (let i = 0; i <= nPhi; i++) {
    const f = i / nPhi;
    const phi = phiStart + f * phiLength;
    for (let j = 0; j <= nT; j++) {
      // bias samples toward the button, where the profile curves hardest
      const t = Math.pow(j / nT, 1.3) * (Math.PI / 2);
      crownPoint(phi, t, style, v);
      pos.push(v.x, v.y, v.z);
      uv.push(phi / (Math.PI * 2), 1 - Math.pow(j / nT, 1.3));
    }
  }
  for (let i = 0; i < nPhi; i++) {
    const i2 = closed && i === nPhi - 1 ? 0 : i + 1;
    for (let j = 0; j < nT; j++) {
      const a = i * ring + j, b = i2 * ring + j;
      idx.push(a, a + 1, b, b, a + 1, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/**
 * Bill / visor. The root follows the oval crown opening, then sweeps outward,
 * drooping and curling while tapering from a thick root to a thin edge.
 */
function billSurface(cfg, a, u, target = new THREE.Vector3()) {
  const { length, droop, curl, width } = cfg;
  const sa = Math.sin(a), ca = Math.cos(a);
  const rootX = sa * HEAD_WIDTH * 0.985;
  const rootZ = ca * 0.985;
  // outward direction, widened at the sides so the visor flares past the head
  let dx = sa * width, dz = ca;
  const n = Math.hypot(dx, dz) || 1;
  dx /= n; dz /= n;

  /* Spade outline: full reach straight ahead, falling away quickly toward the
     corners so the visor is only slightly wider than the crown at its root —
     measured at about 1.08x crown width on the reference cap. */
  const span = length * Math.pow(Math.max(0, Math.cos(a * 0.98)), 1.5);

  /* A pre-curved bill is a stiff panel rolled around a left-right axis, so it
     follows a circular arc rather than sagging. `droop` is the total bend in
     radians across the full reach; the flat bill just uses a tiny value. */
  const bend = Math.max(1e-3, droop);
  const radius = span / bend;
  const reach = radius * Math.sin(bend * u);
  let y = -radius * (1 - Math.cos(bend * u));

  // the side edges lift as the panel rolls, giving the visor its banana curve
  y += curl * sa * sa * u * u;
  // the root tucks just under the headband binding
  y -= 0.012 * (1 - u);

  return target.set(rootX + dx * reach, y, rootZ + dz * reach);
}

function buildBrimGeometry(cfg) {
  const { thickness } = cfg;
  const na = 72, nr = 22;
  const aMax = THREE.MathUtils.degToRad(92);

  const pos = [], uv = [];
  // Top and bottom triangles are collected separately: a material group is a
  // contiguous slice of the index buffer, so the two surfaces must not interleave.
  const topIdx = [], underIdx = [];
  const ring = nr + 1;
  const half = (na + 1) * ring;
  const tmp = new THREE.Vector3();

  const surface = (a, u) => {
    billSurface(cfg, a, u, tmp);
    return [tmp.x, tmp.y, tmp.z];
  };
  // thick at the root where it meets the crown, thin at the stitched edge
  const halfThick = u => (thickness / 2) * (1 - 0.55 * u * u);

  for (let side = 0; side < 2; side++) {
    const sgn = side === 0 ? 1 : -1;
    for (let i = 0; i <= na; i++) {
      const a = -aMax + (i / na) * aMax * 2;
      for (let j = 0; j <= nr; j++) {
        const u = j / nr;
        const [x, y, z] = surface(a, u);
        pos.push(x, y + sgn * halfThick(u), z);
        uv.push(i / na, 1 - u);
      }
    }
  }

  for (let i = 0; i < na; i++) {
    for (let j = 0; j < nr; j++) {
      const a0 = i * ring + j, a1 = a0 + ring, b0 = a0 + 1, b1 = a1 + 1;
      topIdx.push(a0, a1, b0, b0, a1, b1);
      const c0 = half + a0, c1 = half + a1, d0 = half + b0, d1 = half + b1;
      underIdx.push(c0, d0, c1, c1, d0, d1);
    }
  }
  // sewn edge band, which belongs to the underbill group
  for (let i = 0; i < na; i++) {
    const t0 = i * ring + nr, t1 = (i + 1) * ring + nr;
    const b0 = half + t0, b1 = half + t1;
    underIdx.push(t0, b0, t1, t1, b0, b1);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(topIdx.concat(underIdx));
  geo.computeVertexNormals();

  // group 0 = top surface, group 1 = underbill + edge
  geo.addGroup(0, topIdx.length, 0);
  geo.addGroup(topIdx.length, underIdx.length, 1);
  return geo;
}

function buildCurvedPatchGeometry(w, h) {
  const nx = 16, ny = 12, bend = 0.9;
  const pos = [], uv = [], idx = [];
  for (let i = 0; i <= nx; i++) {
    for (let j = 0; j <= ny; j++) {
      const u = i / nx, v = j / ny;
      const x = (u - 0.5) * w;
      const y = (v - 0.5) * h;
      const z = -(x * x + y * y * 0.6) / (2 * bend);
      pos.push(x, y, z);
      uv.push(u, v);
    }
  }
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      const a = i * (ny + 1) + j, b = a + ny + 1;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

/* ============================================================
   Scene setup
   ============================================================ */

const viewport = document.getElementById('viewport');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(1.7, 1.6, 3.9);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
viewport.appendChild(renderer.domElement);

// Image-based lighting gives the fabric believable soft falloff and sheen.
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.05).texture;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.target.set(0, 0.52, 0);
controls.minDistance = 2.2;
controls.maxDistance = 7;
controls.maxPolarAngle = Math.PI * 0.86;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.6;
controls.enablePan = false;

scene.add(new THREE.HemisphereLight(0xffffff, 0xd9c8ff, 0.75));
const key = new THREE.DirectionalLight(0xfff6e8, 2.0);
key.position.set(3.2, 5.2, 3.4);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.radius = 4;
key.shadow.bias = -0.0012;
const sc = key.shadow.camera;
sc.near = 1; sc.far = 16; sc.left = -3; sc.right = 3; sc.top = 3; sc.bottom = -3;
scene.add(key);
const rim = new THREE.DirectionalLight(0xff8fc0, 0.75);
rim.position.set(-4, 2.4, -3);
scene.add(rim);
const fill = new THREE.DirectionalLight(0x9fe8ff, 0.55);
fill.position.set(-2.4, 0.8, 4);
scene.add(fill);

const GROUND_Y = -0.42;
const castShadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(9, 9),
  new THREE.ShadowMaterial({ opacity: 0.26 })
);
castShadowPlane.rotation.x = -Math.PI / 2;
castShadowPlane.position.y = GROUND_Y;
castShadowPlane.receiveShadow = true;
scene.add(castShadowPlane);

// soft contact blob under the hat for extra grounding
const shadowPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(4.2, 4.2),
  new THREE.MeshBasicMaterial({ map: makeShadowTexture(), transparent: true, depthWrite: false })
);
shadowPlane.rotation.x = -Math.PI / 2;
shadowPlane.position.y = GROUND_Y + 0.004;
scene.add(shadowPlane);

const hatGroup = new THREE.Group();
scene.add(hatGroup);

const crownTexture = makeCrownTexture();
const billTexture = makeBillTexture();
const bumpTexture = makeBumpTexture();
const meshAlpha = makeMeshAlphaTexture();
const patchTextures = new Map();
PATCHES.forEach(p => patchTextures.set(p.id, makePatchTexture(p)));

/* ---------- hat assembly ---------- */

let patchAnchors = {}; // placementId -> {position, quaternion}

function disposeGroup(group) {
  group.traverse(obj => {
    if (obj.isMesh) {
      obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      mats.forEach(m => m.dispose());
    }
  });
  group.clear();
}

function addMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  hatGroup.add(mesh);
  return mesh;
}

function buildHat() {
  disposeGroup(hatGroup);
  const style = STYLES[design.style];
  const h = style.crownHeight;
  const rough = style.structured ? 0.74 : 0.88;

  const fabricMat = (color, map) => new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    map,
    bumpMap: bumpTexture,
    bumpScale: style.structured ? 0.02 : 0.03,
    roughness: rough,
    metalness: 0.0,
    envMapIntensity: 0.5,
  });

  // --- crown ---
  if (style.meshBack) {
    // real truckers keep the two front panels solid and vent everything behind them
    const frontArc = THREE.MathUtils.degToRad(122);
    addMesh(
      buildCrownGeometry(style, -frontArc / 2, frontArc),
      fabricMat(design.crown, crownTexture)
    );
    addMesh(
      buildCrownGeometry(style, frontArc / 2, Math.PI * 2 - frontArc),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(design.mesh),
        alphaMap: meshAlpha,
        transparent: true,
        alphaTest: 0.4,
        roughness: 0.55,
        side: THREE.DoubleSide,
      })
    );
  } else {
    addMesh(buildCrownGeometry(style), fabricMat(design.crown, crownTexture));
    // dark interior lining so the crown reads solid from below
    const lining = new THREE.Mesh(
      buildCrownGeometry(style).scale(0.975, 0.975, 0.975),
      new THREE.MeshStandardMaterial({ color: '#2a2d35', roughness: 1, side: THREE.BackSide })
    );
    hatGroup.add(lining);
  }

  // --- fabric-covered button (squatchee) with its taped seam ---
  const button = addMesh(
    new THREE.SphereGeometry(0.058, 28, 20).scale(1, 0.72, 1),
    fabricMat(design.accent, crownTexture)
  );
  button.position.y = h + 0.012;

  // --- sweatband / binding where the crown meets the head ---
  const band = addMesh(
    new THREE.TorusGeometry(1.0, 0.022, 14, 96),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(design.accent), roughness: 0.72 })
  );
  band.rotation.x = Math.PI / 2;
  band.position.y = 0.014;
  band.scale.set(HEAD_WIDTH, 1, 1);

  // --- embroidered eyelets, one centered on each panel ---
  const eyeletMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(design.accent), roughness: 0.6,
  });
  const eyeletGeo = new THREE.TorusGeometry(0.026, 0.011, 10, 20);
  for (let i = 0; i < PANELS; i++) {
    const phi = (i + 0.5) * (Math.PI * 2 / PANELS);
    const t = 0.78;
    if (style.meshBack && Math.cos(phi) < Math.cos(THREE.MathUtils.degToRad(61))) continue;
    const p = crownPoint(phi, t, style);
    const n = crownNormal(phi, t, style);
    const eyelet = addMesh(eyeletGeo.clone(), eyeletMat);
    eyelet.position.copy(p).addScaledVector(n, 0.004);
    eyelet.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
  }
  eyeletGeo.dispose();

  // --- bill ---
  const billTop = fabricMat(design.bill, billTexture);
  const underBill = new THREE.MeshStandardMaterial({
    color: new THREE.Color(style.id === 'flatbill' ? '#1b1b22' : '#3a3e48'),
    roughness: 0.95, side: THREE.DoubleSide,
  });
  const bill = addMesh(buildBrimGeometry(style.bill), [billTop, underBill]);
  bill.position.y = 0.034;
  bill.rotation.x = style.bill.tilt;

  // stitched binding hiding the seam where the visor is sewn into the crown
  const billSeam = addMesh(
    new THREE.TorusGeometry(0.995, 0.019, 10, 64, Math.PI * 1.06),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(design.bill), roughness: 0.8 })
  );
  billSeam.rotation.x = Math.PI / 2;
  billSeam.rotation.z = Math.PI * 0.97;
  billSeam.position.y = 0.03;
  billSeam.scale.set(HEAD_WIDTH, 1, 1);

  // --- closure ---
  if (style.strap === 'snap') {
    const strapMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(design.accent), roughness: 0.35, metalness: 0.05,
    });
    const strap = addMesh(new THREE.TorusGeometry(1.012, 0.038, 12, 48, Math.PI * 0.62), strapMat);
    strap.rotation.x = Math.PI / 2;
    strap.rotation.z = Math.PI * 0.19;
    strap.position.y = 0.062;
    strap.scale.set(HEAD_WIDTH, 1, 1);
    // snap studs
    for (let i = 0; i < 5; i++) {
      const a = Math.PI - 0.42 + i * 0.21;
      const stud = addMesh(
        new THREE.CylinderGeometry(0.016, 0.016, 0.012, 12),
        new THREE.MeshStandardMaterial({ color: '#e8e8ee', roughness: 0.25, metalness: 0.6 })
      );
      stud.position.set(Math.sin(a) * 1.04 * HEAD_WIDTH, 0.062, Math.cos(a) * 1.04);
      stud.rotation.x = Math.PI / 2;
      stud.rotation.y = -a;
    }
  } else if (style.strap === 'buckle') {
    const strapMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(design.crown), roughness: 0.8,
    });
    const strap = addMesh(new THREE.TorusGeometry(1.012, 0.028, 10, 40, Math.PI * 0.55), strapMat);
    strap.rotation.x = Math.PI / 2;
    strap.rotation.z = Math.PI * 0.225;
    strap.position.y = 0.062;
    strap.scale.set(HEAD_WIDTH, 1, 1);
    const buckle = addMesh(
      new THREE.BoxGeometry(0.13, 0.07, 0.018),
      new THREE.MeshStandardMaterial({ color: '#c6cad3', roughness: 0.22, metalness: 0.9 })
    );
    buckle.position.set(0.1, 0.062, -1.04);
    buckle.rotation.y = 0.1;
  }

  // --- patch anchor points, read straight off the crown and bill surfaces ---
  patchAnchors = {};
  bill.updateMatrixWorld(true);
  PLACEMENTS.forEach(pl => {
    if (pl.bill) {
      const u = 0.5, e = 0.03;
      const p = billSurface(style.bill, 0, u);
      p.y += style.bill.thickness / 2;
      const dA = billSurface(style.bill, e, u).sub(billSurface(style.bill, 0, u));
      const dU = billSurface(style.bill, 0, u + e).sub(billSurface(style.bill, 0, u));
      const n = new THREE.Vector3().crossVectors(dU, dA).normalize();
      if (n.y < 0) n.negate();
      p.applyMatrix4(bill.matrix);
      n.applyQuaternion(bill.quaternion);
      patchAnchors[pl.id] = {
        position: p.addScaledVector(n, 0.01),
        quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n),
        scale: pl.scale,
      };
      return;
    }
    const p = crownPoint(pl.phi, pl.polar, style);
    const n = crownNormal(pl.phi, pl.polar, style);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n);
    patchAnchors[pl.id] = {
      position: p.clone().addScaledVector(n, 0.014),
      quaternion: quat,
      scale: pl.scale,
    };
  });

  applyPatches();
  applySize();
}

function applyPatches() {
  hatGroup.children
    .filter(c => c.userData.isPatch)
    .forEach(c => { hatGroup.remove(c); c.geometry.dispose(); c.material.dispose(); });

  Object.entries(design.patches).forEach(([placementId, patchId]) => {
    const anchor = patchAnchors[placementId];
    const patch = PATCHES.find(p => p.id === patchId);
    if (!anchor || !patch) return;
    const s = anchor.scale;
    const mesh = new THREE.Mesh(
      buildCurvedPatchGeometry(0.62 * s, 0.52 * s),
      new THREE.MeshStandardMaterial({
        map: patchTextures.get(patch.id),
        bumpMap: bumpTexture,
        bumpScale: 0.05,
        transparent: true,
        alphaTest: 0.45,
        roughness: 0.78,
        side: THREE.DoubleSide,
      })
    );
    mesh.castShadow = true;
    mesh.position.copy(anchor.position);
    mesh.quaternion.copy(anchor.quaternion);
    mesh.userData.isPatch = true;
    mesh.userData.spawn = performance.now();
    hatGroup.add(mesh);
  });

  applyTexts();
}

function applyTexts() {
  hatGroup.children
    .filter(c => c.userData.isText)
    .forEach(c => {
      hatGroup.remove(c);
      c.geometry.dispose();
      if (c.material.map) c.material.map.dispose();
      c.material.dispose();
    });

  Object.entries(design.texts).forEach(([placementId, entry]) => {
    const anchor = patchAnchors[placementId];
    if (!anchor || !entry) return;
    const rows = stackLines(entry).length;
    if (!rows) return;

    const sz = TEXT_SIZES.find(s => s.id === entry.size) || TEXT_SIZES[1];
    const s = anchor.scale * sz.scale;
    const rowH = 0.195 * s;
    const w = 0.78 * s, hgt = rowH * rows;

    const mesh = new THREE.Mesh(
      buildCurvedPatchGeometry(w, hgt),
      new THREE.MeshStandardMaterial({
        map: makeTextTexture(entry),
        bumpMap: bumpTexture,
        bumpScale: 0.05,
        transparent: true,
        alphaTest: 0.35,
        roughness: 0.62,
        side: THREE.DoubleSide,
      })
    );
    mesh.castShadow = true;
    mesh.position.copy(anchor.position);
    mesh.quaternion.copy(anchor.quaternion);

    /* Drop the lettering below a patch on the same side so the two never
       overlap; otherwise centre it on the panel. The mesh grows about its
       centre, so a taller stack needs the extra half-height of clearance. */
    const drop = design.patches[placementId]
      ? 0.3 * anchor.scale + (rows - 1) * rowH * 0.5
      : 0;
    if (drop) {
      const down = new THREE.Vector3(0, -1, 0).applyQuaternion(anchor.quaternion);
      mesh.position.addScaledVector(down, drop);
    }

    mesh.userData.isText = true;
    mesh.userData.spawn = performance.now();
    hatGroup.add(mesh);
  });
}

function applySize() {
  const size = SIZES.find(s => s.id === design.size) || SIZES[1];
  hatGroup.scale.setScalar(size.scale);
}

/* ---------- render loop + camera moves ---------- */

let camTarget = null;

function resize() {
  const w = viewport.clientWidth, hgt = viewport.clientHeight;
  if (!w || !hgt) return;
  renderer.setSize(w, hgt, false);
  camera.aspect = w / hgt;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(viewport);
resize();

function flyTo(view) {
  const map = {
    front: [0, 0.95, 3.8],
    back: [0, 0.95, -3.8],
    left: [-3.8, 0.9, 0.01],
    right: [3.8, 0.9, 0.01],
    top: [0.01, 3.7, 1.3],
  };
  camTarget = new THREE.Vector3(...map[view]);
  controls.autoRotate = false;
  syncSpinBtn();
}

renderer.domElement.addEventListener('pointerdown', () => { camTarget = null; });

function animate() {
  requestAnimationFrame(animate);
  if (camTarget) {
    camera.position.lerp(camTarget, 0.1);
    if (camera.position.distanceTo(camTarget) < 0.02) camTarget = null;
  }
  // playful pop-in animation for freshly added patches
  const now = performance.now();
  hatGroup.children.forEach(c => {
    if (!c.userData.isPatch) return;
    const t = Math.min(1, (now - c.userData.spawn) / 420);
    const e = 1 + Math.sin(t * Math.PI) * 0.22 * (1 - t);
    c.scale.setScalar(t < 1 ? t * e : 1);
  });
  controls.update();
  renderer.render(scene, camera);
}

/* ============================================================
   UI wiring
   ============================================================ */

const el = id => document.getElementById(id);
let activeLeague = CATEGORIES[0];
let activePlacement = 'front';
let patchQuery = '';
let activeTextPlacement = 'front';
// Holds in-progress font/size/color choices while the text box is still empty.
let pendingText = { text: '', font: 'block', size: 'md', color: '#f3ead9' };

function renderStyles() {
  const grid = el('styleGrid');
  grid.innerHTML = '';
  Object.values(STYLES).forEach(style => {
    const b = document.createElement('button');
    b.className = 'style-card';
    b.type = 'button';
    b.setAttribute('aria-pressed', String(design.style === style.id));
    b.innerHTML = `<span class="emoji">${style.emoji}</span>
      <span class="name">${style.name}</span>
      <span class="price">$${style.price.toFixed(2)}</span>`;
    b.onclick = () => {
      design.style = style.id;
      const palette = STYLES[style.id].colors;
      if (!palette.includes(design.crown)) design.crown = palette[0];
      if (!palette.includes(design.bill)) design.bill = palette[0];
      if (style.strap !== 'none' && design.size.startsWith('7')) design.size = 'ml';
      if (style.strap === 'none' && !design.size.startsWith('7')) design.size = '714';
      renderAll();
      buildHat();
    };
    grid.appendChild(b);
  });
  const style = STYLES[design.style];
  el('specChips').innerHTML = [style.spec.fit, style.spec.crownSpec, style.spec.billSpec, style.spec.closure]
    .map(s => `<span>${s}</span>`).join('');
  el('styleBlurb').textContent = style.blurb;
  el('styleFabric').textContent = `Made of ${style.fabric}`;
}

function renderSizes() {
  const row = el('sizeRow');
  const style = STYLES[design.style];
  const wanted = style.strap === 'none' ? 'fitted' : 'adjustable';
  row.innerHTML = '';
  SIZES.filter(s => s.fits === wanted).forEach(size => {
    const b = document.createElement('button');
    b.className = 'pill';
    b.type = 'button';
    b.textContent = size.label;
    b.setAttribute('aria-pressed', String(design.size === size.id));
    b.onclick = () => { design.size = size.id; renderAll(); applySize(); };
    row.appendChild(b);
  });
}

function renderSwatches(containerId, colors, key) {
  const box = el(containerId);
  box.innerHTML = '';
  colors.forEach(c => {
    const hex = typeof c === 'string' ? c : c.hex;
    const name = typeof c === 'string'
      ? (PALETTES.core.find(p => p.hex === hex)?.name ?? hex)
      : c.name;
    const b = document.createElement('button');
    b.className = 'swatch';
    b.type = 'button';
    b.title = name;
    b.style.background = hex;
    b.setAttribute('aria-pressed', String(design[key] === hex));
    b.onclick = () => { design[key] = hex; renderAll(); buildHat(); };
    box.appendChild(b);
  });
}

function renderColors() {
  const style = STYLES[design.style];
  renderSwatches('crownSwatches', style.colors, 'crown');
  renderSwatches('billSwatches', style.colors, 'bill');
  el('meshBlock').hidden = !style.meshBack;
  if (style.meshBack) renderSwatches('meshSwatches', ['#f3ead9', '#15151a', '#9aa0ab', '#8ed8f8', '#ff4f9a', '#ffcf33'], 'mesh');
  renderSwatches('accentSwatches', PALETTES.accent, 'accent');
}

function renderPatches() {
  const query = patchQuery.trim().toLowerCase();
  const tabs = el('leagueTabs');
  tabs.innerHTML = '';
  CATEGORIES.forEach(l => {
    const b = document.createElement('button');
    b.className = 'tab';
    b.type = 'button';
    b.textContent = l;
    b.setAttribute('aria-pressed', String(!query && activeLeague === l));
    b.onclick = () => {
      activeLeague = l;
      patchQuery = '';
      el('patchSearch').value = '';
      renderPatches();
    };
    tabs.appendChild(b);
  });

  const matches = query
    ? PATCHES.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.cat.toLowerCase().includes(query) ||
        (p.label || '').toLowerCase().includes(query))
    : PATCHES.filter(p => p.cat === activeLeague);

  const grid = el('patchGrid');
  grid.innerHTML = '';
  el('patchCount').textContent = query
    ? `${matches.length} design${matches.length === 1 ? '' : 's'} matching “${patchQuery.trim()}”`
    : `${matches.length} designs in ${activeLeague} · ${PATCHES.length} shown of 10,000+`;

  if (!matches.length) {
    grid.innerHTML = '<p class="patch-empty">No designs match that search. Our team can also digitize your own logo.</p>';
  }

  matches.forEach(p => {
    const b = document.createElement('button');
    b.className = 'patch-btn';
    b.type = 'button';
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    drawPatch(c.getContext('2d'), 128, p);
    const label = document.createElement('span');
    label.textContent = p.name;
    b.append(c, label);
    b.onclick = () => {
      design.patches[activePlacement] = p.id;
      renderApplied();
      applyPatches();
      renderSummary();
      const pl = PLACEMENTS.find(x => x.id === activePlacement);
      if (pl) flyTo(pl.view);
    };
    grid.appendChild(b);
  });

  const row = el('placementRow');
  row.innerHTML = '';
  PLACEMENTS.forEach(pl => {
    const b = document.createElement('button');
    b.className = 'pill';
    b.type = 'button';
    b.textContent = pl.label;
    b.setAttribute('aria-pressed', String(activePlacement === pl.id));
    b.onclick = () => { activePlacement = pl.id; renderPatches(); };
    row.appendChild(b);
  });

  const decoBox = el('decoRow');
  decoBox.innerHTML = '';
  DECORATIONS.forEach(d => {
    const b = document.createElement('button');
    b.className = 'pill';
    b.type = 'button';
    b.textContent = d.up ? `${d.name} +$${d.up}` : d.name;
    b.setAttribute('aria-pressed', String(design.deco === d.id));
    b.onclick = () => { design.deco = d.id; renderPatches(); renderSummary(); };
    decoBox.appendChild(b);
  });

  renderApplied();
}

function renderOrder() {
  const b = priceBreakdown();
  el('qtyCount').textContent = String(b.qty);
  el('qtyMinus').disabled = b.qty <= 1;
  el('qtyNote').textContent = b.qty >= BULK_QTY
    ? `Bulk pricing applied — 10% off ${b.qty} hats 🎉`
    : `Order ${BULK_QTY - b.qty} more and save 10%`;

  const line = (label, value, cls = '') =>
    `<div class="${cls}"><span>${label}</span><span>${value}</span></div>`;

  const decoDetail = [
    b.patchCount ? `${b.patchCount} patch${b.patchCount > 1 ? 'es' : ''}` : '',
    b.textCount ? `${b.textCount} text` : '',
  ].filter(Boolean).join(' + ');

  el('priceLines').innerHTML =
    line(`${b.style.name}`, `$${b.style.price.toFixed(2)}`) +
    (b.sideCount
      ? line(
          `${b.sideCount} decorated side${b.sideCount > 1 ? 's' : ''} (${decoDetail})`,
          `$${b.decoPerHat.toFixed(2)}`
        ) + line('First side $4 · extra sides $10', '', 'sub')
      : line('No decoration yet', '$0.00', 'sub')) +
    line(`Per hat × ${b.qty}`, `$${b.gross.toFixed(2)}`) +
    (b.bulkSaved ? line('Bulk discount (10%)', `−$${b.bulkSaved.toFixed(2)}`, 'save') : '') +
    (b.discount ? line(`Access Pass rewards (${b.rewardsUsed})`, `−$${b.discount.toFixed(2)}`, 'save') : '') +
    line('Total', `$${b.total.toFixed(2)}`, 'grand');
}

function renderApplied() {
  const box = el('appliedList');
  box.innerHTML = '';
  const entries = Object.entries(design.patches);
  if (!entries.length) {
    box.innerHTML = '<p class="hint" style="margin:0">No patches yet — pick a placement, then tap a patch.</p>';
    return;
  }
  entries.forEach(([placementId, patchId]) => {
    const patch = PATCHES.find(p => p.id === patchId);
    const pl = PLACEMENTS.find(p => p.id === placementId);
    const row = document.createElement('div');
    row.className = 'applied-row';
    row.innerHTML = `<span>${patch.emoji}</span><span>${patch.name} · ${pl.label}</span>`;
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.textContent = '✕';
    rm.onclick = () => {
      delete design.patches[placementId];
      renderApplied(); applyPatches(); renderSummary();
    };
    row.appendChild(rm);
    box.appendChild(row);
  });
}

/* ---------- custom embroidery panel ---------- */

/* The entry being edited. When a side has no lettering yet we fall back to
   pendingText, so font/size/color picked before typing aren't discarded — and
   those choices carry over to the next side, which is the useful default. */
function currentText() {
  return design.texts[activeTextPlacement] || pendingText;
}

function updateText(patch) {
  const next = { ...currentText(), ...patch };
  if ((next.text || '').trim()) {
    design.texts[activeTextPlacement] = next;
  } else {
    // an empty box means "no lettering on this side"
    delete design.texts[activeTextPlacement];
    pendingText = next;
  }
  renderEmbroidery();
  applyTexts();
  renderSummary();
}

function renderEmbroidery() {
  const entry = design.texts[activeTextPlacement] || pendingText;
  const input = el('embText');
  if (input.value !== entry.text) input.value = entry.text;

  // Grow the box with the stack so every row stays visible.
  const typedRows = (entry.text || '').split('\n').length;
  input.rows = Math.min(MAX_LINES, Math.max(2, typedRows));

  const rows = stackLines(entry);
  const longest = rows.reduce((m, l) => Math.max(m, l.length), 0);
  el('embCount').textContent = rows.length > 1
    ? `${rows.length} stacked rows · longest ${longest} / ${MAX_TEXT} characters`
    : `${longest} / ${MAX_TEXT} characters`;

  const addBtn = el('embAddLine');
  addBtn.disabled = typedRows >= MAX_LINES;
  addBtn.onclick = () => {
    if (typedRows >= MAX_LINES) return;
    updateText({ text: `${entry.text || ''}\n` });
    el('embText').focus();
  };

  // placement pills, flagging which sides already carry lettering
  const pr = el('embPlacementRow');
  pr.innerHTML = '';
  TEXT_PLACEMENTS.forEach(id => {
    const pl = PLACEMENTS.find(p => p.id === id);
    const b = document.createElement('button');
    b.className = 'pill';
    b.type = 'button';
    const has = !!design.texts[id];
    b.textContent = has ? `${pl.label} ✓` : pl.label;
    b.setAttribute('aria-pressed', String(activeTextPlacement === id));
    b.onclick = () => {
      activeTextPlacement = id;
      renderEmbroidery();
      flyTo(pl.view);
    };
    pr.appendChild(b);
  });

  const fr = el('embFontRow');
  fr.innerHTML = '';
  FONTS.forEach(f => {
    const b = document.createElement('button');
    b.className = 'font-btn';
    b.type = 'button';
    b.setAttribute('aria-pressed', String(entry.font === f.id));
    b.innerHTML = `<span class="fsample">Aa</span><span class="fname">${f.name}</span>`;
    b.querySelector('.fsample').style.font = `${f.weight} 19px ${f.css}`;
    b.onclick = () => updateText({ font: f.id });
    fr.appendChild(b);
  });

  const sr = el('embSizeRow');
  sr.innerHTML = '';
  TEXT_SIZES.forEach(s => {
    const b = document.createElement('button');
    b.className = 'pill';
    b.type = 'button';
    b.textContent = s.label;
    b.setAttribute('aria-pressed', String(entry.size === s.id));
    b.onclick = () => updateText({ size: s.id });
    sr.appendChild(b);
  });

  const cs = el('embColorSwatches');
  cs.innerHTML = '';
  PALETTES.core.forEach(c => {
    const b = document.createElement('button');
    b.className = 'swatch';
    b.type = 'button';
    b.title = c.name;
    b.style.background = c.hex;
    b.setAttribute('aria-pressed', String(entry.color === c.hex));
    b.onclick = () => updateText({ color: c.hex });
    cs.appendChild(b);
  });

  // live stitch preview on the current crown color
  const pv = el('embPreview');
  // Match the texture: one band per row, so the preview shows true proportions.
  const wantH = 150 * Math.max(1, rows.length);
  if (pv.height !== wantH) pv.height = wantH;
  const ctx = pv.getContext('2d');
  if (rows.length) {
    drawEmbroideryText(ctx, pv.width, pv.height, entry, design.crown);
  } else {
    ctx.clearRect(0, 0, pv.width, pv.height);
    ctx.fillStyle = design.crown;
    ctx.fillRect(0, 0, pv.width, pv.height);
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '600 30px "Baloo 2", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Type above to see your stitch preview', pv.width / 2, pv.height / 2);
  }

  renderTextApplied();
}

function renderTextApplied() {
  const box = el('embAppliedList');
  box.innerHTML = '';
  const entries = Object.entries(design.texts);
  if (!entries.length) {
    box.innerHTML = '<p class="hint" style="margin:0">No lettering yet — pick a side and start typing.</p>';
    return;
  }
  entries.forEach(([placementId, entry]) => {
    const pl = PLACEMENTS.find(p => p.id === placementId);
    const f = FONTS.find(x => x.id === entry.font) || FONTS[0];
    const sz = TEXT_SIZES.find(x => x.id === entry.size) || TEXT_SIZES[1];
    const row = document.createElement('div');
    row.className = 'applied-row';
    // Built as nodes, not innerHTML: the label contains user-typed text.
    const dot = document.createElement('span');
    dot.className = 'thread-dot';
    dot.style.background = entry.color;
    const label = document.createElement('span');
    // Stacked rows read as "TOP / BOTTOM" in the one-line summary.
    const shown = stackLines(entry).join(' / ');
    label.textContent = `“${shown}” · ${pl.label} · ${f.name} · ${sz.label}`;
    row.append(dot, label);
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.textContent = '✕';
    rm.onclick = () => {
      delete design.texts[placementId];
      if (activeTextPlacement === placementId) pendingText = { ...entry, text: '' };
      renderEmbroidery();
      applyTexts();
      renderSummary();
    };
    row.appendChild(rm);
    box.appendChild(row);
  });
}

function colorName(hex) {
  return PALETTES.core.find(c => c.hex === hex)?.name
    ?? PALETTES.accent.find(c => c.hex === hex)?.name
    ?? hex;
}

function priceBreakdown() {
  const style = STYLES[design.style];
  const patchCount = Object.keys(design.patches).length;
  const textCount = Object.keys(design.texts).length;
  const deco = DECORATIONS.find(d => d.id === design.deco) || DECORATIONS[0];
  const qty = Math.max(1, design.qty || 1);

  /* A "side" is billed once even if it carries both a patch and lettering,
     matching how Custom Lids charges per decorated location. */
  const sides = new Set([...Object.keys(design.patches), ...Object.keys(design.texts)]);
  const sideCount = sides.size;

  // Custom Lids decoration pricing: first side $4, each additional side $10.
  // The patch-type upcharge only applies to sides that actually carry a patch.
  const decoPerHat = sideCount
    ? FIRST_SIDE + (sideCount - 1) * EXTRA_SIDE + patchCount * deco.up
    : 0;
  const perHat = style.price + decoPerHat;
  const gross = perHat * qty;
  const bulkSaved = qty >= BULK_QTY ? gross * BULK_DISCOUNT : 0;
  const subtotal = Math.round((gross - bulkSaved) * 100) / 100;
  const points = Math.max(0, design.points || 0);

  const rewardsAvailable = Math.floor(points / POINTS_PER_REWARD);
  const maxUsable = Math.min(rewardsAvailable, Math.ceil(subtotal / REWARD_VALUE));
  const rewardsUsed = Math.min(design.rewardsApplied, maxUsable);
  const discount = Math.min(subtotal, rewardsUsed * REWARD_VALUE);
  const pointsUsed = rewardsUsed * POINTS_PER_REWARD;

  const tier = points >= PREMIUM_AT ? 'Premium' : 'Basic';
  const toPremium = Math.max(0, PREMIUM_AT - points);

  return {
    style, patchCount, textCount, sideCount, deco, qty, decoPerHat, perHat, gross, bulkSaved,
    subtotal, points, tier, toPremium,
    rewardsAvailable, maxUsable, rewardsUsed, pointsUsed, discount,
    total: Math.max(0, subtotal - discount),
  };
}

function enrollmentDate() {
  if (!design.enrolled) {
    const d = new Date();
    d.setMonth(d.getMonth() - 15);
    design.enrolled = d.toISOString().slice(0, 10);
  }
  return design.enrolled;
}

function renderSummary() {
  const { style, patchCount, subtotal, discount, total } = priceBreakdown();
  const size = SIZES.find(s => s.id === design.size);
  el('summaryBar').innerHTML = `
    <span class="tagline">YOUR BUILD</span>
    <span class="sum-item">Style <b>${style.name}</b></span>
    <span class="sum-item">Size <b>${size ? size.label : '—'}</b></span>
    <span class="sum-item">Crown <b>${colorName(design.crown)}</b></span>
    <span class="sum-item">Bill <b>${colorName(design.bill)}</b></span>
    ${STYLES[design.style].meshBack ? `<span class="sum-item">Mesh <b>${colorName(design.mesh)}</b></span>` : ''}
    <span class="sum-item">Patches <b>${patchCount}</b></span>
    <span class="sum-item">Text <b>${Object.keys(design.texts).length}</b></span>
    <span class="sum-item">Qty <b>${Math.max(1, design.qty || 1)}</b></span>
    <span class="sum-item">Subtotal <b>$${subtotal.toFixed(2)}</b>${discount ? ` − $${discount.toFixed(2)} rewards` : ''}</span>
    <span class="total">$${total.toFixed(2)}</span>`;
  renderPointsReadout();
  renderOrder();
  saveDesign();
}

function renderPointsReadout() {
  const b = priceBreakdown();
  const box = el('pointsReadout');
  const card = el('passCard');

  if (!b.points) {
    card.hidden = true;
    box.innerHTML = `🏷️ Enter your Lids Access Pass points to see your tier, balance and rewards.
      Every <b>${POINTS_PER_REWARD} points</b> = a <b>$${REWARD_VALUE} reward</b>.`;
    return;
  }

  card.hidden = false;
  const name = (design.name || '').trim();
  el('passGreeting').textContent = name ? `Hi, ${name}!` : 'Hi there!';
  el('passTier').textContent = b.tier;
  el('passEnrolled').textContent = enrollmentDate();
  el('statPoints').textContent = `${b.points.toLocaleString()} Points`;
  el('statRewards').textContent = String(b.rewardsAvailable);
  el('tierFill').style.width = Math.min(100, (b.points / PREMIUM_AT) * 100) + '%';
  el('tierProgressNote').textContent = b.tier === 'Premium'
    ? 'Premium perks unlocked — free shipping + early patch drops 🎉'
    : `${b.toPremium.toLocaleString()} more points to reach Premium`;

  const nextReward = POINTS_PER_REWARD - (b.points % POINTS_PER_REWARD);
  el('rewardSub').textContent = b.rewardsAvailable
    ? `Each reward = $${REWARD_VALUE} off · ${nextReward} pts to your next one`
    : `${nextReward} more points until your first $${REWARD_VALUE} reward`;
  el('rewardCount').textContent = String(b.rewardsUsed);
  el('rewardMinus').disabled = b.rewardsUsed <= 0;
  el('rewardPlus').disabled = b.rewardsUsed >= b.maxUsable;

  box.innerHTML = b.rewardsUsed
    ? `🏷️ Applying <b>${b.rewardsUsed}</b> reward${b.rewardsUsed > 1 ? 's' : ''}
       (<b>${b.pointsUsed.toLocaleString()}</b> pts) for <b>$${b.discount.toFixed(2)}</b> off →
       you pay <b>$${b.total.toFixed(2)}</b>. Points left: <b>${(b.points - b.pointsUsed).toLocaleString()}</b>.`
    : b.rewardsAvailable
      ? `🏷️ You have <b>${b.rewardsAvailable}</b> reward${b.rewardsAvailable > 1 ? 's' : ''} ready —
         tap <b>+</b> above to take $${REWARD_VALUE} off this build.`
      : `🏷️ Keep stacking! <b>${nextReward}</b> more points unlocks your first <b>$${REWARD_VALUE}</b> reward.`;
}

function renderAll() {
  renderStyles();
  renderSizes();
  renderColors();
  renderPatches();
  renderEmbroidery();
  renderSummary();
}

/* ---------- design code, sharing, persistence ---------- */

function designCode() {
  const raw = `${design.style}|${design.size}|${design.crown}|${design.bill}|${design.mesh}|${design.accent}|` +
    Object.entries(design.patches).sort().map(([k, v]) => `${k}:${v}`).join(',') + '|' +
    Object.entries(design.texts).sort()
      .map(([k, v]) => `${k}:${v.text}:${v.font}:${v.size}:${v.color}`).join(',');
  let hash = 0;
  for (let i = 0; i < raw.length; i++) hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
  return 'CAP-' + hash.toString(36).toUpperCase().padStart(6, '0').slice(0, 6);
}

function formatPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function buildMessage() {
  const b = priceBreakdown();
  const { style, subtotal, discount, total, pointsUsed } = b;
  const size = SIZES.find(s => s.id === design.size);
  const patchLines = Object.entries(design.patches).map(([placementId, patchId]) => {
    const p = PATCHES.find(x => x.id === patchId);
    const pl = PLACEMENTS.find(x => x.id === placementId);
    return `   • ${p.name} (${p.cat}) — ${pl.label}`;
  });
  const textLines = Object.entries(design.texts).map(([placementId, entry]) => {
    const pl = PLACEMENTS.find(x => x.id === placementId);
    const f = FONTS.find(x => x.id === entry.font) || FONTS[0];
    const sz = TEXT_SIZES.find(x => x.id === entry.size) || TEXT_SIZES[1];
    // Flatten the stack onto one line so the message keeps its layout.
    const rows = stackLines(entry);
    const shown = rows.join(' / ');
    const stacked = rows.length > 1 ? `, ${rows.length}-row stack` : '';
    return `   • “${shown}” — ${pl.label}, ${f.name}, ${sz.label}, ${colorName(entry.color)} thread${stacked}`;
  });
  const code = designCode();
  const pass = b.points
    ? `\nACCESS PASS · ${b.tier} tier
Balance: ${b.points.toLocaleString()} pts · Rewards available: ${b.rewardsAvailable}${b.rewardsUsed ? `\nApplied: ${b.rewardsUsed} reward(s) = −$${discount.toFixed(2)} (${pointsUsed.toLocaleString()} pts)\nRemaining: ${(b.points - pointsUsed).toLocaleString()} pts` : ''}${b.tier === 'Basic' ? `\n${b.toPremium.toLocaleString()} pts to Premium` : ''}\n`
    : '';
  return `🧢 CAP LAB — ${design.name ? design.name + ', y' : 'y'}our custom build is saved!

Style: ${style.name}
${style.spec.fit} · ${style.spec.crownSpec} · ${style.spec.billSpec} · ${style.spec.closure}
Size: ${size ? size.label : '—'}
Quantity: ${b.qty}${b.bulkSaved ? ' (bulk 10% applied)' : ''}
Decoration: ${b.deco.name}
Crown: ${colorName(design.crown)}
Bill: ${colorName(design.bill)}${STYLES[design.style].meshBack ? `\nMesh: ${colorName(design.mesh)}` : ''}
Accents: ${colorName(design.accent)}
Patches:
${patchLines.length ? patchLines.join('\n') : '   • none (yet 👀)'}
Custom embroidery:
${textLines.length ? textLines.join('\n') : '   • none'}

${pass}
Subtotal $${subtotal.toFixed(2)}${discount ? `\nAccess Pass rewards: −$${discount.toFixed(2)}` : ''}
Total: $${total.toFixed(2)}

Design code: ${code}
Open & edit it: ${shareLink()}

Patches require approval of a design proof (sent within 5 days). Approved patch orders produce & ship in 4–5 weeks.
Reply SAVE to keep it in your locker 🔒`;
}

function saveDesign() {
  try { localStorage.setItem('caplab.design', JSON.stringify(design)); } catch { /* ignore */ }
}

function restoreDesign() {
  try {
    const raw = localStorage.getItem('caplab.design');
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && STYLES[saved.style]) Object.assign(design, saved);
  } catch { /* ignore */ }
  normalizeDesign();
}

/* Validates every field of `design` in place. Shared by the saved-design
   restore and by incoming share links, which are untrusted input. */
function normalizeDesign() {
  const hex = v => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
  if (!STYLES[design.style]) design.style = 'clubhouse';
  if (!SIZES.some(s => s.id === design.size)) design.size = 'ml';
  if (!hex(design.crown)) design.crown = '#13224a';
  if (!hex(design.bill)) design.bill = design.crown;
  if (!hex(design.mesh)) design.mesh = '#f3ead9';
  if (!hex(design.accent)) design.accent = '#f3ead9';

  design.points = Number.isFinite(design.points) ? Math.max(0, design.points) : 0;
  design.rewardsApplied = Number.isFinite(design.rewardsApplied) ? Math.max(0, design.rewardsApplied) : 0;
  design.patches = design.patches && typeof design.patches === 'object' ? design.patches : {};
  // Drop unknown sides, and placements pointing at designs no longer in the gallery.
  Object.keys(design.patches).forEach(k => {
    const okSide = PLACEMENTS.some(p => p.id === k);
    if (!okSide || !PATCHES.some(p => p.id === design.patches[k])) delete design.patches[k];
  });

  // Rebuild lettering defensively: older saves predate this feature.
  const texts = design.texts && typeof design.texts === 'object' ? design.texts : {};
  design.texts = {};
  TEXT_PLACEMENTS.forEach(id => {
    const t = texts[id];
    if (!t || typeof t.text !== 'string' || !t.text.trim()) return;
    design.texts[id] = {
      text: sanitizeText(t.text),
      font: FONTS.some(f => f.id === t.font) ? t.font : 'block',
      size: TEXT_SIZES.some(s => s.id === t.size) ? t.size : 'md',
      color: typeof t.color === 'string' && /^#[0-9a-f]{6}$/i.test(t.color) ? t.color : '#f3ead9',
    };
  });
  design.name = typeof design.name === 'string' ? design.name.slice(0, 20) : '';
  design.qty = Number.isFinite(design.qty)
    ? Math.min(99, Math.max(1, Math.round(design.qty)))
    : 1;
  design.deco = DECORATIONS.some(d => d.id === design.deco) ? design.deco : 'embroidered';
}

/* ============================================================
   Share links

   The whole hat is encoded into the URL fragment, so a link is
   self-contained -- no server, no database, no stored state. The fragment
   never leaves the browser, and only the hat is included: the recipient
   gets the design, not the sender's name, phone number or points balance.
   ============================================================ */

const SHARE_VERSION = 1;

function toB64url(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s) {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(pad + '='.repeat((4 - (pad.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

// Short keys keep the link to a length that survives messaging apps.
function shareToken() {
  const payload = {
    v: SHARE_VERSION,
    s: design.style, z: design.size, o: design.deco, q: design.qty,
    c: design.crown, b: design.bill, m: design.mesh, a: design.accent,
    p: design.patches,
    t: Object.fromEntries(
      Object.entries(design.texts).map(([k, v]) => [k, [v.text, v.font, v.size, v.color]])
    ),
  };
  return toB64url(JSON.stringify(payload));
}

function shareLink() {
  const base = location.href.split('#')[0];
  return `${base}#d=${shareToken()}`;
}

/* Loads a shared hat. Everything lands in `design` and is then put through
   normalizeDesign(), so a hand-edited or corrupted link can't inject
   unknown styles, colours or placements. */
function applyShareToken(token) {
  try {
    const raw = JSON.parse(fromB64url(token));
    if (!raw || typeof raw !== 'object' || raw.v !== SHARE_VERSION) return false;
    if (!STYLES[raw.s]) return false;
    Object.assign(design, {
      style: raw.s, size: raw.z, deco: raw.o, qty: raw.q,
      crown: raw.c, bill: raw.b, mesh: raw.m, accent: raw.a,
      patches: raw.p && typeof raw.p === 'object' ? { ...raw.p } : {},
      texts: Object.fromEntries(
        Object.entries(raw.t && typeof raw.t === 'object' ? raw.t : {})
          .filter(([, a]) => Array.isArray(a))
          .map(([k, a]) => [k, { text: a[0], font: a[1], size: a[2], color: a[3] }])
      ),
    });
    normalizeDesign();
    return true;
  } catch {
    return false;
  }
}

// Native share sheet on mobile, clipboard everywhere else.
async function shareDesign(btn) {
  const url = shareLink();
  const flash = msg => {
    const was = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => { btn.textContent = was; }, 1800);
  };
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Cap Lab', text: 'Check out the cap I built 🧢', url });
      return;
    } catch { /* cancelled - fall through to copy */ }
  }
  try {
    await navigator.clipboard.writeText(url);
    flash('✅ Link copied!');
  } catch {
    // clipboard is blocked on file:// and in some browsers; show it instead
    window.prompt('Copy your share link:', url);
  }
}

/* ---------- confetti ---------- */

function confettiBurst() {
  const box = el('confetti');
  const colors = ['#ff3d7f', '#ffd23f', '#22d3ee', '#7c4dff', '#a3e635'];
  for (let i = 0; i < 90; i++) {
    const bit = document.createElement('i');
    bit.style.left = Math.random() * 100 + 'vw';
    bit.style.background = colors[i % colors.length];
    bit.style.animationDuration = 1.6 + Math.random() * 1.6 + 's';
    bit.style.animationDelay = Math.random() * 0.4 + 's';
    bit.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    box.appendChild(bit);
    setTimeout(() => bit.remove(), 4200);
  }
}

/* ---------- events ---------- */

function syncSpinBtn() {
  const b = el('btnSpin');
  b.setAttribute('aria-pressed', String(controls.autoRotate));
  b.textContent = controls.autoRotate ? '🔄 Auto-spin: ON' : '⏸️ Auto-spin: OFF';
}

el('btnSpin').onclick = () => { controls.autoRotate = !controls.autoRotate; camTarget = null; syncSpinBtn(); };
el('btnReset').onclick = () => {
  controls.target.set(0, 0.52, 0);
  camTarget = new THREE.Vector3(1.7, 1.6, 3.9);
  controls.autoRotate = true;
  syncSpinBtn();
};
el('btnRandom').onclick = () => {
  const styleIds = Object.keys(STYLES);
  design.style = styleIds[Math.floor(Math.random() * styleIds.length)];
  const style = STYLES[design.style];
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  design.crown = pick(style.colors);
  design.bill = pick(style.colors);
  design.accent = pick(PALETTES.accent).hex;
  design.mesh = pick(['#f3ead9', '#15151a', '#9aa0ab', '#8ed8f8']);
  const sizes = SIZES.filter(s => s.fits === (style.strap === 'none' ? 'fitted' : 'adjustable'));
  design.size = pick(sizes).id;
  design.patches = { front: pick(PATCHES).id };
  if (Math.random() > 0.5) design.patches.left = pick(PATCHES).id;

  design.texts = {};
  if (Math.random() > 0.4) {
    const side = pick(['back', 'left', 'right']);
    design.texts[side] = {
      text: pick([
        'EST. 2026', 'THE CREW', 'HOMETOWN', 'ONE MORE', 'GAME DAY', 'LUCKY ONE',
        'EST.\n2026', 'THE\nCREW', 'HOME\nTOWN', 'ALL\nDAY', 'ONE\nMORE\nROUND',
      ]),
      font: pick(FONTS).id,
      size: pick(TEXT_SIZES).id,
      color: pick(PALETTES.core).hex,
    };
    activeTextPlacement = side;
  }

  renderAll();
  buildHat();
};

document.querySelectorAll('.view-buttons button').forEach(b => {
  b.onclick = () => flyTo(b.dataset.view);
});

el('patchSearch').addEventListener('input', e => {
  patchQuery = e.target.value;
  renderPatches();
});

el('embText').addEventListener('input', e => {
  const clean = sanitizeText(e.target.value);
  // Writing back a clamped value would reset the caret, so only correct it
  // when the input actually exceeded the budget.
  if (e.target.value !== clean) {
    const at = e.target.selectionStart;
    e.target.value = clean;
    e.target.setSelectionRange(at - 1, at - 1);
  }
  updateText({ text: clean });
});

// Enter stacks a row; block it once the stack is full.
el('embText').addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.value.split('\n').length >= MAX_LINES) {
    e.preventDefault();
  }
});

el('nameInput').addEventListener('input', e => {
  design.name = e.target.value.slice(0, 20);
  renderSummary();
});

el('pointsInput').addEventListener('input', e => {
  const next = Math.max(0, Math.min(999999, parseInt(e.target.value || '0', 10) || 0));
  const hadNone = !design.points;
  design.points = next;
  if (hadNone && next) enrollmentDate();
  const max = Math.floor(next / POINTS_PER_REWARD);
  design.rewardsApplied = Math.min(design.rewardsApplied, max);
  renderSummary();
});

el('qtyPlus').onclick = () => { design.qty = Math.min(999, (design.qty || 1) + 1); renderSummary(); };
el('qtyMinus').onclick = () => { design.qty = Math.max(1, (design.qty || 1) - 1); renderSummary(); };

el('rewardPlus').onclick = () => {
  const { maxUsable } = priceBreakdown();
  design.rewardsApplied = Math.min(maxUsable, design.rewardsApplied + 1);
  renderSummary();
};
el('rewardMinus').onclick = () => {
  design.rewardsApplied = Math.max(0, design.rewardsApplied - 1);
  renderSummary();
};
el('phoneInput').addEventListener('input', e => { e.target.value = formatPhone(e.target.value); });

el('btnText').onclick = () => {
  const phone = el('phoneInput').value.replace(/\D/g, '');
  if (phone.length !== 10) {
    el('phoneInput').focus();
    el('phoneInput').style.boxShadow = '4px 4px 0 #ff3d7f';
    setTimeout(() => { el('phoneInput').style.boxShadow = ''; }, 1200);
    return;
  }
  el('smsBubble').textContent = buildMessage();
  el('shareUrl').value = shareLink();
  el('modal').hidden = false;
  confettiBurst();
};

el('btnShare').onclick = e => shareDesign(e.currentTarget);

el('btnCopyLink').onclick = async e => {
  const btn = e.currentTarget;
  const input = el('shareUrl');
  input.select();
  try {
    await navigator.clipboard.writeText(input.value);
  } catch {
    document.execCommand('copy'); // file:// fallback
  }
  btn.textContent = 'Copied!';
  setTimeout(() => { btn.textContent = 'Copy'; }, 1800);
};

const closeModal = () => { el('modal').hidden = true; };
el('modalClose').onclick = closeModal;
el('modalDone').onclick = closeModal;
el('modal').addEventListener('click', e => { if (e.target === el('modal')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ---------- boot ---------- */

restoreDesign();

/* A shared hat wins over whatever was last saved locally, so opening a
   friend's link always shows their build. The fragment is then cleared so a
   later refresh doesn't undo your own edits. */
const sharedToken = (location.hash.match(/[#&]d=([A-Za-z0-9_-]+)/) || [])[1];
let openedFromLink = false;
if (sharedToken && applyShareToken(sharedToken)) {
  openedFromLink = true;
  history.replaceState(null, '', location.pathname + location.search);
}

el('nameInput').value = design.name || '';
el('pointsInput').value = design.points ? String(design.points) : '';
renderAll();
buildHat();
syncSpinBtn();
animate();
el('loading').remove();

if (openedFromLink) {
  saveDesign();
  confettiBurst();
}

/* Google Fonts arrive after first paint, so any lettering drawn to a canvas
   before then would fall back to a system face. Redraw once they're ready. */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    renderEmbroidery();
    applyTexts();
  });
}
