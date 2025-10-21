# Installation Guide

## Prerequisites

- React Native ≥ 0.78.0
- React ≥ 19.0.0
- iOS deployment target ≥ 13.0
- Android minSdkVersion ≥ 21
- Node.js ≥ 18
- CocoaPods ≥ 1.10 (for iOS)

## Step 1: Install the Package

### Using npm

```bash
npm install react-native-nitro-freeze
```

### Using yarn

```bash
yarn add react-native-nitro-freeze
```

## Step 2: iOS Setup

Navigate to the iOS directory and install pods:

```bash
cd ios
pod install
cd ..
```

### Manual Linking (if needed)

If auto-linking doesn't work, add to your `Podfile`:

```ruby
pod 'react-native-nitro-freeze', :path => '../node_modules/react-native-nitro-freeze'
```

Then run:

```bash
cd ios && pod install
```

### Fabric Configuration

Ensure Fabric is enabled in `ios/Podfile`:

```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :fabric_enabled => true,  # Enable this
  # ... other options
)
```

## Step 3: Android Setup

The package will be auto-linked via React Native's autolinking.

### Verify Auto-linking

Check that the package is included in `android/settings.gradle`:

```gradle
// This should be added automatically
include ':react-native-nitro-freeze'
project(':react-native-nitro-freeze').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-nitro-freeze/android')
```

And in `android/app/build.gradle`:

```gradle
dependencies {
    implementation project(':react-native-nitro-freeze')
    // ... other dependencies
}
```

### Fabric Configuration

Ensure Fabric is enabled in `android/gradle.properties`:

```properties
newArchEnabled=true
```

### Manual Linking (if needed)

If auto-linking fails, manually add the package in `MainApplication.java` or `MainApplication.kt`:

```kotlin
import com.margelo.nitrofreeze.RNNitroFreezePackage

class MainApplication : Application(), ReactApplication {
  override val reactNativeHost: ReactNativeHost =
    object : DefaultReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> =
        PackageList(this).packages.apply {
          add(RNNitroFreezePackage())  // Add this line
        }
    }
}
```

## Step 4: Rebuild the App

### iOS

```bash
npx react-native run-ios
```

Or open `ios/YourApp.xcworkspace` in Xcode and build from there.

### Android

```bash
npx react-native run-android
```

## Step 5: Verify Installation

Add this test code to your app:

```tsx
import { Freeze, isNativeModuleAvailable } from 'react-native-nitro-freeze';
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

function TestFreeze() {
  const [frozen, setFrozen] = useState(false);
  
  console.log('Native module available:', isNativeModuleAvailable());
  
  return (
    <View>
      <Button
        title={frozen ? 'Unfreeze' : 'Freeze'}
        onPress={() => setFrozen(!frozen)}
      />
      <Freeze freeze={frozen}>
        <Text>This content is {frozen ? 'frozen' : 'active'}</Text>
      </Freeze>
    </View>
  );
}
```

If you see the text freeze/unfreeze when pressing the button, the installation is successful!

## Troubleshooting

### iOS Issues

#### Pod install fails

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
```

#### Build errors

1. Clean build folder: Xcode → Product → Clean Build Folder
2. Ensure deployment target is ≥ 13.0 in Xcode project settings
3. Try deleting `ios/build` directory

### Android Issues

#### Gradle sync fails

```bash
cd android
./gradlew clean
cd ..
```

#### Module not found

1. Verify `android/settings.gradle` includes the module
2. Check `android/app/build.gradle` has the dependency
3. Run `./gradlew --refresh-dependencies`

#### Kotlin version conflicts

Ensure your project uses Kotlin ≥ 1.8.0 in `android/build.gradle`:

```gradle
buildscript {
    ext {
        kotlinVersion = "1.9.0"  // Update this
    }
}
```

### Native Module Not Available

If `isNativeModuleAvailable()` returns `false`:

1. The library still works (JS-only mode with visual hiding)
2. Check native module linking
3. Rebuild the app completely
4. Check logs for native module initialization errors

In JS-only mode, you'll get:
- ✅ Render prevention via React.memo
- ✅ Visual hiding via opacity
- ✅ Event blocking via pointerEvents
- ❌ No native-level optimizations

## Running the Example App

To see a full working example:

```bash
cd node_modules/react-native-nitro-freeze/example
yarn install

# iOS
yarn ios

# Android
yarn android
```

## Next Steps

- Read the [README](./README.md) for usage examples
- Check the [ARCHITECTURE](./ARCHITECTURE.md) for implementation details
- See the [example app](./example/App.tsx) for real-world usage
- Review [CONTRIBUTING](./CONTRIBUTING.md) if you want to contribute

## Support

If you encounter issues:

1. Check this installation guide
2. Review the [troubleshooting section](#troubleshooting)
3. Search [existing issues](https://github.com/yourusername/react-native-nitro-freeze/issues)
4. Open a new issue with:
   - React Native version
   - Platform (iOS/Android)
   - Error messages
   - Steps to reproduce

