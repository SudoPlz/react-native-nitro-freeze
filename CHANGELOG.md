# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-21

### Added

- Initial release of react-native-nitro-freeze
- Main `<Freeze>` component with react-freeze compatible API
- `<FreezeProfiler>` component for performance measurement
- Native iOS module with animation pause and interaction disabling
- Native Android module with drawing optimization and visibility control
- Proper nesting support (parent freeze cascades to children)
- FreezeContext for internal state propagation
- `useIsFrozen()` hook for advanced use cases
- Full TypeScript support with strict mode
- Fabric and bridgeless mode compatibility
- Example app demonstrating all features
- Comprehensive documentation

### Features

- No Suspense dependency - works with all React versions
- Native-level optimizations for iOS and Android
- Zero-copy performance when frozen (no reconciliation)
- Instant resume when unfrozen
- State preservation across freeze/unfreeze cycles
- Built-in performance profiling
- Minimal bundle size impact

### Platform Support

- iOS ≥ 13.0
- Android minSdkVersion ≥ 21
- React Native ≥ 0.78.0
- React ≥ 19.0.0

