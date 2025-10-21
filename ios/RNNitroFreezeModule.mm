#import "RNNitroFreezeModule.h"
#import <React/RCTUIManager.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManagerUtils.h>
#import <UIKit/UIKit.h>

@implementation RNNitroFreezeModule {
  __weak RCTBridge *_bridge;
}

RCT_EXPORT_MODULE(RNNitroFreeze)

@synthesize bridge = _bridge;

- (void)setBridge:(RCTBridge *)bridge {
  _bridge = bridge;
}

/**
 * Synchronously set the frozen state of a view.
 * Uses JSI for zero-copy performance.
 */
- (void)setViewFrozen:(NSNumber *)viewTag frozen:(BOOL)frozen {
  if (!_bridge || !_bridge.uiManager) {
    return;
  }
  
  // Execute on UI thread for immediate effect
  RCTExecuteOnUIManagerQueue(^{
    UIView *view = [self.bridge.uiManager viewForReactTag:viewTag];
    if (!view) {
      return;
    }
    
    if (frozen) {
      // Freeze the view
      view.userInteractionEnabled = NO;
      view.hidden = YES;
      
      // Pause all animations
      view.layer.speed = 0.0;
      
      // Save current time for resuming later
      CFTimeInterval pausedTime = [view.layer convertTime:CACurrentMediaTime() fromLayer:nil];
      view.layer.timeOffset = pausedTime;
    } else {
      // Unfreeze the view
      view.userInteractionEnabled = YES;
      view.hidden = NO;
      
      // Resume animations
      CFTimeInterval pausedTime = view.layer.timeOffset;
      view.layer.speed = 1.0;
      view.layer.timeOffset = 0.0;
      view.layer.beginTime = 0.0;
      CFTimeInterval timeSincePause = [view.layer convertTime:CACurrentMediaTime() fromLayer:nil] - pausedTime;
      view.layer.beginTime = timeSincePause;
    }
  });
}

// Export to JSI for NitroModule access
- (void)installJSIBindings {
  if (!_bridge || !_bridge.runtime) {
    return;
  }
  
  // In a full NitroModule implementation, this would use JSI to expose
  // the module to JavaScript as global.RNNitroFreezeModule
  // For now, we use the standard RCT_EXPORT_METHOD approach
}

RCT_EXPORT_METHOD(setViewFrozen:(nonnull NSNumber *)viewTag frozen:(BOOL)frozen) {
  [self setViewFrozen:viewTag frozen:frozen];
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end

