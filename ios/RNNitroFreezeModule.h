#import <Foundation/Foundation.h>

/**
 * RNNitroFreezeModule
 * 
 * Native iOS module for optimizing frozen views.
 * Implements view freezing at the UIKit level for maximum performance.
 */
@interface RNNitroFreezeModule : NSObject

/**
 * Set the frozen state of a view.
 * 
 * When frozen:
 * - Disables user interaction
 * - Pauses layer animations (layer.speed = 0)
 * - Hides the view (hidden = YES)
 * 
 * When unfrozen:
 * - Re-enables user interaction
 * - Resumes animations (layer.speed = 1)
 * - Shows the view (hidden = NO)
 * 
 * @param viewTag The React Native view tag
 * @param frozen Whether to freeze or unfreeze the view
 */
- (void)setViewFrozen:(NSNumber *)viewTag frozen:(BOOL)frozen;

@end

