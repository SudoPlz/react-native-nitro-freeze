# 🧟 react-zombie-freeze

> Freeze React components without Suspense - visible, non-interactive, zero re-renders

A drop-in replacement for `react-freeze` that works without Suspense, perfect for React Native animations.

## Why "Zombie"?

Like zombies, frozen components are:
- 🧟 **Alive but inactive** - Mounted but not updating
- 👁️ **Visible** - Still on screen (optional)
- 🚫 **Unresponsive** - Don't react to interactions
- ⚡ **Zero overhead** - No performance cost when frozen

## Features

- ✅ **No Suspense required** - Works without Concurrent Mode
- ✅ **Zero native code** - Pure JavaScript/TypeScript
- ✅ **Keeps content visible** - Perfect for animations
- ✅ **Blocks interactions** - No touches or gestures
- ✅ **Prevents re-renders** - Complete state update blocking
- ✅ **Nested support** - Freeze components within frozen trees
- ✅ **Class & function components** - Full support for both
- ✅ **Tiny patch** - Just 23 lines in React Native

## Installation

```bash
npm install react-zombie-freeze
# or
yarn add react-zombie-freeze
```

Then apply the React Native patch (see [Patching](#patching) below).

## Quick Start

```tsx
import { Freeze } from 'react-zombie-freeze';

function App() {
  const [frozen, setFrozen] = useState(false);
  
  return (
    <View>
      <Button 
        title={frozen ? 'Unfreeze' : 'Freeze'} 
        onPress={() => setFrozen(!frozen)} 
      />
      
      <Freeze freeze={frozen}>
        <ExpensiveList />
        {/* ✅ Visible, non-interactive, no re-renders */}
      </Freeze>
    </View>
  );
}
```

## Use Cases

### Keyboard Animation

```tsx
function ChatScreen() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  return (
    <>
      <Freeze freeze={keyboardVisible} hideContent={false}>
        <MessageList />
        {/* Stays visible during keyboard animation */}
      </Freeze>
      
      <TextInput />
    </>
  );
}
```

### Modal Overlay

```tsx
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <>
      <Freeze freeze={modalOpen}>
        <MainScreen />
        {/* Frozen while modal is open */}
      </Freeze>
      
      <Modal visible={modalOpen}>
        <ModalContent />
      </Modal>
    </>
  );
}
```

### Screen Transitions

```tsx
function Navigation() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  return (
    <Freeze freeze={isTransitioning}>
      <BackgroundScreens />
      {/* Smooth 60fps transitions */}
    </Freeze>
  );
}
```

## API

### `<Freeze>`

```tsx
<Freeze 
  freeze={boolean}        // Required: freeze state
  hideContent={boolean}   // Optional: hide when frozen (default: false)
>
  {children}
</Freeze>
```

### Hooks

```tsx
import { useIsFrozen } from 'react-zombie-freeze';

function MyComponent() {
  const isFrozen = useIsFrozen();
  
  // Check if component is frozen
  if (isFrozen) {
    return <Text>I'm frozen!</Text>;
  }
}
```

### Profiling

```tsx
import { FreezeProfiler } from 'react-zombie-freeze';

<FreezeProfiler 
  id="MyComponent"
  onReportedData={(data) => {
    console.log('Renders:', data.renderCount);
  }}
>
  <ExpensiveComponent />
</FreezeProfiler>
```

## Patching

`react-zombie-freeze` requires a small patch to React Native's renderer to block state updates.

### Using patch-package (Recommended)

1. Install `patch-package`:
```bash
npm install --save-dev patch-package
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

3. Apply the patch manually (see [FINAL_ARCHITECTURE.md](./FINAL_ARCHITECTURE.md))

4. Generate the patch:
```bash
npx patch-package react-native
```

5. Commit the `patches/` directory

### Manual Patching

See [FINAL_ARCHITECTURE.md](./FINAL_ARCHITECTURE.md) for the complete patch code.

**File**: `node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js`

**What to add**:
1. One helper function (`isFiberFrozen`) - 18 lines
2. Five one-line checks in dispatcher functions - 5 lines

**Total**: 23 lines

## How It Works

1. **Registration**: When `<Freeze freeze={true}>` renders, it registers itself with React's FiberRoot
2. **Interception**: The patch intercepts `setState`/`useReducer`/`forceUpdate` calls
3. **Blocking**: If the component is frozen, the update is blocked and discarded
4. **Interactions**: `pointerEvents='none'` (built-in RN) blocks touches

No state is queued, no promises thrown, no Suspense needed!

## Performance

- **Overhead**: ~0.01ms per `setState` call (negligible)
- **Frozen updates**: Blocked instantly, zero cost
- **Memory**: 16 bytes per freeze boundary

## Comparison to react-freeze

| Feature | react-freeze | react-zombie-freeze |
|---------|-------------|---------------------|
| Prevents re-renders | ✅ (via Suspense) | ✅ (via patch) |
| Blocks interactions | ❌ (hidden) | ✅ (pointerEvents) |
| Keep content visible | ❌ Must hide | ✅ Optional |
| Works without Suspense | ❌ Required | ✅ Not needed |
| Class components | ❌ Hooks only | ✅ Full support |
| Native code | None | None |

## Requirements

- React Native ≥ 0.78 (Fabric)
- React ≥ 19.0

## License

MIT

## Contributing

PRs welcome! See [FINAL_ARCHITECTURE.md](./FINAL_ARCHITECTURE.md) for implementation details.

---

Made with 🧟 by the React Native community
