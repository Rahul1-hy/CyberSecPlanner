// CyberSec Planner — Eye-Friendly Cyber Security Modern Design System

export const COLORS = {
  // Soft Eye-Comfort Dark Backgrounds
  background: '#0b101b',          // Deep Slate Obsidian (anti-glare)
  backgroundSecondary: '#111827', // Smooth dark navy slate
  surface: '#162035',             // Soothing Card Surface
  surfaceLight: '#1f2b45',        // Hover / Interactive Item
  surfaceBorder: '#283856',       // Gentle Border
  surfaceBorderGlow: 'rgba(45, 212, 191, 0.15)',

  // Soft Cyber Accents (No harsh piercing neon)
  primary: '#2dd4bf',             // Soothing Aqua Teal / Emerald Mint (6000K soft)
  primaryDark: '#14b8a6',
  primaryGlow: 'rgba(45, 212, 191, 0.18)',
  
  secondary: '#38bdf8',           // Soft Sky Cyan (calm & legible)
  secondaryGlow: 'rgba(56, 189, 248, 0.18)',

  accent: '#a78bfa',              // Soft Lavender Violet
  accentGlow: 'rgba(167, 139, 250, 0.18)',

  // Alerts & Priorities (Comfort Tones)
  highPriority: '#fb7185',        // Soft Coral Rose
  highPriorityGlow: 'rgba(251, 113, 133, 0.18)',
  
  mediumPriority: '#fbbf24',      // Warm Amber Gold
  mediumPriorityGlow: 'rgba(251, 191, 36, 0.18)',
  
  lowPriority: '#34d399',         // Gentle Sage Mint
  lowPriorityGlow: 'rgba(52, 211, 153, 0.18)',

  // Statuses
  success: '#34d399',
  warning: '#fbbf24',
  danger: '#fb7185',
  info: '#38bdf8',

  // Text & Typography (Gentle Contrast)
  textPrimary: '#f1f5f9',         // Warm Slate Off-White (no blinding white)
  textSecondary: '#94a3b8',       // Balanced Neutral Slate
  textMuted: '#64748b',           // Soft Inactive Slate
  textDark: '#0b101b',

  // Pipeline Stages Colors
  stageWishlist: '#a78bfa',
  stageApplied: '#60a5fa',
  stageAssessment: '#38bdf8',
  stageInterview: '#fbbf24',
  stageSelected: '#34d399',
  stageRejected: '#f87171',
};

export const SHADOWS = {
  glowPrimary: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  glowSecondary: {
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  glowDanger: {
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  mono: 'Courier',
};
