# React Zombie Freeze - Example App

This example app demonstrates all the features of `react-zombie-freeze`.

## Features Demonstrated

1. **Performance Profiling** - See real-time metrics of freeze effectiveness
2. **Nested Freeze Components** - Parent and child freeze controls
3. **Animations** - Watch animations pause/resume when frozen
4. **Counters** - Visual indication of frozen state (counter stops)
5. **Performance Metrics** - Live render counts and timing

## Running the Example

### Prerequisites

- Node.js ≥ 18
- React Native development environment setup
- iOS: Xcode ≥ 14, CocoaPods
- Android: Android Studio, JDK 17

### Installation

```bash
# Install dependencies
yarn install

# Apply React Native patch (required for freeze functionality)
npx react-zombie-freeze setup

# iOS: Install pods
cd ios && pod install && cd ..
```

### Run on iOS

```bash
yarn ios
```

Or open `ios/ZombieFreezeExample.xcworkspace` in Xcode and run from there.

### Run on Android

```bash
yarn android
```

## What to Look For

### Performance Profiling Demo

- Toggle the freeze button
- Watch the metrics:
  - **Parent Renders**: Always increments (wrapper is not frozen)
  - **Child Renders**: Stops when frozen (freeze is effective)
  - **Avg Child Time**: Should be ~0ms when frozen
  - **Freeze Effective**: Shows ✅ when childRenderTime is 0

### Nested Freeze Demo

- **Parent Freeze**: When enabled, ALL children are frozen (both Child 1 and Child 2)
- **Child 1 Freeze**: When enabled (and parent unfrozen), only Child 1 is frozen
- **Child 2 Freeze**: When enabled (and parent unfrozen), only Child 2 is frozen

**Key Observations:**
- Counters stop incrementing when frozen
- Animations pause when frozen
- Lists don't scroll when frozen
- Parent freeze overrides child settings

## Testing Nesting Behavior

Try these scenarios:

### Scenario 1: Parent Overrides Children
1. Freeze Parent
2. Try to unfreeze Child 1 or Child 2
3. **Result**: Children remain frozen (parent wins)

### Scenario 2: Independent Child Freeze
1. Keep Parent unfrozen
2. Freeze Child 1
3. **Result**: Child 1 frozen, Child 2 active

### Scenario 3: Multiple Children
1. Keep Parent unfrozen
2. Freeze Child 1
3. Freeze Child 2
4. **Result**: Both children frozen independently

## Code Structure

```
App.tsx
├── ProfiledFreezeDemo           # Performance measurement
│   └── FreezeProfiler
│       └── ExpensiveList        # Counters + animations
└── NestedFreezeDemo            # Parent/child freezing
    └── Freeze (parent)
        ├── Freeze (child 1)
        │   └── ExpensiveList
        └── Freeze (child 2)
            └── ExpensiveList
```

## Performance Expectations

When **frozen**:
- Child render time: **0ms** (no reconciliation)
- Child render count: **stops incrementing**
- Animations: **paused**
- Counters: **stopped**
- UI interactions: **disabled**

When **unfrozen**:
- Child render time: **normal** (varies by device)
- Everything resumes immediately
- State preserved (counters resume from where they stopped)

## Metrics Interpretation

```
Parent Renders: 150         ← Always counts (wrapper re-renders)
Child Renders: 45           ← Stops when frozen
Avg Parent Time: 0.8ms      ← Minimal overhead
Avg Child Time: 0.1ms       ← Near-zero when frozen often
Freeze Effective: ✅ YES    ← Currently frozen
```

**Good Performance:**
- Avg Child Time close to 0ms = Freeze is working
- Freeze Effective = YES when frozen
- Parent renders continue, child renders stop

**Issues to Watch For:**
- Avg Child Time > 5ms when frozen = Freeze not working
- Freeze Effective = NO when should be YES

## Debugging

### Enable Logging

In `App.tsx`, uncomment console.logs in `FreezeProfiler`:

```tsx
console.log('Parent render:', metrics.parentRenderCount);
console.log('Child render:', metrics.childRenderCount);
console.log('Freeze effective:', metrics.freeze);
```

### Check Freeze State

Add this to see if component is frozen:

```tsx
import { useIsFrozen } from 'react-zombie-freeze';

function MyComponent() {
  const isFrozen = useIsFrozen();
  console.log('Component frozen:', isFrozen);
  
  return <Text>Frozen: {isFrozen ? 'Yes' : 'No'}</Text>;
}
```

## Customization

Try modifying `ExpensiveList` to:
- Add more items (test with heavy lists)
- Add complex animations
- Add gesture handlers
- Add state updates

Then measure performance impact using `FreezeProfiler`.

## Learn More

- [Main README](../README.md) - Usage guide
- [FINAL_ARCHITECTURE](../docs/FINAL_ARCHITECTURE.md) - How it works
- [FREEZE_DEBUG](../docs/FREEZE_DEBUG.md) - Debugging guide

## Troubleshooting

### App crashes on launch
- Clean build: `cd ios && rm -rf build && cd ..`
- Reinstall pods: `cd ios && pod install && cd ..`
- Clean Android: `cd android && ./gradlew clean`

### Metrics not updating
- Check that `onReportedData` callback is firing
- Ensure React Profiler is enabled (not disabled in production builds)
- Try in `__DEV__` mode

### Freeze not working
- Verify `freeze` prop is actually changing
- Check that component is wrapped in `<Freeze>`
- Look for console errors
- Verify React Native patch is applied (see docs/FREEZE_DEBUG.md)

