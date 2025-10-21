# react-native-nitro-freeze

A drop-in replacement for [react-freeze](https://github.com/software-mansion/react-freeze) that works **without Suspense**. Fully compatible with React Native's **Fabric** and **bridgeless mode** (React Native ≥ 0.78).

## Features

✅ **No Suspense** - Works without React Suspense or lazy loading  
✅ **Fabric & Bridgeless Compatible** - Built for modern React Native  
✅ **Native Optimizations** - NitroModule-powered for maximum performance  
✅ **Proper Nesting** - Parent freeze propagates to children correctly  
✅ **Performance Profiling** - Built-in FreezeProfiler component  
✅ **Zero Dependencies** - Minimal footprint  
✅ **TypeScript First** - Full type safety  

## Installation

```bash
npm install react-native-nitro-freeze
# or
yarn add react-native-nitro-freeze
```

### iOS

```bash
cd ios
pod install
cd ..
```

### Android

No additional steps required. The package will be auto-linked.

### Quick Start

See [QUICKSTART.md](./QUICKSTART.md) for a 3-step guide, or run the example app:

```bash
cd example
yarn install
cd ios && pod install && cd ..
yarn ios  # or yarn android
```

## Usage

### Basic Example

```tsx
import { Freeze } from 'react-native-nitro-freeze';

function App() {
  const [isInactive, setIsInactive] = useState(false);
  
  return (
    <Freeze freeze={isInactive}>
      <ExpensiveComponent />
    </Freeze>
  );
}
```

### Nested Freeze Components

The library properly handles nesting:

- **Parent frozen** → all children are automatically frozen
- **Child frozen** → only that subtree is frozen, parent continues normally

```tsx
<Freeze freeze={freezeParent}>
  <ParentComponent />
  
  <Freeze freeze={freezeChild1}>
    <ChildComponent1 />
  </Freeze>
  
  <Freeze freeze={freezeChild2}>
    <ChildComponent2 />
  </Freeze>
</Freeze>
```

### Performance Profiling

Use `FreezeProfiler` to measure the performance impact of freezing:

```tsx
import { FreezeProfiler } from 'react-native-nitro-freeze';

function App() {
  const [freeze, setFreeze] = useState(false);
  
  return (
    <FreezeProfiler
      freeze={freeze}
      componentName="MyComponent"
      onReportedData={(metrics) => {
        console.log('Parent renders:', metrics.parentRenderCount);
        console.log('Child renders:', metrics.childRenderCount);
        console.log('Avg child time:', metrics.averageChildRenderTime);
        console.log('Freeze effective:', metrics.freeze);
      }}
    >
      <ExpensiveComponent />
    </FreezeProfiler>
  );
}
```

## API

### `<Freeze>`

Main component for freezing/unfreezing subtrees.

```tsx
interface FreezeProps {
  freeze: boolean;        // When true, children won't re-render
  children: React.ReactNode;
  key?: string | number;  // Optional React key
}
```

**When `freeze={true}`:**
- ❌ No renders - React skips reconciliation
- ❌ No effects - `useEffect` won't run
- ❌ No state updates - `setState` calls are ignored
- ❌ No animations - Reanimated animations pause
- ❌ No events - Touch events are disabled
- ✅ State preserved - Component remains mounted

**When `freeze={false}`:**
- ✅ Everything resumes immediately
- ✅ All state, refs, and layout preserved

### `<FreezeProfiler>`

Profiling wrapper that measures render performance.

```tsx
interface FreezeProfilerProps {
  freeze: boolean;
  componentName: string;
  children: React.ReactNode;
  onReportedData?: (data: ProfileData) => void;
}

interface ProfileData {
  parentRenderTime: number;      // Current parent render time (ms)
  childRenderTime: number;       // Current child render time (ms) - 0 when frozen
  freeze: boolean;               // Whether freeze was effective
  parentRenderCount: number;     // Total parent renders
  childRenderCount: number;      // Total child renders
  totalParentRenderTime: number; // Cumulative parent time
  totalChildRenderTime: number;  // Cumulative child time
  averageParentRenderTime: number;
  averageChildRenderTime: number;
}
```

### Advanced Hooks

```tsx
import { useIsFrozen } from 'react-native-nitro-freeze';

function MyComponent() {
  const isFrozen = useIsFrozen();
  
  // Skip expensive operations when frozen
  if (!isFrozen) {
    // ... do work
  }
}
```

## How It Works

### JavaScript Layer

1. **React.memo with custom comparator** - Prevents re-renders when `freeze={true}`
2. **FreezeContext** - Propagates frozen state down the tree for proper nesting
3. **Visual hiding** - Uses `opacity: 0` + `pointerEvents: 'none'` when frozen
4. **No unmounting** - Components stay in the tree, preserving all state

### Native Layer (NitroModule)

**iOS:**
- Disables user interaction (`userInteractionEnabled = NO`)
- Pauses layer animations (`layer.speed = 0`)
- Hides view (`hidden = YES`)

**Android:**
- Sets visibility to `INVISIBLE`
- Disables drawing (`willNotDraw = true`)
- Disables touch events
- Cancels animations

## Comparison with react-freeze

| Feature | react-freeze | react-native-nitro-freeze |
|---------|-------------|--------------------------|
| Suspense-based | ✅ Yes | ❌ No |
| Fabric compatible | ⚠️ Partial | ✅ Full |
| Bridgeless mode | ❌ No | ✅ Yes |
| Native optimizations | ❌ No | ✅ Yes (NitroModule) |
| Proper nesting | ✅ Yes | ✅ Yes |
| Performance profiling | ❌ No | ✅ Yes |
| React Native ≥ 0.78 | ⚠️ Limited | ✅ Optimized |

## Example App

The `example/` directory contains a full demo app showing:

- ✅ Nested freeze components
- ✅ Performance profiling
- ✅ Animations and counters (to visualize freeze)
- ✅ Real-time metrics

To run the example:

```bash
cd example
yarn install
yarn ios    # or yarn android
```

## Requirements

- React ≥ 19.0.0
- React Native ≥ 0.78.0
- iOS ≥ 13.0
- Android minSdkVersion ≥ 21

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

MIT © [Your Name]

## Credits

Inspired by [react-freeze](https://github.com/software-mansion/react-freeze) by Software Mansion.
