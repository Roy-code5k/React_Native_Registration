import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function StickyBottomActionBar({
  competition,
  userState,
  actions,
  onPressAction,
  isLoading,
}) {
  const isRegistered = userState?.isRegistered;
  const submissionStatus = userState?.submissionStatus;
  const lifecycle = competition?.lifecycle?.state;
  const entryFee = competition?.entryFee ?? 99;

  // Render appropriate CTA button based on state
  const renderCtaContent = () => {
    if (isLoading) {
      return <ActivityIndicator color={COLORS.white} size="small" />;
    }

    if (submissionStatus === 'SUBMITTED' || submissionStatus === 'ACCEPTED') {
      return (
        <View style={styles.ctaTextContainer}>
          <Text style={styles.ctaPrimaryText}>Submission Uploaded</Text>
          <Text style={styles.ctaSubText}>Under Evaluation by Judge</Text>
        </View>
      );
    }

    if (isRegistered) {
      if (actions?.canSubmit) {
        return (
          <View style={styles.ctaTextContainer}>
            <Text style={styles.ctaPrimaryText}>Upload Submission</Text>
            <Text style={styles.ctaSubText}>Registered</Text>
          </View>
        );
      }
      return (
        <View style={styles.ctaTextContainer}>
          <Text style={styles.ctaPrimaryText}>Registered</Text>
          <Text style={styles.ctaSubText}>Submission Window Pending</Text>
        </View>
      );
    }

    if (actions?.canRegister) {
      return (
        <View style={styles.registerCtaContainer}>
          <Text style={styles.ctaPrimaryText}>Register Now</Text>
          <View style={styles.feeBadge}>
            <Text style={styles.feeBadgeText}>₹{entryFee}</Text>
          </View>
        </View>
      );
    }

    if (lifecycle === 'FULL' || actions?.reason === 'COMPETITION_FULL') {
      return (
        <View style={styles.ctaTextContainer}>
          <Text style={styles.ctaPrimaryText}>Competition Full</Text>
          <Text style={styles.ctaSubText}>No spots remaining</Text>
        </View>
      );
    }

    if (lifecycle === 'RESULT_PUBLISHED') {
      return (
        <View style={styles.ctaTextContainer}>
          <Text style={styles.ctaPrimaryText}>View Results</Text>
          <Text style={styles.ctaSubText}>Winners Announced</Text>
        </View>
      );
    }

    return (
      <View style={styles.ctaTextContainer}>
        <Text style={styles.ctaPrimaryText}>Registration Closed</Text>
        <Text style={styles.ctaSubText}>Entry window has ended</Text>
      </View>
    );
  };

  const isButtonDisabled =
    isLoading ||
    (!actions?.canRegister &&
      !actions?.canSubmit &&
      submissionStatus !== 'NOT_SUBMITTED' &&
      lifecycle !== 'RESULT_PUBLISHED');

  return (
    <View style={styles.wrapper}>
      {/* Dynamic CTA Button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.ctaButton,
            isButtonDisabled && styles.ctaDisabled,
          ]}
          onPress={onPressAction}
          disabled={isButtonDisabled}
          activeOpacity={0.85}
        >
          {renderCtaContent()}
        </TouchableOpacity>
      </View>

      {/* Global App Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="home-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerAddButton} activeOpacity={0.85}>
          <View style={styles.addCircle}>
            <Ionicons name="add" size={26} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Ionicons name="trophy" size={20} color={COLORS.primary} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Competitions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }}
            style={styles.profileAvatar}
          />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 6,
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  ctaButton: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: {
    backgroundColor: '#94A3B8',
  },
  ctaTextContainer: {
    alignItems: 'center',
  },
  ctaPrimaryText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  ctaSubText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  registerCtaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  feeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  feeBadgeText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
    minWidth: 55,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  centerAddButton: {
    top: -12,
  },
  addCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  profileAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});
