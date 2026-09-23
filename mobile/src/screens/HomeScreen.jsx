import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { COLORS } from '../constants/theme';
import { listAllCompetitions } from '../services/api';

export default function HomeScreen({
  currentUser,
  onSelectCompetition,
  onNavigateProfile,
  onNavigateAuth,
}) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const {
    data: competitions = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['competitions'],
    queryFn: listAllCompetitions,
  });

  // Filter competitions
  const filteredCompetitions = competitions.filter((comp) => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'OPEN') return comp.lifecycle === 'REGISTRATION_OPEN';
    if (selectedFilter === 'SUBMISSION') return comp.lifecycle === 'SUBMISSION_OPEN';
    if (selectedFilter === 'COMPLETED') return comp.lifecycle === 'RESULT_PUBLISHED';
    return true;
  });

  const getStatusBadge = (lifecycle, spotsRemaining, participantCount, maxParticipants) => {
    if (spotsRemaining === 0 || (maxParticipants > 0 && participantCount >= maxParticipants)) {
      return {
        text: 'Capacity Full',
        bg: '#FEE2E2',
        color: '#DC2626',
        icon: 'alert-circle',
      };
    }
    switch (lifecycle) {
      case 'REGISTRATION_OPEN':
        return {
          text: 'Registration Open',
          bg: '#DCFCE7',
          color: '#16A34A',
          icon: 'radio-button-on',
        };
      case 'SUBMISSION_OPEN':
        return {
          text: 'Submissions Open',
          bg: '#FEF3C7',
          color: '#D97706',
          icon: 'cloud-upload-outline',
        };
      case 'RESULT_PUBLISHED':
        return {
          text: 'Results Published',
          bg: '#F3E8FF',
          color: '#7E22CE',
          icon: 'trophy',
        };
      case 'JUDGING':
        return {
          text: 'Under Judging',
          bg: '#E0F2FE',
          color: '#0284C7',
          icon: 'eye-outline',
        };
      default:
        return {
          text: 'Registration Closed',
          bg: '#F3F4F6',
          color: '#6B7280',
          icon: 'time-outline',
        };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.headerBrand}>
            <View style={styles.logoBadge}>
              <Ionicons name="trophy" size={20} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.brandTitle}>Feedants</Text>
              <Text style={styles.brandSubtitle}>Online Talent Competitions</Text>
            </View>
          </View>

          {/* User Auth Chip */}
          {currentUser ? (
            <TouchableOpacity style={styles.userChip} onPress={onNavigateProfile} activeOpacity={0.8}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={13} color={COLORS.primary} />
              </View>
              <Text style={styles.userNameText} numberOfLines={1}>
                {currentUser.name?.split(' ')[0] || 'Profile'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginBtn} onPress={onNavigateAuth} activeOpacity={0.8}>
              <Ionicons name="log-in-outline" size={16} color={COLORS.primary} />
              <Text style={styles.loginBtnText}>Log In</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroContent}>
            <View style={styles.featuredBadge}>
              <Ionicons name="sparkles" size={12} color="#D97706" />
              <Text style={styles.featuredBadgeText}>FEATURED EVENT</Text>
            </View>
            <Text style={styles.heroTitle}>Feedants Classical Dance 2026</Text>
            <Text style={styles.heroSubtitle}>
              Judged by Professional Kathak Dancer Manju Dubey. Guaranteed certificate & rewards!
            </Text>
            <Pressable
              style={styles.heroBtn}
              onPress={() => onSelectCompetition('classical-dance-2026')}
            >
              <Text style={styles.heroBtnText}>View Details & Register</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </Pressable>
          </View>
        </View>

        {/* Section Heading & Filter Tabs */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Browse Competitions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {[
              { id: 'ALL', label: 'All Events' },
              { id: 'OPEN', label: '🟢 Open' },
              { id: 'SUBMISSION', label: '🟡 Submissions' },
              { id: 'COMPLETED', label: '🟣 Results Out' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.filterChip, selectedFilter === tab.id && styles.filterChipActive]}
                onPress={() => setSelectedFilter(tab.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === tab.id && styles.filterChipTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Competitions List */}
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading live competitions...</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={32} color={COLORS.danger} />
            <Text style={styles.errorTitle}>Could not load competitions</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardsList}>
            {filteredCompetitions.map((comp) => {
              const spotsRemaining =
                comp.spotsRemaining ?? Math.max(0, (comp.maxParticipants || 20) - (comp.participantCount || 0));
              const currentBooked = comp.participantCount || 0;
              const maxSpots = comp.maxParticipants || 20;
              const progressRatio = Math.min(1, Math.max(0, currentBooked / (maxSpots || 1)));
              const badge = getStatusBadge(
                comp.lifecycle,
                spotsRemaining,
                currentBooked,
                maxSpots
              );

              return (
                <Pressable
                  key={comp.id || comp.slug}
                  style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
                  onPress={() => onSelectCompetition(comp.slug)}
                >
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryText}>{comp.category || 'Dance'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <Ionicons name={badge.icon} size={12} color={badge.color} />
                      <Text style={[styles.statusText, { color: badge.color }]}>{badge.text}</Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={styles.cardTitle}>{comp.title}</Text>

                  {/* Pricing / Prize Metrics */}
                  <View style={styles.metricsRow}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Prize Pool</Text>
                      <Text style={styles.prizeValue}>₹ {comp.prizePool?.toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Entry Fee</Text>
                      <Text style={styles.feeValue}>₹ {comp.entryFee}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>Spots Left</Text>
                      <Text style={styles.spotsValue}>{spotsRemaining} spots</Text>
                    </View>
                  </View>

                  {/* Spots Progress Bar */}
                  <View style={styles.progressBarWrapper}>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.round(progressRatio * 100)}%`,
                            backgroundColor: spotsRemaining === 0 ? COLORS.danger : COLORS.primary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.bookedText}>
                      {currentBooked} / {maxSpots} Booked
                    </Text>
                  </View>

                  {/* Card Footer CTA */}
                  <View style={styles.cardFooter}>
                    <Text style={styles.viewDetailsText}>
                      {comp.lifecycle === 'REGISTRATION_OPEN' && spotsRemaining > 0
                        ? 'View Details & Register'
                        : 'View Details'}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Global Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Ionicons name="home" size={20} color={COLORS.primary} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onSelectCompetition('classical-dance-2026')}
          activeOpacity={0.8}
        >
          <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Explore</Text>
        </TouchableOpacity>

        <View style={styles.centerAddButton}>
          <View style={styles.addCircle}>
            <Ionicons name="add" size={26} color={COLORS.white} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onSelectCompetition('classical-dance-2026')}
          activeOpacity={0.8}
        >
          <Ionicons name="trophy-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Competitions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onNavigateProfile} activeOpacity={0.8}>
          <View style={styles.navAvatarPlaceholder}>
            <Ionicons name="person" size={13} color={COLORS.textMuted} />
          </View>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 5px rgba(15, 107, 114, 0.3)',
    elevation: 3,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    maxWidth: 70,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  loginBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  heroBanner: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 10px rgba(10, 73, 78, 0.25)',
    elevation: 4,
  },
  heroContent: {
    gap: 8,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.white,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 17,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 6,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  heroBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  filterSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  filterRow: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  cardsList: {
    gap: 14,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.04)',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  prizeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  spotsValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarWrapper: {
    marginBottom: 12,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  bookedText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  loadingBox: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  errorBox: {
    padding: 30,
    alignItems: 'center',
    gap: 8,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  retryBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingBottom: 4,
    boxShadow: '0px -2px 5px rgba(0, 0, 0, 0.05)',
    elevation: 6,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
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
  navAvatarPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
