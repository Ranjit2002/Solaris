import React from 'react';
import { X, Scale, Globe, ArrowRight, Compass } from 'lucide-react';
import { SOLAR_SYSTEM } from '../data/planets';

export default function EarthCompareModal({ planet, onClose }) {
  if (!planet) return null;

  const earth = SOLAR_SYSTEM.find((p) => p.id === 'earth');

  // Relative size percentages for visual bubble representation (capped for viewport)
  const earthBubbleSize = 70; // px
  // Scale visual bubble logarithmically/proportionately so giant Jupiter doesn't overflow screen
  let planetBubbleSize = earthBubbleSize * planet.sizeRatio;
  planetBubbleSize = Math.max(24, Math.min(planetBubbleSize, 180));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl glass-panel border border-white/20 shadow-2xl p-6 md:p-8 space-y-6 overflow-hidden"
        style={{
          boxShadow: `0 0 50px ${planet.color}33`,
        }}
      >
        {/* Decorative Top Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${planet.gradient}`} />

        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${planet.gradient} text-slate-950 font-bold shadow-lg`}>
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black font-space text-white">
                {planet.name} vs. Earth
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Planetary Scale & Physics Comparison
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Sphere Scale Comparison */}
        <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center gap-6 min-h-[220px]">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Visual Relative Proportions
          </div>

          <div className="flex items-center justify-around w-full max-w-lg gap-4">
            {/* Earth Sphere */}
            <div className="flex flex-col items-center gap-2">
              <div 
                className="rounded-full bg-gradient-to-br from-sky-400 via-blue-600 to-emerald-500 shadow-lg shadow-sky-500/30 flex items-center justify-center text-[10px] font-bold text-white border border-sky-300/40"
                style={{ width: `${earthBubbleSize}px`, height: `${earthBubbleSize}px` }}
              >
                1.0×
              </div>
              <span className="text-xs font-bold text-slate-200">Earth</span>
              <span className="text-[10px] font-mono text-slate-400">6,371 km</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-500 shrink-0" />

            {/* Target Planet Sphere */}
            <div className="flex flex-col items-center gap-2">
              <div 
                className={`rounded-full bg-gradient-to-br ${planet.gradient} shadow-lg flex items-center justify-center text-[11px] font-bold text-slate-950 border border-white/30`}
                style={{ 
                  width: `${planetBubbleSize}px`, 
                  height: `${planetBubbleSize}px`,
                  boxShadow: `0 0 25px ${planet.color}66`
                }}
              >
                {planet.radiusVsEarth}
              </div>
              <span className="text-xs font-bold text-slate-200">{planet.name}</span>
              <span className="text-[10px] font-mono text-slate-400">{planet.actualRadiusKm.toLocaleString()} km</span>
            </div>
          </div>
        </div>

        {/* Side by Side Comparative Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Radius & Mass */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-xs text-slate-400 mb-1">Volumetric Radius</div>
            <div className="text-sm font-bold text-white flex justify-between">
              <span>{planet.name}:</span>
              <span className="text-cyan-400 font-mono">{planet.radiusVsEarth}</span>
            </div>
            <div className="text-xs text-slate-400 flex justify-between mt-1">
              <span>Earth Baseline:</span>
              <span className="font-mono">1.00× (6,371 km)</span>
            </div>
          </div>

          {/* Mass */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-xs text-slate-400 mb-1">Planetary Mass</div>
            <div className="text-sm font-bold text-white flex justify-between">
              <span>{planet.name}:</span>
              <span className="text-amber-400 font-mono">{planet.massVsEarth}</span>
            </div>
            <div className="text-xs text-slate-400 flex justify-between mt-1">
              <span>Earth Baseline:</span>
              <span className="font-mono">1.00× (5.97 × 10²⁴ kg)</span>
            </div>
          </div>

          {/* Day Length */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-xs text-slate-400 mb-1">Day Length (Axial Rotation)</div>
            <div className="text-sm font-bold text-white flex justify-between">
              <span>{planet.name}:</span>
              <span className="text-emerald-400 font-mono">{planet.rotationPeriod}</span>
            </div>
            <div className="text-xs text-slate-400 flex justify-between mt-1">
              <span>Earth:</span>
              <span className="font-mono">23h 56m</span>
            </div>
          </div>

          {/* Moons */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="text-xs text-slate-400 mb-1">Confirmed Natural Satellites</div>
            <div className="text-sm font-bold text-white flex justify-between">
              <span>{planet.name}:</span>
              <span className="text-purple-400 font-mono">{planet.moons} Moons</span>
            </div>
            <div className="text-xs text-slate-400 flex justify-between mt-1">
              <span>Earth:</span>
              <span className="font-mono">1 Moon (Luna)</span>
            </div>
          </div>
        </div>

        {/* Modal Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r ${planet.gradient} text-slate-950 hover:opacity-90 transition-all cursor-pointer shadow-lg`}
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
