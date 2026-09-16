import React, { useState } from 'react';
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
import {
  MASTER_ROUTINE,
  ROADMAP_ROUTINE_PRESETS,
  RoadmapRoutinePreset,
  RoutineSlot,
} from '../src/constants/routineData';
import { generateDailyRoutineTasks } from '../src/database/taskQueries';

export default function RoutineScreen() {
  const router = useRouter();
  const [selectedPresetId, setSelectedPresetId] = useState<string>('day-1');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'7days' | 'phases'>('7days');
  const [appliedBanner, setAppliedBanner] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedPreset: RoadmapRoutinePreset =
    ROADMAP_ROUTINE_PRESETS.find((p) => p.id === selectedPresetId) ||
    ROADMAP_ROUTINE_PRESETS[0];

  const handleGenerateToday = async () => {
    setIsGenerating(true);
    try {
      await generateDailyRoutineTasks(undefined, selectedPreset.id);
      setAppliedBanner(true);
      setTimeout(() => {
        setAppliedBanner(false);
        router.push('/(tabs)/tasks' as any);
      }, 1500);
    } catch (e) {
      console.warn('Error generating routine tasks', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredPresets = ROADMAP_ROUTINE_PRESETS.filter((p) => {
    if (activeCategoryFilter === '7days') {
      return p.id.startsWith('day-');
    }
    return p.id.startsWith('phase-');
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>ROADMAP DAILY ROUTINE</Text>
          <Text style={styles.headerSub}>6:45 AM – 11:00 PM Master Plan</Text>
        </View>
        <TouchableOpacity
          style={styles.syncBtn}
          onPress={handleGenerateToday}
          activeOpacity={0.8}
          disabled={isGenerating}
        >
          <Ionicons name="flash" size={13} color={COLORS.background} />
          <Text style={styles.syncBtnText}>
            {isGenerating ? 'Adding...' : 'Apply Today'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {appliedBanner && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
            <Text style={styles.successText}>
              All 19 time-blocked tasks for {selectedPreset.title} & reminders scheduled to Today's Tasks!
            </Text>
          </View>
        )}

        {/* Golden Ratio Card */}
        <View style={styles.goldenRuleCard}>
          <View style={styles.goldenRuleHeader}>
            <Text style={styles.goldenTag}>🎯 DAILY STUDY FORMULA</Text>
            <Text style={styles.goldenTotal}>5–6 Hours / Day</Text>
          </View>
          <Text style={styles.goldenFormula}>
            2h Learn + 2h Practice + 1h Job Preparation
          </Text>
          <View style={styles.targetsRow}>
            <View style={styles.targetCol}>
              <Text style={styles.targetNum}>2h</Text>
              <Text style={styles.targetLabel}>8:30–10:30 Theory</Text>
            </View>
            <View style={styles.targetCol}>
              <Text style={styles.targetNum}>2.75h</Text>
              <Text style={styles.targetLabel}>Labs & Practical</Text>
            </View>
            <View style={styles.targetCol}>
              <Text style={styles.targetNum}>1h</Text>
              <Text style={styles.targetLabel}>Job / LinkedIn</Text>
            </View>
            <View style={styles.targetCol}>
              <Text style={styles.targetNum}>1h</Text>
              <Text style={styles.targetLabel}>9:00–10:00 Revision</Text>
            </View>
          </View>
        </View>

        {/* Roadmap Filter Switcher */}
        <View style={styles.filterSwitcher}>
          <TouchableOpacity
            style={[
              styles.filterSwitchBtn,
              activeCategoryFilter === '7days' && styles.filterSwitchBtnActive,
            ]}
            onPress={() => {
              setActiveCategoryFilter('7days');
              setSelectedPresetId('day-1');
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="calendar-outline"
              size={14}
              color={activeCategoryFilter === '7days' ? COLORS.background : COLORS.textMuted}
            />
            <Text
              style={[
                styles.filterSwitchText,
                activeCategoryFilter === '7days' && styles.filterSwitchTextActive,
              ]}
            >
              📅 First 7 Days (Micro-Lessons)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterSwitchBtn,
              activeCategoryFilter === 'phases' && styles.filterSwitchBtnActive,
            ]}
            onPress={() => {
              setActiveCategoryFilter('phases');
              setSelectedPresetId('phase-2');
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name="map-outline"
              size={14}
              color={activeCategoryFilter === 'phases' ? COLORS.background : COLORS.textMuted}
            />
            <Text
              style={[
                styles.filterSwitchText,
                activeCategoryFilter === 'phases' && styles.filterSwitchTextActive,
              ]}
            >
              🗺️ 10 Phases
            </Text>
          </TouchableOpacity>
        </View>

        {/* Preset Horizontal Selector Chips */}
        <View style={styles.presetScrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetScroll}
          >
            {filteredPresets.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <TouchableOpacity
                  key={preset.id}
                  style={[
                    styles.presetChip,
                    isSelected && [styles.presetChipSelected, { borderColor: preset.color }],
                  ]}
                  onPress={() => setSelectedPresetId(preset.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.presetChipBadge,
                      { color: isSelected ? COLORS.background : preset.color },
                    ]}
                  >
                    {preset.badge}
                  </Text>
                  <Text
                    style={[
                      styles.presetChipTitle,
                      isSelected && styles.presetChipTitleSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {preset.title.includes('·') ? preset.title.split('·')[1].trim() : preset.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Roadmap Phase Focus Card */}
        <View style={[styles.curriculumCard, { borderColor: `${selectedPreset.color}66` }]}>
          <View style={styles.currHeader}>
            <View>
              <View style={styles.currBadgeRow}>
                <View style={[styles.badgeTheme, { backgroundColor: `${selectedPreset.color}20`, borderColor: selectedPreset.color }]}>
                  <Text style={[styles.badgeThemeText, { color: selectedPreset.color }]}>
                    {selectedPreset.badge}
                  </Text>
                </View>
                <Text style={styles.currCategory}>{selectedPreset.category}</Text>
              </View>
              <Text style={styles.currTitle}>{selectedPreset.title} — {selectedPreset.subtitle}</Text>
            </View>
          </View>

          {/* Theory Block 8:30-10:30 */}
          <View style={styles.currSection}>
            <View style={styles.currTitleRow}>
              <Ionicons name="terminal-outline" size={16} color={COLORS.primary} />
              <Text style={styles.currSectionTitle}>
                💻 8:30–10:30 AM · Theory: {selectedPreset.theoryTopic}
              </Text>
            </View>
            <View style={styles.subtopicsGrid}>
              {selectedPreset.theorySubtopics.map((sub, i) => (
                <View key={i} style={styles.subtopicChip}>
                  <Text style={styles.subtopicText}>• {sub}</Text>
                </View>
              ))}
            </View>
            <View style={styles.goalRow}>
              <Ionicons name="flag" size={12} color={COLORS.primary} />
              <Text style={styles.goalText}>
                <Text style={{ fontWeight: '800', color: COLORS.primary }}>Target Goal: </Text>
                {selectedPreset.theoryGoal}
              </Text>
            </View>
          </View>

          {/* Hands-on Lab 11:00-12:15 */}
          <View style={[styles.currSection, { marginTop: 12 }]}>
            <View style={styles.currTitleRow}>
              <Ionicons name="flask-outline" size={16} color={COLORS.secondary} />
              <Text style={[styles.currSectionTitle, { color: COLORS.secondary }]}>
                🧪 11:00–12:15 PM · Hands-on: {selectedPreset.handsOnTopic}
              </Text>
            </View>
            <Text style={styles.currDetailText}>{selectedPreset.handsOnLab}</Text>
            {selectedPreset.handsOnCommands.length > 0 && (
              <View style={styles.cmdBox}>
                <Text style={styles.cmdBoxTitle}>PRACTICE COMMANDS:</Text>
                <View style={styles.cmdChipsRow}>
                  {selectedPreset.handsOnCommands.map((cmd, i) => (
                    <View key={i} style={styles.cmdChip}>
                      <Text style={styles.cmdText}>{cmd}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Practical Cyber 3:00-4:30 */}
          <View style={[styles.currSection, { marginTop: 12 }]}>
            <View style={styles.currTitleRow}>
              <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.mediumPriority} />
              <Text style={[styles.currSectionTitle, { color: COLORS.mediumPriority }]}>
                💻 3:00–4:30 PM · Practical: {selectedPreset.practicalTopic}
              </Text>
            </View>
            <Text style={styles.currDetailText}>{selectedPreset.practicalDetails}</Text>
          </View>

          {/* Job Prep 4:30-5:30 */}
          <View style={[styles.currSection, { marginTop: 12 }]}>
            <View style={styles.currTitleRow}>
              <Ionicons name="briefcase-outline" size={16} color={COLORS.accent} />
              <Text style={[styles.currSectionTitle, { color: COLORS.accent }]}>
                💼 4:30–5:30 PM · Job Prep & Applications
              </Text>
            </View>
            <Text style={styles.currDetailText}>{selectedPreset.jobPrepDetails}</Text>
          </View>

          {/* Revision 9:00-10:00 */}
          <View style={[styles.currSection, { marginTop: 12 }]}>
            <View style={styles.currTitleRow}>
              <Ionicons name="book-outline" size={16} color={COLORS.primary} />
              <Text style={styles.currSectionTitle}>
                🧠 9:00–10:00 PM · Revision: {selectedPreset.revisionTopic}
              </Text>
            </View>
            <View style={styles.questionsList}>
              {selectedPreset.revisionQuestions.map((q, i) => (
                <Text key={i} style={styles.questionItem}>
                  {i + 1}. {q}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* 1-Tap Action Apply Banner */}
        <TouchableOpacity
          style={styles.applyActionBtn}
          onPress={handleGenerateToday}
          activeOpacity={0.8}
          disabled={isGenerating}
        >
          <Ionicons name="flash" size={18} color={COLORS.background} />
          <Text style={styles.applyActionBtnText}>
            {isGenerating
              ? 'Scheduling 19 Tasks...'
              : `Apply ${selectedPreset.title} to Today's Tasks`}
          </Text>
        </TouchableOpacity>

        {/* Full 19-Slot Master Schedule */}
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>⏰ FULL-DAY TIME-BLOCKED TIMETABLE</Text>
          <Text style={styles.scheduleCount}>{MASTER_ROUTINE.length} slots</Text>
        </View>

        {MASTER_ROUTINE.map((slot: RoutineSlot) => {
          let displayTitle = slot.title;
          let displayDesc = slot.description;

          if (slot.type === 'cyber-theory') {
            displayTitle = `💻 Theory: ${selectedPreset.theoryTopic}`;
            displayDesc = `Deep Work 1: ${selectedPreset.theorySubtopics.slice(0, 3).join(', ')}`;
          } else if (slot.type === 'hands-on-lab') {
            displayTitle = `🧪 Hands-on: ${selectedPreset.handsOnTopic}`;
            displayDesc = selectedPreset.handsOnLab;
          } else if (slot.type === 'practical-cyber') {
            displayTitle = `💻 Practical: ${selectedPreset.practicalTopic}`;
            displayDesc = selectedPreset.practicalDetails;
          } else if (slot.type === 'job-prep') {
            displayTitle = `💼 Job Prep: Applications & Portfolio`;
            displayDesc = selectedPreset.jobPrepDetails;
          } else if (slot.type === 'revision') {
            displayTitle = `🧠 Revision: ${selectedPreset.revisionTopic}`;
            displayDesc = `Self-check: ${selectedPreset.revisionQuestions[0] || 'Concept review'}`;
          }

          const isHealth = slot.type === 'health';
          const isCyber =
            slot.type === 'cyber-theory' ||
            slot.type === 'hands-on-lab' ||
            slot.type === 'practical-cyber' ||
            slot.type === 'job-prep' ||
            slot.type === 'revision';

          return (
            <View
              key={slot.id}
              style={[
                styles.slotCard,
                isHealth && styles.slotCardHealth,
                isCyber && styles.slotCardCyber,
              ]}
            >
              <View style={styles.slotLeft}>
                <View style={[styles.timeBadge, { borderColor: `${slot.color}44` }]}>
                  <Text style={[styles.timeText, { color: slot.color }]}>
                    {slot.time}
                  </Text>
                </View>
                <View style={styles.slotMain}>
                  <Text style={styles.slotTitle}>{displayTitle}</Text>
                  <Text style={styles.slotDesc} numberOfLines={2}>
                    {displayDesc}
                  </Text>
                </View>
              </View>

              {slot.reminderMinutes > 0 && (
                <View style={styles.slotReminderBadge}>
                  <Ionicons name="notifications" size={11} color={COLORS.secondary} />
                  <Text style={styles.slotReminderText}>{slot.reminderMinutes}m</Text>
                </View>
              )}
            </View>
          );
        })}

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
  headerSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  syncBtnText: {
    color: COLORS.background,
    fontSize: 11,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 255, 157, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  successText: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  goldenRuleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.3)',
    padding: 14,
    marginBottom: 14,
  },
  goldenRuleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  goldenTag: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  goldenTotal: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  goldenFormula: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 12,
  },
  targetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
  },
  targetCol: {
    alignItems: 'center',
  },
  targetNum: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  targetLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  filterSwitcher: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 10,
    gap: 6,
  },
  filterSwitchBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterSwitchBtnActive: {
    backgroundColor: COLORS.primary,
  },
  filterSwitchText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  filterSwitchTextActive: {
    color: COLORS.background,
    fontWeight: '800',
  },
  presetScrollWrapper: {
    marginBottom: 14,
  },
  presetScroll: {
    gap: 8,
  },
  presetChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    alignItems: 'center',
    minWidth: 90,
  },
  presetChipSelected: {
    backgroundColor: COLORS.primary,
  },
  presetChipBadge: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  presetChipTitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  presetChipTitleSelected: {
    color: COLORS.background,
    fontWeight: '800',
  },
  curriculumCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 14,
  },
  currHeader: {
    marginBottom: 12,
  },
  currBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  badgeTheme: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeThemeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  currCategory: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  currTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  currSection: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
  },
  currTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  currSectionTitle: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },
  subtopicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  subtopicChip: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  subtopicText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderRadius: 6,
    padding: 8,
  },
  goalText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 11,
    lineHeight: 15,
  },
  currDetailText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  cmdBox: {
    marginTop: 8,
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 6,
  },
  cmdBoxTitle: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 4,
  },
  cmdChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  cmdChip: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  cmdText: {
    color: COLORS.textPrimary,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  questionsList: {
    marginTop: 4,
    gap: 4,
  },
  questionItem: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  applyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  applyActionBtnText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '800',
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleTitle: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  scheduleCount: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  slotCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotCardHealth: {
    borderColor: 'rgba(255, 59, 92, 0.3)',
    backgroundColor: 'rgba(255, 59, 92, 0.05)',
  },
  slotCardCyber: {
    borderColor: 'rgba(0, 255, 157, 0.3)',
  },
  slotLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timeBadge: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 72,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  slotMain: {
    flex: 1,
  },
  slotTitle: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
  },
  slotDesc: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  slotReminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 6,
  },
  slotReminderText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '700',
  },
});
