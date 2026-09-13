import React from 'react';
import { 
  Search, 
  Sparkles, 
  RotateCcw,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { SeatStatus } from '../types';

interface ZoneFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: SeatStatus | 'ALL';
  onStatusFilterChange: (status: SeatStatus | 'ALL') => void;
  onResetFilters: () => void;
  onFindFreeSeat: () => void;
}

export const ZoneFilterBar: React.FC<ZoneFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onResetFilters,
  onFindFreeSeat,
}) => {
  const isFiltered = searchQuery || statusFilter !== 'ALL';

  return (
    <div id="seat-filter-bar" className="bg-black border-b border-zinc-850 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Search and Status Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-seat-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Roll No (e.g. BCA-2024), Name, or Seat (A-2)..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status buttons */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => onStatusFilterChange('ALL')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onStatusFilterChange('AVAILABLE')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                statusFilter === 'AVAILABLE'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Available</span>
            </button>
            <button
              onClick={() => onStatusFilterChange('OCCUPIED')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                statusFilter === 'OCCUPIED'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <XCircle className="w-3 h-3 text-rose-400" />
              <span>Occupied</span>
            </button>
          </div>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Quick find button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onFindFreeSeat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span>Find Next Free Desk</span>
          </button>
        </div>

      </div>
    </div>
  );
};
