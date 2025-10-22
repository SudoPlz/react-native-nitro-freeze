import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';

interface ExpensiveListProps {
  title: string;
  color: string;
}

/**
 * Expensive component that renders many items and animates
 * Perfect for testing freeze performance
 */
export function ExpensiveList({ title, color }: ExpensiveListProps) {
  const [count, setCount] = useState(0);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Log every render to verify Freeze is working
  console.log(`[ExpensiveList] Render with count=${count}, title=${title}`);

  // Auto-increment counter
  // When frozen with Offscreen, React won't call this component at all
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

const styles = StyleSheet.create({
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
});
