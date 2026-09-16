import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
  onPress?: () => void;
}

export function StatCard({
  icon,
  label,
  value,
  subtext,
  color = COLORS.primary,
  onPress,
}: StatCardProps) {
  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={[styles.card, { borderColor: `${color}33` }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}18` }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text style={[styles.value, { color }]}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      {subtext && <Text style={styles.subtext}>{subtext}</Text>}
    </Component>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    minWidth: 120,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  subtext: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
});
