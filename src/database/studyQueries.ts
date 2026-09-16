import { db, StudySessionItem } from './db';
import { getTodayString, getMonthKey } from '../utils/dateUtils';

export async function getAllStudySessions(): Promise<StudySessionItem[]> {
  return await db.getStudySessions();
}

export async function getTodayStudyMinutes(): Promise<number> {
  const today = getTodayString();
  const sessions = await db.getStudySessions();
  return sessions
    .filter((s) => s.date === today)
    .reduce((acc, s) => acc + (s.duration_minutes || 0), 0);
}

export async function getMonthlyStudyMinutes(monthKey: string): Promise<number> {
  const sessions = await db.getStudySessions();
  return sessions
    .filter((s) => getMonthKey(s.date) === monthKey)
    .reduce((acc, s) => acc + (s.duration_minutes || 0), 0);
}

export async function getCategoryStudyBreakdown(): Promise<{ [category: string]: number }> {
  const sessions = await db.getStudySessions();
  const map: { [category: string]: number } = {};

  sessions.forEach((s) => {
    map[s.category] = (map[s.category] || 0) + s.duration_minutes;
  });

  return map;
}

export async function logStudySession(
  sessionData: Omit<StudySessionItem, 'id' | 'created_at'>
): Promise<StudySessionItem> {
  const newSession: StudySessionItem = {
    ...sessionData,
    id: `study-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    created_at: new Date().toISOString(),
  };

  return await db.saveStudySession(newSession);
}

export async function deleteStudySession(id: string): Promise<boolean> {
  return await db.deleteStudySession(id);
}
