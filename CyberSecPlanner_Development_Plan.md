# 🔐 CyberSec Planner — Complete Development Plan

## 1. Project Goal

Build an Android-first **Cyber Security Job Planner** to help prepare for a Cyber Security job by **December 2026**.

The app combines:

- Daily tasks
- Full-day planning
- Reminders and local notifications
- Cyber Security learning roadmap
- Job application tracking
- Study progress
- Overall progress
- Monthly reports
- December 2026 goal tracking
- Settings

### Initial Version

- Android-first
- React Native + Expo
- TypeScript
- Expo Router
- SQLite
- Offline-first
- No backend required for MVP

---

# 2. Technology Stack

## Mobile App

- React Native
- Expo
- Expo Router
- TypeScript

## Local Storage

- SQLite

## Notifications

- Expo Notifications / Expo Local Notifications

## Future Backend

Backend is **not required** for MVP.

Possible future architecture:

```text
React Native
     ↓
Django REST API
     ↓
PostgreSQL
```

---

# 3. Main Navigation

The app will have 5 primary sections:

1. 🏠 Home
2. 📋 Tasks
3. 📅 Calendar
4. 💼 Jobs
5. 📊 Progress

Additional screens:

- 🔔 Notifications
- 📅 Monthly Reports
- ⚙️ Settings

---

# 4. Home / Dashboard

The Home screen should allow the user to understand what needs to be done today within a few seconds.

## Information

- Greeting
- Current date
- December 2026 job goal
- Overall job-readiness progress
- Today's task completion
- Study time
- Remaining tasks
- Upcoming reminders
- Today's tasks

Example:

```text
CyberSec Planner

Good Morning 👋

16 September 2026

🎯 December Job Goal

Cyber Security Job

███████░░░ 70%

Today's Progress

6 / 8 Tasks

Study Time

4h 20m

UPCOMING

2:00 PM
Nmap Practice 🔔

5:00 PM
Wireshark 🔔

TODAY'S TASKS

✅ Linux
✅ Networking
⬜ Nmap
⬜ Wireshark
⬜ CTF
```

---

# 5. Task Management

Task management is one of the core features.

## Task Sections

- Today
- Upcoming
- Completed
- Overdue

## Task Fields

```text
id
title
description
date
start_time
end_time
reminder
priority
category
status
recurring
created_at
completed_at
```

## Categories

- Linux
- Networking
- Python
- Cyber Security Fundamentals
- Web Security
- SOC
- SIEM
- CTF
- Projects
- Interview
- Revision

## Priority

- 🔴 High
- 🟡 Medium
- 🟢 Low

---

# 6. Add Task

Task creation form:

```text
Task Title

Description

Date

Start Time

End Time

🔔 Reminder

- None
- 10 min
- 15 min
- 30 min
- 1 hour
- Custom

Priority

Category

Repeat

- None
- Daily
- Weekdays
- Weekly
- Custom

[Create Task]
```

---

# 7. Task Update / Edit

Every task must support editing.

Example:

```text
Task Details

Nmap Practice

Date
16 September

Start
2:00 PM

End
3:00 PM

Priority
High

Category
Cyber Security

Reminder
30 minutes

[Update Task]
```

After update:

```text
SQLite
  ↓
Updated Task
  ↓
Notification Updated
```

If the task's date/time/reminder changes, the old notification must be cancelled and the new notification scheduled.

---

# 8. Task Delete

Every task must have a delete option.

Task menu:

```text
⋮

View
Edit
Complete
Duplicate
Delete
```

Before deletion:

```text
Delete Task?

Are you sure you want to delete
"Nmap Practice"?

[Cancel] [Delete]
```

Deleting a task must also cancel its scheduled notification.

---

# 9. Task Complete

A task can be marked complete.

Example:

```text
⬜ Nmap Practice
```

After completion:

```text
✅ Nmap Practice
```

Store:

```text
status = completed
completed_at = current timestamp
```

Completing a task should update:

- Today's progress
- Overall progress
- Monthly report
- Current streak where applicable

---

# 10. Reminder & Notification System

Reminders are a core feature.

Example:

```text
Task:
Nmap Practice

Start:
2:00 PM

Reminder:
30 minutes before

Notification:
🔐 CyberSec Planner

Nmap Practice starts in 30 minutes.
```

Possible actions:

- Complete
- Snooze
- Reschedule

## Reminder Options

- None
- 10 minutes
- 15 minutes
- 30 minutes
- 1 hour
- Custom

Notifications must work locally without a backend.

