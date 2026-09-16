import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/theme';
import { JOB_STAGES } from '../../src/constants/categories';
import { createJob } from '../../src/database/jobQueries';
import { getTodayString } from '../../src/utils/dateUtils';
import { JobItem } from '../../src/database/db';

export default function AddJobScreen() {
  const router = useRouter();

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('SOC Analyst');
  const [url, setUrl] = useState('');
  const [location, setLocation] = useState('');
  const [workType, setWorkType] = useState<JobItem['work_type']>('Remote');
  const [salary, setSalary] = useState('');
  const [dateApplied, setDateApplied] = useState(getTodayString());
  const [status, setStatus] = useState<JobItem['status']>('Applied');
  const [interviewDate, setInterviewDate] = useState('');
  const [recruiter, setRecruiter] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async () => {
    if (!company.trim()) {
      setErrorMsg('Company name is required');
      return;
    }
    if (!role.trim()) {
      setErrorMsg('Job role is required');
      return;
    }

    try {
      await createJob({
        company: company.trim(),
        role: role.trim(),
        url: url.trim(),
        location: location.trim(),
        work_type: workType,
        salary: salary.trim(),
        date_applied: dateApplied.trim(),
        status,
        interview_date: interviewDate.trim() || null,
        recruiter: recruiter.trim(),
        notes: notes.trim(),
      });

      router.back();
    } catch {
      setErrorMsg('Failed to save job entry.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>TRACK CYBER JOB</Text>
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

        {/* Company & Role */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>COMPANY NAME *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Deloitte, CrowdStrike, Mandiant..."
            placeholderTextColor={COLORS.textMuted}
            value={company}
            onChangeText={(t) => {
              setCompany(t);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>JOB ROLE *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. SOC Analyst L1, Penetration Tester, Security Engineer..."
            placeholderTextColor={COLORS.textMuted}
            value={role}
            onChangeText={(t) => {
              setRole(t);
              if (errorMsg) setErrorMsg('');
            }}
          />
        </View>

        {/* Status Stage */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PIPELINE STATUS</Text>
          <View style={styles.stagesGrid}>
            {JOB_STAGES.map((st) => {
              const isSelected = status === st.id;
              return (
                <TouchableOpacity
                  key={st.id}
                  style={[
                    styles.stageChip,
                    isSelected && { backgroundColor: `${st.color}25`, borderColor: st.color },
                  ]}
                  onPress={() => setStatus(st.id as JobItem['status'])}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.stageChipText,
                      isSelected && { color: st.color, fontWeight: '800' },
                    ]}
                  >
                    {st.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Work Type */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>WORK TYPE</Text>
          <View style={styles.workTypeRow}>
            {(['Remote', 'Hybrid', 'On-site'] as const).map((wt) => {
              const isSelected = workType === wt;
              return (
                <TouchableOpacity
                  key={wt}
                  style={[
                    styles.workTypeBtn,
                    isSelected && styles.workTypeBtnActive,
                  ]}
                  onPress={() => setWorkType(wt)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.workTypeText,
                      isSelected && styles.workTypeTextActive,
                    ]}
                  >
                    {wt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Salary & Location Row */}
        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>SALARY / CTC</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. ₹6.5 LPA"
              placeholderTextColor={COLORS.textMuted}
              value={salary}
              onChangeText={setSalary}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>LOCATION</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Bengaluru / Noida"
              placeholderTextColor={COLORS.textMuted}
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        {/* Job URL & Date Applied */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>JOB POSTING URL</Text>
          <TextInput
            style={styles.textInput}
            placeholder="https://careers.company.com/job/123"
            placeholderTextColor={COLORS.textMuted}
            value={url}
            onChangeText={setUrl}
            keyboardType="url"
          />
        </View>

        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>DATE APPLIED</Text>
            <TextInput
              style={styles.textInput}
              value={dateApplied}
              onChangeText={setDateApplied}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>INTERVIEW DATE & TIME</Text>
            <TextInput
              style={styles.textInput}
              placeholder="22 Sep, 11:00 AM"
              placeholderTextColor={COLORS.textMuted}
              value={interviewDate}
              onChangeText={setInterviewDate}
            />
          </View>
        </View>

        {/* Recruiter & Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>RECRUITER / CONTACT</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Priya Sharma (HR / LinkedIn)"
            placeholderTextColor={COLORS.textMuted}
            value={recruiter}
            onChangeText={setRecruiter}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PREPARATION NOTES / INTERVIEW FOCUS</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Key topics: Splunk queries, TCP handshake, OWASP Top 10, behavioral questions..."
            placeholderTextColor={COLORS.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>ADD TO TRACKER</Text>
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
  stagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stageChip: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stageChipText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  workTypeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  workTypeBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingVertical: 10,
    alignItems: 'center',
  },
  workTypeBtnActive: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: COLORS.secondary,
  },
  workTypeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  workTypeTextActive: {
    color: COLORS.secondary,
    fontWeight: '800',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
