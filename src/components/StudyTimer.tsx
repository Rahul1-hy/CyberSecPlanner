import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { CATEGORIES } from '../constants/categories';
import { logStudySession } from '../database/studyQueries';
import { getTodayString } from '../utils/dateUtils';

interface StudyTimerProps {
  onSessionSaved?: () => void;
}

export function StudyTimer({ onSessionSaved }: StudyTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [topic, setTopic] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const handleSaveSession = async () => {
    const minutes = Math.max(1, Math.round(seconds / 60));
    await logStudySession({
      topic: topic.trim() || `${selectedCategory} Study Session`,
      category: selectedCategory,
      start_time: new Date(Date.now() - seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      end_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration_minutes: minutes,
      date: getTodayString(),
      notes: 'Logged via CyberSec Focus Timer',
    });

    setSavedSuccess(true);
    resetTimer();
    setTopic('');
    if (onSessionSaved) onSessionSaved();

    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const formatDisplayTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <View style={[styles.pulseDot, isActive && styles.pulseDotActive]} />
          <Text style={styles.badgeText}>FOCUS STUDY SESSION</Text>
        </View>
        {savedSuccess && (
          <Text style={styles.savedBanner}>✅ Session Saved!</Text>
        )}
      </View>

      {/* Clock Display */}
      <View style={styles.timerDisplayContainer}>
        <Text style={[styles.timerDigits, isActive && styles.timerDigitsActive]}>
          {formatDisplayTime(seconds)}
        </Text>
      </View>

      {/* Inputs */}
      <TextInput
        style={styles.topicInput}
        placeholder="Enter study topic (e.g. Wireshark PCAP analysis, Splunk SPL)..."
        placeholderTextColor={COLORS.textMuted}
        value={topic}
        onChangeText={setTopic}
      />

      {/* Category Chips */}
      <View style={styles.chipsRow}>
        {CATEGORIES.slice(0, 5).map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                isSelected && { backgroundColor: `${cat.color}25`, borderColor: cat.color },
              ]}
              onPress={() => setSelectedCategory(cat.name)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected && { color: cat.color, fontWeight: '700' },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Controls */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.mainBtn, isActive ? styles.pauseBtn : styles.startBtn]}
          onPress={toggleTimer}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isActive ? 'pause' : 'play'}
            size={18}
            color={COLORS.background}
          />
          <Text style={styles.mainBtnText}>
            {isActive ? 'Pause Timer' : seconds > 0 ? 'Resume' : 'Start Focus'}
          </Text>
        </TouchableOpacity>

        {seconds > 0 && (
          <>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveSession}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.primary} />
              <Text style={styles.saveBtnText}>Save & Log</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetBtn}
              onPress={resetTimer}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          </>
        )}
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
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textMuted,
  },
  pulseDotActive: {
    backgroundColor: COLORS.secondary,
  },
  badgeText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  savedBanner: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  timerDisplayContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  timerDigits: {
    color: COLORS.textPrimary,
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: 'Courier',
  },
  timerDigitsActive: {
    color: COLORS.secondary,
  },
  topicInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 13,
    marginBottom: 10,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  startBtn: {
    backgroundColor: COLORS.primary,
  },
  pauseBtn: {
    backgroundColor: COLORS.mediumPriority,
  },
  mainBtnText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '800',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 255, 157, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 157, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  resetBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
