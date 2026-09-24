import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function CompetitionTabs({ description, judgingParameters = [], rules = [], eligibility = [] }) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'judging' | 'rules'
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.card}>
      {/* Tabs Header */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'about' && styles.tabItemActive]}
          onPress={() => setActiveTab('about')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabTitle, activeTab === 'about' && styles.tabTitleActive]}>
            {t('tabs.about')}
          </Text>
          {activeTab === 'about' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'judging' && styles.tabItemActive]}
          onPress={() => setActiveTab('judging')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabTitle, activeTab === 'judging' && styles.tabTitleActive]}>
            {t('tabs.judging')}
          </Text>
          {activeTab === 'judging' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'rules' && styles.tabItemActive]}
          onPress={() => setActiveTab('rules')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabTitle, activeTab === 'rules' && styles.tabTitleActive]}>
            {t('tabs.rules')}
          </Text>
          {activeTab === 'rules' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {/* About Tab */}
        {activeTab === 'about' && (
          <View>
            <Text style={styles.descriptionText} numberOfLines={isExpanded ? undefined : 3}>
              {description ||
                (language === 'HI'
                  ? 'यह सभी आयु समूहों के लिए खुली एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है।'
                  : 'This is an online classical dance competition open for all age groups.')}
            </Text>

            {isExpanded && (
              <View style={styles.moreAboutContainer}>
                <Text style={styles.moreAboutTitle}>{t('tabs.highlightsTitle')}</Text>
                <Text style={styles.moreAboutText}>
                  {language === 'HI'
                    ? '• गुरु मंजू दुबे द्वारा हस्ताक्षरित आधिकारिक योग्यता प्रमाण पत्र।'
                    : '• Official Certificate of Merit signed by Guru Manju Dubey.'}
                </Text>
                <Text style={styles.moreAboutText}>
                  {language === 'HI'
                    ? '• सभी प्रतिभागियों के लिए सीधा रचनात्मक वीडियो फीडबैक।'
                    : '• Direct constructive video feedback for all participants.'}
                </Text>
                <Text style={styles.moreAboutText}>
                  {language === 'HI'
                    ? '• परिणाम घोषणा के 48 घंटों के भीतर सीधे बैंक खाते में नकद पुरस्कार।'
                    : '• Cash prize distribution direct to bank account via Razorpay within 48 hours of result announcement.'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => setIsExpanded(!isExpanded)}
              activeOpacity={0.7}
            >
              <Text style={styles.viewMoreText}>
                {isExpanded ? t('tabs.viewLess') : t('tabs.viewMore')}
              </Text>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Judging Parameters Tab */}
        {activeTab === 'judging' && (
          <View style={styles.judgingList}>
            {judgingParameters.map((param, index) => (
              <View key={index} style={styles.judgingItem}>
                <View style={styles.judgingHeader}>
                  <Text style={styles.judgingName}>{param.name}</Text>
                  <Text style={styles.judgingWeight}>{param.weight}%</Text>
                </View>
                <View style={styles.weightTrack}>
                  <View style={[styles.weightFill, { width: `${param.weight}%` }]} />
                </View>
                {param.description ? (
                  <Text style={styles.judgingDesc}>{param.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* Rules & Eligibility Tab */}
        {activeTab === 'rules' && (
          <View style={styles.rulesContainer}>
            <Text style={styles.subHeader}>{t('tabs.officialRules')}</Text>
            {rules.map((rule, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}

            <Text style={[styles.subHeader, { marginTop: 14 }]}>{t('tabs.eligibilityCriteria')}</Text>
            {eligibility.map((el, idx) => (
              <View key={idx} style={styles.bulletRow}>
                <Text style={styles.bullet}>✔</Text>
                <Text style={styles.ruleText}>{el}</Text>
              </View>
            ))}
          </View>
        )}
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
    overflow: 'hidden',
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
    elevation: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: '#FAFAFA',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: COLORS.white,
  },
  tabTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  tabTitleActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    right: '15%',
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  content: {
    padding: 16,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textMedium,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
    alignSelf: 'center',
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  moreAboutContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    gap: 4,
  },
  moreAboutTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  moreAboutText: {
    fontSize: 12,
    color: COLORS.textMedium,
    lineHeight: 18,
  },
  judgingList: {
    gap: 12,
  },
  judgingItem: {
    gap: 4,
  },
  judgingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  judgingName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  judgingWeight: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  weightTrack: {
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 2,
  },
  weightFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  judgingDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  rulesContainer: {
    gap: 6,
  },
  subHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  ruleText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textMedium,
    lineHeight: 18,
  },
});
