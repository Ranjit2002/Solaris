import * as THREE from 'three';

// Utility helper to create a 2D canvas of given dimensions
function createOffscreenCanvas(width = 1024, height = 512) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

// Pseudo noise / hash function for procedural terrain
function pseudoNoise(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

// Multi-octave noise
function fbm(x, y, octaves = 4) {
  let val = 0;
  let freq = 1;
  let amp = 0.5;
  for (let i = 0; i < octaves; i++) {
    val += amp * pseudoNoise(x * freq, y * freq);
    freq *= 2;
    amp *= 0.5;
  }
  return val;
}

/**
 * Procedural texture for The Sun
 */
export function createSunTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#f59e0b');
  grad.addColorStop(0.5, '#ef4444');
  grad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Solar granules and flares
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const radius = 5 + Math.random() * 25;
    const rGrad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    rGrad.addColorStop(0, 'rgba(254, 240, 138, 0.8)');
    rGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)');
    rGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = rGrad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Procedural texture for Mercury
 */
export function createMercuryTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 512);
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(0, 0, 1024, 512);

  // Surface craters and maria
  for (let i = 0; i < 600; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 2 + Math.random() * 16;
    const alpha = 0.15 + Math.random() * 0.35;
    const dark = Math.random() > 0.4;
    ctx.fillStyle = dark ? `rgba(30, 35, 45, ${alpha})` : `rgba(200, 205, 215, ${alpha * 0.8})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Crater rim
    if (r > 6) {
      ctx.strokeStyle = `rgba(220, 220, 230, ${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural texture for Venus
 */
export function createVenusTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#eab308');
  grad.addColorStop(0.25, '#ca8a04');
  grad.addColorStop(0.5, '#d97706');
  grad.addColorStop(0.75, '#ca8a04');
  grad.addColorStop(1, '#eab308');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Sulfuric acid cloud bands and streaks
  for (let y = 0; y < 512; y += 4) {
    const bandAlpha = 0.08 + Math.sin(y * 0.04) * 0.06;
    ctx.fillStyle = y % 8 === 0 ? `rgba(254, 240, 138, ${bandAlpha})` : `rgba(180, 83, 9, ${bandAlpha})`;
    ctx.fillRect(0, y, 1024, 4);
  }

  // Atmospheric swirl eddies
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 30 + Math.random() * 60;
    const rGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    rGrad.addColorStop(0, 'rgba(253, 224, 71, 0.25)');
    rGrad.addColorStop(1, 'rgba(194, 65, 12, 0)');
    ctx.fillStyle = rGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, r * 1.8, r * 0.5, Math.PI / 10, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural texture for Earth
 */
export function createEarthTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 512);
  
  // Deep oceans
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#0f3a68');
  oceanGrad.addColorStop(0.5, '#1e40af');
  oceanGrad.addColorStop(1, '#0f3a68');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Continents generator
  ctx.fillStyle = '#15803d'; // Rich green
  const continents = [
    { x: 220, y: 160, rx: 90, ry: 70 }, // North America
    { x: 300, y: 320, rx: 65, ry: 100 }, // South America
    { x: 530, y: 150, rx: 110, ry: 60 }, // Europe & Asia
    { x: 530, y: 280, rx: 80, ry: 90 }, // Africa
    { x: 740, y: 170, rx: 120, ry: 70 }, // East Asia
    { x: 820, y: 340, rx: 65, ry: 50 }, // Australia
  ];

  continents.forEach(c => {
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.rx, c.ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Secondary sub-masses for natural jagged look
    for (let i = 0; i < 15; i++) {
      const sx = c.x + (Math.random() - 0.5) * c.rx * 1.5;
      const sy = c.y + (Math.random() - 0.5) * c.ry * 1.5;
      const sr = 12 + Math.random() * 28;
      ctx.fillStyle = Math.random() > 0.4 ? '#166534' : '#a16207'; // forest and savannah/desert
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Polar ice caps
  ctx.fillStyle = '#f8fafc';
  // North Pole
  ctx.fillRect(0, 0, 1024, 30);
  for (let i = 0; i < 1024; i += 20) {
    ctx.beginPath();
    ctx.arc(i, 30, 8 + Math.random() * 12, 0, Math.PI * 2);
    ctx.fill();
  }
  // South Pole (Antarctica)
  ctx.fillRect(0, 480, 1024, 32);
  for (let i = 0; i < 1024; i += 20) {
    ctx.beginPath();
    ctx.arc(i, 480, 10 + Math.random() * 14, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Earth's Cloud layer texture (semi-transparent)
 */
export function createEarthCloudTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 512);
  ctx.clearRect(0, 0, 1024, 512);

  // Swirling white clouds with alpha
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 1024;
    const y = 50 + Math.random() * 412;
    const rx = 30 + Math.random() * 90;
    const ry = 8 + Math.random() * 25;
    const radGrad = ctx.createRadialGradient(x, y, 0, x, y, rx);
    radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    radGrad.addColorStop(0.6, 'rgba(240, 245, 255, 0.3)');
    radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (Math.random() - 0.5) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Moon texture
 */
export function createMoonTexture() {
  const { canvas, ctx } = createOffscreenCanvas(512, 256);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 512, 256);

  // Dark basaltic maria
  ctx.fillStyle = 'rgba(71, 85, 105, 0.6)';
  ctx.beginPath();
  ctx.arc(150, 100, 50, 0, Math.PI * 2);
  ctx.arc(280, 140, 60, 0, Math.PI * 2);
  ctx.arc(380, 90, 45, 0, Math.PI * 2);
  ctx.fill();

  // White ray craters
  for (let i = 0; i < 150; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const r = 2 + Math.random() * 8;
    ctx.fillStyle = Math.random() > 0.6 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(30, 41, 59, 0.3)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Mars texture
 */
export function createMarsTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#ea580c');
  grad.addColorStop(0.5, '#c2410c');
  grad.addColorStop(1, '#9a3412');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Dark volcanic basalt regions (Syrtis Major, Sinus Sabaeus)
  ctx.fillStyle = 'rgba(67, 20, 7, 0.45)';
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 1024;
    const y = 140 + Math.random() * 240;
    const rx = 30 + Math.random() * 80;
    const ry = 15 + Math.random() * 40;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (Math.random() - 0.5) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Craters and canyon rifts (Valles Marineris)
  ctx.strokeStyle = 'rgba(40, 10, 5, 0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(350, 260);
  ctx.quadraticCurveTo(450, 270, 550, 255);
  ctx.stroke();

  // Polar ice caps (frozen CO2 & water ice)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(512, 10, 70, 0, Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(512, 502, 60, Math.PI, 0);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Jupiter texture with Great Red Spot
 */
export function createJupiterTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 512);

  // Alternating gas belts and zones
  const colors = [
    '#ca8a04', '#d97706', '#fed7aa', '#ea580c', '#b45309',
    '#fef3c7', '#c2410c', '#fde68a', '#d97706', '#9a3412'
  ];

  const bandHeight = 512 / colors.length;
  for (let i = 0; i < colors.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(0, i * bandHeight, 1024, bandHeight);
    
    // Add micro-turbulence between bands
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, i * bandHeight + bandHeight * 0.8, 1024, bandHeight * 0.2);
  }

  // Swirling storms and white ovals
  for (let i = 0; i < 35; i++) {
    const x = Math.random() * 1024;
    const y = 80 + Math.random() * 350;
    const rx = 15 + Math.random() * 30;
    const ry = 6 + Math.random() * 12;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(154, 52, 18, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // The Iconic Great Red Spot!
  const grsX = 650;
  const grsY = 320;
  const grsGrad = ctx.createRadialGradient(grsX, grsY, 5, grsX, grsY, 55);
  grsGrad.addColorStop(0, '#dc2626');
  grsGrad.addColorStop(0.6, '#b91c1c');
  grsGrad.addColorStop(0.85, '#991b1b');
  grsGrad.addColorStop(1, 'rgba(153, 27, 27, 0)');
  ctx.fillStyle = grsGrad;
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, 55, 32, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // White core highlight inside Great Red Spot
  ctx.fillStyle = 'rgba(254, 202, 202, 0.5)';
  ctx.beginPath();
  ctx.ellipse(grsX, grsY, 16, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Saturn texture
 */
export function createSaturnTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 512);

  // Subtle golden amber horizontal bands
  const colors = [
    '#eab308', '#facc15', '#fde047', '#fef08a', '#ca8a04',
    '#fef08a', '#eab308', '#facc15', '#ca8a04', '#a16207'
  ];

  const bandHeight = 512 / colors.length;
  for (let i = 0; i < colors.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.fillRect(0, i * bandHeight, 1024, bandHeight);
    // Soft smoothing
    const smoothGrad = ctx.createLinearGradient(0, i * bandHeight, 0, (i + 1) * bandHeight);
    smoothGrad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
    smoothGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.05)');
    smoothGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    ctx.fillStyle = smoothGrad;
    ctx.fillRect(0, i * bandHeight, 1024, bandHeight);
  }

  // Polar hexagon tint
  ctx.fillStyle = 'rgba(113, 63, 18, 0.2)';
  ctx.fillRect(0, 0, 1024, 40);
  ctx.fillRect(0, 472, 1024, 40);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Saturn Ring Texture (radial / linear alpha mapping)
 */
export function createSaturnRingTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 64);
  
  // Create rings from inner to outer edge
  const ringGrad = ctx.createLinearGradient(0, 0, 1024, 0);
  ringGrad.addColorStop(0.0, 'rgba(253, 230, 138, 0.0)'); // Inner transparent
  ringGrad.addColorStop(0.1, 'rgba(245, 218, 140, 0.4)'); // D Ring
  ringGrad.addColorStop(0.25, 'rgba(234, 179, 8, 0.8)');   // C Ring
  ringGrad.addColorStop(0.55, 'rgba(254, 240, 138, 0.95)'); // B Ring (densest)
  ringGrad.addColorStop(0.60, 'rgba(0, 0, 0, 0.05)');      // Cassini Division (dark gap)
  ringGrad.addColorStop(0.65, 'rgba(245, 200, 120, 0.75)'); // A Ring
  ringGrad.addColorStop(0.85, 'rgba(230, 190, 110, 0.6)');  // Encke gap
  ringGrad.addColorStop(0.95, 'rgba(200, 160, 90, 0.2)');   // F Ring
  ringGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');          // Outer fade

  ctx.fillStyle = ringGrad;
  ctx.fillRect(0, 0, 1024, 64);

  // Add hundreds of micro ringlet divisions
  for (let x = 0; x < 1024; x += 4) {
    if (Math.random() > 0.4) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(x, 0, 1, 64);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Procedural Uranus texture
 */
export function createUranusTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 512);

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#67e8f9');
  grad.addColorStop(0.3, '#22d3ee');
  grad.addColorStop(0.5, '#06b6d4');
  grad.addColorStop(0.7, '#22d3ee');
  grad.addColorStop(1, '#67e8f9');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Very subtle pale cyan/aquamarine haze
  for (let y = 0; y < 512; y += 8) {
    const alpha = 0.03 + Math.sin(y * 0.05) * 0.02;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(0, y, 1024, 8);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * Procedural Uranus faint ring texture
 */
export function createUranusRingTexture() {
  const { canvas, ctx } = createOffscreenCanvas(512, 32);
  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0.0, 'rgba(34, 211, 238, 0)');
  grad.addColorStop(0.3, 'rgba(165, 243, 252, 0.4)');
  grad.addColorStop(0.7, 'rgba(34, 211, 238, 0.6)');
  grad.addColorStop(1.0, 'rgba(34, 211, 238, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 32);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Procedural Neptune texture
 */
export function createNeptuneTexture() {
  const { canvas, ctx } = createOffscreenCanvas(1024, 512);

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#1e40af');
  grad.addColorStop(0.3, '#2563eb');
  grad.addColorStop(0.5, '#1d4ed8');
  grad.addColorStop(0.7, '#3b82f6');
  grad.addColorStop(1, '#1e3a8a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // Azure and cobalt storm bands
  for (let y = 0; y < 512; y += 12) {
    const alpha = 0.08 + Math.sin(y * 0.08) * 0.05;
    ctx.fillStyle = `rgba(30, 58, 138, ${alpha})`;
    ctx.fillRect(0, y, 1024, 12);
  }

  // The Great Dark Spot of Neptune
  const gdsX = 400;
  const gdsY = 220;
  const gdsGrad = ctx.createRadialGradient(gdsX, gdsY, 2, gdsX, gdsY, 40);
  gdsGrad.addColorStop(0, '#0f172a');
  gdsGrad.addColorStop(0.8, '#1e293b');
  gdsGrad.addColorStop(1, 'rgba(30, 41, 59, 0)');
  ctx.fillStyle = gdsGrad;
  ctx.beginPath();
  ctx.ellipse(gdsX, gdsY, 40, 22, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // White high-altitude cirrus clouds ("Scooter")
  for (let i = 0; i < 25; i++) {
    const x = Math.random() * 1024;
    const y = 160 + Math.random() * 200;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.beginPath();
    ctx.ellipse(x, y, 20 + Math.random() * 40, 3 + Math.random() * 6, 0.05, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

/**
 * High-performance Texture Loader & Generator for Solaris 3D
 * Loads authentic 2K Solar System Scope / NASA textures with procedural fallbacks.
 */
const textureCache = new Map();
const textureLoader = new THREE.TextureLoader();

// Mapping of texture types to local 2K assets in public/textures/
const LOCAL_2K_TEXTURES = {
  sun: '/textures/2k_sun.jpg',
  mercury: '/textures/2k_mercury.jpg',
  venus: '/textures/2k_venus_atmosphere.jpg',
  earth: '/textures/2k_earth_daymap.jpg',
  clouds: '/textures/2k_earth_clouds.jpg',
  moon: '/textures/2k_moon.jpg',
  mars: '/textures/2k_mars.jpg',
  jupiter: '/textures/2k_jupiter.jpg',
  saturn: '/textures/2k_saturn.jpg',
  saturnRings: '/textures/2k_saturn_ring_alpha.png',
  uranus: '/textures/2k_uranus.jpg',
  neptune: '/textures/2k_neptune.jpg',
  stars: '/textures/2k_stars_milky_way.jpg',
};

export function getPlanetTexture(type) {
  if (textureCache.has(type)) {
    return textureCache.get(type);
  }

  // If a 2K local texture exists, load it with optimal Three.js settings
  if (LOCAL_2K_TEXTURES[type]) {
    const url = LOCAL_2K_TEXTURES[type];
    const texture = textureLoader.load(
      url,
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTex.magFilter = THREE.LinearFilter;
        loadedTex.generateMipmaps = true;
        loadedTex.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn(`[Solaris] Fallback to procedural texture for ${type}:`, err);
      }
    );

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    textureCache.set(type, texture);
    return texture;
  }

  // Procedural Fallback Generators
  let tex;
  switch (type) {
    case 'sun':
      tex = createSunTexture();
      break;
    case 'mercury':
      tex = createMercuryTexture();
      break;
    case 'venus':
      tex = createVenusTexture();
      break;
    case 'earth':
      tex = createEarthTexture();
      break;
    case 'moon':
      tex = createMoonTexture();
      break;
    case 'clouds':
      tex = createEarthCloudTexture();
      break;
    case 'mars':
      tex = createMarsTexture();
      break;
    case 'jupiter':
      tex = createJupiterTexture();
      break;
    case 'saturn':
      tex = createSaturnTexture();
      break;
    case 'saturnRings':
      tex = createSaturnRingTexture();
      break;
    case 'uranus':
      tex = createUranusTexture();
      break;
    case 'uranusRings':
      tex = createUranusRingTexture();
      break;
    case 'neptune':
      tex = createNeptuneTexture();
      break;
    default:
      tex = createMercuryTexture();
  }

  tex.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(type, tex);
  return tex;
}
