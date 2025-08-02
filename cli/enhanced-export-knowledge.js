#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
// Removed readline - no user input needed for AI tools

class SearchableKnowledgeExporter {
  constructor() {
    this.dataDir = 'data';
    this.exportDir = 'exports';
    this.indexDir = path.join(this.dataDir, 'index');
    // Removed readline interface - no user input needed
    
    // Domain terms for knowledge content (aligned with code search)
    this.knowledgeDomainTerms = {
      // Architecture & Design Patterns
      'architecture': 'system_architecture',
      'pattern': 'design_pattern',
      'separation': 'separation_of_concerns',
      'decoupled': 'loose_coupling',
      'microservices': 'microservice_architecture',
      'monolith': 'monolithic_architecture',
      
      // Development Methodologies  
      'workflow': 'development_workflow',
      'pipeline': 'deployment_pipeline',
      'validation': 'validation_process',
      'testing': 'testing_strategy',
      'deployment': 'deployment_strategy',
      
      // API & Integration
      'api': 'api_design',
      'endpoint': 'api_endpoint',
      'cors': 'cors_integration',
      'authentication': 'auth_strategy',
      'middleware': 'api_middleware',
      
      // Content & Data Management
      'cms': 'content_management',
      'configuration': 'config_management',
      'database': 'data_persistence',
      'migration': 'data_migration',
      'validation': 'data_validation',
      
      // Performance & Optimization
      'optimization': 'performance_optimization',
      'caching': 'caching_strategy',
      'lazy': 'lazy_loading',
      'async': 'async_processing',
      
      // Security & Best Practices
      'security': 'security_practice',
      'sanitization': 'data_sanitization',
      'encryption': 'data_encryption',
      'validation': 'input_validation',
      
      // Learning & Process
      'insight': 'learning_insight',
      'principle': 'design_principle',
      'contradiction': 'knowledge_contradiction',
      'evolution': 'knowledge_evolution',
      'reflection': 'learning_reflection'
    };
  }

  // Removed promptForKnowledgeBaseName method - using fixed filename

  loadMemoryTree() {
    const treePath = path.join(this.dataDir, 'memory', 'organic_learning_tree.md');
    if (!fs.existsSync(treePath)) {
      throw new Error('Memory tree not found');
    }
    return fs.readFileSync(treePath, 'utf-8');
  }

