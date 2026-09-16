import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { TaskItem } from '../database/db';

// Configure notification behavior for foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Map of task ID to Expo notification identifier
const scheduledNotificationIds: { [taskId: string]: string } = {};

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        const permission = await window.Notification.requestPermission();
        return permission === 'granted';
      }
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('cybersec_reminders', {
        name: 'CyberSec Task Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#00ff9d',
        sound: 'default',
        enableVibrate: true,
      });
    }

    return finalStatus === 'granted';
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return false;
  }
}

export async function scheduleTaskReminder(task: TaskItem): Promise<string | null> {
  try {
    if (task.reminder_minutes === undefined || task.reminder_minutes === null) {
      return null;
    }

    await requestNotificationPermissions();

    const [year, month, day] = (task.date || '').split('-').map(Number);
    const [hours, minutes] = (task.start_time || '09:00').split(':').map(Number);

    if (!year || !month || !day || isNaN(hours) || isNaN(minutes)) {
      return null;
    }

    const taskDate = new Date(year, month - 1, day, hours, minutes);
    const reminderDate = new Date(taskDate.getTime() - (task.reminder_minutes || 0) * 60 * 1000);
    const now = new Date();

    const reminderTitle = `🔐 CyberSec Reminder: ${task.title}`;
    const reminderBody = task.reminder_minutes === 0
      ? `Task "${task.title}" is starting now! [${task.category}]`
      : `Upcoming Task: "${task.title}" starts in ${task.reminder_minutes} minutes! [${task.category}]`;

    // If scheduled time is in the future
    if (reminderDate > now) {
      if (Platform.OS !== 'web') {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: reminderTitle,
            body: reminderBody,
            sound: 'default',
            data: { taskId: task.id, category: task.category },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: reminderDate,
          },
        });

        scheduledNotificationIds[task.id] = identifier;
        return identifier;
      } else {
        // Web timeout
        const delayMs = reminderDate.getTime() - now.getTime();
        if (delayMs > 0 && delayMs < 2147483647) {
          const timeoutId = setTimeout(() => {
            if (window.Notification && window.Notification.permission === 'granted') {
              new window.Notification(reminderTitle, {
                body: reminderBody,
                icon: '/favicon.png',
              });
            }
          }, delayMs);
          scheduledNotificationIds[task.id] = String(timeoutId);
        }
        return `web-reminder-${task.id}`;
      }
    } else {
      // If task is scheduled for today or imminent, trigger instant confirmation notification
      if (Platform.OS !== 'web') {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: `🔔 Task Saved: ${task.title}`,
            body: `Reminder active for ${task.date} at ${task.start_time}`,
            sound: 'default',
          },
          trigger: null, // Send immediately
        });
        scheduledNotificationIds[task.id] = identifier;
        return identifier;
      }
    }

    return null;
  } catch (err) {
    console.warn('Could not schedule notification:', err);
    return null;
  }
}

export async function cancelTaskReminder(taskId: string): Promise<void> {
  try {
    const notifId = scheduledNotificationIds[taskId];
    if (notifId) {
      if (Platform.OS !== 'web') {
        await Notifications.cancelScheduledNotificationAsync(notifId);
      } else {
        clearTimeout(Number(notifId));
      }
      delete scheduledNotificationIds[taskId];
    }
  } catch (err) {
    console.warn('Could not cancel notification:', err);
  }
}

export async function sendInstantTestNotification(): Promise<void> {
  try {
    const granted = await requestNotificationPermissions();
    if (!granted) return;

    if (Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔐 CyberSec Planner Alert',
          body: 'Local notification test successful! Your cyber study reminders are working perfectly.',
          sound: 'default',
        },
        trigger: null,
      });
    } else if (typeof window !== 'undefined' && 'Notification' in window) {
      if (window.Notification.permission === 'granted') {
        new window.Notification('🔐 CyberSec Planner Alert', {
          body: 'Local notification test successful! Your cyber study reminders are working perfectly.',
          icon: '/favicon.png',
        });
      }
    }
  } catch (err) {
    console.warn('Could not send test notification:', err);
  }
}
