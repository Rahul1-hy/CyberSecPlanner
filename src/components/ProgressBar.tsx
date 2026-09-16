import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 - 100
  label?: string;
  sublabel?: string;
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export function ProgressBar({
  progress,
  label,
  sublabel,
  color = COLORS.primary,
  height = 8,
  showPercentage = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <View style={styles.container}>
      {(label || showPercentage) && (
        <View style={styles.header}>
          <View style={styles.labelGroup}>
            {label && <Text style={styles.label}>{label}</Text>}
            {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
          </View>
          {showPercentage && <Text style={[styles.percentage, { color }]}>{clamped}%</Text>}
        </View>
      )}

      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              backgroundColor: color,
              shadowColor: color,
              shadowOpacity: 0.5,
              shadowRadius: 4,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  sublabel: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  percentage: {
    fontSize: 13,
    fontWeight: '800',
  },
  track: {
    width: '100%',
    backgroundColor: COLORS.surfaceBorder,
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
});
