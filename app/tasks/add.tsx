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
import { createTask } from '../../src/database/taskQueries';
import { getTodayString } from '../../src/utils/dateUtils';
import { requestNotificationPermissions } from '../../src/notifications/notificationService';
import { getAppSettings } from '../../src/database/settingsQueries';

export default function AddTaskScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ defaultDate?: string }>();

  // Compute upcoming default start/end times
  const getDefaultTimes = () => {
    const now = new Date();
    const startH = (now.getHours() + 1) % 24;
    const endH = (startH + 1) % 24;
    return {
      start: `${String(startH).padStart(2, '0')}:00`,
      end: `${String(endH).padStart(2, '0')}:30`,
    };
  };

  const defaults = getDefaultTimes();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(params.defaultDate || getTodayString());
  const [startTime, setStartTime] = useState(defaults.start);
  const [endTime, setEndTime] = useState(defaults.end);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [reminderMinutes, setReminderMinutes] = useState<number>(15);
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekdays' | 'weekly' | 'custom'>('none');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function initSettings() {
      const s = await getAppSettings();
      if (s.default_reminder_minutes !== undefined) {
        setReminderMinutes(s.default_reminder_minutes);
      }
      await requestNotificationPermissions();
    }
    initSettings();
  }, []);

  const reminderOptions = [
    { label: 'At start (0m)', value: 0 },
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
  ];

  const recurringOptions: Array<{ label: string; value: 'none' | 'daily' | 'weekdays' | 'weekly' | 'custom' }> = [
    { label: 'No Repeat', value: 'none' },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekdays', value: 'weekdays' },
    { label: 'Weekly', value: 'weekly' },
  ];

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMsg('Task title is required');
      return;
    }

    try {
      await requestNotificationPermissions();
      await createTask({
        title: title.trim(),
        description: description.trim(),
        date: date.trim() || getTodayString(),
        start_time: startTime.trim() || '09:00',
        end_time: endTime.trim() || '10:30',
        priority,
        category,
        reminder_minutes: reminderMinutes,
        recurring,
        status: 'pending',
      });

      router.back();
    } catch {
      setErrorMsg('Failed to save task. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CREATE CYBER TASK</Text>
        <TouchableOpacity
          style={styles.saveHeaderBtn}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveHeaderBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {errorMsg ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Task Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>TASK TITLE *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Wireshark PCAP analysis, Splunk alert rules..."
            placeholderTextColor={COLORS.textMuted}
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>DESCRIPTION / LAB OBJECTIVES</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Enter specific commands, labs, target machines, or study links..."
            placeholderTextColor={COLORS.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Date & Time Row */}
        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1.2 }]}>
            <Text style={styles.inputLabel}>DATE (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={COLORS.textMuted}
              value={date}
              onChangeText={setDate}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 0.9 }]}>
            <Text style={styles.inputLabel}>START TIME</Text>
            <TextInput
              style={styles.textInput}
              placeholder="09:00"
              placeholderTextColor={COLORS.textMuted}
              value={startTime}
              onChangeText={setStartTime}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 0.9 }]}>
            <Text style={styles.inputLabel}>END TIME</Text>
            <TextInput
              style={styles.textInput}
              placeholder="10:30"
              placeholderTextColor={COLORS.textMuted}
              value={endTime}
              onChangeText={setEndTime}
            />
          </View>
        </View>

        {/* Priority Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PRIORITY LEVEL</Text>
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
                  activeOpacity={0.7}
                >
                  <View style={[styles.dot, { backgroundColor: info.color }]} />
                  <Text style={[styles.optionText, isSelected && { color: info.color, fontWeight: '800' }]}>
                    {p.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>CYBER SECURITY CATEGORY</Text>
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
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && { color: cat.color, fontWeight: '800' },
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Reminder Selection */}
        <View style={styles.inputGroup}>
          <View style={styles.reminderHeaderRow}>
            <Text style={styles.inputLabel}>🔔 LOCAL NOTIFICATION REMINDER</Text>
            <Text style={styles.reminderSelectedText}>
              {reminderMinutes === 0 ? 'At start time' : `${reminderMinutes}m before`}
            </Text>
          </View>

          <View style={styles.optionsRow}>
            {reminderOptions.map((opt) => {
              const isSelected = reminderMinutes === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    styles.optionBtn,
                    isSelected && styles.optionBtnSelected,
                  ]}
                  onPress={() => setReminderMinutes(opt.value)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isSelected ? 'notifications' : 'notifications-outline'}
                    size={13}
                    color={isSelected ? COLORS.secondary : COLORS.textMuted}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recurring Task */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>🔁 REPEAT SCHEDULE</Text>
          <View style={styles.optionsRow}>
            {recurringOptions.map((rec) => {
              const isSelected = recurring === rec.value;
              return (
                <TouchableOpacity
                  key={rec.value}
                  style={[
                    styles.optionBtn,
                    isSelected && styles.optionBtnSelected,
                  ]}
                  onPress={() => setRecurring(rec.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {rec.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications" size={16} color={COLORS.background} />
          <Text style={styles.submitBtnText}>CREATE TASK & SET REMINDER</Text>
        </TouchableOpacity>

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
  closeBtn: {
    padding: 6,
  },
  headerTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  saveHeaderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  saveHeaderBtnText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 59, 92, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.danger,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  reminderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderSelectedText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '800',
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
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  optionBtnSelected: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: COLORS.secondary,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: COLORS.secondary,
    fontWeight: '800',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChip: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryChipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 10,
  },
  submitBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
