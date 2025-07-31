const fs = require("fs");
const path = require("path");
const { diffLines } = require("diff");
const { safeWriteFile } = require("./utils");

const [prevFile, newFile] = process.argv.slice(2);
if (!prevFile || !newFile) {
  console.error("Usage: node cli/diffTree.js old.md new.md");
  process.exit(1);
}

const oldText = fs.readFileSync(prevFile, "utf-8");
const newText = fs.readFileSync(newFile, "utf-8");

const changes = diffLines(oldText, newText);

let output = `# 🔍 Diff between ${path.basename(prevFile)} and ${path.basename(newFile)}\n\n`;

changes.forEach(part => {
  const symbol = part.added ? '+' : part.removed ? '-' : ' ';
  const lines = part.value.trimEnd().split("\n");
  for (const line of lines) {
    output += `${symbol} ${line}\n`;
  }
});

const diffFileName = `tree_diff_${Date.now()}.md`;
const diffPath = `data/diffs/${diffFileName}`;
safeWriteFile(diffPath, output);
console.log("✅ Diff written to:", diffPath);