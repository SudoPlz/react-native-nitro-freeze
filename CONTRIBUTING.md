# Contributing to react-zombie-freeze

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/react-zombie-freeze.git
cd react-zombie-freeze
```

2. Install dependencies:
```bash
yarn install
```

3. Set up the example app:
```bash
cd example
yarn install
```

4. Run the example app:
```bash
# iOS
yarn ios

# Android
yarn android
```

## Project Structure

```
react-zombie-freeze/
├── src/                    # TypeScript source code
│   ├── Freeze.tsx         # Main Freeze component
│   ├── FreezeProfiler.tsx # Performance profiling component
│   ├── context.ts         # FreezeContext implementation
│   └── index.ts           # Public API exports
├── docs/                  # Documentation
│   ├── FINAL_ARCHITECTURE.md
│   └── FREEZE_DEBUG.md
├── example/               # Example React Native app
└── README.md
```

## Making Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Test your changes in the example app

4. Run linting:
```bash
yarn lint
yarn typescript
```

5. Commit your changes:
```bash
git commit -m "Description of changes"
```

6. Push and create a pull request

## Code Style

- Follow the existing code style
- Use TypeScript strict mode
- Add JSDoc comments for public APIs
- Keep files focused and modular

## Testing

Before submitting a PR:

1. Test on both iOS and Android
2. Test with Fabric enabled
3. Test nested freeze scenarios
4. Verify performance improvements with FreezeProfiler
5. Ensure React Native patch is applied and working
6. Test state update blocking (setState should not execute when frozen)

## Questions?

Open an issue if you have questions or need help!

