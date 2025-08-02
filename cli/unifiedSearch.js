#!/usr/bin/env node

/**
 * Unified Search System
 * 
 * Provides consistent interface for sea  loadUnifiedIndex() {
    try {
      if (fs.existsSync(this.indexPath)) {
        console.log('🔗 Loading unified search index (code + knowledge)');
        const rawIndex = JSON.parse(fs.readFileSync(this.indexPath, 'utf-8'));
        
        // The unified index is already in the correct format:
        // { keyword: [{ type, path, line, content, context }] }
        return rawIndex;
      } else {
        console.log('⚠️  No unified search index found - run: searchable-knowledge-base to create it');
        return {};
      }
    } catch (error) {
      console.error('Error loading unified search index:', error.message);
      return {};
    }
  }atterns and memory knowledge.
 * Implements standardized SearchResult format for AI assistant consumption.
 */

const fs = require('fs');
const path = require('path');

class SearchResult {
  constructor(keyword) {
    this.keyword = keyword;
    this.matches = [];
    this.metadata = {
      totalMatches: 0,
      sources: {
        code: 0,
        memory: 0,
        logs: 0,
        reflections: 0
      },
      confidence: 0
    };
  }

  addMatch(source, filePath, line, content, context = {}, metadata = {}) {
    const match = {
      source,
      path: filePath,
      line,
      content: content.trim(),
      context: {
        before: context.before || '',
        after: context.after || ''
      },
      metadata: {
        workspace: metadata.workspace || '',
        domain: metadata.domain || '',
        confidence: metadata.confidence || 0.5,
        ...metadata
      }
    };

    this.matches.push(match);
    this.metadata.totalMatches++;
    this.metadata.sources[source]++;
  }

  calculateConfidence() {
    if (this.matches.length === 0) return 0;
    
    const avgConfidence = this.matches.reduce((sum, match) => 
      sum + match.metadata.confidence, 0) / this.matches.length;
    
    // Boost confidence for matches across multiple sources
    const sourceCount = Object.values(this.metadata.sources).filter(count => count > 0).length;
    const diversityBonus = Math.min(sourceCount * 0.1, 0.3);
    
    this.metadata.confidence = Math.min(avgConfidence + diversityBonus, 1.0);
    return this.metadata.confidence;
  }

  sort() {
    // Sort by relevance (confidence desc, then source priority)
    const sourcePriority = { memory: 4, code: 3, logs: 2, reflections: 1 };
    
    this.matches.sort((a, b) => {
      if (a.metadata.confidence !== b.metadata.confidence) {
        return b.metadata.confidence - a.metadata.confidence;
      }
      return sourcePriority[b.source] - sourcePriority[a.source];
    });
  }
}

class UnifiedSearcher {
  constructor() {
    this.dataDir = 'data';
    this.indexPath = path.join(this.dataDir, 'index', 'unified_search_index.json');
    this.searchIndex = this.loadUnifiedIndex();
    
    // Domain classification for better metadata
    this.domainPatterns = {
      frontend: ['component', 'react', 'vue', 'css', 'html', 'javascript', 'positioning', 'responsive'],
      backend: ['server', 'api', 'database', 'auth', 'middleware', 'route'],
      deployment: ['deploy', 'build', 'docker', 'ci', 'cd', 'production'],
      testing: ['test', 'spec', 'mock', 'assert', 'expect'],
      configuration: ['config', 'env', 'settings', 'options']
    };
  }

  loadUnifiedIndex() {
    try {
      const unifiedIndexPath = path.join(this.dataDir, 'index', 'unified_search_index.json');
      if (fs.existsSync(unifiedIndexPath)) {
        const rawIndex = JSON.parse(fs.readFileSync(unifiedIndexPath, 'utf-8'));
        
        // Convert serialized Sets back to arrays if needed
        const index = {};
        Object.keys(rawIndex).forEach(keyword => {
          index[keyword] = rawIndex[keyword].map(item => 
            typeof item === 'string' ? JSON.parse(item) : item
          );
        });
        
        return index;
      }
    } catch (error) {
      console.log('📝 No unified index found, search will be limited');
    }
    return {};
  }

