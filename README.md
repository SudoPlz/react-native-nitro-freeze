# react-native-nitro-freeze

A React Native library that replicates the API and behavior of [react-freeze](https://github.com/software-mansion/react-freeze) **without using Suspense**. Fully compatible with Fabric and bridgeless mode (React Native ≥ 0.78), powered by NitroModule for native-level performance optimizations.

## Features

✅ **Drop-in replacement** for `react-freeze` - identical API  
✅ **No Suspense** - Fabric and bridgeless compatible  
✅ **Native optimizations** - NitroModule-powered (iOS & Android)  
✅ **Nested freeze support** - Frozen parent → frozen children  
✅ **State preservation** - Components stay mounted, no unmounting  
✅ **Instant resume** - Unfreeze restores immediately  
✅ **Performance profiling** - Built-in FreezeProfiler component  
✅ **TypeScript** - Full type safety with strict mode  

## Installation

```bash
npm install react-native-nitro-freeze
# or
yarn add react-native-nitro-freeze
```

### iOS Setup

```bash
cd ios && pod install
```

### Android Setup

Add the package to your `MainApplication.java`:

```java
import com.reactnativenitrofreeze.RNNitroFreezePackage;

@Override
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new RNNitroFreezePackage() // Add this line
  );
}
```

## Usage

### Basic Example

```tsx
import { Freeze } from 'react-native-nitro-freeze';

function MyScreen({ isActive }: { isActive: boolean }) {
  return (
    <Freeze freeze={!isActive}>
      <ExpensiveComponent />
    </Freeze>
  );
}
```

When `freeze={true}`:
- ❄️ Children won't re-render
- ❄️ Effects (useEffect) won't run
- ❄️ Events are blocked (pointerEvents: 'none')
- ❄️ View is hidden (opacity: 0)
- ❄️ Native optimizations applied (animations paused, drawing disabled)

When `freeze={false}`:
- ▶️ Everything resumes immediately
- ▶️ State is preserved (no unmounting)

### Screen Navigation

Perfect for freezing inactive screens in custom navigators:

```tsx
import { Freeze } from 'react-native-nitro-freeze';

function ScreenNavigator() {
  const [activeScreen, setActiveScreen] = useState('home');

  return (
    <>
      <Freeze freeze={activeScreen !== 'home'} key="home">
        <HomeScreen />
      </Freeze>
      
      <Freeze freeze={activeScreen !== 'profile'} key="profile">
        <ProfileScreen />
      </Freeze>
    </>
  );
}
```

### Nested Freeze (Advanced)

Supports nesting with correct propagation:

```tsx
<Freeze freeze={parentInactive}>
  <ParentComponent />
  
  <Freeze freeze={childInactive}>
    <ChildComponent />
    {/* Frozen if EITHER parent OR child is inactive */}
  </Freeze>
</Freeze>
```

**Rules:**
- Frozen parent → **all children frozen** (propagates down)
- Frozen child → **parent unaffected** (doesn't propagate up)

### Performance Profiling

Measure freeze effectiveness with `FreezeProfiler`:

```tsx
import { FreezeProfiler } from 'react-native-nitro-freeze';

function ProfiledScreen({ isActive }: { isActive: boolean }) {
  const handleMetrics = (data) => {
    console.log('Freeze effective:', data.freeze);
    console.log('Child render time:', data.childRenderTime);
    console.log('Total renders:', data.parentRenderCount);
  };

  return (
    <FreezeProfiler
      freeze={!isActive}
      componentName="MyScreen"
      onReportedData={handleMetrics}
      enabled={__DEV__}
    >
      <ExpensiveComponent />
    </FreezeProfiler>
  );
}
```

**Metrics provided:**
- `parentRenderTime` - Current parent render time (ms)
- `childRenderTime` - Current child render time (ms, **0 when frozen**)
- `freeze` - Whether freeze was effective (true if frozen AND childRenderTime === 0)
- `parentRenderCount` - Total parent renders
- `childRenderCount` - Total child renders
- `totalParentRenderTime` - Cumulative parent time
- `totalChildRenderTime` - Cumulative child time
- `averageParentRenderTime` - Average parent time
- `averageChildRenderTime` - Average child time

## Advanced Hooks

For components that need freeze-aware behavior:

```tsx
import { 
  useIsFrozen, 
  useFreezeState, 
  useFreezeEffect 
} from 'react-native-nitro-freeze';

function MyComponent() {
  const isFrozen = useIsFrozen();
  const [count, setCount] = useFreezeState(0);

  // Effect won't run when frozen
  useFreezeEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // setCount(n) is no-op when frozen
  return (
    <View>
      <Text>Frozen: {isFrozen ? 'Yes' : 'No'}</Text>
      <Button onPress={() => setCount(count + 1)} title="Increment" />
    </View>
  );
}
```

## API Reference

### `<Freeze>`

Main component for freezing React subtrees.

```tsx
interface FreezeProps {
  freeze: boolean;
  children: React.ReactNode;
}
```

### `<FreezeProfiler>`

Wrapper for measuring freeze performance.

```tsx
interface FreezeProfilerProps {
  freeze: boolean;
  children: React.ReactNode;
  componentName: string;
  onReportedData?: (data: FreezeProfilerData) => void;
  enabled?: boolean; // Default: __DEV__
}
```

### Hooks

- `useIsFrozen(): boolean` - Check if current component is frozen
- `useFreezeState<T>(initial: T): [T, (T) => void]` - Freeze-aware useState
- `useFreezeEffect(effect, deps)` - Freeze-aware useEffect
- `useFreezeMemo(factory, deps)` - Freeze-aware useMemo
- `useFreezeCallback(callback, deps)` - Freeze-aware useCallback

### Utilities

- `isNativeModuleAvailable(): boolean` - Check if native module loaded

## How It Works

### JavaScript Layer

1. **React.memo with custom comparator** - Blocks re-renders when `freeze={true}`
2. **FreezeContext** - Propagates frozen state to nested components
3. **Visual hiding** - `opacity: 0` + `pointerEvents: 'none'` when frozen
4. **State preservation** - Components stay mounted (never unmounted)

### Native Layer (NitroModule)

**iOS:**
- `UIView.setUserInteractionEnabled(false)` - Block touches
- `CALayer.speed = 0` - Pause animations
- `UIView.setHidden(true)` - Skip rendering

**Android:**
- `View.setVisibility(INVISIBLE)` - Hide but keep layout
- `View.setWillNotDraw(true)` - Skip draw calls
- Disable clickable/focusable

## Comparison with react-freeze

| Feature | react-freeze | react-native-nitro-freeze |
|---------|-------------|---------------------------|
| API | `<Freeze freeze={bool}>` | ✅ Identical |
| Suspense | ✅ Uses Suspense | ❌ No Suspense (Fabric-safe) |
| Native optimizations | ❌ No | ✅ NitroModule (iOS/Android) |
| Nesting support | ✅ Yes | ✅ Yes (with proper propagation) |
| Performance profiling | ❌ No | ✅ FreezeProfiler component |
| Freeze-aware hooks | ❌ No | ✅ useFreezeState, useFreezeEffect, etc. |
| State preservation | ✅ Yes | ✅ Yes |

## Migration from react-freeze

Simply replace the import:

```diff
- import { Freeze } from 'react-freeze';
+ import { Freeze } from 'react-native-nitro-freeze';
```

Everything else stays the same! 🎉

## Example App

See the [example](./example) directory for a complete demo app showcasing:
- Basic freeze/unfreeze
- Nested freeze components
- Performance profiling
- Integration with Reanimated animations

Run the example:

```bash
cd example
yarn install
yarn ios  # or yarn android
```

## Requirements

- React ≥ 19.0.0
- React Native ≥ 0.78.0 (Fabric & bridgeless)
- iOS ≥ 13.0
- Android minSdkVersion ≥ 24

## Performance Characteristics

When `freeze={true}`:
- ✅ **0 re-renders** - React.memo blocks reconciliation
- ✅ **0 effect runs** - useEffect skipped entirely
- ✅ **0 memory churn** - No new allocations
- ✅ **0 native layout** - Views excluded from layout pass (native)
- ✅ **0 CPU usage** - Animations paused at native layer

## Troubleshooting

### Native module not available

If you see:
```
react-native-nitro-freeze: Native module not available. Using JS-only implementation.
```

**Solution:**
1. Rebuild your app: `yarn ios` / `yarn android`
2. Clear cache: `yarn start --reset-cache`
3. Clean build: `cd ios && pod install` (iOS) or `cd android && ./gradlew clean` (Android)

The library works without the native module (JS-only), but native optimizations won't apply.

## Contributing

Contributions are welcome! Please open an issue or PR.

## License

MIT

---

Made with ❤️ for the React Native community
