# 🔐 CyberSec Planner — Complete Architecture & Technical Documentation

> **Target Goal**: Achieve Complete Cyber Security Job Readiness by **December 2026**  
> **Platform**: Android Native (APK) & Web Preview (Cross-Platform React Native + Expo)  
> **Database**: Local SQLite (Offline-First) with Web Storage Fallback  
> **Notifications**: Local Push Notifications & Reminders (No Backend Required)

---

## 1. Executive Summary

**CyberSec Planner** is an all-in-one productivity and career acceleration mobile application designed specifically for aspiring Cyber Security professionals, SOC Analysts, Penetration Testers, and Security Engineers preparing to secure a job by **December 2026**.

The application combines:
1. **Intelligent Task & Schedule Planner**: Time-blocked daily tasks with multi-tier priorities and 11 cybersecurity categories.
2. **Local Notification & Reminder Engine**: Timely alerts before task start times with snooze and rescheduling.
3. **Interactive Calendar**: Day, Week, and Month views with density indicators and direct task action controls.
4. **End-to-End Job Application Tracker**: 6-stage pipeline (Wishlist ➔ Applied ➔ Assessment ➔ Interview ➔ Selected / Rejected) with compensation, interview dates, recruiters, and notes.
5. **Study Focus Session Timer**: Cyber-themed focus stopwatch / Pomodoro timer for logging hands-on lab time (CTF, SIEM, Linux, Nmap, etc.).
6. **Skills Matrix & Readiness Score**: Interactive competency rating across 9 core cybersecurity domains with an algorithmic Job-Readiness Index (0–100%).
7. **Monthly Analytics & Reports**: Detailed historical tracking for September 2026, October 2026, November 2026, and December 2026.
8. **December 2026 Countdown & Milestone Tracker**: Live countdown and preparation checklist.

---

## 2. Technical Stack & Architecture

### Core Technologies
| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | React Native + Expo (SDK 52/53) | High performance native Android & Web execution |
| **Routing** | Expo Router (v3/v4) | File-based navigation with tabs, stacks, and nested modals |
| **Language** | TypeScript | Strong typing for tasks, jobs, metrics, and state |
| **Persistence** | SQLite (`expo-sqlite`) / Web Storage | Offline-first zero-latency local database |
| **Notifications** | `expo-notifications` | Local scheduled reminders |
| **Icons & Visuals** | `@expo/vector-icons` / SVG | Crisp, modern cyber-themed UI icons and indicators |
| **Theme** | Custom Cyber Matrix Theme | High-contrast neon green, cyber cyan, dark obsidian, and glassmorphism |

---

## 3. Database Schema

The app uses an offline SQLite relational schema:

### 1. `tasks` Table
```sql
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,          -- Format: YYYY-MM-DD
    start_time TEXT,             -- Format: HH:mm (24h)
    end_time TEXT,               -- Format: HH:mm (24h)
    priority TEXT NOT NULL,      -- 'high' | 'medium' | 'low'
    category TEXT NOT NULL,      -- 'Linux' | 'Networking' | 'Python' | 'Cyber Security Fundamentals' | 'Web Security' | 'SOC' | 'SIEM' | 'CTF' | 'Projects' | 'Interview' | 'Revision'
    status TEXT NOT NULL,        -- 'pending' | 'completed' | 'overdue'
    recurring TEXT DEFAULT 'none', -- 'none' | 'daily' | 'weekdays' | 'weekly' | 'custom'
    reminder_minutes INTEGER DEFAULT 30,
    created_at TEXT NOT NULL,
    completed_at TEXT
);
```

### 2. `jobs` Table
```sql
CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    url TEXT,
    location TEXT,
    work_type TEXT DEFAULT 'Remote', -- 'Remote' | 'Hybrid' | 'On-site'
    salary TEXT,
    date_applied TEXT,
    status TEXT NOT NULL,            -- 'Wishlist' | 'Applied' | 'Assessment' | 'Interview' | 'Selected' | 'Rejected'
    interview_date TEXT,
    recruiter TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT
);
```

