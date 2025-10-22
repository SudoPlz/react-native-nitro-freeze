import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePatchStatus } from '../hooks';

/**
 * Patch Status Component
 */
export function PatchStatus() {
  const { isPatched, patchDetails } = usePatchStatus();

  return (
    <View style={styles.patchStatusContainer}>
      <Text style={styles.patchStatusTitle}>Patch Status</Text>
      <Text style={[
        styles.patchStatusText,
        isPatched ? styles.patchStatusSuccess : styles.patchStatusError
      ]}>
        {patchDetails}
      </Text>
      {!isPatched && (
        <View style={styles.patchInstructions}>
          <Text style={styles.patchInstructionsTitle}>To apply the patch:</Text>
          <Text style={styles.patchInstructionsText}>
            1. Run: npx react-zombie-freeze setup
          </Text>
          <Text style={styles.patchInstructionsText}>
            2. Or manually: npx patch-package
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  patchStatusContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  patchStatusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  patchStatusText: {
    fontSize: 14,
    marginBottom: 8,
  },
  patchStatusSuccess: {
    color: '#059669',
  },
  patchStatusError: {
    color: '#DC2626',
  },
  patchInstructions: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  patchInstructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 6,
  },
  patchInstructionsText: {
    fontSize: 12,
    color: '#92400E',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
});
