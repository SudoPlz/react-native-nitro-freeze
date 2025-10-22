import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Freeze } from 'react-zombie-freeze';
import { ExpensiveList } from './ExpensiveList';
import { sharedStyles } from './sharedStyles';

/**
 * Demo showing nested Freeze components
 */
export function NestedFreezeDemo() {
  const [freezeParent, setFreezeParent] = useState(false);
  const [freezeChild1, setFreezeChild1] = useState(false);
  const [freezeChild2, setFreezeChild2] = useState(false);

  return (
    <View style={sharedStyles.section}>
      <Text style={sharedStyles.sectionTitle}>Nested Freeze Demo</Text>
      <Text style={sharedStyles.description}>
        Test nesting behavior: Parent freeze affects all children.
        Child freeze only affects that subtree.
      </Text>

      {/* Parent freeze control */}
      <TouchableOpacity
        style={[sharedStyles.button, freezeParent && sharedStyles.buttonActive]}
        onPress={() => setFreezeParent(!freezeParent)}
      >
        <Text style={sharedStyles.buttonText}>
          Parent: {freezeParent ? '❄️ FROZEN' : '🔥 ACTIVE'}
        </Text>
      </TouchableOpacity>

      <Freeze freeze={freezeParent}>
        <View style={styles.parentContainer}>
          <Text style={styles.parentLabel}>PARENT CONTAINER</Text>

          {/* Child 1 controls */}
          <View style={styles.childSection}>
            <TouchableOpacity
              style={[sharedStyles.button, sharedStyles.buttonSmall, freezeChild1 && sharedStyles.buttonActive]}
              onPress={() => setFreezeChild1(!freezeChild1)}
            >
              <Text style={sharedStyles.buttonText}>
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
              style={[sharedStyles.button, sharedStyles.buttonSmall, freezeChild2 && sharedStyles.buttonActive]}
              onPress={() => setFreezeChild2(!freezeChild2)}
            >
              <Text style={sharedStyles.buttonText}>
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

const styles = StyleSheet.create({
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
});