---

# 11. Recurring Tasks

Support recurring tasks.

## Daily

```text
9:00 AM

Linux Practice

Every Day
```

## Weekdays

```text
Monday-Friday

Security Study
```

## Weekly

```text
Saturday

CTF Practice
```

## Custom

Allow the user to select specific days.

Recurring task creation should generate/manage task occurrences without creating duplicate or broken reminders.

---

# 12. Calendar

Calendar views:

- Month
- Week
- Day

Example:

```text
September 2026

Mon Tue Wed Thu Fri Sat Sun
14  [15] 16  17  18  19  20

16 September

09:00 Linux
11:00 Networking
14:00 Nmap
17:00 Wireshark
20:00 CTF
```

Selecting a task should allow:

- View
- Edit
- Complete
- Delete

Calendar data comes from SQLite.

---

# 13. Job Tracker

The Job Tracker is the second major feature.

## Dashboard

```text
Job Tracker

Wishlist       5
Applied        18
Assessment      3
Interview       4
Rejected        7
Selected        0
```

## Job Pipeline

```text
Wishlist
   ↓
Applied
   ↓
Assessment
   ↓
Interview
   ↓
Selected 🎉
```

Rejected is a separate status.

---

# 14. Add Job

Fields:

```text
Company

Job Role

Job URL

Location

Work Type

Salary

Date Applied

Status

Interview Date

Recruiter

Notes

[Add Job]
```

## Work Type

- Remote
- Hybrid
- On-site

---

# 15. Job Details

Example:

```text
Deloitte

SOC Analyst

📍 Delhi

💰 ₹5–7 LPA

Applied:
15 September

Status:
Interview

Interview:
20 September, 11 AM

Job URL:
Open Job

Notes:
Prepare SIEM questions
```

Actions:

```text
Edit
Change Status
Delete
Open Job
```

---

# 16. Job Update / Edit

All job fields must be editable.

```text
Company
Role
URL
Location
Work Type
Salary
Date Applied
Status
Interview Date
Recruiter
Notes

[Update Job]
```

Changing status should update job statistics automatically.

---

# 17. Study Session Tracking

Track actual study time.

Example:

```text
Cyber Security Study

Topic:
Networking

Start:
10:00 AM

End:
12:00 PM

Duration:
2h

[Save Session]
```

Database:

```text
study_sessions

id
topic
category
start_time
end_time
duration
date
created_at
```

Study time contributes to:

- Home dashboard
- Overall progress
- Monthly reports
- Skill progress

---

# 18. Overall Progress

Progress will be **Overall**, not a separate weekly progress report.

## Overall Dashboard

```text
📊 Progress

Overall Job Readiness

███████░░░ 70%

Tasks
████████░░ 80%

Cyber Security Skills
███████░░░ 70%

Job Applications
██████░░░░ 60%

Interview Preparation
█████░░░░░ 50%
```

## Cyber Security Skills

```text
Linux                 90%
Networking            80%
Python                70%
Security Fundamentals 60%
Web Security          50%
SOC                   40%
SIEM                  30%
Projects              40%
Interview Preparation 30%
```

The user can update each skill.

Example:

```text
SIEM

Current Progress:
30%

[Update Progress]
```

---

# 19. Monthly Reports

Progress reports will be **Monthly**.

There is no separate weekly report screen.

## Monthly Report

```text
📅 September 2026

Study Time
28h 40m

Tasks
42 / 48

Completion
87%

Job Applications
8

Assessments
3

Interviews
2

Rejected
4

Selected
0
```

## Available Months

```text
September 2026
October 2026
November 2026
December 2026
```

The selected month should show statistics calculated only from that month.

---

# 20. Monthly Report Calculations

Each monthly report can calculate:

- Total tasks
- Completed tasks
- Missed tasks
- Completion percentage
- Total study hours
- Daily study average
- Job applications
- Assessments
- Interviews
- Rejections
- Selected jobs
- Skill progress changes

Example:

```text
September 2026

Tasks
142 / 160

Completion
88%

Study Target
180h

Actual Study
152h

Applications
18

Assessments
6

Interviews
4

Selected
0
```

---

# 21. December 2026 Goal

Main goal:

```text
🎯 Cyber Security Job

Target:
December 2026
```

## Goal Areas

- Linux
- Networking
- Security Fundamentals
- Python
- Web Security
- SOC
- SIEM
- Projects
- Interview Preparation
- Job Applications

Example:

```text
GOAL

Cyber Security Job

Target:
December 2026

Overall Progress

███████░░░ 70%
```

