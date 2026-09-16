import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskItem } from '../database/db';
import { COLORS } from '../constants/theme';
import { CATEGORIES, PRIORITY_CONFIG } from '../constants/categories';

interface TaskCardProps {
  task: TaskItem;
  onToggleComplete: (id: string) => void;
  onPress?: (task: TaskItem) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function TaskCard({
  task,
  onToggleComplete,
  onPress,
  onDelete,
  onDuplicate,
}: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const isOverdue = task.status === 'overdue';

  const categoryInfo = CATEGORIES.find((c) => c.name === task.category || c.id === task.category) || {
    name: task.category,
    color: COLORS.secondary,
    badgeBg: 'rgba(0, 229, 255, 0.15)',
  };

  const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  return (
    <View
      style={[
        styles.card,
        isCompleted && styles.cardCompleted,
        isOverdue && styles.cardOverdue,
      ]}
    >
      <View style={styles.mainRow}>
        {/* Checkbox */}
        <TouchableOpacity
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
          onPress={() => onToggleComplete(task.id)}
          activeOpacity={0.7}
        >
          {isCompleted && <Ionicons name="checkmark" size={16} color={COLORS.background} />}
        </TouchableOpacity>

        {/* Task Info */}
        <TouchableOpacity
          style={styles.contentContainer}
          onPress={() => onPress && onPress(task)}
          activeOpacity={0.7}
        >
          <View style={styles.badgeRow}>
            {/* Category */}
            <View style={[styles.badge, { backgroundColor: categoryInfo.badgeBg }]}>
              <Text style={[styles.badgeText, { color: categoryInfo.color }]}>
                {categoryInfo.name}
              </Text>
            </View>

            {/* Priority */}
            <View style={[styles.priorityDot, { backgroundColor: priorityInfo.color }]} />
            <Text style={[styles.priorityText, { color: priorityInfo.color }]}>
              {task.priority.toUpperCase()}
            </Text>

            {/* Reminder Bell */}
            {task.reminder_minutes > 0 && !isCompleted && (
              <View style={styles.reminderBadge}>
                <Ionicons name="notifications" size={11} color={COLORS.secondary} />
                <Text style={styles.reminderText}>{task.reminder_minutes}m</Text>
              </View>
            )}
          </View>

          <Text style={[styles.title, isCompleted && styles.titleCompleted]}>
            {task.title}
          </Text>

          {task.description ? (
            <Text
              style={[styles.description, isCompleted && styles.descriptionCompleted]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          ) : null}

          {/* Time & Recurring Footer */}
          <View style={styles.footerRow}>
            {task.start_time ? (
              <View style={styles.timeTag}>
                <Ionicons name="time-outline" size={12} color={COLORS.textSecondary} />
                <Text style={styles.timeText}>
                  {task.start_time} {task.end_time ? `- ${task.end_time}` : ''}
                </Text>
              </View>
            ) : null}

            {task.recurring && task.recurring !== 'none' && (
              <View style={styles.recurringTag}>
                <Ionicons name="repeat" size={11} color={COLORS.textMuted} />
                <Text style={styles.recurringText}>{task.recurring}</Text>
              </View>
            )}

            {isOverdue && (
              <View style={styles.overdueTag}>
                <Text style={styles.overdueText}>OVERDUE</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Quick Action buttons */}
        <View style={styles.actionsColumn}>
          {onDuplicate && (
            <TouchableOpacity
              style={styles.actionIconBtn}
              onPress={() => onDuplicate(task.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={14} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}

          {onDelete && (
            <TouchableOpacity
              style={styles.actionIconBtn}
              onPress={() => onDelete(task.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 14,
    marginBottom: 10,
  },
  cardCompleted: {
    opacity: 0.6,
    borderColor: '#1e293b55',
    backgroundColor: '#0c1322',
  },
  cardOverdue: {
    borderColor: 'rgba(255, 59, 92, 0.4)',
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  reminderText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  descriptionCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  recurringTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recurringText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  overdueTag: {
    backgroundColor: 'rgba(255, 59, 92, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  overdueText: {
    color: COLORS.danger,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionsColumn: {
    gap: 8,
    marginLeft: 6,
    paddingTop: 2,
  },
  actionIconBtn: {
    padding: 4,
  },
});
