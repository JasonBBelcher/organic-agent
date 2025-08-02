#!/usr/bin/env node

/**
 * Session Management System
 * 
 * Handles session logging and knowledge integration with deterministic workflows.
 */

const fs = require('fs');
const path = require('path');

class SessionManager {
  constructor() {
    this.dataDir = 'data';
    this.logsDir = path.join(this.dataDir, 'logs');
    this.memoryPath = path.join(this.dataDir, 'memory', 'organic_learning_tree.md');
    this.currentSessionFile = null;
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.dataDir, this.logsDir, path.dirname(this.memoryPath)].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  generateSessionId(topic) {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const topicSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return `session_${date}_${topicSlug}`;
  }

  startSession(topic) {
    const sessionId = this.generateSessionId(topic);
    const sessionFile = path.join(this.logsDir, `${sessionId}.md`);
    
    if (fs.existsSync(sessionFile)) {
      console.log(`📝 Resuming existing session: ${sessionId}`);
    } else {
      console.log(`🚀 Starting new session: ${sessionId}`);
      
      const template = this.createSessionTemplate(topic);
      fs.writeFileSync(sessionFile, template);
    }
    
    this.currentSessionFile = sessionFile;
    console.log(`📍 Session file: ${sessionFile}`);
    
    return sessionId;
  }

  createSessionTemplate(topic) {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
    
    return `# Session Log: ${topic}
**Date**: ${date}
**Project**: [Project Name]
**Duration**: [Session Duration]

## Context
[Describe the problem or situation that prompted this work session]

## Problem Analysis
[List the key issues identified]
1. **Issue 1**: Description
2. **Issue 2**: Description

## Solution Approach
[Describe the planned approach to solving the problem]

### Phase 1: [Phase Name]
- [Action taken]
- [Result]

### Phase 2: [Phase Name]  
- [Action taken]
- [Result]

## Technical Implementation
[Include code snippets, configurations, and technical details]

\`\`\`[language]
// Code examples
\`\`\`

## Key Learning Points
[Document insights gained during the session]
1. **Learning 1**: Description
2. **Learning 2**: Description

## Outcomes
[List what was accomplished]
- ✅ [Achievement 1]
- ✅ [Achievement 2]
- ❌ [What didn't work]

## Technical Patterns Discovered
[Document reusable patterns found]
- **Pattern Name**: Description and application
`;
  }

  getCurrentSession() {
    if (!this.currentSessionFile) {
      // Try to find the most recent session
      if (fs.existsSync(this.logsDir)) {
        const sessions = fs.readdirSync(this.logsDir)
          .filter(f => f.startsWith('session_') && f.endsWith('.md'))
          .map(f => ({
            name: f,
            path: path.join(this.logsDir, f),
            mtime: fs.statSync(path.join(this.logsDir, f)).mtime
          }))
          .sort((a, b) => b.mtime - a.mtime);
          
        if (sessions.length > 0) {
          this.currentSessionFile = sessions[0].path;
          console.log(`📝 Using most recent session: ${sessions[0].name}`);
        }
      }
    }
    
    return this.currentSessionFile;
  }

  async integrateSession(sessionFile = null) {
    const targetSession = sessionFile || this.getCurrentSession();
    
    if (!targetSession || !fs.existsSync(targetSession)) {
      throw new Error('No session file found to integrate');
    }
    
    console.log(`🔄 Integrating session: ${path.basename(targetSession)}`);
    
    // Create a backup of current memory tree
    const backupPath = `${this.memoryPath}.backup.${Date.now()}`;
    if (fs.existsSync(this.memoryPath)) {
      fs.copyFileSync(this.memoryPath, backupPath);
      console.log(`💾 Created backup: ${path.basename(backupPath)}`);
    }
    
    // Generate diff and integration prompt
    const diffPath = await this.generateIntegrationDiff(backupPath, this.memoryPath);
    console.log(`📋 Integration analysis created: ${diffPath}`);
    
    // The AI should now analyze the diff and update the memory tree
    console.log(`\n🤖 Next Steps:`);
    console.log(`1. Review the integration analysis: ${diffPath}`);
    console.log(`2. Update memory tree with validated insights`);
    console.log(`3. Run: node cli/index.js commit "Integrated session: ${path.basename(targetSession)}"`);
    
    return diffPath;
  }

