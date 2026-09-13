import React from 'react';
import { 
  GraduationCap, 
  HelpCircle, 
  BookOpen, 
  Terminal, 
  Code2, 
  FileText,
  ChevronRight
} from 'lucide-react';
import { ActivityLog, OccupancyStats } from '../types';

interface BcaProjectGuideProps {
  stats: OccupancyStats;
  logs: ActivityLog[];
}

export const BcaProjectGuide: React.FC<BcaProjectGuideProps> = ({ stats, logs }) => {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(0);

  const VIVA_QUESTIONS = [
    {
      q: 'Q1: What is the main objective of this project?',
      a: 'The objective is to automate the library desk allotment process. Instead of physical paper registers, it tracks seat availability in real-time, allocates desks using Student Roll Numbers, and prevents double-booking.',
    },
    {
      q: 'Q2: How is Encapsulation implemented in the Seat class?',
      a: 'All data members in Seat.java (like seatNumber, studentRollNo, studentName, and occupied) are declared private. They cannot be modified directly from outside the class. Public methods like allocate() and vacate() along with getters/setters provide safe, controlled access.',
    },
    {
      q: 'Q3: Why is an Array of Objects (Seat[] seats) used instead of separate variables?',
      a: 'Instead of creating 24 separate variables (seat1, seat2, ... seat24), an array of objects Seat[] seats = new Seat[24] organizes all seat instances into a contiguous memory structure. This allows searching, looping, and updating seats cleanly using for-loops.',
    },
    {
      q: 'Q4: What role does the Scanner class play in your program?',
      a: 'java.util.Scanner reads user inputs from System.in (the keyboard). Methods like nextInt() read the numerical menu choice, and nextLine() reads student strings (Roll Number, Name, Course).',
    },
    {
      q: 'Q5: How does the switch-case statement help in this menu-driven application?',
      a: 'The switch-case statement routes the user\'s integer choice (1 to 6) to the respective function: Option 1 to display seats, Option 2 to allocate, Option 3 to vacate, Option 4 to search, Option 5 for reports, and Option 6 to exit.',
    },
    {
      q: 'Q6: How does the searchByRollNo() method find a student?',
      a: 'It uses a Linear Search algorithm. It traverses through the Seat[] array using an enhanced for-loop and compares the target roll number with s.getStudentRollNo() using equalsIgnoreCase(). If a match is found, details are printed and the loop breaks.',
    },
    {
      q: 'Q7: What is the difference between Core Java Console and Java Swing in this project?',
      a: 'The Console version runs purely in the Command Prompt using text and Scanner inputs. The Swing version (LibrarySwingGUI.java) uses graphical window components like JFrame, JButton grid, and JOptionPane dialogs for mouse-driven interaction.',
    },
    {
      q: 'Q8: What exception might occur and how can it be handled?',
      a: 'If a user inputs non-numeric characters when nextInt() is expected, an InputMismatchException is thrown. It can be handled using a try-catch block to prevent the program from crashing.',
    },
  ];

  return (
    <div id="bca-project-guide-container" className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner in Black & White */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
          <GraduationCap className="w-4 h-4 text-white" />
          <span>BCA Academic Project Dossier & Viva Guide</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          College Library Seat Occupancy Tracker (Java OOP)
        </h2>
        <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Comprehensive project synopsis, OOP theory breakdown, compilation instructions, and commonly asked examiner viva-voce questions designed for BCA practical examinations.
        </p>
      </div>

      {/* 2-Column Grid: Left (Synopsis & OOP Concepts), Right (Viva Questions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Project Details & OOP Breakdown */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Card: Project Synopsis */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-white" />
              <span>Project Synopsis & Specifications</span>
            </h3>
            
            <div className="space-y-2 text-xs text-zinc-300">
              <div className="p-2.5 rounded-lg bg-black border border-zinc-850 flex justify-between">
                <span className="text-zinc-400">Project Title:</span>
                <span className="font-semibold text-white">Library Seat Occupancy Tracker</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black border border-zinc-850 flex justify-between">
                <span className="text-zinc-400">Target Course:</span>
                <span className="font-semibold text-white">BCA (Bachelor of Computer Applications)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black border border-zinc-850 flex justify-between">
                <span className="text-zinc-400">Core Language:</span>
                <span className="font-semibold text-white font-['JetBrains_Mono',monospace]">100% Core Java (JDK 8 / 11 / 17 / 21)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black border border-zinc-850 flex justify-between">
                <span className="text-zinc-400">User Interfaces:</span>
                <span className="font-semibold text-white">CLI (Console) + Swing GUI + Java Web Server</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black border border-zinc-850 flex justify-between">
                <span className="text-zinc-400">Data Storage:</span>
                <span className="font-semibold text-white font-['JetBrains_Mono',monospace]">Seat[] Array of Objects (Encapsulated)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-between">
                <span className="text-zinc-300 font-semibold">Offline College Lab Zip:</span>
                <a
                  href="/api/java/download-zip"
                  className="px-3 py-1 bg-white text-black font-bold text-xs rounded hover:bg-zinc-200 transition-colors inline-block"
                >
                  Download .zip
                </a>
              </div>
            </div>
          </div>

          {/* Card: OOP Concepts Covered */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-white" />
              <span>OOP Concepts Applied in Code</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-black border border-zinc-850">
                <span className="font-bold text-white block mb-1">1. Class and Object</span>
                <p className="text-zinc-300 leading-relaxed">
                  <code className="text-white font-['JetBrains_Mono',monospace] bg-zinc-900 px-1 py-0.5 rounded">Seat</code> is the blueprint class. When the library starts, 24 individual seat objects are instantiated into memory.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black border border-zinc-850">
                <span className="font-bold text-white block mb-1">2. Data Encapsulation</span>
                <p className="text-zinc-300 leading-relaxed">
                  All seat attributes are marked <code className="text-white font-['JetBrains_Mono',monospace] bg-zinc-900 px-1 py-0.5 rounded">private</code>. Outside classes must call <code className="text-white font-['JetBrains_Mono',monospace] bg-zinc-900 px-1 py-0.5 rounded">allocate()</code> or <code className="text-white font-['JetBrains_Mono',monospace] bg-zinc-900 px-1 py-0.5 rounded">vacate()</code> to alter state.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black border border-zinc-850">
                <span className="font-bold text-white block mb-1">3. Array of Objects</span>
                <p className="text-zinc-300 leading-relaxed">
                  <code className="text-white font-['JetBrains_Mono',monospace] bg-zinc-900 px-1 py-0.5 rounded">Seat[] seats = new Seat[24];</code> manages multiple instances in a structured indexable list.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black border border-zinc-850">
                <span className="font-bold text-white block mb-1">4. Control Structures & Methods</span>
                <p className="text-zinc-300 leading-relaxed">
                  Menu navigation implemented with <code className="text-white font-['JetBrains_Mono',monospace] bg-zinc-900 px-1 py-0.5 rounded">do-while</code> and <code className="text-white font-['JetBrains_Mono',monospace] bg-zinc-900 px-1 py-0.5 rounded">switch-case</code>, modularized into distinct static functions.
                </p>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-white" />
                <span>Recent Desk Allocations</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-['JetBrains_Mono',monospace]">{logs.length} records</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {logs.map((l) => (
                <div key={l.id} className="p-2.5 rounded-lg bg-black border border-zinc-850 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-['JetBrains_Mono',monospace] ${
                      l.action === 'ALLOCATE' ? 'bg-zinc-900 text-white border border-zinc-700' : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                    }`}>
                      {l.action}
                    </span>
                    <span className="font-bold text-white font-['JetBrains_Mono',monospace]">{l.seatCode}</span>
                    <span className="text-zinc-400 truncate max-w-[160px]">{l.studentDetails}</span>
                  </div>
                  <span className="font-['JetBrains_Mono',monospace] text-[10px] text-zinc-500">{l.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Top 8 Viva Questions */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-white" />
                <span>BCA Viva Voce FAQ (Top Questions)</span>
              </h3>
              <span className="text-[11px] text-zinc-500 font-medium">Click to toggle</span>
            </div>

            <div className="space-y-2.5">
              {VIVA_QUESTIONS.map((item, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div 
                    key={idx}
                    className="rounded-xl border border-zinc-850 bg-black overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left p-3.5 flex items-center justify-between gap-2 text-xs font-bold text-white hover:text-zinc-300 transition-colors cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-90 text-white' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-850 pt-2.5 bg-zinc-950/60">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Steps to run */}
          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-white" />
              <span>How to run in College Practical Lab</span>
            </h3>

            <div className="space-y-2 text-xs text-zinc-300 font-['JetBrains_Mono',monospace]">
              <div className="p-2.5 rounded-lg bg-black border border-zinc-850">
                <span className="text-zinc-500 block text-[10px] uppercase font-sans font-bold mb-1">Step 1: Save files in a folder</span>
                <span className="text-white">Seat.java, LibrarySeatTracker.java</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black border border-zinc-850">
                <span className="text-zinc-500 block text-[10px] uppercase font-sans font-bold mb-1">Step 2: Compile in Command Prompt</span>
                <span className="text-white">javac Seat.java LibrarySeatTracker.java</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black border border-zinc-850">
                <span className="text-zinc-500 block text-[10px] uppercase font-sans font-bold mb-1">Step 3: Run Menu Program</span>
                <span className="text-white font-bold">java LibrarySeatTracker</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
