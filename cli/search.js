#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function searchInFile(filePath, searchTerm) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const matches = [];
    
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(searchTerm.toLowerCase())) {
        matches.push({
          line: index + 1,
          content: line.trim(),
          context: {
            before: lines[index - 1]?.trim() || '',
            after: lines[index + 1]?.trim() || ''
          }
        });
      }
    });
    
    return matches;
  } catch (error) {
    return [];
  }
}

function searchAllData(searchTerm) {
  const dataDir = 'data';
  const searchDirs = ['memory', 'logs', 'reflections', 'summaries'];
  const results = {};
  
  searchDirs.forEach(dir => {
    const dirPath = path.join(dataDir, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md'));
      
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const matches = searchInFile(filePath, searchTerm);
        
        if (matches.length > 0) {
          if (!results[dir]) results[dir] = {};
          results[dir][file] = matches;
        }
      });
    }
  });
  
  return results;
}

function highlightTerm(text, term) {
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '🔍$1🔍');
}

function displayResults(results, searchTerm) {
  console.log(`\n🔍 Search Results for: "${searchTerm}"\n`);
  
  let totalMatches = 0;
  
  Object.entries(results).forEach(([dir, files]) => {
    console.log(`📁 ${dir.toUpperCase()}`);
    
    Object.entries(files).forEach(([file, matches]) => {
      console.log(`  📄 ${file}`);
      
      matches.slice(0, 3).forEach(match => { // Limit to 3 matches per file
        totalMatches++;
        console.log(`    Line ${match.line}: ${highlightTerm(match.content, searchTerm)}`);
        if (match.context.before) {
          console.log(`      ↳ Context: ...${match.context.before}...`);
        }
      });
      
      if (matches.length > 3) {
        console.log(`    ... and ${matches.length - 3} more matches`);
      }
      console.log();
    });
  });
  
  if (totalMatches === 0) {
    console.log('❌ No matches found');
  } else {
    console.log(`✅ Found ${totalMatches} matches across ${Object.keys(results).length} directories`);
  }
}

// Main execution
if (require.main === module) {
  const searchTerm = process.argv[2];
  
  if (!searchTerm) {
    console.error('❌ Please provide a search term');
    console.log('Usage: node search.js <search-term>');
    process.exit(1);
  }
  
  const results = searchAllData(searchTerm);
  displayResults(results, searchTerm);
}

module.exports = { searchAllData, displayResults };
