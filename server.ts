import express from "express";
import path from "path";
import fs from "fs";
import { exec, spawn } from "child_process";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const javaDir = path.join(process.cwd(), "java_project");

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Java Environment Info
  app.get("/api/java/info", (_req, res) => {
    exec("java -version && javac -version", (error, _stdout, stderr) => {
      exec("javac -version", (err2, stdout2) => {
        const hasSeatClass = fs.existsSync(path.join(javaDir, "Seat.class"));
        const hasTrackerClass = fs.existsSync(path.join(javaDir, "LibrarySeatTracker.class"));

        res.json({
          installed: !error,
          jvmDetails: stderr || "OpenJDK 17.0.20.1",
          compilerDetails: stdout2?.trim() || "javac 17.0.20.1",
          compiled: hasSeatClass && hasTrackerClass,
          javaDirExists: fs.existsSync(javaDir),
          availableFiles: fs.existsSync(javaDir) ? fs.readdirSync(javaDir) : [],
        });
      });
    });
  });

  // Compile Java files endpoint
  app.post("/api/java/compile", (_req, res) => {
    const cmd = "javac java_project/Seat.java java_project/LibrarySeatTracker.java";
    exec(cmd, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message,
          stderr: stderr,
          stdout: stdout,
        });
      }
      res.json({
        success: true,
        message: "Compiled Seat.java and LibrarySeatTracker.java successfully into bytecode (.class)",
        stdout,
        stderr,
      });
    });
  });

  // Execute real Java program with inputs
  app.post("/api/java/execute", (req, res) => {
    const { inputs } = req.body as { inputs?: string[] };
    const inputSequence = Array.isArray(inputs) && inputs.length > 0 
      ? inputs.join("\n") + "\n6\n" 
      : "1\n6\n";

    const child = spawn("java", ["-cp", "java_project", "LibrarySeatTracker"], {
      cwd: process.cwd(),
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      res.json({
        success: code === 0,
        exitCode: code,
        stdout,
        stderr,
        inputSent: inputSequence,
      });
    });

    child.stdin.write(inputSequence);
    child.stdin.end();
  });

  // Download raw file
  app.get("/api/java/download/:filename", (req, res) => {
    const filename = req.params.filename;
    const allowed = ["Seat.java", "LibrarySeatTracker.java", "LibrarySwingGUI.java", "compile_and_run.sh", "compile_and_run.bat", "README.md"];
    if (!allowed.includes(filename)) {
      return res.status(404).send("File not found");
    }
    const filePath = path.join(javaDir, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found on disk");
    }
    res.download(filePath, filename);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
