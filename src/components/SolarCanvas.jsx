import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SOLAR_SYSTEM } from '../data/planets';
import { getPlanetTexture } from '../utils/textureGenerator';

export default function SolarCanvas({
  activePlanetIndex = 0,
  stage = 'showcase', // 'showcase' (centered on revolving planet) or 'dossier' (elevated above card)
  scrollProgress = 0,
  speedMultiplier = 1,
  lightingMode = 'cinematic', // 'cinematic' (from sun) or 'studio' (ambient 360)
  isInteractive = true,
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const planetMeshesRef = useRef([]);
  const cloudsMeshRef = useRef(null);
  const moonOrbitRef = useRef(null);
  const starPointsRef = useRef(null);
  const sunCoronaRef = useRef(null);
  const milkyWayRef = useRef(null);

  // Synchronized refs for the animation loop
  const activePlanetIndexRef = useRef(activePlanetIndex);
  activePlanetIndexRef.current = activePlanetIndex;

  const stageRef = useRef(stage);
  stageRef.current = stage;

  const speedMultiplierRef = useRef(speedMultiplier);
  speedMultiplierRef.current = speedMultiplier;

  // Interaction tracking (drag to rotate view)
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const manualRotationRef = useRef({ x: 0, y: 0 });
  const scrollMomentumRef = useRef(0);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.008);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 9.5);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Starfield Universe Particles
    const starGeo = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xa5f3fc), // cool blue
      new THREE.Color(0xfef08a), // warm yellow
      new THREE.Color(0xfbcfe8), // soft purple
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 80 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const col = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);
    starPointsRef.current = starPoints;

    // 4b. Deep Milky Way Panoramic Skybox
    const milkyWayGeo = new THREE.SphereGeometry(300, 32, 32);
    const milkyWayTex = getPlanetTexture('stars');
    const milkyWayMat = new THREE.MeshBasicMaterial({
      map: milkyWayTex,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.5,
    });
    const milkyWayMesh = new THREE.Mesh(milkyWayGeo, milkyWayMat);
    scene.add(milkyWayMesh);
    milkyWayRef.current = milkyWayMesh;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(-8, 5, 8);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    fillLight.position.set(8, -4, -6);
    scene.add(fillLight);

    // 6. Build Planets Hierarchy
    // Each planet gets its own root pivot group positioned along the X/Z solar journey line
    const planetMeshes = [];
    const spacing = 18; // Distance between planet stations

    SOLAR_SYSTEM.forEach((data, index) => {
      const stationGroup = new THREE.Group();
      stationGroup.position.set(index * spacing, 0, 0);

      // Tilt group (realistic axial tilt)
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.z = data.threeConfig.tilt || 0;

      // Planet Sphere Geometry
      const sphereGeo = new THREE.SphereGeometry(data.threeConfig.radius, 64, 64);
      const texture = getPlanetTexture(data.threeConfig.textureType);

      let material;
      if (data.id === 'sun') {
        material = new THREE.MeshBasicMaterial({
          map: texture,
        });

        // Add Sun Corona Glow Mesh
        const coronaGeo = new THREE.SphereGeometry(data.threeConfig.radius * 1.15, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.28,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
        });
        const corona = new THREE.Mesh(coronaGeo, coronaMat);
        tiltGroup.add(corona);
        sunCoronaRef.current = corona;
      } else {
        material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.7,
          metalness: 0.1,
        });
      }

      const bodyMesh = new THREE.Mesh(sphereGeo, material);
      tiltGroup.add(bodyMesh);

      // Atmosphere Glow Mesh
      if (data.threeConfig.hasAtmosphereGlow) {
        const atmoGeo = new THREE.SphereGeometry(data.threeConfig.radius * 1.035, 48, 48);
        const atmoMat = new THREE.MeshBasicMaterial({
          color: data.threeConfig.atmosphereColor,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
        });
        const atmo = new THREE.Mesh(atmoGeo, atmoMat);
        tiltGroup.add(atmo);
      }

      // Earth's Cloud Layer & Moon
      if (data.threeConfig.hasClouds) {
        const cloudGeo = new THREE.SphereGeometry(data.threeConfig.radius * 1.018, 48, 48);
        const cloudTex = getPlanetTexture('clouds');
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.45,
          blending: THREE.NormalBlending,
        });
        const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
        tiltGroup.add(cloudMesh);
        cloudsMeshRef.current = cloudMesh;
      }

      if (data.threeConfig.hasMoon) {
        const moonOrbit = new THREE.Group();
        const moonGeo = new THREE.SphereGeometry(0.48, 32, 32);
        const moonTex = getPlanetTexture('moon');
        const moonMat = new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.85 });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        moonMesh.position.set(4.2, 0.4, 0);
        moonOrbit.add(moonMesh);
        stationGroup.add(moonOrbit);
        moonOrbitRef.current = moonOrbit;
      }

      // Saturn Rings
      if (data.threeConfig.hasSaturnRings) {
        const ringGeo = new THREE.RingGeometry(
          data.threeConfig.ringInnerRadius,
          data.threeConfig.ringOuterRadius,
          64
        );
        // Correct ring UV mapping to radial
        const pos = ringGeo.attributes.position;
        const uvs = ringGeo.attributes.uv;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const y = pos.getY(i);
          const dist = Math.sqrt(x * x + y * y);
          const u = (dist - data.threeConfig.ringInnerRadius) / (data.threeConfig.ringOuterRadius - data.threeConfig.ringInnerRadius);
          uvs.setXY(i, u, 0.5);
        }
        ringGeo.uvsNeedUpdate = true;

        const ringTex = getPlanetTexture('saturnRings');
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9,
          roughness: 0.6,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        tiltGroup.add(ringMesh);
      }

      // Uranus Rings (tilted vertically)
      if (data.threeConfig.hasUranusRings) {
        const ringGeo = new THREE.RingGeometry(
          data.threeConfig.ringInnerRadius,
          data.threeConfig.ringOuterRadius,
          48
        );
        const ringTex = getPlanetTexture('uranusRings');
        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        tiltGroup.add(ringMesh);
      }

      stationGroup.add(tiltGroup);
      scene.add(stationGroup);

      planetMeshes.push({
        data,
        stationGroup,
        tiltGroup,
        bodyMesh,
        speedMult: data.threeConfig.spinSpeedMultiplier || 0.005,
      });
    });

    planetMeshesRef.current = planetMeshes;

    // 7. Event Handlers for Drag & Interaction
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      manualRotationRef.current.x += deltaX * 0.005;
      manualRotationRef.current.y += deltaY * 0.005;

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;
      manualRotationRef.current.x += deltaX * 0.006;
      manualRotationRef.current.y += deltaY * 0.006;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Scroll momentum decay
      scrollMomentumRef.current *= 0.94;
      const activeMomentum = scrollMomentumRef.current;

      const currentSpeed = speedMultiplierRef.current || 1;
      const currentActiveIndex = activePlanetIndexRef.current ?? 0;
      const currentStage = stageRef.current || 'showcase';

      // Spin each planet on its axis
      planetMeshesRef.current.forEach((item) => {
        const baseSpeed = item.speedMult * currentSpeed;
        const totalSpinDelta = (baseSpeed + activeMomentum * 0.03);
        item.bodyMesh.rotation.y += totalSpinDelta;
      });

      // Earth clouds rotate slightly faster
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += (0.009 * currentSpeed + activeMomentum * 0.035);
      }

      // Moon orbits Earth
      if (moonOrbitRef.current) {
        moonOrbitRef.current.rotation.y += 0.004 * currentSpeed;
      }

      // Corona pulse
      if (sunCoronaRef.current) {
        const scale = 1 + Math.sin(time * 3) * 0.02;
        sunCoronaRef.current.scale.set(scale, scale, scale);
      }

      // Gentle starfield and milky way drift
      if (starPointsRef.current) {
        starPointsRef.current.rotation.y += 0.00015;
      }
      if (milkyWayRef.current) {
        milkyWayRef.current.rotation.y += 0.00006;
      }

      // Camera lerp based on currentActiveIndex and stage
      const targetX = currentActiveIndex * spacing;

      // Staged camera framing:
      // Showcase stage: Camera is centered directly at revolving planet eye-level (y = 0.15, z = 9.2)
      // Dossier stage: Camera floats higher (y = 1.95, z = 10.2) so revolving planet hovers above the card
      const targetCamY = currentStage === 'dossier' ? 1.95 : 0.15;
      const targetCamZ = currentStage === 'dossier' ? 10.2 : 9.2;
      const lookAtY = currentStage === 'dossier' ? 0.35 : 0;

      // Smooth camera follow
      camera.position.x += (targetX + manualRotationRef.current.x * 2 - camera.position.x) * 0.08;
      camera.position.y += (targetCamY - manualRotationRef.current.y * 1.5 - camera.position.y) * 0.07;
      camera.position.z += (targetCamZ - camera.position.z) * 0.07;
      
      // Look at active planet center with manual tilt offset
      const lookAtX = targetX;
      camera.lookAt(lookAtX, lookAtY, 0);

      // Dampen manual drag rotation gently over time back to default center
      if (!isDraggingRef.current) {
        manualRotationRef.current.x *= 0.97;
        manualRotationRef.current.y *= 0.97;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update lighting mode dynamically
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    scene.traverse((obj) => {
      if (obj.isAmbientLight) {
        obj.intensity = lightingMode === 'studio' ? 1.0 : 0.45;
      }
      if (obj.isDirectionalLight && obj.position.x < 0) {
        obj.intensity = lightingMode === 'studio' ? 1.2 : 2.2;
      }
    });
  }, [lightingMode]);

  // Track window scroll delta to add spin momentum
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollYRef.current;
      scrollMomentumRef.current += Math.min(Math.max(deltaY * 0.0015, -0.05), 0.05);
      lastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Visual cosmic depth vignettes */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030712] via-transparent to-[#030712]/60" />
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-[#030712]/30 to-[#030712]/80" />

      {/* Floating Drag Hint in 3D canvas corner */}
      <div className="absolute bottom-6 left-6 pointer-events-none hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-xs text-slate-400">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Click & drag in 3D space to rotate view • Scroll to travel through planets</span>
      </div>
    </div>
  );
}
