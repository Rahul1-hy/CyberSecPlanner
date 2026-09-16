# 🔐 CyberSec Planner — Comprehensive Implementation Plan & Technical Architecture

Build a cross-platform (Android & Web) **Cyber Security Job Planner** app targeting career readiness by **December 2026** according to `CyberSecPlanner_Development_Plan.md`.

---

## 1. Project Overview & Architecture

### Tech Stack
- **Framework**: React Native with **Expo** (`expo-router` v3/v4 for file-based routing)
- **Language**: TypeScript (`strict: true`)
- **Database & Persistence**:
  - Native: `expo-sqlite`
  - Web & Cross-platform fallback: SQLite-compatible persistent adapter (with LocalStorage/IndexedDB fallback) allowing instant web browser preview alongside full native Android APK builds.
- **Local Notifications**: `expo-notifications` (with web notification fallback and mock scheduler)
- **Icons & UI Graphics**: `@expo/vector-icons` / `lucide-react-native`
- **Styling**: Tailored React Native StyleSheet & Design Tokens with a **Cyberpunk / Cyber Security Dark Aesthetic** (Matrix neon green `#00ff9d`, Cyber cyan `#00e5ff`, Electric crimson `#ff3b5c`, Dark terminal obsidian `#0a0f1d`, Glassmorphism card surfaces `#111827`/`#1e293b`).

```
                              ┌───────────────────────────────┐
                              │     CyberSec Planner App      │
                              │   (React Native + Expo TS)   │
                              └───────────────┬───────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
          ┌─────────▼─────────┐     ┌─────────▼─────────┐     ┌─────────▼─────────┐
          │   Expo Router     │     │ Cyber Design      │     │ State & Database  │
          │   Tabs & Stacks   │     │ System Tokens     │     │ Storage Engine    │
          └─────────┬─────────┘     └───────────────────┘     └─────────┬─────────┘
                    │                                                   │
  ┌─────────────────┼─────────────────┐                                 │
  │                 │                 │                                 │
┌─▼─────────┐ ┌─────▼─────┐ ┌─────────▼─┐                       ┌───────▼────────┐
│ 🏠 Home   │ │ 📋 Tasks  │ │ 📅 Cal    │                       │  SQLite / Web  │
├───────────┤ ├───────────┤ ├───────────┤                       │  Persistence   │
│ 💼 Jobs   │ │ 📊 Prog   │ │ ⚙️ Settings│                       │    Storage     │
└───────────┘ └───────────┘ └───────────┘                       └────────────────┘
```

---

## 2. Proposed Database Schema (SQLite)

1. **`tasks`**:
   - `id` (TEXT PRIMARY KEY / UUID)
   - `title` (TEXT NOT NULL)
   - `description` (TEXT)
   - `date` (TEXT NOT NULL, YYYY-MM-DD)
   - `start_time` (TEXT, HH:mm)
   - `end_time` (TEXT, HH:mm)
   - `priority` (TEXT: 'high' | 'medium' | 'low')
   - `category` (TEXT: 'Linux' | 'Networking' | 'Python' | 'Cyber Security Fundamentals' | 'Web Security' | 'SOC' | 'SIEM' | 'CTF' | 'Projects' | 'Interview' | 'Revision')
   - `status` (TEXT: 'pending' | 'completed' | 'overdue')
   - `recurring` (TEXT: 'none' | 'daily' | 'weekdays' | 'weekly' | 'custom')
   - `reminder_minutes` (INTEGER: 0, 10, 15, 30, 60, custom)
   - `created_at` (TEXT)
   - `completed_at` (TEXT)

2. **`jobs`**:
   - `id` (TEXT PRIMARY KEY)
   - `company` (TEXT NOT NULL)
   - `role` (TEXT NOT NULL)
   - `url` (TEXT)
   - `location` (TEXT)
   - `work_type` (TEXT: 'Remote' | 'Hybrid' | 'On-site')
   - `salary` (TEXT)
   - `date_applied` (TEXT)
   - `status` (TEXT: 'Wishlist' | 'Applied' | 'Assessment' | 'Interview' | 'Selected' | 'Rejected')
   - `interview_date` (TEXT)
   - `recruiter` (TEXT)
   - `notes` (TEXT)
   - `created_at` (TEXT)
   - `updated_at` (TEXT)

