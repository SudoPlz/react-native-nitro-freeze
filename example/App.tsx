/**
 * Example app for react-native-nitro-freeze
 * Demonstrates:
 * - Basic freeze/unfreeze
 * - Nested freeze components
 * - Performance profiling
 * - Integration with animations
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Freeze, FreezeProfiler, useIsFrozen } from 'react-native-nitro-freeze';
import type { FreezeProfilerData } from 'react-native-nitro-freeze';

/**
 * Component that renders continuously to demonstrate freeze effectiveness
 */
function ExpensiveComponent({ name }: { name: string }) {
  const [renderCount, setRenderCount] = useState(0);
  const isFrozen = useIsFrozen();

  // This effect should NOT run when frozen
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderCount((c) => c + 1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Spinning animation - should pause when frozen
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.componentBox}>
      <Text style={styles.componentTitle}>{name}</Text>
      <Text style={styles.renderCount}>Renders: {renderCount}</Text>
      <Text style={[styles.frozenBadge, isFrozen && styles.frozenBadgeActive]}>
        {isFrozen ? '❄️ FROZEN' : '▶️ ACTIVE'}
      </Text>
      <Animated.View style={[styles.spinner, animatedStyle]}>
        <Text style={styles.spinnerText}>🔄</Text>
      </Animated.View>
    </View>
  );
}

/**
 * Screen demonstrating nested freeze behavior
 */
function NestedFreezeDemo() {
  const [parentFrozen, setParentFrozen] = useState(false);
  const [childFrozen, setChildFrozen] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Nested Freeze Demo</Text>
      <Text style={styles.description}>
        Parent frozen → all children frozen{'\n'}
        Child frozen → parent stays active
      </Text>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, parentFrozen && styles.buttonActive]}
          onPress={() => setParentFrozen(!parentFrozen)}
        >
          <Text style={styles.buttonText}>
            {parentFrozen ? 'Unfreeze' : 'Freeze'} Parent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, childFrozen && styles.buttonActive]}
          onPress={() => setChildFrozen(!childFrozen)}
        >
          <Text style={styles.buttonText}>
            {childFrozen ? 'Unfreeze' : 'Freeze'} Child
          </Text>
        </TouchableOpacity>
      </View>

      <Freeze freeze={parentFrozen}>
        <View style={styles.nestedContainer}>
          <ExpensiveComponent name="Parent Component" />

          <Freeze freeze={childFrozen}>
            <View style={styles.nestedChild}>
              <ExpensiveComponent name="Child Component" />
            </View>
          </Freeze>
        </View>
      </Freeze>
    </View>
  );
}

/**
 * Screen demonstrating profiling
 */
function ProfiledFreezeDemo() {
  const [frozen, setFrozen] = useState(false);
  const [metrics, setMetrics] = useState<FreezeProfilerData | null>(null);

  const handleMetrics = (data: FreezeProfilerData) => {
    setMetrics(data);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Performance Profiling</Text>

      <TouchableOpacity
        style={[styles.button, frozen && styles.buttonActive]}
        onPress={() => setFrozen(!frozen)}
      >
        <Text style={styles.buttonText}>
          {frozen ? 'Unfreeze' : 'Freeze'} Component
        </Text>
      </TouchableOpacity>

      {metrics && (
        <View style={styles.metricsBox}>
          <Text style={styles.metricLabel}>Freeze Effective:</Text>
          <Text style={styles.metricValue}>
            {metrics.freeze ? '✅ Yes' : '❌ No'}
          </Text>

          <Text style={styles.metricLabel}>Child Render Time:</Text>
          <Text style={styles.metricValue}>
            {metrics.childRenderTime.toFixed(2)} ms
          </Text>

          <Text style={styles.metricLabel}>Parent Renders:</Text>
          <Text style={styles.metricValue}>{metrics.parentRenderCount}</Text>

          <Text style={styles.metricLabel}>Child Renders:</Text>
          <Text style={styles.metricValue}>{metrics.childRenderCount}</Text>

          <Text style={styles.metricLabel}>Avg Parent Time:</Text>
          <Text style={styles.metricValue}>
            {metrics.averageParentRenderTime.toFixed(2)} ms
          </Text>

          <Text style={styles.metricLabel}>Avg Child Time:</Text>
          <Text style={styles.metricValue}>
            {metrics.averageChildRenderTime.toFixed(2)} ms
          </Text>
        </View>
      )}

      <FreezeProfiler
        freeze={frozen}
        componentName="ProfiledComponent"
        onReportedData={handleMetrics}
        enabled={true}
      >
        <ExpensiveComponent name="Profiled Component" />
      </FreezeProfiler>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>react-native-nitro-freeze</Text>
        <Text style={styles.subtitle}>Drop-in react-freeze replacement</Text>

        <NestedFreezeDemo />
        <ProfiledFreezeDemo />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  componentBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  renderCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  frozenBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    color: 'white',
    marginBottom: 12,
  },
  frozenBadgeActive: {
    backgroundColor: '#2196F3',
  },
  spinner: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerText: {
    fontSize: 32,
  },
  nestedContainer: {
    borderWidth: 2,
    borderColor: '#FF9800',
    borderRadius: 8,
    padding: 8,
  },
  nestedChild: {
    borderWidth: 2,
    borderColor: '#9C27B0',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  metricsBox: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
});
