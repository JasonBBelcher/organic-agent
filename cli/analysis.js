#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function analyzeTopicInDepth(topic) {
  const results = {
    topic,
    principles: [],
    implementations: [],
    patterns: [],
    sources: [],
    evolution: []
  };
  
  const dataDir = 'data';
  const searchDirs = ['memory', 'logs', 'reflections', 'summaries'];
  
  searchDirs.forEach(dir => {
    const dirPath = path.join(dataDir, dir);
    if (!fs.existsSync(dirPath)) return;
    
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(topic.toLowerCase())) {
          const context = {
            file: file,
            line: index + 1,
            content: line.trim(),
            before: lines[index - 1]?.trim() || '',
            after: lines[index + 1]?.trim() || ''
          };
          
          // Categorize the finding
          if (line.includes('**Pattern**:')) {
            results.patterns.push({
              ...context,
              pattern: line.replace(/.*\*\*Pattern\*\*:\s*/, '')
            });
          } else if (line.includes('**Source**:')) {
            results.sources.push({
              ...context,
              source: line.replace(/.*\*\*Source\*\*:\s*/, '')
            });
          } else if (line.startsWith('### ')) {
            results.principles.push({
              ...context,
              title: line.replace('### ', '')
            });
          } else {
            results.implementations.push(context);
          }
        }
      });
    });
  });
  
  return results;
}

function compareKnowledgeBetweenSessions(session1, session2) {
  const session1Path = `data/logs/${session1}`;
  const session2Path = `data/logs/${session2}`;
  
  if (!fs.existsSync(session1Path) || !fs.existsSync(session2Path)) {
    throw new Error('One or both session files not found');
  }
  
  const content1 = fs.readFileSync(session1Path, 'utf-8');
  const content2 = fs.readFileSync(session2Path, 'utf-8');
  
  // Extract key concepts from each session
  const extractConcepts = (content) => {
    const concepts = [];
    const lines = content.split('\n');
    
    lines.forEach(line => {
      // Look for headers, bullet points, and key terms
      if (line.startsWith('### ') || line.startsWith('## ')) {
        concepts.push({
          type: 'header',
          content: line.replace(/^#+\s*/, '')
        });
      } else if (line.startsWith('- **') && line.includes('**:')) {
        const match = line.match(/- \*\*([^*]+)\*\*:\s*(.*)/);
        if (match) {
          concepts.push({
            type: 'principle',
            key: match[1],
            value: match[2]
          });
        }
      } else if (line.startsWith('- ') && line.length > 10) {
        concepts.push({
          type: 'insight',
          content: line.replace('- ', '')
        });
      }
    });
    
    return concepts;
  };
  
  const concepts1 = extractConcepts(content1);
  const concepts2 = extractConcepts(content2);
  
  return {
    session1: {
      file: session1,
      concepts: concepts1
    },
    session2: {
      file: session2,
      concepts: concepts2
    },
    newInSession2: concepts2.filter(c2 => 
      !concepts1.some(c1 => 
        c1.type === c2.type && 
        (c1.content === c2.content || c1.key === c2.key)
      )
    ),
    commonConcepts: concepts2.filter(c2 => 
      concepts1.some(c1 => 
        c1.type === c2.type && 
        (c1.content === c2.content || c1.key === c2.key)
      )
    )
  };
}

function exportKnowledge(format = 'json') {
  const data = {
    exportDate: new Date().toISOString(),
    format: format
  };
  
  // Load memory tree
  const memoryTreePath = 'data/memory/organic_learning_tree.md';
  if (fs.existsSync(memoryTreePath)) {
    data.memoryTree = fs.readFileSync(memoryTreePath, 'utf-8');
  }
  
  // Load all sessions
  const logsDir = 'data/logs';
  if (fs.existsSync(logsDir)) {
    data.sessions = {};
    const logFiles = fs.readdirSync(logsDir).filter(f => f.endsWith('.md'));
    logFiles.forEach(file => {
      const content = fs.readFileSync(path.join(logsDir, file), 'utf-8');
      data.sessions[file] = content;
    });
  }
  
  // Load all reflections
  const reflectionsDir = 'data/reflections';
  if (fs.existsSync(reflectionsDir)) {
    data.reflections = {};
    const reflectionFiles = fs.readdirSync(reflectionsDir).filter(f => f.endsWith('.md'));
    reflectionFiles.forEach(file => {
      const content = fs.readFileSync(path.join(reflectionsDir, file), 'utf-8');
      data.reflections[file] = content;
    });
  }
  
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  } else if (format === 'markdown') {
    let md = `# Organic Learning Export\n\n**Date:** ${data.exportDate}\n\n`;
    
    if (data.memoryTree) {
      md += `## Memory Tree\n\n${data.memoryTree}\n\n`;
    }
    
    if (data.sessions) {
      md += `## Sessions\n\n`;
      Object.entries(data.sessions).forEach(([file, content]) => {
        md += `### ${file}\n\n${content}\n\n`;
      });
    }
    
    return md;
  }
  
  return data;
}

