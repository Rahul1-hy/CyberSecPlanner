import { Platform, Alert } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { TaskItem } from '../database/db';

// Check if running inside Expo Go (where native push/local notifications throw in SDK 53+)
const isExpoGo =
  Constants?.appOwnership === 'expo' ||
  Constants?.executionEnvironment === ExecutionEnvironment.StoreClient;

let cachedNotificationsModule: typeof import('expo-notifications') | null = null;
let handlerInitialized = false;

function getNotifications(): typeof import('expo-notifications') | null {
  if (isExpoGo || Platform.OS === 'web') {
    return null;
  }
  if (cachedNotificationsModule) {
    return cachedNotificationsModule;
  }
  try {
    // Dynamically require so Expo Go does not throw at module import time
    cachedNotificationsModule = require('expo-notifications');
    if (cachedNotificationsModule && !handlerInitialized) {
      cachedNotificationsModule.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      handlerInitialized = true;
    }
    return cachedNotificationsModule;
  } catch (err) {
    console.warn('[NotificationService] Native notifications not available in current environment:', err);
    return null;
  }
}

// Map of task ID to notification identifier
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

    if (isExpoGo) {
      // In Expo Go SDK 53+, remote/native push notifications are disabled
      return false;
    }

    const Notifications = getNotifications();
    if (!Notifications) return false;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('careerpilot_reminders', {
        name: 'CareerPilot Task Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2dd4bf',
        sound: 'default',
        enableVibrate: true,
      });
    }

    return finalStatus === 'granted';
  } catch (err) {
    console.warn('[NotificationService] Error requesting notification permission:', err);
    return false;
  }
}

export async function scheduleTaskReminder(task: TaskItem): Promise<string | null> {
  try {
    if (task.reminder_minutes === undefined || task.reminder_minutes === null) {
      return null;
    }

    const [year, month, day] = (task.date || '').split('-').map(Number);
    const [hours, minutes] = (task.start_time || '09:00').split(':').map(Number);

    if (!year || !month || !day || isNaN(hours) || isNaN(minutes)) {
      return null;
    }

    const taskDate = new Date(year, month - 1, day, hours, minutes);
    const reminderDate = new Date(taskDate.getTime() - (task.reminder_minutes || 0) * 60 * 1000);
    const now = new Date();

    const reminderTitle = `🚀 CareerPilot Reminder: ${task.title}`;
    const reminderBody =
      task.reminder_minutes === 0
        ? `Task "${task.title}" is starting now! [${task.category}]`
        : `Upcoming Task: "${task.title}" starts in ${task.reminder_minutes} minutes! [${task.category}]`;

    // Web fallback
    if (Platform.OS === 'web') {
      await requestNotificationPermissions();
      if (reminderDate > now) {
        const delayMs = reminderDate.getTime() - now.getTime();
        if (delayMs > 0 && delayMs < 2147483647) {
          const timeoutId = setTimeout(() => {
            if (typeof window !== 'undefined' && window.Notification && window.Notification.permission === 'granted') {
              new window.Notification(reminderTitle, {
                body: reminderBody,
                icon: '/favicon.png',
              });
            }
          }, delayMs);
          scheduledNotificationIds[task.id] = String(timeoutId);
        }
        return `web-reminder-${task.id}`;
      } else {
        if (typeof window !== 'undefined' && window.Notification && window.Notification.permission === 'granted') {
          new window.Notification(`🔔 Task Saved: ${task.title}`, {
            body: `Reminder active for ${task.date} at ${task.start_time}`,
            icon: '/favicon.png',
          });
        }
        return `web-reminder-now-${task.id}`;
      }
    }

    // Expo Go fallback
    if (isExpoGo) {
      // In Expo Go, native notifications cannot be scheduled
      return `expogo-mock-${task.id}`;
    }

    const Notifications = getNotifications();
    if (!Notifications) return null;

    // Native Standalone / Development Build
    await requestNotificationPermissions();

    if (reminderDate > now) {
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
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🔔 Task Saved: ${task.title}`,
          body: `Reminder active for ${task.date} at ${task.start_time}`,
          sound: 'default',
        },
        trigger: null,
      });
      scheduledNotificationIds[task.id] = identifier;
      return identifier;
    }
  } catch (err) {
    console.warn('[NotificationService] Could not schedule notification:', err);
    return null;
  }
}

export async function cancelTaskReminder(taskId: string): Promise<void> {
  try {
    const notifId = scheduledNotificationIds[taskId];
    if (notifId) {
      if (Platform.OS !== 'web' && !isExpoGo) {
        const Notifications = getNotifications();
        if (Notifications) {
          await Notifications.cancelScheduledNotificationAsync(notifId);
        }
      } else if (Platform.OS === 'web') {
        clearTimeout(Number(notifId));
      }
      delete scheduledNotificationIds[taskId];
    }
  } catch (err) {
    console.warn('[NotificationService] Could not cancel notification:', err);
  }
}

export async function sendInstantTestNotification(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      const granted = await requestNotificationPermissions();
      if (granted && typeof window !== 'undefined' && window.Notification) {
        new window.Notification('🚀 CareerPilot Alert', {
          body: 'Local notification test successful! Your CareerPilot reminders are working perfectly.',
          icon: '/favicon.png',
        });
      }
      return;
    }

    if (isExpoGo) {
      Alert.alert(
        '🚀 Notification Engine Notice',
        'Push & background notification modules require a Standalone or Development Build on Android (SDK 53+). When installed via APK/EAS, notifications will fire natively.'
      );
      return;
    }

    const Notifications = getNotifications();
    if (!Notifications) return;

    const granted = await requestNotificationPermissions();
    if (!granted) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚀 CareerPilot Alert',
        body: 'Local notification test successful! Your CareerPilot reminders are working perfectly.',
        sound: 'default',
      },
      trigger: null,
    });
  } catch (err) {
    console.warn('[NotificationService] Could not send test notification:', err);
  }
}