### 3. `study_sessions` Table
```sql
CREATE TABLE IF NOT EXISTS study_sessions (
    id TEXT PRIMARY KEY,
    topic TEXT NOT NULL,
    category TEXT NOT NULL,
    start_time TEXT,
    end_time TEXT,
    duration_minutes INTEGER NOT NULL,
    date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL
);
```

### 4. `skills` Table
```sql
CREATE TABLE IF NOT EXISTS skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT,
    progress INTEGER DEFAULT 0,      -- 0 to 100 percentage
    updated_at TEXT
);
```

### 5. `settings` Table
```sql
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    target_role TEXT DEFAULT 'Cyber Security Analyst / SOC Analyst',
    target_date TEXT DEFAULT '2026-12-31',
    daily_study_target_hours INTEGER DEFAULT 6,
    default_reminder_minutes INTEGER DEFAULT 30,
    notifications_enabled INTEGER DEFAULT 1,
    dark_mode INTEGER DEFAULT 1,
    monthly_report_enabled INTEGER DEFAULT 1
);
```

---

## 4. Cyber Security Design System

- **Background**: `#070b14` (Deep Space Obsidian)
- **Card Surfaces**: `#0f172a` with `#1e293b` borders and glassmorphism highlight `#1e293b80`
- **Primary Accent**: `#00ff9d` (Matrix Terminal Emerald)
- **Secondary Accent**: `#00e5ff` (Cyber Hologram Cyan)
- **Warning / Alert**: `#ffb800` (Electric Amber)
- **Danger / Urgent**: `#ff3b5c` (Neon Crimson)
- **Text Primary**: `#f8fafc`
- **Text Muted**: `#94a3b8`

---

## 5. Screen Breakdown & User Workflows

### 1. 🏠 Home / Dashboard
- **December 2026 Countdown**: Days remaining until December 31, 2026.
- **Job-Readiness Gauge**: Real-time algorithmic progress computed from skills mastered, completed tasks, and job applications.
- **Today's Task Card**: Progress ring showing completed vs pending tasks.
- **Study Goal Tracker**: Progress bar of today's study minutes against the daily 6-hour target.
- **Quick Study Timer**: 1-tap launcher to start a focus session.
- **Today's Actionable Tasks**: Check off items directly from the home screen.

### 2. 📋 Tasks Manager
- Filter by timeline: *Today*, *Upcoming*, *Completed*, *Overdue*, *All*.
- Filter by Category (Linux, SOC, SIEM, CTF, etc.) and Priority (High, Medium, Low).
- Quick Actions: Toggle Complete, Duplicate, Edit, Delete.
- Add Task Sheet with reminder triggers and recurring schedules.

### 3. 📅 Calendar Schedule
- Switchable Month, Week, and Day views.
- Visual date badges showing task density and completed status.
- Selected date schedule with time breakdown.

### 4. 💼 Job Tracker
- Visual pipeline metrics: Wishlist (5), Applied (18), Assessment (3), Interview (4), Selected (0), Rejected (7).
- Card view showing salary (₹ LPA), location, work type, and interview schedules.
- 1-click status transitions (e.g. Move from Applied to Interview).
- Direct external link button to open job postings.

### 5. 📊 Progress & Skills
- **Skill Competency Matrix**: 9 skills (Linux, Networking, Python, Security Fundamentals, Web Security, SOC, SIEM, Projects, Interview Prep) with interactive progress adjustment.
- **Focus Timer**: Live stopwatch with Start/Pause/Reset and session logging into database.
- **Monthly Reports**: Access detailed reports for September 2026 through December 2026.

### 6. ⚙️ Settings
- Target Role & Target Date configuration.
- Daily Study Target customization (e.g. 4h, 6h, 8h).
- Notification preferences and default reminder durations.
- JSON Backup export / Data reset.

---

## 6. How to Run & Build

### Development Mode
```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on Web browser
npx expo start --web

# Run on Android Emulator / Physical Device via Expo Go
npx expo start --android
```

### Production Android APK Build
```bash
# EAS Build (Cloud)
npx eas build -p android --profile preview

# Local Android Build
npx eas build -p android --profile preview --local
```

---

