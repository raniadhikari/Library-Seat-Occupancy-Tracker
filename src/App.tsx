import React from 'react';
import { 
  INITIAL_SECTIONS, 
  INITIAL_SEATS, 
  INITIAL_LOGS 
} from './data/initialData';
import { 
  Seat, 
  Section, 
  ActivityLog, 
  OccupancyStats, 
  SeatStatus 
} from './types';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { ZoneFilterBar } from './components/ZoneFilterBar';
import { FloorMap } from './components/FloorMap';
import { SeatDetailsModal } from './components/SeatDetailsModal';
import { QuickCheckInModal } from './components/QuickCheckInModal';
import { JavaCodeViewer } from './components/JavaCodeViewer';
import { JavaConsoleSimulator } from './components/JavaConsoleSimulator';
import { BcaProjectGuide } from './components/BcaProjectGuide';

export default function App() {
  const [seats, setSeats] = React.useState<Seat[]>(INITIAL_SEATS);
  const [sections] = React.useState<Section[]>(INITIAL_SECTIONS);
  const [logs, setLogs] = React.useState<ActivityLog[]>(INITIAL_LOGS);
  
  const [currentTab, setCurrentTab] = React.useState<'map' | 'java-console' | 'java-code' | 'guide'>('map');
  const [selectedSeat, setSelectedSeat] = React.useState<Seat | null>(null);
  const [isQuickAllocateOpen, setIsQuickAllocateOpen] = React.useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<SeatStatus | 'ALL'>('ALL');
  const [selectedSectionId, setSelectedSectionId] = React.useState<string>('');
  const [highlightedSeatId, setHighlightedSeatId] = React.useState<string | null>(null);

  // Terminal logs for BCA Console
  const [terminalLogs, setTerminalLogs] = React.useState<string[]>([
    `=======================================================`,
    `     COLLEGE LIBRARY SEAT OCCUPANCY TRACKER (BCA)     `,
    `=======================================================`,
    `[INFO] Initialized 24 library desks across 3 Sections.`,
    `[INFO] Preloaded student records into Seat[] array.`,
    `Ready for user commands. Type 1-5 or click menu buttons.`,
  ]);

  const addTerminalLog = (msg: string) => {
    setTerminalLogs((prev) => [...prev.slice(-120), msg]);
  };

  // Compute stats
  const stats: OccupancyStats = React.useMemo(() => {
    const totalSeats = seats.length;
    const occupied = seats.filter((s) => s.status === 'OCCUPIED').length;
    const available = totalSeats - occupied;
    const occupancyRate = totalSeats > 0 ? Math.round((occupied / totalSeats) * 100) : 0;

    return {
      totalSeats,
      occupied,
      available,
      occupancyRate,
    };
  }, [seats]);

  // Actions
  const handleAllocate = (seatCode: string, rollNo: string, studentName: string, course: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setSeats((prev) =>
      prev.map((s) => {
        if (s.code === seatCode) {
          return {
            ...s,
            status: 'OCCUPIED',
            rollNo,
            studentName,
            course,
            checkInTime: timeStr,
          };
        }
        return s;
      })
    );

    const seat = seats.find((s) => s.code === seatCode);
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      timestamp: timeStr,
      seatCode,
      sectionName: seat?.sectionName || 'Library',
      action: 'ALLOCATE',
      studentDetails: `${studentName} (${rollNo})`,
      details: `Desk ${seatCode} allocated to ${studentName}`,
    };
    setLogs((prev) => [newLog, ...prev]);

    addTerminalLog(`[SUCCESS] Seat ${seatCode} allocated to ${studentName} (${rollNo}, ${course}) at ${timeStr}`);
  };

  const handleVacate = (seatCode: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const seat = seats.find((s) => s.code === seatCode);

    setSeats((prev) =>
      prev.map((s) => {
        if (s.code === seatCode) {
          return {
            ...s,
            status: 'AVAILABLE',
            rollNo: undefined,
            studentName: undefined,
            course: undefined,
            checkInTime: undefined,
          };
        }
        return s;
      })
    );

    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      timestamp: timeStr,
      seatCode,
      sectionName: seat?.sectionName || 'Library',
      action: 'VACATE',
      studentDetails: seat?.studentName ? `${seat.studentName} (${seat.rollNo || ''})` : 'Student',
      details: `Desk ${seatCode} vacated and marked free`,
    };
    setLogs((prev) => [newLog, ...prev]);

    addTerminalLog(`[SUCCESS] Seat ${seatCode} vacated. Status is now [AVAILABLE].`);
  };

  // Find next free seat
  const handleFindFreeSeat = () => {
    const free = seats.find((s) => s.status === 'AVAILABLE');
    if (free) {
      setHighlightedSeatId(free.id);
      setSelectedSeat(free);
      addTerminalLog(`[FIND] Next available desk is ${free.code} in ${free.sectionName}`);
      setTimeout(() => setHighlightedSeatId(null), 4000);
    } else {
      alert('All seats in the library are currently occupied!');
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setSelectedSectionId('');
    setHighlightedSeatId(null);
  };

  // Filtered seat IDs
  const filteredSeatIds = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const hasFilters = q || statusFilter !== 'ALL' || selectedSectionId;

    if (!hasFilters) return undefined;

    const matched = new Set<string>();
    seats.forEach((s) => {
      // Section filter
      if (selectedSectionId && s.sectionId !== selectedSectionId) return;

      // Status filter
      if (statusFilter !== 'ALL' && s.status !== statusFilter) return;

      // Search query: match code, roll, or student name
      if (q) {
        const matchCode = s.code.toLowerCase().includes(q);
        const matchRoll = s.rollNo?.toLowerCase().includes(q);
        const matchName = s.studentName?.toLowerCase().includes(q);
        if (!matchCode && !matchRoll && !matchName) return;
      }

      matched.add(s.id);
    });

    return matched;
  }, [seats, searchQuery, statusFilter, selectedSectionId]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-['Outfit',sans-serif]">
      
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenQuickAllocate={() => setIsQuickAllocateOpen(true)}
        totalSeats={stats.totalSeats}
        occupiedSeats={stats.occupied}
      />

      {/* Global Occupancy Stats Bar */}
      <StatsBar
        stats={stats}
        sections={sections}
        seats={seats}
        selectedSectionId={selectedSectionId}
        onSelectSection={(id) => setSelectedSectionId(id)}
      />

      {/* Filter & Search Bar (Active on Layout view) */}
      {currentTab === 'map' && (
        <ZoneFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onResetFilters={handleResetFilters}
          onFindFreeSeat={handleFindFreeSeat}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'map' && (
          <FloorMap
            sections={sections}
            seats={seats}
            onSelectSeat={(seat) => setSelectedSeat(seat)}
            selectedSeatId={selectedSeat?.id}
            highlightedSeatId={highlightedSeatId}
            filteredSeatIds={filteredSeatIds}
          />
        )}

        {currentTab === 'java-console' && (
          <JavaConsoleSimulator
            seats={seats}
            onAllocate={handleAllocate}
            onVacate={handleVacate}
            terminalLogs={terminalLogs}
            onAddLog={addTerminalLog}
            onClearLogs={() => setTerminalLogs([
              `=======================================================`,
              `     COLLEGE LIBRARY SEAT OCCUPANCY TRACKER (BCA)     `,
              `=======================================================`,
              `[INFO] Console screen cleared. Ready for next command.`,
            ])}
          />
        )}

        {currentTab === 'java-code' && (
          <JavaCodeViewer />
        )}

        {currentTab === 'guide' && (
          <BcaProjectGuide
            stats={stats}
            logs={logs}
          />
        )}
      </main>

      {/* Seat Management Action Modal */}
      <SeatDetailsModal
        seat={selectedSeat}
        section={sections.find((s) => s.id === selectedSeat?.sectionId) || null}
        isOpen={!!selectedSeat}
        onClose={() => setSelectedSeat(null)}
        onAllocate={handleAllocate}
        onVacate={handleVacate}
      />

      {/* Fast Seat Booking Modal */}
      <QuickCheckInModal
        isOpen={isQuickAllocateOpen}
        onClose={() => setIsQuickAllocateOpen(false)}
        sections={sections}
        seats={seats}
        onAllocate={handleAllocate}
      />

      {/* Academic Project Footer */}
      <footer className="border-t border-zinc-900 bg-black px-4 py-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>College Library Seat Occupancy Tracker • BCA Academic Mini-Project</span>
          <span className="font-mono text-[11px] text-zinc-400">Core Java • OOP Encapsulation • Array of Objects</span>
        </div>
      </footer>

    </div>
  );
}
