import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const formatDateTime = (dateString, fallbackDate = '10 Aug 26', fallbackTime = '11:50 PM') => {
  if (!dateString) return { date: fallbackDate, time: fallbackTime };
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return { date: fallbackDate, time: fallbackTime };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = String(d.getFullYear()).slice(-2);

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12';

    return {
      date: `${day} ${month} ${year}`,
      time: `${hours}:${minutes} ${ampm}`,
    };
  } catch {
    return { date: fallbackDate, time: fallbackTime };
  }
};

export default function ImportantDatesCard({ lifecycle }) {
  const regEnd = formatDateTime(lifecycle?.registrationEndsAt, '10 Aug 26', '11:50 PM');
  const subStart = formatDateTime(lifecycle?.submissionStartsAt, '6 Aug 26', '04:00 AM');
  const subEnd = formatDateTime(lifecycle?.submissionEndsAt, '30 Aug 26', '11:55 PM');
  const resDate = formatDateTime(lifecycle?.resultDate, '1 Sept 26', '11:50 PM');

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Important Dates</Text>

      <View style={styles.card}>
        {/* Row 1 */}
        <View style={styles.row}>
          {/* Register Before */}
          <View style={[styles.cell, styles.rightBorder]}>
            <View style={styles.iconCircle}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Register Before</Text>
              <Text style={styles.cellDate}>{regEnd.date}</Text>
              <Text style={styles.cellTime}>{regEnd.time}</Text>
            </View>
          </View>

          {/* Submission Starts */}
          <View style={styles.cell}>
            <View style={styles.iconCircle}>
              <Feather name="send" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Submission Starts</Text>
              <Text style={styles.cellDate}>{subStart.date}</Text>
              <Text style={styles.cellTime}>{subStart.time}</Text>
            </View>
          </View>
        </View>

        {/* Horizontal Divider */}
        <View style={styles.horizontalDivider} />

        {/* Row 2 */}
        <View style={styles.row}>
          {/* Submission Ends */}
          <View style={[styles.cell, styles.rightBorder]}>
            <View style={styles.iconCircle}>
              <Feather name="upload" size={19} color={COLORS.primary} />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Submission Ends</Text>
              <Text style={styles.cellDate}>{subEnd.date}</Text>
              <Text style={styles.cellTime}>{subEnd.time}</Text>
            </View>
          </View>

          {/* Result Date */}
          <View style={styles.cell}>
            <View style={styles.iconCircle}>
              <Ionicons name="trophy-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.cellContent}>
              <Text style={styles.cellLabel}>Result Date</Text>
              <Text style={styles.cellDate}>{resDate.date}</Text>
              <Text style={styles.cellTime}>{resDate.time}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 14,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.04)',
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 10,
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: COLORS.borderLight,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F0F9F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellContent: {
    flex: 1,
  },
  cellLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  cellDate: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cellTime: {
    fontSize: 11,
    color: COLORS.textMedium,
    fontWeight: '600',
    marginTop: 1,
  },
});
