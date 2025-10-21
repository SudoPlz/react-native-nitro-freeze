# Example App Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd example
yarn install
```

### 2. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 3. Run the App

**iOS:**
```bash
yarn ios
```

**Android:**
```bash
yarn android
```

---

## Detailed Setup Instructions

### iOS

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Install CocoaPods dependencies:**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Open in Xcode (optional):**
   ```bash
   open ios/NitroFreezeExample.xcworkspace
   ```

4. **Run from command line:**
   ```bash
   yarn ios
   ```
   
   Or specify a device:
   ```bash
   yarn ios --simulator="iPhone 15 Pro"
   ```

### Android

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Start Metro bundler:**
   ```bash
   yarn start
   ```

3. **Run on device/emulator:**
   ```bash
   # In another terminal
   yarn android
   ```

---

## Project Structure

```
example/
├── App.tsx                    # Main app component
├── index.js                   # Entry point
├── package.json              # Dependencies
├── ios/                      # iOS native code
│   ├── Podfile              # CocoaPods configuration
│   ├── .xcode.env           # Xcode environment
│   └── NitroFreezeExample/  # iOS app
│       ├── AppDelegate.h/mm # App delegate
│       ├── Info.plist       # App configuration
│       ├── LaunchScreen.storyboard
│       └── Images.xcassets/ # App icons
└── android/                  # Android native code
    ├── app/
    │   ├── build.gradle     # App build config
    │   └── src/main/
    │       ├── AndroidManifest.xml
    │       ├── java/        # Java/Kotlin code
    │       └── res/         # Resources
    └── build.gradle         # Root build config
```

---

## Troubleshooting

### iOS

**Pod install fails:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod repo update
pod install
cd ..
```

**Build fails:**
```bash
cd ios
xcodebuild clean -workspace NitroFreezeExample.xcworkspace -scheme NitroFreezeExample
cd ..
```

**Metro bundler port in use:**
```bash
lsof -ti:8081 | xargs kill -9
yarn start
```

### Android

**Gradle build fails:**
```bash
cd android
./gradlew clean
cd ..
```

**Metro bundler issues:**
```bash
yarn start --reset-cache
```

**ADB issues:**
```bash
adb reverse tcp:8081 tcp:8081
```

---

## What to Test

### 1. Performance Profiling Demo

- Toggle freeze button
- Watch metrics update
- Verify:
  - Parent renders continue
  - Child renders stop when frozen
  - Avg child time → 0ms when frozen
  - "Freeze Effective" shows YES

### 2. Nested Freeze Demo

- **Test Parent Freeze:**
  - Freeze parent
  - Both children should freeze
  - Counters stop, animations pause

- **Test Child Freeze:**
  - Keep parent unfrozen
  - Freeze Child 1
  - Child 1 stops, Child 2 continues

- **Test Independent:**
  - Unfreeze parent
  - Freeze both children
  - Both stop independently

### 3. Visual Indicators

- Counters stop incrementing when frozen
- Animations pause when frozen
- Lists become non-scrollable when frozen
- UI becomes semi-transparent

---

## Development

### Hot Reload

Press `r` in the Metro terminal to reload, or shake the device and select "Reload".

### Debug Menu

- **iOS Simulator:** Cmd + D
- **Android Emulator:** Cmd + M (Mac) or Ctrl + M (Windows/Linux)
- **Physical Device:** Shake the device

### Debugging

Enable debugging:
1. Open debug menu
2. Select "Debug with Chrome" or "Open Debugger"
3. Use Chrome DevTools

### Performance Profiling

The app includes `FreezeProfiler` that shows real-time metrics:
- Render counts
- Render times
- Average times
- Freeze effectiveness

---

## Modifying the Example

### Change Freeze Behavior

Edit `App.tsx`:

```tsx
// Adjust counter speed
const interval = setInterval(() => {
  setCount((c) => c + 1);
}, 100); // Change this value

// Adjust animation speed
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 1000, // Change this value
  useNativeDriver: true,
})
```

### Add More Components

Create new freeze scenarios:

```tsx
<Freeze freeze={myCondition}>
  <MyCustomComponent />
</Freeze>
```

### Test Performance

Add more items to `ExpensiveList`:

```tsx
{Array.from({ length: 100 }).map((_, i) => ( // Increase from 50
  <Text key={i}>Item {i + 1}</Text>
))}
```

---

## Next Steps

1. ✅ Run the example app
2. ✅ Test freeze/unfreeze
3. ✅ Check performance metrics
4. ✅ Test nesting behavior
5. ✅ Integrate into your app

---

## Support

If you encounter issues:

1. Check this SETUP guide
2. Review the main [README](../README.md)
3. Check [INSTALLATION](../INSTALLATION.md)
4. Open an issue on GitHub

---

**The example app is ready to run!** 🚀

