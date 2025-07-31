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

function extractPrinciples(content) {
  const principles = [];
  const lines = content.split('\n');
  let currentPrinciple = null;
  let inPrinciplesSection = false;
  
  lines.forEach(line => {
    if (line === '## Learned Principles') {
      inPrinciplesSection = true;
      return;
    }
    
    if (line.startsWith('## ') && line !== '## Learned Principles') {
      inPrinciplesSection = false;
      if (currentPrinciple) {
        principles.push(currentPrinciple);
        currentPrinciple = null;
      }
      return;
    }
    
    if (inPrinciplesSection && line.startsWith('### ')) {
      if (currentPrinciple) {
        principles.push(currentPrinciple);
      }
      currentPrinciple = {
        title: line.replace('### ', ''),
        description: '',
        source: '',
        pattern: '',
        evidence: '',
        insights: []
      };
    }
    
    if (currentPrinciple && line.startsWith('- ')) {
      const lineContent = line.replace(/^- \*\*([^*]+)\*\*:\s*/, '');
      const fieldMatch = line.match(/^- \*\*([^*]+)\*\*:\s*(.*)/);
      
      if (fieldMatch) {
        const [, field, value] = fieldMatch;
        switch (field) {
          case 'Source':
            currentPrinciple.source = value;
            break;
          case 'Pattern':
            currentPrinciple.pattern = value;
            break;
          case 'Evidence':
            currentPrinciple.evidence = value;
            break;
          case 'Insight':
            currentPrinciple.insights.push(value);
            break;
          default:
            if (!currentPrinciple.description) {
              currentPrinciple.description = lineContent;
            }
        }
      } else {
        currentPrinciple.insights.push(lineContent);
      }
    }
  });
  
  if (currentPrinciple) {
    principles.push(currentPrinciple);
  }
  
  return principles;
}

function extractContradictions(content) {
  const contradictions = [];
  const lines = content.split('\n');
  let inContradictionsSection = false;
  let currentContradiction = null;
  
  lines.forEach(line => {
    if (line === '## Contradictions and Revisions') {
      inContradictionsSection = true;
      return;
    }
    
    if (line.startsWith('## ') && line !== '## Contradictions and Revisions') {
      inContradictionsSection = false;
      if (currentContradiction) {
        contradictions.push(currentContradiction);
      }
      return;
    }
    
    if (inContradictionsSection && line.startsWith('### ')) {
      if (currentContradiction) {
        contradictions.push(currentContradiction);
      }
      currentContradiction = {
        title: line.replace('### ', ''),
        details: []
      };
    }
    
    if (currentContradiction && line.startsWith('- ')) {
      currentContradiction.details.push(line.replace('- ', ''));
    }
  });
  
  if (currentContradiction) {
    contradictions.push(currentContradiction);
  }
  
  return contradictions;
}

function extractInsightsByDomain(content) {
  const domains = [];
  const lines = content.split('\n');
  let inDomainsSection = false;
  let inImplementationSection = false;
  let currentDomain = null;
  
  lines.forEach(line => {
    if (line === '## Technical Knowledge Domains' || line === '## Implementation Insights') {
      inDomainsSection = line === '## Technical Knowledge Domains';
      inImplementationSection = line === '## Implementation Insights';
      return;
    }
    
    if (line.startsWith('## ') && 
        line !== '## Technical Knowledge Domains' && 
        line !== '## Implementation Insights') {
      inDomainsSection = false;
      inImplementationSection = false;
      if (currentDomain) {
        domains.push(currentDomain);
      }
      return;
    }
    
    if ((inDomainsSection || inImplementationSection) && line.startsWith('### ')) {
      if (currentDomain) {
        domains.push(currentDomain);
      }
      currentDomain = {
        title: line.replace('### ', ''),
        category: inDomainsSection ? 'Technical Domain' : 'Implementation Insight',
        insights: []
      };
    }
    
    if (currentDomain && line.startsWith('- ')) {
      currentDomain.insights.push(line.replace('- ', ''));
    }
  });
  
  if (currentDomain) {
    domains.push(currentDomain);
  }
  
  return domains;
}

function displayPrinciples(filter = null) {
  try {
    const content = loadMemoryTree();
    const principles = extractPrinciples(content);
    
    console.log('\n🎯 Learned Principles\n');
    
    principles.forEach((principle, index) => {
      if (filter && !principle.title.toLowerCase().includes(filter.toLowerCase())) {
        return;
      }
      
      console.log(`${index + 1}. 📋 ${principle.title}`);
      if (principle.description) {
        console.log(`   💡 ${principle.description}`);
      }
      if (principle.source) {
        console.log(`   📚 Source: ${principle.source}`);
      }
      if (principle.pattern) {
        console.log(`   🔄 Pattern: ${principle.pattern}`);
      }
      if (principle.evidence) {
        console.log(`   ✅ Evidence: ${principle.evidence}`);
      }
      console.log();
    });
    
    console.log(`✅ Total principles: ${principles.length}`);
    
  } catch (error) {
    console.error('❌ Error loading principles:', error.message);
  }
}

function displayContradictions() {
  try {
    const content = loadMemoryTree();
    const contradictions = extractContradictions(content);
    
    console.log('\n🔄 Contradictions and Revisions\n');
    
    if (contradictions.length === 0) {
      console.log('✅ No contradictions found - knowledge is consistent');
      return;
    }
    
    contradictions.forEach((contradiction, index) => {
      console.log(`${index + 1}. ⚠️ ${contradiction.title}`);
      contradiction.details.forEach(detail => {
        console.log(`   • ${detail}`);
      });
      console.log();
    });
    
    console.log(`📊 Total contradictions: ${contradictions.length}`);
    
  } catch (error) {
    console.error('❌ Error loading contradictions:', error.message);
  }
}

function displayInsights(domainFilter = null) {
  try {
    const content = loadMemoryTree();
    const domains = extractInsightsByDomain(content);
    
    console.log('\n🏗️ Implementation Insights by Domain\n');
    
    domains.forEach((domain, index) => {
      if (domainFilter && !domain.title.toLowerCase().includes(domainFilter.toLowerCase())) {
        return;
      }
      
      console.log(`${index + 1}. 🎯 ${domain.title} (${domain.category})`);
      domain.insights.slice(0, 5).forEach(insight => {
        console.log(`   • ${insight}`);
      });
      if (domain.insights.length > 5) {
        console.log(`   ... and ${domain.insights.length - 5} more insights`);
      }
      console.log();
    });
    
    const filteredCount = domainFilter ? 
      domains.filter(d => d.title.toLowerCase().includes(domainFilter.toLowerCase())).length :
      domains.length;
    
    console.log(`✅ Showing ${filteredCount} domains`);
    
  } catch (error) {
    console.error('❌ Error loading insights:', error.message);
  }
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  const filter = process.argv[3];
  
  switch (command) {
    case 'principles':
      displayPrinciples(filter);
      break;
    case 'contradictions':
      displayContradictions();
      break;
    case 'insights':
      displayInsights(filter);
      break;
    default:
      console.log('Usage:');
      console.log('  node knowledge.js principles [filter]');
      console.log('  node knowledge.js contradictions');
      console.log('  node knowledge.js insights [domain-filter]');
      break;
  }
}

module.exports = { 
  displayPrinciples, 
  displayContradictions, 
  displayInsights,
  extractPrinciples,
  extractContradictions,
  extractInsightsByDomain
};
