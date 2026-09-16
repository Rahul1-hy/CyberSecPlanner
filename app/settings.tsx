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
  const [targetRole, setTargetRole] = useState('');
  const [targetDate, setTargetDate] = useState('2026-12-31');
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
      setTargetRole(current.target_role);
      setTargetDate(current.target_date);
      setStudyTarget(String(current.daily_study_target_hours || 6));
      setDefaultReminder(current.default_reminder_minutes || 30);
      setNotifEnabled(current.notifications_enabled === 1);
    }
    load();
  }, []);

  const handleSave = async () => {
    const updated = await updateAppSettings({
      target_role: targetRole.trim(),
      target_date: targetDate.trim(),
      daily_study_target_hours: parseInt(studyTarget, 10) || 6,
      default_reminder_minutes: defaultReminder,
      notifications_enabled: notifEnabled ? 1 : 0,
    });
    setSettings(updated);
    setStatusBanner('✅ Settings updated successfully!');
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
          <Text style={styles.sectionTitle}>🎯 DECEMBER 2026 GOAL</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TARGET CYBER SECURITY ROLE</Text>
            <TextInput
              style={styles.textInput}
              value={targetRole}
              onChangeText={setTargetRole}
              placeholder="e.g. SOC Analyst / Cyber Security Engineer"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>TARGET DEADLINE (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.textInput}
              value={targetDate}
              onChangeText={setTargetDate}
            />
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
    backgroundColor: 'rgba(0, 255, 157, 0.15)',
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
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 14,
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
