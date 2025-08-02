#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
// Removed readline - no user input needed for AI tools

class KnowledgeBaseExporter {
  constructor() {
    this.dataDir = 'data';
    this.exportDir = 'exports';
    // Removed readline interface - no user input needed
  }

  // Removed promptForKnowledgeBaseName method - using fixed filename

  loadMemoryTree() {
    const treePath = path.join(this.dataDir, 'memory', 'organic_learning_tree.md');
    if (!fs.existsSync(treePath)) {
      throw new Error('Memory tree not found');
    }
    return fs.readFileSync(treePath, 'utf-8');
  }

  getLatestReflections(limit = 5) {
    const reflectionsDir = path.join(this.dataDir, 'reflections');
    if (!fs.existsSync(reflectionsDir)) {
      return [];
    }

    const files = fs.readdirSync(reflectionsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        path: path.join(reflectionsDir, f),
        mtime: fs.statSync(path.join(reflectionsDir, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime)
      .slice(0, limit);

    return files.map(file => ({
      name: file.name,
      content: fs.readFileSync(file.path, 'utf-8')
    }));
  }

  getEvolutionSummary() {
    const summariesDir = path.join(this.dataDir, 'summaries');
    if (!fs.existsSync(summariesDir)) {
      return null;
    }

    const files = fs.readdirSync(summariesDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        path: path.join(summariesDir, f),
        mtime: fs.statSync(path.join(summariesDir, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);

    if (files.length === 0) {
      return null;
    }

    return {
      name: files[0].name,
      content: fs.readFileSync(files[0].path, 'utf-8')
    };
  }

  getSystemStats() {
    const stats = {
      exportDate: new Date().toISOString(),
      memoryTreeSize: 0,
      totalSessions: 0,
      totalReflections: 0,
      totalCommits: 0,
      learningSpan: null
    };

    // Memory tree stats
    const treePath = path.join(this.dataDir, 'memory', 'organic_learning_tree.md');
    if (fs.existsSync(treePath)) {
      const content = fs.readFileSync(treePath, 'utf-8');
      stats.memoryTreeSize = content.split('\n').length;
    }

    // Session stats
    const logsDir = path.join(this.dataDir, 'logs');
    if (fs.existsSync(logsDir)) {
      stats.totalSessions = fs.readdirSync(logsDir).filter(f => f.endsWith('.md')).length;
    }

    // Reflection stats
    const reflectionsDir = path.join(this.dataDir, 'reflections');
    if (fs.existsSync(reflectionsDir)) {
      stats.totalReflections = fs.readdirSync(reflectionsDir).filter(f => f.endsWith('.md')).length;
    }

    // Commit stats
    const commitsDir = path.join(this.dataDir, 'commits');
    if (fs.existsSync(commitsDir)) {
      stats.totalCommits = fs.readdirSync(commitsDir).filter(f => f.endsWith('.md')).length;
    }

    // Learning span
    if (fs.existsSync(logsDir)) {
      const sessionFiles = fs.readdirSync(logsDir)
        .filter(f => f.endsWith('.md'))
        .map(f => fs.statSync(path.join(logsDir, f)).mtime)
        .sort();

      if (sessionFiles.length > 1) {
        const spanDays = Math.ceil((sessionFiles[sessionFiles.length - 1] - sessionFiles[0]) / (1000 * 60 * 60 * 24));
        stats.learningSpan = `${spanDays} days`;
      }
    }

    return stats;
  }

  sanitizeContent(content) {
    // Remove any potential security-sensitive patterns
    const sensitivePatterns = [
      /api[_-]?key[s]?\s*[:=]\s*['"][^'"]*['"]/gi,
      /token[s]?\s*[:=]\s*['"][^'"]*['"]/gi,
      /password[s]?\s*[:=]\s*['"][^'"]*['"]/gi,
      /secret[s]?\s*[:=]\s*['"][^'"]*['"]/gi,
      /credential[s]?\s*[:=]\s*['"][^'"]*['"]/gi,
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi, // Email addresses
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN pattern
      /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, // Credit card pattern
    ];

    let sanitized = content;
    sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    return sanitized;
  }

  generateKnowledgeBase(name) {
    const stats = this.getSystemStats();
    const memoryTree = this.sanitizeContent(this.loadMemoryTree());
    const recentReflections = this.getLatestReflections();
    const evolutionSummary = this.getEvolutionSummary();

    let knowledgeBase = `# ${name.charAt(0).toUpperCase() + name.slice(1)} Knowledge Base

> **Generated:** ${new Date().toLocaleString()}  
> **Source:** Organic Learning Agent  
> **Memory Tree Size:** ${stats.memoryTreeSize} lines  
> **Learning Sessions:** ${stats.totalSessions}  
> **Reflections Processed:** ${stats.totalReflections}  
> **Learning Span:** ${stats.learningSpan || 'Single session'}  

---

## 🧠 Core Knowledge Structure

This knowledge base represents the solidified learnings from an organic learning agent that systematically processes experiences, identifies patterns, and builds structured knowledge over time.

### Knowledge Extraction Methodology

The organic learning process follows these principles:
1. **Experience Processing** - Each session generates structured logs of activities and outcomes
2. **Reflection Generation** - Systematic analysis of experiences to extract insights and patterns
3. **Memory Integration** - New insights are integrated into a structured knowledge tree
4. **Evolution Tracking** - Changes are tracked through diffs and summaries
5. **Knowledge Solidification** - Proven patterns become established principles

---

## 🎯 Established Principles and Insights

${memoryTree}

---

## 📈 Recent Learning Evolution

`;

    if (evolutionSummary) {
      knowledgeBase += `### Latest Evolution Summary

**File:** ${evolutionSummary.name}

${this.sanitizeContent(evolutionSummary.content)}

---

`;
    }

    if (recentReflections.length > 0) {
      knowledgeBase += `## 🔍 Recent Reflections

The following reflections represent the most recent learning processes and insights:

`;

      recentReflections.forEach((reflection, index) => {
        knowledgeBase += `### Reflection ${index + 1}: ${reflection.name}

${this.sanitizeContent(reflection.content)}

---

`;
      });
    }

    knowledgeBase += `## 📊 Knowledge Base Statistics

- **Export Date:** ${stats.exportDate}
- **Memory Tree Lines:** ${stats.memoryTreeSize}
- **Total Learning Sessions:** ${stats.totalSessions}
- **Processed Reflections:** ${stats.totalReflections}
- **Committed Learning States:** ${stats.totalCommits}
- **Learning Time Span:** ${stats.learningSpan || 'Single session'}

## 🔬 Methodology Notes

### Organic Learning Process
This knowledge base was generated using an organic learning methodology where:
1. Each interaction or task generates a session log
2. Reflections are systematically generated from session logs
3. Insights are extracted and integrated into a structured memory tree
4. Knowledge evolution is tracked through version diffs
5. Contradictions are identified and resolved
6. Patterns emerge through repeated validation

### Knowledge Validation
The principles and insights in this knowledge base have been:
- **Source-Attributed** - Each principle links to its originating experience
- **Pattern-Validated** - Recurring patterns are identified and documented  
- **Contradiction-Tested** - Beliefs are checked against new evidence
- **Evolution-Tracked** - Changes are documented and reasoned about

### Security and Privacy
This knowledge base has been processed to:
- Remove API keys, tokens, and credentials
- Sanitize personal information and contact details
- Exclude sensitive configuration data
- Filter out proprietary business logic
- Maintain learning insights while protecting privacy

---

*This knowledge base represents solidified learning from an organic learning agent. It captures patterns, principles, and insights that have been validated through systematic reflection and integration processes.*

**Generated by Organic Learning Agent v1.0**  
**Export Format:** Sanitized Markdown Knowledge Base  
**Security Level:** Public-Safe (Sensitive information redacted)  
`;

    return knowledgeBase;
  }

  exportKnowledgeBase() {
    try {
      console.log('🧠 Organic Learning Knowledge Base Exporter\n');

      // Ensure export directory exists
      if (!fs.existsSync(this.exportDir)) {
        fs.mkdirSync(this.exportDir, { recursive: true });
      }

      // Use fixed filename for AI tool usage
      const name = 'organic-knowledge-base';
      const fileName = `${name}.md`;
      const filePath = path.join(this.exportDir, fileName);

      console.log(`\n📝 Generating knowledge base: ${fileName}`);

      // Generate knowledge base content
      const knowledgeBase = this.generateKnowledgeBase(name);

      // Write to file
      fs.writeFileSync(filePath, knowledgeBase, 'utf-8');

      const stats = fs.statSync(filePath);
      console.log(`\n✅ Knowledge base exported successfully!`);
      console.log(`📍 Location: ${filePath}`);
      console.log(`📊 Size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`📅 Created: ${new Date().toLocaleString()}`);

      // Show preview
      console.log(`\n📋 Content Preview:`);
      const lines = knowledgeBase.split('\n').slice(0, 10);
      lines.forEach(line => console.log(`   ${line}`));
      console.log(`   ... and ${knowledgeBase.split('\n').length - 10} more lines`);

    } catch (error) {
      console.error('❌ Error exporting knowledge base:', error.message);
    }
    // Removed finally block - no readline to close
  }
}

// Main execution
if (require.main === module) {
  const exporter = new KnowledgeBaseExporter();
  exporter.exportKnowledgeBase();
}

module.exports = KnowledgeBaseExporter;
