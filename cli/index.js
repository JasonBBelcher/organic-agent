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

// Session Management Commands (Deterministic Workflows)

program
  .command('session')
  .argument('<action>', 'Action: start, integrate, list, current')
  .argument('[topic]', 'Topic for start action or session file for integrate')
  .description('Manage learning sessions with deterministic workflows')
  .action((action, topic) => {
    const scriptPath = path.join(__dirname, 'sessionManager.js');
    const args = topic ? `${action} "${topic}"` : action;
    execSync(`node ${scriptPath} ${args}`, { stdio: 'inherit' });
  });

program
  .command('integrate')
  .argument('[sessionFile]', 'Session file to integrate (defaults to most recent)')
  .description('Integrate session learnings into memory tree')
  .action((sessionFile) => {
    const scriptPath = path.join(__dirname, 'sessionManager.js');
    const args = sessionFile ? `integrate "${sessionFile}"` : 'integrate';
    execSync(`node ${scriptPath} ${args}`, { stdio: 'inherit' });
  });

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

// Enhanced Information Retrieval Commands (Unified Interface)

program
  .command('search')
  .argument('<keywords>', 'Keywords to search across all sources (code + memory + logs)')
  .option('-l, --limit <number>', 'Maximum number of results', '20')
  .option('-c, --confidence <number>', 'Minimum confidence threshold (0.0-1.0)', '0.1')
  .option('-s, --source <source>', 'Filter by source: code, memory, logs, all', 'all')
  .description('Unified search across all learning data with confidence scoring')
  .action((keywords, options) => {
    const scriptPath = path.join(__dirname, 'unifiedSearch.js');
    const args = [keywords];
    if (options.limit) args.push('--limit', options.limit);
    if (options.confidence) args.push('--confidence', options.confidence);
    if (options.source) args.push('--source', options.source);
    execSync(`node ${scriptPath} ${args.join(' ')}`, { stdio: 'inherit' });
  });

program
  .command('find')
  .argument('<pattern>', 'Find specific implementation patterns in code')
  .description('Find concrete code examples of specific patterns')
  .action((pattern) => {
    const scriptPath = path.join(__dirname, 'unifiedSearch.js');
    execSync(`node ${scriptPath} "${pattern}" --source code --confidence 0.3`, { stdio: 'inherit' });
  });

program
  .command('examples')
  .argument('<concept>', 'Find code examples of a concept from memory principles')
  .description('Find code implementations related to learned principles')
  .action((concept) => {
    const scriptPath = path.join(__dirname, 'unifiedSearch.js');
    execSync(`node ${scriptPath} "${concept}" --confidence 0.2`, { stdio: 'inherit' });
  });

program
  .command('timeline')
  .description('Show chronological learning progression with session summaries')
  .action(() => {
    const scriptPath = path.join(__dirname, 'timeline.js');
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
  });

program
  .command('principles')
  .option('-f, --filter <filter>', 'Filter principles by keyword')
  .description('List all learned principles with sources and patterns')
  .action((options) => {
    const scriptPath = path.join(__dirname, 'knowledge.js');
    const filter = options.filter ? `"${options.filter}"` : '';
    execSync(`node ${scriptPath} principles ${filter}`, { stdio: 'inherit' });
  });

program
  .command('contradictions')
  .description('Show belief contradictions and their resolutions')
  .action(() => {
    const scriptPath = path.join(__dirname, 'knowledge.js');
    execSync(`node ${scriptPath} contradictions`, { stdio: 'inherit' });
  });

program
  .command('insights')
  .option('-d, --domain <domain>', 'Filter insights by technical domain')
  .description('Browse implementation insights by technical domain')
  .action((options) => {
    const scriptPath = path.join(__dirname, 'knowledge.js');
    const domain = options.domain ? `"${options.domain}"` : '';
    execSync(`node ${scriptPath} insights ${domain}`, { stdio: 'inherit' });
  });

program
  .command('analyze')
  .argument('<topic>', 'Topic to analyze in depth')
  .description('Deep analysis of specific topics or patterns across all data')
  .action((topic) => {
    const scriptPath = path.join(__dirname, 'analysis.js');
    execSync(`node ${scriptPath} analyze "${topic}"`, { stdio: 'inherit' });
  });

program
  .command('compare')
  .argument('<session1>', 'First session file (e.g., session_12.md)')
  .argument('<session2>', 'Second session file (e.g., session_13.md)')
  .description('Compare knowledge evolution between two sessions')
  .action((session1, session2) => {
    const scriptPath = path.join(__dirname, 'analysis.js');
    execSync(`node ${scriptPath} compare "${session1}" "${session2}"`, { stdio: 'inherit' });
  });

program
  .command('export')
  .option('-f, --format <format>', 'Export format (json|markdown)', 'json')
  .description('Export knowledge in different formats for external use')
  .action((options) => {
    const scriptPath = path.join(__dirname, 'analysis.js');
    execSync(`node ${scriptPath} export ${options.format}`, { stdio: 'inherit' });
  });

program
  .command('knowledge-base')
  .description('Export solidified knowledge to a named knowledge base file')
  .action(() => {
    const scriptPath = path.join(__dirname, 'export-knowledge.js');
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
  });

program
  .command('searchable-knowledge-base')
  .description('Export enhanced knowledge base with unified search index')
  .action(() => {
    const scriptPath = path.join(__dirname, 'enhanced-export-knowledge.js');
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
  });

program
  .command('build-code-index')
  .description('Build/rebuild the keyword-based code pattern index')
  .action(() => {
    const scriptPath = path.join(__dirname, 'codeSearch.js');
    execSync(`node ${scriptPath} build-index`, { stdio: 'inherit' });
  });

program
  .command('code-stats')
  .description('Show code pattern index statistics and top keywords')
  .action(() => {
    const scriptPath = path.join(__dirname, 'codeSearch.js');
    execSync(`node ${scriptPath} stats`, { stdio: 'inherit' });
  });

program.parse();
