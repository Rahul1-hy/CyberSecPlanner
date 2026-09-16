import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/theme';
import { JOB_STAGES } from '../../src/constants/categories';
import { JobItem } from '../../src/database/db';
import {
  getJobById,
  updateJob,
  deleteJob,
} from '../../src/database/jobQueries';
import { DeleteModal } from '../../src/components/DeleteModal';

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [job, setJob] = useState<JobItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [url, setUrl] = useState('');
  const [location, setLocation] = useState('');
  const [workType, setWorkType] = useState<JobItem['work_type']>('Remote');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState<JobItem['status']>('Applied');
  const [interviewDate, setInterviewDate] = useState('');
  const [recruiter, setRecruiter] = useState('');
  const [notes, setNotes] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    async function load() {
      if (id) {
        const found = await getJobById(id);
        if (found) {
          setJob(found);
          setCompany(found.company);
          setRole(found.role);
          setUrl(found.url || '');
          setLocation(found.location || '');
          setWorkType(found.work_type);
          setSalary(found.salary || '');
          setStatus(found.status);
          setInterviewDate(found.interview_date || '');
          setRecruiter(found.recruiter || '');
          setNotes(found.notes || '');
        }
      }
    }
    load();
  }, [id]);

  const handleSaveEdit = async () => {
    if (!job) return;
    const updated = await updateJob({
      ...job,
      company: company.trim(),
      role: role.trim(),
      url: url.trim(),
      location: location.trim(),
      work_type: workType,
      salary: salary.trim(),
      status,
      interview_date: interviewDate.trim() || null,
      recruiter: recruiter.trim(),
      notes: notes.trim(),
    });
    setJob(updated);
    setIsEditing(false);
  };

  const handleStageChange = async (nextStatus: JobItem['status']) => {
    if (!job) return;
    const updated = await updateJob({
      ...job,
      status: nextStatus,
    });
    setJob(updated);
    setStatus(nextStatus);
  };

  const handleConfirmDelete = async () => {
    if (id) {
      await deleteJob(id);
      setDeleteModalVisible(false);
      router.back();
    }
  };

  const handleOpenUrl = () => {
    if (job?.url) {
      Linking.openURL(job.url).catch(() => {});
    }
  };

  if (!job) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.textSecondary }}>Loading job details...</Text>
      </View>
    );
  }

  const stageInfo = JOB_STAGES.find((s) => s.id === job.status) || JOB_STAGES[0];

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
        <Text style={styles.headerTitle}>JOB APPLICATION</Text>
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
          /* Edit Form */
          <View style={styles.editSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>COMPANY</Text>
              <TextInput
                style={styles.textInput}
                value={company}
                onChangeText={setCompany}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>ROLE</Text>
              <TextInput
                style={styles.textInput}
                value={role}
                onChangeText={setRole}
              />
            </View>

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
                    >
                      <Text style={[styles.stageChipText, isSelected && { color: st.color }]}>
                        {st.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>SALARY</Text>
                <TextInput
                  style={styles.textInput}
                  value={salary}
                  onChangeText={setSalary}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>LOCATION</Text>
                <TextInput
                  style={styles.textInput}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>INTERVIEW DATE</Text>
              <TextInput
                style={styles.textInput}
                value={interviewDate}
                onChangeText={setInterviewDate}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>RECRUITER CONTACT</Text>
              <TextInput
                style={styles.textInput}
                value={recruiter}
                onChangeText={setRecruiter}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>PREPARATION NOTES</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                multiline
              />
            </View>

            <TouchableOpacity style={styles.saveBtnLarge} onPress={handleSaveEdit}>
              <Text style={styles.saveBtnLargeText}>SAVE CHANGES</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* View Mode */
          <View style={styles.viewSection}>
            {/* Top Badge & Company */}
            <View style={styles.companyRow}>
              <View>
                <Text style={styles.companyName}>{job.company}</Text>
                <Text style={styles.roleTitle}>{job.role}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${stageInfo.color}22` }]}>
                <Text style={[styles.statusText, { color: stageInfo.color }]}>
                  {stageInfo.label}
                </Text>
              </View>
            </View>

            {/* Quick Status Stage Transitions */}
            <View style={styles.pipelineBar}>
              <Text style={styles.pipelineBarLabel}>STAGE PROGRESSION</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pipelineBarScroll}>
                {JOB_STAGES.map((st) => {
                  const isCurrent = job.status === st.id;
                  return (
                    <TouchableOpacity
                      key={st.id}
                      style={[
                        styles.pipelineStepBtn,
                        isCurrent && { backgroundColor: `${st.color}25`, borderColor: st.color },
                      ]}
                      onPress={() => handleStageChange(st.id as JobItem['status'])}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.pipelineStepText, isCurrent && { color: st.color, fontWeight: '800' }]}>
                        {st.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsCard}>
              <View style={styles.detailItem}>
                <Ionicons name="cash-outline" size={16} color={COLORS.primary} />
                <Text style={styles.detailLabel}>Salary / CTC:</Text>
                <Text style={[styles.detailValue, { color: COLORS.primary }]}>
                  {job.salary || 'Not specified'}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={16} color={COLORS.secondary} />
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.detailValue}>{job.location || 'Remote'}</Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="briefcase-outline" size={16} color={COLORS.mediumPriority} />
                <Text style={styles.detailLabel}>Work Type:</Text>
                <Text style={styles.detailValue}>{job.work_type}</Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.detailLabel}>Applied Date:</Text>
                <Text style={styles.detailValue}>{job.date_applied || 'Recent'}</Text>
              </View>

              {job.interview_date ? (
                <View style={[styles.detailItem, styles.interviewHighlight]}>
                  <Ionicons name="alarm-outline" size={16} color={COLORS.mediumPriority} />
                  <Text style={styles.detailLabel}>Interview:</Text>
                  <Text style={[styles.detailValue, { color: COLORS.mediumPriority, fontWeight: '800' }]}>
                    {job.interview_date}
                  </Text>
                </View>
              ) : null}

              {job.recruiter ? (
                <View style={styles.detailItem}>
                  <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.detailLabel}>Contact:</Text>
                  <Text style={styles.detailValue}>{job.recruiter}</Text>
                </View>
              ) : null}
            </View>

            {/* Preparation Notes */}
            {job.notes ? (
              <View style={styles.notesCard}>
                <Text style={styles.notesCardTitle}>📝 PREPARATION NOTES & TOPICS</Text>
                <Text style={styles.notesCardContent}>{job.notes}</Text>
              </View>
            ) : null}

            {/* External URL Action */}
            {job.url ? (
              <TouchableOpacity
                style={styles.openUrlBtn}
                onPress={handleOpenUrl}
                activeOpacity={0.8}
              >
                <Ionicons name="open-outline" size={18} color={COLORS.background} />
                <Text style={styles.openUrlBtnText}>OPEN JOB POSTING</Text>
              </TouchableOpacity>
            ) : null}

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => setDeleteModalVisible(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
              <Text style={styles.deleteBtnText}>Remove from Tracker</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        visible={deleteModalVisible}
        title="Delete Job Entry?"
        message={`Are you sure you want to remove "${job.company} - ${job.role}"?`}
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
  companyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyName: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  roleTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  pipelineBar: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 12,
    marginBottom: 16,
  },
  pipelineBarLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  pipelineBarScroll: {
    gap: 8,
  },
  pipelineStepBtn: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  pipelineStepText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 14,
    gap: 12,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  detailValue: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  interviewHighlight: {
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    padding: 8,
    borderRadius: 6,
  },
  notesCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 14,
    marginBottom: 16,
  },
  notesCardTitle: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  notesCardContent: {
    color: COLORS.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  openUrlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
  },
  openUrlBtnText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
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
  stagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  stageChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  stageChipText: {
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
