import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function ProfileScreen({
  user,
  onLogout,
  onGoBack,
  onNavigateCompetitions,
  onNavigateHome,
}) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.backButton} onPress={onGoBack} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
            <Text style={styles.backText}>Back to Competition</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {user?.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={44} color="#9CA3AF" />
            </View>
          )}
          <Text style={styles.userName}>{user?.name || 'Participant'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>

          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} />
            <Text style={styles.verifiedText}>Verified Feedants Participant</Text>
          </View>
        </View>

        {/* User Account Info Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account Details</Text>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user?.name || 'Participant'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <View style={styles.iconCircle}>
              <Ionicons name="gift-outline" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Referral Code</Text>
              <Text style={styles.infoValue}>{user?.referralCode || 'feed_referral123'}</Text>
            </View>
          </View>
        </View>

        {/* Active Competitions Participated */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>My Competitions</Text>

          <TouchableOpacity
            style={styles.compCard}
            onPress={onNavigateCompetitions}
            activeOpacity={0.8}
          >
            <View style={styles.compLeft}>
              <Ionicons name="trophy" size={24} color={COLORS.primary} />
              <View>
                <Text style={styles.compTitle}>Feedants Classical Dance</Text>
                <Text style={styles.compSub}>Active Round • Dance Category</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Security & Token Info */}
        <View style={styles.securityBox}>
          <Ionicons name="lock-closed" size={16} color={COLORS.primary} />
          <Text style={styles.securityText}>
            Session authenticated with JWT encryption.
          </Text>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navItem} onPress={onNavigateHome} activeOpacity={0.7}>
          <Ionicons name="home-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onNavigateCompetitions} activeOpacity={0.7}>
          <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerAddButton} onPress={onNavigateCompetitions} activeOpacity={0.85}>
          <View style={styles.addCircle}>
            <Ionicons name="add" size={26} color={COLORS.white} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={onNavigateCompetitions} activeOpacity={0.7}>
          <Ionicons name="trophy-outline" size={20} color={COLORS.textMuted} />
          <Text style={styles.navLabel}>Competitions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <View style={styles.activeAvatarWrapper}>
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={styles.profileAvatar} />
            ) : (
              <View style={styles.navAvatarPlaceholder}>
                <Ionicons name="person" size={13} color={COLORS.primary} />
              </View>
            )}
          </View>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Profile</Text>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
    elevation: 2,
    marginBottom: 16,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: COLORS.primaryTint,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
    elevation: 1,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 1,
  },
  compCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  compLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  compTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  compSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  securityText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutButtonText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: COLORS.white,
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
  activeAvatarWrapper: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 1,
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
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
