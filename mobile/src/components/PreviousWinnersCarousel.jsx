import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function PreviousWinnersCarousel({ winners = [], onWatchVideo }) {
  if (!winners || winners.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Previous Winners</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {winners.map((winner, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => onWatchVideo && onWatchVideo(winner.video, `${winner.name} - ${winner.position}`)}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: winner.image }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
              <View style={styles.playOverlay}>
                <Ionicons name="play" size={14} color={COLORS.primary} style={{ marginLeft: 2 }} />
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.name} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={styles.position} numberOfLines={1}>
                {winner.position}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 6,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 145,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  imageWrapper: {
    position: 'relative',
    width: 52,
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  position: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 2,
  },
});
