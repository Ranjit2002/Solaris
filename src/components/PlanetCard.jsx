import React, { useState } from 'react';
import { 
  Globe, 
  Compass, 
  Flame, 
  RotateCw, 
  Orbit, 
  Sparkles, 
  Radio, 
  Layers, 
  Rocket, 
  ChevronRight,
  ChevronUp,
  Scale,
  Camera,
  Maximize2,
  X
} from 'lucide-react';
import { playPlanetTransitionChime } from '../utils/soundEffects';

export default function PlanetCard({ 
  planet, 
  index, 
  total,
  onOpenCompare,
  onScrollToShowcase
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    playPlanetTransitionChime(400 + Math.random() * 200);
  };

  const isSun = planet.id === 'sun';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Outer Card Container with dynamic linear-gradient border */}
      <div 
        className={`relative rounded-3xl overflow-hidden glass-panel border transition-all duration-500 hover:shadow-2xl ${planet.glowClass}`}
        style={{
          borderColor: 'rgba(255, 255, 255, 0.12)',
        }}
      >
        {/* Ambient Top Gradient Glow Bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${planet.gradient}`} />

        <div className="p-6 md:p-10 space-y-8">
          
          {/* Header Section: Planet Number & Titles */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              {/* Order / Number from Sun Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase mb-3 bg-white/5 border border-white/10 text-slate-300">
                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${planet.gradient}`} />
                {planet.numberLabel}
              </div>

              {/* Planet Name with Linear Gradient */}
              <h2 className="text-4xl md:text-6xl font-black tracking-tight font-space">
                <span className={`bg-gradient-to-r ${planet.gradient} bg-clip-text text-transparent`}>
                  {planet.name}
                </span>
              </h2>
              
              <p className="text-sm md:text-base font-medium text-slate-400 mt-1">
                {planet.subtitle}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              {onScrollToShowcase && (
                <button
                  onClick={onScrollToShowcase}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer hover:border-amber-400/40"
                  title="Return to revolving 3D view"
                >
                  <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Revolving 3D View</span>
                </button>
              )}

              {!isSun && (
                <button
                  onClick={() => onOpenCompare(planet)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                  title="Compare dimensions with Earth"
                >
                  <Scale className="w-4 h-4 text-cyan-400" />
                  <span>Compare to Earth</span>
                </button>
              )}
            </div>
          </div>

          {/* Tagline quote */}
          <p className="text-base md:text-lg text-slate-300 font-light italic border-l-2 pl-4 border-slate-700">
            "{planet.tagline}"
          </p>

          {/* NASA Spacecraft Mission Photo Portrait Banner */}
          {planet.photoUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 group bg-slate-950/80 shadow-2xl">
              <div 
                className="relative h-56 sm:h-72 w-full overflow-hidden cursor-pointer" 
                onClick={() => setIsImageModalOpen(true)}
                title="Click to inspect full resolution image"
              >
                <img
                  src={planet.photoUrl}
                  alt={`${planet.name} captured by NASA`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                  loading="lazy"
                />
                {/* Cinematic gradient shading */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Floating Badges */}
                <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-black/60 backdrop-blur-md border border-white/20 text-cyan-300">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Spacecraft Portrait</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-white/10 backdrop-blur-md border border-white/10 text-slate-200">
                    <span>{planet.photoCredit}</span>
                  </div>
                </div>

                {/* Zoom / Full Resolution Hint */}
                <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-xs text-white shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Expand Portrait</span>
                  </div>
                </div>

                {/* Caption at bottom */}
                <div className="absolute bottom-3 left-4 right-4 text-xs sm:text-sm text-slate-200 font-light flex items-center justify-between gap-2">
                  <p className="line-clamp-2 italic drop-shadow-md">
                    "{planet.photoCaption}"
                  </p>
                  <span className="hidden sm:inline-flex items-center text-[11px] font-mono text-cyan-400 shrink-0">
                    Click to inspect ↗
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Metric 1: Distance */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all group">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform" />
                <span>Distance</span>
              </div>
              <div className="font-space font-bold text-sm text-slate-100">{planet.distanceFromSunAU}</div>
              <div className="text-[11px] text-slate-400 truncate">{planet.distanceFromSunKm}</div>
            </div>

            {/* Metric 2: Orbit / Year */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all group">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Orbit className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-90 transition-transform" />
                <span>Orbital Year</span>
              </div>
              <div className="font-space font-bold text-sm text-slate-100">{planet.orbitalPeriod}</div>
              <div className="text-[11px] text-slate-400">Around Sun</div>
            </div>

            {/* Metric 3: Day Length / Spin */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all group">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <RotateCw className="w-3.5 h-3.5 text-emerald-400 group-hover:spin transition-transform" />
                <span>Day Length</span>
              </div>
              <div className="font-space font-bold text-sm text-slate-100">{planet.rotationPeriod}</div>
              <div className="text-[11px] text-slate-400">Axial Tilt: {planet.axialTilt}</div>
            </div>

            {/* Metric 4: Radius Size */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all group">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Globe className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span>Radius</span>
              </div>
              <div className="font-space font-bold text-sm text-slate-100">{planet.radiusVsEarth}</div>
              <div className="text-[11px] text-slate-400">{planet.actualRadiusKm.toLocaleString()} km</div>
            </div>

            {/* Metric 5: Temperature */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all group">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Flame className="w-3.5 h-3.5 text-rose-400 group-hover:scale-125 transition-transform" />
                <span>Surface Temp</span>
              </div>
              <div className="font-space font-bold text-sm text-slate-100 truncate">{planet.surfaceTemp}</div>
              <div className="text-[11px] text-slate-400">Mean environment</div>
            </div>

            {/* Metric 6: Moons */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all group">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 group-hover:rotate-12 transition-transform" />
                <span>Moons</span>
              </div>
              <div className="font-space font-bold text-sm text-slate-100">{planet.moons}</div>
              <div className="text-[11px] text-slate-400">{planet.hasRings ? 'Ring system present' : 'No rings'}</div>
            </div>
          </div>

          {/* Interactive Deep Dive Tabs */}
          <div className="border-t border-white/10 pt-6">
            {/* Tab navigation pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {[
                { id: 'overview', label: 'Overview & Anatomy', icon: Layers },
                { id: 'atmosphere', label: 'Atmosphere & Chemistry', icon: Radio },
                { id: 'missions', label: 'Space Missions & Exploration', icon: Rocket },
                { id: 'facts', label: 'Fascinating Facts', icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isCurrent = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isCurrent
                        ? `bg-gradient-to-r ${planet.gradient} text-slate-950 font-bold shadow-lg scale-105`
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content Panels */}
            <div className="min-h-[140px]">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                    {planet.overview}
                  </p>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Internal Core & Structure
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {planet.structure}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: ATMOSPHERE */}
              {activeTab === 'atmosphere' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <h4 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    Atmospheric Gas Composition Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {planet.atmosphere.map((gas, i) => (
                      <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-semibold text-slate-200">{gas.name}</span>
                          <span className="font-mono text-slate-400">{gas.percent}%</span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${planet.gradient}`}
                            style={{ width: `${Math.min(gas.percent, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MISSIONS */}
              {activeTab === 'missions' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {planet.missions.map((m, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-space font-bold text-sm text-slate-100">{m.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-cyan-300">
                            {m.agency}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mb-2">{m.year}</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{m.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: FUN FACTS */}
              {activeTab === 'facts' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  {planet.facts.map((fact, i) => (
                    <div 
                      key={i} 
                      className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] transition-all"
                    >
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${planet.gradient} text-slate-950 font-bold shrink-0 shadow-md`}>
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed pt-0.5">
                        {fact}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Card Footer: Solar System Sequence Navigator */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-mono">Planet {index} of {total - 1}</span>
            </div>
            <div className="text-slate-500 italic text-[11px]">
              Scroll down to travel further outward into deep space ↓
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen High-Resolution Image Lightbox Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-2xl bg-slate-950/95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-space font-bold text-lg text-white">
                    {planet.name} — Spacecraft Portrait
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {planet.photoCredit}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-res Image Container */}
            <div className="relative flex-1 min-h-0 overflow-hidden bg-black flex items-center justify-center p-2">
              <img
                src={planet.photoUrl}
                alt={planet.name}
                className="max-h-[65vh] w-auto object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Footer Caption */}
            <div className="p-4 sm:p-6 border-t border-white/10 bg-black/40 text-xs sm:text-sm text-slate-300 font-light flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="italic">
                "{planet.photoCaption}"
              </p>
              <div className="shrink-0 font-mono text-xs text-slate-500">
                Direct NASA mission spacecraft capture
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