Goal progress should be calculated from relevant learning and job-tracking data where possible.

---

# 22. Settings

Settings will include:

```text
Profile

🎯 Job Goal
December 2026

⏰ Default Reminder
30 minutes

📚 Daily Study Target
6 hours

🔔 Notifications
ON

🌙 Dark Mode
ON

📊 Monthly Report
ON

💾 Backup
Later
```

Settings should be editable.

---

# 23. Database Design

Initial SQLite database:

```text
users
tasks
categories
reminders
jobs
study_sessions
skills
goals
settings
```

## Tasks Table

```text
tasks
------

id
title
description
date
start_time
end_time
priority
category_id
status
recurring
reminder_minutes
created_at
completed_at
```

## Jobs Table

```text
jobs
----

id
company
role
url
location
work_type
salary
date_applied
status
interview_date
recruiter
notes
created_at
updated_at
```

## Study Sessions

```text
study_sessions
--------------

id
topic
category
start_time
end_time
duration
date
created_at
```

## Skills

```text
skills
------

id
name
progress
created_at
updated_at
```

## Goals

```text
goals
-----

id
title
target_date
progress
status
created_at
updated_at
```

## Settings

```text
settings
--------

id
default_reminder
daily_study_target
notifications_enabled
dark_mode
monthly_report_enabled
```

---

# 24. Project Folder Structure

Target structure:

```text
CyberSecPlanner/

src/

├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   │
│   ├── tasks/
│   │   ├── index.tsx
│   │   ├── add.tsx
│   │   └── [id].tsx
│   │
│   ├── calendar/
│   │   └── index.tsx
│   │
│   ├── jobs/
│   │   ├── index.tsx
│   │   ├── add.tsx
│   │   └── [id].tsx
│   │
│   ├── progress/
│   │   └── index.tsx
│   │
│   ├── reports/
│   │   └── [month].tsx
│   │
│   ├── notifications.tsx
│   └── settings.tsx
│
├── components/
│   ├── TaskCard.tsx
│   ├── JobCard.tsx
│   ├── ProgressBar.tsx
│   ├── StatCard.tsx
│   ├── Header.tsx
│   ├── EmptyState.tsx
│   └── DeleteModal.tsx
│
├── database/
│   ├── database.ts
│   ├── migrations.ts
│   └── queries.ts
│
├── notifications/
│   └── notificationService.ts
│
├── constants/
│   ├── colors.ts
│   ├── categories.ts
│   └── goals.ts
│
└── utils/
    ├── date.ts
    ├── progress.ts
    └── validation.ts
```

---

# 25. Development Phases

## Phase 0 — Setup

Status: **Completed**

- Expo
- TypeScript
- Expo Router
- Android testing
- Project created successfully

---

# Phase 1 — UI Foundation

Goal: Build the complete navigation and basic UI.

Tasks:

- App theme
- Colors
- Typography
- Bottom navigation
- Header
- Home UI
- Tasks UI
- Calendar UI
- Jobs UI
- Progress UI
- Settings UI
- Reusable components

### Milestone

```text
App
 ↓
Home
 ↓
Bottom Navigation
 ├── Tasks
 ├── Calendar
 ├── Jobs
 ├── Progress
 └── Settings
```

---

# Phase 2 — Task CRUD

Goal: Make Tasks fully functional.

Implement:

- Add Task
- View Task
- Edit Task
- Delete Task
- Complete Task
- Duplicate Task
- Priority
- Category
- Date/time
- Task filters

### Milestone

```text
Create
  ↓
View
  ↓
Edit
  ↓
Update
  ↓
Complete
  ↓
Delete
```

---

# Phase 3 — SQLite

Goal: Make app data persistent.

Implement:

- SQLite setup
- Database initialization
- Migrations
- Task queries
- Job queries
- Study session queries
- Skill queries
- Goal queries
- Settings queries

### Milestone

```text
UI
 ↓
Database
 ↓
Persistent Data
```

Closing/reopening the app must not delete data.

---

# Phase 4 — Notifications

Implement:

- Notification permission
- Schedule reminder
- Cancel reminder
- Update reminder
- Recurring reminder
- Snooze
- Reschedule

### Important Rule

```text
Create Task
    ↓
Create Notification

Edit Task
    ↓
Cancel Old Notification
    ↓
Schedule New Notification

Delete Task
    ↓
Cancel Notification
```

---

# Phase 5 — Calendar

Implement:

- Month view
- Week view
- Day view
- Date selection
- Tasks by date
- Task actions

