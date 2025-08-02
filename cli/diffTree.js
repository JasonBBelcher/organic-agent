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

// Generate literal diff for reference
let diffOutput = `# 🔍 Diff between ${path.basename(prevFile)} and ${path.basename(newFile)}\n\n`;

changes.forEach(part => {
  const symbol = part.added ? '+' : part.removed ? '-' : ' ';
  const lines = part.value.trimEnd().split("\n");
  for (const line of lines) {
    diffOutput += `${symbol} ${line}\n`;
  }
});

// Generate AI reflection prompt
let promptOutput = `# 🤖 AI Reflection Prompt: Knowledge Refinement Analysis

## Context
You are analyzing changes between two versions of your organic learning memory tree:
- **Previous**: ${path.basename(prevFile)}
- **Current**: ${path.basename(newFile)}

## Your Mission
Analyze the changes below and determine if the new information is **additive** or **contradictory** to your existing knowledge. Your goal is to continuously refine knowledge to become more accurate over time.

## Analysis Framework
For each change, ask yourself:

1. **Nature of Change**: Is this new information that builds upon existing knowledge (additive) or does it conflict with what you previously believed (contradictory)?

2. **Accuracy Assessment**: If contradictory, which version is more accurate based on:
   - Recent evidence and outcomes
   - Technical implementation results
   - Real-world validation
   - Logical consistency

3. **Knowledge Evolution**: How should this change your understanding? Should you:
   - Expand existing principles with new insights
   - Revise incorrect assumptions from previous reflections
   - Create new principles for newly discovered patterns
   - Deprecate outdated approaches

## Literal Diff for Analysis
\`\`\`diff
${diffOutput}
\`\`\`

## Instructions for Reflection
1. **Identify Contradictions**: Look for changes that directly contradict previous statements, principles, or patterns
2. **Evaluate Evidence**: Determine which version is supported by stronger evidence
3. **Update Previous Reflection**: If you find contradictions, edit your last reflection to correct inaccuracies
4. **Preserve Valid Insights**: Keep additive information that enhances understanding
5. **Document Evolution**: Note how your understanding has evolved and why

## Reflection Output Format
Structure your analysis as:
- **Contradictions Found**: List any conflicts with previous knowledge
- **Evidence-Based Corrections**: What needs to be updated based on stronger evidence
- **Additive Insights**: New information that builds upon existing knowledge
- **Refined Principles**: Updated or new principles based on this analysis
- **Knowledge Evolution Summary**: How your understanding has become more accurate

Remember: The goal is not just to accumulate information, but to continuously refine it for accuracy and reliability.
`;

const diffFileName = `tree_diff_${Date.now()}.md`;
const diffPath = `data/diffs/${diffFileName}`;
safeWriteFile(diffPath, promptOutput);
console.log("✅ AI Reflection Prompt written to:", diffPath);