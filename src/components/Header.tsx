import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { getGreeting, getDaysUntilTarget } from '../utils/dateUtils';
import { getAppSettings } from '../database/settingsQueries';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showGoalBadge?: boolean;
}

export function Header({ title, subtitle, showGoalBadge = true }: HeaderProps) {
  const router = useRouter();
  const [goalTitle, setGoalTitle] = useState('DECEMBER 2026 GOAL');
  const [targetRole, setTargetRole] = useState('Cyber Security Analyst / SOC');
  const [targetDate, setTargetDate] = useState('2026-12-31');

  useEffect(() => {
    let isMounted = true;
    getAppSettings().then((s) => {
      if (isMounted && s) {
        if (s.goal_title) setGoalTitle(s.goal_title);
        if (s.target_role) setTargetRole(s.target_role);
        if (s.target_date) setTargetDate(s.target_date);
      }
    }).catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const daysLeft = getDaysUntilTarget(targetDate);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <View style={styles.brandRow}>
            <View style={styles.statusDot} />
            <Text style={styles.brandText}>CAREERPILOT</Text>
          </View>
          <Text style={styles.mainTitle}>{title || getGreeting()}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/notifications' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/settings' as any)}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {showGoalBadge && (
        <TouchableOpacity
          style={styles.goalBanner}
          onPress={() => router.push('/(tabs)/progress' as any)}
          activeOpacity={0.8}
        >
          <View style={styles.goalLeft}>
            <Text style={styles.goalTargetIcon}>🎯</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.goalTitle} numberOfLines={1}>
                {goalTitle}
              </Text>
              <Text style={styles.goalSub} numberOfLines={1}>
                {targetRole}
              </Text>
            </View>
          </View>
          <View style={styles.countdownBadge}>
            <Text style={styles.countdownNumber}>{daysLeft}</Text>
            <Text style={styles.countdownLabel}>DAYS LEFT</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 6,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  brandText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  mainTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalBanner: {
    marginTop: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  goalLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  goalTargetIcon: {
    fontSize: 24,
  },
  goalTitle: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  goalSub: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  countdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(45, 212, 191, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  countdownNumber: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  countdownLabel: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
