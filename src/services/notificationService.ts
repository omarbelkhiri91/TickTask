import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// طلب إذن الإشعارات
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('tasks', {
        name: 'Task Reminders',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    return true;
  } catch (error) {
    console.log('Error requesting permissions:', error);
    return false;
  }
}

// جدولة تذكير
export async function scheduleReminderAfter(
  taskId: string,
  taskTitle: string,
  seconds: number
): Promise<string | null> {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⏰ تذكير بمهمة',
        body: taskTitle,
        data: { taskId },
      },
      trigger: {
        seconds: seconds,
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });
    return id;
  } catch (error) {
    console.log('Error scheduling:', error);
    return null;
  }
}

// إلغاء تذكير
export async function cancelTaskReminder(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.log('Error canceling:', error);
  }
}

// إرسال إشعار فوري
export async function sendInstantNotification(title: string, body: string): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  } catch (error) {
    console.log('Error sending:', error);
  }
}
