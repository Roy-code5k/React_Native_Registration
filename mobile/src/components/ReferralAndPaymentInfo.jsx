import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function ReferralAndPaymentInfo({ meta, onWatchVideo }) {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://feedants.com/r/referral123';

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (Platform.OS === 'web') {
      try {
        navigator.clipboard.writeText(referralLink);
      } catch {}
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Disclaimer Banner */}
      <View style={styles.disclaimerBanner}>
        <Ionicons name="information-circle-outline" size={17} color={COLORS.primary} style={{ marginTop: 1 }} />
        <Text style={styles.disclaimerText}>
          {meta?.disclaimer ||
            'Disclaimer: Only contributions from paid participants will be considered for judging.'}
        </Text>
      </View>

      {/* 2. Prize Money & Trust Info Card */}
      <View style={styles.trustCard}>
        {/* Left: Video Guide */}
        <TouchableOpacity
          style={styles.trustVideoSection}
          onPress={() => onWatchVideo && onWatchVideo('https://www.w3schools.com/html/mov_bbb.mp4', 'Prize Money Distribution Guide')}
          activeOpacity={0.7}
        >
          <View style={styles.videoPlayCircle}>
            <Ionicons name="play" size={18} color={COLORS.primary} style={{ marginLeft: 2 }} />
          </View>
          <View style={styles.videoTextContainer}>
            <Text style={styles.videoTitle}>How will you receive prize money?</Text>
            <Text style={styles.videoSubTitle}>Watch video to know more</Text>
          </View>
        </TouchableOpacity>

        {/* Vertical Divider */}
        <View style={styles.verticalDivider} />

        {/* Right: Security & Razorpay */}
        <View style={styles.trustBadgesSection}>
          <View style={styles.badgeRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.textDark} />
            <Text style={styles.badgeText}>Refund policy</Text>
          </View>

          <View style={styles.badgeRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.textDark} />
            <Text style={styles.badgeText}>
              Secure payments powered by <Text style={styles.razorpayBrand}>Razorpay</Text>
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Referral Card */}
      <View style={styles.referralCard}>
        <View style={styles.referralHeader}>
          <View style={styles.megaphoneIcon}>
            <MaterialCommunityIcons name="bullhorn-outline" size={20} color={COLORS.secondary} />
          </View>
          <Text style={styles.referralTitle}>Refer & Earn more discount</Text>
          <TouchableOpacity
            style={styles.referButton}
            onPress={handleCopyLink}
            activeOpacity={0.8}
          >
            <Text style={styles.referButtonText}>Refer Now</Text>
          </TouchableOpacity>
        </View>

        {/* Link Input Row */}
        <View style={styles.linkRow}>
          <View style={styles.linkInputContainer}>
            <Text style={styles.linkText} numberOfLines={1}>{referralLink}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyLink}
              activeOpacity={0.7}
            >
              <Text style={styles.copyButtonText}>{copied ? 'Copied!' : 'Copy Link'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.referSubtext}>
          You earn <Text style={styles.referHighlight}>₹10</Text> for every signup
        </Text>
      </View>

      {/* 4. Hear From Our Users (Testimonials teaser) */}
      <TouchableOpacity style={styles.testimonialsTeaser} activeOpacity={0.7}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={COLORS.textDark} />
        <View style={styles.testimonialContent}>
          <Text style={styles.testimonialTitle}>Hear from Our Users</Text>
          <Text style={styles.testimonialSubtitle}>See what participants say about Feedants</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>

      {/* 5. Ad Banner */}
      <View style={styles.adBanner}>
        <Ionicons name="megaphone-outline" size={16} color={COLORS.textMuted} />
        <Text style={styles.adText}>Ad Here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 18,
    gap: 12,
  },
  disclaimerBanner: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  trustCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.04)',
    elevation: 1,
  },
  trustVideoSection: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoPlayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoTextContainer: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
    lineHeight: 15,
  },
  videoSubTitle: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 48,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 8,
  },
  trustBadgesSection: {
    flex: 1,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.textMedium,
    fontWeight: '500',
  },
  razorpayBrand: {
    fontWeight: '800',
    color: '#0C2340',
    fontStyle: 'italic',
  },
  referralCard: {
    backgroundColor: '#EDFAF7',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFE7DE',
    padding: 14,
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  megaphoneIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D7F3ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  referralTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  referButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  referButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  linkRow: {
    marginTop: 10,
  },
  linkInputContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C6EAE2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 4,
  },
  linkText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMedium,
  },
  referSubtext: {
    fontSize: 11,
    color: COLORS.textMedium,
    marginTop: 8,
  },
  referHighlight: {
    fontWeight: '700',
    color: COLORS.textDark,
  },
  testimonialsTeaser: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  testimonialContent: {
    flex: 1,
  },
  testimonialTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  testimonialSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  adBanner: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FAFAFA',
    marginBottom: 8,
  },
  adText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
});
