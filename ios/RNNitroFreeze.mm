#import "RNNitroFreeze.h"
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

@implementation RNNitroFreeze

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

/**
 * Set freeze state on a native view.
 * 
 * When frozen (frozen=true):
 * - Disable user interaction
 * - Pause layer animations (set speed to 0)
 * - Hide the view
 * 
 * When unfrozen (frozen=false):
 * - Restore user interaction
 * - Resume layer animations (set speed to 1)
 * - Show the view
 */
RCT_EXPORT_METHOD(setViewFrozen:(nonnull NSNumber *)reactTag
                  frozen:(BOOL)frozen)
{
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        UIView *view = viewRegistry[reactTag];
        if (!view) {
            RCTLogError(@"RNNitroFreeze: Cannot find view with tag #%@", reactTag);
            return;
        }
        
        dispatch_async(dispatch_get_main_queue(), ^{
            if (frozen) {
                // Freeze the view
                view.userInteractionEnabled = NO;
                view.layer.speed = 0.0; // Pause all animations
                view.hidden = YES;
            } else {
                // Unfreeze the view
                view.userInteractionEnabled = YES;
                view.layer.speed = 1.0; // Resume animations
                view.hidden = NO;
            }
        });
    }];
}

@end
