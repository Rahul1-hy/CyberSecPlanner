import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/theme';
import { TaskItem } from '../src/database/db';
import { getAllTasks } from '../src/database/taskQueries';
import { formatDisplayDate } from '../src/utils/dateUtils';
import { requestNotificationPermissions, sendInstantTestNotification } from '../src/notifications/notificationService';

export default function NotificationsScreen() {
  const router = useRouter();
  const [tasksWithReminders, setTasksWithReminders] = useState<TaskItem[]>([]);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    async function load() {
      const all = await getAllTasks();
      const withReminders = all.filter(
        (t) => t.reminder_minutes !== undefined && t.reminder_minutes !== null && t.status !== 'completed'
      );
      setTasksWithReminders(withReminders);
    }
    load();
  }, []);

  const handleSendTest = async () => {
    await sendInstantTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NOTIFICATIONS & ALERTS</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusTitle}>LOCAL NOTIFICATION ENGINE</Text>
          </View>
          <Text style={styles.statusDesc}>
            Notifications are generated directly on your device. No cloud backend or internet connection is required.
          </Text>

          <TouchableOpacity
            style={styles.testBtn}
            onPress={handleSendTest}
            activeOpacity={0.8}
          >
            <Ionicons name="flash-outline" size={16} color={COLORS.background} />
            <Text style={styles.testBtnText}>
              {testSent ? '⚡ Test Alert Sent!' : 'Send Test Notification'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Reminders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔔 UPCOMING TASK REMINDERS</Text>
          <Text style={styles.countText}>{tasksWithReminders.length} active</Text>
        </View>

        {tasksWithReminders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="notifications-off-outline" size={28} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No Scheduled Reminders</Text>
            <Text style={styles.emptyDesc}>
              Tasks with reminder minutes configured will automatically appear here.
            </Text>
          </View>
        ) : (
          tasksWithReminders.map((task) => (
            <View key={task.id} style={styles.reminderCard}>
              <View style={styles.reminderLeft}>
                <View style={styles.reminderBadge}>
                  <Ionicons name="alarm" size={13} color={COLORS.secondary} />
                  <Text style={styles.reminderBadgeText}>
                    {task.reminder_minutes}m before
                  </Text>
                </View>
                <Text style={styles.reminderTaskTitle}>{task.title}</Text>
                <Text style={styles.reminderSub}>
                  {formatDisplayDate(task.date)} • {task.start_time || 'All Day'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.viewTaskBtn}
                onPress={() => router.push(`/tasks/${task.id}` as any)}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
    backgroundColor: COLORS.backgroundSecondary,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.3)',
    padding: 16,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  statusTitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statusDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  testBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
  },
  testBtnText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  countText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  emptyDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 14,
    marginBottom: 10,
  },
  reminderLeft: {
    flex: 1,
    marginRight: 10,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  reminderBadgeText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  reminderTaskTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  reminderSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  viewTaskBtn: {
    padding: 8,
  },
});