3. **`study_sessions`**:
   - `id` (TEXT PRIMARY KEY)
   - `topic` (TEXT NOT NULL)
   - `category` (TEXT NOT NULL)
   - `start_time` (TEXT)
   - `end_time` (TEXT)
   - `duration_minutes` (INTEGER NOT NULL)
   - `date` (TEXT NOT NULL)
   - `notes` (TEXT)
   - `created_at` (TEXT)

4. **`skills`**:
   - `id` (TEXT PRIMARY KEY)
   - `name` (TEXT NOT NULL UNIQUE)
   - `progress` (INTEGER DEFAULT 0) - 0 to 100%
   - `category` (TEXT)
   - `updated_at` (TEXT)

5. **`goals` & `settings`**:
   - Target Job Title, Target Date (default: December 2026)
   - Daily study target in hours (default: 6h)
   - Default reminder minutes (default: 30m)
   - Notifications enabled toggle
   - Dark theme mode

---

## 3. Directory & File Structure

```text
d:\Project\CareerPilot\
├── app/
│   ├── _layout.tsx                     # Global Root Layout (Theme, DB init, Providers)
│   ├── (tabs)/
│   │   ├── _layout.tsx                 # 5 Bottom Tabs: Home, Tasks, Calendar, Jobs, Progress
│   │   ├── index.tsx                   # 🏠 Home Dashboard (December 2026 Goal, Today's Tasks, Quick Timer)
│   │   ├── tasks.tsx                   # 📋 Task List & Management with Filters & Status
│   │   ├── calendar.tsx                # 📅 Calendar Schedule (Month, Week, Day views)
│   │   ├── jobs.tsx                    # 💼 Job Application Tracker (Pipeline / Kanban / List)
│   │   └── progress.tsx                # 📊 Overall Job-Readiness, Skills Matrix, Monthly Reports
│   ├── tasks/
│   │   ├── add.tsx                     # Add new task modal / screen
│   │   └── [id].tsx                    # Task details & edit screen
│   ├── jobs/
│   │   ├── add.tsx                     # Add new job application modal / screen
│   │   └── [id].tsx                    # Job details & edit screen
│   ├── study/
│   │   └── session.tsx                 # Focus Study Timer / Pomodoro & Logging screen
│   ├── reports/
│   │   └── [month].tsx                 # Detailed Monthly Report View (Sep, Oct, Nov, Dec 2026)
│   ├── settings.tsx                    # ⚙️ Settings (Goal, Reminders, Data Backup/Restore)
│   └── notifications.tsx               # Notification management & history
├── src/
│   ├── components/
│   │   ├── Header.tsx                  # Cyber top header with badges & quick actions
│   │   ├── TaskCard.tsx                # Interactive task item with complete checkbox & swipe
│   │   ├── JobCard.tsx                 # Job application card with status pills & interview tag
│   │   ├── ProgressBar.tsx             # Futuristic glowing progress bar & circular gauges
│   │   ├── StatCard.tsx                # Cyber metric card with glowing neon accents
│   │   ├── SkillSlider.tsx             # Interactive skill progress updater
│   │   ├── StudyTimer.tsx              # Interactive focus stopwatch / timer component
│   │   ├── DeleteModal.tsx             # Confirmation modal
│   │   └── EmptyState.tsx              # Cyber visual empty state
│   ├── database/
│   │   ├── db.ts                       # SQLite / cross-platform DB connection & migrations
│   │   ├── taskQueries.ts              # Task CRUD & query helpers
│   │   ├── jobQueries.ts               # Job CRUD & query helpers
│   │   ├── studyQueries.ts             # Study session tracking queries
│   │   ├── skillQueries.ts             # Skill matrix queries
│   │   └── settingsQueries.ts          # Settings & Goal queries
│   ├── notifications/
│   │   └── notificationService.ts      # Local notification scheduler & listener
│   ├── constants/
│   │   ├── theme.ts                    # Colors, typography, shadows, borders
│   │   ├── categories.ts               # 11 Cyber security categories & colors
│   │   └── sampleData.ts               # Default seed data for initial bootstrap
│   └── utils/
│       ├── dateUtils.ts                # Date formatting, relative dates, calendar calculations
│       └── progressCalculator.ts       # Overall job readiness & monthly report calculation algorithms
├── app.json                            # Expo configuration
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── CyberSecPlanner_Development_Plan.md # Original requirements plan
└── CyberSecPlanner_Documentation.md    # Comprehensive Architecture & User Guide
```

---

## 4. Key Implementation Steps