function displayAnalysis(analysis) {
  console.log(`\n🔍 Deep Analysis: "${analysis.topic}"\n`);
  
  if (analysis.principles.length > 0) {
    console.log('🎯 Related Principles:');
    analysis.principles.forEach(p => {
      console.log(`  📋 ${p.title} (${p.file}:${p.line})`);
    });
    console.log();
  }
  
  if (analysis.patterns.length > 0) {
    console.log('🔄 Identified Patterns:');
    analysis.patterns.forEach(p => {
      console.log(`  • ${p.pattern} (${p.file})`);
    });
    console.log();
  }
  
  if (analysis.sources.length > 0) {
    console.log('📚 Sources:');
    analysis.sources.forEach(s => {
      console.log(`  • ${s.source} (${s.file})`);
    });
    console.log();
  }
  
  if (analysis.implementations.length > 0) {
    console.log('🛠️ Implementation Details:');
    analysis.implementations.slice(0, 5).forEach(impl => {
      console.log(`  • ${impl.content} (${impl.file}:${impl.line})`);
    });
    if (analysis.implementations.length > 5) {
      console.log(`  ... and ${analysis.implementations.length - 5} more references`);
    }
    console.log();
  }
  
  const totalReferences = analysis.principles.length + analysis.patterns.length + 
                         analysis.sources.length + analysis.implementations.length;
  console.log(`✅ Total references found: ${totalReferences}`);
}

function displayComparison(comparison) {
  console.log(`\n🔄 Knowledge Comparison\n`);
  console.log(`📊 ${comparison.session1.file} vs ${comparison.session2.file}\n`);
  
  console.log(`📈 New Knowledge in ${comparison.session2.file}:`);
  if (comparison.newInSession2.length === 0) {
    console.log('   No new concepts identified');
  } else {
    comparison.newInSession2.slice(0, 10).forEach(concept => {
      console.log(`  + ${concept.type}: ${concept.content || concept.key}`);
    });
    if (comparison.newInSession2.length > 10) {
      console.log(`  ... and ${comparison.newInSession2.length - 10} more new concepts`);
    }
  }
  
  console.log(`\n🔗 Common Concepts: ${comparison.commonConcepts.length}`);
  console.log(`📊 Knowledge Growth: +${comparison.newInSession2.length} new concepts`);
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  const arg1 = process.argv[3];
  const arg2 = process.argv[4];
  
  try {
    switch (command) {
      case 'analyze':
        if (!arg1) {
          console.error('❌ Please provide a topic to analyze');
          console.log('Usage: node analysis.js analyze <topic>');
          process.exit(1);
        }
        const analysis = analyzeTopicInDepth(arg1);
        displayAnalysis(analysis);
        break;
        
      case 'compare':
        if (!arg1 || !arg2) {
          console.error('❌ Please provide two session files to compare');
          console.log('Usage: node analysis.js compare session_12.md session_13.md');
          process.exit(1);
        }
        const comparison = compareKnowledgeBetweenSessions(arg1, arg2);
        displayComparison(comparison);
        break;
        
      case 'export':
        const format = arg1 || 'json';
        const exported = exportKnowledge(format);
        console.log(exported);
        break;
        
      default:
        console.log('Usage:');
        console.log('  node analysis.js analyze <topic>');
        console.log('  node analysis.js compare <session1.md> <session2.md>');
        console.log('  node analysis.js export [json|markdown]');
        break;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

module.exports = { 
  analyzeTopicInDepth, 
  compareKnowledgeBetweenSessions, 
  exportKnowledge,
  displayAnalysis,
  displayComparison
};
