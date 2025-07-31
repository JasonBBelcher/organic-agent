#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function loadMemoryTree() {
  const treePath = 'data/memory/organic_learning_tree.md';
  if (!fs.existsSync(treePath)) {
    throw new Error('Memory tree not found');
  }
  return fs.readFileSync(treePath, 'utf-8');
}

function parseMemoryTree(content) {
  const sections = {
    principles: [],
    contradictions: [],
    domains: [],
    insights: [],
    patterns: []
  };
  
  const lines = content.split('\n');
  let currentSection = '';
  let currentPrinciple = null;
  
  lines.forEach(line => {
    // Section headers
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').toLowerCase();
    }
    
    // Principle headers
    if (line.startsWith('### ') && currentSection === 'learned principles') {
      if (currentPrinciple) {
        sections.principles.push(currentPrinciple);
      }
      currentPrinciple = {
        title: line.replace('### ', ''),
        content: [],
        source: '',
        pattern: '',
        evidence: ''
      };
    }
    
    // Contradiction headers
    if (line.startsWith('### ') && currentSection === 'contradictions and revisions') {
      sections.contradictions.push({
        title: line.replace('### ', ''),
        content: []
      });
    }
    
    // Domain headers
    if (line.startsWith('### ') && currentSection === 'technical knowledge domains') {
      sections.domains.push({
        title: line.replace('### ', ''),
        content: []
      });
    }
    
    // Collect content
    if (currentPrinciple && line.startsWith('- ')) {
      currentPrinciple.content.push(line);
      
      if (line.includes('**Source**:')) {
        currentPrinciple.source = line.replace(/.*\*\*Source\*\*:\s*/, '');
      }
      if (line.includes('**Pattern**:')) {
        currentPrinciple.pattern = line.replace(/.*\*\*Pattern\*\*:\s*/, '');
      }
      if (line.includes('**Evidence**:')) {
        currentPrinciple.evidence = line.replace(/.*\*\*Evidence\*\*:\s*/, '');
      }
    }
  });
  
  // Add the last principle
  if (currentPrinciple) {
    sections.principles.push(currentPrinciple);
  }
  
  return sections;
}

function queryKnowledge(question) {
  try {
    const content = loadMemoryTree();
    const sections = parseMemoryTree(content);
    
    const questionLower = question.toLowerCase();
    const results = {
      relevantPrinciples: [],
      relevantDomains: [],
      relatedPatterns: []
    };
    
    // Search principles
    sections.principles.forEach(principle => {
      const titleMatch = principle.title.toLowerCase().includes(questionLower);
      const contentMatch = principle.content.some(line => 
        line.toLowerCase().includes(questionLower)
      );
      
      if (titleMatch || contentMatch) {
        results.relevantPrinciples.push(principle);
      }
    });
    
    // Search domains
    sections.domains.forEach(domain => {
      if (domain.title.toLowerCase().includes(questionLower)) {
        results.relevantDomains.push(domain);
      }
    });
    
    // Search for patterns
    sections.principles.forEach(principle => {
      if (principle.pattern && principle.pattern.toLowerCase().includes(questionLower)) {
        results.relatedPatterns.push({
          title: principle.title,
          pattern: principle.pattern
        });
      }
    });
    
    return results;
    
  } catch (error) {
    console.error('❌ Error querying knowledge:', error.message);
    return null;
  }
}

function displayQueryResults(results, question) {
  console.log(`\n🤔 Query: "${question}"\n`);
  
  if (results.relevantPrinciples.length > 0) {
    console.log('🎯 Relevant Principles:');
    results.relevantPrinciples.forEach(principle => {
      console.log(`\n  📋 ${principle.title}`);
      if (principle.source) {
        console.log(`     Source: ${principle.source}`);
      }
      if (principle.pattern) {
        console.log(`     Pattern: ${principle.pattern}`);
      }
      principle.content.slice(0, 2).forEach(line => {
        console.log(`     ${line}`);
      });
    });
  }
  
  if (results.relevantDomains.length > 0) {
    console.log('\n🏗️ Relevant Domains:');
    results.relevantDomains.forEach(domain => {
      console.log(`  • ${domain.title}`);
    });
  }
  
  if (results.relatedPatterns.length > 0) {
    console.log('\n🔄 Related Patterns:');
    results.relatedPatterns.forEach(pattern => {
      console.log(`  • ${pattern.title}: ${pattern.pattern}`);
    });
  }
  
  if (results.relevantPrinciples.length === 0 && 
      results.relevantDomains.length === 0 && 
      results.relatedPatterns.length === 0) {
    console.log('❌ No direct matches found. Try a broader search term.');
  }
}

// Main execution
if (require.main === module) {
  const question = process.argv.slice(2).join(' ');
  
  if (!question) {
    console.error('❌ Please provide a question');
    console.log('Usage: node query.js <your question>');
    console.log('Example: node query.js "How does deployment work?"');
    process.exit(1);
  }
  
  const results = queryKnowledge(question);
  if (results) {
    displayQueryResults(results, question);
  }
}

module.exports = { queryKnowledge, displayQueryResults };
