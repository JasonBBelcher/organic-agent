# Code Pattern Search Usage Examples

## Basic Setup

1. **Configure workspace paths** (edit `data/config/workspace_paths.json`):
```json
{
  "workspacePaths": [
    ".",
    "./src", 
    "./app",
    "./lib"
  ]
}
```

2. **Build the search index**:
```bash
node cli/index.js build-code-index
```

3. **Search for patterns**:
```bash
node cli/index.js code-search "mvc controller"
node cli/index.js code-search "data repository validation"
```

## Search Examples

### Finding MVC Controllers
```bash
$ node cli/index.js code-search "mvc controller"
✅ Found 15 matching files:
1. 📁 example-app/app/Controllers/UserController.php
   📊 Score: 87.0 | Keywords: mvc_controller, input_validator
```

### Locating Repository Patterns
```bash
$ node cli/index.js code-search "data repository"
1. 📁 example-app/app/Repositories/UserRepository.php  
   📊 Score: 76.0 | Keywords: data_repository, database_query
```

### Finding Service Layer
```bash
$ node cli/index.js code-search "business service"
1. 📁 example-app/app/Services/PaymentService.php
   📊 Score: 65.0 | Keywords: business_service, object_factory
```

### API Endpoint Discovery
```bash
$ node cli/index.js code-search "api endpoint"
1. 📁 example-app/routes/api.php
   📊 Score: 54.0 | Keywords: api_endpoint, url_route
```

### Test Pattern Location
```bash
$ node cli/index.js code-search "unit test"
1. 📁 example-app/tests/Unit/UserControllerTest.php
   📊 Score: 43.0 | Keywords: unit_test, test_mock
```

## AI Agent Integration

When your knowledge base lacks specific implementation details, use these contextual search terms:

- `mvc_controller` - Find controller class implementations
- `data_repository` - Locate repository pattern examples  
- `business_service` - Find service layer implementations
- `object_factory` - Factory pattern examples
- `api_endpoint` - API route and handler patterns
- `input_validator` - Validation logic implementations
- `database_migration` - Database schema examples
- `unit_test` - Testing pattern implementations

## Custom Configuration

Create project-specific domain terms by editing the configuration:

```json
{
  "domainTerms": {
    "GraphQL": "graphql_resolver",
    "WebSocket": "websocket_handler", 
    "Docker": "container_config",
    "JWT": "token_authentication"
  },
  "domainBoosts": {
    "graphql": 15,
    "websocket": 12,
    "docker": 8,
    "jwt": 8
  }
}
```

This allows you to search for framework-specific patterns:
```bash
node cli/index.js code-search "graphql resolver"
node cli/index.js code-search "websocket handler"
```

## Multi-Project Workspace

For monorepos or multi-project setups:

```json
{
  "workspacePaths": [
    "./frontend/src",
    "./backend/app", 
    "./shared/lib",
    "../common-components"
  ]
}
```

The system will search across all specified paths and provide workspace context in results.
