import React, { useState } from 'react';
import { 
  Sun, 
  Volume2, 
  VolumeX, 
  Compass, 
  Lightbulb, 
  Zap,
  Menu,
  X
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
      <header className="fixed top-3 left-0 right-0 z-40 px-4 max-w-7xl mx-auto pointer-events-none">
        <div className="flex items-center justify-between gap-4 p-2.5 rounded-2xl glass-panel pointer-events-auto border border-white/10 shadow-2xl">
          
          {/* Logo */}
          <button 
            onClick={() => handlePlanetClick(0)}
            className="flex items-center gap-2.5 px-2 py-1 group cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <Sun className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-base font-black tracking-wider font-space bg-gradient-to-r from-amber-300 via-orange-400 to-sky-300 bg-clip-text text-transparent">
                SOLARIS
              </span>
              <span className="text-[10px] block font-mono text-slate-400 -mt-1 tracking-widest uppercase">
                3D System
              </span>
            </div>
          </button>

          {/* Planet Jump Pills (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            {SOLAR_SYSTEM.map((planet, i) => {
              const isActive = activePlanetIndex === i;
              return (
                <button
                  key={planet.id}
                  onClick={() => handlePlanetClick(i)}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? `bg-gradient-to-r ${planet.gradient} text-slate-950 font-bold shadow-md scale-105`
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                  title={planet.name}
                >
                  <span className="truncate">
                    {i === 0 ? 'Sun' : `${i}. ${planet.name}`}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Quick HUD Controls: Speed, Lighting, Audio */}
          <div className="flex items-center gap-2">
            {/* Speed Toggle */}
            <button
              onClick={cycleSpeed}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono font-medium border border-white/10 text-slate-300 transition-all cursor-pointer hover:border-amber-500/40"
              title="Planet Axial Rotation Speed"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{speedMultiplier}x</span>
            </button>

            {/* Lighting Mode Toggle */}
            <button
              onClick={onToggleLighting}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all cursor-pointer hover:border-sky-500/40"
              title={`Lighting: ${lightingMode === 'cinematic' ? 'Cinematic Solar Light' : 'Studio Ambient 360'}`}
            >
              <Lightbulb className={`w-4 h-4 ${lightingMode === 'studio' ? 'text-yellow-300 fill-yellow-300/30' : 'text-slate-400'}`} />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleAudioToggle}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                !isMuted 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/20 animate-pulse' 
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
              }`}
              title={!isMuted ? 'Mute Cosmic Ambient Synthesizer' : 'Play Cosmic Ambient Drone'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 text-slate-300 border border-white/10 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-3 rounded-2xl glass-panel border border-white/10 shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-3 gap-1.5">
              {SOLAR_SYSTEM.map((planet, i) => {
                const isActive = activePlanetIndex === i;
                return (
                  <button
                    key={planet.id}
                    onClick={() => handlePlanetClick(i)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? `bg-gradient-to-r ${planet.gradient} text-slate-950 font-bold`
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-[10px] opacity-70 font-mono">#{i}</div>
                    <div className="truncate">{planet.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
