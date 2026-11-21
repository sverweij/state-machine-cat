# GitHub Copilot Instructions for state-machine-cat

Meant for both humans and agents.

## Invariants

- before proposing/ committing code `node --run=check` MUST ALWAYS pass without errors.
- fix formatting issues with `node --run=format`
- fix auto-fixable linting issues with `node --run=lint:fix`
- if there's a need to run targeted tests e.g. in a fix-verify loop use `node --run=test -- -f "title of the test"`
- Add appropriate type annotations

## Core Concepts

State Machine Cat is a tool for visualizing state charts. It parses state machine descriptions and renders them as diagrams.

## Code Structure & Conventions

- Use `.mts` file extension for TypeScript files.
- Tests must be created for all new functionality using Mocha and node:assert/strict.
- Place tests in the `/test` directory mirroring the source structure
- Name test files with `.spec.mts` extension (e.g., `src/parse/index.mts` → `test/parse/index.spec.mts`)
- Parser files are generated from `.peggy` grammar files in the `src/parse` directory
- The build process (`node --run=build`) handles parser generation using the Peggy parser generator
- Use interfaces for complex types
- Prefix interfaces with `I` (e.g., `IStateMachine`, `IRenderOptions`)
- Place type definitions in the `/types` directory or alongside their implementation

## Git

- ALWAYS postfix commit messages with `[AI]`.
- ALWAYS include user prompt in the commit body in markdown code block. NEVER include secrets, PII, or proprietary prompt content.

## GitHub PR

- If the user asks you to open a GitHub PR; ALWAYS add the phrase "I am an AI. Gort says hello." to the `## AI disclosure` PR description section and  
  ALWAYS follow the instructions in the [Invariants](#invariants) sections above.

<!-- rtk-instructions v2 -->

## RTK — Token-Optimized CLI

**rtk** is a CLI proxy that filters and compresses command outputs, saving 60-90% tokens.

### Rule

Always prefix shell commands with `rtk`:

```bash
# Instead of:              Use:
git status                 rtk git status
git log -10                rtk git log -10
cargo test                 rtk cargo test
docker ps                  rtk docker ps
kubectl get pods           rtk kubectl get pods
```

### Meta commands (use directly)

```bash
rtk gain              # Token savings dashboard
rtk gain --history    # Per-command savings history
rtk discover          # Find missed rtk opportunities
rtk proxy <cmd>       # Run raw (no filtering) but track usage
```

<!-- /rtk-instructions -->
