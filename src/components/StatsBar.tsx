import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Layers,
  BookOpen,
  Monitor,
  Library
} from 'lucide-react';
import { OccupancyStats, Section, Seat } from '../types';

interface StatsBarProps {
  stats: OccupancyStats;
  sections: Section[];
  seats: Seat[];
  onSelectSection?: (sectionId: string) => void;
  selectedSectionId?: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  stats,
  sections,
  seats,
  onSelectSection,
  selectedSectionId,
}) => {
  const getSectionIcon = (code: string) => {
    switch (code) {
      case 'A': return <BookOpen className="w-3.5 h-3.5" />;
      case 'B': return <Monitor className="w-3.5 h-3.5" />;
      case 'C': return <Library className="w-3.5 h-3.5" />;
      default: return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div id="occupancy-stats-bar" className="bg-zinc-950 border-b border-zinc-850 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Metric summary boxes */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          {/* Main gauge */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-black">
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold text-xs text-white">
              {stats.occupancyRate}%
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Occupancy</p>
              <p className="text-xs font-semibold text-white">
                {stats.occupied} / {stats.totalSeats} Desks
              </p>
            </div>
          </div>

          {/* Quick status pills */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-400">Available:</span>
              <span className="font-bold text-white">{stats.available}</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs">
              <XCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-zinc-400">Occupied:</span>
              <span className="font-bold text-white">{stats.occupied}</span>
            </div>
          </div>
        </div>

        {/* Per-section tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mr-1">
            Section:
          </span>
          <button
            onClick={() => onSelectSection?.('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              !selectedSectionId
                ? 'bg-white text-black border-white shadow-sm'
                : 'bg-black text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
            }`}
          >
            All (24)
          </button>
          {sections.map((section) => {
            const secSeats = seats.filter((s) => s.sectionId === section.id);
            const availCount = secSeats.filter((s) => s.status === 'AVAILABLE').length;
            const isSelected = selectedSectionId === section.id;

            return (
              <button
                key={section.id}
                id={`filter-sec-${section.id}`}
                onClick={() => onSelectSection?.(isSelected ? '' : section.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-sm'
                    : 'bg-black text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                {getSectionIcon(section.code)}
                <span>Sec {section.code}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                  isSelected ? 'bg-zinc-200 text-black' : 'bg-zinc-900 text-zinc-300'
                }`}>
                  {availCount} free
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