## 7. 🔐 Full-Day Cyber Security Job Routine (6:45 AM – 11:00 PM)

The application incorporates a **Roadmap-Driven Daily Routine Engine** that directly aligns your day with your active Roadmap Phase (Phase 1–10) and First 7 Days micro-lessons, while maintaining your essential health and diabetes care schedule:

### Dynamic Roadmap-Driven Schedule Architecture
* **8:30–10:30 AM (Theory Deep Work · 2h)**: Populates the exact theoretical concepts, architecture diagrams, and milestone goals from your selected Roadmap Phase.
* **11:00–12:15 PM (Hands-on Labs · 1.25h)**: Populates the specific terminal commands (`ping`, `nslookup`, `ipconfig`, `netstat`, `Wireshark`, `Burp Suite`, `Python Sockets`, `Splunk SPL`), and lab exercises.
* **3:00–4:30 PM (Practical / SOC Labs · 1.5h)**: Focuses on applied security (log triage, packet dissection, script development, malware playbook execution).
* **4:30–5:30 PM (Job Preparation · 1h)**: Daily resume optimization, portfolio commits, LinkedIn networking, and 2–5 targeted job applications.
* **9:00–10:00 PM (Revision & Mock Q&A · 1h)**: Directly tests you on that Phase's self-check assessment questions.

| Time Slot | Activity Block | Focus & Action Plan |
| :--- | :--- | :--- |
| **6:45 AM** | 🌅 Wake up | Water, normal glucose/diabetes routine, 5–10 min desk organize |
| **7:00 AM** | 💉 Regular Insulin | Take prescribed regular insulin dose on schedule |
| **7:30 AM** | 🍽️ Breakfast | Daliya / Eggs / Paneer / Soy / Curd + Green tea (no sugar) |
| **8:00–8:20 AM** | 🧠 Morning Walk | Light morning walk & stretching for energy and focus |
| **8:30–10:30 AM** | 💻 **Theory Deep Work (2h)** | **Roadmap Phase Theory**: <br>• *Phase 1 / Day 1–7*: Hardware, OS, Internet, IP, DNS, Ports, HTTP <br>• *Phase 2*: TCP 3-Way Handshake, Ports, OSI/TCP-IP, Firewalls <br>• *Phase 3*: Linux Permissions, Daemons, Users, SSH Hardening <br>• *Phase 4*: CIA Triad, AAA, Zero Trust, Threat Modeling <br>• *Phase 5*: OWASP Top 10 (SQLi, XSS, IDOR, SSRF) <br>• *Phase 6*: Python Requests, Sockets, Regex, Automation <br>• *Phase 7*: SOC Triage, Event IDs 4624/4625, Splunk SPL <br>• *Phase 8*: NIST PICERL Incident Response Playbooks <br>• *Phase 9*: TryHackMe SOC Level 1 / PortSwigger Rooms <br>• *Phase 10*: 3 Capstone Projects Architecture & System Design |
| **10:30–11:00 AM** | ☕ Rest Break | Screen break, hydration, light healthy snack |
| **11:00–12:15 PM** | 🧪 **Hands-on Labs (1.25h)** | Roadmap-specific terminal commands & virtual machine exercises |
| **12:15–12:45 PM** | 🥗 Lunch Prep | Healthy balanced meal preparation |
| **1:00 PM** | 💉 Regular Insulin | Lunchtime prescribed insulin dose |
| **1:15–1:45 PM** | 🍽️ Lunch | Balanced protein + complex carbs |
| **1:45–2:45 PM** | 😴 Afternoon Rest | Power nap or relaxed rest without screen time |
| **3:00–4:30 PM** | 💻 **Practical / SOC Labs (1.5h)** | Deep practical work: auth.log parsing, Wireshark packet capture, SIEM dashboards |
| **4:30–5:30 PM** | 💼 **Job Preparation (1h)** | Resume polish, LinkedIn networking, GitHub commits, 2–5 job applications |
| **5:30–6:00 PM** | 🍵 Evening Break | Green tea + roasted chana / nuts |
| **6:00–6:45 PM** | 🏃 Exercise | Cardio / workout for diabetes management & stamina |
| **7:00 PM** | 🚿 Fresh & Relax | Cool down & refresh |
| **8:00 PM** | 💉 Regular Insulin | Dinnertime prescribed insulin dose |
| **8:15–8:45 PM** | 🍽️ Dinner | Light and nutritious dinner |
| **9:00–10:00 PM** | 📚 **Revision & Interview Prep (1h)** | Phase-specific self-check questions, flashcards, oral concept review |
| **10:00–10:30 PM** | 📖 Light Reading / Relaxation | Screen-free wind-down |
| **10:30 PM** | 🥛 Milk & 🌙 Lantus Insulin | 200ml plain milk + prescribed Lantus insulin at fixed time |
| **11:00 PM** | 😴 Sleep | Restful sleep for next day consistency |

