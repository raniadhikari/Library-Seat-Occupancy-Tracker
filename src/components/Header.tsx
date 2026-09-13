import React from 'react';
import { 
  BookOpen, 
  Code2, 
  LayoutGrid, 
  Terminal,
  UserCheck,
  GraduationCap,
  HelpCircle
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'map' | 'java-console' | 'java-code' | 'guide';
  onTabChange: (tab: 'map' | 'java-console' | 'java-code' | 'guide') => void;
  onOpenQuickAllocate: () => void;
  totalSeats: number;
  occupiedSeats: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenQuickAllocate,
  totalSeats,
  occupiedSeats,
}) => {
  return (
    <header id="app-header" className="bg-black/95 border-b border-zinc-850 sticky top-0 z-30 px-4 lg:px-8 py-3.5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Branding & Academic info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white text-black flex items-center justify-center font-bold shadow-sm">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Library Seat Occupancy Tracker
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800">
                <GraduationCap className="w-3 h-3 text-zinc-400" />
                BCA Project
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
              <span>Java OOP System</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300 font-mono text-[11px]">24 Desks (Sec A, B, C)</span>
            </div>
          </div>
        </div>

        {/* Center: Tabs with clean monochrome styling */}
        <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 overflow-x-auto">
          <button
            id="tab-map-btn"
            onClick={() => onTabChange('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'map'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Floor Layout</span>
          </button>
          
          <button
            id="tab-java-console-btn"
            onClick={() => onTabChange('java-console')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'java-console'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Java Console</span>
          </button>

          <button
            id="tab-java-code-btn"
            onClick={() => onTabChange('java-code')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'java-code'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Java Source (.java)</span>
          </button>

          <button
            id="tab-guide-btn"
            onClick={() => onTabChange('guide')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'guide'
                ? 'bg-white text-black shadow-sm font-bold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Viva & Guide</span>
          </button>
        </div>

        {/* Right: Fast Allocate Button */}
        <div className="flex items-center gap-2">
          <button
            id="quick-checkin-btn"
            onClick={onOpenQuickAllocate}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-zinc-200 text-black shadow transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Allocate Desk</span>
          </button>
        </div>

      </div>
    </header>
  );
};
