# Organic Learning Agent 🧠

An intelligent CLI-based learning and knowledge management system designed to reverse-engineer, understand, and master legacy codebases. Built with Node.js, it combines systematic knowledge capture with code pattern discovery to transform unfamiliar systems into navigable, searchable intelligence.

## 🌟 Features

### Legacy Code Intelligence
- **Code Pattern Discovery**: Automatically maps recurring patterns, architectural decisions, and implementation strategies in unfamiliar codebases
- **Smart Code Search**: Unified search across both code patterns and knowledge content with exact file paths and line numbers
- **Architecture Mapping**: Identifies system components, data flows, and integration patterns across legacy systems
- **Framework Detection**: Recognizes custom frameworks, legacy patterns, and architectural styles in older codebases

### Organic Learning System
- **Automatic Reflection**: Generates insights from learning sessions and code exploration
- **Knowledge Evolution**: Tracks understanding progression as you decode legacy systems
- **Pattern Recognition**: Identifies recurring themes, anti-patterns, and architectural decisions
- **Learning Integration**: Builds cumulative intelligence across multiple codebase explorations

### Advanced CLI Tools
The system includes 16+ powerful CLI commands for code exploration and knowledge management:

#### 🔍 **Code Discovery & Search**
- `code-search <keywords>` - **UNIFIED SEARCH** across code patterns AND knowledge content with file paths and line numbers
- `build-code-index` - Build/rebuild the keyword-based code pattern index for current workspace
- `code-stats` - Show code pattern index statistics and discovered keywords
- `search <term>` - Full-text search across all learning data with context highlighting
- `query <question>` - Ask questions about your stored knowledge and get intelligent answers

#### 📊 **Knowledge Analysis & Insights**
- `timeline` - View chronological learning progression and code exploration history
- `principles` - Extract and display core architectural principles you've discovered
- `contradictions` - Identify conflicting ideas or evolving perspectives in your understanding
- `insights` - Surface key insights and breakthrough moments from code exploration
- `analyze <topic>` - Perform comprehensive analysis of specific topics across all data
- `compare <session1> <session2>` - Compare knowledge evolution between exploration sessions

#### 🧠 **Learning Management**
- `reflect <logFile>` - Generate structured reflections from exploration sessions
- `diff <oldFile> <newFile>` - Compare memory tree versions to track knowledge evolution
- `summarize <diffFile>` - Generate evolution summaries from memory tree changes
- `commit <message>` - Save learning state with descriptive messages
- `status` - View current learning system health and recent activity

#### 📚 **Knowledge Export & Sharing**
- `knowledge-base` - Interactive tool to create sanitized knowledge bases for sharing
- `searchable-knowledge-base` - Export enhanced knowledge base with unified search capabilities
- `export [--format]` - Export knowledge in various formats (JSON, Markdown)

### Security & Privacy
- **Comprehensive .gitignore**: Protects learning artifacts and sensitive data from version control
- **Automatic Sanitization**: Removes credentials, PII, and sensitive information from exports
- **Local Data Storage**: All learning data stays on your machine
- **Safe Code Pattern Extraction**: Extracts patterns without exposing sensitive business logic

## 🚀 Quick Start

### Installation
```bash
git clone <repository-url>
cd organic-agent
npm install
```

### Legacy Codebase Exploration Workflow

#### 1. **Initial Code Discovery**
```bash
# Build a searchable index of code patterns
node cli/index.js build-code-index

# Get overview of discovered patterns and keywords
node cli/index.js code-stats

# Search for authentication patterns
node cli/index.js code-search "authentication login security"
```

#### 2. **Pattern-Based Exploration**
```bash
# Find database connection patterns
node cli/index.js code-search "database connection mysql"

# Locate routing and controller patterns  
node cli/index.js code-search "routing controller mvc"

# Search for validation and error handling
node cli/index.js code-search "validation error handling"
```

#### 3. **Knowledge Building**
```bash
# Reflect on exploration session
node cli/index.js reflect data/logs/session_exploration.md

# Search your accumulated knowledge
node cli/index.js search "legacy patterns"

# Ask questions about discoveries
node cli/index.js query "What authentication patterns did we find?"
```

#### 4. **Knowledge Management**
```bash
# View learning timeline
node cli/index.js timeline

# Extract discovered principles
node cli/index.js principles

# Export searchable knowledge base
node cli/index.js searchable-knowledge-base
```

### Basic Learning Workflow
```bash
# Start a reflection on a session
node cli/index.js reflect data/logs/session_example.md

# Search for specific information
node cli/index.js search "error handling"

# Ask questions about your knowledge
node cli/index.js query "What are the best practices for async programming?"

# View your learning timeline
node cli/index.js timeline

# Export a knowledge base
node cli/index.js knowledge-base
```

## 📁 Project Structure

