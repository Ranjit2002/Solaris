import React, { useState, useEffect, useRef } from 'react';
import SolarCanvas from './components/SolarCanvas';
import NavBar from './components/NavBar';
import PlanetCard from './components/PlanetCard';
import EarthCompareModal from './components/EarthCompareModal';
import { SOLAR_SYSTEM } from './data/planets';
import { 
  ChevronDown, 
  Sparkles, 
  Orbit, 
  Sun, 
  Compass, 
  RotateCw,
  Layers, 
  ArrowUp, 
  CheckCircle2
} from 'lucide-react';
import { playPlanetTransitionChime } from './utils/soundEffects';

export default function App() {
  const [activePlanetIndex, setActivePlanetIndex] = useState(0);
  const [currentStage, setCurrentStage] = useState('showcase'); // 'showcase' or 'dossier'
  const [scrollProgress, setScrollProgress] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [lightingMode, setLightingMode] = useState('cinematic');
  const [comparePlanet, setComparePlanet] = useState(null);

  const showcaseRefs = useRef([]);
  const dossierRefs = useRef([]);

  // Setup scroll listener to track active planet and current stage
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const totalDocHeight = document.documentElement.scrollHeight - windowHeight;
      
      const overallProgress = totalDocHeight > 0 ? scrollY / totalDocHeight : 0;
      setScrollProgress(overallProgress);

      const viewportCenter = windowHeight / 2;
      let closestPlanet = 0;
      let closestStage = 'showcase';
      let minDistance = Infinity;

      SOLAR_SYSTEM.forEach((_, index) => {
        const showcaseEl = showcaseRefs.current[index];
        const dossierEl = dossierRefs.current[index];

        if (showcaseEl) {
          const rect = showcaseEl.getBoundingClientRect();
          const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
          if (dist < minDistance) {
            minDistance = dist;
            closestPlanet = index;
            closestStage = 'showcase';
          }
        }

        if (dossierEl) {
          const rect = dossierEl.getBoundingClientRect();
          const dist = Math.abs(rect.top + rect.height / 2 - viewportCenter);
          if (dist < minDistance) {
            minDistance = dist;
            closestPlanet = index;
            closestStage = 'dossier';
          }
        }
      });

      if (closestPlanet >= 0 && closestPlanet < SOLAR_SYSTEM.length) {
        setActivePlanetIndex(closestPlanet);
      }
      setCurrentStage(closestStage);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial run

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToShowcase = (index) => {
    const el = showcaseRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      playPlanetTransitionChime(360 + index * 40);
    }
  };

  const scrollToDossier = (index) => {
    const el = dossierRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      playPlanetTransitionChime(420 + index * 40);
    }
  };

  // When clicking a planet in the navbar or hero, ALWAYS show the revolving 3D stage first!
  const scrollToPlanet = (index) => {
    scrollToShowcase(index);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playPlanetTransitionChime(500);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 1. 3D Three.js Background Canvas */}
      <SolarCanvas
        activePlanetIndex={activePlanetIndex}
        stage={currentStage}
        scrollProgress={scrollProgress}
        speedMultiplier={speedMultiplier}
        lightingMode={lightingMode}
      />

      {/* 2. Top Navigation Bar */}
      <NavBar
        activePlanetIndex={activePlanetIndex}
        onSelectPlanet={scrollToPlanet}
        speedMultiplier={speedMultiplier}
        onChangeSpeed={setSpeedMultiplier}
        lightingMode={lightingMode}
        onToggleLighting={() => setLightingMode(prev => prev === 'cinematic' ? 'studio' : 'cinematic')}
        scrollProgress={scrollProgress}
      />

      {/* 3. Hero / Title Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-12 pointer-events-none">
        <div className="pointer-events-auto max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium tracking-widest uppercase bg-amber-500/10 border border-amber-500/20 text-amber-300 backdrop-blur-md shadow-lg shadow-amber-500/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Interactive 3D Solar System Odyssey</span>
          </div>

          {/* Epic Main Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight font-space leading-tight">
            JOURNEY TO <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 bg-clip-text text-transparent">
              THE PLANETS
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            Scroll down to explore our cosmic neighborhood. Watch each planet revolve on its real axial tilt as you travel from the fiery Sun outward to supersonic Neptune.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            <div className="p-3 rounded-2xl glass-panel border border-white/10 text-center">
              <div className="text-xl font-black font-space text-amber-400">8</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Major Planets</div>
            </div>
            <div className="p-3 rounded-2xl glass-panel border border-white/10 text-center">
              <div className="text-xl font-black font-space text-sky-400">4.5B</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Years Age</div>
            </div>
            <div className="p-3 rounded-2xl glass-panel border border-white/10 text-center">
              <div className="text-xl font-black font-space text-emerald-400">30 AU</div>
              <div className="text-[11px] font-mono text-slate-400 uppercase">Total Span</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <button
              onClick={() => scrollToPlanet(1)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold font-space text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 text-slate-950 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>Begin Solar Journey</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 text-xs font-mono">
          <span>SCROLL DOWN</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      {/* 4. Sequential Planet Sections (Two stages per planet: 3D Revolving Showcase then Dossier on Scroll) */}
      <main className="relative z-10 space-y-24 pb-32">
        {SOLAR_SYSTEM.map((planet, index) => (
          <div key={planet.id} className="relative">
            {/* STAGE 1: REVOLVING 3D SHOWCASE */}
            <section
              id={`planet-${planet.id}-showcase`}
              ref={(el) => (showcaseRefs.current[index] = el)}
              className="min-h-screen flex flex-col justify-between items-center py-20 px-4 pointer-events-none relative"
            >
              {/* Top Showcase HUD */}
              <div className="pointer-events-auto flex flex-col items-center text-center max-w-xl mx-auto space-y-3 pt-12">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-white/5 border border-white/10 text-slate-300 backdrop-blur-md shadow-lg">
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${planet.gradient} animate-pulse`} />
                  <span>{planet.numberLabel}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">{planet.actualRadiusKm.toLocaleString()} KM</span>
                </div>

                <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-space tracking-tight">
                  <span className={`bg-gradient-to-r ${planet.gradient} bg-clip-text text-transparent drop-shadow-sm`}>
                    {planet.name}
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-slate-300 font-medium max-w-md">
                  {planet.subtitle}
                </p>
              </div>

              {/* Center space is open for the revolving 3D planet */}
              <div className="my-auto" />

              {/* Bottom Showcase Prompt & Live Telemetry HUD */}
              <div className="pointer-events-auto w-full max-w-2xl mx-auto flex flex-col items-center space-y-4 pb-8">
                {/* Live Orbit / Spin Badge */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 text-xs text-slate-300 shadow-xl">
                  <div className="flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
                    <span className="font-mono">Spin: {planet.rotationPeriod}</span>
                  </div>
                  <div className="h-3 w-px bg-white/20 hidden sm:block" />
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono">Tilt: {planet.axialTilt}</span>
                  </div>
                  <div className="h-3 w-px bg-white/20 hidden sm:block" />
                  <div className="flex items-center gap-1.5">
                    <Orbit className="w-3.5 h-3.5 text-sky-400" />
                    <span className="font-mono">Orbit: {planet.distanceFromSunAU}</span>
                  </div>
                </div>

                {/* Interactive Scroll Cue Button */}
                <button
                  onClick={() => scrollToDossier(index)}
                  className="group flex flex-col items-center gap-2 text-slate-400 hover:text-white transition-all cursor-pointer"
                >
                  <span className="text-xs font-mono font-medium tracking-widest uppercase group-hover:text-amber-300 transition-colors">
                    Scroll down to explore dossier ↓
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-amber-400/50 group-hover:bg-amber-500/10 transition-all group-hover:translate-y-1 shadow-lg">
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-amber-300 animate-bounce" />
                  </div>
                </button>
              </div>
            </section>

            {/* STAGE 2: DETAILED DOSSIER & NASA PHOTOGRAPHY */}
            <section
              id={`planet-${planet.id}-dossier`}
              ref={(el) => (dossierRefs.current[index] = el)}
              className="min-h-screen flex flex-col items-center justify-start pt-12 pb-24 px-4 relative z-10"
            >
              <div className="w-full">
                <PlanetCard
                  planet={planet}
                  index={index}
                  total={SOLAR_SYSTEM.length}
                  onOpenCompare={setComparePlanet}
                  onScrollToShowcase={() => scrollToShowcase(index)}
                />
              </div>
            </section>
          </div>
        ))}

        {/* 5. Epilogue / Solar System Summary Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="w-full max-w-4xl p-8 md:p-12 rounded-3xl glass-panel border border-white/10 shadow-2xl space-y-8 glow-neptune">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
              <Orbit className="w-4 h-4 text-indigo-400" />
              <span>Kuiper Belt & The Interstellar Frontier</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-space">
              You Have Traversed <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                4.5 Billion Kilometers
              </span>
            </h2>

            <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              From Mercury's scorching iron deserts to Neptune's supersonic methane storms, you have completed the journey across our solar system. Beyond Neptune lies the Kuiper Belt (home of dwarf planets like Pluto and Eris), the Oort Cloud, and the fathomless expanse of interstellar space.
            </p>

            {/* Quick Planet Order Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-left">
              {SOLAR_SYSTEM.slice(1).map((p, idx) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] block font-mono text-slate-400">#{idx + 1}</span>
                    <span className="text-xs font-bold text-slate-200">{p.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Top */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer hover:scale-105"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Return to The Sun</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Earth Compare Modal */}
      {comparePlanet && (
        <EarthCompareModal
          planet={comparePlanet}
          onClose={() => setComparePlanet(null)}
        />
      )}

      {/* 7. Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 px-4 text-center text-xs text-slate-400 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="font-space font-bold text-slate-200">Solaris 3D</span>
            <span className="text-slate-600">•</span>
            <span>NASA Planetary Science Data & Jet Propulsion Laboratory</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => scrollToPlanet(0)} className="hover:text-amber-400 transition-colors cursor-pointer">The Sun</button>
            <button onClick={() => scrollToPlanet(3)} className="hover:text-sky-400 transition-colors cursor-pointer">Earth</button>
            <button onClick={() => scrollToPlanet(8)} className="hover:text-indigo-400 transition-colors cursor-pointer">Neptune</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
