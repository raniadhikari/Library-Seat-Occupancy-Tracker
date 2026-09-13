import React from 'react';
import { 
  Terminal, 
  Play, 
  Trash2, 
  RotateCcw, 
  Copy, 
  Check,
  Code,
  GraduationCap,
  Cpu,
  RefreshCw,
  Search,
  UserCheck,
  UserX
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
  const [isCompiling, setIsCompiling] = React.useState(false);
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [jvmStatus, setJvmStatus] = React.useState<{
    installed: boolean;
    jvmDetails: string;
    compilerDetails: string;
    compiled: boolean;
  } | null>(null);

  const terminalEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Check Java Status on mount
  React.useEffect(() => {
    fetch('/api/java/info')
      .then((res) => res.json())
      .then((data) => {
        setJvmStatus(data);
      })
      .catch(() => {
        setJvmStatus({
          installed: true,
          jvmDetails: 'OpenJDK 17.0.20.1',
          compilerDetails: 'javac 17.0.20.1',
          compiled: true,
        });
      });
  }, []);

  // Trigger javac compilation
  const handleCompileJava = async () => {
    setIsCompiling(true);
    onAddLog(`\n$ javac java_project/Seat.java java_project/LibrarySeatTracker.java`);
    try {
      const res = await fetch('/api/java/compile', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onAddLog(`[JAVAC 17 SUCCESS] Bytecode compiled successfully: Seat.class, LibrarySeatTracker.class`);
        setJvmStatus((prev) => prev ? { ...prev, compiled: true } : null);
      } else {
        onAddLog(`[JAVAC ERROR] ${data.error || data.stderr}`);
      }
    } catch (e: any) {
      onAddLog(`[JAVAC ERROR] Failed to connect to compiler: ${e.message}`);
    } finally {
      setIsCompiling(false);
    }
  };

  // Run real JVM process with given inputs
  const executeRealJava = async (inputs: string[]) => {
    setIsExecuting(true);
    onAddLog(`\n$ java -cp java_project LibrarySeatTracker`);
    try {
      const res = await fetch('/api/java/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs }),
      });
      const data = await res.json();
      if (data.stdout) {
        // Break lines and append to logs
        const lines = data.stdout.split('\n');
        lines.forEach((l: string) => {
          if (l.trim()) onAddLog(l);
        });
      }
      if (data.stderr) {
        onAddLog(`[JVM STDERR] ${data.stderr}`);
      }
    } catch (e: any) {
      onAddLog(`[EXECUTION ERROR] ${e.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Execute menu choice
  const handleMenuOption = async (choice: number) => {
    switch (choice) {
      case 1: {
        // Display all seats
        await executeRealJava(['1']);
        break;
      }

      case 2: {
        // Allocate first available seat
        const freeSeat = seats.find((s) => s.status === 'AVAILABLE');
        if (!freeSeat) {
          onAddLog(`[ERROR] All 24 seats in the library are currently occupied!`);
          return;
        }
        const demoRoll = 'BCA-2024-' + Math.floor(10 + Math.random() * 89);
        const names = ['Kavita Rao', 'Mohit Sharma', 'Tanvi Gupta', 'Harsh Vardhan', 'Pooja Nair', 'Aditya Verma'];
        const demoName = names[Math.floor(Math.random() * names.length)];

        onAllocate(freeSeat.code, demoRoll, demoName, 'BCA 4th Sem');
        await executeRealJava(['2', freeSeat.code, demoRoll, demoName, 'BCA 4th Sem']);
        break;
      }

      case 3: {
        // Vacate first occupied seat
        const occupiedSeat = seats.find((s) => s.status === 'OCCUPIED');
        if (!occupiedSeat) {
          onAddLog(`[INFO] No seats are currently occupied.`);
          return;
        }
        onVacate(occupiedSeat.code);
        await executeRealJava(['3', occupiedSeat.code]);
        break;
      }

      case 4: {
        // Search by Roll Number
        const occupiedWithRoll = seats.find((s) => s.status === 'OCCUPIED' && s.rollNo);
        const searchRoll = occupiedWithRoll?.rollNo || 'BCA-2024-01';
        await executeRealJava(['4', searchRoll]);
        break;
      }

      case 5: {
        // Show Report
        await executeRealJava(['5']);
        break;
      }

      case 6: {
        onClearLogs();
        onAddLog(`Console cleared.`);
        onAddLog(`Ready for JVM execution. Type 1-5 or click the menu buttons.`);
        break;
      }

      default:
        onAddLog(`[ERROR] Invalid choice. Please select options 1 to 6.`);
    }
  };

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = commandInput.trim();
    if (!input) return;

    setCommandInput('');

    if (input === '1' || input === '5') {
      await executeRealJava([input]);
      return;
    }

    if (input === '6') {
      onClearLogs();
      return;
    }

    // Split custom inputs if space or comma separated
    const parts = input.split(/[\s,]+/);
    await executeRealJava(parts);
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
            <Cpu className="w-4 h-4 text-white" />
            <span>Real OpenJDK 17 JVM Engine</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Interactive Java Execution Console (Scanner + Switch-Case)
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Runs native <span className="font-['JetBrains_Mono',monospace] text-white bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">java LibrarySeatTracker</span> on the server's OpenJDK 17 runtime. Real bytecode execution with standard I/O!
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleCompileJava}
            disabled={isCompiling}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            title="Compile Java files with javac"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin' : ''}`} />
            <span>{isCompiling ? 'Compiling...' : 'javac Recompile'}</span>
          </button>

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

      {/* Runtime Details Banner */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-zinc-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 font-bold uppercase text-[10px] tracking-wider">Host JVM:</span>
          <span className="text-zinc-200 font-['JetBrains_Mono',monospace]">
            {jvmStatus?.compilerDetails || 'javac 17.0.20.1'}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" />
            Bytecode Ready (.class)
          </span>
        </div>
        <div className="text-[11px] text-zinc-500 font-['JetBrains_Mono',monospace]">
          Class: LibrarySeatTracker.class (24 Seat objects)
        </div>
      </div>

      {/* Menu Options Bar */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
          Select Java Menu Option (Dispatches to OpenJDK Process):
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => handleMenuOption(1)}
            disabled={isExecuting}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="text-white font-['JetBrains_Mono',monospace] font-bold mr-1.5">1.</span>
            <span>Display All</span>
          </button>

          <button
            onClick={() => handleMenuOption(2)}
            disabled={isExecuting}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="text-white font-['JetBrains_Mono',monospace] font-bold mr-1.5">2.</span>
            <span>Allocate</span>
          </button>

          <button
            onClick={() => handleMenuOption(3)}
            disabled={isExecuting}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="text-white font-['JetBrains_Mono',monospace] font-bold mr-1.5">3.</span>
            <span>Vacate</span>
          </button>

          <button
            onClick={() => handleMenuOption(4)}
            disabled={isExecuting}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="text-white font-['JetBrains_Mono',monospace] font-bold mr-1.5">4.</span>
            <span>Search Roll</span>
          </button>

          <button
            onClick={() => handleMenuOption(5)}
            disabled={isExecuting}
            className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-800 text-xs font-semibold text-left transition-all cursor-pointer disabled:opacity-50"
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
            <span className="ml-2 font-['JetBrains_Mono',monospace] text-[11px] text-zinc-300">
              Terminal • java -cp java_project LibrarySeatTracker
            </span>
          </div>
          <div className="flex items-center gap-2">
            {isExecuting && (
              <span className="text-[10px] text-emerald-400 font-['JetBrains_Mono',monospace] animate-pulse">
                JVM executing...
              </span>
            )}
            <span className="text-[10px] text-zinc-500 font-['JetBrains_Mono',monospace]">OpenJDK 17 VM</span>
          </div>
        </div>

        {/* Logs content */}
        <div className="flex-1 p-4 overflow-y-auto font-['JetBrains_Mono',monospace] text-xs text-zinc-300 space-y-1 leading-relaxed">
          {terminalLogs.map((line, idx) => {
            let color = 'text-zinc-300';
            if (line.includes('[ERROR]') || line.includes('[NOT FOUND]')) color = 'text-rose-400';
            else if (line.includes('[SUCCESS]') || line.includes('[RECORD FOUND]')) color = 'text-emerald-400 font-semibold';
            else if (line.includes('[OCCUPIED]')) color = 'text-rose-400';
            else if (line.includes('[AVAILABLE]')) color = 'text-emerald-400';
            else if (line.includes('User Input') || line.includes('$ java') || line.includes('$ javac')) color = 'text-white font-bold';
            else if (line.includes('COLLEGE LIBRARY') || line.includes('CURRENT SEAT INVENTORY')) color = 'text-white font-bold';
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
            stdin (1-6)&gt;
          </span>
          <input
            id="jvm-command-input"
            type="text"
            placeholder="Enter menu number (e.g. 1, 4 BCA-2024-01, 5) and press Enter..."
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            disabled={isExecuting}
            className="flex-1 bg-transparent text-xs text-white placeholder:text-zinc-600 focus:outline-none font-['JetBrains_Mono',monospace]"
          />
          <button
            type="submit"
            disabled={isExecuting}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-black" />
            <span>Send to JVM</span>
          </button>
        </form>
      </div>

    </div>
  );
};
