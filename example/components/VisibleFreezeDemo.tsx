import React, { useState, memo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Freeze } from 'react-zombie-freeze';
import { ExpensiveList } from './ExpensiveList';
import { sharedStyles } from './sharedStyles';

// Create a memoized wrapper that tracks its own renders
const TrackedExpensiveList = memo(
  React.forwardRef<any, any>((props, ref) => {
    // This component's render count
    const renderCount = React.useRef(0);
    renderCount.current += 1;
    
    console.log(`[TrackedExpensiveList] Render #${renderCount.current}`, props);
    
    // Expose render count via imperative handle
    React.useImperativeHandle(ref, () => ({
      getRenderCount: () => renderCount.current,
    }));

    return <ExpensiveList {...props} />;
  })
);

/**
 * Demo showing hideContent={false} - keep content visible while frozen
 * Perfect for preventing re-renders during animations while keeping UI visible
 */
export function VisibleFreezeDemo() {
  const [freeze, setFreeze] = useState(false);
  const expensiveListRef = React.useRef<any>(null);
  
  // Track parent renders
  const parentRenderCount = React.useRef(0);
  const [displayMetrics, setDisplayMetrics] = useState({
    parentRenders: 0,
    childRenders: 0,
  });

  // Count parent renders
  parentRenderCount.current += 1;
  console.log(`[VisibleFreezeDemo] Parent render #${parentRenderCount.current}, freeze=${freeze}`);

  const handleFreezeToggle = React.useCallback(() => {
    setFreeze(prev => !prev);
    // Update metrics after toggle
    const childRenders = expensiveListRef.current?.getRenderCount?.() ?? 0;
    setDisplayMetrics(prev => ({
      parentRenders: prev.parentRenders + 1,
      childRenders: childRenders,
    }));
  }, []);

  const frozenEfficiency = 
    displayMetrics.parentRenders > 0 
      ? (1 - displayMetrics.childRenders / displayMetrics.parentRenders) * 100
      : 0;

  return (
    <View style={sharedStyles.section}>
      <Text style={sharedStyles.sectionTitle}>Visible Freeze Demo (hideContent={false})</Text>
      <Text style={sharedStyles.description}>
        Check the console! When frozen, TrackedExpensiveList should NOT log renders.
        {'\n'}
        If it logs renders = Freeze component is broken
      </Text>

      <TouchableOpacity
        style={[sharedStyles.button, freeze && sharedStyles.buttonActive]}
        onPress={handleFreezeToggle}
      >
        <Text style={sharedStyles.buttonText}>
          {freeze ? '❄️ FROZEN (visible)' : '🔥 ACTIVE'}
        </Text>
      </TouchableOpacity>

      {/* Performance metrics display */}
      <View style={sharedStyles.metricsContainer}>
        <Text style={sharedStyles.metricsTitle}>Render Counts:</Text>
        <View style={sharedStyles.metricsRow}>
          <Text style={sharedStyles.metricsLabel}>Parent Renders:</Text>
          <Text style={sharedStyles.metricsValue}>
            {displayMetrics.parentRenders}
          </Text>
        </View>
        <View style={sharedStyles.metricsRow}>
          <Text style={sharedStyles.metricsLabel}>Child Renders:</Text>
          <Text
            style={[
              sharedStyles.metricsValue,
              {
                color: displayMetrics.childRenders < displayMetrics.parentRenders / 2 ? '#10b981' : '#f59e0b',
              },
            ]}
          >
            {displayMetrics.childRenders}
          </Text>
        </View>
        {displayMetrics.parentRenders > 0 && (
          <View style={sharedStyles.metricsRow}>
            <Text style={[sharedStyles.metricsLabel, { fontWeight: '700' }]}>
              Freeze Efficiency:
            </Text>
            <Text
              style={[
                sharedStyles.metricsValue,
                {
                  color: frozenEfficiency > 50 ? '#10b981' : '#f59e0b',
                  fontWeight: '700',
                },
              ]}
            >
              {frozenEfficiency.toFixed(0)}%
            </Text>
          </View>
        )}
      </View>

      <Freeze freeze={freeze} hideContent={false}>
        <TrackedExpensiveList 
          ref={expensiveListRef}
          title="Visible While Frozen" 
          color="#E8F5E9" 
        />
      </Freeze>
    </View>
  );
}

const styles = StyleSheet.create({
  unfrozenText: {
    color: '#10B981',
  },
  frozenText: {
    color: '#F59E0B',
  },
});
