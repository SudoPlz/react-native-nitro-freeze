# 🧟 react-zombie-freeze

> Freeze React components without Suspense - visible, non-interactive, zero re-renders

A drop-in replacement for `react-freeze` that works without Suspense, perfect for React Native animations.

⚠️ **EXPERIMENTAL LIBRARY** - This library is experimental and **not recommended for production use**. It patches React Native's core renderer and may cause unexpected behavior or break with React Native updates.

## Why "Zombie"?

Like zombies, frozen components are:
- 🧟 **Alive but inactive** - Mounted but not updating
- 👁️ **Visible** - Still on screen (optional)
- 🚫 **Unresponsive** - Don't react to interactions
- ⚡ **Zero overhead** - No performance cost when frozen

## Why This Library Was Created (Why not react-freeze)

`react-freeze` has a fundamental flaw: it uses Suspense, which **unmounts** class components when frozen. This causes:

- 🐛 **Class component lifecycle bugs** - `componentWillUnmount`/`componentDidMount` fire unexpectedly
- 🔄 **State loss** - Component state is destroyed and recreated
- 🎯 **Unpredictable behavior** - Components lose refs, timers, and subscriptions
- ⚠️ **Production issues** - Hard to debug problems that only appear when frozen

`react-zombie-freeze` solves this by **never unmounting** components. They stay mounted but become "zombies" - alive but inactive.

## Features

- ✅ **No Suspense required** - Works without Concurrent Mode
- ✅ **Zero native code** - Pure JavaScript/TypeScript
- ✅ **Keeps content visible** - Perfect for animations
- ✅ **Blocks interactions** - No touches or gestures
- ✅ **Prevents re-renders** - Complete state update blocking
- ✅ **Nested support** - Freeze components within frozen trees
- ✅ **Class & function components** - Full support for both
- ✅ **State preservation** - Components never unmount, state stays intact
- ✅ **Tiny patch** - Just 23 lines in React Native

## Installation

### Automatic Setup (Recommended)

```bash
yarn add react-zombie-freeze
npx react-zombie-freeze setup
```


<details>
<summary>Click to expand manual patching instructions</summary>

### Manual Patching (If Needed)

If automatic patching fails, you can apply it manually:

**Option 1: Use the provided patch file**
```bash
# Copy the patch from the library
cp node_modules/react-zombie-freeze/patches/react-native+0.78.3.patch patches/

# Apply the patch
yarn patch-package
```

**Option 2: Manual file editing**

**File**: `node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js`

**What to add**:
1. One helper function (`isFiberFrozen`) - 18 lines
2. Five one-line checks in dispatcher functions - 5 lines

See [FINAL_ARCHITECTURE.md](./docs/FINAL_ARCHITECTURE.md) for the complete patch code.

</details>

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

## How It Works

The library patches React Native's core renderer to block state updates for frozen components. This is done via the setup script that:

1. **Finds React Native** - Locates `ReactFabric-dev.js` in your `node_modules`
2. **Applies patch** - Adds 23 lines to block state updates
3. **Reports status** - Shows success/failure messages



### Technical Details

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
| Class components | ❌ Lifecycle bugs | ✅ Full support |
| State preservation | ❌ Unmounts components | ✅ Never unmounts |
| Native code | None | None |

## Requirements

- React Native ≥ 0.78 (Fabric)
- React ≥ 19.0

## ⚠️ Important Warnings

- **Experimental**: This library is experimental and not recommended for production
- **React Native Updates**: Patches may break with React Native updates
- **Core Patching**: Modifies React Native's core renderer files
- **Testing Required**: Thoroughly test in your specific environment before use
- **Backup Recommended**: Consider backing up your `node_modules` before applying patches

## License

MIT

## Contributing

PRs welcome! See [FINAL_ARCHITECTURE.md](./docs/FINAL_ARCHITECTURE.md) for implementation details.

## Disclaimer

This library is experimental and patches React Native's core files. Use at your own risk. The authors are not responsible for any issues that may arise from using this library in production environments.

---

Made with 🧟 by the React Native community
