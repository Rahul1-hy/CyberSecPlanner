import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../src/components/Header';
import { StatCard } from '../../src/components/StatCard';
import { ProgressBar } from '../../src/components/ProgressBar';
import { TaskCard } from '../../src/components/TaskCard';
import { StudyTimer } from '../../src/components/StudyTimer';
import { EmptyState } from '../../src/components/EmptyState';
import { DeleteModal } from '../../src/components/DeleteModal';
import { COLORS } from '../../src/constants/theme';
import { TaskItem } from '../../src/database/db';
import {
  getTodayTasks,
  toggleTaskComplete,
  deleteTask,
  duplicateTask,
  getTodayTaskStats,
} from '../../src/database/taskQueries';
import { getTodayStudyMinutes } from '../../src/database/studyQueries';
import { getAppSettings } from '../../src/database/settingsQueries';
import { calculateJobReadiness, ReadinessBreakdown } from '../../src/utils/progressCalculator';
import { formatMinutesToHours, formatFullDate } from '../../src/utils/dateUtils';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [todayTasks, setTodayTasks] = useState<TaskItem[]>([]);
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, remaining: 0, percentage: 0 });
  const [studyMinutes, setStudyMinutes] = useState(0);
  const [studyTargetHours, setStudyTargetHours] = useState(6);
  const [readiness, setReadiness] = useState<ReadinessBreakdown>({
    overall: 70,
    skillsScore: 65,
    tasksScore: 80,
    studyScore: 70,
    jobsScore: 60,
  });

  // Modal delete state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [tasks, stats, studyMins, settings, readinessData] = await Promise.all([
        getTodayTasks(),
        getTodayTaskStats(),
        getTodayStudyMinutes(),
        getAppSettings(),
        calculateJobReadiness(),
      ]);

      setTodayTasks(tasks);
      setTaskStats(stats);
      setStudyMinutes(studyMins);
      setStudyTargetHours(settings.daily_study_target_hours || 6);
      setReadiness(readinessData);
    } catch (err) {
      console.warn('Failed to load home data', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleToggleComplete = async (id: string) => {
    await toggleTaskComplete(id);
    await loadData();
  };

  const handleDuplicate = async (id: string) => {
    await duplicateTask(id);
    await loadData();
  };

  const handleDeleteRequest = (id: string) => {
    setTaskToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
      setDeleteModalVisible(false);
      await loadData();
    }
  };

  const studyTargetMinutes = studyTargetHours * 60;
  const studyProgress = Math.min(100, Math.round((studyMinutes / studyTargetMinutes) * 100));

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        <Header subtitle={formatFullDate()} />

        {/* Master Job Readiness Gauge Card */}
        <View style={styles.readinessCard}>
          <View style={styles.readinessHeader}>
            <View>
              <Text style={styles.readinessLabel}>🎯 OVERALL JOB-READINESS</Text>
              <Text style={styles.readinessSub}>Target: Dec 2026 Goal</Text>
            </View>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{readiness.overall}%</Text>
            </View>
          </View>

          <ProgressBar
            progress={readiness.overall}
            color={COLORS.primary}
            height={10}
            showPercentage={false}
          />

          <View style={styles.subMetricsRow}>
            <View style={styles.subMetric}>
              <Text style={styles.subMetricLabel}>Skills Matrix</Text>
              <Text style={[styles.subMetricValue, { color: COLORS.secondary }]}>
                {readiness.skillsScore}%
              </Text>
            </View>
            <View style={styles.subMetricDivider} />
            <View style={styles.subMetric}>
              <Text style={styles.subMetricLabel}>Task Consistency</Text>
              <Text style={[styles.subMetricValue, { color: COLORS.primary }]}>
                {readiness.tasksScore}%
              </Text>
            </View>
            <View style={styles.subMetricDivider} />
            <View style={styles.subMetric}>
              <Text style={styles.subMetricLabel}>Job Pipeline</Text>
              <Text style={[styles.subMetricValue, { color: COLORS.mediumPriority }]}>
                {readiness.jobsScore}%
              </Text>
            </View>
          </View>
        </View>

        {/* Fast Action Quick Hub: Routine & Roadmap */}
        <View style={styles.quickHubRow}>
          <TouchableOpacity
            style={styles.quickHubCard}
            onPress={() => router.push('/routine' as any)}
            activeOpacity={0.8}
          >
            <View style={styles.quickHubHeader}>
              <View style={[styles.quickHubIconCircle, { backgroundColor: 'rgba(0, 229, 255, 0.15)' }]}>
                <Ionicons name="time-outline" size={18} color={COLORS.secondary} />
              </View>
              <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
            </View>
            <Text style={[styles.quickHubTag, { color: COLORS.secondary }]}>6:45 AM – 11 PM</Text>
            <Text style={styles.quickHubTitle}>Daily Routine</Text>
            <Text style={styles.quickHubSub}>Theory + Labs + Health</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickHubCard}
            onPress={() => router.push('/roadmap' as any)}
            activeOpacity={0.8}
          >
            <View style={styles.quickHubHeader}>
              <View style={[styles.quickHubIconCircle, { backgroundColor: 'rgba(0, 255, 157, 0.15)' }]}>
                <Ionicons name="map-outline" size={18} color={COLORS.primary} />
              </View>
              <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
            </View>
            <Text style={[styles.quickHubTag, { color: COLORS.primary }]}>10 PHASES</Text>
            <Text style={styles.quickHubTitle}>Cyber Roadmap</Text>
            <Text style={styles.quickHubSub}>Zero to Job Ready '26</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="checkbox-outline"
            label="Today's Tasks"
            value={`${taskStats.completed}/${taskStats.total}`}
            subtext={`${taskStats.remaining} remaining`}
            color={COLORS.primary}
            onPress={() => router.push('/(tabs)/tasks' as any)}
          />
          <StatCard
            icon="time-outline"
            label="Study Time"
            value={formatMinutesToHours(studyMinutes)}
            subtext={`Target: ${studyTargetHours}h (${studyProgress}%)`}
            color={COLORS.secondary}
            onPress={() => router.push('/(tabs)/progress' as any)}
          />
        </View>

        {/* Interactive Focus Study Timer */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⚡ FOCUS STUDY LAB</Text>
        </View>
        <StudyTimer onSessionSaved={loadData} />

        {/* Today's Tasks Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>📋 TODAY'S TASKS</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{taskStats.total}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addTaskBtn}
            onPress={() => router.push('/tasks/add' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color={COLORS.background} />
            <Text style={styles.addTaskText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {todayTasks.length === 0 ? (
          <EmptyState
            icon="checkmark-done-circle-outline"
            title="All clear for today!"
            description="You have no tasks scheduled for today. Add a new cyber study task to get ahead."
            actionLabel="+ Add Daily Task"
            onAction={() => router.push('/tasks/add' as any)}
          />
        ) : (
          todayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onPress={(t) => router.push(`/tasks/${t.id}` as any)}
              onDuplicate={handleDuplicate}
              onDelete={handleDeleteRequest}
            />
          ))
        )}

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        visible={deleteModalVisible}
        title="Delete Task?"
        message="Are you sure you want to delete this task? Scheduled notifications will also be cancelled."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  readinessCard: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.3)',
    padding: 16,
  },
  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  readinessLabel: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  readinessSub: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 255, 157, 0.15)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  subMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
  },
  subMetric: {
    alignItems: 'center',
  },
  subMetricLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  subMetricValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  subMetricDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.surfaceBorder,
  },
  quickHubRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  quickHubCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 12,
  },
  quickHubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickHubIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickHubTag: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  quickHubTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  quickHubSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 6,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  countBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  countText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '800',
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addTaskText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '800',
  },
});
