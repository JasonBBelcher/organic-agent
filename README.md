# Organic Learning Agent 🧠

An intelligent CLI-based learning and knowledge management system that evolves through reflection, analysis, and continuous improvement. Built with Node.js and designed for developers who want to capture, organize, and leverage their learning experiences.

## 🌟 Features

### Core Learning System
- **Automatic Reflection**: Generates insights from learning sessions and interactions
- **Knowledge Evolution**: Tracks learning progression and conceptual development
- **Session Logging**: Maintains detailed records of all learning activities
- **Intelligent Summarization**: Creates concise summaries of complex sessions

### Advanced CLI Tools
The system includes 8 powerful CLI commands for knowledge retrieval and analysis:

#### 🔍 **Search & Query**
- `search <term>` - Full-text search across all learning data with context highlighting
- `query <question>` - Ask questions about your stored knowledge and get intelligent answers

#### 📊 **Analysis & Insights**
- `timeline [days]` - View chronological learning progression (default: 30 days)
- `principles` - Extract and display core learning principles you've developed
- `contradictions` - Identify conflicting ideas or evolving perspectives in your knowledge
- `insights` - Surface key insights and breakthrough moments from your learning

#### 🧪 **Deep Analysis**
- `analyze <topic>` - Perform comprehensive analysis of specific topics across all data
- `compare <topic1> <topic2>` - Compare and contrast different concepts or approaches

#### 📚 **Knowledge Export**
- `knowledge-base` - Interactive tool to create sanitized knowledge bases for sharing

### Security & Privacy
- **Comprehensive .gitignore**: Protects learning artifacts and sensitive data from version control
- **Automatic Sanitization**: Removes credentials, PII, and sensitive information from exports
- **Local Data Storage**: All learning data stays on your machine

## 🚀 Quick Start

### Installation
```bash
git clone <repository-url>
cd organic-agent
npm install
```

### Basic Usage
```bash
# Start a reflection on a session
node cli/index.js reflect data/logs/session_example.md

# Search for specific information
node cli/index.js search "error handling"

# Ask questions about your knowledge
node cli/index.js query "What are the best practices for async programming?"

# View your learning timeline
node cli/index.js timeline 7

# Export a knowledge base
node cli/index.js knowledge-base
```

## 📁 Project Structure

```
organic-agent/
├── cli/                          # CLI command implementations
│   ├── index.js                  # Main CLI entry point
│   ├── reflect.js                # Reflection generation
│   ├── search.js                 # Full-text search
│   ├── query.js                  # Question answering
│   ├── timeline.js               # Chronological view
│   ├── analysis.js               # Deep analysis tools
│   ├── knowledge.js              # Knowledge navigation
│   └── export-knowledge.js       # Knowledge base export
├── data/                         # Learning data storage
│   ├── logs/                     # Session logs
│   ├── reflections/              # Generated reflections
│   ├── summaries/                # Session summaries
│   └── learning_tree/            # Knowledge structure
├── prompts/                      # System prompts
│   ├── nodejs-enhanced-developer.md  # Node.js ecosystem assistant
│   └── prehook.md               # Development workflow guide
├── knowledge-bases/              # Exported knowledge bases
└── .gitignore                   # Security and privacy protection
```

## 🔧 CLI Commands Reference

### Search Commands
- **`search <term>`** - Search across all learning data
  ```bash
  node cli/index.js search "async patterns"
  ```

- **`query <question>`** - Ask intelligent questions
  ```bash
  node cli/index.js query "How do I handle errors in Express.js?"
  ```

### Analysis Commands
- **`timeline [days]`** - View learning progression
  ```bash
  node cli/index.js timeline 14
  ```

- **`principles`** - Extract core principles
  ```bash
  node cli/index.js principles
  ```

- **`contradictions`** - Find conflicting ideas
  ```bash
  node cli/index.js contradictions
  ```

- **`insights`** - Surface key insights
  ```bash
  node cli/index.js insights
  ```

### Deep Analysis
- **`analyze <topic>`** - Comprehensive topic analysis
  ```bash
  node cli/index.js analyze "testing strategies"
  ```

- **`compare <topic1> <topic2>`** - Compare concepts
  ```bash
  node cli/index.js compare "REST" "GraphQL"
  ```

### Knowledge Management
- **`knowledge-base`** - Interactive knowledge export
  ```bash
  node cli/index.js knowledge-base
  ```

## 🧠 Learning Methodology

The Organic Learning Agent follows these core principles:

1. **Continuous Reflection**: Every session generates reflections that capture insights and learnings
2. **Knowledge Evolution**: Ideas and understanding evolve over time, tracked through the learning tree
3. **Pattern Recognition**: The system identifies recurring themes, principles, and contradictions
4. **Contextual Retrieval**: Advanced search and query capabilities help you find relevant knowledge quickly
5. **Privacy First**: All data remains local with automatic sanitization for sharing

## 🔒 Security Features

- **Learning Data Protection**: `.gitignore` prevents accidental commits of learning artifacts
- **Credential Sanitization**: Automatic removal of API keys, passwords, and tokens
- **PII Protection**: Personal information is filtered from exports
- **Local Storage**: No data leaves your machine unless explicitly exported

## 🎯 Use Cases

- **Developer Learning**: Track programming concepts, frameworks, and best practices
- **Project Documentation**: Maintain living documentation of project decisions and learnings
- **Knowledge Sharing**: Create sanitized knowledge bases for team sharing
- **Personal Growth**: Monitor learning progression and identify knowledge gaps
- **Research**: Organize and analyze complex topics with multiple perspectives

## 🛠 Development

### Adding New CLI Commands
1. Create a new file in the `cli/` directory
2. Export a function that handles the command logic
3. Add the command to `cli/index.js`
4. Update this README with documentation

### Data Structure
- **Logs**: Raw session data and interactions
- **Reflections**: Processed insights and learnings
- **Summaries**: Condensed session overviews
- **Learning Tree**: Hierarchical knowledge organization

## 🤝 Contributing

Contributions are welcome! Please ensure:
- New features include comprehensive documentation
- Security measures are maintained for sensitive data
- CLI commands follow the established patterns
- Code is well-tested and follows project conventions

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

Built with the philosophy that learning should be continuous, reflective, and systematically captured for future growth and sharing.

---

*Transform your learning journey into a structured, searchable, and evolvable knowledge base with the Organic Learning Agent.* 🚀
