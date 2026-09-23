import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function VideoModal({ visible, onClose, videoUrl, title }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{title || 'Video Preview'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Video Placeholder Screen */}
          <View style={styles.videoPlayerContainer}>
            <View style={styles.mockVideoScreen}>
              <View style={styles.largePlayCircle}>
                <Ionicons name="play" size={36} color={COLORS.primary} style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.videoNotice}>Playing high-definition stream</Text>
              <Text style={styles.videoLinkText} numberOfLines={1}>{videoUrl}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Close Preview</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  videoPlayerContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockVideoScreen: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  largePlayCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
    elevation: 6,
  },
  videoNotice: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  videoLinkText: {
    color: '#94A3B8',
    fontSize: 11,
    maxWidth: 300,
    textAlign: 'center',
  },
  doneBtn: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  doneBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
