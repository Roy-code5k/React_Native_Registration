import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { COLORS } from '../constants/theme';
import { listAllCompetitions } from '../services/api';

export default function ExploreScreen({
  onSelectCompetition,
  onNavigateHome,
  onNavigateProfile,
  onNavigateCompetitions,
  currentUser,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  // Auto-focus search input when screen opens to bring up keyboard
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const {
    data: competitions = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['competitions'],
    queryFn: listAllCompetitions,
  });

  const popularTags = [
    'Kathak',
    'Dance',
    'Open',
    '₹99',
    'Grand Finale',
    'Results',
  ];

  // Real-time search filter matching title, category, tags, judge, and lifecycle
  const query = searchQuery.trim().toLowerCase();
  const searchResults = competitions.filter((comp) => {
    if (!query) return true;

    const titleMatch = comp.title?.toLowerCase().includes(query);
    const categoryMatch = comp.category?.toLowerCase().includes(query);
    const tagsMatch = comp.tags?.some((t) => t.toLowerCase().includes(query));
    const judgeMatch = comp.judge?.name?.toLowerCase().includes(query);
    const slugMatch = comp.slug?.toLowerCase().includes(query);

    // Lifecycle text matches
    const isOpenMatch = query.includes('open') && comp.lifecycle === 'REGISTRATION_OPEN';
    const isFullMatch = query.includes('full') && (comp.spotsRemaining === 0 || comp.lifecycle === 'FULL');
    const isResultsMatch = query.includes('result') && comp.lifecycle === 'RESULT_PUBLISHED';

    return (
      titleMatch ||
      categoryMatch ||
      tagsMatch ||
      judgeMatch ||
      slugMatch ||
      isOpenMatch ||
      isFullMatch ||
      isResultsMatch
    );
  });

  const getStatusBadge = (lifecycle, spotsRemaining) => {
    if (spotsRemaining === 0) {
      return { text: 'Full', bg: '#FEE2E2', color: '#DC2626' };
    }
    switch (lifecycle) {
      case 'REGISTRATION_OPEN':
        return { text: 'Open', bg: '#DCFCE7', color: '#16A34A' };
      case 'SUBMISSION_OPEN':
        return { text: 'Submissions', bg: '#FEF3C7', color: '#D97706' };
      case 'RESULT_PUBLISHED':
        return { text: 'Results Out', bg: '#F3E8FF', color: '#7E22CE' };
      default:
        return { text: 'Closed', bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Header Bar */}
      <View style={styles.header}>
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="Search competitions, categories, judges..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.cancelBtn} onPress={onNavigateHome} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Popular Tags Pills */}
        <View style={styles.popularTagsSection}>
          <Text style={styles.popularLabel}>Popular searches:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsRow}>
            {popularTags.map((tag) => {
              const isActive = searchQuery.toLowerCase() === tag.toLowerCase();
              return (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagChip, isActive && styles.tagChipActive]}
                  onPress={() => setSearchQuery(isActive ? '' : tag)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.tagChipText, isActive && styles.tagChipTextActive]}>{tag}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {isLoading ? 'Searching...' : `${searchResults.length} competition${searchResults.length === 1 ? '' : 's'} found`}
          </Text>
        </View>

        {/* Loading State */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Fetching search results...</Text>
          </View>
        ) : searchResults.length === 0 ? (
          /* Empty Search State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="search-outline" size={36} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No matching competitions</Text>
            <Text style={styles.emptySubtitle}>
              We couldn't find anything matching "{searchQuery}". Try searching for "Dance", "Kathak", or "Open".
            </Text>
            <TouchableOpacity style={styles.viewAllBtn} onPress={() => setSearchQuery('')} activeOpacity={0.8}>
              <Text style={styles.viewAllBtnText}>Show All Competitions</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Search Results List */
          <View style={styles.resultsList}>
            {searchResults.map((comp) => {
              const spotsRemaining =
                comp.spotsRemaining ?? Math.max(0, (comp.maxParticipants || 20) - (comp.participantCount || 0));
              const currentBooked = comp.participantCount || 0;
              const maxSpots = comp.maxParticipants || 20;
              const progressRatio = Math.min(1, Math.max(0, currentBooked / (maxSpots || 1)));
              const isRegOpen = comp.lifecycle === 'REGISTRATION_OPEN';
              const badge = getStatusBadge(comp.lifecycle, spotsRemaining);

              return (
                <Pressable
                  key={comp.id || comp.slug}
                  style={({ pressed }) => [styles.card, pressed && { opacity: 0.95 }]}
                  onPress={() => onSelectCompetition(comp.slug)}
                >
                  {/* Top Category & Status Badge */}
                  <View style={styles.cardHeader}>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryText}>{comp.category || 'Dance'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: badge.color }]}>{badge.text}</Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text style={styles.cardTitle}>{comp.title}</Text>

                  {/* Pricing / Entry metrics */}
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
                    {isRegOpen && (
                      <>
                        <View style={styles.divider} />
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Spots Left</Text>
                          <Text style={styles.spotsValue}>{spotsRemaining} spots</Text>
                        </View>
                      </>
                    )}
                  </View>

                  {/* Spots Progress Bar - only shown if registrations are open */}
                  {isRegOpen && (
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
                  )}

                  {/* Footer Link */}
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardActionText}>
                      {isRegOpen && spotsRemaining > 0 ? 'View & Register' : 'View Details'}
                    </Text>
                    <Ionicons name="chevron-forward" size={15} color={COLORS.primary} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Global App Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={onNavigateHome} activeOpacity={0.8}>
          <Ionicons name="home-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        {/* Explore is Active */}
        <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
          <Ionicons name="search" size={20} color={COLORS.primary} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Explore</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    gap: 12,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  clearBtn: {
    padding: 4,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
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
  popularTagsSection: {
    marginBottom: 14,
  },
  popularLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tagsRow: {
    gap: 8,
  },
  tagChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMedium,
  },
  tagChipTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  resultsHeader: {
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  viewAllBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  viewAllBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  resultsList: {
    gap: 12,
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
    marginBottom: 8,
  },
  categoryPill: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
  },
  metricLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  prizeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  feeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  spotsValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressBarWrapper: {
    marginBottom: 10,
  },
  progressBarTrack: {
    height: 5,
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
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '500',
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  cardActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
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
