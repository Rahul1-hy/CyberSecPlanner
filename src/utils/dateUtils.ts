// Date & Time Utility Functions for CyberSec Planner

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatFullDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning ☀️';
  if (hour < 17) return 'Good Afternoon 🌤️';
  if (hour < 21) return 'Good Evening 🌆';
  return 'Late Night Focus 🌙';
}

export function getDaysUntilTarget(targetDateStr: string = '2026-12-31'): number {
  const [year, month, day] = targetDateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function formatMinutesToHours(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function isDateToday(dateStr: string): boolean {
  return dateStr === getTodayString();
}

export function isDateOverdue(dateStr: string, status: string): boolean {
  if (status === 'completed') return false;
  return dateStr < getTodayString();
}

export function isDateUpcoming(dateStr: string): boolean {
  return dateStr > getTodayString();
}

export function getMonthKey(dateStr: string): string {
  if (!dateStr) return '';
  return dateStr.substring(0, 7); // e.g. "2026-09"
}

export function getMonthDisplayName(monthKey: string): string {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) return monthKey;
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
