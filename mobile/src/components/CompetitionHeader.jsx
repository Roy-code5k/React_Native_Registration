import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function CompetitionHeader({ competition, isRegistered }) {
  if (!competition) return null;

  const currentBooked = competition.participants?.current ?? 0;
  const maxSpots = competition.participants?.maximum ?? 20;
  const spotsLeft = competition.participants?.remaining ?? (maxSpots - currentBooked);
  const progressRatio = Math.min(1, Math.max(0, currentBooked / (maxSpots || 1)));

  return (
    <View style={styles.card}>
      {/* Title & Registered Badge */}
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={2}>
          {competition.title}
        </Text>

        {isRegistered ? (
          <View style={styles.registeredBadge}>
            <Ionicons name="checkmark-circle" size={15} color={COLORS.primary} />
            <Text style={styles.registeredText}>Registered</Text>
          </View>
        ) : spotsLeft === 0 ? (
          <View style={styles.fullBadge}>
            <Text style={styles.fullText}>Full</Text>
          </View>
        ) : null}
      </View>

      {/* Tags Row */}
      <View style={styles.tagsRow}>
        {competition.tags?.map((tag, idx) => (
          <View key={idx} style={styles.tagPill}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}

        {competition.certificateText ? (
          <View style={styles.certContainer}>
            <Ionicons name="trophy-outline" size={14} color={COLORS.primary} />
            <Text style={styles.certText}>{competition.certificateText}</Text>
          </View>
        ) : null}
      </View>

      {/* Stats Row */}
      <View style={styles.statsContainer}>
        {/* Prize Pool */}
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Prize Pool</Text>
          <Text style={styles.prizeValue}>₹ {competition.prizePool?.toLocaleString('en-IN')}</Text>
        </View>

        {/* Entry Fee */}
        <View style={styles.statColumn}>
          <Text style={styles.statLabel}>Entry Fee</Text>
          <Text style={styles.feeValue}>₹ {competition.entryFee}</Text>
        </View>

        {/* Spots & Progress */}
        <View style={styles.spotsColumn}>
          <View style={styles.spotsHeader}>
            <Ionicons name="people-outline" size={14} color={COLORS.primary} />
            <Text style={styles.spotsLeftText}>
              {spotsLeft > 0 ? `Only ${spotsLeft} spots left` : 'All spots filled'}
            </Text>
          </View>

          {/* Progress Bar Track */}
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.round(progressRatio * 100)}%` },
              ]}
            />
          </View>

          <Text style={styles.bookedText}>
            {currentBooked} / {maxSpots} Booked
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    letterSpacing: -0.3,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  registeredText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  fullBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  fullText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  tagPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.textMedium,
    fontWeight: '500',
  },
  certContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 2,
  },
  certText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  statColumn: {
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
    fontWeight: '500',
  },
  prizeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  feeValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  spotsColumn: {
    minWidth: 120,
    alignItems: 'flex-end',
  },
  spotsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  spotsLeftText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarTrack: {
    width: 120,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  bookedText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
});
