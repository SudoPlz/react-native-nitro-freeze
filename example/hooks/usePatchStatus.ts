import { useState, useEffect } from 'react';

/**
 * Type definition for patch status
 */
export type PatchStatus = {
  isPatched: boolean | null;
  patchDetails: string;
};

/**
 * Hook to check if React Native has been patched with ZombieFreeze
 */
export function usePatchStatus(): PatchStatus {
  const [isPatched, setIsPatched] = useState<boolean | null>(null);
  const [patchDetails, setPatchDetails] = useState<string>('');

  useEffect(() => {
    try {
      // Get React Native version
      const version = require('react-native/package.json').version;
      
      let isPatched = false;
      let patchMessage = '';
      
      try {
        // Try to import the ZombieFreezeUtils that should be available after patching
        // The patch adds ZombieFreezeUtils to the React Native internals
        const ZombieFreezeUtils = require('react-native/Libraries/Renderer/implementations/ZombieFreezeUtils');
        
        if (ZombieFreezeUtils && typeof ZombieFreezeUtils.isFiberFrozen === 'function') {
          isPatched = true;
          patchMessage = `✅ React Native ${version} - ZombieFreeze patch applied`;
        } else {
          isPatched = false;
          patchMessage = `❌ React Native ${version} - ZombieFreezeUtils not found`;
        }
      } catch (importError) {
        // ZombieFreezeUtils not found, check if we can detect the patch in another way
        try {
          // Try to access React Native internals that might be modified by the patch
          const ReactFabric = require('react-native/Libraries/Renderer/implementations/ReactFabric-dev');
          
          // Check if the patch has modified the ReactFabric internals
          // The patch adds isFiberFrozen checks to various functions
          const hasZombieFreezePatched = ReactFabric.__ZombieFreezePatched || false;
          
          if (hasZombieFreezePatched) {
            isPatched = true;
            patchMessage = `✅ React Native ${version} - ZombieFreeze patch applied (detected via ReactFabric)`;
          } else {
            isPatched = false;
            patchMessage = `❌ React Native ${version} - Patch not detected in ReactFabric`;
          }
        } catch (fabricError) {
          // Fallback: check for any global ZombieFreeze indicators
          const hasGlobalZombieFreeze = global.__ZombieFreezePatched || false;
          
          if (hasGlobalZombieFreeze) {
            isPatched = true;
            patchMessage = `✅ React Native ${version} - ZombieFreeze patch applied (detected globally)`;
          } else {
            isPatched = false;
            patchMessage = `❌ React Native ${version} - Patch not detected`;
          }
        }
      }
      
      setIsPatched(isPatched);
      setPatchDetails(patchMessage);
    } catch (error) {
      setIsPatched(false);
      setPatchDetails(`❌ Error checking patch status: ${error.message}`);
    }
  }, []);

  return { isPatched, patchDetails };
}
