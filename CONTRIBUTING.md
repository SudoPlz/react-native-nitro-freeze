# Contributing to react-native-nitro-freeze

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/react-native-nitro-freeze.git
cd react-native-nitro-freeze
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
react-native-nitro-freeze/
├── src/                    # TypeScript source code
│   ├── Freeze.tsx         # Main Freeze component
│   ├── FreezeProfiler.tsx # Performance profiling component
│   ├── context.ts         # FreezeContext implementation
│   ├── hooks.ts           # Helper hooks
│   ├── native/            # Native module interface
│   └── index.ts           # Public API exports
├── ios/                   # iOS native code
│   ├── RNNitroFreezeModule.h
│   └── RNNitroFreezeModule.mm
├── android/               # Android native code
│   └── src/main/java/com/margelo/nitrofreeze/
│       ├── RNNitroFreezeModule.kt
│       └── RNNitroFreezePackage.kt
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

## Questions?

Open an issue if you have questions or need help!

