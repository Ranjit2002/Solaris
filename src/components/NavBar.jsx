import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, 
  Volume2, 
  VolumeX, 
  Compass, 
  Lightbulb, 
  Zap,
  Menu,
  X,
  Orbit,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { SOLAR_SYSTEM } from '../data/planets';
import { toggleAmbientSound, playPlanetTransitionChime } from '../utils/soundEffects';

export default function NavBar({
  activePlanetIndex,
  onSelectPlanet,
  speedMultiplier,
  onChangeSpeed,
  lightingMode,
  onToggleLighting,
  scrollProgress,
}) {
  const [isMuted, setIsMuted] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activePillRef = useRef(null);
  const activePlanet = SOLAR_SYSTEM[activePlanetIndex] || SOLAR_SYSTEM[0];

  // Auto-scroll the mobile quick-nav ribbon to center the active planet
  useEffect(() => {
    if (activePillRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activePlanetIndex]);

  // Lock body scroll when mobile menu modal is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleAudioToggle = () => {
    const newState = toggleAmbientSound();
    setIsMuted(!newState);
  };

  const handlePlanetClick = (index) => {
    onSelectPlanet(index);
    playPlanetTransitionChime(350 + index * 40);
    setMobileMenuOpen(false);
  };

  const cycleSpeed = () => {
    const speeds = [0.5, 1, 2, 4];
    const currentIndex = speeds.indexOf(speedMultiplier);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    onChangeSpeed(nextSpeed);
    playPlanetTransitionChime(600);
  };

  return (
    <>
      {/* Floating Glass Navigation Header */}
      <header className="fixed top-2 sm:top-3.5 left-0 right-0 z-40 px-2 sm:px-4 max-w-7xl mx-auto pointer-events-none">
        <div className="flex flex-col gap-1.5 sm:gap-2 pointer-events-auto">
          
          {/* Main Top Header Bar */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 p-2 sm:p-2.5 rounded-2xl glass-panel border border-white/10 shadow-2xl backdrop-blur-xl">
            
            {/* Left: Brand Logo & Mobile Active Planet Badge */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button 
                onClick={() => handlePlanetClick(0)}
                className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer text-left shrink-0"
                title="Return to the Sun"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 font-bold" />
                </div>
                <div className="leading-tight">
                  <span className="text-sm sm:text-base font-black tracking-wider font-space bg-gradient-to-r from-amber-300 via-orange-400 to-sky-300 bg-clip-text text-transparent">
                    SOLARIS
                  </span>
                  <span className="hidden sm:block text-[9px] font-mono text-slate-400 tracking-widest uppercase">
                    3D System
                  </span>
                </div>
              </button>

              {/* Active Planet Indicator (Visible on mobile/tablet when full desktop nav is hidden) */}
              <div className="xl:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300 truncate">
                <span 
                  className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                  style={{ backgroundColor: activePlanet.color }}
                />
                <span className="font-semibold text-white truncate max-w-[85px] sm:max-w-[140px]">
                  {activePlanet.name}
                </span>
                <span className="hidden sm:inline text-slate-500 text-[10px] truncate">
                  ({activePlanet.distanceFromSunKm})
                </span>
              </div>
            </div>

            {/* Center: Full Planet Navigation Pills (Desktop: xl+) */}
            <nav className="hidden xl:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 shrink-0">
              {SOLAR_SYSTEM.map((planet, i) => {
                const isActive = activePlanetIndex === i;
                return (
                  <button
                    key={planet.id}
                    onClick={() => handlePlanetClick(i)}
                    className={`relative px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? `bg-gradient-to-r ${planet.gradient} text-slate-950 font-bold shadow-md scale-105`
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                    title={`${planet.name} • ${planet.distanceFromSunKm}`}
                  >
                    <span>
                      {i === 0 ? 'Sun' : `${i}. ${planet.name}`}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Interactive HUD Quick Controls */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Rotation Speed Toggle */}
              <button
                onClick={cycleSpeed}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono font-medium border border-white/10 text-slate-300 transition-all cursor-pointer hover:border-amber-500/40"
                title={`Rotation Speed: ${speedMultiplier}x (Click to cycle)`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] sm:text-xs">{speedMultiplier}x</span>
              </button>

              {/* Lighting Mode Toggle */}
              <button
                onClick={onToggleLighting}
                className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer hover:border-sky-500/40"
                title={`Lighting Mode: ${lightingMode === 'cinematic' ? 'Cinematic Solar Light' : 'Studio Ambient 360°'}`}
              >
                <Lightbulb className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${lightingMode === 'studio' ? 'text-yellow-300 fill-yellow-300/30' : 'text-slate-400'}`} />
              </button>

              {/* Cosmic Synthesizer Audio Toggle */}
              <button
                onClick={handleAudioToggle}
                className={`p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
                  !isMuted 
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/20 animate-pulse' 
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                }`}
                title={!isMuted ? 'Cosmic Audio: Playing (Click to mute)' : 'Cosmic Audio: Muted (Click to play)'}
              >
                {!isMuted ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              {/* Mobile / Tablet Menu Trigger (Visible <xl) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`xl:hidden p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer ${
                  mobileMenuOpen
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Quick-Nav Swipeable Ribbon (<xl) */}
          <div className="xl:hidden w-full overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/10 shadow-lg w-max min-w-full">
              {SOLAR_SYSTEM.map((planet, i) => {
                const isActive = activePlanetIndex === i;
                return (
                  <button
                    key={`mobile-ribbon-${planet.id}`}
                    ref={isActive ? activePillRef : null}
                    onClick={() => handlePlanetClick(i)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? `bg-gradient-to-r ${planet.gradient} text-slate-950 font-bold shadow-md scale-[1.02]`
                        : 'text-slate-300 hover:text-white bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: isActive ? '#0f172a' : planet.color }}
                    />
                    <span>{i === 0 ? 'Sun' : planet.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </header>

      {/* Full-Fidelity Mobile & Tablet Drawer Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-3 pt-16 sm:p-6 sm:pt-20 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div 
            className="w-full max-w-xl max-h-[85vh] rounded-3xl glass-panel border border-white/15 shadow-2xl p-5 sm:p-6 space-y-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Sun className="w-4 h-4 text-slate-950 font-bold" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black font-space text-white">
                    Solaris System Directory
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    Select any celestial body to travel through space
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Controls Section in Mobile Menu */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Simulation Controls</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {/* Speed selector */}
                <button
                  onClick={cycleSpeed}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400 mb-1" />
                  <span className="text-[10px] text-slate-400 font-mono">Speed</span>
                  <span className="text-xs font-bold text-white font-mono">{speedMultiplier}x</span>
                </button>

                {/* Lighting toggle */}
                <button
                  onClick={onToggleLighting}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-center cursor-pointer"
                >
                  <Lightbulb className={`w-4 h-4 mb-1 ${lightingMode === 'studio' ? 'text-yellow-300' : 'text-slate-400'}`} />
                  <span className="text-[10px] text-slate-400 font-mono">Lighting</span>
                  <span className="text-xs font-bold text-white capitalize">{lightingMode}</span>
                </button>

                {/* Audio toggle */}
                <button
                  onClick={handleAudioToggle}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center cursor-pointer ${
                    !isMuted 
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                      : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                  }`}
                >
                  {!isMuted ? <Volume2 className="w-4 h-4 mb-1 text-cyan-300" /> : <VolumeX className="w-4 h-4 mb-1" />}
                  <span className="text-[10px] text-slate-400 font-mono">Sound</span>
                  <span className="text-xs font-bold font-mono">{!isMuted ? 'Active' : 'Muted'}</span>
                </button>
              </div>
            </div>

            {/* Planets List (2 columns on mobile, shows distance in Crore KM!) */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Planets & Distances from Sun
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SOLAR_SYSTEM.map((planet, i) => {
                  const isActive = activePlanetIndex === i;
                  return (
                    <button
                      key={`modal-${planet.id}`}
                      onClick={() => handlePlanetClick(i)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left cursor-pointer group ${
                        isActive
                          ? `bg-gradient-to-r ${planet.gradient} text-slate-950 border-white/40 shadow-lg font-bold scale-[1.01]`
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-inner"
                          style={{
                            backgroundColor: isActive ? 'rgba(0,0,0,0.15)' : `${planet.color}25`,
                            color: isActive ? '#0f172a' : planet.color,
                          }}
                        >
                          {i === 0 ? '☉' : i}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold font-space truncate ${isActive ? 'text-slate-950' : 'text-white'}`}>
                            {planet.name}
                          </div>
                          <div className={`text-[10px] font-mono truncate ${isActive ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                            {planet.distanceFromSunKm}
                          </div>
                        </div>
                      </div>

                      {isActive && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/20 text-slate-950 font-bold shrink-0">
                          VIEWING
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-mono border-t border-white/5">
              <span>9 Celestial Bodies • Real Scale</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                Close Menu ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
