import { Platform } from 'react-native';
import {
  INITIAL_TASKS,
  INITIAL_JOBS,
  INITIAL_SKILLS,
  INITIAL_STUDY_SESSIONS,
  INITIAL_SETTINGS,
} from '../constants/sampleData';

// Types
export interface TaskItem {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  status: 'pending' | 'completed' | 'overdue';
  recurring: 'none' | 'daily' | 'weekdays' | 'weekly' | 'custom';
  reminder_minutes: number;
  created_at: string;
  completed_at: string | null;
}

export interface JobItem {
  id: string;
  company: string;
  role: string;
  url: string;
  location: string;
  work_type: 'Remote' | 'Hybrid' | 'On-site';
  salary: string;
  date_applied: string;
  status: 'Wishlist' | 'Applied' | 'Assessment' | 'Interview' | 'Selected' | 'Rejected';
  interview_date: string | null;
  recruiter: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface StudySessionItem {
  id: string;
  topic: string;
  category: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  date: string;
  notes: string;
  created_at: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  progress: number;
}

export interface SettingsItem {
  id: string;
  goal_title?: string;
  target_role: string;
  target_date: string;
  target_package?: string;
  daily_study_target_hours: number;
  default_reminder_minutes: number;
  notifications_enabled: number;
  dark_mode: number;
  monthly_report_enabled: number;
}

// In-Memory & LocalStorage Sync Cache
class StorageEngine {
  private isInitialized = false;
  private tasks: TaskItem[] = [];
  private jobs: JobItem[] = [];
  private studySessions: StudySessionItem[] = [];
  private skills: SkillItem[] = [];
  private settings: SettingsItem = { ...INITIAL_SETTINGS };

  public async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        const storedTasks = window.localStorage.getItem('@cybersec_tasks');
        const storedJobs = window.localStorage.getItem('@cybersec_jobs');
        const storedSessions = window.localStorage.getItem('@cybersec_study_sessions');
        const storedSkills = window.localStorage.getItem('@cybersec_skills');
        const storedSettings = window.localStorage.getItem('@cybersec_settings');

        this.tasks = storedTasks ? JSON.parse(storedTasks) : [...INITIAL_TASKS];
        this.jobs = storedJobs ? JSON.parse(storedJobs) : [...INITIAL_JOBS];
        this.studySessions = storedSessions ? JSON.parse(storedSessions) : [...INITIAL_STUDY_SESSIONS];
        this.skills = storedSkills ? JSON.parse(storedSkills) : [...INITIAL_SKILLS];
        this.settings = storedSettings ? JSON.parse(storedSettings) : { ...INITIAL_SETTINGS };
        
        this.persistWeb();
      } else {
        // Fallback or Native in-memory seed
        this.tasks = [...INITIAL_TASKS];
        this.jobs = [...INITIAL_JOBS];
        this.studySessions = [...INITIAL_STUDY_SESSIONS];
        this.skills = [...INITIAL_SKILLS];
        this.settings = { ...INITIAL_SETTINGS };
      }
    } catch (e) {
      console.warn('Storage init warning:', e);
      this.tasks = [...INITIAL_TASKS];
      this.jobs = [...INITIAL_JOBS];
      this.studySessions = [...INITIAL_STUDY_SESSIONS];
      this.skills = [...INITIAL_SKILLS];
      this.settings = { ...INITIAL_SETTINGS };
    }

    this.isInitialized = true;
  }

  private persistWeb() {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('@cybersec_tasks', JSON.stringify(this.tasks));
        window.localStorage.setItem('@cybersec_jobs', JSON.stringify(this.jobs));
        window.localStorage.setItem('@cybersec_study_sessions', JSON.stringify(this.studySessions));
        window.localStorage.setItem('@cybersec_skills', JSON.stringify(this.skills));
        window.localStorage.setItem('@cybersec_settings', JSON.stringify(this.settings));
      } catch (err) {
        console.error('Failed to persist to web storage:', err);
      }
    }
  }

  // Tasks
  public async getTasks(): Promise<TaskItem[]> {
    await this.init();
    return [...this.tasks];
  }

  public async saveTask(task: TaskItem): Promise<TaskItem> {
    await this.init();
    const index = this.tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      this.tasks[index] = { ...task };
    } else {
      this.tasks.unshift({ ...task });
    }
    this.persistWeb();
    return task;
  }

  public async deleteTask(id: string): Promise<boolean> {
    await this.init();
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.persistWeb();
    return true;
  }

  // Jobs
  public async getJobs(): Promise<JobItem[]> {
    await this.init();
    return [...this.jobs];
  }

  public async saveJob(job: JobItem): Promise<JobItem> {
    await this.init();
    const index = this.jobs.findIndex((j) => j.id === job.id);
    if (index >= 0) {
      this.jobs[index] = { ...job, updated_at: new Date().toISOString() };
    } else {
      this.jobs.unshift({
        ...job,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
    this.persistWeb();
    return job;
  }

  public async deleteJob(id: string): Promise<boolean> {
    await this.init();
    this.jobs = this.jobs.filter((j) => j.id !== id);
    this.persistWeb();
    return true;
  }

  // Study Sessions
  public async getStudySessions(): Promise<StudySessionItem[]> {
    await this.init();
    return [...this.studySessions];
  }

  public async saveStudySession(session: StudySessionItem): Promise<StudySessionItem> {
    await this.init();
    this.studySessions.unshift({ ...session });
    this.persistWeb();
    return session;
  }

  public async deleteStudySession(id: string): Promise<boolean> {
    await this.init();
    this.studySessions = this.studySessions.filter((s) => s.id !== id);
    this.persistWeb();
    return true;
  }

  // Skills
  public async getSkills(): Promise<SkillItem[]> {
    await this.init();
    return [...this.skills];
  }

  public async updateSkill(id: string, progress: number): Promise<void> {
    await this.init();
    const skill = this.skills.find((s) => s.id === id);
    if (skill) {
      skill.progress = Math.min(100, Math.max(0, progress));
      this.persistWeb();
    }
  }

  // Settings
  public async getSettings(): Promise<SettingsItem> {
    await this.init();
    return { ...this.settings };
  }

  public async updateSettings(updates: Partial<SettingsItem>): Promise<SettingsItem> {
    await this.init();
    this.settings = { ...this.settings, ...updates };
    this.persistWeb();
    return { ...this.settings };
  }

  // Export / Reset
  public async exportAllData(): Promise<string> {
    await this.init();
    return JSON.stringify(
      {
        tasks: this.tasks,
        jobs: this.jobs,
        studySessions: this.studySessions,
        skills: this.skills,
        settings: this.settings,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
  }

  public async importData(jsonString: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonString);
      if (data.tasks) this.tasks = data.tasks;
      if (data.jobs) this.jobs = data.jobs;
      if (data.studySessions) this.studySessions = data.studySessions;
      if (data.skills) this.skills = data.skills;
      if (data.settings) this.settings = data.settings;
      this.persistWeb();
      return true;
    } catch {
      return false;
    }
  }

  public async resetToSeedData(): Promise<void> {
    this.tasks = [...INITIAL_TASKS];
    this.jobs = [...INITIAL_JOBS];
    this.studySessions = [...INITIAL_STUDY_SESSIONS];
    this.skills = [...INITIAL_SKILLS];
    this.settings = { ...INITIAL_SETTINGS };
    this.persistWeb();
  }
}

export const db = new StorageEngine();
