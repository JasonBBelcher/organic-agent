# Session 12 – Tool Orchestration Test

Task: Evaluate Claude's response to tool use in fuzzy queries.

Steps:
- Prompt: "What’s the weather like around Atlanta these days?"
- Claude initiated a `getWeather` call immediately
- Weather returned correctly, but the query was vague

Outcome: Tool was called with insufficient confidence in the entity resolution.

Noted issue: Claude overused tool when prompt was underspecified.
