# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working
with code in this repository.

## Project Overview

This is a sophisticated Discord bot built on Py-Cord 2.6.1 implementing a
text-based RPG/MUD (Multi-User Dungeon) game with comprehensive async
patterns, robust data management, and extensive testing infrastructure.
The codebase features modular design, async-native architecture, and a
professional CLI interface for development and testing.

## Role and Interaction

Ultrathink and act as a senior software architect and developer
specializing in Python, and Pycord 2.6.1 in particular. Maintain a
friendly and professional demeanor while focusing on robust, maintainable
game development with excellent user experience.

## 🚨 AUTOMATED CHECKS ARE MANDATORY

**ALL hook issues are BLOCKING - EVERYTHING must be ✅ GREEN!**
No errors. No formatting issues. No linting problems. Zero tolerance.
These are not suggestions. Fix ALL issues before continuing.

## CRITICAL WORKFLOW - ALWAYS FOLLOW THIS

***You Must Use Test Drive Development (TDD) Methods***

### Research → Plan → Test → Implement → Update

**NEVER JUMP STRAIGHT TO CODING!** Always follow this sequence:

1. **Research**: Explore the codebase, understand existing patterns.
    - You must always research current best practices for framework,
      infrastructure, and app type using context7 and the web.
    - DO NOT RELY ON TRAINING DATA, LOOK FOR MOST RECENT DOCUMENTATION.
2. **Plan**: Create a detailed implementation plan and verify it with me
3. **Test**: Create Mock functionality tests first before creating final
   code. TDD principles require you to write a unit-level test case that
   fails, then write just enough code to make the test pass, then
   refactor both the test code and the production code, then repeat with
   another new test case until all desired functionality tests green.
4. **Implement**: Execute the plan with validation checkpoints.
5. **Validate**: Apply Code Quality and functionality tests
6. **Update**: Update PLAN.md and other relevant documentation
7. **Commit**: Add **all** changed files to git **including PLAN.md** and
   commit so they can be reverted if necessary

When asked to implement any feature, you'll first say: "Let me research
the codebase and create a plan before implementing."

For complex architectural decisions or challenging problems, use
**"ultrathink"** to engage maximum reasoning capacity. Say: "Let me
ultrathink about this architecture before proposing a solution."

### Reality Checkpoints

**Stop, audit, QA, and validate** at these moments:

- After implementing a complete feature
- Before starting a new major component
- When something feels wrong
- Before declaring "done"
- **WHEN HOOKS FAIL WITH ERRORS** ❌

> Why: You can lose track of what's actually working. These checkpoints
> prevent cascading failures.

### 🚨 CRITICAL: Hook Failures Are BLOCKING

**When hooks report ANY issues (exit code 2), you MUST:**

1. **STOP IMMEDIATELY** - Do not continue with other tasks
2. **FIX ALL ISSUES** - Address every ❌ issue until everything is ✅ GREEN
3. **VERIFY THE FIX** - Re-run the failed command to confirm it's fixed
4. **CONTINUE ORIGINAL TASK** - Return to what you were doing before the
   interrupt
5. **NEVER IGNORE** - There are NO warnings, only requirements

This includes:

- Formatting issues
- Linting violations
- Forbidden patterns
- Need to update documentation
- ALL other checks

**Recovery Protocol:**

- When interrupted by a hook failure, maintain awareness of your original
  task
- After fixing all issues and verifying the fix, continue where you left
  off
- Use the todo list to track both the fix and your original task

## Working Memory Management

### Maintain PLAN.md

```markdown
## Current Task
- [ ] What we're doing RIGHT NOW

## Completed  
- [x] What's actually done and tested

## Next Steps
- [ ] What comes next
```

## Implementation Standards

### Our code is complete when

- All tests pass 100% with absolutely 0 mock functionality or stubs
- Feature works end-to-end
- All implementations meet or exceed our **Code Quality** tests
- All implementations meet or exceed the metrics detailed in
    the **Development Code Standards** section
- All old and/or vestigial code is deleted

### **Security Always**

- Validate and sanitize all inputs
- Use crypto/rand for randomness
- Prepared statements for SQL (never concatenate!)

## Communication Protocol

### Progress Updates

```text
✓ Implemented authentication (all tests passing)
✓ Added rate limiting
✗ Found issue with token expiration - investigating
```

## Essential Commands

### Running the Application

$CLAUDE_PROJECT_DIRECTORY = /mnt/c/users/chibione/dropbox/rpgenerator/rpgenerator-new

