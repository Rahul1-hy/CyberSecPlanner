import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../src/components/Header';
import { ProgressBar } from '../../src/components/ProgressBar';
import { SkillSlider } from '../../src/components/SkillSlider';
import { COLORS } from '../../src/constants/theme';
import { SkillItem, StudySessionItem } from '../../src/database/db';
import { getAllSkills, updateSkillProgress } from '../../src/database/skillQueries';
import { getAllStudySessions } from '../../src/database/studyQueries';
import { calculateJobReadiness, ReadinessBreakdown } from '../../src/utils/progressCalculator';
import { formatMinutesToHours, formatDisplayDate } from '../../src/utils/dateUtils';

export default function ProgressScreen() {
  const router = useRouter();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [sessions, setSessions] = useState<StudySessionItem[]>([]);
  const [readiness, setReadiness] = useState<ReadinessBreakdown>({
    overall: 70,
    skillsScore: 65,
    tasksScore: 80,
    studyScore: 70,
    jobsScore: 60,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [skillsData, sessionsData, readinessData] = await Promise.all([
        getAllSkills(),
        getAllStudySessions(),
        calculateJobReadiness(),
      ]);
      setSkills(skillsData);
      setSessions(sessionsData);
      setReadiness(readinessData);
    } catch (err) {
      console.warn('Failed to load progress data', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleUpdateSkill = async (id: string, newProgress: number) => {
    await updateSkillProgress(id, newProgress);
    await loadData();
  };

  const totalStudyMinutes = sessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);

  const monthsList = [
    { key: '2026-09', name: 'September 2026', badge: 'CURRENT' },
    { key: '2026-10', name: 'October 2026', badge: 'UPCOMING' },
    { key: '2026-11', name: 'November 2026', badge: 'UPCOMING' },
    { key: '2026-12', name: 'December 2026', badge: 'FINAL GOAL' },
  ];

  return (
    <View style={styles.container}>
      <Header title="Overall Progress" subtitle="Cyber security competency & monthly metrics" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Master Job Readiness Card */}
        <View style={styles.card}>
          <View style={styles.readinessHeader}>
            <View>
              <Text style={styles.cardTitle}>🎯 DECEMBER 2026 READINESS INDEX</Text>
              <Text style={styles.readinessBig}>{readiness.overall}% Job Ready</Text>
            </View>
            <View style={styles.badgeGlow}>
              <Text style={styles.badgeGlowText}>TARGET DEC '26</Text>
            </View>
          </View>

          <ProgressBar progress={readiness.overall} color={COLORS.primary} height={10} />

          <View style={styles.pillarsGrid}>
            <View style={styles.pillar}>
              <Text style={styles.pillarLabel}>Technical Skills</Text>
              <ProgressBar progress={readiness.skillsScore} color={COLORS.secondary} height={5} />
            </View>
            <View style={styles.pillar}>
              <Text style={styles.pillarLabel}>Task Completion</Text>
              <ProgressBar progress={readiness.tasksScore} color={COLORS.primary} height={5} />
            </View>
            <View style={styles.pillar}>
              <Text style={styles.pillarLabel}>Lab Study Time</Text>
              <ProgressBar progress={readiness.studyScore} color={COLORS.mediumPriority} height={5} />
            </View>
            <View style={styles.pillar}>
              <Text style={styles.pillarLabel}>Applications & Funnel</Text>
              <ProgressBar progress={readiness.jobsScore} color={COLORS.accent} height={5} />
            </View>
          </View>
        </View>

        {/* Roadmap & Daily Routine Links */}
        <TouchableOpacity
          style={styles.roadmapBanner}
          onPress={() => router.push('/roadmap' as any)}
          activeOpacity={0.8}
        >
          <View style={styles.roadmapBannerLeft}>
            <View style={styles.roadmapTagRow}>
              <Ionicons name="map" size={14} color={COLORS.primary} />
              <Text style={styles.roadmapTag}>10-PHASE CYBER ROADMAP</Text>
            </View>
            <Text style={styles.roadmapTitle}>Beginner to Job Ready (10 Phases)</Text>
            <Text style={styles.roadmapSub}>
              Includes First 7 Days Micro-Lessons, 3 Capstones & Dec Timeline
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
        </TouchableOpacity>

        {/* Monthly Reports Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📅 MONTHLY REPORTS</Text>
        </View>

        <View style={styles.monthsGrid}>
          {monthsList.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={styles.monthCard}
              onPress={() => router.push(`/reports/${m.key}` as any)}
              activeOpacity={0.7}
            >
              <View style={styles.monthCardTop}>
                <Text style={styles.monthCardName}>{m.name}</Text>
                <View
                  style={[
                    styles.monthBadge,
                    m.badge === 'FINAL GOAL'
                      ? styles.monthBadgeGoal
                      : m.badge === 'CURRENT'
                      ? styles.monthBadgeCurrent
                      : styles.monthBadgeUpcoming,
                  ]}
                >
                  <Text
                    style={[
                      styles.monthBadgeText,
                      m.badge === 'FINAL GOAL'
                        ? { color: COLORS.primary }
                        : m.badge === 'CURRENT'
                        ? { color: COLORS.secondary }
                        : { color: COLORS.textMuted },
                    ]}
                  >
                    {m.badge}
                  </Text>
                </View>
              </View>

              <View style={styles.monthCardBottom}>
                <Text style={styles.viewReportText}>View Analytics</Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Skills Matrix Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.skillsTitleRow}>
            <Text style={styles.sectionTitle}>🛡️ CYBER SECURITY SKILLS MATRIX</Text>
            <Text style={styles.skillsCount}>{skills.length} competencies</Text>
          </View>
        </View>

        {skills.map((skill) => (
          <SkillSlider
            key={skill.id}
            skill={skill}
            onUpdate={handleUpdateSkill}
          />
        ))}

        {/* Study Lab Log Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.skillsTitleRow}>
            <Text style={styles.sectionTitle}>⏱️ STUDY SESSIONS LOG</Text>
            <Text style={styles.skillsCount}>Total: {formatMinutesToHours(totalStudyMinutes)}</Text>
          </View>
        </View>

        {sessions.slice(0, 5).map((s) => (
          <View key={s.id} style={styles.sessionCard}>
            <View style={styles.sessionLeft}>
              <Text style={styles.sessionTopic}>{s.topic}</Text>
              <Text style={styles.sessionSub}>
                {s.category} • {formatDisplayDate(s.date)}
              </Text>
            </View>
            <View style={styles.sessionDuration}>
              <Text style={styles.sessionDurationText}>
                {formatMinutesToHours(s.duration_minutes)}
              </Text>
            </View>
          </View>
        ))}

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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.3)',
    padding: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  readinessBig: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  badgeGlow: {
    backgroundColor: 'rgba(0, 255, 157, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeGlowText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  pillarsGrid: {
    marginTop: 14,
    gap: 8,
  },
  pillar: {
    gap: 4,
  },
  pillarLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  roadmapBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.3)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roadmapBannerLeft: {
    flex: 1,
    marginRight: 10,
  },
  roadmapTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  roadmapTag: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  roadmapTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  roadmapSub: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  skillsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillsCount: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  monthsGrid: {
    gap: 10,
    marginBottom: 16,
  },
  monthCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 14,
  },
  monthCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  monthCardName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  monthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  monthBadgeGoal: {
    backgroundColor: 'rgba(0, 255, 157, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.4)',
  },
  monthBadgeCurrent: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  monthBadgeUpcoming: {
    backgroundColor: COLORS.surfaceLight,
  },
  monthBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  monthCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  viewReportText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  sessionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 12,
    marginBottom: 8,
  },
  sessionLeft: {
    flex: 1,
    marginRight: 8,
  },
  sessionTopic: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  sessionSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  sessionDuration: {
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  sessionDurationText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '800',
  },
});
