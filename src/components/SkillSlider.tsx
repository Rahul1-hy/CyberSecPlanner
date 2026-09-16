import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SkillItem } from '../database/db';
import { COLORS } from '../constants/theme';
import { ProgressBar } from './ProgressBar';

interface SkillSliderProps {
  skill: SkillItem;
  onUpdate: (id: string, newProgress: number) => void;
}

export function SkillSlider({ skill, onUpdate }: SkillSliderProps) {
  const getLevelInfo = (val: number) => {
    if (val >= 85) return { label: 'JOB-READY 🏆', color: COLORS.primary };
    if (val >= 70) return { label: 'ADVANCED ⚡', color: COLORS.secondary };
    if (val >= 40) return { label: 'INTERMEDIATE 📈', color: COLORS.mediumPriority };
    return { label: 'FOUNDATION 🔰', color: COLORS.textMuted };
  };

  const level = getLevelInfo(skill.progress);

  const adjust = (delta: number) => {
    const nextVal = Math.min(100, Math.max(0, skill.progress + delta));
    onUpdate(skill.id, nextVal);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.nameGroup}>
          <Text style={styles.name}>{skill.name}</Text>
          <View style={[styles.badge, { backgroundColor: `${level.color}18` }]}>
            <Text style={[styles.badgeText, { color: level.color }]}>{level.label}</Text>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => adjust(-5)}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={14} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Text style={[styles.progressNumber, { color: level.color }]}>
            {skill.progress}%
          </Text>

          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => adjust(5)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ProgressBar
        progress={skill.progress}
        color={level.color}
        height={6}
        showPercentage={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 12,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameGroup: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '800',
    minWidth: 38,
    textAlign: 'center',
  },
});
