export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  badgeBg: string;
  description: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'Linux',
    name: 'Linux',
    icon: 'terminal',
    color: '#22c55e',
    badgeBg: 'rgba(34, 197, 94, 0.15)',
    description: 'Commands, permissions, bash scripting, server hardening',
  },
  {
    id: 'Networking',
    name: 'Networking',
    icon: 'wifi',
    color: '#3b82f6',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    description: 'TCP/IP, OSI model, subnetting, DNS, Wireshark packet analysis',
  },
  {
    id: 'Python',
    name: 'Python',
    icon: 'code',
    color: '#eab308',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    description: 'Automation scripts, socket programming, log parsers',
  },
  {
    id: 'Cyber Security Fundamentals',
    name: 'Security Fundamentals',
    icon: 'shield',
    color: '#a855f7',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    description: 'CIA triad, cryptography, authentication, threat models',
  },
  {
    id: 'Web Security',
    name: 'Web Security',
    icon: 'globe',
    color: '#ec4899',
    badgeBg: 'rgba(236, 72, 153, 0.15)',
    description: 'OWASP Top 10, SQLi, XSS, CSRF, Burp Suite testing',
  },
  {
    id: 'SOC',
    name: 'SOC Analyst',
    icon: 'eye',
    color: '#06b6d4',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    description: 'Incident response, alert triage, malware analysis, MITRE ATT&CK',
  },
  {
    id: 'SIEM',
    name: 'SIEM / Splunk',
    icon: 'cpu',
    color: '#8b5cf6',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    description: 'Splunk SPL, Elastic/Kibana, rule creation, log correlation',
  },
  {
    id: 'CTF',
    name: 'CTF / Hands-on Lab',
    icon: 'flag',
    color: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    description: 'TryHackMe, HackTheBox, VulnHub rooms & walkthroughs',
  },
  {
    id: 'Projects',
    name: 'Projects & Portfolio',
    icon: 'folder',
    color: '#14b8a6',
    badgeBg: 'rgba(20, 184, 166, 0.15)',
    description: 'Home lab setup, SOC dashboard, detection engineering repo',
  },
  {
    id: 'Interview',
    name: 'Interview Preparation',
    icon: 'user-check',
    color: '#f43f5e',
    badgeBg: 'rgba(244, 63, 94, 0.15)',
    description: 'Mock interviews, resume refinement, behavioral & technical Q&A',
  },
  {
    id: 'Revision',
    name: 'Revision & Flashcards',
    icon: 'book-open',
    color: '#64748b',
    badgeBg: 'rgba(100, 116, 139, 0.15)',
    description: 'Note review, cheat sheets, protocol revision',
  },
];

export const PRIORITY_CONFIG = {
  high: {
    label: 'High Priority',
    color: '#fb7185',
    bg: 'rgba(251, 113, 133, 0.15)',
    icon: 'alert-circle',
  },
  medium: {
    label: 'Medium Priority',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.15)',
    icon: 'clock',
  },
  low: {
    label: 'Low Priority',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.15)',
    icon: 'check-circle',
  },
};

export const JOB_STAGES = [
  { id: 'Wishlist', label: 'Wishlist', color: '#8b5cf6', icon: 'bookmark' },
  { id: 'Applied', label: 'Applied', color: '#3b82f6', icon: 'send' },
  { id: 'Assessment', label: 'Assessment', color: '#06b6d4', icon: 'file-text' },
  { id: 'Interview', label: 'Interview', color: '#f59e0b', icon: 'users' },
  { id: 'Selected', label: 'Selected 🎉', color: '#10b981', icon: 'award' },
  { id: 'Rejected', label: 'Rejected', color: '#ef4444', icon: 'x-circle' },
];
