// Cyber Security Roadmap — Beginner to Job Ready (10 Phases & 7-Day Plan)

export interface RoadmapPhase {
  id: string;
  phaseNumber: number;
  title: string;
  duration: string;
  month: 'September' | 'October' | 'November' | 'December';
  icon: string;
  color: string;
  badge: string;
  summary: string;
  topics: string[];
  commands?: string[];
  goal: string;
  project?: {
    title: string;
    description: string;
    features: string[];
  };
}

export interface DayGuideItem {
  day: number;
  title: string;
  subtitle: string;
  theory: string[];
  commands: string[];
  practiceLab: string;
  keyTakeaway: string;
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    title: 'Computer & Internet Basics',
    duration: '1 Week',
    month: 'September',
    icon: 'desktop-outline',
    color: '#00e5ff',
    badge: 'FOUNDATION',
    summary: 'Master how computers, operating systems, processes, memory, and internet client-server models communicate.',
    topics: [
      'Computer Architecture: CPU, RAM, Storage, Processes, Services',
      'Operating Systems: Windows Architecture vs Linux Kernel',
      'Internet Architecture: Client vs Server, Web Browsers, HTTP/HTTPS',
      'Domain Name System (DNS), IP Addresses & Resolution Flow',
      'End-to-End flow: "What happens when you type google.com in a browser?"',
    ],
    commands: ['Task Manager', 'Windows Services (services.msc)', 'Command Prompt', 'ping google.com', 'nslookup google.com'],
    goal: 'Confidently explain end-to-end how a browser loads a website from DNS to web server.',
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    title: 'Networking Fundamentals',
    duration: '2–3 Weeks',
    month: 'September',
    icon: 'git-network-outline',
    color: '#3b82f6',
    badge: 'CORE PILLAR',
    summary: 'The most important foundation in Cyber Security: understand protocols, packets, ports, and traffic flow.',
    topics: [
      'Network Hardware: LAN/WAN, Routers, Layer 2/3 Switches, Modems, Access Points',
      'Addressing: MAC Address, IPv4, IPv6, Public vs Private IP Ranges, Subnetting basics',
      'Core Protocols: TCP vs UDP (Reliable vs Connectionless), HTTP/HTTPS, DNS, DHCP, FTP, SSH, SMTP',
      'Key Security Concepts: Ports, Sockets, Firewalls (Stateful vs Stateless), NAT, Proxy, VPN',
      'The Golden Mapping: IP → Port → Protocol → Service (e.g. 192.168.1.10 : 443 → HTTPS → Web Server)',
    ],
    commands: ['ipconfig / ip addr', 'ping', 'tracert / traceroute', 'nslookup', 'netstat / ss', 'curl -I'],
    goal: 'Master packet flow, understand how firewalls inspect traffic, and dissect packets in Wireshark.',
  },
  {
    id: 'phase-3',
    phaseNumber: 3,
    title: 'Linux Basics & Security VM Lab',
    duration: '2 Weeks',
    month: 'September',
    icon: 'terminal-outline',
    color: '#22c55e',
    badge: 'ESSENTIAL',
    summary: 'Linux is the backbone of security operations, penetration testing, servers, and cloud infrastructure.',
    topics: [
      'Navigation & File Ops: pwd, ls -la, cd, mkdir, touch, cp, mv, rm, cat, less, head, tail',
      'Searching & Parsing: grep, find, awk, sed, pipes (|), input/output redirections',
      'Permissions & Administration: chmod (rwx / octal / SUID / SGID), chown, sudo, sudoers file',
      'Processes & Services: ps aux, top / htop, kill, systemctl (start, stop, status, enable)',
      'Security Hardening: SSH Key authentication, inspecting /var/log/auth.log, disabling root SSH login',
    ],
    commands: ['chmod 755 / chmod u+s', 'chown user:group', 'grep -r "failed" /var/log/', 'systemctl status sshd', 'ss -tuln'],
    goal: 'Build a Linux VM lab, manage users, configure secure SSH keys, and inspect system authentication logs.',
    project: {
      title: 'Linux Security VM Hardening Lab',
      description: 'Setup an Ubuntu / Debian VM, create user groups with least privilege, configure SSH key pairs, and audit auth logs.',
      features: ['Create standard and admin users', 'Configure SUID permissions', 'Harden SSH configuration', 'Inspect /var/log/syslog'],
    },
  },
  {
    id: 'phase-4',
    phaseNumber: 4,
    title: 'Cyber Security Fundamentals & Threat Modeling',
    duration: '1–2 Weeks',
    month: 'October',
    icon: 'shield-checkmark-outline',
    color: '#a855f7',
    badge: 'SECURITY CORE',
    summary: 'Core cybersecurity principles, threat actors, attack surfaces, and defensive architectures.',
    topics: [
      'CIA Triad: Confidentiality (Encryption), Integrity (Hashing/Digital Signatures), Availability (Redundancy/DDoS mitigation)',
      'Access Control: Authentication (Who are you?), Authorization (What can you do?), Accounting (Audit logs)',
      'Defensive Architectures: Principle of Least Privilege, Defense-in-Depth, Zero Trust Architecture',
      'Risk Terminology: Threat (Actor) vs Vulnerability (Flaw) vs Exploit (Payload) vs Risk (Impact * Likelihood)',
      'Common Cyber Attacks: Phishing, Brute Force, Malware/Ransomware, DDoS, Man-in-the-Middle (MITM), SQL Injection, XSS, Credential Stuffing',
    ],
    goal: 'Identify threat vectors, explain defense-in-depth, and differentiate encryption vs hashing vs encoding.',
  },
  {
    id: 'phase-5',
    phaseNumber: 5,
    title: 'Web Application Security & OWASP Top 10',
    duration: '3 Weeks',
    month: 'October',
    icon: 'globe-outline',
    color: '#ec4899',
    badge: 'HIGH DEMAND',
    summary: 'Leverage web-development knowledge to understand, exploit, and remediate web vulnerabilities.',
    topics: [
      'HTTP Deep-Dive: Request/Response Headers, Cookies (HttpOnly, Secure, SameSite), Sessions, JWT Tokens',
      'Web Mechanisms: CORS (Cross-Origin Resource Sharing), Same-Origin Policy (SOP), REST APIs',
      'OWASP Top 10 #1: Broken Access Control (IDOR, privilege escalation)',
      'OWASP Top 10 #2: Injection (SQL Injection - In-band, Blind, Error-based)',
      'OWASP Top 10 #3: Authentication Failures & Weak Session Management',
      'OWASP Top 10 #4: Security Misconfigurations & Default Credentials',
      'OWASP Top 10 #5: Cross-Site Scripting (XSS - Stored, Reflected, DOM-based)',
      'OWASP Top 10 #6: Server-Side Request Forgery (SSRF) & Cryptographic Failures',
    ],
    commands: ['Burp Suite Proxy Interceptor', 'Repeater & Intruder', 'PortSwigger Academy Labs'],
    goal: 'Complete PortSwigger Web Security Academy practitioner labs and write remediation patches for SQLi and XSS.',
  },
  {
    id: 'phase-6',
    phaseNumber: 6,
    title: 'Python for Cyber Security & Automation',
    duration: '2 Weeks',
    month: 'October',
    icon: 'code-slash-outline',
    color: '#eab308',
    badge: 'AUTOMATION',
    summary: 'Build custom security tooling, port scanners, log analyzers, and hashing scripts in Python.',
    topics: [
      'Python Security Modules: requests (HTTP interactions), socket (raw networking), json, os, subprocess, re (Regex), hashlib',
      'Network Socket Programming: Connect, banner grabbing, sending payloads, timeout handling',
      'Regex for Security: Parsing IP addresses, CVE strings, failed login timestamps from log files',
      'Cryptographic Hashing: MD5, SHA-256, HMAC, bcrypt / Argon2 salting and password verification',
    ],
    goal: 'Build 3 functional security automation tools: Port Scanner, Log Analyzer, and Password Hasher.',
    project: {
      title: 'Python Security Tooling Suite',
      description: 'Build a multi-threaded Port Scanner and an automated auth.log Analyzer in Python.',
      features: ['Fast TCP SYN/Connect scanner', 'Extract failed logins and suspicious IPs from Linux auth.log', 'SHA-256 password hash generator'],
    },
  },
  {
    id: 'phase-7',
    phaseNumber: 7,
    title: 'SOC Analyst & SIEM / Splunk Operations',
    duration: '3–4 Weeks',
    month: 'November',
    icon: 'eye-outline',
    color: '#06b6d4',
    badge: 'JOB ESSENTIAL',
    summary: 'Security Operations Center workflows: log analysis, alert triage, SIEM correlation, and threat detection.',
    topics: [
      'SOC Fundamentals: Security Operations Center structure (Tier 1 Triage, Tier 2 Incident Response, Tier 3 Threat Hunting)',
      'Security Terminology: Alert vs Event vs Incident, IOCs (Indicators of Compromise), TTPs, False Positives vs True Positives, Severity levels, Escalation',
      'Log Sources: Windows Event Logs (Security.evtx, Event ID 4624/4625), Linux /var/log/auth.log, Firewall logs, Web access logs',
      'SIEM Operations: Splunk Search Processing Language (SPL), Elastic/Kibana, rule creation, log correlation, alert dashboards',
      'MITRE ATT&CK Framework: Mapping attacks from Initial Access to Impact',
    ],
    commands: ['Splunk SPL: index=security event_id=4625 | stats count by src_ip', 'Kibana KQL queries'],
    goal: 'Analyze suspicious activity, detect brute-force attempts in SIEM, and write professional incident triage reports.',
  },
  {
    id: 'phase-8',
    phaseNumber: 8,
    title: 'Incident Response Lifecycle & Playbooks',
    duration: '1–2 Weeks',
    month: 'November',
    icon: 'flame-outline',
    color: '#ff3b5c',
    badge: 'PRACTICE',
    summary: 'NIST & SANS Incident Response lifecycles and real-world attack handling playbooks.',
    topics: [
      'Incident Response 6 Steps: Preparation → Detection → Analysis → Containment → Eradication → Recovery → Lessons Learned',
      'Playbook 1: Investigating Suspicious Login & Unauthorized Account Access',
      'Playbook 2: Phishing Email Analysis (Header inspection, malicious attachments, domain spoofing)',
      'Playbook 3: Malware Alert & Host Isolation',
      'Playbook 4: Distributed Denial of Service (DDoS) Mitigation',
    ],
    goal: 'Walk through incident response scenarios step-by-step during technical job interviews.',
  },
  {
    id: 'phase-9',
    phaseNumber: 9,
    title: 'Hands-on Labs & CTF Practice',
    duration: 'Ongoing',
    month: 'November',
    icon: 'flag-outline',
    color: '#f97316',
    badge: 'HANDS-ON',
    summary: 'Intensive practice in legal cybersecurity labs: TryHackMe, PortSwigger, and Hack The Box.',
    topics: [
      'TryHackMe: Complete Pre-Security, Complete Beginner, and SOC Level 1 pathways',
      'PortSwigger Web Security Academy: Server-side and Client-side vulnerability labs',
      'Hack The Box Academy: Linux Fundamentals, Network Enumeration with Nmap, Windows Fundamentals',
      'Lab Documentation Rule: Document every room (Vulnerability, Tool, Command, How it works, Mitigation)',
    ],
    goal: 'Build an impressive TryHackMe top percentile profile and GitHub walkthrough portfolio.',
  },
  {
    id: 'phase-10',
    phaseNumber: 10,
    title: '3 Major Capstone Projects & Job Launch',
    duration: '3–4 Weeks',
    month: 'December',
    icon: 'trophy-outline',
    color: '#00ff9d',
    badge: 'PORTFOLIO & JOB',
    summary: 'Build 3 standout portfolio projects that combine web development with cybersecurity, followed by resume & interviews.',
    topics: [
      'Project 1: SOC Log Analyzer (Python + Regex + Interactive Terminal / Web Dashboard)',
      'Project 2: Automated Lab Vulnerability Scanner (Python port & service audit engine)',
      'Project 3: Security Monitoring Dashboard (Python/FastAPI + React/Next.js realtime security event viewer)',
      'Resume & LinkedIn: Highlight SOC skills, TryHackMe badge, GitHub repositories, and certifications',
      'Job Applications: 2–5 targeted applications daily + Technical & Behavioral interview rounds',
    ],
    goal: 'Land a Cyber Security Analyst / SOC Analyst job by December 2026! 🎉',
  },
];

