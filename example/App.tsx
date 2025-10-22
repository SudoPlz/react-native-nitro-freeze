import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NestedFreezeDemo, PatchStatus, ProfiledFreezeDemo, VisibleFreezeDemo } from './components';



/**
 * Main App
 */
export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>react-zombie-freeze</Text>
          <Text style={styles.subtitle}>
            Drop-in replacement for react-freeze
          </Text>
          <Text style={styles.subtitle}>
            No Suspense • Fabric-safe • Zero native code
          </Text>
        </View>
        
        <PatchStatus />
        
        {/* <NestedFreezeDemo />
        <ProfiledFreezeDemo /> */}
        <VisibleFreezeDemo />
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
});