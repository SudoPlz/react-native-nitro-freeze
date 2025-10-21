# Architecture Documentation

## Overview

`react-native-nitro-freeze` is a drop-in replacement for `react-freeze` that works without Suspense, designed specifically for React Native's Fabric architecture and bridgeless mode.

## Core Principles

1. **No Suspense** - Uses React.memo instead of Suspense boundaries
2. **No Unmounting** - Components stay mounted, state preserved
3. **Native Optimizations** - Platform-specific performance boosts
4. **Proper Nesting** - Parent freeze cascades to children correctly

## Component Architecture

### 1. Freeze Component (`src/Freeze.tsx`)

The main component uses a multi-layered approach:

```
React.memo (with custom comparator)
  └─> FreezeContext.Provider
       └─> View (with conditional styles)
            └─> children
```

**Key Mechanisms:**

- **React.memo comparator**: Returns `true` when both prev and next are frozen, preventing reconciliation
- **FreezeContext**: Propagates frozen state to descendants
- **View wrapper**: Applies `opacity: 0` and `pointerEvents: 'none'` when frozen
- **Native ref**: Passes view reference to native module for platform-level optimizations

### 2. FreezeContext (`src/context.ts`)

Internal context for freeze state propagation:

```typescript
interface FreezeContextValue {
  isFrozen: boolean;
}
```

**Nesting Logic:**

```typescript
const effectiveFreeze = parentContext.isFrozen || freeze;
```

This ensures:
- If parent is frozen → all children are frozen
- If parent is unfrozen but child has freeze={true} → only that subtree is frozen

### 3. Native Module Integration

#### iOS (`ios/RNNitroFreezeModule.mm`)

When a view is frozen:
```objc
view.userInteractionEnabled = NO;
view.hidden = YES;
view.layer.speed = 0.0;  // Pause animations
view.layer.timeOffset = pausedTime;  // Save animation state
```

When unfrozen:
```objc
view.userInteractionEnabled = YES;
view.hidden = NO;
view.layer.speed = 1.0;  // Resume animations
// Restore animation timeline
```

#### Android (`android/.../RNNitroFreezeModule.kt`)

When frozen:
```kotlin
view.visibility = View.INVISIBLE
view.setWillNotDraw(true)
view.isEnabled = false
view.animate().cancel()
```

When unfrozen:
```kotlin
view.visibility = View.VISIBLE
view.setWillNotDraw(false)
view.isEnabled = true
```

### 4. FreezeProfiler (`src/FreezeProfiler.tsx`)

Performance measurement using React Profiler API:

```
<Profiler id="Parent">        // Measures wrapper overhead
  <Freeze freeze={...}>
    <Profiler id="Child">     // Measures child render time
      {children}
    </Profiler>
  </Freeze>
</Profiler>
```

**Metrics Tracked:**
- Parent/child render times (current + cumulative)
- Render counts
- Average render times
- Freeze effectiveness (childRenderTime === 0 when frozen)

## Data Flow

### Freeze State Propagation

```
User sets freeze={true}
  ↓
React.memo comparator returns true
  ↓
No re-render triggered (reconciliation skipped)
  ↓
FreezeContext maintains isFrozen=true
  ↓
Child components check context
  ↓
Children also skip rendering
```

### Native Integration Flow

```
freeze prop changes
  ↓
useEffect detects change
  ↓
setViewFrozen(ref, frozen) called
  ↓
findNodeHandle gets native tag
  ↓
Native module applies platform optimizations
  ↓
View becomes invisible & non-interactive
```

## Performance Characteristics

### When Frozen

- ✅ **No JavaScript execution** in subtree (memo prevents reconciliation)
- ✅ **No native layout** (view hidden, drawing disabled)
- ✅ **No event handling** (pointerEvents: 'none')
- ✅ **No animations** (layer.speed = 0 on iOS, canceled on Android)
- ✅ **Minimal memory** (no new allocations)

### When Unfrozen

- ⚡ **Instant resume** (state preserved, just re-enable rendering)
- ⚡ **No remounting cost** (component stayed in tree)
- ⚡ **Animations resume** (timeline restored, not restarted)

## Nesting Scenarios

### Scenario 1: Parent Frozen

```tsx
<Freeze freeze={true}>           // Parent frozen
  <Child1 />                      // Frozen (parent override)
  <Freeze freeze={false}>         // Also frozen (parent override)
    <Child2 />                    // Frozen (grandparent override)
  </Freeze>
</Freeze>
```

### Scenario 2: Child Frozen

```tsx
<Freeze freeze={false}>          // Parent unfrozen
  <Child1 />                     // Active
  <Freeze freeze={true}>         // Child frozen
    <Child2 />                   // Frozen (parent is frozen)
  </Freeze>
  <Child3 />                     // Active (sibling unaffected)
</Freeze>
```

### Scenario 3: Multiple Children

```tsx
<Freeze freeze={false}>
  <Freeze freeze={true}>         // Frozen
    <A />
  </Freeze>
  <Freeze freeze={false}>        // Active
    <B />
  </Freeze>
  <Freeze freeze={true}>         // Frozen
    <C />
  </Freeze>
</Freeze>
```

## Comparison with react-freeze

| Aspect | react-freeze | react-native-nitro-freeze |
|--------|-------------|---------------------------|
| **Mechanism** | Suspense boundary + offscreen mode | React.memo + context |
| **Unmounting** | Suspends (partially unmounts) | Never unmounts |
| **State** | Preserved via Suspense | Preserved via memo |
| **Fabric** | Limited support | Full support |
| **Bridgeless** | Not supported | Fully supported |
| **Native opts** | None | iOS + Android |
| **Profiling** | External only | Built-in FreezeProfiler |

## Trade-offs

### Advantages

1. No Suspense dependency (works everywhere)
2. Native-level optimizations
3. Better Fabric compatibility
4. Built-in performance metrics
5. Simpler mental model (memo vs Suspense)

### Limitations

1. Requires View wrapper (adds one node to hierarchy)
2. Native module adds small bundle size
3. Opacity-based hiding (not true offscreen rendering)

## Future Enhancements

1. **True JSI NitroModule** - Current implementation uses bridge, could use pure JSI
2. **Automatic AppState integration** - Freeze on background
3. **DevTools overlay** - Visual indicator of frozen subtrees
4. **Gesture handler integration** - Automatically pause gestures
5. **Worklet support** - Freeze detection in Reanimated worklets

