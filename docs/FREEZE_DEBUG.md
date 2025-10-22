# Debugging Freeze Component

## How to Verify Freeze is Working

### 1. Check React Native Patch

First, verify the patch is applied:

```bash
# Look for the isFiberFrozen function
grep -n "isFiberFrozen" node_modules/react-native/Libraries/Renderer/implementations/ReactFabric-dev.js
```

Should return line numbers where the function is defined and used.

### 2. Test State Update Blocking

Add this to your frozen component:

```tsx
function TestComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
      console.log('Count updated:', count + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [count]);
  
  return <Text>Count: {count}</Text>;
}

// Wrap it
<Freeze freeze={true}>
  <TestComponent />
</Freeze>
```

**Expected behavior:**
- When `freeze={true}`: Console logs stop, count stops incrementing
- When `freeze={false}`: Console logs resume, count continues

### 3. Test Interaction Blocking

```tsx
<Freeze freeze={true}>
  <TouchableOpacity onPress={() => console.log('Pressed!')}>
    <Text>Press me</Text>
  </TouchableOpacity>
</Freeze>
```

**Expected behavior:**
- When `freeze={true}`: Touch events are ignored, no console logs
- When `freeze={false}`: Touch events work normally

### 4. Test Nested Freeze

```tsx
<Freeze freeze={parentFrozen}>
  <ParentComponent />
  
  <Freeze freeze={childFrozen}>
    <ChildComponent />
  </Freeze>
</Freeze>
```

**Expected behavior:**
- Child is frozen if EITHER parent OR child freeze is true
- Child is active only if BOTH parent AND child freeze are false

## Common Issues

### Issue 1: Patch Not Applied

**Symptoms:**
- State updates continue when frozen
- Console logs don't stop

**Solution:**
```bash
# Check if patch exists
ls patches/react-native+*.patch

# Re-apply patch
npx patch-package react-native --reverse
npx patch-package react-native
```

### Issue 2: Interactions Not Blocked

**Symptoms:**
- Touch events still work when frozen

**Solution:**
- Check that `pointerEvents='none'` is applied (it's automatic)
- Don't override `pointerEvents` prop on frozen components

### Issue 3: Nested Freeze Not Working

**Symptoms:**
- Child components don't inherit parent freeze state

**Solution:**
- Ensure you're using the `FreezeContext` properly
- Check that `useIsFrozen()` returns correct values

### Issue 4: Performance Not Improved

**Symptoms:**
- App still feels sluggish when frozen

**Solution:**
- Verify patch is blocking `setState` calls
- Check that expensive operations are actually in frozen components
- Use `FreezeProfiler` to measure actual performance

## Debug Tools

### FreezeProfiler

```tsx
<FreezeProfiler 
  id="MyComponent"
  onReportedData={(data) => {
    console.log('Renders:', data.renderCount);
    console.log('Freeze effective:', data.freeze);
  }}
>
  <ExpensiveComponent />
</FreezeProfiler>
```

### useIsFrozen Hook

```tsx
function MyComponent() {
  const isFrozen = useIsFrozen();
  
  console.log('Component frozen:', isFrozen);
  
  return <Text>Frozen: {isFrozen ? 'Yes' : 'No'}</Text>;
}
```

### Manual Patch Verification

```javascript
// In ReactFabric-dev.js, add logging:
function dispatchSetState(fiber, queue, action) {
  if (isFiberFrozen(fiber)) {
    console.log('🚫 Blocked setState for frozen component');
    return;
  }
  // ... rest of function
}
```

## Performance Expectations

### When Working Correctly:

- **Frozen components**: 0 re-renders, 0 state updates
- **Parent components**: Continue normal operation
- **Interactions**: Completely blocked
- **Memory**: No leaks, clean unmounting

### Red Flags:

- State updates continue when frozen
- Touch events work when frozen  
- Memory usage increases over time
- App crashes or becomes unresponsive

## Testing Checklist

- [ ] Patch is applied to ReactFabric-dev.js
- [ ] State updates stop when frozen
- [ ] Touch events are blocked when frozen
- [ ] Nested freeze works correctly
- [ ] Performance improves when frozen
- [ ] No memory leaks during freeze/unfreeze cycles
- [ ] App doesn't crash during rapid freeze/unfreeze