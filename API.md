# API Reference

## Components

### `<Freeze>`

The main component for freezing React Native subtrees.

```tsx
import { Freeze } from 'react-native-nitro-freeze';

<Freeze freeze={boolean}>{children}</Freeze>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `freeze` | `boolean` | Yes | When `true`, the children won't re-render and will be hidden |
| `children` | `ReactNode` | Yes | The content to freeze/unfreeze |
| `key` | `string \| number` | No | Optional React key for reconciliation |

#### Behavior

**When `freeze={true}`:**
- ❌ Children don't re-render (React skips reconciliation)
- ❌ Effects don't run (`useEffect`, `useLayoutEffect`)
- ❌ Animations pause (Reanimated, native animations)
- ❌ Events disabled (touch, gesture handlers)
- ❌ Layout updates paused
- ✅ State preserved (component stays mounted)
- ✅ Refs maintained
- ✅ Context subscriptions paused

**When `freeze={false}`:**
- ✅ Normal rendering resumes immediately
- ✅ All state, refs, and layout preserved
- ✅ Animations resume from where they paused
- ✅ Events re-enabled

#### Example

```tsx
function Screen({ isActive }: { isActive: boolean }) {
  return (
    <Freeze freeze={!isActive}>
      <ExpensiveComponent />
    </Freeze>
  );
}
```

#### Nesting Behavior

Freeze components can be nested. The freeze state propagates as follows:

- **Parent frozen** → all descendants are frozen (regardless of their own `freeze` prop)
- **Parent active** → children respect their own `freeze` prop independently

```tsx
<Freeze freeze={parentFrozen}>
  {/* Always frozen if parentFrozen=true */}
  <ChildA />
  
  <Freeze freeze={childFrozen}>
    {/* Frozen if parentFrozen=true OR childFrozen=true */}
    <ChildB />
  </Freeze>
</Freeze>
```

---

### `<FreezeProfiler>`

Performance measurement component that wraps `<Freeze>` with profiling capabilities.

```tsx
import { FreezeProfiler } from 'react-native-nitro-freeze';

<FreezeProfiler
  freeze={boolean}
  componentName={string}
  onReportedData={callback}
>
  {children}
</FreezeProfiler>
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `freeze` | `boolean` | Yes | Same as `<Freeze>` freeze prop |
| `componentName` | `string` | Yes | Identifier for this profiler (used in metrics) |
| `children` | `ReactNode` | Yes | The content to freeze and profile |
| `onReportedData` | `(data: ProfileData) => void` | No | Callback invoked on each render with metrics |

#### ProfileData

```typescript
interface ProfileData {
  // Current render metrics
  parentRenderTime: number;      // Parent wrapper render time (ms)
  childRenderTime: number;       // Child content render time (ms), 0 when frozen
  freeze: boolean;               // Whether freeze was effective (childRenderTime === 0)
  
  // Cumulative metrics
  parentRenderCount: number;     // Total parent renders since mount
  childRenderCount: number;      // Total child renders since mount
  totalParentRenderTime: number; // Sum of all parent render times (ms)
  totalChildRenderTime: number;  // Sum of all child render times (ms)
  
  // Averages
  averageParentRenderTime: number; // Average parent render time (ms)
  averageChildRenderTime: number;  // Average child render time (ms)
}
```

#### Example

```tsx
function App() {
  const [freeze, setFreeze] = useState(false);
  
  return (
    <FreezeProfiler
      freeze={freeze}
      componentName="ExpensiveScreen"
      onReportedData={(metrics) => {
        console.log('Renders:', metrics.childRenderCount);
        console.log('Avg time:', metrics.averageChildRenderTime, 'ms');
        console.log('Freeze effective:', metrics.freeze);
      }}
    >
      <ExpensiveScreen />
    </FreezeProfiler>
  );
}
```

---

## Hooks

### `useIsFrozen()`

Returns whether the current component is within a frozen subtree.