### Phase 1: Project Setup & Core Configuration
- Initialize Expo project with Expo Router, TypeScript, `@expo/vector-icons`, `react-native-svg`, and SQLite support.
- Establish the theme constants (`theme.ts`) with high-contrast Cyber aesthetics (deep dark obsidian `#070b14`, neon emerald `#00ff9d`, cyber cyan `#00f0ff`, warning amber `#ffb800`, crimson `#ff3366`).
- Create mock/seed data for immediate interactive usability (Cyber Security Roadmap, preloaded skills, sample tasks, sample job pipeline).

### Phase 2: Database Layer & State Management
- Setup `db.ts` with auto-migration scripts to create tables: `tasks`, `jobs`, `study_sessions`, `skills`, `settings`, `goals`.
- Implement robust query modules for all CRUD operations and analytics calculations.

### Phase 3: Core Navigation & Screens
1. **Home Screen (`index.tsx`)**:
   - Greeting + Real-time countdown to Dec 31, 2026.
   - Circular Readiness Gauge (calculated dynamically from Skills + Tasks + Study + Job applications).
   - Today's Task summary (Completed / Remaining).
   - Today's Study Time vs 6-hour target.
   - Quick Start Study Timer button.
   - Today's task list with instant check-to-complete.
2. **Tasks Screen (`tasks.tsx` & modals)**:
   - Filter tabs: *Today*, *Upcoming*, *Completed*, *Overdue*, *All*.
   - Filter dropdown by Category & Priority.
   - Add/Edit task modal with custom reminder pickers and recurrence options.
   - Swipe/button to complete, duplicate, or delete with confirmation.
3. **Calendar Screen (`calendar.tsx`)**:
   - Interactive Month, Week, and Day view.
   - Date dots for task deadlines and study sessions.
   - Selected date task list with quick action toggles.
4. **Jobs Tracker (`jobs.tsx` & modals)**:
   - Pipeline stages counter (Wishlist, Applied, Assessment, Interview, Selected, Rejected).
   - Stage filter tabs and search bar.
   - Detailed job cards showing Company, Role, Location, Salary, Interview Date & Time, Recruiter, and Notes.
   - Add/Edit Job modal with status switcher.
5. **Progress & Skills Screen (`progress.tsx`)**:
   - Overall Job Readiness Breakdown (Skill readiness, Task consistency, Study hours, Application volume).
   - Skill Matrix: 9 core Cyber skills with interactive level sliders (0–100%).
   - Active Study Timer & Session Logger.
   - Monthly Reports Navigator (Sep 2026 – Dec 2026) with detailed calculations.
6. **Monthly Reports View (`reports/[month].tsx`)**:
   - Task completion rate, actual study hours vs target, job pipeline metrics for the selected month.
7. **Settings Screen (`settings.tsx`)**:
   - Target Goal Date & Target Role configuration.
   - Study target adjustment (hours/day).
   - Default reminder time.
   - JSON Backup export & import / Data reset.

### Phase 4: Local Notifications & Reminders
- Configure `expo-notifications` for scheduling reminders (10m, 15m, 30m, 1h, custom) before task start time.
- Automatic rescheduling on task edit and cancellation on task deletion.

### Phase 5: Verification & Documentation
- Build and verify the application in local environment / browser preview.
- Verify all CRUD flows (Tasks, Jobs, Study sessions, Skills, Settings).
- Generate a comprehensive `CyberSecPlanner_Documentation.md` covering architecture, user guide, feature checklist, and build instructions for generating production Android APKs.

---

## 5. Verification Plan

### Automated & Build Checks
- Verify TypeScript compilation (`npx tsc --noEmit`).
- Verify Expo start and web preview bundle (`npx expo export` or `npm run dev`).

### Manual Verification Flows
1. **Task Flow**: Add a task (e.g. "Nmap Network Scan Practice", Priority: High, Category: Networking, Time: 2:00 PM, Reminder: 30 min). Mark as complete and verify progress updates.
2. **Job Flow**: Add a job (e.g. "SOC Analyst @ Deloitte", Salary: ₹6.5 LPA, Status: Interview). Advance status and verify pipeline counters.
3. **Study Session**: Start focus timer, log 60 minutes of "SIEM / Splunk" practice, verify study hours on dashboard and monthly report.
4. **Skills Matrix**: Update "Linux" to 90% and "Web Security" to 75%, verify overall job readiness score increases.
5. **Monthly Reports**: Check September 2026, October 2026, and December 2026 reports for accurate aggregation.
