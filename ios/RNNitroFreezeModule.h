#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

/**
 * RNNitroFreezeModule
 * 
 * Native iOS module for optimizing frozen views.
 * Implements view freezing at the UIKit level for maximum performance.
 * Compatible with bridgeless React Native (RN 0.78+)
 */
@interface RNNitroFreezeModule : NSObject <RCTBridgeModule>

@end