export const FIRST_7_DAYS_PLAN: DayGuideItem[] = [
  {
    day: 1,
    title: 'Computer & Hardware Basics',
    subtitle: 'Understand OS, CPU, RAM, Storage, and Processes',
    theory: [
      'What is an Operating System and kernel?',
      'How RAM (volatile) vs Storage (non-volatile) works',
      'What is a Process and how it runs in memory',
      'Difference between Windows Services and Linux Daemons',
    ],
    commands: ['Task Manager (inspect CPU & Memory)', 'services.msc (Windows Services)', 'cmd: tasklist'],
    practiceLab: 'Open Task Manager, find high-memory processes, and inspect background system services.',
    keyTakeaway: 'Programs in execution become processes that allocate CPU cycles and memory spaces.',
  },
  {
    day: 2,
    title: 'Internet & Client-Server Architecture',
    subtitle: 'Learn Client, Server, Domains, and IP Routing',
    theory: [
      'What is the Internet and global packet routing?',
      'Client vs Server roles in network communication',
      'What is a Domain Name vs IP address?',
      'How web browsers send requests to web servers',
    ],
    commands: ['ping google.com', 'nslookup google.com', 'tracert 8.8.8.8'],
    practiceLab: 'Run ping and tracert to see network hops between your computer and Google DNS.',
    keyTakeaway: 'Internet is a mesh of interconnected networks where domain names resolve to IP addresses.',
  },
  {
    day: 3,
    title: 'IP Address & Subnetting Basics',
    subtitle: 'Master IPv4, Public vs Private IPs, and Localhost',
    theory: [
      'IPv4 structure: 32 bits, 4 octets (e.g. 192.168.1.1)',
      'Private IP ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16',
      'Public IPs (internet-routable) vs Private IPs (NAT)',
      'Loopback address: 127.0.0.1 (localhost)',
    ],
    commands: ['ipconfig /all (Windows)', 'ip addr (Linux)', 'ping 127.0.0.1'],
    practiceLab: 'Find your Private IP and Default Gateway using ipconfig, then verify localhost loopback.',
    keyTakeaway: 'Private IPs operate within local networks, while NAT routers map them to public IPs.',
  },
  {
    day: 4,
    title: 'DNS (Domain Name System) Deep Dive',
    subtitle: 'Understand how google.com resolves to an IP address',
    theory: [
      'DNS as the phonebook of the Internet',
      'DNS hierarchy: Root servers → TLD servers (.com) → Authoritative nameservers',
      'Recursive DNS resolvers (e.g. 8.8.8.8, 1.1.1.1)',
      'DNS Record types: A (IPv4), AAAA (IPv6), CNAME, MX, TXT',
    ],
    commands: ['nslookup -type=A google.com', 'nslookup -type=MX google.com', 'ipconfig /flushdns'],
    practiceLab: 'Query different DNS record types using nslookup and inspect your local DNS cache.',
    keyTakeaway: 'Computers communicate using numeric IPs; DNS converts human names to IP addresses.',
  },
  {
    day: 5,
    title: 'Ports & Common Network Services',
    subtitle: 'Learn Port Numbers and Protocol associations',
    theory: [
      'What is a Port? (Virtual communication endpoint, 0–65535)',
      'Port 22 → SSH (Secure Shell)',
      'Port 53 → DNS (Name Resolution)',
      'Port 80 → HTTP (Unencrypted Web)',
      'Port 443 → HTTPS (Encrypted Web / TLS)',
      'Port 3389 → RDP (Remote Desktop)',
    ],
    commands: ['netstat -ano (view open ports on Windows)', 'curl -I http://google.com:80'],
    practiceLab: 'Inspect active listening ports on your computer using netstat and identify listening web/system services.',
    keyTakeaway: 'IP gets traffic to the computer; Port gets traffic to the specific application/service.',
  },
  {
    day: 6,
    title: 'HTTP & HTTPS Protocol Dissection',
    subtitle: 'Master Request/Response, Headers, Status Codes, and Cookies',
    theory: [
      'HTTP Request structure: Method (GET, POST), Path, Headers, Body',
      'HTTP Response structure: Status Code (200 OK, 403 Forbidden, 404 Not Found, 500 Error), Headers, Body',
      'HTTP vs HTTPS: TLS/SSL encryption and certificate validation',
      'Cookies & Sessions: How stateless HTTP maintains login state',
    ],
    commands: ['curl -v https://httpbin.org/get', 'Browser Developer Tools (F12 → Network Tab)'],
    practiceLab: 'Open browser DevTools (F12), click Network tab, refresh a page, and inspect request/response headers.',
    keyTakeaway: 'Web security revolves around understanding HTTP request parameters, cookies, and responses.',
  },
  {
    day: 7,
    title: 'Phase 1 Assessment & Self-Test',
    subtitle: '10-Question Self-Check Quiz before moving to Phase 2',
    theory: [
      '1. IP address kya hai aur MAC address se kaise alag hai?',
      '2. DNS ka primary role kya hai?',
      '3. Port kya hota hai aur IP ke sath kaise work karta hai?',
      '4. TCP aur UDP mein fundamental difference kya hai?',
      '5. HTTP aur HTTPS mein kya security difference hai?',
      '6. Client aur Server architecture explain karein.',
      '7. Router aur Firewall ka kya role hai?',
      '8. Port 443 kis protocol ke liye use hota hai?',
      '9. Browser mein google.com type karne par end-to-end kya hota hai?',
      '10. Private IP aur Public IP mein kya antar hai?',
    ],
    commands: ['Review all notes', 'Test TryHackMe Pre-Security room'],
    practiceLab: 'Answer all 10 questions without looking at notes. If you score 8/10+, proceed to Phase 2!',
    keyTakeaway: 'Strong fundamentals are the secret weapon of top security engineers and SOC analysts.',
  },
];
