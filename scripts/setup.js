#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧟 Setting up react-zombie-freeze...\n');

// Check if we're in a React Native project
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: No package.json found. Please run this from your React Native project root.');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
if (!packageJson.dependencies || !packageJson.dependencies['react-native']) {
  console.error('❌ Error: This doesn\'t appear to be a React Native project.');
  process.exit(1);
}

console.log('✅ Found React Native project');

// Install patch-package if not already installed
try {
  require.resolve('patch-package');
  console.log('✅ patch-package is already installed');
} catch (e) {
  console.log('📦 Installing patch-package...');
  execSync('npm install --save-dev patch-package', { stdio: 'inherit' });
  console.log('✅ patch-package installed');
}

// Apply the patch
console.log('🔧 Applying React Native patch...');
try {
  // Look for patches in node_modules/react-zombie-freeze/patches
  const patchesPath = path.join(process.cwd(), 'node_modules', 'react-zombie-freeze', 'patches');
  if (fs.existsSync(patchesPath)) {
    // Copy patches to current directory temporarily
    const tempPatchesPath = path.join(process.cwd(), 'patches');
    if (fs.existsSync(tempPatchesPath)) {
      execSync(`rm -rf ${tempPatchesPath}`);
    }
    execSync(`cp -r ${patchesPath} ${process.cwd()}`);
    
    // Apply patches
    execSync('npx patch-package', { stdio: 'inherit' });
    
    // Clean up temporary patches directory
    execSync(`rm -rf ${tempPatchesPath}`);
    
    console.log('✅ Patch applied successfully!');
  } else {
    console.error('❌ Patches directory not found in node_modules/react-zombie-freeze/patches');
    console.log('   Make sure react-zombie-freeze is properly installed.');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Failed to apply patch:', error.message);
  console.log('\n💡 Make sure you have the patches directory in your project.');
  console.log('   If you installed from npm, the patches should be included automatically.');
  console.log('   If you\'re using a local version, make sure the patches directory is copied.');
  process.exit(1);
}

console.log('\n🎉 Setup complete! react-zombie-freeze is ready to use.');
console.log('\n📖 Next steps:');
console.log('   1. Import and use the Freeze component in your app');
console.log('   2. Run your React Native app as usual');
console.log('\nExample usage:');
console.log('   import { Freeze } from "react-zombie-freeze";');
console.log('   <Freeze freeze={isFrozen}><YourComponent /></Freeze>');
