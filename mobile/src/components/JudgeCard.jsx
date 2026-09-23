import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function JudgeCard({ judge, onWatchIntro }) {
  if (!judge) return null;

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: judge.image }}
        style={styles.avatar}
        resizeMode="cover"
      />

      <View style={styles.info}>
        <Text style={styles.label}>Judge</Text>
        <Text style={styles.name}>{judge.name}</Text>
        <Text style={styles.designation}>{judge.designation}</Text>
        <Text style={styles.experience}>{judge.experience}</Text>
      </View>

      <TouchableOpacity
        style={styles.videoAction}
        onPress={() => onWatchIntro && onWatchIntro(judge.introVideo || 'https://www.w3schools.com/html/mov_bbb.mp4', `${judge.name} - Intro Video`)}
        activeOpacity={0.7}
      >
        <View style={styles.playButtonCircle}>
          <Ionicons name="play" size={20} color={COLORS.primary} style={{ marginLeft: 2 }} />
        </View>
        <Text style={styles.videoLabel}>Intro Video</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
    elevation: 1,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.5,
    borderColor: COLORS.primaryTint,
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  designation: {
    fontSize: 12,
    color: COLORS.textMedium,
    fontWeight: '500',
  },
  experience: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  videoAction: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  playButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryTint,
  },
  videoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMedium,
    marginTop: 4,
  },
});