  classifyDomain(content, filePath) {
    const text = `${content} ${filePath}`.toLowerCase();
    
    for (const [domain, patterns] of Object.entries(this.domainPatterns)) {
      if (patterns.some(pattern => text.includes(pattern))) {
        return domain;
      }
    }
    return 'general';
  }

  calculateKeywordConfidence(keyword, content, filePath) {
    const text = content.toLowerCase();
    const keywordLower = keyword.toLowerCase();
    
    // Base confidence from keyword presence
    let confidence = 0.3;
    
    // Boost for exact matches
    if (text.includes(keywordLower)) confidence += 0.3;
    
    // Boost for matches in important contexts
    if (text.includes(`**${keywordLower}**`) || text.includes(`# ${keywordLower}`)) {
      confidence += 0.2;
    }
    
    // Boost for multiple occurrences
    const occurrences = (text.match(new RegExp(keywordLower, 'g')) || []).length;
    confidence += Math.min(occurrences * 0.1, 0.2);
    
    return Math.min(confidence, 1.0);
  }

  searchCode(keywords) {
    const results = [];
    const searchTerms = keywords.toLowerCase().split(/\s+/);
    
    searchTerms.forEach(term => {
      if (this.searchIndex[term]) {
        this.searchIndex[term].forEach((fileRef, index) => {
          // Handle different types of paths in the unified index
          let fullPath;
          if (path.isAbsolute(fileRef.path)) {
            fullPath = fileRef.path;
          } else if (fileRef.workspace === 'organic-agent') {
            // For organic-agent workspace, resolve relative to data directory
            fullPath = path.resolve(this.dataDir, '..', fileRef.path);
          } else {
            // For other workspaces, try to resolve from the workspace name
            fullPath = path.resolve(fileRef.workspace, fileRef.path);
          }
          
          try {
            if (fs.existsSync(fullPath)) {
              const content = fs.readFileSync(fullPath, 'utf-8');
              const lines = content.split('\n');
              
              // For unified index entries, return the indexed content directly
              // since keywords are conceptual categories, not literal text matches
              fileRef.lines.forEach(lineRange => {
                const [start, end] = lineRange.split('-').map(n => parseInt(n));
                
                // Get the relevant content from the specified lines
                const relevantLines = [];
                for (let i = start; i <= Math.min(end, lines.length); i++) {
                  if (lines[i - 1]) {
                    relevantLines.push(lines[i - 1]);
                  }
                }
                
                if (relevantLines.length > 0) {
                  results.push({
                    source: fileRef.type || 'code',
                    path: fullPath,
                    line: start,
                    content: relevantLines.join('\n'),
                    context: {
                      before: lines[start - 2] || '',
                      after: lines[end] || ''
                    },
                    metadata: {
                      workspace: fileRef.workspace,
                      domain: this.classifyDomain(relevantLines.join(' '), fileRef.path),
                      confidence: 0.8, // High confidence for indexed entries
                      heading: fileRef.heading || '',
                      type: fileRef.type || 'code',
                      keyword: term
                    }
                  });
                }
              });
            }
          } catch (error) {
            // Skip files that can't be read
          }
        });
      }
    });
    
    return results;
  }

  searchMemory(keywords) {
    const results = [];
    const memoryPath = path.join(this.dataDir, 'memory', 'organic_learning_tree.md');
    
    if (!fs.existsSync(memoryPath)) return results;
    
    try {
      const content = fs.readFileSync(memoryPath, 'utf-8');
      const lines = content.split('\n');
      const searchTerms = keywords.toLowerCase().split(/\s+/);
      
      lines.forEach((line, index) => {
        const lineLower = line.toLowerCase();
        
        searchTerms.forEach(term => {
          if (lineLower.includes(term)) {
            results.push({
              source: 'memory',
              path: memoryPath,
              line: index + 1,
              content: line,
              context: {
                before: lines[index - 1] || '',
                after: lines[index + 1] || ''
              },
              metadata: {
                workspace: 'organic-agent',
                domain: this.classifyDomain(line, 'memory'),
                confidence: this.calculateKeywordConfidence(term, line, 'memory')
              }
            });
          }
        });
      });
    } catch (error) {
      console.error('Error searching memory:', error.message);
    }
    
    return results;
  }