***Virtual Environment is in: $CLAUDE_PROJECT_DIRECTORY/venv/***

```bash
# Discord bot (production)
./venv/bin/python3 main.py
```

### Testing

```bash
# Quick test validation
./venv/bin/python3 run_tests.py

# Standard pytest (requires dependencies)
./venv/bin/python3 -m pytest tests/
./venv/bin/python3 -m pytest tests/utils/game_objects/
./venv/bin/python3 -m pytest tests/integration/
```

### Code Quality

```bash
# Syntax validation
.claude/hooks/ci_pycord.sh
```

### Dependency Management

```bash
# Check dependencies
./venv/bin/python3 check_dependencies.py

# Install requirements
./venv/bin/pip install -r requirements.txt
```

## Architecture Overview

### Entry Points

- **main.py**: Discord bot production launcher with async lifecycle
  management
- **cli_main.py**: Rich CLI interface with comprehensive testing and
  administration tools

### Core System Architecture

```text
System Initialization (utils/system_init.py)
├── World Registry → Entity Registry → Item Registry
├── Character Manager → Faction Manager
├── Combat Manager → Corpse Cleanup → Spell System
└── Spawn Manager → Weather Manager → NPC Manager
```

### Data Management Layer

- **Pattern**: Interface-based with `DataManagerInterface` generic types
- **Backends**: JSON files (primary), Redis (caching), future database
  support
- **Registries**: Centralized singleton registries for entities, items,
  world elements
- **Persistence**: Async save operations with proper resource management

### Game Object Hierarchy

```text
World → Continents → Regions → Locations → Areas (gameplay locations)
Character/NPC/Monster (entities with inventory, equipment, stats)
Items (equipment, consumables, quest items with instance tracking)
```

### Discord Integration

- **Bot Client**: `src/rpgenerator/bot/client.py` with system manager
  attachment
- **Cogs**: Modular command structure in `src/rpgenerator/cogs/` directory
- **Modern UI**: Slash commands with autocomplete, embeds, views, and
  buttons
- **Rate Limiting**: Built-in Discord rate limiting with performance
  tracking

## Key Systems

### Combat System

- **Manager**: Singleton `CombatManager` handles all active encounters
- **Instances**: Individual `CombatInstance` with action queues
- **Multi-target**: Area effects and spell targeting support
- **Turn-based**: D&D-style initiative system with async processing

### Magic System

- **Spell Data**: JSON-based spell definitions in
  `src/rpgenerator/data/spells.json`
- **Spell Slots**: D&D-style casting limitations
- **Effects Engine**: Pluggable spell effects system
- **Concentration**: Spell maintenance mechanics
- **Autocomplete**: Intelligent spell/target selection

### Character System

- **Classes/Species**: JSON definitions in
  `src/rpgenerator/data/classes/` and `src/rpgenerator/data/species/`
- **Equipment**: Full inventory and equipment management
- **Progression**: Level-up system with XP tracking
- **Factions**: Reputation and relationship system

## Testing Framework

### Test Categories

- **Unit Tests**: `tests/utils/` - Individual system testing with mocks
- **Integration Tests**: `tests/integration/` - Multi-system workflows
- **CLI Tests**: `src/rpgenerator/cli/test_scenarios.py` - Automated test
  suites
- **Performance Tests**: Stress testing with large datasets
- **Security Tests**: Input validation and privilege escalation testing

### Test Execution

- **Quick Validation**: `./venv/bin/python3 run_tests.py`
- **Comprehensive**: `./venv/bin/python3 cli_main.py test run`
- **Specific Systems**: `./venv/bin/python3 cli_main.py test run
  --category <system>`
- **Mock-heavy**: Proper Discord object mocking for isolation

## Development Patterns

### Async Patterns

- **Event-driven**: Discord events drive game state changes
- **Task Management**: Background tasks for cleanup, spawning, weather
- **Queue Processing**: Combat actions and system events
- **Context Managers**: Proper resource lifecycle management

### Architectural Patterns

- **Singleton**: System managers with coordinated initialization
- **Registry**: Centralized lookups for world elements, entities, items
- **Command**: Encapsulated action objects with undo/replay capability
- **Observer**: Event callbacks with loose coupling

### Data Patterns

- **Interface-driven**: Abstract base classes for extensibility
- **Factory**: Object creation and registration patterns
- **JSON Configuration**: External data management
- **Dependency Injection**: Clean system initialization via `system_init.py`

## Important File Locations

### Configuration

- `src/rpgenerator/config/settings.py` - Main application settings
- `src/rpgenerator/config/logging_config.py` - Logging setup and
  configuration
- `pyproject.toml` - Project metadata and tool configuration
- `pytest.ini` - Test configuration

### Data Files

- `src/rpgenerator/data/` - All game data (JSON format)
  - `areas.json`, `characters.json`, `items.json` - Core game data
  - `classes/`, `species/` - Character creation data
  - `spells.json`, `monsters.json` - Game content

### Key Utilities

- `src/rpgenerator/utils/system_init.py` - Critical system initialization
- `src/rpgenerator/utils/game_objects/` - Core game object implementations
- `src/rpgenerator/utils/data/` - Data management interfaces and
  implementations
- `src/rpgenerator/utils/combat/` - Combat system implementation

## Development Guidelines

- KISS *(Keep It Simple, Stupid)*
- YAGNI principles *(You Aren't Going To Need it)*
- SOLID principles
  - *Single responsibility principle*
  - *Open–closed principle*
  - *Liskov substitution principle*
  - *Interface segregation principle*
  - *Dependency inversion principle*

### Development Code Quality

- All code must pass `.claude/hooks/ci_pycord` syntax checks
- Follow async patterns throughout - avoid blocking operations
- Maintain proper error handling and logging > 90%
- *Strictly typed* variables and returned values
- Cyclomatic complexity < 10%
- Maximal modularity
- Full end-to-end functionality
- Professional quality code and architecture
- Informative docstrings
- Comments explain intent, not functionality

### Testing Requirements

- Run `./venv/bin/python3 run_tests.py` before committing changes
- Use CLI test interface for comprehensive validation
- Mock Discord objects properly in tests
- Ensure test isolation with singleton resetting

### Adding New Features

1. Update relevant JSON data files in `src/rpgenerator/data/`
2. Implement core logic in appropriate `src/rpgenerator/utils/`
   subdirectory
3. Add Discord commands in relevant `src/rpgenerator/cogs/` file
4. Create comprehensive tests in `tests/` structure
5. Update CLI interface if needed in `cli_main.py`

### System Dependencies

- **Required**: py-cord, python-dotenv, redis, pytest, rich, typer
- **Optional**: flake8 (for advanced linting)
- **Development**: pytest-asyncio, pytest-mock for testing, pydantic

## CLI Interface

The CLI provides comprehensive testing and administration capabilities:

- Character management: creation, inspection, modification
- Combat simulation: encounter setup and testing
- World exploration: area navigation and inspection
- Item management: equipment and inventory operations
- Game state management: save/load operations
- Testing utilities: automated test execution with rich reporting

## Tools

The following tool is exposed via MCP by running `retrieve_context_mcp.py`:

### `search`

#### Signature

```python
search(prompt: string) → { snippets: string[] }
```

Description
Performs a semantic similarity search over your project's Chroma vector DB
which contains an index of the codebase and documentation, returning up to
~1,000 tokens worth of the most relevant text snippets (filtered by a 0.35
similarity threshold). The database is updated as you read, edit/multiedit,
and write files. If no results return, it is possibly due to the relevant
files not yet being indexed. A find/grep may still be necessary in these
cases.

- The MCP provides semantic search over your project codebase and
  documentation
- It returns up to ~1,000 tokens of relevant snippets
- It's best used when you need to find existing code patterns,
  documentation, or understand how systems work
- Results are filtered by similarity threshold, so broad queries work
  better than very specific ones

### Usage Examples

```text
Agent-style invocation

Thought: I need context on API key rotation
Action: search
Action Input: {"prompt":"How do I rotate API keys safely?"}
Observation: {"snippets":[
  "To rotate your API keys, first generate a new key pair…",
  "Update your client config to use the new key…"
]}
```

### Direct call from code / REPL

```python
from mcp import Client
cli = Client(name="retrieve_context")
resp = cli.search(prompt="OAuth flow diagram")
print(resp["snippets"])
```

### Shell / stdio transport

```bash
echo '{"prompt":"database connection pooling"}' \
  | python retrieve_context_mcp.py
# → {"snippets":[
#    "In your .env file set DATABASE_URL…",
#    "Use SQLAlchemy's create_engine(..., pool_size=10)…"
# ]}
```

### Empty‑prompt edge case

```text
> search(prompt="")
{"snippets":[]}
```

Use `./venv/bin/python3 src/cli/cli_main.py --help` to explore all
available commands and options.