### Daily Golden Formula
$$\text{Daily Study Formula} = \mathbf{2\text{ Hours Learn}} + \mathbf{2\text{ Hours Practice}} + \mathbf{1\text{ Hour Job Prep}}$$

---

## 8. 🗺️ 10-Phase Cyber Security Roadmap (Beginner to Job Ready)

### Overview by Month (Target: December 2026)
```
SEPTEMBER 2026
Computer Basics + Networking Fundamentals + Linux VM Lab
          ↓
OCTOBER 2026
Cyber Security Fundamentals + Web Security (OWASP) + Python Tooling
          ↓
NOVEMBER 2026
SOC Analyst + SIEM (Splunk/Elastic) + Incident Response + 3 Capstones
          ↓
DECEMBER 2026
Resume & Portfolio Polish + GitHub + Mock Interviews + Job Applications 🎉
```

### Detailed 10 Phases

#### Phase 1: Computer & Internet Basics (1 Week)
- **Topics**: Operating Systems, Windows vs Linux Kernel, Processes & Services, CPU/RAM/Storage, Client-Server architecture, Browser HTTP request/response flow, DNS resolution, IP addresses.
- **Goal**: Confidently explain to a beginner: *"What happens under the hood when you type google.com in a browser and press Enter?"*

#### Phase 2: Networking Fundamentals (2–3 Weeks)
- **Topics**: LAN/WAN, Routers, Switches, Modems, MAC, IPv4, IPv6, Public vs Private IPs, Subnets.
- **Protocols**: TCP, UDP, HTTP, HTTPS, DNS, DHCP, FTP, SSH, SMTP.
- **Key Concepts**: Port, Socket, Stateful Firewall, NAT, Proxy, VPN.
- **Commands**: `ipconfig`, `ping`, `tracert`, `nslookup`, `netstat` (Windows) & `ip addr`, `traceroute`, `ss`, `curl` (Linux).
- **Core Mapping**: $\text{IP} \longrightarrow \text{Port} \longrightarrow \text{Protocol} \longrightarrow \text{Service}$ (e.g., $192.168.1.10 : 443 \rightarrow \text{HTTPS} \rightarrow \text{Web Server}$).

#### Phase 3: Linux Basics & VM Security Lab (2 Weeks)
- **Commands**: `pwd`, `ls`, `cd`, `mkdir`, `touch`, `cp`, `mv`, `rm`, `cat`, `less`, `grep`, `find`, `head`, `tail`, `chmod`, `chown`, `sudo`, `ps`, `top`, `kill`, `systemctl`.
- **System**: Linux filesystem hierarchy, Users, Groups, Permissions (rwx/octal/SUID), Processes, Systemd Services, SSH keys, `/var/log/auth.log`.
- **Mini Project**: Setup Linux VM, configure least-privilege users, harden SSH daemon, and audit auth logs.

#### Phase 4: Cyber Security Fundamentals (1–2 Weeks)
- **CIA Triad**: Confidentiality, Integrity, Availability.
- **Access Control**: Authentication (AuthN), Authorization (AuthZ), Accounting (Audit).
- **Principles**: Principle of Least Privilege, Defense-in-Depth, Zero Trust Architecture.
- **Risk Terminology**: Threat Actor $\times$ Vulnerability $\times$ Exploit $\rightarrow$ Impact & Risk.
- **Common Attacks**: Phishing, Brute Force, Malware, Ransomware, DDoS, MitM, SQL Injection, XSS, Credential Stuffing.

