import React from 'react';
import { 
  Terminal, 
  Play, 
  Trash2, 
  RotateCcw, 
  Copy, 
  Check,
  Code,
  GraduationCap
} from 'lucide-react';
import { Seat } from '../types';

interface JavaConsoleSimulatorProps {
  seats: Seat[];
  onAllocate: (seatCode: string, rollNo: string, studentName: string, course: string) => void;
  onVacate: (seatCode: string) => void;
  terminalLogs: string[];
  onAddLog: (line: string) => void;
  onClearLogs: () => void;
}

export const JavaConsoleSimulator: React.FC<JavaConsoleSimulatorProps> = ({
  seats,
  onAllocate,
  onVacate,
  terminalLogs,
  onAddLog,
  onClearLogs,
}) => {
  const [commandInput, setCommandInput] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const terminalEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Execute menu choice or method
  const handleMenuOption = (choice: number) => {
    const divider = '=======================================================';
    
    switch (choice) {
      case 1: {
        // Display all seats
        onAddLog(`User Input: 1`);
        onAddLog(`\n--- CURRENT SEAT LAYOUT & OCCUPANCY (Total: 24 Desks) ---`);
        onAddLog(String("SEAT").padEnd(8) + String("SECTION").padEnd(26) + String("STATUS").padEnd(14) + String("ROLL NO").padEnd(16) + "STUDENT NAME");
        onAddLog('----------------------------------------------------------------------------------');
        seats.forEach((s) => {
          const statusStr = s.status === 'OCCUPIED' ? '[OCCUPIED]' : '[AVAILABLE]';
          const roll = s.rollNo || '-';
          const name = s.studentName || '-';
          onAddLog(
            s.code.padEnd(8) +
            s.sectionName.padEnd(26) +
            statusStr.padEnd(14) +
            roll.padEnd(16) +
            name
          );
        });
        break;
      }

      case 2: {
        // Allocate first available seat
        const freeSeat = seats.find((s) => s.status === 'AVAILABLE');
        if (!freeSeat) {
          onAddLog(`User Input: 2`);
          onAddLog(`[ERROR] All seats in the library are currently occupied!`);
          return;
        }
        const demoRoll = 'BCA-2024-' + Math.floor(10 + Math.random() * 89);
        const names = ['Kavita Rao', 'Mohit Sharma', 'Tanvi Gupta', 'Harsh Vardhan', 'Pooja Nair'];
        const demoName = names[Math.floor(Math.random() * names.length)];

        onAddLog(`User Input: 2`);
        onAddLog(`Allocating Seat: ${freeSeat.code} to ${demoName} (${demoRoll})...`);
        onAllocate(freeSeat.code, demoRoll, demoName, 'BCA 4th Sem');
        onAddLog(`[SUCCESS] Seat ${freeSeat.code} allocated to ${demoName} (${demoRoll}) successfully!`);
        break;
      }

      case 3: {
        // Vacate first occupied seat
        const occupiedSeat = seats.find((s) => s.status === 'OCCUPIED');
        if (!occupiedSeat) {
          onAddLog(`User Input: 3`);
          onAddLog(`[INFO] No seats are currently occupied.`);
          return;
        }
        onAddLog(`User Input: 3`);
        onAddLog(`Vacating Seat: ${occupiedSeat.code} (Patron: ${occupiedSeat.studentName})...`);
        onVacate(occupiedSeat.code);
        onAddLog(`[SUCCESS] Seat ${occupiedSeat.code} vacated and is now [AVAILABLE].`);
        break;
      }

      case 4: {
        // Search by Roll Number
        const occupiedWithRoll = seats.find((s) => s.status === 'OCCUPIED' && s.rollNo);
        const searchRoll = occupiedWithRoll?.rollNo || 'BCA-2024-01';
        onAddLog(`User Input: 4`);
        onAddLog(`Searching for Student Roll Number: "${searchRoll}"...`);

        const matched = seats.find((s) => s.rollNo?.toLowerCase() === searchRoll.toLowerCase());
        if (matched) {
          onAddLog(`[RECORD FOUND]`);
          onAddLog(`  Seat Number : ${matched.code}`);
          onAddLog(`  Section     : ${matched.sectionName}`);
          onAddLog(`  Student Name: ${matched.studentName}`);
          onAddLog(`  Roll Number : ${matched.rollNo}`);
          onAddLog(`  Course      : ${matched.course || 'BCA'}`);
        } else {
          onAddLog(`[NOT FOUND] No student with Roll Number '${searchRoll}' currently seated.`);
        }
        break;
      }

      case 5: {
        // Show Report
        const total = seats.length;
        const occupied = seats.filter((s) => s.status === 'OCCUPIED').length;
        const available = total - occupied;
        const rate = ((occupied / total) * 100).toFixed(1);

        onAddLog(`User Input: 5`);
        onAddLog(`\n========== COLLEGE LIBRARY OCCUPANCY REPORT ==========`);
        onAddLog(`  Total Desks in Library : ${total}`);
        onAddLog(`  Occupied Seats         : ${occupied}`);
        onAddLog(`  Available / Free Seats : ${available}`);
        onAddLog(`  Occupancy Rate         : ${rate}%`);
        onAddLog(`======================================================`);
        break;
      }

      case 6: {
        onClearLogs();
        onAddLog(`Console cleared.`);
        onAddLog(`Type 1 to 5, or click the menu buttons above.`);
        break;
      }

      default:
        onAddLog(`[ERROR] Invalid choice. Please select options 1 to 6.`);
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = commandInput.trim();
    if (!input) return;

    if (input === '1' || input === '2' || input === '3' || input === '4' || input === '5' || input === '6') {
      handleMenuOption(parseInt(input, 10));
      setCommandInput('');
      return;
    }

    // Direct Java call format e.g. allocate("A-2", "BCA-10", "Name")
    if (input.toLowerCase().includes('vacate(')) {
      const match = input.match(/vacate\(\s*["']?([^"')]+)["']?\s*\)/i);
      if (match) {
        const code = match[1].trim().toUpperCase();
        onAddLog(`java> ${input}`);
        onVacate(code);
        onAddLog(`[SUCCESS] Seat ${code} vacated.`);
        setCommandInput('');
        return;
      }
    }

    if (input.toLowerCase().includes('allocate(')) {
      const match = input.match(/allocate\(\s*["']?([^"',]+)["']?\s*,\s*["']?([^"',]+)["']?\s*,\s*["']?([^"')]+)["']?\s*\)/i);
      if (match) {
        const code = match[1].trim().toUpperCase();
        const roll = match[2].trim().toUpperCase();
        const name = match[3].trim();
        onAddLog(`java> ${input}`);
        onAllocate(code, roll, name, 'BCA');
        onAddLog(`[SUCCESS] Allocated ${code} to ${name} (${roll}).`);
        setCommandInput('');
        return;
      }
    }

    // Default fallback
    onAddLog(`java> ${input}`);
    onAddLog(`[HELP] Enter 1 for All Seats, 2 for Allocate, 3 for Vacate, 4 for Search, 5 for Report, or 6 to Clear.`);
    setCommandInput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(terminalLogs.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="bca-console-simulator-container" className="p-4 lg:p-8 max-w-7xl mx-auto space-y-5">
      
      {/* Header Info */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Terminal className="w-4 h-4 text-white" />
            <span>Interactive BCA Java Console</span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Menu-Driven Java Console Simulator (Scanner + Switch-Case)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Simulates executing <span className="font-['JetBrains_Mono',monospace] text-white bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">java LibrarySeatTracker</span> in your college command prompt. Click menu options or type inputs below!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-750 text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span className="text-white">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Output</span>
              </>
            )}
          </button>
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-750 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Menu Options Bar */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
          Select Menu Option (Click to execute in Java Console):
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => handleMenuOption(1)}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer"
          >
            <span className="text-white font-['JetBrains_Mono',monospace] font-bold mr-1.5">1.</span>
            <span>Display All</span>
          </button>

          <button
            onClick={() => handleMenuOption(2)}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer"
          >
            <span className="text-white font-['JetBrains_Mono',monospace] font-bold mr-1.5">2.</span>
            <span>Allocate</span>
          </button>

          <button
            onClick={() => handleMenuOption(3)}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer"
          >
            <span className="text-white font-['JetBrains_Mono',monospace] font-bold mr-1.5">3.</span>
            <span>Vacate</span>
          </button>

          <button
            onClick={() => handleMenuOption(4)}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer"
          >
            <span className="text-white font-['JetBrains_Mono',monospace] font-bold mr-1.5">4.</span>
            <span>Search Roll</span>
          </button>

          <button
            onClick={() => handleMenuOption(5)}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer"
          >
            <span className="text-white font-['JetBrains_Mono',monospace] font-bold mr-1.5">5.</span>
            <span>Report</span>
          </button>

          <button
            onClick={() => handleMenuOption(6)}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer"
          >
            <span className="text-zinc-500 font-['JetBrains_Mono',monospace] font-bold mr-1.5">6.</span>
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Terminal Display */}
      <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[480px]">
        {/* Titlebar */}
        <div className="px-4 py-2 bg-zinc-950 border-b border-zinc-850 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 inline-block" />
            <span className="ml-2 font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300">Command Prompt • java LibrarySeatTracker</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-['JetBrains_Mono',monospace]">JDK 17/21 Console</span>
        </div>

        {/* Logs content */}
        <div className="flex-1 p-4 overflow-y-auto font-['JetBrains_Mono',monospace] text-xs text-zinc-300 space-y-1 leading-relaxed">
          {terminalLogs.map((line, idx) => {
            let color = 'text-zinc-300';
            if (line.includes('[ERROR]')) color = 'text-rose-400';
            else if (line.includes('[SUCCESS]')) color = 'text-emerald-400 font-semibold';
            else if (line.includes('[OCCUPIED]')) color = 'text-rose-400';
            else if (line.includes('[AVAILABLE]')) color = 'text-emerald-400';
            else if (line.includes('User Input')) color = 'text-white font-bold';
            else if (line.includes('COLLEGE LIBRARY')) color = 'text-white font-bold';
            else if (line.includes('java>')) color = 'text-zinc-400 font-bold';

            return (
              <div key={idx} className={`${color} whitespace-pre-wrap break-all`}>
                {line}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Input prompt form */}
        <form onSubmit={handleCommandSubmit} className="p-3 bg-zinc-950 border-t border-zinc-850 flex items-center gap-2">
          <span className="font-['JetBrains_Mono',monospace] text-xs text-white font-bold pl-2 select-none">
            choice (1-6)&gt;
          </span>
          <input
            id="jvm-command-input"
            type="text"
            placeholder="Type 1, 2, 3, 4, or 5 and press Enter..."
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none font-['JetBrains_Mono',monospace]"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 fill-black" />
            <span>Enter</span>
          </button>
        </form>
      </div>

    </div>
  );
};
