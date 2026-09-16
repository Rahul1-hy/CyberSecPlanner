// CyberSec Planner — Cyberpunk & Cyber Security Design System

export const COLORS = {
  // Deep Backgrounds
  background: '#070b14',       // Deep Matrix Obsidian
  backgroundSecondary: '#0d1322',
  surface: '#11192d',          // Card Surface
  surfaceLight: '#18233e',     // Card Hover / Accent
  surfaceBorder: '#1f2f53',    // Cyber Border
  surfaceBorderGlow: '#00ff9d44',

  // Cyber Accents & Neon Highlights
  primary: '#00ff9d',          // Matrix Terminal Emerald
  primaryDark: '#00cc7d',
  primaryGlow: 'rgba(0, 255, 157, 0.25)',
  
  secondary: '#00e5ff',        // Cyber Hologram Cyan
  secondaryGlow: 'rgba(0, 229, 255, 0.25)',

  accent: '#a855f7',           // Cyber Purple / SIEM
  accentGlow: 'rgba(168, 85, 247, 0.25)',

  // Alerts & Priorities
  highPriority: '#ff3b5c',     // Urgent Crimson
  highPriorityGlow: 'rgba(255, 59, 92, 0.25)',
  
  mediumPriority: '#ffb800',   // Warning Amber
  mediumPriorityGlow: 'rgba(255, 184, 0, 0.25)',
  
  lowPriority: '#00ff9d',      // Terminal Green
  lowPriorityGlow: 'rgba(0, 255, 157, 0.25)',

  // Statuses
  success: '#00ff9d',
  warning: '#ffb800',
  danger: '#ff3b5c',
  info: '#00e5ff',

  // Text & Typography
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textDark: '#070b14',

  // Pipeline Stages Colors
  stageWishlist: '#8b5cf6',
  stageApplied: '#3b82f6',
  stageAssessment: '#06b6d4',
  stageInterview: '#f59e0b',
  stageSelected: '#10b981',
  stageRejected: '#ef4444',
};

export const SHADOWS = {
  glowPrimary: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  glowSecondary: {
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  glowDanger: {
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  mono: 'Courier',
};
