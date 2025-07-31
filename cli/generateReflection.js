const fs = require("fs");
const path = require("path");
const { safeWriteFile } = require("./utils");

const sessionFile = process.argv[2];
if (!sessionFile) {
  console.error("Usage: node cli/generateReflection.js data/logs/session_XX.md");
  process.exit(1);
}

const raw = fs.readFileSync(sessionFile, "utf-8");

function extractSummary(logText) {
  const lines = logText.split("\n").filter(line => line.trim().length > 0);
  const taskLine = lines.find(l => l.toLowerCase().includes("task:")) || "Task: Unknown";
  const outcomeLine = lines.find(l => l.toLowerCase().includes("outcome:")) || "Outcome: Not recorded";

  let insight = "Claude attempted tool use, but clarity of instruction impacted performance.";
  if (logText.includes("overused tool")) {
    insight = "Claude over-triggered tool use from vague prompts.";
  } else if (logText.includes("missed opportunity")) {
    insight = "Claude under-utilized tools due to lack of trigger logic.";
  }

  return `### [Reflection: ${path.basename(sessionFile)}]
- ${taskLine.trim()}
- ${outcomeLine.trim()}
- Insight: ${insight}
- Proposed Fix: Add logic to delay tool use until input confidence is higher.`;
}

const summary = extractSummary(raw);
const outputPath = sessionFile.replace("logs", "reflections").replace(".md", "_reflection.md");
safeWriteFile(outputPath, summary);

console.log("✅ Reflection generated:", outputPath);