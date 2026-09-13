import React from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FolderTree, 
  GraduationCap
} from 'lucide-react';
import { JAVA_PROJECT_FILES } from '../data/javaCodeSnippets';
import { JavaCodeFile } from '../types';

export const JavaCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = React.useState<JavaCodeFile>(JAVA_PROJECT_FILES[0]);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    let bundle = `/**\n * BCA COLLEGE PROJECT: LIBRARY SEAT OCCUPANCY TRACKER IN JAVA\n * Course: Bachelor of Computer Applications\n * Topic: Object Oriented Programming in Java\n */\n\n`;
    JAVA_PROJECT_FILES.forEach((f) => {
      bundle += `\n// ==========================================================================\n`;
      bundle += `// FILE: ${f.name}\n`;
      bundle += `// CATEGORY: ${f.category}\n`;
      bundle += `// DESCRIPTION: ${f.description}\n`;
      bundle += `// ==========================================================================\n\n`;
      bundle += f.code + `\n\n`;
    });

    const blob = new Blob([bundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'BCA_Library_Seat_Tracker_Java.java';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="java-code-viewer-container" className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Banner in Black & White */}
      <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-white" />
              <span>BCA Academic Project Java Code</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Library Seat Tracker — Clean Object-Oriented Java Source Code
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
              Standard textbook Java OOP code written specifically for BCA semester lab submissions and vivas. Features data encapsulation, array of objects, Scanner input, menu-driven switch-case, and Swing GUI.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Project Code</span>
            </button>
          </div>
        </div>

        {/* OOP Concepts Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-zinc-850 text-xs text-zinc-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            <span>Encapsulation (Private data)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            <span>Array of Objects (Seat[24])</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            <span>Scanner Input & Switch-Case</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white inline-block" />
            <span>Swing GUI (JFrame/JButton)</span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left: File List */}
        <div className="lg:col-span-1 bg-zinc-950 border border-zinc-850 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 pb-2 border-b border-zinc-850">
            <FolderTree className="w-4 h-4 text-white" />
            <span>Java Source Files</span>
          </div>

          <div className="space-y-1.5">
            {JAVA_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-all flex flex-col gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-black border border-white font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-zinc-400'}`} />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Compilation Instructions */}
          <div className="pt-3 border-t border-zinc-850 text-[11px] text-zinc-400 space-y-1.5">
            <p className="font-semibold text-white">How to run in Terminal:</p>
            <div className="font-['JetBrains_Mono',monospace] text-[10px] text-zinc-300 bg-black p-2.5 rounded border border-zinc-800 space-y-1">
              <div>javac Seat.java LibrarySeatTracker.java</div>
              <div className="text-white font-bold">java LibrarySeatTracker</div>
            </div>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-3 bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden flex flex-col shadow">
          {/* Header */}
          <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono',monospace] text-sm font-bold text-white">{selectedFile.name}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-black text-zinc-300 border border-zinc-800">
                  {selectedFile.category}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-750 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span className="text-white">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadSingle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black hover:bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-750 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save .java</span>
              </button>
            </div>
          </div>

          {/* Code Window */}
          <div className="p-4 bg-black overflow-x-auto max-h-[600px] overflow-y-auto">
            <pre className="font-['JetBrains_Mono',monospace] text-xs text-zinc-200 leading-relaxed">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
