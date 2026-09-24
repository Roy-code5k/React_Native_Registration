import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function TopHeader({ onGoBack }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textDark} />
          <Text style={styles.backText}>{t('goBack')}</Text>
        </TouchableOpacity>

        <View style={styles.langContainer}>
          <TouchableOpacity
            style={[styles.langPill, language === 'ENG' && styles.langPillActive]}
            onPress={() => setLanguage('ENG')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, language === 'ENG' && styles.langTextActive]}>
              ENG
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langPill, language === 'HI' && styles.langPillActive]}
            onPress={() => setLanguage('HI')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langText, language === 'HI' && styles.langTextActive]}>
              हिंदी
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  langContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    padding: 3,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  langPillActive: {
    backgroundColor: COLORS.primary,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  langTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
});
