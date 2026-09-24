import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function RewardsList({ rewards = [] }) {
  const { t } = useLanguage();
  if (!rewards || rewards.length === 0) return null;

  const renderIcon = (pos) => {
    switch (pos) {
      case 1:
        return <Text style={styles.emojiIcon}>🏆</Text>;
      case 2:
        return <Text style={styles.emojiIcon}>🥈</Text>;
      case 3:
        return <Text style={styles.emojiIcon}>🥉</Text>;
      default:
        return <Ionicons name="star-outline" size={17} color={COLORS.secondary} />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{t('rewardsSection.title')}</Text>
        <Text style={styles.subTitle}>{t('rewardsSection.allPositions')}</Text>
      </View>

      <View style={styles.list}>
        {rewards.map((reward, index) => (
          <View
            key={index}
            style={[
              styles.row,
              index !== rewards.length - 1 && styles.rowBorder,
            ]}
          >
            <View style={styles.positionWrapper}>
              <View style={styles.iconContainer}>{renderIcon(reward.position)}</View>
              <Text style={styles.positionText}>{reward.title}</Text>
            </View>

            <Text style={styles.amountText}>
              ₹ {reward.amount?.toLocaleString('en-IN')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 16,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  subTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  list: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  positionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiIcon: {
    fontSize: 16,
  },
  positionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
