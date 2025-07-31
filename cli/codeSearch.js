#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Keyword-based Code Pattern Search System
 * 
 * Creates and searches an index mapping keywords to code file paths and line numbers.
 * Designed to quickly find concrete pattern examples from the codebase.
 * 
 * Usage:
 *   node cli/index.js code-search "pattern_name" 
 *   node cli/index.js code-search "controller validation"
 *   node cli/index.js code-search build-index
 */

class CodePatternSearcher {
  constructor(config = {}) {
    this.indexPath = config.indexPath || 'data/index/code_pattern_index.json';
    this.indexDir = path.dirname(this.indexPath);
    this.workspacePaths = config.workspacePaths || this.loadWorkspaceConfig();
    this.domainTerms = config.domainTerms || this.getDefaultDomainTerms();
    this.index = this.loadIndex();
  }

  /**
   * Load workspace paths from config file or use defaults
   */
  loadWorkspaceConfig() {
    const configPath = 'data/config/workspace_paths.json';
    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        return config.workspacePaths.map(p => path.isAbsolute(p) ? p : path.resolve(p));
      }
    } catch (error) {
      console.log('📝 Using default workspace paths');
    }
    
    // Default to current directory and common subdirectories
    return [
      process.cwd(),
      path.join(process.cwd(), 'src'),
      path.join(process.cwd(), 'app'),
      path.join(process.cwd(), 'lib')
    ].filter(p => fs.existsSync(p));
  }

  /**
   * Get default domain terms - can be overridden by config
   */
  getDefaultDomainTerms() {
    return {
      // Generic Framework Terms
      'controller': 'mvc_controller',
      'model': 'data_model',
      'service': 'business_service',
      'repository': 'data_repository',
      'factory': 'object_factory',
      'handler': 'event_handler',
      'middleware': 'request_middleware',
      'validator': 'input_validator',
      'transformer': 'data_transformer',
      'provider': 'service_provider',
      
      // Common Patterns
      'singleton': 'singleton_pattern',
      'observer': 'observer_pattern',
      'strategy': 'strategy_pattern',
      'decorator': 'decorator_pattern',
      'adapter': 'adapter_pattern',
      'facade': 'facade_pattern',
      
      // API Patterns
      'endpoint': 'api_endpoint',
      'route': 'url_route',
      'request': 'http_request',
      'response': 'http_response',
      'middleware': 'http_middleware',
      
      // Database Patterns
      'migration': 'database_migration',
      'seeder': 'database_seeder',
      'query': 'database_query',
      'relationship': 'model_relationship',
      
      // Testing Patterns
      'test': 'unit_test',
      'mock': 'test_mock',
      'fixture': 'test_fixture',
      'assertion': 'test_assertion'
    };
  }

  loadIndex() {
    // Try to load unified index first, fall back to code-only index
    const unifiedIndexPath = path.join(this.indexDir, 'unified_search_index.json');
    const codeIndexPath = this.indexPath;
    
    try {
      if (fs.existsSync(unifiedIndexPath)) {
        console.log('🔗 Using unified search index (code + knowledge)');
        return JSON.parse(fs.readFileSync(unifiedIndexPath, 'utf-8'));
      } else if (fs.existsSync(codeIndexPath)) {
        console.log('📋 Using code pattern index only');
        return JSON.parse(fs.readFileSync(codeIndexPath, 'utf-8'));
      }
    } catch (error) {
      console.log('📝 No existing index found, will create new one');
    }
    return {};
  }

  saveIndex() {
    const indexDir = path.dirname(this.indexPath);
    if (!fs.existsSync(indexDir)) {
      fs.mkdirSync(indexDir, { recursive: true });
    }
    fs.writeFileSync(this.indexPath, JSON.stringify(this.index, null, 2));
  }

  /**
   * Extract contextually meaningful keywords based on configurable domain knowledge
   */
  extractKeywords(content, filePath) {
    const keywords = new Set();
    const lines = content.split('\n');
    
    // Limit keywords per file to avoid explosion
    let keywordCount = 0;
    const maxKeywords = 15; // Reduced for better quality
    
    // Use configurable domain terms
    const domainTerms = this.domainTerms;
    
    // Common words to filter out (too generic)
    const stopWords = new Set([
      'function', 'class', 'public', 'private', 'protected', 'extends', 'implements',
      'const', 'var', 'let', 'return', 'true', 'false', 'null', 'undefined',
      'string', 'array', 'object', 'number', 'boolean', 'this', 'that', 'the',
      'and', 'or', 'not', 'if', 'else', 'for', 'while', 'do', 'switch', 'case'
    ]);
    
    lines.forEach((line, index) => {
      if (keywordCount >= maxKeywords) return;
      
      const trimmed = line.trim().toLowerCase();
      if (!trimmed || trimmed.length < 3) return;
      
      // Check for domain-specific terms first (highest priority)
      Object.keys(domainTerms).forEach(term => {
        if (trimmed.includes(term.toLowerCase()) && keywordCount < maxKeywords) {
          keywords.add(domainTerms[term]);
          keywordCount++;
        }
      });
      
      if (keywordCount >= maxKeywords) return;
      
      // Language-specific patterns (only meaningful ones)
      if (filePath.endsWith('.php') || filePath.endsWith('.py') || filePath.endsWith('.java')) {
        // Class definitions - but only if they contain domain terms
        const classMatch = trimmed.match(/class\s+(\w+)/);
        if (classMatch) {
          const className = classMatch[1].toLowerCase();
          if (className.includes('controller') || className.includes('handler') || 
              className.includes('repository') || className.includes('model') ||
              className.includes('service') || className.includes('factory')) {
            keywords.add(`${className}_class`);
            keywordCount++;
          }
        }
        
        // Method definitions - only if they contain business logic terms
        const methodMatch = trimmed.match(/(?:public|private|protected|def)\s+(?:function\s+)?(\w+)/);
        if (methodMatch) {
          const methodName = methodMatch[1].toLowerCase();
          if (methodName.includes('update') || methodName.includes('get') || 
              methodName.includes('create') || methodName.includes('delete') ||
              methodName.includes('search') || methodName.includes('validate') ||
              methodName.includes('process') || methodName.includes('handle')) {
            keywords.add(`${methodName}_method`);
            keywordCount++;
          }
        }
      }
      
      // JavaScript/TypeScript patterns
      if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
        // Function definitions - only API/framework related
        const funcMatch = trimmed.match(/(?:function\s+(\w+)|(\w+):\s*function|const\s+(\w+)\s*=)/);
        if (funcMatch) {
          const funcName = (funcMatch[1] || funcMatch[2] || funcMatch[3]).toLowerCase();
          if (funcName.includes('api') || funcName.includes('update') || 
              funcName.includes('get') || funcName.includes('post') ||
              funcName.includes('call') || funcName.includes('validate') || 
              funcName.includes('filter') || funcName.includes('transform')) {
            keywords.add(`${funcName}_function`);
            keywordCount++;
          }
        }
      }
    });
    
    return Array.from(keywords).slice(0, maxKeywords);
  }

  /**
   * Build the keyword index by scanning workspace files
   */
  async buildIndex() {
    console.log('🔍 Building keyword-based code pattern index...');
    console.log(`📁 Scanning workspace paths:`);
    this.workspacePaths.forEach(p => console.log(`   ${p}`));
    
    this.index = {};
    let fileCount = 0;
    let keywordCount = 0;
    
    for (const workspacePath of this.workspacePaths) {
      if (!fs.existsSync(workspacePath)) {
        console.log(`⚠️  Skipping non-existent path: ${workspacePath}`);
        continue;
      }
      
      await this.scanDirectory(workspacePath, workspacePath);
    }
    
    // Calculate statistics
    Object.values(this.index).forEach(entries => {
      fileCount += entries.length;
      keywordCount++;
    });
    
    console.log(`\n✅ Index built successfully!`);
    console.log(`📊 Statistics:`);
    console.log(`   Keywords: ${keywordCount}`);
    console.log(`   File references: ${fileCount}`);
    console.log(`   Index size: ${(JSON.stringify(this.index).length / 1024).toFixed(1)} KB`);
    
    this.saveIndex();
    console.log(`💾 Index saved to: ${this.indexPath}`);
  }

  /**
   * Recursively scan directory for code files
   */
  async scanDirectory(dirPath, basePath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        // Skip certain directories
        if (stat.isDirectory()) {
          if (['node_modules', '.git', 'vendor', 'storage', 'bootstrap/cache'].some(skip => item.includes(skip))) {
            continue;
          }
          await this.scanDirectory(itemPath, basePath);
        } else if (stat.isFile()) {
          // Process relevant file types
          if (this.isRelevantFile(itemPath)) {
            await this.indexFile(itemPath, basePath);
          }
        }
      }
    } catch (error) {
      // Skip inaccessible directories
    }
  }

  /**
   * Check if file should be indexed - be more selective
   */
  isRelevantFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    
    // Skip minified files, vendor code, and non-essential files
    if (filePath.includes('.min.') || 
        filePath.includes('/vendor/') || 
        filePath.includes('/node_modules/') ||
        filePath.includes('/storage/') ||
        filePath.includes('/bootstrap/cache/') ||
        filePath.includes('/public/legacy/') ||
        filePath.includes('/public/javascript/yui/') ||
        filePath.includes('/public/javascript/firebug') ||
        filePath.includes('/public/jplot/') ||
        filePath.includes('/public/javascript/istyle/') ||
        filePath.includes('.log') ||
        filePath.includes('.cache')) {
      return false;
    }
    
    // Only index key file types that contain patterns
    return ['.php', '.js'].includes(ext) || 
           (filePath.includes('config') && ['.php', '.json'].includes(ext)) ||
           (filePath.includes('migration') && ext === '.php');
  }

  /**
   * Index a single file with optimized storage
   */
  async indexFile(filePath, basePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const keywords = this.extractKeywords(content, filePath);
      const lines = content.split('\n');
      
      // Find only the most important pattern ranges (limit to avoid huge index)
      const patterns = this.findPatternRanges(lines, filePath).slice(0, 5); // Limit patterns per file
      
      // Only store unique file paths per keyword (avoid massive duplication)
      keywords.forEach(keyword => {
        if (!this.index[keyword]) {
          this.index[keyword] = new Set(); // Use Set to avoid duplicates
        }
        
        // Create compact file reference
        const relativePath = path.relative(basePath, filePath);
        const workspace = path.basename(basePath);
        
        // Only store essential info to keep index small
        const fileRef = {
          path: relativePath, // Store relative path to save space
          workspace: workspace,
          // Only store line numbers for top patterns
          lines: patterns.slice(0, 2).map(p => `${p.startLine}-${p.endLine}`)
        };
        
        this.index[keyword].add(JSON.stringify(fileRef)); // Serialize to avoid duplicates
      });
      
    } catch (error) {
      // Skip files that can't be read
    }
  }

  /**
   * Convert Sets back to Arrays for JSON serialization
   */
  saveIndex() {
    const indexDir = path.dirname(this.indexPath);
    if (!fs.existsSync(indexDir)) {
      fs.mkdirSync(indexDir, { recursive: true });
    }
    
    // Convert Sets to Arrays and parse JSON strings back to objects
    const serializableIndex = {};
    Object.keys(this.index).forEach(keyword => {
      serializableIndex[keyword] = Array.from(this.index[keyword]).map(item => {
        try {
          return JSON.parse(item);
        } catch {
          return item; // fallback
        }
      });
    });
    
    fs.writeFileSync(this.indexPath, JSON.stringify(serializableIndex, null, 2));
  }

  /**
   * Find contextually meaningful pattern ranges based on common code patterns
   */
  findPatternRanges(lines, filePath) {
    const patterns = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toLowerCase();
      
      // PHP patterns - focus on common architectural patterns
      if (filePath.endsWith('.php')) {
        // Common class patterns
        if (line.match(/class\s+\w*(handler|controller|repository|factory|service|model)\w*/)) {
          const endLine = this.findBlockEnd(lines, i);
          patterns.push({
            type: 'common_class',
            startLine: i + 1,
            endLine: Math.min(endLine + 1, i + 30),
            description: lines[i].trim()
          });
        }
        
        // Key framework methods
        if (line.match(/(?:public|private|protected)\s+function\s+(update|get|create|delete|handle|process|validate)/)) {
          const endLine = this.findBlockEnd(lines, i);
          patterns.push({
            type: 'framework_method', 
            startLine: i + 1,
            endLine: Math.min(endLine + 1, i + 20),
            description: lines[i].trim()
          });
        }
        
        // Database relationships
        if (line.includes('belongsto') || line.includes('hasmany') || line.includes('relationship')) {
          patterns.push({
            type: 'database_relationship',
            startLine: i + 1,
            endLine: Math.min(i + 10, lines.length),
            description: lines[i].trim()
          });
        }
        
        // Event dispatching patterns
        if (line.includes('dispatch') || line.includes('event') || line.includes('emit')) {
          patterns.push({
            type: 'event_pattern',
            startLine: i + 1,
            endLine: Math.min(i + 8, lines.length),
            description: lines[i].trim()
          });
        }
      }
      
      // JavaScript patterns - focus on API and async patterns
      if (filePath.endsWith('.js')) {
        // API calls and async operations
        if (line.includes('fetch') || line.includes('axios') || line.includes('api') || line.includes('.call(')) {
          const endLine = this.findBlockEnd(lines, i);
          patterns.push({
            type: 'api_call',
            startLine: i + 1, 
            endLine: Math.min(endLine + 1, i + 15),
            description: lines[i].trim()
          });
        }
        
        // Validation functions
        if (line.includes('validate') || line.includes('filter')) {
          const endLine = this.findBlockEnd(lines, i);
          patterns.push({
            type: 'validation_function',
            startLine: i + 1,
            endLine: Math.min(endLine + 1, i + 12),
            description: lines[i].trim()
          });
        }
        
        // Object extensions/controllers
        if (line.includes('.extend(') || line.includes('controller')) {
          const endLine = this.findBlockEnd(lines, i);
          patterns.push({
            type: 'frontend_controller',
            startLine: i + 1,
            endLine: Math.min(endLine + 1, i + 20),
            description: lines[i].trim()
          });
        }
      }
    }
    
    // Sort by importance (database patterns first, then core logic)
    return patterns.sort((a, b) => {
      const importance = {
        'database_relationship': 10,
        'common_class': 9,
        'api_call': 8,
        'framework_method': 7,
        'event_pattern': 6,
        'validation_function': 5,
        'frontend_controller': 4
      };
      return (importance[b.type] || 0) - (importance[a.type] || 0);
    }).slice(0, 3); // Top 3 most important patterns
  }

  /**
   * Find the end of a code block (closing brace)
   */
  findBlockEnd(lines, startLine) {
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    
    for (let i = startLine; i < lines.length && i < startLine + 50; i++) {
      const line = lines[i];
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        // Handle string literals
        if (!inString && (char === '"' || char === "'")) {
          inString = true;
          stringChar = char;
        } else if (inString && char === stringChar && line[j-1] !== '\\') {
          inString = false;
        }
        
        if (!inString) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
          
          if (braceCount === 0 && i > startLine) {
            return i;
          }
        }
      }
    }
    
    return Math.min(startLine + 20, lines.length - 1);
  }

  /**
   * Search for keywords in the index
   */
  search(searchTerms) {
    const terms = searchTerms.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    
    if (terms.length === 0) {
      console.log('❌ Please provide search terms');
      return;
    }
    
    console.log(`🔍 Searching for: ${terms.join(' + ')}`);
    console.log(`📊 Index contains ${Object.keys(this.index).length} keywords\n`);
    
    const results = new Map();
    
    // Find keywords that match any search term
    Object.keys(this.index).forEach(keyword => {
      const matchScore = this.calculateMatchScore(keyword, terms);
      if (matchScore > 0) {
        this.index[keyword].forEach(fileRef => {
          const key = fileRef.path;
          if (!results.has(key)) {
            results.set(key, {
              ...fileRef,
              matchedKeywords: [],
              totalScore: 0
            });
          }
          results.get(key).matchedKeywords.push({ keyword, score: matchScore });
          results.get(key).totalScore += matchScore;
        });
      }
    });
    
    // Sort by relevance score
    const sortedResults = Array.from(results.values())
      .sort((a, b) => b.totalScore - a.totalScore);
    
    if (sortedResults.length === 0) {
      console.log('❌ No matches found');
      console.log('\n💡 Try broader terms like:');
      console.log('   "controller", "model", "validation", "repository"');
      console.log('   "function", "class", "method", "pattern"');
      return;
    }
    
    console.log(`✅ Found ${sortedResults.length} matching files:\n`);
    
    // Display results
    sortedResults.slice(0, 15).forEach((result, index) => {
      const relativePath = result.relativePath || result.path;
      const workspace = result.workspace || 'unknown';
      const displayPath = relativePath.startsWith('data/') ? relativePath : `${workspace}/${relativePath}`;
      
      console.log(`${index + 1}. 📁 ${displayPath}`);
      
      // Show heading for knowledge entries
      if (result.heading) {
        console.log(`   📖 "${result.heading}"`);
      }
      
      // Show type badge for knowledge entries
      if (result.type) {
        const typeEmoji = result.type === 'memory' ? '🧠' : result.type === 'reflection' ? '🔍' : '📈';
        console.log(`   ${typeEmoji} Type: ${result.type}`);
      }
      
      console.log(`   🔗 ${result.path}`);
      
      // Deduplicate keywords for display
      const uniqueKeywords = [...new Set(result.matchedKeywords.map(k => k.keyword))];
      console.log(`   📊 Score: ${result.totalScore.toFixed(1)} | Keywords: ${uniqueKeywords.slice(0, 5).join(', ')}${uniqueKeywords.length > 5 ? '...' : ''}`);
      
      if (result.patterns && result.patterns.length > 0) {
        console.log(`   🎯 Patterns found:`);
        result.patterns.slice(0, 3).forEach(pattern => {
          console.log(`      • ${pattern.type} (lines ${pattern.startLine}-${pattern.endLine}): ${pattern.description.substring(0, 60)}...`);
        });
      }
      console.log('');
    });
    
    if (sortedResults.length > 15) {
      console.log(`... and ${sortedResults.length - 15} more results\n`);
    }
    
    console.log('💡 To view a specific pattern:');
    console.log('   Use VS Code "Go to Line" (Ctrl+G) with the line numbers shown');
    console.log('   Or: code <file_path>:<line_number>');
  }

  /**
   * Calculate match score for keyword against search terms with domain weighting
   */
  calculateMatchScore(keyword, terms) {
    let score = 0;
    
    // High-value domain terms get bonus scoring
    const domainBoosts = {
      'controller': 12,
      'model': 10,
      'service': 10,
      'repository': 10,
      'handler': 8,
      'factory': 8,
      'middleware': 6,
      'validator': 6,
      'api': 8,
      'route': 6,
      'test': 5,
      'migration': 5,
      'query': 5
    };
    
    terms.forEach(term => {
      if (keyword === term) {
        score += 20; // Exact match - highest score
      } else if (keyword.includes(term)) {
        score += 10; // Partial match
      } else if (term.includes(keyword) && keyword.length > 3) {
        score += 5; // Term contains keyword
      }
      
      // Apply domain-specific boosts
      Object.keys(domainBoosts).forEach(domainTerm => {
        if (keyword.includes(domainTerm) || term.includes(domainTerm)) {
          score += domainBoosts[domainTerm];
        }
      });
    });
    
    return score;
  }

  /**
   * Display index statistics and top keywords
   */
  showStats() {
    console.log('📊 Code Pattern Search Index Statistics\n');
    
    const keywordCount = Object.keys(this.index).length;
    const totalFiles = Object.values(this.index).reduce((sum, files) => sum + files.length, 0);
    
    console.log(`Keywords indexed: ${keywordCount}`);
    console.log(`File references: ${totalFiles}`);
    console.log(`Index file: ${this.indexPath}`);
    console.log(`Last updated: ${fs.existsSync(this.indexPath) ? fs.statSync(this.indexPath).mtime.toLocaleDateString() : 'Never'}\n`);
    
    // Show top keywords by frequency
    const keywordFreq = Object.entries(this.index)
      .map(([keyword, files]) => ({ keyword, count: files.length }))
      .sort((a, b) => b.count - a.count);
    
    console.log('🔝 Top keywords by frequency:');
    keywordFreq.slice(0, 20).forEach((item, index) => {
      console.log(`${index + 1}. ${item.keyword} (${item.count} files)`);
    });
    
    console.log('\n💡 Search examples:');
    console.log('   node cli/index.js code-search "mvc controller"');
    console.log('   node cli/index.js code-search "data repository"');
    console.log('   node cli/index.js code-search "service factory"');
    console.log('   node cli/index.js code-search "api endpoint"');
    console.log('   node cli/index.js code-search "test validation"');
    console.log('');
    console.log('🤖 For AI Agents: Use these contextual terms for concrete examples:');
    console.log('   • mvc_controller - Find controller class implementations');
    console.log('   • data_repository - Locate repository pattern examples');
    console.log('   • business_service - Find service layer implementations');
    console.log('   • object_factory - Factory pattern examples');
    console.log('   • api_endpoint - API route and handler patterns');
    console.log('   • input_validator - Validation logic implementations');
    console.log('   • database_migration - Database schema examples');
    console.log('   • unit_test - Testing pattern implementations');
  }
}

// CLI execution
function main() {
  const args = process.argv.slice(2);
  const searcher = new CodePatternSearcher();
  
  if (args.length === 0) {
    console.log('❌ Usage: node codeSearch.js <command> [arguments]');
    console.log('Commands:');
    console.log('  build-index              - Build/rebuild the keyword index');
    console.log('  stats                    - Show index statistics');
    console.log('  "<search terms>"         - Search for patterns');
    console.log('');
    console.log('Examples:');
    console.log('  node codeSearch.js build-index');
    console.log('  node codeSearch.js "mvc controller"');
    console.log('  node codeSearch.js "data repository validation"');
    console.log('');
    console.log('💡 Configure workspace paths in: data/config/workspace_paths.json');
    console.log('💡 Customize domain terms for your project patterns');
    return;
  }
  
  const command = args[0];
  
  if (command === 'build-index') {
    searcher.buildIndex();
  } else if (command === 'stats') {
    searcher.showStats();
  } else {
    // Treat as search terms
    const searchTerms = args.join(' ');
    searcher.search(searchTerms);
  }
}

if (require.main === module) {
  main();
}

module.exports = CodePatternSearcher;
