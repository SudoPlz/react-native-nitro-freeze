# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-22

### Added

- Initial release of react-zombie-freeze
- Main `<Freeze>` component with react-freeze compatible API
- `<FreezeProfiler>` component for performance measurement
- `useIsFrozen()` hook for conditional logic
- `hideContent` prop to control visibility when frozen
- React Native patch for core-level state update blocking
- Proper nesting support (parent freeze cascades to children)
- FreezeContext for internal state propagation
- Full TypeScript support with strict mode
- Fabric and bridgeless mode compatibility
- Example app demonstrating all features
- Comprehensive documentation

### Features

- No Suspense dependency - works with all React versions
- Zero native code - pure JavaScript/TypeScript implementation
- React Native patch blocks state updates at core level
- Zero-copy performance when frozen (no reconciliation)
- Instant resume when unfrozen
- State preservation across freeze/unfreeze cycles
- Built-in performance profiling
- Minimal bundle size impact (~3KB)
- Content stays visible by default (perfect for animations)

### Platform Support

- React Native ≥ 0.78.0 (Fabric required)
- React ≥ 19.0.0
- iOS (via React Native)
- Android (via React Native)

