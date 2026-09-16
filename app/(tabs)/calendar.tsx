import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../src/components/Header';
import { TaskCard } from '../../src/components/TaskCard';
import { EmptyState } from '../../src/components/EmptyState';
import { DeleteModal } from '../../src/components/DeleteModal';
import { COLORS } from '../../src/constants/theme';
import { TaskItem } from '../../src/database/db';
import {
  getAllTasks,
  toggleTaskComplete,
  deleteTask,
  duplicateTask,
} from '../../src/database/taskQueries';
import { getTodayString, formatDisplayDate } from '../../src/utils/dateUtils';

export default function CalendarScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());

  // Delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      console.warn('Failed to load tasks for calendar', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const handleToggleComplete = async (id: string) => {
    await toggleTaskComplete(id);
    await loadTasks();
  };

  const handleDuplicate = async (id: string) => {
    await duplicateTask(id);
    await loadTasks();
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
      await loadTasks();
    }
  };

  const prevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  // Build Calendar Days for Current Month
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: Array<{ dateStr: string; dayNum: number; isCurrentMonth: boolean }> = [];

  // Padding days from previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const prevMonthNum = month === 0 ? 12 : month;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${String(prevMonthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarDays.push({ dateStr, dayNum: day, isCurrentMonth: false });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ dateStr, dayNum: d, isCurrentMonth: true });
  }

  // Next month padding to fill grid
  const remaining = 35 - calendarDays.length;
  for (let d = 1; d <= (remaining > 0 ? remaining : 0); d++) {
    const nextMonthNum = month + 2 > 12 ? 1 : month + 2;
    const nextYear = month + 2 > 12 ? year + 1 : year;
    const dateStr = `${nextYear}-${String(nextMonthNum).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDays.push({ dateStr, dayNum: d, isCurrentMonth: false });
  }

  // Selected date tasks
  const selectedDateTasks = tasks.filter((t) => t.date === selectedDate);
  const monthName = currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <View style={styles.container}>
      <Header title="Cyber Calendar" subtitle="Timeline & schedule roadmap" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Month Navigation */}
        <View style={styles.calendarCard}>
          <View style={styles.monthHeader}>
            <TouchableOpacity style={styles.navBtn} onPress={prevMonth} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>

            <Text style={styles.monthTitle}>{monthName.toUpperCase()}</Text>

            <TouchableOpacity style={styles.navBtn} onPress={nextMonth} activeOpacity={0.7}>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Weekday Labels */}
          <View style={styles.weekdaysRow}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((w, idx) => (
              <Text key={idx} style={styles.weekdayLabel}>{w}</Text>
            ))}
          </View>

          {/* Calendar Days Grid */}
          <View style={styles.grid}>
            {calendarDays.map((item, index) => {
              const isSelected = item.dateStr === selectedDate;
              const isToday = item.dateStr === getTodayString();
              const dateTasks = tasks.filter((t) => t.date === item.dateStr);
              const hasTasks = dateTasks.length > 0;
              const hasHighPriority = dateTasks.some((t) => t.priority === 'high');

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isToday && !isSelected && styles.dayCellToday,
                  ]}
                  onPress={() => setSelectedDate(item.dateStr)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayText,
                      !item.isCurrentMonth && styles.dayTextMuted,
                      isSelected && styles.dayTextSelected,
                      isToday && !isSelected && styles.dayTextToday,
                    ]}
                  >
                    {item.dayNum}
                  </Text>

                  {/* Task Indicators */}
                  {hasTasks && (
                    <View style={styles.dotsRow}>
                      <View
                        style={[
                          styles.dot,
                          hasHighPriority ? styles.dotHigh : styles.dotNormal,
                        ]}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Header & Tasks */}
        <View style={styles.selectedSectionHeader}>
          <View>
            <Text style={styles.selectedDateTitle}>
              {formatDisplayDate(selectedDate)}
            </Text>
            <Text style={styles.selectedDateSub}>
              {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'task' : 'tasks'} scheduled
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addDateTaskBtn}
            onPress={() => router.push(`/tasks/add?defaultDate=${selectedDate}` as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color={COLORS.background} />
            <Text style={styles.addDateTaskText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Date Task List */}
        {selectedDateTasks.length === 0 ? (
          <EmptyState
            icon="calendar-outline"
            title="No Tasks for this date"
            description={`No cybersecurity activities scheduled for ${formatDisplayDate(selectedDate)}.`}
            actionLabel="+ Schedule Task"
            onAction={() => router.push(`/tasks/add?defaultDate=${selectedDate}` as any)}
          />
        ) : (
          selectedDateTasks.map((task) => (
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

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        visible={deleteModalVisible}
        title="Delete Task?"
        message="Are you sure you want to delete this task? Any scheduled reminders will be cancelled."
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  calendarCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 16,
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
    paddingBottom: 8,
  },
  weekdayLabel: {
    width: '14.28%',
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  dayText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  dayTextMuted: {
    color: COLORS.textMuted,
    opacity: 0.4,
  },
  dayTextSelected: {
    color: COLORS.background,
    fontWeight: '800',
  },
  dayTextToday: {
    color: COLORS.secondary,
    fontWeight: '800',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 3,
    flexDirection: 'row',
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotNormal: {
    backgroundColor: COLORS.secondary,
  },
  dotHigh: {
    backgroundColor: COLORS.danger,
  },
  selectedSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  selectedDateTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  selectedDateSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  addDateTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addDateTaskText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '800',
  },
});