  async generateIntegrationDiff(oldMemoryPath, newMemoryPath) {
    // If no existing memory tree, create a basic one
    if (!fs.existsSync(newMemoryPath)) {
      const initialMemory = `# Organic Learning Memory Tree

## Learned Principles

## Implementation Patterns

## Technical Domains

## Knowledge Evolution

## Tools and Processes
`;
      fs.writeFileSync(newMemoryPath, initialMemory);
    }
    
    // Generate integration prompt (using existing diff tool)
    const { execSync } = require('child_process');
    const scriptPath = path.join(__dirname, 'diffTree.js');
    
    try {
      execSync(`node ${scriptPath} ${oldMemoryPath} ${newMemoryPath}`, { stdio: 'inherit' });
      
      // Find the most recent diff file
      const diffsDir = path.join(this.dataDir, 'diffs');
      if (fs.existsSync(diffsDir)) {
        const diffs = fs.readdirSync(diffsDir)
          .filter(f => f.startsWith('tree_diff_'))
          .map(f => ({
            name: f,
            path: path.join(diffsDir, f),
            mtime: fs.statSync(path.join(diffsDir, f)).mtime
          }))
          .sort((a, b) => b.mtime - a.mtime);
          
        if (diffs.length > 0) {
          return diffs[0].path;
        }
      }
    } catch (error) {
      console.error('Error generating integration diff:', error.message);
    }
    
    return null;
  }

  listSessions(limit = 10) {
    if (!fs.existsSync(this.logsDir)) {
      console.log('📭 No sessions found');
      return [];
    }
    
    const sessions = fs.readdirSync(this.logsDir)
      .filter(f => f.startsWith('session_') && f.endsWith('.md'))
      .map(f => ({
        name: f,
        path: path.join(this.logsDir, f),
        mtime: fs.statSync(path.join(this.logsDir, f)).mtime,
        size: fs.statSync(path.join(this.logsDir, f)).size
      }))
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, limit);
    
    console.log(`\n📚 Recent Sessions (${sessions.length}):`);
    sessions.forEach((session, index) => {
      const date = session.mtime.toLocaleDateString();
      const size = (session.size / 1024).toFixed(1);
      const name = session.name.replace('session_', '').replace('.md', '').replace(/_/g, ' ');
      
      console.log(`${index + 1}. ${name}`);
      console.log(`   📅 ${date} | 📄 ${size}KB | 📍 ${session.name}`);
    });
    
    return sessions;
  }
}

// CLI Interface
if (require.main === module) {
  const [command, ...args] = process.argv.slice(2);
  const manager = new SessionManager();
  
  switch (command) {
    case 'start':
      if (!args[0]) {
        console.error('Usage: node sessionManager.js start <topic>');
        process.exit(1);
      }
      manager.startSession(args.join(' '));
      break;
      
    case 'integrate':
      manager.integrateSession(args[0])
        .then(diffPath => {
          if (diffPath) {
            console.log(`✅ Integration analysis ready`);
          }
        })
        .catch(error => {
          console.error('❌ Integration failed:', error.message);
        });
      break;
      
    case 'list':
      manager.listSessions(parseInt(args[0]) || 10);
      break;
      
    case 'current':
      const current = manager.getCurrentSession();
      if (current) {
        console.log(`📝 Current session: ${path.basename(current)}`);
      } else {
        console.log('📭 No current session');
      }
      break;
      
    default:
      console.log('Session Manager Commands:');
      console.log('  start <topic>     - Start new session or resume existing');
      console.log('  integrate [file]  - Integrate session learnings into memory');
      console.log('  list [limit]      - List recent sessions'); 
      console.log('  current           - Show current session');
  }
}

module.exports = SessionManager;
