import React from 'react';
import { 
  X, 
  UserCheck, 
  LogOut, 
  User, 
  AlertCircle
} from 'lucide-react';
import { Seat, Section } from '../types';

interface SeatDetailsModalProps {
  seat: Seat | null;
  section: Section | null;
  isOpen: boolean;
  onClose: () => void;
  onAllocate: (seatCode: string, rollNo: string, studentName: string, course: string) => void;
  onVacate: (seatCode: string) => void;
}

export const SeatDetailsModal: React.FC<SeatDetailsModalProps> = ({
  seat,
  isOpen,
  onClose,
  onAllocate,
  onVacate,
}) => {
  if (!isOpen || !seat) return null;

  const [rollNo, setRollNo] = React.useState('');
  const [studentName, setStudentName] = React.useState('');
  const [course, setCourse] = React.useState('BCA 4th Sem');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setRollNo('');
    setStudentName('');
    setCourse('BCA 4th Sem');
    setError('');
  }, [seat]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNo.trim() || !studentName.trim()) {
      setError('Please fill both Student Roll Number and Name.');
      return;
    }
    onAllocate(seat.code, rollNo.trim().toUpperCase(), studentName.trim(), course);
    onClose();
  };

  const handleVacateClick = () => {
    onVacate(seat.code);
    onClose();
  };

  const isOccupied = seat.status === 'OCCUPIED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        id="seat-details-modal"
        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black border border-zinc-700 flex items-center justify-center font-bold text-xs text-white font-['JetBrains_Mono',monospace]">
              {seat.code}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isOccupied ? `Desk ${seat.code} (Occupied)` : `Allocate Desk ${seat.code}`}
              </h3>
              <p className="text-xs text-zinc-400">{seat.sectionName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {isOccupied ? (
            /* Occupied View: Student Information & Vacate Button */
            <div className="space-y-4">
              <div className="bg-black border border-zinc-800 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Currently Occupied</div>
                  <div className="text-sm font-bold text-white">{seat.studentName}</div>
                  <div className="text-xs font-['JetBrains_Mono',monospace] text-zinc-400">{seat.rollNo}</div>
                </div>
              </div>

              <div className="bg-black rounded-xl p-3 space-y-2 text-xs border border-zinc-850">
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Course / Class:</span>
                  <span className="font-semibold text-white">{seat.course || 'BCA'}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="text-zinc-500">Section:</span>
                  <span className="text-white">{seat.sectionName}</span>
                </div>
                {seat.checkInTime && (
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-500">Allocated Time:</span>
                    <span className="font-['JetBrains_Mono',monospace] text-white">{seat.checkInTime}</span>
                  </div>
                )}
              </div>

              {/* Java action info */}
              <div className="text-[11px] font-['JetBrains_Mono',monospace] text-zinc-400 bg-black p-2.5 rounded-lg border border-zinc-850">
                Java Call: <span className="text-white font-bold">seat.vacate();</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleVacateClick}
                  className="flex-1 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Vacate Desk</span>
                </button>
              </div>
            </div>
          ) : (
            /* Available View: Allocation Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-black border border-rose-500/40 rounded-lg p-2.5 text-xs text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Student Roll Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BCA-2024-42"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white uppercase font-['JetBrains_Mono',monospace]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikramaditya Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Course / Semester
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                >
                  <option value="BCA 1st Sem" className="bg-zinc-900 text-white">BCA 1st Sem</option>
                  <option value="BCA 2nd Sem" className="bg-zinc-900 text-white">BCA 2nd Sem</option>
                  <option value="BCA 3rd Sem" className="bg-zinc-900 text-white">BCA 3rd Sem</option>
                  <option value="BCA 4th Sem" className="bg-zinc-900 text-white">BCA 4th Sem</option>
                  <option value="BCA 5th Sem" className="bg-zinc-900 text-white">BCA 5th Sem</option>
                  <option value="BCA 6th Sem" className="bg-zinc-900 text-white">BCA 6th Sem</option>
                  <option value="MCA 1st Year" className="bg-zinc-900 text-white">MCA 1st Year</option>
                  <option value="B.Sc CS" className="bg-zinc-900 text-white">B.Sc Computer Science</option>
                </select>
              </div>

              {/* Java action info */}
              <div className="text-[11px] font-['JetBrains_Mono',monospace] text-zinc-400 bg-black p-2.5 rounded-lg border border-zinc-850">
                Java Call: <span className="text-white font-bold">targetSeat.allocate(roll, name, course);</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Allocate Desk</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
