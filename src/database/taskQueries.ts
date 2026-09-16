import { db, TaskItem } from './db';
import { getTodayString, isDateOverdue } from '../utils/dateUtils';
import { scheduleTaskReminder, cancelTaskReminder } from '../notifications/notificationService';

export async function getAllTasks(): Promise<TaskItem[]> {
  const tasks = await db.getTasks();
  // Auto-flag overdue tasks
  return tasks.map((t) => {
    if (t.status === 'pending' && isDateOverdue(t.date, t.status)) {
      return { ...t, status: 'overdue' as const };
    }
    return t;
  });
}

export async function getTodayTasks(): Promise<TaskItem[]> {
  const today = getTodayString();
  const tasks = await getAllTasks();
  return tasks.filter((t) => t.date === today);
}

export async function getTasksByDate(date: string): Promise<TaskItem[]> {
  const tasks = await getAllTasks();
  return tasks.filter((t) => t.date === date);
}

export async function getTaskById(id: string): Promise<TaskItem | undefined> {
  const tasks = await getAllTasks();
  return tasks.find((t) => t.id === id);
}

export async function createTask(
  taskData: Omit<TaskItem, 'id' | 'created_at' | 'completed_at'>
): Promise<TaskItem> {
  const newTask: TaskItem = {
    ...taskData,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    created_at: new Date().toISOString(),
    completed_at: taskData.status === 'completed' ? new Date().toISOString() : null,
  };

  const saved = await db.saveTask(newTask);

  if (saved.reminder_minutes > 0 && saved.status !== 'completed') {
    await scheduleTaskReminder(saved);
  }

  return saved;
}

export async function updateTask(task: TaskItem): Promise<TaskItem> {
  // Cancel old reminder and schedule new if needed
  await cancelTaskReminder(task.id);

  if (task.reminder_minutes > 0 && task.status !== 'completed') {
    await scheduleTaskReminder(task);
  }

  return await db.saveTask(task);
}

export async function toggleTaskComplete(id: string): Promise<TaskItem | null> {
  const task = await getTaskById(id);
  if (!task) return null;

  const isNowCompleted = task.status !== 'completed';
  const updatedTask: TaskItem = {
    ...task,
    status: isNowCompleted ? 'completed' : 'pending',
    completed_at: isNowCompleted ? new Date().toISOString() : null,
  };

  if (isNowCompleted) {
    await cancelTaskReminder(id);
  } else if (updatedTask.reminder_minutes > 0) {
    await scheduleTaskReminder(updatedTask);
  }

  return await db.saveTask(updatedTask);
}

export async function duplicateTask(id: string): Promise<TaskItem | null> {
  const task = await getTaskById(id);
  if (!task) return null;

  const duplicated = await createTask({
    title: `${task.title} (Copy)`,
    description: task.description,
    date: getTodayString(),
    start_time: task.start_time,
    end_time: task.end_time,
    priority: task.priority,
    category: task.category,
    status: 'pending',
    recurring: 'none',
    reminder_minutes: task.reminder_minutes,
  });

  return duplicated;
}

export async function deleteTask(id: string): Promise<boolean> {
  await cancelTaskReminder(id);
  return await db.deleteTask(id);
}

export async function getTodayTaskStats(): Promise<{
  total: number;
  completed: number;
  remaining: number;
  percentage: number;
}> {
  const todayTasks = await getTodayTasks();
  const total = todayTasks.length;
  const completed = todayTasks.filter((t) => t.status === 'completed').length;
  const remaining = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, remaining, percentage };
}

export async function generateDailyRoutineTasks(targetDateStr?: string, presetId?: string): Promise<TaskItem[]> {
  const { MASTER_ROUTINE, ROADMAP_ROUTINE_PRESETS } = await import('../constants/routineData');
  const dateToUse = targetDateStr || getTodayString();
  
  // Find matching preset or default to Day 1 / Phase 1
  let preset = ROADMAP_ROUTINE_PRESETS.find((p) => p.id === presetId);
  if (!preset) {
    const [y, m, d] = dateToUse.split('-').map(Number);
    const targetDateObj = new Date(y, m - 1, d);
    const dayOfWeek = targetDateObj.getDay(); // 0 (Sun) - 6 (Sat)
    // Map day of week to day-1..day-7 presets
    const dayPresetMap: { [key: number]: string } = {
      1: 'day-1',
      2: 'day-2',
      3: 'day-3',
      4: 'day-4',
      5: 'day-5',
      6: 'day-6',
      0: 'day-7',
    };
    const targetPresetId = dayPresetMap[dayOfWeek] || 'day-1';
    preset = ROADMAP_ROUTINE_PRESETS.find((p) => p.id === targetPresetId) || ROADMAP_ROUTINE_PRESETS[0];
  }

  const existingTasks = await getTasksByDate(dateToUse);
  const createdList: TaskItem[] = [];

  for (const slot of MASTER_ROUTINE) {
    // Check if task already exists for this exact time
    const exists = existingTasks.some((t) => t.title === slot.title || t.start_time === slot.startTime);
    if (exists) continue;

    let dynamicTitle = slot.title;
    let dynamicDesc = slot.description;
    let dynamicCategory = slot.category;

    if (slot.type === 'cyber-theory') {
      dynamicTitle = `💻 Cyber Theory: ${preset.theoryTopic}`;
      dynamicDesc = `[${preset.title}] ${preset.theorySubtopics.join(', ')}. Goal: ${preset.theoryGoal}`;
      dynamicCategory = preset.category as any;
    } else if (slot.type === 'hands-on-lab') {
      dynamicTitle = `🧪 Hands-on Lab: ${preset.handsOnTopic}`;
      dynamicDesc = `[${preset.title}] ${preset.handsOnLab} | Commands: ${preset.handsOnCommands.join(', ')}`;
      dynamicCategory = 'CTF';
    } else if (slot.type === 'practical-cyber') {
      dynamicTitle = `💻 Practical Lab: ${preset.practicalTopic}`;
      dynamicDesc = `[${preset.title}] ${preset.practicalDetails}`;
      dynamicCategory = 'SOC';
    } else if (slot.type === 'job-prep') {
      dynamicTitle = `💼 Job Preparation & Applications`;
      dynamicDesc = `[${preset.title}] ${preset.jobPrepDetails}`;
      dynamicCategory = 'Interview';
    } else if (slot.type === 'revision') {
      dynamicTitle = `🧠 Q&A & Revision: ${preset.revisionTopic}`;
      dynamicDesc = `[${preset.title}] Questions: ${preset.revisionQuestions.slice(0, 2).join(' | ')}`;
      dynamicCategory = 'Revision';
    }

    const newTask = await createTask({
      title: dynamicTitle,
      description: dynamicDesc,
      date: dateToUse,
      start_time: slot.startTime,
      end_time: slot.endTime,
      priority: slot.priority,
      category: dynamicCategory as any,
      status: 'pending',
      recurring: 'daily',
      reminder_minutes: slot.reminderMinutes,
    });

    createdList.push(newTask);
  }

  return createdList;
}