#### Phase 5: Web Application Security & OWASP Top 10 (3 Weeks)
- **HTTP Deep Dive**: Request/Response headers, Cookies (`HttpOnly`, `Secure`, `SameSite`), Sessions, JWT tokens, REST APIs, CORS, Same-Origin Policy.
- **OWASP Top 10**: Broken Access Control, SQL Injection, Authentication Failures, Security Misconfiguration, XSS, SSRF, Cryptographic Failures.
- **Labs**: PortSwigger Web Security Academy practitioner labs.

#### Phase 6: Python for Cyber Security (2 Weeks)
- **Modules**: `requests`, `socket`, `json`, `os`, `subprocess`, `re`, `hashlib`.
- **Security Tools**:
  1. *Port Scanner*: Multi-threaded TCP connect scanner for authorized labs.
  2. *Log Analyzer*: Parse `/var/log/auth.log` for failed logins, repeated usernames, and suspicious IPs.
  3. *Password Hasher*: MD5, SHA-256, bcrypt/Argon2 salting & validation demo.

#### Phase 7: SOC Analyst & SIEM Fundamentals (3–4 Weeks)
- **SOC Structure**: Tier 1 Triage, Tier 2 Incident Response, Tier 3 Threat Hunting.
- **Terminology**: Alert, Event, Incident, IOCs, TTPs, False Positive, True Positive, Severity, Escalation.
- **Log Sources**: Windows Event Logs (`Security.evtx` 4624/4625), Linux syslog/auth.log, Firewall logs, Web access logs.
- **SIEM Tools**: Splunk (SPL queries), Microsoft Sentinel, Elastic / Kibana dashboards.

#### Phase 8: Incident Response (1–2 Weeks)
- **PICERL Lifecycle**: Preparation $\rightarrow$ Detection $\rightarrow$ Analysis $\rightarrow$ Containment $\rightarrow$ Eradication $\rightarrow$ Recovery $\rightarrow$ Lessons Learned.
- **Playbooks**: Suspicious Login, Phishing Email analysis, Malware outbreak, Brute-force response, Compromised domain accounts.

#### Phase 9: Hands-on Legal Labs
- **Platforms**: TryHackMe (Pre-Security, Complete Beginner, SOC Level 1), PortSwigger Web Security Academy, Hack The Box Academy.

#### Phase 10: 3 Major Capstone Portfolio Projects & Job Launch
1. 🔥 **Project 1 — SOC Log Analyzer**: Python + Regex + Interactive CLI/Report Generator (detects brute force & flags malicious IPs).
2. 🔥 **Project 2 — Vulnerability & Service Scanner**: Multi-threaded Python network scanner with banner grabbing and misconfiguration detection.
3. 🔥 **Project 3 — Security Monitoring Dashboard**: Python/FastAPI + React/Next.js real-time event telemetry viewer with alert triage.
- **Resume & Job Search**: SOC-optimized resume, GitHub project walkthroughs, 2–5 applications daily, mock technical interviews.

---

## 9. 📅 First 7 Days Micro-Lesson Accelerator

- **Day 1**: Computer Basics (OS, CPU, RAM, Storage, Process) + Windows Task Manager & `services.msc`.
- **Day 2**: Internet Basics (Client, Server, Browser, Domain, IP) + `ping` & `nslookup`.
- **Day 3**: IP Addressing (IPv4, Public vs Private, Subnets) + `ipconfig /all`.
- **Day 4**: DNS Deep-Dive (Root servers, TLD, Resolvers, A/MX/CNAME records) + `nslookup -type=MX google.com`.
- **Day 5**: Ports & Protocols (22 SSH, 53 DNS, 80 HTTP, 443 HTTPS) + `netstat -ano`.
- **Day 6**: HTTP/HTTPS (GET/POST, Headers, Status codes, Cookies) + DevTools Network tab.
- **Day 7**: Phase 1 Self-Assessment Quiz (10-question evaluation; score $\ge$ 8/10 to graduate to Phase 2).

