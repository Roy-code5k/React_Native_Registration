import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useCountdown } from '../hooks/useCountdown';

export default function CountdownCard({ registrationEndsAt, lifecycleState }) {
  const { formattedString, isExpired } = useCountdown(registrationEndsAt);

  if (lifecycleState === 'REGISTRATION_CLOSED' || lifecycleState === 'FULL' || isExpired) {
    return (
      <View style={[styles.banner, styles.closedBanner]}>
        <Ionicons name="time-outline" size={16} color={COLORS.danger} />
        <Text style={styles.closedText}>Registration has ended for this round</Text>
      </View>
    );
  }

  return (
    <View style={styles.banner}>
      <View style={styles.left}>
        <Ionicons name="hourglass-outline" size={16} color={COLORS.primary} />
        <Text style={styles.label}>Registration closes in</Text>
      </View>

      <Text style={styles.timerText}>{formattedString}</Text>

      <View style={styles.right}>
        <Ionicons name="stopwatch-outline" size={15} color={COLORS.primary} />
        <Text style={styles.hurryText}>Hurry up!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.primaryLight,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
  },
  closedBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
    justifyContent: 'center',
    gap: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hurryText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  closedText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
});
