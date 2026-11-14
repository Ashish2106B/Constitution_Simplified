const { spawn } = require("child_process");

console.log("\x1b[36m%s\x1b[0m", "🏛️ Starting Nagrik Aur Samvidhan (Backend & Frontend concurrently)...");

const backend = spawn("npm", ["--prefix", "backend", "run", "dev"], {
  stdio: "inherit",
  shell: true,
});

const frontend = spawn("npm", ["--prefix", "frontend", "run", "dev"], {
  stdio: "inherit",
  shell: true,
});

function cleanup() {
  console.log("\nStopping servers...");
  try {
    backend.kill();
  } catch {}
  try {
    frontend.kill();
  } catch {}
  process.exit();
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
