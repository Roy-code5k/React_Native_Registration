import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function DemoToolbar({
  currentUser,
  onSwitchUser,
  currentCompSlug,
  onSelectCompetition,
  onResetRegistration,
  isRegistered,
  onOpenAuthOrProfile,
}) {
  const [expanded, setExpanded] = useState(false);

  const competitionOptions = [
    { slug: 'classical-dance-2026', label: '1. Default: Classical Dance (Open)' },
    { slug: 'classical-dance-full', label: '2. Capacity Full (10/10 Booked)' },
    { slug: 'classical-dance-closed', label: '3. Registration Closed' },
    { slug: 'classical-dance-results', label: '4. Results Published' },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleBar}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>REVIEWER CONTROLS</Text>
        </View>
        <Text style={styles.statusSummary} numberOfLines={1}>
          User: {currentUser?.name || 'Guest'} • {isRegistered ? 'Registered' : 'Not Registered'}
        </Text>
        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-up'}
          size={18}
          color={COLORS.white}
        />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.panel}>
          {/* User selector */}
          <Text style={styles.sectionHeader}>Switch Active User:</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.smallBtn, currentUser?.email === 'demo@example.com' && styles.smallBtnActive]}
              onPress={() => onSwitchUser('demo@example.com')}
            >
              <Text style={[styles.btnText, currentUser?.email === 'demo@example.com' && styles.btnTextActive]}>
                Demo User
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallBtn, currentUser?.email === 'pooja@example.com' && styles.smallBtnActive]}
              onPress={() => onSwitchUser('pooja@example.com')}
            >
              <Text style={[styles.btnText, currentUser?.email === 'pooja@example.com' && styles.btnTextActive]}>
                Pooja (Registered)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallBtn, !currentUser && styles.smallBtnActive]}
              onPress={() => onSwitchUser(null)}
            >
              <Text style={[styles.btnText, !currentUser && styles.btnTextActive]}>Guest</Text>
            </TouchableOpacity>

            {onOpenAuthOrProfile && (
              <TouchableOpacity
                style={[styles.smallBtn, { backgroundColor: '#0284C7' }]}
                onPress={onOpenAuthOrProfile}
              >
                <Text style={[styles.btnText, { color: COLORS.white, fontWeight: '700' }]}>
                  {currentUser ? '👤 Profile' : '🔑 Log In'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Competition Switcher */}
          <Text style={[styles.sectionHeader, { marginTop: 10 }]}>Test Lifecycle States:</Text>
          <View style={styles.compList}>
            {competitionOptions.map((opt) => (
              <TouchableOpacity
                key={opt.slug}
                style={[styles.compOption, currentCompSlug === opt.slug && styles.compOptionActive]}
                onPress={() => onSelectCompetition(opt.slug)}
              >
                <Ionicons
                  name={currentCompSlug === opt.slug ? 'radio-button-on' : 'radio-button-off'}
                  size={14}
                  color={currentCompSlug === opt.slug ? COLORS.primary : COLORS.textMuted}
                />
                <Text
                  style={[styles.compOptionText, currentCompSlug === opt.slug && styles.compOptionTextActive]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Reset Action */}
          {currentUser && (
            <TouchableOpacity style={styles.resetBtn} onPress={onResetRegistration}>
              <Ionicons name="refresh-outline" size={14} color="#DC2626" />
              <Text style={styles.resetBtnText}>Reset Demo Registration State</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  toggleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusSummary: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 11,
    marginHorizontal: 10,
  },
  panel: {
    padding: 14,
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  sectionHeader: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  smallBtnActive: {
    backgroundColor: COLORS.primary,
  },
  btnText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
  },
  btnTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  compList: {
    gap: 4,
  },
  compOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  compOptionActive: {
    backgroundColor: '#F8FAFC',
  },
  compOptionText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '500',
  },
  compOptionTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    borderRadius: 6,
  },
  resetBtnText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '700',
  },
});
