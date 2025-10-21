package com.margelo.nitrofreeze

import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.common.UIManagerType

/**
 * RNNitroFreezeModule
 * 
 * Native Android module for optimizing frozen views.
 * Implements view freezing at the Android View level for maximum performance.
 */
class RNNitroFreezeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "RNNitroFreeze"

    /**
     * Set the frozen state of a view.
     * 
     * When frozen:
     * - Sets visibility to INVISIBLE
     * - Disables drawing (willNotDraw = true)
     * - Disables touch events
     * - Pauses animations
     * 
     * When unfrozen:
     * - Restores visibility to VISIBLE
     * - Enables drawing (willNotDraw = false)
     * - Enables touch events
     * - Resumes animations
     * 
     * @param viewTag The React Native view tag
     * @param frozen Whether to freeze or unfreeze the view
     */
    @ReactMethod
    fun setViewFrozen(viewTag: Int, frozen: Boolean) {
        UiThreadUtil.runOnUiThread {
            val view = findView(viewTag) ?: return@runOnUiThread
            
            if (frozen) {
                freezeView(view)
            } else {
                unfreezeView(view)
            }
        }
    }

    /**
     * Find a view by its React tag.
     * Works with both Fabric and legacy renderer.
     */
    private fun findView(viewTag: Int): View? {
        return try {
            // Try Fabric first (new architecture)
            val fabricUIManager = UIManagerHelper.getUIManager(
                reactApplicationContext,
                UIManagerType.FABRIC
            )
            fabricUIManager?.resolveView(viewTag)
        } catch (e: Exception) {
            try {
                // Fall back to legacy renderer
                val legacyUIManager = UIManagerHelper.getUIManager(
                    reactApplicationContext,
                    UIManagerType.DEFAULT
                )
                legacyUIManager?.resolveView(viewTag)
            } catch (e: Exception) {
                null
            }
        }
    }

    /**
     * Apply freeze optimizations to a view
     */
    private fun freezeView(view: View) {
        // Make invisible (but keep in layout, unlike GONE)
        view.visibility = View.INVISIBLE
        
        // Disable drawing
        view.setWillNotDraw(true)
        
        // Disable touch events
        view.isEnabled = false
        view.isClickable = false
        view.isFocusable = false
        
        // Pause animations
        view.animate().cancel()
        view.clearAnimation()
        
        // Tag the view so we know it's frozen
        view.setTag(R.id.freeze_state, true)
    }

    /**
     * Remove freeze optimizations from a view
     */
    private fun unfreezeView(view: View) {
        // Restore visibility
        view.visibility = View.VISIBLE
        
        // Enable drawing
        view.setWillNotDraw(false)
        
        // Enable touch events
        view.isEnabled = true
        
        // Clear freeze tag
        view.setTag(R.id.freeze_state, false)
    }

    companion object {
        const val NAME = "RNNitroFreeze"
    }
}