```
organic-agent/
├── cli/                          # CLI command implementations
│   ├── index.js                  # Main CLI entry point (16+ commands)
│   ├── codeSearch.js             # Code pattern discovery and search
│   ├── generateReflection.js     # Reflection generation
│   ├── search.js                 # Full-text knowledge search
│   ├── query.js                  # Question answering system
│   ├── timeline.js               # Chronological learning view
│   ├── analysis.js               # Deep analysis tools
│   ├── knowledge.js              # Knowledge navigation
│   ├── export-knowledge.js       # Basic knowledge base export
│   ├── enhanced-export-knowledge.js # Enhanced searchable export
│   ├── diffTree.js               # Memory tree comparison
│   ├── summarizeDiff.js          # Evolution summarization
│   └── utils.js                  # Shared utilities
├── data/                         # Learning data storage
│   ├── index/                    # Code pattern indices
│   │   ├── .gitkeep             # Directory structure preservation
│   │   ├── example_code_pattern_index.json # Example pattern index
│   │   └── unified_search_index.json # Unified search capabilities
│   ├── logs/                     # Session logs and exploration records
│   ├── reflections/              # Generated reflections and insights
│   ├── summaries/                # Session summaries
│   ├── memory/                   # Knowledge structure and evolution
│   ├── diffs/                    # Memory tree evolution tracking
│   └── commits/                  # Learning state snapshots
├── prompts/                      # System prompts and methodologies
│   ├── enhanced-prehook.md       # Enhanced development workflow
│   └── legacy system guides/     # Legacy codebase exploration strategies
├── knowledge-bases/              # Exported shareable knowledge
├── exports/                      # Enhanced knowledge exports
└── .gitignore                   # Security and privacy protection
```

## 🔧 CLI Commands Reference

### Code Discovery Commands
- **`code-search [keywords...]`** - **UNIFIED SEARCH** across code patterns AND knowledge
  ```bash
  node cli/index.js code-search "authentication session"
  node cli/index.js code-search "database connection legacy"
  node cli/index.js code-search "mvc controller routing"
  ```

- **`build-code-index`** - Build/rebuild code pattern index for current workspace
  ```bash
  node cli/index.js build-code-index
  ```

- **`code-stats`** - Show pattern index statistics and discovered keywords
  ```bash
  node cli/index.js code-stats
  ```

### Knowledge Search Commands
- **`search <term>`** - Search across all learning data
  ```bash
  node cli/index.js search "async patterns"
  ```

- **`query <question>`** - Ask intelligent questions
  ```bash
  node cli/index.js query "How do I handle errors in this legacy system?"
  ```

### Analysis Commands
- **`timeline`** - View learning progression
  ```bash
  node cli/index.js timeline
  ```

- **`principles [--filter <term>]`** - Extract core principles
  ```bash
  node cli/index.js principles
  node cli/index.js principles --filter "security"
  ```

- **`contradictions`** - Find conflicting ideas
  ```bash
  node cli/index.js contradictions
  ```

- **`insights [--domain <area>]`** - Surface key insights
  ```bash
  node cli/index.js insights
  node cli/index.js insights --domain "authentication"
  ```

### Deep Analysis
- **`analyze <topic>`** - Comprehensive topic analysis
  ```bash
  node cli/index.js analyze "authentication patterns"
  ```

- **`compare <session1> <session2>`** - Compare sessions
  ```bash
  node cli/index.js compare "session_12.md" "session_13.md"
  ```

### Learning Management
- **`reflect <logFile>`** - Generate reflections from session logs
  ```bash
  node cli/index.js reflect data/logs/session_exploration.md
  ```

- **`diff <oldFile> <newFile>`** - Compare memory tree versions
  ```bash
  node cli/index.js diff data/memory/old_tree.md data/memory/new_tree.md
  ```

- **`summarize <diffFile>`** - Summarize knowledge evolution
  ```bash
  node cli/index.js summarize data/diffs/tree_diff_12345.md
  ```

- **`commit <message>`** - Save learning state
  ```bash
  node cli/index.js commit "Discovered authentication patterns in legacy system"
  ```

- **`status`** - View system status
  ```bash
  node cli/index.js status
  ```

### Knowledge Export
- **`knowledge-base`** - Interactive knowledge export
  ```bash
  node cli/index.js knowledge-base
  ```

- **`searchable-knowledge-base`** - Enhanced searchable export
  ```bash
  node cli/index.js searchable-knowledge-base
  ```

- **`export [--format <format>]`** - Export in various formats
  ```bash
  node cli/index.js export --format json
  node cli/index.js export --format markdown
  ```

## 🧠 Learning Methodology

The Organic Learning Agent follows systematic principles for legacy codebase intelligence:

### 1. **Code Pattern Discovery**
- **Automatic Indexing**: Scans codebases to identify recurring patterns, architectural decisions, and implementation strategies
- **Keyword Mapping**: Creates searchable indices linking domain concepts to concrete code examples
- **Framework Detection**: Recognizes custom frameworks, legacy patterns, and architectural styles

### 2. **Intelligence Building**
- **Pattern Recognition**: Identifies common themes, anti-patterns, and architectural decisions across systems
- **Contextual Learning**: Builds understanding of how different components interact and depend on each other
- **Evolution Tracking**: Monitors how your understanding of the system evolves over time

