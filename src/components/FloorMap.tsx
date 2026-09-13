import React from 'react';
import { 
  User, 
  BookOpen, 
  Monitor, 
  Library,
  PlusCircle,
  GraduationCap
} from 'lucide-react';
import { Section, Seat } from '../types';

interface FloorMapProps {
  sections: Section[];
  seats: Seat[];
  onSelectSeat: (seat: Seat) => void;
  selectedSeatId?: string;
  highlightedSeatId?: string | null;
  filteredSeatIds?: Set<string>;
}

export const FloorMap: React.FC<FloorMapProps> = ({
  sections,
  seats,
  onSelectSeat,
  selectedSeatId,
  highlightedSeatId,
  filteredSeatIds,
}) => {
  const getSectionIcon = (code: string) => {
    switch (code) {
      case 'A': return <BookOpen className="w-4 h-4 text-white" />;
      case 'B': return <Monitor className="w-4 h-4 text-white" />;
      case 'C': return <Library className="w-4 h-4 text-white" />;
      default: return <BookOpen className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div id="floor-layout-container" className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Legend & Instructions in Black & White */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950 border border-zinc-850 rounded-xl p-3.5 text-xs">
        <div className="flex items-center gap-4">
          <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
            Desk Status Legend:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-white font-medium">Available (Free Desk)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
            <span className="text-white font-medium">Occupied (Allocated)</span>
          </div>
        </div>

        <div className="text-zinc-400 text-xs">
          Click any <span className="text-white font-semibold underline">free desk</span> to allocate, or an <span className="text-white font-semibold underline">occupied desk</span> to vacate/view.
        </div>
      </div>

      {/* Sections Grid */}
      <div className="space-y-6">
        {sections.map((section) => {
          const sectionSeats = seats.filter((s) => s.sectionId === section.id);
          const occupiedCount = sectionSeats.filter((s) => s.status === 'OCCUPIED').length;
          const availableCount = sectionSeats.filter((s) => s.status === 'AVAILABLE').length;

          return (
            <div 
              key={section.id} 
              className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 shadow-sm"
            >
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-zinc-850">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    {getSectionIcon(section.code)}
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <span>{section.name}</span>
                      <span className="text-xs font-normal text-zinc-400">({sectionSeats.length} Desks)</span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">{section.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-md bg-zinc-900 text-white font-semibold border border-zinc-800">
                    <span className="text-emerald-400 mr-1.5 font-bold">●</span>
                    {availableCount} Available
                  </span>
                  <span className="px-3 py-1 rounded-md bg-zinc-900 text-white font-semibold border border-zinc-800">
                    <span className="text-rose-400 mr-1.5 font-bold">●</span>
                    {occupiedCount} Occupied
                  </span>
                </div>
              </div>

              {/* Seats Grid: 4 columns on medium/large screens */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {sectionSeats.map((seat) => {
                  const isAvailable = seat.status === 'AVAILABLE';
                  const isSelected = selectedSeatId === seat.id;
                  const isHighlighted = highlightedSeatId === seat.id;
                  const isDimmed = filteredSeatIds && !filteredSeatIds.has(seat.id);

                  return (
                    <button
                      key={seat.id}
                      id={`seat-card-${seat.code}`}
                      onClick={() => onSelectSeat(seat)}
                      className={`relative flex flex-col justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer min-h-[115px] ${
                        isHighlighted
                          ? 'ring-2 ring-white bg-zinc-900 border-white scale-105 z-10'
                          : isSelected
                          ? 'ring-2 ring-white bg-zinc-900 border-white'
                          : isAvailable
                          ? 'bg-black border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/50'
                          : 'bg-black border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/50'
                      } ${isDimmed ? 'opacity-25' : 'opacity-100'}`}
                    >
                      {/* Top Row: Seat Code & Status Pill */}
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5">
                          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-white bg-zinc-900 px-2 py-0.5 rounded border border-zinc-750">
                            {seat.code}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-['JetBrains_Mono',monospace] border ${
                            isAvailable
                              ? 'bg-zinc-900 text-emerald-400 border-emerald-500/30'
                              : 'bg-zinc-900 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {isAvailable ? 'Free' : 'Occupied'}
                        </span>
                      </div>

                      {/* Middle: Student Details or Empty Notice */}
                      <div className="my-2">
                        {isAvailable ? (
                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-white transition-colors">
                            <PlusCircle className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Click to Allocate</span>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-xs font-semibold text-white truncate">
                              <User className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                              <span className="truncate">{seat.studentName}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-['JetBrains_Mono',monospace]">
                              <GraduationCap className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                              <span className="truncate">{seat.rollNo}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Footer: Course / Time */}
                      <div className="text-[10px] text-zinc-500 pt-1.5 border-t border-zinc-850 flex items-center justify-between w-full">
                        <span>{seat.course || section.code}</span>
                        {seat.checkInTime && (
                          <span className="font-['JetBrains_Mono',monospace] text-zinc-400">{seat.checkInTime}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
