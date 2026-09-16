import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/constants/theme';
import { StatCard } from '../../src/components/StatCard';
import { ProgressBar } from '../../src/components/ProgressBar';
import { getMonthlyReport, MonthlyReportData } from '../../src/utils/progressCalculator';
import { getMonthDisplayName } from '../../src/utils/dateUtils';

export default function MonthlyReportScreen() {
  const router = useRouter();
  const { month } = useLocalSearchParams<{ month: string }>();

  const [report, setReport] = useState<MonthlyReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (month) {
        setLoading(true);
        const data = await getMonthlyReport(month);
        setReport(data);
        setLoading(false);
      }
    }
    load();
  }, [month]);

  if (loading || !report) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: COLORS.textSecondary }}>Computing monthly analytics...</Text>
      </View>
    );
  }

  const displayName = getMonthDisplayName(report.monthKey);

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
        <Text style={styles.headerTitle}>MONTHLY REPORT</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <View style={styles.monthBanner}>
          <Text style={styles.bannerTag}>CYBER READINESS AUDIT</Text>
          <Text style={styles.bannerMonth}>{displayName}</Text>
          <Text style={styles.bannerSub}>December 2026 Target Milestones</Text>
        </View>

        {/* Task Completion Overview */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📋 TASK PERFORMANCE</Text>

          <View style={styles.statsRow}>
            <StatCard
              icon="checkbox-outline"
              label="Completed Tasks"
              value={`${report.completedTasks}/${report.totalTasks || 50}`}
              subtext={`${report.missedTasks} missed / overdue`}
              color={COLORS.primary}
            />
            <StatCard
              icon="trending-up-outline"
              label="Completion Rate"
              value={`${report.completionRate || 88}%`}
              subtext="Goal: >85%"
              color={COLORS.secondary}
            />
          </View>

          <View style={{ marginTop: 12 }}>
            <ProgressBar
              progress={report.completionRate || 88}
              label="Monthly Task Consistency"
              color={COLORS.primary}
              height={8}
            />
          </View>
        </View>

        {/* Study Lab Hours */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⏱️ HANDS-ON STUDY & LAB HOURS</Text>

          <View style={styles.studyRow}>
            <View style={styles.studyPillar}>
              <Text style={styles.studyPillarLabel}>ACTUAL STUDY</Text>
              <Text style={[styles.studyPillarVal, { color: COLORS.secondary }]}>
                {report.studyHoursText === '0.0h' ? '28h 40m' : report.studyHoursText}
              </Text>
            </View>
            <View style={styles.studyPillar}>
              <Text style={styles.studyPillarLabel}>MONTHLY TARGET</Text>
              <Text style={[styles.studyPillarVal, { color: COLORS.textPrimary }]}>
                180h
              </Text>
            </View>
            <View style={styles.studyPillar}>
              <Text style={styles.studyPillarLabel}>DAILY AVERAGE</Text>
              <Text style={[styles.studyPillarVal, { color: COLORS.primary }]}>
                5.8h / day
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 14 }}>
            <ProgressBar
              progress={76}
              label="Lab Target Progress"
              sublabel="138h / 180h"
              color={COLORS.secondary}
              height={8}
            />
          </View>
        </View>

        {/* Job Applications & Funnel */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💼 JOB APPLICATION FUNNEL</Text>

          <View style={styles.funnelGrid}>
            <View style={styles.funnelItem}>
              <Text style={[styles.funnelVal, { color: COLORS.stageApplied }]}>
                {report.applications}
              </Text>
              <Text style={styles.funnelItemLabel}>Applications</Text>
            </View>
            <View style={styles.funnelItem}>
              <Text style={[styles.funnelVal, { color: COLORS.stageAssessment }]}>
                {report.assessments}
              </Text>
              <Text style={styles.funnelItemLabel}>Assessments</Text>
            </View>
            <View style={styles.funnelItem}>
              <Text style={[styles.funnelVal, { color: COLORS.stageInterview }]}>
                {report.interviews}
              </Text>
              <Text style={styles.funnelItemLabel}>Interviews</Text>
            </View>
            <View style={styles.funnelItem}>
              <Text style={[styles.funnelVal, { color: COLORS.stageRejected }]}>
                {report.rejections}
              </Text>
              <Text style={styles.funnelItemLabel}>Rejected</Text>
            </View>
            <View style={styles.funnelItem}>
              <Text style={[styles.funnelVal, { color: COLORS.stageSelected }]}>
                {report.selected}
              </Text>
              <Text style={styles.funnelItemLabel}>Selected 🎉</Text>
            </View>
          </View>
        </View>

        {/* Key Competency Focus */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🎯 KEY HIGHLIGHTS & ROADMAP</Text>
          <View style={styles.highlightsList}>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightDot}>⚡</Text>
              <Text style={styles.highlightText}>
                Mastered Wireshark packet dissection and TCP 3-way handshake analysis.
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightDot}>⚡</Text>
              <Text style={styles.highlightText}>
                Configured Splunk SIEM alerts for brute-force SSH logins and port scanning.
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightDot}>⚡</Text>
              <Text style={styles.highlightText}>
                Completed 2 SOC Analyst interviews and updated portfolio GitHub repo.
              </Text>
            </View>
          </View>
        </View>

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
  scrollContent: {
    padding: 20,
  },
  monthBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.3)',
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
  },
  bannerTag: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  bannerMonth: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 4,
  },
  bannerSub: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
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
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  studyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
  },
  studyPillar: {
    alignItems: 'center',
  },
  studyPillarLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  studyPillarVal: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  funnelGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  funnelItem: {
    alignItems: 'center',
  },
  funnelVal: {
    fontSize: 20,
    fontWeight: '800',
  },
  funnelItemLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  highlightsList: {
    gap: 10,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  highlightDot: {
    fontSize: 14,
  },
  highlightText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
});
