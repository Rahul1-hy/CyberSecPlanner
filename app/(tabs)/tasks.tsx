import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../src/components/Header';
import { TaskCard } from '../../src/components/TaskCard';
import { EmptyState } from '../../src/components/EmptyState';
import { DeleteModal } from '../../src/components/DeleteModal';
import { COLORS } from '../../src/constants/theme';
import { CATEGORIES } from '../../src/constants/categories';
import { TaskItem } from '../../src/database/db';
import {
  getAllTasks,
  toggleTaskComplete,
  deleteTask,
  duplicateTask,
} from '../../src/database/taskQueries';
import { isDateToday, isDateUpcoming, isDateOverdue } from '../../src/utils/dateUtils';

type FilterTab = 'today' | 'upcoming' | 'completed' | 'overdue' | 'all';

export default function TasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('today');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (err) {
      console.warn('Failed to load tasks', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

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

  // Filter Logic
  const filteredTasks = tasks.filter((task) => {
    // 1. Tab timeline filter
    if (activeTab === 'today') {
      if (!isDateToday(task.date)) return false;
    } else if (activeTab === 'upcoming') {
      if (!isDateUpcoming(task.date) || task.status === 'completed') return false;
    } else if (activeTab === 'completed') {
      if (task.status !== 'completed') return false;
    } else if (activeTab === 'overdue') {
      if (!isDateOverdue(task.date, task.status)) return false;
    }

    // 2. Category filter
    if (selectedCategory !== 'All' && task.category !== selectedCategory) {
      return false;
    }

    // 3. Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchDesc = task.description?.toLowerCase().includes(query);
      const matchCat = task.category.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc && !matchCat) return false;
    }

    return true;
  });

  const tabCounts = {
    today: tasks.filter((t) => isDateToday(t.date)).length,
    upcoming: tasks.filter((t) => isDateUpcoming(t.date) && t.status !== 'completed').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    overdue: tasks.filter((t) => isDateOverdue(t.date, t.status)).length,
    all: tasks.length,
  };

  return (
    <View style={styles.container}>
      <Header title="Cyber Tasks" subtitle="Organize study & lab milestones" />

      {/* Search Bar & Add Button */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks, tools, categories..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.routineHeaderBtn}
          onPress={() => router.push('/routine' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={16} color={COLORS.secondary} />
          <Text style={styles.routineHeaderBtnText}>Full Routine</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/tasks/add' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {(
            [
              { id: 'today', label: 'Today' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'completed', label: 'Completed' },
              { id: 'overdue', label: 'Overdue' },
              { id: 'all', label: 'All Tasks' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.tabBadge,
                    isActive ? styles.tabBadgeActive : styles.tabBadgeInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      isActive ? styles.tabBadgeTextActive : styles.tabBadgeTextInactive,
                    ]}
                  >
                    {tabCounts[tab.id]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Category Pills */}
      <View style={styles.categoryPillsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsContainer}
        >
          <TouchableOpacity
            style={[
              styles.catPill,
              selectedCategory === 'All' && styles.catPillActive,
            ]}
            onPress={() => setSelectedCategory('All')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.catPillText,
                selectedCategory === 'All' && styles.catPillTextActive,
              ]}
            >
              All Topics
            </Text>
          </TouchableOpacity>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catPill,
                  isSelected && {
                    backgroundColor: `${cat.color}25`,
                    borderColor: cat.color,
                  },
                ]}
                onPress={() => setSelectedCategory(cat.name)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.catPillText,
                    isSelected && { color: cat.color, fontWeight: '700' },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tasks List */}
      <ScrollView
        style={styles.tasksList}
        contentContainerStyle={styles.tasksListContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {filteredTasks.length === 0 ? (
          <EmptyState
            icon="clipboard-outline"
            title="No Tasks Found"
            description={
              searchQuery
                ? 'No tasks match your search filters.'
                : `No tasks found in the "${activeTab}" category.`
            }
            actionLabel="+ Create New Task"
            onAction={() => router.push('/tasks/add' as any)}
          />
        ) : (
          filteredTasks.map((task) => (
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
  },
  routineHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },
  routineHeaderBtnText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '800',
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsWrapper: {
    marginBottom: 8,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  tabChipActive: {
    backgroundColor: 'rgba(0, 255, 157, 0.12)',
    borderColor: COLORS.primary,
  },
  tabLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tabBadgeActive: {
    backgroundColor: COLORS.primary,
  },
  tabBadgeInactive: {
    backgroundColor: COLORS.surfaceLight,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tabBadgeTextActive: {
    color: COLORS.background,
  },
  tabBadgeTextInactive: {
    color: COLORS.textMuted,
  },
  categoryPillsWrapper: {
    marginBottom: 12,
  },
  categoryPillsContainer: {
    paddingHorizontal: 20,
    gap: 6,
  },
  catPill: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  catPillActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: COLORS.secondary,
  },
  catPillText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  catPillTextActive: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  tasksList: {
    flex: 1,
  },
  tasksListContent: {
    paddingHorizontal: 20,
  },
});
