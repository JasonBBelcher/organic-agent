#!/usr/bin/env node

const { Command } = require('commander');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const program = new Command();
program.name('ai-agent').description('Organic Learning Agent CLI').version('1.0.0');

// Helper function to check if file exists
function checkFileExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ${description} not found: ${filePath}`);
    process.exit(1);
  }
}

program
  .command('reflect')
  .argument('<logFile>', 'Path to session log file (e.g. data/logs/session_12.md)')
  .description('Generate a reflection markdown file from a session log')
  .action((logFile) => {
    checkFileExists(logFile, 'Session log file');
    const scriptPath = path.join(__dirname, 'generateReflection.js');
    execSync(`node ${scriptPath} ${logFile}`, { stdio: 'inherit' });
  });

program
  .command('diff')
  .argument('<oldFile>', 'Old version of memory tree')
  .argument('<newFile>', 'New version of memory tree')
  .description('Generate a markdown diff between two memory tree versions')
  .action((oldFile, newFile) => {
    checkFileExists(oldFile, 'Old memory tree file');
    checkFileExists(newFile, 'New memory tree file');
    const scriptPath = path.join(__dirname, 'diffTree.js');
    execSync(`node ${scriptPath} ${oldFile} ${newFile}`, { stdio: 'inherit' });
  });

program
  .command('summarize')
  .argument('<diffFile>', 'Path to diff file (e.g. data/diffs/tree_diff_XXXXX.md)')
  .description('Generate an evolution summary from a memory tree diff')
  .action((diffFile) => {
    checkFileExists(diffFile, 'Diff file');
    const scriptPath = path.join(__dirname, 'summarizeDiff.js');
    execSync(`node ${scriptPath} ${diffFile}`, { stdio: 'inherit' });
  });

program
  .command('commit')
  .argument('<message>', 'Commit message describing the learning session')
  .description('Commit current learning state with a descriptive message')
  .action((message) => {
    console.log('🔄 Committing learning state...');
    const timestamp = new Date().toISOString();
    const commitLog = `# Learning Commit\n\n**Timestamp:** ${timestamp}\n**Message:** ${message}\n\n**Files committed:**\n- Organic learning tree\n- Recent reflections\n- Recent diffs\n- Recent summaries\n`;
    
    const { safeWriteFile } = require('./utils');
    const commitPath = `data/commits/commit_${Date.now()}.md`;
    safeWriteFile(commitPath, commitLog);
    
    console.log('✅ Learning state committed:', commitPath);
  });

program
  .command('status')
  .description('Show current learning system status and recent activity')
  .action(() => {
    console.log('🧠 Organic Learning Agent Status\n');
    
    const dataDir = 'data';
    const subdirs = ['logs', 'reflections', 'diffs', 'summaries', 'commits', 'memory'];
    
    subdirs.forEach(subdir => {
      const dirPath = path.join(dataDir, subdir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
        console.log(`📁 ${subdir}: ${files.length} files`);
        if (files.length > 0) {
          const latest = files.sort().reverse()[0];
          console.log(`   Latest: ${latest}`);
        }
      } else {
        console.log(`📁 ${subdir}: Directory not found`);
      }
    });
    
    // Memory tree status
    const memoryTree = 'data/memory/organic_learning_tree.md';
    if (fs.existsSync(memoryTree)) {
      const stats = fs.statSync(memoryTree);
      const content = fs.readFileSync(memoryTree, 'utf-8');
      const lines = content.split('\n').length;
      console.log(`\n🌳 Memory Tree: ${lines} lines, last modified ${stats.mtime.toLocaleDateString()}`);
    } else {
      console.log('\n🌳 Memory Tree: Not found');
    }
  });

program.parse();
