import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/theme';
import { CATEGORIES, PRIORITY_CONFIG } from '../../src/constants/categories';
import { TaskItem } from '../../src/database/db';
import {
  getTaskById,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from '../../src/database/taskQueries';
import { DeleteModal } from '../../src/components/DeleteModal';
import { formatDisplayDate } from '../../src/utils/dateUtils';

export default function TaskDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [task, setTask] = useState<TaskItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState('');
  const [reminderMinutes, setReminderMinutes] = useState(0);
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekdays' | 'weekly' | 'custom'>('none');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    async function load() {
      if (id) {
        const found = await getTaskById(id);
        if (found) {
          setTask(found);
          setTitle(found.title);
          setDescription(found.description || '');
          setDate(found.date);
          setStartTime(found.start_time || '');
          setEndTime(found.end_time || '');
          setPriority(found.priority);
          setCategory(found.category);
          setReminderMinutes(found.reminder_minutes || 0);
          setRecurring(found.recurring || 'none');
        }
      }
    }
    load();
  }, [id]);

  const handleToggle = async () => {
    if (id) {
      const updated = await toggleTaskComplete(id);
      if (updated) setTask(updated);
    }
  };

  const handleSaveEdit = async () => {
    if (!task) return;
    const updated = await updateTask({
      ...task,
      title: title.trim(),
      description: description.trim(),
      date: date.trim(),
      start_time: startTime,
      end_time: endTime,
      priority,
      category,
      reminder_minutes: reminderMinutes,
      recurring,
    });
    setTask(updated);
    setIsEditing(false);
  };

  const handleConfirmDelete = async () => {
    if (id) {
      await deleteTask(id);
      setDeleteModalVisible(false);
      router.back();
    }
  };

  if (!task) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.textSecondary }}>Loading task details...</Text>
      </View>
    );
  }

  const isCompleted = task.status === 'completed';
  const categoryInfo = CATEGORIES.find((c) => c.name === task.category) || {
    name: task.category,
    color: COLORS.secondary,
    badgeBg: 'rgba(0, 229, 255, 0.15)',
  };
  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

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
        <Text style={styles.headerTitle}>TASK DETAILS</Text>
        <TouchableOpacity
          style={styles.editToggleBtn}
          onPress={() => (isEditing ? handleSaveEdit() : setIsEditing(true))}
          activeOpacity={0.7}
        >
          <Text style={styles.editToggleText}>{isEditing ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isEditing ? (
          /* Edit Form Mode */
          <View style={styles.editSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>TASK TITLE</Text>
              <TextInput
                style={styles.textInput}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>DESCRIPTION</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1.2 }]}>
                <Text style={styles.inputLabel}>DATE</Text>
                <TextInput
                  style={styles.textInput}
                  value={date}
                  onChangeText={setDate}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 0.9 }]}>
                <Text style={styles.inputLabel}>START</Text>
                <TextInput
                  style={styles.textInput}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 0.9 }]}>
                <Text style={styles.inputLabel}>END</Text>
                <TextInput
                  style={styles.textInput}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>

            {/* Priority */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PRIORITY</Text>
              <View style={styles.optionsRow}>
                {(['high', 'medium', 'low'] as const).map((p) => {
                  const info = PRIORITY_CONFIG[p];
                  const isSelected = priority === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.optionBtn,
                        isSelected && { backgroundColor: `${info.color}25`, borderColor: info.color },
                      ]}
                      onPress={() => setPriority(p)}
                    >
                      <Text style={[styles.optionText, isSelected && { color: info.color }]}>
                        {p.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CATEGORY</Text>
              <View style={styles.categoriesGrid}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.name;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        isSelected && { backgroundColor: `${cat.color}25`, borderColor: cat.color },
                      ]}
                      onPress={() => setCategory(cat.name)}
                    >
                      <Text style={[styles.categoryChipText, isSelected && { color: cat.color }]}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Reminder */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>REMINDER</Text>
              <View style={styles.optionsRow}>
                {[
                  { label: 'At start (0m)', value: 0 },
                  { label: '5m', value: 5 },
                  { label: '10m', value: 10 },
                  { label: '15m', value: 15 },
                  { label: '30m', value: 30 },
                  { label: '1h', value: 60 },
                ].map((opt) => {
                  const isSelected = reminderMinutes === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      style={[
                        styles.optionBtn,
                        isSelected && { backgroundColor: 'rgba(0, 229, 255, 0.2)', borderColor: COLORS.secondary },
                      ]}
                      onPress={() => setReminderMinutes(opt.value)}
                    >
                      <Text style={[styles.optionText, isSelected && { color: COLORS.secondary, fontWeight: '800' }]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtnLarge} onPress={handleSaveEdit}>
              <Text style={styles.saveBtnLargeText}>SAVE CHANGES</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* View Mode */
          <View style={styles.viewSection}>
            {/* Status & Badges */}
            <View style={styles.badgesRow}>
              <View style={[styles.badge, { backgroundColor: categoryInfo.badgeBg }]}>
                <Text style={[styles.badgeText, { color: categoryInfo.color }]}>
                  {categoryInfo.name}
                </Text>
              </View>

              <View style={[styles.badge, { backgroundColor: priorityInfo.bg }]}>
                <Text style={[styles.badgeText, { color: priorityInfo.color }]}>
                  {priorityInfo.label}
                </Text>
              </View>

              {task.reminder_minutes > 0 && (
                <View style={styles.reminderBadge}>
                  <Ionicons name="notifications" size={12} color={COLORS.secondary} />
                  <Text style={styles.reminderText}>{task.reminder_minutes} min reminder</Text>
                </View>
              )}
            </View>

            <Text style={[styles.viewTitle, isCompleted && styles.viewTitleCompleted]}>
              {task.title}
            </Text>

            {task.description ? (
              <View style={styles.descCard}>
                <Text style={styles.descLabel}>LAB OBJECTIVES / NOTES</Text>
                <Text style={styles.descContent}>{task.description}</Text>
              </View>
            ) : null}

            {/* Schedule Details Card */}
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.secondary} />
                <Text style={styles.detailText}>Scheduled Date: {formatDisplayDate(task.date)}</Text>
              </View>

              {task.start_time ? (
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                  <Text style={styles.detailText}>
                    Time: {task.start_time} {task.end_time ? `- ${task.end_time}` : ''}
                  </Text>
                </View>
              ) : null}

              {task.recurring && task.recurring !== 'none' && (
                <View style={styles.detailRow}>
                  <Ionicons name="repeat-outline" size={16} color={COLORS.mediumPriority} />
                  <Text style={styles.detailText}>Repeat: {task.recurring.toUpperCase()}</Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Ionicons
                  name={isCompleted ? 'checkmark-circle' : 'hourglass-outline'}
                  size={16}
                  color={isCompleted ? COLORS.primary : COLORS.textMuted}
                />
                <Text style={styles.detailText}>
                  Status: {isCompleted ? 'Completed ✅' : 'Pending ⏳'}
                </Text>
              </View>
            </View>

            {/* Complete Action Button */}
            <TouchableOpacity
              style={[styles.toggleBtn, isCompleted ? styles.toggleBtnPending : styles.toggleBtnComplete]}
              onPress={handleToggle}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isCompleted ? 'arrow-undo' : 'checkmark'}
                size={18}
                color={isCompleted ? COLORS.textPrimary : COLORS.background}
              />
              <Text
                style={[
                  styles.toggleBtnText,
                  isCompleted ? { color: COLORS.textPrimary } : { color: COLORS.background },
                ]}
              >
                {isCompleted ? 'Mark as Incomplete' : 'Mark Completed ✅'}
              </Text>
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => setDeleteModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
              <Text style={styles.deleteBtnText}>Delete Task</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        visible={deleteModalVisible}
        title="Delete Task?"
        message={`Are you sure you want to delete "${task.title}"?`}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
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
  editToggleBtn: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editToggleText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
  },
  viewSection: {},
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reminderText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  viewTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 16,
  },
  viewTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  descCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 14,
    marginBottom: 16,
  },
  descLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  descContent: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  toggleBtnComplete: {
    backgroundColor: COLORS.primary,
  },
  toggleBtnPending: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  toggleBtnText: {
    fontSize: 14,
    fontWeight: '800',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  deleteBtnText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  editSection: {
    gap: 14,
  },
  inputGroup: {
    marginBottom: 6,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  textArea: {
    minHeight: 70,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  categoryChipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  saveBtnLarge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnLargeText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '800',
  },
});
