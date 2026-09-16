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
import { ROADMAP_PHASES, FIRST_7_DAYS_PLAN, RoadmapPhase, DayGuideItem } from '../src/constants/roadmapData';
import { ProgressBar } from '../src/components/ProgressBar';
import { generateDailyRoutineTasks } from '../src/database/taskQueries';

type RoadmapTab = 'phases' | 'first7days' | 'projects' | 'timeline';

export default function RoadmapScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RoadmapTab>('phases');
  const [expandedPhaseId, setExpandedPhaseId] = useState<string | null>('phase-1');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [completedTopics, setCompletedTopics] = useState<{ [key: string]: boolean }>({});
  const [appliedMsg, setAppliedMsg] = useState<string | null>(null);

  const handleApplyPreset = async (presetId: string, label: string) => {
    try {
      await generateDailyRoutineTasks(undefined, presetId);
      setAppliedMsg(`Schedule for ${label} applied to Today's Tasks!`);
      setTimeout(() => {
        setAppliedMsg(null);
      }, 3000);
    } catch (e) {
      console.warn('Error applying preset', e);
    }
  };

  const toggleTopic = (topicKey: string) => {
    setCompletedTopics((prev) => ({
      ...prev,
      [topicKey]: !prev[topicKey],
    }));
  };

  const totalTopicsCount = ROADMAP_PHASES.reduce((acc, p) => acc + p.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const overallRoadmapProgress = Math.round((completedCount / totalTopicsCount) * 100);

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
        <Text style={styles.headerTitle}>CYBER SECURITY ROADMAP</Text>
        <TouchableOpacity
          style={styles.routineNavBtn}
          onPress={() => router.push('/routine' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="time-outline" size={14} color={COLORS.secondary} />
          <Text style={styles.routineNavBtnText}>Routine</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Overview Card */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <View>
            <Text style={styles.progressTag}>🎯 ZERO TO JOB READY (DEC 2026)</Text>
            <Text style={styles.progressMainTitle}>
              {completedCount} of {totalTopicsCount} Topics Completed
            </Text>
          </View>
          <View style={styles.progressCircle}>
            <Text style={styles.progressCircleText}>{overallRoadmapProgress}%</Text>
          </View>
        </View>
        <ProgressBar
          progress={overallRoadmapProgress || 15}
          color={COLORS.primary}
          height={8}
          showPercentage={false}
        />
      </View>

      {appliedMsg && (
        <View style={styles.toastBanner}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
          <Text style={styles.toastText}>{appliedMsg}</Text>
        </View>
      )}

      {/* Tab Selectors */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {[
            { id: 'phases', label: '10 Phases' },
            { id: 'first7days', label: '📅 First 7 Days' },
            { id: 'projects', label: '💻 3 Projects' },
            { id: 'timeline', label: '🗓️ Dec Timeline' },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tabBtn, isSelected && styles.tabBtnSelected]}
                onPress={() => setActiveTab(tab.id as RoadmapTab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabBtnText, isSelected && styles.tabBtnTextSelected]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TAB 1: 10 PHASES */}
        {activeTab === 'phases' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>🗺️ THE 10 ROADMAP PHASES</Text>
              <Text style={styles.sectionCount}>10 Complete Phases</Text>
            </View>

            {ROADMAP_PHASES.map((phase: RoadmapPhase) => {
              const isExpanded = expandedPhaseId === phase.id;
              const phaseCompletedCount = phase.topics.filter(
                (t, idx) => completedTopics[`${phase.id}-${idx}`]
              ).length;
              const phasePct = Math.round((phaseCompletedCount / phase.topics.length) * 100);

              return (
                <View
                  key={phase.id}
                  style={[
                    styles.phaseCard,
                    isExpanded && { borderColor: phase.color },
                  ]}
                >
                  {/* Phase Header */}
                  <TouchableOpacity
                    style={styles.phaseCardHeader}
                    onPress={() => setExpandedPhaseId(isExpanded ? null : phase.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.phaseLeft}>
                      <View style={[styles.phaseNumBadge, { backgroundColor: `${phase.color}20`, borderColor: phase.color }]}>
                        <Text style={[styles.phaseNumText, { color: phase.color }]}>
                          P{phase.phaseNumber}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.phaseTagRow}>
                          <Text style={[styles.phaseBadge, { color: phase.color }]}>
                            {phase.badge}
                          </Text>
                          <Text style={styles.phaseDuration}>• {phase.duration}</Text>
                          <Text style={styles.phaseMonth}>• {phase.month}</Text>
                        </View>
                        <Text style={styles.phaseTitle}>{phase.title}</Text>
                      </View>
                    </View>

                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.textMuted}
                    />
                  </TouchableOpacity>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <View style={styles.phaseExpandedContent}>
                      <Text style={styles.phaseSummary}>{phase.summary}</Text>

                      {/* Topics Checklist */}
                      <Text style={styles.subSectionTitle}>TOPICS TO MASTER:</Text>
                      {phase.topics.map((topic, idx) => {
                        const key = `${phase.id}-${idx}`;
                        const isDone = !!completedTopics[key];
                        return (
                          <TouchableOpacity
                            key={idx}
                            style={styles.topicCheckRow}
                            onPress={() => toggleTopic(key)}
                            activeOpacity={0.7}
                          >
                            <View style={[styles.topicCheckbox, isDone && styles.topicCheckboxDone]}>
                              {isDone && <Ionicons name="checkmark" size={12} color={COLORS.background} />}
                            </View>
                            <Text style={[styles.topicText, isDone && styles.topicTextDone]}>
                              {topic}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}

                      {/* Commands */}
                      {phase.commands && phase.commands.length > 0 && (
                        <View style={styles.commandsBox}>
                          <Text style={styles.commandsLabel}>KEY COMMANDS & TOOLS:</Text>
                          <View style={styles.cmdChipsRow}>
                            {phase.commands.map((cmd, i) => (
                              <View key={i} style={styles.cmdChip}>
                                <Text style={styles.cmdText}>{cmd}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Milestone Goal */}
                      <View style={styles.goalBox}>
                        <Ionicons name="flag" size={14} color={COLORS.primary} />
                        <Text style={styles.goalText}>
                          <Text style={{ fontWeight: '800', color: COLORS.primary }}>Target Goal: </Text>
                          {phase.goal}
                        </Text>
                      </View>

                      {/* Project Callout if exists */}
                      {phase.project && (
                        <View style={styles.projectCallout}>
                          <Text style={styles.projCalloutTitle}>🔥 Hands-on Project: {phase.project.title}</Text>
                          <Text style={styles.projCalloutDesc}>{phase.project.description}</Text>
                        </View>
                      )}

                      {/* 1-Tap Activate Routine for this Phase */}
                      <TouchableOpacity
                        style={styles.activatePhaseBtn}
                        onPress={() => handleApplyPreset(phase.id, phase.title)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="flash" size={14} color={COLORS.background} />
                        <Text style={styles.activatePhaseBtnText}>
                          Apply {phase.title} to Today's Schedule
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 2: FIRST 7 DAYS PLAN */}
        {activeTab === 'first7days' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>📅 FIRST 7 DAYS ACCELERATOR</Text>
              <Text style={styles.sectionCount}>Week 1 Foundation</Text>
            </View>

            <View style={styles.bannerInfo}>
              <Ionicons name="information-circle-outline" size={18} color={COLORS.secondary} />
              <Text style={styles.bannerInfoText}>
                Complete 1 day at a time using the 40% Theory + 40% Practice formula.
              </Text>
            </View>

            {FIRST_7_DAYS_PLAN.map((dayItem: DayGuideItem) => {
              const isExpanded = expandedDay === dayItem.day;
              return (
                <View key={dayItem.day} style={styles.dayCard}>
                  <TouchableOpacity
                    style={styles.dayCardHeader}
                    onPress={() => setExpandedDay(isExpanded ? null : dayItem.day)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dayHeaderLeft}>
                      <View style={styles.dayBadge}>
                        <Text style={styles.dayBadgeText}>DAY {dayItem.day}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.dayTitle}>{dayItem.title}</Text>
                        <Text style={styles.daySub}>{dayItem.subtitle}</Text>
                      </View>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.textMuted}
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.dayExpandedContent}>
                      {/* Theory Concepts */}
                      <Text style={styles.daySubHead}>📚 Theory & Concepts:</Text>
                      {dayItem.theory.map((item, idx) => (
                        <Text key={idx} style={styles.bulletItem}>• {item}</Text>
                      ))}

                      {/* Commands */}
                      {dayItem.commands && dayItem.commands.length > 0 && (
                        <View style={{ marginTop: 10 }}>
                          <Text style={styles.daySubHead}>⚡ Hands-on Practice Commands:</Text>
                          <View style={styles.cmdChipsRow}>
                            {dayItem.commands.map((cmd, i) => (
                              <View key={i} style={styles.cmdChip}>
                                <Text style={styles.cmdText}>{cmd}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Practice Lab */}
                      <View style={styles.practiceLabBox}>
                        <Text style={styles.practiceLabTitle}>🧪 Lab Exercise:</Text>
                        <Text style={styles.practiceLabText}>{dayItem.practiceLab}</Text>
                      </View>

                      {/* Key Takeaway */}
                      <View style={styles.takeawayBox}>
                        <Text style={styles.takeawayTitle}>💡 Key Takeaway:</Text>
                        <Text style={styles.takeawayText}>{dayItem.keyTakeaway}</Text>
                      </View>

                      {/* 1-Tap Activate Routine for this Day */}
                      <TouchableOpacity
                        style={styles.activatePhaseBtn}
                        onPress={() =>
                          handleApplyPreset(
                            `day-${dayItem.day}`,
                            `Day ${dayItem.day}: ${dayItem.title}`
                          )
                        }
                        activeOpacity={0.8}
                      >
                        <Ionicons name="flash" size={14} color={COLORS.background} />
                        <Text style={styles.activatePhaseBtnText}>
                          Apply Day {dayItem.day} to Today's Schedule
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* TAB 3: 3 CAPSTONE PROJECTS */}
        {activeTab === 'projects' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>💻 3 MAJOR PORTFOLIO PROJECTS</Text>
              <Text style={styles.sectionCount}>Job Ready Assets</Text>
            </View>

            {/* Project 1 */}
            <View style={styles.capstoneCard}>
              <View style={styles.capstoneHeader}>
                <Text style={styles.capstoneTag}>PROJECT 1</Text>
                <View style={styles.capstoneBadge}>
                  <Text style={styles.capstoneBadgeText}>PYTHON + LOGS</Text>
                </View>
              </View>
              <Text style={styles.capstoneTitle}>SOC Log Analyzer Engine</Text>
              <Text style={styles.capstoneDesc}>
                A Python-based command-line and dashboard tool that ingests Linux /var/log/auth.log and Windows Security event logs.
              </Text>

              <Text style={styles.capstoneSubTitle}>Features & Architecture:</Text>
              <View style={styles.featuresList}>
                <Text style={styles.featureItem}>• Parses auth.log and identifies repeated failed logins (Event ID 4625)</Text>
                <Text style={styles.featureItem}>• Geo-locates suspicious external IP addresses</Text>
                <Text style={styles.featureItem}>• Detects brute-force threshold breaches and outputs an incident summary</Text>
                <Text style={styles.featureItem}>• Generates PDF / HTML incident triage report</Text>
              </View>
            </View>

            {/* Project 2 */}
            <View style={styles.capstoneCard}>
              <View style={styles.capstoneHeader}>
                <Text style={[styles.capstoneTag, { color: COLORS.secondary }]}>PROJECT 2</Text>
                <View style={[styles.capstoneBadge, { backgroundColor: 'rgba(0, 229, 255, 0.15)' }]}>
                  <Text style={[styles.capstoneBadgeText, { color: COLORS.secondary }]}>NETWORK SECURITY</Text>
                </View>
              </View>
              <Text style={styles.capstoneTitle}>Lab Vulnerability & Service Scanner</Text>
              <Text style={styles.capstoneDesc}>
                A custom multi-threaded Python scanner that audits authorized lab targets, discovers open ports, grabs service banners, and flags misconfigurations.
              </Text>

              <Text style={styles.capstoneSubTitle}>Features & Architecture:</Text>
              <View style={styles.featuresList}>
                <Text style={styles.featureItem}>• Multi-threaded TCP Connect scanner with custom port ranges</Text>
                <Text style={styles.featureItem}>• Service banner grabbing (SSH, HTTP, FTP versions)</Text>
                <Text style={styles.featureItem}>• Checks for default credentials and known unpatched test services</Text>
                <Text style={styles.featureItem}>• Clean CLI output with colored warning levels</Text>
              </View>
            </View>

            {/* Project 3 */}
            <View style={styles.capstoneCard}>
              <View style={styles.capstoneHeader}>
                <Text style={[styles.capstoneTag, { color: COLORS.accent }]}>PROJECT 3</Text>
                <View style={[styles.capstoneBadge, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                  <Text style={[styles.capstoneBadgeText, { color: COLORS.accent }]}>FULL-STACK CYBER</Text>
                </View>
              </View>
              <Text style={styles.capstoneTitle}>Security Monitoring & SIEM Dashboard</Text>
              <Text style={styles.capstoneDesc}>
                Combines full-stack web development (React / Next.js + Python / FastAPI) with SOC log telemetry to build a real-time security operations dashboard.
              </Text>

              <Text style={styles.capstoneSubTitle}>Features & Architecture:</Text>
              <View style={styles.featuresList}>
                <Text style={styles.featureItem}>• Real-time WebSocket feed of incoming mock security events</Text>
                <Text style={styles.featureItem}>• Alert triage board (High, Medium, Low severity classification)</Text>
                <Text style={styles.featureItem}>• Interactive search filters by IP, Username, and Alert Type</Text>
                <Text style={styles.featureItem}>• Analyst incident notes and escalation button</Text>
              </View>
            </View>
          </View>
        )}

        {/* TAB 4: MONTH-BY-MONTH TIMELINE */}
        {activeTab === 'timeline' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>🗓️ SEPTEMBER ➔ DECEMBER JOURNEY</Text>
              <Text style={styles.sectionCount}>Target Dec 2026</Text>
            </View>

            {[
              {
                month: 'SEPTEMBER 2026',
                color: '#00e5ff',
                focus: 'Computer Basics + Networking + Linux VM Lab',
                items: ['Hardware & OS fundamentals', 'TCP/IP, Ports, DNS, Subnets', 'Linux Permissions & Bash scripting', 'Setup Ubuntu VM lab'],
              },
              {
                month: 'OCTOBER 2026',
                color: '#3b82f6',
                focus: 'Security Fundamentals + Web Security + Python',
                items: ['CIA Triad, Least Privilege, Threat Modeling', 'OWASP Top 10 (SQLi, XSS, IDOR)', 'PortSwigger Academy Labs', 'Python requests, sockets, regex'],
              },
              {
                month: 'NOVEMBER 2026',
                color: '#a855f7',
                focus: 'SOC + SIEM (Splunk) + Incident Response + 3 Projects',
                items: ['SOC Analyst tier workflows', 'Splunk Search Language (SPL) & Event Logs', 'Build 3 Capstone Portfolio Projects', 'TryHackMe SOC Level 1 pathway'],
              },
              {
                month: 'DECEMBER 2026',
                color: '#00ff9d',
                focus: 'Resume + Portfolio + Interviews + Job Landing 🎉',
                items: ['SOC-tailored Resume & LinkedIn optimization', 'Publish 3 Projects on GitHub with walkthroughs', 'Mock Technical & Behavioral Interviews', 'Daily 2–5 targeted job applications'],
              },
            ].map((milestone, idx) => (
              <View key={idx} style={[styles.timelineCard, { borderColor: `${milestone.color}44` }]}>
                <View style={styles.timelineHeader}>
                  <View style={[styles.timelineDot, { backgroundColor: milestone.color }]} />
                  <Text style={[styles.timelineMonth, { color: milestone.color }]}>
                    {milestone.month}
                  </Text>
                </View>
                <Text style={styles.timelineFocus}>{milestone.focus}</Text>
                <View style={styles.timelineItemsList}>
                  {milestone.items.map((it, i) => (
                    <Text key={i} style={styles.timelineItemText}>• {it}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

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
  routineNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  routineNavBtnText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '800',
  },
  progressCard: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.3)',
    padding: 14,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTag: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  progressMainTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  progressCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0, 255, 157, 0.15)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  tabsWrapper: {
    marginBottom: 10,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabBtn: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
  },
  tabBtnSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  tabBtnTextSelected: {
    color: COLORS.background,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionContainer: {},
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sectionCount: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  phaseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 12,
    overflow: 'hidden',
  },
  phaseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  phaseLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phaseNumBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseNumText: {
    fontSize: 13,
    fontWeight: '800',
  },
  phaseTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  phaseBadge: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  phaseDuration: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  phaseMonth: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  phaseTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  phaseExpandedContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    paddingTop: 12,
  },
  phaseSummary: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  subSectionTitle: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  topicCheckRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingVertical: 5,
  },
  topicCheckbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  topicCheckboxDone: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  topicText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 18,
  },
  topicTextDone: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  commandsBox: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  commandsLabel: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  cmdChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cmdChip: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cmdText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontFamily: 'Courier',
  },
  goalBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  goalText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 16,
  },
  projectCallout: {
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  projCalloutTitle: {
    color: COLORS.mediumPriority,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  projCalloutDesc: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  bannerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  bannerInfoText: {
    flex: 1,
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  dayCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    marginBottom: 10,
    overflow: 'hidden',
  },
  dayCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  dayHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayBadge: {
    backgroundColor: 'rgba(0, 255, 157, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dayBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  dayTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  daySub: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  dayExpandedContent: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceBorder,
    paddingTop: 10,
  },
  daySubHead: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  bulletItem: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    paddingLeft: 4,
  },
  practiceLabBox: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  practiceLabTitle: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  practiceLabText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    lineHeight: 16,
  },
  takeawayBox: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  takeawayTitle: {
    color: COLORS.mediumPriority,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  takeawayText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  capstoneCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 16,
    marginBottom: 14,
  },
  capstoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  capstoneTag: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  capstoneBadge: {
    backgroundColor: 'rgba(0, 255, 157, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  capstoneBadgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  capstoneTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  capstoneDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  capstoneSubTitle: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
  },
  featuresList: {
    gap: 4,
  },
  featureItem: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  timelineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timelineMonth: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timelineFocus: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  timelineItemsList: {
    gap: 4,
  },
  timelineItemText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  toastBanner: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(0, 255, 157, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toastText: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  activatePhaseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 12,
  },
  activatePhaseBtnText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '800',
  },
});
