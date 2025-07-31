#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function getSessionTimeline() {
  const logsDir = 'data/logs';
  const reflectionsDir = 'data/reflections';
  
  if (!fs.existsSync(logsDir)) {
    return [];
  }
  
  const sessions = [];
  const logFiles = fs.readdirSync(logsDir)
    .filter(f => f.endsWith('.md') && f !== '.gitkeep')
    .sort();

  logFiles.forEach((logFile, index) => {
    const logPath = path.join(logsDir, logFile);
    const stats = fs.statSync(logPath);
    const content = fs.readFileSync(logPath, 'utf-8');

    // Extract session info - try multiple patterns for session numbers
    let sessionNumber = logFile.match(/session_(\d+)\.md/)?.[1];
    if (!sessionNumber) {
      sessionNumber = logFile.match(/_(\d{8})\.md/)?.[1]; // date pattern like 20250731
    }
    if (!sessionNumber) {
      sessionNumber = index + 1; // fallback to file order
    }
    
    const lines = content.split('\n');
    const title = lines.find(line => line.startsWith('# '))?.replace('# ', '') || logFile.replace('.md', '');
    const task = lines.find(line => line.toLowerCase().includes('task:') || line.toLowerCase().includes('goal:'))?.replace(/.*(?:task|goal):\s*/i, '') || 'Session Analysis';    // Get reflection if it exists - try multiple patterns
    const baseName = logFile.replace('.md', '');
    const possibleReflectionFiles = [
      `${baseName}_reflection.md`,
      `session_${sessionNumber}_reflection.md`
    ];
    
    let reflection = null;
    for (const reflectionFile of possibleReflectionFiles) {
      const reflectionPath = path.join(reflectionsDir, reflectionFile);
      if (fs.existsSync(reflectionPath)) {
        const reflectionContent = fs.readFileSync(reflectionPath, 'utf-8');
        const reflectionLines = reflectionContent.split('\n');
        const keyInsights = reflectionLines
          .filter(line => line.startsWith('- ') || line.startsWith('* '))
          .slice(0, 3)
          .map(line => line.replace(/^[-*]\s*/, ''));
        
        reflection = {
          exists: true,
          keyInsights
        };
        break; // Found reflection, stop looking
      }
    }
    
    sessions.push({
      number: parseInt(sessionNumber) || index + 1,
      title,
      task,
      date: stats.mtime,
      file: logFile,
      reflection
    });
  });
  
  return sessions.sort((a, b) => a.number - b.number);
}

function displayTimeline(sessions) {
  console.log('\n📅 Learning Timeline\n');
  
  if (sessions.length === 0) {
    console.log('❌ No sessions found');
    return;
  }
  
  sessions.forEach((session, index) => {
    const isLast = index === sessions.length - 1;
    const connector = isLast ? '└─' : '├─';
    
    console.log(`${connector} 📚 Session ${session.number}: ${session.title}`);
    console.log(`${isLast ? '  ' : '│ '} 📅 ${session.date.toLocaleDateString()}`);
    console.log(`${isLast ? '  ' : '│ '} 🎯 ${session.task}`);
    
    if (session.reflection && session.reflection.exists) {
      console.log(`${isLast ? '  ' : '│ '} 💡 Key Insights:`);
      session.reflection.keyInsights.forEach(insight => {
        console.log(`${isLast ? '  ' : '│ '}   • ${insight}`);
      });
    } else {
      console.log(`${isLast ? '  ' : '│ '} ❓ No reflection generated`);
    }
    
    if (!isLast) {
      console.log('│');
    }
  });
  
  console.log(`\n✅ Total Sessions: ${sessions.length}`);
  
  // Show progression summary
  const totalDays = Math.ceil((sessions[sessions.length - 1].date - sessions[0].date) / (1000 * 60 * 60 * 24));
  const reflectionsCount = sessions.filter(s => s.reflection?.exists).length;
  
  console.log(`📊 Learning Statistics:`);
  console.log(`   • Duration: ${totalDays} days`);
  console.log(`   • Sessions with reflections: ${reflectionsCount}/${sessions.length}`);
  console.log(`   • Average: ${(sessions.length / Math.max(totalDays, 1)).toFixed(1)} sessions per day`);
}

// Main execution
if (require.main === module) {
  const sessions = getSessionTimeline();
  displayTimeline(sessions);
}

module.exports = { getSessionTimeline, displayTimeline };