Calendar must use the same SQLite task data.

---

# Phase 6 — Job Tracker

Implement complete Job CRUD:

- Add job
- View job
- Edit job
- Delete job
- Change status
- Interview tracking
- Notes
- Search
- Filters
- Job URL

Status:

```text
Wishlist
Applied
Assessment
Interview
Selected
Rejected
```

---

# Phase 7 — Study Tracking

Implement:

- Add study session
- Edit study session
- Delete study session
- Duration calculation
- Category/topic
- Daily study total

---

# Phase 8 — Overall Progress

Implement:

- Overall job readiness
- Skill progress
- Task completion
- Study hours
- Job statistics
- Streak
- Projects
- Interview preparation

Progress should update automatically when underlying data changes.

---

# Phase 9 — Monthly Reports

Implement:

- September report
- October report
- November report
- December report
- Monthly task statistics
- Monthly study statistics
- Monthly job statistics
- Completion percentage
- Monthly comparison where useful

No weekly report screen is required.

---

# Phase 10 — December Goal

Implement:

- December 2026 target
- Goal progress
- Skill progress
- Job application progress
- Interview preparation progress
- Project progress

---

# Phase 11 — Settings

Implement:

- Default reminder
- Daily study target
- Notifications ON/OFF
- Dark mode
- Monthly report ON/OFF
- Goal settings

---

# Phase 12 — UI Polish

After functionality is stable:

- Animations
- Better cards
- Empty states
- Loading states
- Error states
- Form validation
- Delete confirmations
- Progress animations
- Dark theme
- Consistent spacing
- Icons
- Responsive layouts

---

# Phase 13 — Testing

Test every core workflow.

## Tasks

- Create
- Edit
- Delete
- Complete
- Reminder
- Recurring task

## Jobs

- Create
- Edit
- Delete
- Status change
- Interview date

## Database

- Persistence
- Migration
- Data integrity

## Reports

- Monthly calculations
- Overall progress calculations

## Notifications

- Schedule
- Cancel
- Update
- Recurring
- Permission handling

---

# Phase 14 — Production Android App

Final steps:

- App icon
- Splash screen
- Permissions
- Android configuration
- Notification testing
- SQLite testing
- Performance testing
- Build configuration
- Production APK
- Android installation

---

# 26. Development Rule

Do **not** implement everything at once.

Follow:

```text
UI
 ↓
Functionality
 ↓
Database
 ↓
Notifications
 ↓
Calendar
 ↓
Job Tracker
 ↓
Study Tracking
 ↓
Overall Progress
 ↓
Monthly Reports
 ↓
Goal
 ↓
Settings
 ↓
Testing
 ↓
Production APK
```

---

# 27. MVP Definition

The first usable MVP must allow the user to:

1. Create a daily task.
2. Set task date/time.
3. Set a reminder.
4. Receive a local notification.
5. Mark the task complete.
6. Edit a task.
7. Delete a task.
8. See today's progress.
9. Add a Cyber Security job application.
10. Edit a job.
11. Delete a job.
12. Change job status.
13. View job statistics.
14. Track overall progress.
15. View monthly reports.
16. Track progress toward the December 2026 goal.

---

# 28. Final MVP Flow

```text
                🏠 HOME
                   │
       ┌───────────┼───────────┐
       ↓           ↓           ↓
    📋 TASKS    📅 CALENDAR  💼 JOBS
       │                       │
       ↓                       ↓
  Add/Edit/Delete        Add/Edit/Delete
       │                       │
       ↓                       ↓
  🔔 Reminder             Job Status
       │                       │
       └───────────┬───────────┘
                   ↓
             📊 PROGRESS
                   │
          ┌────────┴────────┐
          ↓                 ↓
    Overall Progress   Monthly Reports
          │                 │
          └────────┬────────┘
                   ↓
          🎯 December 2026
```

---

# 29. First Development Task

The next implementation task should be **Phase 1 — UI Foundation**.

Start with:

```text
1. Check existing Expo project
2. Configure Expo Router
3. Create app/_layout.tsx
4. Create bottom navigation
5. Create Home screen
6. Create Tasks screen
7. Create Calendar screen
8. Create Jobs screen
9. Create Progress screen
10. Create Settings screen
11. Create reusable components
12. Run on Android
13. Fix navigation/UI errors
```

After Phase 1 is stable, move to:

```text
Phase 2 → Task CRUD
```

Do not start SQLite or notifications until the basic Task UI and navigation are working correctly.
