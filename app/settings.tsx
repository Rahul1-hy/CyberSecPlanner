import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/theme';
import { SettingsItem } from '../src/database/db';
import { getDaysUntilTarget } from '../src/utils/dateUtils';
import {
  getAppSettings,
  updateAppSettings,
  exportDatabaseBackup,
  restoreDatabaseBackup,
  resetDatabaseToDefaults,
} from '../src/database/settingsQueries';
import { DeleteModal } from '../src/components/DeleteModal';

export default function SettingsScreen() {
  const router = useRouter();

  const [settings, setSettings] = useState<SettingsItem | null>(null);
  const [goalTitle, setGoalTitle] = useState('DECEMBER 2026 GOAL');
  const [targetRole, setTargetRole] = useState('');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [targetPackage, setTargetPackage] = useState('12 - 18 LPA');
  const [studyTarget, setStudyTarget] = useState('6');
  const [defaultReminder, setDefaultReminder] = useState(30);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [statusBanner, setStatusBanner] = useState('');

  // Backup & Reset states
  const [backupJson, setBackupJson] = useState('');
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);

  useEffect(() => {
    async function load() {
      const current = await getAppSettings();
      setSettings(current);
      setGoalTitle(current.goal_title || 'DECEMBER 2026 GOAL');
      setTargetRole(current.target_role || 'Cyber Security Analyst / SOC');
      setTargetDate(current.target_date || '2026-12-31');
      setTargetPackage(current.target_package || '12 - 18 LPA');
      setStudyTarget(String(current.daily_study_target_hours || 6));
      setDefaultReminder(current.default_reminder_minutes || 30);
      setNotifEnabled(current.notifications_enabled === 1);
    }
    load();
  }, []);

  const handleSave = async () => {
    const updated = await updateAppSettings({
      goal_title: goalTitle.trim() || 'DECEMBER 2026 GOAL',
      target_role: targetRole.trim() || 'Cyber Security Analyst / SOC',
      target_date: targetDate.trim() || '2026-12-31',
      target_package: targetPackage.trim() || '12 - 18 LPA',
      daily_study_target_hours: parseInt(studyTarget, 10) || 6,
      default_reminder_minutes: defaultReminder,
      notifications_enabled: notifEnabled ? 1 : 0,
    });
    setSettings(updated);
    setStatusBanner('✅ Career Goal & Settings updated successfully!');
    setTimeout(() => setStatusBanner(''), 3000);
  };

  const handleExport = async () => {
    const json = await exportDatabaseBackup();
    setBackupJson(json);
    setShowBackupModal(true);
  };

  const handleResetConfirm = async () => {
    await resetDatabaseToDefaults();
    setResetModalVisible(false);
    setStatusBanner('✅ Database reset to initial baseline.');
    setTimeout(() => {
      setStatusBanner('');
      router.replace('/(tabs)' as any);
    }, 1500);
  };

  if (!settings) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.textSecondary }}>Loading settings...</Text>
      </View>
    );
  }

  const liveCountdownDays = getDaysUntilTarget(targetDate || '2026-12-31');

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
        <Text style={styles.headerTitle}>SETTINGS & GOALS</Text>
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
        {statusBanner ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{statusBanner}</Text>
          </View>
        ) : null}

        {/* Primary Goal Configuration */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              🎯 {goalTitle ? goalTitle.toUpperCase() : 'CAREER GOAL'}
            </Text>
            <View style={styles.liveTag}>
              <Text style={styles.liveTagText}>EDITABLE</Text>
            </View>
          </View>

          {/* Live Preview Card */}
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewBadgeText}>LIVE BADGE PREVIEW</Text>
              <Text style={styles.previewSubBadge}>Dashboard Header View</Text>
            </View>
            <View style={styles.previewBody}>
              <Text style={styles.previewIcon}>🎯</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewGoalTitle} numberOfLines={1}>
                  {goalTitle || 'CAREER GOAL'}
                </Text>
                <Text style={styles.previewGoalRole} numberOfLines={1}>
                  {targetRole || 'Target Role'} {targetPackage ? `• ${targetPackage}` : ''}
                </Text>
              </View>
              <View style={styles.previewCountdown}>
                <Text style={styles.previewDaysNumber}>{liveCountdownDays}</Text>
                <Text style={styles.previewDaysLabel}>DAYS LEFT</Text>
              </View>
            </View>
          </View>

          {/* Goal Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>GOAL TITLE / BADGE TEXT</Text>
            <TextInput
              style={styles.textInput}
              value={goalTitle}
              onChangeText={setGoalTitle}
              placeholder="e.g. DECEMBER 2026 GOAL"
              placeholderTextColor={COLORS.textMuted}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {['DECEMBER 2026 GOAL', 'SOC ANALYST 2026', 'CYBER ENGINEER 2027', 'JOB READY 2026'].map((title) => (
                <TouchableOpacity
                  key={title}
                  style={[styles.chipBtn, goalTitle === title && styles.chipBtnActive]}
                  onPress={() => setGoalTitle(title)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, goalTitle === title && styles.chipTextActive]}>
                    {title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Target Role Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TARGET CYBER SECURITY ROLE</Text>
            <TextInput
              style={styles.textInput}
              value={targetRole}
              onChangeText={setTargetRole}
              placeholder="e.g. SOC Analyst / Cyber Security Engineer"
              placeholderTextColor={COLORS.textMuted}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {[
                'SOC Analyst (L1/L2)',
                'Cyber Security Engineer',
                'Penetration Tester',
                'Cloud Security Analyst',
                'Incident Responder',
              ].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[styles.chipBtn, targetRole === role && styles.chipBtnActive]}
                  onPress={() => setTargetRole(role)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, targetRole === role && styles.chipTextActive]}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Target Deadline Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TARGET DEADLINE (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.textInput}
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="YYYY-MM-DD (e.g. 2026-12-31)"
              placeholderTextColor={COLORS.textMuted}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {[
                { label: 'Dec 2026', date: '2026-12-31' },
                { label: 'Jun 2027', date: '2027-06-30' },
                { label: 'Dec 2027', date: '2027-12-31' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.date}
                  style={[styles.chipBtn, targetDate === item.date && styles.chipBtnActive]}
                  onPress={() => setTargetDate(item.date)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, targetDate === item.date && styles.chipTextActive]}>
                    {item.label} ({item.date})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Target CTC / Package */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TARGET SALARY / PACKAGE (CTC)</Text>
            <TextInput
              style={styles.textInput}
              value={targetPackage}
              onChangeText={setTargetPackage}
              placeholder="e.g. 12 - 18 LPA or $95,000/yr"
              placeholderTextColor={COLORS.textMuted}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {['6 - 10 LPA', '12 - 18 LPA', '20 - 30 LPA', '$95K+ USD'].map((pkg) => (
                <TouchableOpacity
                  key={pkg}
                  style={[styles.chipBtn, targetPackage === pkg && styles.chipBtnActive]}
                  onPress={() => setTargetPackage(pkg)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, targetPackage === pkg && styles.chipTextActive]}>
                    {pkg}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Study Target & Reminders */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⏱️ STUDY & REMINDER PREFERENCES</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DAILY STUDY TARGET (HOURS/DAY)</Text>
            <TextInput
              style={styles.textInput}
              value={studyTarget}
              onChangeText={setStudyTarget}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>DEFAULT TASK REMINDER</Text>
            <View style={styles.optionsRow}>
              {[10, 15, 30, 60].map((mins) => {
                const isSelected = defaultReminder === mins;
                return (
                  <TouchableOpacity
                    key={mins}
                    style={[
                      styles.optionBtn,
                      isSelected && styles.optionBtnSelected,
                    ]}
                    onPress={() => setDefaultReminder(mins)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {mins} mins
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Toggle */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchTitle}>Local Push Notifications</Text>
              <Text style={styles.switchSub}>Receive alerts for scheduled tasks</Text>
            </View>
            <Switch
              value={notifEnabled}
              onValueChange={setNotifEnabled}
              trackColor={{ false: COLORS.surfaceBorder, true: COLORS.primary }}
              thumbColor={COLORS.textPrimary}
            />
          </View>
        </View>

        {/* Data Backup & Export */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💾 DATA MANAGEMENT</Text>

          <TouchableOpacity
            style={styles.actionRowBtn}
            onPress={handleExport}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={18} color={COLORS.secondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.actionBtnTitle}>Export JSON Backup</Text>
              <Text style={styles.actionBtnSub}>Save all tasks, jobs & study logs</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRowBtn, { borderTopWidth: 1, borderTopColor: COLORS.surfaceBorder }]}
            onPress={() => setResetModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={18} color={COLORS.danger} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.actionBtnTitle, { color: COLORS.danger }]}>
                Reset Database to Defaults
              </Text>
              <Text style={styles.actionBtnSub}>Restore initial seed configuration</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>SAVE SETTINGS</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* JSON Backup View */}
      {showBackupModal && (
        <View style={styles.backupOverlay}>
          <View style={styles.backupModal}>
            <Text style={styles.backupTitle}>DATABASE BACKUP (JSON)</Text>
            <TextInput
              style={styles.backupText}
              value={backupJson}
              multiline
              editable={false}
            />
            <TouchableOpacity
              style={styles.backupCloseBtn}
              onPress={() => setShowBackupModal(false)}
            >
              <Text style={styles.backupCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Reset Confirmation */}
      <DeleteModal
        visible={resetModalVisible}
        title="Reset All Data?"
        message="This will reset all your tasks, job applications, and study logs back to default starter roadmap data."
        onConfirm={handleResetConfirm}
        onCancel={() => setResetModalVisible(false)}
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
  banner: {
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  bannerText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  liveTag: {
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.25)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  liveTagText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  previewCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    padding: 12,
    marginBottom: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewBadgeText: {
    color: COLORS.secondary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  previewSubBadge: {
    color: COLORS.textMuted,
    fontSize: 9,
  },
  previewBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewIcon: {
    fontSize: 22,
  },
  previewGoalTitle: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  previewGoalRole: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  previewCountdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  previewDaysNumber: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  previewDaysLabel: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  chipScroll: {
    marginTop: 8,
    flexDirection: 'row',
  },
  chipBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
  },
  chipBtnActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: COLORS.secondary,
  },
  chipText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextActive: {
    color: COLORS.secondary,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingVertical: 8,
    alignItems: 'center',
  },
  optionBtnSelected: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: COLORS.secondary,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: COLORS.secondary,
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  switchTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  switchSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  actionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  actionBtnTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  actionBtnSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  backupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 11, 20, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backupModal: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    padding: 16,
  },
  backupTitle: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  backupText: {
    backgroundColor: COLORS.background,
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: 'Courier',
    borderRadius: 8,
    padding: 10,
    height: 300,
    textAlignVertical: 'top',
  },
  backupCloseBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  backupCloseText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '800',
  },
});