  searchLogs(keywords) {
    const results = [];
    const logsDir = path.join(this.dataDir, 'logs');
    
    if (!fs.existsSync(logsDir)) return results;
    
    const searchTerms = keywords.toLowerCase().split(/\s+/);
    
    try {
      const logFiles = fs.readdirSync(logsDir).filter(f => f.endsWith('.md'));
      
      logFiles.forEach(file => {
        const filePath = path.join(logsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          const lineLower = line.toLowerCase();
          
          searchTerms.forEach(term => {
            if (lineLower.includes(term)) {
              results.push({
                source: 'logs',
                path: filePath,
                line: index + 1,
                content: line,
                context: {
                  before: lines[index - 1] || '',
                  after: lines[index + 1] || ''
                },
                metadata: {
                  workspace: 'organic-agent',
                  domain: this.classifyDomain(line, file),
                  confidence: this.calculateKeywordConfidence(term, line, file)
                }
              });
            }
          });
        });
      });
    } catch (error) {
      console.error('Error searching logs:', error.message);
    }
    
    return results;
  }

  unifiedSearch(keywords, options = {}) {
    const result = new SearchResult(keywords);
    
    // Search all sources
    const codeResults = this.searchCode(keywords);
    const memoryResults = this.searchMemory(keywords);
    const logResults = this.searchLogs(keywords);
    
    // Add all results to unified result
    [...codeResults, ...memoryResults, ...logResults].forEach(match => {
      result.addMatch(
        match.source,
        match.path,
        match.line,
        match.content,
        match.context,
        match.metadata
      );
    });
    
    // Calculate confidence and sort
    result.calculateConfidence();
    result.sort();
    
    // Apply options
    if (options.limit) {
      result.matches = result.matches.slice(0, options.limit);
    }
    
    if (options.minConfidence) {
      result.matches = result.matches.filter(m => m.metadata.confidence >= options.minConfidence);
    }
    
    return result;
  }

  displayResults(searchResult, options = {}) {
    console.log(`\n🔍 Search Results for: "${searchResult.keyword}"`);
    console.log(`📊 Found ${searchResult.metadata.totalMatches} matches across ${Object.values(searchResult.metadata.sources).filter(c => c > 0).length} sources`);
    console.log(`🎯 Overall confidence: ${(searchResult.metadata.confidence * 100).toFixed(1)}%`);
    
    // Group by source
    const bySource = {};
    searchResult.matches.forEach(match => {
      if (!bySource[match.source]) bySource[match.source] = [];
      bySource[match.source].push(match);
    });
    
    Object.entries(bySource).forEach(([source, matches]) => {
      console.log(`\n📁 ${source.toUpperCase()} (${matches.length} matches):`);
      
      matches.slice(0, options.maxPerSource || 3).forEach(match => {
        const confidence = (match.metadata.confidence * 100).toFixed(0);
        const relativePath = match.path.replace(process.cwd(), '.');
        
        console.log(`   🎯 ${confidence}% | ${relativePath}:${match.line}`);
        console.log(`      ${match.content}`);
        if (match.context.before) console.log(`      └─ Context: ${match.context.before}`);
      });
    });
  }
}

// CLI Interface
if (require.main === module) {
  const [keyword, ...options] = process.argv.slice(2);
  
  if (!keyword) {
    console.log('Usage: node unifiedSearch.js <keywords> [options]');
    console.log('Example: node unifiedSearch.js "positioning responsive"');
    process.exit(1);
  }
  
  const searcher = new UnifiedSearcher();
  const results = searcher.unifiedSearch(keyword, {
    limit: 20,
    minConfidence: 0.1
  });
  
  searcher.displayResults(results, {
    maxPerSource: 5
  });
}

module.exports = { UnifiedSearcher, SearchResult };