```tsx
import { useIsFrozen } from 'react-native-nitro-freeze';

function MyComponent() {
  const isFrozen = useIsFrozen();
  
  // Skip expensive operations when frozen
  if (!isFrozen) {
    // ... do work
  }
  
  return <View>{/* ... */}</View>;
}
```

#### Returns

- `boolean` - `true` if the component is within a `<Freeze freeze={true}>` ancestor

#### Use Cases

- Skip expensive computations when frozen
- Conditional logging/debugging
- Custom freeze-aware components
- Performance optimizations

---

## Utility Functions

### `isNativeModuleAvailable()`

Check if the native module is loaded and available.

```tsx
import { isNativeModuleAvailable } from 'react-native-nitro-freeze';

const hasNative = isNativeModuleAvailable();
console.log('Native optimizations:', hasNative ? 'enabled' : 'JS-only');
```

#### Returns

- `boolean` - `true` if the native module is available, `false` for JS-only mode

#### Notes

- In JS-only mode, freeze still works via React.memo and visual hiding
- Native mode adds platform-specific optimizations (animation pause, interaction disable)
- Both modes prevent React reconciliation the same way

---

## TypeScript Types

### `FreezeProps`

```typescript
interface FreezeProps {
  freeze: boolean;
  children: React.ReactNode;
  key?: string | number;
}
```

### `FreezeProfilerProps`

```typescript
interface FreezeProfilerProps {
  freeze: boolean;
  componentName: string;
  children: React.ReactNode;
  onReportedData?: (data: ProfileData) => void;
}
```

### `ProfileData`

```typescript
interface ProfileData {
  parentRenderTime: number;
  childRenderTime: number;
  freeze: boolean;
  parentRenderCount: number;
  childRenderCount: number;
  totalParentRenderTime: number;
  totalChildRenderTime: number;
  averageParentRenderTime: number;
  averageChildRenderTime: number;
}
```

---

## Advanced Usage

### Custom Freeze-Aware Component

```tsx
import { useIsFrozen } from 'react-native-nitro-freeze';

function SmartComponent() {
  const isFrozen = useIsFrozen();
  
  // Only subscribe when not frozen
  useEffect(() => {
    if (isFrozen) return;
    
    const subscription = someDataSource.subscribe(/* ... */);
    return () => subscription.unsubscribe();
  }, [isFrozen]);
  
  return <View>{/* ... */}</View>;
}
```

### Multiple Profilers

```tsx
<View>
  <FreezeProfiler freeze={freeze1} componentName="Screen1" onReportedData={log1}>
    <Screen1 />
  </FreezeProfiler>
  
  <FreezeProfiler freeze={freeze2} componentName="Screen2" onReportedData={log2}>
    <Screen2 />
  </FreezeProfiler>
</View>
```

### Conditional Freeze

```tsx
function TabContent({ isActive, isPrefetch }) {
  // Freeze if not active, unless it's being prefetched
  const shouldFreeze = !isActive && !isPrefetch;
  
  return (
    <Freeze freeze={shouldFreeze}>
      <Content />
    </Freeze>
  );
}
```

---

## Performance Tips

1. **Use for inactive screens**: Freeze tabs/screens that aren't visible
2. **Profile first**: Use `<FreezeProfiler>` to measure actual impact
3. **Batch freezes**: Freeze parent rather than many children individually
4. **Don't over-freeze**: Only freeze expensive components
5. **Check metrics**: Ensure `childRenderTime` is actually 0ms when frozen

## Migration from react-freeze

`react-native-nitro-freeze` is a drop-in replacement:

```diff
- import { Freeze } from 'react-freeze';
+ import { Freeze } from 'react-native-nitro-freeze';

// Everything else stays the same!
<Freeze freeze={isInactive}>
  <MyComponent />
</Freeze>
```

Additional features not in react-freeze:
- ✅ `<FreezeProfiler>` component
- ✅ `useIsFrozen()` hook
- ✅ `isNativeModuleAvailable()` utility
- ✅ Native-level optimizations

