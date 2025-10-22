#import "RNNitroFreezeModule.h"
#import <React/RCTUIManager.h>
#import <UIKit/UIKit.h>

@implementation RNNitroFreezeModule

RCT_EXPORT_MODULE(RNNitroFreeze)

/**
 * Synchronously set the frozen state of a view.
 * Works with bridgeless React Native (RN 0.78+)
 */
RCT_EXPORT_METHOD(setViewFrozen:(nonnull NSNumber *)viewTag frozen:(BOOL)frozen) {
  if (!viewTag) {
    return;
  }
  
  // Execute on main thread to access UIKit
  dispatch_async(dispatch_get_main_queue(), ^{
    UIView *view = nil;
    
    // Get the key window from the first available window
    UIWindow *keyWindow = [UIApplication sharedApplication].windows.firstObject;
    
    if (keyWindow) {
      view = [self findViewWithTag:[viewTag integerValue] inView:keyWindow];
    }
    
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

// Helper method to find a view by React tag
- (UIView *)findViewWithTag:(NSInteger)tag inView:(UIView *)view {
  if (view.reactTag && [view.reactTag integerValue] == tag) {
    return view;
  }
  
  for (UIView *subview in view.subviews) {
    UIView *found = [self findViewWithTag:tag inView:subview];
    if (found) {
      return found;
    }
  }
  
  return nil;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

@end

