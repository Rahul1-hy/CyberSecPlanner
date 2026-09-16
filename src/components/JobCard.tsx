import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JobItem } from '../database/db';
import { COLORS } from '../constants/theme';
import { JOB_STAGES } from '../constants/categories';

interface JobCardProps {
  job: JobItem;
  onPress?: (job: JobItem) => void;
  onStatusChange?: (id: string, nextStatus: JobItem['status']) => void;
  onDelete?: (id: string) => void;
}

export function JobCard({ job, onPress, onStatusChange, onDelete }: JobCardProps) {
  const stageInfo = JOB_STAGES.find((s) => s.id === job.status) || JOB_STAGES[0];

  const handleOpenUrl = () => {
    if (job.url) {
      Linking.openURL(job.url).catch(() => {});
    }
  };

  const getNextStage = (current: JobItem['status']): JobItem['status'] | null => {
    switch (current) {
      case 'Wishlist':
        return 'Applied';
      case 'Applied':
        return 'Assessment';
      case 'Assessment':
        return 'Interview';
      case 'Interview':
        return 'Selected';
      default:
        return null;
    }
  };

  const nextStage = getNextStage(job.status);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => onPress && onPress(job)}
        activeOpacity={0.7}
      >
        {/* Top Header */}
        <View style={styles.topRow}>
          <View style={styles.companyGroup}>
            <Text style={styles.company}>{job.company}</Text>
            <Text style={styles.role}>{job.role}</Text>
          </View>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: `${stageInfo.color}22` }]}>
            <Text style={[styles.statusText, { color: stageInfo.color }]}>
              {stageInfo.label}
            </Text>
          </View>
        </View>

        {/* Location & Salary Info */}
        <View style={styles.metaRow}>
          {job.location ? (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{job.location}</Text>
            </View>
          ) : null}

          {job.work_type ? (
            <View style={styles.metaItem}>
              <Ionicons name="briefcase-outline" size={13} color={COLORS.secondary} />
              <Text style={[styles.metaText, { color: COLORS.secondary }]}>
                {job.work_type}
              </Text>
            </View>
          ) : null}

          {job.salary ? (
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={13} color={COLORS.primary} />
              <Text style={[styles.metaText, { color: COLORS.primary }]}>{job.salary}</Text>
            </View>
          ) : null}
        </View>

        {/* Interview Alert Box */}
        {job.interview_date ? (
          <View style={styles.interviewBox}>
            <Ionicons name="calendar" size={14} color={COLORS.mediumPriority} />
            <Text style={styles.interviewText}>
              Interview: {job.interview_date}
            </Text>
          </View>
        ) : null}

        {/* Notes preview */}
        {job.notes ? (
          <Text style={styles.notes} numberOfLines={2}>
            📝 {job.notes}
          </Text>
        ) : null}
      </TouchableOpacity>

      {/* Action Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {job.url ? (
            <TouchableOpacity
              style={styles.actionBtnSecondary}
              onPress={handleOpenUrl}
              activeOpacity={0.7}
            >
              <Ionicons name="globe-outline" size={13} color={COLORS.secondary} />
              <Text style={styles.actionBtnSecText}>Job Link</Text>
            </TouchableOpacity>
          ) : null}

          {onDelete ? (
            <TouchableOpacity
              style={styles.actionBtnDanger}
              onPress={() => onDelete(job.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={13} color={COLORS.danger} />
            </TouchableOpacity>
          ) : null}
        </View>

        {nextStage && onStatusChange ? (
          <TouchableOpacity
            style={styles.advanceBtn}
            onPress={() => onStatusChange(job.id, nextStage)}
            activeOpacity={0.7}
          >
            <Text style={styles.advanceBtnText}>Move to {nextStage}</Text>
            <Ionicons name="arrow-forward" size={13} color={COLORS.background} />
          </TouchableOpacity>
        ) : null}
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
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  companyGroup: {
    flex: 1,
    marginRight: 8,
  },
  company: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  role: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  interviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 6,
  },
  interviewText: {
    color: COLORS.mediumPriority,
    fontSize: 12,
    fontWeight: '700',
  },
  notes: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 8,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionBtnSecText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtnDanger: {
    padding: 6,
  },
  advanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  advanceBtnText: {
    color: COLORS.background,
    fontSize: 11,
    fontWeight: '800',
  },
});