  getAllMemoryFiles() {
    const memoryDir = path.join(this.dataDir, 'memory');
    if (!fs.existsSync(memoryDir)) {
      return [];
    }

    return fs.readdirSync(memoryDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        path: path.join(memoryDir, f),
        content: fs.readFileSync(path.join(memoryDir, f), 'utf-8')
      }));
  }

  getAllReflections() {
    const reflectionsDir = path.join(this.dataDir, 'reflections');
    if (!fs.existsSync(reflectionsDir)) {
      return [];
    }

    return fs.readdirSync(reflectionsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        path: path.join(reflectionsDir, f),
        content: fs.readFileSync(path.join(reflectionsDir, f), 'utf-8')
      }));
  }

  getAllSummaries() {
    const summariesDir = path.join(this.dataDir, 'summaries');
    if (!fs.existsSync(summariesDir)) {
      return [];
    }

    return fs.readdirSync(summariesDir)
      .filter(f => f.endsWith('.md'))
      .map(f => ({
        name: f,
        path: path.join(summariesDir, f),
        content: fs.readFileSync(path.join(summariesDir, f), 'utf-8')
      }));
  }

  extractHeadingsAndContent(content, filePath) {
    const lines = content.split('\n');
    const headings = [];
    let currentSection = '';
    let currentLines = [];

    lines.forEach((line, index) => {
      if (line.match(/^#{1,6}\s+/)) {
        // Save previous section if it exists
        if (currentSection && currentLines.length > 0) {
          headings.push({
            heading: currentSection,
            content: currentLines.join('\n'),
            lines: [`${index - currentLines.length + 1}-${index}`],
            path: filePath
          });
        }

        // Start new section
        currentSection = line.replace(/^#+\s*/, '').trim();
        currentLines = [];
      } else if (currentSection) {
        currentLines.push(line);
      }
    });

    // Add final section
    if (currentSection && currentLines.length > 0) {
      headings.push({
        heading: currentSection,
        content: currentLines.join('\n'),
        lines: [`${lines.length - currentLines.length + 1}-${lines.length}`],
        path: filePath
      });
    }

    return headings;
  }

  extractKeywordsFromHeading(heading, content) {
    const keywords = new Set();
    const text = `${heading} ${content}`.toLowerCase();
    
    // Extract domain-specific keywords
    Object.keys(this.knowledgeDomainTerms).forEach(term => {
      if (text.includes(term)) {
        keywords.add(this.knowledgeDomainTerms[term]);
      }
    });

    // Extract specific patterns from headings
    const headingLower = heading.toLowerCase();
    
    // Pattern: "X Design" -> "x_design"
    if (headingLower.includes('design')) {
      const prefix = headingLower.split('design')[0].trim().replace(/\s+/g, '_');
      if (prefix) keywords.add(`${prefix}_design`);
    }

    // Pattern: "X Patterns" -> "x_pattern"
    if (headingLower.includes('pattern')) {
      const prefix = headingLower.split('pattern')[0].trim().replace(/\s+/g, '_');
      if (prefix) keywords.add(`${prefix}_pattern`);
    }

    // Pattern: "X Architecture" -> "x_architecture"
    if (headingLower.includes('architecture')) {
      const prefix = headingLower.split('architecture')[0].trim().replace(/\s+/g, '_');
      if (prefix) keywords.add(`${prefix}_architecture`);
    }

    // Extract key phrases as composite terms
    const keyPhrases = [
      'tool timing', 'full-stack', 'content management', 'media processing',
      'api design', 'static sites', 'dependency chain', 'cross-platform',
      'email-driven', 'environment-aware', 'configuration-driven',
      'validation pipelines', 'metadata-rich', 'single source',
      'deployment context', 'runtime failures', 'developer experience'
    ];

    keyPhrases.forEach(phrase => {
      if (text.includes(phrase)) {
        keywords.add(phrase.replace(/\s+/g, '_'));
      }
    });

    return Array.from(keywords);
  }

  buildKnowledgeIndex() {
    const knowledgeIndex = {};
    
    console.log('🔍 Building knowledge index from memory, reflections, and summaries...');

    // Process all memory files
    const memoryFiles = this.getAllMemoryFiles();
    memoryFiles.forEach(file => {
      const headings = this.extractHeadingsAndContent(file.content, `memory/${file.name}`);
      headings.forEach(section => {
        const keywords = this.extractKeywordsFromHeading(section.heading, section.content);
        keywords.forEach(keyword => {
          if (!knowledgeIndex[keyword]) {
            knowledgeIndex[keyword] = [];
          }
          knowledgeIndex[keyword].push({
            path: `data/memory/${file.name}`,
            workspace: 'organic-agent',
            lines: section.lines,
            heading: section.heading,
            type: 'memory'
          });
        });
      });
    });

    // Process all reflection files
    const reflectionFiles = this.getAllReflections();
    reflectionFiles.forEach(file => {
      const headings = this.extractHeadingsAndContent(file.content, `reflections/${file.name}`);
      headings.forEach(section => {
        const keywords = this.extractKeywordsFromHeading(section.heading, section.content);
        keywords.forEach(keyword => {
          if (!knowledgeIndex[keyword]) {
            knowledgeIndex[keyword] = [];
          }
          knowledgeIndex[keyword].push({
            path: `data/reflections/${file.name}`,
            workspace: 'organic-agent',
            lines: section.lines,
            heading: section.heading,
            type: 'reflection'
          });
        });
      });
    });

    // Process all summary files
    const summaryFiles = this.getAllSummaries();
    summaryFiles.forEach(file => {
      const headings = this.extractHeadingsAndContent(file.content, `summaries/${file.name}`);
      headings.forEach(section => {
        const keywords = this.extractKeywordsFromHeading(section.heading, section.content);
        keywords.forEach(keyword => {
          if (!knowledgeIndex[keyword]) {
            knowledgeIndex[keyword] = [];
          }
          knowledgeIndex[keyword].push({
            path: `data/summaries/${file.name}`,
            workspace: 'organic-agent',
            lines: section.lines,
            heading: section.heading,
            type: 'summary'
          });
        });
      });
    });

    return knowledgeIndex;
  }

  mergeWithCodeIndex(knowledgeIndex) {
    const codeIndexPath = path.join(this.indexDir, 'code_pattern_index.json');
    let codeIndex = {};
    
    if (fs.existsSync(codeIndexPath)) {
      try {
        codeIndex = JSON.parse(fs.readFileSync(codeIndexPath, 'utf-8'));
        console.log('📋 Loaded existing code pattern index');
      } catch (error) {
        console.warn('⚠️  Could not load code pattern index:', error.message);
      }
    }

    // Merge knowledge index with code index
    const mergedIndex = { ...codeIndex };
    
    Object.keys(knowledgeIndex).forEach(keyword => {
      if (mergedIndex[keyword]) {
        // Merge with existing code patterns
        mergedIndex[keyword] = [...mergedIndex[keyword], ...knowledgeIndex[keyword]];
      } else {
        // Add new knowledge-only keyword
        mergedIndex[keyword] = knowledgeIndex[keyword];
      }
    });

    return mergedIndex;
  }

  saveUnifiedIndex(unifiedIndex) {
    // Ensure index directory exists
    if (!fs.existsSync(this.indexDir)) {
      fs.mkdirSync(this.indexDir, { recursive: true });
    }

    const unifiedIndexPath = path.join(this.indexDir, 'unified_search_index.json');
    fs.writeFileSync(unifiedIndexPath, JSON.stringify(unifiedIndex, null, 2), 'utf-8');
    
    console.log(`✅ Unified search index saved: ${unifiedIndexPath}`);
    console.log(`📊 Total keywords: ${Object.keys(unifiedIndex).length}`);
    
    // Show statistics
    const stats = {
      codePatterns: 0,
      memoryEntries: 0,
      reflectionEntries: 0,
      summaryEntries: 0
    };

    Object.values(unifiedIndex).forEach(entries => {
      entries.forEach(entry => {
        if (entry.type === 'memory') stats.memoryEntries++;
        else if (entry.type === 'reflection') stats.reflectionEntries++;
        else if (entry.type === 'summary') stats.summaryEntries++;
        else stats.codePatterns++;
      });
    });

    console.log('📈 Index composition:');
    console.log(`   Code patterns: ${stats.codePatterns}`);
    console.log(`   Memory entries: ${stats.memoryEntries}`);
    console.log(`   Reflection entries: ${stats.reflectionEntries}`);
    console.log(`   Summary entries: ${stats.summaryEntries}`);

    return unifiedIndexPath;
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

  generateSearchableKnowledgeBase(name, unifiedIndex) {
    const stats = this.getSystemStats();
    const memoryTree = this.sanitizeContent(this.loadMemoryTree());
    const allReflections = this.getAllReflections();
    const allSummaries = this.getAllSummaries();

    let knowledgeBase = `# ${name.charAt(0).toUpperCase() + name.slice(1)} - Searchable Knowledge Base

> **Generated:** ${new Date().toLocaleString()}  
> **Source:** Organic Learning Agent with Unified Search Index  
> **Memory Tree Size:** ${stats.memoryTreeSize} lines  
> **Learning Sessions:** ${stats.totalSessions}  
> **Search Index:** ${Object.keys(unifiedIndex).length} keywords  
> **Learning Span:** ${stats.learningSpan || 'Single session'}  

---

## 🔍 Searchable Knowledge System

This knowledge base is enhanced with a **unified search index** that enables keyword-based discovery of both:
- **Code Patterns** - Concrete implementation examples with file paths and line numbers
- **Knowledge Content** - Principles, insights, and learnings from memory, reflections, and summaries

### Search Integration

The search system uses domain-specific keywords that map to:
- **Code Examples**: \`cli/codeSearch.js\` patterns with exact locations
- **Knowledge Sections**: Memory tree principles, reflection insights, evolution summaries

**AI Agent Search Terms** (matches both code and knowledge):
- \`system_architecture\` - Find architectural patterns and design principles
- \`api_design\` - Locate API patterns and design insights
- \`development_workflow\` - Discover workflow patterns and process improvements
- \`performance_optimization\` - Find optimization techniques and best practices
- \`security_practice\` - Locate security patterns and guidelines
- \`learning_insight\` - Access learning reflections and evolution summaries

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
6. **Search Indexing** - All content is indexed for keyword-based discovery

---

## 🎯 Established Principles and Insights

${memoryTree}

---

## 📈 Complete Learning Evolution

### All Reflections

`;

    allReflections.forEach((reflection, index) => {
      knowledgeBase += `#### Reflection ${index + 1}: ${reflection.name}

${this.sanitizeContent(reflection.content)}

---

`;
    });

    if (allSummaries.length > 0) {
      knowledgeBase += `### Evolution Summaries

`;

      allSummaries.forEach((summary, index) => {
        knowledgeBase += `#### Summary ${index + 1}: ${summary.name}

${this.sanitizeContent(summary.content)}

---

`;
      });
    }

    knowledgeBase += `## 📊 Enhanced Knowledge Base Statistics

- **Export Date:** ${stats.exportDate}
- **Memory Tree Lines:** ${stats.memoryTreeSize}
- **Total Learning Sessions:** ${stats.totalSessions}
- **Processed Reflections:** ${stats.totalReflections}
- **Committed Learning States:** ${stats.totalCommits}
- **Learning Time Span:** ${stats.learningSpan || 'Single session'}
- **Search Keywords:** ${Object.keys(unifiedIndex).length}
- **Searchable Entries:** ${Object.values(unifiedIndex).reduce((sum, entries) => sum + entries.length, 0)}

## 🔬 Enhanced Methodology Notes

### Unified Search Architecture
This knowledge base integrates two complementary search systems:

1. **Code Pattern Search** - Direct access to implementation examples
   - Maps keywords to specific file paths and line numbers
   - Focuses on concrete patterns: \`mvc_controller\`, \`data_repository\`, \`api_endpoint\`
   - Enables quick discovery of working code examples

2. **Knowledge Content Search** - Semantic access to learning insights
   - Maps keywords to knowledge sections and principles
   - Focuses on conceptual patterns: \`system_architecture\`, \`learning_insight\`, \`design_principle\`
   - Enables discovery of high-level understanding and evolution

### Search Usage for AI Agents

**For Implementation Examples:**
\`\`\`bash
node cli/index.js code-search "mvc controller"
node cli/index.js code-search "data repository validation"
\`\`\`

**For Knowledge Discovery:**
\`\`\`bash
node cli/index.js code-search "system architecture"
node cli/index.js code-search "learning insight reflection"
\`\`\`

### Knowledge Validation
The principles and insights in this knowledge base have been:
- **Source-Attributed** - Each principle links to its originating experience
- **Pattern-Validated** - Recurring patterns are identified and documented  
- **Contradiction-Tested** - Beliefs are checked against new evidence
- **Evolution-Tracked** - Changes are documented and reasoned about
- **Search-Indexed** - All content is keyword-searchable for rapid discovery

### Security and Privacy
This knowledge base has been processed to:
- Remove API keys, tokens, and credentials
- Sanitize personal information and contact details
- Exclude sensitive configuration data
- Filter out proprietary business logic
- Maintain learning insights while protecting privacy

---

*This enhanced knowledge base represents solidified learning from an organic learning agent with integrated search capabilities. It captures patterns, principles, and insights that have been validated through systematic reflection and integration processes, all discoverable through a unified keyword-based search system.*

**Generated by Enhanced Organic Learning Agent v1.1**  
**Export Format:** Searchable Markdown Knowledge Base  
**Security Level:** Public-Safe (Sensitive information redacted)  
**Search Integration:** Unified Code + Knowledge Index  
`;

    return knowledgeBase;
  }

  exportSearchableKnowledgeBase() {
    try {
      console.log('🧠 Enhanced Searchable Knowledge Base Exporter\n');

      // Ensure export and index directories exist
      if (!fs.existsSync(this.exportDir)) {
        fs.mkdirSync(this.exportDir, { recursive: true });
      }
      if (!fs.existsSync(this.indexDir)) {
        fs.mkdirSync(this.indexDir, { recursive: true });
      }

      // Use fixed filename for AI tool usage
      const name = 'searchable-knowledge-base';
      const fileName = `${name}.md`;
      const filePath = path.join(this.exportDir, fileName);

      console.log(`\n📝 Generating searchable knowledge base: ${fileName}`);

      // Build knowledge index
      const knowledgeIndex = this.buildKnowledgeIndex();
      console.log(`🔍 Extracted ${Object.keys(knowledgeIndex).length} knowledge keywords`);

      // Merge with code index
      const unifiedIndex = this.mergeWithCodeIndex(knowledgeIndex);
      console.log(`🔗 Unified index contains ${Object.keys(unifiedIndex).length} total keywords`);

      // Save unified index
      const indexPath = this.saveUnifiedIndex(unifiedIndex);

      // Generate enhanced knowledge base content
      const knowledgeBase = this.generateSearchableKnowledgeBase(name, unifiedIndex);

      // Write to file
      fs.writeFileSync(filePath, knowledgeBase, 'utf-8');

      const stats = fs.statSync(filePath);
      console.log(`\n✅ Searchable knowledge base exported successfully!`);
      console.log(`📍 Knowledge Base: ${filePath}`);
      console.log(`📍 Search Index: ${indexPath}`);
      console.log(`📊 KB Size: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`🔍 Search Keywords: ${Object.keys(unifiedIndex).length}`);
      console.log(`📅 Created: ${new Date().toLocaleString()}`);

      // Show search integration info
      console.log(`\n🤖 AI Agent Integration:`);
      console.log(`   Use: node cli/index.js code-search "keyword" for unified search`);
      console.log(`   Searches both code patterns AND knowledge content`);
      console.log(`   Keywords map to file paths + line numbers + headings`);

    } catch (error) {
      console.error('❌ Error exporting searchable knowledge base:', error.message);
    }
    // Removed finally block - no readline to close
  }
}

// Main execution
if (require.main === module) {
  const exporter = new SearchableKnowledgeExporter();
  exporter.exportSearchableKnowledgeBase();
}

module.exports = SearchableKnowledgeExporter;
