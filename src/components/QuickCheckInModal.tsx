import React from 'react';
import { X, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Section, Seat } from '../types';

interface QuickCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  seats: Seat[];
  onAllocate: (seatCode: string, rollNo: string, studentName: string, course: string) => void;
}

export const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({
  isOpen,
  onClose,
  seats,
  onAllocate,
}) => {
  if (!isOpen) return null;

  const availableSeats = seats.filter((s) => s.status === 'AVAILABLE');
  const [selectedCode, setSelectedCode] = React.useState<string>(availableSeats[0]?.code || '');
  const [rollNo, setRollNo] = React.useState('');
  const [studentName, setStudentName] = React.useState('');
  const [course, setCourse] = React.useState('BCA 4th Sem');
  const [error, setError] = React.useState('');

  const handleFillDemoStudent = () => {
    const demoRolls = ['BCA-2024-51', 'BCA-2024-52', 'BCA-2023-15', 'BCA-2024-38'];
    const demoNames = ['Vikram Rathore', 'Simran Kaur', 'Aditya Mishra', 'Neha Saxena'];
    const idx = Math.floor(Math.random() * demoRolls.length);
    setRollNo(demoRolls[idx]);
    setStudentName(demoNames[idx]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCode) {
      setError('Please select an available seat.');
      return;
    }
    if (!rollNo.trim() || !studentName.trim()) {
      setError('Please enter both student Roll Number and Name.');
      return;
    }
    onAllocate(selectedCode, rollNo.trim().toUpperCase(), studentName.trim(), course);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        id="quick-allocate-modal"
        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black border border-zinc-700 flex items-center justify-center text-white">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Direct Desk Allocation</h3>
              <p className="text-xs text-zinc-400">Allocate any available desk to student</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="bg-black border border-rose-500/40 rounded-lg p-2.5 text-xs text-rose-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {availableSeats.length === 0 ? (
            <div className="text-center py-6 text-zinc-400 text-xs">
              All 24 seats in the library are currently occupied!
            </div>
          ) : (
            <>
              {/* Select Seat */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Choose Available Desk ({availableSeats.length} free)
                </label>
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-white font-['JetBrains_Mono',monospace]"
                >
                  {availableSeats.map((s) => (
                    <option key={s.id} value={s.code} className="bg-zinc-900 text-white">
                      Desk {s.code} ({s.sectionName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Demo auto-fill */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleFillDemoStudent}
                  className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 underline underline-offset-2 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-fill demo student
                </button>
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Student Roll Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. BCA-2024-51"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white uppercase font-['JetBrains_Mono',monospace]"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikram Rathore"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white"
                />
              </div>

              {/* Course */}
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
                </select>
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
                  className="flex-1 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-colors shadow cursor-pointer"
                >
                  Allocate Desk
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
