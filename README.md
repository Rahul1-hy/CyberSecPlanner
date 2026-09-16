# 🔐 CyberSec Planner — Cyber Security Career Accelerator & Routine Engine

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Web-00ff9d?style=for-the-badge&logo=android)
![Expo](https://img.shields.io/badge/Expo-SDK%2057-00e5ff?style=for-the-badge&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.86-3b82f6?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)
![Database](https://img.shields.io/badge/Database-SQLite%20(Offline%20First)-a855f7?style=for-the-badge&logo=sqlite)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker)

<br/>

> **Target Goal**: Transform from Beginner to **Job-Ready SOC Analyst / Security Engineer** by **December 2026**.  
> **Aesthetic**: Sleek Dark Matrix Cyberpunk UI (`#00ff9d` Emerald, `#00e5ff` Cyan, `#070b14` Obsidian).  
> **Offline-First**: Zero-latency local SQLite database with local notification reminders.

</div>

---

## 🌟 Key Features

### 1. 🏠 Home Command Center & Job Readiness Index
* **December 2026 Countdown**: Real-time counter ticking down to your career target deadline.
* **Algorithmic Job-Readiness Gauge (0–100%)**: Dynamically evaluates your skills competency, task consistency, logged lab hours, and job application pipeline.
* **Daily Focus Study Lab**: Built-in cyber stopwatch and Pomodoro session logger.
* **Fast-Action Hub**: 1-tap navigation to the Master Routine and 10-Phase Roadmap.

### 2. ⏰ Roadmap-Driven Daily Routine (6:45 AM – 11:00 PM)
* **19-Slot Time Blocking**: Structured daily timetable balancing technical mastery, job applications, and health management:
  * 🌅 **6:45 AM**: Wake up, water, glucose routine
  * 💉 **7:00 AM / 1:00 PM / 8:00 PM**: Regular Insulin checkpoints
  * 🍽️ **7:30 AM / 1:15 PM / 8:15 PM**: Balanced nutrition (Daliya, eggs, paneer/soy)
  * 💻 **8:30–10:30 AM**: **Theory Deep Work (2h)** (Dynamically populates active Roadmap Phase concepts)
  * 🧪 **11:00–12:15 PM**: **Hands-on Labs (1.25h)** (Exact terminal commands & TryHackMe/PortSwigger labs)
  * 💻 **3:00–4:30 PM**: **Practical / SOC Labs (1.5h)** (Log analysis, Wireshark packet capture, SIEM queries)
  * 💼 **4:30–5:30 PM**: **Job Preparation (1h)** (Resume optimization, LinkedIn networking, 2–5 applications)
  * 🏃 **6:00–6:45 PM**: **Fitness & Exercise** for stamina and glucose balance
  * 📚 **9:00–10:00 PM**: **Phase-Specific Revision & Mock Q&A (1h)**
  * 🥛 **10:30 PM**: Plain milk + prescribed Lantus insulin
  * 😴 **11:00 PM**: Restful sleep
* **1-Tap Schedule Generator**: Automatically generates all 19 daily time-blocked tasks in your task manager with scheduled local notification reminders.

### 3. 🗺️ 10-Phase Cyber Security Roadmap (September – December 2026)
* **Phase 1**: Computer & Internet Basics (1 Week) + **First 7 Days Micro-Lessons Guide**
* **Phase 2**: Networking Fundamentals (2–3 Weeks · TCP/UDP, Ports, Subnets, Firewalls, Wireshark)
* **Phase 3**: Linux Basics & VM Security Hardening Lab (2 Weeks · Permissions, SSH, `/var/log/auth.log`)
* **Phase 4**: Cyber Security Fundamentals (1–2 Weeks · CIA Triad, AAA, Zero Trust, Threat Modeling)
* **Phase 5**: Web Application Security & OWASP Top 10 (3 Weeks · SQLi, XSS, IDOR, PortSwigger)
* **Phase 6**: Python for Cyber Security & Automation (2 Weeks · Sockets, Requests, Regex, Port Scanner)
* **Phase 7**: SOC Analyst & SIEM / Splunk (3–4 Weeks · Event IDs 4624/4625, SPL Queries, Triage)
* **Phase 8**: NIST PICERL Incident Response Playbooks (1–2 Weeks · Phishing, Malware isolation)
* **Phase 9**: Hands-on Legal Labs & CTF (TryHackMe SOC Level 1, HTB Academy)
* **Phase 10**: 3 Capstone Projects & Job Launch (3–4 Weeks · Resume, GitHub, Applications)

### 4. 📋 Cyber Task Manager
* **11 Cyber Categories**: Linux, Networking, Python, Security Fundamentals, Web Security, SOC, SIEM, CTF, Projects, Interview, Revision.
* **Timeline Filters**: *Today*, *Upcoming*, *Completed*, *Overdue*, *All*.
* **Local Notifications**: Configurable alerts (0m, 5m, 10m, 15m, 30m, 1h before task start).
* **Repeat Rules**: Daily, Weekdays, Weekly, None.

### 5. 💼 6-Stage Job Application Pipeline
* Visual Kanban-style funnel: `Wishlist` ➔ `Applied` ➔ `Assessment` ➔ `Interview` ➔ `Selected 🎉` (plus `Rejected`).
* Tracks salary package (₹ LPA), location, remote/hybrid status, interview schedules, recruiter contacts, and direct job links.

### 6. 📊 9-Skill Competency Matrix & Monthly Reports
* Interactive skill sliders across all 9 domains with dynamic proficiency tags (*Foundation 🔰*, *Intermediate 📈*, *Advanced ⚡*, *Job-Ready 🏆*).
* Detailed historical analytics for **September**, **October**, **November**, and **December 2026**.

---

## 🏗️ Architecture & Tech Stack

```
d:/Project/CareerPilot/
├── app/                        # Expo Router Navigation Screens
│   ├── (tabs)/                 # Bottom Tab Navigator (Home, Tasks, Calendar, Jobs, Progress)
│   │   ├── index.tsx           # Home Dashboard & Readiness Index
│   │   ├── tasks.tsx           # Task List & Filters
│   │   ├── calendar.tsx        # Month Calendar Heatmap
│   │   ├── jobs.tsx            # Job Pipeline Funnel
│   │   └── progress.tsx        # Skills Matrix & Monthly Reports
│   ├── routine.tsx             # Full-Day Roadmap-Driven Routine Engine
│   ├── roadmap.tsx             # 10-Phase Interactive Roadmap & 7-Day Guide
│   ├── tasks/                  # Task Add & Edit Screens
│   ├── jobs/                   # Job Add & Edit Screens
│   ├── reports/[month].tsx     # Monthly Analytics Detail View
│   ├── settings.tsx            # Goal & App Configuration
│   └── notifications.tsx       # Notification Engine Hub
├── src/
│   ├── components/             # Cyber-Themed UI Components
│   ├── constants/              # Theme, 19-Slot Routine & 10-Phase Roadmap Data
│   ├── database/               # Offline SQLite Engine & Type-Safe Queries
│   ├── notifications/          # Local Push Notification Service
│   └── utils/                  # Date helpers, Readiness Calculator
├── Dockerfile                  # Multi-stage production Nginx container
├── docker-compose.yml          # 1-command container orchestration
└── package.json
```

---

## 🚀 Quick Start (Development)

### Prerequisites
* [Node.js (v18 or v20 LTS)](https://nodejs.org/)
* [Expo Go](https://expo.dev/go) app installed on your Android device

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Start Expo Metro Bundler
```bash
npx expo start -c
```

* **Android**: Open the **Expo Go** app on your Android phone and scan the QR code displayed in the terminal.
* **Web**: Press `w` in the terminal to launch the web preview in your browser (`http://localhost:8081`).

---

## 🐳 Docker Deployment

You can containerize and serve the web application instantly using Docker:

### Option A: Using Docker Compose (Recommended)
```bash
docker compose up -d --build
```
Then open `http://localhost:8080` in your browser.

### Option B: Using Docker CLI
```bash
# 1. Build Docker image
docker build -t cybersec-planner .

# 2. Run container on port 8080
docker run -d -p 8080:80 --name cybersec_planner_app cybersec-planner
```

---

## 📱 Standalone Android APK Build

To generate an installable standalone Android `.apk` file for your device:

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Log in to your Expo account
eas login

# 3. Configure and build Preview APK
eas build -p android --profile preview
```

---

## ⚡ The Daily Golden Formula

$$\mathbf{2\text{ hr Theory Learn}} + \mathbf{2\text{ hr Practical Labs}} + \mathbf{1\text{ hr Job Prep}}$$

---

## 📄 License
This project is open-source and available under the **MIT License**.