### 3. **Knowledge Integration**
- **Unified Search**: Combines code pattern discovery with knowledge content for comprehensive exploration
- **Cross-Reference Mapping**: Links architectural decisions to their implementations in the codebase
- **Cumulative Intelligence**: Each exploration builds on previous discoveries across multiple systems

### 4. **Privacy-First Approach**
- **Local Processing**: All analysis happens on your machine without external dependencies
- **Automatic Sanitization**: Removes sensitive information when sharing knowledge
- **Selective Export**: Choose what knowledge to share while keeping sensitive patterns private

## 🎯 Use Cases

### Legacy System Reverse Engineering
- **Rapid Architecture Understanding**: Quickly map unknown system components and their relationships
- **Pattern Documentation**: Extract and document recurring patterns for team knowledge sharing
- **Framework Discovery**: Identify custom frameworks and architectural conventions
- **Migration Planning**: Understand current system before planning modernization efforts

### Team Knowledge Building
- **Onboarding Acceleration**: Help new team members understand complex legacy systems faster
- **Knowledge Transfer**: Capture departing team members' system knowledge
- **Pattern Libraries**: Build searchable libraries of organizational coding patterns
- **Architecture Documentation**: Generate living documentation from code exploration

## 🔒 Security Features

- **Learning Data Protection**: Comprehensive `.gitignore` prevents accidental commits of sensitive learning artifacts
- **Credential Sanitization**: Automatic removal of API keys, passwords, tokens, and other sensitive data
- **PII Protection**: Personal information is filtered from exports and knowledge bases
- **Local Processing**: All code analysis and pattern discovery happens locally without external dependencies
- **Selective Sharing**: Choose exactly what knowledge to export while keeping sensitive patterns private
- **Safe Pattern Extraction**: Extracts architectural patterns without exposing proprietary business logic

## 💡 Example: Legacy System Exploration

### Scenario: Understanding an Unknown PHP/MySQL System

```bash
# 1. Start by building a code pattern index
node cli/index.js build-code-index

# 2. Explore authentication patterns
node cli/index.js code-search "authentication login session"

# Results show:
# - src/auth/UserAuth.php:45 - Legacy MD5 authentication
# - includes/session.inc.php:12 - Session management
# - lib/Database.class.php:23 - Database connections

# 3. Find database patterns
node cli/index.js code-search "database mysql connection query"

# 4. Document discoveries in a reflection
node cli/index.js reflect data/logs/php_system_exploration.md

# 5. Ask questions about what you found
node cli/index.js query "What security issues did we discover in the authentication system?"

# 6. Export knowledge for team sharing
node cli/index.js searchable-knowledge-base
```

### Code Pattern Index Example

The system automatically generates structured indices like this:

```json
{
  "patterns": {
    "authentication_system": {
      "description": "Legacy authentication and session management patterns",
      "files": [
        {
          "path": "src/auth/UserAuth.php",
          "line": 45,
          "snippet": "class UserAuth {\n    public function authenticate($username, $password) {\n        $hashedPassword = md5($password . SALT);\n        return $this->validateCredentials($username, $hashedPassword);\n    }\n}"
        }
      ],
      "keywords": ["authentication", "session", "login", "security", "user_auth"]
    }
  }
}
```

## 🛠 Development

### Adding New CLI Commands
1. Create a new file in the `cli/` directory following existing patterns
2. Export a function that handles the command logic with proper error handling
3. Add the command to `cli/index.js` with appropriate arguments and options
4. Update this README with documentation and examples
5. Test the command with various edge cases

### Adding New Code Pattern Detectors
1. Extend `cli/codeSearch.js` with new pattern recognition logic
2. Add pattern categories to the index structure
3. Include relevant keywords for searchability
4. Test with different legacy codebase types

### Data Structure
- **Code Indices**: Structured JSON mapping keywords to code patterns with file paths and line numbers
- **Logs**: Raw session data and exploration records
- **Reflections**: Processed insights and architectural discoveries
- **Summaries**: Condensed session overviews with key patterns identified
- **Memory Tree**: Hierarchical knowledge organization tracking understanding evolution
- **Unified Search**: Combined indices for both code patterns and knowledge content

### Testing Legacy Systems
The tool has been tested with:
- **Legacy PHP/MySQL systems** with custom MVC frameworks
- **Zend Framework 1.x applications** with complex module structures
- **Legacy JavaScript applications** with custom libraries
- **Custom template engines** and routing systems
- **Legacy AJAX endpoints** and session management

## 🤝 Contributing

Contributions are welcome! Please ensure:
- New features include comprehensive documentation with examples
- Security measures are maintained for sensitive data protection
- CLI commands follow established patterns with proper error handling
- Code pattern detection works across different legacy system types
- Knowledge export maintains privacy and sanitization standards

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Acknowledgments

Built with the philosophy that legacy systems contain valuable architectural knowledge that should be systematically captured, understood, and shared. Every legacy codebase tells a story of decisions, constraints, and solutions that can inform future development.

---

*Transform mysterious legacy codebases into navigable, searchable intelligence with the Organic Learning Agent.* 🚀
