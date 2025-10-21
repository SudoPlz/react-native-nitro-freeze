package com.reactnativenitrofreeze;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

/**
 * Native module for react-native-nitro-freeze.
 * Provides native-level freeze optimizations for Android views.
 */
@ReactModule(name = RNNitroFreezeModule.NAME)
public class RNNitroFreezeModule extends ReactContextBaseJavaModule {
    public static final String NAME = "RNNitroFreeze";

    public RNNitroFreezeModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    /**
     * Set freeze state on a native view.
     * 
     * When frozen (frozen=true):
     * - Set view to INVISIBLE (removed from draw but keeps layout)
     * - Disable drawing optimizations (setWillNotDraw)
     * - Disable clickable and focusable
     * 
     * When unfrozen (frozen=false):
     * - Restore VISIBLE state
     * - Re-enable drawing
     * - Restore interactive properties
     * 
     * @param viewTag React Native view tag
     * @param frozen true to freeze, false to unfreeze
     */
    @ReactMethod
    public void setViewFrozen(final int viewTag, final boolean frozen) {
        ReactApplicationContext context = getReactApplicationContext();
        UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
        
        if (uiManager != null) {
            uiManager.addUIBlock(new UIBlock() {
                @Override
                public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                    final View view = nativeViewHierarchyManager.resolveView(viewTag);
                    
                    if (view == null) {
                        return;
                    }
                    
                    UiThreadUtil.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (frozen) {
                                // Freeze the view
                                view.setVisibility(View.INVISIBLE);
                                view.setWillNotDraw(true);
                                view.setClickable(false);
                                view.setFocusable(false);
                                view.setEnabled(false);
                            } else {
                                // Unfreeze the view
                                view.setVisibility(View.VISIBLE);
                                view.setWillNotDraw(false);
                                view.setClickable(true);
                                view.setFocusable(true);
                                view.setEnabled(true);
                            }
                        }
                    });
                }
            });
        }
    }
}
