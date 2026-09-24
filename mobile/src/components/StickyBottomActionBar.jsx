import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function StickyBottomActionBar({
  competition,
  userState,
  actions,
  onPressAction,
  isLoading,
  onNavigateProfile,
  onNavigateCompetitions,
  onNavigateHome,
  onNavigateExplore,
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
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            isButtonDisabled && styles.ctaDisabled,
            pressed && !isButtonDisabled && { opacity: 0.85 },
          ]}
          onPress={!isButtonDisabled ? onPressAction : undefined}
          accessibilityRole="button"
        >
          {renderCtaContent()}
        </Pressable>
      </View>

      {/* Global App Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={onNavigateHome} activeOpacity={0.7}>
          <Ionicons name="home-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onNavigateExplore} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerAddButton} activeOpacity={0.85}>
          <View style={styles.addCircle}>
            <Ionicons name="add" size={26} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onNavigateCompetitions} activeOpacity={0.7}>
          <Ionicons name="trophy" size={20} color={COLORS.primary} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Competitions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onNavigateProfile} activeOpacity={0.7}>
          {userState?.user?.profileImage ? (
            <Image
              source={{ uri: userState.user.profileImage }}
              style={styles.profileAvatar}
            />
          ) : (
            <View style={styles.navAvatarPlaceholder}>
              <Ionicons name="person" size={13} color={COLORS.textMuted} />
            </View>
          )}
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
    boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.05)',
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
    boxShadow: '0px 3px 6px rgba(15, 107, 114, 0.35)',
    elevation: 4,
  },
  profileAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  navAvatarPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
