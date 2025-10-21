import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Freeze, FreezeProfiler } from 'react-native-nitro-freeze';

/**
 * Expensive component that renders many items and animates
 * Perfect for testing freeze performance
 */
function ExpensiveList({ title, color }: { title: string; color: string }) {
  const [count, setCount] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Auto-increment counter to show when frozen
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Continuous animation to show when frozen
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [fadeAnim]);

  return (
    <View style={[styles.expensiveContainer, { backgroundColor: color }]}>
      <Text style={styles.expensiveTitle}>{title}</Text>
      <Text style={styles.counter}>Count: {count}</Text>
      <Animated.View style={[styles.animatedBox, { opacity: fadeAnim }]}>
        <Text style={styles.animatedText}>Animating...</Text>
      </Animated.View>
      <ScrollView style={styles.itemList}>
        {Array.from({ length: 50 }).map((_, i) => (
          <Text key={i} style={styles.item}>
            Item {i + 1}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

/**
 * Demo showing nested Freeze components
 */
function NestedFreezeDemo() {
  const [freezeParent, setFreezeParent] = useState(false);
  const [freezeChild1, setFreezeChild1] = useState(false);
  const [freezeChild2, setFreezeChild2] = useState(false);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Nested Freeze Demo</Text>
      <Text style={styles.description}>
        Test nesting behavior: Parent freeze affects all children.
        Child freeze only affects that subtree.
      </Text>

      {/* Parent freeze control */}
      <TouchableOpacity
        style={[styles.button, freezeParent && styles.buttonActive]}
        onPress={() => setFreezeParent(!freezeParent)}
      >
        <Text style={styles.buttonText}>
          Parent: {freezeParent ? '❄️ FROZEN' : '🔥 ACTIVE'}
        </Text>
      </TouchableOpacity>

      <Freeze freeze={freezeParent}>
        <View style={styles.parentContainer}>
          <Text style={styles.parentLabel}>PARENT CONTAINER</Text>

          {/* Child 1 controls */}
          <View style={styles.childSection}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSmall, freezeChild1 && styles.buttonActive]}
              onPress={() => setFreezeChild1(!freezeChild1)}
            >
              <Text style={styles.buttonText}>
                Child 1: {freezeChild1 ? '❄️' : '🔥'}
              </Text>
            </TouchableOpacity>

            <Freeze freeze={freezeChild1}>
              <ExpensiveList title="Child 1" color="#FFE5E5" />
            </Freeze>
          </View>

          {/* Child 2 controls */}
          <View style={styles.childSection}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSmall, freezeChild2 && styles.buttonActive]}
              onPress={() => setFreezeChild2(!freezeChild2)}
            >
              <Text style={styles.buttonText}>
                Child 2: {freezeChild2 ? '❄️' : '🔥'}
              </Text>
            </TouchableOpacity>

            <Freeze freeze={freezeChild2}>
              <ExpensiveList title="Child 2" color="#E5F5FF" />
            </Freeze>
          </View>
        </View>
      </Freeze>
    </View>
  );
}

/**
 * Demo with performance profiling
 */
function ProfiledFreezeDemo() {
  const [freeze, setFreeze] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Performance Profiling Demo</Text>
      <Text style={styles.description}>
        Watch render times drop to 0ms when frozen!
      </Text>

      <TouchableOpacity
        style={[styles.button, freeze && styles.buttonActive]}
        onPress={() => setFreeze(!freeze)}
      >
        <Text style={styles.buttonText}>
          {freeze ? '❄️ FROZEN' : '🔥 ACTIVE'}
        </Text>
      </TouchableOpacity>

      {metrics && (
        <View style={styles.metricsContainer}>
          <Text style={styles.metricsTitle}>Performance Metrics:</Text>
          <Text style={styles.metricsText}>
            Parent Renders: {metrics.parentRenderCount}
          </Text>
          <Text style={styles.metricsText}>
            Child Renders: {metrics.childRenderCount}
          </Text>
          <Text style={styles.metricsText}>
            Avg Parent Time: {metrics.averageParentRenderTime.toFixed(2)}ms
          </Text>
          <Text style={styles.metricsText}>
            Avg Child Time: {metrics.averageChildRenderTime.toFixed(2)}ms
          </Text>
          <Text style={[styles.metricsText, metrics.freeze && styles.metricsHighlight]}>
            Freeze Effective: {metrics.freeze ? '✅ YES' : '❌ NO'}
          </Text>
        </View>
      )}

      <FreezeProfiler
        freeze={freeze}
        componentName="ProfiledList"
        onReportedData={setMetrics}
      >
        <ExpensiveList title="Profiled Component" color="#F0F0FF" />
      </FreezeProfiler>
    </View>
  );
}

/**
 * Main App
 */
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>react-native-nitro-freeze</Text>
          <Text style={styles.subtitle}>
            Drop-in replacement for react-freeze
          </Text>
          <Text style={styles.subtitle}>
            No Suspense • Fabric-safe • NitroModule-powered
          </Text>
        </View>

        <ProfiledFreezeDemo />
        <NestedFreezeDemo />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#E0E7FF',
    textAlign: 'center',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
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
    color: '#1F2937',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonActive: {
    backgroundColor: '#3B82F6',
  },
  buttonSmall: {
    padding: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  parentContainer: {
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  parentLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 12,
    textAlign: 'center',
  },
  childSection: {
    marginTop: 12,
  },
  expensiveContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  expensiveTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  counter: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  animatedBox: {
    backgroundColor: '#4F46E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  animatedText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  itemList: {
    maxHeight: 200,
  },
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  metricsContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  metricsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  metricsText: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 4,
  },
  metricsHighlight: {
    fontWeight: 'bold',
    color: '#059669',
  },
});

