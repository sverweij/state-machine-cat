# GitHub Copilot Instructions for state-machine-cat

These instructions guide GitHub Copilot on how to generate and modify code for the `state-machine-cat` project.

## Core Concepts

State Machine Cat is a tool for visualizing state charts. It parses state machine descriptions and renders them as diagrams.

## Code Structure & Conventions

- **TypeScript/ESM Module System:** Use `.mts` file extension for TypeScript files
- **Import Style:**
  - Use `import { x } from "node:module";` for Node.js built-ins
  - Use `import x from "#subfolder/module.mjs";` for internal imports (using the `#` prefix)
  - Use `import type { IType } from "types/file.mjs";` for types
  
- **Formatting:**
  - Use double quotes for strings
  - Use semicolons at statement ends
  - Use trailing commas in multi-line expressions
  
- **TypeScript:** Use strict typing with TypeScript interfaces prefixed with `I` (e.g., `IStateMachine`)

## Writing Tests

Tests must be created for all new functionality using Mocha and Node's assert module.

### Test Structure

```typescript
import { deepEqual, equal, throws } from "node:assert/strict";
import myFunction from "#my-module.mjs";

describe("my feature", () => {
  it("should do something specific", () => {
    equal(myFunction("input"), "expected output");
  });
  
  it("should throw on invalid input", () => {
    throws(() => myFunction(null), /Error message pattern/);
  });
});
```

### Test File Naming
- Place tests in the `/test` directory mirroring the source structure
- Name test files with `.spec.mts` extension (e.g., `src/parse/index.mts` → `test/parse/index.spec.mts`)

## Parser Generation

- Parser files are generated from `.peggy` grammar files in the `src/parse` directory
- The build process (`npm run build`) handles parser generation using the Peggy parser generator

## Type Declarations

- Use interfaces for complex types
- Prefix interfaces with `I` (e.g., `IStateMachine`, `IRenderOptions`)
- Place type definitions in the `/types` directory or alongside their implementation

## Common Patterns

### Error Handling

- Use specific error messages
- Prefer throwing errors with detailed messages rather than returning error codes
- Use try/catch blocks for recoverable errors

### Function Documentation

Document functions with JSDoc-style comments:

```typescript
/**
 * Processes a state machine and returns a transformed version
 *
 * @param {IStateMachine} pStateMachine - The input state machine
 * @param {IOptions} pOptions - Processing options
 * @returns {IStateMachine} The transformed state machine
 * @throws {Error} When the input is invalid
 */
```

## Workflow for Adding Features

1. Add tests first in the appropriate test file
2. Implement the feature in the source files
3. Run tests with `npm test` to verify functionality
4. Update any relevant documentation

## Import Examples

```typescript
// Import from Node.js built-ins - use node: protocol
import { deepEqual } from "node:assert/strict";

// Import internal modules - use #* pattern
import parser from "#parse/index.mjs";

// Import types
import type { IStateMachine } from "types/state-machine-cat.mjs";
```

## Common Commands

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:cover

# Build the project
npm run build
```

When generating code, always:
1. Follow the existing code style
2. Add appropriate type annotations
3. Include tests for new functionality
4. Follow the ESM import/export pattern 
5. Use descriptive variable names (Hungarian notation for parameters: pName)
